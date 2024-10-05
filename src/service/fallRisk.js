import Fili from 'fili'
import { csv2json } from 'json-2-csv'
import logger from '../utils/customLogger.js'

// Precompute filter coefficients if they are reused across multiple function calls
const samplingRate = 100
const cutoffFrequency = 8

// const nyquist = 0.5 * cutoffFrequency
// const normalCutoff = cutoff / nyquist

const iirCalculator = new Fili.CalcCascades()
const filterCoeffs = iirCalculator.lowpass({
  order: 12,
  characteristic: 'butterworth',
  Fs: samplingRate,
  Fc: cutoffFrequency,
})

const filter = new Fili.IirFilter(filterCoeffs)

function parseNumeric(value) {
  const parsed = parseFloat(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

// Filter function
export default async function processFallRiskData(csvData) {
  try {
    const jsonData = await csv2json(csvData)

    // Identify EEG channels (all columns except 'time')
    const channels = Object.keys(jsonData[0]).filter((key) => key !== 'time')
    // Apply the filter to the raw data
    // Extract and transform data for each channel
    const transformedData = channels.map((channel) => {
      const channelData = jsonData.map((row) => parseNumeric(row[channel]))
      // Apply Discrete Wavelet Transform to each channel's data
      return filter.multiStep(channelData)
    })
    return transformedData
  } catch (error) {
    logger.error('Error processing fall risk data:', error.message)
    throw error
  }
}
