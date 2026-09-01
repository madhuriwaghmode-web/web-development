import mongoose from 'mongoose'

const retinalImageSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    screening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screening',
      default: null,
      index: true,
    },
    eye: {
      type: String,
      enum: ['left', 'right'],
      required: [true, 'Eye (left/right) is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image data/URL is required'],
    },
    qualityScore: {
      type: Number,
      default: 0,
    },
    blurScore: {
      type: Number,
      default: 0,
    },
    brightnessScore: {
      type: Number,
      default: 0,
    },
    fieldOfViewScore: {
      type: Number,
      default: 0,
    },
    usable: {
      type: Boolean,
      default: true,
    },
    qualityStatus: {
      type: String,
      enum: ['good', 'borderline', 'unusable'],
      default: 'good',
    },
    qualityMessage: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'image/jpeg',
    },
    fileSizeBytes: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const RetinalImage = mongoose.model('RetinalImage', retinalImageSchema)
export default RetinalImage
