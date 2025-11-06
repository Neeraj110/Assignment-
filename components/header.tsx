"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">HD</span>
          </div>
          <div className="text-sm font-semibold">
            <div>Highway</div>
            <div className="text-xs text-gray-600">delite</div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#ffd700",
                color: "black",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6c200")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffd700")}
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 shrink-0">
          <Link
            href="/bookings"
            className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            My Bookings
          </Link>
        </nav>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-gray-700">R</span>
        </div>
      </div>
    </header>
  )
}
