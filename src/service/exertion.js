import Exertion from '../models/exertion.js'
import logger from '../utils/customLogger.js'

export const createExertion = async (data) => {
  const exertion = await Exertion.create(data)

  return exertion
}

export const averageExertion = async () => {
  try {
    const result = await Exertion.aggregate([
      {
        $group: {
          _id: null,
          averageRateOfExertion: { $avg: '$rate_of_exertion' },
        },
      },
    ])

    const average = result.length > 0 ? result[0].averageRateOfExertion : 0
    return average
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}
