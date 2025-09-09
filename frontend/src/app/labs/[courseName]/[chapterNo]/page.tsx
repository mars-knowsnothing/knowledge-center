'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Layout from '@/components/Layout'
import { api, Lab } from '@/lib/api'
import Link from 'next/link'
import { 
  BeakerIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface PageProps {
  params: Promise<{ courseName: string; chapterNo: string }>
}

export default function LabDetailPage({ params }: PageProps) {
  const { courseName, chapterNo } = use(params)
  const [lab, setLab] = useState<Lab | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLabContent = async () => {
      try {
        setLoading(true)
        const data = await api.getLabContent(courseName, parseInt(chapterNo))
        setLab(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lab content')
      } finally {
        setLoading(false)
      }
    }

    if (courseName && chapterNo) {
      fetchLabContent()
    }
  }, [courseName, chapterNo])

  const formatCourseName = (courseName: string) => {
    return courseName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading lab content</div>
            <p className="text-gray-600">{error}</p>
            <Link
              href={`/labs/${courseName}`}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              返回课程实验列表
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (!lab) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lab Not Found</h2>
            <p className="text-gray-600">The requested lab could not be found.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8" style={{width: '85%'}}>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/labs" className="hover:text-blue-600">
            Lab Manual
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <Link href={`/labs/${courseName}`} className="hover:text-blue-600">
            {formatCourseName(courseName)}
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="text-gray-900 font-medium">
            Lab {lab.chapter}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {lab.chapter}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lab.title}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>Estimated time: 45-60 minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BeakerIcon className="h-4 w-4" />
                  <span>Lab {lab.chapter}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>{formatCourseName(courseName)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Rendered HTML Content */}
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: lab.html }}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href={`/labs/${courseName}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Course Labs
          </Link>

          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200">
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Mark Complete
            </button>
            
            {/* Next Lab Link - You might want to implement this with actual next lab data */}
            <Link
              href={`/labs/${courseName}/${parseInt(chapterNo) + 1}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Next Lab
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Lab Info Sidebar */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Lab Number:</span>
              <div className="text-gray-600">Lab {lab.chapter}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Course:</span>
              <div className="text-gray-600">{formatCourseName(courseName)}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Lab Type:</span>
              <div className="text-gray-600">Hands-on Practice</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}