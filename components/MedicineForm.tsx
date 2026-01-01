'use client'

import { useState, useEffect } from 'react'
import { Medicine, VETERINARY_MEDICINE_CATEGORIES } from '@/types/medicine'
import { X, AlertCircle } from 'lucide-react'
import { searchMedicineSuggestions, getPopularMedicines } from '@/services/medicineSearch'
import { sanitizeString, validateMedicine } from '@/utils/validation'

interface MedicineFormProps {
  medicine?: Medicine | null
  onSubmit: (medicine: Medicine) => void
  onCancel: () => void
}

export default function MedicineForm({ medicine, onSubmit, onCancel }: MedicineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    mrp: '',
    quantity: '',
    expiryDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    totalPriceInvested: '',
    manufacturer: '',
    batchNumber: '',
    description: '',
  })

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        category: medicine.category || '',
        mrp: medicine.mrp?.toString() || '',
        quantity: medicine.quantity?.toString() || '',
        expiryDate: medicine.expiryDate || '',
        purchaseDate: medicine.purchaseDate || new Date().toISOString().split('T')[0],
        totalPriceInvested: medicine.totalPriceInvested?.toString() || '',
        manufacturer: medicine.manufacturer || '',
        batchNumber: medicine.batchNumber || '',
        description: medicine.description || '',
      })
    } else {
      // Show popular medicines when form opens
      setSuggestions(getPopularMedicines())
      setShowSuggestions(true)
    }
  }, [medicine])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeString(e.target.value, 200)
    setFormData({ ...formData, name: value })
    
    if (value.length >= 1) {
      const results = searchMedicineSuggestions(value, 10)
      setSuggestions(results)
      setShowSuggestions(true)
    } else {
      setSuggestions(getPopularMedicines())
      setShowSuggestions(true)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setFormData({ ...formData, name: suggestion })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const calculateTotalPrice = () => {
    const mrp = parseFloat(formData.mrp) || 0
    const quantity = parseInt(formData.quantity) || 0
    return mrp * quantity
  }

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    try {
      // Validate and sanitize all inputs

      const mrp = parseFloat(formData.mrp) || 0
      const quantity = parseInt(formData.quantity) || 0
      const totalPriceInvested = formData.totalPriceInvested 
        ? parseFloat(formData.totalPriceInvested) 
        : calculateTotalPrice()

      const medicineData: Partial<Medicine> = {
        id: medicine?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: formData.name || 'Unnamed Medicine',
        category: formData.category || 'Other',
        mrp: mrp || 0,
        quantity: quantity || 0,
        expiryDate: formData.expiryDate || '',
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
        totalPriceInvested: totalPriceInvested || 0,
        manufacturer: formData.manufacturer || undefined,
        batchNumber: formData.batchNumber || undefined,
        description: formData.description || undefined,
        usageCount: medicine?.usageCount || 0,
        lastUsed: medicine?.lastUsed || undefined,
      }

      const validation = validateMedicine(medicineData, VETERINARY_MEDICINE_CATEGORIES)
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors)
        return
      }

      onSubmit(validation.sanitized)
    } catch (error) {
      console.error('Form submission error:', error)
      setValidationErrors(['Failed to submit form. Please check your inputs.'])
    }
  }

  const handleMRPOrQuantityChange = (field: 'mrp' | 'quantity', value: string) => {
    setFormData({ ...formData, [field]: value })
    // Auto-calculate total price if both fields are filled
    if (field === 'mrp' && formData.quantity) {
      const newMRP = parseFloat(value) || 0
      const qty = parseInt(formData.quantity) || 0
      setFormData(prev => ({ ...prev, totalPriceInvested: (newMRP * qty).toString() }))
    } else if (field === 'quantity' && formData.mrp) {
      const mrp = parseFloat(formData.mrp) || 0
      const newQty = parseInt(value) || 0
      setFormData(prev => ({ ...prev, totalPriceInvested: (mrp * newQty).toString() }))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {medicine ? 'Edit Medicine' : 'Add New Medicine'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medicine Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            onFocus={() => {
              if (formData.name.length < 1) {
                setSuggestions(getPopularMedicines())
                setShowSuggestions(true)
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Start typing to search..."
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-primary-50 border-b last:border-b-0 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select category (optional)</option>
            {VETERINARY_MEDICINE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* MRP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MRP (₹)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => handleMRPOrQuantityChange('mrp', e.target.value)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleMRPOrQuantityChange('quantity', e.target.value)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Total Price Invested */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Price Invested (₹)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.totalPriceInvested}
            onChange={(e) => setFormData({ ...formData, totalPriceInvested: e.target.value })}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            placeholder="Auto-calculated (MRP × Quantity)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer
          </label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Optional"
          />
        </div>

        {/* Batch Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch Number
          </label>
          <input
            type="text"
            value={formData.batchNumber}
            onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Optional"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description / Notes
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Optional notes, animal type, dosage, etc."
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-1">Validation Errors</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {medicine ? 'Update Medicine' : 'Add Medicine'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
