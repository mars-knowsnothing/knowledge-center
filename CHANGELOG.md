# Changelog

All notable changes to the Training System v2 will be documented in this file.

## [2024-09-10] - Theme & Layout Improvements

### ✅ Added
- **Per-Slide Theme & Layout Configuration**: Individual slides can now specify their own theme and layout using YAML frontmatter
- **Responsive Theme Selector**: Complete mobile-first redesign of Theme & Layout Settings modal
- **Enhanced Slide Parser**: Backend now correctly parses YAML frontmatter from slide content
- **Mobile-Optimized Controls**: Touch-friendly interface with proper minimum tap target sizes
- **Fallback System**: Graceful fallback from per-slide settings to global defaults

### 🔧 Fixed
- **Modal Responsiveness**: Theme & Layout Settings modal now properly adapts to mobile screens
- **Button Visibility**: Apply Changes button always visible regardless of content length
- **Content Scrolling**: Modal content scrolls properly when needed while keeping buttons fixed
- **Slide Parsing**: YAML frontmatter no longer displays as literal text in presentations
- **Layout Application**: Per-slide layout and theme settings now correctly override global settings

### 📱 Improved
- **Touch Interface**: Minimum 44px touch targets for all interactive elements
- **Grid Layouts**: Responsive grid layouts (1→2 columns for themes, 2→3 columns for layouts)
- **Stacked Buttons**: Buttons stack vertically on mobile for better UX
- **Content Organization**: Better spacing and typography hierarchy in modal

### 🎨 Examples
Per-slide configuration now works seamlessly:

```markdown
---
layout: two-column
theme: tech
---

# Technical Content
This slide will use the tech theme with two-column layout

---
layout: title-slide
theme: minimal
---

# Clean Title Slide
This slide will use minimal theme with title-slide layout
```

### 🛠️ Technical Details
- **Backend**: Enhanced `parse_slides()` function with proper YAML frontmatter extraction
- **Frontend**: Updated `SlideViewer` and `SlideShow` components to use slide-specific metadata
- **API**: Slide objects now include `metadata` field with theme/layout information
- **Responsive**: Mobile-first CSS with proper breakpoints and touch considerations

### 📖 Documentation Updated
- **README.md**: Added per-slide configuration examples and recent improvements section
- **API_DOCUMENTATION.md**: Updated slide response format and added frontmatter documentation
- **USER_GUIDE.md**: Enhanced presentation system guide with mobile features and YAML examples
- **CHANGELOG.md**: Created comprehensive changelog (this file)