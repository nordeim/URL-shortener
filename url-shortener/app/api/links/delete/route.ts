// app/api/links/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortId = searchParams.get('shortId');

    if (!shortId) {
      return NextResponse.json(
        { error: 'shortId parameter is required' },
        { status: 400 }
      );
    }

    // Delete the link
    const { error } = await supabaseAdmin
      .from('links')
      .delete()
      .eq('short_id', shortId);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: SUCCESS_MESSAGES.LINK_DELETED,
      shortId,
    });
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
