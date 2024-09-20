import Balance from '../models/balance.js'
import logger from '../utils/customLogger.js'

export const createBalance = async (data) => {
  const balance = await Balance.create(data)

  return balance
}

export const averageBalance = async () => {
  try {
    const result = await Balance.aggregate([
      {
        $group: {
          _id: null,
          averageRateOfBalance: { $avg: '$rate_of_balance' },
        },
      },
    ])

    const average = result.length > 0 ? result[0].averageRateOfBalance : 0
    return average
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}
