// Helper function to fix null values in the parsed data
export function fixNullValues(data) {
  const fixed = JSON.parse(JSON.stringify(data))
  
  // Fix discomfort null values
  if (fixed.discomfort && fixed.discomfort.raw_scores) {
    Object.keys(fixed.discomfort.raw_scores).forEach(key => {
      if (fixed.discomfort.raw_scores[key] === null) {
        fixed.discomfort.raw_scores[key] = 0
      }
    })
  }
  
  if (fixed.discomfort && fixed.discomfort.categories) {
    Object.keys(fixed.discomfort.categories).forEach(key => {
      if (fixed.discomfort.categories[key] === null) {
        fixed.discomfort.categories[key] = 'Low'
      }
    })
  }
  
  // Fix cognitive load null values (if any)
  if (fixed.cognitive_load && fixed.cognitive_load.raw_scores) {
    Object.keys(fixed.cognitive_load.raw_scores).forEach(key => {
      if (fixed.cognitive_load.raw_scores[key] === null) {
        fixed.cognitive_load.raw_scores[key] = 0
      }
    })
  }
  
  if (fixed.cognitive_load && fixed.cognitive_load.categories) {
    Object.keys(fixed.cognitive_load.categories).forEach(key => {
      if (fixed.cognitive_load.categories[key] === null) {
        fixed.cognitive_load.categories[key] = 'Low'
      }
    })
  }
  
  return fixed
}
