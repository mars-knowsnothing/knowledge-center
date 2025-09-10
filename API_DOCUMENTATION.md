# Training System v2 - API Documentation

## Overview

The Training System v2 provides a comprehensive REST API for managing courses, slides, labs, and assets. The API is built with FastAPI and includes automatic OpenAPI documentation.

## Base URLs

- **Development**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Course Management APIs

### Get All Courses
```http
GET /api/courses
```

**Response**:
```json
[
  {
    "id": "web-development-basics",
    "title": "Web Development Basics",
    "description": "Learn HTML, CSS, and JavaScript fundamentals",
    "slides_count": 6,
    "level": "Beginner",
    "duration": "2 hours",
    "author": "Training Team",
    "tags": ["html", "css", "javascript"]
  }
]
```

### Get Course by ID
```http
GET /api/courses/{course_id}
```

**Parameters**:
- `course_id` (string): Unique course identifier

**Response**: Same as individual course object above

### Create New Course
```http
POST /api/courses
```

**Request Body**:
```json
{
  "title": "My Course Title",
  "description": "Course description",
  "level": "Beginner",
  "author": "Your Name",
  "tags": ["tag1", "tag2"],
  "slides_content": "# Slide 1\n\nContent here\n\n---\n\n# Slide 2\n\nMore content"
}
```

**Response**: Created course object with generated ID

### Update Course
```http
PUT /api/courses/{course_id}
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "level": "Intermediate",
  "author": "Updated Author",
  "tags": ["updated", "tags"]
}
```

### Delete Course
```http
DELETE /api/courses/{course_id}
```

**Response**:
```json
{
  "message": "Course {course_id} deleted successfully"
}
```

## Course Import APIs

### Import Course from File
```http
POST /api/courses/import
Content-Type: multipart/form-data
```

**Supported File Types**:
- `.zip` - Complete course package
- `.md` - Markdown slides (legacy support)

**For ZIP Files**:
- No additional form fields required
- ZIP must contain `config.json` with course metadata

**For Markdown Files** (legacy):
- `title` (string): Course title
- `description` (string): Course description  
- `level` (string): Difficulty level
- `author` (string): Course author
- `tags` (string): Comma-separated tags
- `file` (file): Markdown file

**ZIP Structure Required**:
```
course-folder/
├── config.json          # Course metadata
├── slides/slides.md      # Presentation content
├── labs/lab-*.md        # Lab exercises
└── assets/              # Static resources
```

**Response**: Imported course object

## Template Course API

### Download Course Template
```http
GET /api/courses/template/download
```

**Response**: ZIP file download (~20KB)
- Complete course template with example content
- Professional structure and documentation
- 11 slides, 3 labs, asset examples

## Slides Management APIs

### Get Course Slides
```http
GET /api/courses/{course_id}/slides
```

**Response**:
```json
{
  "metadata": {
    "title": "Course Title",
    "author": "Author Name"
  },
  "slides": [
    {
      "id": "slide-1",
      "content": "# Slide Title\n\nSlide content in markdown",
      "html": "<h1>Slide Title</h1><p>Slide content in HTML</p>",
      "metadata": {
        "layout": "title-slide",
        "theme": "tech"
      }
    }
  ],
  "html": "<full_html_content>"
}
```

### Update Course Slides
```http
PUT /api/courses/{course_id}/slides
```

**Request Body**:
```json
{
  "content": "# Slide 1\n\nNew content\n\n---\n\n# Slide 2\n\nMore content"
}
```

### Get Course Slide Files
```http
GET /api/slides/courses/{course_name}
```

**Response**:
```json
{
  "course_name": "web-development-basics",
  "slides": [
    {
      "filename": "slides.md",
      "title": "Web Development Basics",
      "content": "# Slide 1\n\nContent here",
      "html": "<h1>Slide 1</h1><p>Content here</p>",
      "metadata": {
        "title": "Web Development Basics",
        "author": "Training Team"
      }
    }
  ]
}
```

### Get Specific Slide File
```http
GET /api/slides/courses/{course_name}/file/{filename}
```

**Parameters**:
- `course_name` (string): Course identifier
- `filename` (string): Slide file name (e.g., "slides.md")

**Response**: Single slide file object (same structure as above)

## Labs Management APIs

### Get All Course Labs
```http
GET /api/labs/courses/{course_name}
```

**Response**:
```json
{
  "course_name": "web-development-basics",
  "labs": [
    {
      "course_name": "web-development-basics",
      "chapter": 1,
      "title": "Lab 1: HTML Fundamentals",
      "content": "# Lab 1\n\n## Objectives...",
      "html": "<h1>Lab 1</h1>...",
      "metadata": {},
      "filename": "lab-1.md"
    }
  ]
}
```

### Get Specific Lab
```http
GET /api/labs/courses/{course_name}/chapter/{chapter_no}
```

**Parameters**:
- `course_name` (string): Course identifier
- `chapter_no` (integer): Lab chapter number

**Response**: Single lab object (same structure as above)

### Get All Available Labs
```http
GET /api/labs/courses
```

**Response**:
```json
{
  "course-name-1": [
    {
      "chapter": 1,
      "title": "Lab 1: Basic Implementation",
      "filename": "lab-1.md"
    }
  ],
  "course-name-2": [...]
}
```

