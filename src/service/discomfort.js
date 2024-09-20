import Discomfort from '../models/discomfort.js'
import logger from '../utils/customLogger.js'

export const createDiscomfort = async (data) => {
  const discomfort = await Discomfort.create(data)

  return discomfort
}

export const averageDiscomfort = async () => {
  try {
    const result = await Discomfort.aggregate([
      {
        $addFields: {
          total: {
            $sum: [
              '$hand_and_waist',
              '$upper_arm',
              '$shoulder',
              '$lower_back',
              '$thigh',
              '$neck',
              '$lower_leg_and_foot',
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
