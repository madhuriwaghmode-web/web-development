import { hashString } from './hash'
import { getGradeInfo } from '../../utils/constants'

const RECOMMENDATIONS = {
  0: 'Routine screening in 12 months',
  1: 'Routine screening in 6-12 months',
  2: 'Ophthalmologist examination recommended',
  3: 'Prompt ophthalmologist referral recommended',
  4: 'Urgent ophthalmologist referral recommended',
}

// Mock stand-in for Team 1 / P1's real DR classification model.
// Contract: classify(imageFile, eye) -> Promise<ClassificationResult>
// ClassificationResult = { classification, grade (0-4), riskScore, confidence, recommendation }
// REST equivalent once Team 1 stands up a real API: POST /api/classify { image } -> { class, grade, riskScore, confidence }
export async function mockClassify(imageFile, eye) {
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const seed = hashString(`${imageFile?.name}-${imageFile?.size}-${eye}`)
  const grade = seed % 5
  const gradeInfo = getGradeInfo(grade)
  const riskScore = [4, 22, 55, 78, 92][grade] + (seed % 6)
  const confidence = 86 + (seed % 12)

  return {
    classification: gradeInfo.label,
    grade,
    riskScore: Math.min(99, riskScore),
    confidence: Math.min(99, confidence),
    recommendation: RECOMMENDATIONS[grade],
  }
}
