import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import Student from "../../../models/Student";
import Course from "../../../models/Course";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { sendEmail } from "../../../utils/sendEmails";
import { dailyScheduleEmailTemplate } from "../../../emails/dailyScheduleEmailTemplate";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Phương thức không được hỗ trợ",
    });
  }

  // Check authentication and admin role
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Bạn cần đăng nhập để truy cập",
    });
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền truy cập trang này",
    });
  }

  try {
    await db.connectDb();

    const { date, classNames } = req.body;
    
    // Parse the date or use today with Vietnam timezone
    let targetDate;
    let dateStr;
    
    if (date) {
      // Expecting date as YYYY-MM-DD; avoid timezone shift by using it directly
      dateStr = typeof date === 'string' ? date : new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
      targetDate = new Date(`${dateStr}T00:00:00+07:00`);
    } else {
      // Get current date in Vietnam timezone
      const now = new Date();
      dateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD format
      targetDate = new Date(`${dateStr}T00:00:00+07:00`);
    }
    
    console.log(`[Admin Send Student Daily Schedule] Processing date: ${dateStr} (Vietnam timezone)`);
    
    // Get all class schedules that have sessions on the target date
    let query = {
      isActive: true,
      'classSessions.date': dateStr
    };

    // If specific class names are provided, filter by them
    if (classNames && classNames.length > 0) {
      query.className = { $in: classNames };
    }

    const schedulesWithSessions = await ClassSchedule.find(query)
      .populate('courseId', 'title subtitle image level slug')
      .sort({ startDate: 1 });

    // Process sessions for the specific date
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

    // Get all students who are in classes that have sessions today and want to receive emails
    const classNamesWithSessions = Object.keys(sessionsByClass);
    if (classNamesWithSessions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có lớp học nào hôm nay",
        data: {
          date: targetDate.toISOString().split('T')[0],
          schedulesCount: 0,
          emailsSent: 0,
          emailsFailed: 0,
          totalStudents: 0,
        },
      });
    }

    // Use internal API to get students
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
      // Fallback to direct database query if API fails
      students = await Student.find({
        class: { $in: classNamesWithSessions },
        status: "Đang học",
        'emailSettings.receiveDailySchedule': { $ne: false }
      }).select('fullName email class status courseType emailSettings parentInfo');
    }

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Không có học viên nào đăng ký nhận email",
        data: {
          date: targetDate.toISOString().split('T')[0],
          schedulesCount: Object.values(sessionsByClass).flat().length,
          emailsSent: 0,
          emailsFailed: 0,
          totalStudents: 0,
        },
      });
    }

    // Send personalized emails to each student
    const emailPromises = [];
    let emailsSent = 0;
    let emailsFailed = 0;

    for (const student of students) {
      const studentSessions = sessionsByClass[student.class] || [];
      
      if (studentSessions.length === 0) continue;

      // Generate personalized email content
      const emailSubject = `Lịch học hôm nay - ${new Date(targetDate).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - BT Academy`;
      const personalizedTemplate = createPersonalizedEmailTemplate(targetDate, studentSessions, student);

      // Determine email recipients based on course type and settings
      const emailRecipients = [];
      
      if (student.courseType === "MC nhí") {
        // For MC nhí, send to parent, student, or both based on settings
        switch (student.emailSettings.emailRecipient) {
          case "parent":
            if (student.parentInfo.parentEmail) {
              emailRecipients.push({
                email: student.parentInfo.parentEmail,
                name: student.parentInfo.parentName || "Phụ huynh",
                type: "parent"
              });
            }
            break;
          case "student":
            emailRecipients.push({
              email: student.email,
              name: student.fullName,
              type: "student"
            });
            break;
          case "both":
            emailRecipients.push({
              email: student.email,
              name: student.fullName,
              type: "student"
            });
            if (student.parentInfo.parentEmail) {
              emailRecipients.push({
                email: student.parentInfo.parentEmail,
                name: student.parentInfo.parentName || "Phụ huynh",
                type: "parent"
              });
            }
            break;
        }
      } else {
        // For adult courses, send to student
        emailRecipients.push({
          email: student.email,
          name: student.fullName,
          type: "student"
        });
      }

      // Send emails to all recipients for this student
      for (const recipient of emailRecipients) {
        const emailPromise = sendEmail(
          recipient.email,
          '', // url not needed for this template
          '', // txt not needed for this template
          emailSubject,
          personalizedTemplate
        ).then(() => {
          emailsSent++;
          console.log(`Successfully sent email to ${recipient.email} (${recipient.type}) for student ${student.fullName}`);
        }).catch(error => {
          emailsFailed++;
          console.error(`Failed to send email to ${recipient.email} for student ${student.fullName}:`, error);
          return { error: error.message, email: recipient.email, student: student.fullName };
        });
        
        emailPromises.push(emailPromise);
      }
    }

    // Wait for all emails to be sent
    await Promise.allSettled(emailPromises);

    // Log the email sending activity
    console.log(`Student daily schedule email sent for ${targetDate.toDateString()}: ${emailsSent} successful, ${emailsFailed} failed`);

    res.status(200).json({
      success: true,
      message: `Email đã được gửi thành công đến ${emailsSent} người nhận`,
      data: {
        date: targetDate.toISOString().split('T')[0],
        schedulesCount: Object.values(sessionsByClass).flat().length,
        emailsSent: emailsSent,
        emailsFailed: emailsFailed,
        totalStudents: students.length,
        classesWithSessions: classNamesWithSessions,
      },
    });

  } catch (error) {
    console.error("Error sending student daily schedule email:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi email lịch học cho học viên",
      error: error.message,
    });
  }
}

// Create personalized email template for each student
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
