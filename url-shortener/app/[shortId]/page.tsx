// app/[shortId]/page.tsx
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

interface PageProps {
  params: {
    shortId: string;
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortId } = params;

  try {
    // Use the database function to atomically increment click count
    const { data, error } = await supabaseAdmin.rpc('increment_click_count', {
      link_short_id: shortId,
    });

    if (error || !data || data.length === 0) {
      // Link not found, redirect to 404
      redirect('/not-found');
    }

    const originalUrl = data[0].original_url;

    // Validate URL before redirecting
    if (!originalUrl || typeof originalUrl !== 'string') {
      redirect('/not-found');
    }

    // Perform redirect
    redirect(originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    redirect('/not-found');
  }
}

// Enable dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
