export const forgotPasswordEmailTemplate = (to, resetCode) => {
  return `<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Mã xác nhận đặt lại mật khẩu - Q&K Bắc Giang</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    /* Main styles */
    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #f8fafc;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .header {
      background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
      opacity: 0.3;
    }
    
    .logo {
      position: relative;
      z-index: 1;
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .content {
      padding: 50px 40px;
    }
    
    .title {
      color: #1f2937;
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      margin: 0 0 20px 0;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 18px;
      text-align: center;
      margin: 0 0 40px 0;
      line-height: 1.5;
    }
    
    .code-container {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      padding: 30px;
      margin: 40px 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .code-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ec4899, #f43f5e, #db2777);
    }
    
    .code-label {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 15px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .reset-code {
      color: #1f2937;
      font-size: 36px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .info-text {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin: 30px 0;
      text-align: center;
    }
    
    .warning-text {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 16px;
      margin: 30px 0;
      text-align: center;
    }
    
    .warning-text p {
      color: #92400e;
      font-size: 14px;
      margin: 0;
      font-weight: 500;
    }
    
    .footer {
      background-color: #1f2937;
      padding: 40px 30px;
      text-align: center;
    }
    
    .footer-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 15px 0;
    }
    
    .footer-text {
      color: #d1d5db;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    
    .contact-info {
      background-color: #374151;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .contact-info p {
      color: #ffffff;
      font-size: 14px;
      margin: 0;
    }
    
    .contact-info a {
      color: #ec4899;
      text-decoration: none;
      font-weight: 600;
    }
    
    .footer-links {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #374151;
    }
    
    .footer-links a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 12px;
      margin: 0 10px;
    }
    
    .footer-links a:hover {
      color: #ec4899;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .header, .content, .footer {
        padding: 30px 20px;
      }
      
      .title {
        font-size: 24px;
      }
      
      .subtitle {
        font-size: 16px;
      }
      
      .reset-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
      
      .code-container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">Q&K Bắc Giang</h1>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <h2 class="title">Mã xác nhận đặt lại mật khẩu</h2>
      <p class="subtitle">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn</p>
      
      <div class="code-container">
        <p class="code-label">Mã xác nhận của bạn</p>
        <h3 class="reset-code">${resetCode}</h3>
      </div>
      
      <p class="info-text">
        Mã xác nhận này có hiệu lực trong <strong>15 phút</strong>. 
        Vui lòng sử dụng mã này để đặt lại mật khẩu của bạn.
      </p>
      
      <div class="warning-text">
        <p>⚠️ Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và đảm bảo tài khoản của bạn được bảo mật.</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <h3 class="footer-title">Hỗ trợ khách hàng</h3>
      <p class="footer-text">
        Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. 
        Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
      </p>
      
      <div class="contact-info">
        <p>📞 Hotline: <a href="tel:0816997000">081.6997.000</a></p>
        <p>✉️ Email: <a href="mailto:lienhe@mcbacgiang.com">lienhe@mcbacgiang.com</a></p>
      </div>
      
      <div class="footer-links">
        <a href="https://mcbacgiang.com">Trang chủ</a>
        <a href="https://mcbacgiang.com/chinh-sach-bao-mat">Chính sách bảo mật</a>
        <a href="https://mcbacgiang.com/terms">Điều khoản sử dụng</a>
        <a href="https://mcbacgiang.com/unsubscribe">Hủy đăng ký</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};
