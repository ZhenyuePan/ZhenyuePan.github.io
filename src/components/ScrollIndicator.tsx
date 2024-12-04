import React from 'react'
import { ChevronDown } from 'lucide-react'

interface ScrollIndicatorProps {
  onClick: () => void
}

export default function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg animate-blur"
      aria-label="Scroll down"
    >
      <ChevronDown className="w-6 h-6 text-blue-800" />
    </button>
  )
}


