import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import CourseCard from '../../components/common/CourseCard';
import DefaultLayout from '../../components/layout/DefaultLayout';
import RegistrationPopup from '../../components/common/RegistrationPopup';
import LocationCard from '../../components/common/LocationCard';
import db from '../../utils/db';
import Course from '../../models/Course';
import { trimText } from '../../utils/helper';
import { toCloudinaryUrl } from '../../utils/cloudinary';
import { getLocationInfo, formatLocationsForDisplay } from '../../utils/locationMapping';

const CourseDetail = ({ course, relatedCourses, meta }) => {
  const router = useRouter();
  const { slug } = router.query;
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // JSON-LD structured data for course
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description || "Khóa học MC chất lượng tại Q&K Bắc Giang",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Trung Tâm Đào tạo MC Q&K Bắc Giang",
      "alternateName": "Q&K Bắc Giang",
      "url": "https://mcbacgiang.com",
      "logo": "https://mcbacgiang.com/logoqkbacgiang.png",
      "sameAs": ["https://www.facebook.com/qkbacgiang"],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "VN",
        "addressRegion": "Bắc Ninh",
        "addressLocality": "phường Bắc Giang",
        "streetAddress": "Số 1 Nguyễn Văn Linh"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84-816997000",
        "email": "lienhe@mcbacgiang.com",
        "contactType": "customer service"
      }
    },
    "image": course.image,
    "url": `https://mcbacgiang.com/khoa-hoc/${slug}`,
    "courseCode": course.maKhoaHoc || null,
    "educationalLevel": course.level || "Tất cả cấp độ",
    "timeRequired": course.duration || "5 tuần",
    "numberOfCredits": course.sessions || 0,
    "courseMode": "onsite",
    "location": {
      "@type": "Place",
      "name": course.location || "Q&K Bắc Giang",
      "address": course.location || "Q&K Bắc Giang"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "url": `https://mcbacgiang.com/khoa-hoc/${slug}`
    },
    "aggregateRating": course.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": course.rating,
      "reviewCount": course.reviews || 0,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "inLanguage": "vi",
    "isAccessibleForFree": true,
    "teaches": course.features || [],
    "coursePrerequisites": course.requirements || [],
    "syllabusSections": course.curriculum ? course.curriculum.map(item => ({
      "@type": "Syllabus",
      "name": item.title || item,
      "description": item.description || ""
    })) : []
  };


  // Popup handlers
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };



  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Cơ bản':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Nâng cao':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Chuyên nghiệp':
        return 'bg-pink-200 text-pink-900 border-pink-300';
      default:
        return 'bg-pink-100 text-pink-800 border-pink-200';
    }
  };


  return (
    <DefaultLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      <div className="h-[80px] bg-white"></div>
      <div className="min-h-screen ">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-rose-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center gap-3 text-base">
              <Link href="/khoa-hoc" className="font-semibold text-gray-700 hover:text-pink-600 hover:underline whitespace-nowrap transition-colors duration-200">
                 Khóa học
              </Link>
              <span className="text-pink-400 font-bold text-lg">›</span>
              <span className="font-bold text-gray-800 bg-pink-100 px-1 py-1 rounded-full text-base">
                {trimText(course.title, 30)}
              </span>
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-10 py-2 blog">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Overview */}
              <div className="bg-white">
                <div className="p-6">
                  <div className="">
                    {/* Course Info */}
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                        {course.title}
                      </h1>

                      {/* Course Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          <span className="text-gray-700">
                            <span className="font-semibold">{course.students || 0}</span> học viên
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span className="text-gray-700">
                            <span className="font-semibold">{course.sessions || 0}</span> buổi học
                          </span>
                        </div>


                        {course.rating > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {renderStars(course.rating)}
                              <span className="font-semibold text-gray-700 ml-1">{course.rating}</span>
                              <span className="text-gray-500">({course.reviews || 0} đánh giá)</span>
                            </div>
                          </div>
                        )}
                             <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">
                            <span className="font-semibold">
                              {formatLocationsForDisplay(course.locations)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <div>
                      <div className=" blog max-w-none">
                        {course.content && (
                          <div className="blog  dark:prose-invert max-w-2xl md:max-w-4xl lg:max-w-5xl">
                            {parse(course.content)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Course Features */}
                    {course.features && course.features.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tính năng khóa học</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                              <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                                ✓
                              </div>
                              <span className="text-gray-700 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu tham gia</h3>
                        <ul className="space-y-3">
                          {course.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start space-x-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
                              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {course.faq && course.faq.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu hỏi thường gặp</h2>
                    <div className="space-y-4">
                      {course.faq.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            className="w-full text-left p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                            onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
                              <div className="flex-shrink-0">
                                <svg
                                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${activeAccordion === index ? 'rotate-180' : ''
                                    }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <p className="text-gray-600 pt-4 leading-relaxed">{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Course Details Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                {/* Course Thumbnail */}
                <div className="mb-6">
                  <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                    {(() => {
                      const imageUrl = toCloudinaryUrl(course.image);
                      console.log('Final image URL being used:', imageUrl);
                      return (
                        <Image
                          src={imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            console.log('Image load error, falling back to default');
                            e.target.src = '/images/default-course.jpg';
                          }}
                        />
                      );
                    })()}
                    {/* Course Level Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                        {course.level || 'Tất cả cấp độ'}
                      </span>
                    </div>
                  </div>
                </div>


                {/* Course Details */}
                <div className="mb-6">
                  <b className="text-lg font-semibold text-gray-900 mb-4">Thông tin khóa học</b>
                  <div className="space-y-4">

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Học viên:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{course.students || 0} người</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Buổi học:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{course.sessions || 0} buổi</span>
                    </div>

                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Địa điểm:</span>
                      </div>
                      <div className="text-right flex-1 ml-4">
                        {course.locations && course.locations.length > 0 ? (
                          <div className="space-y-2">
                            {course.locations
                              .sort((a, b) => {
                                // Sắp xếp để CS1 - Hà Nội luôn ở trên
                                if (a === 'CS1 - Hà Nội') return -1;
                                if (b === 'CS1 - Hà Nội') return 1;
                                return a.localeCompare(b);
                              })
                              .map((locationCode, index) => {
                                const locationInfo = getLocationInfo(locationCode);
                                return (
                                  <LocationCard key={index} location={locationInfo} index={index} />
                                );
                              })}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className="font-semibold text-gray-900 text-sm">Chưa cập nhật địa điểm</span>
                            <div className="text-xs text-gray-600 mt-1">
                              Liên hệ hotline: 0988 02 7494 để biết thêm chi tiết
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Lịch học:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{course.schedule || 'Linh hoạt'}</span>
                    </div>

                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleOpenPopup}
                  className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg mb-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  Đăng ký ngay
                </button>

                {/* Contact Info */}
                <div className="p-2 bg-gray-50 rounded-lg">
                  <b className="font-semibold text-base text-gray-900 mb-3">Cần hỗ trợ?</b>
                  <p className="text-base text-gray-600 mb-3">Liên hệ chúng tôi để được tư vấn chi tiết</p>
                  <div className="space-y-2 text-base">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Hotline: 081.6997.000</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email: lienhe@mcbacgiang.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <b className="text-2xl font-bold text-gray-900 mb-4">Khóa học bạn có thể quan tâm</b>
          </div>

          {relatedCourses.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
              {relatedCourses.map((relatedCourse) => (
                <CourseCard
                  key={relatedCourse.id}
                  course={relatedCourse}
                  variant="default"
                  showFullFeatures={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <b className="text-lg font-semibold text-gray-800 mb-2">Chưa có khóa học liên quan</b>
              <p className="text-gray-600 mb-6">Hiện tại chưa có khóa học nào khác</p>
              <Link href="/khoa-hoc" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors">
                Xem tất cả khóa học
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
        courseSlug={slug}
      />
    </DefaultLayout>
  );
};

export default CourseDetail;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  
  try {
    await db.connectDb();
    
    // Fetch course data directly from database
    const course = await Course.findOne({ slug, isDeleted: { $ne: true } })
      .select('-instructor -instructorRole -category -targetAge -price -discount -badge -isActive');
    
    if (!course) {
      return { notFound: true };
    }



    // Fetch related courses (random, excluding current course)
    const allCourses = await Course.find({
      _id: { $ne: course._id },
      isDeleted: { $ne: true }
    })
      .select('title slug image level students sessions rating reviews maKhoaHoc duration schedule location');
    
    // Shuffle and take first 3 courses
    const shuffled = allCourses.sort(() => 0.5 - Math.random());
    const relatedCourses = shuffled.slice(0, 3);

    // Transform related courses data
    const transformedRelatedCourses = relatedCourses.map(course => ({
      id: course._id.toString(),
      title: course.title || 'Khóa học',
      description: course.description || course.subtitle || '',
      instructor: 'Q&K Bắc Giang',
      instructorRole: 'Giảng viên',
      category: course.level || 'Tất cả cấp độ',
      lessons: course.sessions || 0,
      videos: 0,
      students: course.students || 0,
      rating: course.rating || 4.8,
      reviews: course.reviews || Math.floor(Math.random() * 50) + 10,
      price: 0,
      discount: 0,
      image: course.image,
      badge: course.isNew ? 'Mới' : (course.isFeatured ? 'Nổi bật' : ''),
      enrolledStudents: course.students || 0,
      courseType: 'offline',
      duration: course.duration || '8 tuần',
      schedule: course.schedule || 'Linh hoạt',
      location: course.location || 'Q&K Bắc Giang',
      slug: course.slug || course._id.toString(),
      maKhoaHoc: course.maKhoaHoc || null,
      level: course.level || null,
      curriculum: course.curriculum || [],
      features: course.features || [],
      requirements: course.requirements || [],
      faq: course.faq || []
    }));

    // Create meta data
    const metaData = {
      title: `${course.title} - Q&K Bắc Giang`,
      description: course.description || course.subtitle || 'Khóa học chất lượng tại Trung Tâm Đào tạo MC Q&K Bắc Giang',
      author: 'Trung Tâm Đào tạo MC Q&K Bắc Giang',
      canonical: `https://mcbacgiang.com/khoa-hoc/${slug}`,
      og: {
        title: `${course.title} - Q&K Bắc Giang`,
        description: course.description || course.subtitle || 'Khóa học chất lượng tại Trung Tâm Đào tạo MC Q&K Bắc Giang',
        type: 'website',
        image: course.image,
        imageWidth: '1200',
        imageHeight: '630',
        url: `https://mcbacgiang.com/khoa-hoc/${slug}`,
        siteName: 'Trung Tâm Đào tạo MC Q&K Bắc Giang',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${course.title} - Q&K Bắc Giang`,
        description: course.description || course.subtitle || 'Khóa học chất lượng tại Trung Tâm Đào tạo MC Q&K Bắc Giang',
        image: course.image,
      },
    };

    return {
      props: {
        course: JSON.parse(JSON.stringify(course)),
        relatedCourses: transformedRelatedCourses,
        meta: metaData,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
}