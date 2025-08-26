# Component Design System & Micro-Interaction Patterns

## Overview

This document defines the comprehensive component design system for YT-Downloader, including modern micro-interaction patterns, animation strategies, and implementation guidelines. The system builds upon shadcn/ui with enhanced custom styling and behavior patterns.

## Design Tokens

### Color Tokens

```css
:root {
  /* Primary Brand Palette */
  --color-brand-50: #fef2f2;
  --color-brand-100: #fee2e2;
  --color-brand-200: #fecaca;
  --color-brand-300: #fca5a5;
  --color-brand-400: #f87171;
  --color-brand-500: #ef4444; /* YouTube Red Base */
  --color-brand-600: #dc2626;
  --color-brand-700: #b91c1c;
  --color-brand-800: #991b1b;
  --color-brand-900: #7f1d1d;

  /* Semantic Colors */
  --color-success: #00D084;
  --color-warning: #FF8C00;
  --color-error: #FF4444;
  --color-info: #3B82F6;

  /* Surface Colors */
  --color-surface-primary: #0F0F0F;
  --color-surface-secondary: #1C1C1C;
  --color-surface-tertiary: #272727;
  --color-surface-elevated: #383838;

  /* Text Colors */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #AAAAAA;
  --color-text-tertiary: #666666;
  --color-text-inverse: #000000;
}
```

### Spacing Scale

```css
:root {
  /* Spacing Scale (rem units) */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.375rem;    /* 6px */
  --radius-md: 0.5rem;      /* 8px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-2xl: 1.25rem;    /* 20px */
  --radius-full: 9999px;
}
```

### Shadow Scale

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.25);
  --shadow-2xl: 0 16px 32px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(255, 0, 0, 0.3);
}
```

## Enhanced Button System

### Button Variants

#### Primary Button (Smart Download)

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
  background: linear-gradient(135deg, var(--color-success) 0%, #00B874 100%);
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
    box-shadow: var(--shadow-xl), 0 0 20px rgba(0, 208, 132, 0.3);
  }

  &:active {
    transform: translateY(0);
    transition-duration: 0.1s;
  }

  &:focus-visible {
    outline: 2px solid var(--color-success);
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

#### Secondary Button (Manual Selection)

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: var(--color-text-primary);
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
}
```

#### Ghost Button (Subtle Actions)

```css
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-primary);
  }
}
```

### Button Micro-Interactions

#### Ripple Effect

```typescript
const useRipple = () => {
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 600ms ease-out;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  
  return createRipple;
};
```

## Enhanced Card System

### Card Variants

#### Glassmorphism Card

```css
.card-glass {
  /* Base Glassmorphism */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-2xl);
  box-shadow: 
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Hover Enhancement */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      var(--shadow-2xl),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Focus State */
  &:focus-within {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }
}
```

#### Feature Card (Download Options)

```css
.card-feature {
  background: rgba(28, 28, 28, 0.95);
  border: 2px solid transparent;
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* Gradient Border Effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(135deg, var(--color-success), var(--color-info));
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: subtract;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }
}
```

### Card Animation Patterns

#### Stagger Animation

