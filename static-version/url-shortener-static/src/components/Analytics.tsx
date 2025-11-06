import { useState, useEffect } from 'react'
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
import { Loader2, RefreshCw, TrendingUp, Link, MousePointer, Calendar } from 'lucide-react'
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
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        tension: 0.4,
        fill: true,
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
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 0,
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
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
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
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
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
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Clicks Over Time */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Clicks Over Time</h3>
        <div className="h-64">
          {clicksLast7Days.length > 0 ? (
            <Line data={lineChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No click data available
            </div>
          )}
        </div>
      </div>

      {/* Link Distribution */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Link Activity</h3>
        <div className="h-64">
          {totalLinks > 0 ? (
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No link data available
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Links */}
      {topLinks.length > 0 && (
        <div className="bg-card rounded-lg border p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Top Performing Links</h3>
          <div className="h-64">
            <Bar data={barChartData} options={barOptions} />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {topLinks.slice(0, 5).map((link, index) => (
              <div key={link.short_id} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] }}
                />
                <span className="font-mono text-xs truncate">
                  {link.short_id}
                </span>
                <span className="text-muted-foreground">
                  ({link.click_count} clicks)
                </span>
              </div>
            ))}
          </div>
        </div>
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
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading analytics...</span>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Analytics</h1>
        <p className="text-muted-foreground mb-6">
          Unable to load analytics data. Please try again.
        </p>
        <Button onClick={() => fetchAnalytics()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your link performance and click analytics
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLinks}</div>
            <p className="text-xs text-muted-foreground">
              Active shortened URLs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              All-time link clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Clicks/Link</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalLinks > 0 
                ? (analytics.totalClicks / analytics.totalLinks).toFixed(1)
                : '0'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Clicks per created link
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AnalyticsChart
        clicksLast7Days={analytics.clicksLast7Days}
        topLinks={analytics.top5}
        totalClicks={analytics.totalClicks}
        totalLinks={analytics.totalLinks}
      />

      {/* Top Links Table */}
      {analytics.top5.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>
              Your most clicked short links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.top5.map((link, index) => (
                <div
                  key={link.short_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                        {link.short_id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {link.original_url}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(link.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {link.click_count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      clicks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {analytics.totalLinks === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">
              Create some links to see your analytics data here.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Create Your First Link
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Summary */}
      {analytics.clicksLast7Days.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Click activity over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {analytics.clicksLast7Days.map((day) => (
                <div
                  key={day.date}
                  className="text-center p-3 border rounded-lg"
                >
                  <div className="text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short' 
                    })}
                  </div>
                  <div className="text-lg font-semibold">
                    {day.count}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    clicks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}