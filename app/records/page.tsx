"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getExpiryStatus, getDaysUntilExpiry, formatDate } from "@/lib/expiry"

type RecordItem = {
  id: number
  name: string
  category: string
  description: string | null
  expiryDate: string
}

const categories = [
  "All",
  "Vendor Contract",
  "Compliance Certificate",
  "Insurance Policy",
  "Safety Training",
  "Machine Inspection",
  "Government License",
  "Service Agreement",
  "Quality Certification",
]

const statusFilters = ["All", "active", "expiring_soon", "expired"]

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  expiring_soon: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
}

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  async function fetchRecords() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryFilter) params.set("category", categoryFilter)

    const res = await fetch(`/api/records?${params.toString()}`)
    const data = await res.json()
    setRecords(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchRecords()
  }, [categoryFilter])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    fetchRecords()
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this record?")) return
    await fetch(`/api/records/${id}`, { method: "DELETE" })
    fetchRecords()
  }

  const filteredRecords = statusFilter
    ? records.filter((r) => getExpiryStatus(new Date(r.expiryDate)) === statusFilter)
    : records

  return (
    <div className="flex flex-col flex-1">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">ExpiryAlert</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/records" className="font-medium text-blue-600">Records</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Records</h2>
          <Link
            href="/records/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Record
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Search
              </button>
            </form>

            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c === "All" ? "" : c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                >
                  {statusFilters.map((s) => (
                    <option key={s} value={s === "All" ? "" : s}>
                      {s === "All" ? "All" : statusLabels[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No records found. Add a record to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Expiry Date</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Days Left</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const expiryDate = new Date(record.expiryDate)
                    const status = getExpiryStatus(expiryDate)
                    const daysLeft = getDaysUntilExpiry(expiryDate)

                    return (
                      <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{record.name}</div>
                          {record.description && (
                            <div className="text-gray-500 text-xs mt-0.5">{record.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{record.category}</td>
                        <td className="px-4 py-3">{formatDate(expiryDate)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
                          >
                            {statusLabels[status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {status === "expired" ? (
                            <span className="text-red-600 font-medium">
                              {Math.abs(daysLeft)} days ago
                            </span>
                          ) : (
                            <span>{daysLeft} days</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link
                              href={`/records/${record.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
