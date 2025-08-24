# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Development Server:**
```bash
npm run dev          # Start Next.js development server with Turbopack
```

**Build & Production:**
```bash
npm run build        # Build the application for production
npm start           # Start production server
```

**Code Quality:**
```bash
npm run lint        # Run ESLint to check code quality
```

**Payload CMS:**
```bash
npm run payload              # Access Payload CMS admin interface
npm run generate:types       # Generate TypeScript types from Payload collections
npm run generate:schema      # Generate schema using tsx scripts/generateSchema.ts
```

## Architecture Overview

**RoLinks** is a Next.js 15 application with dual architecture:
- **Frontend**: User-facing game server listing platform (`app/(frontend)`)  
- **Admin**: PayloadCMS admin interface (`app/(payload)`)

### Key Technologies
- **Framework**: Next.js 15 with App Router and Turbopack
- **CMS**: PayloadCMS with MongoDB (mongoose adapter)
- **UI**: TailwindCSS 4 with shadcn/ui components, Framer Motion animations
- **Authentication**: better-auth with Discord OAuth
- **State**: nuqs for URL state management

### Core Data Models

**Games Collection** (`collections/Games.ts`):
- Manages Roblox games with auto-fetched thumbnails
- Fields: name, gameid, image (auto-generated), robux cost, serverCount, isActive
- Hook automatically fetches game thumbnails from Roblox API

**Servers Collection** (`collections/Servers.tsx`):  
- Private server links with auto-generated names
- Relationships to Games and Users collections
- Fields: name (auto-generated), link, game reference, creator reference

**GameRequests Collection** (`collections/GameRequests.ts`):
- New collection for handling game requests (recently added)

**Authentication**:
- Discord-only OAuth via better-auth (`utils/auth/auth.ts`)
- User sessions stored in PayloadCMS collections

### Application Structure

**Frontend Routes** (`app/(frontend)`):
- `/` - Landing page with game carousel
- `/games` - Game listing page
- `/games/[gameId]` - Game detail with server listings
- `/games/[gameId]/add-server` - Server submission form
- `/settings` - User profile and data management

**Design System**:
- Comprehensive design guidelines in `brain/design.md`
- Glassmorphism aesthetic with `bg-gray-950` backgrounds
- Consistent card patterns: `border border-gray-200/10 bg-white/[0.02] backdrop-blur-sm`
- Framer Motion animations with staggered card reveals

### Key Utilities

**Image Processing** (`utils/imageUtils.ts`):
- Fetches game thumbnails from Roblox API via game ID
- Auto-populates Game collection images

**Server Name Generation** (`lib/serverNames.ts`):
- Generates random server names using adjective + noun combinations

**Authentication Client** (`utils/auth/auth-client.ts`):
- Client-side auth helper functions

### Development Notes

- Path aliases: `@/*` points to root, `@payload-config` to payload.config.ts
- MongoDB connection required via `DATABASE_URI` environment variable
- Discord OAuth requires `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`
- PayloadCMS secret required via `PAYLOAD_SECRET`
- Rate limiting and caching implemented (see recent commits)

### Testing & Deployment
- No specific test framework configured - check with user for testing approach
- Configured for Vercel deployment with Next.js optimizations
- Remote images allowed from Discord CDN and Roblox CDN domains