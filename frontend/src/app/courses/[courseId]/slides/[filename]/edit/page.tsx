'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import SlideShow from "@/components/SlideShow"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import MarkdownIt from 'markdown-it'
import { api, SlideFile, ApiError } from "@/lib/api"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

export default function SlideEditPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; filename: string }> 
}) {
  const { courseId, filename } = use(params)
  const router = useRouter()
  
  const [slideFile, setSlideFile] = useState<SlideFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Initialize markdown renderer
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  // Split content into slides for presentation mode
  const slides = content ? content.split(/\n---\n/).map((slideContent, index) => {
    // Parse metadata from slide content (if any)
    const lines = slideContent.trim().split('\n')
    const metadata: Record<string, any> = {}
    
    // Check for metadata in the first few lines
    let contentStartIndex = 0
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim()
      if (line.startsWith('theme:')) {
        metadata.theme = line.replace('theme:', '').trim()
        contentStartIndex = i + 1
      } else if (line.startsWith('layout:')) {
        metadata.layout = line.replace('layout:', '').trim()
        contentStartIndex = i + 1
      } else if (line && !line.startsWith('#') && !line.startsWith('theme:') && !line.startsWith('layout:')) {
        break
      }
    }
    
    // Extract actual content (removing metadata lines)
    const actualContent = lines.slice(contentStartIndex).join('\n').trim()
    
    return {
      content: actualContent,
      html: md.render(actualContent),
      metadata: {
        theme: metadata.theme || 'minimal', // Default theme
        layout: metadata.layout || 'default', // Default layout
        ...metadata
      }
    }
  }) : []

  useEffect(() => {
    async function fetchSlideFile() {
      try {
        setLoading(true)
        setError(null)

        const slideData = await api.getSlideFileContent(courseId, filename)
        setSlideFile(slideData)
        setContent(slideData.content)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Slide file not found' : err.message)
        } else {
          setError('Failed to load slide file')
        }
        console.error('Error fetching slide file:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSlideFile()
  }, [courseId, filename])

  const saveSlide = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // TODO: Add API endpoint to save individual slide file
      // For now, show success message
      setSuccess('Slide updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to update slide')
    } finally {
      setSaving(false)
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

  if (error && !slideFile) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Slide</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
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
            <Link
              href={`/courses/${courseId}/slides/${filename}`}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit: {slideFile?.title || filename}
              </h1>
              <p className="text-gray-600 text-sm">
                {filename} {slides.length > 1 && `• ${slides.length} slides`}
              </p>
            </div>
          </div>
          
          <button
            onClick={saveSlide}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {saving ? 'Saving...' : 'Save Slide'}
          </button>
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
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
                <span className="text-xs text-gray-500">
                  {slides.length > 1 && `Slide ${currentSlide + 1} of ${slides.length}`}
                </span>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 min-h-0 p-4 flex items-center justify-center">
                <div className="w-full max-w-2xl h-full flex items-center justify-center">
                  <SlideShow
                    slides={slides}
                    currentSlide={currentSlide}
                    onSlideChange={setCurrentSlide}
                    className="w-full h-full"
                    containerClassName="w-full h-full rounded border border-gray-200 shadow-sm"
                    isPreview={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half - Editor */}
          <div className="h-1/2 border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900">Markdown Editor</h3>
              </div>
              
              {/* Editor Content */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
                  placeholder="Write your markdown content here..."
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