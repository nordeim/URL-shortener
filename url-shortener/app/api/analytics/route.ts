// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ERROR_MESSAGES, TOP_LINKS_COUNT, ANALYTICS_DAYS } from '@/lib/constants';

export async function GET() {
  try {
    // Get total links and clicks
    const { data: summary, error: summaryError } = await supabaseAdmin
      .rpc('get_analytics_summary');

    if (summaryError) {
      console.error('Analytics summary error:', summaryError);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    // Get top 5 most clicked links
    const { data: topLinks, error: topLinksError } = await supabaseAdmin
      .from('links')
      .select('short_id, original_url, click_count, created_at')
      .order('click_count', { ascending: false })
      .limit(TOP_LINKS_COUNT);

    if (topLinksError) {
      console.error('Top links error:', topLinksError);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    // Get clicks per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - ANALYTICS_DAYS);

    const { data: recentLinks, error: recentLinksError } = await supabaseAdmin
      .from('links')
      .select('created_at, click_count')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (recentLinksError) {
      console.error('Recent links error:', recentLinksError);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    // Aggregate clicks by day
    const clicksByDay: Record<string, number> = {};
    for (let i = 0; i < ANALYTICS_DAYS; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      clicksByDay[dateKey] = 0;
    }

    recentLinks?.forEach((link) => {
      const dateKey = link.created_at.split('T')[0];
      if (clicksByDay[dateKey] !== undefined) {
        clicksByDay[dateKey] += link.click_count;
      }
    });

    const clicksLast7Days = Object.entries(clicksByDay)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, clicks]) => ({ date, clicks }));

    // Calculate additional metrics
    const totalLinks = summary?.[0]?.total_links || 0;
    const totalClicks = summary?.[0]?.total_clicks || 0;
    const avgClicksPerLink = summary?.[0]?.avg_clicks_per_link || 0;

    return NextResponse.json({
      totalLinks,
      totalClicks,
      avgClicksPerLink: parseFloat(avgClicksPerLink.toFixed(2)),
      topLinks: topLinks || [],
      clicksLast7Days,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
