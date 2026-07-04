"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
          ExpiryAlert
        </Link>

        <nav className="flex items-center gap-4 text-sm shrink-0">
          <Link
            href="/"
            className={pathname === "/" ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}
          >
            Dashboard
          </Link>
          <Link
            href="/records"
            className={pathname.startsWith("/records") ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}
          >
            Records
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-xs ml-auto">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </header>
  )
}
