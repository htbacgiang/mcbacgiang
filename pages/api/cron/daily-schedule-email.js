import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import Course from "../../../models/Course";
import User from "../../../models/User";
import Student from "../../../models/Student";
import { sendEmail } from "../../../utils/sendEmails";
import { dailyScheduleEmailTemplate } from "../../../emails/dailyScheduleEmailTemplate";

export default async function handler(req, res) {
  // Only allow GET requests (for cron jobs)
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Phương thức không được hỗ trợ",
    });
  }

  // Simple security check - you might want to add a secret token
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.CRON_SECRET_TOKEN || "your-secret-token";
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({
      success: false,
      message: "Không có quyền truy cập",
    });
  }

  try {
    await db.connectDb();

    // Get today's date in Vietnamese timezone using proper timezone handling
    const today = new Date();
    const todayDateStr = today.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD format
    const vietnamTime = new Date(`${todayDateStr}T00:00:00+07:00`); // Create date object for Vietnam timezone
    
    const startDate = new Date(vietnamTime);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(vietnamTime);
    endDate.setHours(23, 59, 59, 999);

    console.log(`[Daily Schedule Email] Processing date: ${todayDateStr} (Vietnam timezone)`);
    console.log(`[Daily Schedule Email] Current UTC time: ${today.toISOString()}`);
    console.log(`[Daily Schedule Email] Vietnam time: ${today.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })}`);
    
    // Get all class schedules that have sessions today
    const schedules = await ClassSchedule.find({
      'classSessions.date': todayDateStr,
      isActive: true,
    })
    .populate('courseId', 'title subtitle image level slug')
    .sort({ startDate: 1 });
    
    console.log(`Found ${schedules.length} schedules with sessions today (${todayDateStr})`);

    // Get all admin users to send email to
    const adminUsers = await User.find({ 
      role: "admin", 
      emailVerified: true 
    });

    if (adminUsers.length === 0) {
      console.log("No admin users found for daily schedule email");
      return res.status(200).json({
        success: true,
        message: "Không có quản trị viên nào để gửi email",
        data: {
          date: todayDateStr,
          schedulesCount: schedules.length,
          emailsSent: 0,
        },
      });
    }


    // Get actual student counts for each class
    const allStudents = await Student.find({ 
      status: { $in: ['Đang học', 'Tạm nghỉ'] } 
    });
    
    console.log(`Found ${allStudents.length} active students`);
    
    // Count students by class name (case-insensitive and trim whitespace)
    const studentCountByClass = {};
    allStudents.forEach(student => {
      if (student.class) {
        const className = student.class.trim();
        studentCountByClass[className] = (studentCountByClass[className] || 0) + 1;
      }
    });

    console.log('Student count by class:', studentCountByClass);
    console.log('Schedule class names:', schedules.map(s => s.className));

    // Process sessions for today and update with student counts
    const sessionsForToday = [];
    schedules.forEach(schedule => {
      const className = schedule.className.trim();
      const studentCount = studentCountByClass[className] || 0;
      
      console.log(`Class: ${className}, Students: ${studentCount}`);
      
      // Find sessions for today
      const todaySessions = schedule.classSessions.filter(session => session.date === todayDateStr);
      
      todaySessions.forEach(session => {
        sessionsForToday.push({
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
      });
    });
    
    console.log(`Processed ${sessionsForToday.length} sessions for today`);

    // Only send email if there are sessions for today OR if it's a configured day
    const shouldSendEmail = sessionsForToday.length > 0 || process.env.SEND_DAILY_EMAIL_ALWAYS === 'true';

    if (!shouldSendEmail) {
      console.log(`No sessions for ${vietnamTime.toDateString()}, skipping email`);
      return res.status(200).json({
        success: true,
        message: "Không có lịch học hôm nay, bỏ qua gửi email",
        data: {
          date: todayDateStr,
          schedulesCount: 0,
          emailsSent: 0,
        },
      });
    }

    // Generate email content
    const emailSubject = `Lịch học ngày ${new Date(vietnamTime).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} - BT Academy`;
    const emailContent = dailyScheduleEmailTemplate(vietnamTime, sessionsForToday);

    // Send emails to all admin users
    const emailPromises = adminUsers.map(admin => 
      sendEmail(
        admin.email,
        '', // url not needed for this template
        '', // txt not needed for this template
        emailSubject,
        emailContent
      ).catch(error => {
        console.error(`Failed to send daily schedule email to ${admin.email}:`, error);
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
    const logMessage = `Daily schedule email cron job executed for ${vietnamTime.toDateString()}: ${successful} successful, ${failed} failed`;
    console.log(logMessage);

    // If there were failures, log the details
    if (failed > 0) {
      const failedEmails = emailResults
        .filter(result => result.status === 'rejected' || result.value?.error)
        .map(result => {
          if (result.status === 'rejected') {
            return result.reason?.message || 'Unknown error';
          }
          return `${result.value.email}: ${result.value.error}`;
        });
      console.error("Failed email details:", failedEmails);
    }

    res.status(200).json({
      success: true,
      message: `Email cron job hoàn thành: ${successful} thành công, ${failed} thất bại`,
      data: {
        date: todayDateStr,
        schedulesCount: sessionsForToday.length,
        emailsSent: successful,
        emailsFailed: failed,
        totalAdmins: adminUsers.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Error in daily schedule email cron job:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi trong cron job gửi email lịch học",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
