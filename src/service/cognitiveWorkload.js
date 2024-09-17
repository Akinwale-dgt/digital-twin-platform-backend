import CognitiveWorkload from '../models/cognitiveWorkload.js'

export const createCognitiveWorkload = async (data) => {
  const cognitiveWorkload = await CognitiveWorkload.create(data)

  return cognitiveWorkload
}

export const analyzeCognitiveWorkload = async () => {}
