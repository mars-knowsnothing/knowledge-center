'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  BoldIcon,
  ItalicIcon,
  CodeBracketIcon,
  ListBulletIcon,
  PhotoIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: () => void
  placeholder?: string
  className?: string
  showPreview?: boolean
  onTogglePreview?: () => void
}

export default function MarkdownEditor({
  value,
  onChange,
  onSave,
  placeholder = "Write your markdown content here...",
  className = "",
  showPreview = false,
  onTogglePreview
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])

  // Update line numbers when content changes
  useEffect(() => {
    const lines = value.split('\n').length
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1))
  }, [value])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save shortcut (Cmd/Ctrl + S)
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      if (onSave) {
        onSave()
      }
    }

    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      
      onChange(newValue)
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  // Insert markdown syntax at cursor position
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newValue = 
      value.substring(0, start) + 
      before + selectedText + after + 
      value.substring(end)
    
    onChange(newValue)
    
    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length + after.length
      textarea.selectionStart = textarea.selectionEnd = newCursorPos
      textarea.focus()
    }, 0)
  }

  const toolbarButtons = [
    {
      icon: BoldIcon,
      label: 'Bold',
      action: () => insertMarkdown('**', '**')
    },
    {
      icon: ItalicIcon,
      label: 'Italic',
      action: () => insertMarkdown('*', '*')
    },
    {
      icon: CodeBracketIcon,
      label: 'Code',
      action: () => insertMarkdown('`', '`')
    },
    {
      icon: ListBulletIcon,
      label: 'List',
      action: () => insertMarkdown('- ')
    },
    {
      icon: LinkIcon,
      label: 'Link',
      action: () => insertMarkdown('[', '](url)')
    },
    {
      icon: PhotoIcon,
      label: 'Image',
      action: () => insertMarkdown('![alt text](', ')')
    }
  ]

  return (
    <div className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        
        {onTogglePreview && (
          <button
            onClick={onTogglePreview}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showPreview 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showPreview ? (
              <>
                <EyeSlashIcon className="h-4 w-4" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="flex-shrink-0 bg-gray-50 border-r border-gray-200 px-3 py-4 text-right select-none">
          <div 
            className="text-xs text-gray-400 leading-6 font-mono"
            style={{ fontSize: '12px', lineHeight: '24px' }}
          >
            {lineNumbers.map(num => (
              <div key={num}>{num}</div>
            ))}
          </div>
        </div>

        {/* Text Editor */}
        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full p-4 border-none resize-none focus:outline-none bg-white text-gray-900 font-mono leading-6"
            style={{ 
              fontSize: '14px',
              lineHeight: '24px',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", Menlo, monospace',
              tabSize: 2,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Lines: {lineNumbers.length}</span>
          <span>Characters: {value.length}</span>
          <span>Words: {value.trim() ? value.trim().split(/\s+/).length : 0}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Markdown</span>
          {onSave && (
            <span className="text-gray-400">⌘S to save</span>
          )}
        </div>
      </div>
    </div>
  )
}