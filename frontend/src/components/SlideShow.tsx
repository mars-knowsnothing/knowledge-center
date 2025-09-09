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
}

interface SlideShowProps {
  slides: Slide[]
  currentSlide: number
  onSlideChange: (index: number) => void
  className?: string
}

export default function SlideShow({ slides, currentSlide, onSlideChange, className = '' }: SlideShowProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('minimal')
  const [currentLayout, setCurrentLayout] = useState('default')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  if (slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">No slides available</p>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide] || slides[0]
  const ThemeComponent = getTheme(currentTheme).component

  return (
    <div className={`${className}`}>
      <div 
        ref={containerRef}
        className={`relative ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black' 
            : 'w-full aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 shadow-sm'
        }`}
      >
        {/* Slide Content */}
        <div 
          ref={slideRef}
          className="absolute inset-0"
        >
          <ThemeComponent layout={currentLayout} isFullscreen={isFullscreen}>
            {currentSlideData.content}
          </ThemeComponent>
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Theme Selector Button */}
          {!isFullscreen && (
            <button
              onClick={() => setShowThemeSelector(true)}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-black/10 text-gray-700 pointer-events-auto z-50"
            >
              <SwatchIcon className="h-5 w-5" />
            </button>
          )}

          {/* Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 pointer-events-auto z-50">
            {/* Previous Slide */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSlide > 0) onSlideChange(currentSlide - 1)
              }}
              disabled={currentSlide === 0}
              className={`p-2 rounded-full transition-colors ${
                currentSlide === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isFullscreen
                    ? 'hover:bg-white/20 text-white bg-black/20'
                    : 'hover:bg-white/80 text-gray-700 bg-white/60'
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsPlaying(!isPlaying)
              }}
              className={`p-2 rounded-full transition-colors ${
                isFullscreen
                  ? 'hover:bg-white/20 text-white bg-black/20'
                  : 'hover:bg-white/80 text-gray-700 bg-white/60'
              }`}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>

            {/* Next Slide */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSlide < slides.length - 1) onSlideChange(currentSlide + 1)
              }}
              disabled={currentSlide === slides.length - 1}
              className={`p-2 rounded-full transition-colors ${
                currentSlide === slides.length - 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isFullscreen
                    ? 'hover:bg-white/20 text-white bg-black/20'
                    : 'hover:bg-white/80 text-gray-700 bg-white/60'
              }`}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className={`p-2 rounded-full transition-colors ${
                isFullscreen
                  ? 'hover:bg-white/20 text-white bg-black/20'
                  : 'hover:bg-white/80 text-gray-700 bg-white/60'
              }`}
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Slide Counter */}
          <div className={`absolute bottom-4 right-4 text-sm pointer-events-none z-40 px-2 py-1 rounded ${
            isFullscreen 
              ? 'text-white bg-black/20' 
              : 'text-gray-700 bg-white/60'
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
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`flex-shrink-0 w-16 h-12 rounded border-2 text-xs transition-colors ${
                index === currentSlide
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          currentTheme={currentTheme}
          currentLayout={currentLayout}
          onThemeChange={setCurrentTheme}
          onLayoutChange={setCurrentLayout}
          onClose={() => setShowThemeSelector(false)}
        />
      )}
    </div>
  )
}