'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MarkdownIt from 'markdown-it'
import Layout from "@/components/Layout"
import { api, Course, ApiError, SlidesUpdate, Slide } from '@/lib/api'
import { 
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface CourseEditorProps {
  courseId: string
}

export default function CourseEditor({ courseId }: CourseEditorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editorRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [slidesContent, setSlidesContent] = useState('')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [autoSync, setAutoSync] = useState(true)

  // Initialize markdown renderer
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  // Parse slides content for preview
  const parseSlides = useCallback((content: string): Slide[] => {
    const slides: Slide[] = []
    const slideParts = content.split(/---\s*\n/g)
    
    slideParts.forEach((part, index) => {
      const trimmed = part.trim()
      if (trimmed) {
        slides.push({
          id: `slide-${index + 1}`,
          content: trimmed,
          html: '' // Will be rendered by the preview component
        })
      }
    })
    
    return slides
  }, [])

  const previewSlides = parseSlides(slidesContent)

  const getSlidePositions = useCallback((content: string) => {
    const positions: { start: number; end: number; line: number }[] = []
    const lines = content.split('\n')
    let currentPos = 0
    let slideStart = 0
    let slideStartLine = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.trim() === '---') {
        positions.push({
          start: slideStart,
          end: currentPos - 1,
          line: slideStartLine
        })
        slideStart = currentPos + line.length + 1
        slideStartLine = i + 1
      }
      currentPos += line.length + 1
    }

    // Add the last slide
    if (slideStart < content.length) {
      positions.push({
        start: slideStart,
        end: content.length,
        line: slideStartLine
      })
    }

    return positions
  }, [])

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [courseData, slidesData] = await Promise.all([
        api.getCourse(courseId),
        api.getCourseSlides(courseId)
      ])

      setCourse(courseData)

      // Get raw markdown content by reconstructing it from slides
      const rawContent = slidesData.slides.map(slide => slide.content).join('\n\n---\n\n')
      setSlidesContent(rawContent)

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 404 ? 'Course not found' : err.message)
      } else {
        setError('Failed to load course')
      }
      console.error('Error fetching course data:', err)
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  // Handle initial slide parameter
  useEffect(() => {
    const slideParam = searchParams?.get('slide')
    if (slideParam) {
      const slideIndex = parseInt(slideParam) - 1
      if (slideIndex >= 0 && slideIndex < previewSlides.length) {
        setCurrentSlideIndex(slideIndex)
      }
    }
  }, [searchParams, previewSlides.length])

  // Sync editor cursor to current slide
  useEffect(() => {
    if (autoSync && editorRef.current && slidesContent) {
      const positions = getSlidePositions(slidesContent)
      const currentSlidePos = positions[currentSlideIndex]
      
      if (currentSlidePos) {
        // Focus editor and move cursor to slide start
        const editor = editorRef.current.editor
        if (editor) {
          editor.focus()
          const startLine = currentSlidePos.line
          editor.setCursor({ line: startLine, ch: 0 })
          editor.scrollIntoView({ line: startLine, ch: 0 }, 100)
        }
      }
    }
  }, [currentSlideIndex, autoSync, slidesContent, getSlidePositions])

  const saveSlides = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const slidesUpdate: SlidesUpdate = {
        content: slidesContent
      }

      await api.updateCourseSlides(courseId, slidesUpdate)
      setSuccess('Slides updated successfully!')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to update slides')
      }
    } finally {
      setSaving(false)
    }
  }

  const nextSlide = () => {
    if (currentSlideIndex < previewSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToSlide = (index: number) => {
    if (index >= 0 && index < previewSlides.length) {
      setCurrentSlideIndex(index)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error && !course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Course</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/courses')}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Courses
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Slides: {course?.title}
              </h1>
              <p className="text-gray-600 text-sm">
                {previewSlides.length} slides • Slide {currentSlideIndex + 1} of {previewSlides.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="mr-2"
              />
              Auto-sync cursor
            </label>
            <button
              onClick={saveSlides}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? 'Saving...' : 'Save Slides'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex-shrink-0">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Half - Preview */}
          <div className="h-1/2 border border-gray-200 rounded-lg mb-4 bg-white overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Slide Preview</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {/* Slide selector */}
                  <select
                    value={currentSlideIndex}
                    onChange={(e) => goToSlide(parseInt(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    {previewSlides.map((_, index) => (
                      <option key={index} value={index}>
                        Slide {index + 1}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={nextSlide}
                    disabled={currentSlideIndex === previewSlides.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 p-6 overflow-auto">
                {previewSlides.length > 0 ? (
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: md.render(previewSlides[currentSlideIndex]?.content || '') 
                    }} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No slides to preview</p>
                      <p className="text-sm mt-1">Add content below to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Half - Editor */}
          <div className="h-1/2 border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Markdown Editor</h3>
                <div className="text-xs text-gray-500">
                  Use <code className="bg-gray-200 px-1 py-0.5 rounded">---</code> to separate slides
                </div>
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  ref={editorRef}
                  value={slidesContent}
                  onChange={(e) => setSlidesContent(e.target.value)}
                  className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
                  placeholder="Write your course slides in markdown..."
                  spellCheck={false}
                  style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.5',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}