// app/api/shorten/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { urlSchema, generateShortId } from '@/lib/utils';
import { getRateLimiter } from '@/lib/rateLimiter';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimiter = getRateLimiter();

    // Check rate limit
    if (!rateLimiter.check(ip)) {
      const resetTime = rateLimiter.getResetTime(ip);
      return NextResponse.json(
        { error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, resetTime },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(
              Date.now() + resetTime
            ).toISOString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = urlSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { url, customAlias } = validation.data;

    // Generate or use custom short ID
    let shortId: string;
    let isCustom = false;

    if (customAlias) {
      // Check if custom alias is available
      const { data: existing } = await supabaseAdmin
        .from('links')
        .select('short_id')
        .eq('short_id', customAlias)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.ALIAS_EXISTS },
          { status: 409 }
        );
      }

      shortId = customAlias;
      isCustom = true;
    } else {
      // Generate random short ID
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        shortId = generateShortId();
        const { data: existing } = await supabaseAdmin
          .from('links')
          .select('short_id')
          .eq('short_id', shortId)
          .single();

        if (!existing) break;
        attempts++;
      }

      if (attempts === maxAttempts) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INTERNAL_ERROR },
          { status: 500 }
        );
      }
    }

    // Insert new link into database
    const { data, error } = await supabaseAdmin
      .from('links')
      .insert({
        original_url: url,
        short_id: shortId,
        custom_alias: isCustom,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: ERROR_MESSAGES.INTERNAL_ERROR },
        { status: 500 }
      );
    }

    // Generate short URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `https://${request.headers.get('host')}`;
    const shortUrl = `${baseUrl}/${shortId}`;

    // Generate QR code
    let qrDataUrl: string | undefined;
    try {
      qrDataUrl = await QRCode.toDataURL(shortUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
      // Continue without QR code
    }

    // Return success response
    return NextResponse.json(
      {
        message: SUCCESS_MESSAGES.LINK_CREATED,
        shortUrl,
        shortId,
        originalUrl: url,
        qrDataUrl,
        createdAt: data.created_at,
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimiter
            .getRemaining(ip)
            .toString(),
        },
      }
    );
  } catch (error) {
    console.error('Shorten API error:', error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
