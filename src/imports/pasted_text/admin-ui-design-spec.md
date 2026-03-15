Design a complete, production-ready **Admin UI system** for “Happy Tails Pet Café Management System” with two roles: **Owner** and **Staff**.

## Product Context
Happy Tails is a pet café with dine-in, pickup, and delivery orders. The admin side is used to manage daily operations, menu, inventory, customers, reports, and staff.

## Design Goal
Create a polished, modern, conversion-focused admin experience that improves on a basic dashboard UI.
Current UI pain points to fix:
1) Inconsistent visual style between Owner and Staff dashboards
2) Sidebar-heavy layout with weak information hierarchy
3) Dense order tables with poor scanability
4) Minimal filtering/search and no saved views
5) Limited mobile/tablet responsiveness
6) Weak KPI storytelling (numbers without trends/comparisons)
7) Status/action buttons are not standardized

## Visual Direction
Style: warm premium café + professional SaaS dashboard
Brand mood: friendly, clean, trustworthy, slightly playful (pet-friendly)

### Design tokens
- Primary: #C7798E
- Secondary: #2E6960
- Accent: #FF4F8B
- Success: #22C55E
- Warning: #F59E0B
- Danger: #EF4444
- Background: #F8FAFC
- Surface: #FFFFFF
- Text primary: #1F2937
- Text secondary: #6B7280
- Border: #E5E7EB

Typography:
- Headings: Poppins / Inter, semibold-bold
- Body: Inter / system sans
- Use a 4/8px spacing grid and 12px corner radius default

## IA / Navigation
Create role-based information architecture.

### Shared global layout
- Collapsible sidebar (icon + label)
- Topbar with: global search, notifications, quick actions, profile menu
- Breadcrumbs
- Content area with sticky page header and date range selector
- Right utility panel optional for alerts/tasks

### Owner navigation
- Dashboard
- Orders Overview
- Sales & Reports
- Inventory Health
- Menu Performance
- Customers & Loyalty
- Staff Management
- Activity History / Audit Log
- Settings

### Staff navigation
- Shift Dashboard
- Live Orders Queue
- Menu & Item Availability
- Inventory Updates
- Customers
- Activity History
- My Profile

## Required screens (desktop first, then responsive variants)
1) Owner Dashboard (KPI-rich)
2) Staff Dashboard (operational focus)
3) Live Orders Management
4) Inventory Management
5) Menu Management
6) Customers & Loyalty
7) Sales & Reports
8) Staff Management
9) Activity History / Audit Log
10) Profile + Settings
11) Login screens for Owner and Staff

## Component system (build reusable components)
- KPI cards with trend badges (+/- %, vs yesterday/last week)
- Data table with sticky header, column sort, filters, row actions, bulk actions
- Status chips (Pending, Accepted, Preparing, Ready, Completed, Declined)
- Priority tags (Normal/Urgent)
- Segmented controls for order type (Dine-In/Pickup/Delivery)
- Search bars, dropdown filters, date pickers
- Primary/secondary/ghost/danger buttons with consistent states
- Toasts, dialogs, empty states, loading skeletons, error states
- Pagination and tab navigation
- Form components with validation states

## UX improvements to explicitly include
- Replace plain metric cards with **storytelling cards** (sparkline + comparison text + alert threshold)
- Introduce **command bar** for quick actions (Add Item, Mark Out of Stock, Create Promo, Export Report)
- Add **saved filters/views** for orders (e.g., “Morning Rush”, “Delivery Only”, “Needs Attention”)
- Add **timeline-based order queue** with color and SLA indicators
- Add **inventory risk panel** (days of stock left + reorder suggestions)
- Include **role-aware dashboards**: Owner sees trends/profitability, Staff sees task queue and next actions
- Improve table readability with zebra rows, sticky actions, and compact/comfortable density toggle
- Ensure accessibility: WCAG AA contrast, keyboard focus states, 44px touch targets

## Data visualizations
- Revenue trend (line chart)
- Order volume by hour (bar chart)
- Top items (horizontal bar)
- Channel mix (donut: dine-in/pickup/delivery)
- Stock risk heatmap
- Staff performance snapshot

## Responsive behavior
- Desktop: full sidebar + multi-column layout
- Tablet: collapsed sidebar + 2-column cards
- Mobile: bottom nav for key actions, card-based order queue, simplified tables

## Prototyping requirements
- Build clickable prototype flows:
  1) Accept/Decline order
  2) Mark item out of stock
  3) Filter/export sales report
  4) Add/edit menu item
- Include hover, active, disabled, loading states

## Deliverables
- Full design system page (tokens, components, states)
- Annotated wireframes + high-fidelity mockups
- Separate Owner and Staff page sets
- Developer handoff notes (spacing, typography, color, behavior specs)

Output should look implementation-ready for React + CSS modules/Tailwind.
```

## Optional add-on prompt (for stronger result)

```text
Now generate a second variant called “Compact Ops Mode” optimized for fast order handling during rush hours. Minimize visual noise, maximize table scanability, and prioritize urgent actions above all else.
```