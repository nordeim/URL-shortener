# AI Agent Briefing: URL Shortener Project Synthesis

**Project:** Production-Ready URL Shortener with Analytics  
**Tech Stack:** Next.js 14 + TypeScript + Supabase + Docker  
**Generated:** 2025-11-06  
**Purpose:** AI coding agent-optimized technical reference

---

## 🚀 Quick Start Commands

### Essential Setup Commands
```bash
# Clone and setup
git clone <repository-url> && cd url-shortener

# Install dependencies
npm install  # or yarn install / pnpm install

# Environment setup
cp .env.local.example .env.local

# Start development
npm run dev  # Visit http://localhost:3000

# Database initialization (Supabase)
psql -h your-host -U postgres -d postgres -f scripts/db-init.sql
```

### Docker Quick Start
```bash
# Production deployment with Docker
docker-compose --env-file .env.docker.local up --build

# Development with Docker
docker-compose up --build

# View logs
docker-compose logs -f app
docker-compose logs -f database

# Execute commands in containers
docker-compose exec app sh
docker-compose exec database psql -U postgres

# Clean rebuild
docker-compose build --no-cache
```

### Build & Test Commands
```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # ESLint check
npm run lint:fix              # Auto-fix linting
npm run format                # Prettier formatting
npm run typecheck             # TypeScript check

# Testing
npm run test                  # Run tests
npm run test:coverage         # Coverage report
npm run test:ui              # UI test interface
npm run test:watch           # Watch mode
npm run test:e2e             # End-to-end tests

# Deployment
vercel                        # Deploy to Vercel
npm run build && npm run start # Manual deployment
```

---

## 📁 Critical File Reference

### Core Application Files
```
📁 /app/                      # Next.js App Router structure
├── 📄 page.tsx              # Homepage (main entry point)
├── 📄 layout.tsx            # Root layout with providers
├── 📄 [shortId]/page.tsx    # Dynamic redirect handler
├── 📁 api/                  # API endpoints
│   ├── 📁 shorten/route.ts  # Core shortening logic
│   ├── 📁 analytics/route.ts # Analytics data
│   ├── 📁 links/route.ts    # Link management
│   └── 📁 delete/route.ts   # Delete operations

📁 /components/               # React components
├── 📄 url-form.tsx          # Main URL shortening form
├── 📄 link-table.tsx        # Link management table
├── 📄 analytics.tsx         # Analytics dashboard
├── 📄 qr-code.tsx           # QR code display
└── 📁 ui/                   # Reusable UI components

📁 /lib/                     # Utility libraries
├── 📄 supabase.ts           # Database client config
├── 📄 utils.ts              # Helper functions
├── 📄 rateLimiter.ts        # Rate limiting logic
└── 📄 constants.ts          # App constants

📁 /tests/                   # Test files
├── 📁 api/                  # API endpoint tests
└── 📁 lib/                  # Utility tests
```

### Configuration Files
```
📄 package.json              # Dependencies and scripts
📄 next.config.mjs           # Next.js configuration
📄 tailwind.config.ts        # Tailwind CSS config
📄 tsconfig.json             # TypeScript config
📄 Dockerfile                # Docker containerization
📄 docker-compose.yml        # Docker orchestration
📄 eslint.config.cjs         # ESLint configuration
📄 vitest.config.ts          # Testing framework config
```

### Environment Files
```
📄 .env.local.example        # Environment template
📄 .env.docker              # Docker environment template
```

### Database Files
```
📄 database_schema_backup.sql # Complete database schema
📁 supabase/migrations/      # Database migrations
└── scripts/db-init.sql      # Initial database setup
```

---

## 🔌 API Integration Map

### Core Endpoints

#### 1. URL Shortening
```typescript
POST /api/shorten
Content-Type: application/json

// Request
{
  "url": "https://example.com/long-url",
  "customAlias": "optional-alias" // optional
}

// Response (201)
{
  "shortId": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "qrDataUrl": "data:image/png;base64,...",
  "originalUrl": "https://example.com/long-url",
  "customAlias": false,
  "createdAt": "2025-11-06T10:09:59.000Z",
  "message": "URL shortened successfully"
}

// Error Response
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid URL format",
  "code": 400
}
```

#### 2. Analytics Data
```typescript
GET /api/analytics

// Response (200)
{
  "totalLinks": 42,
  "totalClicks": 1337,
  "topLinks": [
    {
      "shortId": "abc123",
      "originalUrl": "https://example.com",
      "clickCount": 100,
      "createdAt": "2025-11-01T10:00:00Z"
    }
  ],
  "clicksLast7Days": [
    {
      "date": "2025-11-01",
      "count": 15
    }
  ]
}
```

