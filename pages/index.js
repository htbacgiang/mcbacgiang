// pages/index.js

import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import HeroBanner from "../components/common/HeroBanner";
import AboutSection from "../components/common/AboutSection";
import OrganicProcess from "../components/about/OrganicProcess";
import PostCard from "../components/common/PostCard";
import { readPostsFromDb, formatPosts } from "../lib/utils";
import FQSection from "../components/common/FAQSection";
import NewsletterSignup from "../components/common/NewsletterSignup";
import FeaturedCourses from '../components/common/FeaturedCourses';
import TeachersSection from '../components/common/TeachersSection';
import teachersData from '../data/teachers.json';
import { ScrollingGallery } from '../components/gallery';
import VideoGallery from '../components/common/VideoGallery';

// Trong component của bạn
export default function Home({ posts, meta }) {
  // JSON-LD Schema.org cho Trung tâm MC Q&K
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Trung Tâm Đào tạo MC Q&K Bắc Giang",
    alternateName: "Q&K Bắc Giang",
    url: "https://mcbacgiang.com",
    logo: "https://mcbacgiang.com/logoqkbacgiang.png",
    sameAs: [
      "https://www.facebook.com/daotaomcbacgiang",
      "https://www.youtube.com/@hongquyenao9055", // 👈 Đã thêm kênh YouTube

      // Thêm các URL mạng xã hội khác nếu có (TikTok, Instagram...)
    ],
    description:
      "Trung Tâm Đào tạo MC Q&K Bắc Giang - Đào tạo MC, dẫn chương trình, phát thanh viên và kỹ năng giao tiếp chuyên nghiệp hàng đầu tại Bắc Giang và Bắc Ninh. Khóa học từ cơ bản đến nâng cao.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressRegion: "Bắc Ninh",
      addressLocality: "phường Bắc Giang",
      streetAddress: "Số 1 Nguyễn Văn Linh",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-816997000",
      email: "lienhe@mcbacgiang.com",
      contactType: "customer service",
    },
    offers: {
      "@type": "Offer",
      description: "Khóa học đào tạo MC và kỹ năng giao tiếp chuyên nghiệp",
      category: "Education",
    },
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <h1 className="visually-hidden">
      Trung Tâm MC Q&K – Đào Tạo MC & Kỹ Năng Giao Tiếp Chuyên Nghiệp. Tại Bắc Giang, Bắc Ninh
      </h1>
      <HeroBanner />
      <AboutSection />
      <FeaturedCourses />
      <TeachersSection
        teachers={teachersData.slice(0, 3)}
        title="Đội ngũ giảng viên"
        subtitle="Những chuyên gia hàng đầu trong lĩnh vực MC"
      />
      <OrganicProcess />
      <ScrollingGallery />
      <VideoGallery maxVideos={4} />
      <div className="container mx-auto mt-4">
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase">
             Bài viết mới nhất 
            </h2>
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <FQSection />
      <NewsletterSignup />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  // Lấy bài viết và format
  const raw = await readPostsFromDb(8, 0);
  const posts = formatPosts(raw);

  // SEO meta cho Trung tâm MC Q&K (Bắc Giang & Bắc Ninh)
  const meta = {
    title: "Trung tâm MC Q&K – Đào tạo MC, Giao tiếp, Luyện Giọng tại Bắc Giang & Bắc Ninh",
    description:
      "Q&K chuyên đào tạo MC nhí, MC sự kiện, Luyện giọng, Sửa ngọng và Kỹ năng giao tiếp, thuyết trình. Giúp bạn tự tin chinh phục sân khấu và ống kính tại Bắc Giang, Bắc Ninh.",
    keywords:
      "MC Bắc Giang, MC Bắc Ninh, đào tạo MC Q&K, học MC nhí, kỹ năng thuyết trình, khóa học giao tiếp, luyện giọng nói, sửa ngọng, MC sự kiện, MC Pro",
    robots: "index, follow",
    author: "Trung Tâm Đào tạo MC Q&K Bắc Giang",
    canonical: "https://mcbacgiang.com",
    og: {
      title: "Trung tâm MC Q&K – Đào tạo MC, Giao tiếp, Luyện Giọng, Sửa Ngọng tại Bắc Giang & Bắc Ninh",
      description:
        "Q&K chuyên đào tạo MC nhí, MC sự kiện, Luyện giọng, Sửa ngọng và Kỹ năng giao tiếp, thuyết trình. Giúp bạn tự tin trước đám đông và máy quay tại Bắc Giang & Bắc Ninh.",
      type: "website",
      image: "https://mcbacgiang.com/images/banner-qk-bac-giang.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://mcbacgiang.com",
    },
    twitter: {
      card: "summary_large_image",
      title: "Trung tâm MC Q&K – Đào tạo MC, Giao tiếp, Luyện Giọng, Sửa Ngọng tại Bắc Giang & Bắc Ninh",
      description:
        "Q&K: Khóa MC nhí, MC sự kiện, Luyện Giọng, Sửa Ngọng và Kỹ năng giao tiếp cho người lớn tại Bắc Giang & Bắc Ninh.",
      image: "https://mcbacgiang.com/images/banner-qk-bac-giang.jpg",
    },
  };

  return {
    props: { posts, meta },
  };
}