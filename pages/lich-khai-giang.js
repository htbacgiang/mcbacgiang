import React, { useState, Suspense } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import DefaultLayout from '../components/layout/DefaultLayout';
import { FaCalendarAlt, FaList, FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';
import RegistrationPopup from '../components/common/RegistrationPopup';

// Lazy load components for better performance - use opening-specific components
const OpeningCalendarView = dynamic(() => import('../components/common/OpeningCalendarView'), { ssr: false });
const OpeningScheduleList = dynamic(() => import('../components/common/OpeningScheduleList'), { ssr: false });

export default function ClassSchedulePage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = useState(false);

  const handleMonthChange = (year, month) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const meta = {
    title: `Lịch khai giảng ${currentMonth}/${currentYear} - Trung tâm MC Q&K Bắc Giang | Khóa học MC Bắc Giang, Bắc Ninh`,
    description: `Khám phá lịch khai giảng tháng ${currentMonth}/${currentYear} tại Trung tâm MC Q&K Bắc Giang. Đăng ký khóa học MC, luyện giọng, sửa ngọng chuyên nghiệp với giảng viên hàng đầu từ VTV, VTC.`,
    keywords: `lịch khai giảng ${currentMonth}/${currentYear}, Q&K Bắc Giang, khóa học MC Bắc Giang, đào tạo MC chuyên nghiệp, luyện giọng Bắc Giang, sửa ngọng Bắc Giang, MC nhí Bắc Giang, học MC tại Bắc Giang`,
    robots: "index, follow",
    author: "Trung tâm MC Q&K Bắc Giang",
    canonical: `https://mcbacgiang.com/lich-khai-giang/${currentYear}/${currentMonth}`,
    og: {
      title: `Lịch khai giảng ${currentMonth}/${currentYear} - Trung tâm MC Q&K Bắc Giang`,
      description: `Xem lịch khai giảng các khóa học MC, luyện giọng, sửa ngọng tháng ${currentMonth}/${currentYear} tại Trung tâm MC Q&K Bắc Giang.`,
      type: "website",
      image: "https://mcbacgiang.com/images/banner-qk-bac-giangg.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: `https://mcbacgiang.com/lich-khai-giang/${currentYear}/${currentMonth}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Lịch khai giảng ${currentMonth}/${currentYear} - Trung tâm MC Q&K Bắc Giang`,
      description: `Xem lịch khai giảng các khóa học MC, luyện giọng, sửa ngọng tháng ${currentMonth}/${currentYear} tại Trung tâm MC Q&K Bắc Giang.`,
      image: "https://mcbacgiang.com/images/banner-qk-bac-giang.jpg",
    },
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={meta.og.title} />
        <meta property="og:description" content={meta.og.description} />
        <meta property="og:type" content={meta.og.type} />
        <meta property="og:image" content={meta.og.image} />
        <meta property="og:image:width" content={meta.og.imageWidth} />
        <meta property="og:image:height" content={meta.og.imageHeight} />
        <meta property="og:url" content={meta.og.url} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />
        
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* JSON-LD Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Trung Tâm Đào Tạo MC Q&K Bắc Giang",
              alternateName: "MC Q&K Bắc Giang",
              url: `https://mcbacgiang.com/lich-khai-giang/${currentYear}/${currentMonth}`,
              description: `Lịch khai giảng các khóa học đào tạo MC, luyện giọng, sửa ngọng tháng ${currentMonth}/${currentYear} tại Bắc Giang, Bắc Ninh`,
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
                addressLocality: "tỉnh Bắc Ninh",
                addressRegion: "Bắc Giang",
                streetAddress: "Số 1 Nguyễn Văn Linh, Phường Bắc Giang, tỉnh Bắc Ninh",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-816-997-000",
                contactType: "Customer Service",
              },
              offers: {
                "@type": "Offer",
                description: `Khóa học đào tạo MC, luyện giọng, sửa ngọng tháng ${currentMonth}/${currentYear}`,
                category: "Education",
                priceCurrency: "VND",
                price: "Liên hệ",
              },
              hasCourse: [
                {
                  "@type": "Course",
                  name: `Khóa học MC chuyên nghiệp tháng ${currentMonth}/${currentYear}`,
                  description: "Khóa học đào tạo kỹ năng dẫn chương trình, luyện giọng, sửa ngọng chuyên nghiệp tại Bắc Giang, Bắc Ninh.",
                  provider: {
                    "@type": "EducationalOrganization",
                    name: "Trung Tâm Đào Tạo MC Q&K Bắc Giang",
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <div className="h-[80px] bg-white"></div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                Lịch khai giảng khóa học MC tháng {currentMonth}/{currentYear}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              
            </div>
            
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm md:text-base rounded-md transition-colors duration-200 ${
                  viewMode === 'calendar'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-pressed={viewMode === 'calendar'}
                aria-label="Chuyển sang chế độ xem lịch"
              >
                <FaCalendarAlt aria-hidden="true" />
                <span>Lịch</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm md:text-base rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-pressed={viewMode === 'list'}
                aria-label="Chuyển sang chế độ xem danh sách"
              >
                <FaList aria-hidden="true" />
                <span>Danh sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Lịch khai giảng các khóa học MC, luyện giọng, sửa ngọng chuyên nghiệp
          </h2>
          <p className="text-gray-600">
            Trung tâm MC Q&K Bắc Giang cung cấp các khóa học đào tạo MC, luyện giọng, sửa ngọng và kỹ năng giao tiếp chuyên nghiệp tại Bắc Giang, Bắc Ninh. Với đội ngũ giảng viên giàu kinh nghiệm từ VTV, VTC và giáo trình thực tiễn, chúng tôi giúp bạn tự tin tỏa sáng trên sân khấu và trong giao tiếp. Xem lịch khai giảng (buổi học đầu tiên) tháng {currentMonth}/{currentYear} dưới đây và đăng ký ngay!
          </p>
        </section>
        <Suspense fallback={<div className="text-center text-gray-600">Đang tải...</div>}>
          {viewMode === 'calendar' ? (
            <OpeningCalendarView
              year={currentYear}
              month={currentMonth}
              onMonthChange={handleMonthChange}
            />
          ) : (
            <OpeningScheduleList
              year={currentYear}
              month={currentMonth}
            />
          )}
        </Suspense>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng bắt đầu hành trình MC của bạn?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Đăng ký ngay để được tư vấn miễn phí và chọn lớp học phù hợp nhất với lịch trình của bạn.{' '}
            <br />
            <Link href="/khoa-hoc" className="text-pink-600 hover:underline">
              Xem tất cả khóa học
            </Link>{' '}
           
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setIsRegistrationPopupOpen(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Đăng ký ngay
            </button>
            <Link
              href="/lien-he"
              className="bg-white hover:bg-gray-50 text-pink-600 border border-pink-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup
        isOpen={isRegistrationPopupOpen}
        onClose={() => setIsRegistrationPopupOpen(false)}
        courseSlug="mc-course"
      />
    </DefaultLayout>
  );
}

// Optional: Use getStaticProps for pre-fetching data if schedules are static or ISR
// export async function getStaticProps() {
//   // Fetch schedules data here if needed
//   return {
//     props: {},
//     revalidate: 86400, // Revalidate every 24 hours
//   };
// }