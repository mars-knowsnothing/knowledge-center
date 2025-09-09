'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { api, AllCoursesLabsResponse, LabSummary } from '@/lib/api'
import Link from 'next/link'
import { BeakerIcon, BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function LabsPage() {
  const [labsData, setLabsData] = useState<AllCoursesLabsResponse>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true)
        const data = await api.getAllCoursesLabs()
        setLabsData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch labs')
      } finally {
        setLoading(false)
      }
    }

    fetchLabs()
  }, [])

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
            <div className="text-red-500 text-xl mb-4">Error loading labs</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  const courseNames = Object.keys(labsData)

  if (courseNames.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Labs Available</h2>
            <p className="text-gray-600">There are currently no lab exercises available.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8" style={{width: '90%'}}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BeakerIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Lab Manual</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master skills through hands-on practice. Each lab includes detailed step-by-step guidance and acceptance criteria.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-8">
          {courseNames.map((courseName) => {
            const labs = labsData[courseName]
            const totalLabs = labs.length

            return (
              <div key={courseName} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {formatCourseName(courseName)}
                      </h2>
                      <p className="text-blue-100">
                        {totalLabs} Lab Exercise{totalLabs !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <BookOpenIcon className="h-12 w-12 text-blue-200" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-3">
                    {labs.map((lab: LabSummary) => (
                      <Link
                        key={`${courseName}-${lab.chapter}`}
                        href={`/labs/${courseName}/${lab.chapter}`}
                        className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm group-hover:bg-blue-200">
                              {lab.chapter}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                              {lab.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Lab {lab.chapter}
                            </p>
                          </div>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{courseNames.length}</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {Object.values(labsData).reduce((total, labs) => total + labs.length, 0)}
              </div>
              <div className="text-gray-600">Labs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">100%</div>
              <div className="text-gray-600">Hands-on</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}