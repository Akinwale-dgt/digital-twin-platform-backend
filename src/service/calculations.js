/**
 * Report Analysis Data -->  [
  {
    exoID: '1',
    "metrics": {
      "cognitive_load_psd": number,
      "fall_risk_pressure": number,
      "muscle_activity": number,
      "range_of_motion": number,
      "exertion_ppg_eda": number,
      "usability": number,
      "performance": number,
    },
  },
  {
    exoID: '2',
    "metrics": {
      "cognitive_load_psd": number,
      "fall_risk_pressure": number,
      "muscle_activity": number,
      "range_of_motion": number,
      "exertion_ppg_eda": number,
      "usability": number,
      "performance": number,
    },
  },
  {
    exoID: '3',
    "metrics": {
      "cognitive_load_psd": number,
      "fall_risk_pressure": number,
      "muscle_activity": number,
      "range_of_motion": number,
      "exertion_ppg_eda": number,
      "usability": number,
      "performance": number,
    },
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
    transformedData: llmResult.map(({ metrics, exoID }) => ({
      exoID,
      reducedExertion: 1 - metrics.muscle_activity,
      lightCognitiveLoad: 1 - metrics.cognitive_load_psd,
      stability: 1 - metrics.fall_risk_pressure,
      compatibility: metrics.range_of_motion,
      easeOfUse: metrics.usability,
      productivity: 1 - metrics.performance,
      comfort: metrics.discomfort,
      reducedWMSDs: 1 - metrics.muscle_activity,
    })),
  }
}

export function renamedBasedOnCriteria(data) {
  return data.map((exo) => ({
    exoID: exo.exoID,
    C1: exo.reducedExertion,
    C2: exo.lightCognitiveLoad,
    C3: exo.stability,
    C4: exo.compatibility,
    C5: exo.easeOfUse,
    C6: exo.productivity,
    C7: exo.comfort,
    C8: exo.reducedWMSDs,
  }))
}

export function calculateCriterionSums(data) {
  const criteria = {
    C1: 'reducedExertion',
    C2: 'lightCognitiveLoad',
    C3: 'stability',
    C4: 'compatibility',
    C5: 'easeOfUse',
    C6: 'productivity',
    C7: 'comfort',
    C8: 'reducedWMSDs',
  }

  const sums = {}

  for (const [key, field] of Object.entries(criteria)) {
    sums[key] = data.reduce((acc, exo) => acc + (exo[field] ?? 0), 0)
  }

  return sums
}

export function createPairwise7x7Matrix(ratings) {
  const matrix = {}

  for (let i = 1; i <= 7; i++) {
    for (let j = 1; j <= 7; j++) {
      const key = `C${i}_C${j}`
      const inverseKey = `C${j}_C${i}`
      if (i === j) {
        matrix[key] = 1
      } else {
        matrix[key] = ratings[key] || 1 / ratings[inverseKey] || 0
      }
      const sumByKeyJ = `C${j}_sum_columns`
      matrix[sumByKeyJ] = matrix[key] + (matrix[sumByKeyJ] || 0)
    }
  }

  return matrix
}

export function calculateRowProducts(ratingsResults) {
  const rowProduct = {}

  for (let i = 1; i <= 7; i++) {
    const eachRowColumn = `C${i}_sum_rows`
    for (let j = 1; j <= 7; j++) {
      const key = `C${i}_C${j}`
      rowProduct[eachRowColumn] = (rowProduct[eachRowColumn] || 1) * ratingsResults[key]
    }
  }

  return rowProduct
}

export function calculatePriorityVectorsOfRowProducts(rowProduct) {
  const priorityVectors = {}

  for (let i = 1; i <= 7; i++) {
    const eachRowProduct = `C${i}_sum_rows`
    const eachVectorKey = `C${i}`
    priorityVectors[eachVectorKey] = rowProduct[eachRowProduct]**(1 / 7)
  }

  return priorityVectors
}


export function sumPriorityVectors(priorityVectors) {
  let totalVector = 0

  for (let i = 1; i <= 7; i++) {
    const eachVectorKey = `C${i}`
    totalVector += priorityVectors[eachVectorKey]
  }

  return totalVector
}


export function calculateWeightsOfPriorityVectors(priorityVectors, totalVector) {
  const weights = {}

  for (let i = 1; i <= 7; i++) {
    const eachVectorKey = `C${i}`
    weights[eachVectorKey] = priorityVectors[eachVectorKey] / totalVector
  }

  return weights
}


export function normalizeAndSumPairwise7x7Matrix(ratingsResults) {
  const matrix = {}

  for (let i = 1; i <= 7; i++) {
    const sumByKeyI = `C${i}_sum_rows`
    for (let j = 1; j <= 7; j++) {
      const key = `C${i}_C${j}`
      const sumByKeyJ = `C${j}_sum_columns`
      matrix[key] = ratingsResults[key] / ratingsResults[sumByKeyJ]
      matrix[sumByKeyI] = (matrix[sumByKeyI] || 0) + matrix[key]
    }
  }

  return matrix
}

export function calculateWeightsOfNormalizedSum(normalizedSumRatings) {
  const weight = {}

  for (let i = 1; i <= 7; i++) {
    const sumByKeyI = `C${i}_sum_rows`
    const keyI = `C${i}`
    weight[keyI] = normalizedSumRatings[sumByKeyI] / 7
  }

  return weight
}

export function scoreComputationData(data, weights) {
  return data.map((exo) => ({
    exoID: exo.exoID,
    C1: exo.reducedExertion * weights.C1,
    C2: exo.lightCognitiveLoad * weights.C2,
    C3: exo.stability * weights.C3,
    C4: exo.compatibility * weights.C4,
    C5: exo.easeOfUse * weights.C5,
    C6: exo.productivity * weights.C6,
    C7: exo.comfort * weights.C7,
    // C8: exo.reducedWMSDs / weights.C8,
  }))
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
    C8: exo.reducedWMSDs / criterionSums.C8,
  }))
}

export function calculateEntropyComponents(normalizedData) {
  return normalizedData.map((exo) => {
    const result = { exoID: exo.exoID }

    for (let i = 1; i <= 8; i++) {
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

  for (let i = 1; i <= 8; i++) {
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

  for (let i = 1; i <= 8; i++) {
    const key = `C${i}`
    divergence[key] = 1 - totalEntropy[key]
  }

  return divergence
}

export function calculateWeights(divergence) {
  const weight = {}
  const sumOfDivergence = Object.values(divergence).reduce((sum, val) => sum + val, 0)

  for (let i = 1; i <= 8; i++) {
    const key = `C${i}`
    weight[key] = divergence[key] / sumOfDivergence
  }

  return weight
}

// export function calculateFinalScores(normalizedData, weights) {
//   return normalizedData.map((exo) => {
//     let score = 0

//     for (let i = 1; i <= 8; i++) {
//       const key = `C${i}`
//       score += (exo[key] ?? 0) * (weights[key] ?? 0)
//     }

//     return {
//       exoID: exo.exoID,
//       score: parseFloat(score.toFixed(4)),
//     }
//   })
// }

export function buildReadableTable(criteriaValue, weights) {
  const criterionMap = {
    C1: 'reducedExertion',
    C2: 'lightCognitiveLoad',
    C3: 'stability',
    C4: 'compatibility',
    C5: 'easeOfUse',
    C6: 'productivity',
    C7: 'comfort',
    // C8: 'reducedWMSDs',
  }

  return criteriaValue.map((exo) => {
    const readable = { exoID: exo.exoID }
    let total = 0

    for (let i = 1; i <= 7; i++) {
      const key = `C${i}`
      const readableKey = criterionMap[key]
      const criterionValue = exo[key]
      const weightedValue = criterionValue * weights[key]

      // readable[readableKey] = parseFloat(criterionValue.toFixed(4))
      readable[readableKey] = parseFloat(weightedValue.toFixed(4))
      total += weightedValue
    }

    readable.totalBeforeRounding = total
    readable.finalScore = parseFloat(total.toFixed(4))

    return readable
  })
}
