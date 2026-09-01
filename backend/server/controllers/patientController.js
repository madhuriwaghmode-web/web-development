import Patient from '../models/Patient.js'
import Screening from '../models/Screening.js'
import AuditLog from '../models/AuditLog.js'

async function getNextPatientId() {
  const lastPatient = await Patient.findOne().sort({ createdAt: -1 })
  if (!lastPatient || !lastPatient.patientId) return 'PT-1047'
  const match = lastPatient.patientId.match(/\d+/)
  const num = match ? parseInt(match[0], 10) + 1 : 1047
  return `PT-${Math.max(num, 1047)}`
}

export async function getAllPatients(req, res, next) {
  try {
    const { query, village, page, limit } = req.query
    const filter = {}

    if (query && query.trim()) {
      const q = query.trim()
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { patientId: { $regex: q, $options: 'i' } },
        { village: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
      ]
    }

    if (village) {
      filter.village = village
    }

    const sortOption = { name: 1 }
    let patientsQuery = Patient.find(filter).sort(sortOption)

    if (page && limit) {
      const p = parseInt(page, 10) || 1
      const l = parseInt(limit, 10) || 20
      patientsQuery = patientsQuery.skip((p - 1) * l).limit(l)
    }

    const patients = await patientsQuery
    const total = await Patient.countDocuments(filter)

    res.json({
      success: true,
      count: patients.length,
      total,
      data: patients.map((p) => ({
        id: p._id.toString(),
        _id: p._id.toString(),
        patientId: p.patientId,
        name: p.name,
        age: p.age,
        gender: p.gender,
        phone: p.phone,
        village: p.village,
        district: p.district,
        diabetesDuration: p.diabetesDuration,
        bloodSugar: p.bloodSugar,
        hba1c: p.hba1c,
        previousScreeningDate: p.previousScreeningDate ? p.previousScreeningDate.toISOString() : '',
        previousResult: p.previousResult,
        previousRiskScore: p.previousRiskScore,
        createdAt: p.createdAt,
      })),
    })
  } catch (err) {
    next(err)
  }
}

export async function getPatientById(req, res, next) {
  try {
    const { id } = req.params
    let patient = null

    // Search by ObjectId or by patientId string
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(id)
    }
    if (!patient) {
      patient = await Patient.findOne({ patientId: id.toUpperCase() })
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found with identifier '${id}'.`,
      })
    }

    const screenings = await Screening.find({ patientId: patient.patientId }).sort({ date: -1 })

    res.json({
      success: true,
      data: {
        id: patient._id.toString(),
        _id: patient._id.toString(),
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        village: patient.village,
        district: patient.district,
        diabetesDuration: patient.diabetesDuration,
        bloodSugar: patient.bloodSugar,
        hba1c: patient.hba1c,
        previousScreeningDate: patient.previousScreeningDate ? patient.previousScreeningDate.toISOString() : '',
        previousResult: patient.previousResult,
        previousRiskScore: patient.previousRiskScore,
        createdAt: patient.createdAt,
        screenings: screenings.map((s) => ({
          id: s._id.toString(),
          _id: s._id.toString(),
          screeningId: s.screeningId,
          patientId: s.patientId,
          eye: s.eye,
          date: s.date,
          imageDataUrl: s.imageDataUrl,
          quality: s.quality,
          classification: s.classification,
          segmentation: s.segmentation,
          xai: s.xai,
          fusion: s.fusion,
          followUp: s.followUp,
          status: s.status,
        })),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function createPatient(req, res, next) {
  try {
    const {
      name,
      age,
      gender,
      phone,
      village,
      district,
      diabetesDuration,
      bloodSugar,
      hba1c,
      patientId: customPatientId,
    } = req.body

    if (!name || !village || age === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, and village are required fields.',
      })
    }

    const patientId = customPatientId || (await getNextPatientId())

    const patient = await Patient.create({
      patientId,
      name,
      age: Number(age),
      gender: gender || 'Female',
      phone: phone || '',
      village,
      district: district || 'Pune',
      diabetesDuration: diabetesDuration || '',
      bloodSugar: bloodSugar || '',
      hba1c: hba1c || '',
      createdBy: req.user?._id || null,
    })

    await AuditLog.create({
      user: req.user?._id || null,
      userEmail: req.user?.email || 'worker@drishtiai.health',
      userName: req.user?.name || 'Health Worker',
      userRole: req.user?.role || 'health_worker',
      action: 'PATIENT_CREATE',
      resourceType: 'Patient',
      resourceId: patient._id.toString(),
      ipAddress: req.ip,
      meta: { patientId: patient.patientId, name: patient.name },
    }).catch(() => {})

    res.status(201).json({
      success: true,
      data: {
        id: patient._id.toString(),
        _id: patient._id.toString(),
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        village: patient.village,
        district: patient.district,
        diabetesDuration: patient.diabetesDuration,
        bloodSugar: patient.bloodSugar,
        hba1c: patient.hba1c,
        previousScreeningDate: '',
        previousResult: '',
        previousRiskScore: null,
        createdAt: patient.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function updatePatient(req, res, next) {
  try {
    const { id } = req.params
    let patient = null

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(id)
    }
    if (!patient) {
      patient = await Patient.findOne({ patientId: id.toUpperCase() })
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    const allowedFields = [
      'name',
      'age',
      'gender',
      'phone',
      'village',
      'district',
      'diabetesDuration',
      'bloodSugar',
      'hba1c',
      'previousScreeningDate',
      'previousResult',
      'previousRiskScore',
    ]

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field]
      }
    }

    await patient.save()

    res.json({
      success: true,
      data: {
        id: patient._id.toString(),
        _id: patient._id.toString(),
        patientId: patient.patientId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        village: patient.village,
        district: patient.district,
        diabetesDuration: patient.diabetesDuration,
        bloodSugar: patient.bloodSugar,
        hba1c: patient.hba1c,
        previousScreeningDate: patient.previousScreeningDate ? patient.previousScreeningDate.toISOString() : '',
        previousResult: patient.previousResult,
        previousRiskScore: patient.previousRiskScore,
        createdAt: patient.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function deletePatient(req, res, next) {
  try {
    const { id } = req.params
    let patient = null

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findByIdAndDelete(id)
    } else {
      patient = await Patient.findOneAndDelete({ patientId: id.toUpperCase() })
    }

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    res.json({
      success: true,
      message: `Patient ${patient.patientId} deleted successfully.`,
    })
  } catch (err) {
    next(err)
  }
}
