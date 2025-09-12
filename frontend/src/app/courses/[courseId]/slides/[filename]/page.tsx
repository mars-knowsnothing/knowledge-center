'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import SlideShow from "@/components/SlideShow"
import { useState, useEffect } from "react"
import { api, Course, CourseSlides, ApiError } from "@/lib/api"
import Link from "next/link"
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function SlideViewPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; filename: string }> 
}) {
  const { courseId, filename } = use(params)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [slidesData, setSlidesData] = useState<CourseSlides | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchPresentationData() {
      try {
        setLoading(true)
        setError(null)

        const [courseData, slides] = await Promise.all([
          api.getCourse(courseId),
          api.getSpecificSlideFilePresentation(courseId, filename)
        ])

        setCourse(courseData)
        setSlidesData(slides)

      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Course or slides not found' : err.message)
        } else {
          setError('Failed to load presentation')
        }
        console.error('Error fetching presentation data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPresentationData()
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Presentation</h1>
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

  if (!slidesData || !course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Presentation Not Found</h1>
          <p className="text-gray-600">The requested presentation could not be found.</p>
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
                {course.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {slidesData.slides.length} slides
              </p>
            </div>
          </div>
          
          <Link
            href={`/courses/${courseId}/slides/${filename}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Edit Slides
          </Link>
        </div>

        {/* Content */}
        <SlideShow
          slides={slidesData.slides}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
          className="w-full"
        />
      </div>
    </Layout>
  )
}