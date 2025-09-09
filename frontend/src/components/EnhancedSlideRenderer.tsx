'use client'

import React, { useEffect, useRef } from 'react'
import { Math, MermaidDiagram, CodeBlock } from './SlidevFeatures'

interface EnhancedSlideRendererProps {
  content: string
  layout?: string
  theme?: 'minimal' | 'tech'
  isFullscreen?: boolean
}

export default function EnhancedSlideRenderer({ 
  content, 
  layout = 'default',
  theme = 'minimal',
  isFullscreen = false
}: EnhancedSlideRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      
      // Process math expressions
      const inlineMathElements = container.querySelectorAll('[data-math-inline]')
      inlineMathElements.forEach(el => {
        const mathContent = decodeURIComponent(el.getAttribute('data-math-inline') || '')
        const mathComponent = document.createElement('span')
        mathComponent.className = 'math-inline'
        try {
          // This would be handled by the Math component in a real React render
          mathComponent.textContent = `$${mathContent}$`
        } catch (error) {
          mathComponent.textContent = `[Math Error: ${mathContent}]`
          mathComponent.className = 'text-red-500'
        }
        el.replaceWith(mathComponent)
      })

      // Process block math expressions
      const blockMathElements = container.querySelectorAll('[data-math-block]')
      blockMathElements.forEach(el => {
        const mathContent = decodeURIComponent(el.getAttribute('data-math-block') || '')
        const mathComponent = document.createElement('div')
        mathComponent.className = 'math-block text-center my-6'
        try {
          mathComponent.textContent = `$$${mathContent}$$`
        } catch (error) {
          mathComponent.textContent = `[Math Error: ${mathContent}]`
          mathComponent.className = 'text-red-500 text-center my-6'
        }
        el.replaceWith(mathComponent)
      })

      // Process Mermaid diagrams
      const mermaidElements = container.querySelectorAll('[data-mermaid]')
      mermaidElements.forEach(el => {
        const diagramCode = decodeURIComponent(el.getAttribute('data-mermaid') || '')
        const diagramContainer = document.createElement('div')
        diagramContainer.className = 'mermaid-diagram my-6'
        diagramContainer.textContent = `[Mermaid: ${diagramCode.substring(0, 50)}...]`
        el.replaceWith(diagramContainer)
      })

      // Process code blocks
      const codeElements = container.querySelectorAll('pre.code-block')
      codeElements.forEach(el => {
        const language = el.getAttribute('data-language') || 'text'
        const code = el.textContent || ''
        const codeContainer = document.createElement('div')
        codeContainer.className = 'enhanced-code-block'
        codeContainer.innerHTML = `
          <div class="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
            <div class="bg-gray-800 px-4 py-2 text-sm text-gray-300">${language}</div>
            <pre class="p-4 overflow-x-auto"><code>${code}</code></pre>
          </div>
        `
        el.replaceWith(codeContainer)
      })
    }
  }, [content])

  // Parse HTML content and handle special elements
  const processedContent = content
    .replace(/\$\$(.*?)\$\$/g, '<div data-math-block="$1"></div>')
    .replace(/\$([^$]+)\$/g, '<span data-math-inline="$1"></span>')
    .replace(/```mermaid\n([\s\S]*?)\n```/g, '<div data-mermaid="$1"></div>')

  const getLayoutClasses = () => {
    const base = 'w-full h-full overflow-auto'
    const padding = isFullscreen ? 'p-16' : 'p-12'
    
    switch (layout) {
      case 'center':
        return `${base} ${padding} flex flex-col items-center justify-center text-center`
      case 'cover':
        return `${base} ${padding} flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-purple-700 text-white`
      case 'intro':
        return `${base} ${padding} flex flex-col justify-center pl-20`
      case 'section':
        return `${base} ${padding} flex flex-col items-center justify-center text-center border-l-8 border-blue-500 bg-blue-50/30`
      case 'two-cols':
        return `${base} ${padding} grid grid-cols-2 gap-16 items-start`
      case 'three-cols':
        return `${base} ${padding} grid grid-cols-3 gap-8 items-start`
      default:
        return `${base} ${padding} flex flex-col justify-center space-y-8 max-w-5xl`
    }
  }

  const getThemeClasses = () => {
    if (theme === 'tech') {
      return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white'
    }
    return 'bg-white text-gray-900'
  }

  return (
    <div className={`${getThemeClasses()} relative`}>
      {/* Background patterns based on theme */}
      {theme === 'tech' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
      )}
      
      {theme === 'minimal' && (
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      )}

      {/* Main content */}
      <div 
        ref={containerRef}
        className={getLayoutClasses()}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Theme accent elements */}
      {theme === 'minimal' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500 to-blue-600 opacity-5"></div>
      )}

      {theme === 'tech' && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        </>
      )}
    </div>
  )
}