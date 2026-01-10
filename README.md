# SkillSync Enterprise Platform

> AI-powered talent matching platform with enterprise-grade black & white UI design

![React](https://img.shields.io/badge/React-18-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-black?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7.1-black?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-black?style=flat-square)

## Overview

SkillSync is a professional-grade talent matching platform that connects students with industry requirements through AI-driven skill analysis. Built for enterprise environments with a strict monochrome design aesthetic that prioritizes clarity and speed.

## Features

- 🎯 **AI-Driven Matching** - Advanced algorithms match candidates to roles
- 📊 **Real-Time Analytics** - Enterprise dashboard with key metrics
- 🔍 **Skill Gap Analysis** - Precision feedback with improvement paths
- ✅ **Verification System** - Track and display verified skills
- 📈 **Progress Tracking** - Visual skill level indicators
- 📤 **Data Export** - CSV export for match results
- 🎨 **Enterprise UI** - Professional black & white design
- ⚡ **Fast & Responsive** - Built with Vite for optimal performance

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx          # Top navigation bar
│   ├── LandingPage.tsx         # Marketing homepage
│   ├── Dashboard.tsx           # Analytics dashboard
│   ├── StudentsList.tsx        # Student grid view
│   ├── StudentProfile.tsx      # Individual student details
│   ├── IndustryRequirements.tsx # Role management
│   ├── AIMatchResults.tsx      # Match results display
│   ├── SkillGapFeedback.tsx   # Gap analysis
│   └── ui/                     # ShadCN components
├── App.tsx                     # Router configuration
├── index.css                   # Global styles & theme
└── main.tsx                    # Application entry point
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Marketing site |
| `/dashboard` | Dashboard | Analytics overview |
| `/students` | StudentsList | Browse all students |
| `/students/:id` | StudentProfile | Student details |
| `/roles` | IndustryRequirements | Role management |
| `/matches` | AIMatchResults | Match results |
| `/skill-gap` | SkillGapFeedback | Gap analysis |

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 7.1
- **Router:** React Router v6
- **UI Library:** ShadCN/ui (Radix UI primitives)
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Fonts:** Space Grotesk & JetBrains Mono

## Design System

### Color Palette
- **Primary:** `#000000` (Black)
- **Background:** `#FFFFFF` (White)
- **Border:** `#E5E5E5` (Light Gray)
- **Accent:** Grayscale only

### Typography
- **Primary Font:** Space Grotesk (UI elements)
- **Monospace Font:** JetBrains Mono (data & metrics)

### Key Principles
- Strict black & white palette
- Minimal border radius (2-4px)
- Typography-driven hierarchy
- Generous spacing (32-48px cards)
- Hover shadows for interactivity

## Documentation

- **[USER-GUIDE.md](./USER-GUIDE.md)** - Complete user guide with navigation map
- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - Technical implementation details

## Mock Data

Currently uses hardcoded data. To connect a real backend:

1. Install backend SDK (Supabase/Convex)
2. Replace mock data arrays with API calls
3. Add loading/error states
4. Update types as needed

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Performance

- ⚡ Hot Module Replacement (HMR)
- 📦 Code splitting via React Router
- 🎯 Optimized bundle size
- 🚀 Fast refresh in development

## Contributing

### Adding New Pages

1. Create component in `src/components/`
2. Add route to `src/App.tsx`
3. Update navigation in `src/components/Navigation.tsx`
4. Follow black & white design system

### Design Guidelines

- Use Space Grotesk for all UI text
- Use JetBrains Mono for numbers/data
- Keep borders 1px solid black
- Use opacity for hierarchy (60% for secondary text)
- Maintain generous padding in cards

## License

MIT

## Contact

For questions or support, please refer to the documentation files.

---

**Built with precision for enterprise talent matching**
