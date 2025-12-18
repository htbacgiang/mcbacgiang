import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    studentId: {
      type: String,
      required: "Vui lòng nhập mã học viên.",
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: "Vui lòng nhập họ và tên.",
      trim: true,
    },
    email: {
      type: String,
      required: "Vui lòng nhập email.",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: "Vui lòng nhập số điện thoại.",
      match: /^[0-9]{10,11}$/,
    },
    dateOfBirth: {
      type: Date,
      required: "Vui lòng nhập ngày sinh.",
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      required: "Vui lòng chọn giới tính.",
    },
    
    // Thông tin địa chỉ
    address: {
      street: {
        type: String,
        required: "Vui lòng nhập số nhà, thôn xóm.",
        trim: true,
      },
      ward: {
        type: String,
        required: "Vui lòng nhập xã/phường.",
        trim: true,
      },
      city: {
        type: String,
        required: "Vui lòng nhập tỉnh/thành phố.",
        trim: true,
      },
    },
    
    // Thông tin học tập
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Đang học", "Tạm nghỉ", "Đã tốt nghiệp", "Bị đình chỉ"],
      default: "Đang học",
    },
    course: {
      type: String,
      required: "Vui lòng nhập khóa học.",
      trim: true,
    },
    class: {
      type: String,
      required: "Vui lòng nhập lớp học.",
      trim: true,
    },
    // Thông tin về loại khóa học
    courseType: {
      type: String,
      enum: ["MC người lớn", "MC nhí", "Khác"],
      default: "MC người lớn",
    },
    // Cài đặt email
    emailSettings: {
      receiveDailySchedule: {
        type: Boolean,
        default: true,
      },
      emailRecipient: {
        type: String,
        enum: ["student", "parent", "both"],
        default: "student",
        required: function() {
          return this.courseType === "MC nhí";
        }
      },
    },
    
    // Thông tin phụ huynh (nếu cần)
    parentInfo: {
      parentName: {
        type: String,
        trim: true,
      },
      parentPhone: {
        type: String,
        match: /^[0-9]{10,11}$/,
      },
      parentEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
      relationship: {
        type: String,
        enum: ["Cha", "Mẹ", "Anh/Chị", "Người giám hộ", "Khác"],
        required: false,
      },
    },
    
    // Thông tin học phí
    tuition: {
      totalAmount: {
        type: Number,
        required: "Vui lòng nhập tổng học phí.",
        min: 0,
      },
      paidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      remainingAmount: {
        type: Number,
        default: function() {
          return this.tuition.totalAmount - this.tuition.paidAmount;
        },
      },
      paymentStatus: {
        type: String,
        enum: ["Chưa thanh toán", "Đã thanh toán"],
        default: "Chưa thanh toán",
      },
    },
    
    // Thông tin bổ sung
    notes: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dmhcnhtng/image/upload/v1664642478/992490_b0iqzq.png",
    },
    
    // Thông tin liên hệ khẩn cấp
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        match: /^[0-9]{10,11}$/,
      },
      relationship: {
        type: String,
        trim: true,
        required: false,
      },
    },
    
    // Thông tin học tập bổ sung
    academicInfo: {
      previousEducation: {
        type: String,
        trim: true,
      },
      currentSchool: {
        type: String,
        trim: true,
      },
      grade: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Middleware để tự động cập nhật remainingAmount khi paidAmount thay đổi
studentSchema.pre('save', function(next) {
  if (this.tuition && this.tuition.totalAmount !== undefined && this.tuition.paidAmount !== undefined) {
    this.tuition.remainingAmount = this.tuition.totalAmount - this.tuition.paidAmount;
  }
  next();
});

// Tạo index để tìm kiếm nhanh
studentSchema.index({ studentId: 1 });
studentSchema.index({ fullName: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ phone: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ course: 1 });

// Clear any existing model to avoid cache issues
if (mongoose.models.Student) {
  delete mongoose.models.Student;
}

const Student = mongoose.model("Student", studentSchema);
export default Student;
