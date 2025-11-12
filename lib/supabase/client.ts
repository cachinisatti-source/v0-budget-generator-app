'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey } from './config'

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Faltan variables de entorno de Supabase.')
  } else {
    console.log('✅ Supabase inicializado con URL:', supabaseUrl)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
