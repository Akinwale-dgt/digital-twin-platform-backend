/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

import { fileURLToPath } from 'url'

// Get the directory name equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const match = (reportData, title) => {
  // return (
  //   reportData.report_markdown.match(
  //     /\*\*\s*Analysis Highlights and Recommendations\s*:?\*\*\s*\n([\s\S]+?)(?=\n\*\*|\n\n\*\*|\n#{1,6}\s|$)/,
  //   ) ||
  //   reportData.report_markdown.match(
  //     /#{2,3}\s*Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n#{1,6}\s|\n\n#{1,6}\s|$)/,
  //   ) ||
  //   reportData.report_markdown.match(
  //     /Analysis Highlights and Recommendations\s*:?\s*\n([\s\S]+?)(?=\n[A-Z]|\n\n[A-Z]|$)/,
  //   )
  // )

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
    // Then try hashtag headers: ## or ### Title
    reportData.report_markdown.match(
      new RegExp(
        `#{2,3}\\s*${escapedTitle}\\s+([\\s\\S]+?)(?=\\n#{1,6}\\s|\\n\\n#{1,6}\\s|$)`,
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
  if (contexts && contexts[1]) {
    doc.fontSize(16)
    doc.text(title, 50, doc.y, {
      underline: true,
      align: 'left',
      continued: false,
    })

    // Move down and explicitly position the content
    doc.fontSize(12)
    doc.y += 30 // Add space after header
    doc.x = 50 // Ensure we're at left margin

    // Add the content with explicit left margin and width
    doc.text(contexts[1].trim(), 50, doc.y, {
      align: 'left',
      width: doc.page.width - 100, // Leave margin on both sides
    })

    doc.moveDown()
  }
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
      const doc = new PDFDocument({ margin: 50 })

      // Pipe the PDF to a write stream
      doc.pipe(fs.createWriteStream(pdfPath))

      // Add title
      doc.fontSize(24).text('Exoskeleton Use Report', { align: 'center' })
      doc.moveDown()

      // Add NetScore and summary
      doc.fontSize(16).text('Analysis Summary', { underline: true })
      doc.moveDown()
      doc.fontSize(12).text(`Unified NetScore: ${reportData.netscore.toFixed(3)}`)
      doc.moveDown()

      // Extract summary from the markdown report (first paragraph after title)
      // const summaryMatch = reportData.report_markdown.match(
      //   /# Exoskeleton Use Report\s+([\s\S]+?)(?=\n##|\n\n##|$)/,
      // )

      // if (summaryMatch && summaryMatch[1]) {
      //   doc.text(summaryMatch[1].trim())
      // }
      // doc.moveDown()

      // Extract just the narrative part before any table or section headers
      const narrativeMatch = reportData.report_markdown.match(
        /# Exoskeleton Use Report\s+([\s\S]+?)(?=\||\n##|\n\n##|$)/,
      )
      if (narrativeMatch && narrativeMatch[1]) {
        // Clean up the extracted text - remove any table remnants
        let narrativeText = narrativeMatch[1].trim()

        // Remove any lines that look like table headers or separators
        narrativeText = narrativeText
          .split('\n')
          .filter((line) => {
            const trimmedLine = line.trim()
            // Filter out table-like lines
            return (
              !trimmedLine.includes('|') &&
              !trimmedLine.includes('---') &&
              !trimmedLine.startsWith('Criterion') &&
              trimmedLine.length > 0
            )
          })
          .join(' ')
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim()

        // Only add if there's meaningful narrative content
        if (narrativeText && narrativeText.length > 50) {
          doc.text(narrativeText)
        }
      }
      doc.moveDown()

      // Add Facilitators vs Barriers Table
      doc.fontSize(16).text('Facilitators vs Barriers', { underline: true })
      doc.moveDown()

      // Table header
      const tableTop = doc.y
      const tableLeft = 50
      const colWidth = 130 // 120

      doc.fontSize(10).text('Criterion', tableLeft, tableTop)
      doc.text('Facilitator (Fi)', tableLeft + colWidth, tableTop)
      doc.text('Barrier (Bi)', tableLeft + colWidth * 2, tableTop)
      doc.text('Weight', tableLeft + colWidth * 3, tableTop)

      doc
        .moveTo(tableLeft, tableTop + 15)
        .lineTo(tableLeft + colWidth * 4, tableTop + 15)
        .stroke()

      let rowTop = tableTop + 20

      // Add facilitator rows
      Object.keys(reportData.facilitators).forEach((key, index) => {
        const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
        const value = reportData.facilitators[key].toFixed(3)
        const weight = reportData.criteria_weights[key].toFixed(3)

        doc.text(readableKey, tableLeft, rowTop)
        doc.text(value, tableLeft + colWidth, rowTop)
        doc.text('-', tableLeft + colWidth * 2, rowTop)
        doc.text(weight, tableLeft + colWidth * 3, rowTop)

        rowTop += 20

        // Add a new page if we're near the bottom
        if (rowTop > doc.page.height - 100) {
          doc.addPage()
          rowTop = 50
        }
      })

      // Add barrier rows
      Object.keys(reportData.barriers).forEach((key, index) => {
        const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
        const value = reportData.barriers[key].toFixed(3)
        const weight = reportData.criteria_weights[key].toFixed(3)

        doc.text(readableKey, tableLeft, rowTop)
        doc.text('-', tableLeft + colWidth, rowTop)
        doc.text(value, tableLeft + colWidth * 2, rowTop)
        doc.text(weight, tableLeft + colWidth * 3, rowTop)

        rowTop += 20

        // Add a new page if we're near the bottom
        if (rowTop > doc.page.height - 100) {
          doc.addPage()
          rowTop = 50
        }
      })

      doc.moveDown(2)

      // Reset cursor position for the next section
      const currentRowTop = rowTop > doc.page.height - 100 ? 50 : rowTop
      // let currentRowTop = tableTop + 20
      doc.y = currentRowTop + 30 // Set cursor position after table
      // doc.y = tableTop // Set cursor position after table
      doc.x = 50 // Reset to left margin
      doc.fontSize(12) // Reset font size
      // Add Recommendations section if it exists in the markdown
      // const recommendationsMatch = reportData.report_markdown.match(
      //   /#{2,3}\s*Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n#{1,6}\s|\n\n#{1,6}\s|$)/,
      // )
      // Try bold format first: **Analysis Highlights and Recommendations:**
      const recommendationsMatch =
        reportData.report_markdown.match(
          /\*\*\s*Analysis Highlights and Recommendations\s*:?\*\*\s*\n([\s\S]+?)(?=\n\*\*|\n\n\*\*|\n#{1,6}\s|$)/,
        ) ||
        reportData.report_markdown.match(
          /#{2,3}\s*Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n#{1,6}\s|\n\n#{1,6}\s|$)/,
        ) ||
        reportData.report_markdown.match(
          /Analysis Highlights and Recommendations\s*:?\s*\n([\s\S]+?)(?=\n[A-Z]|\n\n[A-Z]|$)/,
        )
      // reportData.report_markdown.match(
      //   /### Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n##|\n\n##|$)/,
      // ) ||
      // reportData.report_markdown.match(
      //   /## Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n##|\n\n##|$)/,
      // ) ||
      // reportData.report_markdown.match(
      //   /\** Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n**|\n\n**|$)/,
      // )
      if (recommendationsMatch && recommendationsMatch[1]) {
        // doc.moveTo(0, currentRowTop + 30)

        // doc
        //   .fontSize(16)
        //   .text('Analysis Highlights and Recommendations', { underline: true, align: 'start' })
        // doc.fontSize(12).text(recommendationsMatch[1].trim())
        // doc.moveDown()

        doc.fontSize(16)
        doc.text('Analysis Highlights and Recommendations', 50, doc.y, {
          underline: true,
          align: 'left',
          continued: false,
        })

        // Move down and explicitly position the content
        doc.fontSize(12)
        doc.y += 30 // Add space after header
        doc.x = 50 // Ensure we're at left margin

        // Add the content with explicit left margin and width
        doc.text(recommendationsMatch[1].trim(), 50, doc.y, {
          align: 'left',
          width: doc.page.width - 100, // Leave margin on both sides
        })
      } else {
        const analysisMatch = match(reportData, 'Analysis Highlights')
        addSubject(doc, analysisMatch, 'Analysis Highlights')

        const recommendsMatch = match(reportData, 'Recommendations')
        addSubject(doc, recommendsMatch, 'Recommendations')
      }
      // Some reports have "##" instead of "###"
      // This is a workaround to match both cases
      // const orRecommendationsMatch = reportData.report_markdown.match(
      //   /## Analysis Highlights and Recommendations\s+([\s\S]+?)(?=\n##|\n\n##|$)/,
      // )
      // if (orRecommendationsMatch && orRecommendationsMatch[1]) {
      //   doc
      //     .fontSize(16)
      //     .text('Analysis Highlights and Recommendations', { underline: true, align: 'start' })
      //   doc.fontSize(12).text(orRecommendationsMatch[1].trim())
      //   doc.moveDown()
      // }

      // Add chart placeholder text
      doc.addPage()
      doc.fontSize(16).text('Visualizations', { underline: true, align: 'center' })
      doc.moveDown()
      doc
        .fontSize(12)
        .text('Please refer to the online dashboard for interactive visualizations of this data.', {
          align: 'center',
        })

      // Add raw data reference
      doc.moveDown(2)
      doc.fontSize(10).text(`Report ID: ${reportId}`, { align: 'center' })
      doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })

      // Finalize the PDF
      doc.end()

      resolve(pdfPath)
    } catch (error) {
      reject(error)
    }
  })
}

export default generatePDF
