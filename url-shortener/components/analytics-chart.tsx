// components/analytics-chart.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  totalLinks: number;
  totalClicks: number;
  avgClicksPerLink: number;
  topLinks: Array<{
    short_id: string;
    original_url: string;
    click_count: number;
  }>;
  clicksLast7Days: Array<{
    date: string;
    clicks: number;
  }>;
}

interface AnalyticsChartProps {
  refreshTrigger?: number;
}

export function AnalyticsChart({ refreshTrigger }: AnalyticsChartProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');

        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">Failed to load analytics data</p>
      </div>
    );
  }

  const topLinksChartData = {
    labels: data.topLinks.map((link) => link.short_id),
    datasets: [
      {
        label: 'Clicks',
        data: data.topLinks.map((link) => link.click_count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const clicksChartData = {
    labels: data.clicksLast7Days.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Clicks per Day',
        data: data.clicksLast7Days.map((item) => item.clicks),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Links</div>
          <div className="stat-value text-primary">{data.totalLinks}</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Clicks</div>
          <div className="stat-value text-secondary">{data.totalClicks}</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Avg Clicks per Link</div>
          <div className="stat-value text-accent">
            {data.avgClicksPerLink.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Top 5 Links</h3>
            <div className="h-64">
              {data.topLinks.length > 0 ? (
                <Bar data={topLinksChartData} options={chartOptions} />
              ) : (
                <p className="text-center text-base-content/70 pt-12">
                  No data available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Clicks Last 7 Days</h3>
            <div className="h-64">
              <Line data={clicksChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
