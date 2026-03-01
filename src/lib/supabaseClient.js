import { createClient } from '@supabase/supabase-js'

// Get credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check connection
export async function testConnection() {
    try {
        const { data, error } = await supabase.from('settings').select('*').limit(1)
        if (error) throw error
        console.log('✅ Supabase connected successfully!')
        return true
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message)
        return false
    }
}
