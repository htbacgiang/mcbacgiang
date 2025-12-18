import db from "../../../utils/db";
import ClassSchedule from "../../../models/ClassSchedule";
import Course from "../../../models/Course";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await db.connectDb();

      const { 
        month, 
        year, 
        date,
        status, 
        courseId, 
        page = 1, 
        limit = 10,
        sortBy = "startDate",
        sortOrder = "asc",
        search
      } = req.query;

      // Build filter object
      const filter = { isActive: true };
      
      // Filter by specific date - we need to find schedules that have opening sessions on this date
      if (date) {
        // Find schedules that have classSessions on the specific date
        const schedulesWithSessions = await ClassSchedule.find({
          isActive: true,
          'classSessions.date': date,
          'classSessions.sessionNumber': 1 // Only first sessions
        }).populate('courseId', 'title subtitle image level duration slug');
        
        // Process opening sessions for the specific date
        const openingSessionsForDate = [];
        schedulesWithSessions.forEach(schedule => {
          const firstSession = schedule.classSessions.find(session => 
            session.sessionNumber === 1 && session.date === date
          );
          if (firstSession) {
            const openingSessionData = {
              _id: `${schedule._id}_opening`,
              sessionNumber: 1,
              className: schedule.className,
              courseId: schedule.courseId,
              date: firstSession.date,
              dateString: firstSession.dateString,
              dayOfWeek: firstSession.dayOfWeek,
              startTime: firstSession.startTime,
              endTime: firstSession.endTime,
              location: schedule.location || (schedule.locations && schedule.locations.length > 0 ? schedule.locations[0] : ''),
              locations: schedule.locations || (schedule.location ? [schedule.location] : []),
              instructor: schedule.instructor,
              maxStudents: schedule.maxStudents,
              currentStudents: schedule.currentStudents,
              price: schedule.price || 0,
              discountPrice: schedule.discountPrice || 0,
              status: schedule.status,
              description: schedule.description,
              requirements: schedule.requirements,
              benefits: schedule.benefits,
              totalSessions: schedule.totalSessions,
              schedule: schedule.schedule || `${firstSession.dayOfWeek}, ${firstSession.startTime} - ${firstSession.endTime}`,
              startDate: firstSession.date ? new Date(firstSession.date + 'T00:00:00').toISOString() : schedule.startDate?.toISOString() || null, // ISO string for ClassScheduleCard
              title: `${schedule.className} - Khai giảng`,
              availableSpots: schedule.maxStudents - schedule.currentStudents,
              discountPercentage: schedule.discountPrice && schedule.price && schedule.price > 0
                ? Math.round(((schedule.price - schedule.discountPrice) / schedule.price) * 100)
                : 0
            };
            openingSessionsForDate.push(openingSessionData);
          }
        });

        return res.status(200).json({
          success: true,
          data: {
            classSchedules: openingSessionsForDate,
            groupedByMonth: {},
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: openingSessionsForDate.length,
              itemsPerPage: openingSessionsForDate.length,
            },
          },
        });
      }
      // Filter by month and year - but we need to find schedules that have opening sessions in this month
      else if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        
        // Find schedules that have their first session (khai giảng) in this month
        const schedulesWithOpeningSessions = await ClassSchedule.find({
          isActive: true,
          'classSessions.sessionNumber': 1,
          'classSessions.date': {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        }).populate('courseId', 'title subtitle image level duration slug');

        // Process opening sessions for the month
        const openingSessionsForMonth = [];
        schedulesWithOpeningSessions.forEach(schedule => {
          const firstSession = schedule.classSessions.find(session => session.sessionNumber === 1);
          if (firstSession) {
            const sessionDate = new Date(firstSession.date + 'T00:00:00');
            if (sessionDate >= startDate && sessionDate <= endDate) {
              const openingSessionData = {
                _id: `${schedule._id}_opening`,
                sessionNumber: 1,
                className: schedule.className,
                courseId: schedule.courseId,
                date: firstSession.date,
                dateString: firstSession.dateString,
                dayOfWeek: firstSession.dayOfWeek,
                startTime: firstSession.startTime,
                endTime: firstSession.endTime,
                location: schedule.location || (schedule.locations && schedule.locations.length > 0 ? schedule.locations[0] : ''),
                locations: schedule.locations || (schedule.location ? [schedule.location] : []),
                instructor: schedule.instructor,
                maxStudents: schedule.maxStudents,
                currentStudents: schedule.currentStudents,
                price: schedule.price || 0,
                discountPrice: schedule.discountPrice || 0,
                status: schedule.status,
                description: schedule.description,
                requirements: schedule.requirements,
                benefits: schedule.benefits,
                totalSessions: schedule.totalSessions,
                schedule: schedule.schedule || `${firstSession.dayOfWeek}, ${firstSession.startTime} - ${firstSession.endTime}`,
                startDate: firstSession.date ? new Date(firstSession.date + 'T00:00:00').toISOString() : schedule.startDate?.toISOString() || null, // ISO string for ClassScheduleCard
                endDate: schedule.endDate ? (schedule.endDate instanceof Date ? schedule.endDate.toISOString() : schedule.endDate) : null,
                availableSpots: schedule.maxStudents - schedule.currentStudents,
                discountPercentage: schedule.discountPrice && schedule.price && schedule.price > 0
                  ? Math.round(((schedule.price - schedule.discountPrice) / schedule.price) * 100)
                  : 0
              };
              openingSessionsForMonth.push(openingSessionData);
            }
          }
        });

        // Apply additional filters
        let filteredSessions = openingSessionsForMonth;
        if (status) {
          filteredSessions = filteredSessions.filter(session => session.status === status);
        }
        if (courseId) {
          filteredSessions = filteredSessions.filter(session => session.courseId._id.toString() === courseId);
        }
        if (search) {
          filteredSessions = filteredSessions.filter(session => 
            session.className.toLowerCase().includes(search.toLowerCase()) ||
            (session.courseId.title && session.courseId.title.toLowerCase().includes(search.toLowerCase()))
          );
        }

        // Apply sorting
        filteredSessions.sort((a, b) => {
          if (sortBy === 'startDate') {
            return sortOrder === 'desc' 
              ? new Date(b.date) - new Date(a.date)
              : new Date(a.date) - new Date(b.date);
          } else if (sortBy === 'className') {
            return sortOrder === 'desc' 
              ? b.className.localeCompare(a.className)
              : a.className.localeCompare(b.className);
          } else if (sortBy === 'currentStudents') {
            return sortOrder === 'desc' 
              ? b.currentStudents - a.currentStudents
              : a.currentStudents - b.currentStudents;
          }
          return 0;
        });

        // Apply pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedSessions = filteredSessions.slice(skip, skip + parseInt(limit));

        // Group by month for calendar view
        const groupedByMonth = {};
        paginatedSessions.forEach(session => {
          const sessionDate = new Date(session.date);
          const monthKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}`;
          if (!groupedByMonth[monthKey]) {
            groupedByMonth[monthKey] = [];
          }
          groupedByMonth[monthKey].push(session);
        });

        return res.status(200).json({
          success: true,
          data: {
            classSchedules: paginatedSessions,
            groupedByMonth,
            pagination: {
              currentPage: parseInt(page),
              totalPages: Math.ceil(filteredSessions.length / parseInt(limit)),
              totalItems: filteredSessions.length,
              itemsPerPage: parseInt(limit),
            },
          },
        });
      }

      // Default case - return empty
      res.status(200).json({
        success: true,
        data: {
          classSchedules: [],
          groupedByMonth: {},
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching opening class schedules:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy dữ liệu lịch khai giảng",
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
