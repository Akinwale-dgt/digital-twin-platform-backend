import { Schema, model } from 'mongoose'

import NumberEnum from '../shared/constants.js'

const DiscomfortSchema = new Schema(
  {
    hand_and_waist: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    upper_arm: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    shoulder: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    lower_back: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    thigh: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    neck: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },

    lower_leg_and_foot: {
      type: Number,
      enum: NumberEnum,
      required: true,
    },
  },
  { timestamps: true },
)

const Discomfort = model('Discomfort', DiscomfortSchema)

export default Discomfort
