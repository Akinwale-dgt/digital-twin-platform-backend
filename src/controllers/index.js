/* eslint-disable consistent-return */
import { createCognitiveWorkload } from '../service/cognitiveWorkload.js'
import { createDiscomfort } from '../service/discomfort.js'
import { createExertion } from '../service/exertion.js'

export const createDiscomfortController = async (req, res, next) => {
  try {
    await createDiscomfort(req.body)

    return res.status(200).send({
      status: 'success',
      message: 'Discomfort recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const createCognitiveWorkloadController = async (req, res, next) => {
  try {
    await createCognitiveWorkload(req.body)

    return res.status(200).send({
      status: 'success',
      message: 'Cognitive workload recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const createExertionController = async (req, res, next) => {
  try {
    await createExertion(req.body)

    return res.status(200).send({
      status: 'success',
      message: 'Exertion recorded',
    })
  } catch (error) {
    next(error)
  }
}
