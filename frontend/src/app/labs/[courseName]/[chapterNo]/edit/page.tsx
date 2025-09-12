'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from 'next/navigation'
import MarkdownIt from 'markdown-it'
import { api, Lab, TempLabFile, ApiError } from "@/lib/api"
import { debounce } from "@/lib/utils"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PlayIcon,
  CloudArrowUpIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function LabEditPage({ 
  params 
}: { 
  params: Promise<{ courseName: string; chapterNo: string }> 
}) {
  const { courseName, chapterNo } = use(params)
  const router = useRouter()
  
  // Core state
  const [originalLab, setOriginalLab] = useState<Lab | null>(null)
  const [tempLabFile, setTempLabFile] = useState<TempLabFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // UI state
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  // Content state
  const [content, setContent] = useState('')

  // Initialize markdown renderer
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  // Use ref to store latest temp file info to avoid stale closure issues
  const tempLabFileRef = useRef<TempLabFile | null>(null)
  const savingRef = useRef(false)
  const isInitializedRef = useRef(false)
  
  // Update refs when state changes
  useEffect(() => {
    tempLabFileRef.current = tempLabFile
  }, [tempLabFile])
  
  useEffect(() => {
    savingRef.current = saving
  }, [saving])
  
  useEffect(() => {
    isInitializedRef.current = isInitialized
  }, [isInitialized])

  // Debounced auto-save function (saves to temp file only)
  const debouncedSaveRef = useRef<Function | null>(null)
  
  // Create a new debounced function each time temp file changes to avoid stale closures
  useEffect(() => {
    debouncedSaveRef.current = debounce(async (newContent: string) => {
      // Use refs to get current values and avoid stale closures
      const currentTempFile = tempLabFileRef.current
      const currentSaving = savingRef.current
      const currentInitialized = isInitializedRef.current
      
      if (!currentInitialized) {
        console.warn('Auto-save skipped: not initialized yet')
        return
      }
      if (!currentTempFile) {
        console.warn('Auto-save skipped: no temp file available')
        return
      }
      if (currentSaving) {
        console.warn('Auto-save skipped: publish in progress')
        return
      }
      
      try {
        console.log('Auto-saving temp lab file:', currentTempFile.id)
        await api.updateTempLabFile(currentTempFile.id, { content: newContent })
        console.log('Auto-save to temp lab file successful')
      } catch (err) {
        // Only log error if the temp file should still exist (not during publish)
        if (!currentSaving) {
          console.error('Auto-save failed for temp lab file:', currentTempFile.id, err)
          
          // If temp file was lost (server restart), recreate it
          if (err instanceof ApiError && err.status === 404) {
            console.log('Temp lab file lost, attempting to recreate...')
            try {
              const newTempFile = await api.createTempLabFile({
                originalFilename: `lab-${chapterNo}.md`,
                content: newContent,
                courseId: courseName
              })
              setTempLabFile(newTempFile)
              setIsInitialized(true)
              console.log('Temp lab file recreated successfully:', newTempFile.id)
            } catch (recreateErr) {
              console.error('Failed to recreate temp lab file:', recreateErr)
              setTempLabFile(null)
              setIsInitialized(false)
            }
          }
        }
      }
    }, 2000) // Auto-save every 2 seconds
    
    return () => {
      // Cancel previous debounced function when temp file changes
      if (debouncedSaveRef.current) {
        (debouncedSaveRef.current as any).cancel?.()
      }
    }
  }, [tempLabFile, courseName, chapterNo])
  
  const debouncedSave = useCallback((newContent: string) => {
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current(newContent)
    }
  }, [])

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setHasUnsavedChanges(true)
    debouncedSave(newContent)
  }

  // Initialize edit session
  useEffect(() => {
    async function initializeEditSession() {
      try {
        setLoading(true)
        setError(null)

        // Load original lab
        const labData = await api.getLabContent(courseName, parseInt(chapterNo))
        setOriginalLab(labData)
        setContent(labData.content)

        // Create temporary file for editing
        const tempFile = await api.createTempLabFile({
          originalFilename: `lab-${chapterNo}.md`,
          content: labData.content,
          courseId: courseName
        })
        setTempLabFile(tempFile)
        setIsInitialized(true)
        console.log('Lab edit session initialized with temp file:', tempFile.id)

      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Lab not found' : err.message)
        } else {
          setError('Failed to load lab')
        }
        console.error('Error initializing lab edit session:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeEditSession()

    // Cleanup: delete temp file on page unload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    const handleUnload = () => {
      if (tempLabFile) {
        // Use sendBeacon for cleanup on page unload
        navigator.sendBeacon(`/api/labs/temp/${tempLabFile.id}`, JSON.stringify({ _method: 'DELETE' }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [courseName, chapterNo])

  // Publish changes to original file
  const publishChanges = async () => {
    if (!tempLabFile) {
      console.error('Cannot publish: no temporary lab file available')
      setError('No temporary lab file available for publishing')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Store the current temp file ID before we start
    const currentTempFileId = tempLabFile.id
    
    try {
      // Cancel any pending auto-save operations
      if (debouncedSaveRef.current) {
        (debouncedSaveRef.current as any).cancel?.()
      }
      
      // Wait a moment to let any pending auto-saves complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await api.commitTempLabFile(currentTempFileId)
      setSuccess('Lab updated successfully! Content has been published.')
      setHasUnsavedChanges(false)
      
      // Clear temp file state since it's been committed and deleted
      setTempLabFile(null)
      setIsInitialized(false)
      
      // Wait before creating new temp file to ensure clean state
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Create a new temp file for continued editing with current content
      try {
        const newTempFile = await api.createTempLabFile({
          originalFilename: `lab-${chapterNo}.md`,
          content: content,
          courseId: courseName
        })
        setTempLabFile(newTempFile)
        setIsInitialized(true)
        console.log('New temp lab file created for continued editing:', newTempFile.id)
      } catch (tempErr) {
        console.error('Failed to create new temp lab file:', tempErr)
        setError('Published successfully, but failed to create new editing session. Please refresh the page.')
      }
      
      setTimeout(() => setSuccess(null), 5000)
      console.log('Lab publish successful - temp file cleaned up')
    } catch (err) {
      console.error('Lab publish failed:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to publish lab changes')
      }
    } finally {
      setSaving(false)
    }
  }

  // Discard changes and return to view mode
  const discardChanges = async () => {
    if (!tempLabFile) return

    try {
      await api.deleteTempLabFile(tempLabFile.id)
      router.push(`/labs/${courseName}/${chapterNo}`)
    } catch (err) {
      console.error('Error discarding lab changes:', err)
      // Navigate anyway
      router.push(`/labs/${courseName}/${chapterNo}`)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error && !originalLab) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Lab</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/labs/${courseName}`}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Labs
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center">
            <Link
              href={`/labs/${courseName}/${chapterNo}`}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Editing: {originalLab?.title || `Lab ${chapterNo}`}
                </h1>
                <p className="text-sm text-gray-500">
                  {tempLabFile && (
                    <>
                      {courseName} • Lab {chapterNo} • 
                      {hasUnsavedChanges ? ' Unpublished changes' : ' All changes auto-saved'}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Preview Toggle */}
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isPreviewMode
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlayIcon className="h-4 w-4" />
              <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
            </button>

            {/* Publish Button */}
            <button
              onClick={publishChanges}
              disabled={saving || !hasUnsavedChanges || !tempLabFile || !isInitialized}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              <span>{saving ? 'Publishing...' : 'Publish'}</span>
            </button>

            {/* Discard Button */}
            <button
              onClick={discardChanges}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Discard</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex-shrink-0">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {isPreviewMode ? (
            // Preview Mode - Full lab preview
            <div className="h-full p-6">
              <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">Lab Preview</h3>
                    <div className="text-sm text-gray-500">
                      Chapter {chapterNo} • {courseName}
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="flex-1 p-8 overflow-auto">
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: md.render(content) 
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode - Split layout with markdown editor
            <div className="h-full flex flex-col p-6">
              {/* Top Half - Preview */}
              <div className="h-1/2 border border-gray-200 rounded-lg mb-4 bg-white overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">Lab Preview</h3>
                    <div className="text-xs text-gray-500">
                      Chapter {chapterNo}
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div className="flex-1 p-6 overflow-auto">
                    <div className="prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: md.render(content) 
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Half - Editor */}
              <div className="h-1/2 border border-gray-200 rounded-lg bg-white overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">Markdown Editor</h3>
                    <div className="text-xs text-gray-500">
                      Edit lab content and instructions
                    </div>
                  </div>
                  
                  {/* Editor Content */}
                  <div className="flex-1 overflow-hidden">
                    <textarea
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="w-full h-full p-4 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
                      placeholder="Write your lab content in markdown..."
                      spellCheck={false}
                      style={{ 
                        fontSize: '14px', 
                        lineHeight: '1.5',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}