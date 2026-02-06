# Insightly (Syncmate) | Project Knowledge Base for AI Agents

> 📜 **AI AGENT MAINTENANCE INSTRUCTION**: This file serves as the primary context for AI agents. Whenever you implement new features, modify database schemas, change architectural patterns, or update the tech stack, you MUST update this README to keep the knowledge base accurate. Do not wait for user prompting to update this file.

**Project Objective**: A high-performance, privacy-centric analytics platform focused on real-time visitor tracking and revenue attribution.

## 🏗 System Architecture

### Core Tech Stack

- **Framework**: TanStack Start (Full-stack React with TanStack Router).
- **Database**: Appwrite (BaaS) for persistent storage.
- **Caching Layer**: Redis (Upstash for production HTTP, standard TCP for local).
- **UI Architecture**: React with HeroUI (formerly NextUI) and Tailwind CSS.

### Data Flow Pattern (Ingestion)

1. **Client**: `public/script.js` collects events (pageview, custom, payments).
2. **API Endpoint**: `src/routes/api/events/index.ts` (or similar) validates payload.
3. **Storage**: Data is written to Appwrite.
4. **Caching**: `updateCache()` in `src/configs/redis.ts` performs real-time aggregation into Redis datasets to speed up dashboard queries.

## 📂 Codebase Structure Map

- `/src/routes/api`: Backend logic. Handles event ingestion, Twitter fetching, and analytics queries.
- `/src/routes/_dashboard`: The protected application UI.
  - `/$websiteId`: Dynamic routes for specific website analytics.
  - `/-components`: Business logic components (Charts, Tables, Funnels).
- `/src/configs`: Infrastructure entry points.
  - `appwrite/serverConfig.ts`: Appwrite SDK initialization.
  - `redis.ts`: Hybrid Redis client with `DISABLE_CACHE` support.
- `/public/script.js`: The standalone tracking engine. Uses native `XMLHttpRequest`/`fetch` to avoid dependencies.
- `/abc.ts`: Developer utility for seeding/wiping database rows during testing.

## 💾 Database Schema (Appwrite Table IDs)

Defined in `appwrite.config.json` and utilized in `src/configs/appwrite/serverConfig.ts`.

- **`websites`**: Root configuration for tracked domains.
  - `twitterKeywords`: Array of strings for X tracking.
  - `twitterNewestTweetAt`: Timestamp of the latest tweet stored.
  - `twitterLastApiCallAt`: Last time X API was called (gatekeeper).
- **`events`**: Pageviews and core engagement data.
- **`revenues`**: Financial data from Stripe, Polar, etc.
- **`mentions`**: Scraped/Fetched Twitter posts.
- **`links`**: Resolved `t.co` referral mappings.
- **`heartbeats`**: Ephemeral table for live visitor counts.

## 🤖 AI Context: Key Logic & Features

### Twitter "Gatekeeper" Logic

- **Endpoint**: `src/routes/api/analytics/twitter-mentions/index.ts`
- **Constraint**: API calls to X are rate-limited to 1 every 8 hours per domain (`twitterLastApiCallAt`).
- **De-duplication**: Uses `twitterNewestTweetAt` to ensure no overlapping data is fetched during API calls.

### Hybrid Caching Logic

- **Toggle**: `process.env.DISABLE_CACHE === "true"` bypasses all Redis operations.
- **Aggregation**: `updateCache` in `redis.ts` scans key patterns like `${websiteId}:main:*` and updates visitors/revenue counters in real-time.

### Session Management

- **Cookies**: `insightly_visitor_id` (long-term) and `insightly_session_id` (session-based).
- **Opt-out**: `localStorage.setItem('insightly_ignore', 'true')` disables all tracking via script-level logic.

## 🎨 Styling & Design Guidelines

- **Framework**: Tailwind CSS with custom configuration.
- **Components**: Heavy utilization of **HeroUI** for Modals, Tabs, and Inputs.
- **Visual Aesthetic**: Premium dark-mode focus, glassmorphism, and high-contrast typography (Inter/Outfit).
- **Responsive Pattern**:
  - Mobile: Full width cards, hidden sidebars.
  - Desktop: Sticky sidebars with overflowing scroll containers (`scrollbar-hide`).

## � Active Workflows for Agents

- **Schema Updates**: Modifying `appwrite.config.json` requires a corresponding update to server side query logic in API routes.
- **Production Safety**: Always check for `MODE === "prod"` in configs before performing destructive tasks.
- **Seeding**: Use `abc.ts` but ensure `deleterows()` is used carefully to avoid clearing production data.
