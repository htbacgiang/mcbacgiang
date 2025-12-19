import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube,
  FaClock,
  FaAward
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Về Q&K Bắc Giang", href: "/gioi-thieu-trung-tam-qk-bac-giang" },
      { name: "Lịch khai giảng", href: "/lich-khai-giang" },
    ],
    services: [
      { name: "Giao tiếp – thuyết trình", href: "/khoa-hoc/giao-tiep-thuyet-trinh" },
      { name: "Khóa học giọng nói", href: "/khoa-hoc/khoa-hoc-giong-noi" },
      { name: "MC Sự kiện", href: "/khoa-hoc/mc-su-kien" },
      { name: "MC Nâng cao - Pro Talk", href: "/khoa-hoc/mc-nang-cao-pro-talk" },
      { name: "MC Nhí", href: "/khoa-hoc/mc-nhi" },
      { name: "MC Nhí Nâng cao", href: "/khoa-hoc/mc-nhi-nang-cao" }
    ],
    support: [
      { name: "Liên hệ", href: "/lien-he" },
      { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
      { name: "Khóa học & học phí", href: "/chinh-sach-khoa-hoc-hoc-phi" },
      { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" }
    ]
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: FaFacebookF, 
      href: "https://facebook.com/daotaomcbacgiang",
      color: "hover:bg-blue-600"
    },
    { 
      name: "Instagram", 
      icon: FaInstagram, 
      href: "https://instagram.com/qkmcbacgiang",
      color: "hover:bg-pink-600"
    },
    { 
      name: "YouTube", 
      icon: FaYoutube, 
      href: "https://youtube.com/@qkmcbacgiang",
      color: "hover:bg-red-600"
    },
    { 
      name: "TikTok", 
      icon: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      ), 
      href: "https://tiktok.com/@qkmcbacgiang",
      color: "hover:bg-red-600"
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50 text-gray-900">
      <div className="absolute inset-0 opacity-70 pointer-events-none">
        <div className="absolute -top-40 -right-20 w-[420px] h-[420px] bg-gradient-to-br from-rose-200 to-pink-200 blur-3xl rounded-full" />
        <div className="absolute top-20 -left-32 w-[380px] h-[380px] bg-gradient-to-br from-pink-200 to-rose-100 blur-3xl rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-gradient-to-br from-rose-200 to-pink-100 blur-3xl rounded-full" />
      </div>

      {/* Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className=" group">
                  <Link href="/" className="inline-block">
                    <div className="flex items-center justify-center">
                      <div className="w-auto h-20 rounded-xl overflow-hidden">
                        <Image
                          src="/logoqkbacgiang.png"
                          alt="Trung Tâm MC Q&K Bắc Giang Logo"
                          width={240}
                          height={64}
                          className="h-full w-auto object-contain"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Trung Tâm MC Q&K Bắc Giang là trung tâm đào tạo MC hàng đầu tại Bắc Giang, Bắc Ninh với các khóa học chất lượng cao, giúp học viên phát triển kỹ năng MC, giọng nói và tự tin trước đám đông.
                </p>

                {/* Awards & Certifications */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaAward className="text-pink-600" />
                    <span className="text-base text-gray-700">Trung tâm đào tạo MC uy tín</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaAward className="text-pink-600" />
                    <span className="text-base text-gray-700">Đội ngũ giảng viên chuyên nghiệp</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Company */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-gray-900 hover:text-pink-600 transition-colors duration-300">Công ty</p>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-700 hover:text-pink-600 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-gray-900 hover:text-pink-600 transition-colors duration-300">Khóa học</p>
                    <ul className="space-y-3">
                      {footerLinks.services.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-700 hover:text-pink-600 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-gray-900 hover:text-pink-600 transition-colors duration-300">Hỗ trợ</p>
                    <ul className="space-y-3">
                      {footerLinks.support.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-700 hover:text-pink-600 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-1">
                <p className="text-lg font-bold mb-6 text-gray-900 hover:text-pink-600 transition-colors duration-300">Liên hệ</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-pink-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">
                        Trung Tâm MC Q&K Bắc Giang<br />
                        Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-pink-600 flex-shrink-0" />
                    <div>
                      <a 
                        href="tel:0816997000" 
                        className="text-gray-700 hover:text-pink-600 transition-colors"
                      >
                        081.6997.000
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-pink-600 flex-shrink-0" />
                    <div>
                      <a 
                        href="mailto:contact@qkmcbacgiang.com" 
                        className="text-gray-700 hover:text-pink-600 transition-colors"
                      >
                        lienhe@mcbacgiang.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-pink-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">
                        T2-T7: 8:00 - 21:00<br />
                        CN: 9:00 - 22:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <p className="font-bold mb-4 text-gray-900">Kết nối với chúng tôi</p>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      const isTikTok = social.name === "TikTok";
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 bg-white/80 backdrop-blur-lg border border-rose-100 ${isTikTok ? 'hover:bg-black' : 'hover:bg-pink-600'} rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:scale-110 hover:shadow-lg group`}
                          aria-label={social.name}
                        >
                          {isTikTok ? (
                            <Icon />
                          ) : (
                            <Icon className="text-gray-700 group-hover:text-white transition-colors duration-300" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <p className="text-gray-700 font-bold">
                  © {currentYear} Trung Tâm MC Q&K Bắc Giang
                </p>
            
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-end space-x-6">
                <Link 
                  href="/chinh-sach-bao-mat" 
                  className="text-gray-700 hover:text-pink-600 transition-colors text-sm"
                >
                  Chính sách bảo mật
                </Link>
                <Link 
                  href="/dieu-khoan-su-dung" 
                  className="text-gray-700 hover:text-pink-600 transition-colors text-sm"
                >
                  Điều khoản sử dụng
                </Link>
             
              </div>
            </div>
          </div>
        </div>

        {/* Company Brand Statement */}
        <div className="border-t border-pink-200 py-4 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-700 text-base">
                Trung Tâm MC Q&K Bắc Giang - Nâng tầm kỹ năng MC và giọng nói
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
