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

      // Get all class schedules for the month
      const classSchedules = await ClassSchedule.find({
        startDate: { $gte: startDate, $lte: endDate },
        isActive: true,
      })
        .populate('courseId', 'title subtitle image level slug description')
        .sort({ startDate: 1 });

      // Group by date - only show first session (khai giảng) of each course
      const calendarData = {};
      classSchedules.forEach(schedule => {
        // Process only the first class session (khai giảng)
        if (schedule.classSessions && schedule.classSessions.length > 0) {
          // Find the first session (sessionNumber: 1)
          const firstSession = schedule.classSessions.find(session => session.sessionNumber === 1);
          if (firstSession) {
            // Parse date correctly to avoid timezone issues
            const sessionDate = new Date(firstSession.date + 'T00:00:00');
            // Check if session is within the current month
            if (sessionDate >= startDate && sessionDate <= endDate) {
              const dateKey = firstSession.date; // firstSession.date is already in YYYY-MM-DD format
              if (!calendarData[dateKey]) {
                calendarData[dateKey] = [];
              }
              
              // Create session object with schedule info - this is the opening session
              const openingSessionData = {
                _id: `${schedule._id}_opening`,
                sessionNumber: 1,
                className: schedule.className,
                courseId: schedule.courseId,
                date: firstSession.date,
                dateString: firstSession.dateString,
                dayOfWeek: firstSession.dayOfWeek,
                startTime: firstSession.startTime,
                endTime: firstSession.endTime,
                location: schedule.location || (schedule.locations && schedule.locations.length > 0 ? schedule.locations[0] : ''),
                locations: schedule.locations || (schedule.location ? [schedule.location] : []),
                instructor: schedule.instructor,
                maxStudents: schedule.maxStudents,
                currentStudents: schedule.currentStudents,
                price: schedule.price || 0,
                discountPrice: schedule.discountPrice || 0,
                status: schedule.status,
                description: schedule.description,
                requirements: schedule.requirements,
                benefits: schedule.benefits,
                totalSessions: schedule.totalSessions,
                // Create a display schedule string
                schedule: schedule.schedule || `${firstSession.dayOfWeek}, ${firstSession.startTime} - ${firstSession.endTime}`,
                // Create a display title for opening session
                title: `${schedule.className} - Khai giảng`,
                startDate: firstSession.date ? new Date(firstSession.date + 'T00:00:00').toISOString() : schedule.startDate?.toISOString() || null, // ISO string for ClassScheduleCard
                availableSpots: schedule.maxStudents - schedule.currentStudents,
                discountPercentage: schedule.discountPrice && schedule.price && schedule.price > 0
                  ? Math.round(((schedule.price - schedule.discountPrice) / schedule.price) * 100)
                  : 0
              };
              
              calendarData[dateKey].push(openingSessionData);
            }
          }
        } else {
          // Fallback to original logic if no classSessions
          const dateKey = schedule.startDate.toISOString().split('T')[0];
          if (!calendarData[dateKey]) {
            calendarData[dateKey] = [];
          }
          // Mark as opening session
          const openingSchedule = {
            ...schedule.toObject(),
            title: `${schedule.className} - Khai giảng`
          };
          calendarData[dateKey].push(openingSchedule);
        }
      });

      // Get month statistics - count opening sessions only
      let totalOpeningSessions = 0;
      const statusCounts = {
        "Sắp khai giảng": 0,
        "Đang tuyển sinh": 0,
        "Đã đầy": 0,
        "Đã kết thúc": 0,
        "Tạm hoãn": 0,
      };

      // Count opening sessions and status
      Object.values(calendarData).forEach(daySessions => {
        daySessions.forEach(session => {
          totalOpeningSessions++;
          statusCounts[session.status]++;
        });
      });

      const stats = {
        totalClasses: totalOpeningSessions, // Now represents total opening sessions (khai giảng)
        totalStudents: classSchedules.reduce((sum, schedule) => sum + schedule.currentStudents, 0),
        totalCapacity: classSchedules.reduce((sum, schedule) => sum + schedule.maxStudents, 0),
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
      console.error("Error fetching opening calendar data:", error);
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
