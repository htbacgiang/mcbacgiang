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
      const students = await Student.find({}).sort({ createdAt: -1 });
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Error fetching students" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        studentId,
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        enrollmentDate,
        status,
        course,
        class: studentClass,
        parentInfo,
        tuition,
        notes,
        emergencyContact,
        academicInfo,
      } = req.body;

      // Debug: Log the received data
      console.log("Received form data:", req.body);
      console.log("Tuition data:", tuition);
      console.log("Payment status:", tuition?.paymentStatus);

      // Validate required fields
      if (!studentId || !fullName || !email || !phone || !dateOfBirth || !gender) {
        return res.status(400).json({ 
          message: "Vui lòng điền đầy đủ thông tin bắt buộc" 
        });
      }

      // Check if student ID already exists
      const existingStudent = await Student.findOne({ studentId });
      if (existingStudent) {
        return res.status(400).json({ 
          message: "Mã học viên đã tồn tại" 
        });
      }

      // Check if email already exists
      const existingEmail = await Student.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email đã được sử dụng" 
        });
      }

      // Check if phone already exists
      const existingPhone = await Student.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ 
          message: "Số điện thoại đã được sử dụng" 
        });
      }

      const studentData = {
        studentId,
        fullName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address: {
          street: address.street || "",
          ward: address.ward || "",
          city: address.city || "",
        },
        enrollmentDate: new Date(enrollmentDate),
        status: status || "Đang học",
        course: course || "",
        class: studentClass || "",
        parentInfo: {
          parentName: parentInfo?.parentName || "",
          parentPhone: parentInfo?.parentPhone || "",
          parentEmail: parentInfo?.parentEmail || "",
          ...(parentInfo?.relationship && { relationship: parentInfo.relationship }),
        },
        tuition: {
          totalAmount: tuition?.totalAmount || 0,
          paidAmount: tuition?.paymentStatus === "Đã thanh toán" ? (tuition?.totalAmount || 0) : 0,
          paymentStatus: tuition?.paymentStatus || "Chưa thanh toán",
          remainingAmount: tuition?.paymentStatus === "Đã thanh toán" ? 0 : (tuition?.totalAmount || 0),
        },
        notes: notes || "",
        emergencyContact: {
          name: emergencyContact?.name || "",
          phone: emergencyContact?.phone || "",
          ...(emergencyContact?.relationship && { relationship: emergencyContact.relationship }),
        },
        academicInfo: {
          previousEducation: academicInfo?.previousEducation || "",
          currentSchool: academicInfo?.currentSchool || "",
          grade: academicInfo?.grade || "",
        },
      };

      // Debug: Log the student data before creating
      console.log("Student data to create:", studentData);
      console.log("Final tuition data:", studentData.tuition);

      const student = new Student(studentData);

      await student.save();
      res.status(201).json({ message: "Học viên đã được thêm thành công", student });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({ message: "Error creating student" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
