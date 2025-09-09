from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import json
import aiofiles
import frontmatter
import markdown
import uuid
import re
import zipfile
import tempfile
import shutil
from typing import List, Dict, Any, Optional
from pathlib import Path

app = FastAPI(title="Training System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COURSES_DIR = Path("courses")
COURSES_DIR.mkdir(exist_ok=True)

# Mount static assets directories for courses
@app.on_event("startup")
async def startup_event():
    # Mount each course's assets directory as static files
    for course_dir in COURSES_DIR.iterdir():
        if course_dir.is_dir():
            assets_dir = course_dir / "assets"
            if assets_dir.exists():
                app.mount(f"/assets/{course_dir.name}", StaticFiles(directory=assets_dir), name=f"assets-{course_dir.name}")

# Route to serve course assets
@app.get("/assets/{course_name}/{path:path}")
async def serve_course_assets(course_name: str, path: str):
    """Serve assets from course directories"""
    course_path = COURSES_DIR / course_name / "assets"
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course assets not found")
    
    file_path = course_path / path
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Basic security check - ensure we're not accessing files outside the assets directory
    try:
        file_path.resolve().relative_to(course_path.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Access denied")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path)

# Pydantic models
class CourseCreate(BaseModel):
    title: str
    description: str
    level: Optional[str] = "Beginner"
    author: Optional[str] = "Training Team"
    tags: Optional[List[str]] = []
    slides_content: Optional[str] = None

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    level: Optional[str] = None
    author: Optional[str] = None
    tags: Optional[List[str]] = None

class SlidesUpdate(BaseModel):
    content: str

class LabContent(BaseModel):
    course_name: str
    chapter: int
    title: str
    content: str
    html: str

@app.get("/")
def read_root():
    return {"message": "Training System API"}

@app.get("/api/courses")
async def get_courses():
    courses = []
    for course_dir in COURSES_DIR.iterdir():
        if course_dir.is_dir():
            course_info = await get_course_info(course_dir.name)
            courses.append(course_info)
    return courses

@app.get("/api/courses/{course_id}")
async def get_course(course_id: str):
    course_path = COURSES_DIR / course_id
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    return await get_course_info(course_id)

@app.get("/api/courses/{course_id}/slides")
async def get_course_slides(course_id: str):
    course_path = COURSES_DIR / course_id
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    slides_file = course_path / "slides" / "slides.md"
    if not slides_file.exists():
        raise HTTPException(status_code=404, detail="Slides not found")
    
    async with aiofiles.open(slides_file, 'r', encoding='utf-8') as f:
        content = await f.read()
    
    post = frontmatter.loads(content)
    md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables'])
    html_content = md.convert(post.content)
    
    slides = parse_slides(post.content)
    
    return {
        "metadata": post.metadata,
        "slides": slides,
        "html": html_content
    }

@app.post("/api/courses")
async def create_course(course: CourseCreate):
    # Generate course ID from title
    course_id = generate_course_id(course.title)
    course_path = COURSES_DIR / course_id
    
    # Check if course already exists
    if course_path.exists():
        raise HTTPException(status_code=400, detail="Course with this ID already exists")
    
    # Create course directory
    course_path.mkdir(parents=True, exist_ok=True)
    
    # Create config.json
    config = {
        "id": course_id,
        "title": course.title,
        "description": course.description,
        "level": course.level,
        "author": course.author,
        "tags": course.tags or []
    }
    
    config_file = course_path / "config.json"
    async with aiofiles.open(config_file, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(config, indent=2, ensure_ascii=False))
    
    # Create slides.md
    slides_content = course.slides_content or f"""# {course.title}

Welcome to {course.title}!

## Overview
{course.description}

---

# Getting Started

This is your first slide. You can edit the markdown content to create your presentation.

## Key Features
- Create engaging presentations
- Use markdown syntax
- Support for code blocks
- Interactive slide navigation

---

# Thank You!

End of the presentation.

## Next Steps
- Add more slides
- Customize the content
- Share with your audience
"""
    
    slides_file = course_path / "slides" / "slides.md"
    async with aiofiles.open(slides_file, 'w', encoding='utf-8') as f:
        await f.write(slides_content)
    
    return await get_course_info(course_id)

@app.put("/api/courses/{course_id}")
async def update_course(course_id: str, course_update: CourseUpdate):
    course_path = COURSES_DIR / course_id
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    config_file = course_path / "config.json"
    
    # Read existing config
    if config_file.exists():
        async with aiofiles.open(config_file, 'r', encoding='utf-8') as f:
            config = json.loads(await f.read())
    else:
        config = {"id": course_id}
    
    # Update config with provided fields
    if course_update.title is not None:
        config["title"] = course_update.title
    if course_update.description is not None:
        config["description"] = course_update.description
    if course_update.level is not None:
        config["level"] = course_update.level
    if course_update.author is not None:
        config["author"] = course_update.author
    if course_update.tags is not None:
        config["tags"] = course_update.tags
    
    # Save updated config
    async with aiofiles.open(config_file, 'w', encoding='utf-8') as f:
        await f.write(json.dumps(config, indent=2, ensure_ascii=False))
    
    return await get_course_info(course_id)

@app.put("/api/courses/{course_id}/slides")
async def update_course_slides(course_id: str, slides_update: SlidesUpdate):
    course_path = COURSES_DIR / course_id
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    slides_file = course_path / "slides" / "slides.md"
    
    # Save updated slides content
    async with aiofiles.open(slides_file, 'w', encoding='utf-8') as f:
        await f.write(slides_update.content)
    
    # Return updated slides
    return await get_course_slides_internal(course_id)

@app.post("/api/courses/import")
async def import_course(file: UploadFile = File(...)):
    # Validate file type
    if not (file.filename.endswith('.zip') or file.filename.endswith('.md')):
        raise HTTPException(status_code=400, detail="File must be a ZIP archive (.zip) or markdown (.md) file")
    
    if file.filename.endswith('.zip'):
        return await import_course_from_zip(file)
    else:
        # For backward compatibility, still support markdown import with basic course creation
        return await import_course_from_markdown_file(file)

async def import_course_from_zip(file: UploadFile):
    # Create temporary directory for extraction
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        zip_path = temp_path / file.filename
        
        # Save uploaded ZIP file
        content = await file.read()
        with open(zip_path, 'wb') as f:
            f.write(content)
        
        # Extract ZIP file
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_path)
        except zipfile.BadZipFile:
            raise HTTPException(status_code=400, detail="Invalid ZIP file")
        
        # Find course directory (should contain config.json)
        course_dir = None
        for item in temp_path.iterdir():
            if item.is_dir() and (item / "config.json").exists():
                course_dir = item
                break
        
        if not course_dir:
            # Check if files are in root of ZIP
            if (temp_path / "config.json").exists():
                course_dir = temp_path
            else:
                raise HTTPException(status_code=400, detail="ZIP file must contain a course directory with config.json")
        
        # Read config.json
        config_file = course_dir / "config.json"
        try:
            async with aiofiles.open(config_file, 'r', encoding='utf-8') as f:
                config = json.loads(await f.read())
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid config.json: {str(e)}")
        
        # Generate course ID from config
        course_id = config.get("id") or generate_course_id(config.get("title", "imported-course"))
        target_path = COURSES_DIR / course_id
        
        # Check if course already exists
        if target_path.exists():
            raise HTTPException(status_code=400, detail=f"Course with ID '{course_id}' already exists")
        
        # Copy course directory to courses folder
        shutil.copytree(course_dir, target_path)
        
        # Ensure config has correct ID
        config["id"] = course_id
        config_target = target_path / "config.json"
        async with aiofiles.open(config_target, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(config, indent=2, ensure_ascii=False))
        
        # Create required directories if they don't exist
        (target_path / "slides").mkdir(exist_ok=True)
        (target_path / "labs").mkdir(exist_ok=True)
        (target_path / "assets").mkdir(exist_ok=True)
        
        # Return course info
        return await get_course_info(course_id)

async def import_course_from_markdown_file(file: UploadFile):
    # Read markdown content
    content = await file.read()
    try:
        markdown_content = content.decode('utf-8')
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be UTF-8 encoded")
    
    # Extract title from filename or content
    title = file.filename.replace('.md', '').replace('-', ' ').title()
    
    # Create course using the markdown content
    course_data = CourseCreate(
        title=title,
        description=f"Imported from {file.filename}",
        level="Beginner",
        author="Training Team",
        tags=[],
        slides_content=markdown_content
    )
    
    return await create_course(course_data)

@app.delete("/api/courses/{course_id}")
async def delete_course(course_id: str):
    course_path = COURSES_DIR / course_id
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Remove course directory and all its contents
    import shutil
    shutil.rmtree(course_path)
    
    return {"message": f"Course {course_id} deleted successfully"}

@app.get("/api/courses/template/download")
async def download_course_template():
    """Download a complete course template with example content"""
    template_path = Path(__file__).parent.parent.parent / "course-template.zip"
    
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Course template not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        path=template_path,
        filename="course-template.zip",
        media_type="application/zip",
        headers={
            "Content-Description": "Course Template Package",
            "Content-Disposition": "attachment; filename=course-template.zip"
        }
    )

