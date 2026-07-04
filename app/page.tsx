"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/expiry"

type DashboardData = {
  total: number
  active: number
  expiringSoon: number
  expired: number
  upcoming: Array<{
    id: number
    name: string
    category: string
    daysUntilExpiry: number
    expiryDate: string
  }>
  recentlyExpired: Array<{
    id: number
    name: string
    category: string
    daysOverdue: number
    expiryDate: string
  }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/stats")
      const d = await res.json()
      setData(d)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="flex flex-col flex-1">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">ExpiryAlert</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="font-medium text-blue-600">Dashboard</Link>
            <Link href="/records" className="text-gray-600 hover:text-gray-900">Records</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
        ) : !data || data.total === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Welcome to ExpiryAlert</h2>
            <p className="text-gray-600 mb-6">
              No records yet. Add your first record to start tracking expiry dates.
            </p>
            <Link
              href="/records/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Add Your First Record
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{data.total}</div>
                <div className="text-sm text-gray-500">Total Records</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-700">{data.active}</div>
                <div className="text-sm text-green-600 font-medium">Active</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-700">{data.expiringSoon}</div>
                <div className="text-sm text-yellow-600 font-medium">Expiring Soon</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-700">{data.expired}</div>
                <div className="text-sm text-red-600 font-medium">Expired</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h3>
                  <Link href="/records" className="text-sm text-blue-600 hover:text-blue-800">
                    View all
                  </Link>
                </div>

                {data.upcoming.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
                    No records expiring soon.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.upcoming.map((record) => (
                      <Link
                        key={record.id}
                        href={`/records/${record.id}/edit`}
                        className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-yellow-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.name}</div>
                            <div className="text-xs text-gray-500">{record.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-yellow-700">
                              {record.daysUntilExpiry}d
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(new Date(record.expiryDate))}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Recently Expired</h3>
                  <Link href="/records" className="text-sm text-blue-600 hover:text-blue-800">
                    View all
                  </Link>
                </div>

                {data.recentlyExpired.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
                    No recently expired records.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.recentlyExpired.map((record) => (
                      <Link
                        key={record.id}
                        href={`/records/${record.id}/edit`}
                        className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-red-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.name}</div>
                            <div className="text-xs text-gray-500">{record.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-red-700">
                              {record.daysOverdue}d overdue
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(new Date(record.expiryDate))}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
