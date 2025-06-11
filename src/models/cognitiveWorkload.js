import { Schema, model } from 'mongoose'

import { CognitiveWorkloadEnum } from '../shared/constants.js'

const CognitiveWorkloadSchema = new Schema(
  {
    mental_demand: {
      type: Number,
      enum: CognitiveWorkloadEnum,
      required: true,
    },

    physical_demand: {
      type: Number,
      enum: CognitiveWorkloadEnum,
      required: true,
    },

    temporal_demand: {
      type: Number,
      enum: CognitiveWorkloadEnum,
      required: true,
    },

    performance: {
      type: Number,
      enum: CognitiveWorkloadEnum,
      required: true,
    },

    effort: {
      type: Number,
      enum: CognitiveWorkloadEnum,
      required: true,
    },

    frustration: {
      type: Number,
      enum: CognitiveWorkloadEnum,
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

const CognitiveWorkload = model('CognitiveWorkload', CognitiveWorkloadSchema)

export default CognitiveWorkload
