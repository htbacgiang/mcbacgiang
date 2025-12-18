import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import Course from "../../../models/Course";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await db.connectDb();

      const { 
        month, 
        year, 
        date,
        status, 
        courseId, 
        page = 1, 
        limit = 10,
        sortBy = "startDate",
        sortOrder = "asc"
      } = req.query;

      // Build filter object
      const filter = { isActive: true };
      
      // Filter by specific date - we need to find schedules that have sessions on this date
      if (date) {
        // Find schedules that have classSessions on the specific date
        const schedulesWithSessions = await ClassSchedule.find({
          isActive: true,
          'classSessions.date': date
        }).populate('courseId', 'title subtitle image level duration slug');
        
        // Process sessions for the specific date
        const sessionsForDate = [];
        schedulesWithSessions.forEach(schedule => {
          schedule.classSessions.forEach(session => {
            if (session.date === date) {
              const sessionData = {
                _id: `${schedule._id}_${session.sessionNumber}`,
                sessionNumber: session.sessionNumber,
                className: schedule.className,
                courseId: schedule.courseId,
                date: session.date,
                dateString: session.dateString,
                dayOfWeek: session.dayOfWeek,
                startTime: session.startTime,
                endTime: session.endTime,
                locations: schedule.locations,
                instructor: schedule.instructor,
                maxStudents: schedule.maxStudents,
                currentStudents: schedule.currentStudents,
                price: schedule.price,
                discountPrice: schedule.discountPrice,
                status: schedule.status,
                description: schedule.description,
                requirements: schedule.requirements,
                benefits: schedule.benefits,
                totalSessions: schedule.totalSessions,
                schedule: `${session.dayOfWeek}, ${session.startTime} - ${session.endTime}`,
                title: `${schedule.className} - Buổi ${session.sessionNumber}`
              };
              sessionsForDate.push(sessionData);
            }
          });
        });

        return res.status(200).json({
          success: true,
          data: {
            classSchedules: sessionsForDate,
            groupedByMonth: {},
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: sessionsForDate.length,
              itemsPerPage: sessionsForDate.length,
            },
          },
        });
      }
      // Filter by month and year
      else if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        filter.startDate = { $gte: startDate, $lte: endDate };
      }
      
      if (status) {
        filter.status = status;
      }
      
      if (courseId) {
        filter.courseId = courseId;
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get class schedules with course information
      const classSchedules = await ClassSchedule.find(filter)
        .populate('courseId', 'title subtitle image level duration slug')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await ClassSchedule.countDocuments(filter);

      // Group by month for calendar view
      const groupedByMonth = {};
      classSchedules.forEach(schedule => {
        const monthKey = `${schedule.startDate.getFullYear()}-${String(schedule.startDate.getMonth() + 1).padStart(2, '0')}`;
        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = [];
        }
        groupedByMonth[monthKey].push(schedule);
      });

      res.status(200).json({
        success: true,
        data: {
          classSchedules,
          groupedByMonth,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching class schedules:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu lịch khai giảng",
        error: error.message,
      });
    }
  } else if (req.method === "POST") {
    try {
      await db.connectDb();

      const classScheduleData = req.body;
      console.log('Received class schedule data:', JSON.stringify(classScheduleData, null, 2));

      // Validate required fields with correct type checks
      const {
        courseId,
        className,
        startDate,
        endDate,
        schedule,
        locations,
        instructor,
        maxStudents,
        price,
      } = classScheduleData || {};

      if (!courseId) {
        return res.status(400).json({ success: false, message: "Trường courseId là bắt buộc" });
      }
      if (!className || typeof className !== "string" || !className.trim()) {
        return res.status(400).json({ success: false, message: "Trường className là bắt buộc" });
      }
      if (!startDate) {
        return res.status(400).json({ success: false, message: "Trường startDate là bắt buộc" });
      }
      if (!endDate) {
        return res.status(400).json({ success: false, message: "Trường endDate là bắt buộc" });
      }
      if (!schedule || typeof schedule !== "string" || !schedule.trim()) {
        return res.status(400).json({ success: false, message: "Trường schedule là bắt buộc" });
      }
      if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({ success: false, message: "Trường locations là bắt buộc và phải có ít nhất một địa điểm" });
      }
      if (!instructor || !instructor.name || !String(instructor.name).trim()) {
        return res.status(400).json({ success: false, message: "Trường instructor.name là bắt buộc" });
      }
      if (maxStudents === undefined || maxStudents === null || maxStudents === '') {
        return res.status(400).json({ success: false, message: "Trường maxStudents là bắt buộc" });
      }
      if (price === undefined || price === null || price === '') {
        return res.status(400).json({ success: false, message: "Trường price là bắt buộc" });
      }

      // Normalize date fields - convert Date objects or strings to Date
      if (classScheduleData.startDate) {
        classScheduleData.startDate = new Date(classScheduleData.startDate);
      }
      if (classScheduleData.endDate) {
        classScheduleData.endDate = new Date(classScheduleData.endDate);
      }
      
      // Ensure numeric fields are numbers
      if (classScheduleData.maxStudents !== undefined) {
        classScheduleData.maxStudents = Number(classScheduleData.maxStudents);
      }
      if (classScheduleData.currentStudents !== undefined) {
        classScheduleData.currentStudents = Number(classScheduleData.currentStudents) || 0;
      }
      if (classScheduleData.price !== undefined) {
        classScheduleData.price = Number(classScheduleData.price);
      }
      if (classScheduleData.discountPrice !== undefined) {
        classScheduleData.discountPrice = Number(classScheduleData.discountPrice) || 0;
      }
      if (classScheduleData.totalSessions !== undefined) {
        classScheduleData.totalSessions = Number(classScheduleData.totalSessions);
      }

      // Check if course exists
      const course = await Course.findById(classScheduleData.courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khóa học",
        });
      }

      // Create new class schedule
      const newClassSchedule = new ClassSchedule(classScheduleData);
      await newClassSchedule.save();

      // Populate course information
      await newClassSchedule.populate('courseId', 'title subtitle image level duration slug');

      res.status(201).json({
        success: true,
        message: "Tạo lịch khai giảng thành công",
        data: newClassSchedule,
      });
    } catch (error) {
      console.error("Error creating class schedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo lịch khai giảng",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({
      success: false,
      message: `Phương thức ${req.method} không được hỗ trợ`,
    });
  }
}
