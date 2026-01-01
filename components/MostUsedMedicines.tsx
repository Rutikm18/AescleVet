'use client'

import { Medicine } from '@/types/medicine'
import { getMostUsedMedicines } from '@/utils/medicineUtils'
import { TrendingUp } from 'lucide-react'

interface MostUsedMedicinesProps {
  medicines: Medicine[]
  onSelect: (medicine: Medicine) => void
}

export default function MostUsedMedicines({ medicines, onSelect }: MostUsedMedicinesProps) {
  const mostUsed = getMostUsedMedicines(medicines, 10)

  if (mostUsed.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary-500" size={24} />
          Most Used Medicines
        </h2>
        <p className="text-gray-500 text-center py-4">
          No usage data yet. Start using medicines to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="text-primary-500" size={24} />
        Most Used Medicines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mostUsed.map((medicine, index) => (
          <div
            key={medicine.id}
            onClick={() => onSelect(medicine)}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md cursor-pointer transition-all bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{medicine.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{medicine.category}</p>
              </div>
              <div className="ml-2 flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                <span className="text-xs font-bold">#{index + 1}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-primary-600">{medicine.usageCount}</span> uses
              </div>
              <div className="text-xs text-gray-500">
                Qty: <span className="font-semibold">{medicine.quantity || 0}</span>
              </div>
            </div>
            {medicine.lastUsed && (
              <div className="text-xs text-gray-400 mt-1">
                Last used: {new Date(medicine.lastUsed).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