#### 3. Link Management
```typescript
GET /api/links?page=1&limit=10&sort=created_at&order=desc

// Response (200)
{
  "data": Link[],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

#### 4. Delete Link
```typescript
DELETE /api/links/delete
Content-Type: application/json

// Request
{
  "shortId": "abc123"
}

// Response (200)
{
  "message": "Link deleted successfully"
}
```

### Redirect Handler
```typescript
GET /{shortId}

// Automatically redirects to original URL
// Tracks click and updates analytics
// Returns 404 if shortId not found
```

### API Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (custom alias exists)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🛠️ Development Workflows

### Local Development Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd url-shortener

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Setup database (Supabase)
# Create project at supabase.com
# Run scripts/db-init.sql in SQL Editor

# 5. Start development server
npm run dev  # http://localhost:3000
```

### Supabase Setup
```bash
# 1. Create Supabase account and project
# 2. Get project URL and API keys
# 3. Run database initialization
psql -h your-host -U postgres -d postgres -f scripts/db-init.sql

# 4. Update environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development Workflow
```bash
# Start development
npm run dev

# Code quality checks (automated via Husky pre-commit)
npm run lint        # Check code style
npm run format      # Format code
npm run typecheck   # TypeScript validation

# Testing
npm run test                    # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Generate coverage report
npm run test:e2e               # End-to-end tests

# Build verification
npm run build                  # Production build test
npm run start                  # Production server test
```

### Environment Configuration
```env
# Required Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGci...

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RATE_LIMIT_PER_MINUTE=5

# Development Settings
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

---

## 🚢 Deployment Operations

### Docker Deployment (Recommended)
```bash
# Production deployment
docker-compose --env-file .env.docker.local up -d --build

# Development with Docker
docker-compose up --build

# View service logs
docker-compose logs -f app
docker-compose logs -f database

# Scale services
docker-compose up -d --scale app=3

# Stop services
docker-compose down
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Configure: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start

# Alternative: Start with custom port
PORT=3000 npm run start
```

### Environment-Specific Deployments

#### Development
```bash
npm run dev
# Environment: NODE_ENV=development
# Port: 3000
# Hot reload: enabled
# Source maps: enabled
```

#### Staging
```bash
npm run build && npm run start
# Environment: NODE_ENV=staging
# Environment variables configured
# Error monitoring enabled
```

#### Production
```bash
docker-compose --env-file .env.docker.local up -d --build
# Environment: NODE_ENV=production
# HTTPS enforced
# Security headers enabled
# Performance monitoring active
```

### Docker Configuration

#### Dockerfile Structure
```dockerfile
# Multi-stage build for optimization
FROM node:22-alpine AS base
FROM base AS deps          # Dependencies stage
FROM base AS builder       # Build stage
FROM base AS runner        # Production stage

# Production optimizations
# Minimal attack surface
# Security-focused base image
```

#### Docker Compose Services
```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - database

  database:
    image: supabase/postgres:latest
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=your-password

  adminer:
    image: adminer
    ports:
      - "8080:8080"
```

---

## 🏗️ Architecture Patterns

### System Architecture

#### Technology Stack
```
Frontend: Next.js 14 (App Router) + TypeScript 5.0
Backend: Next.js API Routes + Supabase
Database: PostgreSQL (via Supabase)
Styling: Tailwind CSS 3.0 + shadcn/ui
Forms: React Hook Form + Zod validation
Charts: Chart.js + react-chartjs-2
QR Codes: qrcode.react
Testing: Vitest + Testing Library
Deployment: Docker + Vercel
```

#### Component Architecture
```
Layout Components:
├── Root Layout (layout.tsx)
├── Error Boundaries
├── Navigation Components
└── Toast Notification System

Page Components:
├── Homepage (page.tsx)
├── Analytics Dashboard (analytics/page.tsx)
├── Dynamic Redirect Handler ([shortId]/page.tsx)
└── 404 Error Page (not-found.tsx)

API Route Handlers:
├── URL Shortening (/api/shorten)
├── Analytics Data (/api/analytics)
├── Link Management (/api/links)
└── Link Deletion (/api/delete)

Utility Libraries:
├── Supabase Client (lib/supabase.ts)
├── Helper Functions (lib/utils.ts)
├── Rate Limiting (lib/rateLimiter.ts)
└── Constants (lib/constants.ts)
```

### Data Flow Patterns

#### URL Shortening Flow
```
1. User Input → Form Validation (Zod)
2. API Request → Rate Limiting Check
3. Database Lookup → ID Generation
4. QR Code Generation → Response
5. Frontend Display → Success State
```

#### Analytics Tracking Flow
```
1. URL Access → Route Handler
2. Click Capture → Database Update
3. Analytics Insert → Background Processing
4. Redirect Response → User Experience
```

### Database Schema Patterns

