// Seed data so the app is fully explorable before any real patient is added.
// This is the ONLY place sample records are hardcoded — everything else reads
// through patientService / storage.js.

export const SEED_PATIENTS = [
  {
    id: 'p1', patientId: 'PT-1042', name: 'Ramesh Kadam', age: 58, gender: 'Male',
    phone: '9876500001', village: 'Wadgaon', district: 'Pune', diabetesDuration: '12 years',
    bloodSugar: '168 mg/dL', hba1c: '7.8%', previousScreeningDate: '2026-05-15',
    previousResult: 'Mild DR', previousRiskScore: 35, createdAt: '2025-11-02T09:00:00.000Z',
  },
  {
    id: 'p2', patientId: 'PT-1043', name: 'Sunita Patil', age: 47, gender: 'Female',
    phone: '9876500002', village: 'Shirur', district: 'Pune', diabetesDuration: '6 years',
    bloodSugar: '142 mg/dL', hba1c: '7.1%', previousScreeningDate: '2026-06-02',
    previousResult: 'No DR', previousRiskScore: 8, createdAt: '2025-12-10T09:00:00.000Z',
  },
  {
    id: 'p3', patientId: 'PT-1044', name: 'Abdul Sheikh', age: 63, gender: 'Male',
    phone: '9876500003', village: 'Baramati', district: 'Pune', diabetesDuration: '19 years',
    bloodSugar: '201 mg/dL', hba1c: '9.2%', previousScreeningDate: '2026-08-29',
    previousResult: 'Moderate DR', previousRiskScore: 68, createdAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 'p4', patientId: 'PT-1045', name: 'Lata More', age: 52, gender: 'Female',
    phone: '9876500004', village: 'Daund', district: 'Pune', diabetesDuration: '9 years',
    bloodSugar: '155 mg/dL', hba1c: '7.5%', previousScreeningDate: '', previousResult: '',
    previousRiskScore: null, createdAt: '2026-02-18T09:00:00.000Z',
  },
  {
    id: 'p5', patientId: 'PT-1046', name: 'Vikram Jadhav', age: 41, gender: 'Male',
    phone: '9876500005', village: 'Indapur', district: 'Pune', diabetesDuration: '3 years',
    bloodSugar: '128 mg/dL', hba1c: '6.6%', previousScreeningDate: '2026-07-11',
    previousResult: 'No DR', previousRiskScore: 5, createdAt: '2026-03-01T09:00:00.000Z',
  },
]

export const SEED_SCREENINGS = [
  {
    id: 's1', screeningId: 'SCR-20260515-1042', patientId: 'PT-1042', eye: 'right',
    date: '2026-05-15T10:20:00.000Z', imageDataUrl: null,
    quality: { qualityScore: 88, blurScore: 91, brightnessScore: 85, fieldOfViewScore: 87, usable: true, status: 'good', message: 'Suitable for AI screening' },
    classification: { classification: 'Mild Diabetic Retinopathy', grade: 1, riskScore: 35, confidence: 91, recommendation: 'Routine screening in 6-12 months' },
    segmentation: { detectedLesions: [{ type: 'Microaneurysms', confidence: 62 }], lesionMasks: [] },
    xai: { heatmapUrl: null, findings: [], explanation: 'Explainability results will appear here after the XAI engine is connected.' },
    fusion: { finalRiskScore: 35, trustScore: null, evidenceSummary: 'Evidence fusion will appear here once Team 2 connects the fusion engine.' },
    followUp: { date: '2026-11-15T00:00:00.000Z', status: 'pending', notes: '' },
    status: 'completed',
  },
  {
    id: 's2', screeningId: 'SCR-20260829-1044', patientId: 'PT-1044', eye: 'right',
    date: '2026-08-29T08:05:00.000Z', imageDataUrl: null,
    quality: { qualityScore: 93, blurScore: 95, brightnessScore: 90, fieldOfViewScore: 92, usable: true, status: 'good', message: 'Suitable for AI screening' },
    classification: { classification: 'Moderate Diabetic Retinopathy', grade: 2, riskScore: 68, confidence: 94, recommendation: 'Ophthalmologist examination recommended' },
    segmentation: { detectedLesions: [{ type: 'Microaneurysms', confidence: 81 }, { type: 'Hemorrhages', confidence: 58 }], lesionMasks: [] },
    xai: { heatmapUrl: null, findings: [], explanation: 'Explainability results will appear here after the XAI engine is connected.' },
    fusion: { finalRiskScore: 68, trustScore: null, evidenceSummary: 'Evidence fusion will appear here once Team 2 connects the fusion engine.' },
    followUp: { date: '2026-09-28T00:00:00.000Z', status: 'pending', notes: 'Referred to district eye hospital.' },
    status: 'completed',
  },
]

export const DASHBOARD_STATS_SEED = {
  totalPatients: 5,
  screeningsToday: 1,
  imagesAnalyzed: 2,
  lowRiskCases: 3,
  moderateRiskCases: 1,
  highRiskCases: 1,
  pendingFollowups: 2,
}

export const SCREENING_TREND_SEED = [
  { day: 'Mon', screenings: 4 },
  { day: 'Tue', screenings: 6 },
  { day: 'Wed', screenings: 3 },
  { day: 'Thu', screenings: 7 },
  { day: 'Fri', screenings: 5 },
  { day: 'Sat', screenings: 2 },
  { day: 'Sun', screenings: 1 },
]

export const RISK_DISTRIBUTION_SEED = [
  { name: 'Low Risk', value: 3, key: 'low' },
  { name: 'Moderate Risk', value: 1, key: 'moderate' },
  { name: 'High Risk', value: 1, key: 'high' },
]
