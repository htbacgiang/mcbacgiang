import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DefaultLayout from '../components/layout/DefaultLayout';

const ChinhSachBaoMat = () => {
  return (
    <>
      <Head>
        <title>Chính sách Bảo mật - Q&K Bắc Giang</title>
        <meta name="description" content="Chính sách bảo mật thông tin cá nhân của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <meta name="keywords" content="chính sách bảo mật, bảo vệ thông tin, quyền riêng tư, Q&K Bắc Giang, đào tạo MC, luyện giọng, Bắc Giang, Bắc Ninh" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Chính sách Bảo mật - Q&K Bắc Giang" />
        <meta property="og:description" content="Chính sách bảo mật thông tin cá nhân của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcbacgiang.com/chinh-sach-bao-mat" />
        <meta property="og:site_name" content="Q&K Bắc Giang" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chính sách Bảo mật - Q&K Bắc Giang" />
        <meta name="twitter:description" content="Chính sách bảo mật thông tin cá nhân của Q&K Bắc Giang - Trung tâm đào tạo MC, luyện giọng, sửa ngọng & kỹ năng giao tiếp" />
        <link rel="canonical" href="https://mcbacgiang.com/chinh-sach-bao-mat" />
      </Head>
      <DefaultLayout 
        title="Chính sách Bảo mật - Q&K Bắc Giang"
        desc="Chính sách bảo mật thông tin cá nhân của Q&K Bắc Giang"
      >
        <div className="h-[80px] "></div>
        <div className="min-h-screen ">
          {/* Breadcrumb */}
          <div className="flex font-bold gap-2 text-base text-gray-600">
            <Link href="/" className="hover:text-blue-800 whitespace-nowrap">
              Trang chủ
            </Link>
            <span>›</span>
            <span className="flex font-bold gap-2 mb-2 text-base text-gray-600">
              Chính sách bảo mật
            </span>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="bg-white">
              <h1 className="text-3xl font-bold text-gray-900 mt-3 text-center">
                Chính sách bảo mật thông tin cá nhân
              </h1>
              <div className="prose prose-lg max-w-none">
                <section className="mb-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    1.1. Mục đích và phạm vi thu thập thông tin
                  </h2>
                  
                  <p className="text-gray-700 mb-1">
                    Q&K Bắc Giang thu thập thông tin cá nhân của quý học viên thông qua các kênh:
                  </p>
                  
                  <ul className="list-disc list-inside text-gray-700 mb-1 space-y-1">
                    <li>Đăng ký tài khoản trên website, ứng dụng (nếu có).</li>
                    <li>Đăng ký tư vấn hoặc mua khóa học trực tuyến.</li>
                    <li>Trực tiếp tại văn phòng của Q&K Bắc Giang.</li>
                  </ul>
                  
                  <p className="text-gray-700 mb-1">
                    Thông tin chúng tôi thu thập có thể bao gồm:
                  </p>
                  
                  <ul className="list-disc list-inside text-gray-700 mb-1 space-y-1">
                    <li>Họ và tên, giới tính, ngày sinh.</li>
                    <li>Địa chỉ email, số điện thoại, địa chỉ liên hệ.</li>
                    <li>Thông tin thanh toán (chỉ lưu giữ thông tin chi tiết về đơn hàng đã thanh toán, không lưu giữ thông tin tài khoản ngân hàng).</li>
                  </ul>
                  
                  <p className="text-gray-700 mb-1">
                    Mục đích của việc thu thập thông tin là để:
                  </p>
                  
                  <ul className="list-disc list-inside text-gray-700 mb-1 space-y-1">
                    <li>Xác nhận và xử lý đơn đăng ký khóa học.</li>
                    <li>Liên hệ, tư vấn và hỗ trợ Quý học viên trong suốt quá trình học tập.</li>
                    <li>Cung cấp các thông tin hữu ích về khóa học, ưu đãi, và các sự kiện của Q&K Bắc Giang.</li>
                    <li>Quản lý lớp học và đảm bảo quyền lợi của học viên.</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    1.2. Phạm vi và thời gian sử dụng thông tin
                  </h2>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-700 mb-1">
                        <strong>Phạm vi:</strong> Thông tin cá nhân của Quý học viên chỉ được sử dụng nội bộ trong Q&K Bắc Giang để phục vụ các mục đích đã nêu ở trên. Chúng tôi cam kết bảo mật tuyệt đối, không chia sẻ hay chuyển giao thông tin cho bên thứ ba (ngoại trừ các trường hợp bắt buộc theo quy định của pháp luật).
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-700">
                        <strong>Thời gian lưu trữ:</strong> Dữ liệu học viên sẽ được lưu trữ trên hệ thống của Q&K Bắc Giang cho đến khi có yêu cầu hủy bỏ hoặc theo quy định của pháp luật.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    1.3. Cam kết bảo mật
                  </h2>
                  
                  <p className="text-gray-700 mb-1">
                    Q&K Bắc Giang cam kết thực hiện các biện pháp kỹ thuật và an ninh để bảo vệ thông tin cá nhân của Quý học viên, ngăn chặn truy cập, sử dụng hoặc tiết lộ thông tin trái phép.
                  </p>
                  
                  <p className="text-gray-700">
                    Nếu Quý học viên phát hiện thông tin của mình bị sử dụng sai mục đích hoặc có bất kỳ thắc mắc nào về chính sách này, vui lòng liên hệ với chúng tôi để được hỗ trợ kịp thời.
                  </p>
                </section>

                <div className="mt-12 p-6 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                  <h3 className="text-lg font-semibold text-pink-900 mb-1">
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

export default ChinhSachBaoMat;
