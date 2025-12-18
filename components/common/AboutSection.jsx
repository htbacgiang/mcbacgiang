"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutSection = () => {
  return (
    <section className="py-8 md:py-12 lg:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center relative">
          {/* Images Section - Order 2 on mobile (below text), order 1 on desktop (left side) */}
          <div className="relative order-2 lg:order-1">
            {/* Mobile & Desktop: Two images with decorative elements */}
            <div className="flex items-start justify-center gap-3 md:gap-4 mt-4 md:mt-8 pb-8 md:pb-20">
            {/* Left Image - Higher position */}
              <div className="relative w-44 h-56 md:w-72 md:h-96 -mt-2 md:-mt-8 group">
              <Image
                src="/images/co-quyen.jpg"
                alt="MC Training at BT Academy"
                fill
                  className="object-cover shadow-lg rounded-tr-xl md:rounded-tr-3xl rounded-bl-xl md:rounded-bl-3xl transition-transform duration-300 group-hover:scale-105"
              />
                {/* Decorative dotted line - hidden on mobile */}
                <div className="hidden md:block absolute -left-6 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-3">
                <div className="w-6 h-1 bg-pink-400 opacity-60" style={{
                  backgroundImage: 'radial-gradient(circle, #f472b6 1px, transparent 1px)',
                  backgroundSize: '6px 3px'
                }}></div>
              </div>
                {/* Pink dashed arc - smaller on mobile */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-12 md:h-12 border-2 border-pink-400 border-dashed rounded-full opacity-60 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            </div>

            {/* Right Image - Lower position */}
              <div className="relative w-40 h-52 md:w-60 md:h-80 mt-4 md:mt-12 group">
              <Image
                src="/images/co-quyen-2.jpg"
                alt="MC Training at BT Academy"
                fill
                  className="object-cover shadow-lg rounded-tl-xl md:rounded-tl-3xl rounded-br-xl md:rounded-br-3xl transition-transform duration-300 group-hover:scale-105"
              />
         
                {/* Pink dotted arc - smaller on mobile */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-5 h-5 md:w-10 md:h-10 border-2 border-pink-400 border-dotted rounded-full opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-10"></div>
                {/* Pink blob shape - hidden on mobile */}
                <div className="hidden md:block absolute -left-6 top-6 w-12 h-12 bg-pink-300 rounded-full opacity-40 transition-transform duration-300 group-hover:-translate-x-2 group-hover:translate-y-1"></div>
            </div>

              {/* Wavy line decoration - smaller on mobile */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 md:translate-y-8">
                <svg width="60" height="12" viewBox="0 0 80 16" fill="none" className="md:w-20 md:h-4">
                <path d="M2 8C8 4 16 12 24 8C32 4 40 12 48 8C56 4 64 12 72 8C76 6 78 8" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              </div>
            </div>
          </div>

          {/* Text Content - Order 1 on mobile (above images), order 2 on desktop (right side) */}
          <div className="space-y-4 md:space-y-6 relative z-10 order-1 lg:order-2">
            {/* Pink Badge with Icon */}
            <div className="inline-block">
              <span 
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold text-white flex items-center gap-1.5 md:gap-2 w-fit"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                }}
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Giới Thiệu
              </span>
            </div>

            {/* Main Heading with colored words */}
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
                <span className="text-pink-500">Trung tâm MC Q&K Bắc Giang:</span>
              </h2>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold leading-tight text-slate-900">
                Con đường đến sự{" "}
                <span 
                  className="px-1.5 py-0.5 md:px-2 md:py-1 text-white rounded text-lg md:text-base"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                  }}
                >
                  Xuất sắc
                </span>{" "}
                trong Giao tiếp
              </h3>
              
              <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                Chúng tôi đào tạo những MC và diễn giả tự tin, chuyên nghiệp với khả năng giao tiếp xuất sắc, 
                giúp bạn tỏa sáng ở mọi nơi bạn đến.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              {/* Flexible Learning Card */}
              <div className="bg-gray-100 rounded-lg md:rounded-xl p-2.5 md:p-4">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                    }}
                  >
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs md:text-sm text-gray-900">Thời gian Linh Hoạt</h3>
                    <p className="text-[10px] md:text-sm text-gray-600 leading-tight">Học mọi lúc mọi nơi theo lịch trình của bạn</p>
                  </div>
                </div>
              </div>

              {/* 24/7 Support Card */}
              <div className="bg-gray-100 rounded-lg md:rounded-xl p-2.5 md:p-4">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                    }}
                  >
                    <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs md:text-sm text-gray-900">Hỗ Trợ Trọn Đời</h3>
                    <p className="text-[10px] md:text-sm text-gray-600 leading-tight">Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 md:pt-4">
              <Link href="/gioi-thieu-trung-tam-qk-bac-giang">
                <button 
                  className="text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-1.5 md:gap-2 w-full md:w-auto justify-center md:justify-start"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                  }}
                >
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
