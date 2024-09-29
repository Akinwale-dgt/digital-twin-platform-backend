import { Schema, model } from 'mongoose'

const FallRiskSchema = new Schema(
  {
    high: {
      type: Number,
      required: true,
    },

    low: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

const FallRisk = model('FallRisk', FallRiskSchema)

export default FallRisk
