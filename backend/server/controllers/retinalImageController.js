import RetinalImage from '../models/RetinalImage.js'
import Patient from '../models/Patient.js'

export async function uploadImage(req, res, next) {
  try {
    const { patientId, eye, imageUrl, quality } = req.body

    if (!patientId || !imageUrl || !eye) {
      return res.status(400).json({
        success: false,
        message: 'patientId, eye, and imageUrl are required.',
      })
    }

    const patient = await Patient.findOne({ patientId: patientId.toUpperCase() })
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    const retinalImage = await RetinalImage.create({
      patient: patient._id,
      eye,
      imageUrl,
      qualityScore: quality?.qualityScore || 85,
      blurScore: quality?.blurScore || 90,
      brightnessScore: quality?.brightnessScore || 85,
      fieldOfViewScore: quality?.fieldOfViewScore || 88,
      usable: quality?.usable !== undefined ? quality.usable : true,
      qualityStatus: quality?.status || 'good',
      qualityMessage: quality?.message || 'Suitable for AI screening',
      uploadedBy: req.user?._id || null,
    })

    res.status(201).json({
      success: true,
      data: retinalImage,
    })
  } catch (err) {
    next(err)
  }
}

export async function getImageById(req, res, next) {
  try {
    const image = await RetinalImage.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }
    res.json({ success: true, data: image })
  } catch (err) {
    next(err)
  }
}
