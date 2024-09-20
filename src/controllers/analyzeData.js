/* eslint-disable consistent-return */
import { averageBalance } from '../service/balance.js'
import { averageCognitiveWorkload } from '../service/cognitiveWorkload.js'
import { averageDiscomfort } from '../service/discomfort.js'
import { averageExertion } from '../service/exertion.js'
import { averageSituationalAwareness } from '../service/situationAwareness.js'

export const analyzeSubjectiveData = async (req, res, next) => {
  try {
    const totalAverageDiscomfort = await averageDiscomfort()
    const totalAverageSituationalAwareness = await averageSituationalAwareness()
    const totalAverageExertion = await averageExertion()
    const totalAverageBalance = await averageBalance()
    const totalAverageCognitiveWorkload = await averageCognitiveWorkload()

    const totalAverage =
      Number(
        totalAverageBalance +
          totalAverageCognitiveWorkload +
          totalAverageDiscomfort +
          totalAverageExertion +
          totalAverageSituationalAwareness,
        +totalAverageBalance,
      ) / 5

    const data = {
      totalAverageDiscomfort,
      totalAverageSituationalAwareness,
      totalAverageExertion,
      totalAverageCognitiveWorkload,
      totalAverageBalance,
      totalAverage,
    }

    return res.status(200).send({
      status: 'success',
      message: 'Subjective data analyzed successfully',
      data,
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
