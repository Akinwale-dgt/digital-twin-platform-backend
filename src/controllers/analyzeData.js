/* eslint-disable consistent-return */
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

export const analyzeSubjectiveData = async (req, res, next) => {
  try {
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

    const dataObject = {
      discomfort: {
        average_hand_and_wait: totalAverageDiscomfortByField?.avgHandAndWaist,
        average_upper_arm: totalAverageDiscomfortByField?.avgUpperArm,
        average_shoulder: totalAverageDiscomfortByField?.avgShoulder,
        average_lower_back: totalAverageDiscomfortByField?.avgLowerBack,
        average_thigh: totalAverageDiscomfortByField?.avgThigh,
        average_neck: totalAverageDiscomfortByField?.avgNeck,
        average_lower_leg_and_foot: totalAverageDiscomfortByField?.avgLowerLegAndFoot,
        totalAverage: totalAverageDiscomfort,
      },
      cognitiveWorkload: {
        average_mental_demand: totalAverageCognitiveWorkloadByField?.avgMentalDemand,
        average_physical_demand: totalAverageCognitiveWorkloadByField?.avgPhysicalDemand,
        average_temporal_demand: totalAverageCognitiveWorkloadByField?.avgTemporalDemand,
        average_performance: totalAverageCognitiveWorkloadByField?.avgPerformance,
        average_effort: totalAverageCognitiveWorkloadByField?.avgEffort,
        average_frustration: totalAverageCognitiveWorkloadByField?.avgFrustration,
        totalAverage: totalAverageCognitiveWorkload,
      },
      situational_awareness: {
        average_instability_of_situation:
          totalAverageSituationalAwarenessByField?.avgInstabilityOfSituation,
        average_complexity_of_situation:
          totalAverageSituationalAwarenessByField?.avgComplexityOfSituation,
        average_variability_of_situation:
          totalAverageSituationalAwarenessByField?.avgVariabilityOfSituation,
        average_arousal: totalAverageSituationalAwarenessByField?.avgArousal,
        average_concentration_of_attention:
          totalAverageSituationalAwarenessByField?.avgConcentrationOfAttention,
        average_division_of_attention:
          totalAverageSituationalAwarenessByField?.avgDivisionOfAttention,
        average_spare_mental_capacity:
          totalAverageSituationalAwarenessByField?.avgSpareMentalCapacity,
        average_information_quantity:
          totalAverageSituationalAwarenessByField?.avgInformationQuantity,
        average_familiarity_with_situation:
          totalAverageSituationalAwarenessByField?.avgFamiliarityWithSituation,
        totalAverage: totalAverageSituationalAwareness,
      },
      exertion: {
        totalAverage: totalAverageExertion,
      },
      balance: {
        totalAverage: totalAverageBalance,
      },
      weightedSumRating,
    }

    return res.status(200).send({
      status: 'success',
      message: 'Subjective data analyzed successfully',
      data: dataObject,
    })
  } catch (error) {
    next(error)
  }
}

export const analyzeObjectiveData = async (req, res, next) => {
  try {
    return res.status(200).send({
      status: 'success',
      message: 'Objective data analyzed successfully',
    })
  } catch (error) {
    next(error)
  }
}
