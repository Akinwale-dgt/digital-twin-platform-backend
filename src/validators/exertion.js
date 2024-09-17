/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateExertionRoute = () => {
  return [
    body('rate_of_exertion')
      .exists()
      .withMessage('Rate of exertion is required')
      .isInt()
      .withMessage('Rate of exertion must be an integer'),

    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}

export default validateCreateExertionRoute
