import { usability } from '../shared/validations.js'
import logger from './customLogger.js'

// Helper function to fix null values in the parsed data
function fixNullValues(data) {
  const fixed = JSON.parse(JSON.stringify(data))
  const { discomfort, cognitive_load: cognitiveLoad } = fixed
  const { raw_scores: rawScores, categories: discomfortCategories } = discomfort
  const { raw_scores: cognitiveLoadRawScores, categories: cognitiveLoadCategories } = cognitiveLoad

  // Fix discomfort null values
  if (discomfort && rawScores) {
    Object.keys(rawScores).forEach((key) => {
      if (rawScores[key] === null) {
        rawScores[key] = 0
      }
    })
  }

  if (discomfort && discomfortCategories) {
    Object.keys(discomfortCategories).forEach((key) => {
      if (discomfortCategories[key] === null) {
        discomfortCategories[key] = 'Low'
      }
    })
  }

  // Fix cognitive load null values (if any)
  if (cognitiveLoad && cognitiveLoadRawScores) {
    Object.keys(cognitiveLoadRawScores).forEach((key) => {
      if (cognitiveLoadRawScores[key] === null) {
        cognitiveLoadRawScores[key] = 0
      }
    })
  }

  if (cognitiveLoad && cognitiveLoadCategories) {
    Object.keys(cognitiveLoadCategories).forEach((key) => {
      if (cognitiveLoadCategories[key] === null) {
        cognitiveLoadCategories[key] = 'Low'
      }
    })
  }

  return fixed
}

/*
 * Function to parse the output from the LLM
 * This function is called when the output from the LLM is not in the expected format
 * and needs to be manually parsed
 * It attempts to extract the JSON data from the LLM output and fix any null values
 * in the parsed data
 */
const errorParser = async (error) => {
  // Enhanced error handling with fallback parsing
  if (error.name === 'OutputParserException' && error.llmOutput) {
    logger.info('Attempting manual parsing of LLM output...')

    try {
      // Extract JSON from the output
      let jsonString = error.llmOutput

      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.substring(jsonString.indexOf('```json') + 7)
        jsonString = jsonString.substring(0, jsonString.lastIndexOf('```'))
      }

      const parsedData = JSON.parse(jsonString)

      // Fix null values in the parsed data
      const fixedData = fixNullValues(parsedData)

      logger.info('Successfully parsed and fixed data manually')
      return fixedData
    } catch (parseError) {
      logger.error('Manual parsing also failed:', parseError)
    }
  }

  throw error
}

export const inputParser = (inputData) => {
  const {
    totalAverageDiscomfort,
    totalAverageUsability,
    totalAverageSituationalAwareness,
    totalAverageExertion,
    totalAverageBalance,
    totalAverageCognitiveWorkload,
    totalAverageDiscomfortByField,
    totalAverageUsabilityByField,
    totalAverageCognitiveWorkloadByField,
    totalAverageSituationalAwarenessByField,
    exoID,
  } = JSON.parse(inputData)

  return {
    discomfort: {
      hand_and_waist: totalAverageDiscomfortByField?.avgHandAndWaist,
      upper_arm: totalAverageDiscomfortByField?.avgUpperArm,
      shoulder: totalAverageDiscomfortByField?.avgShoulder,
      lower_back: totalAverageDiscomfortByField?.avgLowerBack,
      thigh: totalAverageDiscomfortByField?.avgThigh,
      neck: totalAverageDiscomfortByField?.avgNeck,
      lower_leg_and_foot: totalAverageDiscomfortByField?.avgLowerLegAndFoot,
      totalAverage: totalAverageDiscomfort,
    },
    usability: {
      don_and_doff: totalAverageUsabilityByField?.avgDonAndDoff,
      adjust_fitting: totalAverageUsabilityByField?.avgAdjustFitting,
      works_as_expected: totalAverageUsabilityByField?.avgWorksAsExpected,
      meets_need: totalAverageUsabilityByField?.avgMeetsNeed,
      accomplish_task: totalAverageUsabilityByField?.avgAccomplishTask,
      without_assistance: totalAverageUsabilityByField?.avgWithoutAssistance,
      work_with: totalAverageUsabilityByField?.avgWorkWith,
      restricts_movement: totalAverageUsabilityByField?.avgRestrictsMovement,
      interfere_with_environment: totalAverageUsabilityByField?.avgInterfereWithEnvironment,
      satisfaction: totalAverageUsabilityByField?.avgSatisfaction,
      need_to_learn: totalAverageUsabilityByField?.avgNeedToLearn,
      easily_learn_to_assemble: totalAverageUsabilityByField?.avgEasilyLearnToAssemble,
      easily_learn_to_adjust: totalAverageUsabilityByField?.avgEasilyLearnToAdjust,
      easily_learn_checks: totalAverageUsabilityByField?.avgEasilyLearnChecks,
      remember_how_to_use: totalAverageUsabilityByField?.avgRememberHowToUse,
      use_again_without_assistance: totalAverageUsabilityByField?.avgUseAgainWithoutAssistance,
      totalAverage: totalAverageUsability,
    },
    cognitive_load: {
      mental_demand: totalAverageCognitiveWorkloadByField?.avgMentalDemand,
      physical_demand: totalAverageCognitiveWorkloadByField?.avgPhysicalDemand,
      temporal_demand: totalAverageCognitiveWorkloadByField?.avgTemporalDemand,
      performance: totalAverageCognitiveWorkloadByField?.avgPerformance,
      effort: totalAverageCognitiveWorkloadByField?.avgEffort,
      frustration: totalAverageCognitiveWorkloadByField?.avgFrustration,
      totalAverage: totalAverageCognitiveWorkload,
    },
    situational_awareness: {
      instability_of_situation: totalAverageSituationalAwarenessByField?.avgInstabilityOfSituation,
      complexity_of_situation: totalAverageSituationalAwarenessByField?.avgComplexityOfSituation,
      variability_of_situation: totalAverageSituationalAwarenessByField?.avgVariabilityOfSituation,
      arousal: totalAverageSituationalAwarenessByField?.avgArousal,
      concentration_of_attention:
        totalAverageSituationalAwarenessByField?.avgConcentrationOfAttention,
      division_of_attention: totalAverageSituationalAwarenessByField?.avgDivisionOfAttention,
      spare_mental_capacity: totalAverageSituationalAwarenessByField?.avgSpareMentalCapacity,
      information_quantity: totalAverageSituationalAwarenessByField?.avgInformationQuantity,
      familiarity_with_situation:
        totalAverageSituationalAwarenessByField?.avgFamiliarityWithSituation,
      totalAverage: totalAverageSituationalAwareness,
    },
    exertion: totalAverageExertion,
    balance: totalAverageBalance,
    exoID,
  }
}

export default errorParser
