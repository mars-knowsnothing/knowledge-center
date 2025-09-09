import { marked } from 'marked'
import { Math, MermaidDiagram, CodeBlock } from '../components/SlidevFeatures'

// Custom renderer for enhanced Slidev-like features
export function parseMarkdownWithFeatures(content: string): string {
  // Configure marked for better code highlighting
  marked.setOptions({
    highlight: function(code, lang) {
      return code // We'll handle syntax highlighting in the React component
    },
    breaks: true,
    gfm: true
  })

  // Create custom renderer
  const renderer = new marked.Renderer()
  
  // Override code block rendering
  renderer.code = function(code, language) {
    // Check if it's a mermaid diagram
    if (language === 'mermaid') {
      return `<div data-mermaid="${encodeURIComponent(code)}"></div>`
    }
    
    return `<pre class="code-block" data-language="${language || 'text'}"><code>${code}</code></pre>`
  }
  
  // Override inline code rendering for math
  renderer.codespan = function(code) {
    // Check for math expressions
    if (code.startsWith('$') && code.endsWith('$')) {
      const mathContent = code.slice(1, -1)
      return `<span data-math-inline="${encodeURIComponent(mathContent)}"></span>`
    }
    return `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">${code}</code>`
  }
  
  // Parse content
  let html = marked(content, { renderer })
  
  // Handle block math expressions ($$...$$)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    return `<div data-math-block="${encodeURIComponent(math.trim())}"></div>`
  })
  
  // Handle frontmatter-style directives
  html = html.replace(/^---\n(.*?)\n---/s, (match, frontmatter) => {
    // Parse YAML-like frontmatter
    const lines = frontmatter.split('\n')
    const metadata: Record<string, string> = {}
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        metadata[key.trim()] = valueParts.join(':').trim()
      }
    })
    
    return `<div data-slide-meta="${encodeURIComponent(JSON.stringify(metadata))}"></div>`
  })
  
  return html
}

export function processSlideContent(rawContent: string): { 
  content: string
  metadata: Record<string, any>
  html: string 
} {
  let content = rawContent
  const metadata: Record<string, any> = {}
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n(.*?)\n---\n(.*)/s)
  if (frontmatterMatch) {
    const [, frontmatter, mainContent] = frontmatterMatch
    content = mainContent
    
    // Parse YAML-like frontmatter
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim()
        // Try to parse as number or boolean
        if (value === 'true') metadata[key.trim()] = true
        else if (value === 'false') metadata[key.trim()] = false
        else if (!isNaN(Number(value))) metadata[key.trim()] = Number(value)
        else metadata[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    })
  }
  
  const html = parseMarkdownWithFeatures(content)
  
  return { content, metadata, html }
}

// Utility to extract slide layout from content
export function getSlideLayout(content: string, metadata: Record<string, any>) {
  // Check metadata first
  if (metadata.layout) return metadata.layout
  
  // Infer from content
  if (content.includes('# ') && content.split('\n').length < 10) {
    return 'center'
  }
  
  if (content.startsWith('# ') && content.includes('---')) {
    return 'intro'
  }
  
  return 'default'
}

export const SLIDEV_LAYOUTS = {
  'default': 'Standard content layout',
  'center': 'Centered content',
  'cover': 'Cover slide with background',
  'intro': 'Introduction slide',
  'section': 'Section divider',
  'two-cols': 'Two column layout',
  'three-cols': 'Three column layout',
  'image-right': 'Image on right, content on left',
  'image-left': 'Image on left, content on right',
  'fact': 'Large fact or statistic',
  'quote': 'Large quote display',
  'statement': 'Statement or conclusion slide'
}