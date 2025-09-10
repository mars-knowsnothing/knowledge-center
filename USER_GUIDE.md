# Training System v2 - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Course Management](#course-management)
3. [Professional Presentation System](#professional-presentation-system)
4. [ZIP Course Import](#zip-course-import)
5. [Template Course](#template-course)
6. [Creating Labs](#creating-labs)
7. [Managing Assets](#managing-assets)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 18+ and yarn
- Python 3.11+ and uv
- Modern web browser

### Quick Setup
1. Clone the repository
2. Navigate to `training-system-v2/`
3. Run `./start_all_services.sh`
4. Open http://localhost:3000 in your browser

### First Time Setup
The system will automatically:
- Install frontend dependencies with yarn
- Set up Python virtual environment with uv
- Start both frontend and backend services
- Handle port conflicts automatically

## Course Management

### Viewing Courses
1. Navigate to the **Courses** page from the sidebar
2. Browse available courses in the card view
3. Each card shows:
   - Course title and description
   - Difficulty level (Beginner/Intermediate/Advanced)
   - Number of slides
   - Duration (if specified)

### Creating a New Course
1. Click **"Create Course"** button on the Courses page
2. Choose between two options:
   - **Create New**: Build from scratch
   - **Import File**: Use existing content

#### Create New Course
1. Fill in the course details:
   - **Title**: Descriptive course name
   - **Description**: What students will learn
   - **Level**: Beginner, Intermediate, or Advanced
   - **Author**: Your name or organization
   - **Tags**: Keywords for searchability (comma-separated)
2. Click **"Create Course"**
3. You'll be redirected to the course page

#### Import Course
See the [ZIP Course Import](#zip-course-import) section below.

### Editing Courses
1. Navigate to a course page
2. Use the course editor to modify content
3. Changes are saved automatically
4. Preview your changes in real-time

### Deleting Courses
**Note**: Course deletion is currently only available via API
```bash
curl -X DELETE http://localhost:8000/api/courses/{course_id}
```

## Professional Presentation System

### Overview
Training System v2 features a completely redesigned presentation system with professional-grade capabilities, fixed aspect ratios, and interactive themes.

### Starting a Presentation

#### From Course Page
1. Navigate to any course page
2. Find the slides section
3. Click the **"Present"** button (blue button) on any slide
4. System automatically enters presentation mode

#### What Happens Automatically
- Switches to standard 16:9 aspect ratio
- Loads with default Minimal theme
- Shows interactive control overlay
- Displays slide 1 ready for presentation

### Interactive Controls

#### Navigation Controls
Located at the bottom center of each slide:

- **Previous/Next Buttons**: Navigate between slides
- **Play/Pause Button**: Auto-advance slides (5-second intervals)
- **Fullscreen Toggle**: Enter/exit immersive fullscreen mode

#### Keyboard Shortcuts
- **Left/Right Arrow Keys**: Navigate slides
- **Space Bar**: Play/pause auto-advance
- **Escape Key**: Exit fullscreen mode

### Theme System

#### Available Themes

**Minimal Theme** (Default):
- Clean white background
- Professional typography
- Subtle accent colors
- Perfect for corporate presentations

**Tech Theme**:
- Dark gradient background
- Animated visual effects
- Blue/purple accent colors
- Great for technical content

#### Layout Options
Each theme supports multiple layouts:

- **Default**: Standard content layout
- **Title Slide**: Centered title with decorative elements
- **Two Column**: Split layout for content and visuals
- **Three Column**: Feature showcase grid
- **Image & Text**: Large visual with accompanying text
- **Section Divider**: Chapter break slides

#### Changing Themes and Layouts

**Global Settings** (applies to all slides by default):
1. During presentation, look for the **color palette icon** (top-right corner)
2. Click to open the **Theme & Layout Settings** modal
3. Choose your preferred theme and layout combination
4. Click **"Apply Changes"** to save settings
5. Changes apply instantly without interrupting presentation

**Mobile-Responsive Design**:
- Modal automatically adapts to mobile screens
- Touch-friendly controls with proper sizing
- Stacked layout for buttons on small screens
- Scrollable content when needed

**Per-Slide Settings** (New):
Individual slides can override global settings using YAML frontmatter:

```markdown
---
layout: title-slide
theme: tech
---

# Your Slide Title
This slide uses tech theme with title-slide layout

---
layout: two-column
theme: minimal
---

# Regular Content
This slide uses minimal theme with two-column layout
```

**Priority**: Per-slide settings take precedence over global settings

### Presentation Features

#### Fixed Aspect Ratio
- **16:9 Standard**: All slides maintain consistent dimensions
- **Responsive Design**: Adapts to different screen sizes
- **Stable Layout**: No content jumping between slides

#### Visual Indicators
- **Progress Bar**: Shows presentation progress at bottom
- **Slide Counter**: Current slide number (bottom-right)
- **Thumbnail Navigation**: Quick slide overview when not in fullscreen

#### Professional Polish
- **Smooth Transitions**: Elegant slide changes
- **Overlay Controls**: Semi-transparent, non-intrusive interface
- **Auto-hide Elements**: Controls fade when not needed
- **Fullscreen Experience**: Distraction-free presentation mode

### Presentation Best Practices

#### Content Preparation
- **Clear Slide Separation**: Use `---` to separate slides in markdown
- **Consistent Structure**: Follow similar layouts throughout
- **Visual Hierarchy**: Use headings, lists, and code blocks appropriately
- **Asset Integration**: Include images and diagrams for visual appeal

#### Delivery Tips
- **Test First**: Preview your presentation before going live
- **Theme Selection**: Choose theme based on audience and content type
- **Navigation Practice**: Familiarize yourself with keyboard shortcuts
- **Backup Plan**: Know how to restart if technical issues occur

#### Technical Considerations
- **Asset Optimization**: Ensure images load quickly
- **Browser Compatibility**: Test in your presentation browser
- **Screen Resolution**: Content scales automatically but test on target screen
- **Internet Connection**: System works offline once loaded

### Troubleshooting Presentations

#### Common Issues

**Controls Not Responding**:
- Refresh the page and try again
- Check that you're clicking in the right areas
- Try keyboard shortcuts as backup

**Theme Not Loading**:
- Wait a moment for theme to fully load
- Try switching themes in the selector
- Refresh page if problems persist

**Aspect Ratio Problems**:
- Ensure browser is not zoomed in/out
- Try fullscreen mode for best experience
- Check browser developer tools for errors

**Content Display Issues**:
- Verify markdown syntax is correct
- Check that images paths are valid
- Ensure slide separators (`---`) are properly formatted

## ZIP Course Import

### Overview
The ZIP import feature allows you to import complete courses with slides, labs, and assets in a single operation.

### Preparing Your ZIP File

#### Required Structure
```
your-course/
├── config.json          # Course metadata (required)
├── slides/slides.md      # Presentation slides
├── labs/                 # Lab exercises
│   ├── lab-1.md
│   ├── lab-2.md
│   └── lab-3.md
└── assets/               # Course assets
    ├── images/
    ├── videos/
    └── documents/
```

#### config.json Format
```json
{
  "id": "my-awesome-course",
  "title": "My Awesome Course",
  "description": "A comprehensive course on awesome topics",
  "level": "Intermediate",
  "duration": "3 hours",
  "author": "Your Name",
  "tags": ["awesome", "comprehensive", "practical"]
}
```

### Importing ZIP Files

#### Step-by-Step Process
1. **Prepare Your Course**:
   - Create the folder structure shown above
   - Write your content in Markdown format
   - Add any assets (images, videos, documents)
   - Create a ZIP file of the entire course folder

2. **Import via Web Interface**:
   - Go to Courses page
   - Click **"Create Course"**
   - Select **"Import File"** tab
   - Choose your ZIP file
   - Click **"Import Course"**

3. **Automatic Processing**:
   - System validates ZIP structure
   - Extracts content to proper location
   - Creates course directories
   - Makes content immediately available

#### Import Validation
The system checks for:
- ✅ Valid ZIP file format
- ✅ Required `config.json` file
- ✅ Valid JSON syntax in config
- ✅ Proper directory structure
- ✅ Course ID uniqueness

### Troubleshooting ZIP Import
- **"ZIP file must contain config.json"**: Ensure config.json is in the root of your course folder
- **"Course ID already exists"**: Change the "id" field in config.json
- **"Invalid ZIP file"**: Check that your ZIP file isn't corrupted
- **"Invalid config.json"**: Validate your JSON syntax

## Template Course

### Overview
The system provides a professional course template with comprehensive example content to help you get started quickly.

### Downloading the Template
1. **Via Web Interface**:
   - Go to Courses page
   - Click **"Create Course"**
   - Select **"Import File"**
   - Look for template download link (coming soon in UI)

2. **Via Direct Link**:
   - Navigate to: http://localhost:8000/api/courses/template/download
   - Browser will download `course-template.zip`

### Template Contents

#### What's Included
- **11 Comprehensive Slides**:
  - Welcome and course overview
  - Learning objectives and prerequisites
  - 4 detailed content modules
  - Assessment and next steps
  - Resources and appendix

- **3 Progressive Labs**:
  - **Lab 1**: Basic implementation (30-45 min)
  - **Lab 2**: Intermediate features (45-60 min)
  - **Lab 3**: Advanced capstone project (90-120 min)

- **Complete Asset Framework**:
  - Example course overview diagram
  - Asset usage guidelines
  - Directory structure templates

- **Professional Documentation**:
  - Comprehensive customization guide
  - Content writing best practices
  - Quality assurance checklist

### Customizing the Template

#### Quick Customization
1. **Download and Extract** the template
2. **Update config.json** with your course information
3. **Modify slides.md** with your content
4. **Customize lab exercises** for your topic
5. **Replace assets** with your materials
6. **Repackage as ZIP** and import

#### Detailed Customization
See the `assets/documents/getting-started.md` file in the template for comprehensive instructions including:
- Content structure guidelines
- Writing best practices
- Asset optimization tips
- Quality assurance processes

## Creating Labs

### Lab Structure
Each lab should follow this structure:
1. **Objectives**: What students will accomplish
2. **Prerequisites**: Required knowledge/setup
3. **Environment**: Tools and time requirements
4. **Instructions**: Step-by-step guidance
5. **Tasks**: Specific deliverables
6. **Assessment**: How work will be evaluated

### Lab Naming Convention
- Use `lab-1.md`, `lab-2.md`, `lab-3.md` format
- Number labs in order of difficulty
- Include descriptive titles in the content

### Lab Content Guidelines

#### Writing Effective Instructions
- **Be specific**: Include exact commands and code
- **Use examples**: Show expected outputs
- **Anticipate problems**: Include troubleshooting sections
- **Progressive complexity**: Build on previous labs
- **Clear objectives**: State what students will learn

#### Lab Markdown Structure
```markdown
# Lab 1: Descriptive Title

## Lab Objectives
- Objective 1
- Objective 2

## Prerequisites
- Knowledge needed
- Tools required

## Instructions

### Step 1: Setup
Detailed setup instructions

### Step 2: Implementation
Code examples and explanations

### Step 3: Testing
How to verify completion

## Assessment Criteria
How work will be evaluated

## Resources
Links and references
```

### Viewing Labs
1. Navigate to **Labs** page from sidebar
2. Select a course to view its labs
3. Click on individual labs to view content
4. Labs display with proper markdown formatting

## Managing Assets

### Asset Types Supported
- **Images**: PNG, JPG, GIF, SVG
- **Videos**: MP4, WebM, AVI
- **Documents**: PDF, TXT, MD, ZIP
- **Other**: Any file type with proper MIME detection

### Asset Organization
```
assets/
├── images/           # Screenshots, diagrams, graphics
│   ├── overview.png
│   └── workflow.svg
├── videos/           # Demonstrations, lectures
│   └── intro.mp4
└── documents/        # References, templates
    ├── guide.pdf
    └── template.zip
```

### Using Assets in Content

#### In Slides
```markdown
![Course Overview](assets/images/overview.png)

Watch the introduction video:
[Introduction](assets/videos/intro.mp4)
```

#### In Labs
```markdown
Reference the architecture diagram:
![Architecture](assets/images/architecture.svg)

Download the starter code:
[Starter Template](assets/documents/starter.zip)
```

### Asset Best Practices
1. **File Sizes**: Keep images under 1MB, videos under 50MB
2. **File Names**: Use descriptive, web-friendly names
3. **Organization**: Group related files in subdirectories
4. **Alt Text**: Include descriptions for accessibility
5. **Formats**: Use web-optimized formats (PNG, JPG, MP4)

## Best Practices

### Course Creation

#### Content Structure
- **Start with objectives**: What will students learn?
- **Logical progression**: Simple to complex concepts
- **Hands-on practice**: Include interactive elements
- **Multiple formats**: Text, visuals, and code examples
- **Real-world applications**: Show practical uses

#### Quality Assurance
- **Test all content**: Verify examples work
- **Check all links**: Ensure resources are accessible  
- **Review flow**: Does content build logically?
- **Get feedback**: Have others review before publishing
- **Maintain currency**: Keep content up to date

### Technical Best Practices

#### Markdown Writing
- Use consistent heading levels
- Include code syntax highlighting
- Break up long sections with visuals
- Use lists and tables for organization
- Add links to external resources

#### Asset Management
- Optimize file sizes for web delivery
- Use consistent naming conventions
- Include alt text for images
- Organize files in logical directories
- Keep backup copies of original files

### User Experience
- **Clear navigation**: Logical content flow
- **Consistent styling**: Professional appearance
- **Mobile-friendly**: Responsive design
- **Fast loading**: Optimized assets
- **Accessible**: Support for screen readers

## Troubleshooting

### Common Issues

#### Course Creation Problems
**Issue**: Course not appearing in list
- **Solution**: Refresh the page, check for JavaScript errors

**Issue**: Slides not rendering correctly
- **Solution**: Check markdown syntax, ensure proper slide separation with `---`

**Issue**: Images not displaying
- **Solution**: Verify file paths, check asset organization

#### Import Problems
**Issue**: ZIP import fails
- **Solutions**:
  - Verify ZIP structure matches requirements
  - Check that config.json is valid JSON
  - Ensure course ID is unique
  - Try with a smaller file first

**Issue**: Content displays incorrectly after import
- **Solutions**:
  - Check markdown syntax in imported files
  - Verify asset paths are correct
  - Refresh the page to clear cache

#### Performance Issues
**Issue**: Slow page loading
- **Solutions**:
  - Optimize image file sizes
  - Check for large video files
  - Clear browser cache
  - Restart services if needed

#### Service Issues
**Issue**: Backend not responding
- **Solutions**:
  - Check if services are running: `./start_all_services.sh`
  - View logs for errors
  - Restart services: `./stop_all_services.sh && ./start_all_services.sh`

### Getting Help

#### Self-Help Resources
1. Check the API documentation: http://localhost:8000/docs
2. Review system logs in `backend.log` and `frontend.log`
3. Verify system requirements are met
4. Try with the template course first

#### Reporting Issues
When reporting issues, include:
- Steps to reproduce the problem
- Error messages (exact text)
- Browser and system information
- Screenshots if relevant
- Sample files that cause issues

### Maintenance

#### Regular Tasks
- **Update dependencies**: Keep packages current
- **Clear logs**: Remove old log files
- **Backup courses**: Export important content
- **Monitor disk space**: Asset files can accumulate

#### System Health
- Services should auto-restart on failure
- Check port conflicts (3000, 8000)
- Monitor memory usage with large files
- Test import/export functionality regularly

---

**Need more help?** Check the technical documentation in `CLAUDE.md` and `API_DOCUMENTATION.md` for detailed system information.