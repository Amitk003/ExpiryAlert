"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"

const categories = [
  "Vendor Contract",
  "Compliance Certificate",
  "Insurance Policy",
  "Safety Training",
  "Machine Inspection",
  "Government License",
  "Service Agreement",
  "Quality Certification",
]

export default function EditRecordPage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState({
    name: "",
    category: categories[0],
    description: "",
    expiryDate: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadRecord() {
      const res = await fetch(`/api/records/${params.id}`)
      if (res.ok) {
        const record = await res.json()
        setFormData({
          name: record.name,
          category: record.category,
          description: record.description || "",
          expiryDate: new Date(record.expiryDate).toISOString().split("T")[0],
        })
      } else {
        setError("Record not found")
      }
      setLoading(false)
    }
    loadRecord()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.expiryDate) {
      setError("Name and expiry date are required")
      return
    }

    setSaving(true)

    const res = await fetch(`/api/records/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push("/records")
    } else {
      const data = await res.json()
      setError(data.error || "Failed to update record")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
          <p className="text-gray-500">Loading...</p>
        </main>
      </div>
    )
  }

  if (error && !formData.name) {
    return (
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
          <p className="text-red-600">{error}</p>
          <Link href="/records" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
            &larr; Back to Records
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <Link href="/records" className="text-sm text-blue-600 hover:text-blue-800">
            &larr; Back to Records
          </Link>
          <h2 className="text-2xl font-semibold mt-2">Edit Record</h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Record"}
            </button>
            <Link
              href="/records"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
