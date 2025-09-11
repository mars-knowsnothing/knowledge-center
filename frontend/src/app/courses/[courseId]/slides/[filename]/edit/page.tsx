'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import SlideShow from "@/components/SlideShow"
import MarkdownEditor from "@/components/MarkdownEditor"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from 'next/navigation'
import MarkdownIt from 'markdown-it'
import frontmatter from 'front-matter'
import { api, SlideFile, TempSlideFile, ApiError } from "@/lib/api"
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

// Parse slides function (mirrors backend logic)
function parseSlides(content: string, globalMetadata: Record<string, any> = {}, md: MarkdownIt) {
  if (!content.trim()) return []
  
  // Parse frontmatter from the entire content
  const parsedContent = frontmatter(content)
  const globalMeta = { ...globalMetadata, ...parsedContent.attributes }
  const mainContent = parsedContent.body
  
  // If no global theme/layout found in frontmatter, use defaults
  if (!globalMeta.theme) globalMeta.theme = 'tech'
  if (!globalMeta.layout) globalMeta.layout = 'default'
  
  // Split on --- that appear on their own line (but not the frontmatter separator)
  const parts = mainContent.split(/\n---\n/)
  
  const slides: any[] = []
  let i = 0
  let firstSlideInheritsGlobal = true
  
  while (i < parts.length) {
    const part = parts[i].trim()
    if (!part) {
      i++
      continue
    }
    
    let metadata = {}
    let contentPart = ""
    
    // Check if this part looks like YAML metadata
    const isYamlMetadata = (text: string) => {
      if (!text || !text.includes(':')) return false
      if (text.trim().startsWith('#')) return false
      
      const lines = text.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#') && !trimmed.match(/^[a-zA-Z_][a-zA-Z0-9_-]*\s*:/)) {
          return false
        }
      }
      return true
    }
    
    if (isYamlMetadata(part)) {
      // This is metadata, next part should be content
      try {
        const yamlParsed = frontmatter(`---\n${part}\n---\n`)
        metadata = yamlParsed.attributes || {}
      } catch {
        metadata = {}
      }
      
      // Get the content from the next part
      if (i + 1 < parts.length) {
        contentPart = parts[i + 1].trim()
        i += 2
      } else {
        i += 1
        continue
      }
    } else {
      // This is content without metadata
      contentPart = part
      
      // If this is the first slide and it doesn't have metadata, inherit global metadata
      if (firstSlideInheritsGlobal && slides.length === 0) {
        metadata = { ...globalMeta }
      }
      
      i += 1
    }
    
    firstSlideInheritsGlobal = false
    
    // Skip empty content
    if (!contentPart || !contentPart.trim()) {
      continue
    }
    
    // Clean up content
    const contentLines = contentPart.split('\n')
    while (contentLines.length && !contentLines[0].trim()) {
      contentLines.shift()
    }
    while (contentLines.length && !contentLines[contentLines.length - 1].trim()) {
      contentLines.pop()
    }
    contentPart = contentLines.join('\n')
    
    if (!contentPart) continue
    
    // Ensure every slide has theme and layout
    if (!metadata.theme) metadata.theme = globalMeta.theme
    if (!metadata.layout) metadata.layout = globalMeta.layout
    
    const slide = {
      id: `slide-${slides.length + 1}`,
      content: contentPart,
      html: md.render(contentPart),
      metadata: metadata
    }
    slides.push(slide)
  }
  
  return slides
}

