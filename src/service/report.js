import { RunnableSequence } from '@langchain/core/runnables'
import { createExoskeletonOutputParser, createExoskeletonPromptTemplate } from '../shared/report.js'
import logger from '../utils/customLogger.js'
import model from '../shared/openai.js'

// Function to generate the report using OpenAI and LangChain
async function generateReport(inputData) {
  try {
    const parser = createExoskeletonOutputParser()
    const prompt = createExoskeletonPromptTemplate()

    // await prompt.format({
    //   input_data: JSON.stringify(inputData),
    // })

    const chain = RunnableSequence.from([prompt, model, parser])
    // const result = await chain.invoke({ input_data: JSON.stringify(inputData) })
    const result = await chain.invoke({ input: inputData })
    logger.info(`Report generated successfully: \n\n${JSON.stringify(result, null, 2)}`)
    return result
  } catch (error) {
    logger.error('Error generating report:')
    logger.error(error)
    throw error
  }
}

export default generateReport
