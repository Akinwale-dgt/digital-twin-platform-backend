/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'
import { mdToPdf } from 'md-to-pdf'

import { fileURLToPath } from 'url'

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const match = (reportData, title) => {
  // Escape special regex characters in the title
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return (
    // Try bold format first: **Title:**
    reportData.report_markdown.match(
      new RegExp(
        `\\*\\*\\s*${escapedTitle}\\s*:?\\*\\*\\s*\\n([\\s\\S]+?)(?=\\n\\*\\*|\\n\\n\\*\\*|\\n#{1,6}\\s|$)`,
        'i',
      ),
    ) ||
    // Try hashtag headers with variable levels: ### or #### Title
    reportData.report_markdown.match(
      new RegExp(
        `#{2,4}\\s*${escapedTitle}\\s*:?([\\s\\S]+?)(?=\\n#{1,6}\\s|\\n\\n#{1,6}\\s|$)`,
        'i',
      ),
    ) ||
    // Finally try just the text without formatting: Title:
    reportData.report_markdown.match(
      new RegExp(`${escapedTitle}\\s*:?\\s*\\n([\\s\\S]+?)(?=\\n[A-Z]|\\n\\n[A-Z]|$)`, 'i'),
    )
  )
}

const addSubject = (doc, contexts, title) => {
  if (contexts && contexts.length > 0) {
    doc.fontSize(16)
    doc.text(title, 50, doc.y, {
      underline: true,
      align: 'left',
      continued: false,
    })

    // Move down and explicitly position the content
    doc.fontSize(12)
    doc.y += 20 // Add space after header
    doc.x = 50 // Ensure we're at left margin

    // Add the content with explicit left margin and width
    doc.text(contexts[1].trim(), 50, doc.y, {
      align: 'left',
      width: doc.page.width - 100, // Leave margin on both sides
    })

    doc.moveDown()
  }
}

// Function to add a bulleted list from markdown-style list to PDF
const addBulletedList = (doc, text) => {
  if (!text) return

  const lines = text.split('\n')
  const bulletedLines = lines.filter((line) => line.trim().startsWith('-'))

  bulletedLines.forEach((line) => {
    // Extract content after the bullet
    const content = line.trim().substring(1).trim()
    // Check if there's a page break needed
    if (doc.y > doc.page.height - 100) {
      doc.addPage()
    }
    doc.text(`• ${content}`, {
      indent: 10,
      align: 'left',
      width: doc.page.width - 110, // Account for indent
    })
    doc.moveDown(0.5) // Add half-line spacing between bullets
  })

  doc.moveDown()
}

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
      mdToPdf({ content: reportData.report_markdown }, { dest: pdfPath })

      // Pipe the PDF to a write stream
    //   doc.pipe(fs.createWriteStream(pdfPath))

      resolve(pdfPath)
    } catch (error) {
      reject(error instanceof Error ? error : new Error(error))
    }
  })
}

export default generatePDF
