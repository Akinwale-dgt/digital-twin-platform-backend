import { Schema, model } from 'mongoose'

import { RateOfExertionEnum } from '../shared/constants.js'

const ExertionSchema = new Schema(
  {
    rate_of_exertion: {
      type: Number,
      enum: RateOfExertionEnum,
      required: true,
    },
  },
  { timestamps: true },
)

const Exertion = model('Exertion', ExertionSchema)

export default Exertion
