export const REPORT_TEMPLATE = `
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

       Start by providing the normalized rating of the subjective inputs.

       Next, provide the inferred and normalized objective metrics.

       Next, Provide the facilitators and barriers with their entropy weight and show how the net weight (i.e., the unified score)
       A Markdown table with columns:
       Criterion | Facilitator (Fi) | Barrier (Bi) | Weight
       One row per criterion.

       Next, Prepare A short note explaining the analysis from the subjective analysis results to the Unified NetScore of Benefit-Risk analysis and identifying the top facilitator and top barrier.

       Add analysis highlights and recommendations.
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
    }}
    
    Input:
    {input}
`

export const DIGITAL_TWIN_TEMPLATE = `
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
            "upper_arm": number,
            "shoulder": number,
            "lower_back": number,
            "thigh": number,
            "neck": number,
            "lower_leg_foot": number
        }},
        "categories": {{
            "hand_wrist": "Low" | "Medium" | "High",
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
    DO NOT use null values - always provide valid numbers and categories.

    Input:
    {input}
`
