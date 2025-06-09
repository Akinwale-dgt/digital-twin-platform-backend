import { Schema, model } from 'mongoose'

import { SituationalAwarenessEnum } from '../shared/constants.js'

const SituationalAwarenessSchema = new Schema(
  {
    instability_of_situation: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    complexity_of_situation: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    variability_of_situation: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    arousal: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    concentration_of_attention: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    division_of_attention: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    spare_mental_capacity: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    information_quantity: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },

    familiarity_with_situation: {
      type: Number,
      enum: SituationalAwarenessEnum,
      required: true,
    },
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

const SituationalAwareness = model('SituationalAwareness', SituationalAwarenessSchema)

export default SituationalAwareness
