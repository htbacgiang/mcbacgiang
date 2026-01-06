import mongoose from "mongoose";

const locationChoices = [
  "Q&K - Bắc Giang",
  "Online/Doanh nghiệp",
];

const curriculumSchema = new mongoose.Schema({
  session: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    maKhoaHoc: {
      type: String,
      required: [true, "Mã khóa học là bắt buộc"],
      trim: true,
      unique: true,
      match: [/^[A-Za-z0-9_-]+$/, "Mã khóa học chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang"],
    },
    title: {
      type: String,
      required: [true, "Tên khóa học là bắt buộc"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Mô tả khóa học là bắt buộc"],
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },

    sessions: {
      type: Number,
      required: [true, "Số buổi học là bắt buộc"],
      min: 1,
    },
    sessionsPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      default: 1,
    },
    level: {
      type: String,
      required: [true, "Cấp độ là bắt buộc"],
      enum: ["Cơ bản", "Nâng cao", "Chuyên nghiệp", "Tất cả cấp độ"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Ảnh khóa học là bắt buộc"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    students: {
      type: Number,
      min: 0,
      default: 0,
    },
    schedule: {
      type: String,
      trim: true,
      default: "2 buổi/tuần",
    },
    locations: {
      type: [String],
      required: [true, "Địa điểm là bắt buộc"],
      enum: locationChoices,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: "Phải chọn ít nhất một địa điểm"
      }
    },
    curriculum: [curriculumSchema],
    features: [String],
    requirements: [String],
    faq: [faqSchema],
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      trim: true,
      unique: true,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Indexes for performance
courseSchema.index({ slug: 1 });
courseSchema.index({ level: 1 });

// Soft delete middleware
courseSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Pre-save middleware to clean up deprecated fields
courseSchema.pre('save', function (next) {
  // Remove deprecated fields if they exist using $unset
  if (this.instructor !== undefined) this.$unset('instructor');
  if (this.instructorRole !== undefined) this.$unset('instructorRole');
  if (this.category !== undefined) this.$unset('category');
  if (this.targetAge !== undefined) this.$unset('targetAge');
  if (this.price !== undefined) this.$unset('price');
  if (this.discount !== undefined) this.$unset('discount');
  if (this.badge !== undefined) this.$unset('badge');
  if (this.isActive !== undefined) this.$unset('isActive');
  if (this.duration !== undefined) this.$unset('duration');
  if (this.location !== undefined) this.$unset('location');
  
  // Convert image array to string if needed
  if (Array.isArray(this.image)) {
    this.image = this.image.length > 0 ? this.image[0] : '';
  }
  
  next();
});

let Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;

