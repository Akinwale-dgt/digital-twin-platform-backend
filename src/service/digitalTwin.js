import { RunnableSequence } from '@langchain/core/runnables'
import parseError from '../utils/parser.js'
import {
  createDigitalTwinOutputParser,
  createDigitalTwinPromptTemplate,
} from '../shared/digital_twin.js'
import logger from '../utils/customLogger.js'
import model from '../shared/openai.js'

// Function to generate the report using OpenAI and LangChain
const generateDigitalTwinAnalysis = async (inputData) => {
  try {
    const outputParser = createDigitalTwinOutputParser()
    const prompt = createDigitalTwinPromptTemplate()
    console.log('Input Data:', inputData)

    // await prompt.format({
    //   input_data: JSON.stringify(inputData),
    // })

    const chain = RunnableSequence.from([prompt, model, outputParser])

    const result = await chain.invoke({ input: inputData })
    logger.info(
      `Digital twin analysis generated successfully: \n\n${JSON.stringify(result, null, 2)}`,
    )

    return result
  } catch (error) {
    parseError(error)
    return null
  }
}

export default generateDigitalTwinAnalysis
