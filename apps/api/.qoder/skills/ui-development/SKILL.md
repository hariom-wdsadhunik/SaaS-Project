---
name: ui-development
description: Develop and customize the LeadPilot AI dashboard UI. Use when modifying the frontend, adding features to the dashboard, implementing dark mode, or working with Tailwind CSS.
---

# UI Development

## Dashboard Location
`leadpilot-ui/dashboard.html`

## Tech Stack
- **Tailwind CSS** - Utility-first styling
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography
- **Vanilla JavaScript** - No frameworks

## Key Features

### Dark Mode
Toggle with `body.dark` class. Uses CSS custom properties for theming.

### Stats Cards
4 cards showing:
- Total Leads
- New Leads
- Contacted Leads
- Closed Leads

### Lead Table
Columns:
- Lead (avatar + phone)
- Phone number
- Budget
- Location
- Status (dropdown)
- Date
- Actions

### Status Badges
```css
.status-new { @apply bg-blue-100 text-blue-700; }
.status-contacted { @apply bg-amber-100 text-amber-700; }
.status-followup { @apply bg-purple-100 text-purple-700; }
.status-closed { @apply bg-green-100 text-green-700; }
```

## JavaScript Functions

### fetchLeads()
Fetches leads from API and renders table

### renderLeads(leads)
Renders leads array to table

### filterByStatus(status)
Filters leads by status ('all', 'new', 'contacted', 'follow-up', 'closed')

### searchLeads(query)
Real-time search across phone, location, message

### updateLeadStatus(id, status)
Updates lead status via PATCH API

### addLead()
Prompts for phone and message, sends to webhook

### toggleTheme()
Toggles dark mode and saves preference

## Styling Guidelines

### Colors
- Primary: Blue (`blue-600`, `blue-500`)
- Background: Gray 50 (`gray-50`)
- Cards: White with shadow
- Text: Gray 900 (headings), Gray 600 (body)

### Dark Mode
- Background: Slate 900 (`#0f172a`)
- Cards: Slate 800 (`#1e293b`)
- Text: Slate 100 (`#f1f5f9`)

### Spacing
- Cards: `p-6` or `p-8`
- Gaps: `gap-6` standard
- Border radius: `rounded-2xl` for cards, `rounded-xl` for buttons
