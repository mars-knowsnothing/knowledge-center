'use client'

import { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

interface MinimalThemeProps {
  children: ReactNode
  layout?: 'default' | 'two-column' | 'three-column' | 'image-text' | 'title-slide' | 'section'
  accentColor?: string
  isFullscreen?: boolean
  isPreview?: boolean
}

export default function MinimalTheme({ 
  children, 
  layout = 'default',
  accentColor = 'blue',
  isFullscreen = false,
  isPreview = false
}: MinimalThemeProps) {
  
  const getAccentColors = (color: string) => {
    switch (color) {
      case 'green':
        return {
          primary: 'text-green-600',
          secondary: 'text-green-500',
          border: 'border-green-200',
          bg: 'bg-green-50',
          gradient: 'from-green-500 to-green-600'
        }
      case 'purple':
        return {
          primary: 'text-purple-600',
          secondary: 'text-purple-500',
          border: 'border-purple-200',
          bg: 'bg-purple-50',
          gradient: 'from-purple-500 to-purple-600'
        }
      default:
        return {
          primary: 'text-blue-600',
          secondary: 'text-blue-500',
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          gradient: 'from-blue-500 to-blue-600'
        }
    }
  }

  const colors = getAccentColors(accentColor)
  
  const renderLayout = (content: ReactNode) => {
    switch (layout) {
      case 'title-slide':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
            <div className="max-w-4xl">
              {content}
            </div>
            <div className={`w-24 h-1 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
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
            <div className="flex-1 grid grid-cols-2 gap-16 items-start">
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
          <div className="h-full grid grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className={`w-full h-96 ${colors.bg} rounded-2xl ${colors.border} border-2 flex items-center justify-center relative overflow-hidden`}>
                <div className={`text-8xl ${colors.secondary} opacity-50`}>🖼️</div>
                <div className={`absolute bottom-4 right-4 text-xs ${colors.primary} font-medium bg-white px-2 py-1 rounded`}>
                  Image / Diagram
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {content}
            </div>
          </div>
        )
      
      case 'section':
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-3xl">
              <div className={`w-20 h-1 bg-gradient-to-r ${colors.gradient} rounded-full mx-auto mb-8`}></div>
              {content}
              <div className={`w-20 h-1 bg-gradient-to-r ${colors.gradient} rounded-full mx-auto mt-8`}></div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-full flex flex-col justify-center space-y-8 max-w-5xl">
            {content}
          </div>
        )
    }
  }

  const customComponents = {
    h1: ({ node, ...props }: any) => (
      <h1 className={`${isPreview ? 'text-3xl mb-3' : 'text-6xl mb-8'} font-bold ${colors.primary} leading-tight`} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className={`${isPreview ? 'text-2xl mb-2' : 'text-4xl mb-6'} font-bold ${colors.primary} leading-tight`} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className={`${isPreview ? 'text-lg mb-2' : 'text-2xl mb-4'} font-semibold ${colors.secondary}`} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className={`${isPreview ? 'text-sm leading-relaxed mb-2' : 'text-xl leading-relaxed mb-6'} text-gray-700`} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className={`${isPreview ? 'text-sm space-y-1' : 'text-lg space-y-4'} text-gray-700`} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="flex items-start space-x-3" {...props}>
        <span className={`${colors.primary} mt-1 font-bold`}>•</span>
        <span>{props.children}</span>
      </li>
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className={`${colors.bg} ${colors.primary} ${isPreview ? 'px-1 py-0.5 text-xs' : 'px-2 py-1 text-base'} rounded font-mono ${colors.border} border`} {...props} />
      ) : (
        <code className={`block bg-gray-50 text-gray-800 ${isPreview ? 'p-2 text-xs' : 'p-6 text-sm'} rounded-lg font-mono overflow-x-auto border border-gray-200 shadow-sm`} {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={`border-l-4 ${colors.border.replace('border-', 'border-l-')} ${isPreview ? 'pl-3 py-2 my-2' : 'pl-6 py-4 my-6'} ${colors.bg} rounded-r-lg italic`} {...props} />
    )
  }

  return (
    <div className="w-full h-full bg-white text-gray-900 relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
        backgroundSize: '30px 30px'
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
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.gradient} opacity-5`}></div>
    </div>
  )
}