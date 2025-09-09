'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Layout from '@/components/Layout'
import { api, CourseLabsResponse, Lab } from '@/lib/api'
import Link from 'next/link'
import { BeakerIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PageProps {
  params: Promise<{ courseName: string }>
}

export default function CourseLabsPage({ params }: PageProps) {
  const { courseName } = use(params)
  const [labsData, setLabsData] = useState<CourseLabsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourseLabs = async () => {
      try {
        setLoading(true)
        const data = await api.getCourseLabs(courseName)
        setLabsData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course labs')
      } finally {
        setLoading(false)
      }
    }

    if (courseName) {
      fetchCourseLabs()
    }
  }, [courseName])

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
            <div className="text-red-500 text-xl mb-4">Error loading course labs</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!labsData || labsData.labs.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Labs Available</h2>
            <p className="text-gray-600">There are currently no lab exercises for this course.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8" style={{width: '90%'}}>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/labs" className="hover:text-blue-600">
            Lab Manual
          </Link>
          <ChevronRightIcon className="h-4 w-4" />
          <span className="text-gray-900 font-medium">
            {formatCourseName(courseName)}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BeakerIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              {formatCourseName(courseName)}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {labsData.labs.length} Lab Exercise{labsData.labs.length !== 1 ? 's' : ''} - Step by step mastery of core skills
          </p>
        </div>

        {/* Labs List */}
        <div className="space-y-6">
          {labsData.labs.map((lab: Lab, index) => (
            <div key={lab.chapter} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {lab.chapter}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {lab.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Lab {lab.chapter}
                        </p>
                      </div>
                    </div>
                    
                    {/* Lab Description Preview */}
                    <div className="text-gray-600 mb-4">
                      <p className="line-clamp-2">
                        {/* Extract first paragraph or objective from content */}
                        {lab.content.split('\\n').find(line => line.includes('Lab Objective') || line.includes('##'))?.replace(/#+/g, '').trim() || 
                         'Master related skills and knowledge through hands-on practice'}
                      </p>
                    </div>

                    {/* Lab Metadata */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>Estimated time: 45-60 minutes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BeakerIcon className="h-4 w-4" />
                        <span>Lab type: Hands-on practice</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Progress: {index + 1} / {labsData.labs.length}
                      </div>
                      <Link
                        href={`/labs/${courseName}/${lab.chapter}`}
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        Start Lab
                        <ChevronRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 bg-gray-100">
                <div 
                  className="h-1 bg-blue-600 transition-all duration-300"
                  style={{ width: `${((index + 1) / labsData.labs.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/labs"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Lab List
          </Link>
          
          {labsData.labs.length > 0 && (
            <Link
              href={`/labs/${courseName}/${labsData.labs[0].chapter}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Start First Lab
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Layout>
  )
}