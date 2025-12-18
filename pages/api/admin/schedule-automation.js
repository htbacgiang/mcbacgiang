import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Store for cron jobs (in production, you'd want to use a database or Redis)
let cronJobs = {
  dailyStudentEmail: {
    enabled: false,
    time: "07:00", // Default time
    timezone: "Asia/Ho_Chi_Minh",
    lastRun: null,
    nextRun: null
  },
  dailyAdminEmail: {
    enabled: false,
    time: "08:00", // Default time
    timezone: "Asia/Ho_Chi_Minh",
    lastRun: null,
    nextRun: null
  }
};

export default async function handler(req, res) {
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

    if (req.method === "GET") {
      // Get current automation settings
      return res.status(200).json({
        success: true,
        data: cronJobs,
      });
    }

    if (req.method === "POST") {
      const { type, enabled, time, timezone = "Asia/Ho_Chi_Minh" } = req.body;

      if (!type || !["dailyStudentEmail", "dailyAdminEmail"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Loại automation không hợp lệ",
        });
      }

      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (time && !timeRegex.test(time)) {
        return res.status(400).json({
          success: false,
          message: "Định dạng thời gian không hợp lệ (HH:MM)",
        });
      }

      // Update cron job settings
      cronJobs[type] = {
        ...cronJobs[type],
        enabled: enabled !== undefined ? enabled : cronJobs[type].enabled,
        time: time || cronJobs[type].time,
        timezone: timezone,
        lastRun: cronJobs[type].lastRun,
        nextRun: enabled ? calculateNextRun(time || cronJobs[type].time, timezone) : null
      };

      // In a real application, you would:
      // 1. Save to database
      // 2. Update actual cron jobs (using node-cron, agenda, bull, etc.)
      // 3. Set up the scheduling system

      return res.status(200).json({
        success: true,
        message: `Cài đặt automation ${type} đã được cập nhật`,
        data: cronJobs[type],
      });
    }

    if (req.method === "DELETE") {
      const { type } = req.body;

      if (!type || !cronJobs[type]) {
        return res.status(400).json({
          success: false,
          message: "Loại automation không hợp lệ",
        });
      }

      // Disable the cron job
      cronJobs[type].enabled = false;
      cronJobs[type].nextRun = null;

      return res.status(200).json({
        success: true,
        message: `Automation ${type} đã được tắt`,
        data: cronJobs[type],
      });
    }

    return res.status(405).json({
      success: false,
      message: "Phương thức không được hỗ trợ",
    });

  } catch (error) {
    console.error("Error managing schedule automation:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi quản lý automation",
      error: error.message,
    });
  }
}

// Helper function to calculate next run time
function calculateNextRun(time, timezone) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const nextRun = new Date();
  
  nextRun.setHours(hours, minutes, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  
  return nextRun.toISOString();
}
