import { ChatOpenAI } from '@langchain/openai'
import dotenv from 'dotenv'

/* Load environment variables into Node.js process */
dotenv.config()

// const model = new ChatOpenAI({ model: 'gpt-4' })
const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  // maxTokens: 4000,
  // model: "gpt-4-turbo",
})

export default model
