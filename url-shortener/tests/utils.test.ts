// tests/utils.test.ts
import { describe, it, expect } from 'vitest';
import { generateShortId, validateUrl, truncateUrl, timeAgo } from '@/lib/utils';

describe('generateShortId', () => {
  it('should generate an ID of correct length', () => {
    const id = generateShortId(6);
    expect(id).toHaveLength(6);
  });

  it('should generate unique IDs', () => {
    const id1 = generateShortId();
    const id2 = generateShortId();
    expect(id1).not.toBe(id2);
  });

  it('should only contain valid characters', () => {
    const id = generateShortId(10);
    expect(id).toMatch(/^[A-Za-z0-9]+$/);
  });
});

describe('validateUrl', () => {
  it('should accept valid HTTP URLs', () => {
    const url = 'http://example.com';
    expect(() => validateUrl(url)).not.toThrow();
  });

  it('should accept valid HTTPS URLs', () => {
    const url = 'https://example.com';
    expect(() => validateUrl(url)).not.toThrow();
  });

  it('should reject localhost URLs', () => {
    const url = 'http://localhost:3000';
    expect(() => validateUrl(url)).toThrow();
  });

  it('should reject invalid URLs', () => {
    const url = 'not-a-url';
    expect(() => validateUrl(url)).toThrow();
  });

  it('should reject FTP URLs', () => {
    const url = 'ftp://example.com';
    expect(() => validateUrl(url)).toThrow();
  });
});

describe('truncateUrl', () => {
  it('should not truncate short URLs', () => {
    const url = 'http://example.com';
    expect(truncateUrl(url, 50)).toBe(url);
  });

  it('should truncate long URLs', () => {
    const url = 'http://example.com/very/long/path/that/should/be/truncated';
    const truncated = truncateUrl(url, 30);
    expect(truncated).toHaveLength(30);
    expect(truncated).toContain('...');
  });
});

describe('timeAgo', () => {
  it('should return "Just now" for recent timestamps', () => {
    const now = new Date();
    expect(timeAgo(now)).toBe('Just now');
  });

  it('should return minutes for timestamps within an hour', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = timeAgo(fiveMinutesAgo);
    expect(result).toContain('minute');
  });

  it('should return hours for timestamps within a day', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = timeAgo(twoHoursAgo);
    expect(result).toContain('hour');
  });

  it('should return days for older timestamps', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = timeAgo(threeDaysAgo);
    expect(result).toContain('day');
  });
});
