'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import { themes, getTheme } from './themes'
import ThemeSelector from './ThemeSelector'

interface Slide {
  content: string
  html: string
  metadata?: Record<string, any>
}

interface SlideShowProps {
  slides: Slide[]
  currentSlide: number
  onSlideChange: (index: number) => void
  className?: string
  containerClassName?: string
  isPreview?: boolean
  globalTheme?: string
  globalLayout?: string
  onThemeChange?: (theme: string) => void
  onLayoutChange?: (layout: string) => void
}

export default function SlideShow({ 
  slides, 
  currentSlide, 
  onSlideChange, 
  className = '', 
  containerClassName, 
  isPreview = false,
  globalTheme,
  globalLayout,
  onThemeChange,
  onLayoutChange
}: SlideShowProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(globalTheme || 'minimal')
  const [currentLayout, setCurrentLayout] = useState(globalLayout || 'default')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)

  // Sync with external theme and layout changes
  useEffect(() => {
    if (globalTheme && globalTheme !== currentTheme) {
      setCurrentTheme(globalTheme)
    }
  }, [globalTheme])

  useEffect(() => {
    if (globalLayout && globalLayout !== currentLayout) {
      setCurrentLayout(globalLayout)
    }
  }, [globalLayout])

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      if (currentSlide < slides.length - 1) {
        onSlideChange(currentSlide + 1)
      } else {
        setIsPlaying(false) // Stop at the end
      }
    }, 5000) // 5 seconds per slide

    return () => clearInterval(interval)
  }, [isPlaying, currentSlide, slides.length, onSlideChange])

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentSlide > 0) {
        onSlideChange(currentSlide - 1)
      } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        onSlideChange(currentSlide + 1)
      } else if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [currentSlide, slides.length, onSlideChange, isFullscreen, isPlaying])

  const enterFullscreen = async () => {
    if (containerRef.current && typeof document !== 'undefined') {
      const element = containerRef.current as HTMLElement & {
        requestFullscreen?: () => Promise<void>
      }
      if (element.requestFullscreen) {
        try {
          await element.requestFullscreen()
          setIsFullscreen(true)
        } catch (err) {
          console.error('Failed to enter fullscreen:', err)
        }
      }
    }
  }

  const exitFullscreen = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (err) {
        console.error('Failed to exit fullscreen:', err)
      }
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-scroll to current thumbnail
  useEffect(() => {
    if (thumbnailContainerRef.current && !isFullscreen) {
      const container = thumbnailContainerRef.current
      const thumbnailWidth = 64 + 8 // w-16 + space-x-2
      const containerWidth = container.clientWidth
      const scrollPosition = Math.max(0, (currentSlide * thumbnailWidth) - (containerWidth / 2) + (thumbnailWidth / 2))
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [currentSlide, isFullscreen])

  if (slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">No slides available</p>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide] || slides[0]
  
  // Get theme and layout from slide metadata or fall back to component state
  const slideTheme = currentSlideData?.metadata?.theme || currentTheme
  const slideLayout = currentSlideData?.metadata?.layout || currentLayout
  const ThemeComponent = getTheme(slideTheme).component

  return (
    <div className={`${className}`}>
      <div 
        ref={containerRef}
        className={`relative ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black' 
            : containerClassName || 'w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 shadow-sm'
        }`}
      >
        {/* Slide Content */}
        <div 
          ref={slideRef}
          className="absolute inset-0"
        >
          <ThemeComponent layout={slideLayout} isFullscreen={isFullscreen} isPreview={isPreview}>
            {currentSlideData.content}
          </ThemeComponent>
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Theme Selector Button */}
          {!isFullscreen && (
            <button
              onClick={() => setShowThemeSelector(true)}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/10 text-gray-700 pointer-events-auto z-50 shadow-lg border border-gray-200 bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <SwatchIcon className="h-5 w-5" />
            </button>
          )}

          {/* Navigation Controls */}
          <div className={`absolute ${isPreview ? 'bottom-2' : 'bottom-4'} left-1/2 transform -translate-x-1/2 flex items-center space-x-2 pointer-events-auto z-50`}>
            {/* Previous Slide */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSlide > 0) onSlideChange(currentSlide - 1)
              }}
              disabled={currentSlide === 0}
              className={`${isPreview ? 'p-1' : 'p-2'} rounded-full transition-colors shadow-lg border ${
                currentSlide === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300'
                  : isFullscreen
                    ? 'hover:bg-white/30 text-white bg-black/40 border-white/20 backdrop-blur-sm'
                    : 'hover:bg-white text-gray-700 bg-white/90 border-gray-200 backdrop-blur-sm'
              }`}
            >
              <ChevronLeftIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
            </button>

            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(!isPlaying)
              }}
              className={`${isPreview ? 'p-1' : 'p-2'} rounded-full transition-colors shadow-lg border ${
                isFullscreen
                  ? 'hover:bg-white/30 text-white bg-black/40 border-white/20 backdrop-blur-sm'
                  : 'hover:bg-white text-gray-700 bg-white/90 border-gray-200 backdrop-blur-sm'
              }`}
            >
              {isPlaying ? (
                <PauseIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
              ) : (
                <PlayIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
              )}
            </button>

            {/* Next Slide */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSlide < slides.length - 1) onSlideChange(currentSlide + 1)
              }}
              disabled={currentSlide === slides.length - 1}
              className={`${isPreview ? 'p-1' : 'p-2'} rounded-full transition-colors shadow-lg border ${
                currentSlide === slides.length - 1
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300'
                  : isFullscreen
                    ? 'hover:bg-white/30 text-white bg-black/40 border-white/20 backdrop-blur-sm'
                    : 'hover:bg-white text-gray-700 bg-white/90 border-gray-200 backdrop-blur-sm'
              }`}
            >
              <ChevronRightIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
            </button>

            {/* Fullscreen Toggle - Hide in preview mode */}
            {!isPreview && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className={`${isPreview ? 'p-1' : 'p-2'} rounded-full transition-colors shadow-lg border ${
                  isFullscreen
                    ? 'hover:bg-white/30 text-white bg-black/40 border-white/20 backdrop-blur-sm'
                    : 'hover:bg-white text-gray-700 bg-white/90 border-gray-200 backdrop-blur-sm'
                }`}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
                ) : (
                  <ArrowsPointingOutIcon className={`${isPreview ? 'h-3 w-3' : 'h-5 w-5'}`} />
                )}
              </button>
            )}
          </div>

          {/* Slide Counter */}
          <div className={`absolute ${isPreview ? 'bottom-2 right-1 text-xs px-1 py-0.5' : 'bottom-4 right-4 text-sm px-2 py-1'} pointer-events-none z-40 rounded shadow-lg border ${
            isFullscreen 
              ? 'text-white bg-black/40 border-white/20 backdrop-blur-sm' 
              : 'text-gray-700 bg-white/90 border-gray-200 backdrop-blur-sm'
          }`}>
            {currentSlide + 1} / {slides.length}
          </div>

          {/* Progress Bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 z-30 ${
            isFullscreen ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full transition-all duration-300 ${
                isFullscreen ? 'bg-white' : 'bg-blue-600'
              }`}
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation - Outside main container */}
      {!isFullscreen && (
        <div className="w-full mt-4 px-4">
          <div 
            ref={thumbnailContainerRef}
            className="flex justify-start space-x-2 overflow-x-auto pb-2 px-2 scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => onSlideChange(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg border-2 text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                  index === currentSlide
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 shadow-md'
                }`}
              >
                <div className="w-full h-full rounded flex items-center justify-center">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          currentTheme={currentTheme}
          currentLayout={currentLayout}
          onThemeChange={(theme) => {
            setCurrentTheme(theme)
            // Also notify parent component if callback is provided
            if (onThemeChange) {
              onThemeChange(theme)
            }
          }}
          onLayoutChange={(layout) => {
            setCurrentLayout(layout)
            // Also notify parent component if callback is provided
            if (onLayoutChange) {
              onLayoutChange(layout)
            }
          }}
          onClose={() => setShowThemeSelector(false)}
        />
      )}
    </div>
  )
}