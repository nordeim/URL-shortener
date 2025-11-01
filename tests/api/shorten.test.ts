import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createMockRequest, createMockResponse } from './helpers/mocks'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 1, created_at: new Date().toISOString() }, error: null }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  })),
  supabase: {},
  supabaseServer: null,
  supabaseAuth: {}
}))

// Mock QR code generation
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,mockqrcode')),
  }
}))

// Import the API route after mocking dependencies
let shortenRoute: any

describe('/api/shorten', () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    
    // Import the route module
    const module = await import('@/app/api/shorten/route')
    shortenRoute = module
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('POST', () => {
    it('should create a short URL successfully', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com/very/long/url'
      })

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty('shortId')
      expect(data).toHaveProperty('shortUrl')
      expect(data).toHaveProperty('qrDataUrl')
      expect(data).toHaveProperty('originalUrl')
    })

    it('should create a custom alias successfully', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com',
        customAlias: 'myalias'
      })

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.shortId).toBe('myalias')
      expect(data.customAlias).toBe(true)
    })

    it('should reject invalid URLs', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'not-a-valid-url'
      })

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should reject invalid custom aliases', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com',
        customAlias: 'invalid-alias' // Contains dash
      })

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation error')
    })

    it('should reject duplicate custom aliases', async () => {
      // Mock the database to return an existing link
      const { getSupabaseClient } = await import('@/lib/supabase')
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: null, 
                error: { code: '23505' } // Unique constraint violation
              }))
            }))
          })),
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { short_id: 'existing' }, 
                error: null 
              }))
            }))
          }))
        }))
      }
      vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase as any)

      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com',
        customAlias: 'existing'
      })

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Custom alias already exists')
    })

    it('should handle rate limiting', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com'
      })

      // Mock rate limiter to reject
      const { ipRateLimit } = await import('@/lib/rateLimiter')
      vi.mocked(ipRateLimit).mockReturnValue({
        allowed: false,
        remaining: 0,
        resetTime: 60000,
        limit: 5
      })

      const response = await shortenRoute.POST(mockRequest)
      
      expect(response.status).toBe(429)
    })

    it('should handle server errors gracefully', async () => {
      const mockRequest = createMockRequest('POST', {
        url: 'https://example.com'
      })

      // Mock database error
      const { getSupabaseClient } = await import('@/lib/supabase')
      const mockSupabase = {
        from: vi.fn(() => ({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: null, 
                error: { code: '500', message: 'Database error' }
              }))
            }))
          }))
        }))
      }
      vi.mocked(getSupabaseClient).mockReturnValue(mockSupabase as any)

      const response = await shortenRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create short link')
    })
  })

  describe('HTTP Methods', () => {
    it('should reject GET requests', async () => {
      const mockRequest = createMockRequest('GET')
      
      const response = await shortenRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })

    it('should reject PUT requests', async () => {
      const mockRequest = createMockRequest('PUT')
      
      const response = await shortenRoute.PUT(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })

    it('should reject DELETE requests', async () => {
      const mockRequest = createMockRequest('DELETE')
      
      const response = await shortenRoute.DELETE(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })
  })
})