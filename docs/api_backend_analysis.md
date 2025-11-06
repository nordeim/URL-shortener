# Backend API Routes Analysis

This document provides a comprehensive analysis of all API routes in the `/app/api/` directory, including request/response patterns, validation schemas, error handling strategies, database integration, business logic implementation, and security measures.

## Overview

The backend consists of 4 main API endpoints built with Next.js 14 App Router:

1. **POST `/api/shorten`** - Create shortened URLs
2. **GET `/api/analytics`** - Fetch analytics data
3. **GET `/api/links`** - List all links with pagination
4. **DELETE `/api/links/delete`** - Delete a specific link

## 1. Shorten API (`/api/shorten/route.ts`)

### Request/Response Patterns

**Request Pattern:**
```typescript
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url",
  "customAlias": "optional-custom-alias" // optional
}
```

**Response Pattern (Success):**
```typescript
201 Created
Content-Type: application/json

{
  "shortId": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "qrDataUrl": "data:image/png;base64,...",
  "originalUrl": "https://example.com/very/long/url",
  "customAlias": false,
  "createdAt": "2025-11-06T10:09:59.000Z",
  "message": "URL shortened successfully"
}
```

**Response Pattern (Error):**
```typescript
400 Bad Request
Content-Type: application/json

{
  "error": "Validation error",
  "details": [...],
  "code": "validation_error"
}
```

### Validation Schemas and Approaches

**Zod Schema Validation:**
```typescript
const shortenRequestSchema = z.object({
  url: z.string().min(1, 'URL is required')
    .refine(isValidUrl, 'Please enter a valid URL'),
  customAlias: z.string().optional().refine(
    (alias) => !alias || /^[a-zA-Z0-9]{4,10}$/.test(alias),
    'Custom alias must be 4-10 characters, alphanumeric only'
  ),
})
```

**URL Sanitization Process:**
1. **Validation**: Check URL format using `URL` constructor
2. **Normalization**: Remove trailing slashes, add HTTPS if missing
3. **Sanitization**: Enforce HTTP/HTTPS protocols only
4. **Security Check**: Prevent dangerous protocols (javascript:, etc.)

### Error Handling Strategies

**Layered Error Handling:**
1. **Rate Limit Errors** (429): Token bucket algorithm violations
2. **Validation Errors** (400): Zod schema validation failures
3. **Database Errors** (500): Insert failures, constraint violations
4. **Resource Conflicts** (409): Custom alias already exists

**Specific Error Codes:**
- `23505`: PostgreSQL unique constraint violation
- `PGRST116`: No rows returned (not found)

### Database Integration Methods

**Supabase Client Usage:**
```typescript
const supabase = getSupabaseClient(true) // Service role for admin operations
```

**Transaction Flow:**
1. **Custom Alias Check**: Query for existing custom alias
2. **Random ID Generation**: Generate unique short ID (up to 10 attempts)
3. **Insert Link**: Store URL with metadata
4. **Conflict Handling**: Retry with longer ID if needed

**Database Operations:**
```typescript
// Check existing alias
supabase.from('links').select('short_id').eq('short_id', shortId)

// Insert new link
supabase.from('links').insert({
  original_url: sanitizedUrl,
  short_id: shortId,
  custom_alias: customAlias,
  metadata: {
    created_at: new Date().toISOString(),
    user_agent: request.headers.get('user-agent'),
    ip_address: request.headers.get('x-forwarded-for')
  }
})
```

### Business Logic Implementation

**Short ID Generation Algorithm:**
1. **Custom Alias**: Direct usage if provided and unique
2. **Random Generation**: Cryptographically secure 6-character ID
3. **Collision Handling**: Retry up to 10 times, fallback to 8 characters
4. **Character Set**: Alphanumeric (A-Z, a-z, 0-9)

