"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, BookOpen } from "lucide-react";
import VoiceTestPopup from "./VoiceTestPopup";

const HeroBanner = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const stats = useMemo(
    () => [
      { label: "Học viên", value: "1000+" },
      { label: "Khóa học", value: "10+" },
    ],
    []
  );

  const benefits = useMemo(
    () => [
      "Cải thiện giọng nói",
      "Tự tin trước đám đông",
      "Giải phóng hình thể",
      "Xử lý tình huống",
    ],
    []
  );

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-40 -right-20 w-[420px] h-[420px] bg-gradient-to-br from-rose-200 to-pink-200 blur-3xl rounded-full" />
        <div className="absolute top-20 -left-32 w-[380px] h-[380px] bg-gradient-to-br from-pink-200 to-rose-100 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-rose-200 to-pink-100 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-24 lg:pt-20 md:pb-16 pb-6 min-h-screen lg:grid lg:grid-cols-2 lg:items-center md:gap-10 gap-1 items-center flex flex-col justify-center">
        <div className="space-y-8 text-center lg:text-left order-1 lg:order-1">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-rose-100 px-4 py-2 rounded-full shadow-sm">
            <span className="text-pink-500 text-xl">💡</span>
            <span className="text-sm font-semibold text-pink-500">
              Bắt đầu hành trình mới
              </span>
          </div>

          <div className="space-y-3">
            <p className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight">
              <span className="block text-slate-900">
                Trung tâm MC{" "}
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Q&amp;K Bắc Giang
                </span>
              </span>
              <span className="block text-slate-900">Nâng tầm kỹ năng</span>
            </p>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Nhiều lựa chọn khóa học, luyện giọng và kỹ năng giao tiếp với đội
              ngũ MC chuyên nghiệp. Hình nền và hình ảnh đã sẵn sàng để bạn tỏa
              sáng.
            </p>
              </div>
              
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-white/85 backdrop-blur-lg border border-rose-100 rounded-2xl px-4 py-3 shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center">
                  {item.label === "Học viên" ? (
                    <Users size={18} strokeWidth={2.4} />
                  ) : (
                    <BookOpen size={18} strokeWidth={2.4} />
                  )}
                </div>
                      <div>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
            <button 
              onClick={handleOpenPopup}
              className="flex-1 sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 sm:px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
           Test Giọng Ngay
            </button>
            <Link
              href="/khoa-hoc"
              className="flex-1 sm:flex-none"
            >
              <button className="w-full bg-white text-slate-800 px-4 sm:px-8 py-4 rounded-2xl font-semibold border border-rose-100 shadow-lg hover:shadow-xl hover:border-pink-300 transition-all text-sm sm:text-base">
                Tìm hiểu khóa học
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0 hidden lg:grid">
            {benefits.map((item) => (
              <div
                key={item}
                className="bg-white/90 backdrop-blur-lg border border-rose-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-4 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md transition-all text-center min-h-[72px] flex items-center justify-center hover:-translate-y-0.5"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative md:mt-12 mt-1 order-2 lg:order-2">
          <div className="relative max-w-full mx-auto">
            <div className="relative overflow-hidden">
              <Image
                src="/images/doi-ngu-giang-vien.webp"
                  alt="Đội Ngũ Giảng Viên"
                  width={900}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
          </div>

       
            
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0 order-3 lg:hidden">
          {benefits.map((item) => (
            <div
              key={item}
              className="bg-white/90 backdrop-blur-lg border border-rose-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-4 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md transition-all text-center min-h-[72px] flex items-center justify-center hover:-translate-y-0.5"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <VoiceTestPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </section>
  );
};

export default HeroBanner;