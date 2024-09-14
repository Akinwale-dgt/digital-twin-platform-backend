import logger from '../utils/customLogger.js'

const calculateAverage = async (Model) => {
  try {
    const result = await Model.aggregate([
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
          averageTotal: { $avg: '$total' },
        },
      },
      {
        $group: {
          _id: null,
          averageOfAverages: { $avg: '$averageTotal' },
        },
      },
    ])
    return result[0]?.averageOfAverages || 0
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}

export default calculateAverage
