# Component Design System & Micro-Interaction Patterns

## Overview

This document defines the comprehensive component design system for YT-Downloader, including modern micro-interaction patterns, animation strategies, and implementation guidelines. The system builds upon shadcn/ui with enhanced custom styling and behavior patterns.

## Design Tokens

### Color Tokens

```css
:root {
  /* Primary Brand Palette */
  --color-brand-red-50: #fef2f2;
  --color-brand-red-100: #fee2e2;
  --color-brand-red-200: #fecaca;
  --color-brand-red-300: #fca5a5;
  --color-brand-red-400: #f87171;
  --color-brand-red-500: #ef4444; /* YouTube Red Base */
  --color-brand-red-600: #dc2626;
  --color-brand-red-700: #b91c1c;
  --color-brand-red-800: #991b1b;
  --color-brand-red-900: #7f1d1d;

  /* Enhanced YouTube Brand Colors */
  --color-youtube-red: #ff0000;
  --color-youtube-red-hover: #cc0000;
  --color-youtube-red-light: #ff3333;
  --color-youtube-red-dark: #b30000;
  --color-youtube-dark: #0f0f0f;
  --color-youtube-card: #1c1c1c;
  --color-youtube-card-hover: #272727;
  --color-youtube-text-primary: #ffffff;
  --color-youtube-text-secondary: #aaaaaa;
  --color-youtube-text-tertiary: #666666;
  --color-youtube-border: #303030;
  --color-youtube-border-light: #404040;
  
  /* Semantic Colors */
  --color-success-50: #ecfdf5;
  --color-success-500: #00B877;  /* Darker, more readable green */
  --color-success-900: #064e3b;
  --color-success-foreground: #047857;  /* More vivid green for better readability */
  --color-warning-50: #fffbeb;
  --color-warning-500: #FF8C00;
  --color-warning-900: #78350f;
  --color-warning-foreground: #78350f;
  --color-error-50: #fef2f2;
  --color-error-500: #FF4444;
  --color-error-900: #7f1d1d;
  --color-error-foreground: #7f1d1d;
  --color-info-50: #eff6ff;
  --color-info-500: #3B82F6;
  --color-info-900: #1e3a8a;
  --color-info-foreground: #1e3a8a;
  
  /* Additional semantic colors for light theme */
  --color-amber-foreground: #92400e;
  --color-orange-foreground: #c2410c;
  --color-blue-foreground: #1e40af;
  
  /* Surface & Text Colors */
  --color-surface-primary: #0F0F0F;
  --color-surface-secondary: #1C1C1C;
  --color-surface-tertiary: #272727;
  --color-surface-elevated: #383838;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #AAAAAA;
  --color-text-tertiary: #666666;
  --color-text-inverse: #000000;
}
```

### Enhanced Spacing Scale

```css
:root {
  /* Enhanced Spacing Scale (rem units) */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1-5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2-5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3-5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-11: 2.75rem;    /* 44px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-28: 7rem;       /* 112px */
  --space-32: 8rem;       /* 128px */
  --space-36: 9rem;       /* 144px */
  --space-40: 10rem;      /* 160px */
  --space-44: 11rem;      /* 176px */
  --space-48: 12rem;      /* 192px */
  --space-52: 13rem;      /* 208px */
  --space-56: 14rem;      /* 224px */
  --space-60: 15rem;      /* 240px */
  --space-64: 16rem;      /* 256px */
  --space-72: 18rem;      /* 288px */
  --space-80: 20rem;      /* 320px */
  --space-96: 24rem;      /* 384px */
}
```

### Enhanced Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.375rem;      /* 6px */
  --radius-md: 0.5rem;        /* 8px */
  --radius-lg: 0.75rem;       /* 12px */
  --radius-xl: 1rem;          /* 16px */
  --radius-2xl: 1.25rem;      /* 20px */
  --radius-3xl: 1.5rem;       /* 24px */
  --radius-4xl: 2rem;         /* 32px */
  --radius-full: 9999px;
}
```

### Enhanced Shadow Scale

```css
:root {
  --shadow-none: 0 0 #0000;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  
  /* Colored Shadows */
  --shadow-brand: 0 8px 32px rgba(239, 68, 68, 0.3);
  --shadow-success: 0 8px 32px rgba(0, 208, 132, 0.3);
  --shadow-warning: 0 8px 32px rgba(255, 140, 0, 0.3);
  --shadow-error: 0 8px 32px rgba(255, 68, 68, 0.3);
  --shadow-info: 0 8px 32px rgba(59, 130, 246, 0.3);
  
  /* Glassmorphism Shadows */
  --shadow-glass: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  --shadow-glass-lg: 0 12px 40px 0 rgba(31, 38, 135, 0.4);
}
```

## Enhanced Component System

### Navbar Component

The Navbar component provides consistent navigation across the application with the following features:

- Responsive design with mobile-friendly hamburger menu
- Logo with brand identity
- Navigation links to key pages (Home, About)
- Theme toggle for light/dark mode
- Sticky positioning for easy access

```tsx
interface NavbarProps {
  // No props required - uses Next.js routing
}
```

```css
/* Navbar Styles */
.navbar {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background)/95;
  backdrop-filter: blur(12px);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-lg);
}
```

### Footer Component

The Footer component provides comprehensive information and links at the bottom of pages:

- Brand information with logo
- Feature highlights
- Quick navigation links
- Legal information
- Social media links
- Copyright and disclaimer

```tsx
interface FooterProps {
  // No props required
}
```

```css
/* Footer Styles */
.footer {
  background: var(--color-youtube-card);
  border-top: 1px solid var(--color-border);
  margin-top: 5rem;
  padding: 3rem 0;
}
```

### Enhanced Button System

#### Button Variants

##### Primary Button (Smart Download)

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}
```

