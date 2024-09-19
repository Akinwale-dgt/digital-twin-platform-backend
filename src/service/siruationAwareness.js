import SituationalAwareness from '../models/situationalAwareness.js'

export const createSituationalAwareness = async (data) => {
  const situationalAwareness = await SituationalAwareness.create(data)

  return situationalAwareness
}

export const analyzeSituationalAwareness = async () => {}
