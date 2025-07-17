# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite web application that monitors and displays the reliability of Langflow's nightly build pipeline. It shows days without failures, success rates, and recent build history with a countdown to the next update.

## Essential Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (output to dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

### Deployment
The built files in `dist/` can be deployed to any static hosting service.

## Architecture

### Core Components
- **IncidentCounter** (`src/components/IncidentCounter.tsx`): Main dashboard component that orchestrates the entire UI
- **Counter** (`src/components/counter.tsx`): Animated number display using Framer Motion
- **LangflowLogo** (`src/components/LangflowLogo.tsx`): SVG logo component

### Data Service
- **buildStatusService** (`src/services/buildStatusService.ts`): 
  - Fetches workflow runs from GitHub API (`langflow-ai/langflow` repo)
  - Implements smart caching with scheduled updates (6am, 1pm, 7pm, 11pm)
  - Provides fallback simulated data when API is unavailable
  - Calculates days without incidents and success rates

### Key Technical Decisions
1. **Scheduled Updates**: Data refreshes only at specific times to minimize API calls
2. **Local Storage Caching**: Persists data between sessions
3. **Fallback Strategy**: Shows simulated data when GitHub API fails
4. **Animation Library**: Uses Framer Motion for smooth UI transitions
5. **Styling**: Tailwind CSS with dark theme and glassmorphism effects

## GitHub API Integration

The app monitors the "Nightly Build - Python Tests" workflow:
- Fetches last 30 workflow runs
- Filters for scheduled runs only
- Extracts version numbers from workflow titles
- Calculates incident streaks and success metrics

## Development Notes

### TypeScript Configuration
- Strict mode enabled
- Module resolution: bundler
- Target: ES2020
- Three config files: root, app, and node environments

### State Management
- Uses React hooks (useState, useEffect)
- No external state management library
- Data fetching managed through service layer

### Styling Approach
- Tailwind CSS for utility classes
- Custom animations with Framer Motion
- Dark theme with green/red status indicators
- Responsive design with mobile support