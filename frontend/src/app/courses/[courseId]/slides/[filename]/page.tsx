'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import SlideShow from "@/components/SlideShow"
import { useState, useEffect } from "react"
import { api, SlideFile, ApiError } from "@/lib/api"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline'
import MarkdownIt from 'markdown-it'

export default function SlideViewPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; filename: string }> 
}) {
  const { courseId, filename } = use(params)
  const searchParams = useSearchParams()
  
  const [slideFile, setSlideFile] = useState<SlideFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if mode=presentation is in URL params, default to document mode
  const initialMode = searchParams?.get('mode') === 'presentation' ? 'presentation' : 'document'
  const [viewMode, setViewMode] = useState<'document' | 'presentation'>(initialMode)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Split content into slides based on '---' separator
  const slides = slideFile?.content ? slideFile.content.split(/\n---\n/).map((content) => {
    // Use MarkdownIt to render each slide
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })
    
    return {
      content: content.trim(),
      html: md.render(content.trim())
    }
  }) : []

  useEffect(() => {
    async function fetchSlideFile() {
      try {
        setLoading(true)
        setError(null)

        const slideData = await api.getSlideFileContent(courseId, filename)
        setSlideFile(slideData)
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
                {slideFile.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {filename} {slides.length > 1 && `• ${slides.length} slides`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('document')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'document'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Document
              </button>
              <button
                onClick={() => setViewMode('presentation')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  viewMode === 'presentation'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <PresentationChartBarIcon className="h-4 w-4" />
                Presentation
              </button>
            </div>
            <Link
              href={`/courses/${courseId}/slides/${filename}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Edit Slide
            </Link>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'presentation' ? (
          <SlideShow
            slides={slides}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
            className="w-full"
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: slideFile.html }} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}