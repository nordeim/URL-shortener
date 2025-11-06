import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UrlShortenerForm } from '@/components/UrlForm'
import { LinkTable } from '@/components/LinkTable'
import { Analytics } from '@/components/Analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { useTheme, ThemeProvider } from '@/hooks/useTheme'
import { 
  Sun, 
  Moon, 
  BarChart3, 
  Home, 
  Link as LinkIcon,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  Shield,
  Timer,
  Palette
} from 'lucide-react'
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
  const { theme, toggleTheme } = useTheme()
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
        await (supabase as any)
          .from('links')
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
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-6">
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Sparkles className="w-5 h-5" />
            Next-Generation URL Shortener
            <Zap className="w-5 h-5" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Shorten.{' '}
            <span className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-700)] bg-clip-text text-transparent">
              Share.
            </span>{' '}
            Track.
          </h1>
          
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Create short, memorable links with powerful analytics. Track clicks, analyze traffic, 
            and manage your URLs efficiently with our fast and secure URL shortening service.
          </p>
        </div>

        {/* Feature Highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { icon: Zap, label: "Lightning Fast", desc: "Instant link generation" },
            { icon: Shield, label: "Secure & Safe", desc: "URL validation & sanitization" },
            { icon: TrendingUp, label: "Advanced Analytics", desc: "Detailed click tracking" },
            { icon: Timer, label: "No Registration", desc: "Start using immediately" },
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="text-center space-y-2 p-4 rounded-xl hover:bg-[var(--surface-secondary)] transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <feature.icon className="w-6 h-6 text-[var(--primary-500)] mx-auto" />
              <div className="text-sm font-medium text-[var(--text-primary)]">{feature.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{feature.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {/* URL Shortening Form */}
        <div className="lg:col-span-2">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="card-modern">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-[var(--text-primary)] flex items-center justify-center gap-3">
                  <LinkIcon className="w-6 h-6 text-[var(--primary-500)]" />
                  Create Short Link
                </CardTitle>
                <CardDescription className="text-[var(--text-secondary)] text-lg">
                  Enter your long URL below to get a short, shareable link with analytics tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UrlShortenerForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Stats & Features */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--primary-500)]" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Links Created", value: quickStats.totalLinks, color: "text-[var(--primary-500)]" },
                  { label: "Total Clicks", value: quickStats.totalClicks, color: "text-green-500" },
                  { label: "Active Links", value: quickStats.activeLinks, color: "text-[var(--primary-600)]" },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-secondary)]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</span>
                    <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--primary-500)]" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    { icon: Zap, text: "Instant URL shortening", color: "text-green-500" },
                    { icon: TrendingUp, text: "Click analytics & tracking", color: "text-blue-500" },
                    { icon: LinkIcon, text: "QR code generation", color: "text-purple-500" },
                    { icon: Shield, text: "Advanced link management", color: "text-orange-500" },
                    { icon: Timer, text: "No registration required", color: "text-[var(--primary-500)]" },
                  ].map((feature, index) => (
                    <motion.li 
                      key={feature.text}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      <span className="text-sm text-[var(--text-secondary)]">{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Links Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Card className="card-modern">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[var(--text-primary)] flex items-center justify-center gap-3">
              <LinkIcon className="w-6 h-6 text-[var(--primary-500)]" />
              Recent Links
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)] text-lg">
              View and manage your recently created short links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkTable />
          </CardContent>
        </Card>
      </motion.div>

      {/* How it Works Section */}
      <motion.div 
        className="text-center space-y-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-[var(--text-primary)]">How It Works</h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Simple, fast, and secure - create short links in three easy steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            {
              icon: LinkIcon,
              title: "1. Paste URL",
              description: "Simply paste your long URL into the form above.",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Zap,
              title: "2. Get Short Link",
              description: "Get your short, memorable link instantly.",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: TrendingUp,
              title: "3. Track & Share",
              description: "Share your link and track clicks with analytics.",
              color: "from-green-500 to-emerald-500"
            },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              className="text-center space-y-6 p-8 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-primary)] hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6 + index * 0.2, type: "spring" }}
              >
                <step.icon className="w-10 h-10 text-white" />
              </motion.div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
              </div>
              {index < 2 && (
                <motion.div 
                  className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 + index * 0.2 }}
                >
                  <ArrowRight className="w-6 h-6 text-[var(--text-muted)]" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderRedirectTab = () => {
    if (isLoadingRedirect) {
      return (
        <motion.div 
          className="min-h-screen flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center space-y-6">
            <motion.div
              className="w-16 h-16 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-full h-full border-4 border-[var(--primary-500)] border-t-transparent rounded-full"></div>
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Redirecting...</h2>
              <p className="text-[var(--text-muted)]">Please wait while we redirect you to your destination.</p>
            </div>
          </div>
        </motion.div>
      )
    }

    if (!redirectData?.found) {
      return (
        <motion.div 
          className="min-h-screen flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <LinkIcon className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Link Not Found</h1>
              <p className="text-[var(--text-secondary)]">
                This short link does not exist or has been removed.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => {
                  window.history.pushState({}, '', '/')
                  setCurrentTab('home')
                  loadQuickStats()
                }}
                className="btn-primary"
              >
                Go to Homepage
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center space-y-6">
          <motion.div
            className="w-16 h-16 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full border-4 border-[var(--primary-500)] border-t-transparent rounded-full"></div>
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Redirecting...</h2>
            <p className="text-[var(--text-muted)]">
              If you are not redirected automatically,{' '}
              <a 
                href={redirectData.originalUrl} 
                className="text-[var(--primary-500)] hover:underline font-medium"
              >
                click here
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (currentTab === 'redirect') {
    return renderRedirectTab()
  }

  return (
    <motion.div 
      className="min-h-screen bg-[var(--bg-primary)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Navigation */}
      <motion.nav 
        className="border-b border-[var(--border-primary)] bg-[var(--surface-primary)]/80 backdrop-blur-lg sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] rounded-xl flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">LinkVault</h1>
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              <motion.div 
                className="flex space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { id: 'home', icon: Home, label: 'Home' },
                  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                ].map((item) => (
                  <motion.div key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={currentTab === item.id ? 'default' : 'ghost'}
                      onClick={() => setCurrentTab(item.id as Tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        currentTab === item.id 
                          ? 'btn-primary shadow-lg' 
                          : 'btn-ghost hover:bg-[var(--surface-secondary)]'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="theme-toggle"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === 'light' ? (
                      <Moon className="theme-toggle-icon" />
                    ) : (
                      <Sun className="theme-toggle-icon" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <motion.main 
        className="container mx-auto py-12 px-6"
        key={currentTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div key="home">
              {renderHomeTab()}
            </motion.div>
          )}
          {currentTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Analytics />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <Toaster />
    </motion.div>
  )
}

export default function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}