# Enhanced UI Wireframes and Layout Specifications

## Overview

This document provides detailed wireframes and layout specifications for
the YT-Downloader frontend revamp. The designs focus on modern aesthetics,
improved user experience, and mobile-first responsive patterns.

## Desktop Layout Wireframes

### 1. Enhanced Header Design

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [🔴 YTDownloader Pro]                    [🌙 Theme] [⚙️ Settings] [ℹ️ Help] │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🎬 Download Videos, Your Way.                                           │ │
│ │ ✨ Fast • 🎯 Smart • 🔒 Secure                                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Header Specifications:**

- **Height**: 80px (sticky positioning)
- **Background**: Glassmorphism effect with backdrop-blur
- **Logo**: Animated pulse effect on YouTube red icon
- **Typography**: Space Grotesk for branding, 24px bold
- **Actions**: Theme toggle, settings dropdown, help tooltip

### 2. Hero Section Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                          🎬 DOWNLOAD VIDEOS, YOUR WAY                        │
│                                                                              │
│                    Save YouTube content in stunning quality                  │
│                           Fast • Secure • Distraction-free                   │
│                                                                              │
│              [🟢 Smart] [🔵 Auto Quality] [🔴 Instant Merge]                 │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔗 Paste YouTube Link                                                   │ │
│ │ ┌─────────────────────────────────────────────┐ [Get Video]        │ │
│ │ │ https://www.youtube.com/watch?v=...             │                     │ │
│ │ └─────────────────────────────────────────────┘                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Hero Section Specifications:**

- **Typography**:
  - Main heading: 4xl (clamp(2.25rem, 1.9rem + 1.75vw, 3.5rem))
  - Subtitle: xl (clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem))
- **Spacing**: 16rem top margin, 8rem bottom margin
- **Status Indicators**: Animated dots with semantic colors
- **URL Input**: Enhanced glassmorphism card with 16px border-radius

### 3. Video Information Display

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┐ ┌─────────────────────────────────────────────────┐ │
│ │                     │ │ 📺 Amazing Video Title Here                      │ │
│ │    Video Thumbnail  │ │ 👤 Channel Name                                  │ │
│ │      [Play Icon]    │ │ ⏱️ Duration: 10:35 • 👁️ 1.2M views              │ │
│ │                     │ │                                                  │ │
│ │                     │ │ 📊 Available Quality Options:                    │ │
│ │                     │ │ [4K] [1080p] [720p] [480p] [Audio Only]         │ │
│ └─────────────────────┘ └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Video Info Specifications:**

- **Layout**: CSS Grid with 300px thumbnail and flexible content
- **Thumbnail**: Aspect ratio 16:9 with overlay play button
- **Typography**:
  - Title: text-2xl, font-semibold
  - Metadata: text-sm, text-secondary
- **Quality Badges**: Pill-shaped with semantic colors

### 4. Enhanced Download Interface

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ ┌─ Smart Download ─────────────────┐ ┌─ Manual Selection ─────────────────┐ │
│ │                                  │ │                                     │ │
│ │ ⚡ Best Quality Auto-Selected     │ │ 📋 Choose Your Options             │ │
│ │                                  │ │                                     │ │
│ │ 🎬 Video: 1080p (H.264)          │ │ ┌─────────────────────────────────┐ │ │
│ │ 🎵 Audio: 320kbps (AAC)          │ │ │ Video Streams                   │ │ │
│ │ 📦 Output: MP4 (Merged)          │ │ │ ○ 4K (2160p) - 150MB          │ │ │
│ │                                  │ │ │ ● 1080p (Best) - 85MB         │ │ │
│ │ [⚡ Smart Download]              │ │ │ ○ 720p - 45MB                  │ │ │
│ │                                  │ │ └─────────────────────────────────┘ │ │
│ │                                  │ │ ┌─────────────────────────────────┐ │ │
│ │                                  │ │ │ Audio Options                   │ │ │
│ │                                  │ │ │ ● 320kbps (High Quality)       │ │ │
│ │                                  │ │ │ ○ 128kbps (Standard)           │ │ │
│ │                                  │ │ │ ○ Audio Only (MP3)             │ │ │
│ │                                  │ │ └─────────────────────────────────┘ │ │
│ │                                  │ │ [📥 Download Selected]             │ │ │
│ └──────────────────────────────────┘ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Download Interface Specifications:**

- **Layout**: Two-column card layout with toggle tabs
- **Smart Download**: Auto-selected options with clear visual indicators
- **Manual Selection**: Grouped radio buttons with file size information
- **Progress States**: Multi-stage progress bar with descriptive text

## Mobile Layout Wireframes

### 1. Mobile Header (Collapsed)

