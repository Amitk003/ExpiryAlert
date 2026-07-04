"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/expiry"

type RecordItem = {
  id: number
  name: string
  category: string
  description: string | null
  expiryDate: string
  status: "active" | "expiring_soon" | "expired"
  daysUntilExpiry: number
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

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  expired: {
    label: "Expired",
    bg: "bg-red-50",
    text: "text-red-800",
    dot: "bg-red-500",
  },
  expiring_soon: {
    label: "Expiring Soon",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
  },
  active: {
    label: "Active",
    bg: "bg-green-50",
    text: "text-green-800",
    dot: "bg-green-500",
  },
}

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

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

  const expired = records.filter((r) => r.status === "expired")
  const expiringSoon = records.filter((r) => r.status === "expiring_soon")
  const active = records.filter((r) => r.status === "active")

  function renderRecordGroup(title: string, groupRecords: RecordItem[], groupStatus: string) {
    if (groupRecords.length === 0) return null

    const config = statusConfig[groupStatus]

    return (
      <div className="mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 ${config.bg} rounded-t-lg border border-b-0 border-gray-200`}>
          <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
          <h3 className={`text-sm font-semibold ${config.text}`}>
            {title} ({groupRecords.length})
          </h3>
        </div>
        <div className="border border-gray-200 rounded-b-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-medium text-gray-600">Name</th>
                <th className="px-4 py-2.5 font-medium text-gray-600">Category</th>
                <th className="px-4 py-2.5 font-medium text-gray-600">Expiry Date</th>
                <th className="px-4 py-2.5 font-medium text-gray-600">Days</th>
                <th className="px-4 py-2.5 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupRecords.map((record) => {
                const expiryDate = new Date(record.expiryDate)

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
                      {record.status === "expired" ? (
                        <span className="text-red-600 font-medium">
                          {Math.abs(record.daysUntilExpiry)}d overdue
                        </span>
                      ) : (
                        <span className={
                          record.daysUntilExpiry <= 7
                            ? "text-red-600 font-medium"
                            : record.daysUntilExpiry <= 14
                            ? "text-yellow-600 font-medium"
                            : "text-gray-600"
                        }>
                          {record.daysUntilExpiry} days
                        </span>
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
      </div>
    )
  }

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
          <h2 className="text-2xl font-semibold">Expiry Tracking</h2>
          <Link
            href="/records/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Record
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">{expired.length}</div>
            <div className="text-sm text-red-600 font-medium">Expired</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">{expiringSoon.length}</div>
            <div className="text-sm text-yellow-600 font-medium">Expiring Soon</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{active.length}</div>
            <div className="text-sm text-green-600 font-medium">Active</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-6">
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
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No records found. Add a record to get started.
          </div>
        ) : (
          <div>
            {renderRecordGroup("Expired", expired, "expired")}
            {renderRecordGroup("Expiring Soon", expiringSoon, "expiring_soon")}
            {renderRecordGroup("Active", active, "active")}
          </div>
        )}
      </main>
    </div>
  )
}
