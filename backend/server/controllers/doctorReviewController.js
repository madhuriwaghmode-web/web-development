import DoctorReview from '../models/DoctorReview.js'
import Screening from '../models/Screening.js'
import Patient from '../models/Patient.js'
import AuditLog from '../models/AuditLog.js'

export async function createReview(req, res, next) {
  try {
    const {
      screeningId,
      patientId: customPatientId,
      agreedWithAI,
      verifiedGrade,
      diagnosis,
      clinicalNotes,
      recommendedAction,
      followUpRequired,
      followUpDate,
    } = req.body

    if (!screeningId || verifiedGrade === undefined) {
      return res.status(400).json({
        success: false,
        message: 'screeningId and verifiedGrade are required.',
      })
    }

    let screening = null
    if (screeningId.match(/^[0-9a-fA-F]{24}$/)) {
      screening = await Screening.findById(screeningId)
    }
    if (!screening) {
      screening = await Screening.findOne({ screeningId })
    }

    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening not found' })
    }

    const patient = await Patient.findOne({ patientId: customPatientId || screening.patientId })

    const review = await DoctorReview.create({
      screening: screening._id,
      patient: patient?._id || screening.patient,
      doctor: req.user?._id || null,
      doctorName: req.user?.name || 'Doctor',
      agreedWithAI: agreedWithAI !== undefined ? agreedWithAI : true,
      verifiedGrade: Number(verifiedGrade),
      diagnosis: diagnosis || '',
      clinicalNotes: clinicalNotes || '',
      recommendedAction: recommendedAction || '',
      followUpRequired: Boolean(followUpRequired),
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    })

    // Update screening status
    screening.status = 'completed'
    if (req.user?._id) screening.reviewer = req.user._id
    await screening.save()

    await AuditLog.create({
      user: req.user?._id || null,
      userEmail: req.user?.email || 'doctor@drishtiai.health',
      userName: req.user?.name || 'Dr. Sharma',
      userRole: req.user?.role || 'doctor',
      action: 'DOCTOR_REVIEW_SUBMIT',
      resourceType: 'DoctorReview',
      resourceId: review._id.toString(),
      ipAddress: req.ip,
      meta: { screeningId: screening.screeningId, verifiedGrade },
    }).catch(() => {})

    res.status(201).json({
      success: true,
      data: review,
    })
  } catch (err) {
    next(err)
  }
}

export async function getReviewsForScreening(req, res, next) {
  try {
    const { screeningId } = req.params
    let screening = null
    if (screeningId.match(/^[0-9a-fA-F]{24}$/)) {
      screening = await Screening.findById(screeningId)
    }
    if (!screening) {
      screening = await Screening.findOne({ screeningId })
    }

    const sId = screening ? screening._id : screeningId
    const reviews = await DoctorReview.find({ screening: sId }).populate('doctor', 'name email role')

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } catch (err) {
    next(err)
  }
}
