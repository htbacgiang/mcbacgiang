import db from "../../../../utils/db";
import ClassSchedule from "../../../../models/ClassSchedule";
import Course from "../../../../models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

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

  if (req.method === "GET") {
    try {
      await db.connectDb();

      const { period = "month" } = req.query;
      
      // Calculate date range based on period
      const now = new Date();
      let startDate, endDate;
      
      switch (period) {
        case "week":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      // Basic statistics
      const totalSchedules = await ClassSchedule.countDocuments();
      const activeSchedules = await ClassSchedule.countDocuments({ isActive: true });
      const deletedSchedules = await ClassSchedule.countDocuments({ isDeleted: true });

      // Status statistics
      const statusStats = await ClassSchedule.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Monthly statistics for the current year
      const monthlyStats = await ClassSchedule.aggregate([
        {
          $match: {
            startDate: {
              $gte: new Date(now.getFullYear(), 0, 1),
              $lte: new Date(now.getFullYear(), 11, 31)
            }
          }
        },
        {
          $group: {
            _id: { $month: "$startDate" },
            count: { $sum: 1 },
            totalStudents: { $sum: "$currentStudents" },
            totalCapacity: { $sum: "$maxStudents" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Course statistics
      const courseStats = await ClassSchedule.aggregate([
        {
          $group: {
            _id: "$courseId",
            count: { $sum: 1 },
            totalStudents: { $sum: "$currentStudents" },
            totalCapacity: { $sum: "$maxStudents" },
            avgPrice: { $avg: "$price" }
          }
        },
        {
          $lookup: {
            from: "courses",
            localField: "_id",
            foreignField: "_id",
            as: "course"
          }
        },
        {
          $unwind: "$course"
        },
        {
          $project: {
            courseTitle: "$course.title",
            courseLevel: "$course.level",
            count: 1,
            totalStudents: 1,
            totalCapacity: 1,
            avgPrice: 1,
            fillRate: {
              $cond: {
                if: { $gt: ["$totalCapacity", 0] },
                then: { $multiply: [{ $divide: ["$totalStudents", "$totalCapacity"] }, 100] },
                else: 0
              }
            }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Instructor statistics
      const instructorStats = await ClassSchedule.aggregate([
        {
          $group: {
            _id: "$instructor.name",
            count: { $sum: 1 },
            totalStudents: { $sum: "$currentStudents" },
            totalCapacity: { $sum: "$maxStudents" }
          }
        },
        {
          $project: {
            instructorName: "$_id",
            count: 1,
            totalStudents: 1,
            totalCapacity: 1,
            fillRate: {
              $cond: {
                if: { $gt: ["$totalCapacity", 0] },
                then: { $multiply: [{ $divide: ["$totalStudents", "$totalCapacity"] }, 100] },
                else: 0
              }
            }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      // Revenue statistics
      const revenueStats = await ClassSchedule.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $multiply: ["$currentStudents", { $ifNull: ["$discountPrice", "$price"] }]
              }
            },
            potentialRevenue: {
              $sum: {
                $multiply: ["$maxStudents", { $ifNull: ["$discountPrice", "$price"] }]
              }
            },
            avgPrice: { $avg: { $ifNull: ["$discountPrice", "$price"] } }
          }
        }
      ]);

      // Upcoming schedules
      const upcomingSchedules = await ClassSchedule.find({
        startDate: { $gte: now },
        isActive: true
      })
        .populate('courseId', 'title level')
        .sort({ startDate: 1 })
        .limit(10);

      // Recent activity
      const recentSchedules = await ClassSchedule.find({
        isActive: true
      })
        .populate('courseId', 'title level')
        .sort({ updatedAt: -1 })
        .limit(10);

      res.status(200).json({
        success: true,
        data: {
          overview: {
            totalSchedules,
            activeSchedules,
            deletedSchedules,
            period: {
              startDate,
              endDate,
              type: period
            }
          },
          statusStats: statusStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          monthlyStats: monthlyStats.map(stat => ({
            month: stat._id,
            count: stat.count,
            totalStudents: stat.totalStudents,
            totalCapacity: stat.totalCapacity,
            fillRate: stat.totalCapacity > 0 ? (stat.totalStudents / stat.totalCapacity) * 100 : 0
          })),
          courseStats,
          instructorStats,
          revenueStats: revenueStats[0] || {
            totalRevenue: 0,
            potentialRevenue: 0,
            avgPrice: 0
          },
          upcomingSchedules,
          recentSchedules
        },
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thống kê",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({
      success: false,
      message: `Phương thức ${req.method} không được hỗ trợ`,
    });
  }
}
