import Patient from '../models/Patient.js'
import Screening from '../models/Screening.js'

export async function getDashboardStats(req, res, next) {
  try {
    const totalPatients = await Patient.countDocuments()
    const screenings = await Screening.find().select('date classification followUp')

    const today = new Date().toDateString()
    const screeningsToday = screenings.filter((s) => new Date(s.date).toDateString() === today).length
    const imagesAnalyzed = screenings.length
    const pendingFollowups = screenings.filter((s) => s.followUp?.status === 'pending').length

    let low = 0
    let moderate = 0
    let high = 0
    const gradeCounts = [0, 0, 0, 0, 0]

    screenings.forEach((s) => {
      const grade = s.classification?.grade ?? 0
      if (grade >= 0 && grade <= 4) {
        gradeCounts[grade] += 1
      }
      if (grade <= 1) low += 1
      else if (grade === 2) moderate += 1
      else high += 1
    })

    const distinctVillages = await Patient.distinct('village')

    res.json({
      success: true,
      data: {
        totalPatients,
        screeningsToday,
        imagesAnalyzed,
        pendingFollowups,
        distinctVillagesCount: distinctVillages.length,
        low,
        moderate,
        high,
        gradeCounts,
        riskDistribution: [
          { name: 'Low Risk', value: low, key: 'low' },
          { name: 'Moderate Risk', value: moderate, key: 'moderate' },
          { name: 'High Risk', value: high, key: 'high' },
        ],
      },
    })
  } catch (err) {
    next(err)
  }
}
