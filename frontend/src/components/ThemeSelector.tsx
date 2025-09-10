'use client'

import { useState } from 'react'
import { themes, ThemeConfig } from './themes/index'
import { 
  SwatchIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface ThemeSelectorProps {
  currentTheme: string
  currentLayout: string
  onThemeChange: (theme: string) => void
  onLayoutChange: (layout: string) => void
  onClose: () => void
}

export default function ThemeSelector({ 
  currentTheme, 
  currentLayout, 
  onThemeChange, 
  onLayoutChange,
  onClose 
}: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [selectedLayout, setSelectedLayout] = useState(currentLayout)

  const handleApply = () => {
    onThemeChange(selectedTheme)
    onLayoutChange(selectedLayout)
    onClose()
  }

  const themeConfig = themes[selectedTheme]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <SwatchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Theme & Layout Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto flex-1 min-h-0">
          {/* Theme Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Choose Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  className={`
                    relative p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all min-h-[44px]
                    ${selectedTheme === key 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedTheme(key)}
                >
                  {selectedTheme === key && (
                    <div className="absolute top-2 right-2">
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                  
                  {/* Theme Preview */}
                  <div className={`
                    h-20 sm:h-24 rounded-lg mb-2 sm:mb-3 flex items-center justify-center text-xs sm:text-sm font-medium
                    ${key === 'tech' 
                      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                    }
                  `}>
                    {theme.name}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{theme.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{theme.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Layout Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Choose Layout</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {themeConfig.layouts.map((layout) => (
                <div
                  key={layout.value}
                  className={`
                    relative p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all text-center min-h-[80px] sm:min-h-[44px]
                    ${selectedLayout === layout.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setSelectedLayout(layout.value)}
                >
                  {selectedLayout === layout.value && (
                    <div className="absolute top-1 right-1">
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  {/* Layout Preview Icon */}
                  <div className="h-10 sm:h-12 mb-1 sm:mb-2 flex items-center justify-center">
                    {layout.value === 'default' && (
                      <div className="w-6 sm:w-8 h-4 sm:h-6 bg-gray-300 rounded"></div>
                    )}
                    {layout.value === 'title-slide' && (
                      <div className="space-y-1">
                        <div className="w-6 sm:w-8 h-1 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-4 sm:w-6 h-1 bg-gray-400 rounded mx-auto"></div>
                      </div>
                    )}
                    {layout.value === 'two-column' && (
                      <div className="flex space-x-1">
                        <div className="w-2 sm:w-3 h-4 sm:h-6 bg-gray-300 rounded"></div>
                        <div className="w-2 sm:w-3 h-4 sm:h-6 bg-gray-400 rounded"></div>
                      </div>
                    )}
                    {layout.value === 'three-column' && (
                      <div className="flex space-x-1">
                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-300 rounded"></div>
                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-400 rounded"></div>
                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-300 rounded"></div>
                      </div>
                    )}
                    {layout.value === 'image-text' && (
                      <div className="flex space-x-1">
                        <div className="w-3 sm:w-4 h-4 sm:h-6 bg-gray-300 rounded"></div>
                        <div className="w-1.5 sm:w-2 h-4 sm:h-6 bg-gray-400 rounded"></div>
                      </div>
                    )}
                    {layout.value === 'section' && (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="w-3 sm:w-4 h-0.5 bg-gray-400 rounded mx-auto"></div>
                        <div className="w-4 sm:w-6 h-1 bg-gray-300 rounded mx-auto"></div>
                        <div className="w-3 sm:w-4 h-0.5 bg-gray-400 rounded mx-auto"></div>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 text-xs mb-1">{layout.name}</h4>
                  <p className="text-xs text-gray-500 hidden sm:block">{layout.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}