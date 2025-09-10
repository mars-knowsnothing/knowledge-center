const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Course {
  id: string
  title: string
  description: string
  slides_count: number
  level?: string
  duration?: string
  author?: string
  tags?: string[]
}

export interface Slide {
  id: string
  content: string
  html: string
  metadata?: Record<string, any>
}

export interface CourseSlides {
  metadata: Record<string, any>
  slides: Slide[]
  html: string
}

export interface CourseCreate {
  title: string
  description: string
  level?: string
  author?: string
  tags?: string[]
  slides_content?: string
}

export interface CourseUpdate {
  title?: string
  description?: string
  level?: string
  author?: string
  tags?: string[]
}

export interface SlidesUpdate {
  content: string
}

export interface Lab {
  course_name: string
  chapter: number
  title: string
  content: string
  html: string
  metadata?: Record<string, any>
  filename?: string
}

export interface CourseLabsResponse {
  course_name: string
  labs: Lab[]
}

export interface LabSummary {
  chapter: number
  title: string
  filename: string
}

export interface AllCoursesLabsResponse {
  [courseName: string]: LabSummary[]
}

export interface Asset {
  name: string
  path: string
  size: number
  type: 'image' | 'video' | 'document'
  can_preview: boolean
  url: string
}

export interface CourseAssetsResponse {
  course_name: string
  assets: Asset[]
}

export interface SlideFile {
  filename: string
  title: string
  content: string
  html: string
  metadata?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CourseSlidesFilesResponse {
  course_name: string
  slides: SlideFile[]
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network or other errors
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const api = {
  // Get all courses
  getCourses: async (): Promise<Course[]> => {
    return fetchApi('/api/courses')
  },

  // Get specific course info
  getCourse: async (courseId: string): Promise<Course> => {
    return fetchApi(`/api/courses/${courseId}`)
  },

  // Get course slides
  getCourseSlides: async (courseId: string): Promise<CourseSlides> => {
    return fetchApi(`/api/courses/${courseId}/slides`)
  },

  // Create new course
  createCourse: async (course: CourseCreate): Promise<Course> => {
    return fetchApi('/api/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    })
  },

  // Update course info
  updateCourse: async (courseId: string, updates: CourseUpdate): Promise<Course> => {
    return fetchApi(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  // Update course slides
  updateCourseSlides: async (courseId: string, slides: SlidesUpdate): Promise<CourseSlides> => {
    return fetchApi(`/api/courses/${courseId}/slides`, {
      method: 'PUT',
      body: JSON.stringify(slides),
    })
  },

  // Import course from markdown file
  importCourse: async (formData: FormData): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/api/courses/import`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header for FormData
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  },

  // Delete course
  deleteCourse: async (courseId: string): Promise<{ message: string }> => {
    return fetchApi(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
  },

  // Health check
  healthCheck: async (): Promise<{ message: string }> => {
    return fetchApi('/')
  },

  // Labs API methods
  // Get all labs for a specific course
  getCourseLabs: async (courseName: string): Promise<CourseLabsResponse> => {
    return fetchApi(`/api/labs/courses/${courseName}`)
  },

  // Get specific lab content by course name and chapter number
  getLabContent: async (courseName: string, chapterNo: number): Promise<Lab> => {
    return fetchApi(`/api/labs/courses/${courseName}/chapter/${chapterNo}`)
  },

  // Get all available labs grouped by course
  getAllCoursesLabs: async (): Promise<AllCoursesLabsResponse> => {
    return fetchApi('/api/labs/courses')
  },

  // Assets API methods
  // Get all assets for a specific course
  getCourseAssets: async (courseName: string): Promise<CourseAssetsResponse> => {
    return fetchApi(`/api/courses/${courseName}/assets`)
  },

  // Upload asset to a course
  uploadCourseAsset: async (courseName: string, file: File): Promise<{message: string, asset: Asset}> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseName}/assets/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  },

  // Delete asset from a course
  deleteCourseAsset: async (courseName: string, assetPath: string): Promise<{message: string}> => {
    return fetchApi(`/api/courses/${courseName}/assets/${assetPath}`, {
      method: 'DELETE',
    })
  },

  // Slides API methods
  // Get all slide files for a specific course
  getCourseSlideFiles: async (courseName: string): Promise<CourseSlidesFilesResponse> => {
    return fetchApi(`/api/slides/courses/${courseName}`)
  },

  // Get specific slide file content
  getSlideFileContent: async (courseName: string, filename: string): Promise<SlideFile> => {
    return fetchApi(`/api/slides/courses/${courseName}/file/${filename}`)
  }
}

export { ApiError }