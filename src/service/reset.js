import Balance from '../models/balance.js'
import CognitiveWorkload from '../models/cognitiveWorkload.js'
import Discomfort from '../models/discomfort.js'
import Exertion from '../models/exertion.js'
import SituationalAwareness from '../models/situationalAwareness.js'
import Usability from '../models/usability.js'
import logger from '../utils/customLogger.js'

const resetSubjective = async () => {
  try {
    await Exertion.deleteMany({}).exec()

    await SituationalAwareness.deleteMany({}).exec()

    await Balance.deleteMany({}).exec()

    await CognitiveWorkload.deleteMany({}).exec()

    await Discomfort.deleteMany({}).exec()

    await Usability.deleteMany({}).exec()
  } catch (error) {
    logger.error(error)

    throw new Error(error)
  }
}

export default resetSubjective
