// API endpoint for cron job - no authentication needed
import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import User from "../../../models/User";
import Student from "../../../models/Student";
import { sendEmail } from "../../../utils/sendEmails";
import { dailyScheduleEmailTemplate } from "../../../emails/dailyScheduleEmailTemplate";
import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  // Simple API key authentication for cron jobs
  const apiKey = req.headers['x-api-key'] || req.body.apiKey;
  const expectedApiKey = process.env.CRON_API_KEY || 'btacademy-cron-2024';
  
  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid API key",
    });
  }

  try {
    await db.connectDb();

    const { date, type = 'both' } = req.body; // type: 'student', 'admin', 'both'
    
    // Parse the date or use today with Vietnam timezone
    let targetDate;
    let dateStr;
    
    if (date) {
      // Expecting date as YYYY-MM-DD; avoid timezone shift
      dateStr = typeof date === 'string' ? date : new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
      targetDate = new Date(`${dateStr}T00:00:00+07:00`); // Vietnam time
    } else {
      // Get current date in Vietnam timezone using proper timezone handling
      const now = new Date();
      dateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD format
      targetDate = new Date(`${dateStr}T00:00:00+07:00`); // Vietnam time
    }
    
    console.log(`[Daily Email] Processing date: ${dateStr} (Vietnam timezone)`);
    console.log(`[Daily Email] Current UTC time: ${new Date().toISOString()}`);
    console.log(`[Daily Email] Vietnam time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
    
    let results = {};

    // Send student emails
    if (type === 'student' || type === 'both') {
      results.studentEmails = await sendStudentEmails(dateStr, targetDate);
    }

    // Send admin emails  
    if (type === 'admin' || type === 'both') {
      results.adminEmails = await sendAdminEmails(dateStr, targetDate);
    }

    res.status(200).json({
      success: true,
      message: "Daily emails sent successfully",
      data: {
        date: dateStr,
        ...results
      },
    });

  } catch (error) {
    console.error("Error sending daily emails:", error);
    res.status(500).json({
      success: false,
      message: "Error sending daily emails",
      error: error.message,
    });
  }
}

// Send emails to students
async function sendStudentEmails(dateStr, targetDate) {
  // Get class schedules for the date
  const schedulesWithSessions = await ClassSchedule.find({
    isActive: true,
    'classSessions.date': dateStr
  }).populate('courseId', 'title subtitle image level slug');

  // Process sessions by class
  const sessionsByClass = {};
  schedulesWithSessions.forEach(schedule => {
    schedule.classSessions.forEach(session => {
      if (session.date === dateStr) {
        const sessionData = {
          _id: `${schedule._id}_${session.sessionNumber}`,
          sessionNumber: session.sessionNumber,
          className: schedule.className,
          courseId: schedule.courseId,
          date: session.date,
          dateString: session.dateString,
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
          location: schedule.location,
          instructor: schedule.instructor,
          maxStudents: schedule.maxStudents,
          currentStudents: schedule.currentStudents,
          price: schedule.price,
          discountPrice: schedule.discountPrice,
          status: schedule.status,
          description: schedule.description,
          requirements: schedule.requirements,
          benefits: schedule.benefits,
          totalSessions: schedule.totalSessions,
          schedule: `${session.dayOfWeek}, ${session.startTime} - ${session.endTime}`,
          title: `${schedule.className} - Buổi ${session.sessionNumber}`
        };
        
        if (!sessionsByClass[schedule.className]) {
          sessionsByClass[schedule.className] = [];
        }
        sessionsByClass[schedule.className].push(sessionData);
      }
    });
  });

  const classNamesWithSessions = Object.keys(sessionsByClass);
  if (classNamesWithSessions.length === 0) {
    return { emailsSent: 0, emailsFailed: 0, totalStudents: 0, message: "No classes today" };
  }

  // Get students from internal API for the classes that have sessions today
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const apiKey = process.env.CRON_API_KEY || 'btacademy-cron-2024';
  
  let students = [];
  try {
    const studentsResponse = await axios.get(`${baseUrl}/api/internal/students`, {
      params: {
        classes: classNamesWithSessions.join(','),
        status: 'Đang học',
        emailEnabled: true
      },
      headers: {
        'x-api-key': apiKey
      }
    });
    
    students = studentsResponse.data.success ? studentsResponse.data.data.students : [];
  } catch (error) {
    console.error('Error fetching students from API:', error);
    return { emailsSent: 0, emailsFailed: 0, totalStudents: 0, message: "Error fetching students" };
  }

  let emailsSent = 0;
  let emailsFailed = 0;

  // Send emails to each student
  for (const student of students) {
    const studentSessions = sessionsByClass[student.class] || [];
    if (studentSessions.length === 0) continue;

    const emailSubject = `Lịch học hôm nay - ${targetDate.toLocaleDateString('vi-VN')} - BT Academy`;
    const emailContent = createPersonalizedEmailTemplate(targetDate, studentSessions, student);
    
    console.log(`[Student Email] Sending to ${student.fullName} for ${studentSessions.length} sessions on ${dateStr}`);

    // Determine recipients
    const recipients = [];
    if (student.courseType === "MC nhí") {
      switch (student.emailSettings.emailRecipient) {
        case "parent":
          if (student.parentInfo.parentEmail) {
            recipients.push(student.parentInfo.parentEmail);
          }
          break;
        case "student":
          recipients.push(student.email);
          break;
        case "both":
          recipients.push(student.email);
          if (student.parentInfo.parentEmail) {
            recipients.push(student.parentInfo.parentEmail);
          }
          break;
      }
    } else {
      recipients.push(student.email);
    }

    // Send to all recipients
    for (const email of recipients) {
      try {
        await sendEmail(email, '', '', emailSubject, emailContent);
        emailsSent++;
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        emailsFailed++;
      }
    }
  }

  return {
    emailsSent,
    emailsFailed,
    totalStudents: students.length,
    classesWithSessions: classNamesWithSessions
  };
}

// Send emails to admins
async function sendAdminEmails(dateStr, targetDate) {
  // Get all sessions for the date
  const schedulesWithSessions = await ClassSchedule.find({
    isActive: true,
    'classSessions.date': dateStr
  }).populate('courseId', 'title subtitle image level slug');

  // Get actual student counts directly from database
  const allStudents = await Student.find({ 
    status: { $in: ['Đang học', 'Tạm nghỉ'] } 
  });
  
  console.log(`[Admin Email] Found ${allStudents.length} active students`);
  
  // Create a map of class -> student count (case-insensitive and trim whitespace)
  const studentCountByClass = {};
  allStudents.forEach(student => {
    if (student.class) {
      const className = student.class.trim();
      studentCountByClass[className] = (studentCountByClass[className] || 0) + 1;
    }
  });

  console.log('[Admin Email] Student count by class:', studentCountByClass);

  const sessions = [];
  schedulesWithSessions.forEach(schedule => {
    const className = schedule.className.trim();
    const studentCount = studentCountByClass[className] || 0;
    
    console.log(`[Admin Email] Class: ${className}, Students: ${studentCount}`);
    
    schedule.classSessions.forEach(session => {
      if (session.date === dateStr) {
        sessions.push({
          _id: `${schedule._id}_${session.sessionNumber}`,
          sessionNumber: session.sessionNumber,
          className: schedule.className,
          courseId: schedule.courseId,
          date: session.date,
          dateString: session.dateString,
          dayOfWeek: session.dayOfWeek,
          startTime: session.startTime,
          endTime: session.endTime,
          location: schedule.location,
          instructor: schedule.instructor,
          maxStudents: schedule.maxStudents,
          currentStudents: studentCount, // Use actual student count
          price: schedule.price,
          discountPrice: schedule.discountPrice,
          status: schedule.status,
          description: schedule.description,
          requirements: schedule.requirements,
          benefits: schedule.benefits,
          totalSessions: schedule.totalSessions,
          schedule: `${session.dayOfWeek}, ${session.startTime} - ${session.endTime}`,
          title: `${schedule.className} - Buổi ${session.sessionNumber}`
        });
      }
    });
  });
  
  console.log(`[Admin Email] Processed ${sessions.length} sessions for ${dateStr}`);

  // Get admin users
  const adminUsers = await User.find({ 
    role: "admin", 
    emailVerified: true 
  });

  if (adminUsers.length === 0) {
    return { emailsSent: 0, emailsFailed: 0, totalAdmins: 0, message: "No admin users found" };
  }

  const emailSubject = `Lịch học ngày ${targetDate.toLocaleDateString('vi-VN')} - BT Academy`;
  const emailContent = dailyScheduleEmailTemplate(targetDate, sessions);
  
  console.log(`[Admin Email] Sending email for ${sessions.length} sessions on ${dateStr}`);

  let emailsSent = 0;
  let emailsFailed = 0;

  // Send to all admins
  for (const admin of adminUsers) {
    try {
      await sendEmail(admin.email, '', '', emailSubject, emailContent);
      emailsSent++;
    } catch (error) {
      console.error(`Failed to send email to admin ${admin.email}:`, error);
      emailsFailed++;
    }
  }

  return {
    emailsSent,
    emailsFailed,
    totalAdmins: adminUsers.length,
    schedulesCount: sessions.length
  };
}

// Create personalized email template
function createPersonalizedEmailTemplate(date, schedules, student) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isParentEmail = student.courseType === "MC nhí" && 
    (student.emailSettings.emailRecipient === "parent" || student.emailSettings.emailRecipient === "both");

  const greeting = isParentEmail 
    ? `Kính chào ${student.parentInfo.parentName || "Phụ huynh"},<br><br>Đây là lịch học hôm nay của con em ${student.fullName}:`
    : `Xin chào ${student.fullName},<br><br>Đây là lịch học hôm nay của bạn:`;

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lịch học hôm nay - ${formatDate(date)} - BT Academy</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; margin: -20px -20px 20px -20px; }
    .title { color: #1f2937; font-size: 24px; margin-bottom: 10px; }
    .date-info { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; }
    .schedule-item { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
    .class-name { color: #1f2937; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
    .schedule-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .detail-item { font-size: 14px; color: #4b5563; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 BT Academy</h1>
      <p>Lịch học cá nhân</p>
    </div>
    
    <div style="margin: 20px 0;">
      ${greeting}
    </div>
    
    <div class="date-info">
      <h3>🗓️ ${formatDate(date)}</h3>
    </div>
    
    ${schedules.map(schedule => `
      <div class="schedule-item">
        <div class="class-name">${schedule.sessionNumber ? `Buổi ${schedule.sessionNumber}` : schedule.className}</div>
        <p style="color: #6b7280; margin: 5px 0;">📖 ${schedule.className} - ${schedule.courseId?.title || 'N/A'}</p>
        ${schedule.sessionNumber ? `<p style="color: #6b7280; margin: 5px 0;">📚 Tiến độ: Buổi ${schedule.sessionNumber}/${schedule.totalSessions}</p>` : ''}
        
        <div class="schedule-details">
          <div class="detail-item">⏰ ${schedule.dayOfWeek} - ${schedule.startTime} - ${schedule.endTime}</div>
          <div class="detail-item">📍 ${schedule.location}</div>
          <div class="detail-item">👨‍🏫 ${schedule.instructor?.name || 'N/A'}</div>
          <div class="detail-item">👥 Học viên: ${schedule.currentStudents || 0}/${schedule.maxStudents || 0}</div>
        </div>
        
        ${schedule.instructor?.experience ? `<p style="color: #6b7280; font-size: 12px; margin-top: 10px;">${schedule.instructor.experience}</p>` : ''}
      </div>
    `).join('')}
    
    <div class="footer">
      <p>Email tự động từ BT Academy<br>
      Thời gian gửi: ${new Date().toLocaleString('vi-VN')}</p>
      <p><a href="https://btacademy.vn">Trang chủ</a> | <a href="https://btacademy.vn/lien-he">Liên hệ</a></p>
    </div>
  </div>
</body>
</html>`;
}
