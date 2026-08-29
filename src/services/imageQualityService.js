import { mockAnalyzeQuality } from './mock/mockQualityService'

// Public interface Team 3 components call. Owned end-to-end by Team 3 / P5.
// Swap the body of analyzeQuality() for the real implementation later —
// callers never change.
export const imageQualityService = {
  async analyzeQuality(imageFile) {
    return mockAnalyzeQuality(imageFile)
  },
}
