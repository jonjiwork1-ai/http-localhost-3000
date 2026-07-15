import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 자격증명이 유효한 경우에만 클라이언트를 생성하고, 그렇지 않으면 null을 내보내 개발 중 앱 충돌을 방지합니다.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase URL or Anon Key is missing. Check your .env.local configuration.'
    );
  }
}
