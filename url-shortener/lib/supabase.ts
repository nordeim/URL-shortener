// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side operations with elevated privileges
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

// Database types
export interface Link {
  id: number;
  created_at: string;
  original_url: string;
  short_id: string;
  click_count: number;
  custom_alias: boolean;
  last_accessed: string | null;
  metadata: Record<string, unknown>;
}

export interface AnalyticsSummary {
  total_links: number;
  total_clicks: number;
  avg_clicks_per_link: number;
}
