import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import DashboardPostCard from "../../../components/common/DashboardPostCard";
import Pagination from "../../../components/common/Pagination";
import { formatPosts, readPostsFromDb } from "../../../lib/utils";
import { PostDetail } from "../../../utils/types";
import Post from "../../../models/Post";
import db from "../../../utils/db";
import { _id } from "@next-auth/mongodb-adapter";
import styles from "../../../styles/posts.module.css";

const limit = 12; // Số bài viết mỗi trang

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ initialPosts, totalPages }) => {
  const [posts, setPosts] = useState<PostDetail[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Hàm xử lý đổi trang (server-side pagination)
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`/api/posts?limit=${limit}&skip=${skip}&includeDrafts=true`);
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xoá bài viết theo postId
  const handleDelete = async (postId: string) => {
    try {
      const response = await axios.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      toast.success("Bài viết đã được xóa thành công!");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra khi xóa bài viết!";
      toast.error(errorMessage);
    }
  };

  // Xử lý chuyển đổi trạng thái nháp/công khai
  const handleToggleStatus = async (postId: string, isDraft: boolean) => {
    try {
      const { data } = await axios.put("/api/posts/draft", {
        postId,
        isDraft
      });
      
      // Cập nhật trạng thái trong danh sách
      setPosts((prevPosts) => 
        prevPosts.map((post) => 
          post.id === postId 
            ? { ...post, isDraft } 
            : post
        )
      );
      
      // Toast thông báo
      if (isDraft) {
        toast.success("Bài viết đã được chuyển về trạng thái nháp!");
      } else {
        toast.success("Bài viết đã được công khai!");
      }
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái bài viết!");
    }
  };

  // Lọc bài viết theo search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý chuyển đến trang thêm bài viết mới
  const handleAddNewPost = () => {
    router.push("/dashboard/them-bai-viet");
  };


  return (
    <AdminLayout title="Quản lý bài viết">
      <div className={styles.postsContainer}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý bài viết</h1>
          <p className={styles.subtitle}>
            Quản lý và tổ chức nội dung website của bạn
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={styles.addButton} 
              onClick={() => router.push("/dashboard/bai-viet/trash")}
              style={{ backgroundColor: '#6b7280' }}
            >
              🗑️ Thùng rác
            </button>
          <button className={styles.addButton} onClick={handleAddNewPost}>
            <span>+</span>
            Thêm bài viết mới
          </button>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>Không có bài viết nào</h3>
            <p className={styles.emptyDescription}>
              {searchTerm ? 'Không tìm thấy bài viết phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu tạo bài viết đầu tiên của bạn.'}
            </p>
            <button className={styles.addButton} onClick={handleAddNewPost}>
              <span>+</span>
              Tạo bài viết mới
            </button>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <DashboardPostCard
                key={post.slug}
                post={post}
                onDeleteClick={() => handleDelete(post.id)}
                onToggleStatus={handleToggleStatus}
              />
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

    // Lấy tất cả bài viết bao gồm cả nháp (isDraft: true và false), nhưng loại trừ các bài đã xóa
    // Filter: chỉ loại trừ các bài có deletedAt là Date (đã bị xóa)
    // Không lọc theo isDraft để hiển thị cả bài viết nháp và đã công khai
    const filter = {
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } }
      ]
    };
    
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);
    
    // Lấy bài viết đầu tiên với limit, bao gồm cả nháp và đã công khai, loại trừ các bài đã xóa
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(limit)
      .lean();
    
    console.log("📋 Dashboard bai-viet - Total posts (including drafts, excluding deleted):", totalPosts);
    console.log("📋 Dashboard bai-viet - Posts found:", posts.length);
    console.log("📋 Dashboard bai-viet - Drafts:", posts.filter(p => p.isDraft).length);
    console.log("📋 Dashboard bai-viet - Published:", posts.filter(p => !p.isDraft).length);

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

export default Posts;
