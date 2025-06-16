import SituationalAwareness from '../models/situationalAwareness.js'
import logger from '../utils/customLogger.js'

export const createSituationalAwareness = async (data) => {
  const { sessionID, exoID, ...rest } = data

  if (!sessionID) {
    throw new Error('sessionId is required')
  }

  const situationalAwareness = await SituationalAwareness.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, exoID, sessionID } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  )

  return situationalAwareness
}

export const averageSituationalAwareness = async (exoID) => {
  try {
    const result = await SituationalAwareness.aggregate([
      {
        $match: { exoID },
      },
      {
        $addFields: {
          fields: [
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

    return result.length > 0 ? result[0]?.overallAverage : 0
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}

export const averageSituationalAwarenessByField = async (exoID) => {
  try {
    const result = await SituationalAwareness.aggregate([
      {
        $match: { exoID },
      },
      {
        $group: {
          _id: null,
          avgInstabilityOfSituation: { $avg: '$instability_of_situation' },
          avgComplexityOfSituation: { $avg: '$complexity_of_situation' },
          avgVariabilityOfSituation: { $avg: '$variability_of_situation' },
          avgArousal: { $avg: '$arousal' },
          avgConcentrationOfAttention: { $avg: '$concentration_of_attention' },
          avgDivisionOfAttention: { $avg: '$division_of_attention' },
          avgSpareMentalCapacity: { $avg: '$spare_mental_capacity' },
          avgInformationQuantity: { $avg: '$information_quantity' },
          avgFamiliarityWithSituation: { $avg: '$familiarity_with_situation' },
        },
      },
      {
        $project: {
          _id: 0,
          avgInstabilityOfSituation: 1,
          avgComplexityOfSituation: 1,
          avgVariabilityOfSituation: 1,
          avgArousal: 1,
          avgConcentrationOfAttention: 1,
          avgDivisionOfAttention: 1,
          avgSpareMentalCapacity: 1,
          avgInformationQuantity: 1,
          avgFamiliarityWithSituation: 1,
        },
      },
    ])
    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field for situational awareness:', error)
    throw error
  }
}
