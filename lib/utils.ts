import formidable from "formidable";
import { ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Post, { PostModelSchema } from "../models/Post";
// import { authOptions } from "../pages/api/auth/[...nextauth]";
import { CommentResponse, PostDetail, UserProfile } from "../utils/types";
import db from "../utils/db";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface FormidablePromise<T> {
  files: formidable.Files;
  body: T;
}

export const readFile = <T extends object>(
  req: NextApiRequest
): Promise<FormidablePromise<T>> => {
  const form = formidable({
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFields: 100,
    maxFieldsSize: 2 * 1024 * 1024, // 2MB cho fields
  });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, body: fields as T });
    });
  });
};

export const readPostsFromDb = async (
  limit?: number,
  pageNo?: number,
  skip?: number,
  includeDrafts: boolean = false
) => {
    
  // Nếu không có limit, lấy tất cả bài viết
  if (limit && limit > 50)
    throw Error("Please use limit under 50 and a valid pageNo");
  
  const finalSkip = skip || (limit && pageNo ? limit * pageNo : 0);
  
  try {
  await db.connectDb();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
  
  // Tạo filter để loại trừ nháp nếu không includeDrafts
  // Luôn loại trừ các bài viết đã xóa (deletedAt không được là Date object)
  // Chỉ lấy các bài viết có deletedAt là null hoặc không tồn tại
  const filter: any = {
    $and: [
      {
        $or: [
          { deletedAt: null },
          { deletedAt: { $exists: false } }
        ]
      },
      {
        // Đảm bảo deletedAt không phải là Date type
        $nor: [
          { deletedAt: { $type: "date" } }
        ]
      }
    ]
  };
  // Nếu includeDrafts = false, chỉ lấy bài viết đã công khai (isDraft không phải true)
  // Nếu includeDrafts = true, lấy tất cả bài viết (cả nháp và đã công khai)
  if (!includeDrafts) {
    filter.$and.push({ isDraft: { $ne: true } });
  }
  
  console.log("🔍 readPostsFromDb:", { 
    includeDrafts, 
    filter, 
    willFetch: includeDrafts ? "all posts including drafts (excluding deleted)" : "published posts only (excluding deleted)" 
  });
  
  let query = Post.find(filter)
    .sort({ createdAt: "desc" })
    .select("-content")
    .skip(finalSkip);
    
  // Chỉ áp dụng limit nếu được chỉ định
  if (limit) {
    query = query.limit(limit);
  }

  const posts = await query;

  
  return posts;
};

export const formatPosts = (posts: PostModelSchema[]): PostDetail[] => {
  return posts.map((post) => {
    // Xử lý thumbnail: có thể là object { url, public_id } hoặc string
    let thumbnailUrl = "";
    
    if (post.thumbnail) {
      if (typeof post.thumbnail === "string") {
        // Nếu thumbnail là string (trường hợp cũ hoặc migration)
        thumbnailUrl = post.thumbnail;
      } else if (typeof post.thumbnail === "object") {
        // Nếu thumbnail là object, lấy url property
        // Có thể là { url: string, public_id?: string } hoặc { url: string }
        const thumbObj = post.thumbnail as any;
        if (thumbObj && thumbObj.url && typeof thumbObj.url === "string") {
          thumbnailUrl = thumbObj.url;
        } else {
          // Debug: log để xem cấu trúc thumbnail object
          console.log("⚠️ Thumbnail object không có url property:", {
            postId: post._id.toString(),
            thumbnail: thumbObj,
            thumbnailType: typeof thumbObj,
            keys: thumbObj ? Object.keys(thumbObj) : []
          });
        }
      }
    }
    
    return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    category: post.category,
    createdAt: post.createdAt.toString(),
      thumbnail: thumbnailUrl,
    meta: post.meta,
    tags: post.tags,
    isDraft: post.isDraft || false,
      isFeatured: post.isFeatured || false, // Bài viết nổi bật
    };
  });
};

const getLikedByOwner = (likes: any[], user: UserProfile) =>
  likes.includes(user.id);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
