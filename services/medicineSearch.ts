import { VETERINARY_MEDICINES_DATABASE } from '@/types/medicine'

/**
 * Search for medicine suggestions based on query
 * Uses fuzzy matching and returns top results
 */
export const searchMedicineSuggestions = (query: string, limit: number = 10): string[] => {
  if (!query || query.length < 1) {
    return VETERINARY_MEDICINES_DATABASE.slice(0, limit)
  }

  const lowerQuery = query.toLowerCase().trim()
  
  // Exact matches first
  const exactMatches = VETERINARY_MEDICINES_DATABASE.filter(med =>
    med.toLowerCase() === lowerQuery
  )

  // Starts with matches
  const startsWithMatches = VETERINARY_MEDICINES_DATABASE.filter(med =>
    med.toLowerCase().startsWith(lowerQuery) && !exactMatches.includes(med)
  )

  // Contains matches
  const containsMatches = VETERINARY_MEDICINES_DATABASE.filter(med =>
    med.toLowerCase().includes(lowerQuery) &&
    !exactMatches.includes(med) &&
    !startsWithMatches.includes(med)
  )

  // Word boundary matches (matches individual words)
  const wordMatches = VETERINARY_MEDICINES_DATABASE.filter(med => {
    const words = med.toLowerCase().split(/[\s-]+/)
    return words.some(word => word.startsWith(lowerQuery)) &&
      !exactMatches.includes(med) &&
      !startsWithMatches.includes(med) &&
      !containsMatches.includes(med)
  })

  // Combine all matches in priority order
  const allMatches = [
    ...exactMatches,
    ...startsWithMatches,
    ...containsMatches,
    ...wordMatches
  ]

  return allMatches.slice(0, limit)
}

/**
 * Get popular/common medicines (for initial suggestions)
 */
export const getPopularMedicines = (limit: number = 15): string[] => {
  const popular = [
    'Amoxicillin',
    'Carprofen',
    'Meloxicam',
    'Fenbendazole',
    'Fipronil',
    'Multivitamin',
    'Chlorhexidine',
    'Metoclopramide',
    'Enalapril',
    'Ketoconazole',
    'Insulin',
    'DHPP',
    'Rabies',
    'Diphenhydramine',
    'Atropine'
  ]
  return popular.slice(0, limit)
}

