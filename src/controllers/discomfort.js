/* eslint-disable consistent-return */
import { createDiscomfort } from '../service/discomfort.js'

const createDiscomfortController = async (req, res, next) => {
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

export default createDiscomfortController
