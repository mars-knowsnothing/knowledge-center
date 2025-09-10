'use client'

import Layout from "@/components/Layout"
import CourseForm from "@/components/CourseForm"
import Link from "next/link"
import { BookOpenIcon, ClockIcon, UserIcon, PlusIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { api, Course, ApiError } from "@/lib/api"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const coursesData = await api.getCourses()
      setCourses(coursesData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to fetch courses')
      }
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    fetchCourses() // Refresh the courses list
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">
              Browse our collection of interactive training courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <BookOpenIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Courses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600 mt-2">
              Browse our collection of interactive training courses
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{course.slides_count} slides</span>
                    {course.level && (
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{course.title}</h3>
                  <div className="text-xs text-gray-600 mb-3 h-12 overflow-hidden">
                    {course.description.length > 100 ? course.description.substring(0, 100) + '...' : course.description}
                  </div>
                  <div className="h-6 flex items-center text-xs text-gray-500">
                    {course.duration && (
                      <>
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{course.duration}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link 
                  href={`/courses/${course.id}`}
                  className="flex-1 inline-flex items-center justify-center px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  View Course
                </Link>
                <Link 
                  href={`/courses/${course.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {courses.length === 0 && (
          <div className="text-center py-16">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">
              Check back later for new training courses.
            </p>
          </div>
        )}

        {/* Course Creation Form Modal */}
        {showCreateForm && (
          <CourseForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        )}
      </div>
    </Layout>
  )
}