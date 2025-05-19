import path from 'path'
import fs from 'fs'
import Report from '../models/report.js'

import { fileURLToPath } from 'url'

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const reportStatusController = async (req, res, next) => {
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
    console.error('Error checking report status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const downloadReportController = async (req, res, next) => {
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

    res.download(pdfPath, `exoskeleton_report_${reportId}.pdf`)
  } catch (error) {
    console.error('Error downloading report:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getReportController = async (req, res, next) => {
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    // Exclude potentially sensitive fields
    const { __v, ...safeReport } = report.toObject()

    res.status(200).json(safeReport)
  } catch (error) {
    console.error('Error retrieving report:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
