import Exertion from '../models/exertion.js'

export const createExertion = async (data) => {
  const exertion = await Exertion.create(data)

  return exertion
}

export const analyzeExertion = async () => {}
