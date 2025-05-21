/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import { mdToPdf } from 'md-to-pdf'
import { fileURLToPath } from 'url'

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Temporary directory for PDF generation
const tmpDir = path.join(__dirname, 'tmp_pdfs')

// Ensure tmp directory exists
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

/**
 * Generate a PDF from report data and return the file path
 * This creates a temporary file that should be deleted after use
 */
async function generatePDF(reportData, reportId) {
  try {
    // Create a unique temporary filename
    const tempFilePath = path.join(tmpDir, `report_${reportId}_${Date.now()}.pdf`)
    
    // Get the markdown content from the report data
    const markdownContent = reportData.report_markdown || reportData.content
    
    if (!markdownContent) {
      throw new Error('No markdown content found in report data')
    }
    
    // Generate PDF from markdown
    await mdToPdf(
      { content: markdownContent },
      { dest: tempFilePath, pdf: { format: 'A4' } }
    )
    
    // Verify the file was created
    if (!fs.existsSync(tempFilePath)) {
      throw new Error('PDF file was not created')
    }
    
    return tempFilePath
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error instanceof Error ? error : new Error(error)
  }
}

/**
 * Cleanup temporary PDF files
 */
function cleanupTempPDF(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error('Error cleaning up temporary PDF:', error)
  }
}

export { generatePDF, cleanupTempPDF }
export default generatePDF