import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [130, 'Age must be valid'],
    },
    gender: {
      type: String,
      enum: ['Female', 'Male', 'Other'],
      default: 'Female',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    village: {
      type: String,
      required: [true, 'Village is required'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      default: 'Pune',
    },
    diabetesDuration: {
      type: String,
      trim: true,
      default: '',
    },
    bloodSugar: {
      type: String,
      trim: true,
      default: '',
    },
    hba1c: {
      type: String,
      trim: true,
      default: '',
    },
    previousScreeningDate: {
      type: Date,
      default: null,
    },
    previousResult: {
      type: String,
      trim: true,
      default: '',
    },
    previousRiskScore: {
      type: Number,
      default: null,
    },
    createdBy: {
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

// Compound search index
patientSchema.index({ name: 'text', patientId: 'text', village: 'text', district: 'text' })

// Virtual to populate screenings
patientSchema.virtual('screenings', {
  ref: 'Screening',
  localField: '_id',
  foreignField: 'patient',
})

const Patient = mongoose.model('Patient', patientSchema)
export default Patient
