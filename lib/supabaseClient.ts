import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// No lanzar error durante el proceso de build, manejarlo de forma segura
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - Supabase will not be available');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
