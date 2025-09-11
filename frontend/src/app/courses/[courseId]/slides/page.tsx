'use client'

import Layout from "@/components/Layout"
import { useState, useEffect, use } from "react"
import { api, Course, SlideFile, ApiError } from "@/lib/api"
import Link from "next/link"
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useSearchParams, useRouter } from "next/navigation"

export default function CourseSlidesPage({ params }: { params: Promise<{ courseId: string }> }) {
  // Unwrap params Promise using React.use()
  const { courseId } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [slideFiles, setSlideFiles] = useState<SlideFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch course info and slide files in parallel
        const [courseData, slideFilesData] = await Promise.all([
          api.getCourse(courseId),
          api.getCourseSlideFiles(courseId).catch(() => ({ slides: [] }))
        ])

        setCourse(courseData)
        setSlideFiles(slideFilesData.slides || [])

        // Check if we should auto-present the first slide
        const shouldPresent = searchParams.get('present') === 'true'
        if (shouldPresent && slideFilesData.slides && slideFilesData.slides.length > 0) {
          const firstSlide = slideFilesData.slides[0]
          router.push(`/courses/${courseId}/slides/${firstSlide.filename}?mode=presentation`)
          return
        }
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
    }

    fetchCourseData()
  }, [courseId, searchParams, router])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Course not found' ? 'Course Not Found' : 'Error Loading Course'}
          </h1>
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

  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The requested course could not be found.</p>
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
                {course.title} - Slides
              </h1>
              <p className="text-gray-600 mt-1">
                {slideFiles.length} slide files
              </p>
            </div>
          </div>
        </div>

        {/* Slides Grid */}
        {slideFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slideFiles.map((slideFile) => (
              <div key={slideFile.filename} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{slideFile.filename}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{slideFile.title}</h3>
                    <div className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: slideFile.html.length > 150 ? slideFile.html.substring(0, 150) + '...' : slideFile.html 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-2xl ml-4">📄</div>
                </div>
                <div className="flex gap-3">
                  <Link 
                    href={`/courses/${courseId}/slides/${slideFile.filename}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/courses/${courseId}/slides/${slideFile.filename}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Slides Available</h2>
            <p className="text-gray-600">This course doesn&apos;t have any slide files yet. Add slide files to get started.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}