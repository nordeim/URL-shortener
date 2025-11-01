// lib/utils.ts
import { z } from 'zod';

// URL validation schema
export const urlSchema = z.object({
  url: z
    .string()
    .url('Invalid URL format')
    .refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' }
    )
    .refine(
      (url) => {
        const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
        try {
          const parsed = new URL(url);
          return !blockedDomains.some((domain) =>
            parsed.hostname.includes(domain)
          );
        } catch {
          return false;
        }
      },
      { message: 'Cannot shorten local URLs' }
    ),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]{3,10}$/, {
      message:
        'Custom alias must be 3-10 characters and contain only letters, numbers, hyphens, and underscores',
    })
    .optional(),
});

export type UrlInput = z.infer<typeof urlSchema>;

/**
 * Generates a cryptographically secure random short ID
 * @param length - Length of the ID (default: 6)
 * @returns A URL-safe random string
 */
export function generateShortId(length: number = 6): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(length);
  
  if (typeof window !== 'undefined') {
    // Browser environment
    crypto.getRandomValues(randomValues);
  } else {
    // Node.js environment
    const nodeCrypto = require('crypto');
    nodeCrypto.randomFillSync(randomValues);
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  
  return result;
}

/**
 * Validates and sanitizes a URL
 * @param url - URL to validate
 * @returns Validated URL or throws error
 */
export function validateUrl(url: string): string {
  const result = urlSchema.shape.url.safeParse(url);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}

/**
 * Formats a date to a readable string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculates the time difference from now
 * @param date - Date string or Date object
 * @returns Human-readable time difference
 */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Truncates a URL for display
 * @param url - URL to truncate
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated URL
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + '...';
}

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copied
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } finally {
      textArea.remove();
    }
  }
}
