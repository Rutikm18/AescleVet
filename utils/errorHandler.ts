/**
 * Error handling utilities
 * Centralized error handling with logging and user-friendly messages
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public userMessage?: string
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400, `Invalid input: ${field || 'unknown field'}`)
    this.name = 'ValidationError'
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR', 500, 'Failed to save data. Please try again.')
    this.name = 'StorageError'
  }
}

/**
 * Safe JSON parse with error handling
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    const parsed = JSON.parse(jsonString)
    return parsed as T
  } catch (error) {
    console.error('JSON parse error:', error)
    return fallback
  }
}

/**
 * Safe localStorage operations with error handling
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(key)
    } catch (error) {
      console.error('localStorage getItem error:', error)
      return null
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      
      // Check storage quota
      const currentSize = new Blob([localStorage.getItem(key) || '']).size
      const newSize = new Blob([value]).size
      const estimatedSize = new Blob([localStorage]).size + newSize - currentSize
      
      // localStorage limit is typically 5-10MB
      if (estimatedSize > 5 * 1024 * 1024) {
        throw new StorageError('Storage quota exceeded. Please delete some data.')
      }
      
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      if (error instanceof StorageError) {
        throw error
      }
      console.error('localStorage setItem error:', error)
      throw new StorageError('Failed to save data. Storage may be full.')
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('localStorage removeItem error:', error)
      return false
    }
  }
}

/**
 * Error boundary error handler
 */
export const handleError = (error: unknown, context?: string): AppError => {
  console.error(`Error in ${context || 'unknown context'}:`, error)

  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      'An unexpected error occurred. Please try again.'
    )
  }

  return new AppError(
    'Unknown error',
    'UNKNOWN_ERROR',
    500,
    'An unexpected error occurred. Please try again.'
  )
}

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AppError && error.userMessage) {
    return error.userMessage
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

