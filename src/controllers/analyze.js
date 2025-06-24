import reportGenerationQueue from '../job/report.js'
import Report from '../models/report.js'

import {
  averageCognitiveWorkload,
  averageCognitiveWorkloadByField,
} from '../service/cognitiveWorkload.js'
import { averageDiscomfort, averageDiscomfortByField } from '../service/discomfort.js'
import {
  averageSituationalAwareness,
  averageSituationalAwarenessByField,
} from '../service/situationAwareness.js'
import { averageExertion } from '../service/exertion.js'
import { averageBalance } from '../service/balance.js'
import generateDigitalTwinAnalysis from '../service/digitalTwin.js'
import { inputParser } from '../utils/parser.js'
import { averageUsability, averageUsabilityByField } from '../service/usability.js'

const analyzeDataController = async (req, res, next) => {
  try {
    const exoIDs = [1, 2, 3]

    const results = await Promise.all(
      exoIDs.map(async (exoID) => {
        const totalAverageDiscomfort = await averageDiscomfort(exoID)
        const totalAverageUsability = await averageUsability(exoID)
        const totalAverageSituationalAwareness = await averageSituationalAwareness(exoID)
        const totalAverageExertion = await averageExertion(exoID)
        const totalAverageBalance = await averageBalance(exoID)
        const totalAverageCognitiveWorkload = await averageCognitiveWorkload(exoID)

        const totalAverageDiscomfortByField = await averageDiscomfortByField(exoID)
        const totalAverageUsabilityByField = await averageUsabilityByField(exoID)
        const totalAverageCognitiveWorkloadByField = await averageCognitiveWorkloadByField(exoID)
        const totalAverageSituationalAwarenessByField = await averageSituationalAwarenessByField(exoID)

        const inputData = inputParser(
          JSON.stringify({
            exoID,
            totalAverageDiscomfort,
            totalAverageUsability,
            totalAverageSituationalAwareness,
            totalAverageExertion,
            totalAverageBalance,
            totalAverageCognitiveWorkload,
            totalAverageDiscomfortByField,
            totalAverageUsabilityByField,
            totalAverageCognitiveWorkloadByField,
            totalAverageSituationalAwarenessByField,
          }),
        )

        return inputData
      })
    )

    // Create a new report document
    const report = new Report({ userId: 1, inputData: results, status: 'pending' })

    await report.save()

    const digitalTwin = await generateDigitalTwinAnalysis(results)

    // // Add the report generation job to the queue
    await reportGenerationQueue.add(
      { reportId: report._id, inputData: results, ratings: req.body },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    )

    return res.status(200).send({
      status: 'success',
      message: 'Subjective data analyzed successfully',
      data: {
        data: "Please refactor based on data you want to pass to frontend",
        report: { reportId: report._id, status: report.status },
        digital_twin: digitalTwin,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export default analyzeDataController
