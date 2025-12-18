import db from "../../../../utils/db";
import ClassSchedule from "../../../../models/ClassSchedule";
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

  if (req.method === "POST") {
    try {
      await db.connectDb();

      const { action, ids, data } = req.body;

      if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Action và danh sách ID là bắt buộc",
        });
      }

      let result;

      switch (action) {
        case "delete":
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { isDeleted: true }
          );
          break;

        case "activate":
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { isActive: true }
          );
          break;

        case "deactivate":
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { isActive: false }
          );
          break;

        case "updateStatus":
          if (!data || !data.status) {
            return res.status(400).json({
              success: false,
              message: "Trạng thái mới là bắt buộc",
            });
          }
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { status: data.status }
          );
          break;

        case "updatePrice":
          if (!data || data.price === undefined) {
            return res.status(400).json({
              success: false,
              message: "Giá mới là bắt buộc",
            });
          }
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { price: data.price }
          );
          break;

        case "updateDiscountPrice":
          if (!data || data.discountPrice === undefined) {
            return res.status(400).json({
              success: false,
              message: "Giá ưu đãi mới là bắt buộc",
            });
          }
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { discountPrice: data.discountPrice }
          );
          break;

        case "updateMaxStudents":
          if (!data || data.maxStudents === undefined) {
            return res.status(400).json({
              success: false,
              message: "Số học viên tối đa mới là bắt buộc",
            });
          }
          result = await ClassSchedule.updateMany(
            { _id: { $in: ids } },
            { maxStudents: data.maxStudents }
          );
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Action không hợp lệ",
          });
      }

      res.status(200).json({
        success: true,
        message: `Thực hiện ${action} thành công cho ${result.modifiedCount} lịch khai giảng`,
        data: {
          modifiedCount: result.modifiedCount,
          matchedCount: result.matchedCount,
        },
      });
    } catch (error) {
      console.error("Error performing bulk action:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi thực hiện thao tác hàng loạt",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      success: false,
      message: `Phương thức ${req.method} không được hỗ trợ`,
    });
  }
}