## Asset Management APIs

### Get Course Assets
```http
GET /api/courses/{course_name}/assets
```

**Response**:
```json
{
  "course_name": "web-development-basics",
  "assets": [
    {
      "name": "diagram.png",
      "path": "images/diagram.png",
      "size": 45231,
      "type": "image",
      "can_preview": true,
      "url": "/assets/web-development-basics/images/diagram.png"
    },
    {
      "name": "demo.mp4",
      "path": "videos/demo.mp4", 
      "size": 2048576,
      "type": "video",
      "can_preview": true,
      "url": "/assets/web-development-basics/videos/demo.mp4"
    }
  ]
}
```

### Upload Course Asset
```http
POST /api/courses/{course_name}/assets/upload
Content-Type: multipart/form-data
```

**Form Data**:
- `file` (file): Asset file to upload

**Response**:
```json
{
  "message": "File uploaded successfully",
  "asset": {
    "name": "new-image.png",
    "path": "new-image.png",
    "size": 12345,
    "type": "image",
    "can_preview": true,
    "url": "/assets/web-development-basics/new-image.png"
  }
}
```

### Delete Course Asset
```http
DELETE /api/courses/{course_name}/assets/{path}
```

**Parameters**:
- `course_name` (string): Course identifier
- `path` (string): Asset path within course assets directory

**Response**:
```json
{
  "message": "Asset deleted successfully"
}
```

## Asset Serving APIs

### Serve Course Assets
```http
GET /assets/{course_name}/{path}
```

**Parameters**:
- `course_name` (string): Course identifier
- `path` (string): Asset path within course assets directory

**Examples**:
- `/assets/web-basics/images/diagram.png`
- `/assets/advanced-js/videos/demo.mp4`
- `/assets/python-intro/documents/reference.pdf`

**Features**:
- Automatic MIME type detection
- Security validation (prevents directory traversal)
- Supports images, videos, documents, and other static files

## Error Responses

All APIs use standard HTTP status codes:

### 200 OK
Request successful

### 400 Bad Request
```json
{
  "detail": "Invalid request data or file format"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error occurred"
}
```

## Content Types and Formats

### Markdown Processing
- **Parser**: Python-markdown with extensions
- **Extensions**: codehilite, fenced_code, tables, toc
- **Frontmatter**: YAML metadata support
- **Syntax Highlighting**: Automatic for code blocks

### Slide Separation
- Slides separated by `---` (three hyphens)
- Each slide processed independently
- Supports HTML mixing with Markdown

### Per-Slide Configuration (New)
Individual slides can specify their own theme and layout using YAML frontmatter:

```markdown
---
layout: title-slide
theme: tech
---

# Your Slide Title
Content goes here

---
layout: two-column
theme: minimal
---

# Next Slide
Different layout and theme
```

**Supported Parameters**:
- `layout`: `default`, `title-slide`, `section`, `two-column`, `three-column`, `image-text`
- `theme`: `tech` (dark gradient), `minimal` (clean light)
- Additional custom properties can be included and will be passed to frontend components

**Behavior**:
- Per-slide settings override global theme/layout defaults
- If no frontmatter is specified, global settings are used
- Invalid values fall back to defaults gracefully

### Asset Types
- **Images**: PNG, JPG, GIF, SVG
- **Videos**: MP4, WebM, AVI
- **Documents**: PDF, TXT, MD, ZIP
- **Other**: Any file type with proper MIME detection

## Rate Limiting and Performance

### Current Limits
- No rate limiting implemented
- File upload limit: 50MB per file
- ZIP extraction timeout: 30 seconds

### Performance Considerations
- Course content cached in memory
- Asset serving uses FastAPI FileResponse
- ZIP extraction uses temporary directories
- Automatic cleanup of temporary files

## Development and Testing

### Local Testing
```bash
# Test course creation
curl -X POST http://localhost:8000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Course", "description": "Test description"}'

# Test ZIP import
curl -X POST http://localhost:8000/api/courses/import \
  -F "file=@course.zip"

# Download template
curl -O http://localhost:8000/api/courses/template/download
```

### OpenAPI Documentation
- Interactive docs: http://localhost:8000/docs
- OpenAPI spec: http://localhost:8000/openapi.json
- Redoc format: http://localhost:8000/redoc

## Migration Notes

### From Legacy System
- Old course structure automatically migrated
- Backward compatibility maintained
- Markdown import still supported

### Breaking Changes
- Course structure now requires organized folders
- Asset paths changed to `/assets/{course}/{path}`
- Lab files must follow `lab-{number}.md` naming

## Security Considerations

### File Upload Security
- File type validation for uploads
- ZIP extraction with path validation
- Temporary directory isolation
- Automatic cleanup of uploaded files

### Asset Serving Security
- Path traversal prevention
- MIME type validation
- No executable file serving
- Directory listing disabled

### CORS Configuration
- Frontend origin allowed: http://localhost:3000
- All HTTP methods allowed for development
- Credentials support enabled

## Future Enhancements

### Planned Features
- Authentication and authorization
- Course versioning system
- Bulk operations
- Advanced search and filtering
- Course analytics and tracking
- Export functionality
- Multi-language support

### API Versioning
- Current version: v1 (implied)
- Future versions will use `/api/v2/` prefix
- Backward compatibility maintained for at least one major version