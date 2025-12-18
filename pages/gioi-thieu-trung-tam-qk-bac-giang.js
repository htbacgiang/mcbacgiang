import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ScrollingGallery } from '../components/gallery';
import DefaultLayout from '../components/layout/DefaultLayout';
import { Target, Rocket, Gem, CheckCircle, MessageCircle, Users, Mic, FileText, Star, Building, Smartphone, BarChart3, Award, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const AboutBTAcademyPage = () => {
  // SEO meta data
  const meta = {
    title: "Trung tâm Q&K Bắc Giang: Đào tạo MC, Luyện Giọng, Sửa Ngọng Hiệu quả tại Bắc Giang, Bắc Ninh",
    description: "Trung tâm MC Q&K chuyên sâu đào tạo MC nhí, MC sự kiện, Kỹ năng giao tiếp và Sửa ngọng tại Bắc Giang, Bắc Ninh. Đội ngũ Giảng viên từ VTV, VTC. Học viên cam kết thay đổi sau khóa học.",
    keywords: "MC Q&K Bắc Giang, đào tạo MC, luyện giọng, sửa ngọng, MC nhí, MC sự kiện, kỹ năng giao tiếp, Bắc Giang, Bắc Ninh",
    ogTitle: "Q&K Bắc Giang & Bắc Ninh: Đào tạo MC, Luyện Giọng, Sửa Ngọng Hiệu quả",
    ogDescription: "Trung tâm MC Q&K chuyên sâu đào tạo MC nhí, MC sự kiện, Kỹ năng giao tiếp và Sửa ngọng tại Bắc Giang, Bắc Ninh",
    ogImage: "/images/banner-qk-bac-giang.jpg",
    twitterCard: "summary_large_image"
  };

  // JSON-LD Schema cho tổ chức giáo dục
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Trung Tâm Đào Tạo MC Q&K Bắc Giang",
    alternateName: "MC Q&K Bắc Giang",
    url: "https://qk-bacgiang.vn/gioi-thieu-trung-tam-qk-bac-giang",
    logo: "https://qk-bacgiang.vn/logoqkbacgiang.png",
    description: "Trung tâm MC Q&K chuyên sâu đào tạo MC nhí, MC sự kiện, Kỹ năng giao tiếp và Sửa ngọng tại Bắc Giang, Bắc Ninh. Đội ngũ Giảng viên từ VTV, VTC.",
    founder: {
      "@type": "Person",
      name: "Hồng Quyên",
      jobTitle: "Giám đốc Trung tâm đào tạo MC Q&K Bắc Giang",
      description: "Biên tập viên với 8 năm kinh nghiệm tại VTC và Truyền hình Quốc hội Việt Nam"
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Số 1 Nguyễn Văn Linh",
      addressLocality: "phường Bắc Giang",
      addressRegion: "Bắc Ninh",
      addressCountry: "VN"
    },
    telephone: "0816997000",
    email: "lienhe@mcbacgiang.com",
    offers: {
      "@type": "Offer",
      description: "Đào tạo MC chuyên nghiệp, luyện giọng nói, sửa ngọng, kỹ năng thuyết trình và giao tiếp",
      category: "Education"
    }
  };


  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="MC Hồng Quyên" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:url" content="https://mcbacgiang.com/gioi-thieu-trung-tam-qk-bac-giang" />
        <meta property="og:site_name" content="MC Bắc Giang" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mcbacgiang.com/gioi-thieu-trung-tam-qk-bac-giang" />
        
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
      </Head>
      <div className='h-[50px]'></div>
      <h1 className="visually-hidden">
        Trung tâm MC Q&K Bắc Giang: Đào tạo MC, Luyện Giọng, Sửa Ngọng Hiệu quả tại Bắc Giang, Bắc Ninh
      </h1>

      <div className="max-w-7xl mx-auto px-4 py-6">
           {/* Custom Breadcrumb */}
      <div className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm md:text-base" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 overflow-hidden">
              <li className="flex-shrink-0">
                <Link 
                  href="/" 
                  className="flex items-center font-bold text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Trang chủ</span>
                </Link>
              </li>
              <li className="flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li aria-current="page" className="min-w-0 flex-1">
                <span className="text-pink-600 font-semibold flex items-center">
                  <span className="hidden md:inline">Giới thiệu trung tâm Q&K Bắc Giang</span>
                  <span className="md:hidden truncate">Giới thiệu Q&K Bắc Giang</span>
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
        {/* Main Content */}
        <div className="prose prose-lg blog max-w-none">
          
          {/* Section I: Introduction */}
          <div className="bg-white mt-2 rounded-lg mb-2">
            <h2 style={{fontWeight: 'bold'}}>
              I. Trung Tâm Đào Tạo MC Q&K Bắc Giang: Bệ Phóng Cho Sự Tự Tin Tuyệt Đối
            </h2>
        
            <div className="space-y-2">
              <p>
                Chào mừng bạn đến với <strong className="text-pink-600">Trung tâm MC Q&K Bắc Giang</strong>, đơn vị đào tạo tiên phong chuyên sâu về <strong>Nghệ thuật Giao tiếp, Dẫn chương trình (MC), Luyện Giọng và Sửa Ngọng</strong> tại khu vực Bắc Giang và Bắc Ninh.
              </p>
              <p>
                Chúng tôi tin rằng, giọng nói và sự tự tin chính là tài sản vô giá mở ra mọi cơ hội trong cuộc sống và sự nghiệp. Được thành lập bởi đội ngũ chuyên gia dày dặn kinh nghiệm từ các Đài Truyền hình lớn, Q&K không chỉ truyền đạt kiến thức mà còn cam kết kiến tạo sự thay đổi thực sự cho từng học viên.
              </p>
              <p>
                <strong className="text-pink-600">Q&K Bắc Giang</strong> là nơi bạn tìm thấy giải pháp toàn diện nhất:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-1">
                <li><strong>Cho trẻ em:</strong> Giúp con tự tin phát biểu, làm chủ ngôn ngữ cơ thể, và trở thành các MC/Phóng viên nhí chuyên nghiệp.</li>
                <li><strong>Cho người đi làm:</strong> Giúp vượt qua nỗi sợ thuyết trình, sở hữu giọng nói truyền cảm, và tạo dấu ấn mạnh mẽ trong mọi cuộc họp, giao tiếp.</li>
                <li><strong>Cho người khao khát chuyên nghiệp:</strong> Luyện tập kỹ năng Sửa ngọng, làm chủ sân khấu sự kiện và trường quay/ống kính (Khóa MC Pro).</li>
              </ul>
              <p>
                Tại <strong className="text-pink-600">Q&K Bắc Giang & Bắc Ninh</strong>, chúng tôi không chỉ đào tạo MC; chúng tôi tạo ra những cá nhân biết cách sử dụng giọng nói và phong thái để làm chủ cuộc đời mình.
              </p>
              <div className="bg-white p-1 rounded-lg border-l-4 border-pink-600 mt-3">
                <p className="mb-1"><strong>📍 Địa chỉ:</strong> Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh</p>
                <p><strong>📞 Hotline tư vấn:</strong> <a href="tel:0816997000">081 699 7000</a></p>
              </div>
            </div>
            <div className="my-3">
              <Image
                src="/images/trung-tam-qk-bac-giang.jpg"
                alt="Trung Tâm Đào Tạo MC Q&K Bắc Giang"
                width={1200}
                height={600}
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
          
           {/* Section II: Vision Mission Values Section */}
           <section>
             <div className="">
               <h2 style={{fontWeight: 'bold'}}>
                 II. Tầm Nhìn, Sứ Mệnh Và Giá Trị Cốt Lõi
               </h2>
               <p className="mt-2">
                 Trung tâm MC Q&K Bắc Giang không chỉ là một cơ sở đào tạo, mà còn là một tổ chức mang trong mình khát vọng nâng tầm kỹ năng giao tiếp cho cộng đồng tại khu vực Bắc Giang và Bắc Ninh.
               </p>
             </div>

             {/* Vision Mission Image */}
             <div className="mb-6">
               <Image
                 src="/images/tam-nhin-su-menh.jpg"
                 alt="Tầm nhìn và Sứ mệnh của Q&K Bắc Giang"
                 width={1200}
                 height={400}
                 className="w-full h-auto rounded-lg"
               />
             </div>
             
             {/* Vision */}
             <div className="mb-4">
             <div className="bg-white rounded-lg mb-1">
             <div className="flex items-center mb-3">
             <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                 <Target className="w-5 h-5 text-white" />
                   </div>
                   <h3>
                     1. Tầm Nhìn Chiến Lược 
                   </h3>
                 </div>
                <p className="italic">
                  &quot;Trở thành Học viện Đào tạo Kỹ năng Giao tiếp và MC hàng đầu khu vực Bắc Giang và Bắc Ninh, là chuẩn mực về sự Tự tin và Chuyên nghiệp trong nghệ thuật nói, được cộng đồng tại Bắc Giang và Bắc Ninh tin tưởng lựa chọn số một.&quot;
                </p>
                 <p className="mt-1">
                   Chúng tôi hướng đến việc xây dựng một thương hiệu vững mạnh, nơi mọi cá nhân muốn làm chủ giọng nói và sân khấu đều tìm đến, được công nhận bởi chất lượng đào tạo vượt trội và đội ngũ chuyên gia uy tín.
                 </p>
               </div>
             </div>

             {/* Mission */}
             <div className="mb-4">
               <div className="bg-white rounded-lg mb-1">
                 <div className="flex items-center mb-3">
                   <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                     <Rocket className="w-5 h-5 text-white" />
                   </div>
                   <h3>
                     2. Sứ Mệnh Cốt Lõi 
                   </h3>
                 </div>
                <p className="mb-3 italic">
                  &quot;Sứ mệnh của chúng tôi là Kiến tạo một thế hệ người Việt tự tin, có khả năng giao tiếp, thuyết trình và dẫn dắt câu chuyện một cách truyền cảm, hiệu quả, sử dụng giọng nói khỏe mạnh và chuẩn mực.&quot;
                </p>
                 <p className="mb-4">
                   Q&K Bắc Giang cam kết:
                 </p>
                 <div className="grid md:grid-cols-1 gap-4">
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span>Đào tạo ra những MC sự kiện và MC Truyền hình chuyên nghiệp, thực chiến.</span>
                   </div>
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span>Cung cấp giải pháp Sửa ngọng và Luyện giọng hiệu quả nhất, giúp học viên tự tin thăng tiến.</span>
                   </div>
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span>Tạo ra một môi trường học tập Thực chiến giúp mỗi cá nhân khai phá tối đa tiềm năng ngôn ngữ và làm chủ mọi rào cản tâm lý.</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Core Values */}
             <div className="mb-4">
               <div className="bg-white rounded-lg">
                 <div className="flex items-center mb-1">
                   <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3">
                     <Gem className="w-5 h-5 text-white" />
                   </div>
                   <h3>
                     3. Giá Trị Cốt Lõi (Our Core Values)
                   </h3>
                 </div>
                 <p className="">
                   Để thực hiện Tầm nhìn và Sứ mệnh, Q&K luôn lấy 4 giá trị sau làm kim chỉ nam cho mọi hoạt động đào tạo và vận hành:
                 </p>
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse bg-white rounded-lg shadow-base">
                     <thead>
                       <tr className="bg-pink-600 text-white">
                         <th className="p-2 text-left border text-white border-gray-300">Giá Trị Cốt Lõi</th>
                         <th className="p-2 text-left border text-white border-gray-300">Mô Tả Cam Kết</th>
                       </tr>
                     </thead>
                     <tbody>
                       <tr className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 font-semibold">Chuyên Nghiệp (Professionalism)</td>
                         <td className="p-2 border border-gray-200">Nội dung đào tạo được xây dựng từ kinh nghiệm thực tiễn của đội ngũ MC/BTV Truyền hình, đảm bảo tính ứng dụng cao và cập nhật xu hướng mới nhất của ngành.</td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 font-semibold">Thực Chiến (Practicality)</td>
                         <td className="p-2 border border-gray-200">Lấy thực hành là trọng tâm. Học viên được trải nghiệm trực tiếp tại phòng thu, trường quay mô phỏng, đảm bảo làm chủ kỹ năng nói trước đám đông và ống kính ngay tại lớp.</td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 font-semibold">Tận Tâm (Dedication)</td>
                         <td className="p-2 border border-gray-200">Cam kết đồng hành, hỗ trợ và theo sát sự tiến bộ của từng học viên. Chúng tôi coi sự thành công của học viên trong cuộc sống và công việc là thành tựu lớn nhất của trung tâm.</td>
                       </tr>
                       <tr className="hover:bg-gray-50">
                         <td className="p-2 border border-gray-200 font-semibold">Khai Phóng Tự Tin (Unlocking Confidence)</td>
                         <td className="p-2 border border-gray-200">Mục tiêu cuối cùng là giúp học viên vượt qua mọi rào cản tâm lý, tự tin làm chủ giọng nói, ngôn ngữ cơ thể và kỹ năng ứng biến, từ đó làm chủ mọi tình huống giao tiếp.</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>

           </section>
      {/* Section: Teaching Methodology */}
      <section className="my-8">
            <div className="bg-white rounded-lg ">
              {/* Title */}
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-pink-600 mb-3 uppercase">
                  Phương pháp giảng dạy
                </h3>
                <p className="text-gray-800 text-lg md:text-xl font-semibold">
                  Áp dụng thành công trên 1000 học viên
                </p>
              </div>

              {/* 6 Key Points in 2 columns */}
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Point 1 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        <strong className="text-pink-600 text-lg">100% KIẾN THỨC</strong> áp dụng được vào thực tiễn đời sống, công việc
                      </p>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        <strong className="text-pink-600 text-lg">THỰC HÀNH</strong> trước, học sau;<br />
                        Tăng thời gian tương tác với giáo viên
                      </p>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        Kèm <strong className="text-pink-600 text-lg">1-1</strong> cả trên lớp lẫn về nhà.<br />
                        Giá trị nhận được nhiều hơn 1 khoá học.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Point 4 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        <strong className="text-pink-600 text-lg">Bài tập về nhà</strong> từng buổi<br />
                        được Giáo viên phân tích, chấm điểm chi tiết.
                      </p>
                    </div>
                  </div>

                  {/* Point 5 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        Tham gia <strong className="text-pink-600 text-lg">CLB luyện tập giọng nói.</strong><br />
                        CLB người thành công sau khoá học
                      </p>
                    </div>
                  </div>

                  {/* Point 6 */}
                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 text-gray-800">
                      <p className="leading-relaxed">
                        <strong className="text-pink-600 text-lg">Lộ trình cá nhân hoá.</strong> Đúng mục tiêu.<br />
                        <strong className="text-pink-600 text-lg">Cam kết đầu ra.</strong> Đầu tư xứng đáng
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Section III: Expert Team */}
          <section className="mb-6">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1" style={{fontWeight: 'bold'}}>
                III. Đội Ngũ Giảng Viên Chuyên Nghiệp
              </h2>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Lợi thế cạnh tranh lớn nhất của Trung tâm MC Q&K nằm ở đội ngũ giảng viên. Họ không chỉ là những nhà giáo dục, mà còn là những chuyên gia, Biên tập viên (BTV) đang hoạt động và có thâm niên trong ngành Truyền hình và Sự kiện.
            </p>

            {/* Instructor 1: Hồng Quyên */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mt-5 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                  <div className="w-full rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/mc-hong-quyen-1.webp"
                      alt="Giảng viên - MC/BTV Hồng Quyên"
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Giảng viên - MC/BTV Hồng Quyên
                  </h3>
                  <p className="text-pink-600 font-semibold mb-4 text-base md:text-lg border-l-4 border-pink-600 pl-3 py-1 bg-pink-50 rounded-r">
                    (Giám đốc Trung tâm Q&K Bắc Giang | BTV Truyền hình)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-1 text-base">
                    Giảng viên Hồng Quyên là người sáng lập và là linh hồn trong việc xây dựng chất lượng và giáo trình đào tạo tại Q&K. Với nền tảng vững chắc từ các Đài Truyền hình quốc gia, cô mang đến phương pháp đào tạo chuẩn mực và thực tế nhất.
                  </p>
                  <ul className="space-y-2.5 text-gray-700">
                  
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Kinh nghiệm Truyền hình (8 năm):</strong> Từng là Biên tập viên tại Đài Truyền hình Kỹ thuật số VTC và Truyền hình Quốc hội Việt Nam. Cộng tác viên dẫn trải nghiệm và thể hiện lời bình trên sóng VTV.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thế mạnh đào tạo:</strong> Đào tạo MC chuyên nghiệp (sân khấu, truyền hình), Kỹ năng ứng biến, Thuyết trình chuyên sâu và Chương trình Sửa ngọng hiệu quả cao.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thành tích thực chiến:</strong>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>7 năm kinh nghiệm dẫn truyền hình: Bản tin thời sự, phóng sự, chương trình trải nghiệm, Livestream chuyên nghiệp.</li>
                          <li>8 năm kinh nghiệm dẫn sự kiện: Các sự kiện quy mô lớn như Khai trương, Gala Dinner, Year End Party...</li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Instructor 2: Phương Thúy */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mt-6 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                  <div className="w-full rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/co-thuy-panda.jpg"
                      alt="Giáo viên Phương Thúy"
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Giáo viên Phương Thúy
                  </h3>
                  <p className="text-pink-600 font-semibold mb-4 text-base md:text-lg border-l-4 border-pink-600 pl-3 py-1 bg-pink-50 rounded-r">
                    (Chuyên gia MC Sự kiện & Phát triển MC Nhí)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">
                    Giáo viên Phương Thúy là người trực tiếp xây dựng sự tự tin và đam mê cho các học viên nhí, đồng thời truyền đạt kỹ năng dẫn dắt sự kiện thực tế cho học viên người lớn.
                  </p>
                  <ul className="space-y-2.5 text-gray-700">
                    
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Kinh nghiệm đào tạo:</strong> 3 năm kinh nghiệm giảng dạy bộ môn MC nhí, giúp hàng trăm học viên nhí từ nhút nhát trở nên tự tin, hoạt ngôn.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thế mạnh chuyên môn:</strong>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>5 năm kinh nghiệm làm MC sự kiện: Am hiểu sâu sắc về kịch bản, hoạt náo và kỹ năng khuấy động không khí sân khấu.</li>
                          <li>Thực hiện nhiều dự án đọc voice quảng cáo (Voice Talent) cho các doanh nghiệp.</li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Instructor 3: Dương Ngoan */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mt-6 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                  <div className="w-full rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/co-ngoan-2.jpg"
                      alt="Giáo viên Dương Ngoan"
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Giáo viên Dương Ngoan
                  </h3>
                  <p className="text-pink-600 font-semibold mb-4 text-base md:text-lg border-l-4 border-pink-600 pl-3 py-1 bg-pink-50 rounded-r">
                    (Chuyên trách MC Song Ngữ Nhí & Anh ngữ Giao tiếp)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">
                    Giáo viên Dương Ngoan chuyên trách phát triển khả năng MC song ngữ, mang đến môi trường học tập quốc tế và giúp học viên nhí có thêm lợi thế cạnh tranh toàn cầu.
                  </p>
                  <ul className="space-y-2.5 text-gray-700">
                   
                    <li className="flex items-start">
                      <span className="text-pink-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thế mạnh chuyên môn:</strong>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>Am hiểu về phương pháp quản lý và giảng dạy Anh ngữ tại các trung tâm uy tín.</li>
                          <li>Kết hợp nhuần nhuyễn kỹ năng MC và giao tiếp tiếng Anh, giúp học viên dẫn dắt chương trình và tương tác với khán giả nước ngoài một cách tự nhiên.</li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section IV: Main Courses */}
          <section className="mb-6">
            <div className="mb-2">
              <h2 className="text-xl  md:text-2xl font-bold text-gray-800 mb-1" style={{fontWeight: 'bold'}}>
                IV. Các Khóa Học Trọng Tâm Của Q&K Bắc Giang
              </h2>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Trung tâm MC Q&K Bắc Giang mang đến hệ sinh thái khóa học đa dạng, được thiết kế chuyên biệt để giải quyết mọi nhu cầu về kỹ năng giao tiếp, giọng nói và dẫn chương trình, tại cả Bắc Giang và Bắc Ninh.
            </p>

        

            {/* Course 1: Voice Training & Speech Correction */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                1. Khóa Học Làm Chủ Giọng Nói, Sửa Ngọng (Dành cho mọi lứa tuổi)
              </h3>
           
              <p className="text-gray-700 mb-4 leading-relaxed">
                Đây là chương trình cốt lõi, tập trung vào việc cải thiện chất giọng, độ rõ ràng và tính chuyên nghiệp trong lời nói.
              </p>
              <div className="overflow-x-auto mb-3">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                       <tr className="bg-pink-600 text-white">
                      <th className="p-2 text-left border text-white border-gray-300">Khóa học</th>
                      <th className="p-2 text-left border text-white border-gray-300">Đối Tượng Mục Tiêu</th>
                      <th className="p-2 text-left border text-white border-gray-300">Lợi Ích Cốt Lõi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-200 font-semibold text-gray-800">Khóa Luyện Giọng Chuyên Sâu</td>
                      <td className="p-2 border border-gray-200 text-gray-700">Người nói yếu, dễ mệt, muốn sở hữu giọng khỏe, hay, truyền cảm.</td>
                      <td className="p-2 border border-gray-200 text-gray-700">Làm chủ hơi thở, khẩu hình chuẩn, điều chỉnh tốc độ, nhịp điệu để giọng nói có sức hút và truyền cảm.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-200 font-semibold text-gray-800">Chương trình Sửa Ngọng</td>
                      <td className="p-2 border border-gray-200 text-gray-700">Người nói ngọng, giọng địa phương, nói lắp muốn cải thiện để giao tiếp rõ ràng.</td>
                      <td className="p-2 border border-gray-200 text-gray-700">Áp dụng kỹ thuật chuyên sâu để sửa ngọng dứt điểm, loại bỏ các lỗi vấp, lắp, giúp lời nói mạch lạc và chuyên nghiệp.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-3">
                <Link href="/khoa-hoc-giong-noi">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold text-base">
                    TÌM HIỂU CHI TIẾT KHÓA LUYỆN GIỌNG & SỬA NGỌNG
                  </button>
                </Link>
              </div>
            </div>

            {/* Course 2: Adult Courses */}
            <div className="mb-4">
              <h3 className="mb-2">
                2. Khóa Học Phát Triển Kỹ Năng Người Lớn(Từ Giao tiếp đến MC Chuyên nghiệp)
              </h3>
              <p className="">
                Nhóm khóa học dành cho người đi làm, sinh viên hoặc những người muốn tăng thu nhập từ nghề MC.
              </p>
              
              <div className="space-y-1">
                <div className="bg-white rounded-lg">
                  <h4 className="mb-2">A. Tự tin Giao tiếp & Thuyết trình</h4>
                  <ul className="space-y-1">
                    <li><strong>Dành cho:</strong> Người tự ti, sợ đám đông, hay run khi phát biểu, muốn nâng cao kỹ năng thuyết trình trong công việc.</li>
                    <li><strong>Nội dung:</strong> Kỹ thuật giọng nói cơ bản, ngôn ngữ hình thể, kỹ năng xây dựng nội dung nói logic và tương tác khán giả.</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg">
                  <h4 className="mb-2">B. MC Sự kiện – Chinh phục Mọi Sân Khấu</h4>
                  <ul className="space-y-1">
                    <li><strong>Dành cho:</strong> Người muốn trở thành MC bán chuyên, dẫn các chương trình nội bộ, đám cưới, khai trương.</li>
                    <li><strong>Nội dung:</strong> Kỹ năng xây dựng kịch bản, dẫn đôi, hoạt náo, tổ chức mini game, và xử lý tình huống bất ngờ trên sân khấu.</li>
                  </ul>
                </div>

                <div className="bg-whiterounded-lg">
                  <h4 className=" mb-2">C. MC Nâng cao – Pro Talk & MC Pro</h4>
                  <ul className="space-y-1 ">
                    <li><strong>Dành cho:</strong> Học viên đã có nền tảng và muốn phát triển chuyên nghiệp.</li>
                    <li><strong>Thế mạnh:</strong> Đào sâu kỹ năng dẫn Talk show, tư duy ứng biến không cần kịch bản. Khóa MC Pro chuyên biệt về kỹ năng ghi hình trước ống kính (TikTok, Reels, YouTube), đọc Teleprompter (cue) tự nhiên, và sản xuất clip cá nhân chất lượng cao.</li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-3">
                <Link href="/khoa-hoc-mc-su-kien">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold text-base">
                TƯ VẤN KHÓA HỌC MC NGƯỜI LỚN & LỊCH KHAI GIẢNG
                  </button>
                </Link>
              </div>
            </div>

            {/* Course 3: Kids Courses */}
            <div className="mb-4">
              <h3 className="mb-2">
                3. Khóa Học MC Nhí & Kỹ Năng Mềm Cho Trẻ Em (Độ tuổi 4-15)
              </h3>
           
              <p className="mb-1">
                Lộ trình phát triển toàn diện, giúp con bạn tự tin và nổi trội trong mọi môi trường học tập.
              </p>
              
              <div className="bg-white  rounded-lg mb-3">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>MC Nhí Cơ Bản & Nâng Cao:</strong> Xây dựng nền tảng tự tin, làm chủ ngôn ngữ cơ thể, kỹ năng làm việc nhóm.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Phóng Viên Nhí Pro:</strong> Rèn luyện kỹ năng dẫn Livestream, biên tập tin tức và tác nghiệp hiện trường, giúp con làm chủ công nghệ.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>MC Song Ngữ Nhí:</strong> Giúp trẻ tự tin giao tiếp, dẫn chương trình bằng tiếng Anh, tạo lợi thế cạnh tranh quốc tế.</span>
                  </li>
                </ul>
              </div>

              <div className="text-center mt-3">
                <Link href="/khoa-hoc-mc-nhi">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold text-base">
                XEM LỘ TRÌNH ĐÀO TẠO MC NHÍ ĐẦY ĐỦ
                  </button>
                </Link>
              </div>
            </div>

          </section>

    

          {/* Section V: Proof and Achievements */}
          <section className="">
            <div className="">
            <h2 className="text-xl md:text-2xl text-gray-800 mb-1" style={{fontWeight: 'bold'}}>
              V. Minh Chứng Và Thành Tự 
              </h2>
              <div className="w-24 h-0.5 bg-pink-600 mx-auto rounded-full"></div>
            </div>
            
            <p className="mb-4 mx-auto">
              Những thành quả đạt được là lời khẳng định rõ ràng nhất cho chất lượng đào tạo và sự tận tâm của Trung tâm MC Q&K Bắc Giang & Bắc Ninh. Chúng tôi tự hào đồng hành cùng sự thay đổi của hàng trăm học viên.
            </p>

            {/* Proof Image */}
            <div className="mb-6">
              <Image
                src="/images/thanh-tuu-overview.jpg"
                alt="Thành tựu và minh chứng của Q&K Bắc Giang"
                width={1200}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Testimonials */}
            <div className="mb-4">
              <h3 className="mb-2 flex items-center">
                1. Cảm Nhận Từ Học Viên & Phụ Huynh
              </h3>
             
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border-l-4 border-pink-600">
                  <h4 className="mb-2">Cảm nhận từ Phụ huynh có con học MC Nhí</h4>
                  <p className="italic mb-1">
                    &quot;Bé nhà tôi 7 tuổi, trước đây rất nhút nhát và sợ nói trước lớp. Sau Khóa MC Nhí Cơ Bản tại Q&K, bé đã biết cách kể chuyện cuốn hút, tự tin lên sân khấu tổng kết cuối năm và thậm chí còn đòi quay video giới thiệu sách. Sự thay đổi này thật sự ngoài mong đợi!&quot;
                  </p>
                  <p>— Chị Lan Anh (Phụ huynh bé Minh Đức, Bắc Giang)</p>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-pink-600">
                  <h4 className="mb-2">Phản hồi từ Học viên Người lớn (Cải thiện Giọng nói & Sự nghiệp)</h4>
                  <p className="italic mb-1">
                    &quot;Tôi là quản lý kinh doanh, thường xuyên phải thuyết trình. Vấn đề của tôi là giọng địa phương và hay bị hụt hơi. Khóa Luyện Giọng đã giúp tôi sửa được lỗi phát âm và làm chủ hơi thở. Giờ đây, giọng nói của tôi khỏe, rõ ràng và truyền cảm hơn hẳn, giúp tôi tự tin hơn khi trao đổi với đối tác lớn.&quot;
                  </p>
                  <p>— Anh Văn Hùng (Học viên Khóa Luyện Giọng, Bắc Ninh)</p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="mb-12">
              <h3 className="mb-6 flex items-center">
                2. Hình Ảnh Thành Quả Thực Chiến
              </h3>
              <div className="not-prose"> 
               <ScrollingGallery />
              </div>
             
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Bộ sưu tập ảnh &quot;TRƯỚC &amp; SAU&quot;:</strong> Hình ảnh học viên trước và sau khóa học (nếu có sự đồng ý).</li>
                <li><strong>Video Sản phẩm MC Nhí:</strong> Trích đoạn clip MC nhí tự tin dẫn chương trình, làm phóng sự.</li>
                <li><strong>Hình ảnh Ghi hình Chuyên nghiệp:</strong> Ảnh học viên Khóa MC Pro thực hành ghi hình tại studio hoặc ngoại cảnh.</li>
                <li><strong>Chứng nhận/Thành tựu:</strong> Ảnh chụp chứng chỉ tốt nghiệp, hoặc bằng khen/giải thưởng (nếu có).</li>
              </ul>
            </div>

            {/* Professional Credibility */}
            <div className="mb-4">
              <h3 className="mb-2 flex items-center">
                3. Uy Tín Chuyên Môn (Thành tích của Giảng viên)
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Kinh nghiệm Phát thanh - Truyền hình:</strong> Đội ngũ giảng viên có kinh nghiệm thực tế tại VTC, VTV, Truyền hình Quốc hội Việt Nam.</li>
                <li><strong>Sản phẩm Thể hiện Giọng:</strong> Giảng viên Q&K thường xuyên thực hiện các dự án lồng tiếng, đọc lời bình, và voice-over quảng cáo cho các doanh nghiệp, chứng minh chất lượng giọng nói ở mức chuyên nghiệp nhất.</li>
              </ul>
            </div>
          </section>

          {/* Section VI: Conclusion and CTA */}
          <section className="">
            <div className="">
              <h2 style={{fontWeight: 'bold'}}>
                VI. Kết Luận
              </h2>
            </div>
            
            <p className="mb-6">
              Trung tâm MC Q&K cam kết là người bạn đồng hành tin cậy, giúp bạn và con bạn kiến tạo kỹ năng giao tiếp bền vững tại Bắc Giang và Bắc Ninh. Đừng để sự tự ti cản trở thành công của bạn!
            </p>

            {/* CTA Box */}
            <div className="bg-red-50 p-8 rounded-lg border-l-4 border-red-600 text-center">
              <p className="text-xl font-bold text-red-700 mb-4">
                📢 GỌI NGAY để được tư vấn lộ trình phù hợp!
              </p>
              <p className="text-gray-700 mb-6 font-medium">
                Q&K Bắc Giang sẵn sàng đánh giá miễn phí khả năng giọng nói và giao tiếp của bạn hoặc con bạn.
              </p>
              <a href="tel:0816997000">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg">
                  HOTLINE TƯ VẤN TRỰC TIẾP: 081 699 7000
                </button>
              </a>
              <div className="mt-6">
                <Link href="/lich-khai-giang">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold">
                    XEM LỊCH KHAI GIẢNG TẠI BẮC GIANG & BẮC NINH
                  </button>
                </Link>
              </div>
            </div>
          </section>

      

          {/* Contact Information Section */}
          <section className="mt-4 mb-4">
                <div className="bg-white p-4 rounded-lg">
              
              <div className="space-y-1.5">
                <p><strong>Trung Tâm Đào Tạo MC Q&K Bắc Giang</strong> – Đào tạo MC, Luyện Giọng, Sửa Ngọng & Kỹ năng giao tiếp</p>
                <p><strong>📍 Trụ sở chính:</strong> Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh</p>
                <p><strong>📞 Hotline tư vấn:</strong> <a href="tel:0816997000">081.6997.000</a></p>
                <p><strong>📧 Email:</strong> <a href="mailto:lienhe@mcbacgiang.com">lienhe@mcbacgiang.com</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AboutBTAcademyPage;
