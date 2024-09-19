import Balance from '../models/balance.js'

export const createBalance = async (data) => {
  const balance = await Balance.create(data)

  return balance
}

export const analyzeBalance = async () => {}
