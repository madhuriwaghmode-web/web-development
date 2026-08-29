// Public interface for evidence fusion (classification + segmentation + XAI
// combined into one validated risk view). Team 2 / P4 owns the real
// implementation; for now this simply forwards the classification result so
// the rest of the app has something consistent to render.
//
// FusionResult = { finalRiskScore, trustScore, evidenceSummary }
export const evidenceFusionService = {
  async fuse({ classification }) {
    return {
      finalRiskScore: classification?.riskScore ?? null,
      trustScore: null,
      evidenceSummary: 'Evidence fusion will appear here once Team 2 connects the fusion engine.',
    }
  },
}
