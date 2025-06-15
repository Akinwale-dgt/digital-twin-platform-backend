// import path from 'path'
import Report from '../models/report.js'
import logger from '../utils/customLogger.js'
// import { cleanupTempPDF, generatePDF } from '../utils/generatePdfV3.js'

export const reportStatusController = async (req, res) => {
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId).select('status createdAt updatedAt')

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    return res.status(200).json({
      reportId,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    })
  } catch (error) {
    logger.error('Error checking report status:')
    logger.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getReportController = async (req, res) => {
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Exclude potentially sensitive fields
    const { __v, ...safeReport } = report.toObject()

    return res.status(200).json(safeReport)
  } catch (error) {
    logger.error('Error retrieving report:')
    logger.error(error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
