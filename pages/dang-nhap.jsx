import { useState } from "react";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";

// Schema xác thực với Yup
const loginValidation = Yup.object({
  login_email: Yup.string()
    .required("Vui lòng nhập email hoặc số điện thoại.")
    .test("is-email-or-phone", "Vui lòng nhập email hoặc số điện thoại hợp lệ.", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,11}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }),
  login_password: Yup.string().required("Vui lòng nhập mật khẩu."),
});

export default function Signin({ providers, callbackUrl, csrfToken }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Tải email/số điện thoại từ localStorage
  const initialValues = {
    login_email: typeof window !== "undefined" ? localStorage.getItem("savedEmail") || "" : "",
    login_password: "",
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus("Đang đăng nhập...");
    setSubmitting(true);

    try {
      const isPhone = /^[0-9]{10,11}$/.test(values.login_email);
      const res = await signIn("credentials", {
        redirect: false,
        email: isPhone ? null : values.login_email,
        phone: isPhone ? values.login_email : null,
        password: values.login_password,
        callbackUrl,
      });

      if (res?.error) {
        const errorMessages = {
          CredentialsSignin: "Email hoặc mật khẩu không đúng.",
          Default: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
        };
        const errorMessage = errorMessages[res.error] || errorMessages.Default;
        setStatus(`Lỗi: ${errorMessage}`);
        toast.error(errorMessage);
      } else {
        setStatus("Đăng nhập thành công!");
        toast.success("Đăng nhập thành công!");
        if (rememberMe) {
          localStorage.setItem("savedEmail", values.login_email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        // Lấy thông tin session để kiểm tra role
        const session = await getSession();
        const redirectUrl = session?.user?.role === "admin" ? "/dashboard" : (callbackUrl || "/");

        setTimeout(() => router.push(redirectUrl), 1000);
      }
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi đăng nhập"}`);
      toast.error(error.message || "Đã xảy ra lỗi");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <Head>
        <title>Đăng nhập - Eco Bắc Giang | Eco Coffee</title>
        <meta
          name="description"
          content="Đăng nhập vào MCBacGiang để trải nghiệm các khóa học chất lượng. Đăng nhập bằng email hoặc số điện thoại."
        />
        <meta
          name="keywords"
          content="MC Bắc Giang, đăng nhập, trung tâm đào tạo, khóa học, học online"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Đăng nhập - MC Bắc Giang | Trung tâm đào tạo" />
        <meta
          property="og:description"
          content="Đăng nhập để truy cập các khóa học chất lượng tại MC Bắc Giang - Trung tâm đào tạo uy tín."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcbacgiang.com/dang-nhap" />
        <meta property="og:image" content="/images/mc-bac-giang-og.jpg" />
        <meta property="og:site_name" content="MC Bắc Giang" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Đăng nhập - MC Bắc Giang | Trung tâm đào tạo" />
        <meta
          name="twitter:description"
          content="Đăng nhập để truy cập các khóa học chất lượng tại MC Bắc Giang."
        />
        <meta name="twitter:image" content="/images/mc-bac-giang-og.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://mcbacgiang.com/dang-nhap" />
        <meta httpEquiv="content-language" content="vi" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Đăng nhập - MC Bắc Giang",
            description:
              "Đăng nhập vào MC Bắc Giang để truy cập các khóa học chất lượng.",
            url: "https://mcbacgiang.com/dang-nhap",
            publisher: {
              "@type": "Organization",
              name: "MC Bắc Giang",
              logo: {
                "@type": "ImageObject",
                url: "/images/mc-logo.png",
              },
            },
          })}
        </script>
      </Head>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div
        className="min-h-screen flex items-center justify-center relative bt-pink-bg"
      >

        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-pink-400/25 to-rose-400/25 rounded-full blur-3xl bt-pulse-enhanced"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl bt-pulse-enhanced" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-fuchsia-400/20 rounded-full blur-3xl bt-pulse-enhanced" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-rose-300/15 to-pink-300/15 rounded-full blur-3xl bt-pulse-enhanced" style={{ animationDelay: '1s' }}></div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-2xl bt-floating-1"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-fuchsia-300/25 to-pink-300/25 rounded-full blur-2xl bt-floating-2"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-rose-300/35 to-pink-300/35 rounded-full blur-xl bt-floating-3"></div>
        </div>

        {/* Floating Particles */}
        <div className="bt-particles">
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
          <div className="bt-particle"></div>
        </div>


        {/* Main Container */}
        <div className="relative z-10 w-full max-w-md mx-4">


          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/40 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl bt-shimmer">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Đăng Nhập</h2>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={loginValidation}
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <input type="hidden" name="csrfToken" defaultValue={csrfToken} />

                  {/* Email hoặc Số điện thoại */}
                  <div className="relative">
                    <label htmlFor="login_email" className="block text-gray-900 font-medium text-sm mb-2">
                      Email hoặc Số điện thoại <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white backdrop-blur-sm gap-4 bt-form-input">
                      <span className="pl-3 text-pink-500">
                        <FaEnvelope />
                      </span>
                      <Field
                        id="login_email"
                        name="login_email"
                        type="text"
                        className="w-full p-3 bg-transparent text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Email hoặc Số điện thoại"
                        required
                      />
                    </div>
                    <ErrorMessage
                      name="login_email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Mật khẩu */}
                  <div className="relative">
                    <label htmlFor="login_password" className="block text-gray-900 font-medium text-sm mb-2">
                      Mật khẩu <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white backdrop-blur-sm gap-4 bt-form-input">
                      <span className="pl-3 text-pink-500">
                        <FaLock />
                      </span>
                      <Field
                        id="login_password"
                        name="login_password"
                        type={showPassword ? "text" : "password"}
                        className="w-full p-3 bg-transparent text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="pr-3 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage
                      name="login_password"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Lưu thông tin */}
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      type="checkbox"
                      name="remember_me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-pink-500 bg-white border-gray-300 rounded focus:ring-pink-400"
                    />
                    <label htmlFor="remember_me" className="ml-2 text-gray-900 text-sm">
                      Lưu thông tin đăng nhập
                    </label>
                  </div>

                  {/* Thông báo trạng thái */}
                  {status && (
                    <p
                      className={`text-center font-medium ${status.includes("thành công") ? "text-pink-600" : "text-red-600"
                        }`}
                    >
                      {status}
                    </p>
                  )}

                  {/* Nút đăng nhập */}
                  <button
                    type="submit"
                    disabled={isSubmitting || status === "Đang đăng nhập..."}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bt-button-enhanced bt-ripple"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
                  </button>

                  {/* Quên mật khẩu và Đăng ký */}
                  <div className="text-center mt-4">
                    <Link
                      href="/quen-mat-khau"
                      className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                    <span className="px-2 text-gray-400">|</span>
                    <Link
                      href="/dang-ky"
                      className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                    >
                      Đăng ký
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

export async function getServerSideProps(context) {
  const { req, query } = context;
  const session = await getSession({ req });
  const callbackUrl = query.callbackUrl || process.env.NEXT_PUBLIC_DEFAULT_REDIRECT || "/dashboard";

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: {
      providers: providers || { google: {}, facebook: {} },
      csrfToken: csrfToken || null,
      callbackUrl,
    },
  };
}