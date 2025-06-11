import { Schema, model } from 'mongoose'

import { UsabilityEnum } from '../shared/constants.js'

const EaseOfUseSchema = new Schema({
  don_and_doff: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  adjust_fitting: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  works_as_expected: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  meets_need: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  accomplish_task: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  without_assistance: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  work_with: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },
})

const ComfortSchema = new Schema({
  restricts_movement: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  interfere_with_environment: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  satisfaction: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },
})

const EaseOfLearningSchema = new Schema({
  need_to_learn: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  easily_learn_to_assemble: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  easily_learn_to_adjust: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  easily_learn_checks: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  remember_how_to_use: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },

  use_again_without_assistance: {
    type: Number,
    enum: UsabilityEnum,
    required: true,
  },
})

const UsabilitySchema = new Schema(
  {
    ease_of_use: EaseOfUseSchema,
    ease_of_learning: EaseOfLearningSchema,
    comfort: ComfortSchema,
    exoID: {
      type: Number
    },
    sessionID: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
)

const Usability = model('Usability', UsabilitySchema)

export default Usability
