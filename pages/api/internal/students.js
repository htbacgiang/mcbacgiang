// Internal API for getting students data - for cron jobs and internal use
import db from "../../../utils/db";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  // Simple API key authentication for internal use
  const apiKey = req.headers['x-api-key'] || req.body.apiKey;
  const expectedApiKey = process.env.CRON_API_KEY || 'btacademy-cron-2024';
  
  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid API key",
    });
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await db.connectDb();

    const { 
      classes, // Filter by class names
      status = "Đang học", // Default to active students
      emailEnabled = true // Only students who want to receive emails
    } = req.query;

    // Build filter
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (classes) {
      const classArray = Array.isArray(classes) ? classes : classes.split(',');
      filter.class = { $in: classArray };
    }
    
    if (emailEnabled === 'true' || emailEnabled === true) {
      // Include students who want to receive daily schedule emails
      filter['emailSettings.receiveDailySchedule'] = { $ne: false };
    }

    // Get students with only necessary fields
    const students = await Student.find(filter).select(
      'fullName email class status courseType emailSettings parentInfo'
    ).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        students,
        total: students.length,
        filters: {
          classes: classes ? (Array.isArray(classes) ? classes : classes.split(',')) : null,
          status,
          emailEnabled
        }
      }
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message
    });
  }
}
