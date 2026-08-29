import { mockSegment } from './mock/mockSegmentationService'

// Public interface for lesion segmentation. Today this calls
// MockSegmentationService. Team 1 / P2 replaces the body of segment() later.
//
// SegmentationResult = { detectedLesions: [{ type, confidence }], lesionMasks: [] }
export const segmentationService = {
  async segment(imageFile, grade) {
    return mockSegment(imageFile, grade)
  },
}
