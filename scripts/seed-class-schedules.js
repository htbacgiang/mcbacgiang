const mongoose = require('mongoose');
const ClassSchedule = require('../models/ClassSchedule');
const Course = require('../models/Course');
const db = require('../utils/db');

// Sample class schedules data
const sampleSchedules = [
  {
    className: "MC Cơ bản - Lớp 1",
    startDate: new Date(2024, 0, 15), // January 15, 2024
    endDate: new Date(2024, 2, 15), // March 15, 2024
    schedule: "Thứ 2, 4, 6 - 19:00-21:00",
    timeSlots: [
      { dayOfWeek: "Thứ 2", startTime: "19:00", endTime: "21:00" },
      { dayOfWeek: "Thứ 4", startTime: "19:00", endTime: "21:00" },
      { dayOfWeek: "Thứ 6", startTime: "19:00", endTime: "21:00" }
    ],
    location: "Tầng 5, Tòa nhà BT Academy, 123 Nguyễn Huệ, Q1, TP.HCM",
    instructor: {
      name: "MC Minh Tuấn",
      experience: "10 năm kinh nghiệm MC tại VTV",
      avatar: "/images/instructor-1.jpg"
    },
    maxStudents: 20,
    currentStudents: 15,
    price: 5000000,
    discountPrice: 4500000,
    status: "Đang tuyển sinh",
    description: "Khóa học MC cơ bản dành cho người mới bắt đầu",
    requirements: ["Tốt nghiệp THPT", "Có khả năng giao tiếp"],
    benefits: ["Chứng chỉ hoàn thành", "Hỗ trợ việc làm", "Thực hành tại studio"]
  },
  {
    className: "MC Nâng cao - Lớp 2",
    startDate: new Date(2024, 0, 20), // January 20, 2024
    endDate: new Date(2024, 2, 20), // March 20, 2024
    schedule: "Thứ 3, 5, 7 - 18:30-20:30",
    timeSlots: [
      { dayOfWeek: "Thứ 3", startTime: "18:30", endTime: "20:30" },
      { dayOfWeek: "Thứ 5", startTime: "18:30", endTime: "20:30" },
      { dayOfWeek: "Thứ 7", startTime: "18:30", endTime: "20:30" }
    ],
    location: "Tầng 5, Tòa nhà BT Academy, 123 Nguyễn Huệ, Q1, TP.HCM",
    instructor: {
      name: "MC Lan Anh",
      experience: "8 năm kinh nghiệm MC tại HTV",
      avatar: "/images/instructor-2.jpg"
    },
    maxStudents: 15,
    currentStudents: 12,
    price: 7000000,
    discountPrice: 6300000,
    status: "Đang tuyển sinh",
    description: "Khóa học MC nâng cao cho người đã có kinh nghiệm",
    requirements: ["Đã hoàn thành khóa MC cơ bản", "Có kinh nghiệm thuyết trình"],
    benefits: ["Chứng chỉ chuyên nghiệp", "Cơ hội thực tập tại đài truyền hình", "Mentoring 1-1"]
  },
  {
    className: "Dẫn chương trình - Lớp 3",
    startDate: new Date(2024, 1, 1), // February 1, 2024
    endDate: new Date(2024, 3, 1), // April 1, 2024
    schedule: "Thứ 2, 4, 6 - 19:30-21:30",
    timeSlots: [
      { dayOfWeek: "Thứ 2", startTime: "19:30", endTime: "21:30" },
      { dayOfWeek: "Thứ 4", startTime: "19:30", endTime: "21:30" },
      { dayOfWeek: "Thứ 6", startTime: "19:30", endTime: "21:30" }
    ],
    location: "Tầng 5, Tòa nhà BT Academy, 123 Nguyễn Huệ, Q1, TP.HCM",
    instructor: {
      name: "MC Hồng Nhung",
      experience: "12 năm kinh nghiệm dẫn chương trình",
      avatar: "/images/instructor-3.jpg"
    },
    maxStudents: 18,
    currentStudents: 18,
    price: 6000000,
    status: "Đã đầy",
    description: "Khóa học chuyên sâu về dẫn chương trình truyền hình",
    requirements: ["Có kinh nghiệm MC cơ bản", "Khả năng ứng biến tốt"],
    benefits: ["Thực hành tại studio chuyên nghiệp", "Được ghi hình demo reel", "Hỗ trợ casting"]
  },
  {
    className: "MC Online - Lớp 4",
    startDate: new Date(2024, 1, 10), // February 10, 2024
    endDate: new Date(2024, 3, 10), // April 10, 2024
    schedule: "Thứ 3, 5 - 20:00-22:00",
    timeSlots: [
      { dayOfWeek: "Thứ 3", startTime: "20:00", endTime: "22:00" },
      { dayOfWeek: "Thứ 5", startTime: "20:00", endTime: "22:00" }
    ],
    location: "Online qua Zoom",
    instructor: {
      name: "MC Đức Minh",
      experience: "6 năm kinh nghiệm MC online",
      avatar: "/images/instructor-4.jpg"
    },
    maxStudents: 25,
    currentStudents: 8,
    price: 3500000,
    discountPrice: 3000000,
    status: "Sắp khai giảng",
    description: "Khóa học MC online phù hợp với người bận rộn",
    requirements: ["Có máy tính và internet ổn định", "Micro và camera chất lượng"],
    benefits: ["Học từ xa", "Recording bài học", "Tương tác trực tiếp với giảng viên"]
  },
  {
    className: "MC Trẻ em - Lớp 5",
    startDate: new Date(2024, 1, 15), // February 15, 2024
    endDate: new Date(2024, 3, 15), // April 15, 2024
    schedule: "Thứ 7, Chủ nhật - 14:00-16:00",
    timeSlots: [
      { dayOfWeek: "Thứ 7", startTime: "14:00", endTime: "16:00" },
      { dayOfWeek: "Chủ nhật", startTime: "14:00", endTime: "16:00" }
    ],
    location: "Tầng 3, Tòa nhà BT Academy, 123 Nguyễn Huệ, Q1, TP.HCM",
    instructor: {
      name: "MC Minh Châu",
      experience: "5 năm kinh nghiệm dạy MC trẻ em",
      avatar: "/images/instructor-5.jpg"
    },
    maxStudents: 12,
    currentStudents: 5,
    price: 4000000,
    discountPrice: 3600000,
    status: "Sắp khai giảng",
    description: "Khóa học MC dành cho trẻ em từ 8-15 tuổi",
    requirements: ["Trẻ em từ 8-15 tuổi", "Có sự đồng ý của phụ huynh"],
    benefits: ["Phương pháp dạy phù hợp với trẻ em", "Hoạt động vui nhộn", "Phát triển kỹ năng giao tiếp"]
  }
];

const seedClassSchedules = async () => {
  try {
    await db.connectDb();

    // Get a sample course to link with schedules
    const sampleCourse = await Course.findOne();
    if (!sampleCourse) {
      console.log('No courses found. Please create courses first.');
      return;
    }

    // Clear existing class schedules
    await ClassSchedule.deleteMany({});
    console.log('Cleared existing class schedules');

    // Create new class schedules
    const schedulesWithCourseId = sampleSchedules.map(schedule => ({
      ...schedule,
      courseId: sampleCourse._id
    }));

    const createdSchedules = await ClassSchedule.insertMany(schedulesWithCourseId);
    console.log(`Created ${createdSchedules.length} class schedules`);

    console.log('Class schedules seeded successfully!');
  } catch (error) {
    console.error('Error seeding class schedules:', error);
  } finally {
    await db.disconnectDb();
  }
};

// Run the seeder
if (require.main === module) {
  seedClassSchedules();
}

module.exports = seedClassSchedules;
