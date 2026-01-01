'use client'

import { Medicine } from '@/types/medicine'
import { Edit, Trash2, AlertTriangle } from 'lucide-react'
import { differenceInDays, isPast, isToday, isFuture } from 'date-fns'

interface MedicineListProps {
  medicines: Medicine[]
  onEdit: (medicine: Medicine) => void
  onDelete: (id: string) => void
}

export default function MedicineList({ medicines, onEdit, onDelete }: MedicineListProps) {
  const getExpiryStatus = (expiryDate: string) => {
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

  const sortedMedicines = [...medicines].sort((a, b) => {
    const dateA = new Date(a.expiryDate).getTime()
    const dateB = new Date(b.expiryDate).getTime()
    return dateA - dateB
  })

  if (medicines.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No medicines added yet.</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add New Medicine" to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedMedicines.map((medicine) => {
        const expiryStatus = getExpiryStatus(medicine.expiryDate)
        return (
          <div
            key={medicine.id}
            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-500"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{medicine.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(medicine)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => onDelete(medicine.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Expiry Alert */}
            {(expiryStatus.status === 'expired' || expiryStatus.status === 'expiring') && (
              <div className={`mb-3 p-2 rounded-lg border flex items-center gap-2 ${expiryStatus.color}`}>
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">{expiryStatus.label}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">MRP:</span>
                <span className="ml-2 font-semibold text-gray-800">₹{medicine.mrp.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Quantity:</span>
                <span className="ml-2 font-semibold text-gray-800">{medicine.quantity}</span>
              </div>
              <div>
                <span className="text-gray-500">Total Invested:</span>
                <span className="ml-2 font-semibold text-gray-800">₹{medicine.totalPriceInvested.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Expiry Date:</span>
                <span className="ml-2 font-semibold text-gray-800">
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {medicine.manufacturer && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="text-gray-500">Manufacturer:</span> {medicine.manufacturer}
              </div>
            )}

            {medicine.batchNumber && (
              <div className="mt-1 text-sm text-gray-600">
                <span className="text-gray-500">Batch:</span> {medicine.batchNumber}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

