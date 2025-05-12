import { OpenAI } from '@langchain/openai'
import dotenv from 'dotenv'
import { RunnableSequence } from '@langchain/core/runnables'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'

/* Load environment variables into Node.js process */
dotenv.config()

// const model = new ChatOpenAI({ model: 'gpt-4' })
const model = new OpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
})

export const analyze = async (text) => {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      cognitive_load: overall_cognitive_load,
      discomfort: overall_discomfort,
      exertion,
      balance,
    }),
  )
  //  "{input} \n\n Please analyze the following text and return the cognitive load, discomfort, exertion, and balance in JSON format. The JSON should contain the following keys: cognitive_load, discomfort, exertion, and balance. The values should be numbers between 0 and 20 for cognitive_load and balance, and between 0 and 10 for discomfort. If the number is not between the specified range, please return '0'.",

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `
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
        - "cognitive_load": {
            "raw_scores": <input values>,
            "categories": <Low/Medium/High per construct>,
            "overall_score": <sum of constructs>,
            "overall_category": <Low/Medium/High>
          }
        - "discomfort": {
            "raw_scores": <input values>,
            "categories": <Low/Medium/High per body part>
          }
        - "exertion": {
            "raw_scores": <input value>,
            "categories": <Low/Medium/High>
          }
        - "balance": {
            "raw_scores": <input value>,
            "categories": <Low/Medium/High>
          }
        
        DO NOT return any text or explanation outside this JSON.
        
        Input:
        {input}
      `,
    ),
    model,
    parser,
  ])
}

const boundedNumber = (min, max) => z.preprocess((val) => Number(val), z.number().min(min).max(max))

const overall_cognitive_load = z.object({
  mental_demand: z
    .string()
    .describe(
      "mental demand of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
  physical_demand: z
    .string()
    .describe(
      "physical demand of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
  temporal_demand: z
    .string()
    .describe(
      "temporal demand of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
  performance: z
    .string()
    .describe(
      "performance of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
  effort: z
    .string()
    .describe(
      "effort of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
  frustration: z
    .string()
    .describe(
      "frustration of the cognitive load, should be a number between 0 and 20. If the number is not between 0 and 20, please return '0'.",
    ),
})

const overall_discomfort = z.object({
  hand_wrist: z
    .string()
    .describe(
      "hand and wrist discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  chest: z
    .string()
    .describe(
      "chest discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  upper_arm: z
    .string()
    .describe(
      "upper arm discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  shoulder: z
    .string()
    .describe(
      "shoulder discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  lower_back: z
    .string()
    .describe(
      "lower back discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  thigh: z
    .string()
    .describe(
      "thigh discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  neck: z
    .string()
    .describe(
      "neck discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
  lower_leg_foot: z
    .string()
    .describe(
      "lower leg and foot discomfort, should be a number between 0 and 10. If the number is not between 0 and 10, please return '0'.",
    ),
})

const exertion = z.string.describe(
  'exertion, should be a number between 0 and 20. If the number is not between 0 and 20, please return "0".',
)

const balance = z.string.describe(
  'balance, should be a number between 0 and 10. If the number is not between 0 and 10, please return "0".',
)
