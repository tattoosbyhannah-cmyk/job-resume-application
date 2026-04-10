import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import { logout } from '../lib/auth'

export default function Dashboard() {
  const { user } = useAuth()
  const { profile, experience, education, roleTemplates, companies, loading } = useProfile()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  if (loading) return <div className="page-loader">Loading your dashboard…</div>

  const setupComplete = profile && experience.length && education.length && roleTemplates.length

  return (
    <>
      <header className="app-header">
        <div className="brand">Job Toolkit</div>
        <div>
          <span className="meta" style={{ marginRight: 12 }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn secondary">Sign out</button>
        </div>
      </header>

      <main className="container">
        <h1>Your dashboard</h1>

        {!setupComplete && (
          <div className="card">
            <h2>Welcome — let's set you up</h2>
            <p>
              You haven't finished the setup wizard yet. The wizard takes about 15 minutes
              and walks you through your profile, experience, education, and cover letter
              templates.
            </p>
            <Link to="/wizard" className="btn">Start the wizard</Link>
          </div>
        )}

        {setupComplete && (
          <>
            <div className="card">
              <h2>Profile</h2>
              <p>{profile.firstName} {profile.lastName} · {profile.email}</p>
              <p className="meta">{profile.location}</p>
              <Link to="/wizard/profile" className="btn secondary">Edit profile</Link>
            </div>

            <div className="card">
              <h2>Target roles ({roleTemplates.length})</h2>
              <ul className="list-clean">
                {roleTemplates.map((r) => (
                  <li key={r.key}>
                    <strong>{r.displayName}</strong>
                    <div className="meta">
                      {companies.filter((c) => c.roleKey === r.key).length} companies
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/wizard/role-templates" className="btn secondary">Edit roles</Link>
            </div>

            <div className="card">
              <h2>Generate documents</h2>
              <p>Generate tailored .docx files for each company you're targeting.</p>
              <Link to="/wizard/generate" className="btn">Open document generator</Link>
            </div>

            <div className="card">
              <h2>Bookmarklets</h2>
              <p>Install your personalized Lever and Greenhouse autofill bookmarklets.</p>
              <Link to="/wizard/bookmarklets" className="btn">Install bookmarklets</Link>
            </div>
          </>
        )}
      </main>
    </>
  )
}
