import CognitiveWorkload from '../models/cognitiveWorkload.js'
import logger from '../utils/customLogger.js'

export const createCognitiveWorkload = async (data) => {
  const cognitiveWorkload = await CognitiveWorkload.create(data)

  return cognitiveWorkload
}

// export const averageCognitiveWorkload = async () => {
//   try {
//     const result = await CognitiveWorkload.aggregate([
//       {
//         $addFields: {
//           total: {
//             $sum: [
//               '$mental_demand',
//               '$physical_demand',
//               '$temporal_demand',
//               '$performance',
//               '$effort',
//               '$frustration',
//             ],
//           },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageTotal: { $avg: '$total' },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageOfAverages: { $avg: '$averageTotal' },
//         },
//       },
//     ])

//     return result.length > 0 ? result[0]?.averageOfAverages : 0
//   } catch (error) {
//     logger.error('Error calculating average:', error)
//     throw error
//   }
// }

export const averageCognitiveWorkload = async () => {
  try {
    const result = await CognitiveWorkload.aggregate([
      {
        $addFields: {
          total: {
            $sum: [
              '$mental_demand',
              '$physical_demand',
              '$temporal_demand',
              '$performance',
              '$effort',
              '$frustration',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          overallAverage: { $avg: '$total' },
        },
      },
    ])

    return result.length > 0 ? result[0]?.overallAverage : 0
  } catch (error) {
    logger.error('Error calculating average cognitive workload:', error)
    throw error
  }
}