#### Core Tables
```sql
-- Primary links table
CREATE TABLE public.links (
    id bigint PRIMARY KEY DEFAULT nextval('links_id_seq'),
    created_at timestamptz DEFAULT now(),
    original_url text NOT NULL,
    short_id varchar UNIQUE NOT NULL,
    click_count integer DEFAULT 0,
    custom_alias boolean DEFAULT false,
    last_accessed timestamptz,
    metadata jsonb DEFAULT '{}'
);

-- Analytics tracking
CREATE TABLE public.url_analytics (
    id integer PRIMARY KEY DEFAULT nextval('url_analytics_id_seq'),
    url_code varchar NOT NULL,
    clicked_at timestamptz DEFAULT now(),
    ip_address inet,
    user_agent text,
    referrer text,
    country varchar,
    city varchar
);
```

#### Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX idx_links_short_id ON links(short_id);           -- Primary lookup
CREATE INDEX idx_links_created_at ON links(created_at);      -- Time-based queries
CREATE INDEX idx_links_click_count ON links(click_count);    -- Analytics sorting
CREATE INDEX idx_analytics_url_code ON url_analytics(url_code); -- Analytics filtering
```

### Security Patterns

#### Input Validation
```typescript
// Zod schema validation
const urlSchema = z.object({
  url: z.string().url().refine(isValidUrl),
  customAlias: z.string().min(4).max(10).regex(/^[a-zA-Z0-9]+$/)
});

// Rate limiting
const rateLimit = (ip: string) => {
  // Sliding window algorithm
  // IP-based tracking
  // Configurable thresholds
};
```

#### Security Measures
- Input sanitization and validation
- SQL injection prevention (parameterized queries)
- XSS protection (React built-in + sanitization)
- Rate limiting (5 requests/minute per IP)
- Security headers implementation
- Environment variable protection

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Development Issues

**Issue:** Module not found errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

**Issue:** TypeScript errors
```bash
# Solution: Type check and restart
npm run typecheck
# Restart TypeScript server in VS Code
```

**Issue:** Supabase connection errors
```bash
# Solution: Verify environment variables
# Check NEXT_PUBLIC_SUPABASE_URL format
# Verify API keys are correct
# Test connection: curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

#### Docker Issues

**Issue:** Container fails to start
```bash
# Solution: Check logs and environment
docker-compose logs -f app
docker-compose exec app sh
# Verify .env.docker.local exists and is configured
```

**Issue:** Database connection from container
```bash
# Solution: Check network and credentials
docker-compose exec database psql -U postgres -c "SELECT version();"
# Verify database service is running
# Check docker-compose.yml network configuration
```

#### API Issues

**Issue:** Rate limiting errors (429)
```bash
# Solution: Check rate limiting configuration
# Increase RATE_LIMIT_PER_MINUTE in environment
# Clear browser cookies/cache
# Check IP-based tracking
```

**Issue:** Validation errors (400)
```bash
# Solution: Verify input format
# URL must be http/https protocol
# Custom alias: 4-10 alphanumeric characters
# Check Zod schema validation in browser dev tools
```

#### Database Issues

**Issue:** Schema not found
```bash
# Solution: Initialize database
psql -h your-host -U postgres -d postgres -f scripts/db-init.sql
# Or run in Supabase SQL Editor
```

**Issue:** Connection pool exhausted
```bash
# Solution: Optimize connections
# Check Supabase connection limits
# Implement connection pooling
# Monitor query performance
```

### Debug Commands

#### Development Debug
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NODE_ENV

# Test API endpoints
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# Check database connection
node -e "require('./lib/supabase').testConnection()"
```

#### Docker Debug
```bash
# Check container status
docker-compose ps
docker-compose logs --tail=50

# Execute in running container
docker-compose exec app node --version
docker-compose exec app npm list

# Database inspection
docker-compose exec database psql -U postgres -c "SELECT * FROM links LIMIT 5;"
```

#### Production Debug
```bash
# Check build output
npm run build
ls -la .next/

# Test production server
NODE_ENV=production npm run start
curl -I http://localhost:3000

