import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      await db.connectDb();

      const classSchedule = await ClassSchedule.findById(id)
        .populate('courseId', 'title subtitle image level duration slug description curriculum features requirements');

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

      const classSchedule = await ClassSchedule.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('courseId', 'title subtitle image level duration slug');

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