# Slides endpoints
@app.get("/api/slides/courses/{course_name}")
async def get_course_slides_files(course_name: str):
    """Get all slides files for a specific course"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    slides_dir = course_path / "slides"
    if not slides_dir.exists():
        return {"course_name": course_name, "slides": []}
    
    slides = []
    for slide_file in slides_dir.glob("*.md"):
        try:
            async with aiofiles.open(slide_file, 'r', encoding='utf-8') as f:
                content = await f.read()
            
            # Parse frontmatter and content
            post = frontmatter.loads(content)
            md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables', 'toc'])
            html_content = md.convert(post.content)
            
            # Extract title from content (first # heading)
            title_match = re.search(r'^#\s+(.+)$', post.content, re.MULTILINE)
            title = title_match.group(1) if title_match else slide_file.stem.replace('-', ' ').title()
            
            slide_info = {
                "filename": slide_file.name,
                "title": title,
                "content": post.content,
                "html": html_content,
                "metadata": post.metadata,
            }
            
            slides.append(slide_info)
            
        except Exception as e:
            print(f"Error processing slide file {slide_file}: {e}")
            continue
    
    # Sort by filename
    slides.sort(key=lambda x: x['filename'])
    
    return {"course_name": course_name, "slides": slides}

@app.get("/api/slides/courses/{course_name}/file/{filename}")
async def get_slide_file_content(course_name: str, filename: str):
    """Get specific slide file content"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    slide_file = course_path / "slides" / filename
    if not slide_file.exists():
        raise HTTPException(status_code=404, detail="Slide file not found")
    
    try:
        async with aiofiles.open(slide_file, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        # Parse frontmatter and content
        post = frontmatter.loads(content)
        md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables', 'toc'])
        html_content = md.convert(post.content)
        
        # Extract title from content (first # heading)
        title_match = re.search(r'^#\s+(.+)$', post.content, re.MULTILINE)
        title = title_match.group(1) if title_match else slide_file.stem.replace('-', ' ').title()
        
        return {
            "filename": filename,
            "title": title,
            "content": post.content,
            "html": html_content,
            "metadata": post.metadata
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading slide file: {str(e)}")

# Labs endpoints
@app.get("/api/labs/courses/{course_name}")
async def get_course_labs(course_name: str):
    """Get all lab files for a specific course"""
    labs = []
    
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    labs_dir = course_path / "labs"
    if not labs_dir.exists():
        return {"course_name": course_name, "labs": []}
    
    # Look for lab files in the labs directory
    for lab_file in labs_dir.glob("lab-*.md"):
        try:
            # Extract lab number from filename (lab-1.md -> 1)
            chapter_match = re.search(r"lab-(\d+)\.md", lab_file.name)
            if not chapter_match:
                continue
                
            chapter = int(chapter_match.group(1))
            
            async with aiofiles.open(lab_file, 'r', encoding='utf-8') as f:
                content = await f.read()
            
            # Parse frontmatter and content
            post = frontmatter.loads(content)
            md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables', 'toc'])
            html_content = md.convert(post.content)
            
            # Extract title from content (first # heading)
            title_match = re.search(r'^#\s+(.+)$', post.content, re.MULTILINE)
            title = title_match.group(1) if title_match else f"Lab {chapter}"
            
            lab_info = {
                "course_name": course_name,
                "chapter": chapter,
                "title": title,
                "content": post.content,
                "html": html_content,
                "metadata": post.metadata,
                "filename": lab_file.name
            }
            
            labs.append(lab_info)
            
        except Exception as e:
            print(f"Error processing lab file {lab_file}: {e}")
            continue
    
    # Sort by chapter number
    labs.sort(key=lambda x: x['chapter'])
    
    return {"course_name": course_name, "labs": labs}

@app.get("/api/labs/courses/{course_name}/chapter/{chapter_no}")
async def get_lab_content(course_name: str, chapter_no: int):
    """Get specific lab content by course name and chapter number"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    lab_file = course_path / "labs" / f"lab-{chapter_no}.md"
    if not lab_file.exists():
        raise HTTPException(status_code=404, detail="Lab not found")
    
    try:
        async with aiofiles.open(lab_file, 'r', encoding='utf-8') as f:
            content = await f.read()
        
        # Parse frontmatter and content
        post = frontmatter.loads(content)
        md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables', 'toc'])
        html_content = md.convert(post.content)
        
        # Extract title from content (first # heading)
        title_match = re.search(r'^#\s+(.+)$', post.content, re.MULTILINE)
        title = title_match.group(1) if title_match else f"Lab {chapter_no}"
        
        return {
            "course_name": course_name,
            "chapter": chapter_no,
            "title": title,
            "content": post.content,
            "html": html_content,
            "metadata": post.metadata
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading lab content: {str(e)}")

@app.get("/api/labs/courses")
async def get_all_course_labs():
    """Get all available labs grouped by course"""
    courses_labs = {}
    
    # Iterate through all course directories
    for course_dir in COURSES_DIR.iterdir():
        if course_dir.is_dir():
            course_name = course_dir.name
            labs_dir = course_dir / "labs"
            
            if not labs_dir.exists():
                continue
                
            course_labs = []
            
            # Look for lab files in the labs directory
            for lab_file in labs_dir.glob("lab-*.md"):
                try:
                    # Extract lab number from filename (lab-1.md -> 1)
                    chapter_match = re.search(r"lab-(\d+)\.md", lab_file.name)
                    if not chapter_match:
                        continue
                        
                    chapter = int(chapter_match.group(1))
                    
                    async with aiofiles.open(lab_file, 'r', encoding='utf-8') as f:
                        content = await f.read()
                    
                    # Extract title from content
                    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
                    title = title_match.group(1) if title_match else f"Lab {chapter}"
                    
                    course_labs.append({
                        "chapter": chapter,
                        "title": title,
                        "filename": lab_file.name
                    })
                    
                except Exception as e:
                    print(f"Error processing lab file {lab_file}: {e}")
                    continue
            
            # Sort labs within each course by chapter number
            if course_labs:
                course_labs.sort(key=lambda x: x['chapter'])
                courses_labs[course_name] = course_labs
    
    return courses_labs

@app.get("/api/courses/{course_name}/assets")
async def get_course_assets(course_name: str):
    """Get all assets for a specific course"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    assets_dir = course_path / "assets"
    if not assets_dir.exists():
        return {"course_name": course_name, "assets": []}
    
    assets = []
    for file_path in assets_dir.rglob("*"):
        if file_path.is_file():
            # Calculate relative path from assets directory
            relative_path = file_path.relative_to(assets_dir)
            file_size = file_path.stat().st_size
            file_extension = file_path.suffix.lower()
            
            # Determine if file is previewable
            previewable_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.mov', '.avi', '.webm'}
            can_preview = file_extension in previewable_extensions
            
            # Determine file type
            image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
            video_extensions = {'.mp4', '.mov', '.avi', '.webm'}
            
            if file_extension in image_extensions:
                file_type = "image"
            elif file_extension in video_extensions:
                file_type = "video"
            else:
                file_type = "document"
            
            assets.append({
                "name": file_path.name,
                "path": str(relative_path),
                "size": file_size,
                "type": file_type,
                "can_preview": can_preview,
                "url": f"/assets/{course_name}/{relative_path}"
            })
    
    # Sort assets by type, then by name
    assets.sort(key=lambda x: (x["type"], x["name"].lower()))
    
    return {"course_name": course_name, "assets": assets}

@app.post("/api/courses/{course_name}/assets/upload")
async def upload_course_asset(course_name: str, file: UploadFile = File(...)):
    """Upload an asset to a course"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    assets_dir = course_path / "assets"
    assets_dir.mkdir(exist_ok=True)
    
    # Sanitize filename
    safe_filename = re.sub(r'[^a-zA-Z0-9\-_\.]', '_', file.filename or 'unnamed_file')
    file_path = assets_dir / safe_filename
    
    # Check if file already exists and add number suffix if needed
    counter = 1
    original_stem = file_path.stem
    original_suffix = file_path.suffix
    while file_path.exists():
        file_path = assets_dir / f"{original_stem}_{counter}{original_suffix}"
        counter += 1
    
    # Save the file
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Return file info
        file_size = file_path.stat().st_size
        file_extension = file_path.suffix.lower()
        
        previewable_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.mov', '.avi', '.webm'}
        can_preview = file_extension in previewable_extensions
        
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
        video_extensions = {'.mp4', '.mov', '.avi', '.webm'}
        
        if file_extension in image_extensions:
            file_type = "image"
        elif file_extension in video_extensions:
            file_type = "video"
        else:
            file_type = "document"
        
        relative_path = file_path.relative_to(assets_dir)
        
        return {
            "message": "File uploaded successfully",
            "asset": {
                "name": file_path.name,
                "path": str(relative_path),
                "size": file_size,
                "type": file_type,
                "can_preview": can_preview,
                "url": f"/assets/{course_name}/{relative_path}"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")

@app.delete("/api/courses/{course_name}/assets/{path:path}")
async def delete_course_asset(course_name: str, path: str):
    """Delete an asset from a course"""
    course_path = COURSES_DIR / course_name
    if not course_path.exists():
        raise HTTPException(status_code=404, detail="Course not found")
    
    assets_dir = course_path / "assets"
    file_path = assets_dir / path
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Security check - ensure we're not accessing files outside the assets directory
    try:
        file_path.resolve().relative_to(assets_dir.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        file_path.unlink()
        return {"message": "Asset deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete asset: {str(e)}")

# Helper functions
def generate_course_id(title: str) -> str:
    # Convert title to URL-friendly ID
    course_id = re.sub(r'[^a-zA-Z0-9\s\-]', '', title)
    course_id = re.sub(r'\s+', '-', course_id.strip())
    course_id = course_id.lower()
    
    # Add UUID suffix if ID is too short or conflicts
    if len(course_id) < 3:
        course_id = f"course-{str(uuid.uuid4())[:8]}"
    
    return course_id

async def get_course_slides_internal(course_id: str):
    """Internal function to get course slides without HTTP exception handling"""
    course_path = COURSES_DIR / course_id
    slides_file = course_path / "slides" / "slides.md"
    
    if not slides_file.exists():
        return {"metadata": {}, "slides": [], "html": ""}
    
    async with aiofiles.open(slides_file, 'r', encoding='utf-8') as f:
        content = await f.read()
    
    post = frontmatter.loads(content)
    md = markdown.Markdown(extensions=['codehilite', 'fenced_code', 'tables'])
    html_content = md.convert(post.content)
    
    slides = parse_slides(post.content)
    
    return {
        "metadata": post.metadata,
        "slides": slides,
        "html": html_content
    }

async def get_course_info(course_id: str) -> Dict[str, Any]:
    course_path = COURSES_DIR / course_id
    config_file = course_path / "config.json"
    
    info = {
        "id": course_id,
        "title": course_id.replace("-", " ").title(),
        "description": f"Training course: {course_id}",
        "slides_count": 0
    }
    
    if config_file.exists():
        async with aiofiles.open(config_file, 'r', encoding='utf-8') as f:
            import json
            config = json.loads(await f.read())
            info.update(config)
    
    slides_file = course_path / "slides" / "slides.md"
    if slides_file.exists():
        async with aiofiles.open(slides_file, 'r', encoding='utf-8') as f:
            content = await f.read()
            slides = parse_slides(content)
            info["slides_count"] = len(slides)
    
    return info

def parse_slides(content: str) -> List[Dict[str, str]]:
    slides = []
    slide_parts = content.split('---')
    
    for i, part in enumerate(slide_parts):
        if part.strip():
            slide = {
                "id": f"slide-{i + 1}",
                "content": part.strip(),
                "html": markdown.markdown(part.strip(), extensions=['codehilite', 'fenced_code', 'tables'])
            }
            slides.append(slide)
    
    return slides

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)