import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import compression from 'compression'

import discomfortRoutes from './routes/discomfort.js'
import { globalErrorHandler, unhandledRoutes } from './middleware/error.js'

/* Express app */
const app = express()

/* Enable CORS */
app.use(cors())
app.options('*', cors())

/* Parse the request body */
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/* Set security HTTP headers */
app.use(helmet())

/* Data sanitization against NoSQL query injection */
app.use(mongoSanitize())

/* Prevent HTTP parameter pollution */
app.use(hpp())

/* Compress response body */
app.use(compression())

/* Mount routers */
app.get('/api', (req, res) => res.status(200).send('Server is up and running!!!'))
app.use('/api/discomfort', discomfortRoutes)

app.use(unhandledRoutes)
app.use(globalErrorHandler)

export default app
