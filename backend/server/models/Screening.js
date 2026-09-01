import mongoose from 'mongoose'

const screeningSchema = new mongoose.Schema(
  {
    screeningId: {
      type: String,
      required: [true, 'Screening ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    patientId: {
      type: String,
      required: [true, 'Patient identifier is required'],
      trim: true,
      uppercase: true,
      index: true,
    },
    eye: {
      type: String,
      enum: ['left', 'right'],
      required: [true, 'Eye (left/right) is required'],
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    imageDataUrl: {
      type: String,
      default: null,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RetinalImage',
      },
    ],
    quality: {
      qualityScore: { type: Number, default: 0 },
      blurScore: { type: Number, default: 0 },
      brightnessScore: { type: Number, default: 0 },
      fieldOfViewScore: { type: Number, default: 0 },
      usable: { type: Boolean, default: true },
      status: { type: String, default: 'good' },
      message: { type: String, default: 'Suitable for AI screening' },
    },
    classification: {
      classification: { type: String, default: 'No DR' },
      grade: { type: Number, min: 0, max: 4, default: 0, index: true },
      riskScore: { type: Number, min: 0, max: 100, default: 0 },
      confidence: { type: Number, min: 0, max: 100, default: 0 },
      recommendation: { type: String, default: '' },
    },
    segmentation: {
      detectedLesions: [
        {
          type: { type: String },
          confidence: { type: Number, default: 0 },
          count: { type: Number, default: 1 },
        },
      ],
      lesionMasks: [mongoose.Schema.Types.Mixed],
    },
    xai: {
      heatmapUrl: { type: String, default: null },
      findings: [mongoose.Schema.Types.Mixed],
      explanation: { type: String, default: 'Explainability results will appear here after the XAI engine is connected.' },
    },
    fusion: {
      finalRiskScore: { type: Number, default: 0 },
      trustScore: { type: Number, default: null },
      evidenceSummary: { type: String, default: 'Evidence fusion results will appear here once connected.' },
    },
    followUp: {
      date: { type: Date, default: null },
      status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
        index: true,
      },
      notes: { type: String, default: '' },
      completedAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: ['completed', 'pending_review', 'flagged'],
      default: 'completed',
    },
    conductedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for reviews
screeningSchema.virtual('reviews', {
  ref: 'DoctorReview',
  localField: '_id',
  foreignField: 'screening',
})

const Screening = mongoose.model('Screening', screeningSchema)
export default Screening
