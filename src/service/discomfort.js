import Discomfort from '../models/discomfort.js'
import logger from '../utils/customLogger.js'

export const createDiscomfort = async (data) => {
  const { sessionID, exoID, ...rest } = data;
  
  if (!sessionID) {
    throw new Error('sessionId is required');
  }

  const discomfort = await Discomfort.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, sessionID, exoID } }, 
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return discomfort;
};

export const getDiscomfort = async (data) => {
  const { sessionID, exoID } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }

  const discomfort = await Discomfort.findOne(
    { sessionID, exoID}
  );

  return discomfort;
};

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

export const averageDiscomfortByField = async () => {
  try {
    const result = await Discomfort.aggregate([
      {
        $group: {
          _id: null,
          avgHandAndWaist: { $avg: '$hand_and_waist' },
          avgUpperArm: { $avg: '$upper_arm' },
          avgShoulder: { $avg: '$shoulder' },
          avgLowerBack: { $avg: '$lower_back' },
          avgThigh: { $avg: '$thigh' },
          avgNeck: { $avg: '$neck' },
          avgLowerLegAndFoot: { $avg: '$lower_leg_and_foot' },
        },
      },
      {
        $project: {
          _id: 0,
          avgHandAndWaist: '$avgHandAndWaist',
          avgUpperArm: '$avgUpperArm',
          avgShoulder: '$avgShoulder',
          avgLowerBack: '$avgLowerBack',
          avgThigh: '$avgThigh',
          avgNeck: '$avgNeck',
          avgLowerLegAndFoot: '$avgLowerLegAndFoot',
        },
      },
    ])

    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field:', error)
    throw error
  }
}
