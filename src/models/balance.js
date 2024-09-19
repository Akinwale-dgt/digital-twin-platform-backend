import { Schema, model } from 'mongoose'

import { NumberEnum } from '../shared/constants.js'

const BalanceSchema = new Schema(
  {
    rate_of_balance: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },
  },
  { timestamps: true },
)

const Balance = model('Balance', BalanceSchema)

export default Balance
