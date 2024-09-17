import express from 'express'
import {
  createDiscomfortController,
  createCognitiveWorkloadController,
  createExertionController,
} from '../controllers/index.js'
import validateCreateDiscomfortRoute from '../validators/discomfort.js'
import validateCreateCognitiveWorkloadRoute from '../validators/cognitiveWorkload.js'
import validateCreateExertionRoute from '../validators/exertion.js'

const router = express.Router()

router.post('/discomfort', validateCreateDiscomfortRoute(), createDiscomfortController)
router.post('/exertion', validateCreateExertionRoute(), createExertionController)
router.post(
  '/cognitive-workload',
  validateCreateCognitiveWorkloadRoute(),
  createCognitiveWorkloadController,
)

export default router
