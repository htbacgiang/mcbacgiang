import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import Course from "../../../models/Course";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await db.connectDb();

      const { year, month } = req.query;
      
      if (!year || !month) {
        return res.status(400).json({
          success: false,
          message: "Năm và tháng là bắt buộc",
        });
      }

      // Calculate date range for the month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // Get all class schedules that have sessions in the requested month
      // This includes ongoing courses that started before the month but have sessions in the month
      const classSchedules = await ClassSchedule.find({
        isActive: true,
        $or: [
          // Class schedules that start in the requested month
          { startDate: { $gte: startDate, $lte: endDate } },
          // Class schedules that have sessions in the requested month (ongoing courses)
          {
            "classSessions.date": {
              $gte: startDate.toISOString().split('T')[0],
              $lte: endDate.toISOString().split('T')[0]
            }
          }
        ]
      })
        .populate('courseId', 'title subtitle image level slug description')
        .sort({ startDate: 1 });

      console.log(`Found ${classSchedules.length} class schedules for ${year}-${month}`);


      // Group by date - now we'll process individual class sessions
      const calendarData = {};
      classSchedules.forEach(schedule => {
        // Process each class session
        if (schedule.classSessions && schedule.classSessions.length > 0) {
          schedule.classSessions.forEach(session => {
            // Parse date correctly to avoid timezone issues
            const sessionDate = new Date(session.date + 'T00:00:00');
            const sessionMonth = sessionDate.getMonth() + 1;
            const sessionYear = sessionDate.getFullYear();
            
            // Only include sessions for the requested month
            if (sessionMonth === parseInt(month) && sessionYear === parseInt(year)) {
              const dateKey = session.date;
              if (!calendarData[dateKey]) {
                calendarData[dateKey] = [];
              }
              
              const sessionData = {
                _id: session._id,
                sessionNumber: session.sessionNumber,
                title: session.title || `Buổi ${session.sessionNumber}`,
                className: schedule.className || 'N/A', // Use actual class name
                startTime: session.startTime,
                endTime: session.endTime,
                location: session.location,
                status: session.status || schedule.status,
                currentStudents: session.currentStudents || schedule.currentStudents,
                maxStudents: session.maxStudents || schedule.maxStudents,
                instructor: session.instructor || schedule.instructor,
                totalSessions: schedule.classSessions.length,
                courseId: schedule.courseId,
                classScheduleId: schedule._id, // Add class schedule ID
                schedule: `${session.startTime} - ${session.endTime}`,
                dayOfWeek: session.dayOfWeek || schedule.dayOfWeek
              };
              
              calendarData[dateKey].push(sessionData);
            }
          });
        } else {
          // Fallback to original logic if no classSessions
          // Only include if the schedule start date is in the requested month
          const scheduleStartDate = new Date(schedule.startDate);
          const scheduleMonth = scheduleStartDate.getMonth() + 1;
          const scheduleYear = scheduleStartDate.getFullYear();
          
          if (scheduleMonth === parseInt(month) && scheduleYear === parseInt(year)) {
            const dateKey = schedule.startDate.toISOString().split('T')[0];
            if (!calendarData[dateKey]) {
              calendarData[dateKey] = [];
            }
            calendarData[dateKey].push(schedule);
          }
        }
      });

      // Get month statistics - count actual sessions and classes
      let totalSessions = 0;
      const uniqueClassSchedules = new Set();
      const statusCounts = {
        "Sắp khai giảng": 0,
        "Đang tuyển sinh": 0,
        "Đã đầy": 0,
        "Đã kết thúc": 0,
        "Tạm hoãn": 0,
      };

      // Count sessions, classes and status
      Object.values(calendarData).forEach(daySessions => {
        daySessions.forEach(session => {
          totalSessions++;
          if (session.classScheduleId) {
            uniqueClassSchedules.add(session.classScheduleId);
          } else if (session._id) {
            // For fallback sessions without classScheduleId
            uniqueClassSchedules.add(session._id);
          }
          if (session.status) {
            statusCounts[session.status]++;
          }
        });
      });

      const totalClasses = uniqueClassSchedules.size;
      
      console.log(`Calendar data summary for ${year}-${month}:`);
      console.log(`- Total sessions: ${totalSessions}`);
      console.log(`- Unique classes: ${totalClasses}`);
      console.log(`- Days with sessions: ${Object.keys(calendarData).length}`);

      // Get total capacity from class schedules that have sessions in the current month
      console.log("Fetching total capacity from class schedules in current month...");
      let totalCapacity = 0;
      try {
        // Get unique class schedule IDs that have sessions in the current month
        const classScheduleIds = new Set();
        Object.values(calendarData).forEach(daySessions => {
          daySessions.forEach(session => {
            if (session.classScheduleId) {
              classScheduleIds.add(session.classScheduleId);
            } else if (session._id) {
              // For fallback sessions without classScheduleId
              classScheduleIds.add(session._id);
            }
          });
        });

        // Calculate total capacity from these class schedules
        if (classScheduleIds.size > 0) {
          const capacityResult = await ClassSchedule.aggregate([
            {
              $match: {
                _id: { $in: Array.from(classScheduleIds) },
                isActive: true,
                isDeleted: { $ne: true }
              }
            },
            {
              $group: {
                _id: null,
                totalCapacity: { $sum: "$maxStudents" }
              }
            }
          ]);
          
          totalCapacity = capacityResult.length > 0 ? capacityResult[0].totalCapacity : 0;
        }
        
        console.log("Total capacity from class schedules in current month:", totalCapacity);
      } catch (capacityError) {
        console.error("Error fetching total capacity:", capacityError);
        totalCapacity = 0;
      }

      // Get actual student count from Student collection
      console.log("Fetching student count...");
      let totalStudents = 0;
      try {
        // Dynamic import to avoid potential issues
        const Student = (await import("../../../models/Student")).default;
        
        // Try to get student count directly
        totalStudents = await Student.countDocuments({
          status: { $in: ["Đang học", "Tạm nghỉ"] } // Only count active students
        });
        console.log("Total students found:", totalStudents);
        
        // If no students found, try counting all students
        if (totalStudents === 0) {
          const allStudents = await Student.countDocuments({});
          console.log("All students count:", allStudents);
          totalStudents = allStudents; // Use all students as fallback
        }
      } catch (studentError) {
        console.error("Error fetching student count:", studentError);
        // Fallback to 0 if there's an error
        totalStudents = 0;
      }

      const stats = {
        totalClasses: `${totalSessions}/${totalClasses}`, // Total sessions / Total classes in the month
        totalStudents: totalStudents, // Total active students from Student collection
        totalCapacity: totalCapacity, // Total capacity from actual sessions
        statusCounts,
      };


      res.status(200).json({
        success: true,
        data: {
          calendarData,
          stats,
          monthInfo: {
            year: parseInt(year),
            month: parseInt(month),
            monthName: startDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu lịch khai giảng",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({
      success: false,
      message: `Phương thức ${req.method} không được hỗ trợ`,
    });
  }
}
