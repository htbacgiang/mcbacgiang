import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../../components/layout/AdminLayout";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaYoutube, FaFacebook } from "react-icons/fa";

export default function VideoManagementPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoType: "youtube",
    thumbnail: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/videos");
      if (response.data.success) {
        setVideos(response.data.videos || []);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Không thể tải danh sách video", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (video = null) => {
    if (video) {
      setSelectedVideo(video);
      setFormData({
        title: video.title || "",
        description: video.description || "",
        videoUrl: video.videoUrl || "",
        videoType: video.videoType || "youtube",
        thumbnail: video.thumbnail || "",
        order: video.order || 0,
        isActive: video.isActive !== undefined ? video.isActive : true,
      });
    } else {
      setSelectedVideo(null);
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        videoType: "youtube",
        thumbnail: "",
        order: 0,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      videoType: "youtube",
      thumbnail: "",
      order: 0,
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedVideo) {
        // Update existing video
        await axios.put(`/api/videos/${selectedVideo._id}`, formData);
        toast.success("Cập nhật video thành công", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // Create new video
        await axios.post("/api/videos", formData);
        toast.success("Thêm video thành công", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      handleCloseModal();
      fetchVideos();
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu video",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/videos/${videoToDelete._id}`);
      toast.success("Xóa video thành công", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsDeleteModalOpen(false);
      setVideoToDelete(null);
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Có lỗi xảy ra khi xóa video", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getThumbnailUrl = (video) => {
    if (video.thumbnail) return video.thumbnail;
    if (video.videoType === "youtube" && video.videoId) {
      return `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
    }
    return "/images/placeholder-video.jpg";
  };

  return (
    <AdminLayout title="Quản lý Video">
      <div className="p-6">
        <ToastContainer />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Video</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Thêm Video
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm video..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Videos Grid */}
        {loading && !videos.length ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? "Không tìm thấy video nào" : "Chưa có video nào"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={getThumbnailUrl(video)}
                    alt={video.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target;
                      target.src = "/images/placeholder-video.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {video.videoType === "youtube" ? (
                      <FaYoutube className="text-red-600 text-xl" />
                    ) : (
                      <FaFacebook className="text-blue-600 text-xl" />
                    )}
                  </div>
                  {!video.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded">
                        Đã ẩn
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Thứ tự: {video.order || 0}</span>
                    <span className="capitalize">{video.videoType}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(video)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="mr-2" />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(video)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="mr-2" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedVideo ? "Sửa Video" : "Thêm Video Mới"}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Video Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại Video <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.videoType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            videoType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="facebook">Facebook</option>
                      </select>
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link Video <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.videoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, videoUrl: e.target.value })
                        }
                        placeholder={
                          formData.videoType === "youtube"
                            ? "https://www.youtube.com/watch?v=..."
                            : "https://www.facebook.com/.../videos/..."
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.videoType === "youtube"
                          ? "Ví dụ: https://www.youtube.com/watch?v=VIDEO_ID hoặc https://youtu.be/VIDEO_ID"
                          : "Ví dụ: https://www.facebook.com/.../videos/VIDEO_ID"}
                      </p>
                    </div>

                    {/* Thumbnail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail (tùy chọn)
                      </label>
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            thumbnail: e.target.value,
                          })
                        }
                        placeholder="URL hình ảnh thumbnail"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Để trống để tự động lấy thumbnail từ YouTube
                      </p>
                    </div>

                    {/* Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thứ tự hiển thị
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700"
                      >
                        Hiển thị video
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                      {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
              <p className="text-gray-700 mb-6">
                Bạn có chắc chắn muốn xóa video &quot;{videoToDelete?.title}&quot;?
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setVideoToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

