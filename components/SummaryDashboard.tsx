'use client'

import { Medicine } from '@/types/medicine'
import { differenceInDays, isPast, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface SummaryDashboardProps {
  medicines: Medicine[]
}

export default function SummaryDashboard({ medicines }: SummaryDashboardProps) {
  const now = new Date()
  const fifteenDaysAgo = subDays(now, 15)
  const oneMonthAgo = subMonths(now, 1)
  const startOfCurrentMonth = startOfMonth(now)
  const endOfCurrentMonth = endOfMonth(now)

  // Calculate totals
  const totalInvestment = medicines.reduce((sum, m) => sum + (m.totalPriceInvested || 0), 0)
  const totalQuantity = medicines.reduce((sum, m) => sum + (m.quantity || 0), 0)
  const totalMedicines = medicines.length

  // Expiring medicines (within 15 days)
  const expiringSoon = medicines.filter(m => {
    if (!m.expiryDate) return false
    const expiry = new Date(m.expiryDate)
    const daysUntilExpiry = differenceInDays(expiry, now)
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 15
  })

  // Expired medicines
  const expiredMedicines = medicines.filter(m => {
    if (!m.expiryDate) return false
    const expiry = new Date(m.expiryDate)
    return isPast(expiry)
  })

  // Medicines added in last 15 days
  const recentAdditions = medicines.filter(m => {
    if (!m.purchaseDate) return false
    const purchaseDate = new Date(m.purchaseDate)
    return purchaseDate >= fifteenDaysAgo
  })

  // Medicines added this month
  const monthlyAdditions = medicines.filter(m => {
    if (!m.purchaseDate) return false
    const purchaseDate = new Date(m.purchaseDate)
    return purchaseDate >= startOfCurrentMonth && purchaseDate <= endOfCurrentMonth
  })

  // Investment in last 15 days
  const investment15Days = recentAdditions.reduce((sum, m) => sum + (m.totalPriceInvested || 0), 0)

  // Investment this month
  const investmentMonthly = monthlyAdditions.reduce((sum, m) => sum + (m.totalPriceInvested || 0), 0)

  // Category distribution
  const categoryData = medicines.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  // Monthly investment trend (last 6 months)
  const monthlyTrend = []
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i))
    const monthEnd = endOfMonth(subMonths(now, i))
    const monthMedicines = medicines.filter(m => {
      if (!m.purchaseDate) return false
      const purchaseDate = new Date(m.purchaseDate)
      return purchaseDate >= monthStart && purchaseDate <= monthEnd
    })
    monthlyTrend.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      investment: monthMedicines.reduce((sum, m) => sum + (m.totalPriceInvested || 0), 0),
    })
  }

  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6']

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500 mb-1">Total Investment</h3>
          <p className="text-2xl font-bold text-gray-800">₹{totalInvestment.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500 mb-1">Total Medicines</h3>
          <p className="text-2xl font-bold text-gray-800">{totalMedicines}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 mb-1">Total Quantity</h3>
          <p className="text-2xl font-bold text-gray-800">{totalQuantity}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <h3 className="text-sm text-gray-500 mb-1">Expiring Soon</h3>
          <p className="text-2xl font-bold text-gray-800">{expiringSoon.length}</p>
        </div>
      </div>

      {/* 15 Days Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Last 15 Days Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Medicines Added</p>
            <p className="text-2xl font-bold text-primary-600">{recentAdditions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Investment</p>
            <p className="text-2xl font-bold text-primary-600">₹{investment15Days.toFixed(2)}</p>
          </div>
        </div>
        {recentAdditions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Recently Added:</p>
            <div className="space-y-2">
              {recentAdditions.slice(0, 5).map(med => (
                <div key={med.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-800">{med.name}</span>
                  <span className="text-sm font-semibold text-gray-600">₹{med.totalPriceInvested.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Monthly Summary</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Medicines Added This Month</p>
            <p className="text-2xl font-bold text-primary-600">{monthlyAdditions.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Investment</p>
            <p className="text-2xl font-bold text-primary-600">₹{investmentMonthly.toFixed(2)}</p>
          </div>
        </div>
        {monthlyTrend.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Investment Trend (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                <Bar dataKey="investment" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Distribution */}
      {categoryChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Category Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-orange-800 mb-4">⚠️ Expiring Soon (Next 15 Days)</h2>
          <div className="space-y-2">
            {expiringSoon.map(med => {
              if (!med.expiryDate) return null
              const daysUntilExpiry = differenceInDays(new Date(med.expiryDate), now)
              return (
                <div key={med.id} className="flex justify-between items-center p-3 bg-white rounded">
                  <div>
                    <p className="font-semibold text-gray-800">{med.name || 'Unnamed'}</p>
                    <p className="text-sm text-gray-600">
                      Expires: {new Date(med.expiryDate).toLocaleDateString()} ({daysUntilExpiry} days)
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-orange-600">Qty: {med.quantity || 0}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Expired Medicines */}
      {expiredMedicines.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">❌ Expired Medicines</h2>
          <div className="space-y-2">
            {expiredMedicines.map(med => (
              <div key={med.id} className="flex justify-between items-center p-3 bg-white rounded">
                <div>
                  <p className="font-semibold text-gray-800">{med.name || 'Unnamed'}</p>
                  {med.expiryDate && (
                    <p className="text-sm text-gray-600">
                      Expired: {new Date(med.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="text-sm font-semibold text-red-600">Qty: {med.quantity || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

