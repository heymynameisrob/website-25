# Rob's Website

Personal website built with Astro and React, deployed to Netlify. The site features a blog with content collections, interactive demos, and a custom design system.

## Development Commands

- `pnpm run dev` - Start development server (localhost:4321)
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run prep` - Run type checking and lint fixes
- `pnpm run lint` - Lint source code
- `pnpm run lint:fix` - Fix linting issues automatically

## Rules
- Always run `npm run prep` before committing - this runs type checking and linting to ensure code quality.
- When working on `.tsx` files, always load `vercel-react-best-practices` skill
- When working on animations, always load `animation-best-practices` skill
- Astro and React components should always be in PascalCase
- Prefer using Astro and static HTML for presentation components
