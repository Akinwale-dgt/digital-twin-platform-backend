import { ChatOpenAI } from '@langchain/openai'
import dotenv from 'dotenv'
import { RunnableSequence } from '@langchain/core/runnables'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

/* Load environment variables into Node.js process */
dotenv.config()

// const model = new ChatOpenAI({ model: 'gpt-4' })
const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

export const analyze = async (inputData) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      cognitive_load: z.object({
        raw_scores: overall_cognitive_load,
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
      // .refine((data) => {
      //   const { raw_scores } = data.cognitive_load
      //   const overall_score = Object.values(raw_scores).reduce((acc, score) => acc + score, 0)
      //   const overall_category =
      //     overall_score <= 33 ? 'Low' : overall_score <= 67 ? 'Medium' : 'High'
      //   return (
      //     data.cognitive_load.overall_score === overall_score &&
      //     data.cognitive_load.overall_category === overall_category
      //   )
      // }),
      discomfort: z.object({
        raw_scores: overall_discomfort,
        categories: z.object({
          hand_wrist: z.enum(['Low', 'Medium', 'High']),
          physical_demand: z.enum(['Low', 'Medium', 'High']),
          chest: z.enum(['Low', 'Medium', 'High']),
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
  )

  //  "{input} \n\n Please analyze the following text and return the cognitive load, discomfort, exertion, and balance in JSON format. The JSON should contain the following keys: cognitive_load, discomfort, exertion, and balance. The values should be numbers between 0 and 20 for cognitive_load and balance, and between 0 and 10 for discomfort. If the number is not between the specified range, please return '0'.",

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        Input:
        {input}
        
        You are a data-analysis assistant. 
        Classify each metric below based on the following rules:
        
        1. **Cognitive Load**  
           - Category for each construct (range 0–20):  
             • 0–7 → "Low"  
             • 8–13 → "Medium"  
             • 14–20 → "High"  
           - overall_score = sum of all six constructs (range 0–120)  
           - overall_category:  
             • 0–33 → "Low"  
             • 34–67 → "Medium"  
             • 68–100 → "High"  
        
        2. **Discomfort** (each body part, 0–10):  
           • 0–2 → "Low"  
           • 3–4 → "Medium"  
           • 5–10 → "High"  
        
        3. **Exertion** (0–20):  
           • 6–11 → "Low"  
           • 12–14 → "Medium"  
           • 15–20 → "High"  
        
        4. **Balance** (0–10):  
           • 0–2 → "Low"  
           • 3–4 → "Medium"  
           • 5–10 → "High"  
        
        ---
        
        Return ONLY a valid JSON object with the following top-level keys:
        - "cognitive_load": {{
            "raw_scores": {{
              "mental_demand": number,
              "physical_demand": number,
              "temporal_demand": number,
              "performance": number,
              "effort": number,
              "frustration": number
            }},
            "categories": {{
              "mental_demand": "Low" | "Medium" | "High",
              "physical_demand": "Low" | "Medium" | "High",
              "temporal_demand": "Low" | "Medium" | "High",
              "performance": "Low" | "Medium" | "High",
              "effort": "Low" | "Medium" | "High",
              "frustration": "Low" | "Medium" | "High"
            }},
            "overall_score": number,
            "overall_category": "Low" | "Medium" | "High"
          }}
        - "discomfort": {{
            "raw_scores": {{
              "hand_wrist": number,
              "physical_demand": number,
              "chest": number,
              "upper_arm": number,
              "shoulder": number,
              "lower_back": number,
              "thigh": number,
              "neck": number,
              "lower_leg_foot": number
            }},
            "categories": {{
              "hand_wrist": "Low" | "Medium" | "High",
              "physical_demand": "Low" | "Medium" | "High",
              "chest": "Low" | "Medium" | "High",
              "upper_arm": "Low" | "Medium" | "High",
              "shoulder": "Low" | "Medium" | "High",
              "lower_back": "Low" | "Medium" | "High",
              "thigh": "Low" | "Medium" | "High",
              "neck": "Low" | "Medium" | "High",
              "lower_leg_foot": "Low" | "Medium" | "High"
            }}
          }}
        - "exertion": {{
            "raw_scores": number,
            "categories": "Low" | "Medium" | "High"
          }}
        - "balance": {{
            "raw_scores": number,
            "categories": "Low" | "Medium" | "High"
          }}
        
        DO NOT return any text or explanation outside this JSON.
        `),
    model,
    parser,
  ])

  try {
    const result = await chain.invoke({ input: inputData })
    return result
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const boundedNumber = (min, max, description) =>
  z
    .preprocess((val) => Number(val), z.number().min(min).max(max))
    .describe(description || `Must be a number between ${min} and ${max}`)

export const overall_cognitive_load = z.object({
  mental_demand: boundedNumber(
    0,
    20,
    "Mental demand of cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
  physical_demand: boundedNumber(
    0,
    20,
    "Physical demand of cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
  temporal_demand: boundedNumber(
    0,
    20,
    "Temporal demand of cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
  performance: boundedNumber(
    0,
    20,
    "Performance metric of cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
  effort: boundedNumber(
    0,
    20,
    "Effort involved in the task, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
  frustration: boundedNumber(
    0,
    20,
    "Level of frustration during the task, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
  ),
})

export const overall_discomfort = z.object({
  hand_wrist: boundedNumber(
    0,
    10,
    "Hand and wrist discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  chest: boundedNumber(
    0,
    10,
    "Chest discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  upper_arm: boundedNumber(
    0,
    10,
    "Upper arm discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  shoulder: boundedNumber(
    0,
    10,
    "Shoulder discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  lower_back: boundedNumber(
    0,
    10,
    "Lower back discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  thigh: boundedNumber(
    0,
    10,
    "Thigh discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  neck: boundedNumber(
    0,
    10,
    "Neck discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
  lower_leg_foot: boundedNumber(
    0,
    10,
    "Lower leg and foot discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
  ),
})

export const exertion = boundedNumber(
  0,
  20,
  'Exertion, should be a number between 0 and 20. If the number is not between 0 and 20, please return "0".',
)

export const balance = boundedNumber(
  0,
  10,
  'Balance, should be a number between 0 and 10. If the number is not between 0 and 10, please return "0".',
)
