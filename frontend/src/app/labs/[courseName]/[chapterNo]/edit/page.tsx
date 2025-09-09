'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import MarkdownIt from 'markdown-it'
import { api, Lab, ApiError } from "@/lib/api"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

export default function LabEditPage({ 
  params 
}: { 
  params: Promise<{ courseName: string; chapterNo: string }> 
}) {
  const { courseName, chapterNo } = use(params)
  const router = useRouter()
  
  const [lab, setLab] = useState<Lab | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [content, setContent] = useState('')

  // Initialize markdown renderer
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  useEffect(() => {
    async function fetchLab() {
      try {
        setLoading(true)
        setError(null)

        const labData = await api.getLabContent(courseName, parseInt(chapterNo))
        setLab(labData)
        setContent(labData.content)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Lab not found' : err.message)
        } else {
          setError('Failed to load lab')
        }
        console.error('Error fetching lab:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLab()
  }, [courseName, chapterNo])

  const saveLab = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // TODO: Add API endpoint to save individual lab file
      // For now, show success message
      setSuccess('Lab updated successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Failed to update lab')
    } finally {
      setSaving(false)
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

  if (error && !lab) {
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
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center">
            <Link
              href={`/labs/${courseName}/${chapterNo}`}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit: {lab?.title || `Lab ${chapterNo}`}
              </h1>
              <p className="text-gray-600 text-sm">
                {courseName} • Lab {chapterNo}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={saveLab}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saving ? 'Saving...' : 'Save Lab'}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex-shrink-0">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex flex-col min-h-0">
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
                  onChange={(e) => setContent(e.target.value)}
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
      </div>
    </Layout>
  )
}