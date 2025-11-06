import { useState, useEffect } from 'react'
import { UrlShortenerForm } from '@/components/UrlForm'
import { LinkTable } from '@/components/LinkTable'
import { Analytics } from '@/components/Analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { TrendingUp, Link, BarChart3, Home } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Tab = 'home' | 'analytics' | 'redirect'

interface RedirectData {
  originalUrl: string
  found: boolean
}

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home')
  const [redirectData, setRedirectData] = useState<RedirectData | null>(null)
  const [isLoadingRedirect, setIsLoadingRedirect] = useState(false)
  const [quickStats, setQuickStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    // Check if we're on a redirect page
    const path = window.location.pathname
    if (path.startsWith('/') && path.length > 1) {
      // This could be a short ID
      const shortId = path.slice(1)
      if (shortId.length >= 4 && shortId.length <= 10) {
        setCurrentTab('redirect')
        handleRedirect(shortId)
      }
    } else {
      // Load quick stats
      loadQuickStats()
    }
  }, [])

  const loadQuickStats = async () => {
    try {
      const [totalLinksResult, totalClicksResult, activeLinksResult] = await Promise.all([
        supabase
          .from('links')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('links')
          .select('click_count')
          .then(({ data }) => {
            return data?.reduce((sum: number, link: any) => sum + link.click_count, 0) || 0
          }),
        supabase
          .from('links')
          .select('id', { count: 'exact', head: true })
          .gt('click_count', 0),
      ])

      setQuickStats({
        totalLinks: totalLinksResult.count || 0,
        totalClicks: totalClicksResult,
        activeLinks: activeLinksResult.count || 0,
      })
    } catch (error) {
      console.error('Error loading quick stats:', error)
    }
  }

  const handleRedirect = async (shortId: string) => {
    setIsLoadingRedirect(true)
    try {
      const { data, error } = await supabase
        .from('links')
        .select('original_url')
        .eq('short_id', shortId)
        .single()

      if (error || !data) {
        setRedirectData({ originalUrl: '', found: false })
        return
      }

      // Update click count
      const { data: currentLink } = await supabase
        .from('links')
        .select('click_count')
        .eq('short_id', shortId)
        .single()
      
      if (currentLink) {
        await (supabase
          .from('links') as any)
          .update({ 
            click_count: (currentLink as any).click_count + 1,
            last_accessed: new Date().toISOString()
          })
          .eq('short_id', shortId)
      }

      setRedirectData({ originalUrl: (data as any).original_url, found: true })

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = (data as any).original_url
      }, 2000)
    } catch (error) {
      console.error('Error handling redirect:', error)
      setRedirectData({ originalUrl: '', found: false })
    } finally {
      setIsLoadingRedirect(false)
    }
  }

  const renderHomeTab = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-4">
          Shorten. Share. Track.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create short, memorable links with powerful analytics. Track clicks, analyze traffic, 
          and manage your URLs efficiently with our fast and secure URL shortening service.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* URL Shortening Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Short Link</CardTitle>
              <CardDescription>
                Enter your long URL below to get a short, shareable link with analytics tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UrlShortenerForm />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Links Created</span>
                <span className="text-2xl font-bold">{quickStats.totalLinks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Clicks</span>
                <span className="text-2xl font-bold">{quickStats.totalClicks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Links</span>
                <span className="text-2xl font-bold">{quickStats.activeLinks}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant URL shortening
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Click analytics & tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  QR code generation
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Link management
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No registration required
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Links Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <CardDescription>
              View and manage your recently created short links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkTable />
          </CardContent>
        </Card>
      </div>

      {/* How it Works Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Paste URL</h3>
            <p className="text-muted-foreground">Simply paste your long URL into the form above.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l-3-3m3 3l-3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Get Short Link</h3>
            <p className="text-muted-foreground">Get your short, memorable link instantly.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Track & Share</h3>
            <p className="text-muted-foreground">Share your link and track clicks with analytics.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRedirectTab = () => {
    if (isLoadingRedirect) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we redirect you to your destination.
            </p>
          </div>
        </div>
      )
    }

    if (!redirectData?.found) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This short link does not exist or has been removed.
            </p>
            <Button onClick={() => {
              window.history.pushState({}, '', '/')
              setCurrentTab('home')
              loadQuickStats()
            }}>
              Go to Homepage
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
          <p className="text-sm text-muted-foreground mt-2">
            If you are not redirected automatically,{' '}
            <a 
              href={redirectData.originalUrl} 
              className="text-primary hover:underline"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (currentTab === 'redirect') {
    return renderRedirectTab()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">URL Shortener</h1>
              <div className="flex space-x-4">
                <Button
                  variant={currentTab === 'home' ? 'default' : 'ghost'}
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant={currentTab === 'analytics' ? 'default' : 'ghost'}
                  onClick={() => setCurrentTab('analytics')}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {currentTab === 'home' && renderHomeTab()}
        {currentTab === 'analytics' && <Analytics />}
      </main>

      <Toaster />
    </div>
  )
}

export default App