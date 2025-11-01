import { describe, it, expect } from 'vitest'
import { 
  generateSecureId, 
  isValidUrl, 
  normalizeUrl, 
  sanitizeUrl, 
  formatDate, 
  formatRelativeTime,
  truncateText,
  buildShortUrl 
} from '@/lib/utils'

describe('Utils', () => {
  describe('generateSecureId', () => {
    it('should generate IDs of correct length', () => {
      const id1 = generateSecureId(6)
      const id2 = generateSecureId(10)
      
      expect(id1).toHaveLength(6)
      expect(id2).toHaveLength(10)
    })

    it('should only contain valid characters', () => {
      const id = generateSecureId(20)
      const validChars = /^[A-Za-z0-9]+$/
      
      expect(validChars.test(id)).toBe(true)
    })

    it('should generate different IDs', () => {
      const id1 = generateSecureId(6)
      const id2 = generateSecureId(6)
      
      expect(id1).not.toBe(id2)
    })
  })

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('https://www.example.com/path?query=value')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl(null as any)).toBe(false)
      expect(isValidUrl(undefined as any)).toBe(false)
    })
  })

  describe('normalizeUrl', () => {
    it('should normalize URLs correctly', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com')
      expect(normalizeUrl('https://example.com')).toBe('https://example.com')
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com')
      expect(normalizeUrl('  https://example.com/path/  ')).toBe('https://example.com/path')
    })
  })

  describe('sanitizeUrl', () => {
    it('should sanitize valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    })

    it('should reject dangerous protocols', () => {
      expect(() => sanitizeUrl('javascript:alert("test")')).toThrow()
      expect(() => sanitizeUrl('data:text/html,<script>alert("test")</script>')).toThrow()
      expect(() => sanitizeUrl('file:///etc/passwd')).toThrow()
    })

    it('should reject invalid URLs', () => {
      expect(() => sanitizeUrl('not-a-url')).toThrow()
      expect(() => sanitizeUrl('')).toThrow()
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2023-01-15T10:30:00Z')
      const formatted = formatDate(date)
      
      expect(formatted).toContain('Jan 15, 2023')
      expect(formatted).toContain('10:30')
    })

    it('should handle date strings', () => {
      const formatted = formatDate('2023-01-15T10:30:00Z')
      
      expect(formatted).toContain('Jan 15, 2023')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format recent times', () => {
      const now = new Date()
      const recent = new Date(now.getTime() - 5 * 60 * 1000) // 5 minutes ago
      
      expect(formatRelativeTime(recent)).toContain('5 minutes ago')
    })

    it('should format older times', () => {
      const now = new Date()
      const past = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      
      expect(formatRelativeTime(past)).toContain('2 days ago')
    })

    it('should handle just now', () => {
      const now = new Date()
      expect(formatRelativeTime(now)).toBe('Just now')
    })
  })

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })

    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated'
      expect(truncateText(text, 20)).toBe('This is a very long ...')
    })

    it('should handle exact length', () => {
      const text = 'Exact length'
      expect(truncateText(text, 12)).toBe('Exact length')
    })
  })

  describe('buildShortUrl', () => {
    it('should build short URLs correctly', () => {
      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true,
      })
      
      expect(buildShortUrl('abc123')).toBe('http://localhost:3000/abc123')
    })

    it('should handle custom base URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
      
      expect(buildShortUrl('abc123')).toBe('https://example.com/abc123')
      
      // Clean up
      delete process.env.NEXT_PUBLIC_BASE_URL
    })
  })
})