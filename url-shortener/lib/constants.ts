// lib/constants.ts

// Application constants
export const APP_NAME = 'URL Shortener';
export const APP_DESCRIPTION = 'Shorten URLs and track analytics';

// Rate limiting configuration
export const RATE_LIMIT = {
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
};

// Short ID configuration
export const SHORT_ID_LENGTH = 6;
export const CUSTOM_ALIAS_MIN_LENGTH = 3;
export const CUSTOM_ALIAS_MAX_LENGTH = 10;

// Pagination
export const LINKS_PER_PAGE = 20;

// Analytics
export const TOP_LINKS_COUNT = 5;
export const ANALYTICS_DAYS = 7;

// URL validation
export const BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0'];
export const ALLOWED_PROTOCOLS = ['http:', 'https:'];

// Error messages
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format',
  BLOCKED_DOMAIN: 'Cannot shorten local URLs',
  ALIAS_EXISTS: 'This custom alias is already taken',
  ALIAS_INVALID: 'Custom alias must be 3-10 characters (letters, numbers, -, _)',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  LINK_NOT_FOUND: 'Link not found',
  INTERNAL_ERROR: 'An error occurred. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LINK_CREATED: 'Short link created successfully',
  LINK_DELETED: 'Link deleted successfully',
  COPIED: 'Copied to clipboard',
} as const;
