// app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ERROR_MESSAGES, LINKS_PER_PAGE } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(
      searchParams.get('limit') || LINKS_PER_PAGE.toString(),
      10
    );
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate sort parameters
    const allowedSortFields = [
      'created_at',
      'click_count',
      'last_accessed',
      'short_id',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder: 'asc' | 'desc' =
      sortOrder === 'asc' ? 'asc' : 'desc';

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from('links')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    // Get paginated links
    const { data: links, error: linksError } = await supabaseAdmin
      .from('links')
      .select('*')
      .order(validSortBy, { ascending: validSortOrder === 'asc' })
      .range(from, to);

    if (linksError) {
      console.error('Links query error:', linksError);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      links: links || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Links API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
