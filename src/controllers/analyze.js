import { reportGenerationQueue } from '../job/report.js'
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
import { analyze } from '../service/analysis.js'
// import { averageBalance } from '../service/balance.js'

export const analyzeDataController = async (req, res, next) => {
  try {
    // const { userId, inputData } = req.body

    const totalAverageDiscomfort = await averageDiscomfort()
    const totalAverageSituationalAwareness = await averageSituationalAwareness()
    const totalAverageExertion = await averageExertion()
    const totalAverageBalance = await averageBalance()
    const totalAverageCognitiveWorkload = await averageCognitiveWorkload()

    const totalAverageDiscomfortByField = await averageDiscomfortByField()
    const totalAverageCognitiveWorkloadByField = await averageCognitiveWorkloadByField()
    const totalAverageSituationalAwarenessByField = await averageSituationalAwarenessByField()

    const totalAveragePercentDiscomfort = (totalAverageDiscomfort / 70) * 100
    const totalAveragePercentBalance = (totalAverageBalance / 10) * 100
    const totalAveragePercentExertion = (totalAverageExertion / 20) * 100
    const totalAveragePercentCognitiveWorkload = (totalAverageCognitiveWorkload / 120) * 100
    const totalAveragePercentSituationalAwareness = (totalAverageSituationalAwareness / 63) * 100

    const weightedSumRating =
      (totalAveragePercentBalance +
        totalAveragePercentCognitiveWorkload +
        totalAveragePercentExertion +
        totalAveragePercentDiscomfort +
        totalAveragePercentSituationalAwareness) /
      5

    const inputData = {
      discomfort: {
        hand_and_wait: totalAverageDiscomfortByField?.avgHandAndWaist,
        upper_arm: totalAverageDiscomfortByField?.avgUpperArm,
        shoulder: totalAverageDiscomfortByField?.avgShoulder,
        lower_back: totalAverageDiscomfortByField?.avgLowerBack,
        thigh: totalAverageDiscomfortByField?.avgThigh,
        neck: totalAverageDiscomfortByField?.avgNeck,
        lower_leg_and_foot: totalAverageDiscomfortByField?.avgLowerLegAndFoot,
        totalAverage: totalAverageDiscomfort,
      },
      cognitive_load: {
        mental_demand: totalAverageCognitiveWorkloadByField?.avgMentalDemand,
        physical_demand: totalAverageCognitiveWorkloadByField?.avgPhysicalDemand,
        temporal_demand: totalAverageCognitiveWorkloadByField?.avgTemporalDemand,
        performance: totalAverageCognitiveWorkloadByField?.avgPerformance,
        effort: totalAverageCognitiveWorkloadByField?.avgEffort,
        frustration: totalAverageCognitiveWorkloadByField?.avgFrustration,
        totalAverage: totalAverageCognitiveWorkload,
      },
      situational_awareness: {
        instability_of_situation:
          totalAverageSituationalAwarenessByField?.avgInstabilityOfSituation,
        complexity_of_situation: totalAverageSituationalAwarenessByField?.avgComplexityOfSituation,
        variability_of_situation:
          totalAverageSituationalAwarenessByField?.avgVariabilityOfSituation,
        arousal: totalAverageSituationalAwarenessByField?.avgArousal,
        concentration_of_attention:
          totalAverageSituationalAwarenessByField?.avgConcentrationOfAttention,
        division_of_attention: totalAverageSituationalAwarenessByField?.avgDivisionOfAttention,
        spare_mental_capacity: totalAverageSituationalAwarenessByField?.avgSpareMentalCapacity,
        information_quantity: totalAverageSituationalAwarenessByField?.avgInformationQuantity,
        familiarity_with_situation:
          totalAverageSituationalAwarenessByField?.avgFamiliarityWithSituation,
        totalAverage: totalAverageSituationalAwareness,
      },
      usability: {
        ease_of_use: 3,
        comfort: 5,
        ease_of_learning: 4,
      },
      exertion: totalAverageExertion,
      // {
      // totalAverage: totalAverageExertion,
      // },
      balance: totalAverageBalance,
      // {
      //   totalAverage: totalAverageBalance,
      // },
      weightedSumRating,
    }

    console.log('Data Object:', inputData)

    // Validate input
    // if (!userId || !inputData) {
    //   return res.status(400).json({ error: 'Missing required fields' })
    // }

    // // Validate inputData structure
    // const requiredFields = [
    //   'cognitive_load',
    //   'discomfort',
    //   'exertion',
    //   'balance',
    //   'situational_awareness',
    //   'usability',
    // ]

    // for (const field of requiredFields) {
    //   if (!inputData[field]) {
    //     return res.status(400).json({ error: `Missing required field: ${field}` })
    //   }
    // }

    // Create a new report document
    const report = new Report({
      userId: 1,
      inputData,
      status: 'pending',
    })

    await report.save()



    const digitalTwin = await analyze(inputData)

    // Add the report generation job to the queue
    await reportGenerationQueue.add(
      {
        reportId: report._id,
        inputData,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    )

    // res.status(202).json({
    //   message: 'Report generation request accepted',
    //   reportId: report._id,
    //   status: report.status,
    // })

    return res.status(200).send({
      status: 'success',
      message: 'Subjective data analyzed successfully',
      data: {
        report: {
          reportId: report._id,
          status: report.status,
        },
        digital_twin: digitalTwin,
      },
    })
  } catch (error) {
    next(error)
  }
}
