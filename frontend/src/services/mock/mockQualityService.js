import { hashString } from './hash'

// Mock stand-in for Team 3 / P5's real image-quality module.
// Contract: analyzeQuality(imageFile) -> Promise<QualityResult>
// QualityResult = { qualityScore, blurScore, brightnessScore, fieldOfViewScore, usable, status, message }
export async function mockAnalyzeQuality(imageFile) {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const seed = hashString(`${imageFile?.name}-${imageFile?.size}`)
  const base = 68 + (seed % 30) // 68-97

  const qualityScore = base
  const blurScore = Math.min(99, base + (seed % 5))
  const brightnessScore = Math.min(99, base - (seed % 7) + 4)
  const fieldOfViewScore = Math.min(99, base - (seed % 4))

  let status = 'good'
  let message = 'Suitable for AI screening'
  if (qualityScore < 60) {
    status = 'poor'
    message = 'Image quality is insufficient for reliable screening. Please upload or capture another image.'
  } else if (qualityScore < 80) {
    status = 'fair'
    message = 'Image quality is acceptable but could be improved for best results.'
  }

  return {
    qualityScore,
    blurScore,
    brightnessScore,
    fieldOfViewScore,
    usable: status !== 'poor',
    status,
    message,
  }
}
