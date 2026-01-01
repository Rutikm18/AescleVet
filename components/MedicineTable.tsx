'use client'

import { useState, useMemo } from 'react'
import { Medicine } from '@/types/medicine'
import { Edit, Trash2, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'
import { sortByQuantity, getExpiryStatus, searchMedicines } from '@/utils/medicineUtils'
import { VETERINARY_MEDICINE_CATEGORIES } from '@/types/medicine'

interface MedicineTableProps {
  medicines: Medicine[]
  onEdit: (medicine: Medicine) => void
  onDelete: (id: string) => void
  onUse: (id: string) => void
}

const ITEMS_PER_PAGE = 50

export default function MedicineTable({ medicines, onEdit, onDelete, onUse }: MedicineTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortField, setSortField] = useState<'quantity' | 'name' | 'expiryDate' | 'mrp'>('quantity')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter and sort medicines
  const processedMedicines = useMemo(() => {
    let filtered = [...medicines]

    // Search filter
    if (searchQuery) {
      filtered = searchMedicines(filtered, searchQuery)
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(m => m.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'quantity' || sortField === 'mrp') {
        aVal = aVal || 0
        bVal = bVal || 0
      } else if (sortField === 'expiryDate') {
        aVal = a.expiryDate ? new Date(a.expiryDate).getTime() : 0
        bVal = b.expiryDate ? new Date(b.expiryDate).getTime() : 0
      } else {
        aVal = (aVal || '').toString().toLowerCase()
        bVal = (bVal || '').toString().toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })

    // Default: sort by quantity (lowest first) if no other sort
    if (sortField === 'quantity' && sortDirection === 'asc') {
      filtered = sortByQuantity(filtered)
    }

    return filtered
  }, [medicines, searchQuery, selectedCategory, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(processedMedicines.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedMedicines = processedMedicines.slice(startIndex, endIndex)

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  if (medicines.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No medicines added yet.</p>
        <p className="text-gray-400 text-sm mt-2">Click "Add New Medicine" to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              {VETERINARY_MEDICINE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {processedMedicines.length} of {medicines.length} medicines
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Medicine Name <SortIcon field="name" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('quantity')}
              >
                Qty <SortIcon field="quantity" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('mrp')}
              >
                MRP <SortIcon field="mrp" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total</th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('expiryDate')}
              >
                Expiry <SortIcon field="expiryDate" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedMedicines.map((medicine) => {
              const expiryStatus = getExpiryStatus(medicine.expiryDate || '')
              const isLowStock = (medicine.quantity || 0) <= 10
              
              return (
                <tr
                  key={medicine.id}
                  className={`hover:bg-gray-50 ${
                    isLowStock ? 'bg-yellow-50' : ''
                  } ${expiryStatus.status === 'expired' ? 'bg-red-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{medicine.name || 'N/A'}</div>
                    {medicine.manufacturer && (
                      <div className="text-xs text-gray-500">{medicine.manufacturer}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${isLowStock ? 'text-orange-600' : 'text-gray-900'}`}>
                      {medicine.quantity || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹{medicine.mrp?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    ₹{medicine.totalPriceInvested?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-4 py-3">
                    {medicine.expiryDate ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded inline-block mt-1 ${expiryStatus.color}`}>
                          {expiryStatus.label}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No date</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {medicine.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onUse(medicine.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as Used"
                      >
                        <span className="text-xs font-medium">Use</span>
                      </button>
                      <button
                        onClick={() => onEdit(medicine)}
                        className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(medicine.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages} ({processedMedicines.length} items)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

