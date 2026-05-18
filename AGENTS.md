# Rob's Website

Personal website built with Astro and React, deployed to Netlify. The site features a blog with content collections, interactive demos, and a custom design system.

## Development Commands

- `pnpm dev` - Start development server (localhost:4321)
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm prep` - Run type checking and lint fixes
- `pnpm lint` - Lint source code
- `pnpm lint:fix` - Fix linting issues automatically

## Rules

- Always run `nvm use` before installing any packages
- Always run `pnpm prep` before committing changes or when working on multi-step tasks
- When working on `.tsx` files, always load `vercel-react-best-practices` skill
- When working on animations, always load `animation-best-practices` skill
- Astro and React components should always be in PascalCase
- Prefer using Astro and static HTML for presentation components
