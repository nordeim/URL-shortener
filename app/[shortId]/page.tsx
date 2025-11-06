import { notFound } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { sanitizeUrl } from '@/lib/utils'

interface PageProps {
  params: {
    shortId: string
  }
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortId } = params

  // Validate shortId format
  if (!shortId || shortId.length < 4 || shortId.length > 10) {
    notFound()
  }

  try {
    const supabase = getSupabaseClient(true) // Use service role for admin operations

    // Fetch the link
    const { data, error } = await supabase
      .from('links')
      .select('original_url, click_count')
      .eq('short_id', shortId)
      .single()

    if (error || !data) {
      console.error('Link not found:', shortId, error)
      notFound()
    }

    // Sanitize and validate the original URL  
    const linkData = data as { original_url: string; click_count: number }
    let originalUrl: string
    try {
      originalUrl = sanitizeUrl(linkData.original_url)
    } catch (error) {
      console.error('Invalid URL in database:', linkData.original_url, error)
      notFound()
    }

    // Redirect to the original URL
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
          <p className="text-sm text-muted-foreground mt-2">
            If you are not redirected automatically,{' '}
            <a 
              href={originalUrl} 
              className="text-primary hover:underline"
            >
              click here
            </a>
          </p>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                window.location.href = ${JSON.stringify(originalUrl)};
              }, 100);
            `,
          }}
        />
      </div>
    )
  } catch (error) {
    console.error('Error processing redirect:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { shortId } = params

  try {
    const supabase = getSupabaseClient(true)
    
    const { data } = await supabase
      .from('links')
      .select('original_url, created_at')
      .eq('short_id', shortId)
      .single()

    if (!data) {
      return {
        title: 'Link Not Found',
        description: 'This short link does not exist or has been removed.',
      }
    }

    const linkData = data as { original_url: string; created_at: string }
    return {
      title: `Redirecting to ${new URL(linkData.original_url).hostname}`,
      description: `You are being redirected to ${linkData.original_url}`,
      robots: {
        index: false,
        follow: false,
      },
    }
  } catch {
    return {
      title: 'Link Not Found',
      description: 'This short link does not exist or has been removed.',
    }
  }
}