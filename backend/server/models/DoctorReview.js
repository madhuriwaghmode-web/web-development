import mongoose from 'mongoose'

const doctorReviewSchema = new mongoose.Schema(
  {
    screening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screening',
      required: [true, 'Screening reference is required'],
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor reference is required'],
      index: true,
    },
    doctorName: {
      type: String,
      default: '',
    },
    agreedWithAI: {
      type: Boolean,
      default: true,
    },
    verifiedGrade: {
      type: Number,
      min: 0,
      max: 4,
      required: [true, 'Verified DR grade is required'],
    },
    diagnosis: {
      type: String,
      trim: true,
      default: '',
    },
    clinicalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    recommendedAction: {
      type: String,
      trim: true,
      default: '',
    },
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['submitted', 'in_review', 'amended'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
)

const DoctorReview = mongoose.model('DoctorReview', doctorReviewSchema)
export default DoctorReview
