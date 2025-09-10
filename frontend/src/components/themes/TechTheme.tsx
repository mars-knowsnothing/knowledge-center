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
  isPreview?: boolean
}

export default function TechTheme({ 
  children, 
  layout = 'default',
  backgroundColor = 'from-slate-900 via-purple-900 to-slate-900',
  textColor = 'text-white',
  isFullscreen = false,
  isPreview = false
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
        const twoColumnParts = (typeof children === 'string' ? children : '').split('::right::')
        const leftContent = twoColumnParts[0] || ''
        const rightContent = twoColumnParts[1] || ''
        
        // Extract title from left content (first line that starts with #)
        const leftLines = leftContent.trim().split('\n')
        const titleMatch = leftLines.find(line => line.startsWith('# '))
        const title = titleMatch || ''
        
        // Remove title from left content if found
        const leftContentWithoutTitle = titleMatch 
          ? leftLines.filter(line => line !== titleMatch).join('\n').trim()
          : leftContent.trim()
        
        return (
          <div className="h-full flex flex-col space-y-8">
            {/* Title Section */}
            {title && (
              <div className="text-left">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {title}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Two Column Content */}
            <div className="flex-1 grid grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {leftContentWithoutTitle}
                </ReactMarkdown>
              </div>
              <div className="space-y-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {rightContent.trim()}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )
      
      case 'three-column':
        const threeColumnContent = (typeof children === 'string' ? children : '')
        const threeColumnParts = threeColumnContent.split(/::middle::|::right::/)
        const leftCol = threeColumnParts[0] || ''
        const middleCol = threeColumnParts[1] || ''
        const rightCol = threeColumnParts[2] || ''
        
        // Extract title from left column content
        const leftColLines = leftCol.trim().split('\n')
        const threeColTitleMatch = leftColLines.find(line => line.startsWith('# '))
        const threeColTitle = threeColTitleMatch || ''
        
        // Remove title from left column if found
        const leftColWithoutTitle = threeColTitleMatch 
          ? leftColLines.filter(line => line !== threeColTitleMatch).join('\n').trim()
          : leftCol.trim()
        
        return (
          <div className="h-full flex flex-col space-y-8">
            {/* Title Section */}
            {threeColTitle && (
              <div className="text-left">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {threeColTitle}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Three Column Content */}
            <div className="flex-1 grid grid-cols-3 gap-8 items-start">
              <div className="space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {leftColWithoutTitle}
                </ReactMarkdown>
              </div>
              <div className="space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {middleCol.trim()}
                </ReactMarkdown>
              </div>
              <div className="space-y-4">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={customComponents}
                >
                  {rightCol.trim()}
                </ReactMarkdown>
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
      <h1 className={`${isPreview ? 'text-2xl mb-3' : 'text-5xl mb-8'} font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className={`${isPreview ? 'text-xl mb-2' : 'text-4xl mb-6'} font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent`} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className={`${isPreview ? 'text-lg mb-2' : 'text-2xl mb-4'} font-semibold text-blue-300`} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className={`${isPreview ? 'text-sm leading-relaxed mb-2' : 'text-xl leading-relaxed mb-4'} text-gray-100`} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className={`${isPreview ? 'text-sm space-y-1' : 'text-lg space-y-3'} text-gray-100`} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="flex items-start space-x-3" {...props}>
        <span className="text-blue-400 mt-1">▶</span>
        <span>{props.children}</span>
      </li>
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className={`bg-slate-800 text-blue-300 ${isPreview ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-base'} rounded font-mono border border-slate-700`} {...props} />
      ) : (
        <code className={`block bg-slate-900 text-green-300 ${isPreview ? 'p-2 text-xs' : 'p-4 text-sm'} rounded-lg font-mono overflow-x-auto border border-slate-700 shadow-inner`} {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={`border-l-4 border-blue-500 ${isPreview ? 'pl-3 py-1 my-2' : 'pl-6 py-2 my-4'} bg-slate-800/30 rounded-r-lg`} {...props} />
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
      <div className={`relative z-10 h-full ${isFullscreen ? 'p-16' : isPreview ? 'p-3' : 'p-12'}`}>
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