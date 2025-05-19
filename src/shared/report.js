/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

/* Load environment variables into Node.js process */
dotenv.config()

// Create the prompt template for the exoskeleton analysis
export const createExoskeletonPromptTemplate = (parser) => {
  const template = PromptTemplate.fromTemplate(`
    You are a decision-support analyst.

    Process:
    
    1. Normalize Subjective Inputs (0–1)
       • TLX items: divide each 0–20 value by 20  
       • Discomfort: divide each 0–10 value by 10  
       • Exertion: map 6–20 → (value – 6) / 14  
       • Balance: divide each 0–10 value by 10  
       • Usability: map 1–5 → (value – 1) / 4  
       • Situational Awareness: map 1–7 → (value – 1) / 6  
    
       Save results as "subjective_norm".
    
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
  
    7. Generate a full report in Markdown format with the following structure:
       # Exoskeleton Use Report
       
       A short paragraph stating the Unified NetScore and interpreting whether it indicates net benefit or risk, and identifying the top facilitator and top barrier in plain English.
       
       A Markdown table with columns:
       Criterion | Facilitator (Fi) | Barrier (Bi) | Weight
       One row per criterion.
       
       Add analysis highlights and recommendations.
  
    8. Prepare chart data for visualization:
       Create array of facilitators with name, value, and weight.
       Create array of barriers with name, value, and weight.
  
       ---
    Return ONLY a valid JSON object with the following top-level keys:

        
    - "subjective_norm": {{
        "cognitive_load": {{
          "mental_demand": number,
          "physical_demand": number,
          "temporal_demand": number,
          "performance": number,
          "effort": number,
          "frustration": number,
        }},
        "discomfort": {{
          "hand_wrist": number,
          "upper_arm": number,
          "shoulder": number,
          "lower_back": number,
          "thigh": number,
          "neck": number,
          "lower_leg_foot": number,
        }},
        "exertion": number,
        "balance": number,
        "situational_awareness": {{
          "instability_of_situation": number,
          "complexity_of_situation": number,
          "variability_of_situation": number,
          "arousal": number,
          "concentration_of_attention": number,
          "division_of_attention": number,
          "spare_mental_capacity": number,
          "information_quantity": number,
          "familiarity_with_situation": number,
        }},
        "usability": {{
          "ease_of_use": number,
          "comfort": number,
          "ease_of_learning": number,
        }},
      }},
      "objective_metrics": {{
        "cognitive_load_psd": number,
        "fall_risk_pressure": number,
        "muscle_activity": number,
        "range_of_motion": number,
        "exertion_ppg_eda": number,
      }},
      "facilitators": {{
        "physical_exertion_reduction": number,
        "light_cognitive_load": number,
        "stability": number,
        "compatibility": number,
        "comfort": number,
        "productivity": number,
        "usability": number,
      }},
      "barriers": {{
        "overexertion": number,
        "psychological_risk": number,
        "increased_fall_risk": number,
        "incompatibility": number,
        "discomfort": number,
        "usability_concern": number,
      }},
      "criteria_weights": {{
        "physical_exertion_reduction": number,
        "light_cognitive_load": number,
        "stability": number,
        "compatibility": number,
        "comfort": number,
        "productivity": number,
        "usability": number,
        "overexertion": number,
        "psychological_risk": number,
        "increased_fall_risk": number,
        "incompatibility": number,
        "discomfort": number,
        "usability_concern": number,
      }},
      "netscore": number,
      "report_markdown": string,
      "chart_data": {{
        "facilitators_chart": [
          {{
            "name": string,
            "value": number,
            "weight": number,
          }},
        ],
        "barriers_chart": [
            {{
                "name": string,
                "value": number,
                "weight": number,
            }},
        ],
      }},
    }}
    
    Input data:
    {input_data}
  
    
    `)

  // ${parser.getFormatInstructions()}
  //   return new PromptTemplate({
  //     template,
  //     inputVariables: ['input_data'],
  //     partialVariables: { format_instructions: parser.getFormatInstructions() },
  //   })
  return template
}

export const createExoskeletonOutputParser = () => {
  return StructuredOutputParser.fromZodSchema(
    z.object({
      subjective_norm: z.object({
        cognitive_load: z.object({
          mental_demand: z.number(),
          physical_demand: z.number(),
          temporal_demand: z.number(),
          performance: z.number(),
          effort: z.number(),
          frustration: z.number(),
        }),
        discomfort: z.object({
          hand_wrist: z.number(),
          upper_arm: z.number(),
          shoulder: z.number(),
          lower_back: z.number(),
          thigh: z.number(),
          neck: z.number(),
          lower_leg_foot: z.number(),
        }),
        exertion: z.number(),
        balance: z.number(),
        situational_awareness: z.object({
          instability_of_situation: z.number(),
          complexity_of_situation: z.number(),
          variability_of_situation: z.number(),
          arousal: z.number(),
          concentration_of_attention: z.number(),
          division_of_attention: z.number(),
          spare_mental_capacity: z.number(),
          information_quantity: z.number(),
          familiarity_with_situation: z.number(),
        }),
        usability: z.object({
          ease_of_use: z.number(),
          comfort: z.number(),
          ease_of_learning: z.number(),
        }),
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
      chart_data: z.object({
        facilitators_chart: z.array(
          z.object({
            name: z.string(),
            value: z.number(),
            weight: z.number(),
          }),
        ),
        barriers_chart: z.array(
          z.object({
            name: z.string(),
            value: z.number(),
            weight: z.number(),
          }),
        ),
      }),
    }),
  )
}

const report = {
  createExoskeletonPromptTemplate,
  createExoskeletonOutputParser,
}

export default report
