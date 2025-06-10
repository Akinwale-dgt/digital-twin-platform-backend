import { Schema, model } from 'mongoose'

const ReportSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    inputData: {
      type: [Object],
      required: true,
    },
    results: {
      type: Object,
      default: null,
    },
    pdfPath: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

// Update the updatedAt field on save
ReportSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Report = model('Report', ReportSchema)

export default Report;