```text
┌─────────────────────────────┐
│ [🔴] YTDownloader    [☰][🌙] │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🎬 Download Videos      │ │
│ │ ✨ Your Way             │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 2. Mobile URL Input

``text
┌─────────────────────────────┐
│ 🔗 Paste YouTube Link       │
│ ┌─────────────────────────┐ │
│ │ `https://youtu.be/...`    │ │
│ └─────────────────────────┘ │
│ [     Get Video Info      ] │
│                             │
│ Supports videos & playlists │
└─────────────────────────────┘

```text

### 3. Mobile Video Info (Stacked)

```text
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    Video Thumbnail      │ │
│ │      [Play Icon]        │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ 📺 Amazing Video Title      │
│ 👤 Channel Name             │
│ ⏱️ 10:35 • 👁️ 1.2M          │
│                             │
│ Quality: [4K][1080p][720p]  │
└─────────────────────────────┘
```

### 4. Mobile Download Options (Accordion)

```text
┌─────────────────────────────┐
│ ⚡ Smart Download        [>] │
│ ┌─────────────────────────┐ │
│ │ 🎬 1080p + 🎵 320kbps   │ │
│ │ [⚡ Download Best]       │ │
│ └─────────────────────────┘ │
│                             │
│ 🔧 Manual Selection     [v] │
│ ┌─────────────────────────┐ │
│ │ Video Quality:          │ │
│ │ ● 1080p (85MB)          │ │
│ │ ○ 720p (45MB)           │ │
│ │                         │ │
│ │ Audio Quality:          │ │
│ │ ● 320kbps               │ │
│ │ ○ Audio Only            │ │
│ │                         │ │
│ │ [📥 Download]           │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

## Component Specifications

### Enhanced Button System

#### Primary Button (Smart Download)

```css
.btn-primary {
  background: linear-gradient(135deg, #00D084 0%, #00B874 100%);
  border-radius: 12px;
  padding: 16px 32px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 208, 132, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 208, 132, 0.35);
}
```

#### Secondary Button (Manual Download)

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 16px 32px;
}
```

### Enhanced Card System

#### Glassmorphism Card

```css
.card-glass {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Enhanced Input System

#### URL Input Field

```css
.input-enhanced {
  background: rgba(28, 28, 28, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 18px 24px;
  font-size: 1.1rem;
  color: #ffffff;
  transition: all 0.3s ease;
}

.input-enhanced:focus {
  border-color: #FF0000;
  box-shadow: 0 0 0 4px rgba(255, 0, 0, 0.1);
  background: rgba(28, 28, 28, 1);
}
```

## Animation Specifications

### Page Load Sequence

1. **Header**: Slide down from top (300ms delay)
2. **Hero Text**: Fade in up (500ms delay)
3. **URL Input**: Scale in (700ms delay)
4. **Status Indicators**: Stagger fade in (900ms delay)

### Interaction Animations

- **Button Hover**: Scale 1.02x + shadow increase (200ms)
- **Card Hover**: Translate Y -2px + shadow enhance (300ms)
- **Input Focus**: Border color change + glow effect (200ms)
- **Loading States**: Skeleton shimmer + progress bars

### Mobile-Specific Animations

- **Touch Feedback**: Quick scale down 0.96x (100ms)
- **Swipe Gestures**: Horizontal card transitions
- **Scroll Animations**: Parallax effects for hero section

## Responsive Breakpoint Behavior

### Mobile (320px - 639px)

- Single column layout
- Stacked video information
- Accordion-style download options
- Touch-optimized button sizes (44px minimum)

### Tablet (640px - 1023px)

- Two-column layout for download options
- Larger touch targets
- Optimized spacing for tablet interaction

### Desktop (1024px+)

- Three-column layout capability
- Hover states and micro-interactions
- Advanced keyboard navigation
- Larger content areas with improved spacing

## Accessibility Considerations

### Keyboard Navigation

- Tab order: Header → URL Input → Video Info → Download Options
- Enter key triggers primary actions
- Escape key closes modals/dropdowns
- Arrow keys navigate within option groups

### Screen Reader Support

- Semantic HTML structure
- ARIA labels for complex interactions
- Live regions for dynamic content updates
- Descriptive alt text for all visual elements

### Color and Contrast

- All text meets WCAG 2.1 AA standards (4.5:1 ratio)
- Color is not the only indicator of state
- High contrast mode support
- Focus indicators clearly visible

## Performance Optimization

### Critical Rendering Path

1. Above-fold content prioritized
2. Progressive enhancement patterns
3. Lazy loading for below-fold components
4. Optimized font loading strategy

### Animation Performance

- GPU-accelerated transforms only
- Will-change property for animation elements
- Reduced motion respect for accessibility
- 60fps target for all animations

This wireframe specification provides a comprehensive blueprint for implementing the enhanced YT-Downloader interface with modern design patterns, improved usability, and accessibility compliance.
