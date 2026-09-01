import User from '../models/User.js'
import Patient from '../models/Patient.js'
import Screening from '../models/Screening.js'
import DoctorReview from '../models/DoctorReview.js'
import Notification from '../models/Notification.js'
import AuditLog from '../models/AuditLog.js'

export const DEMO_USERS = [
  {
    name: 'Primary Health Worker',
    email: 'worker@drishtiai.health',
    password: 'password123',
    role: 'health_worker',
    phone: '9876543210',
    organization: 'Shirur Rural Health Center',
    location: 'Pune District',
  },
  {
    name: 'Dr. Rajesh Sharma',
    email: 'doctor@drishtiai.health',
    password: 'password123',
    role: 'doctor',
    phone: '9876543211',
    organization: 'District Eye Hospital Pune',
    location: 'Pune District',
  },
  {
    name: 'System Administrator',
    email: 'admin@drishtiai.health',
    password: 'password123',
    role: 'admin',
    phone: '9876543212',
    organization: 'DrishtiAI Health Mission',
    location: 'Maharashtra',
  },
]

export const SEED_PATIENTS_DATA = [
  {
    patientId: 'PT-1042',
    name: 'Ramesh Kadam',
    age: 58,
    gender: 'Male',
    phone: '9876500001',
    village: 'Wadgaon',
    district: 'Pune',
    diabetesDuration: '12 years',
    bloodSugar: '168 mg/dL',
    hba1c: '7.8%',
    previousScreeningDate: new Date('2026-05-15'),
    previousResult: 'Mild DR',
    previousRiskScore: 35,
  },
  {
    patientId: 'PT-1043',
    name: 'Sunita Patil',
    age: 47,
    gender: 'Female',
    phone: '9876500002',
    village: 'Shirur',
    district: 'Pune',
    diabetesDuration: '6 years',
    bloodSugar: '142 mg/dL',
    hba1c: '7.1%',
    previousScreeningDate: new Date('2026-06-02'),
    previousResult: 'No DR',
    previousRiskScore: 8,
  },
  {
    patientId: 'PT-1044',
    name: 'Abdul Sheikh',
    age: 63,
    gender: 'Male',
    phone: '9876500003',
    village: 'Baramati',
    district: 'Pune',
    diabetesDuration: '19 years',
    bloodSugar: '201 mg/dL',
    hba1c: '9.2%',
    previousScreeningDate: new Date('2026-08-29'),
    previousResult: 'Moderate DR',
    previousRiskScore: 68,
  },
  {
    patientId: 'PT-1045',
    name: 'Lata More',
    age: 52,
    gender: 'Female',
    phone: '9876500004',
    village: 'Daund',
    district: 'Pune',
    diabetesDuration: '9 years',
    bloodSugar: '155 mg/dL',
    hba1c: '7.5%',
    previousScreeningDate: null,
    previousResult: '',
    previousRiskScore: null,
  },
  {
    patientId: 'PT-1046',
    name: 'Vikram Jadhav',
    age: 41,
    gender: 'Male',
    phone: '9876500005',
    village: 'Indapur',
    district: 'Pune',
    diabetesDuration: '3 years',
    bloodSugar: '128 mg/dL',
    hba1c: '6.6%',
    previousScreeningDate: new Date('2026-07-11'),
    previousResult: 'No DR',
    previousRiskScore: 5,
  },
]

