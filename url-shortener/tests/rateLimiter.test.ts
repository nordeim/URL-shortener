// tests/rateLimiter.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import RateLimiter from '@/lib/rateLimiter';

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(3, 1000); // 3 requests per second
  });

  it('should allow requests within limit', () => {
    expect(rateLimiter.check('user1')).toBe(true);
    expect(rateLimiter.check('user1')).toBe(true);
    expect(rateLimiter.check('user1')).toBe(true);
  });

  it('should block requests exceeding limit', () => {
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    expect(rateLimiter.check('user1')).toBe(false);
  });

  it('should track different users separately', () => {
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    
    expect(rateLimiter.check('user1')).toBe(false);
    expect(rateLimiter.check('user2')).toBe(true);
  });

  it('should return correct remaining count', () => {
    expect(rateLimiter.getRemaining('user1')).toBe(3);
    rateLimiter.check('user1');
    expect(rateLimiter.getRemaining('user1')).toBe(2);
    rateLimiter.check('user1');
    expect(rateLimiter.getRemaining('user1')).toBe(1);
  });

  it('should reset after window expires', (done) => {
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    rateLimiter.check('user1');
    
    expect(rateLimiter.check('user1')).toBe(false);
    
    setTimeout(() => {
      expect(rateLimiter.check('user1')).toBe(true);
      done();
    }, 1100);
  }, 2000);

  it('should clear all data on reset', () => {
    rateLimiter.check('user1');
    rateLimiter.check('user2');
    
    rateLimiter.reset();
    
    expect(rateLimiter.getRemaining('user1')).toBe(3);
    expect(rateLimiter.getRemaining('user2')).toBe(3);
  });
});
