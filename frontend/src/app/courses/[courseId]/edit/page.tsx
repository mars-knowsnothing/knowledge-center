'use client'

import { use } from 'react'
import CourseEditor from '@/components/CourseEditor'

export default function CourseEditPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  
  return <CourseEditor courseId={courseId} />
}