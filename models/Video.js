import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề video là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Link video là bắt buộc"],
      trim: true,
    },
    videoType: {
      type: String,
      enum: ["youtube", "facebook"],
      required: true,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },
    videoId: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Extract video ID and thumbnail from URL
videoSchema.pre("save", function (next) {
  if (this.videoUrl && this.videoType) {
    if (this.videoType === "youtube") {
      // Extract YouTube video ID from various URL formats
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = this.videoUrl.match(youtubeRegex);
      if (match && match[1]) {
        this.videoId = match[1];
        // Luôn tự động tạo thumbnail từ YouTube (không cần kiểm tra thumbnail có sẵn)
        this.thumbnail = `https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`;
      }
    } else if (this.videoType === "facebook") {
      // Extract Facebook video ID from various formats
      // Format 1: https://www.facebook.com/username/videos/VIDEO_ID
      // Format 2: https://www.facebook.com/watch/?v=VIDEO_ID
      // Format 3: https://fb.watch/VIDEO_ID
      const facebookRegex = /(?:facebook\.com\/.*\/videos\/|facebook\.com\/watch\/\?v=|fb\.watch\/)(\d+)/;
      const match = this.videoUrl.match(facebookRegex);
      if (match && match[1]) {
        this.videoId = match[1];
      } else {
        // If no ID found, use the full URL as videoId for embedding
        this.videoId = this.videoUrl;
      }
      // Facebook không có public thumbnail API, giữ nguyên thumbnail nếu có
    }
  }
  next();
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;

