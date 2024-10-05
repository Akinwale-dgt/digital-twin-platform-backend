import { csv2json } from 'json-2-csv'
import Fili from 'fili'
import Exertion from '../models/exertion.js'
import logger from '../utils/customLogger.js'

export const createExertion = async (data) => {
  const exertion = await Exertion.create(data)

  return exertion
}

export const averageExertion = async () => {
  try {
    const result = await Exertion.aggregate([
      {
        $group: {
          _id: null,
          averageRateOfExertion: { $avg: '$rate_of_exertion' },
        },
      },
    ])

    const average = result.length > 0 ? result[0].averageRateOfExertion : 0
    return average
  } catch (error) {
    logger.error('Error calculating average:', error)
    throw error
  }
}

const samplingRate = 100 // Your actual sampling rate
const cutoffFrequency = 8

// const nyquist = 0.5 * cutoffFrequency
// const normalCutoff = cutoff / nyquist

const iirCalculator = new Fili.CalcCascades()
const filterCoeffs = iirCalculator.highpass({
  order: 5,
  characteristic: 'butterworth',
  Fs: samplingRate,
  Fc: cutoffFrequency,
})

const filter = new Fili.IirFilter(filterCoeffs)

// Function to apply a moving average filter
function movingAverageFilter(data, windowSize = 5) {
  // Apply moving average to each inner array (channel)
  return data.map((channel) => {
    const result = []
    let currentSum = 0

    for (let i = 0; i < channel.length; i++) {
      currentSum += channel[i]
      if (i >= windowSize) {
        currentSum -= channel[i - windowSize]
      }

      if (i >= windowSize - 1) {
        result.push(currentSum / windowSize)
      }
    }

    return result
  })
}

function parseNumeric(value) {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

// Function to create a Butterworth high-pass filter
export async function processExertionData(csvData) {
  const jsonData = await csv2json(csvData)

  // Identify EEG channels (all columns except 'time')
  const channels = Object.keys(jsonData[0]).filter((key) => key !== 'time')

  // Extract and transform data for each channel
  const filteredData = channels.map((channel) => {
    const channelData = jsonData.map((row) => parseNumeric(row[channel]))

    return filter.multiStep(channelData)
  })

  // Apply the moving average filter
  const smoothedData = movingAverageFilter(filteredData)
  return smoothedData
}
