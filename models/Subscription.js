import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false, // Email is optional
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  // Thông tin cá nhân
  name: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 1,
    max: 100
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Please enter a valid Vietnamese phone number']
  },
  purpose: {
    type: String,
    trim: true
  },
  // Thông tin khóa học
  courseSlug: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriptionSchema.index({ email: 1 });
subscriptionSchema.index({ phone: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ subscribedAt: -1 });

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