export default function SlideEditPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; filename: string }> 
}) {
  const { courseId, filename } = use(params)
  const router = useRouter()
  
  // Core state
  const [originalSlideFile, setOriginalSlideFile] = useState<SlideFile | null>(null)
  const [tempSlideFile, setTempSlideFile] = useState<TempSlideFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // UI state
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [globalTheme, setGlobalTheme] = useState('minimal')
  const [globalLayout, setGlobalLayout] = useState('default')

  // Content state
  const [content, setContent] = useState('')

  // Initialize markdown renderer
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  // Parse slides using the same logic as backend
  const slides = content ? parseSlides(content, { theme: globalTheme, layout: globalLayout }, md) : []

  // Use ref to store latest temp file info to avoid stale closure issues
  const tempSlideFileRef = useRef<TempSlideFile | null>(null)
  const savingRef = useRef(false)
  const isInitializedRef = useRef(false)
  
  // Update refs when state changes
  useEffect(() => {
    tempSlideFileRef.current = tempSlideFile
  }, [tempSlideFile])
  
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
      const currentTempFile = tempSlideFileRef.current
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
        console.log('Auto-saving temp file:', currentTempFile.id)
        await api.updateTempSlideFile(currentTempFile.id, { content: newContent })
        // Note: We don't clear hasUnsavedChanges here because content is only saved to temp file
        // hasUnsavedChanges tracks unpublished changes, not auto-saved changes
        console.log('Auto-save to temp file successful')
      } catch (err) {
        // Only log error if the temp file should still exist (not during publish)
        if (!currentSaving) {
          console.error('Auto-save failed for temp file:', currentTempFile.id, err)
          
          // If temp file was lost (server restart), recreate it
          if (err instanceof ApiError && err.status === 404) {
            console.log('Temp file lost, attempting to recreate...')
            try {
              const newTempFile = await api.createTempSlideFile({
                originalFilename: filename,
                content: newContent,
                courseId: courseId
              })
              setTempSlideFile(newTempFile)
              setIsInitialized(true)
              console.log('Temp file recreated successfully:', newTempFile.id)
            } catch (recreateErr) {
              console.error('Failed to recreate temp file:', recreateErr)
              setTempSlideFile(null)
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
  }, [tempSlideFile, filename, courseId])
  
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

        // Load original slide file
        const slideData = await api.getSlideFileContent(courseId, filename)
        setOriginalSlideFile(slideData)
        
        // Use the complete content from backend (includes frontmatter)
        setContent(slideData.content)

        // Extract global theme and layout from metadata
        let extractedTheme = 'tech'
        let extractedLayout = 'default'
        
        if (slideData.metadata && Object.keys(slideData.metadata).length > 0) {
          if (slideData.metadata.theme) {
            extractedTheme = slideData.metadata.theme
          }
          if (slideData.metadata.layout) {
            extractedLayout = slideData.metadata.layout
          }
        }
        
        setGlobalTheme(extractedTheme)
        setGlobalLayout(extractedLayout)

        // Create temporary file for editing
        const tempFile = await api.createTempSlideFile({
          originalFilename: filename,
          content: slideData.content,
          courseId: courseId
        })
        setTempSlideFile(tempFile)
        setIsInitialized(true)
        console.log('Edit session initialized with temp file:', tempFile.id)

      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Slide file not found' : err.message)
        } else {
          setError('Failed to load slide file')
        }
        console.error('Error initializing edit session:', err)
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
      if (tempSlideFile) {
        // Use sendBeacon for cleanup on page unload
        navigator.sendBeacon(`/api/slides/temp/${tempSlideFile.id}`, JSON.stringify({ _method: 'DELETE' }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [courseId, filename])

  // Publish changes to original file
  const publishChanges = async () => {
    if (!tempSlideFile) {
      console.error('Cannot publish: no temporary file available')
      setError('No temporary file available for publishing')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Store the current temp file ID before we start
    const currentTempFileId = tempSlideFile.id
    
    try {
      // Cancel any pending auto-save operations
      if (debouncedSaveRef.current) {
        (debouncedSaveRef.current as any).cancel?.()
      }
      
      // Wait a moment to let any pending auto-saves complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      await api.commitTempSlideFile(currentTempFileId)
      setSuccess('Changes published successfully! Course content has been updated.')
      setHasUnsavedChanges(false)
      
      // Clear temp file state since it's been committed and deleted
      setTempSlideFile(null)
      setIsInitialized(false)
      
      // Wait before creating new temp file to ensure clean state
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Create a new temp file for continued editing with current content
      try {
        const newTempFile = await api.createTempSlideFile({
          originalFilename: filename,
          content: content,
          courseId: courseId
        })
        setTempSlideFile(newTempFile)
        setIsInitialized(true)
        console.log('New temp file created for continued editing:', newTempFile.id)
      } catch (tempErr) {
        console.error('Failed to create new temp file:', tempErr)
        setError('Published successfully, but failed to create new editing session. Please refresh the page.')
      }
      
      setTimeout(() => setSuccess(null), 5000)
      console.log('Publish successful - temp file cleaned up')
    } catch (err) {
      console.error('Publish failed:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to publish changes')
      }
    } finally {
      setSaving(false)
    }
  }

  // Discard changes and return to view mode
  const discardChanges = async () => {
    if (!tempSlideFile) return

    try {
      await api.deleteTempSlideFile(tempSlideFile.id)
      router.push(`/courses/${courseId}/slides/${filename}`)
    } catch (err) {
      console.error('Error discarding changes:', err)
      // Navigate anyway
      router.push(`/courses/${courseId}/slides/${filename}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error && !originalSlideFile) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Slide</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href={`/courses/${courseId}`}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </div>
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
              href={`/courses/${courseId}/slides/${filename}`}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Editing: {originalSlideFile?.title || filename}
                </h1>
                <p className="text-sm text-gray-500">
                  {tempSlideFile && (
                    <>
                      {slides.length} slide{slides.length !== 1 ? 's' : ''} • 
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
              disabled={saving || !hasUnsavedChanges || !tempSlideFile || !isInitialized}
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
            // Preview Mode - Full slideshow functionality
            <div className="h-full flex flex-col p-6">
              <SlideShow
                slides={slides}
                currentSlide={currentSlide}
                onSlideChange={setCurrentSlide}
                className="w-full h-full"
                globalTheme={globalTheme}
                globalLayout={globalLayout}
                onThemeChange={setGlobalTheme}
                onLayoutChange={setGlobalLayout}
              />
            </div>
          ) : (
            // Edit Mode - Markdown editor
            <div className="h-full p-6">
              <MarkdownEditor
                value={content}
                onChange={handleContentChange}
                onSave={publishChanges}
                className="h-full"
                showPreview={isPreviewMode}
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}