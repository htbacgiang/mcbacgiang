import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { FaArrowRight, FaCalendarAlt, FaClock } from "react-icons/fa";
import { trimText } from "../../utils/helper";
import { PostDetail } from "../../utils/types";

interface Props {
  post: PostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  const { title, slug, meta, thumbnail, category, createdAt } = post;

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
      {/* Post Image */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
            <span className="text-pink-400 text-3xl">📝</span>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Post Content */}
      <div className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors line-clamp-2 mb-2">
          <Link href={`/bai-viet/${slug}`}>
            {title}
          </Link>
        </h3>

        <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm mb-4">
          {trimText(meta, 100)}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-1" />
            <span>5 phút đọc</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/bai-viet/${slug}`}
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors group/link"
          >
            Đọc thêm
            <FaArrowRight className="ml-2 transition-transform group-hover/link:translate-x-1" />
          </Link>

          {controls && (
            <div className="flex items-center gap-2">
              <Link
                className="inline-flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                href={`/dashboard/bai-viet/update/${slug}`}
              >
                Sửa
              </Link>
              <button
                disabled={busy}
                onClick={onDeleteClick}
                className="inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
