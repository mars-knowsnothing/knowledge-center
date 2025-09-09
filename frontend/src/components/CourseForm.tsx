'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, CourseCreate, ApiError } from '@/lib/api'
import { 
  XMarkIcon, 
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

interface CourseFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CourseForm({ onClose, onSuccess }: CourseFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data for creating new course
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    author: 'Training Team',
    tags: ''
  })

  // File import data
  const [importData, setImportData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    author: 'Training Team',
    tags: '',
    file: null as File | null
  })

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const courseData: CourseCreate = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        author: formData.author,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }

      const course = await api.createCourse(courseData)
      onSuccess()
      router.push(`/courses/${course.id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to create course')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImportCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!importData.file) {
      setError('Please select a file')
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', importData.file)

      // For ZIP files, we don't need additional metadata as it's included in the ZIP
      // For markdown files, we need to include the metadata (backward compatibility)
      if (importData.file.name.endsWith('.md')) {
        formData.append('title', importData.title)
        formData.append('description', importData.description)
        formData.append('level', importData.level)
        formData.append('author', importData.author)
        formData.append('tags', importData.tags)
      }

      const course = await api.importCourse(formData)
      onSuccess()
      router.push(`/courses/${course.id}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to import course')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!(file.name.endsWith('.md') || file.name.endsWith('.zip'))) {
        setError('Please select a ZIP archive (.zip) or markdown (.md) file')
        return
      }
      setError(null)
      setImportData(prev => ({ ...prev, file }))
      
      // Auto-populate title from filename if empty and it's a markdown file
      if (!importData.title && file.name.endsWith('.md')) {
        const name = file.name.replace('.md', '').replace(/-|_/g, ' ')
        setImportData(prev => ({ 
          ...prev, 
          title: name.charAt(0).toUpperCase() + name.slice(1)
        }))
      }
      
      // For ZIP files, clear the form fields as they're not needed
      if (file.name.endsWith('.zip')) {
        setImportData(prev => ({ 
          ...prev,
          title: '',
          description: '',
          level: 'Beginner',
          author: 'Training Team',
          tags: ''
        }))
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Create New Course
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('create')}
                className={`
                  py-2 px-4 text-sm font-medium border-b-2 focus:outline-none
                  ${activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <DocumentPlusIcon className="h-4 w-4 inline mr-1" />
                Create New
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`
                  py-2 px-4 text-sm font-medium border-b-2 focus:outline-none
                  ${activeTab === 'import'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <DocumentArrowUpIcon className="h-4 w-4 inline mr-1" />
                Import File
              </button>
            </nav>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-2">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Create New Course Tab */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateCourse} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief course description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Course author"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comma-separated tags (e.g., javascript, react, web)"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          )}

          {/* Import File Tab */}
          {activeTab === 'import' && (
            <form onSubmit={handleImportCourse} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course File *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept=".md,.zip"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        ZIP archives (.zip) or Markdown files (.md)
                      </p>
                      {importData.file && (
                        <div className="mt-2">
                          <p className="text-sm text-green-600">
                            Selected: {importData.file.name}
                          </p>
                          {importData.file.name.endsWith('.zip') && (
                            <p className="text-xs text-gray-500 mt-1">
                              ZIP file should contain config.json with course metadata
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show metadata fields only for markdown files */}
                {importData.file && importData.file.name.endsWith('.md') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={importData.title}
                        onChange={(e) => setImportData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter course title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={importData.description}
                        onChange={(e) => setImportData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief course description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <select
                          value={importData.level}
                          onChange={(e) => setImportData(prev => ({ ...prev, level: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={importData.author}
                          onChange={(e) => setImportData(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Course author"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={importData.tags}
                        onChange={(e) => setImportData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Comma-separated tags"
                      />
                    </div>
                  </>
                )}

                {/* Show info for ZIP files */}
                {importData.file && importData.file.name.endsWith('.zip') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <div className="ml-2">
                        <h4 className="text-sm font-medium text-blue-800">ZIP File Import</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          The ZIP file should contain a complete course structure with:
                        </p>
                        <ul className="text-xs text-blue-600 mt-2 list-disc list-inside">
                          <li>config.json - Course metadata (title, description, etc.)</li>
                          <li>slides/ - Directory containing slides.md</li>
                          <li>labs/ - Directory containing lab-*.md files</li>
                          <li>assets/ - Directory for images, videos, etc.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !importData.file || (importData.file.name.endsWith('.md') && (!importData.title || !importData.description))}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Importing...' : 'Import Course'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}