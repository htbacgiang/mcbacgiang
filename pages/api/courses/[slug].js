import db from "../../../utils/db";
import Course from "../../../models/Course";

export default async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 'error', err: "Method not allowed" });
  }

  try {
    await db.connectDb();
    const { slug } = req.query;
    
    // Find course by slug
    const course = await Course.findOne({ 
      slug: slug, 
      isDeleted: { $ne: true } 
    });

    if (!course) {
      return res.status(404).json({ status: 'error', err: "Course not found" });
    }

    res.json({
      status: "success",
      course,
    });
  } catch (err) {
    console.error('Error fetching course by slug:', err);
    return res.status(500).json({ status: 'error', err: err.message });
  }
};
