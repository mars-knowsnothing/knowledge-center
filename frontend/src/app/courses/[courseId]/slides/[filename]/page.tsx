'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import SlideShow from "@/components/SlideShow"
import { useState, useEffect } from "react"
import { api, SlideFile, ApiError } from "@/lib/api"
import Link from "next/link"
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function SlideViewPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; filename: string }> 
}) {
  const { courseId, filename } = use(params)
  
  const [slideFile, setSlideFile] = useState<SlideFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  
  // Always use presentation mode
  const [currentSlide, setCurrentSlide] = useState(0)

  // Parse slides from file content (same as edit page)
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
      html: actualContent, // Will be processed by SlideShow
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

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
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

  if (!slideFile) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Slide Not Found</h1>
          <p className="text-gray-600">The requested slide file could not be found.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href={`/courses/${courseId}`}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {slideFile?.title || 'Slide Presentation'}
              </h1>
              <p className="text-gray-600 mt-1">
                {filename} {slides.length > 1 && `• ${slides.length} slides`}
              </p>
            </div>
          </div>
          
          <Link
            href={`/courses/${courseId}/slides/${filename}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Edit Slide
          </Link>
        </div>

        {/* Content */}
        <SlideShow
          slides={slides}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          className="w-full"
        />
      </div>
    </Layout>
  )
}