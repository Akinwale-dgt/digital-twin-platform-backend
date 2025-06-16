import Balance from '../models/balance.js'
import logger from '../utils/customLogger.js'

export const createBalance = async (data) => {
  const { sessionID, exoID, ...rest } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }

  const balance = await Balance.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, exoID, sessionID } }, 
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return balance
}

export const averageBalance = async (exoID) => {
  try {
    const result = await Balance.aggregate([
      {
        $match: { exoID },
      },
      {
        $group: {
          _id: '$exoID', // group by exoID
          exoID: { $first: '$exoID' }, // include exoID in the result
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