# Monitor logs
tail -f logs/app/*.log
```

### Performance Issues

**Issue:** Slow API responses
```bash
# Solution: Database optimization
# Check index usage with EXPLAIN ANALYZE
# Optimize queries
# Implement caching
```

**Issue:** High memory usage
```bash
# Solution: Memory profiling
node --inspect server.js
# Use Chrome DevTools memory profiler
# Check for memory leaks in React components
```

**Issue:** Large bundle size
```bash
# Solution: Bundle analysis
npm run build
npx @next/bundle-analyzer
# Implement code splitting
# Optimize imports
```

---

## 📚 Quick Reference

### Package.json Scripts
```json
{
  "dev": "next dev",
  "build": "next build", 
  "start": "node server.js",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "prepare": "husky install"
}
```

### Environment Variables Checklist
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=      # Supabase service role key

# Optional
NEXT_PUBLIC_BASE_URL=           # Base URL (default: localhost:3000)
RATE_LIMIT_PER_MINUTE=          # Rate limit (default: 5)
NODE_ENV=                       # Environment (development/production)
```

### File Extensions & Paths
```
TypeScript: .ts, .tsx
Configuration: .config.js, .config.ts, .mjs
Environment: .env.*, .local
Database: .sql
Test: .test.ts, .spec.ts, .test.tsx
Component: .tsx (React), .ts (utilities)
```

### Key Dependencies & Versions
```json
{
  "next": "^14.0.0",           // Next.js 14
  "typescript": "^5.2.0",      // TypeScript 5.0
  "react": "^18.2.0",          // React 18
  "@supabase/supabase-js": "^2.38.0", // Supabase client
  "zod": "^3.22.0",            // Schema validation
  "react-hook-form": "^7.48.0", // Form handling
  "tailwindcss": "^3.3.0",     // CSS framework
  "vitest": "^0.34.0"          // Testing framework
}
```

### Database Schema Quick Reference
```sql
-- Main tables
links          -- Primary URL storage
url_analytics  -- Click tracking
urls          -- Legacy compatibility
user_profiles -- Future authentication

-- Key columns
id           -- Primary key (auto-increment)
short_id     -- Unique short identifier (VARCHAR)
original_url -- Full URL to redirect (TEXT)
click_count  -- Total clicks (INTEGER)
created_at   -- Creation timestamp
custom_alias -- Boolean flag for alias type
metadata     -- JSONB for flexible data
```

### API Response Formats
```typescript
// Success Response
{
  success: true,
  data: { ... },
  message: "Operation completed successfully"
}

// Error Response  
{
  error: "ERROR_CODE",
  message: "Human readable error message",
  details?: { ... }
}

// Pagination Response
{
  data: Array<T>,
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### CSS Class Patterns
```css
/* Tailwind utility classes */
/* Forms */
.form-input
.btn-primary
.btn-secondary
.form-error

/* Layout */
.container
.card
.sidebar
.navbar

/* Responsive breakpoints */
sm:   /* 640px+ */
md:   /* 768px+ */
lg:   /* 1024px+ */
xl:   /* 1280px+ */
2xl:  /* 1536px+ */

/* Dark mode */
.dark:  /* Applied to html or body */
```

### Component Patterns
```typescript
// Form component pattern
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// API calling pattern
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});

// Supabase client pattern
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
```

### Testing Patterns
```typescript
// Unit test pattern
import { describe, it, expect } from 'vitest';
import { functionToTest } from '@/lib/utils';

describe('Function Tests', () => {
  it('should handle valid input', () => {
    expect(functionToTest('valid-input')).toBe('expected-output');
  });
});

// API test pattern  
import { test, expect } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/endpoint/route';

test('POST /api/endpoint', async () => {
  const { req, res } = createMocks({ method: 'POST', body: {} });
  await handler(req, res);
  expect(res._getStatusCode()).toBe(201);
});
```

### Docker Commands Cheat Sheet
```bash
# Basic operations
docker-compose up --build         # Build and start
docker-compose down               # Stop services
docker-compose logs -f            # Follow logs
docker-compose ps                 # List services

# Development
docker-compose exec app sh        # Shell into app container
docker-compose exec database psql -U postgres  # Database shell
docker-compose restart app        # Restart app service

# Cleanup
docker-compose down -v            # Remove volumes
docker system prune               # Clean up system
docker images                     # List images
```

### Git Workflow Commands
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Code quality (automated via Husky)
npm run lint:fix
npm run typecheck
npm run test:coverage

# Merge workflow
git checkout main
git merge feature/new-feature
git branch -d feature/new-feature
```

### Performance Metrics Targets
```javascript
// Bundle size targets
Initial bundle: < 100KB gzipped
Route chunks: < 30KB each
Third-party deps: < 50KB total

// API performance targets
Response time: < 200ms (95th percentile)
Database queries: < 50ms (average)
Time to First Byte: < 1s

// Testing coverage targets
Lines: 80% minimum
Functions: 80% minimum
Branches: 80% minimum
Statements: 80% minimum
```

### Security Checklist
- [ ] Environment variables secured
- [ ] Input validation implemented (Zod)
- [ ] Rate limiting active
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (React + sanitization)
- [ ] Security headers configured
- [ ] HTTPS enforced in production
- [ ] Database credentials secured
- [ ] API endpoints protected
- [ ] Error messages don't leak sensitive data

---

**Document Purpose:** This briefing provides AI coding agents with immediate actionable information for development, debugging, deployment, and maintenance of the URL Shortener project.

**Last Updated:** 2025-11-06  
**Version:** 1.0  
**Status:** Production Ready