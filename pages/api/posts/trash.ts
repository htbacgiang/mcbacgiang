import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getToken } from "next-auth/jwt";
import { formatPosts } from "../../../lib/utils";
import Post from "../../../models/Post";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    const { limit, skip } = req.query as {
      limit?: string;
      skip?: string;
    };

    await db.connectDb();

    const limitNum = limit ? parseInt(limit) : 12;
    const skipNum = skip ? parseInt(skip) : 0;

    // Chỉ lấy các bài viết đã xóa (deletedAt phải là Date object)
    // Sử dụng $type: "date" để đảm bảo chỉ lấy các bài viết có deletedAt là Date
    const filter = {
      deletedAt: { 
        $type: "date" // Chỉ lấy các bài viết có deletedAt là Date object
      }
    };
    
    const posts = await Post.find(filter)
      .sort({ deletedAt: -1 })
      .select("-content")
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    res.json({ posts: formatPosts(posts) });
  } catch (error: any) {
    console.error("Error in trash API:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
