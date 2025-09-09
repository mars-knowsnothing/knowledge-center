'use client'

import React, { useEffect, useRef } from 'react'
// import { InlineMath, BlockMath } from 'react-katex'
import mermaid from 'mermaid'
// import 'katex/dist/katex.min.css'

// Initialize Mermaid
if (typeof window !== 'undefined') {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  })
}

interface MathProps {
  children: string
  inline?: boolean
}

export function Math({ children, inline = false }: MathProps) {
  // Temporarily disabled KaTeX integration due to type issues
  if (inline) {
    return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${children}$</code>
  }
  return (
    <div className="my-4 text-center p-4 bg-gray-50 rounded border">
      <code className="text-lg font-mono">$${children}$$</code>
    </div>
  )
}

interface MermaidProps {
  children: string
  id?: string
}

export function MermaidDiagram({ children, id }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const randomNum = window.Math ? window.Math.floor(window.Math.random() * 1000) : 1
  const diagramId = id || `mermaid-${Date.now().toString(36)}-${randomNum}`

  useEffect(() => {
    if (elementRef.current && typeof window !== 'undefined') {
      const renderDiagram = async () => {
        try {
          // Clear previous content
          elementRef.current!.innerHTML = ''
          
          // Render diagram
          const { svg } = await mermaid.render(diagramId, children)
          elementRef.current!.innerHTML = svg
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          elementRef.current!.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded p-4 text-red-600">
              <strong>Diagram Error:</strong><br/>
              <pre class="text-xs mt-2">${children}</pre>
            </div>
          `
        }
      }

      renderDiagram()
    }
  }, [children, diagramId])

  return (
    <div className="my-6">
      <div ref={elementRef} className="flex justify-center" />
    </div>
  )
}

interface CodeBlockProps {
  children: string
  language?: string
  fileName?: string
  highlights?: number[]
  maxHeight?: string
}

export function CodeBlock({ 
  children, 
  language = 'text', 
  fileName, 
  highlights = [],
  maxHeight = '400px'
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    // Simple syntax highlighting using CSS classes
    if (codeRef.current && typeof window !== 'undefined') {
      const code = codeRef.current
      const lines = children.trim().split('\n')
      
      // Create line-by-line HTML with basic syntax highlighting
      const highlightedHTML = lines
        .map((line, index) => {
          const lineNumber = index + 1
          const isHighlighted = highlights.includes(lineNumber)
          const highlightClass = isHighlighted ? 'bg-yellow-500/20' : ''
          
          // Basic syntax highlighting patterns
          const highlightedLine = line
            .replace(/\/\/.*$/gm, '<span class="text-green-400">$&</span>') // Comments
            .replace(/(['"`])([^'"`]*)\1/g, '<span class="text-orange-300">$&</span>') // Strings
            .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|class|extends|async|await|try|catch|throw)\b/g, '<span class="text-blue-400">$&</span>') // Keywords
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-purple-400">$&</span>') // Numbers
          
          return `<div class="flex ${highlightClass}">
            <span class="text-gray-500 select-none w-12 text-right pr-4 border-r border-gray-700">${lineNumber}</span>
            <span class="flex-1 pl-4">${highlightedLine}</span>
          </div>`
        })
        .join('\n')
      
      code.innerHTML = highlightedHTML
    }
  }, [children, highlights])
  
  return (
    <div className="group my-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {fileName && (
        <div className="bg-gray-800 px-4 py-2 text-sm font-mono text-gray-300 border-b border-gray-600">
          📁 {fileName}
        </div>
      )}
      <div className="relative bg-gray-900 text-gray-100">
        <pre 
          className="overflow-auto text-sm leading-relaxed"
          style={{ maxHeight }}
        >
          <code 
            ref={codeRef}
            className={`block p-4 font-mono language-${language}`}
          >
            {/* Content will be replaced by useEffect */}
            {children.trim()}
          </code>
        </pre>
        
        {/* Copy button */}
        <button 
          className="absolute top-2 right-2 p-2 rounded bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(children)
              const btn = document.activeElement as HTMLButtonElement
              const originalText = btn.textContent
              btn.textContent = 'Copied!'
              setTimeout(() => {
                btn.textContent = originalText
              }, 2000)
            }
          }}
          title="Copy code"
        >
          📋 Copy
        </button>
      </div>
    </div>
  )
}

interface SlideLayoutProps {
  layout?: 'default' | 'center' | 'cover' | 'intro' | 'section' | 'two-cols' | 'three-cols'
  children: React.ReactNode
  background?: string
  class?: string
}

export function SlideLayout({ 
  layout = 'default', 
  children, 
  background,
  class: className 
}: SlideLayoutProps) {
  const baseClasses = 'w-full h-full p-8 overflow-auto'
  
  const layoutClasses = {
    default: 'flex flex-col',
    center: 'flex flex-col items-center justify-center text-center',
    cover: 'flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-600 to-purple-700 text-white',
    intro: 'flex flex-col justify-center pl-16',
    section: 'flex flex-col items-center justify-center text-center border-l-8 border-blue-500 bg-blue-50/50',
    'two-cols': 'grid grid-cols-2 gap-8 items-start',
    'three-cols': 'grid grid-cols-3 gap-6 items-start'
  }
  
  const combinedClasses = [
    baseClasses,
    layoutClasses[layout],
    className
  ].filter(Boolean).join(' ')
  
  const style = background ? { 
    background: background.startsWith('url(') ? background : `var(--${background}, ${background})` 
  } : undefined
  
  return (
    <div className={combinedClasses} style={style}>
      {children}
    </div>
  )
}

interface ClickableProps {
  children: React.ReactNode
  onClick?: () => void
  at?: number
  className?: string
}

export function Clickable({ children, onClick, className = '' }: ClickableProps) {
  return (
    <div 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface NoteProps {
  children: React.ReactNode
}

export function SpeakerNote({ children }: NoteProps) {
  // Speaker notes are hidden in the slide view but could be shown in presenter mode
  return <div className="hidden">{children}</div>
}