// import dwt from 'discrete-wavelets'
import CognitiveWorkload from '../models/cognitiveWorkload.js'
import logger from '../utils/customLogger.js'

export const createCognitiveWorkload = async (data) => {
  const { sessionID, exoID, ...rest } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }

  const cognitiveWorkload = await CognitiveWorkload.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, sessionID, exoID } }, 
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return cognitiveWorkload
}

export const averageCognitiveWorkload = async (exoID) => {
  try {
    const result = await CognitiveWorkload.aggregate([
      {
        $match: { exoID: exoID },
      },
      {
        $addFields: {
          total: {
            $sum: [
              '$mental_demand',
              '$physical_demand',
              '$temporal_demand',
              '$performance',
              '$effort',
              '$frustration',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$exoID',
          exoID: { $first: '$exoID' },
          overallAverage: { $avg: '$total' },
        },
      },
    ])

    return result.length > 0 ? result[0]?.overallAverage : 0
  } catch (error) {
    logger.error('Error calculating average cognitive workload:', error)
    throw error
  }
}

export const averageCognitiveWorkloadByField = async (exoID) => {
  try {
    const result = await CognitiveWorkload.aggregate([
      {
        $match: { exoID: exoID },
      },
      {
        $group: {
          _id: '$exoID',
          exoID: { $first: '$exoID' },
          avgMentalDemand: { $avg: '$mental_demand' },
          avgPhysicalDemand: { $avg: '$physical_demand' },
          avgTemporalDemand: { $avg: '$temporal_demand' },
          avgPerformance: { $avg: '$performance' },
          avgEffort: { $avg: '$effort' },
          avgFrustration: { $avg: '$frustration' },
        },
      },
      {
        $project: {
          _id: 0,
          exoID: 1,
          avgMentalDemand: 1,
          avgPhysicalDemand: 1,
          avgTemporalDemand: 1,
          avgPerformance: 1,
          avgEffort: 1,
          avgFrustration: 1,
        },
      },
    ])

    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field for cognitive workload:', error)
    throw error
  }
}
