import Bull from 'bull'
import Report from '../models/report.js'
import generateReport from '../service/report.js'
import generatePDF from '../utils/generatePdf.js'
import path from 'path'

import { fileURLToPath } from 'url';

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a queue for background processing
export const reportGenerationQueue = new Bull('report-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
})

reportGenerationQueue.process(async (job) => {
  const { reportId, inputData } = job.data

  try {
    // Update report status to processing
    await Report.findByIdAndUpdate(reportId, { status: 'processing' })

    // Generate the report
    const reportData = await generateReport(inputData)

    // Generate PDF
    const pdfPath = await generatePDF(reportData, reportId)

    // Store the relative path in the database
    const relativePdfPath = path.relative(__dirname, pdfPath)

    // Update the report in the database
    await Report.findByIdAndUpdate(reportId, {
      status: 'completed',
      results: reportData,
      pdfPath: relativePdfPath,
    })

    return { reportId, status: 'completed' }
  } catch (error) {
    console.error(`Error processing report ${reportId}:`, error)

    // Update the report with error status
    await Report.findByIdAndUpdate(reportId, {
      status: 'failed',
      error: error.message,
    })

    throw error
  }
})
