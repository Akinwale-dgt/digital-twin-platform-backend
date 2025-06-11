/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateCognitiveWorkloadRoute = () => {
  return [
    body('mental_demand')
      .exists()
      .withMessage('Mental demand is required')
      .isInt()
      .withMessage('Mental demand must be an integer'),

    body('physical_demand')
      .exists()
      .withMessage('Physical demand is required')
      .isInt()
      .withMessage('Physical demand must be an integer'),

    body('temporal_demand')
      .exists()
      .withMessage('Temporal demand is required')
      .isInt()
      .withMessage('Temporal demand must be an integer'),

    body('performance')
      .exists()
      .withMessage('Performance is required')
      .isInt()
      .withMessage('Performance must be an integer'),

    body('effort')
      .exists()
      .withMessage('Effort is required')
      .isInt()
      .withMessage('Effort must be an integer'),

    body('frustration')
      .exists()
      .withMessage('Frustration is required')
      .isInt()
      .withMessage('Frustration must be an integer'),

    body('exoID')
      .exists()
      .withMessage('ExoID is required')
      .isInt()
      .withMessage('ExoID must be an integer'),

    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}

export default validateCreateCognitiveWorkloadRoute
