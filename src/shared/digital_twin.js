import dotenv from 'dotenv'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'
import { DIGITAL_TWIN_TEMPLATE } from './template.js'
import { balance, cognitiveLoad, discomfort, exertion } from './validations.js'

/* Load environment variables into Node.js process */
dotenv.config()

// Create the prompt template for the digital twin model
export const createDigitalTwinPromptTemplate = () => {
  return PromptTemplate.fromTemplate(DIGITAL_TWIN_TEMPLATE)
}

export const createDigitalTwinOutputParser = () => {
  return StructuredOutputParser.fromZodSchema(
    z.array(
      z.object({
        exoID: z.string().optional(), // Optional exoskeleton ID
        cognitive_load: z.object({
          raw_scores: cognitiveLoad,
          categories: z.object({
            mental_demand: z.enum(['Low', 'Medium', 'High']),
            physical_demand: z.enum(['Low', 'Medium', 'High']),
            temporal_demand: z.enum(['Low', 'Medium', 'High']),
            performance: z.enum(['Low', 'Medium', 'High']),
            effort: z.enum(['Low', 'Medium', 'High']),
            frustration: z.enum(['Low', 'Medium', 'High']),
          }),
          overall_score: z.number().min(0).max(120),
          overall_category: z.enum(['Low', 'Medium', 'High']),
        }),
        discomfort: z.object({
          raw_scores: discomfort,
          categories: z.object({
            hand_wrist: z.enum(['Low', 'Medium', 'High']),
            upper_arm: z.enum(['Low', 'Medium', 'High']),
            shoulder: z.enum(['Low', 'Medium', 'High']),
            lower_back: z.enum(['Low', 'Medium', 'High']),
            thigh: z.enum(['Low', 'Medium', 'High']),
            neck: z.enum(['Low', 'Medium', 'High']),
            lower_leg_foot: z.enum(['Low', 'Medium', 'High']),
          }),
        }),
        exertion: z.object({ raw_scores: exertion, categories: z.enum(['Low', 'Medium', 'High']) }),
        balance: z.object({ raw_scores: balance, categories: z.enum(['Low', 'Medium', 'High']) }),
      }),
    ),
  )
}

const report = {
  createDigitalTwinPromptTemplate,
  createDigitalTwinOutputParser,
}

export default report
