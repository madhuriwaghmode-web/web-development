import { hashString } from './hash'

const LESION_TYPES = ['Microaneurysms', 'Hemorrhages', 'Exudates']

// Mock stand-in for Team 1 / P2's real lesion segmentation model.
// Contract: segment(imageFile) -> Promise<SegmentationResult>
// SegmentationResult = { detectedLesions: [{ type, confidence }], lesionMasks: [] }
// REST equivalent: POST /api/segment { image } -> { lesionMasks, detectedLesions }
export async function mockSegment(imageFile, grade) {
  await new Promise((resolve) => setTimeout(resolve, 900))

  const seed = hashString(`${imageFile?.name}-${imageFile?.size}-seg`)
  const lesionCount = grade === undefined ? seed % 3 : Math.min(3, grade)

  const detectedLesions = LESION_TYPES.slice(0, lesionCount).map((type, i) => ({
    type,
    confidence: 55 + ((seed + i * 13) % 40),
  }))

  return { detectedLesions, lesionMasks: [] }
}
