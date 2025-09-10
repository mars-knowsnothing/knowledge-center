'use client'

import Layout from "@/components/Layout"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import { api, Course, Asset, Lab, SlideFile, ApiError } from "@/lib/api"
import { 
  DocumentTextIcon, 
  BeakerIcon, 
  FolderIcon,
  PhotoIcon,
  FilmIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  // Unwrap params Promise using React.use()
  const { courseId } = use(params)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [slideFiles, setSlideFiles] = useState<SlideFile[]>([])
  const [labs, setLabs] = useState<Lab[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadingAsset, setUploadingAsset] = useState(false)

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch all course data in parallel
        const [courseData, slideFilesData, labsData, assetsData] = await Promise.all([
          api.getCourse(courseId),
          api.getCourseSlideFiles(courseId).catch(() => ({ slides: [] })),
          api.getCourseLabs(courseId).catch(() => ({ labs: [] })),
          api.getCourseAssets(courseId).catch(() => ({ assets: [] }))
        ])

        setCourse(courseData)
        setSlideFiles(slideFilesData.slides || [])
        setLabs(labsData.labs || [])
        setAssets(assetsData.assets || [])
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
  }, [courseId])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingAsset(true)
    try {
      const result = await api.uploadCourseAsset(courseId, file)
      setAssets([...assets, result.asset])
      // Reset file input
      event.target.value = ''
    } catch (err) {
      console.error('Error uploading asset:', err)
      alert('Failed to upload asset')
    } finally {
      setUploadingAsset(false)
    }
  }

  const handleDeleteAsset = async (assetPath: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      await api.deleteCourseAsset(courseId, assetPath)
      setAssets(assets.filter(asset => asset.path !== assetPath))
    } catch (err) {
      console.error('Error deleting asset:', err)
      alert('Failed to delete asset')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Course not found' ? 'Course Not Found' : 'Error Loading Course'}
            </h1>
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

  if (!course) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The requested course could not be found.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {course.level && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Level: {course.level}</span>}
            {course.author && <span>Author: {course.author}</span>}
            {course.duration && <span>Duration: {course.duration}</span>}
          </div>
        </div>

        {/* Slides Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Slides</h2>
          </div>
          {slideFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {slideFiles.slice(0, 8).map((slideFile) => (
                <div key={slideFile.filename} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{slideFile.filename}</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{slideFile.title}</h3>
                      <div className="text-xs text-gray-600 mb-3 h-12 overflow-hidden">
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: slideFile.html.length > 100 ? slideFile.html.substring(0, 100) + '...' : slideFile.html 
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-2">
                      <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Link 
                      href={`/courses/${courseId}/slides/${slideFile.filename}?mode=presentation`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Present
                    </Link>
                    <Link 
                      href={`/courses/${courseId}/slides/${slideFile.filename}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {slideFiles.length > 8 && (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center mb-2">+{slideFiles.length - 8} more slides</p>
                  <Link 
                    href={`/courses/${courseId}/slides`}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Slides Available</h3>
              <p className="text-gray-600 mb-4">This course doesn&apos;t have slides yet.</p>
              <Link 
                href={`/courses/${courseId}/edit`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Slides
              </Link>
            </div>
          )}
        </div>

        {/* Labs Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BeakerIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Labs</h2>
          </div>
          {labs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {labs.slice(0, 8).map((lab) => (
                <div key={lab.chapter} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Lab {lab.chapter}</span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{lab.title}</h3>
                      <div className="text-xs text-gray-600 mb-3 h-12 overflow-hidden">
                        {lab.content.substring(0, 100)}...
                      </div>
                    </div>
                    <div className="ml-2">
                      <BeakerIcon className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Link 
                      href={`/labs/${courseId}/${lab.chapter}`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                    >
                      View Lab
                    </Link>
                    <Link 
                      href={`/labs/${courseId}/${lab.chapter}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
              {labs.length > 8 && (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center">
                  <BeakerIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center mb-2">+{labs.length - 8} more labs</p>
                  <Link 
                    href={`/labs/${courseId}`}
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    View All
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <BeakerIcon className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Labs Available</h3>
              <p className="text-gray-600">This course doesn&apos;t have any lab exercises yet.</p>
            </div>
          )}
        </div>

        {/* Assets Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Assets</h2>
            </div>
            <div>
              <input
                type="file"
                id="asset-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploadingAsset}
              />
              <label
                htmlFor="asset-upload"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  uploadingAsset 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                } transition-colors`}
              >
                {uploadingAsset ? 'Uploading...' : '+ Upload Asset'}
              </label>
            </div>
          </div>
          
          {assets.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {assets.map((asset) => (
                  <div key={asset.path} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center flex-1">
                      <div className="mr-3">
                        {asset.type === 'image' ? (
                          <PhotoIcon className="h-6 w-6 text-blue-500" />
                        ) : asset.type === 'video' ? (
                          <FilmIcon className="h-6 w-6 text-purple-500" />
                        ) : (
                          <DocumentIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {asset.type.toUpperCase()} • {formatFileSize(asset.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {asset.can_preview ? (
                        <button
                          onClick={() => window.open(`http://localhost:8000${asset.url}`, '_blank')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          Preview
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-400 rounded cursor-not-allowed"
                        >
                          Preview
                        </button>
                      )}
                      <a
                        href={`http://localhost:8000${asset.url}`}
                        download={asset.name}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDeleteAsset(asset.path)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <FolderIcon className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets</h3>
              <p className="text-gray-600 mb-4">This course doesn&apos;t have any assets yet. Upload images, videos, or documents to get started.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}