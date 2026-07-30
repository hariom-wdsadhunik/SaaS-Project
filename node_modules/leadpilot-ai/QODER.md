# Qoder UI/UX Design System for LeadPilot AI

## Project Context
LeadPilot AI is an AI-powered lead response and follow-up system for real estate agents. The system captures leads from WhatsApp, extracts key information (budget, location), stores data in Supabase, and provides a dashboard for lead management.

## Design Philosophy
- **Modern & Professional**: Clean, trustworthy appearance for real estate professionals
- **Glass Morphism**: Translucent cards with backdrop blur for premium feel
- **Responsive First**: Mobile-optimized with breakpoints for all devices
- **Dark Mode Support**: Full dark mode implementation with smooth transitions
- **Animation-First**: Every interaction should have subtle, purposeful motion

## Color Palette

### Primary Colors
- Primary Blue: `#3b82f6` (buttons, links, active states)
- Primary Purple: `#8b5cf6` (gradients, accents)
- Gradient: `linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)`

### Light Mode
- Background: `#f8fafc`
- Card Background: `#ffffff`
- Text Primary: `#111827`
- Text Secondary: `#6b7280`
- Border: `#e5e7eb`

### Dark Mode
- Background: `#0f172a`
- Card Background: `#1e293b`
- Text Primary: `#f1f5f9`
- Text Secondary: `#94a3b8`
- Border: `#334155`

## Status Colors
- New: Blue `#3b82f6` with bg `#dbeafe`
- Contacted: Amber `#d97706` with bg `#fef3c7`
- Follow-up: Purple `#7c3aed` with bg `#ede9fe`
- Closed: Green `#059669` with bg `#d1fae5`

## Typography
- Font Family: `Inter, system-ui, sans-serif`
- Headings: 600-700 weight
- Body: 400 weight
- Small/Caption: 300 weight, 0.875rem

## Animation Guidelines

### Timing
- Micro-interactions: 150ms
- Standard transitions: 300ms
- Page transitions: 500ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)

### Effects
- Card Hover: `translateY(-2px)` + shadow increase
- Button Hover: Scale 1.02 + brightness
- Page Load: Stagger children with 50ms delay
- Scroll Reveal: Fade up from 20px below

### Framer Motion Patterns
```javascript
// Fade In Up
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
}

// Stagger Children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Hover Scale
const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
}
```

## Component Patterns

### Cards
- Border radius: `1rem` (16px)
- Padding: `1.5rem` (24px)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover Shadow: `0 20px 40px -10px rgba(0,0,0,0.1)`

### Buttons
- Primary: Gradient background, white text
- Secondary: White bg, gray border
- Border radius: `0.75rem` (12px)
- Padding: `0.75rem 1.5rem`
- Touch target: Minimum 44px height

### Inputs
- Border radius: `0.75rem`
- Border: 1px solid gray-200
- Focus: Blue border + ring
- Padding: `0.75rem 1rem`

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## File Structure
```
leadpilot-ui/
├── dashboard.html      # Main dashboard (responsive)
├── landing.html        # Animated landing page
├── components/         # Reusable components
└── animations/         # Animation utilities
```

## API Integration
- Base URL: Dynamic (localhost:80 for dev, Render for prod)
- Endpoints:
  - GET /leads - Fetch all leads
  - POST /webhook - Receive WhatsApp messages
  - PATCH /leads/:id - Update lead status

## Best Practices
1. Always use semantic HTML
2. Implement loading states for all async operations
3. Add error boundaries and fallbacks
4. Use CSS custom properties for theming
5. Optimize images and assets
6. Ensure accessibility (ARIA labels, keyboard nav)
7. Test on real devices, not just emulators

## Qoder-Specific Instructions
- Qoder has access to all files and can edit them directly
- Use search_replace for precise edits
- Use create_file for new components
- Always verify changes with get_problems
- Test on mobile viewport after UI changes
- Maintain existing code style and patterns
