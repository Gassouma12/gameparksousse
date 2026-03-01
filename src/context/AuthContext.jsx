import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 [AUTH] Checking session...')
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log('✅ [AUTH] Active session found:', session.user.email)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0] || 'Admin',
        })
      } else {
        console.log('ℹ️ [AUTH] No active session')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 [AUTH] Auth state changed:', _event)
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0] || 'Admin',
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    console.log('🔑 [AUTH] Attempting login for:', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ [AUTH] Login failed:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ [AUTH] Login successful:', data.user.email)
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0] || 'Admin',
      })
      return { success: true }
    } catch (error) {
      console.error('❌ [AUTH] Login error:', error)
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const logout = async () => {
    console.log('🚪 [AUTH] Logging out...')
    await supabase.auth.signOut()
    setUser(null)
    console.log('✅ [AUTH] Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
