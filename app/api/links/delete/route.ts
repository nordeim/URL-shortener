import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseClient } from '@/lib/supabase'
import { API, HTTP_STATUS } from '@/lib/constants'

// Validation schema
const deleteLinkSchema = z.object({
  shortId: z.string().min(1, 'Short ID is required').max(10, 'Short ID too long'),
})

export async function DELETE(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = deleteLinkSchema.parse(body)

    // Get Supabase client
    const supabase = getSupabaseClient(true) // Use service role for admin operations

    // Check if link exists
    const { data: existingLink, error: selectError } = await supabase
      .from('links')
      .select('id, short_id')
      .eq('short_id', validatedData.shortId)
      .single()

    if (selectError) {
      if (selectError.code === 'PGRST116') {
        // No rows returned - link doesn't exist
        return NextResponse.json(
          {
            error: 'Link not found',
            code: API.NOT_FOUND,
          },
          { status: HTTP_STATUS.NOT_FOUND }
        )
      }
      console.error('Error checking link existence:', selectError)
      return NextResponse.json(
        {
          error: 'Failed to check link existence',
          code: API.ERROR,
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }

    // Delete the link
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .eq('id', (existingLink as any).id)

    if (deleteError) {
      console.error('Error deleting link:', deleteError)
      return NextResponse.json(
        {
          error: 'Failed to delete link',
          code: API.ERROR,
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }

    return NextResponse.json(
      {
        message: 'Link deleted successfully',
        deletedShortId: validatedData.shortId,
      },
      { status: HTTP_STATUS.OK }
    )

  } catch (error) {
    console.error('Delete link API error:', error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
          code: API.VALIDATION_ERROR,
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: API.ERROR,
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use DELETE method to remove links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use DELETE method to remove links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use DELETE method to remove links',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}