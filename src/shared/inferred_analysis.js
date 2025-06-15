/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import { INFERRED_OBJ_TEMPLATE } from './template.js'

/* Load environment variables into Node.js process */
dotenv.config()

// Create the prompt template for the exoskeleton analysis
export const createInferredAnalysisPromptTemplate = () => {
  return PromptTemplate.fromTemplate(INFERRED_OBJ_TEMPLATE)
}

export const createInferredAnalysisOutputParser = () => {
  return StructuredOutputParser.fromZodSchema(
    z.array(
      z.object({
        exoID: z.string().optional(), // Optional exoskeleton ID
        metrics: z.object({
          cognitive_load_psd: z.number(),
          fall_risk_pressure: z.number(),
          muscle_activity: z.number(),
          range_of_motion: z.number(),
          exertion_ppg_eda: z.number(),
          usability: z.number(),
          performance: z.number(),
        }),
      }),
    ),
  )
}

const report = {
  createInferredAnalysisPromptTemplate,
  createInferredAnalysisOutputParser,
}

export default report
