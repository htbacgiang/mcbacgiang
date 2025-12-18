import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaRegUser, FaHeart, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { HiOutlineSearch, HiOutlineHome, HiOutlineBookOpen, HiOutlineDocumentText, HiOutlinePhone, HiOutlineCalendar, HiOutlineVideoCamera } from "react-icons/hi";

const ResponsiveMenu = ({ isOpen, toggleMenu, onRegisterClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Trang chủ", link: "/", icon: HiOutlineHome, hasDropdown: false },
    { name: "Giới thiệu", link: "/gioi-thieu-trung-tam-qk-bac-giang", icon: FaRegUser, hasDropdown: false },
    { name: "Khóa học", link: "/khoa-hoc", icon: HiOutlineBookOpen, hasDropdown: true },
    { name: "Lịch khai giảng", link: "/lich-khai-giang", icon: HiOutlineCalendar, hasDropdown: false },
    { name: "Bài viết", link: "/bai-viet", icon: HiOutlineDocumentText, hasDropdown: false },
    { name: "Liên hệ", link: "/lien-he", icon: HiOutlinePhone, hasDropdown: false },
  ];

  return (
    <>
      {/* Modern Overlay with Pink styling */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-pink-50/30 via-rose-50/20 to-pink-100/30 backdrop-blur-md z-[99999] transition-all duration-700 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Modern Sidebar Menu with Pink design */}
      <div
        className={`fixed top-0 left-0 w-[80%] max-w-md h-full bg-white/95 backdrop-blur-xl shadow-2xl z-[999999] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-700 ease-out overflow-hidden border-r border-rose-100`}
      >
        {/* BT Academy Header with pink gradient */}
        <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-histudy-logo flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">QK</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl"> Q&K Bắc Giang</span>
                <p className="text-white/80 text-xs">Học tập thông minh</p>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 group border border-white/20"
            >
              <AiOutlineClose
                size={20}
                className="text-white group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Modern Search with Pink styling */}
        <div className="p-6 border-b border-rose-100 bg-gradient-to-r from-pink-50/50 via-white to-rose-50/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full px-4 py-4 pl-14 bg-white border-2 border-rose-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            <HiOutlineSearch
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                <HiOutlineSearch className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Menu Items with BT Academy styling */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-6 py-1">
            {menuItems.map((item, index) => (
              <li key={index} className="group">
                <div className="flex items-center">
                  {item.hasDropdown ? (
                    <button 
                      className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-600 font-semibold transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg border border-transparent hover:border-rose-100 flex-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mr-4 group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300">
                        <item.icon 
                          size={20} 
                          className="text-pink-600 group-hover:text-white transition-colors duration-300" 
                        />
                      </div>
                      <span className="text-lg uppercase">{item.name}</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                      </div>
                    </button>
                  ) : (
                    <Link 
                      href={item.link} 
                      className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:text-pink-600 font-semibold transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg border border-transparent hover:border-rose-100 flex-1"
                      onClick={toggleMenu}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center mr-4 group-hover:from-pink-500 group-hover:to-rose-500 transition-all duration-300">
                        <item.icon 
                          size={20} 
                          className="text-pink-600 group-hover:text-white transition-colors duration-300" 
                        />
                      </div>
                      <span className="text-lg uppercase">{item.name}</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                      </div>
                    </Link>
                  )}
                  
                  {/* Dropdown Toggle Button */}
                  {item.hasDropdown && (
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-2 rounded-xl hover:bg-pink-50 transition-all duration-300 ml-2 group/btn"
                    >
                      {activeDropdown === index ? (
                        <HiChevronUp className="w-5 h-5 text-gray-600 group-hover/btn:text-pink-600 transition-colors duration-300" />
                      ) : (
                        <HiChevronDown className="w-5 h-5 text-gray-600 group-hover/btn:text-pink-600 transition-colors duration-300" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.name === "Khóa học" ? (
                      <>
                        <Link 
                          href="/khoa-hoc/giao-tiep-thuyet-trinh" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Giao tiếp – thuyết trình</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/khoa-hoc-giong-noi" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Khóa học giọng nói</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-su-kien" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Sự kiện</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-nang-cao-pro-talk" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-yellow-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nâng cao - Pro Talk</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-nhi" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nhí</span>
                        </Link>

                        <Link 
                          href="/khoa-hoc/mc-nhi-nang-cao" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nhí Nâng cao</span>
                        </Link>
                      </>
                    ) : null}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Modern Social Media & CTA Section */}
        <div className="p-6 border-t border-rose-100 bg-gradient-to-r from-pink-50/50 via-white to-rose-50/50">
          {/* Call to Action Button */}
          <div className="mb-6">
            <button 
              onClick={() => {
                onRegisterClick();
                toggleMenu();
              }}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-4 rounded-2xl font-bold text-center block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Đăng ký ngay
            </button>
          </div>
          
          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
              Theo dõi chúng tôi
            </h3>
            <div className="flex justify-center space-x-4">
              {[
                { name: "Facebook", icon: FaFacebookF, color: "hover:bg-blue-600", href: "https://facebook.com/daotaomcbacgiang" },
                { name: "Instagram", icon: FaInstagram, color: "hover:bg-pink-600", href: "https://instagram.com/qkmcbacgiang" },
                { name: "YouTube", icon: FaYoutube, color: "hover:bg-red-600", href: "https://youtube.com/@qkmcbacgiang" },
                { 
                  name: "TikTok", 
                  icon: () => (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  ),
                  color: "hover:bg-black",
                  href: "https://tiktok.com/@qkmcbacgiang"
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white rounded-2xl shadow-lg text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl hover:text-white border border-rose-100`}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
