import express from 'express'
import createDiscomfortController from '../controllers/discomfort.js'
import { validateCreateDiscomfortRoute } from '../utils/validators.js'

const router = express.Router()

router.post('/', validateCreateDiscomfortRoute(), createDiscomfortController)

export default router
