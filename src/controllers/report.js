import fs from 'fs'
// import path from 'path'
import Report from '../models/report.js'
import logger from '../utils/customLogger.js'
import { cleanupTempPDF, generatePDF } from '../utils/generatePdfV3.js'

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
  let tempPdfPath = null

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

    if (!report.results) {
      return res.status(404).json({ error: 'Report results not found' })
    }

    try {
      // Generate temporary PDF file
      logger.info(`Generating PDF for report ${reportId}`)
      tempPdfPath = await generatePDF(report.results, reportId)

      // Stream the file to the client
      return res.download(tempPdfPath, `exoskeleton_report_${reportId}.pdf`, (err) => {
        // Delete temp file after download completes or errors
        cleanupTempPDF(tempPdfPath)

        if (err) {
          logger.error('Error during file download:', err)
        }
      })
    } catch (pdfError) {
      logger.error('Error generating PDF:')
      logger.error(pdfError)

      // Clean up temp file if it exists
      if (tempPdfPath) {
        cleanupTempPDF(tempPdfPath)
      }

      return res.status(500).json({ error: 'Error generating PDF', details: pdfError.message })
    }
  } catch (error) {
    logger.error('Error downloading report:')
    logger.error(error)

    // Clean up temp file if it exists
    if (tempPdfPath) {
      cleanupTempPDF(tempPdfPath)
    }

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

export const viewReportController = async (req, res) => {
  let tempPdfPath = null
  
  try {
    const { reportId } = req.params

    const report = await Report.findById(reportId)

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        error: 'Report not ready for viewing',
        status: report.status,
      })
    }

    if (!report.results) {
      return res.status(404).json({ error: 'Report results not found' })
    }

    try {
      // Generate temporary PDF file
      logger.info(`Generating PDF for viewing report ${reportId}`)
      tempPdfPath = await generatePDF(report.results, reportId)
      
      // Get file size for Content-Length header
      const stat = fs.statSync(tempPdfPath)
      
      // Set headers for inline viewing
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Length', stat.size)
      res.setHeader('Content-Disposition', `inline; filename="exoskeleton_report_${reportId}.pdf"`)
      
      // Stream the file to client
      const fileStream = fs.createReadStream(tempPdfPath)
      
      fileStream.on('error', (error) => {
        logger.error('Error streaming PDF file:', error)
        cleanupTempPDF(tempPdfPath)
        
        // Only send error if headers haven't been sent yet
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming PDF file' })
        }
      })
      
      fileStream.on('end', () => {
        // Clean up the temporary file after streaming is complete
        cleanupTempPDF(tempPdfPath)
      })
      
      // Pipe file to response
      return fileStream.pipe(res)
    } catch (pdfError) {
      logger.error('Error generating PDF for viewing:')
      logger.error(pdfError)
      
      // Clean up temp file if it exists
      if (tempPdfPath) {
        cleanupTempPDF(tempPdfPath)
      }
      
      return res.status(500).json({ error: 'Error generating PDF for viewing', details: pdfError.message })
    }
  } catch (error) {
    logger.error('Error viewing report:')
    logger.error(error)
    
    // Clean up temp file if it exists
    if (tempPdfPath) {
      cleanupTempPDF(tempPdfPath)
    }
    
    return res.status(500).json({ error: 'Internal server error' })
  }
}
