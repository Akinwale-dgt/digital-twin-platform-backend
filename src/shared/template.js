export const REPORT_TEMPLATE = `
    **System**  
    You are an expert human‐factors and construction‐ergonomics analyst, skilled at translating quantitative evaluations into clear, actionable recommendations for non‐technical stakeholders.

    **User**  
    I’m evaluating three wearable exoskeletons for a construction task. Below is the final output from my entropy‐based MCDA pipeline:

    Instruction

    Please generate a comprehensive comparative report that:

    Compares the three exoskeletons side‐by‐side in a table, highlighting the largest performance differentials.
    Ranks them in order of suitability for the tested construction‐task scenario.
    Summarizes the evaluation criteria and scoring method (entropy‐based MCDA).
    Describes each exoskeleton’s strengths and weaknesses across all criteria.
    Recommends which exoskeleton(s) stakeholders should choose, and under what specific conditions (e.g., if ease of use is paramount vs. comfort).

    Structure the report with clear section headings, bullet‐points for key takeaways, and a concise executive summary at the top.
    
    Input:
    {input}
`

export const INFERRED_OBJ_TEMPLATE = `
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
       – cognitive_load_psd  from TLX
       – fall_risk_pressure  from Balance
       – muscle_activity_EMG from Discomfort 
       – range_of_motion_IMU From Discomfort & Usability
       – exertion_ppg_eda    from exertion

       Save results as "objective_metrics".

    3. Compute Facilitator Vector Fi:
       physical_exertion_reduction = 1 – muscle_activity  
       light_cognitive_load        = 1 – cognitive_load_psd  
       stability                   = 1 – fall_risk_pressure  
       compatibility               = range_of_motion  
       comfort                     = 1 – mean(subjective_norm.discomfort.*)  
       productivity                = subjective_norm.cognitive_load.performance  
       usability                   = mean(subjective_norm.usability.*)  

    ---
    Return ONLY a valid JSON object with the following top-level keys:

        - [{{
                "exoID": string, // Optional exoskeleton ID
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
            }}]
    
    DO NOT return any text or explanation outside this JSON.
    DO NOT use null values - always provide valid numbers and categories.

    Input:
    {input}
`

export const DIGITAL_TWIN_TEMPLATE = `
    You are a data-analysis assistant. 
    Classify each metric below based on the following rules, the data is provided in the input which is an array of objects for each exoskeleton.:

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
    - [{{
        "exoID": string, // Optional exoskeleton ID
      "cognitive_load": {{
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
      "discomfort": {{
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
      "exertion": {{
        "raw_scores": number,
        "categories": "Low" | "Medium" | "High"
        }}
      "balance": {{
        "raw_scores": number,
        "categories": "Low" | "Medium" | "High"
        }}
    }}]
    
    DO NOT return any text or explanation outside this JSON.
    DO NOT use null values - always provide valid numbers and categories.

    Input:
    {input}
`
