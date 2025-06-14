## CI/CD Testing

This project now has a complete CI/CD pipeline configured. For detailed deployment information, see [CLAUDE.md](./CLAUDE.md) and [DOCS/DEPLOYMENT.md](./DOCS/DEPLOYMENT.md).

## Development Commands

### Essential Commands

- `npm run dev` - Start the development server (http://localhost:3000)
- `npm run build` - Build the application for production
- `npm run start` - Run the production build
- `npm run lint` - Run ESLint to check code quality

### Dependency Management

- `npm install` - Install all dependencies
- `npm install <package>` - Add a new dependency
- `npm install -D <package>` - Add a new dev dependency

## Architecture Overview

This is a Next.js 14 application using the App Router architecture with TypeScript.

### Directory Structure

- `/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout wrapper for all pages
  - `page.tsx` - Home page component
- `/public/` - Static files served directly
- Path alias: `@/*` maps to the root directory for cleaner imports

### Key Technologies

- **Next.js 14.2.13** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **ESLint** - Code linting with Next.js rules

### Configuration Files

- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with strict mode enabled
- `.eslintrc.json` - ESLint configuration extending Next.js core-web-vitals rules
