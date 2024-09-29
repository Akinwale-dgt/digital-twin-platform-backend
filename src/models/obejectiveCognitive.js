import { Schema, model } from 'mongoose'

const ObjectiveCognitiveSchema = new Schema(
  {
    low: {
      type: Number,
      required: true,
    },

    medium: {
      type: Number,
      required: true,
    },

    high: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

const ObjectiveCognitive = model('ObjectionCognitive', ObjectiveCognitiveSchema)

export default ObjectiveCognitive