```css
/* Primary Button Styles */
.btn-primary {
  /* Base Styles */
  background: linear-gradient(135deg, var(--color-success-500) 0%, #00B874 100%);
  border: none;
  border-radius: var(--radius-xl);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  /* Size Variants */
  &.size-sm { padding: var(--space-2) var(--space-4); font-size: 0.875rem; }
  &.size-md { padding: var(--space-3) var(--space-6); font-size: 1rem; }
  &.size-lg { padding: var(--space-4) var(--space-8); font-size: 1.125rem; }
  &.size-xl { padding: var(--space-5) var(--space-10); font-size: 1.25rem; }

  /* Interaction States */
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl), var(--shadow-success);
  }

  &:active {
    transform: translateY(0);
    transition-duration: 0.1s;
  }

  &:focus-visible {
    outline: 2px solid var(--color-success-500);
    outline-offset: 2px;
  }

  /* Loading State */
  &.loading {
    color: transparent;
    pointer-events: none;
  }

  &.loading::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* Shimmer Effect for Loading */
.btn-primary.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

##### Secondary Button (Manual Selection)

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  border-radius: var(--radius-xl);
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
}
```

##### Ghost Button (Subtle Actions)

```css
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  padding: var(--space-2) var(--space-4);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
```

### Enhanced Card System

#### Glassmorphism Card

```css
.youtube-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.light .youtube-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.06);
}
```

### Enhanced Input System

#### YouTube-inspired Input Field

```css
.youtube-input {
  background: rgba(28, 28, 28, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  color: var(--color-text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: var(--space-4) var(--space-6);
  font-size: 1rem;
}

.light .youtube-input {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: var(--color-text-primary);
}

.youtube-input:focus {
  border-color: var(--color-brand-red-500);
  background: var(--color-surface-secondary);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1), var(--shadow-lg);
  transform: scale(1.01);
}

.light .youtube-input:focus {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15), 0 4px 20px rgba(0, 0, 0, 0.12);
}

.youtube-input::placeholder {
  color: var(--color-text-tertiary);
  transition: color 0.3s ease;
}

.youtube-input:focus::placeholder {
  color: transparent;
}
```

## Micro-Interaction Patterns

### Loading States

#### Pulse Loader

```css
.pulse-loader {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-info-500);
  animation: pulse 1.5s infinite ease-in-out;
}

.pulse-dot:nth-child(1) { animation-delay: -0.32s; }
.pulse-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Animation System

#### Fade In Up

```css
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Shimmer Effect

```css
.animate-shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(to right, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.1) 50%, 
    rgba(255,255,255,0) 100%);
  background-size: 1000px 100%;
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

## Responsive Design Patterns

### Mobile-First Approach

```css
/* Base mobile styles */
.component {
  padding: var(--space-4);
  margin: var(--space-2);
}

/* Tablet enhancements */
@media (min-width: 640px) {
  .component {
    padding: var(--space-6);
    margin: var(--space-4);
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
    margin: var(--space-6);
  }
}
```

## Accessibility Features

### Focus Management

```css
.focus-visible {
  outline: 2px solid var(--color-brand-red-500);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### Screen Reader Support

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Theme Support

### Dark Mode

```css
.dark {
  --color-background: oklch(0.145 0 0);
  --color-foreground: oklch(0.985 0 0);
  --color-card: oklch(0.145 0 0);
  --color-card-foreground: oklch(0.985 0 0);
  
  /* Dark mode overrides for success colors */
  --color-success-500: #10b981; /* Brighter green for dark mode */
  --color-success-foreground: #34d399; /* Lighter, more visible green text for dark mode */
  
  /* Dark theme YouTube colors */
  --color-youtube-dark: #0f0f0f;
  --color-youtube-card: #1c1c1c;
  --color-youtube-card-hover: #272727;
  --color-youtube-text-primary: #ffffff;
  --color-youtube-text-secondary: #aaaaaa;
  --color-youtube-text-tertiary: #666666;
  --color-youtube-border: #303030;
  --color-surface-primary: #0F0F0F;
  --color-surface-secondary: #1C1C1C;
  --color-surface-tertiary: #272727;
}
```

### Light Mode

```css
.light {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.09 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.09 0 0);
  
  /* Light theme semantic colors with better contrast */
  --color-success-foreground: #0ace38; /* Darker green for higher contrast */
  --color-warning-foreground: #b45309;
  --color-error-foreground: #dc2626;
  --color-info-foreground: #1d4ed8;
  
  /* Light theme YouTube colors - More distinct */
  --color-youtube-dark: #0f0f0f;
  --color-youtube-card: #ffffff;
  --color-youtube-card-hover: #f8f9fa;
  --color-youtube-text-primary: #0f0f0f;
  --color-youtube-text-secondary: #5f6368;
  --color-youtube-text-tertiary: #80868b;
  --color-youtube-border: #dadce0;
  --color-surface-primary: #ffffff;
  --color-surface-secondary: #f8f9fa;
  --color-surface-tertiary: #f1f3f4;
}
```