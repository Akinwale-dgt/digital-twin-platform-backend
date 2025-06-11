/**
 * Report Analysis Data -->  [
  {
    exoID: '1',
    objective_metrics: {
      cognitive_load_psd: 0.5,
      fall_risk_pressure: 0.9,
      muscle_activity: 0.34,
      range_of_motion: 0.75,
      exertion_ppg_eda: 0.79
    },
    facilitators: {
      physical_exertion_reduction: 0.66,
      light_cognitive_load: 0.5,
      stability: 0.1,
      compatibility: 0.75,
      comfort: 0.66,
      productivity: 0.79,
      usability: 0.75
    }
  },
  {
    exoID: '2',
    objective_metrics: {
      cognitive_load_psd: 0.48,
      fall_risk_pressure: 0.9,
      muscle_activity: 0.34,
      range_of_motion: 0.75,
      exertion_ppg_eda: 0.79
    },
    facilitators: {
      physical_exertion_reduction: 0.66,
      light_cognitive_load: 0.52,
      stability: 0.1,
      compatibility: 0.75,
      comfort: 0.66,
      productivity: 0.79,
      usability: 0.75
    }
  },
  {
    exoID: '3',
    objective_metrics: {
      cognitive_load_psd: 0.48,
      fall_risk_pressure: 0.9,
      muscle_activity: 0.34,
      range_of_motion: 0.75,
      exertion_ppg_eda: 0.79
    },
    facilitators: {
      physical_exertion_reduction: 0.66,
      light_cognitive_load: 0.52,
      stability: 0.1,
      compatibility: 0.75,
      comfort: 0.66,
      productivity: 0.79,
      usability: 0.75
    }
  }
]


  TRANSFORMED DATA --->

    // [
    //   {
    //     "exoID": 1,
    //     "reducedExertion": 0.6,
    //     "lightCognitiveLoad": 0.7,
    //     "stability": 0.5,
    //     "compatibility": 0.8,
    //     "easeOfUse": 0.75,
    //     "productivity": 0.6,
    //     "comfort": 0.7
    //   },
    //   {
    //     "exoID": 2,
    //     "reducedExertion": 0.5,
    //     "lightCognitiveLoad": 0.6,
    //     "stability": 0.55,
    //     "compatibility": 0.85,
    //     "easeOfUse": 0.7,
    //     "productivity": 0.65,
    //     "comfort": 0.65
    //   },
    //   {
    //     "exoID": 3,
    //     "reducedExertion": 0.8,
    //     "lightCognitiveLoad": 0.65,
    //     "stability": 0.6,
    //     "compatibility": 0.78,
    //     "easeOfUse": 0.72,
    //     "productivity": 0.7,
    //     "comfort": 0.75
    //   }
    // ]

 * @param {*} llmResult 
 * @returns 
 */

export function serialiseLLMResult(llmResult) {
  // SAMPLE EXPECTED DATA FROM LLMS

  return {
    transformedData: llmResult.map(({ facilitators, exoID }) => ({
      exoID,
      reducedExertion: facilitators.physical_exertion_reduction,
      lightCognitiveLoad: facilitators.light_cognitive_load,
      stability: facilitators.stability,
      compatibility: facilitators.compatibility,
      easeOfUse: facilitators.usability,
      productivity: facilitators.productivity,
      comfort: facilitators.comfort,
    })),
  }
}

export function normalizationForReducedExersion() {}

export function calculateCriterionSums(data) {
  const criteria = {
    C1: 'reducedExertion',
    C2: 'lightCognitiveLoad',
    C3: 'stability',
    C4: 'compatibility',
    C5: 'easeOfUse',
    C6: 'productivity',
    C7: 'comfort',
  }

  const sums = {}

  for (const [key, field] of Object.entries(criteria)) {
    sums[key] = data.reduce((acc, exo) => acc + (exo[field] ?? 0), 0)
  }

  return sums
}

export function normalizeTransformedData(data, criterionSums) {
  return data.map((exo) => ({
    exoID: exo.exoID,
    C1: exo.reducedExertion / criterionSums.C1,
    C2: exo.lightCognitiveLoad / criterionSums.C2,
    C3: exo.stability / criterionSums.C3,
    C4: exo.compatibility / criterionSums.C4,
    C5: exo.easeOfUse / criterionSums.C5,
    C6: exo.productivity / criterionSums.C6,
    C7: exo.comfort / criterionSums.C7,
  }))
}

export function calculateEntropyComponents(normalizedData) {
  return normalizedData.map((exo) => {
    const result = { exoID: exo.exoID }

    for (let i = 1; i <= 7; i++) {
      const key = `C${i}`
      const value = exo[key]
      result[key] = value > 0 ? value * Math.log(value) : 0
    }

    return result
  })
}

export function calculateTotalEntropy(entropyComponents) {
  const K = 1 / Math.log(3)
  const result = {}

  for (let i = 1; i <= 7; i++) {
    const key = `C${i}`

    const sum = entropyComponents.reduce((acc, exo) => {
      const val = exo[key]
      return acc + (typeof val === 'number' ? val : 0)
    }, 0)

    result[key] = -K * sum
  }

  return result
}

export function calculateDivergence(totalEntropy) {
  const divergence = {}

  for (let i = 1; i <= 7; i++) {
    const key = `C${i}`
    divergence[key] = 1 - totalEntropy[key]
  }

  return divergence
}

export function calculateWeights(divergence) {
  const weight = {}
  const sumOfDivergence = Object.values(divergence).reduce((sum, val) => sum + val, 0)

  for (let i = 1; i <= 7; i++) {
    const key = `C${i}`
    weight[key] = divergence[key] / sumOfDivergence
  }

  return weight
}

export function calculateFinalScores(normalizedData, weights) {
  return normalizedData.map((exo) => {
    let score = 0

    for (let i = 1; i <= 7; i++) {
      const key = `C${i}`
      score += (exo[key] ?? 0) * (weights[key] ?? 0)
    }

    return {
      exoID: exo.exoID,
      score: parseFloat(score.toFixed(4)),
    }
  })
}

export function buildReadableTable(normalizedData, weights) {
  const criterionMap = {
    C1: 'reducedExertion',
    C2: 'lightCognitiveLoad',
    C3: 'stability',
    C4: 'compatibility',
    C5: 'easeOfUse',
    C6: 'productivity',
    C7: 'comfort',
  }

  return normalizedData.map((exo) => {
    const readable = { exoID: exo.exoID }
    let total = 0

    for (let i = 1; i <= 7; i++) {
      const key = `C${i}`
      const readableKey = criterionMap[key]
      const normalizedValue = exo[key]
      const weightedValue = normalizedValue * weights[key]

      readable[readableKey] = parseFloat(normalizedValue.toFixed(4))
      total += weightedValue
    }

    readable.totalBeforeRounding = total
    readable.finalScore = parseFloat(total.toFixed(4))

    return readable
  })
}
