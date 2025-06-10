import Usability from '../models/usability.js'
import logger from '../utils/customLogger.js'

export const createUsability = async (data) => {
  const { sessionID, exoID, ...rest } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }


  const usability = await Usability.findOneAndUpdate(
    { sessionID, exoID },
    { $set: { ...rest, exoID, sessionID } }, 
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return usability
}

export const getUsability = async (data) => {
  const { sessionID, exoID } = data;

  if (!sessionID) {
    throw new Error('sessionId is required');
  }

  const discomfort = await Usability.findOne(
    { sessionID, exoID}
  );

  return discomfort;
};


export const averageUsability = async () => {
  try {
    const result = await Usability.aggregate([
      {
        $addFields: {
          total: {
            $sum: [
              '$ease_of_use.don_and_doff',
              '$ease_of_use.adjust_fitting',
              '$ease_of_use.works_as_expected',
              '$ease_of_use.meets_need',
              '$ease_of_use.accomplish_task',
              '$ease_of_use.without_assistance',
              '$ease_of_use.work_with',
              '$comfort.restricts_movement',
              '$comfort.interfere_with_environment',
              '$comfort.satisfaction',
              '$ease_of_learning.need_to_learn',
              '$ease_of_learning.easily_learn_to_assemble',
              '$ease_of_learning.easily_learn_to_adjust',
              '$ease_of_learning.easily_learn_checks',
              '$ease_of_learning.remember_how_to_use',
              '$ease_of_learning.use_again_without_assistance',
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

export const averageUsabilityByField = async () => {
  try {
    const result = await Usability.aggregate([
      {
        $group: {
          _id: null,
          avgDonAndDoff: { $avg: '$ease_of_use.don_and_doff' },
          avgAdjustFitting: { $avg: '$ease_of_use.adjust_fitting' },
          avgWorksAsExpected: { $avg: '$ease_of_use.works_as_expected' },
          avgMeetsNeed: { $avg: '$ease_of_use.meets_need' },
          avgAccomplishTask: { $avg: '$ease_of_use.accomplish_task' },
          avgWithoutAssistance: { $avg: '$ease_of_use.without_assistance' },
          avgWorkWith: { $avg: '$ease_of_use.work_with' },
          avgRestrictsMovement: { $avg: '$comfort.restricts_movement' },
          avgInterfereWithEnvironment: { $avg: '$comfort.interfere_with_environment' },
          avgSatisfaction: { $avg: '$comfort.satisfaction' },
          avgNeedToLearn: { $avg: '$ease_of_learning.need_to_learn' },
          avgEasilyLearnToAssemble: { $avg: '$ease_of_learning.easily_learn_to_assemble' },
          avgEasilyLearnToAdjust: { $avg: '$ease_of_learning.easily_learn_to_adjust' },
          avgEasilyLearnChecks: { $avg: '$ease_of_learning.easily_learn_checks' },
          avgRememberHowToUse: { $avg: '$ease_of_learning.remember_how_to_use' },
          avgUseAgainWithoutAssistance: { $avg: '$ease_of_learning.use_again_without_assistance' },
        },
      },
      {
        $project: {
          _id: 0,
          avgDonAndDoff: 1,
          avgAdjustFitting: 1,
          avgWorksAsExpected: 1,
          avgMeetsNeed: 1,
          avgAccomplishTask: 1,
          avgWithoutAssistance: 1,
          avgWorkWith: 1,
          avgRestrictsMovement: 1,
          avgInterfereWithEnvironment: 1,
          avgSatisfaction: 1,
          avgNeedToLearn: 1,
          avgEasilyLearnToAssemble: 1,
          avgEasilyLearnToAdjust: 1,
          avgEasilyLearnChecks: 1,
          avgRememberHowToUse: 1,
          avgUseAgainWithoutAssistance: 1,
        },
      },
    ])
    return result.length > 0 ? result[0] : {}
  } catch (error) {
    logger.error('Error calculating averages by field for usability:', error)
    throw error
  }
}
