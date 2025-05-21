import { ChatOpenAI } from '@langchain/openai'
import dotenv from 'dotenv'

/* Load environment variables into Node.js process */
dotenv.config()

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: process.env.OPENAI_TEMPERATURE,
  openAIApiKey: process.env.OPENAI_API_KEY,
  // maxTokens: 4000,
})

export default model
