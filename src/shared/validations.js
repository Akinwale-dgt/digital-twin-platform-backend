import { z } from 'zod'

const boundedNumber = (min, max, description) =>
  z
    .preprocess((val) => Number(val), z.number().min(min).max(max))
    .describe(description || `Must be a number between ${min} and ${max}`)

const SHOULD_BE_BTW = 'should be a number between'
const IF_NOT_BTW_LIMIT = 'If the number is not between'
const COGNITIVE_LOAD_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 20. ${IF_NOT_BTW_LIMIT} 0 and 20, please return 1.`
const DISCOMFORT_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 10. ${IF_NOT_BTW_LIMIT} 0 and 10, please return 1.`
const EXERTION_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 20. ${IF_NOT_BTW_LIMIT} 0 and 20, please return 1.`
const BALANCE_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 10. ${IF_NOT_BTW_LIMIT} 0 and 10, please return 1.`
const SITUATIONAL_AWARENESS_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 7. ${IF_NOT_BTW_LIMIT} 0 and 7, please return 1.`
const USABILITY_SUFFIX_MESSAGE = `${SHOULD_BE_BTW} 0 and 5. ${IF_NOT_BTW_LIMIT} 0 and 5, please return 1.`

// Messages for cognitive load
const MENTAL_DEMAND_MESSAGE = `Mental demand of cognitive load, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`
const PHYSICAL_DEMAND_MESSAGE = `Physical demand of cognitive load, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`
const TEMPORAL_DEMAND_MESSAGE = `Temporal demand of cognitive load, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`
const PERFORMANCE_MESSAGE = `Performance metric of cognitive load, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`
const EFFORT_MESSAGE = `Effort involved in the task, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`
const FRUSTRATION_MESSAGE = `Level of frustration during the task, ${COGNITIVE_LOAD_SUFFIX_MESSAGE}`

// Messages for discomfort
const HAND_WRIST_MESSAGE = `Hand and wrist discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const UPPER_ARM_MESSAGE = `Upper arm discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const SHOULDER_MESSAGE = `Shoulder discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const LOWER_BACK_MESSAGE = `Lower back discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const THIGH_MESSAGE = `Thigh discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const NECK_MESSAGE = `Neck discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`
const LOWER_LEG_FOOT_MESSAGE = `Lower leg and foot discomfort, ${DISCOMFORT_SUFFIX_MESSAGE}`

const EXERTION_MESSAGE = `Exertion, ${EXERTION_SUFFIX_MESSAGE}`
const BALANCE_MESSAGE = `Balance, ${BALANCE_SUFFIX_MESSAGE}`

// Messages for situational awareness
const INSTABILITY_OF_SITUATION_MESSAGE = `Instability of situation, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const COMPLEXITY_OF_SITUATION_MESSAGE = `Complexity of situation, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const VARIABILITY_OF_SITUATION_MESSAGE = `Variability of situation, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const AROUSAL_MESSAGE = `Arousal, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const CONCENTRATION_OF_ATTENTION_MESSAGE = `Concentration of attention, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const DIVISION_OF_ATTENTION_MESSAGE = `Division of attention, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const SPARE_MENTAL_CAPACITY_MESSAGE = `Spare mental capacity, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const INFORMATION_QUANTITY_MESSAGE = `Information quantity, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`
const FAMILIARITY_WITH_SITUATION_MESSAGE = `Familiarity with situation, ${SITUATIONAL_AWARENESS_SUFFIX_MESSAGE}`

// Messages for usability
const EASE_OF_USE_MESSAGE = `Ease of use, ${USABILITY_SUFFIX_MESSAGE}`
const COMFORT_MESSAGE = `Comfort, ${USABILITY_SUFFIX_MESSAGE}`
const EASE_OF_LEARNING_MESSAGE = `Ease of learning, ${USABILITY_SUFFIX_MESSAGE}`

export const cognitiveLoad = z.object({
  mental_demand: boundedNumber(0, 20, MENTAL_DEMAND_MESSAGE),
  physical_demand: boundedNumber(0, 20, PHYSICAL_DEMAND_MESSAGE),
  temporal_demand: boundedNumber(0, 20, TEMPORAL_DEMAND_MESSAGE),
  performance: boundedNumber(0, 20, PERFORMANCE_MESSAGE),
  effort: boundedNumber(0, 20, EFFORT_MESSAGE),
  frustration: boundedNumber(0, 20, FRUSTRATION_MESSAGE),
})

export const discomfort = z.object({
  hand_wrist: boundedNumber(0, 10, HAND_WRIST_MESSAGE),
  upper_arm: boundedNumber(0, 10, UPPER_ARM_MESSAGE),
  shoulder: boundedNumber(0, 10, SHOULDER_MESSAGE),
  lower_back: boundedNumber(0, 10, LOWER_BACK_MESSAGE),
  thigh: boundedNumber(0, 10, THIGH_MESSAGE),
  neck: boundedNumber(0, 10, NECK_MESSAGE),
  lower_leg_foot: boundedNumber(0, 10, LOWER_LEG_FOOT_MESSAGE),
})

export const situationalAwareness = z.object({
  instability_of_situation: boundedNumber(0, 7, INSTABILITY_OF_SITUATION_MESSAGE),
  complexity_of_situation: boundedNumber(0, 7, COMPLEXITY_OF_SITUATION_MESSAGE),
  variability_of_situation: boundedNumber(0, 7, VARIABILITY_OF_SITUATION_MESSAGE),
  arousal: boundedNumber(0, 7, AROUSAL_MESSAGE),
  concentration_of_attention: boundedNumber(0, 7, CONCENTRATION_OF_ATTENTION_MESSAGE),
  division_of_attention: boundedNumber(0, 7, DIVISION_OF_ATTENTION_MESSAGE),
  spare_mental_capacity: boundedNumber(0, 7, SPARE_MENTAL_CAPACITY_MESSAGE),
  information_quantity: boundedNumber(0, 7, INFORMATION_QUANTITY_MESSAGE),
  familiarity_with_situation: boundedNumber(0, 7, FAMILIARITY_WITH_SITUATION_MESSAGE),
})

export const exertion = boundedNumber(0, 20, EXERTION_MESSAGE)

export const balance = boundedNumber(0, 10, BALANCE_MESSAGE)

export const usability = z.object({
  ease_of_use: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  comfort: boundedNumber(0, 5, COMFORT_MESSAGE),
  ease_of_learning: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  don_and_doff: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  adjust_fitting: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  works_as_expected: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  meets_need: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  accomplish_task: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  without_assistance: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  work_with: boundedNumber(0, 5, EASE_OF_USE_MESSAGE),
  restricts_movement: boundedNumber(0, 5, COMFORT_MESSAGE),
  interfere_with_environment: boundedNumber(0, 5, COMFORT_MESSAGE),
  satisfaction: boundedNumber(0, 5, COMFORT_MESSAGE),
  need_to_learn: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  easily_learn_to_assemble: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  easily_learn_to_adjust: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  easily_learn_checks: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  remember_how_to_use: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
  use_again_without_assistance: boundedNumber(0, 5, EASE_OF_LEARNING_MESSAGE),
})
