/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

export const validateCreateDiscomfortRoute = () => {
  return [
    body('hand_and_waist')
      .exists()
      .withMessage('Hand and waist is required')
      .isInt()
      .withMessage('Hand and waist must be an integer'),

    body('upper_arm')
      .exists()
      .withMessage('Upper arm is required')
      .isInt()
      .withMessage('Upper arm must be an integer'),

    body('shoulder')
      .exists()
      .withMessage('Shoulder is required')
      .isInt()
      .withMessage('Shoulder must be an integer'),

    body('lower_back')
      .exists()
      .withMessage('Lower back is required')
      .isInt()
      .withMessage('Lower back must be an integer'),

    body('thigh')
      .exists()
      .withMessage('Thigh is required')
      .isInt()
      .withMessage('Thigh must be an integer'),

    body('lower_leg_and_foot')
      .exists()
      .withMessage('Lower leg and foot is required')
      .isInt()
      .withMessage('Lower leg and foot must be an integer'),

    body('neck')
      .exists()
      .withMessage('Neck is required')
      .isInt()
      .withMessage('Lower leg and foot must be an integer'),

    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}

export const validateCreateBalanceRoute = () => {
  return [
    body('id').notEmpty().withMessage('ID is invalid'),
    body('data').notEmpty().withMessage('Data is invalid'),
    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}
