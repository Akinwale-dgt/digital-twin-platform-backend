/* eslint-disable consistent-return */
import { body, validationResult } from 'express-validator'

const validateCreateUsabilityRoute = () => {
  return [
    body('ease_of_use.don_and_doff')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.adjust_fitting')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.works_as_expected')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.meets_need')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.accomplish_task')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.without_assistance')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_use.work_with')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('comfort.restricts_movement')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('comfort.interfere_with_environment')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('comfort.satisfaction')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.need_to_learn')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.easily_learn_to_assemble')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.easily_learn_to_adjust')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.easily_learn_checks')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.remember_how_to_use')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

    body('ease_of_learning.use_again_without_assistance')
      .exists()
      .withMessage('This field is required')
      .isInt()
      .withMessage('This field must be an integer'),

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

export default validateCreateUsabilityRoute
