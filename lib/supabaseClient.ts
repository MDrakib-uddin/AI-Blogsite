import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface BlogPost {
  id: string
  user_id: string
  title: string
  slug: string
  content: string
  created_at: string
}

export interface User {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
} 