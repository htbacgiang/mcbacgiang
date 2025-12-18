import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import DashboardPostCard from "../../../components/common/DashboardPostCard";
import Pagination from "../../../components/common/Pagination";
import { formatPosts } from "../../../lib/utils";
import { PostDetail } from "../../../utils/types";
import Post from "../../../models/Post";
import db from "../../../utils/db";
import styles from "../../../styles/posts.module.css";

const limit = 12; // Số bài viết mỗi trang

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Trash: NextPage<Props> = ({ initialPosts, totalPages }) => {
  const [posts, setPosts] = useState<PostDetail[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const router = useRouter();

  // Hàm xử lý đổi trang (server-side pagination)
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`/api/posts/trash?limit=${limit}&skip=${skip}`);
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý phục hồi bài viết
  const handleRestore = async (postId: string) => {
    try {
      const response = await axios.post(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      toast.success("Bài viết đã được phục hồi thành công!");
    } catch (error: any) {
      console.error("Error restoring post:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra khi phục hồi bài viết!";
      toast.error(errorMessage);
    }
  };

  // Mở modal xác nhận xóa vĩnh viễn
  const openPermanentDeleteModal = (postId: string, postTitle: string) => {
    setPostToDelete({ id: postId, title: postTitle });
    setShowPermanentDeleteModal(true);
  };

  // Đóng modal xác nhận xóa vĩnh viễn
  const closePermanentDeleteModal = () => {
    setShowPermanentDeleteModal(false);
    setPostToDelete(null);
  };

  // Xử lý xóa vĩnh viễn bài viết
  const handlePermanentDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await axios.delete(`/api/posts/${postToDelete.id}/permanent`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete.id));
      toast.success("Bài viết đã được xóa vĩnh viễn!");
      closePermanentDeleteModal();
    } catch (error: any) {
      console.error("Error permanently deleting post:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra khi xóa bài viết!";
      toast.error(errorMessage);
    }
  };

  // Xử lý click overlay để đóng modal
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePermanentDeleteModal();
    }
  };

  // Đóng modal bằng phím Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPermanentDeleteModal) {
        closePermanentDeleteModal();
      }
    };

    if (showPermanentDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showPermanentDeleteModal]);

  // Lọc bài viết theo search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className={styles.postsContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🗑️ Thùng rác</h1>
          <p className={styles.subtitle}>
            Quản lý các bài viết đã xóa
            <span className={styles.postCount}>
              ({posts.length} bài viết trên trang {currentPage} / {totalPages} trang)
            </span>
          </p>
        </div>

        {/* Actions Bar */}
        <div className={styles.actionsBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className={styles.addButton} 
            onClick={() => router.push("/dashboard/bai-viet")}
          >
            ← Quay lại
          </button>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🗑️</div>
            <h3 className={styles.emptyTitle}>Thùng rác trống</h3>
            <p className={styles.emptyDescription}>
              {searchTerm ? 'Không tìm thấy bài viết phù hợp với từ khóa tìm kiếm.' : 'Không có bài viết nào trong thùng rác.'}
            </p>
            <button 
              className={styles.addButton} 
              onClick={() => router.push("/dashboard/bai-viet")}
            >
              ← Quay lại danh sách bài viết
            </button>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <div key={post.slug} style={{ position: 'relative' }}>
                <DashboardPostCard
                  post={post}
                  onDeleteClick={() => openPermanentDeleteModal(post.id, post.title)}
                  onToggleStatus={() => {}} // Không cho phép toggle status trong thùng rác
                />
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginTop: '8px',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => handleRestore(post.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🔄 Phục hồi
                  </button>
                  <button
                    onClick={() => openPermanentDeleteModal(post.id, post.title)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🗑️ Xóa vĩnh viễn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Info & Controls */}
        {totalPages > 1 && (
          <div className={styles.paginationSection}>
            <div className={styles.paginationInfo}>
              <span>Trang {currentPage} / {totalPages}</span>
              <span>•</span>
              <span>{posts.length} bài viết trên trang này</span>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Permanent Delete Confirmation Modal */}
        {showPermanentDeleteModal && postToDelete && (
          <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>⚠️ Xác nhận xóa vĩnh viễn</h3>
              </div>
              <div className={styles.modalBody}>
                <p>
                  Bạn có chắc chắn muốn xóa vĩnh viễn bài viết <strong>&quot;{postToDelete.title}&quot;</strong>?
                </p>
                <p className={styles.modalWarning}>
                  ⚠️ Cảnh báo: Hành động này không thể hoàn tác! Bài viết và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
              </div>
              <div className={styles.modalActions}>
                <button 
                  className={`${styles.modalButton} ${styles.cancelButton}`}
                  onClick={closePermanentDeleteModal}
                >
                  Hủy bỏ
                </button>
                <button 
                  className={`${styles.modalButton} ${styles.confirmDeleteButton}`}
                  onClick={handlePermanentDelete}
                >
                  Xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialPosts: PostDetail[];
  totalPages: number;
}> = async () => {
  try {
    await db.connectDb();

    // Chỉ lấy các bài viết đã xóa (deletedAt phải tồn tại, không null, và là Date)
    // Query chặt chẽ: phải có deletedAt, không được null, và phải là Date type
    const filter = {
      deletedAt: { 
        $exists: true,
        $ne: null,
        $type: "date"
      }
    };
    
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);
    
    // Lấy bài viết đã xóa với limit
    const posts = await Post.find(filter)
      .sort({ deletedAt: -1 }) // Sắp xếp theo thời gian xóa mới nhất
      .skip(0)
      .limit(limit)
      .lean();
    
    console.log("🗑️ Trash - Filter:", JSON.stringify(filter));
    console.log("🗑️ Trash - Total deleted posts:", totalPosts);
    console.log("🗑️ Trash - Posts found:", posts.length);
    
    // Nếu vẫn có bài viết nhưng không nên có, log để debug
    if (posts.length > 0 && totalPosts === 0) {
      console.warn("⚠️ Warning: Found posts but count is 0. This shouldn't happen.");
    }

    const formattedPosts = formatPosts(posts);

    return {
      props: {
        initialPosts: formattedPosts,
        totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Trash;
