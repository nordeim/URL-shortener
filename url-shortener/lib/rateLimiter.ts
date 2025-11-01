// lib/rateLimiter.ts

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Token bucket rate limiter implementation
 * Tracks requests per IP address
 */
class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (e.g., IP address)
   * @returns true if request is allowed, false if rate limited
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry) {
      // First request from this identifier
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Window has expired, reset
      entry.count = 1;
      entry.resetTime = now + this.windowMs;
      return true;
    }

    if (entry.count < this.maxRequests) {
      // Within limit
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get remaining requests for an identifier
   * @param identifier - Unique identifier
   * @returns Number of remaining requests
   */
  getRemaining(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return this.maxRequests;

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get time until rate limit resets for an identifier
   * @param identifier - Unique identifier
   * @returns Milliseconds until reset, or 0 if not rate limited
   */
  getResetTime(identifier: string): number {
    const entry = this.requests.get(identifier);
    if (!entry) return 0;

    const now = Date.now();
    if (now > entry.resetTime) return 0;

    return entry.resetTime - now;
  }

  /**
   * Remove expired entries from memory
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [identifier, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(identifier);
      }
    }
  }

  /**
   * Clear all rate limit data (useful for testing)
   */
  reset(): void {
    this.requests.clear();
  }
}

// Singleton instance
let rateLimiterInstance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiterInstance) {
    const maxRequests = parseInt(
      process.env.RATE_LIMIT_MAX_REQUESTS || '5',
      10
    );
    const windowMs = parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || '60000',
      10
    );
    rateLimiterInstance = new RateLimiter(maxRequests, windowMs);
  }
  return rateLimiterInstance;
}

export default RateLimiter;
