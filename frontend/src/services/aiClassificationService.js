import { mockClassify } from './mock/mockAIService'

// Public interface for DR classification. Today this calls MockAIService.
// Team 1 / P1 will later replace the body of classify() with a real call to
// their model/API — the return shape below must stay the same so no
// component needs to change.
//
// ClassificationResult = { classification, grade, riskScore, confidence, recommendation }
export const aiClassificationService = {
  async classify(imageFile, eye) {
    return mockClassify(imageFile, eye)
  },
}
