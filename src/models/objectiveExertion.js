import { Schema, model } from 'mongoose'

const ObjectiveExertionSchema = new Schema(
  {
    low: {
      type: String,
      required: true,
    },

    medium: {
      type: String,
      required: true,
    },

    high: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const ObjectiveExertion = model('ObjectionExertion', ObjectiveExertionSchema)

export default ObjectiveExertion
