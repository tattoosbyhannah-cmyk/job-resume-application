// Provides the current Firebase Auth user to the entire app via React
// context. Components call useAuth() to read the user (or null) and the
// loading state.

import { createContext, useContext, useEffect, useState } from 'react'
import { watchAuth } from '../lib/auth'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAuth((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
