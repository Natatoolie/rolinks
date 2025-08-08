"use client"

import { Button } from "@/components/ui/button"
import { Database, Menu, X, Search, User, Settings } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Database className="h-8 w-8 text-yellow-400 mr-2" />
            <span className="text-white text-xl font-bold">RoLinks</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Browse Servers
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Categories
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Community
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search servers..."
              className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
            />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                  Home
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                  Browse Servers
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                  Categories
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors py-2">
                  Community
                </a>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-800">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800 justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}