import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoModal from "./VideoModal";
import { FaPlay } from "react-icons/fa";

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  videoType: "youtube" | "facebook";
  thumbnail?: string;
  videoId?: string;
  order?: number;
}

interface VideoGalleryProps {
  maxVideos?: number;
  showTitle?: boolean;
  showDescription?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  maxVideos = 6,
  showTitle = true,
  showDescription = false,
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos?active=true");
      const data = await response.json();

      if (data.success) {
        const sortedVideos = data.videos
          .sort((a: Video, b: Video) => (a.order || 0) - (b.order || 0))
          .slice(0, maxVideos);
        setVideos(sortedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const getThumbnailUrl = (video: Video) => {
    // Luôn ưu tiên lấy thumbnail trực tiếp từ video YouTube
    if (video.videoType === "youtube") {
      if (video.videoId) {
        return `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
      }
      // Nếu không có videoId, thử extract từ URL
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = video.videoUrl.match(youtubeRegex);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    }
    
    // Facebook video - sử dụng thumbnail đã lưu nếu có
    if (video.videoType === "facebook" && video.thumbnail) {
      return video.thumbnail;
    }
    
    // Fallback: dùng thumbnail đã lưu hoặc placeholder
    return video.thumbnail || "/images/placeholder-video.jpg";
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-2 md:px-4">
          {/* Section Header */}
          {showTitle && (
            <div className="text-center mb-6 md:mb-12">
              <div className="w-16 h-1 bg-gray-300 mx-auto mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent ">
                  Video Học Viên Trung Tâm Đào Tạo MC Q&K Bắc Giang
                </span>
              </h2>
              <p className="text-sm md:text-base hidden md:block text-gray-600 max-w-4xl mx-auto px-2">
                Theo dõi những khoảnh khắc đáng nhớ, thành tích và hoạt động của học viên tại Trung Tâm MC Q&K Bắc Giang. Cập nhật thường xuyên với những video mới nhất từ các khóa học và sự kiện.
              </p>
            </div>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2">
            {videos.map((video) => (
              <div
                key={video._id}
                className="group relative bg-white rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 md:hover:-translate-y-2"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  <Image
                    src={getThumbnailUrl(video)}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-video.jpg";
                    }}
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaPlay className="text-pink-600 ml-1" size={18} />
                    </div>
                  </div>

                  {/* Video Type Badge */}
                  <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3">
                    <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-black/70 text-white text-[10px] md:text-xs rounded md:rounded-md backdrop-blur-sm">
                      {video.videoType === "youtube" ? "Youtube" : "Facebook"}
                    </span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-1.5 md:p-2">
                  <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 md:mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {video.title}
                  </h3>
                  {showDescription && video.description && (
                    <p className="text-[10px] md:text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          {videos.length >= maxVideos && (
            <div className="text-center mt-4 md:mt-8">
              <Link
                href="/video-hoc-vien"
                className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Xem tất cả video
                <svg
                  className="ml-2 w-4 h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default VideoGallery;

