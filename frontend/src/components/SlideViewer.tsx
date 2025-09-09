'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayIcon, 
  PauseIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PencilIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getTheme } from './themes/index'
import ThemeSelector from './ThemeSelector'

interface Slide {
  id: string
  content: string
  html: string
}

interface SlideViewerProps {
  slides: Slide[]
  courseTitle?: string
  courseId?: string
  hideEditButton?: boolean
  theme?: string
  layout?: string
}

export default function SlideViewer({ slides, courseTitle, courseId, hideEditButton, theme = 'minimal', layout = 'default' }: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(theme)
  const [currentLayout, setCurrentLayout] = useState(layout)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          previousSlide()
          break
        case 'ArrowRight':
        case ' ':
          nextSlide()
          break
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen()
          }
          break
        case 'F11':
          event.preventDefault()
          toggleFullscreen()
          break
      }
    }

    if (isPresenting) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPresenting, currentSlide, isFullscreen])

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
  }

  const previousSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  const togglePresentation = () => {
    setIsPresenting(!isPresenting)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No slides available
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]
  const ThemeComponent = getTheme(currentTheme).component

  return (
    <div className={`
      ${isPresenting ? 'fixed inset-0 z-50 bg-black' : 'relative'}
    `}>
      {/* Presentation Mode */}
      {isPresenting ? (
        <div className="h-full flex flex-col">
          {/* Slide Content */}
          <div className="flex-1 flex items-center justify-center p-8 pb-20">
            <div className="w-[90%] h-[85vh] rounded-lg shadow-2xl overflow-hidden">
              <ThemeComponent layout={currentLayout}>
                {currentSlideData.content}
              </ThemeComponent>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-black bg-opacity-75 text-white px-6 py-3 rounded-full">
              <button
                onClick={previousSlide}
                disabled={currentSlide === 0}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <span className="text-sm px-4">
                {currentSlide + 1} / {slides.length}
              </span>
              
              <button
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              
              <div className="w-px h-6 bg-white bg-opacity-30 mx-2" />
              
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-5 w-5" />
                ) : (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={togglePresentation}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <PauseIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowThemeSelector(true)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <SwatchIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {courseTitle || 'Course Slides'}
              </h2>
              <p className="text-gray-600 mt-1">
                Slide {currentSlide + 1} of {slides.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowThemeSelector(true)}
                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <SwatchIcon className="h-4 w-4 mr-2" />
                Theme
              </button>
              {courseId && !hideEditButton && (
                <Link
                  href={`/courses/${courseId}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit Course
                </Link>
              )}
              <button
                onClick={togglePresentation}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Present
              </button>
            </div>
          </div>

          {/* Slide Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Markdown Source */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Markdown Source</h3>
              </div>
              <div className="p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded overflow-x-auto">
                  {currentSlideData.content}
                </pre>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Preview ({currentTheme} - {currentLayout})</h3>
              </div>
              <div className="p-4">
                <div className="h-64 overflow-hidden rounded border border-gray-100">
                  <div className="transform scale-50 origin-top-left w-[200%] h-[200%]">
                    <ThemeComponent layout={currentLayout}>
                      {currentSlideData.content}
                    </ThemeComponent>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={previousSlide}
              disabled={currentSlide === 0}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`
                    w-3 h-3 rounded-full transition-colors
                    ${index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}
                  `}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
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