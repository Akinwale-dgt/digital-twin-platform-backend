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
