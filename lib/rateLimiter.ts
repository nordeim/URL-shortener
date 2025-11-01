import { RATE_LIMIT } from '@/lib/constants'

/**
 * Simple in-memory rate limiter using token bucket algorithm
 * 
 * Note: This is suitable for development and low-traffic scenarios.
 * For production use with Redis or similar distributed rate limiting.
 */

interface RateLimitEntry {
  tokens: number
  lastRefill: number
}

class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private readonly maxTokens: number
  private readonly refillRate: number // tokens per millisecond

  constructor(maxTokens: number = RATE_LIMIT.DEFAULT_REQUESTS_PER_MINUTE) {
    this.maxTokens = maxTokens
    this.refillRate = maxTokens / RATE_LIMIT.WINDOW_MS
  }

  /**
   * Check if request is allowed and consume a token
   */
  isAllowed(key: string): boolean {
    const now = Date.now()
    const entry = this.store.get(key) || {
      tokens: this.maxTokens,
      lastRefill: now,
    }

    // Calculate tokens to add based on time passed
    const timePassed = now - entry.lastRefill
    const tokensToAdd = timePassed * this.refillRate
    entry.tokens = Math.min(this.maxTokens, entry.tokens + tokensToAdd)
    entry.lastRefill = now

    // Check if we have tokens available
    if (entry.tokens >= 1) {
      entry.tokens -= 1
      this.store.set(key, entry)
      return true
    }

    this.store.set(key, entry)
    return false
  }

  /**
   * Get remaining tokens for a key
   */
  getRemainingTokens(key: string): number {
    const now = Date.now()
    const entry = this.store.get(key) || {
      tokens: this.maxTokens,
      lastRefill: now,
    }

    const timePassed = now - entry.lastRefill
    const tokensToAdd = timePassed * this.refillRate
    entry.tokens = Math.min(this.maxTokens, entry.tokens + tokensToAdd)

    return Math.max(0, Math.floor(entry.tokens))
  }

  /**
   * Get time until next token is available
   */
  getTimeUntilNextToken(key: string): number {
    const entry = this.store.get(key)
    if (!entry || entry.tokens >= 1) {
      return 0
    }

    const tokensNeeded = 1 - entry.tokens
    return Math.ceil(tokensNeeded / this.refillRate)
  }

  /**
   * Reset rate limit for a key (admin function)
   */
  reset(key: string): void {
    this.store.delete(key)
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now()
    const expirationTime = RATE_LIMIT.WINDOW_MS * 2 // Clean entries older than 2 windows

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastRefill > expirationTime) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get statistics about rate limiting
   */
  getStats(): { totalKeys: number; totalTokensUsed: number } {
    let totalTokensUsed = 0
    for (const entry of this.store.values()) {
      totalTokensUsed += this.maxTokens - entry.tokens
    }
    return {
      totalKeys: this.store.size,
      totalTokensUsed,
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new InMemoryRateLimiter()

/**
 * Middleware function for rate limiting
 */
export function createRateLimitMiddleware(
  keyGenerator: (req: Request) => string,
  maxRequests: number = RATE_LIMIT.DEFAULT_REQUESTS_PER_MINUTE
) {
  const limiter = new InMemoryRateLimiter(maxRequests)

  return async function rateLimit(req: Request): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    limit: number
  }> {
    const key = keyGenerator(req)
    const allowed = limiter.isAllowed(key)
    const remaining = limiter.getRemainingTokens(key)
    const resetTime = limiter.getTimeUntilNextToken(key)

    return {
      allowed,
      remaining,
      resetTime,
      limit: maxRequests,
    }
  }
}

/**
 * IP-based rate limiter middleware
 */
export function ipRateLimit(
  req: Request,
  maxRequests: number = RATE_LIMIT.DEFAULT_REQUESTS_PER_MINUTE
): {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
} {
  const ip = getClientIP(req)
  const limiter = new InMemoryRateLimiter(maxRequests)
  
  const allowed = limiter.isAllowed(ip)
  const remaining = limiter.getRemainingTokens(ip)
  const resetTime = limiter.getTimeUntilNextToken(ip)

  return {
    allowed,
    remaining,
    resetTime,
    limit: maxRequests,
  }
}

/**
 * Extract client IP address from request
 */
function getClientIP(req: Request): string {
  // Try different headers to get the real IP
  const headers = req.headers
  
  // Check for forwarded headers (load balancers, proxies)
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  const remoteAddr = headers.get('x-remote-addr')
  if (remoteAddr) {
    return remoteAddr
  }

  // Fallback to a default IP (for development)
  return '127.0.0.1'
}

/**
 * Helper function to create rate limit response headers
 */
export function createRateLimitHeaders(result: {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}) {
  const headers = new Headers()
  
  headers.set('X-RateLimit-Limit', result.limit.toString())
  headers.set('X-RateLimit-Remaining', result.remaining.toString())
  headers.set('X-RateLimit-Reset', Math.ceil(Date.now() + result.resetTime).toString())

  if (!result.allowed) {
    headers.set('Retry-After', Math.ceil(result.resetTime / 1000).toString())
  }

  return headers
}

/**
 * Rate limit error response
 */
export function createRateLimitResponse(result: {
  allowed: boolean
  remaining: number
  resetTime: number
  limit: number
}) {
  const headers = createRateLimitHeaders(result)
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: `You have exceeded the rate limit. Try again in ${Math.ceil(result.resetTime / 1000)} seconds.`,
      limit: result.limit,
      remaining: result.remaining,
      resetIn: Math.ceil(result.resetTime / 1000),
    }),
    {
      status: 429,
      headers: {
        ...Object.fromEntries(headers.entries()),
        'Content-Type': 'application/json',
      },
    }
  )
}