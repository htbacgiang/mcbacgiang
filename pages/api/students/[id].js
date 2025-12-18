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

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ message: "Học viên không tồn tại" });
      }
      
      // Debug: Log the student data before sending
      console.log("GET - Student data:", student);
      console.log("GET - Student tuition:", student.tuition);
      console.log("GET - Student payment status:", student.tuition?.paymentStatus);
      
      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Error fetching student" });
    }
  } else if (req.method === "PUT") {
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
      console.log("Update - Received form data:", req.body);
      console.log("Update - Tuition data:", tuition);
      console.log("Update - Payment status:", tuition?.paymentStatus);

      // Validate required fields
      if (!studentId || !fullName || !email || !phone || !dateOfBirth || !gender) {
        return res.status(400).json({ 
          message: "Vui lòng điền đầy đủ thông tin bắt buộc" 
        });
      }

      // Check if student ID already exists (excluding current student)
      const existingStudent = await Student.findOne({ 
        studentId, 
        _id: { $ne: id } 
      });
      if (existingStudent) {
        return res.status(400).json({ 
          message: "Mã học viên đã tồn tại" 
        });
      }

      // Check if email already exists (excluding current student)
      const existingEmail = await Student.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email đã được sử dụng" 
        });
      }

      // Check if phone already exists (excluding current student)
      const existingPhone = await Student.findOne({ 
        phone, 
        _id: { $ne: id } 
      });
      if (existingPhone) {
        return res.status(400).json({ 
          message: "Số điện thoại đã được sử dụng" 
        });
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
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
        },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Học viên không tồn tại" });
      }

      res.status(200).json({ 
        message: "Học viên đã được cập nhật thành công", 
        student: updatedStudent 
      });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Error updating student" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return res.status(404).json({ message: "Học viên không tồn tại" });
      }
      res.status(200).json({ message: "Học viên đã được xóa thành công" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Error deleting student" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
