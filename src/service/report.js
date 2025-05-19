import { ChatOpenAI } from '@langchain/openai'
import { createExoskeletonOutputParser, createExoskeletonPromptTemplate } from '../shared/report.js'
import { RunnableSequence } from '@langchain/core/runnables'
// import { createExoskeletonOutputParser, createExoskeletonPromptTemplate } from '../shared/report'

// Function to generate the report using OpenAI and LangChain
async function generateReport(inputData) {
  try {
    const model = new ChatOpenAI({
      // model: "gpt-4-turbo",
      model: process.env.OPENAI_MODEL, 
      temperature: 0.7,
      // maxTokens: 4000,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    const parser = createExoskeletonOutputParser()
    const prompt = createExoskeletonPromptTemplate(parser)

    // const formattedPrompt = 
    await prompt.format({
      input_data: JSON.stringify(inputData),
    })

    // console.log('formattedPrompt:', formattedPrompt)

    const chain = RunnableSequence.from([prompt, model, parser])
    // const result = await model.invoke(formattedPrompt)
    const result = await chain.invoke({ input_data: JSON.stringify(inputData) })
    console.log('result:', result)
    // const parsedOutput = await parser.parse(result)

    // return parsedOutput
    return result
  } catch (error) {
    console.error('Error generating report:', error)
    throw error
  }
}

export default generateReport
