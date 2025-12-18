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

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      await db.connectDb();

      const classSchedule = await ClassSchedule.findById(id)
        .populate('courseId', 'title subtitle image level duration description curriculum features requirements');

      if (!classSchedule) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch khai giảng",
        });
      }

      res.status(200).json({
        success: true,
        data: classSchedule,
      });
    } catch (error) {
      console.error("Error fetching class schedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu lịch khai giảng",
        error: error.message,
      });
    }
  } else if (req.method === "PUT") {
    try {
      await db.connectDb();

      const updateData = req.body;

      // Validate dates if provided
      if (updateData.startDate && updateData.endDate) {
        const startDate = new Date(updateData.startDate);
        const endDate = new Date(updateData.endDate);
        
        if (startDate >= endDate) {
          return res.status(400).json({
            success: false,
            message: "Ngày kết thúc phải sau ngày khai giảng",
          });
        }
      }

      // Validate instructor name if provided
      if (updateData.instructor && !updateData.instructor.name) {
        return res.status(400).json({
          success: false,
          message: "Tên giảng viên là bắt buộc",
        });
      }

      // Validate course exists if courseId is being updated
      if (updateData.courseId) {
        const course = await Course.findById(updateData.courseId);
        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy khóa học",
          });
        }
      }

      const classSchedule = await ClassSchedule.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('courseId', 'title subtitle image level duration');

      if (!classSchedule) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch khai giảng",
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật lịch khai giảng thành công",
        data: classSchedule,
      });
    } catch (error) {
      console.error("Error updating class schedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật lịch khai giảng",
        error: error.message,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      await db.connectDb();

      const classSchedule = await ClassSchedule.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (!classSchedule) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy lịch khai giảng",
        });
      }

      res.status(200).json({
        success: true,
        message: "Xóa lịch khai giảng thành công",
      });
    } catch (error) {
      console.error("Error deleting class schedule:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa lịch khai giảng",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({
      success: false,
      message: `Phương thức ${req.method} không được hỗ trợ`,
    });
  }
}
