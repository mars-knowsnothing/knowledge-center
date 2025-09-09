'use client'

import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

interface TechThemeProps {
  children: ReactNode
  layout?: 'default' | 'two-column' | 'three-column' | 'image-text' | 'title-slide' | 'section'
  backgroundColor?: string
  textColor?: string
  isFullscreen?: boolean
}

export default function TechTheme({ 
  children, 
  layout = 'default',
  backgroundColor = 'from-slate-900 via-purple-900 to-slate-900',
  textColor = 'text-white',
  isFullscreen = false
}: TechThemeProps) {
  
  const renderLayout = (content: ReactNode) => {
    switch (layout) {
      case 'title-slide':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
              <div className="relative z-10">
                {content}
              </div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        )
      
      case 'two-column':
        return (
          <div className="h-full grid grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {content}
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 flex items-center justify-center">
                <div className="text-6xl text-white/20">📊</div>
              </div>
            </div>
          </div>
        )
      
      case 'three-column':
        return (
          <div className="h-full">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Three Column Layout
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-8 h-3/4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-white/10 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-3">Column 1</h3>
                  <div className="text-sm text-gray-300">
                    {content}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl border border-white/10 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold mb-3">Column 2</h3>
                  <div className="text-sm text-gray-300">
                    Content for second column
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-white/10 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-3">Column 3</h3>
                  <div className="text-sm text-gray-300">
                    Content for third column
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'image-text':
        return (
          <div className="h-full grid grid-cols-5 gap-12 items-center">
            <div className="col-span-3">
              <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <div className="relative z-10 text-6xl text-white/30">🖼️</div>
                <div className="absolute bottom-4 left-4 text-sm text-white/50">Image Placeholder</div>
              </div>
            </div>
            <div className="col-span-2 space-y-6">
              {content}
            </div>
          </div>
        )
      
      case 'section':
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl scale-150"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                {content}
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-full flex flex-col justify-center space-y-6">
            {content}
          </div>
        )
    }
  }

  const customComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent" {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className="text-2xl font-semibold mb-4 text-blue-300" {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-xl leading-relaxed mb-4 text-gray-100" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="text-lg space-y-3 text-gray-100" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="flex items-start space-x-3" {...props}>
        <span className="text-blue-400 mt-1">▶</span>
        <span>{props.children}</span>
      </li>
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-slate-800 text-blue-300 px-2 py-1 rounded text-base font-mono border border-slate-700" {...props} />
      ) : (
        <code className="block bg-slate-900 text-green-300 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-700 shadow-inner" {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-2 bg-slate-800/30 rounded-r-lg my-4" {...props} />
    )
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br ${backgroundColor} ${textColor} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/3 rounded-full blur-2xl"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Content */}
      <div className={`relative z-10 h-full ${isFullscreen ? 'p-16' : 'p-12'}`}>
        {renderLayout(
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={customComponents}
          >
            {typeof children === 'string' ? children : ''}
          </ReactMarkdown>
        )}
      </div>
      
      {/* Corner Accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent"></div>
    </div>
  )
}