**QR Code Generation:**
- Optional feature using `qrcode` library
- Data URL format for frontend embedding
- 200x200px with error correction level M
- Non-blocking (doesn't fail request if QR generation fails)

### Security Measures

**Rate Limiting:**
- **Algorithm**: Token bucket implementation
- **Limit**: 5 requests per minute (configurable via env)
- **Key**: Client IP address
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

**URL Security:**
- Protocol validation (HTTP/HTTPS only)
- Input sanitization to prevent XSS
- No external URL support (security risk mitigation)

**IP Detection:**
- Multiple header support: `x-forwarded-for`, `x-real-ip`, `x-remote-addr`
- Fallback to localhost for development

## 2. Analytics API (`/api/analytics/route.ts`)

### Request/Response Patterns

**Request Pattern:**
```typescript
GET /api/analytics
// No query parameters required
```

**Response Pattern:**
```typescript
200 OK
Content-Type: application/json
Cache-Control: no-store

{
  "totalLinks": 150,
  "totalClicks": 2340,
  "top5": [
    {
      "short_id": "abc123",
      "original_url": "https://example.com/very/long/url",
      "click_count": 234,
      "created_at": "2025-11-01T10:09:59.000Z"
    }
    // ... 4 more
  ],
  "clicksLast7Days": [
    {
      "date": "2025-11-01",
      "count": 23
    }
    // ... 6 more days
  ]
}
```

### Database Integration Methods

**Parallel Queries:**
```typescript
const [totalLinksResult, totalClicksResult] = await Promise.all([
  supabase.from('links').select('id', { count: 'exact', head: true }),
  supabase.from('links').select('click_count')
])
```

**7-Day Click Aggregation:**
- Client-side date filtering for last 7 days
- Day-by-day click count aggregation
- Empty data fallback for new installations

**Performance Optimizations:**
- `head: true` for count-only queries
- Single query for click count aggregation
- Reverse chronological ordering for recent data

### Error Handling Strategies

**Graceful Degradation:**
- Always return valid response structure
- Zero values for missing data
- Empty arrays instead of errors
- Console logging for debugging

**Error Recovery:**
- Fallback to empty analytics for new installations
- Continue processing even if some queries fail

## 3. Links List API (`/api/links/route.ts`)

### Request/Response Patterns

**Request Pattern:**
```typescript
GET /api/links?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (max: 50, default: 10)

**Response Pattern:**
```typescript
200 OK
Content-Type: application/json
Cache-Control: no-store

{
  "links": [
    {
      "id": 1,
      "created_at": "2025-11-06T10:09:59.000Z",
      "original_url": "https://example.com/very/long/url",
      "short_id": "abc123",
      "click_count": 23,
      "custom_alias": false,
      "last_accessed": "2025-11-05T15:30:22.000Z"
    }
    // ... more links
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Database Integration Methods

**Pagination Strategy:**
1. **Count Query**: Get total count for pagination info
2. **Data Query**: Fetch paginated results with ordering
3. **Calculation**: Compute pagination metadata client-side

**Query Optimization:**
```typescript
// Efficient pagination
.order('created_at', { ascending: false })
.range(offset, offset + limit - 1)

// Fields selection for performance
.select('id, created_at, original_url, short_id, click_count, custom_alias, last_accessed')
```

### Validation and Error Handling

**Input Validation:**
- Page and limit parameters parsed as integers
- Limit capped at 50 to prevent excessive queries
- Safe defaults for missing parameters

**Error Recovery:**
- Return empty links array on database errors
- Provide default pagination info
- Continue serving requests even with partial failures

## 4. Delete API (`/api/links/delete/route.ts`)

### Request/Response Patterns

**Request Pattern:**
```typescript
DELETE /api/links/delete
Content-Type: application/json

{
  "shortId": "abc123"
}
```

**Response Pattern (Success):**
```typescript
200 OK
Content-Type: application/json

{
  "message": "Link deleted successfully",
  "deletedShortId": "abc123"
}
```

**Response Pattern (Not Found):**
```typescript
404 Not Found
Content-Type: application/json

{
  "error": "Link not found",
  "code": "not_found"
}
```

### Validation Schemas

**Zod Schema:**
```typescript
const deleteLinkSchema = z.object({
  shortId: z.string().min(1, 'Short ID is required').max(10, 'Short ID too long'),
})
```

### Database Integration Methods

**Two-Step Deletion Process:**
1. **Existence Check**: Verify link exists before deletion
2. **Deletion**: Delete using internal ID for safety

**Error Handling for Deletion:**
- Handle "not found" scenarios gracefully
- Distinguish between "doesn't exist" and "database error"

## Cross-Cutting Concerns

### Database Integration Architecture

**Supabase Client Pattern:**
```typescript
// All endpoints use service role client for admin operations
const supabase = getSupabaseClient(true)
```

**Database Schema:**
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_url TEXT NOT NULL,
  short_id VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  custom_alias BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);
```

### Constants and Configuration

**Centralized Constants (`/lib/constants.ts`):**
```typescript
export const RATE_LIMIT = {
  DEFAULT_REQUESTS_PER_MINUTE: 5,
  WINDOW_MS: 60 * 1000,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const
```

### Rate Limiting Implementation

**In-Memory Token Bucket:**
```typescript
class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private readonly maxTokens: number
  private readonly refillRate: number
  
  isAllowed(key: string): boolean {
    // Token bucket algorithm implementation
  }
}
```

**Rate Limit Headers:**
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Timestamp when limit resets

### Utility Functions

**Security Utilities:**
- `generateSecureId()`: Cryptographically secure random ID
- `isValidUrl()`: URL validation
- `sanitizeUrl()`: Protocol enforcement
- `normalizeUrl()`: URL standardization

**Business Logic Utilities:**
- `formatDate()`: Human-readable dates
- `formatRelativeTime()`: "2 hours ago" format
- `buildShortUrl()`: Construct full short URLs

### Testing Patterns

**Test Structure (from `/tests/api/shorten.test.ts`):**
- Mock Supabase client for isolated testing
- Test all success and error scenarios
- Validate HTTP methods and status codes
- Mock external dependencies (QR code generation)

**Mocking Strategy:**
```typescript
vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockData, error: null }))
        }))
      }))
    }))
  }))
}))
```

## Security Analysis

### Strengths

1. **Rate Limiting**: Token bucket algorithm prevents abuse
2. **Input Validation**: Zod schemas validate all inputs
3. **URL Sanitization**: Protocol enforcement prevents XSS
4. **Cryptographic Security**: Web Crypto API for ID generation
5. **IP Detection**: Multiple header support for real IP
6. **Service Role Isolation**: Admin operations separated

### Potential Improvements

1. **Distributed Rate Limiting**: Current in-memory solution won't scale
2. **Authentication**: No user authentication system
3. **Audit Logging**: Limited audit trail for operations
4. **Input Size Limits**: Could add URL length validation
5. **Domain Allowlisting**: Could restrict to specific domains
6. **Click Tracking**: Analytics could be more comprehensive

## Performance Considerations

### Database Optimizations

1. **Efficient Queries**: Use `select` with specific fields
2. **Pagination**: Limit result sets to prevent memory issues
3. **Indexes**: Likely have indexes on `short_id` and `created_at`
4. **Parallel Queries**: Analytics endpoint uses `Promise.all`

### Caching Strategy

1. **No Caching Headers**: Analytics data marked as `no-store`
2. **Client-Side Processing**: Some analytics computed in memory
3. **Optional Features**: QR code generation is non-blocking

### Scalability Concerns

1. **In-Memory Rate Limiting**: Won't work across multiple instances
2. **Analytics Aggregation**: Client-side processing may be slow with large datasets
3. **No Query Optimization**: Could benefit from database views

## Error Handling Best Practices

### Consistency

1. **Standardized Error Format**: All errors include `error`, `code`, `message`
2. **HTTP Status Codes**: Appropriate status codes for each scenario
3. **Graceful Degradation**: Always return valid response structure

### Debugging Support

1. **Console Logging**: Detailed error logging for debugging
2. **Error Codes**: Machine-readable error codes
3. **Rate Limit Headers**: Help clients understand rate limiting

### User Experience

1. **Meaningful Messages**: Error messages are user-friendly
2. **Validation Details**: Zod errors include field-specific messages
3. **Retry Information**: Rate limit errors include retry timing

## Recommendations

### Immediate Improvements

1. **Add Authentication**: Implement user accounts and auth
2. **Improve Rate Limiting**: Use Redis or similar distributed store
3. **Add API Documentation**: Swagger/OpenAPI documentation
4. **Enhanced Validation**: Add URL length and domain restrictions

### Medium-term Enhancements

1. **Click Tracking**: More detailed analytics and click tracking
2. **Bulk Operations**: Support for bulk URL shortening/deletion
3. **API Versioning**: Version API endpoints for backwards compatibility
4. **Webhook Support**: Notify external systems of link events

### Long-term Considerations

1. **Microservices**: Split analytics and core functionality
2. **Event Sourcing**: Track all link events for audit trail
3. **Performance Monitoring**: Add APM and performance metrics
4. **CDN Integration**: Cache analytics and static content

## Conclusion

The backend API demonstrates solid architectural patterns with comprehensive error handling, security measures, and business logic implementation. The use of modern TypeScript, Next.js 14, and Supabase provides a strong foundation. Key strengths include robust validation, rate limiting, and database integration, while areas for improvement include scalability features like distributed rate limiting and enhanced security through authentication.