# RoLinks Design System

## Core Design Principles

Based on the successful settings page implementation, all future pages should follow these established design patterns for consistency and visual excellence.

## Color Palette & Background

### Main Background
```css
bg-gray-950
```

### Subtle Background Pattern
```css
background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
background-size: 32px 32px;
opacity: 0.02;
```

### Glassmorphism Cards (Primary Pattern)
```css
border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm shadow-sm
```

This creates:
- Ultra-thin transparent borders
- Subtle white overlay on dark background  
- Backdrop blur effects for depth
- Minimal shadow for elevation

## Typography Hierarchy

### Page Headers
```tsx
<h1 className="text-3xl font-bold text-white">Title</h1>
<p className="text-gray-400">Subtitle/description</p>
```

### Card Titles
```tsx
<CardTitle className="text-lg font-semibold text-white">Section Title</CardTitle>
<CardDescription className="text-gray-400">Section description</CardDescription>
```

### Body Text
- Primary text: `text-white`
- Secondary text: `text-gray-400` 
- Muted text: `text-gray-500`
- Labels: `text-gray-400` with `text-xs font-medium uppercase tracking-wide`

## Layout Structure

### Page Container
```tsx
<div className="min-h-screen bg-gray-950">
  {/* Background pattern */}
  <div className="absolute inset-0 opacity-[0.02]">
    {/* Grid pattern */}
  </div>
  
  <div className="relative">
    <Navbar />
    <motion.div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Page content */}
    </motion.div>
  </div>
</div>
```

### Card Spacing
- Between cards: `space-y-12`
- Card content padding: `p-6` (header), `space-y-6` (content)
- Section spacing: `space-y-6`

## Component Patterns

### Buttons

#### Primary Actions
```tsx
<Button className="bg-white/10 hover:bg-white/20 text-white border-gray-200/10">
```

#### Outline Buttons
```tsx
<Button 
  variant="outline" 
  className="bg-transparent border-gray-200/10 text-gray-400 hover:bg-white/5 hover:text-white"
>
```

#### Destructive Actions
```tsx
<Button 
  variant="destructive"
  className="bg-red-900/50 hover:bg-red-900/70 text-red-300 border-red-800/50"
>
```

### Badges
```tsx
{/* Status badges */}
<Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-800/50 text-xs">
  Verified
</Badge>

{/* Info badges */}
<Badge variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-700/50 text-xs">
  Discord
</Badge>
```

### Input Fields
```tsx
<Input className="bg-gray-900/50 border-gray-200/10 text-white" />
```

### Dividers
```tsx
<div className="border-t border-gray-200/10 pt-6">
```

## Motion & Animation

### Page Load Animation
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}
```

### Loading Spinners
```tsx
<motion.div 
  className="w-4 h-4 border border-gray-300 border-t-transparent rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
/>
```

### List Item Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 5 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

## Specific Section Patterns

### Profile Section
- Avatar: 64px circular with status indicator
- User info with badges
- Grid layout for metadata: `grid-cols-1 sm:grid-cols-2 gap-4`

### Action Cards
- Grid layout: `grid-cols-1 sm:grid-cols-2 gap-3`
- Icon + text layout with proper spacing
- Hover states: `hover:bg-white/5`

### Danger Zones
- Red accent color: `text-red-400`, `border-red-900/20`, `bg-red-950/10`
- Clear separation with border and background
- Confirmation patterns with input validation

## Modal & Dialog Styling
```tsx
<DialogContent className="border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm text-white">
<AlertDialogContent className="border border-gray-200/10 bg-gray-950/95 backdrop-blur-sm text-white">
```

## Responsive Design

### Breakpoints
- Mobile-first approach
- Key breakpoint: `sm:` for 640px+
- Grid adjustments: `grid-cols-1 sm:grid-cols-2`
- Text sizing: `text-base sm:text-lg`

## Icon Usage

### Sizes
- Small icons: `w-3 h-3` (buttons)
- Medium icons: `w-4 h-4` (general use)
- Large icons: `w-5 h-5` (headers)
- Profile icons: `w-6 h-6`

### Colors
- Default: `text-gray-300`
- Interactive: `text-gray-400 hover:text-white`
- Status: `text-green-400`, `text-red-400`

## Key Success Factors

1. **Minimal Color Palette**: Stick to grays with subtle accents
2. **Glassmorphism Effects**: Use backdrop-blur and transparent overlays
3. **Proper Contrast**: Ensure white text on dark backgrounds
4. **Consistent Spacing**: Use systematic spacing scales
5. **Smooth Animations**: Subtle motion that enhances UX
6. **Mobile Responsive**: Always test on mobile viewports

## Anti-Patterns to Avoid

- L Overwhelming gradients
- L Too many colors
- L Heavy visual effects
- L Inconsistent spacing
- L Poor contrast ratios
- L Jarring animations

## Implementation Notes

Always start with the glassmorphism card pattern and build content within it. The established visual hierarchy and spacing system should be maintained across all pages for brand consistency.