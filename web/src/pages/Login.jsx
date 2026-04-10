import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithEmail, loginWithGoogle } from '../lib/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleEmailLogin(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await loginWithEmail(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Google sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container" style={{ maxWidth: 440 }}>
      <h1>Sign in</h1>
      <div className="card">
        <button
          type="button"
          className="btn secondary"
          onClick={handleGoogle}
          disabled={busy}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', margin: '12px 0', color: 'var(--text-meta)' }}>
          or
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="meta" style={{ textAlign: 'center' }}>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </main>
  )
}
