import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'
import { API, HTTP_STATUS } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50 per page
    const offset = (page - 1) * limit

    const supabase = getSupabaseClient(true) // Use service role for admin operations

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error getting total count:', countError)
      return NextResponse.json(
        {
          error: 'Failed to fetch links count',
          code: API.ERROR,
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }

    // Get links with pagination
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id, created_at, original_url, short_id, click_count, custom_alias, last_accessed')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (linksError) {
      console.error('Error fetching links:', linksError)
      return NextResponse.json(
        {
          error: 'Failed to fetch links',
          code: API.ERROR,
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }

    // Calculate pagination info
    const totalPages = Math.ceil((totalCount || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    const responseData = {
      links: links || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    }

    return NextResponse.json(responseData, {
      status: HTTP_STATUS.OK,
      headers: {
        'Cache-Control': 'no-store', // Don't cache to ensure fresh data
      },
    })

  } catch (error) {
    console.error('Links API error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: API.ERROR,
        links: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
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
      message: 'Use GET method to fetch links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use GET method to fetch links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use GET method to fetch links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}