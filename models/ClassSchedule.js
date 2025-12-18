import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID khóa học là bắt buộc"],
    },
    className: {
      type: String,
      required: [true, "Tên lớp học là bắt buộc"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Ngày khai giảng là bắt buộc"],
    },
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc là bắt buộc"],
    },
    schedule: {
      type: String,
      required: [true, "Lịch học là bắt buộc"],
      trim: true,
    },
    timeSlots: [{
      dayOfWeek: {
        type: String,
        enum: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      date: {
        type: String, // Specific date for this session
        trim: true,
      },
    }],
    // New fields for pattern-based scheduling
    totalSessions: {
      type: Number,
      min: 1,
      default: 1,
    },
    classSessions: [{
      sessionNumber: {
        type: Number,
        required: true,
      },
      date: {
        type: String, // YYYY-MM-DD format
        required: true,
      },
      dayOfWeek: {
        type: String,
        enum: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"],
        required: true,
      },
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      dateString: {
        type: String, // Vietnamese formatted date
        required: true,
      },
    }],
    locations: {
      type: [String],
      required: [true, "Địa điểm học là bắt buộc"],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: "Phải chọn ít nhất một địa điểm"
      }
    },
    // Keep location field for backward compatibility
    location: {
      type: String,
      trim: true,
    },
    instructor: {
      name: {
        type: String,
        required: [true, "Tên giảng viên là bắt buộc"],
        trim: true,
      },
      experience: {
        type: String,
        trim: true,
      },
      avatar: {
        type: String,
        trim: true,
      },
    },
    maxStudents: {
      type: Number,
      required: [true, "Số lượng học viên tối đa là bắt buộc"],
      min: 1,
    },
    currentStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Sắp khai giảng", "Đang tuyển sinh", "Đang diễn ra", "Đã đầy", "Đã kết thúc", "Tạm hoãn"],
      default: "Sắp khai giảng",
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: [String],
    benefits: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
classScheduleSchema.index({ startDate: 1 });
classScheduleSchema.index({ courseId: 1 });
classScheduleSchema.index({ status: 1 });
classScheduleSchema.index({ isActive: 1, isDeleted: 1 });

// Soft delete middleware
classScheduleSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Virtual for available spots
classScheduleSchema.virtual('availableSpots').get(function() {
  return this.maxStudents - this.currentStudents;
});

// Virtual for discount percentage
classScheduleSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price && this.price > 0) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
classScheduleSchema.set('toJSON', { virtuals: true });
classScheduleSchema.set('toObject', { virtuals: true });

let ClassSchedule = mongoose.models.ClassSchedule || mongoose.model("ClassSchedule", classScheduleSchema);
export default ClassSchedule;
