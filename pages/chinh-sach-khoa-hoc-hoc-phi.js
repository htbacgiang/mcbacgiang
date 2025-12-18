import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DefaultLayout from '../components/layout/DefaultLayout';

const ChinhSachKhoaHocHocPhi = () => {
  return (
    <>
      <Head>
        <title>Chính sách Khóa học & Học phí - Q&K Bắc Giang</title>
        <meta name="description" content="Chính sách khóa học và học phí của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <meta name="keywords" content="chính sách khóa học, học phí, đăng ký, thanh toán, bảo lưu, hoàn học phí, Q&K Bắc Giang, đào tạo MC, luyện giọng, Bắc Giang, Bắc Ninh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Chính sách Khóa học & Học phí - Q&K Bắc Giang" />
        <meta property="og:description" content="Chính sách khóa học và học phí của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcbacgiang.com/chinh-sach-khoa-hoc-hoc-phi" />
        <meta property="og:site_name" content="Q&K Bắc Giang" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chính sách Khóa học & Học phí - Q&K Bắc Giang" />
        <meta name="twitter:description" content="Chính sách khóa học và học phí của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <link rel="canonical" href="https://mcbacgiang.com/chinh-sach-khoa-hoc-hoc-phi" />
      </Head>
      <DefaultLayout 
        title="Chính sách Khóa học & Học phí - Q&K Bắc Giang"
        desc="Chính sách khóa học và học phí của Q&K Bắc Giang"
      >
      <div className="h-[80px] "></div>
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-rose-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center gap-3 text-base">
              <Link href="/" className="font-semibold text-gray-700 hover:text-pink-600 hover:underline whitespace-nowrap transition-colors duration-200">
                🏠 Trang chủ
              </Link>
              <span className="text-pink-400 font-bold text-lg">›</span>
              <span className="font-bold text-gray-800 bg-pink-100 px-3 py-1 rounded-full text-sm">
                Chính sách khóa học & học phí
              </span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white p-2">
            <h1 className="text-3xl font-bold text-gray-900 mt-3 text-center">
              Chính sách khóa học & học phí tại Q&K Bắc Giang
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  1.1. Quy trình đăng ký và thanh toán
                </h2>
                
                <p className="text-gray-700 mb-3">
                  Để tạo điều kiện thuận lợi nhất cho quý học viên, Q&K Bắc Giang cung cấp quy trình đăng ký đơn giản và linh hoạt.
                </p>
                
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
                  <li><strong>Bước 1: Tư vấn và chọn khóa học:</strong> Quý học viên có thể liên hệ qua hotline, fanpage hoặc website để được đội ngũ chuyên viên của Q&K Bắc Giang tư vấn chi tiết về các khóa học, giúp lựa chọn lộ trình phù hợp với mục tiêu và nhu cầu cá nhân.</li>
                  <li><strong>Bước 2: Đăng ký:</strong> Sau khi chọn được khóa học, Quý học viên cung cấp thông tin cá nhân cơ bản để hoàn tất thủ tục đăng ký.</li>
                  <li><strong>Bước 3: Thanh toán học phí:</strong> Học phí có thể được thanh toán qua hình thức chuyển khoản ngân hàng hoặc tiền mặt tại văn phòng trung tâm. Quý học viên sẽ nhận được biên lai hoặc email xác nhận thanh toán ngay sau khi hoàn tất.</li>
                </ul>
              </section>

              <section className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  1.2. Chính sách về học phí
                </h2>
                
                <p className="text-gray-700 mb-3">
                  Chúng tôi cam kết công khai, minh bạch về học phí và các chính sách liên quan để đảm bảo quyền lợi tốt nhất cho học viên.
                </p>
                
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
                  <li><strong>Học phí:</strong> Học phí được niêm yết rõ ràng trên website và trong hợp đồng/email xác nhận. Học phí đã bao gồm toàn bộ chi phí giảng dạy, tài liệu, và các buổi thực hành thu hình.</li>
                  <li><strong>Ưu đãi:</strong>Q&K Bắc Giang thường xuyên có các chương trình ưu đãi đặc biệt cho học viên cũ, học viên đăng ký theo nhóm, hoặc các sự kiện đặc biệt. Thông tin sẽ được cập nhật trên website và các kênh truyền thông chính thức.</li>
                </ul>
              </section>

              <section className="mb-3">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  1.3. Chính sách bảo lưu và hoàn học phí
                </h2>
                
                <p className="text-gray-700 mb-3">
                  Q&K Bắc Giang luôn đồng hành và hỗ trợ học viên, nhưng cũng cần có các quy tắc rõ ràng để đảm bảo sự công bằng cho tất cả mọi người.
                </p>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-700 mb-3">
                      <strong>Bảo lưu khóa học:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      <li>Học viên có thể bảo lưu khóa học và tham gia vào đợt khai giảng tiếp theo. Thời gian bảo lưu tối đa là 06 tháng kể từ ngày đăng ký.</li>
                      <li>Yêu cầu bảo lưu phải được thông báo bằng văn bản hoặc email trước ít nhất 07 ngày so với ngày khai giảng để trung tâm sắp xếp.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-gray-700 mb-3">
                      <strong>Hoàn học phí:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                      <li>Q&K Bắc Giang sẽ hoàn lại 100% học phí nếu khóa học bị hủy do lỗi từ phía trung tâm.</li>
                      <li>Trong trường hợp học viên muốn hủy khóa học, học phí sẽ được hoàn lại như sau:
                        <ul className="list-disc list-inside text-gray-700 ml-4 mt-1 space-y-1">
                          <li>Hoàn 100% học phí nếu hủy trước ngày khai giảng ít nhất 07 ngày.</li>
                          <li>Không hoàn lại học phí sau khi khóa học đã bắt đầu buổi học đầu tiên.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  1.4. Cam kết chất lượng đào tạo
                </h2>
                
                <ul className="list-disc list-inside text-gray-700 mb-3 space-y-1">
                  <li><strong>Giảng viên:</strong> Đội ngũ giảng viên là các MC, nhà báo chuyên nghiệp có nhiều năm kinh nghiệm, đảm bảo chất lượng đào tạo chuẩn mực.</li>
                  <li><strong>Lộ trình:</strong> Các khóa học được thiết kế khoa học, kết hợp lý thuyết và thực hành, giúp học viên tiến bộ rõ rệt.</li>
                  <li><strong>Hỗ trợ:</strong> Học viên được hỗ trợ nhiệt tình, tận tâm trong suốt quá trình học và sau khi kết thúc khóa học.</li>
                </ul>
              </section>

              <div className="mt-12 p-6 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">
                  Thông tin liên hệ
                </h3>
                
                <div className="text-pink-800 space-y-1">
                  <p><strong>Trung Tâm Đào tạo MC Q&K Bắc Giang</strong> – Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp</p>
                  <p><strong>Hotline/Zalo:</strong> 081.6997.000</p>
                  <p><strong>Email:</strong> lienhe@mcbacgiang.com</p>
                  <p><strong>Địa chỉ:</strong> Số 1 Nguyễn Văn Linh, phường Bắc Giang, tỉnh Bắc Ninh</p>
                  <p><strong>Website:</strong> mcbacgiang.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
    </>
  );
};

export default ChinhSachKhoaHocHocPhi;
