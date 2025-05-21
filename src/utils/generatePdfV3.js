/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
// import PDFDocument from 'pdfkit'
import { mdToPdf } from 'md-to-pdf'

import { fileURLToPath } from 'url'

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate a PDF from the report data
async function generatePDF(reportData, reportId) {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = path.join(__dirname, 'uploads')

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      const pdfPath = path.join(uploadsDir, `report_${reportId}.pdf`)
      //   const doc = new PDFDocument({ margin: 50 })
    //   mdToPdf({ content: reportData.report_markdown }, { dest: pdfPath })
      mdToPdf({ content: reportData.content }, { dest: pdfPath })


      resolve(pdfPath)
    } catch (error) {
      reject(error instanceof Error ? error : new Error(error))
    }
  })
}

export default generatePDF
