// import { csv2json } from 'json-2-csv'
// import Fili from 'fili'
import Exertion from '../models/exertion.js'
import logger from '../utils/customLogger.js'

export const createExertion = async (data) => {
  const { sessionID, exoID, ...rest } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }
  
  const exertion = await Exertion.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, sessionID, exoID } }, 
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return exertion
}

export const averageExertion = async (exoID) => {
  try {
    const result = await Exertion.aggregate([
      {
        $match: { exoID: exoID },
      },
      {
        $group: {
          _id: '$exoID', // group by exoID
          exoID: { $first: '$exoID' }, // include exoID in the result
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
