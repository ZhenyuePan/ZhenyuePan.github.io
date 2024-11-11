'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: '关于', href: '/about' },
    { name: '联系', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${isScrolled ? 'bg-white bg-opacity-80 shadow-md' : 'bg-white bg-opacity-80 shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-blue-600' : 'text-blue-600'}`}>Kafka&apos;s Blog</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  : 'text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-20'
              } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
            >
              <span className="sr-only">打开主菜单</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isScrolled ? 'bg-white' : 'bg-white'}`}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20 hover:text-blue-200'
                  }`} 
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}