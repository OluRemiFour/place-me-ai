# SkillSync - User Guide

## Quick Start

### Running the Application
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Navigation Map

### Public Routes
- **`/`** - Landing Page (Marketing site with hero, features, social proof)

### Application Routes
- **`/dashboard`** - Main analytics dashboard
- **`/students`** - Browse all students (grid view with search/sort)
- **`/students/:id`** - Individual student profile details
- **`/roles`** - Industry role requirements (searchable, filterable)
- **`/matches`** - AI match results for a role
- **`/skill-gap`** - Skill gap analysis and learning path

## Page Features

### Landing Page
- Click "Access Platform" or "Get Started" → Goes to `/dashboard`
- No navigation bar (clean marketing experience)
- Responsive grid layouts

### Dashboard
- View key metrics at a glance
- See recent matches
- Check in-demand skills
- Quick action cards:
  - "Browse Students" → `/students`
  - "Manage Roles" → `/roles`
  - "Run AI Match" → `/matches`

### Students List
- **Search:** Type name, email, or skills
- **Sort by:** Match Score, Name, or Verified Skills
- **Actions:**
  - Click "View Profile" → Individual profile page
  - Click "Match" → Find matching roles (currently navigates to matches page)

### Student Profile
- View detailed skill breakdown
- Click skill categories to expand/collapse
- See verified credentials
- **Actions:**
  - "Find Matching Roles" → `/matches`
  - "Skill Gap Analysis" → `/skill-gap`

### Industry Requirements (Roles)
- **Search:** Find roles by title or company
- **Filter:** Select industry from dropdown
- **Click any card** → Opens slide-out panel with full details
- View required vs preferred skills
- Action: "Find Matching Candidates" → Search candidates for role

### AI Match Results
- See ranked list of candidates for a role
- Click any match to expand details:
  - Skills matched
  - Skills missing
  - Experience alignment
- **Export:** Click "Export Results" to download CSV
- Actions per match:
  - "View Full Profile" → Student profile
  - "Schedule Interview" → (Future: Calendar integration)

### Skill Gap Feedback
- View current readiness percentage
- See three categories:
  1. **Missing Skills** - Skills to acquire
  2. **Skills to Improve** - Current vs required levels
  3. **Recommended Actions** - Prioritized learning path
- "Generate Personalized Learning Path" → Creates custom plan

## Design Philosophy

### Enterprise Console Aesthetic
- **Monochrome:** Strict black & white palette
- **Typography:** Space Grotesk for UI, JetBrains Mono for data
- **Hierarchy:** Achieved through weight, size, and spacing (not color)
- **Minimal:** No gradients, shadows only for interactive feedback

### Key Visual Patterns

**Metric Display:**
```
Large number (font-mono, bold)
Small label below (opacity-60)
```

**Cards:**
```
White background
1px black border
Minimal rounded corners
Hover: 4px shadow offset
```

**Buttons:**
- **Primary:** Black bg, white text → Inverts on hover
- **Secondary:** White bg, black border → Black bg on hover

**Progress Bars:**
- Black fill on white background
- Percentage displayed inline
- Labels above and/or below

**Status Indicators:**
- Outlined badges (no fill)
- Checkmarks for verification (✓ in black circle)

## Data Relationships

### Flow Examples

**Find Candidates for Role:**
1. Go to `/roles`
2. Search/filter for desired role
3. Click card to view details
4. Click "Find Matching Candidates"
5. View results at `/matches`

**Assess Student Readiness:**
1. Go to `/students`
2. Search for student
3. Click "View Profile"
4. Review skills and verification
5. Click "Skill Gap Analysis"
6. See personalized improvement plan

**Monitor Platform Performance:**
1. Go to `/dashboard`
2. View metrics: students, roles, matches, scores
3. Check recent match activity
4. Identify trending skills

## Mock Data

Currently, the app uses hardcoded mock data:
- ~8 students with varying skill profiles
- ~6 industry roles across different sectors
- Pre-calculated match percentages
- Sample learning recommendations

### To Add Real Data:
1. Connect backend API (Supabase/Convex)
2. Replace mock arrays with API calls
3. Add loading states
4. Implement error handling

## Customization

### Colors
Edit `src/index.css` CSS variables:
```css
--background: 0 0% 100%;  /* white */
--foreground: 0 0% 0%;    /* black */
--border: 0 0% 90%;       /* light gray for borders */
```

### Fonts
Change in `index.html` and `src/index.css`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont..." />
```

### Border Radius
Edit `tailwind.config.js`:
```js
--radius: 0.25rem;  // Minimal by default
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Accessibility Features
- Semantic HTML (nav, main, section, article)
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators on interactive elements
- High contrast (black on white)
- Screen reader labels (via Radix UI)

## Performance Tips
- First load: ~100-200ms (Vite fast refresh)
- Route changes: Instant (React Router)
- Search/filter: Real-time (client-side)
- Export: Downloads immediately (no server)

## Troubleshooting

**Fonts not loading?**
- Check internet connection (Google Fonts CDN)
- Clear browser cache

**Styles broken?**
- Run `npm install` to ensure Tailwind is installed
- Restart dev server

**Routes not working?**
- Ensure React Router is running
- Check console for errors
- Verify you're not using hard page refresh

**Build errors?**
- Run `npm run build` to see specific issues
- The sonner.stories.tsx error is non-blocking

## Contributing

### Adding a New Page
1. Create component in `src/components/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navigation.tsx`
4. Follow black & white design system

### Adding New Features
- Maintain monochrome aesthetic
- Use Space Grotesk for UI text
- Use JetBrains Mono for data/metrics
- Keep borders 1px solid black
- Use ShadCN components when possible

---

**Need Help?** Refer to IMPLEMENTATION.md for technical details.
