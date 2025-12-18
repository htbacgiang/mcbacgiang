import React from 'react';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaAward,
  FaStar
} from 'react-icons/fa';

const EducationExperience = () => {
  const educationData = [
    {
      id: 1,
      degree: "Thạc sĩ Báo chí",
      institution: "Đại học Khoa học Xã hội và Nhân văn",
      year: "2020 - 2022",
      location: "Hà Nội, Việt Nam",
      description: "Chuyên sâu về báo chí, truyền thông và các kỹ năng truyền thông đại chúng hiện đại",
    },
    {
      id: 2,
      degree: "Cử nhân Đại học Thương Mại",
      institution: "Đại học Thương Mại",
      year: "2012 - 2016",
      location: "Hà Nội, Việt Nam",
      description: "Chuyên ngành Kế toán - Nền tảng vững chắc về quản lý tài chính và kế toán doanh nghiệp",
    }
  ];

  const experienceData = [
    {
      id: 1,
      position: "Nhà sáng lập & Giám đốc đào tạo",
      company: "BT Academy (Best Talent Academy)",
      period: "2022 - Hiện tại",
      location: "Hà Nội & Thái Nguyên, Việt Nam",
      description: "Thành lập và điều hành BT Academy - trung tâm chuyên đào tạo MC, thuyết trình, kỹ năng mềm, thương hiệu cá nhân, kỹ năng bán hàng và kỹ năng xuất hiện trên mạng xã hội.",
      achievements: [
        "Đào tạo hàng trăm học viên về kỹ năng MC và thuyết trình",
        "Xây dựng chương trình đào tạo kỹ năng mềm và thương hiệu cá nhân",
        "Phát triển khóa học kỹ năng bán hàng và xuất hiện trên mạng xã hội",
        "Mở rộng hoạt động đào tạo tại cả Hà Nội và Thái Nguyên"
      ]
    },
    {
      id: 2,
      position: "MC Truyền hình & Sự kiện",
      company: "Freelancer - Các đài truyền hình và tổ chức",
      period: "2017 - Hiện tại",
      location: "Hà Nội, Việt Nam",
      description: "MC chuyên nghiệp cho các chương trình truyền hình trực tiếp và sự kiện lớn, với kinh nghiệm dẫn dắt nhiều chương trình quan trọng.",
      achievements: [
        "Dẫn trực tiếp 'Vinh danh Thương hiệu tiêu biểu ngành xây dựng lần III' - Truyền hình Quốc hội VN",
        "MC chương trình 'Khám phá Việt Nam' và 'Di sản Văn hoá' - VTC10",
        "Đồng dẫn chương trình trao giải HADIPHAR cùng MC Quyền Linh",
        "Dẫn gala Tập đoàn Inox Hoàng Vũ với 3.000+ khán giả"
      ]
    },
    {
      id: 3,
      position: "Phóng viên Báo chí & Truyền hình",
      company: "Báo Xây Dựng, Đài Truyền hình Kỹ thuật số VTC, Đài Truyền hình Việt Nam (VTV)",
      period: "2017 - 2022",
      location: "Hà Nội, Việt Nam",
      description: "Nhiều năm công tác tại Báo Xây dựng, Đài Truyền hình Kỹ thuật số VTC và tham gia các chương trình của Đài Truyền hình Việt Nam (VTV).",
      achievements: [
        "Viết hơn 200 bài báo chất lượng cao về ngành xây dựng",
        "Tham gia tác nghiệp tại nhiều dự án xây dựng quan trọng",
        "Thực hiện các phóng sự truyền hình về chính sách xây dựng",
        "Tham gia các chương trình của VTV và VTC"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Học vấn & Kinh nghiệm
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Hành trình phát triển chuyên môn và xây dựng sự nghiệp trong lĩnh vực giáo dục và công nghệ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Học vấn</h3>
            </div>

            <div className="space-y-6">
              {educationData.map((edu) => (
                <div key={edu.id} className="relative pl-8 pb-8 border-l-2 border-green-200 last:border-l-0 last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-green-600 rounded-full"></div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{edu.degree}</h4>
                      <span className="text-green-600 font-medium text-sm flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {edu.year}
                      </span>
                    </div>
                    
                    <h5 className="text-green-600 font-semibold mb-2">{edu.institution}</h5>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      {edu.location}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{edu.description}</p>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <FaBriefcase className="text-white text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Kinh nghiệm làm việc</h3>
            </div>

            <div className="space-y-6">
              {experienceData.map((exp) => (
                <div key={exp.id} className="relative pl-8 pb-8 border-l-2 border-blue-200 last:border-l-0 last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{exp.position}</h4>
                      <span className="text-blue-600 font-medium text-sm flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {exp.period}
                      </span>
                    </div>
                    
                    <h5 className="text-blue-600 font-semibold mb-2">{exp.company}</h5>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <FaMapMarkerAlt className="mr-1" />
                      {exp.location}
                    </div>
                    
                    <p className="text-gray-700 mb-4">{exp.description}</p>
                    
                    <div className="space-y-2">
                      <h6 className="font-semibold text-gray-900 flex items-center">
                        <FaStar className="text-yellow-500 mr-2" />
                        Thành tích nổi bật:
                      </h6>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start">
                            <span className="text-green-500 mr-2 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Background Decorative Elements */}
        <div className="absolute top-32 left-16 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-40"></div>
        <div className="absolute top-64 right-24 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-500 opacity-40"></div>
        <div className="absolute bottom-48 left-1/3 w-1 h-1 bg-purple-500 rounded-full animate-ping delay-1000 opacity-40"></div>
      </div>
    </div>
  );
};

export default EducationExperience;
