import Discomfort from '../models/discomfort.js'
import logger from '../utils/customLogger.js'

export const createDiscomfort = async (data) => {
  const { sessionID, exoID, ...rest } = data

  if (!sessionID) {
    throw new Error('sessionId is required')
  }

  const discomfort = await Discomfort.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, sessionID, exoID } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  )

  return discomfort
}

export const averageDiscomfort = async (exoID) => {
  try {
    const result = await Discomfort.aggregate([
      {
        $match: { exoID },
      },
      {
        $addFields: {
          fields: [
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
      {
        $addFields: {
          validFields: {
            $filter: {
              input: '$fields',
              cond: { $ne: ['$this', null] },
            },
          },
        },
      },
      {
        $addFields: {
          total: { $sum: '$validFields' },
          itemCount: { $size: '$validFields' },
          documentAverage: {
            $cond: [
              { $gt: [{ $size: '$validFields' }, 0] },
              { $divide: [{ $sum: '$validFields' }, { $size: '$validFields' }] },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: '$exoID',
          exoID: { $first: '$exoID' },
          overallAverage: { $avg: '$documentAverage' },
          totalSum: { $sum: '$total' },
          totalItemCount: { $sum: '$itemCount' },
        },
      },
    ])

    console.log(result)

    return result.length > 0 ? result[0]?.overallAverage : 0
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}

export const averageDiscomfortByField = async (exoID) => {
  try {
    const result = await Discomfort.aggregate([
      {
        $match: { exoID },
      },
      {
        $group: {
          _id: '$exoID',
          exoID: { $first: '$exoID' },
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
          exoID: 1,
          avgHandAndWaist: 1,
          avgUpperArm: 1,
          avgShoulder: 1,
          avgLowerBack: 1,
          avgThigh: 1,
          avgNeck: 1,
          avgLowerLegAndFoot: 1,
        },
      },
    ])

    console.log('averageDiscomfortByField')
    console.log(result)
  
    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field:', error)
    throw error
  }
}
