import express from 'express'
import {
  createDiscomfortController,
  createCognitiveWorkloadController,
  createExertionController,
  createBalanceController,
  createSituationalAwarenessController,
  createUsabilityController,
  getUsabilityController,
} from '../controllers/inputData.js'
import validateCreateDiscomfortRoute from '../validators/discomfort.js'
import validateCreateCognitiveWorkloadRoute from '../validators/cognitiveWorkload.js'
import validateCreateExertionRoute from '../validators/exertion.js'
import validateCreateBalanceRoute from '../validators/balance.js'
import validateCreateSituationalAwarenessRoute from '../validators/situationalAwareness.js'
import resetSubjectiveController from '../controllers/reset.js'
import analyzeDataController from '../controllers/analyze.js'
import { getReportController, reportStatusController } from '../controllers/report.js'
import validateCreateUsabilityRoute from '../validators/usability.js'


const router = express.Router()

router.get('/session-check', (req, res) => {   
  if (!req.session.visited) {
    req.session.visited = true;
    req.session.views = 1;
    res.json({ 
      message: 'First time visitor',
      sessionID: req.sessionID
     });
  } else {
    req.session.views += 1;
    res.json({ message: 'Welcome back!', views: req.session.views });
  }
});

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

router.post(
  '/usability',
  validateCreateUsabilityRoute(),
  createUsabilityController,
)

router.get('/usability/:id', getUsabilityController)

// router.get('/analyze-subjective-data', analyzeSubjectiveData)

// router.post('/analyze-data', analyzeDataController)
router.get('/analyze-data', analyzeDataController)

// API endpoint to check report status
router.get('/report/:reportId/status', reportStatusController)
// API endpoint to download the report
// router.get('/report/:reportId/download', downloadReportController)
// router.get('/report/:reportId/view', viewReportController)
// API endpoint to get the full report data (including JSON results)
router.get('/report/:reportId', getReportController)

// router.post('/upload-file', uploadFile, uploadFileController)

router.delete('/reset', resetSubjectiveController)

export default router
