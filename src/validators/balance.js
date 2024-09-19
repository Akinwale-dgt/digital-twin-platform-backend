/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateBalanceRoute = () => {
  return [
    body('rate_of_balance')
      .exists()
      .withMessage('Rate of balance is required')
      .isInt()
      .withMessage('Rate of balance must be an integer'),

    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}

export default validateCreateBalanceRoute
