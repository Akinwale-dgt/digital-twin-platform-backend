import express from 'express'
import {
  createDiscomfortController,
  createCognitiveWorkloadController,
  createExertionController,
  createBalanceController,
  createSituationalAwarenessController,
  uploadFileController,
} from '../controllers/inputData.js'
import { analyzeSubjectiveData } from '../controllers/analyzeData.js'
import validateCreateDiscomfortRoute from '../validators/discomfort.js'
import validateCreateCognitiveWorkloadRoute from '../validators/cognitiveWorkload.js'
import validateCreateExertionRoute from '../validators/exertion.js'
import validateCreateBalanceRoute from '../validators/balance.js'
import validateCreateSituationalAwarenessRoute from '../validators/situationalAwareness.js'
import uploadFile from '../middleware/upload.js'

const router = express.Router()

router.post('/discomfort', validateCreateDiscomfortRoute(), createDiscomfortController)
router.post('/exertion', validateCreateExertionRoute(), createExertionController)
router.post('/balance', validateCreateBalanceRoute(), createBalanceController)
router.post(
  '/cognitive-workload',
  validateCreateCognitiveWorkloadRoute(),
  createCognitiveWorkloadController,
)
router.post(
  '/situational-awareness',
  validateCreateSituationalAwarenessRoute(),
  createSituationalAwarenessController,
)

router.get('/analyze-subjective-data', analyzeSubjectiveData)

router.post('/upload-file', uploadFile, uploadFileController)

export default router
