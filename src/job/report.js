import Bull from 'bull'
// import path from 'path'
// import { fileURLToPath } from 'url'
import Report from '../models/report.js'
import llmGenerateReport from '../service/report.js'
import llmInferredAnalysis from '../service/inferredAnalysis.js'
// import generatePDF from '../utils/generatePdfV3.js'
import logger from '../utils/customLogger.js'
import { buildReadableTable, calculateCriterionSums, calculateDivergence, calculateEntropyComponents, calculateFinalScores, calculateTotalEntropy, calculateWeights, normalizeTransformedData, renamedBasedOnCriteria, serialiseLLMResult } from '../service/calculations.js'

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
    const inferredAnalysisData = await llmInferredAnalysis(inputData)

    const llmResult = serialiseLLMResult(inferredAnalysisData)

    const calculatedCriterion = calculateCriterionSums(llmResult.transformedData)

    const normalizationCompletion = normalizeTransformedData(llmResult.transformedData, calculatedCriterion)

    const entropyComponents = calculateEntropyComponents(normalizationCompletion)
    // Step 4: Total entropy per criterion
    const totalEntropy = calculateTotalEntropy(entropyComponents)

    const calculatedDivergence = calculateDivergence(totalEntropy)

    const calculatedWeight = calculateWeights(calculatedDivergence)

    // const finalScore = calculateFinalScores(normalizationCompletion, calculatedWeight)

    const criteriaValue = renamedBasedOnCriteria(llmResult.transformedData)

    const readableTable = buildReadableTable(criteriaValue, calculatedWeight)

    // Generate the report
    const reportData = await llmGenerateReport(readableTable)

    // Update the report in the database
    await Report.findByIdAndUpdate(reportId, {
      status: 'completed',
      inferredAnalysis: inferredAnalysisData,
      results: { report_markdown: reportData.content, id: reportData.id },
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
