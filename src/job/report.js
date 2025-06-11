import Bull from 'bull'
// import path from 'path'
// import { fileURLToPath } from 'url'
import Report from '../models/report.js'
// import generateReport from '../service/report.js'
import inferredAnalysis from '../service/inferredAnalysis.js'
// import generatePDF from '../utils/generatePdfV3.js'
import logger from '../utils/customLogger.js'
import { buildReadableTable, calculateCriterionSums, calculateDivergence, calculateEntropyComponents, calculateFinalScores, calculateTotalEntropy, calculateWeights, normalizeTransformedData, serialiseLLMResult } from '../service/calculations.js'

// Get the directory name equivalent for ES modules
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// Create a queue for background processing
const reportGenerationQueue = new Bull('report-generation', {
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

    // Inferred analysis data
    const inferredAnalysisData = await inferredAnalysis(inputData)
    console.log('Report Analysis Data --> ', inferredAnalysisData)

    const llmResult = serialiseLLMResult(inferredAnalysisData)


    console.log('LLM Result --> ', llmResult)


    const calculatedCriterion = calculateCriterionSums(llmResult.transformedData)

    console.log('Calculated Criterion --> ', calculatedCriterion)

    const normalizationCompletion = normalizeTransformedData(llmResult.transformedData, calculatedCriterion)

    console.log('Normalized Result --> ', normalizationCompletion)

    const entropyComponents = calculateEntropyComponents(normalizationCompletion)
    console.log('Entropy Result --> ', entropyComponents)

    // Step 4: Total entropy per criterion
    const totalEntropy = calculateTotalEntropy(entropyComponents)
    console.log('Total Entropy --> ', totalEntropy)

    const calculatedDivergence = calculateDivergence(totalEntropy)
    console.log('Total Divergence --> ', calculatedDivergence)

    const calculatedWeight = calculateWeights(calculatedDivergence)
    console.log('Calculated Weight --> ', calculatedWeight)

    const finalScore = calculateFinalScores(normalizationCompletion, calculatedWeight)
    console.log('Final Scores -->', finalScore)

    const readableTable = buildReadableTable(normalizationCompletion, calculatedWeight)
    console.log('Readable Table -->', readableTable)

    // Generate the report
    // const reportAnalysisData = await generateReport(inputData)
    // console.log('Report Analysis Data --> ', reportAnalysisData)
    // console.log('Report data:', reportData)

    // Generate PDF
    // const pdfPath = await generatePDF(reportData, reportId)

    // Store the relative path in the database
    // const relativePdfPath = path.relative(__dirname, pdfPath)

    // Update the report in the database
    await Report.findByIdAndUpdate(reportId, {
      status: 'completed',
      inferredAnalysis: inferredAnalysisData,
      // results: { report_markdown: reportData.content, id: reportData.id },
      // pdfPath: relativePdfPath,
    })

    return { reportId, status: 'completed' }
  } catch (error) {
    logger.error(`Error processing report ${reportId}:`)
    logger.error(error)

    // Update the report with error status
    await Report.findByIdAndUpdate(reportId, {
      status: 'failed',
      error: error.message,
    })

    throw error
  }
})

export default reportGenerationQueue
