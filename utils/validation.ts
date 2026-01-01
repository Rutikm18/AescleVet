/**
 * Input validation and sanitization utilities
 * Senior SDE level validation with comprehensive edge case handling
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitized?: any
}

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') return ''
  
  // Remove potentially dangerous characters
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

/**
 * Validate and sanitize medicine name
 */
export const validateMedicineName = (name: string): ValidationResult => {
  if (!name || typeof name !== 'string') {
    return { isValid: true, sanitized: '' } // Optional field
  }
  
  const sanitized = sanitizeString(name, 200)
  
  if (sanitized.length > 200) {
    return {
      isValid: false,
      error: 'Medicine name must be less than 200 characters'
    }
  }
  
  return { isValid: true, sanitized }
}

/**
 * Validate and sanitize category
 */
export const validateCategory = (category: string, allowedCategories: string[]): ValidationResult => {
  if (!category || typeof category !== 'string') {
    return { isValid: true, sanitized: 'Other' } // Default
  }
  
  const sanitized = sanitizeString(category, 100)
  
  // Check if category is in allowed list
  if (allowedCategories.includes(sanitized)) {
    return { isValid: true, sanitized }
  }
  
  // If not in list, default to 'Other' but still valid
  return { isValid: true, sanitized: 'Other' }
}

/**
 * Validate and sanitize numeric input (MRP, Quantity, Price)
 */
export const validateNumber = (
  value: string | number | undefined,
  options: {
    min?: number
    max?: number
    allowZero?: boolean
    allowNegative?: boolean
    precision?: number
  } = {}
): ValidationResult => {
  const {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    allowZero = true,
    allowNegative = false,
    precision = 2
  } = options

  // Handle empty/undefined (optional fields)
  if (value === '' || value === undefined || value === null) {
    return { isValid: true, sanitized: 0 }
  }

  // Convert to number
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // Check if valid number
  if (isNaN(numValue) || !isFinite(numValue)) {
    return {
      isValid: false,
      error: 'Invalid number format'
    }
  }

  // Check negative
  if (!allowNegative && numValue < 0) {
    return {
      isValid: false,
      error: 'Value cannot be negative'
    }
  }

  // Check zero
  if (!allowZero && numValue === 0) {
    return {
      isValid: false,
      error: 'Value cannot be zero'
    }
  }

  // Check min/max
  if (numValue < min) {
    return {
      isValid: false,
      error: `Value must be at least ${min}`
    }
  }

  if (numValue > max) {
    return {
      isValid: false,
      error: `Value must be less than ${max.toLocaleString()}`
    }
  }

  // Round to precision
  const sanitized = Math.round(numValue * Math.pow(10, precision)) / Math.pow(10, precision)

  return { isValid: true, sanitized }
}

/**
 * Validate date string
 */
export const validateDate = (
  dateString: string | undefined,
  options: {
    allowPast?: boolean
    allowFuture?: boolean
    minDate?: Date
    maxDate?: Date
  } = {}
): ValidationResult => {
  const {
    allowPast = true,
    allowFuture = true,
    minDate,
    maxDate
  } = options

  // Optional field
  if (!dateString || dateString.trim() === '') {
    return { isValid: true, sanitized: '' }
  }

  // Parse date
  const date = new Date(dateString)
  
  // Check if valid date
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid date format'
    }
  }

  // Check if date is in valid range
  const now = new Date()
  
  if (!allowPast && date < now) {
    return {
      isValid: false,
      error: 'Date cannot be in the past'
    }
  }

  if (!allowFuture && date > now) {
    return {
      isValid: false,
      error: 'Date cannot be in the future'
    }
  }

  if (minDate && date < minDate) {
    return {
      isValid: false,
      error: `Date must be after ${minDate.toLocaleDateString()}`
    }
  }

  if (maxDate && date > maxDate) {
    return {
      isValid: false,
      error: `Date must be before ${maxDate.toLocaleDateString()}`
    }
  }

  // Return ISO date string
  const sanitized = date.toISOString().split('T')[0]
  return { isValid: true, sanitized }
}

/**
 * Validate expiry date (should be in future or reasonable past)
 */
export const validateExpiryDate = (expiryDate: string | undefined): ValidationResult => {
  if (!expiryDate || expiryDate.trim() === '') {
    return { isValid: true, sanitized: '' } // Optional
  }

  const date = new Date(expiryDate)
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid expiry date format'
    }
  }

  // Allow dates up to 10 years in the future
  const maxFutureDate = new Date()
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10)

  if (date > maxFutureDate) {
    return {
      isValid: false,
      error: 'Expiry date cannot be more than 10 years in the future'
    }
  }

  // Allow dates up to 5 years in the past (for expired items)
  const minPastDate = new Date()
  minPastDate.setFullYear(minPastDate.getFullYear() - 5)

  if (date < minPastDate) {
    return {
      isValid: false,
      error: 'Expiry date is too far in the past'
    }
  }

  return { isValid: true, sanitized: date.toISOString().split('T')[0] }
}

/**
 * Validate purchase date
 */
