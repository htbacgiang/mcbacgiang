import React, { useState, useEffect } from "react";

const RegistrationPopup = ({ isOpen, onClose, courseSlug = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    purpose: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Auto-hide success message after 10 seconds
  useEffect(() => {
    if (messageType === "success" && message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
        onClose(); // Close popup after successful registration
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message, messageType, onClose]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      // Reset form when popup is closed
      setFormData({
        name: "",
        age: "",
        phone: "",
        email: "",
        purpose: ""
      });
      setMessage("");
      setMessageType("");
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setMessage("Vui lòng nhập họ tên");
      setMessageType("error");
      return;
    }

    // Age is now optional

    if (!formData.phone.trim()) {
      setMessage("Vui lòng nhập số điện thoại");
      setMessageType("error");
      return;
    }

    // Purpose is now optional

    // Validate phone number (basic Vietnamese phone format)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setMessage("Số điện thoại không hợp lệ");
      setMessageType("error");
      return;
    }

    // Validate age only if provided
    if (formData.age.trim()) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 100) {
        setMessage("Tuổi phải là số từ 1 đến 100");
        setMessageType("error");
        return;
      }
    }

    // Validate email if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setMessage("Email không hợp lệ");
        setMessageType("error");
        return;
      }
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/course-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          age: formData.age.trim() ? parseInt(formData.age) : null,
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          purpose: formData.purpose.trim() || null,
          courseSlug: courseSlug,
          source: "course_registration_popup",
          ipAddress: "", // Will be set by server
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        setMessageType("success");
        setFormData({
          name: "",
          age: "",
          phone: "",
          email: "",
          purpose: ""
        });
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay simplified */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg"></div>
      
      {/* Popup Content with enhanced styling */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-500 ease-out max-h-[90vh] overflow-y-auto border border-gray-200/50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 ring-1 ring-white/20">
        {/* Close Button enhanced */}
        <button
          onClick={onClose}
          className="absolute bg-slate-500 top-3 right-3 w-7 h-7 flex items-center justify-center text-gray-100 hover:text-white hover:bg-rose-500 rounded-full transition-all duration-300 z-10 shadow-lg hover:shadow-xl hover:scale-110"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header simplified */}
        <div className="px-4 pt-4 pb-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-t-2xl border-b border-pink-600 relative overflow-hidden">
          <div className="relative flex items-center mb-2">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-2 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-sm">
              Đăng ký khóa học
            </h3>
          </div>
          <p className="text-white/90 text-xs drop-shadow-sm">
            Điền thông tin để chúng tôi tư vấn khóa học phù hợp tại Q&K Bắc Giang
          </p>
        </div>

        {/* Message Display simplified */}
        {message && (
          <div className="px-4 mb-3 py-2 animate-in slide-in-from-top-2 duration-300">
            <div className={`px-3 py-2 rounded-lg text-xs flex items-center space-x-2 shadow-sm border ${
              messageType === "success" 
                ? "bg-pink-50 text-pink-800 border-pink-200" 
                : "bg-red-50 text-red-800 border-red-200"
            }`}>
              <div className={`w-2 h-2 rounded-full shadow-sm ${
                messageType === "success" ? "bg-pink-500" : "bg-rose-500"
              }`}></div>
              <span className="font-semibold">{message}</span>
            </div>
          </div>
        )}

        {/* Form compact */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 py-4">
          <div className="space-y-3">
            {/* Họ tên và Tuổi - cùng dòng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="group">
                <label className="flex text-xs font-semibold text-gray-700 mb-1 items-center">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></div>
                  Họ và tên <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 bg-white hover:border-gray-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="group">
                <label className="flex text-xs font-semibold text-gray-700 mb-1 items-center">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-1.5"></div>
                  Tuổi <span className="text-gray-400 ml-1">(tùy chọn)</span>
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Nhập tuổi"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all duration-300 bg-white hover:border-gray-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Số điện thoại và Email - cùng dòng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="group">
                <label className="flex text-xs font-semibold text-gray-700 mb-1 items-center">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-1.5"></div>
                  Số điện thoại <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300 bg-white hover:border-gray-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="group">
                <label className="flex text-xs font-semibold text-gray-700 mb-1 items-center">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-1.5"></div>
                  Email <span className="text-gray-400 ml-1">(tùy chọn)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-300 bg-white hover:border-gray-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mục đích học */}
            <div className="group">
              <label className="flex text-xs font-semibold text-gray-700 mb-1 items-center">
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-1.5"></div>
                Mục đích học <span className="text-gray-400 ml-1">(tùy chọn)</span>
              </label>
              <textarea
                name="purpose"
                placeholder="Mô tả mục đích học tập của bạn"
                value={formData.purpose}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 transition-all duration-300 resize-none bg-white hover:border-gray-300 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="text-sm">Đăng ký khóa học</span>
                    </>
                  )}
                </div>
              </button>
              
            </div>
          </div>
        </form>

        {/* Footer simplified */}
        <div className="px-4 pb-3 py-2 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
            <svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="/chinh-sach-bao-mat" className="text-pink-600 hover:text-pink-700 hover:underline transition-colors duration-200 font-medium">
                chính sách bảo mật
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPopup;
