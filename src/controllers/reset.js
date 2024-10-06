/* eslint-disable consistent-return */
import resetSubjective from '../service/reset.js'

const resetSubjectiveController = async (req, res, next) => {
  try {
    await resetSubjective()

    return res.status(200).send({
      status: 'success',
      message: 'Reset successful',
    })
  } catch (error) {
    next(error)
  }
}

export default resetSubjectiveController
