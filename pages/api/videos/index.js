import db from "../../../utils/db";
import Video from "../../../models/Video";

export default async function handler(req, res) {
  await db.connectDb();

  try {
    switch (req.method) {
      case "GET":
        const { active } = req.query;
        const query = {};
        
        if (active === "true") {
          query.isActive = true;
        }

        const videos = await Video.find(query)
          .sort({ order: 1, createdAt: -1 })
          .lean();

        return res.status(200).json({
          success: true,
          videos,
        });

      case "POST":
        const { title, description, videoUrl, videoType, thumbnail, order, isActive } = req.body;

        if (!title || !videoUrl || !videoType) {
          return res.status(400).json({
            success: false,
            message: "Tiêu đề, link video và loại video là bắt buộc",
          });
        }

        if (!["youtube", "facebook"].includes(videoType)) {
          return res.status(400).json({
            success: false,
            message: "Loại video phải là youtube hoặc facebook",
          });
        }

        // Không set thumbnail ở đây, để pre-save hook tự động tạo từ videoId
        const newVideo = new Video({
          title,
          description: description || "",
          videoUrl,
          videoType,
          thumbnail: thumbnail || undefined, // undefined để pre-save hook tự động set
          order: order || 0,
          isActive: isActive !== undefined ? isActive : true,
        });

        await newVideo.save();

        return res.status(201).json({
          success: true,
          video: newVideo,
          message: "Thêm video thành công",
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

