"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import { formatDate, getExpiryStatus, getDaysUntilExpiry } from "@/lib/expiry"

type RecordItem = {
  id: number
  name: string
  category: string
  description: string | null
  expiryDate: string
  status: "active" | "expiring_soon" | "expired"
  daysUntilExpiry: number
}

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

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    async function fetchResults() {
      setLoading(true)
      const params = new URLSearchParams()
      if (query) params.set("search", query)
      if (categoryFilter) params.set("category", categoryFilter)
      if (statusFilter) params.set("status", statusFilter)

      const res = await fetch(`/api/records?${params.toString()}`)
      const data = await res.json()
      setRecords(data)
      setLoading(false)
    }

    if (query) {
      fetchResults()
    } else {
      setRecords([])
      setLoading(false)
    }
  }, [query, categoryFilter, statusFilter])

  return (
    <div className="flex flex-col flex-1">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {query ? (
              <>Search results for &ldquo;{query}&rdquo;</>
            ) : (
              "Search Records"
            )}
          </h2>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {records.length} record{records.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 flex gap-4 flex-wrap">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c === "All" ? "" : c}>{c}</option>
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
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Searching...</div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {query
              ? "No records match your search. Try different keywords."
              : "Enter a search term to find records."}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Expiry Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Days</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
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
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[record.status]}`}
                        >
                          {statusLabels[record.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {record.status === "expired" ? (
                          <span className="text-red-600 font-medium">
                            {Math.abs(record.daysUntilExpiry)}d overdue
                          </span>
                        ) : (
                          <span className="text-gray-600">{record.daysUntilExpiry} days</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/records/${record.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
          <p className="text-gray-500">Loading search...</p>
        </main>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
