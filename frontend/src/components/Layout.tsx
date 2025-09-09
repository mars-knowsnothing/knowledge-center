'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import Link from 'next/link'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  BookOpenIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to true for desktop

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </LayoutContext.Provider>
  )
}

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Courses', href: '/courses', icon: BookOpenIcon },
  { name: 'Labs', href: '/labs', icon: BeakerIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export default function Layout({ children }: LayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useLayout()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                type="button"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                {sidebarOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Training System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome back!
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 ease-in-out border-r border-gray-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="h-full flex flex-col">
          <div className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
              >
                <item.icon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out pt-16
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}