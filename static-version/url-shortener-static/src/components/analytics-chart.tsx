'use client'

import { useMemo } from 'react'
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
import { CHART } from '@/lib/constants'

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

interface ClickData {
  date: string
  count: number
}

interface TopLink {
  short_id: string
  original_url: string
  click_count: number
}

interface AnalyticsChartProps {
  clicksLast7Days: ClickData[]
  topLinks: TopLink[]
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
  const lineChartData = useMemo(() => {
    const labels = clicksLast7Days.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    )
    const data = clicksLast7Days.map(item => item.count)

    return {
      labels,
      datasets: [
        {
          label: 'Clicks',
          data,
          borderColor: CHART.COLORS[0],
          backgroundColor: `${CHART.COLORS[0]}20`,
          tension: 0.4,
          fill: true,
        },
      ],
    }
  }, [clicksLast7Days])

  // Doughnut chart data for link distribution
  const doughnutChartData = useMemo(() => {
    const activeLinks = topLinks.filter(link => link.click_count > 0).length
    const inactiveLinks = Math.max(0, totalLinks - activeLinks)

    return {
      labels: ['Active Links', 'Inactive Links'],
      datasets: [
        {
          data: [activeLinks, inactiveLinks],
          backgroundColor: [CHART.COLORS[0], CHART.COLORS[1]],
          borderWidth: 0,
        },
      ],
    }
  }, [topLinks, totalLinks])

  // Bar chart data for top links
  const barChartData = useMemo(() => {
    const top5Links = topLinks.slice(0, 5)
    const labels = top5Links.map(link => 
      link.short_id.length > 8 
        ? `${link.short_id.slice(0, 8)}...` 
        : link.short_id
    )
    const data = top5Links.map(link => link.click_count)

    return {
      labels,
      datasets: [
        {
          label: 'Clicks',
          data,
          backgroundColor: CHART.COLORS.slice(0, data.length),
          borderRadius: 4,
        },
      ],
    }
  }, [topLinks])

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
                  style={{ backgroundColor: CHART.COLORS[index] }}
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