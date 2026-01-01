import { Medicine } from '@/types/medicine'
import { differenceInDays, isPast, isToday } from 'date-fns'

/**
 * Sort medicines by quantity (lowest first)
 */
export const sortByQuantity = (medicines: Medicine[]): Medicine[] => {
  return [...medicines].sort((a, b) => {
    const qtyA = a.quantity || 0
    const qtyB = b.quantity || 0
    return qtyA - qtyB
  })
}

/**
 * Get expiry status for a medicine
 */
export const getExpiryStatus = (expiryDate: string) => {
  if (!expiryDate) return { status: 'unknown', label: 'No expiry date', color: 'bg-gray-100 text-gray-800 border-gray-300' }
  
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = differenceInDays(expiry, new Date())

  if (isPast(expiry) || isToday(expiry)) {
    return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800 border-red-300' }
  } else if (daysUntilExpiry <= 15) {
    return { status: 'expiring', label: `Expires in ${daysUntilExpiry} days`, color: 'bg-orange-100 text-orange-800 border-orange-300' }
  } else if (daysUntilExpiry <= 30) {
    return { status: 'warning', label: `Expires in ${daysUntilExpiry} days`, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
  } else {
    return { status: 'valid', label: `Expires in ${daysUntilExpiry} days`, color: 'bg-green-100 text-green-800 border-green-300' }
  }
}

/**
 * Get most used medicines (sorted by usage count)
 */
export const getMostUsedMedicines = (medicines: Medicine[], limit: number = 10): Medicine[] => {
  return [...medicines]
    .filter(m => (m.usageCount || 0) > 0)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit)
}

/**
 * Increment usage count for a medicine
 */
export const incrementUsage = (medicine: Medicine): Medicine => {
  return {
    ...medicine,
    usageCount: (medicine.usageCount || 0) + 1,
    lastUsed: new Date().toISOString().split('T')[0]
  }
}

/**
 * Search medicines by name (fuzzy search)
 */
export const searchMedicines = (medicines: Medicine[], query: string): Medicine[] => {
  if (!query.trim()) return medicines
  
  const lowerQuery = query.toLowerCase()
  return medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(lowerQuery) ||
    medicine.category?.toLowerCase().includes(lowerQuery) ||
    medicine.manufacturer?.toLowerCase().includes(lowerQuery) ||
    medicine.batchNumber?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter medicines by category
 */
export const filterByCategory = (medicines: Medicine[], category: string): Medicine[] => {
  if (!category) return medicines
  return medicines.filter(m => m.category === category)
}

/**
 * Calculate total inventory value
 */
export const calculateTotalInventoryValue = (medicines: Medicine[]): number => {
  return medicines.reduce((sum, m) => sum + (m.totalPriceInvested || 0), 0)
}

/**
 * Get low stock medicines (quantity <= threshold)
 */
export const getLowStockMedicines = (medicines: Medicine[], threshold: number = 10): Medicine[] => {
  return medicines.filter(m => (m.quantity || 0) <= threshold)
}

