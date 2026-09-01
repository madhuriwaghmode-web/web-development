import mongoose from 'mongoose'

const aiResultSchema = new mongoose.Schema(
  {
    screening: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screening',
      required: true,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },
    modelName: {
      type: String,
      default: 'ResNet50 + U-Net',
    },
    prediction: {
      type: String,
      enum: ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR'],
      default: 'No DR',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    detectedLesions: [
      {
        type: { type: String },
        confidence: { type: Number, default: 0 },
        count: { type: Number, default: 1 },
      },
    ],
    heatmapUrl: {
      type: String,
      default: null,
    },
    rawOutputs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const AIResult = mongoose.model('AIResult', aiResultSchema)
export default AIResult
