# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website built with Astro and React, deployed to Vercel. The site features a blog with content collections, interactive demos, and a custom design system.

## Development Commands

- `npm run dev` - Start development server (localhost:4321)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run prep` - Run type checking and lint fixes (recommended before commits)
- `npm run lint` - Lint source code
- `npm run lint:fix` - Fix linting issues automatically

## Architecture

### Core Stack
- **Astro** - Static site generator with hybrid rendering
- **React** - Interactive components (.tsx files)
- **TypeScript** - Type safety with path aliases (`@/*` maps to `./src/*`)
- **Tailwind CSS** - Styling with custom design system
- **MDX** - Content with embedded components

### Directory Structure
- `src/components/` - Reusable components (both .astro and .tsx)
  - `primitives/` - Basic UI components (buttons, inputs, etc.)
  - `demos/` - Interactive demo components for blog posts
- `src/content/posts/` - Blog post content (MDX files)
- `src/pages/` - Route pages and API endpoints
- `src/lib/` - Utilities, types, and custom hooks
- `src/layouts/` - Page layouts

### Content System
Uses Astro Content Collections with schema validation. Post types include:
- `post` - Regular blog posts
- `case-study` - Detailed project breakdowns
- `demo` - Interactive components/experiments
- `photos` - Photo galleries
- `project` - Project showcases

Posts support optional fields: `video_url`, `image_url`, `externalLink`, `component` (for custom demo rendering).

### Component Patterns
- **Astro components** (.astro) - Server-rendered, can include React islands
- **React components** (.tsx) - Client-side interactivity
- Mix both types freely - Astro components can import and use React components
- Follow existing naming conventions (PascalCase for React, PascalCase for Astro)

### Styling System
- Custom design system using CSS variables (`--gray-1` through `--gray-12`, `--accent`, etc.)
- Dark mode support via `class="dark"`
- Typography plugin configured with custom prose colors
- Custom fonts: Geist (sans), Berkley Mono (mono)

### API Routes
- `src/pages/api/now-playing.ts` - Last.fm integration for music data
- Follow Astro's file-based routing for new API endpoints

## Development Notes

- Type checking: Run `astro check` before committing
- Path aliases: Use `@/` for imports from src directory
- Content: New posts go in `src/content/posts/` with proper frontmatter schema
- Deployment: Static build deployed to Vercel automatically
- Base URL: Dynamically set based on environment (local/preview/production)

## Component Integration

When creating new demo components:
1. Add to `src/components/demos/`
2. Export from the component file
3. Reference in post frontmatter with `component: "ComponentName"`
4. Use `<DemoRender />` in MDX to render the component

## Testing & Quality

Always run `npm run prep` before committing - this runs type checking and linting to ensure code quality.