import formidable from "formidable";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import cloudinary from "../../../lib/cloudinary";
import { readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import Post from "../../../models/Post";
import { IncomingPost } from "../../../utils/types";
import db from "../../../utils/db";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH":
      return updatePost(req, res);
    case "DELETE":
      return removePost(req, res);
    case "POST":
      return restorePost(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

const removePost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    try {
      await db.connectDb();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection failed" });
    }
    
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    console.log("Deleting post:", { 
      postId, 
      userId: session.user.sub,
      sessionUser: session.user 
    });

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    console.log("Post found:", { 
      postAuthor: post.author?.toString() || 'No author', 
      sessionUserId: session.user.sub,
      isOwner: post.author?.toString() === session.user.sub 
    });

    // Kiểm tra quyền sở hữu - Admin có thể xóa mọi bài viết
    const isAdmin = session.user.role === 'admin';
    const isOwner = post.author && post.author.toString() === session.user.sub;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Bạn không có quyền xóa bài viết này!" });
    }
    
    console.log("Deleting post - permission granted:", { isAdmin, isOwner });

    // Soft delete: Đánh dấu bài viết đã xóa thay vì xóa vĩnh viễn
    const deletedAt = new Date();
    post.deletedAt = deletedAt;
    await post.save();

    console.log("✅ Post soft deleted:", { 
      postId: post._id.toString(), 
      deletedAt: post.deletedAt,
      deletedAtType: typeof post.deletedAt 
    });

    // Không xóa ảnh trên Cloudinary để có thể phục hồi sau
    
    res.json({ removed: true, message: "Đã xóa bài viết vào thùng rác!" });
  } catch (error: any) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    try {
      await db.disconnectDb();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
};

const updatePost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    try {
      await db.connectDb();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection failed" });
    }
    
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // Kiểm tra quyền sở hữu - Admin có thể chỉnh sửa mọi bài viết
    const isAdmin = session.user.role === 'admin';
    const isOwner = post.author && post.author.toString() === session.user.sub;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
    }
    
    console.log("Updating post - permission granted:", { isAdmin, isOwner });

    const { files, body } = await readFile<IncomingPost>(req);
    const error = validateSchema(postValidationSchema, { ...body });
    if (error) return res.status(400).json({ error });

    const { title, content, meta, slug, category } = body;
    const isDraft = (body as any).isDraft;
    const isFeatured = (body as any).isFeatured === 'true' || (body as any).isFeatured === true;
    
    post.title = title;
    post.content = content;
    post.meta = meta;
    post.slug = slug;
    post.category = category;
    
    // Cập nhật trạng thái nháp nếu có
    if (typeof isDraft === 'boolean') {
      post.isDraft = isDraft;
    }
    
    // Cập nhật trạng thái nổi bật nếu có
    if (typeof isFeatured === 'boolean') {
      post.isFeatured = isFeatured;
    }

    // Cập nhật thumbnail: có thể là file mới upload hoặc URL từ gallery
    const thumbnailFile = files.thumbnail as formidable.File | undefined;
    const thumbnailUrl = (body as any).thumbnail as string | undefined;
    
    if (thumbnailFile) {
      // Kiểm tra cấu hình Cloudinary trước khi upload
      const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;
      
      if (!cloudName || !apiKey || !apiSecret) {
        console.error("Lỗi cập nhật bài viết: Cloudinary chưa được cấu hình.");
        return res.status(500).json({ 
          error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET." 
        });
      }
      
      try {
        // File upload mới - upload lên cloudinary
        const { secure_url: url, public_id } = await cloudinary.uploader.upload(
          thumbnailFile.filepath,
          { folder: process.env.CLOUDINARY_FOLDER || "btacademy" }
        );
        const oldPublicId = post.thumbnail?.public_id;
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
        post.thumbnail = { url, public_id };
      } catch (cloudinaryError: any) {
        console.error("Lỗi upload thumbnail lên Cloudinary:", cloudinaryError);
        return res.status(500).json({ 
          error: cloudinaryError.message || "Lỗi upload ảnh thumbnail. Vui lòng thử lại." 
        });
      }
    } else if (thumbnailUrl && thumbnailUrl.trim() && thumbnailUrl !== post.thumbnail?.url) {
      // URL từ gallery - lưu trực tiếp URL (không cần upload lại)
      post.thumbnail = { url: thumbnailUrl.trim() };
    }

    await post.save();
    res.json({ post, message: "Cập nhật thành công!" });
  } catch (error: any) {
    console.error("Update post error:", error);
    const errorMessage = error.message || "Internal server error";
    if (errorMessage.includes("api_key") || errorMessage.includes("Must supply")) {
      return res.status(500).json({ 
        error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET trên VPS." 
      });
    }
    res.status(500).json({ error: errorMessage });
  } finally {
    try {
      await db.disconnectDb();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
};

const restorePost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    try {
      await db.connectDb();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection failed" });
    }
    
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // Kiểm tra quyền sở hữu - Admin có thể phục hồi mọi bài viết
    const isAdmin = session.user.role === 'admin';
    const isOwner = post.author && post.author.toString() === session.user.sub;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Bạn không có quyền phục hồi bài viết này!" });
    }

    // Kiểm tra xem bài viết có bị xóa không
    if (!post.deletedAt) {
      return res.status(400).json({ error: "Bài viết này chưa bị xóa!" });
    }

    // Phục hồi bài viết: xóa deletedAt
    post.deletedAt = undefined;
    await post.save();
    
    res.json({ restored: true, post, message: "Đã phục hồi bài viết thành công!" });
  } catch (error: any) {
    console.error("Restore post error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    try {
      await db.disconnectDb();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
};

export default handler;
