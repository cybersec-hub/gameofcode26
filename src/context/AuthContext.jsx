import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USER = { id: 'demo-user', email: 'demo@local', demo: true }
const DEMO_FLAG = 'tr_demo_session' // remembers a demo login across refreshes

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseConfigured) {
      // Demo mode: only "logged in" if a demo session was started.
      const active = localStorage.getItem(DEMO_FLAG) === '1'
      setUser(active ? DEMO_USER : null)
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signUp = (email, password) => supabase.auth.signUp({ email, password })

  // Start a demo session (used by the Auth page in demo mode).
  const enterDemo = () => {
    localStorage.setItem(DEMO_FLAG, '1')
    setUser(DEMO_USER)
  }

  // Works in BOTH modes: clears the session everywhere.
  const signOut = async () => {
    if (supabaseConfigured) await supabase.auth.signOut()
    localStorage.removeItem(DEMO_FLAG)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, enterDemo, demo: !supabaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)