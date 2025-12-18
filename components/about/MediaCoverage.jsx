import React, { useState } from 'react';
import { 
  FaNewspaper, 
  FaTv,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaEye,
  FaQuoteLeft
} from 'react-icons/fa';
import RegistrationPopup from '../common/RegistrationPopup';

const MediaCoverage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const mediaData = [
    {
      id: 1,
      title: "Bích Thủy – MC sống xanh, an lành, duyên dáng, từ đời thường cho đến trên sân khấu",
      outlet: "Người Nổi Tiếng",
      date: "13/02/2024",
      type: "Báo điện tử",
      excerpt: "Lê Bích Thủy – bóng hồng tài năng của giới sự kiện Hà Thành. Cô là một MC, phóng viên, người dẫn chương trình truyền hình và người mẫu. Trong vai trò MC, Bích Thủy đã dẫn dắt thành công rất nhiều chương trình trên hành trình 10 năm, nằm gai nếm mật theo nghề, (2014-2024).",
      link: "https://nguoinoitieng.vn/mach-ban/bich-thuy-mc-song-xanh-an-lanh-duyen-dang-tu-doi-thuong-cho-den-tren-san-khau.html",
      image: "/images/media-1.jpg",
    },
    {
      id: 2,
      title: "Hot girl ĐH Thương mại mơ được gặp người hùng ĐT Pháp",
      outlet: "Việt Nam Net",
      date: "08/09/2016",
      type: "Báo điện tử",
      excerpt: "Không chỉ có thành tích ấn tượng trong học tập, Lê Bích Thủy còn là fan trung thành của những chú “gà trống Gaulois”. 9X mơ được gặp người hùng nước Pháp Payet dù chỉ một lần trong đời.",
      link: "https://vietnamnet.vn/hot-girl-dh-thuong-mai-mo-duoc-gap-nguoi-hung-dt-phap-310383.html",
      image: "/images/media-2.jpg",
    },
    {
      id: 3,
      title: "MC Bích Thủy và hành trình chuyển mình từ người mẫu sang thành người dẫn chương trình",
      outlet: "VnExpress",
      date: "14/02/2021",
      type: "Báo điện tử",
      excerpt: "MC Bích Thủy – bóng hồng tài năng của làng sự kiện Hà Thành và hành trình chuyển mình từ ‘nghề mẫu’ sang ‘nghề MC’, ít ai biết.",
      link: "https://nguoinoitieng.vn/tieu-su/mc-bich-thuy-va-hanh-trinh-chuyen-minh-tu-nguoi-mau-sang-thanh-nguoi-dan-chuong-trinh.html",
      image: "/images/media-3.jpg",
      views: "32.000+"
    },
    {
      id: 4,
      title: "MC Bích Thủy – ‘Đại sứ văn hóa’ kết nối Việt Nam và thế giới",
      outlet: "Người Nổi Tiếng",
      date: "20/01/2021",
      type: "Báo điện tử",
      excerpt: "Bích Thủy không chỉ là gương mặt nổi bật trong lĩnh vực báo chí, truyền hình, truyền thông sự kiện. Nữ MC còn là “đại sứ văn hóa” kết nối tình hữu nghị giữa Việt Nam và các nước trên thế giới.",
      link: "https://nguoinoitieng.vn/tieu-su/mc-bich-thuy-dai-su-van-hoa-ket-noi-viet-nam-va-the-gioi.html",
      image: "/images/media-3.jpg",
    },
    
  ];

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <FaTv className="text-red-500" />;
      case 'phỏng vấn':
      case 'phỏng vấn độc quyền':
        return <FaQuoteLeft className="text-purple-500" />;
      default:
        return <FaNewspaper className="text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'bg-red-100 text-red-700';
      case 'phỏng vấn':
      case 'phỏng vấn độc quyền':
        return 'bg-purple-100 text-purple-700';
      case 'bài viết chuyên sâu':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Truyền thông nói về MC Bích Thủy
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto">
            Những bài viết, phỏng vấn và tin tức nổi bật về MC Bích Thủy trên các phương tiện truyền thông
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80`;
                  }}
                />
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    {item.type}
                  </span>
                </div>
                {/* Views Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-black bg-opacity-70 text-white rounded-full text-xs">
                    <FaEye />
                    {item.views}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Outlet and Date */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-600 font-semibold text-sm">{item.outlet}</span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <FaCalendarAlt />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p>

                {/* Read More Button */}
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors group"
                >
                  Đọc thêm
                  <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Muốn được đào tạo bởi MC Bích Thủy?</h3>
            <p className="text-lg mb-6 opacity-90">
              Tham gia các khóa học tại BT Academy để học hỏi kinh nghiệm từ MC chuyên nghiệp
            </p>
            <button 
              onClick={handleOpenPopup}
              className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký ngay
              <FaExternalLinkAlt />
            </button>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-500 opacity-30"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-1000 opacity-30"></div>
      </div>

      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default MediaCoverage;
