import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Report from '../models/report.js'
import logger from '../utils/customLogger.js'


// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

export const downloadReportController = async (req, res) => {
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        error: 'Report not ready for download',
        status: report.status,
      })
    }

    if (!report.pdfPath) {
      return res.status(404).json({ error: 'PDF file not found' })
    }

    const pdfPath = path.join(__dirname, report.pdfPath)

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ error: 'PDF file not found on server' })
    }

    return res.download(pdfPath, `exoskeleton_report_${reportId}.pdf`)
  } catch (error) {
    logger.error('Error downloading report:')
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
