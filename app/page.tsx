'use client'

import { useState } from 'react'
import MedicineTable from '@/components/MedicineTable'
import MedicineForm from '@/components/MedicineForm'
import SummaryDashboard from '@/components/SummaryDashboard'
import MostUsedMedicines from '@/components/MostUsedMedicines'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useMedicines } from '@/hooks/useMedicines'
import { Medicine } from '@/types/medicine'
import { formatErrorMessage } from '@/utils/errorHandler'
import { AlertCircle, X } from 'lucide-react'

export default function Home() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine, incrementUsage, error, clearError } = useMedicines()
  const [activeTab, setActiveTab] = useState<'inventory' | 'summary' | 'most-used'>('inventory')
  const [showForm, setShowForm] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null)

  const handleAddMedicine = (medicine: Medicine) => {
    if (editingMedicine) {
      updateMedicine(medicine)
      setEditingMedicine(null)
    } else {
      addMedicine(medicine)
    }
    setShowForm(false)
  }

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setShowForm(true)
  }

  const handleDeleteMedicine = (id: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      deleteMedicine(id)
    }
  }

  const handleUseMedicine = (id: string) => {
    incrementUsage(id)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingMedicine(null)
  }

  const handleSelectMostUsed = (medicine: Medicine) => {
    setEditingMedicine(medicine)
    setShowForm(true)
    setActiveTab('inventory')
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐾</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Veterinary Medicine Management</h1>
                <p className="text-sm text-gray-600">Manage your animal medicine inventory</p>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                <span>Add Medicine</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-4 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => {
              setActiveTab('inventory')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Inventory
          </button>
          <button
            onClick={() => {
              setActiveTab('most-used')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'most-used'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⭐ Most Used
          </button>
          <button
            onClick={() => {
              setActiveTab('summary')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'summary'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Summary
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {showForm && (
          <MedicineForm
            medicine={editingMedicine}
            onSubmit={handleAddMedicine}
            onCancel={handleCancelForm}
          />
        )}

        {!showForm && activeTab === 'inventory' && (
          <MedicineTable
            medicines={medicines}
            onEdit={handleEditMedicine}
            onDelete={handleDeleteMedicine}
            onUse={handleUseMedicine}
          />
        )}

        {!showForm && activeTab === 'most-used' && (
          <MostUsedMedicines
            medicines={medicines}
            onSelect={handleSelectMostUsed}
          />
        )}

        {!showForm && activeTab === 'summary' && (
          <SummaryDashboard medicines={medicines} />
        )}
      </main>
    </div>
    </ErrorBoundary>
  )
}
