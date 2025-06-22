# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

This is a Next.js 15 application using the App Router pattern for a Korean toddler recipe website. The codebase follows a clear separation between server and client components.

### Key Architectural Decisions

1. **Database Strategy**: MySQL with connection pooling and graceful fallback to sample data when DB is unavailable. All database operations are centralized in `/lib/db.ts`.

2. **Authentication**: Custom JWT implementation with httpOnly cookies. Tokens are generated and verified in `/lib/auth.ts`. User passwords are hashed with bcrypt.

3. **Search Implementation**: Uses Fuse.js for fuzzy ingredient matching with weighted scoring. The search engine is initialized once in `/lib/search.ts` and handles:
   - Ingredient name and alias matching
   - "Almost matches" for recipes missing 1-2 ingredients
   - Complex filtering by eating method, messiness level, and batch cooking options

4. **API Design**: RESTful routes in `/app/api/` with consistent error handling and user context awareness. All recipe endpoints enrich data with user-specific information (ratings, favorites).

### Database Schema

The MySQL database has 6 core tables with the following relationships:
- `recipes` → `recipe_ingredients` ← `ingredients` (many-to-many)
- `users` → `recipe_ratings` ← `recipes` (user ratings)
- `users` → `user_favorites` ← `recipes` (bookmarks)

Recipe filters are stored as ENUM columns: `eating_method`, `messiness_level`, `freezer_friendly`, `food_processor_friendly`.

### Component Architecture

- **Server Components**: Default for all pages, handle data fetching and SEO
- **Client Components**: Located in `/components/client/` for interactive features (ratings, favorites, search)
- **State Management**: Local state with React hooks, no global state management
- **Data Flow**: Server components fetch and pass data to client components as props

### Environment Configuration

The app expects database credentials in environment variables. Development uses `.env.local`. The database connection gracefully degrades to sample data if unavailable, allowing development without a database.