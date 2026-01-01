import { useState, useEffect, useCallback } from 'react'
import { Medicine } from '@/types/medicine'
import { safeLocalStorage, safeJsonParse, handleError, StorageError } from '@/utils/errorHandler'
import { validateMedicinesArray, checkDataConsistency, sanitizeMedicine } from '@/utils/dataIntegrity'
import { validateMedicine, validateId } from '@/utils/validation'
import { VETERINARY_MEDICINE_CATEGORIES } from '@/types/medicine'

const STORAGE_KEY = 'veterinary_medicines'
const MAX_MEDICINES = 10000 // Prevent storage abuse

export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true)
      setError(null)

      // Try new key first
      let stored = safeLocalStorage.getItem(STORAGE_KEY)
      
      // Migrate from old key if new key doesn't exist
      if (!stored) {
        const oldStored = safeLocalStorage.getItem('medicines')
        if (oldStored) {
          try {
            const oldData = safeJsonParse<Medicine[]>(oldStored, [])
            // Validate and sanitize old data
            const validatedData = validateMedicinesArray(oldData)
            
            // Migrate to new storage key
            const jsonData = JSON.stringify(validatedData)
            if (safeLocalStorage.setItem(STORAGE_KEY, jsonData)) {
              safeLocalStorage.removeItem('medicines')
              stored = jsonData
            }
          } catch (error) {
            console.error('Error migrating medicines:', error)
            setError('Failed to migrate old data')
          }
        }
      }
      
      if (stored) {
        const data = safeJsonParse<Medicine[]>(stored, [])
        
        // Validate and sanitize data
        const validatedData = validateMedicinesArray(data)
        
        // Check for data consistency issues
        const consistency = checkDataConsistency(validatedData)
        if (!consistency.isValid && consistency.issues.length > 0) {
          console.warn('Data consistency issues found:', consistency.issues)
          // Auto-fix issues by sanitizing
          const sanitizedData = validatedData.map(med => sanitizeMedicine(med)).filter((m): m is Medicine => m !== null)
          setMedicines(sanitizedData)
        } else {
          setMedicines(validatedData)
        }
      }
    } catch (error) {
      const appError = handleError(error, 'useMedicines.load')
      setError(appError.userMessage || 'Failed to load medicines')
      console.error('Error loading medicines:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever medicines change
  useEffect(() => {
    if (isLoading) return

    try {
      setError(null)

      // Prevent storage abuse
      if (medicines.length > MAX_MEDICINES) {
        throw new StorageError(`Too many medicines. Maximum ${MAX_MEDICINES} allowed.`)
      }

      // Validate before saving
      const validatedData = validateMedicinesArray(medicines)
      const jsonData = JSON.stringify(validatedData)
      
      safeLocalStorage.setItem(STORAGE_KEY, jsonData)
    } catch (error) {
      const appError = handleError(error, 'useMedicines.save')
      setError(appError.userMessage || 'Failed to save medicines')
      console.error('Error saving medicines:', error)
    }
  }, [medicines, isLoading])

  const addMedicine = useCallback((medicine: Medicine) => {
    try {
      setError(null)

      // Validate medicine
      const validation = validateMedicine(medicine, VETERINARY_MEDICINE_CATEGORIES)
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      // Check for duplicates
      const existing = medicines.find(m => 
        m.id === validation.sanitized.id ||
        (m.name.toLowerCase() === validation.sanitized.name.toLowerCase() &&
         m.batchNumber === validation.sanitized.batchNumber &&
         m.expiryDate === validation.sanitized.expiryDate)
      )

      if (existing) {
        throw new Error('Medicine with same name, batch, and expiry already exists')
      }

      setMedicines(prev => [...prev, validation.sanitized])
    } catch (error) {
      const appError = handleError(error, 'useMedicines.addMedicine')
      setError(appError.userMessage || 'Failed to add medicine')
      throw appError
    }
  }, [medicines])

  const updateMedicine = useCallback((updatedMedicine: Medicine) => {
    try {
      setError(null)

      // Validate ID
      const idValidation = validateId(updatedMedicine.id)
      if (!idValidation.isValid) {
        throw new Error('Invalid medicine ID')
      }

      // Validate medicine
      const validation = validateMedicine(updatedMedicine, VETERINARY_MEDICINE_CATEGORIES)
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      setMedicines(prev => {
        const exists = prev.some(m => m.id === validation.sanitized.id)
        if (!exists) {
          throw new Error('Medicine not found')
        }
        return prev.map(m => m.id === validation.sanitized.id ? validation.sanitized : m)
      })
    } catch (error) {
      const appError = handleError(error, 'useMedicines.updateMedicine')
      setError(appError.userMessage || 'Failed to update medicine')
      throw appError
    }
  }, [])

  const deleteMedicine = useCallback((id: string) => {
    try {
      setError(null)

      // Validate ID
      const idValidation = validateId(id)
      if (!idValidation.isValid) {
        throw new Error('Invalid medicine ID')
      }

      setMedicines(prev => {
        const exists = prev.some(m => m.id === id)
        if (!exists) {
          throw new Error('Medicine not found')
        }
        return prev.filter(m => m.id !== id)
      })
    } catch (error) {
      const appError = handleError(error, 'useMedicines.deleteMedicine')
      setError(appError.userMessage || 'Failed to delete medicine')
      throw appError
    }
  }, [])

  const incrementUsage = useCallback((id: string) => {
    try {
      setError(null)

      // Validate ID
      const idValidation = validateId(id)
      if (!idValidation.isValid) {
        throw new Error('Invalid medicine ID')
      }

      setMedicines(prev =>
        prev.map(m => {
          if (m.id === id) {
            return {
              ...m,
              usageCount: Math.min((m.usageCount || 0) + 1, 1000000), // Prevent overflow
              lastUsed: new Date().toISOString().split('T')[0]
            }
          }
          return m
        })
      )
    } catch (error) {
      const appError = handleError(error, 'useMedicines.incrementUsage')
      setError(appError.userMessage || 'Failed to update usage')
      throw appError
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    medicines,
    error,
    isLoading,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    incrementUsage,
    clearError,
    setMedicines
  }
}
