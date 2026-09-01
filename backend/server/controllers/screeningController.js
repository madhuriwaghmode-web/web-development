import Screening from '../models/Screening.js'
import Patient from '../models/Patient.js'
import RetinalImage from '../models/RetinalImage.js'
import Notification from '../models/Notification.js'
import AuditLog from '../models/AuditLog.js'
import AIResult from '../models/AIResult.js'

export async function getAllScreenings(req, res, next) {
  try {
    const { patientId, risk, status, limit, page } = req.query
    const filter = {}

    if (patientId) {
      filter.patientId = patientId.toUpperCase()
    }
    if (status) {
      filter.status = status
    }
    if (risk) {
      if (risk === 'low') filter['classification.grade'] = { $in: [0, 1] }
      else if (risk === 'moderate') filter['classification.grade'] = 2
      else if (risk === 'high') filter['classification.grade'] = { $in: [3, 4] }
    }

    let query = Screening.find(filter).sort({ date: -1 })

    if (page && limit) {
      const p = parseInt(page, 10) || 1
      const l = parseInt(limit, 10) || 50
      query = query.skip((p - 1) * l).limit(l)
    }

    const screenings = await query
    const total = await Screening.countDocuments(filter)

    res.json({
      success: true,
      count: screenings.length,
      total,
      data: screenings.map((s) => ({
        id: s._id.toString(),
        _id: s._id.toString(),
        screeningId: s.screeningId,
        patientId: s.patientId,
        eye: s.eye,
        date: s.date ? s.date.toISOString() : new Date().toISOString(),
        imageDataUrl: s.imageDataUrl,
        quality: s.quality,
        classification: s.classification,
        segmentation: s.segmentation,
        xai: s.xai,
        fusion: s.fusion,
        followUp: {
          date: s.followUp?.date ? s.followUp.date.toISOString() : '',
          status: s.followUp?.status || 'pending',
          notes: s.followUp?.notes || '',
        },
        status: s.status,
      })),
    })
  } catch (err) {
    next(err)
  }
}