export const validatePurchaseDate = (purchaseDate: string | undefined): ValidationResult => {
  if (!purchaseDate || purchaseDate.trim() === '') {
    // Default to today
    return { isValid: true, sanitized: new Date().toISOString().split('T')[0] }
  }

  const date = new Date(purchaseDate)
  
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      error: 'Invalid purchase date format'
    }
  }

  // Purchase date should not be more than 1 year in the future
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  if (date > maxDate) {
    return {
      isValid: false,
      error: 'Purchase date cannot be more than 1 year in the future'
    }
  }

  // Purchase date should not be more than 10 years in the past
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 10)

  if (date < minDate) {
    return {
      isValid: false,
      error: 'Purchase date is too far in the past'
    }
  }

  return { isValid: true, sanitized: date.toISOString().split('T')[0] }
}

/**
 * Validate medicine object comprehensively
 */
export const validateMedicine = (
  medicine: Partial<Medicine>,
  allowedCategories: string[]
): { isValid: boolean; errors: string[]; sanitized: Partial<Medicine> } => {
  const errors: string[] = []
  const sanitized: Partial<Medicine> = {}

  // Validate name
  const nameValidation = validateMedicineName(medicine.name || '')
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error || 'Invalid name')
  } else {
    sanitized.name = nameValidation.sanitized || 'Unnamed Medicine'
  }

  // Validate category
  const categoryValidation = validateCategory(medicine.category || '', allowedCategories)
  if (!categoryValidation.isValid) {
    errors.push(categoryValidation.error || 'Invalid category')
  } else {
    sanitized.category = categoryValidation.sanitized || 'Other'
  }

  // Validate MRP
  const mrpValidation = validateNumber(medicine.mrp, {
    min: 0,
    max: 1000000,
    allowZero: true,
    allowNegative: false,
    precision: 2
  })
  if (!mrpValidation.isValid) {
    errors.push(`MRP: ${mrpValidation.error}`)
  } else {
    sanitized.mrp = mrpValidation.sanitized as number
  }

  // Validate quantity
  const quantityValidation = validateNumber(medicine.quantity, {
    min: 0,
    max: 1000000,
    allowZero: true,
    allowNegative: false,
    precision: 0
  })
  if (!quantityValidation.isValid) {
    errors.push(`Quantity: ${quantityValidation.error}`)
  } else {
    sanitized.quantity = Math.floor(quantityValidation.sanitized as number)
  }

  // Validate total price invested
  const totalPriceValidation = validateNumber(medicine.totalPriceInvested, {
    min: 0,
    max: 100000000,
    allowZero: true,
    allowNegative: false,
    precision: 2
  })
  if (!totalPriceValidation.isValid) {
    errors.push(`Total Price: ${totalPriceValidation.error}`)
  } else {
    sanitized.totalPriceInvested = totalPriceValidation.sanitized as number
  }

  // Validate dates
  const expiryValidation = validateExpiryDate(medicine.expiryDate)
  if (!expiryValidation.isValid) {
    errors.push(`Expiry Date: ${expiryValidation.error}`)
  } else {
    sanitized.expiryDate = expiryValidation.sanitized || ''
  }

  const purchaseValidation = validatePurchaseDate(medicine.purchaseDate)
  if (!purchaseValidation.isValid) {
    errors.push(`Purchase Date: ${purchaseValidation.error}`)
  } else {
    sanitized.purchaseDate = purchaseValidation.sanitized || new Date().toISOString().split('T')[0]
  }

  // Validate optional fields
  if (medicine.manufacturer) {
    const manufacturerValidation = validateMedicineName(medicine.manufacturer)
    if (manufacturerValidation.isValid) {
      sanitized.manufacturer = manufacturerValidation.sanitized || undefined
    }
  }

  if (medicine.batchNumber) {
    const batchValidation = validateMedicineName(medicine.batchNumber)
    if (batchValidation.isValid) {
      sanitized.batchNumber = batchValidation.sanitized || undefined
    }
  }

  if (medicine.description) {
    const descValidation = validateMedicineName(medicine.description)
    if (descValidation.isValid) {
      sanitized.description = descValidation.sanitized || undefined
    }
  }

  // Validate ID
  if (medicine.id) {
    sanitized.id = String(medicine.id).substring(0, 100)
  } else {
    sanitized.id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Validate usage count
  if (medicine.usageCount !== undefined) {
    const usageValidation = validateNumber(medicine.usageCount, {
      min: 0,
      max: 1000000,
      allowZero: true,
      allowNegative: false,
      precision: 0
    })
    if (usageValidation.isValid) {
      sanitized.usageCount = Math.floor(usageValidation.sanitized as number)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitized as Medicine
  }
}

/**
 * Validate ID to prevent injection attacks
 */
export const validateId = (id: string | undefined): ValidationResult => {
  if (!id || typeof id !== 'string') {
    return {
      isValid: false,
      error: 'ID is required'
    }
  }

  // Only allow alphanumeric, dashes, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return {
      isValid: false,
      error: 'Invalid ID format'
    }
  }

  if (id.length > 100) {
    return {
      isValid: false,
      error: 'ID is too long'
    }
  }

  return { isValid: true, sanitized: id }
}

