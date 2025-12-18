import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";
import ContactPage from "../../components/common/ContactPage";

export default function LienHe({ meta }) {
  // JSON-LD Schema.org cho trang liên hệ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Liên hệ Trung tâm MC Q&K Bắc Giang",
    "description": "Liên hệ với Trung tâm MC Q&K Bắc Giang để được tư vấn về các khóa học đào tạo MC, luyện giọng, sửa ngọng và kỹ năng giao tiếp. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn.",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Trung Tâm Đào Tạo MC Q&K Bắc Giang",
      "alternateName": "MC Q&K Bắc Giang",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Số 1 Nguyễn Văn Linh, Phường Bắc Giang",
        "addressLocality": "Bắc Ninh",
        "addressRegion": "Bắc Ninh",
        "addressCountry": "VN"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+84-816-997-000",
          "contactType": "customer service",
          "availableLanguage": ["Vietnamese"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "21:00"
          }
        }
      ],
      "sameAs": [
        "https://www.facebook.com/daotaomcbacgiang"
      ]
    }
  };

  return (
    <DefaultLayout 
      title={meta?.title}
      desc={meta?.description}
      thumbnail={meta?.og?.image}
      meta={meta}
    >
      <Head>
        {/* JSON-LD Schema.org cho trang Liên hệ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <h1 className="visually-hidden">
        Liên hệ Trung tâm MC Q&K Bắc Giang - Tư vấn khóa học đào tạo MC, luyện giọng, sửa ngọng
      </h1>
      
      <ContactPage />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Liên hệ Trung tâm MC Q&K Bắc Giang - Tư vấn khóa học đào tạo MC, luyện giọng, sửa ngọng",
    description:
      "Liên hệ ngay với Trung tâm MC Q&K Bắc Giang để được tư vấn về các khóa học đào tạo MC, luyện giọng, sửa ngọng và kỹ năng giao tiếp. Hotline: 081 699 7000. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn.",
    keywords:
      "liên hệ Q&K Bắc Giang, tư vấn khóa học MC, hotline Q&K Bắc Giang, địa chỉ Q&K Bắc Giang, đào tạo MC Bắc Giang, luyện giọng Bắc Giang, sửa ngọng Bắc Giang, MC nhí Bắc Giang",
    robots: "index, follow",
    author: "Trung tâm MC Q&K Bắc Giang",
    canonical: "https://mcbacgiang.com/lien-he",
    og: {
      title: "Liên hệ Trung tâm MC Q&K Bắc Giang - Tư vấn khóa học đào tạo MC, luyện giọng, sửa ngọng",
      description:
        "Liên hệ ngay với Trung tâm MC Q&K Bắc Giang để được tư vấn về các khóa học đào tạo MC, luyện giọng, sửa ngọng và kỹ năng giao tiếp. Hotline: 081 699 7000. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn.",
      type: "website",
      image: "https://mcbacgiang.com/images/trung-tam-qk-bac-giang.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://mcbacgiang.com/lien-he",
    },
    twitter: {
      card: "summary_large_image",
      title: "Liên hệ Trung tâm MC Q&K Bắc Giang - Tư vấn khóa học đào tạo MC, luyện giọng, sửa ngọng",
      description:
        "Liên hệ ngay với Trung tâm MC Q&K Bắc Giang để được tư vấn về các khóa học đào tạo MC, luyện giọng, sửa ngọng và kỹ năng giao tiếp. Hotline: 081 699 7000. Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn.",
      image: "https://mcbacgiang.com/images/trung-tam-qk-bac-giang.jpg",
    },
  };

  return {
    props: {
      meta,
    },
  };
}