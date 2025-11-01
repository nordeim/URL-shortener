import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toast'
import { Analytics } from '@/components/analytics'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'URL Shortener - Fast & Simple Link Management',
    template: '%s | URL Shortener',
  },
  description: 'Create short, memorable links with detailed analytics. Fast, secure, and free URL shortening service with click tracking and management features.',
  keywords: ['URL shortener', 'link management', 'analytics', 'click tracking', 'short links'],
  authors: [{ name: 'MiniMax Agent' }],
  creator: 'MiniMax Agent',
  publisher: 'MiniMax Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'URL Shortener - Fast & Simple Link Management',
    description: 'Create short, memorable links with detailed analytics. Fast, secure, and free URL shortening service.',
    siteName: 'URL Shortener',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Shortener - Fast & Simple Link Management',
    description: 'Create short, memorable links with detailed analytics. Fast, secure, and free URL shortening service.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <a
                  href="/"
                  className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
                  </svg>
                  <span>LinkShort</span>
                </a>
              </div>
              
              <nav className="flex items-center space-x-6">
                <a
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </a>
                <a
                  href="/analytics"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-6">
              <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{' '}
                    <a
                      href="https://minimax.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      MiniMax Agent
                    </a>
                    . Powered by{' '}
                    <a
                      href="https://nextjs.org"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      Next.js
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      Supabase
                    </a>
                    .
                  </p>
                </div>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  © {new Date().getFullYear()} URL Shortener. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Global toast notifications */}
        <Toaster />
        
        {/* Analytics tracking */}
        <Analytics />
      </body>
    </html>
  )
}