export const SEED_SCREENINGS_DATA = [
  {
    screeningId: 'SCR-20260515-1042',
    patientId: 'PT-1042',
    eye: 'right',
    date: new Date('2026-05-15T10:20:00.000Z'),
    imageDataUrl: null,
    quality: {
      qualityScore: 88,
      blurScore: 91,
      brightnessScore: 85,
      fieldOfViewScore: 87,
      usable: true,
      status: 'good',
      message: 'Suitable for AI screening',
    },
    classification: {
      classification: 'Mild Diabetic Retinopathy',
      grade: 1,
      riskScore: 35,
      confidence: 91,
      recommendation: 'Routine screening in 6-12 months',
    },
    segmentation: {
      detectedLesions: [{ type: 'Microaneurysms', confidence: 62, count: 2 }],
      lesionMasks: [],
    },
    xai: {
      heatmapUrl: null,
      findings: [],
      explanation: 'Mild vascular changes observed near macula.',
    },
    fusion: {
      finalRiskScore: 35,
      trustScore: 92,
      evidenceSummary: 'Classification and quality indicate mild DR stage 1.',
    },
    followUp: {
      date: new Date('2026-11-15T00:00:00.000Z'),
      status: 'pending',
      notes: '',
    },
    status: 'completed',
  },
  {
    screeningId: 'SCR-20260829-1044',
    patientId: 'PT-1044',
    eye: 'right',
    date: new Date('2026-08-29T08:05:00.000Z'),
    imageDataUrl: null,
    quality: {
      qualityScore: 93,
      blurScore: 95,
      brightnessScore: 90,
      fieldOfViewScore: 92,
      usable: true,
      status: 'good',
      message: 'Suitable for AI screening',
    },
    classification: {
      classification: 'Moderate Diabetic Retinopathy',
      grade: 2,
      riskScore: 68,
      confidence: 94,
      recommendation: 'Ophthalmologist examination recommended',
    },
    segmentation: {
      detectedLesions: [
        { type: 'Microaneurysms', confidence: 81, count: 4 },
        { type: 'Hemorrhages', confidence: 58, count: 1 },
      ],
      lesionMasks: [],
    },
    xai: {
      heatmapUrl: null,
      findings: [],
      explanation: 'Multiple microaneurysms and blot hemorrhages detected.',
    },
    fusion: {
      finalRiskScore: 68,
      trustScore: 95,
      evidenceSummary: 'Moderate DR grade confirmed with high confidence.',
    },
    followUp: {
      date: new Date('2026-09-28T00:00:00.000Z'),
      status: 'pending',
      notes: 'Referred to district eye hospital.',
    },
    status: 'completed',
  },
]

export async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments()
    if (userCount === 0) {
      console.log('[Seed] Seeding demo users...')
      for (const u of DEMO_USERS) {
        await User.create(u)
      }
      console.log('[Seed] Demo users created.')
    }

    const defaultWorker = await User.findOne({ role: 'health_worker' })
    const defaultDoctor = await User.findOne({ role: 'doctor' })

    const patientCount = await Patient.countDocuments()
    if (patientCount === 0) {
      console.log('[Seed] Seeding initial patients...')
      for (const p of SEED_PATIENTS_DATA) {
        await Patient.create({
          ...p,
          createdBy: defaultWorker?._id || null,
        })
      }
      console.log('[Seed] Initial patients created.')
    }

    const screeningCount = await Screening.countDocuments()
    if (screeningCount === 0) {
      console.log('[Seed] Seeding initial screenings...')
      for (const s of SEED_SCREENINGS_DATA) {
        const patientDoc = await Patient.findOne({ patientId: s.patientId })
        if (patientDoc) {
          const screeningDoc = await Screening.create({
            ...s,
            patient: patientDoc._id,
            conductedBy: defaultWorker?._id || null,
          })

          if (s.classification.grade >= 2 && defaultDoctor) {
            await DoctorReview.create({
              screening: screeningDoc._id,
              patient: patientDoc._id,
              doctor: defaultDoctor._id,
              doctorName: defaultDoctor.name,
              agreedWithAI: true,
              verifiedGrade: s.classification.grade,
              diagnosis: 'Verified moderate DR with microaneurysms',
              clinicalNotes: 'Advised comprehensive dilated exam and glycemic control.',
              recommendedAction: 'Ophthalmology referral within 4 weeks',
              followUpRequired: true,
              followUpDate: s.followUp.date,
            })
          }
        }
      }
      console.log('[Seed] Initial screenings & reviews created.')
    }

    const notificationCount = await Notification.countDocuments()
    if (notificationCount === 0) {
      await Notification.create([
        {
          targetRole: 'all',
          type: 'system',
          title: 'MongoDB Backend Initialized',
          message: 'DrishtiAI backend is connected to MongoDB with full collection support.',
          link: '/dashboard',
        },
        {
          targetRole: 'doctor',
          type: 'screening_alert',
          title: 'High-Risk Screening Review Required',
          message: 'Patient Abdul Sheikh (PT-1044) was flagged with Moderate DR.',
          link: '/screening/s2/result',
        },
      ])
    }

    const auditCount = await AuditLog.countDocuments()
    if (auditCount === 0) {
      await AuditLog.create({
        user: defaultWorker?._id || null,
        userEmail: defaultWorker?.email || 'system@drishtiai.health',
        userName: defaultWorker?.name || 'Health Worker',
        userRole: defaultWorker?.role || 'health_worker',
        action: 'SYSTEM_INIT',
        resourceType: 'system',
        resourceId: 'init',
        meta: { message: 'Database initialized successfully' },
      })
    }
  } catch (err) {
    console.error('[Seed] Error seeding database:', err.message)
  }
}
