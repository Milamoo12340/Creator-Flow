# VERITAS - AI Truth-Seeking Assistant

## Overview

VERITAS is a full-stack web application designed as an AI-powered research companion and investigator. The application provides a terminal-style interface for conducting AI-assisted investigations, with features for document archives, network visualization, and system configuration. The core purpose is to uncover hidden knowledge, verify facts, and provide evidence-based answers with source attribution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for app configuration
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **UI Components**: Radix UI primitives with custom styling, Lucide icons
- **Animation**: Framer Motion for page transitions and effects
- **Build Tool**: Vite with React plugin

The frontend follows a page-based architecture with four main views:
- Terminal (main chat interface)
- Archives (document viewer)
- Network (surveillance map visualization)
- Config (system settings)

### Backend Architecture

- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Pattern**: RESTful JSON API
- **Entry Point**: `server/index.ts` serves both API routes and static files

Key server modules:
- `routes.ts` - API endpoint registration
- `openai.ts` - OpenAI integration for AI responses
- `storage.ts` - Database access layer using repository pattern
- `vite.ts` - Development server with HMR support
- `static.ts` - Production static file serving

### Data Storage

- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit with `drizzle.config.ts`

Database tables:
- `users` - User accounts with username/password
- `conversations` - Chat conversation threads
- `messages` - Individual messages with role, content, depth level, and sources
- `user_config` - Per-user settings (model, temperature, OSINT tools, prompts)

### Build and Deployment

- **Development**: `npm run dev` starts Express server with Vite middleware
- **Production Build**: `npm run build` uses esbuild for server bundling and Vite for client
- **Output**: Server bundle at `dist/index.cjs`, client assets at `dist/public`

The build script (`script/build.ts`) bundles specific dependencies to reduce cold start times while keeping others external.

## External Dependencies

### AI Services

- **OpenAI API**: Primary LLM provider using `openai` npm package
  - Configured via `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY` environment variables
  - Optional base URL override via `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Default model: `gpt-4o`

### Database

- **PostgreSQL**: Required, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with schema defined in TypeScript

### HTTP Client

- **Axios**: Used for API calls from both client and server

### Development Tools

- **Replit Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` for error display
  - `@replit/vite-plugin-cartographer` for code mapping (dev only)
  - `@replit/vite-plugin-dev-banner` for development indicator (dev only)

### Fallback/Placeholder Integrations

The codebase includes placeholder modules for extended functionality that may not be fully implemented:
- `server/openaifallback.ts` - Multi-provider LLM fallback (HuggingFace, Ollama)
- `server/github.ts`, `server/wayback.ts` - OSINT search integrations
- `server/citations.ts`, `server/memory.ts`, `server/observability.ts` - Supporting services

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string (required)
- `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY` - OpenAI API key (required for AI features)