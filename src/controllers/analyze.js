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

const analyzeDataController = async (req, res, next) => {
  try {
    const totalAverageDiscomfort = await averageDiscomfort()
    const totalAverageSituationalAwareness = await averageSituationalAwareness()
    const totalAverageExertion = await averageExertion()
    const totalAverageBalance = await averageBalance()
    const totalAverageCognitiveWorkload = await averageCognitiveWorkload()

    const totalAverageDiscomfortByField = await averageDiscomfortByField()
    const totalAverageCognitiveWorkloadByField = await averageCognitiveWorkloadByField()
    const totalAverageSituationalAwarenessByField = await averageSituationalAwarenessByField()

    const inputData = inputParser(
      JSON.stringify({
        totalAverageDiscomfort,
        totalAverageSituationalAwareness,
        totalAverageExertion,
        totalAverageBalance,
        totalAverageCognitiveWorkload,
        totalAverageDiscomfortByField,
        totalAverageCognitiveWorkloadByField,
        totalAverageSituationalAwarenessByField,
      }),
    )

    // Create a new report document
    const report = new Report({ userId: 1, inputData, status: 'pending' })

    await report.save()

    const digitalTwin = await generateDigitalTwinAnalysis(inputData)

    // Add the report generation job to the queue
    await reportGenerationQueue.add(
      { reportId: report._id, inputData },
      { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    )

    return res.status(200).send({
      status: 'success',
      message: 'Subjective data analyzed successfully',
      data: {
        report: { reportId: report._id, status: report.status },
        digital_twin: digitalTwin,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export default analyzeDataController
