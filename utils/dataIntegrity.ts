/**
 * Data integrity checks and validation
 * Ensures data consistency and prevents corruption
 */

import { Medicine } from '@/types/medicine'
import { VETERINARY_MEDICINE_CATEGORIES } from '@/types/medicine'

/**
 * Validate medicine data structure
 */
export const isValidMedicine = (data: any): data is Medicine => {
  if (!data || typeof data !== 'object') return false

  // Check required fields exist (even if empty)
  const hasRequiredFields = 
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.category === 'string' &&
    typeof data.mrp === 'number' &&
    typeof data.quantity === 'number' &&
    typeof data.totalPriceInvested === 'number' &&
    typeof data.expiryDate === 'string' &&
    typeof data.purchaseDate === 'string'

  if (!hasRequiredFields) return false

  // Validate field types and ranges
  if (
    isNaN(data.mrp) || !isFinite(data.mrp) || data.mrp < 0 ||
    isNaN(data.quantity) || !isFinite(data.quantity) || data.quantity < 0 ||
    isNaN(data.totalPriceInvested) || !isFinite(data.totalPriceInvested) || data.totalPriceInvested < 0
  ) {
    return false
  }

  // Validate ID format
  if (data.id.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(data.id)) {
    return false
  }

  // Validate category
  if (!VETERINARY_MEDICINE_CATEGORIES.includes(data.category)) {
    return false
  }

  // Validate optional fields if present
  if (data.manufacturer !== undefined && typeof data.manufacturer !== 'string') return false
  if (data.batchNumber !== undefined && typeof data.batchNumber !== 'string') return false
  if (data.description !== undefined && typeof data.description !== 'string') return false
  if (data.usageCount !== undefined && (typeof data.usageCount !== 'number' || data.usageCount < 0)) return false
  if (data.lastUsed !== undefined && typeof data.lastUsed !== 'string') return false

  return true
}

/**
 * Sanitize and fix medicine data
 */
export const sanitizeMedicine = (data: any): Medicine | null => {
  if (!data || typeof data !== 'object') return null

  try {
    const sanitized: Medicine = {
      id: String(data.id || Date.now().toString()).substring(0, 100),
      name: String(data.name || 'Unnamed Medicine').substring(0, 200),
      category: VETERINARY_MEDICINE_CATEGORIES.includes(data.category) 
        ? data.category 
        : 'Other',
      mrp: Math.max(0, Math.min(1000000, Number(data.mrp) || 0)),
      quantity: Math.max(0, Math.min(1000000, Math.floor(Number(data.quantity) || 0))),
      totalPriceInvested: Math.max(0, Math.min(100000000, Number(data.totalPriceInvested) || 0)),
      expiryDate: data.expiryDate || '',
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
      usageCount: Math.max(0, Math.floor(Number(data.usageCount) || 0)),
    }

    // Optional fields
    if (data.manufacturer) {
      sanitized.manufacturer = String(data.manufacturer).substring(0, 200)
    }
    if (data.batchNumber) {
      sanitized.batchNumber = String(data.batchNumber).substring(0, 100)
    }
    if (data.description) {
      sanitized.description = String(data.description).substring(0, 1000)
    }
    if (data.lastUsed) {
      sanitized.lastUsed = String(data.lastUsed)
    }

    return sanitized
  } catch (error) {
    console.error('Error sanitizing medicine:', error)
    return null
  }
}

/**
 * Validate array of medicines
 */
export const validateMedicinesArray = (data: any): Medicine[] => {
  if (!Array.isArray(data)) {
    return []
  }

  const validMedicines: Medicine[] = []

  for (const item of data) {
    if (isValidMedicine(item)) {
      validMedicines.push(item)
    } else {
      // Try to sanitize invalid medicine
      const sanitized = sanitizeMedicine(item)
      if (sanitized) {
        validMedicines.push(sanitized)
      }
      // Silently skip invalid items that can't be sanitized
    }
  }

  return validMedicines
}

/**
 * Check for duplicate medicines (same name, batch, expiry)
 */
export const findDuplicates = (medicines: Medicine[]): Medicine[][] => {
  const duplicates: Medicine[][] = []
  const seen = new Map<string, Medicine[]>()

  for (const medicine of medicines) {
    const key = `${medicine.name.toLowerCase()}_${medicine.batchNumber || 'no-batch'}_${medicine.expiryDate}`
    
    if (seen.has(key)) {
      seen.get(key)!.push(medicine)
    } else {
      seen.set(key, [medicine])
    }
  }

  for (const group of seen.values()) {
    if (group.length > 1) {
      duplicates.push(group)
    }
  }

  return duplicates
}

/**
 * Check data consistency
 */
export const checkDataConsistency = (medicines: Medicine[]): {
  isValid: boolean
  issues: string[]
} => {
  const issues: string[] = []

  // Check for duplicate IDs
  const ids = new Set<string>()
  for (const medicine of medicines) {
    if (ids.has(medicine.id)) {
      issues.push(`Duplicate ID found: ${medicine.id}`)
    }
    ids.add(medicine.id)
  }

  // Check for logical inconsistencies
  for (const medicine of medicines) {
    // Check if total price matches MRP * quantity (within rounding error)
    const expectedTotal = medicine.mrp * medicine.quantity
    const difference = Math.abs(medicine.totalPriceInvested - expectedTotal)
    if (difference > 0.01) {
      issues.push(`Price mismatch for ${medicine.name}: expected ${expectedTotal.toFixed(2)}, got ${medicine.totalPriceInvested.toFixed(2)}`)
    }

    // Check if purchase date is before expiry date
    if (medicine.purchaseDate && medicine.expiryDate) {
      const purchaseDate = new Date(medicine.purchaseDate)
      const expiryDate = new Date(medicine.expiryDate)
      if (purchaseDate > expiryDate) {
        issues.push(`Purchase date after expiry date for ${medicine.name}`)
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues
  }
}

