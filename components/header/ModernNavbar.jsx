"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import ResponsiveMenu from "./ResponsiveNavbar";
import RegistrationPopup from "../common/RegistrationPopup";

const ModernNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Trang chủ", href: "/", hasDropdown: false },
    { name: "Giới thiệu", href: "/gioi-thieu-trung-tam-qk-bac-giang", hasDropdown: false },
    { name: "Khóa học", href: "/khoa-hoc", hasDropdown: true },
    { name: "Lịch khai giảng", href: "/lich-khai-giang", hasDropdown: false },
    { name: "Bài viết", href: "/bai-viet", hasDropdown: false },
    { name: "Liên hệ", href: "/lien-he", hasDropdown: false },
  ];

  return (
    <>

      {/* Main Navigation */}
      <nav className={`fixed w-full z-[9990] transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-lg" 
          : "bg-white"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="rounded-lg flex items-center justify-center mr-6 ">
                  <Image 
                    src="/logoqkbacgiang.png" 
                    alt="BT Academy Logo" 
                    width={120} 
                    height={80}
                    className="object-contain"
                  />
                </div>
              
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 uppercase">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => {
                    if (item.hasDropdown) {
                      setActiveDropdown(item.name);
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.hasDropdown ? (
                    <button
                      className="flex items-center space-x-1 text-black hover:text-gray-900 font-bold transition-colors duration-200"
                    >
                      <span className="uppercase">{item.name}</span>
                      <HiChevronDown className={`text-sm text-gray-500 transition-all duration-300 ${
                        activeDropdown === item.name ? 'rotate-180 text-pink-600' : 'group-hover:text-pink-600'
                      }`} />
                    </button>
                  ) : (
                  <Link 
                    href={item.href}
                    className="flex items-center space-x-1 text-black hover:text-gray-900 font-bold transition-colors duration-200"
                  >
                      <span className="uppercase">{item.name}</span>
                    </Link>
                  )}
                  
                  {/* Invisible bridge for hover */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 w-full h-2 bg-transparent z-40"></div>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-4 opacity-100 transform translate-y-0 transition-all duration-300 ease-out z-50"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      
                      {/* Dropdown Items */}
                      <div className="space-y-1">
                        {item.name === "Khóa học" ? (
                          <>
                            <Link 
                              href="/khoa-hoc/giao-tiep-thuyet-trinh" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">Giao tiếp – thuyết trình</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                            <Link 
                              href="/khoa-hoc/khoa-hoc-giong-noi" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">Khóa học giọng nói</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                        </Link>
                            
                            <Link 
                              href="/khoa-hoc/mc-su-kien" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">MC Sự kiện</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                            
                       
                            <Link 
                              href="/khoa-hoc/mc-nang-cao-pro-talk" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">MC Nâng cao - Pro Talk</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                      </Link>
                      <Link 
                              href="/khoa-hoc/mc-nhi" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">MC Nhí</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                      </Link>
                            <Link 
                              href="/khoa-hoc/mc-nhi-nang-cao" 
                              className="group/item dropdown-item flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-200 relative overflow-hidden"
                            >
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                              <span className="font-bold uppercase">MC Nhí Nâng cao</span>
                              <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                      </Link>
                          </>
                        ) : null}
                      </div>
                  
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Join Now Button */}
            <div className="hidden lg:block">
              <button 
                onClick={handleOpenPopup}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Đăng ký ngay
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-pink-600 focus:outline-none rounded-lg hover:bg-pink-50 transition-all duration-200"
              >
                <HiOutlineMenu className="h-6 w-6" />
              </button>
            </div>
          </div>


        </div>
      </nav>
      
      {/* Responsive Mobile Menu */}
      <ResponsiveMenu 
        isOpen={isMobileMenuOpen} 
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onRegisterClick={handleOpenPopup}
      />
      
      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
      />
    </>
  );
};

export default ModernNavbar;