```typescript
const useStaggerAnimation = (itemCount: number, delay: number = 100) => {
  useEffect(() => {
    const items = document.querySelectorAll('.stagger-item');
    items.forEach((item, index) => {
      (item as HTMLElement).style.animationDelay = `${index * delay}ms`;
      item.classList.add('animate-fade-in-up');
    });
  }, [itemCount, delay]);
};
```

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out both;
}
```

## Enhanced Input System

### Input Variants

#### URL Input Field

```css
.input-url {
  /* Base Styling */
  background: rgba(28, 28, 28, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-5) var(--space-6);
  font-size: 1.125rem;
  color: var(--color-text-primary);
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  /* Placeholder Styling */
  &::placeholder {
    color: var(--color-text-tertiary);
    transition: color 0.3s ease;
  }

  /* Focus State */
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    background: rgba(28, 28, 28, 1);
    box-shadow: 
      0 0 0 4px rgba(255, 0, 0, 0.1),
      var(--shadow-lg);
    transform: scale(1.01);
  }

  &:focus::placeholder {
    color: transparent;
  }

  /* Valid State */
  &:valid {
    border-color: var(--color-success);
  }

  /* Invalid State */
  &:invalid:not(:placeholder-shown) {
    border-color: var(--color-error);
    animation: shake 0.5s ease-in-out;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

#### Search Input with Icon

```typescript
interface SearchInputProps {
  placeholder?: string;
  icon?: React.ReactNode;
  onSearch?: (value: string) => void;
  loading?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  icon,
  onSearch,
  loading
}) => {
  const [value, setValue] = useState('');
  
  return (
    <div className="input-container">
      {icon && <div className="input-icon">{icon}</div>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-search"
      />
      {loading && <div className="input-spinner">
        <Loader2 className="animate-spin" />
      </div>}
    </div>
  );
};
```

```css
.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--space-4);
  z-index: 1;
  color: var(--color-text-tertiary);
  transition: color 0.3s ease;
}

.input-search {
  padding-left: var(--space-12);
  /* ... other input styles */
}

.input-container:focus-within .input-icon {
  color: var(--color-brand-500);
}

.input-spinner {
  position: absolute;
  right: var(--space-4);
  color: var(--color-brand-500);
}
```

## Progress & Status Components

### Enhanced Progress Bar

```typescript
interface ProgressProps {
  value: number;
  max?: number;
  stages?: Array<{
    label: string;
    color: string;
    threshold: number;
  }>;
  showPercentage?: boolean;
  animated?: boolean;
}
```

```css
.progress-enhanced {
  /* Container */
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  height: 12px;
  overflow: hidden;
  position: relative;

  /* Progress Fill */
  &__fill {
    height: 100%;
    border-radius: inherit;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(90deg, var(--color-success), var(--color-info));
    position: relative;
    overflow: hidden;
  }

  /* Animated Stripe */
  &__fill.animated::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 8px,
      rgba(255, 255, 255, 0.1) 8px,
      rgba(255, 255, 255, 0.1) 16px
    );
    animation: progress-stripes 1s linear infinite;
  }

  /* Stage Indicators */
  &__stages {
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
  }

  &__stage {
    width: 4px;
    height: 28px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    transition: background-color 0.3s ease;
  }

  &__stage.completed {
    background: var(--color-success);
  }
}

@keyframes progress-stripes {
  0% { transform: translateX(-16px); }
  100% { transform: translateX(16px); }
}
```

### Status Badge System

```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border-radius: var(--radius-full);
  font-weight: 500;
  transition: all 0.3s ease;

  /* Size Variants */
  &.size-sm { padding: var(--space-1) var(--space-3); font-size: 0.75rem; }
  &.size-md { padding: var(--space-2) var(--space-4); font-size: 0.875rem; }
  &.size-lg { padding: var(--space-3) var(--space-5); font-size: 1rem; }

  /* Color Variants */
  &.variant-success {
    background: rgba(0, 208, 132, 0.15);
    color: var(--color-success);
    border: 1px solid rgba(0, 208, 132, 0.3);
  }

  &.variant-warning {
    background: rgba(255, 140, 0, 0.15);
    color: var(--color-warning);
    border: 1px solid rgba(255, 140, 0, 0.3);
  }

  &.variant-error {
    background: rgba(255, 68, 68, 0.15);
    color: var(--color-error);
    border: 1px solid rgba(255, 68, 68, 0.3);
  }

  /* Animated Pulse */
  &.animated {
    animation: badge-pulse 2s infinite;
  }
}

@keyframes badge-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 currentColor; 
    opacity: 1; 
  }
  50% { 
    box-shadow: 0 0 0 4px transparent; 
    opacity: 0.8; 
  }
}
```

## Micro-Interaction Patterns

### Hover Animations

#### Magnetic Effect

```typescript
const useMagnetic = (strength: number = 0.5) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0, 0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
};
```

#### Tilt Effect

```css
.tilt-effect {
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.tilt-effect:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
}
```

### Loading States

#### Skeleton Loading

```css
.skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1) 25%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(255, 255, 255, 0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 2s infinite;
  border-radius: var(--radius-md);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton Variants */
.skeleton-text { height: 1rem; width: 100%; }
.skeleton-title { height: 1.5rem; width: 70%; }
.skeleton-button { height: 2.5rem; width: 8rem; }
.skeleton-avatar { width: 3rem; height: 3rem; border-radius: 50%; }
```

#### Pulsing Loader

```css
.pulse-loader {
  display: inline-flex;
  gap: var(--space-1);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand-500);
  animation: pulse-dot 1.4s infinite ease-in-out;
}

.pulse-dot:nth-child(1) { animation-delay: -0.32s; }
.pulse-dot:nth-child(2) { animation-delay: -0.16s; }
.pulse-dot:nth-child(3) { animation-delay: 0; }

@keyframes pulse-dot {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Success Animations

#### Checkmark Animation

```css
.checkmark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-success);
  position: relative;
  animation: checkmark-scale 0.3s ease-in-out;
}

.checkmark::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  animation: checkmark-draw 0.3s ease-in-out 0.1s both;
}

@keyframes checkmark-scale {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes checkmark-draw {
  0% { height: 0; }
  100% { height: 10px; }
}
```

## Responsive Animation Behavior

### Mobile Optimizations

```css
/* Reduced animations for mobile */
@media (max-width: 768px) {
  .card-glass:hover {
    transform: translateY(-2px); /* Reduced from -4px */
  }
  
  .btn-primary:hover {
    transform: translateY(-1px); /* Reduced from -2px */
  }
  
  /* Disable heavy animations on low-power devices */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### Performance Considerations

```css
/* GPU acceleration for animations */
.animate-gpu {
  will-change: transform, opacity;
  transform: translateZ(0);
}

/* Remove will-change after animation */
.animate-complete {
  will-change: auto;
}
```

This component design system provides a comprehensive foundation for building modern, interactive UI components with sophisticated micro-interactions while maintaining excellent performance and accessibility standards.
