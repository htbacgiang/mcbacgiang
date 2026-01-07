import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import { formatPosts, readFile, readPostsFromDb } from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readPosts(req, res);
    case "POST":
      return createNewPost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createNewPost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để đăng bài!" });
  }

  try {
    const { files, body } = await readFile<IncomingPost>(req);
    let tags = body.tags ? JSON.parse(body.tags as string) : [];

    // Kiểm tra dữ liệu đầu vào
    const error = validateSchema(postValidationSchema, { ...body, tags });
    if (error) return res.status(400).json({ error });

    const { title, content, slug, meta, category } = body;

    await db.connectDb();

    // Đảm bảo slug luôn duy nhất để tránh lỗi duplicate key
    const uniqueSlug = await ensureUniqueSlug(
      slug && slug.trim() ? slug.trim() : title || undefined
    );

    // Lấy isFeatured từ body (có thể là string 'true' hoặc boolean)
    const isFeaturedValue = (body as any).isFeatured;
    const isFeatured = isFeaturedValue === 'true' || isFeaturedValue === true || isFeaturedValue === '1';

    // Tạo bài viết mới
    const newPost = new Post({
      title,
      content,
      slug: uniqueSlug,
      meta,
      tags,
      category,
      author: session.user.sub,
      isDraft: false, // Bài viết được đăng sẽ không phải là nháp
      isFeatured: isFeatured || false, // Bài viết nổi bật
    });

    // Xử lý thumbnail: có thể là file mới upload hoặc URL từ gallery
    const thumbnailUrl = (body as any).thumbnail as string | undefined;
    const thumbnailFile = files.thumbnail as formidable.File | undefined;
    
    if (thumbnailFile) {
      // File mới upload - upload lên Cloudinary
      const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;
      
      if (!cloudName || !apiKey || !apiSecret) {
        console.error("Lỗi tạo bài viết: Cloudinary chưa được cấu hình. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET");
        return res.status(500).json({ 
          error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng liên hệ quản trị viên." 
        });
      }
      
      try {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
          thumbnailFile.filepath,
        { folder: process.env.CLOUDINARY_FOLDER || "btacademy" }
      );
      newPost.thumbnail = { url, public_id };
      } catch (cloudinaryError: any) {
        console.error("Lỗi upload thumbnail lên Cloudinary:", cloudinaryError);
        return res.status(500).json({ 
          error: cloudinaryError.message || "Lỗi upload ảnh thumbnail. Vui lòng thử lại." 
        });
      }
    } else if (thumbnailUrl && thumbnailUrl.trim()) {
      // URL từ gallery - lưu trực tiếp URL (không cần upload lại)
      const trimmedUrl = thumbnailUrl.trim();
      console.log("📸 Lưu thumbnail từ gallery:", trimmedUrl);
      // Lưu object với url, không có public_id (vì không upload lên Cloudinary)
      newPost.thumbnail = { url: trimmedUrl };
    }

    await newPost.save();
    console.log("✅ Bài viết đã được lưu với thumbnail:", newPost.thumbnail);
    res.json({ post: newPost });
  } catch (error: any) {
    console.error("Lỗi tạo bài viết:", error);
    // Trả về thông báo lỗi chi tiết hơn để dễ debug
    const errorMessage = error.message || "Lỗi máy chủ!";
    if (errorMessage.includes("api_key") || errorMessage.includes("Must supply")) {
      return res.status(500).json({ 
        error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET trên VPS." 
      });
    }
    res.status(500).json({ error: errorMessage });
  }
};

const ensureUniqueSlug = async (rawSlug?: string): Promise<string> => {
  const baseSlug = (rawSlug && rawSlug.trim()) ? rawSlug.trim() : `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (await Post.findOne({ slug: candidate })) {
    candidate = `${baseSlug}-${suffix++}`;
  }

  return candidate;
};

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNo, skip, includeDrafts } = req.query as {
      limit: string;
      pageNo: string;
      skip: string;
      includeDrafts?: string;
    };
    
    console.log("API /posts request params:", { limit, pageNo, skip, includeDrafts });
    
    // Chỉ admin mới có thể xem draft
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    const isAdmin = session?.user?.role === 'admin';
    const shouldIncludeDrafts = includeDrafts === 'true' && isAdmin;
    
    const posts = await readPostsFromDb(
      limit ? parseInt(limit) : undefined,
      pageNo ? parseInt(pageNo) : undefined,
      skip ? parseInt(skip) : undefined,
      shouldIncludeDrafts
    );
    
    console.log(`Returning ${posts.length} posts from API`);
    res.json({ posts: formatPosts(posts) });
  } catch (error: any) {
    console.error("Error in readPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
