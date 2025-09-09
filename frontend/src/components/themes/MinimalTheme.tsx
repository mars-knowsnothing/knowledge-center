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
}

export default function MinimalTheme({ 
  children, 
  layout = 'default',
  accentColor = 'blue',
  isFullscreen = false
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
        return (
          <div className="h-full grid grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              {content}
            </div>
            <div className="flex items-center justify-center h-full">
              <div className={`w-full h-80 ${colors.bg} rounded-xl ${colors.border} border-2 flex flex-col items-center justify-center relative`}>
                <div className={`text-6xl ${colors.secondary} mb-4`}>📈</div>
                <p className={`text-sm ${colors.primary} font-medium`}>Chart / Image Placeholder</p>
              </div>
            </div>
          </div>
        )
      
      case 'three-column':
        return (
          <div className="h-full">
            <div className="mb-12 text-center">
              <h2 className={`text-4xl font-bold ${colors.primary}`}>
                Key Features
              </h2>
              <div className={`w-16 h-1 bg-gradient-to-r ${colors.gradient} rounded-full mx-auto mt-4`}></div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center ${colors.border} border-2 mx-auto`}>
                  <span className={`text-2xl ${colors.primary}`}>🎯</span>
                </div>
                <h3 className={`text-xl font-semibold ${colors.primary}`}>Feature One</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Description of the first key feature or benefit
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center ${colors.border} border-2 mx-auto`}>
                  <span className={`text-2xl ${colors.primary}`}>⚡</span>
                </div>
                <h3 className={`text-xl font-semibold ${colors.primary}`}>Feature Two</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Description of the second key feature or benefit
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center ${colors.border} border-2 mx-auto`}>
                  <span className={`text-2xl ${colors.primary}`}>🚀</span>
                </div>
                <h3 className={`text-xl font-semibold ${colors.primary}`}>Feature Three</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Description of the third key feature or benefit
                </p>
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
      <h1 className={`text-6xl font-bold mb-8 ${colors.primary} leading-tight`} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 className={`text-4xl font-bold mb-6 ${colors.primary} leading-tight`} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 className={`text-2xl font-semibold mb-4 ${colors.secondary}`} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <p className="text-xl leading-relaxed mb-6 text-gray-700" {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="text-lg space-y-4 text-gray-700" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="flex items-start space-x-3" {...props}>
        <span className={`${colors.primary} mt-1 font-bold`}>•</span>
        <span>{props.children}</span>
      </li>
    ),
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className={`${colors.bg} ${colors.primary} px-2 py-1 rounded text-base font-mono ${colors.border} border`} {...props} />
      ) : (
        <code className="block bg-gray-50 text-gray-800 p-6 rounded-lg text-sm font-mono overflow-x-auto border border-gray-200 shadow-sm" {...props} />
      ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={`border-l-4 ${colors.border.replace('border-', 'border-l-')} pl-6 py-4 ${colors.bg} rounded-r-lg my-6 italic`} {...props} />
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
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colors.gradient} opacity-5`}></div>
    </div>
  )
}