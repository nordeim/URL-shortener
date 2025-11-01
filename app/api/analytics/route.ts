import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { API, HTTP_STATUS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient(true) // Use service role for admin operations

    // Get total counts
    const [totalLinksResult, totalClicksResult] = await Promise.all([
      supabase
        .from('links')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('links')
        .select('click_count', { count: 'exact' })
        .then(({ data, error }) => {
          if (error) throw error
          const totalClicks = data?.reduce((sum, link) => sum + link.click_count, 0) || 0
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

      const dayClicks = recentLinks?.filter(link => {
        if (!link.last_accessed) return false
        const linkDate = new Date(link.last_accessed)
        return linkDate >= date && linkDate < nextDay
      }).reduce((sum, link) => sum + link.click_count, 0) || 0

      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        count: dayClicks,
      }
    }).reverse() // Reverse to show oldest to newest

    // If no recent data, create empty dataset for last 7 days
    if (clicksLast7Days.every(day => day.count === 0)) {
      const emptyClicksLast7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        date.setHours(0, 0, 0, 0)
        
        return {
          date: date.toISOString().split('T')[0],
          count: 0,
        }
      })
      
      clicksLast7Days.splice(0, clicksLast7Days.length, ...emptyClicksLast7Days)
    }

    // Prepare response data
    const analyticsData = {
      totalLinks,
      totalClicks,
      top5: (topLinks || []).map(link => ({
        short_id: link.short_id,
        original_url: link.original_url,
        click_count: link.click_count,
        created_at: link.created_at,
      })),
      clicksLast7Days,
    }

    return NextResponse.json(analyticsData, {
      status: HTTP_STATUS.OK,
      headers: {
        'Cache-Control': 'no-store', // Don't cache analytics data
      },
    })

  } catch (error) {
    console.error('Analytics API error:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        code: API.ERROR,
        totalLinks: 0,
        totalClicks: 0,
        top5: [],
        clicksLast7Days: Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          date.setHours(0, 0, 0, 0)
          
          return {
            date: date.toISOString().split('T')[0],
            count: 0,
          }
        }),
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use GET method to fetch analytics',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use GET method to fetch analytics',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use GET method to fetch analytics',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}