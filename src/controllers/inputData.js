/* eslint-disable consistent-return */
import httpError from 'http-errors'

import { createBalance } from '../service/balance.js'
import {
  createCognitiveWorkload,
  processCognitiveWorkloadData,
} from '../service/cognitiveWorkload.js'
import { createDiscomfort } from '../service/discomfort.js'
import { createExertion, processExertionData } from '../service/exertion.js'
import { createSituationalAwareness } from '../service/situationAwareness.js'
import processFallRiskData from '../service/fallRisk.js'
import { Measure } from '../shared/constants.js'
import { createUsability } from '../service/usability.js'

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

export const createBalanceController = async (req, res, next) => {
  try {
    await createBalance(req.body)

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
    await createSituationalAwareness(req.body)

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
    await createUsability(req.body)

    return res.status(200).send({
      status: 'success',
      message: 'Usability recorded',
    })
  } catch (error) {
    next(error)
  }
}

export const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) throw new httpError.BadRequest('No address file uploaded')

    if (
      req.file.mimetype !== 'text/csv' &&
      req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
      throw new httpError.BadRequest('File uploaded is not CSV or Excel')

    const data = req.file.buffer.toString()

    let processedData
    if (req.body.measure === Measure.cognitiveWorkload) {
      processedData = await processCognitiveWorkloadData(data.replace(/\r/g, ''))
    } else if (req.body.measure === Measure.fallRisk) {
      processedData = await processFallRiskData(data.replace(/\r/g, ''))
    } else if (req.body.measure === Measure.exertion) {
      processedData = await processExertionData(data.replace(/\r/g, ''))
    }

    return res.status(200).send({
      status: 'success',
      message: 'File uploaded successfully',
      data: processedData,
    })
  } catch (error) {
    next(error)
  }
}
