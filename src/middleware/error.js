/* eslint-disable no-unused-vars */
import logger from '../utils/customLogger.js'

/** Global error handler */
export const globalErrorHandler = (err, req, res, next) => {
  /* Validation errors from express-validator */
  if (Array.isArray(err) && err[0]?.msg) {
    const validationErrors = err.map((error) => ({
      field: error.path,
      message: error.msg,
    }))

    return res.status(400).send({
      status: 'error',
      message: 'Validation error',
      errors: validationErrors,
    })
  }

  /* Bad JSON request body */
  if (err.type === 'entity.parse.failed') {
    return res.status(400).send({
      status: 'error',
      message: 'Bad JSON request body',
    })
  }

  /* Mongoose bad ObjectID */
  if (err.name === 'CastError') {
    return res.status(400).send({
      status: 'error',
      message: 'Invalid resource ID',
    })
  }

  /* Mongoose duplicate key value */
  if (err.code === 11000) {
    const keyVal = Object.keys(err.keyValue)[0]
    return res.status(400).send({
      status: 'error',
      message: `${keyVal} already exist`,
    })
  }

  /* Mongoose validation error */
  if (err.name === 'ValidationError') {
    const messageArr = Object.values(err.errors).map((value) => value.message)
    return res.status(400).send({
      status: 'error',
      message: `Invalid input data: ${messageArr.join(', ')}`,
    })
  }

  /* Incorrect upload field name error */
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).send({
      status: 'error',
      message: 'Please specify the correct upload field name',
    })
  }

  /* Multer file filter error */
  if (err.message === 'UNKNOWN_FILE_FORMAT') {
    return res.status(400).send({
      status: 'error',
      message: 'Please upload an image file',
    })
  }

  /* Log the errors we didn't handle */
  logger.error(`[GlobalErrorHandler]: ${err.message}`)

  const statusCode = err.statusCode === 200 ? 500 : err.statusCode || 500
  const message = `${statusCode}`.startsWith('4') ? err.message : 'Something went wrong!'

  return res.status(statusCode).send({ status: 'error', message })
}

/** Handles request to routes that are not available on the server */
export const unhandledRoutes = (req, res, next) => {
  return res.status(404).send({
    status: 'error',
    message: `${req.method} request to: ${req.originalUrl} not available on this server!`,
  })
}
