import TechTheme from './TechTheme'
import MinimalTheme from './MinimalTheme'

export interface ThemeConfig {
  name: string
  component: React.ComponentType<any>
  preview: string
  layouts: {
    name: string
    value: string
    description: string
  }[]
}

export const themes: Record<string, ThemeConfig> = {
  tech: {
    name: 'Tech Theme',
    component: TechTheme,
    preview: 'Dark gradient background with tech-inspired styling',
    layouts: [
      { name: 'Default', value: 'default', description: 'Standard content layout' },
      { name: 'Title Slide', value: 'title-slide', description: 'Centered title with accent' },
      { name: 'Two Column', value: 'two-column', description: 'Split content and visual' },
      { name: 'Three Column', value: 'three-column', description: 'Feature showcase grid' },
      { name: 'Image & Text', value: 'image-text', description: 'Large image with content' },
      { name: 'Section Divider', value: 'section', description: 'Chapter break slide' }
    ]
  },
  minimal: {
    name: 'Minimal Theme',
    component: MinimalTheme,
    preview: 'Clean white background with subtle accents',
    layouts: [
      { name: 'Default', value: 'default', description: 'Clean content layout' },
      { name: 'Title Slide', value: 'title-slide', description: 'Centered title presentation' },
      { name: 'Two Column', value: 'two-column', description: 'Content with chart area' },
      { name: 'Three Column', value: 'three-column', description: 'Feature comparison layout' },
      { name: 'Image & Text', value: 'image-text', description: 'Image with detailed text' },
      { name: 'Section Divider', value: 'section', description: 'Clean section break' }
    ]
  }
}

export const getTheme = (themeName: string) => {
  return themes[themeName] || themes.minimal
}