export const dailyScheduleEmailTemplate = (date, schedules) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  return `<!DOCTYPE html>
<html lang="vi" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Lịch học hôm nay - ${formatDate(date)} - MC Q&K Bắc Giang</title>
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
      max-width: 700px;
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
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      position: relative;
      z-index: 1;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      margin: 0;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .title {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      margin: 0 0 15px 0;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    
    .date-info {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border: 2px solid #ec4899;
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
    }
    
    .date-info h3 {
      color: #be185d;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .schedule-item {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    
    .schedule-item:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-color: #ec4899;
    }
    
    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    
    .class-name {
      color: #1f2937;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      flex: 1;
      min-width: 200px;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-active {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    .status-upcoming {
      background-color: #dbeafe;
      color: #1e40af;
    }
    
    .status-full {
      background-color: #fed7d7;
      color: #c53030;
    }
    
    .course-info {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
    
    .schedule-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #f3f4f6;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #4b5563;
    }
    
    .detail-icon {
      margin-right: 8px;
      font-size: 16px;
    }
    
    .instructor-info {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    
    .instructor-info h4 {
      color: #374151;
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 5px 0;
    }
    
    .instructor-info p {
      color: #6b7280;
      font-size: 13px;
      margin: 0;
    }
    
    .no-classes {
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }
    
    .no-classes-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    
    .footer {
      background-color: #1f2937;
      padding: 30px;
      text-align: center;
    }
    
    .footer-text {
      color: #d1d5db;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }
    
    .footer-links {
      margin-top: 20px;
      padding-top: 15px;
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
        padding: 20px 15px;
      }
      
      .title {
        font-size: 22px;
      }
      
      .schedule-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .status-badge {
        margin-top: 10px;
      }
      
      .schedule-details {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      
      .class-name {
        min-width: auto;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">📚 MC Q&K Bắc Giang</h1>
      <p class="header-subtitle">Lịch học hàng ngày</p>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <h2 class="title">Lịch học hôm nay</h2>
      
      <div class="date-info">
        <h3>🗓️ ${formatDate(date)}</h3>
      </div>
      
      ${schedules.length > 0 ? schedules.map(schedule => `
        <div class="schedule-item">
          <div class="schedule-header">
            <h3 class="class-name">${schedule.sessionNumber ? `Buổi ${schedule.sessionNumber}` : schedule.className}</h3>
        
          </div>
          
          <p class="course-info">📖 ${schedule.className} - ${schedule.courseId?.title || 'N/A'}</p>
          ${schedule.sessionNumber ? `<p class="course-info">📚 Tiến độ: Buổi ${schedule.sessionNumber}/${schedule.totalSessions}</p>` : ''}
          
          <div class="schedule-details">
            <div class="detail-item">
              <span class="detail-icon">⏰</span>
              <span>${schedule.dayOfWeek || schedule.schedule} - ${schedule.startTime} - ${schedule.endTime}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span>${schedule.location}</span>
            </div>
          
          </div>
          
          ${schedule.instructor?.name ? `
            <div class="instructor-info">
              <h4>👨‍🏫 Giảng viên: ${schedule.instructor.name}</h4>
              ${schedule.instructor.experience ? `<p>${schedule.instructor.experience}</p>` : ''}
            </div>
          ` : ''}
        </div>
      `).join('') : `
        <div class="no-classes">
          <div class="no-classes-icon">📅</div>
          <h3>Không có lịch học hôm nay</h3>
          <p>Hôm nay không có lớp học nào được lên lịch.</p>
        </div>
      `}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        Email tự động được gửi từ hệ thống quản lý MC Q&K Bắc Giang<br>
        Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
      </p>
      
      <div class="footer-links">
        <a href="https://mcbacgiang.com">Trang chủ</a>
        <a href="https://mcbacgiang.com/lich-khai-giang">Lịch khai giảng</a>
        <a href="https://mcbacgiang.com/lien-he">Liên hệ</a>
      </div>
    </div>
  </div>
</body>
</html>`;
};
