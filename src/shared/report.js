/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import { REPORT_TEMPLATE } from './template.js'
import {
  cognitiveLoad,
  discomfort,
  exertion,
  balance,
  situationalAwareness,
  usability,
} from './validations.js'

/* Load environment variables into Node.js process */
dotenv.config()

// Create the prompt template for the exoskeleton analysis
export const createExoskeletonPromptTemplate = () => {
  return PromptTemplate.fromTemplate(REPORT_TEMPLATE)
}

export const createExoskeletonOutputParser = () => {
  return StructuredOutputParser.fromZodSchema(
    z.object({
      subjective_norm: z.object({
        cognitive_load: cognitiveLoad,
        discomfort,
        exertion,
        balance,
        situational_awareness: situationalAwareness,
        usability,
      }),
      objective_metrics: z.object({
        cognitive_load_psd: z.number(),
        fall_risk_pressure: z.number(),
        muscle_activity: z.number(),
        range_of_motion: z.number(),
        exertion_ppg_eda: z.number(),
      }),
      facilitators: z.object({
        physical_exertion_reduction: z.number(),
        light_cognitive_load: z.number(),
        stability: z.number(),
        compatibility: z.number(),
        comfort: z.number(),
        productivity: z.number(),
        usability: z.number(),
      }),
      barriers: z.object({
        overexertion: z.number(),
        psychological_risk: z.number(),
        increased_fall_risk: z.number(),
        incompatibility: z.number(),
        discomfort: z.number(),
        usability_concern: z.number(),
      }),
      criteria_weights: z.object({
        physical_exertion_reduction: z.number(),
        light_cognitive_load: z.number(),
        stability: z.number(),
        compatibility: z.number(),
        comfort: z.number(),
        productivity: z.number(),
        usability: z.number(),
        overexertion: z.number(),
        psychological_risk: z.number(),
        increased_fall_risk: z.number(),
        incompatibility: z.number(),
        discomfort: z.number(),
        usability_concern: z.number(),
      }),
      netscore: z.number(),
      report_markdown: z.string(),
    }),
  )
}

const report = {
  createExoskeletonPromptTemplate,
  createExoskeletonOutputParser,
}

export default report
