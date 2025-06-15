/* eslint-disable consistent-return */

import { createBalance } from '../service/balance.js'
import { createCognitiveWorkload } from '../service/cognitiveWorkload.js'
import { createDiscomfort } from '../service/discomfort.js'
import { createExertion } from '../service/exertion.js'
import { createSituationalAwareness } from '../service/situationAwareness.js'
// import processFallRiskData from '../service/fallRisk.js'
// import { Measure } from '../shared/constants.js'
import { createUsability, getUsability } from '../service/usability.js'

export const createDiscomfortController = async (req, res, next) => {
  try {
    await createDiscomfort({
      sessionID: req.sessionID,
      ...req.body
    })

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
    await createCognitiveWorkload({
      sessionID: req.sessionID,
      ...req.body
    })

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
    await createExertion({
      sessionID: req.sessionID,
      ...req.body
    })

    return res.status(200).send({
      status: 'success',
      message: 'Exertion recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const createBalanceController = async (req, res, next) => {
  try {
    await createBalance({
      sessionID: req.sessionID,
      ...req.body
    })

    return res.status(200).send({
      status: 'success',
      message: 'Balance recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const createSituationalAwarenessController = async (req, res, next) => {
  try {
    await createSituationalAwareness({
      sessionID: req.sessionID,
      ...req.body
    })

    return res.status(200).send({
      status: 'success',
      message: 'Situational awareness recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const createUsabilityController = async (req, res, next) => {
  try {

    await createUsability({
      sessionID: req.sessionID,
      ...req.body
    })

    return res.status(200).send({
      status: 'success',
      message: 'Usability recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const getUsabilityController = async (req, res, next) => {
  try {
   const usablity = await getUsability({
      sessionID: req.sessionID,
      exoID: req.params.id
    })

    return res.status(200).send({
      status: 'success',
      message: 'usablity fetched successfully',
      data: usablity
    })
  } catch (error) {
    next(error)
  }
}
