import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    targetRole: {
      type: String,
      enum: ['admin', 'doctor', 'health_worker', 'all'],
      default: 'all',
      index: true,
    },
    type: {
      type: String,
      enum: ['screening_alert', 'followup_due', 'review_required', 'system', 'patient_registered'],
      default: 'system',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
