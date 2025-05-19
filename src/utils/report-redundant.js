/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable import/no-extraneous-dependencies */
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
      subjective: z.object({
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
        situational_awareness: situationalAwareness,
        usability,
      }),
    }),
  )

  //  "{input} \n\n Please analyze the following text and return the cognitive load, discomfort, exertion, and balance in JSON format. The JSON should contain the following keys: cognitive_load, discomfort, exertion, and balance. The values should be numbers between 0 and 20 for cognitive_load and balance, and between 0 and 10 for discomfort. If the number is not between the specified range, please return '0'.",

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(`
        Input:
        {input}
        
        You are a decision-support analyst.
        
        Process:
        
        1. Normalize Subjective Inputs (0–1)
           • TLX items: divide each 0–20 value by 20  
           • Discomfort: divide each 0–10 value by 10  
           • Exertion: map 6–20 → (value – 6) / 14  
           • Balance: divide each 0–10 value by 10  
           • Usability: map 1–5 → (value – 1) / 4  
           • Situational Awareness: map 1–7 → (value – 1) / 6  
        
           Save results as “subjective_norm”.
        
        2. Infer & Normalize Objective Metrics (0–1) from subjective_norm:
           – cognitive_load_psd  
           – fall_risk_pressure  
           – muscle_activity  
           – range_of_motion  
           – exertion_ppg_eda  
        
        3. Compute Facilitator Vector Fi:
           physical_exertion_reduction = 1 – muscle_activity  
           light_cognitive_load        = 1 – cognitive_load_psd  
           stability                   = 1 – fall_risk_pressure  
           compatibility               = range_of_motion  
           comfort                     = 1 – mean(subjective_norm.discomfort.*)  
           productivity                = subjective_norm.cognitive_load.performance  
           usability                   = mean(subjective_norm.usability.*)  
        
        4. Compute Barrier Vector Bi:
           overexertion       = muscle_activity  
           psychological_risk = cognitive_load_psd  
           increased_fall_risk= fall_risk_pressure  
           incompatibility    = 1 – range_of_motion  
           discomfort         = mean(subjective_norm.discomfort.*)  
           usability_concern  = 1 – mean(subjective_norm.usability.*)  
        
        5. Entropy-Method Weights:
           Compute weight w_j for each of the 13 criteria (7 Fi + 6 Bi) using the entropy method.
        
        6. Unified NetScore:
           NetScore = sum(all Fi values) – sum(all Bi values), i.e., ∑ w_i·Fi – ∑ w_j·Bj 
        
        Output JSON (return only this):
        {
          "subjective_norm": { … },
          "objective_metrics": {
            "cognitive_load_psd": …,
            "fall_risk_pressure": …,
            "muscle_activity": …,
            "range_of_motion": …,
            "exertion_ppg_eda": …
          },
          "facilitators": {
            "physical_exertion_reduction": …,
            "light_cognitive_load": …,
            "stability": …,
            "compatibility": …,
            "comfort": …,
            "productivity": …,
            "usability": …
          },
          "barriers": {
            "overexertion": …,
            "psychological_risk": …,
            "increased_fall_risk": …,
            "incompatibility": …,
            "discomfort": …,
            "usability_concern": …
          },
          "criteria_weights": {
            "physical_exertion_reduction": w1,
            "light_cognitive_load": w2,
            "stability": w3,
            "compatibility": w4,
            "comfort": w5,
            "productivity": w6,
            "usability": w7,
            "overexertion": w8,
            "psychological_risk": w9,
            "increased_fall_risk": w10,
            "incompatibility": w11,
            "discomfort": w12,
            "usability_concern": w13
          },
          "netscore": <NetScore = sum(all Fi) – sum(all Bi)>
        }

        Generate a full report in Markdown:

        Title:
        # Exoskeleton Use Report
        
        Narrative Summary:
        A short paragraph stating the Unified NetScore and interpreting whether it indicates net benefit or risk, and identifying the top facilitator and top barrier in plain English.
        
        Facilitator vs Barrier Table:
        A Markdown table with columns:
        Criterion | Facilitator (Fi) | Barrier (Bi) | Weight
        One row per criterion.
        
        Provide a chart for visualization
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

export const cognitiveLoad = z.object({
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

export const discomfort = z.object({
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

export const situationalAwareness = z.object({
  instability_of_situation: boundedNumber(
    1,
    7,
    'Instability of situation, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  complexity_of_situation: boundedNumber(
    1,
    7,
    'Complexity of situation, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  variability_of_situation: boundedNumber(
    1,
    7,
    'Variability of situation, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  arousal: boundedNumber(
    1,
    7,
    'Arousal, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  concentration_of_attention: boundedNumber(
    1,
    7,
    'Concentration of attention, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  division_of_attention: boundedNumber(
    1,
    7,
    'Division of attention, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  spare_mental_capacity: boundedNumber(
    1,
    7,
    'Spare mental capacity, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  information_quantity: boundedNumber(
    1,
    7,
    'Information quantity, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
  familiarity_with_situation: boundedNumber(
    1,
    7,
    'Familiarity with the situation, should be a number between 1 and 7. If the number is not between 1 and 7, please return "1".',
  ),
})

export const usability = z.object({
  ease_of_use: {
    don_and_doff: z.number().describe("can easily don (put on) and doff (take off) the exoskeleton"),
    adjust_fitting: z.number().describe("easily adjust the exoskeleton to my fitting"),
    works_as_expected: z.number().describe("works the way I want it to work"),
    meets_need: z.number().describe("meets my needs for completing the task"),
    accomplish_task: z.number().describe("makes the task I want to accomplish easier to get done"),
    without_assistance: z.number().describe("can use this exoskeleton without assistance"),
    work_with: z.number().describe("prefer working with it than without it"),
  },
  ease_of_learning: {
    need_to_learn: z.number().describe("needed to learn a lot of things before I could get going with this exoskeleton"),
    easily_learn_to_assemble: z.number().describe("could easily learn how to assemble the different parts of the exoskeleton"),
    easily_learn_to_adjust: z.number().describe("could easily learn how to adjust the fitting of the exoskeleton"),
    easily_learn_checks: z.number().describe("could easily learn different checks required to understand the fitting of this exoskeleton"),
    remember_how_to_use: z.number().describe("can easily remember how to use it"),
    use_again_without_assistance: z.number().describe("can use this exoskeleton again without the assistance of any technical personnel"),
  },
  comfort: {
    restricts_movement: z.number().describe("The exoskeleton restricts my movement"),
    interfere_with_environment: z.number().describe("The exoskeleton was interfering with my work environment"),
    satisfaction: z.number().describe("I am satisfied with using the exoskeleton"),
  },
  // ease_of_use: boundedNumber(
  //   1,
  //   5,
  //   'Ease of use, should be a number between 1 and 5. If the number is not between 1 and 5, please return "1".',
  // ),
  // ease_of_learning: boundedNumber(
  //   1,
  //   5,
  //   'Ease of learning, should be a number between 1 and 5. If the number is not between 1 and 5, please return "1".',
  // ),
  // comfort: boundedNumber(
  //   1,
  //   5,
  //   'Comfort, should be a number between 1 and 5. If the number is not between 1 and 5, please return "1".',
  // ),
})
