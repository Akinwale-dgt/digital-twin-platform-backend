import { Schema, model } from 'mongoose'

const ObjectiveExertionSchema = new Schema(
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

const ObjectiveExertion = model('ObjectionExertion', ObjectiveExertionSchema)

export default ObjectiveExertion
