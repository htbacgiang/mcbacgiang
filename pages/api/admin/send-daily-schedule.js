import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
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

    const { date } = req.body;
    
    // Parse the date or use today with Vietnam timezone
    let targetDate;
    let dateStr;
    
    if (date) {
      // Expecting date as YYYY-MM-DD; avoid timezone shift by using it directly
      dateStr = typeof date === 'string' ? date : new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });
      // Construct Date anchored to Vietnam timezone for display purposes
      targetDate = new Date(`${dateStr}T00:00:00+07:00`);
    } else {
      // Get current date in Vietnam timezone
      const now = new Date();
      dateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD format
      targetDate = new Date(`${dateStr}T00:00:00+07:00`);
    }
    
    console.log(`[Admin Send Daily Schedule] Processing date: ${dateStr} (Vietnam timezone)`);
    
    // Get all class schedules that have sessions on the target date
    const schedulesWithSessions = await ClassSchedule.find({
      isActive: true,
      'classSessions.date': dateStr
    })
    .populate('courseId', 'title subtitle image level slug')
    .sort({ startDate: 1 });

    // Process sessions for the specific date
    const sessions = [];
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
          sessions.push(sessionData);
        }
      });
    });

    // Get actual student counts from internal API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiKey = process.env.CRON_API_KEY || 'btacademy-cron-2024';
    
    let allStudents = [];
    try {
      const studentsResponse = await axios.get(`${baseUrl}/api/internal/students`, {
        params: {
          status: 'Đang học'
        },
        headers: {
          'x-api-key': apiKey
        }
      });
      allStudents = studentsResponse.data.success ? studentsResponse.data.data.students : [];
    } catch (error) {
      console.error('Error fetching students for admin email:', error);
    }

    // Create a map of class -> student count
    const studentCountByClass = {};
    allStudents.forEach(student => {
      if (student.class) {
        studentCountByClass[student.class] = (studentCountByClass[student.class] || 0) + 1;
      }
    });

    // Update sessions with actual student counts
    const schedules = sessions.map(session => ({
      ...session,
      currentStudents: studentCountByClass[session.className] || 0
    }));

    // Get all admin users to send email to
    const adminUsers = await User.find({ 
      role: "admin", 
      emailVerified: true 
    });

    if (adminUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy quản trị viên nào để gửi email",
      });
    }

    // Generate email content
    const emailSubject = `Lịch học ngày ${new Date(targetDate).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - BT Academy`;
    const emailContent = dailyScheduleEmailTemplate(targetDate, schedules);

    // Send emails to all admin users
    const emailPromises = adminUsers.map(admin => 
      sendEmail(
        admin.email,
        '', // url not needed for this template
        '', // txt not needed for this template
        emailSubject,
        emailContent
      ).catch(error => {
        console.error(`Failed to send email to ${admin.email}:`, error);
        return { error: error.message, email: admin.email };
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    
    // Count successful and failed emails
    const successful = emailResults.filter(result => 
      result.status === 'fulfilled' && !result.value?.error
    ).length;
    
    const failed = emailResults.filter(result => 
      result.status === 'rejected' || result.value?.error
    ).length;

    // Log the email sending activity
    console.log(`Daily schedule email sent for ${targetDate.toDateString()}: ${successful} successful, ${failed} failed`);

    res.status(200).json({
      success: true,
      message: `Email đã được gửi thành công đến ${successful} quản trị viên`,
      data: {
        date: targetDate.toISOString().split('T')[0],
        schedulesCount: schedules.length,
        emailsSent: successful,
        emailsFailed: failed,
        totalAdmins: adminUsers.length,
      },
    });

  } catch (error) {
    console.error("Error sending daily schedule email:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi email lịch học",
      error: error.message,
    });
  }
}
