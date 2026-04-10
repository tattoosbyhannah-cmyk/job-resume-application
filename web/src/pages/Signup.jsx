import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupWithEmail, loginWithGoogle } from '../lib/auth'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function handleEmailSignup(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signupWithEmail(email, password)
      navigate('/wizard')
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      await loginWithGoogle()
      navigate('/wizard')
    } catch (err) {
      setError(err.message || 'Google sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container" style={{ maxWidth: 440 }}>
      <h1>Create your account</h1>
      <p className="meta">It takes about 30 seconds.</p>

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

        <form onSubmit={handleEmailSignup}>
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
              minLength={6}
              autoComplete="new-password"
            />
            <div className="help">At least 6 characters.</div>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="meta" style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </main>
  )
}
