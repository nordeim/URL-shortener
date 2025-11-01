'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnalyticsChart } from '@/components/analytics-chart'
import { formatDate } from '@/lib/utils'
import { Loader2, RefreshCw, TrendingUp, Link, MousePointer, Calendar } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

export default function AnalyticsPage() {
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
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data)
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
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Analytics</h1>
          <p className="text-muted-foreground mb-6">
            Unable to load analytics data. Please try again.
          </p>
          <Button onClick={() => fetchAnalytics()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="mb-8">
        <AnalyticsChart
          clicksLast7Days={analytics.clicksLast7Days}
          topLinks={analytics.top5}
          totalClicks={analytics.totalClicks}
          totalLinks={analytics.totalLinks}
        />
      </div>

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
        <Card className="mt-6">
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