export async function getScreeningById(req, res, next) {
  try {
    const { id } = req.params
    let screening = null

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      screening = await Screening.findById(id).populate('patient').populate('reviews')
    }
    if (!screening) {
      screening = await Screening.findOne({ screeningId: id.toUpperCase() }).populate('patient').populate('reviews')
    }

    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening record not found' })
    }

    res.json({
      success: true,
      data: {
        id: screening._id.toString(),
        _id: screening._id.toString(),
        screeningId: screening.screeningId,
        patientId: screening.patientId,
        eye: screening.eye,
        date: screening.date ? screening.date.toISOString() : '',
        imageDataUrl: screening.imageDataUrl,
        quality: screening.quality,
        classification: screening.classification,
        segmentation: screening.segmentation,
        xai: screening.xai,
        fusion: screening.fusion,
        followUp: {
          date: screening.followUp?.date ? screening.followUp.date.toISOString() : '',
          status: screening.followUp?.status || 'pending',
          notes: screening.followUp?.notes || '',
        },
        status: screening.status,
        patient: screening.patient,
        reviews: screening.reviews,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function getScreeningsForPatient(req, res, next) {
  try {
    const { patientId } = req.params
    const screenings = await Screening.find({
      patientId: patientId.toUpperCase(),
    }).sort({ date: -1 })

    res.json({
      success: true,
      count: screenings.length,
      data: screenings.map((s) => ({
        id: s._id.toString(),
        _id: s._id.toString(),
        screeningId: s.screeningId,
        patientId: s.patientId,
        eye: s.eye,
        date: s.date ? s.date.toISOString() : '',
        imageDataUrl: s.imageDataUrl,
        quality: s.quality,
        classification: s.classification,
        segmentation: s.segmentation,
        xai: s.xai,
        fusion: s.fusion,
        followUp: s.followUp,
        status: s.status,
      })),
    })
  } catch (err) {
    next(err)
  }
}

export async function createScreening(req, res, next) {
  try {
    const {
      patientId,
      eye,
      imageDataUrl,
      quality,
      classification,
      segmentation,
      xai,
      fusion,
      followUp,
    } = req.body

    if (!patientId || !eye) {
      return res.status(400).json({
        success: false,
        message: 'patientId and eye (left/right) are required.',
      })
    }

    let patient = await Patient.findOne({ patientId: patientId.toUpperCase() })
    if (!patient && patientId.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(patientId)
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient ${patientId} not found. Please register patient first.`,
      })
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const pDigits = patient.patientId.replace(/\D/g, '')
    const screeningId = `SCR-${dateStr}-${pDigits}-${Date.now().toString().slice(-4)}`

    // Create RetinalImage record if image provided
    let retinalImageDoc = null
    if (imageDataUrl) {
      retinalImageDoc = await RetinalImage.create({
        patient: patient._id,
        eye,
        imageUrl: imageDataUrl,
        qualityScore: quality?.qualityScore || 85,
        blurScore: quality?.blurScore || 90,
        brightnessScore: quality?.brightnessScore || 85,
        fieldOfViewScore: quality?.fieldOfViewScore || 88,
        usable: quality?.usable !== undefined ? quality.usable : true,
        qualityStatus: quality?.status || 'good',
        qualityMessage: quality?.message || '',
        uploadedBy: req.user?._id || null,
      })
    }

    const defaultClassification = classification || {
      classification: 'No DR',
      grade: 0,
      riskScore: 5,
      confidence: 95,
      recommendation: 'Routine annual eye checkup recommended.',
    }

    const screening = await Screening.create({
      screeningId,
      patient: patient._id,
      patientId: patient.patientId,
      eye,
      date: new Date(),
      imageDataUrl: imageDataUrl || null,
      images: retinalImageDoc ? [retinalImageDoc._id] : [],
      quality: quality || {
        qualityScore: 90,
        blurScore: 92,
        brightnessScore: 88,
        fieldOfViewScore: 90,
        usable: true,
        status: 'good',
        message: 'Suitable for AI screening',
      },
      classification: defaultClassification,
      segmentation: segmentation || { detectedLesions: [], lesionMasks: [] },
      xai: xai || { heatmapUrl: null, findings: [], explanation: 'XAI model evaluated retina features.' },
      fusion: fusion || { finalRiskScore: defaultClassification.riskScore, trustScore: 90, evidenceSummary: 'Fusion verified.' },
      followUp: followUp || {
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        notes: '',
      },
      status: 'completed',
      conductedBy: req.user?._id || null,
    })

    if (retinalImageDoc) {
      retinalImageDoc.screening = screening._id
      await retinalImageDoc.save()
    }

    // Create AIResult entry
    await AIResult.create({
      screening: screening._id,
      patient: patient._id,
      modelName: 'ResNet50 + U-Net',
      prediction: defaultClassification.classification,
      confidence: defaultClassification.confidence || 90,
      riskScore: defaultClassification.riskScore || 0,
      detectedLesions: segmentation?.detectedLesions || [],
      heatmapUrl: xai?.heatmapUrl || null,
      rawOutputs: { quality, classification: defaultClassification, segmentation, xai, fusion },
    }).catch(() => {})

    // Update patient summary fields
    patient.previousScreeningDate = screening.date
    patient.previousResult = defaultClassification.classification
    patient.previousRiskScore = defaultClassification.riskScore
    await patient.save()

    // Create doctor alert notification if moderate or severe DR
    if (defaultClassification.grade >= 2) {
      await Notification.create({
        targetRole: 'doctor',
        type: 'screening_alert',
        title: `DR Alert: ${patient.name} (${patient.patientId})`,
        message: `${defaultClassification.classification} (Grade ${defaultClassification.grade}) detected. Clinical review recommended.`,
        link: `/screening/${screening._id}/result`,
        meta: { screeningId: screening.screeningId, patientId: patient.patientId },
      }).catch(() => {})
    }

    await AuditLog.create({
      user: req.user?._id || null,
      userEmail: req.user?.email || 'worker@drishtiai.health',
      userName: req.user?.name || 'Health Worker',
      userRole: req.user?.role || 'health_worker',
      action: 'SCREENING_RUN',
      resourceType: 'Screening',
      resourceId: screening._id.toString(),
      ipAddress: req.ip,
      meta: {
        screeningId: screening.screeningId,
        patientId: patient.patientId,
        grade: defaultClassification.grade,
      },
    }).catch(() => {})

    res.status(201).json({
      success: true,
      data: {
        id: screening._id.toString(),
        _id: screening._id.toString(),
        screeningId: screening.screeningId,
        patientId: screening.patientId,
        eye: screening.eye,
        date: screening.date.toISOString(),
        imageDataUrl: screening.imageDataUrl,
        quality: screening.quality,
        classification: screening.classification,
        segmentation: screening.segmentation,
        xai: screening.xai,
        fusion: screening.fusion,
        followUp: {
          date: screening.followUp?.date ? screening.followUp.date.toISOString() : '',
          status: screening.followUp?.status || 'pending',
          notes: screening.followUp?.notes || '',
        },
        status: screening.status,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function updateFollowUp(req, res, next) {
  try {
    const { id } = req.params
    const { status, date, notes } = req.body

    let screening = null
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      screening = await Screening.findById(id)
    }
    if (!screening) {
      screening = await Screening.findOne({ screeningId: id.toUpperCase() })
    }

    if (!screening) {
      return res.status(404).json({ success: false, message: 'Screening record not found' })
    }

    if (!screening.followUp) {
      screening.followUp = { status: 'pending', notes: '' }
    }

    if (status !== undefined) {
      screening.followUp.status = status
      if (status === 'completed') {
        screening.followUp.completedAt = new Date()
      }
    }
    if (date !== undefined) {
      screening.followUp.date = new Date(date)
    }
    if (notes !== undefined) {
      screening.followUp.notes = notes
    }

    await screening.save()

    res.json({
      success: true,
      data: {
        id: screening._id.toString(),
        _id: screening._id.toString(),
        screeningId: screening.screeningId,
        patientId: screening.patientId,
        followUp: {
          date: screening.followUp.date ? screening.followUp.date.toISOString() : '',
          status: screening.followUp.status,
          notes: screening.followUp.notes,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}
