import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !isAgreed) {
      toast.error('Vui lòng nhập email và đồng ý với chính sách bảo mật');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          source: 'newsletter_signup',
          ipAddress: '', // Will be handled by server
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Đăng ký nhận bản tin thành công!');
        setEmail('');
        setIsAgreed(false);
      } else {
        toast.error(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23933ea' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent uppercase tracking-wider">
              Đăng ký nhận bản tin
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-6xl mx-auto leading-relaxed">
            Nhận thông tin về khóa học mới, ưu đãi đặc biệt và mẹo học MC hiệu quả từ Trung Tâm MC Q&K Bắc Giang
          </p>

          {/* Form Container */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn"
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300 shadow-lg"
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Đăng ký ngay</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center justify-center">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="w-5 h-5 text-pink-600 border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 transition-colors duration-200"
                      disabled={isLoading}
                    />
                    {isAgreed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="ml-3 text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    Tôi đồng ý với{' '}
                    <Link href="/chinh-sach-bao-mat" className="text-pink-600 hover:text-pink-700 font-medium underline">
                      chính sách bảo mật
                    </Link>{' '}
                    của Trung Tâm MC Q&K Bắc Giang
                  </span>
                </label>
              </div>
            </form>

    
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
