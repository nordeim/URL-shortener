// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id: number
          created_at: string
          original_url: string
          short_id: string
          click_count: number
          custom_alias: boolean
          last_accessed: string | null
          metadata: Record<string, any>
        }
        Insert: {
          id?: number
          created_at?: string
          original_url: string
          short_id: string
          click_count?: number
          custom_alias?: boolean
          last_accessed?: string | null
          metadata?: Record<string, any>
        }
        Update: {
          id?: number
          created_at?: string
          original_url?: string
          short_id?: string
          click_count?: number
          custom_alias?: boolean
          last_accessed?: string | null
          metadata?: Record<string, any>
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}