'use client'

import { use } from 'react'
import Layout from "@/components/Layout"
import { useState, useEffect } from "react"
import { api, BlogPost, ApiError } from "@/lib/api"
import Link from "next/link"
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline'

export default function BlogDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params)
  
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setLoading(true)
        setError(null)
        const post = await api.getBlogPost(slug)
        setBlogPost(post)
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 404 ? 'Blog post not found' : err.message)
        } else {
          setError('Failed to load blog post')
        }
        console.error('Error fetching blog post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-20 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
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
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Blog post not found' ? 'Blog Post Not Found' : 'Loading Error'}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blog List
          </Link>
        </div>
      </Layout>
    )
  }

  if (!blogPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">The requested blog post does not exist.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white">
        {/* Back Button */}
        <div className="mb-6 pt-4">
          <Link
            href="/blogs"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blog List
          </Link>
        </div>

        {/* Article Header */}
        <header className="relative mb-12">
          {/* Hero Section with Gradient Background */}
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full opacity-40 translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              {/* Category and Featured Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg">
                  {blogPost.config.category}
                </span>
                {blogPost.config.featured && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                    ⭐ Featured Article
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                {blogPost.config.title}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-4xl">
                {blogPost.config.description}
              </p>

              {/* Author Card */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">{blogPost.config.author}</div>
                  <div className="text-gray-600">Knowledge Center Team</div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{new Date(blogPost.config.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
                  <ClockIcon className="h-5 w-5 text-green-500" />
                  <span className="font-medium">{blogPost.config.readingTime}</span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <TagIcon className="h-5 w-5" />
                  <span>Tags:</span>
                </div>
                {blogPost.config.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm border border-white/50 text-gray-800 hover:bg-white hover:border-gray-200 transition-all duration-200 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="mt-8 bg-white px-6 py-8 rounded-lg shadow-sm border border-gray-100">
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: blogPost.html }}
          />
        </article>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 px-6 py-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: {new Date(blogPost.config.lastModified).toLocaleDateString('en-US')}
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              View More Articles
            </Link>
          </div>
        </footer>
      </div>
    </Layout>
  )
}