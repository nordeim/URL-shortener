import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { 
  Loader2, 
  RefreshCw, 
  TrendingUp, 
  Link, 
  MousePointer, 
  Calendar,
  BarChart3,
  Target,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

interface AnalyticsData {
  totalLinks: number
  totalClicks: number
  top5: Array<{
    short_id: string
    original_url: string
    click_count: number
    created_at: string
  }>
  clicksLast7Days: Array<{
    date: string
    count: number
  }>
}

interface AnalyticsChartProps {
  clicksLast7Days: Array<{ date: string; count: number }>
  topLinks: Array<{
    short_id: string
    original_url: string
    click_count: number
  }>
  totalClicks: number
  totalLinks: number
  className?: string
}

export function AnalyticsChart({
  clicksLast7Days,
  topLinks,
  totalClicks,
  totalLinks,
  className,
}: AnalyticsChartProps) {
  // Line chart data for clicks over time
  const lineChartData = {
    labels: clicksLast7Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    ),
    datasets: [
      {
        label: 'Clicks',
        data: clicksLast7Days.map(item => item.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  // Doughnut chart data for link distribution
  const doughnutChartData = {
    labels: ['Active Links', 'Inactive Links'],
    datasets: [
      {
        data: [
          topLinks.filter(link => link.click_count > 0).length,
          Math.max(0, totalLinks - topLinks.filter(link => link.click_count > 0).length)
        ],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgba(156, 163, 175, 0.5)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }

  // Bar chart data for top links
  const barChartData = {
    labels: topLinks.slice(0, 5).map(link => 
      link.short_id.length > 8 
        ? `${link.short_id.slice(0, 8)}...` 
        : link.short_id
    ),
    datasets: [
      {
        label: 'Clicks',
        data: topLinks.slice(0, 5).map(link => link.click_count),
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: 'rgb(107, 114, 128)',
        },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(107, 114, 128)',
          font: {
            family: 'Inter',
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
      {/* Clicks Over Time */}
      <motion.div
        className="card-modern p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-semibold mb-6 text-[var(--text-primary)] flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[var(--primary-500)]" />
          Clicks Over Time
        </h3>
        <div className="h-64">
          {clicksLast7Days.length > 0 ? (
            <Line data={lineChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No click data available</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Link Activity */}
      <motion.div
        className="card-modern p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-lg font-semibold mb-6 text-[var(--text-primary)] flex items-center gap-3">
          <Target className="w-5 h-5 text-[var(--primary-500)]" />
          Link Activity
        </h3>
        <div className="h-64">
          {totalLinks > 0 ? (
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No link data available</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Top Performing Links */}
      {topLinks.length > 0 && (
        <motion.div
          className="card-modern p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold mb-6 text-[var(--text-primary)] flex items-center gap-3">
            <Zap className="w-5 h-5 text-[var(--primary-500)]" />
            Top Performing Links
          </h3>
          <div className="h-64 mb-6">
            <Bar data={barChartData} options={barOptions} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLinks.slice(0, 5).map((link, index) => (
              <motion.div
                key={link.short_id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-primary)]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] }}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm text-[var(--text-primary)] block truncate">
                    {link.short_id}
                  </span>
                  <span className="text-[var(--text-muted)] text-xs">
                    {link.click_count} clicks
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      // Get total counts
      const [totalLinksResult, totalClicksResult] = await Promise.all([
        supabase
          .from('links')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('links')
          .select('click_count')
          .then(({ data, error }) => {
            if (error) throw error
            const totalClicks = data?.reduce((sum: number, link: any) => sum + link.click_count, 0) || 0
            return totalClicks
          }),
      ])

      const totalLinks = totalLinksResult.count || 0
      const totalClicks = totalClicksResult

      // Get top 5 links by click count
      const { data: topLinks, error: topLinksError } = await supabase
        .from('links')
        .select('short_id, original_url, click_count, created_at')
        .order('click_count', { ascending: false })
        .limit(5)

      if (topLinksError) {
        console.error('Error fetching top links:', topLinksError)
      }

      // Get clicks for the last 7 days
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: recentLinks, error: recentLinksError } = await supabase
        .from('links')
        .select('last_accessed, click_count')
        .not('last_accessed', 'is', null)
        .gte('last_accessed', sevenDaysAgo.toISOString())

      if (recentLinksError) {
        console.error('Error fetching recent links:', recentLinksError)
      }

      // Process clicks for the last 7 days
      const clicksLast7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayClicks = recentLinks?.filter((link: any) => {
          if (!link.last_accessed) return false
          const linkDate = new Date(link.last_accessed)
          return linkDate >= date && linkDate < nextDay
        }).reduce((sum: number, link: any) => sum + link.click_count, 0) || 0

        return {
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          count: dayClicks,
        }
      }).reverse() // Reverse to show oldest to newest

      setAnalytics({
        totalLinks,
        totalClicks,
        top5: (topLinks || []) as any[],
        clicksLast7Days,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchAnalytics(true)
  }

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <Loader2 className="loading-spinner w-8 h-8 mx-auto mb-4 text-[var(--primary-500)]" />
          <span className="text-[var(--text-secondary)] font-medium">Loading analytics...</span>
        </div>
      </motion.div>
    )
  }

  if (!analytics) {
    return (
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">Analytics</h1>
        <p className="text-[var(--text-muted)] mb-6">
          Unable to load analytics data. Please try again.
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => fetchAnalytics()} className="btn-primary">
            Retry
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const avgClicksPerLink = analytics.totalLinks > 0 ? (analytics.totalClicks / analytics.totalLinks).toFixed(1) : '0'
  const recentActivityTotal = analytics.clicksLast7Days.reduce((sum, day) => sum + day.count, 0)
  const isActivityIncreasing = analytics.clicksLast7Days.length >= 2 && 
    analytics.clicksLast7Days[analytics.clicksLast7Days.length - 1]?.count > 
    analytics.clicksLast7Days[analytics.clicksLast7Days.length - 2]?.count

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[var(--primary-500)]" />
            Analytics Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Track your link performance and click analytics
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="btn-secondary"
          >
            {isRefreshing ? (
              <Loader2 className="loading-spinner mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="card-modern p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Links</CardTitle>
            <Link className="h-4 w-4 text-[var(--primary-500)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{analytics.totalLinks}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Active shortened URLs
            </p>
          </CardContent>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="card-modern p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-[var(--primary-500)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              {analytics.totalClicks}
              {recentActivityTotal > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                >
                  {isActivityIncreasing ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {recentActivityTotal}
                </motion.div>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              All-time link clicks
            </p>
          </CardContent>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="card-modern p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Avg. Clicks/Link</CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--primary-500)]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{avgClicksPerLink}</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Clicks per created link
            </p>
          </CardContent>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnalyticsChart
          clicksLast7Days={analytics.clicksLast7Days}
          topLinks={analytics.top5}
          totalClicks={analytics.totalClicks}
          totalLinks={analytics.totalLinks}
        />
      </motion.div>

      {/* Top Links Table */}
      {analytics.top5.length > 0 && (
        <motion.div
          className="card-modern p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
        >
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-3">
              <Zap className="w-5 h-5 text-[var(--primary-500)]" />
              Top Performing Links
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Your most clicked short links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.top5.map((link, index) => (
                <motion.div
                  key={link.short_id}
                  className="flex items-center justify-between p-4 border border-[var(--border-primary)] rounded-xl hover:bg-[var(--surface-secondary)] transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm bg-[var(--primary-500)] text-white px-3 py-1 rounded-lg font-medium">
                        {link.short_id}
                      </span>
                      <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                        #{index + 1}
                        {index === 0 && <Zap className="w-3 h-3 text-yellow-500" />}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] truncate mb-1">
                      {link.original_url}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created {formatDate(link.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                      {link.click_count}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                      clicks
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
      )}

      {/* No Data State */}
      {analytics.totalLinks === 0 && (
        <motion.div
          className="card-modern p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Calendar className="h-16 w-16 text-[var(--text-muted)] mx-auto mb-6 opacity-50" />
          <h3 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">No Data Available</h3>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Create some links to see your analytics data here. Track clicks, analyze trends, and optimize your shortened URLs.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => window.location.href = '/'} className="btn-primary">
              Create Your First Link
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Recent Activity Summary */}
      {analytics.clicksLast7Days.length > 0 && (
        <motion.div
          className="card-modern p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <CardHeader>
            <CardTitle className="text-[var(--text-primary)] flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[var(--primary-500)]" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Click activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {analytics.clicksLast7Days.map((day, index) => (
                <motion.div
                  key={day.date}
                  className="text-center p-4 border border-[var(--border-primary)] rounded-xl hover:bg-[var(--surface-secondary)] transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-sm text-[var(--text-muted)] mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short' 
                    })}
                  </div>
                  <div className="text-xl font-bold text-[var(--text-primary)] mb-1">
                    {day.count}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    clicks
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
      )}
    </motion.div>
  )
}