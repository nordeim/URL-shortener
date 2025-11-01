import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ipRateLimit, createRateLimitResponse } from '@/lib/rateLimiter'
import { generateSecureId, isValidUrl, normalizeUrl, sanitizeUrl, buildShortUrl } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase'
import { API, HTTP_STATUS, RATE_LIMIT } from '@/lib/constants'
import QRCode from 'qrcode'

// Validation schema
const shortenRequestSchema = z.object({
  url: z.string().min(1, 'URL is required').refine(isValidUrl, 'Please enter a valid URL'),
  customAlias: z.string().optional().refine(
    (alias) => !alias || /^[a-zA-Z0-9]{4,10}$/.test(alias),
    'Custom alias must be 4-10 characters, alphanumeric only'
  ),
})

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitResult = ipRateLimit(request, RATE_LIMIT.DEFAULT_REQUESTS_PER_MINUTE)
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult)
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = shortenRequestSchema.parse(body)

    // Sanitize and normalize the URL
    const sanitizedUrl = sanitizeUrl(normalizeUrl(validatedData.url))

    // Get Supabase client
    const supabase = getSupabaseClient(true) // Use service role for admin operations

    // Generate short ID
    let shortId: string
    let customAlias = false

    if (validatedData.customAlias) {
      shortId = validatedData.customAlias.toLowerCase()
      customAlias = true

      // Check if custom alias already exists
      const { data: existingLink } = await supabase
        .from('links')
        .select('short_id')
        .eq('short_id', shortId)
        .single()

      if (existingLink) {
        return NextResponse.json(
          {
            error: 'Custom alias already exists',
            code: API.CONFLICT,
          },
          { status: HTTP_STATUS.CONFLICT }
        )
      }
    } else {
      // Generate random short ID
      let attempts = 0
      const maxAttempts = 10

      do {
        shortId = generateSecureId(6)
        customAlias = false

        const { data: existingLink } = await supabase
          .from('links')
          .select('short_id')
          .eq('short_id', shortId)
          .single()

        if (!existingLink) {
          break
        }

        attempts++
      } while (attempts < maxAttempts)

      if (attempts >= maxAttempts) {
        // Fallback to longer ID if all short ones are taken
        shortId = generateSecureId(8)
      }
    }

    // Insert the new link
    const { data: newLink, error: insertError } = await supabase
      .from('links')
      .insert({
        original_url: sanitizedUrl,
        short_id: shortId,
        custom_alias: customAlias,
        metadata: {
          created_at: new Date().toISOString(),
          user_agent: request.headers.get('user-agent') || '',
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        },
      })
      .select('id, created_at')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          error: 'Failed to create short link',
          code: API.ERROR,
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      )
    }

    // Generate QR code
    const shortUrl = buildShortUrl(shortId)
    let qrDataUrl: string | undefined

    try {
      qrDataUrl = await QRCode.toDataURL(shortUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
    } catch (qrError) {
      console.error('QR code generation failed:', qrError)
      // Don't fail the request if QR generation fails
    }

    // Return success response
    const response = NextResponse.json(
      {
        shortId,
        shortUrl,
        qrDataUrl,
        originalUrl: sanitizedUrl,
        customAlias,
        createdAt: newLink.created_at,
        message: 'URL shortened successfully',
      },
      { status: HTTP_STATUS.CREATED }
    )

    // Add rate limit headers
    const remaining = rateLimitResult.remaining
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(Date.now() + rateLimitResult.resetTime).toString())

    return response

  } catch (error) {
    console.error('Shorten API error:', error)

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

    // Handle database errors
    if (error && typeof error === 'object' && 'code' in error) {
      const dbError = error as { code: string; message: string }
      
      if (dbError.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          {
            error: 'Short ID already exists',
            code: API.CONFLICT,
          },
          { status: HTTP_STATUS.CONFLICT }
        )
      }
    }

    // Generic error response
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
      message: 'Use POST method to shorten URLs',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use POST method to shorten URLs',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      code: API.ERROR,
      message: 'Use POST method to shorten URLs',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  )
}