// Mock stand-in for Team 2 / P3's real XAI engine. Deliberately does NOT
// generate a fake heatmap — the UI must show "not connected yet" rather than
// a real-looking image, per the project's safety rules.
// Contract: explain(imageFile, classificationResult) -> Promise<XAIResult>
// XAIResult = { heatmapUrl, findings: [], explanation }
// REST equivalent: POST /api/xai { image, classification } -> { heatmapUrl, findings, explanation }
export async function mockExplain() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    heatmapUrl: null,
    findings: [],
    explanation: 'Explainability results will appear here after the XAI engine is connected.',
  }
}
