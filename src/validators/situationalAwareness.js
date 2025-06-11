/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateSituationalAwarenessRoute = () => {
  return [
    body('instability_of_situation')
      .exists()
      .withMessage('Instability of situation is required')
      .isInt()
      .withMessage('Instability of situation must be an integer'),

    body('complexity_of_situation')
      .exists()
      .withMessage('Complexity of situation is required')
      .isInt()
      .withMessage('Complexity of situation  must be an integer'),

    body('variability_of_situation')
      .exists()
      .withMessage('Variability of situation is required')
      .isInt()
      .withMessage('Variability of situation must be an integer'),

    body('arousal')
      .exists()
      .withMessage('Arousal is required')
      .isInt()
      .withMessage('Arousal must be an integer'),

    body('concentration_of_attention')
      .exists()
      .withMessage('Concentration of attention is required')
      .isInt()
      .withMessage('Concentration of attention must be an integer'),

    body('division_of_attention')
      .exists()
      .withMessage('Division of attention is required')
      .isInt()
      .withMessage('Division of attention must be an integer'),

    body('spare_mental_capacity')
      .exists()
      .withMessage('Spare mental capacity is required')
      .isInt()
      .withMessage('Spare mental capacity must be an integer'),

    body('familiarity_with_situation')
      .exists()
      .withMessage('Familiarity with situation is required')
      .isInt()
      .withMessage('Familiarity with situation must be an integer'),

    body('information_quantity')
      .exists()
      .withMessage('Information quantity is required')
      .isInt()
      .withMessage('Information quantity must be an integer'),

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

export default validateCreateSituationalAwarenessRoute
