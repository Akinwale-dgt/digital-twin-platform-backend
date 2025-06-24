/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateRatingsRoute = () => {
  return [
    body('C1_C2')
      .exists()
      .withMessage('Reduced Exertion compared to Light Cognitive Load is required')
      .withMessage('Reduced Exertion compared to Light Cognitive Load must be an integer'),

    body('C1_C3')
      .exists()
      .withMessage('Reduced Exertion compared to Stability is required')
      .withMessage('Reduced Exertion compared to Stability must be an integer'),

    body('C1_C4')
      .exists()
      .withMessage('Reduced Exertion compared to Compatibility is required')
      .withMessage('Reduced Exertion compared to Compatibility must be an integer'),

    body('C1_C5')
      .exists()
      .withMessage('Reduced Exertion compared to Ease of Use is required')
      .withMessage('Reduced Exertion compared to Ease of Use must be an integer'),

    body('C1_C6')
      .exists()
      .withMessage('Reduced Exertion compared to Productivity is required')
      .withMessage('Reduced Exertion compared to Productivity must be an integer'),

    body('C1_C7')
      .exists()
      .withMessage('Reduced Exertion compared to Productivity is required')
      .withMessage('Reduced Exertion compared to Productivity must be an integer'),

    body('C2_C2').default(1),

    body('C2_C3')
      .exists()
      .withMessage('Light Cognitive Load to Stability is required')
      .withMessage('Light Cognitive Load to Stability must be an integer'),

    body('C2_C4')
      .exists()
      .withMessage('Light Cognitive Load to Compatibility is required')
      .withMessage('Light Cognitive Load to Compatibility must be an integer'),

    body('C2_C5')
      .exists()
      .withMessage('Light Cognitive Load to Ease of Use is required')
      .withMessage('Light Cognitive Load to Ease of Use must be an integer'),

    body('C2_C6')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C2_C7')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C3_C3').default(1),

    body('C3_C4')
      .exists()
      .withMessage('Light Cognitive Load to Compatibility is required')
      .withMessage('Light Cognitive Load to Compatibility must be an integer'),

    body('C3_C5')
      .exists()
      .withMessage('Light Cognitive Load to Ease of Use is required')
      .withMessage('Light Cognitive Load to Ease of Use must be an integer'),

    body('C3_C6')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C3_C7')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C4_C4').default(1),

    body('C4_C5')
      .exists()
      .withMessage('Light Cognitive Load to Ease of Use is required')
      .withMessage('Light Cognitive Load to Ease of Use must be an integer'),

    body('C4_C6')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C4_C7')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C5_C5').default(1),

    body('C5_C6')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C5_C7')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C6_C6').default(1),

    body('C6_C7')
      .exists()
      .withMessage('Light Cognitive Load to Productivity is required')
      .withMessage('Light Cognitive Load to Productivity must be an integer'),

    body('C7_C7').default(1),

    (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return next(errors.array())
      }

      next()
    },
  ]
}

export default validateCreateRatingsRoute
