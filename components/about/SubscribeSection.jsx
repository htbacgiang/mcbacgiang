import React, { useState, useEffect } from "react";
import RegistrationPopup from "../common/RegistrationPopup";

const SubscribeSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div
      className="relative bg-cover bg-center text-white py-16 px-5"
      style={{
        backgroundImage: "url('/images/11.jpg')",
      }}
    >
      {/* Lớp phủ tối */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative max-w-screen-lg mx-auto text-center">
        {/* Tiêu đề */}
        <h4 className="text-3xl md:text-4xl font-bold mb-4">
          Mang thiên nhiên và sáng tạo đến hộp thư của bạn.
        </h4>

        {/* Mô tả */}
        <p className="text-base mb-6">
          Chúng tôi gieo mầm sức khỏe và đổi mới.
          <br />
          Đăng ký nhận bản tin để cập nhật kiến thức nông nghiệp thông minh, rau củ hữu cơ tươi ngon, ưu đãi độc quyền và nhiều hơn thế.
        </p>

        {/* Nút đăng ký */}
        <div className="flex justify-center">
          <button
            onClick={handleOpenPopup}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup} 
      />
    </div>
  );
};

export default SubscribeSection;
