import { mockExplain } from './mock/mockXAIService'

// Public interface for explainable AI. Today this calls MockXAIService.
// Team 2 / P3 replaces the body of explain() later with the real Grad-CAM /
// attention-map engine.
//
// XAIResult = { heatmapUrl, findings: [], explanation }
export const xaiService = {
  async explain(imageFile, classificationResult) {
    return mockExplain(imageFile, classificationResult)
  },
}
