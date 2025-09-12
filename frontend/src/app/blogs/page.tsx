'use client'

import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import { api, BlogConfig, ApiError } from "@/lib/api"
import Link from "next/link"
import { ClockIcon, UserIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true)
        setError(null)
        const response = await api.getBlogs()
        setBlogs(response.blogs)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Failed to load blogs')
        }
        console.error('Error fetching blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blogs</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Articles</h1>
          <p className="text-gray-600">
            Explore the latest technical insights, learning experiences, and industry trends
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`}>
                <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full hover:border-blue-300 group">
                  {/* Cover Image Placeholder */}
                  {blog.coverImage ? (
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all">
                      <span className="text-white text-4xl">📝</span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group-hover:bg-blue-200 transition-colors">
                        {blog.category}
                      </span>
                      {blog.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors">
                      {blog.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1 mb-4 flex-wrap">
                      <TagIcon className="h-4 w-4 text-gray-400" />
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{blog.tags.length - 3}</span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span className="font-medium">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{blog.readingTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{new Date(blog.publishDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Blog Articles Yet</h2>
            <p className="text-gray-600">
              We're preparing exciting content, stay tuned!
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}