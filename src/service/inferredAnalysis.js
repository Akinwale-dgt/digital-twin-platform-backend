import { RunnableSequence } from '@langchain/core/runnables'
import {
  createInferredAnalysisPromptTemplate,
  createInferredAnalysisOutputParser,
} from '../shared/inferred_analysis.js'
import logger from '../utils/customLogger.js'
import model from '../shared/openai.js'

// Function to generate the report using OpenAI and LangChain
async function inferredAnalysis(inputData) {
  try {
    const parser = createInferredAnalysisOutputParser()
    const prompt = createInferredAnalysisPromptTemplate()

    // await prompt.format({
    //   input_data: JSON.stringify(inputData),
    // })

    const chain = RunnableSequence.from([prompt, model, parser])
    // const chain = RunnableSequence.from([prompt, model])
    // const result = await chain.invoke({ input_data: JSON.stringify(inputData) })
    const result = await chain.invoke({ input: inputData })
    logger.info('Result:')
    // logger.info(result)
    // logger.info(`Report generated successfully: \n\n${JSON.stringify(result, null, 2)}`)
    return result
  } catch (error) {
    logger.error('Error generating report:')
    logger.error(error)
    throw error
  }
}

export default inferredAnalysis
