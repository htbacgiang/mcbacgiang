"use client";
import React from "react";
import Image from "next/image";
import { toCloudinaryUrl } from '../../utils/cloudinary';
import Link from "next/link";
import coursesData from '../../data/courses.json';

// Gradient styles to ensure cross-browser compatibility
const gradientPurpleBlue = {
  background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  fontWeight: 'inherit'
};

const gradientBlueGreen = {
  background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)',
  backgroundSize: '100%',
  backgroundRepeat: 'repeat',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  MozBackgroundClip: 'text',
  MozTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block',
  fontWeight: 'inherit'
};

const MCCoursesSection = () => {
  // Transform course data from JSON to display format
  const courses = coursesData.slice(0, 3).map(course => ({
    id: course.id,
    title: course.title,
    description: course.subtitle,
    duration: course.duration,
    level: course.level,
    image: toCloudinaryUrl(course.image),
    slug: course.id,
    features: course.features ? course.features.slice(0, 4) : [
      "Giảng viên chuyên nghiệp",
      "Thực hành thực tế",
      "Chứng chỉ hoàn thành",
      "Hỗ trợ sau khóa học"
    ]
  }));

  const highlights = [
    "Giảng viên có 10+ năm kinh nghiệm",
    "Thực hành trên sân khấu thật",
    "Chứng chỉ được công nhận",
    "Hỗ trợ tìm việc sau tốt nghiệp"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase">
              Khóa học MC chuyên nghiệp
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Các khóa học{" "}
            <span style={gradientPurpleBlue}>
              MC
            </span>{" "}
            tại{" "}
            <span style={gradientBlueGreen}>
              BT Academy
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Từ MC cơ bản đến chuyên nghiệp, chúng tôi có đầy đủ các khóa học để giúp bạn 
            phát triển kỹ năng dẫn chương trình một cách toàn diện.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {courses.map((course, index) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              {/* Course Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <Image
                  src={toCloudinaryUrl(course.image)}
                  alt={course.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                    {course.duration}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA only (price hidden) */}
                <div className="border-t border-gray-200 pt-4">
                  
                  <Link href={`/khoa-hoc/${course.slug}`}>
                    <button 
                      className="w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)'
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Why Choose Us */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium tracking-wider uppercase">
                  Tại sao chọn chúng tôi
                </span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Điểm nổi bật của{" "}
                <span style={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  khóa học MC
                </span>{" "}
                tại BT Academy
              </h3>
              
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Stats & Image */}
            <div className="relative">
              {/* Decorative dots */}
              <div className="absolute -top-6 -right-6 grid grid-cols-4 gap-2 opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-purple-500 rounded-full"></div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl p-3 shadow-xl">
                <Image
                  src="/images/mc-training-class.jpg"
                  alt="MC Training Class at BT Academy"
                  width={500}
                  height={350}
                  className="w-full h-auto rounded-xl object-cover"
                />
                
                {/* Achievement Card */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                      <div className="text-sm text-gray-600">Đánh giá khóa học</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-400 rounded-full opacity-80"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-green-400 rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Khóa học chính</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">200+</div>
              <div className="text-sm text-gray-600">Học viên mỗi năm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Tỷ lệ có việc làm</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">24/7</div>
              <div className="text-sm text-gray-600">Hỗ trợ học viên</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MCCoursesSection;
