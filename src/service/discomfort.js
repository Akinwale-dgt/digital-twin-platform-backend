import Discomfort from '../models/discomfort.js'

export const createDiscomfort = async (data) => {
  const discomfort = await Discomfort.create(data)

  return discomfort
}

export const analyzeDiscomfort = async () => {}
