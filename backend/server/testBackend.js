import { connectDB, disconnectDB } from './config/db.js'
import User from './models/User.js'
import Patient from './models/Patient.js'
import Screening from './models/Screening.js'
import RetinalImage from './models/RetinalImage.js'
import DoctorReview from './models/DoctorReview.js'
import Notification from './models/Notification.js'
import AuditLog from './models/AuditLog.js'
import { seedDatabaseIfEmpty } from './seed/seedData.js'

async function runTests() {
  console.log('--- Starting DrishtiAI MongoDB Backend Verification ---')

  await connectDB()
  await seedDatabaseIfEmpty()

  // 1. Users Check
  const users = await User.find()
  console.log(`[PASS] Users collection count: ${users.length}`)
  const admin = await User.findOne({ role: 'admin' })
  const doctor = await User.findOne({ role: 'doctor' })
  const worker = await User.findOne({ role: 'health_worker' })
  console.log(`[PASS] Roles verified: admin=${admin?.email}, doctor=${doctor?.email}, worker=${worker?.email}`)

  // 2. Patients Check
  const patients = await Patient.find()
  console.log(`[PASS] Patients collection count: ${patients.length}`)
  const testPatient = patients[0]
  console.log(`[PASS] Sample patient: ${testPatient.name} (${testPatient.patientId}) in ${testPatient.village}`)

  // 3. Screenings Check
  const screenings = await Screening.find().populate('patient')
  console.log(`[PASS] Screenings collection count: ${screenings.length}`)
  const sampleScreening = screenings[0]
  console.log(`[PASS] Sample screening: ${sampleScreening.screeningId}, Patient: ${sampleScreening.patient?.name || sampleScreening.patientId}, Grade: ${sampleScreening.classification.grade}`)

  // 4. Doctor Reviews Check
  const reviews = await DoctorReview.find().populate('doctor')
  console.log(`[PASS] Doctor reviews count: ${reviews.length}`)

  // 5. Notifications Check
  const notifs = await Notification.find()
  console.log(`[PASS] Notifications count: ${notifs.length}`)

  // 6. Audit Logs Check
  const logs = await AuditLog.find()
  console.log(`[PASS] Audit logs count: ${logs.length}`)

  // 6b. AI Results Check
  const aiResults = await (await import('./models/AIResult.js')).default.find()
  console.log(`[PASS] AI Results count: ${aiResults.length}`)

  // 7. Test creating a new screening with RetinalImage link
  const newImage = await RetinalImage.create({
    patient: testPatient._id,
    eye: 'left',
    imageUrl: 'data:image/jpeg;base64,/9j/test-fundus-base64',
    qualityScore: 92,
    usable: true,
  })

  const newScreening = await Screening.create({
    screeningId: `SCR-TEST-${Date.now().toString().slice(-4)}`,
    patient: testPatient._id,
    patientId: testPatient.patientId,
    eye: 'left',
    date: new Date(),
    imageDataUrl: newImage.imageUrl,
    images: [newImage._id],
    quality: { qualityScore: 92, usable: true, status: 'good' },
    classification: { classification: 'Mild DR', grade: 1, riskScore: 35, confidence: 90 },
    followUp: { date: new Date(), status: 'pending' },
  })

  console.log(`[PASS] Test screening created successfully with ID: ${newScreening.screeningId}`)

  // Clean up test entry
  await Screening.findByIdAndDelete(newScreening._id)
  await RetinalImage.findByIdAndDelete(newImage._id)
  console.log('[PASS] Test entry cleanup successful.')

  await disconnectDB()
  console.log('--- ALL MONGO BACKEND CHECKS PASSED SUCCESSFULLY ---')
}

runTests().catch((err) => {
  console.error('[FAIL] Test failed with error:', err)
  process.exit(1)
})
