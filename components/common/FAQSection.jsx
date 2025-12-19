import { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Học phí có bao gồm chi phí ghi hình và tài liệu học tập không?',
      answer:
        'Học phí đã bao gồm toàn bộ tài liệu học tập, chi phí tổ chức các buổi thực hành ngoại cảnh, và sản phẩm video/clip ghi hình chuyên nghiệp cuối khóa (tùy theo khóa học). Trung tâm cam kết không phát sinh thêm chi phí.',
    },
    {
      question: 'Con tôi 6 tuổi, rất nhút nhát và nói ngọng. Khóa học nào phù hợp nhất?',
      answer:
        'Đối với bé 6 tuổi, anh/chị nên bắt đầu với Khóa MC Nhí Cơ Bản (Độ tuổi 4-7) để xây dựng sự tự tin và kỹ năng nói trước đám đông. Nếu vấn đề ngọng là ưu tiên hàng đầu, anh/chị có thể tham khảo thêm Khóa Giọng Nói của chúng tôi để được tư vấn lộ trình sửa ngọng riêng.',
    },
    {
      question: 'Khóa Giọng Nói có hiệu quả cho người nói ngọng hoặc giọng địa phương không?',
      answer:
        'Hoàn toàn có. Khóa học tập trung vào kỹ thuật hơi thở, khẩu hình chuẩn, và các bài tập luyện tốc độ/nhịp điệu để sửa các tật ngọng, nói dính chữ, hoặc nói giọng địa phương, giúp giọng nói trở nên khỏe, tròn và rõ chữ hơn.',
    },
    {
      question: 'Trung tâm có hỗ trợ quay video chuyên nghiệp để làm portfolio sau khóa học không?',
      answer:
        'Có. Hầu hết các khóa học (từ MC nhí đến MC Pro) đều có buổi tổng kết ghi hình tại trường quay hoặc ngoại cảnh. Học viên sẽ nhận được sản phẩm video chất lượng cao để làm kỷ niệm hoặc sử dụng làm portfolio cá nhân.',
    },
    {
      question: 'Khóa "MC sự kiện" có đảm bảo tôi có thể dẫn đám cưới hoặc sự kiện công ty không?',
      answer:
        'Khóa học tập trung vào thực chiến: anh/chị sẽ được học cách xây dựng kịch bản, dẫn đôi, hoạt náo, và xử lý tình huống bất ngờ trên sân khấu. Sau 10 buổi, học viên có thể tự tin dẫn dắt các sự kiện cơ bản, sự kiện nội bộ và có nền tảng vững chắc để phát triển sang lĩnh vực MC chuyên nghiệp.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-white flex items-center " aria-labelledby="faq-heading">
      <div className="container mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: FAQ Section */}
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-widest mb-4 font-medium">
                FAQ&apos;S
              </p>
              <h2 id="faq-heading" className="text-2xl md:text-2xl font-bold text-gray-800 mb-4 leading-tight">
                Câu Hỏi{' '}
                <span className="relative">
                  Thường Gặp
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C20 4 40 2 60 6C80 10 100 8 120 4C140 0 160 2 180 6C198 10" stroke="#ec4899" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>{' '}
                Về Trung Tâm MC Q&K Bắc Giang
            </h2>
             
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-tl-lg rounded-br-lg"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <FaChevronUp className="text-pink-500 text-xl flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-pink-500 text-xl flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div id={`faq-answer-${index}`} className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Images Section */}
          <div className="relative flex items-start justify-center gap-4 mt-8 pb-8">
            {/* Left Image - Higher position */}
            <div className="relative w-72 h-96 -mt-8 group">
              <Image
                src="/images/mc-hong-quyen-qk-bac-giang.jpg"
                alt="Student studying"
                fill
                className="object-cover shadow-lg rounded-tr-3xl rounded-bl-3xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Decorative dotted line */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-3">
                <div className="w-6 h-1 bg-pink-300 opacity-70" style={{
                  backgroundImage: 'radial-gradient(circle, #ec4899 1px, transparent 1px)',
                  backgroundSize: '6px 3px'
                }}></div>
              </div>
              {/* Red dashed arc */}
              <div className="absolute -top-3 -right-3 w-12 h-12 border-2 border-pink-300 border-dashed rounded-full opacity-70 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            </div>

            {/* Right Image - Lower position */}
            <div className="relative w-60 h-80 mt-12 group">
              <Image
                src="/images/mc-hong-quyen-qk-bac-giang-2.jpg"
                alt="Student writing"
                fill
                className="object-cover shadow-lg rounded-tl-3xl rounded-br-3xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Red dotted arc */}
              <div className="absolute -top-3 -right-3 w-10 h-10 border-2 border-pink-300 border-dotted rounded-full opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
              {/* Blue blob shape */}
              <div className="absolute -left-6 top-6 w-12 h-12 bg-pink-200 rounded-full opacity-40 transition-transform duration-300 group-hover:-translate-x-2 group-hover:translate-y-1"></div>
            </div>

            {/* Wavy line decoration */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
                <path d="M2 8C8 4 16 12 24 8C32 4 40 12 48 8C56 4 64 12 72 8C76 6 78 8" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}