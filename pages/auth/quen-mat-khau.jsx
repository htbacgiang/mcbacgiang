import { useState } from "react";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

// Schema xác thực với Yup
const forgotPasswordValidation = Yup.object({
  email: Yup.string()
    .email("Vui lòng nhập email hợp lệ")
    .required("Vui lòng nhập email"),
});

export default function ForgotPassword() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus("Đang gửi mã xác nhận...");
    setIsLoading(true);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Mã xác nhận đã được gửi đến email của bạn!");
        toast.success("Mã xác nhận đã được gửi đến email của bạn!");
        
        // Chuyển hướng đến trang nhập mã xác nhận
        setTimeout(() => {
          window.location.href = `/auth/dat-lai-mat-khau?email=${encodeURIComponent(values.email)}`;
        }, 2000);
      } else {
        setStatus(`Lỗi: ${data.message}`);
        toast.error(data.message);
      }
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi gửi email"}`);
      toast.error(error.message || "Đã xảy ra lỗi");
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Quên mật khẩu - BT Academy</title>
        <meta
          name="description"
          content="Quên mật khẩu? Nhập email để nhận mã xác nhận đặt lại mật khẩu từ BT Academy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="min-h-screen flex items-center justify-center relative bt-green-bg">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-green-400/25 to-emerald-400/25 rounded-full blur-3xl bt-pulse-enhanced"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl bt-pulse-enhanced" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-3xl bt-pulse-enhanced" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-300/15 to-green-300/15 rounded-full blur-3xl bt-pulse-enhanced" style={{animationDelay: '1s'}}></div>
          
          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-green-300/30 to-emerald-300/30 rounded-full blur-2xl bt-floating-1"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-teal-300/25 to-green-300/25 rounded-full blur-2xl bt-floating-2"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-300/35 to-cyan-300/35 rounded-full blur-xl bt-floating-3"></div>
        </div>
        
        {/* Floating Leaf Icons */}
        <div className="absolute top-20 left-20 text-white/20 animate-bounce">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 8 17 8z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 right-16 text-white/15 animate-bounce delay-1000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 8 17 8z"/>
          </svg>
        </div>
        <div className="absolute top-1/2 right-20 text-white/10 animate-bounce delay-2000">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75S7 8 17 8z"/>
          </svg>
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Forgot Password Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl">
            <div className="flex items-center mb-6">
              <Link
                href="/dang-nhap"
                className="text-white/70 hover:text-white transition-colors mr-3"
              >
                <FaArrowLeft className="w-5 h-5" />
              </Link>
              <h2 className="text-3xl font-bold text-white">Quên mật khẩu</h2>
            </div>
            
            <p className="text-white/80 text-sm mb-6">
              Nhập email của bạn để nhận mã xác nhận đặt lại mật khẩu
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordValidation}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Email */}
                  <div className="relative">
                    <label htmlFor="email" className="block text-white text-sm mb-2">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <div className="flex items-center border border-white/30 rounded-lg bg-white/10 backdrop-blur-sm gap-4">
                      <span className="pl-3 text-green-400">
                        <FaEnvelope />
                      </span>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="w-full p-3 bg-transparent text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Nhập email của bạn"
                        required
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Thông báo trạng thái */}
                  {status && (
                    <p
                      className={`text-center ${
                        status.includes("thành công") || status.includes("đã được gửi") 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}
                    >
                      {status}
                    </p>
                  )}

                  {/* Nút gửi mã */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting || isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
                  </button>

                  {/* Quay lại đăng nhập */}
                  <div className="text-center mt-4">
                    <Link
                      href="/dang-nhap"
                      className="text-green-300 hover:text-green-200 transition-colors"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
