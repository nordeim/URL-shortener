// Application constants

export const APP_NAME = 'URL Shortener'
export const APP_DESCRIPTION = 'Simple and fast URL shortening service'

// URL validation constants
export const URL_VALIDATION = {
  MAX_LENGTH: 2048,
  PROTOCOLS: ['http:', 'https:'],
  ALLOWED_HOSTS: [], // Empty array means all hosts allowed
  BLOCKED_HOSTS: [], // Add hosts to block if needed
} as const

// Short ID generation constants
export const SHORT_ID = {
  MIN_LENGTH: 4,
  MAX_LENGTH: 10,
  DEFAULT_LENGTH: 6,
  CHARSET: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
} as const

// Rate limiting constants
export const RATE_LIMIT = {
  DEFAULT_REQUESTS_PER_MINUTE: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '5'),
  WINDOW_MS: 60 * 1000, // 1 minute
  BURST_LIMIT: 10, // Allow burst up to 10 requests
} as const

// API response constants
export const API = {
  SUCCESS: 'success',
  ERROR: 'error',
  VALIDATION_ERROR: 'validation_error',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  NOT_FOUND: 'not_found',
  CONFLICT: 'conflict',
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Database constants
export const DATABASE = {
  TABLE_NAME: 'links',
  COLUMNS: {
    ID: 'id',
    CREATED_AT: 'created_at',
    ORIGINAL_URL: 'original_url',
    SHORT_ID: 'short_id',
    CLICK_COUNT: 'click_count',
    CUSTOM_ALIAS: 'custom_alias',
    LAST_ACCESSED: 'last_accessed',
    METADATA: 'metadata',
  } as const,
  INDEXES: {
    SHORT_ID: 'idx_links_short_id',
    CREATED_AT: 'idx_links_created_at',
    LAST_ACCESSED: 'idx_links_last_accessed',
  } as const,
} as const

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

// Chart constants
export const CHART = {
  COLORS: [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6366f1', // indigo
  ] as const,
} as const

// Form validation constants
export const VALIDATION = {
  URL: {
    REQUIRED: 'URL is required',
    INVALID: 'Please enter a valid URL',
    TOO_LONG: `URL must be less than ${URL_VALIDATION.MAX_LENGTH} characters`,
  },
  CUSTOM_ALIAS: {
    REQUIRED: 'Custom alias is required',
    INVALID: 'Custom alias must be 4-10 characters, alphanumeric only',
    ALREADY_EXISTS: 'This custom alias is already taken',
  },
} as const

// Analytics constants
export const ANALYTICS = {
  DEFAULT_TIME_RANGE: 7, // days
  CHART_HEIGHT: 300,
  MAX_TOP_LINKS: 5,
} as const

// UI constants
export const UI = {
  TOAST_DURATION: 4000,
  ANIMATION_DURATION: 300,
  LOADING_DELAY: 200,
} as const

// Security constants
export const SECURITY = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const

// Environment constants
export const ENV = {
  DEVELOPMENT: process.env.NODE_ENV === 'development',
  PRODUCTION: process.env.NODE_ENV === 'production',
  TESTING: process.env.NODE_ENV === 'test',
} as const