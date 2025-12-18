import db from "../../../utils/db";
import Video from "../../../models/Video";

export default async function handler(req, res) {
  await db.connectDb();

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID video là bắt buộc",
      });
    }

    switch (req.method) {
      case "GET":
        const video = await Video.findById(id).lean();

        if (!video) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy video",
          });
        }

        return res.status(200).json({
          success: true,
          video,
        });

      case "PUT":
        const { title, description, videoUrl, videoType, thumbnail, order, isActive } = req.body;

        const videoToUpdate = await Video.findById(id);

        if (!videoToUpdate) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy video",
          });
        }

        if (title) videoToUpdate.title = title;
        if (description !== undefined) videoToUpdate.description = description;
        
        // Nếu videoUrl hoặc videoType thay đổi, cần extract lại videoId và thumbnail
        const urlChanged = videoUrl && videoToUpdate.videoUrl !== videoUrl;
        const typeChanged = videoType && videoToUpdate.videoType !== videoType;
        
        if (videoUrl) {
          videoToUpdate.videoUrl = videoUrl;
        }
        if (videoType) {
          videoToUpdate.videoType = videoType;
        }
        
        // Nếu URL hoặc type thay đổi, hoặc thumbnail không được cung cấp, để pre-save hook tự động tạo
        if ((urlChanged || typeChanged) && thumbnail === undefined) {
          // Xóa thumbnail để pre-save hook tự động tạo lại
          videoToUpdate.thumbnail = undefined;
        } else if (thumbnail !== undefined) {
          videoToUpdate.thumbnail = thumbnail;
        }
        
        if (order !== undefined) videoToUpdate.order = order;
        if (isActive !== undefined) videoToUpdate.isActive = isActive;

        videoToUpdate.updatedAt = new Date();
        await videoToUpdate.save();

        return res.status(200).json({
          success: true,
          video: videoToUpdate,
          message: "Cập nhật video thành công",
        });

      case "DELETE":
        const videoToDelete = await Video.findById(id);

        if (!videoToDelete) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy video",
          });
        }

        await Video.findByIdAndDelete(id);

        return res.status(200).json({
          success: true,
          message: "Xóa video thành công",
        });

      default:
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Video API error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra khi xử lý video",
    });
  }
}

