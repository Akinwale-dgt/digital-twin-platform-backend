import SituationalAwareness from '../models/situationalAwareness.js'
import logger from '../utils/customLogger.js'

export const createSituationalAwareness = async (data) => {
  const situationalAwareness = await SituationalAwareness.create(data)

  return situationalAwareness
}

export const averageSituationalAwareness = async () => {
  try {
    const result = await SituationalAwareness.aggregate([
      {
        $addFields: {
          total: {
            $sum: [
              '$instability_of_situation',
              '$complexity_of_situation',
              '$variability_of_situation',
              '$arousal',
              '$concentration_of_attention',
              '$division_of_attention',
              '$spare_mental_capacity',
              '$information_quantity',
              '$familiarity_with_situation',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          overallAverage: { $avg: '$total' },
        },
      },
    ])
    return result.length > 0 ? result[0]?.overallAverage : 0
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}

export const averageSituationalAwarenessByField = async () => {
  try {
    const result = await SituationalAwareness.aggregate([
      {
        $group: {
          _id: null,
          avgInstabilityOfSituation: { $avg: '$instability_of_situation' },
          avgComplexityOfSituation: { $avg: '$complexity_of_situation' },
          avgVariabilityOfSituation: { $avg: '$variability_of_situation' },
          avgArousal: { $avg: '$arousal' },
          avgConcentrationOfAttention: { $avg: '$concentration_of_attention' },
          avgDivisionOfAttention: { $avg: '$division_of_attention' },
          avgSpareMentalCapacity: { $avg: '$spare_mental_capacity' },
          avgInformationQuantity: { $avg: '$information_quantity' },
          avgFamiliarityWithSituation: { $avg: '$familiarity_with_situation' },
        },
      },
      {
        $project: {
          _id: 0,
          avgInstabilityOfSituation: 1,
          avgComplexityOfSituation: 1,
          avgVariabilityOfSituation: 1,
          avgArousal: 1,
          avgConcentrationOfAttention: 1,
          avgDivisionOfAttention: 1,
          avgSpareMentalCapacity: 1,
          avgInformationQuantity: 1,
          avgFamiliarityWithSituation: 1,
        },
      },
    ])
    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field for situational awareness:', error)
    throw error
  }
}
