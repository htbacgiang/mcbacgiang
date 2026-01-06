import {
  GetServerSideProps,
  NextPage,
} from "next";
import parse from "html-react-parser";
import DefaultLayout from "../../components/layout/DefaultLayout";
import db from "../../utils/db";
import Post from "../../models/Post";
import Share from "../../components/common/Share";
import Link from "next/link";
import Image from "next/image";
import { trimText } from "../../utils/helper";

type PostData = {
  id: string;
  title: string;
  content: string;
  meta: string;
  tags: string[];
  slug: string;
  thumbnail: string;
  createdAt: string;
  category: string;
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail?: string | null;
    createdAt: string; // Thêm createdAt cho bài viết gần đây
  }[];
};

type MetaData = {
  title: string;
  description: string;
  author: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
};

type Props = {
  post: PostData;
  meta: MetaData;
};

const host = "https://mcbacgiang.com/bai-viet";

export const APP_NAME = "Q&K Bắc Giang";
const SinglePost: NextPage<Props> = ({ post }) => {
  const { title, content, meta, slug, thumbnail, category, createdAt, recentPosts } = post;

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Main Content - 75% width on md and up */}
          <div className="w-full md:w-3/4 pr-0 md:pr-8 mb-4 md:mb-0">
            <div className="md:pb-20 pb-6 container mx-auto mt-[60px] sm:mt-[91px]">
              {/* Breadcrumb */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-rose-200 shadow-sm mb-6">
                <div className="max-w-7xl mx-auto px-4 py-5">
                  <div className="flex items-center gap-3 text-base">
                    <Link href="/bai-viet" className="font-semibold text-gray-700 hover:text-pink-600 hover:underline whitespace-nowrap transition-colors duration-200">
                  Bài viết
                </Link>
                    <span className="text-pink-400 font-bold text-lg">›</span>
                    <span className="font-bold text-gray-800 bg-pink-100 px-3 py-1 rounded-full text-sm">
                  {trimText(title, 35)}
                </span>
                  </div>
                </div>
              </div>

              {/* Tiêu đề bài viết */}
              <h1 className="md:text-2xl text-xl font-bold text-primary-dark dark:text-primary">
                {title}
              </h1>
              <div className="mt-2 mb-2">
                <Share url={`${host}/${slug}`} />
              </div>
              <div className="mt-2 uppercase text-pink-600 font-xl">
                <b>{category}</b>
              </div>
              <div className="blog prose prose-lg dark:prose-invert max-w-2xl md:max-w-4xl lg:max-w-5xl">
                {parse(content)}
              </div>
            </div>
          </div>

          {/* Recent Posts Section - 25% width on md and up */}
          <div className="w-full md:w-1/4 px-0.5 md:mt-[91px] mt-10">
            <div className="pt-5">
              <p className="text-3xl font-semibold text-primary-dark dark:text-primary p-2 mb-4">
                Bài viết gần đây
              </p>
              <div className="flex flex-col space-y-4">
                {recentPosts.slice(0, 5).map((p) => (
                  <Link key={p.slug} href={`/bai-viet/${p.slug}`} legacyBehavior>
                    <a className="flex space-x-3 w-full">
                      {p.thumbnail && (
                        <Image
                          src={p.thumbnail}
                          alt={`Thumbnail for ${p.title}`}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col flex-1">
                        <span className="text-base font-bold text-gray-800">
                          {p.title}
                        </span>
                        <div className="text-base flex items-center mt-1 gap-2">
                          <span className=" text-orange-700">

                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          </span>

                          <span >
                          {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }).replace("tháng ", "Tháng ")}
                          </span>
                     
                          </div>


                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SinglePost;

export const getServerSideProps: GetServerSideProps<
  { post: PostData; meta: MetaData },
  { slug: string }
> = async ({ params }) => {
  try {
    await db.connectDb();

    // Find post excluding deleted ones
    const post = await Post.findOne({ 
      slug: params?.slug,
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } }
      ]
    });
    if (!post) {
      console.log(`Post not found for slug: ${params?.slug}`);
      return { notFound: true };
    }

    // Find recent posts excluding deleted and draft posts
    const posts = await Post.find({
      _id: { $ne: post._id },
      isDraft: { $ne: true },
      $or: [
        { deletedAt: null },
        { deletedAt: { $exists: false } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("slug title thumbnail category createdAt"); // Thêm createdAt vào select

    const recentPosts = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      category: p.category || "Uncategorized",
      thumbnail: p.thumbnail?.url || null, // Sử dụng null thay vì undefined để có thể serialize
      createdAt: p.createdAt.toString(), // Đảm bảo có createdAt
    }));

    const { _id, title, content, meta, slug, tags, thumbnail, category, createdAt } = post;

    const metaData: MetaData = {
      title,
      description: meta,
      author: "Q&K Bắc Giang",
      canonical: `https://mcbacgiang.com/bai-viet/${slug}`,
      og: {
        title,
        description: meta,
        type: "website",
        image: thumbnail?.url || "/images/noi-that-1.jpg",
        imageWidth: "1200",
        imageHeight: "630",
        url: `https://mcbacgiang.com/bai-viet/${slug}`,
        siteName: "Q&K Bắc Giang",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: meta,
        image: thumbnail?.url || "/images/noi-that-1.jpg",
      },
    };

    const postData: PostData = {
      id: _id.toString(),
      title,
      content,
      meta,
      slug,
      tags,
      category,
      thumbnail: thumbnail?.url || "",
      createdAt: createdAt.toString(),
      recentPosts,
    };

    return {
      props: {
        post: postData,
        meta: metaData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};