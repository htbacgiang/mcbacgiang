import db from "../../../../utils/db";
import ClassSchedule from "../../../../models/ClassSchedule";
import Course from "../../../../models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Bạn cần đăng nhập để truy cập",
    });
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập trang này",
    });
  }

  if (req.method === "GET") {
    try {
      await db.connectDb();

      const { 
        month, 
        year, 
        status, 
        courseId, 
        page = 1, 
        limit = 10,
        sortBy = "startDate",
        sortOrder = "asc",
        search = ""
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (month && year) {
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

      // Add search functionality
      if (search) {
        filter.$or = [
          { className: { $regex: search, $options: 'i' } },
          { 'instructor.name': { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get class schedules with course information
      const classSchedules = await ClassSchedule.find(filter)
        .populate('courseId', 'title subtitle image level duration')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await ClassSchedule.countDocuments(filter);

      // Get statistics
      const stats = {
        total: await ClassSchedule.countDocuments(),
        active: await ClassSchedule.countDocuments({ isActive: true }),
        upcoming: await ClassSchedule.countDocuments({ 
          status: 'Sắp khai giảng',
          startDate: { $gte: new Date() }
        }),
        ongoing: await ClassSchedule.countDocuments({ 
          status: 'Đang tuyển sinh'
        }),
        full: await ClassSchedule.countDocuments({ 
          status: 'Đã đầy'
        }),
        completed: await ClassSchedule.countDocuments({ 
          status: 'Đã kết thúc'
        })
      };

      res.status(200).json({
        success: true,
        data: {
          classSchedules,
          stats,
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

      // Validate required fields
      const requiredFields = [
        "courseId", "className", "startDate", "endDate", 
        "schedule", "location", "instructor", "maxStudents"
      ];
      
      for (const field of requiredFields) {
        if (!classScheduleData[field]) {
          return res.status(400).json({
            success: false,
            message: `Trường ${field} là bắt buộc`,
          });
        }
      }

      // Check if course exists
      const course = await Course.findById(classScheduleData.courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy khóa học",
        });
      }

      // Validate dates
      const startDate = new Date(classScheduleData.startDate);
      const endDate = new Date(classScheduleData.endDate);
      
      if (startDate >= endDate) {
        return res.status(400).json({
          success: false,
          message: "Ngày kết thúc phải sau ngày khai giảng",
        });
      }

      // Validate instructor name
      if (!classScheduleData.instructor.name) {
        return res.status(400).json({
          success: false,
          message: "Tên giảng viên là bắt buộc",
        });
      }

      // Create new class schedule
      const newClassSchedule = new ClassSchedule(classScheduleData);
      await newClassSchedule.save();

      // Populate course information
      await newClassSchedule.populate('courseId', 'title subtitle image level duration');

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
