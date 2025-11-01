# URL Shortener

A production-ready URL shortener application built with Next.js 14, TypeScript, and Supabase. Create short links, track analytics, and manage URLs with ease.

## Features

- URL Shortening with custom aliases
- QR Code generation for each shortened link
- Real-time analytics dashboard
- Click tracking with timestamps
- Link management (view, sort, delete)
- IP-based rate limiting
- Responsive design with DaisyUI
- Server-side rendering with Next.js 14
- Type-safe with TypeScript strict mode
- Comprehensive test suite
- CI/CD with GitHub Actions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + DaisyUI
- **Forms**: React Hook Form + Zod validation
- **Charts**: Chart.js + react-chartjs-2
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Supabase account and project

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the database initialization script:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `scripts/db-init.sql`
   - Execute the script

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## API Endpoints

### POST /api/shorten
Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url",
  "customAlias": "my-link"  // Optional
}
```

**Response:**
```json
{
  "message": "Short link created successfully",
  "shortUrl": "http://localhost:3000/abc123",
  "shortId": "abc123",
  "originalUrl": "https://example.com/very-long-url",
  "qrDataUrl": "data:image/png;base64,...",
  "createdAt": "2025-11-01T12:00:00Z"
}
```

### GET /[shortId]
Redirect to the original URL and increment click count.

### GET /api/analytics
Get analytics summary.

**Response:**
```json
{
  "totalLinks": 100,
  "totalClicks": 500,
  "avgClicksPerLink": 5.0,
  "topLinks": [...],
  "clicksLast7Days": [...]
}
```

### GET /api/links
Get paginated list of links with sorting.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sortBy` - Sort field (default: created_at)
- `sortOrder` - Sort order: asc/desc (default: desc)

### DELETE /api/links/delete
Delete a link.

**Query Parameters:**
- `shortId` - The short ID to delete

## Database Schema

See `scripts/db-init.sql` for the complete schema including:
- `links` table with indexes
- Row Level Security policies
- Helper functions for analytics

## Rate Limiting

The application implements IP-based rate limiting:
- Default: 5 requests per minute per IP
- Configurable via environment variables
- Token bucket algorithm

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run test:coverage
```

The test suite includes:
- Unit tests for utilities
- Rate limiter tests
- Component tests
- Integration tests

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_BASE_URL` | Base URL for short links | Yes |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No (default: 5) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No (default: 60000) |

## Project Structure

```
url-shortener/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── [shortId]/         # Dynamic redirect route
│   ├── analytics/         # Analytics page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   ├── constants.ts      # App constants
│   └── rateLimiter.ts    # Rate limiting
├── tests/                 # Test files
├── scripts/               # Database scripts
└── docs/                  # Documentation
```

## Security Features

- URL validation with Zod schemas
- Parameterized database queries
- IP-based rate limiting
- Row Level Security (RLS) in Supabase
- Security headers (CSP, X-Frame-Options, etc.)
- HTTPS-only redirects in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the RUNBOOK.md for operational guidance

## Acknowledgments

Built with:
- Next.js
- Supabase
- Tailwind CSS
- DaisyUI
- Chart.js
