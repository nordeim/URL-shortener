import { vi } from 'vitest'

export function createMockRequest(
  method: string,
  body?: any,
  headers: Record<string, string> = {}
) {
  return {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      'User-Agent': 'Test Agent',
      'x-forwarded-for': '127.0.0.1',
      ...headers,
    }),
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body || {})),
    url: 'http://localhost:3000/api/shorten',
    nextUrl: {
      pathname: '/api/shorten',
    },
  }
}

export function createMockResponse() {
  const responseInit: any = {
    status: 200,
    headers: new Headers(),
  }

  const response = {
    status: (code: number) => {
      responseInit.status = code
      return response
    },
    json: (data: any) => {
      responseInit.body = data
      return new Response(JSON.stringify(data), {
        status: responseInit.status,
        headers: responseInit.headers,
      })
    },
    headers: responseInit.headers,
  }

  return response
}

export function createMockSupabaseClient() {
  return {
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        })),
        order: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ 
            data: { id: 1, created_at: new Date().toISOString() }, 
            error: null 
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}

export function setupGlobalMocks() {
  // Mock window.location
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'http://localhost:3000',
      href: 'http://localhost:3000',
      pathname: '/',
    },
    writable: true,
  })

  // Mock window.history
  Object.defineProperty(window, 'history', {
    value: {
      pushState: vi.fn(),
      replaceState: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      state: null,
    },
    writable: true,
  })

  // Mock window.navigator
  Object.defineProperty(window, 'navigator', {
    value: {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
        readText: vi.fn(() => Promise.resolve('')),
      },
      userAgent: 'Test User Agent',
    },
    writable: true,
  })

  // Mock crypto for URL ID generation
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (arr: any) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256)
        }
        return arr
      },
    },
    writable: true,
  })

  // Mock fetch
  global.fetch = vi.fn()

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock matchMedia for Chart.js
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

export function cleanupGlobalMocks() {
  vi.clearAllMocks()
  delete (window as any).location
  delete (window as any).history
  delete (window as any).navigator
  delete (global as any).crypto
  delete (global as any).fetch
  delete (global as any).ResizeObserver
  delete (global as any).IntersectionObserver
  delete (window as any).matchMedia
}