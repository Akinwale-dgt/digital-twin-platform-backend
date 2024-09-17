import { Schema, model } from 'mongoose'

import { NumberEnum } from '../shared/constants.js'

const CognitiveWorkloadSchema = new Schema(
  {
    mental_demand: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    physical_demand: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    temporal_demand: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    performance: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    effort: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    frustration: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },
  },
  { timestamps: true },
)

const CognitiveWorkload = model('CognitiveWorkload', CognitiveWorkloadSchema)

export default CognitiveWorkload
