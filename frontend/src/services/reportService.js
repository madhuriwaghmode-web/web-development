import { getGradeInfo } from '../utils/constants'

// Assembles the data shape ReportPreview renders. Keeping this in one place
// means the report layout can change without touching where reports are
// requested from (ReportsPage, ScreeningResultPage, PatientProfilePage).
export const reportService = {
  generateReport(screening, patient, history) {
    if (!screening || !patient) return null
    const gradeInfo = getGradeInfo(screening.classification?.grade ?? 0)

    return {
      reportId: `RPT-${screening.screeningId}`,
      generatedAt: new Date().toISOString(),
      patient,
      screening,
      gradeInfo,
      history: history || [],
    }
  },
}
