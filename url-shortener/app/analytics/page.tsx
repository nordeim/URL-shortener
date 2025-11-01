// app/analytics/page.tsx
'use client';

import { useState } from 'react';
import { AnalyticsChart } from '@/components/analytics-chart';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-lg text-base-content/70 mt-2">
            Track your link performance and statistics
          </p>
        </div>
        <button onClick={handleRefresh} className="btn btn-primary">
          Refresh Data
        </button>
      </div>

      <AnalyticsChart refreshTrigger={refreshTrigger} />

      <div className="text-center">
        <Link href="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
