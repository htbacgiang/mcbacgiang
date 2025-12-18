import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await db.connectDb();

  if (req.method === "GET") {
    try {
      // Get total students count
      const totalStudents = await Student.countDocuments({});
      
      // Get students by status
      const studentsByStatus = await Student.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Get students by course
      const studentsByCourse = await Student.aggregate([
        {
          $group: {
            _id: "$course",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Get students by class
      const studentsByClass = await Student.aggregate([
        {
          $group: {
            _id: "$class",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      // Get students by course type
      const studentsByCourseType = await Student.aggregate([
        {
          $group: {
            _id: "$courseType",
            count: { $sum: 1 }
          }
        }
      ]);

      // Get recent students (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentStudents = await Student.countDocuments({
        enrollmentDate: { $gte: thirtyDaysAgo }
      });

      // Convert arrays to objects for easier access
      const statusCounts = {};
      studentsByStatus.forEach(item => {
        statusCounts[item._id] = item.count;
      });

      const courseCounts = {};
      studentsByCourse.forEach(item => {
        courseCounts[item._id] = item.count;
      });

      const classCounts = {};
      studentsByClass.forEach(item => {
        classCounts[item._id] = item.count;
      });

      const courseTypeCounts = {};
      studentsByCourseType.forEach(item => {
        courseTypeCounts[item._id] = item.count;
      });

      const stats = {
        totalStudents,
        recentStudents,
        statusCounts,
        courseCounts,
        classCounts,
        courseTypeCounts,
        studentsByStatus: studentsByStatus,
        studentsByCourse: studentsByCourse,
        studentsByClass: studentsByClass,
        studentsByCourseType: studentsByCourseType
      };

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error("Error fetching student stats:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching student stats",
        error: error.message
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    });
  }
}
