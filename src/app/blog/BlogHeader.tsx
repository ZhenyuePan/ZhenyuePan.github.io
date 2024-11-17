'use client'

import { Button } from "@/components/ui/button"
import { MenuIcon, SearchIcon } from 'lucide-react'

export default function BlogHeader() {
  return (
    <header className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400 animate-fade-in">
        Digital Chronicles
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8 animate-slide-up">
        Venture into the digital realm where code meets creativity
      </p>
      <div className="flex justify-center gap-4 animate-fade-in-delay">
        <Button variant="outline" className="bg-white border-blue-400 text-blue-600 hover:bg-blue-50">
          <SearchIcon className="mr-2 h-4 w-4" />
          Search Archives
        </Button>
        <Button variant="outline" className="bg-white border-blue-400 text-blue-600 hover:bg-blue-50">
          <MenuIcon className="mr-2 h-4 w-4" />
          Categories
        </Button>
      </div>
    </header>
  )
}