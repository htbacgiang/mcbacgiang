import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface VideoModalProps {
  video: {
    _id: string;
    title: string;
    videoUrl: string;
    videoType: "youtube" | "facebook";
    videoId?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const getEmbedUrl = () => {
    if (video.videoType === "youtube" && video.videoId) {
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`;
    } else if (video.videoType === "facebook") {
      // Facebook requires the full URL for embedding
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.videoUrl)}&show_text=0&width=560&height=315`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Đóng"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Video Container */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Đang tải video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Title */}
        {video.title && (
          <div className="p-4 bg-gray-900 text-white">
            <h3 className="text-lg font-semibold">{video.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;

