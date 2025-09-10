'use client'

import { getTheme } from './themes'
import { Slide } from '@/lib/api'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

interface SlidePreviewProps {
  slide: Slide | null
}

export default function SlidePreview({ slide }: SlidePreviewProps) {
  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No slide to preview</p>
          <p className="text-sm mt-1">Select a slide or add content to see a preview.</p>
        </div>
      </div>
    )
  }

  const themeName = slide.metadata?.theme || 'minimal'
  const layoutName = slide.metadata?.layout || 'default'
  const ThemeComponent = getTheme(themeName).component

  return (
    <div className="w-full h-full bg-gray-100">
      <ThemeComponent
        layout={layoutName}
        isPreview={true}
      >
        {slide.content}
      </ThemeComponent>
    </div>
  )
}
