import React from 'react';
import { 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub, 
  FaFacebook,
  FaDownload 
} from 'react-icons/fa';

const FounderProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Profile Image Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-80 h-96 lg:w-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/images/bt-01.jpg" 
                  alt="Lê Bích Thủy - Founder"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80';
                  }}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 max-w-xl">
            {/* Header */}
            <div className="mb-8">
              <h3 className="text-green-600 text-lg font-medium mb-2 tracking-wider">
                Founder BT Academy là ai?
              </h3>
              <h1 className="text-2xl md:text-3xl font-bold mb-6 leading-tight text-gray-900">
                Tôi là <span className="text-gray-900">Lê Bích Thủy</span>, 
                <br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Founder & CEO {" "}
                </span>
                <span className="text-gray-700">của BT Academy</span>
              </h1>
            </div>

            {/* Description */}
            <div className="mb-10">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Tôi là Giảng viên/BTV-MC với gần 10 năm kinh nghiệm trong lĩnh vực báo chí truyền thông 
                và giải trí. Tôi tin rằng việc đào tạo giọng nói và phát triển kỹ năng sống sẽ giúp 
                mọi người tự tin hơn trong giao tiếp và thành công trong cuộc sống.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Với nhiều năm đào tạo các thế hệ học viên, tôi cam kết sẽ đồng hành cùng bạn không chỉ 
                trong quá trình học tại BT Academy mà còn hỗ trợ, tư vấn cho bạn trong suốt quá trình 
                công việc và cuộc sống sau này.
              </p>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Họ và tên:</span>
                  <span className="text-gray-900">Lê Bích Thủy</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Nghệ danh:</span>
                  <span className="text-gray-900">Bích Thủy</span>
                </div>
              
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Quê quán:</span>
                  <span className="text-gray-900">TP Thái Nguyên</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Email:</span>
                  <span className="text-green-600">thuylb@btacademy.vn</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Nơi ở:</span>
                  <span className="text-gray-900">Hà Nội, Việt Nam</span>
                </div>
               
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium w-24">Nghề nghiệp:</span>
                  <span className="text-gray-900">MC, PV Báo chí & TV</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

              {/* Social Links */}
              <div className="flex items-center gap-4">
             
                <a 
                  href="https://www.instagram.com/jerry.dcy" 
                  className="w-12 h-12 bg-gray-200 hover:bg-pink-500 text-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="text-xl" />
                </a>
              
                <a 
                  href="https://www.facebook.com/jerry.dcy" 
                  className="w-12 h-12 bg-gray-200 hover:bg-blue-700 text-gray-700 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  aria-label="Facebook"
                >
                  <FaFacebook className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-500 opacity-60"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-1000 opacity-60"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-ping delay-1500 opacity-60"></div>
      </div>
    </div>
  );
};

export default FounderProfile;
