import dotenv from 'dotenv'
import mongoose from 'mongoose'

import logger from './utils/customLogger.js'

/* Express application */
import app from './app.js'

/* Listen for uncaught exception event */
process.on('uncaughtException', (err) => {
  logger.error(`[UnhandledException]: ${err}`)
  process.exit(1)
})

/* Load environment variables into Node.js process */
dotenv.config()

/* Connect to MongoDB */
mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URI)
  .then((db) => {
    logger.info(`[MongoDB connected]: ${db.connection.host}`)
  })
  .catch((err) => {
    logger.error(`[Unable to connect to MongoDB]: ${err.message}`)
    process.exit(1)
  })

/* Listen for incoming requests */
const port = process.env.PORT || 5001
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port} in ${process.env.NODE_ENV} mode.`),
)

/* Listen for unhandled promise rejection event */
process.on('unhandledRejection', (err) => {
  logger.error(`[UnhandledRejection]: ${err}`)
  server.close(() => {
    process.exit(1)
  })
})

/* Listen for termination signal event */
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED! Shutting down...')
  server.close(() => {
    logger.info('Process terminated!')
  })
})
