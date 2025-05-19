import dotenv from 'dotenv'
import mongoose from 'mongoose'

import logger from './utils/customLogger.js'

/* Express application */
import app from './app.js'
import { analyze, balance, exertion, cognitiveLoad, discomfort } from './service/analysis.js'

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

// try {
//   const inputData = {
//     cognitive_load: {
//       mental_demand: 10,
//       physical_demand: 5,
//       temporal_demand: 12,
//       performance: 8,
//       effort: 6,
//       frustration: 9,
//     },
//     discomfort: {
//       hand_wrist: 4,
//       chest: 3,
//       upper_arm: 1,
//       shoulder: 5,
//       lower_back: 6,
//       thigh: 0,
//       neck: 2,
//       lower_leg_foot: 1,
//     },
//     exertion: 14,
//     balance: 3,
//     situational_awareness: {
//       instability_of_situation: 5,
//       complexity_of_situation: 3,
//       variability_of_situation: 4,
//       arousal: 2,
//       concentration_of_attention: 4,
//       division_of_attention: 3,
//       spare_mental_capacity: 7,
//       information_quantity: 6,
//       familiarity_with_situation: 1,
//     },
//     usability: {
//       ease_of_use: 3,
//       comfort: 5,
//       ease_of_learning: 4,
//     }
//   }

//   analyze(inputData)
//     .then((result) => {
//       logger.info(`[Analysis Result]: ${JSON.stringify(result)}`)

//       // Ensure required fields exist
//       if (!result.cognitive_load || !result.discomfort || !result.exertion || !result.balance) {
//         throw new Error('Missing expected fields in model response')
//       }

//       // const sanitizedResult = {
//       //   cognitive_load: {
//       //     ...result.cognitive_load,
//       //     mental_demand: result.cognitive_load?.mental_demand ?? 0,
//       //     physical_demand: result.cognitive_load?.physical_demand ?? 0,
//       //     temporal_demand: result.cognitive_load?.temporal_demand ?? 0,
//       //     performance: result.cognitive_load?.performance ?? 0,
//       //     effort: result.cognitive_load?.effort ?? 0,
//       //     frustration: result.cognitive_load?.frustration ?? 0,
//       //   },
//       //   discomfort: {
//       //     ...result.discomfort,
//       //     hand_wrist: result.discomfort?.hand_wrist ?? 0,
//       //     chest: result.discomfort?.chest ?? 0,
//       //     upper_arm: result.discomfort?.upper_arm ?? 0,
//       //     shoulder: result.discomfort?.shoulder ?? 0,
//       //     lower_back: result.discomfort?.lower_back ?? 0,
//       //     thigh: result.discomfort?.thigh ?? 0,
//       //     neck: result.discomfort?.neck ?? 0,
//       //     lower_leg_foot: result.discomfort?.lower_leg_foot ?? 0,
//       //   },
//       //   exertion: result.exertion ?? 0,
//       //   balance: result.balance ?? 0,
//       // }

//       // logger.info(`[Analysis Result]: ${JSON.stringify(sanitizedResult)}`)
//     })
//     .catch((error) => {
//       logger.error(`[Analysis Error]: ${error.message}`)
//     })
//     .finally(() => {
//       logger.info('Analysis completed.')
//     })
// } catch (error) {
//   logger.error(`[Error]: ${error.message}`)
//   // process.exit(1)
// }
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
