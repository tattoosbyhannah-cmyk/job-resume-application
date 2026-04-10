import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  return (
    <>
      <header className="app-header">
        <div className="brand">Job Toolkit</div>
        <div>
          {user ? (
            <Link to="/dashboard" className="btn">My dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn secondary" style={{ marginRight: 8 }}>
                Sign in
              </Link>
              <Link to="/signup" className="btn">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="container">
        <h1>Apply to jobs at scale, without losing the personal touch.</h1>
        <p className="meta">
          Generate tailored resume + cover letter <code>.docx</code> files for every
          company you target, and install browser bookmarklets that auto-fill your info
          on Lever and Greenhouse application pages.
        </p>

        <div className="card">
          <h2>How it works</h2>
          <ol>
            <li><strong>Sign up</strong> for a free account.</li>
            <li>
              <strong>Walk through the wizard</strong> — your contact info, work
              experience, education, and a cover letter template for each role you
              target.
            </li>
            <li>
              <strong>Generate documents</strong> — one tailored .docx per company,
              built in your browser and downloaded directly to your computer.
            </li>
            <li>
              <strong>Install the bookmarklets</strong> — drag two links to your
              bookmarks bar and your info auto-fills on Lever and Greenhouse forms.
            </li>
          </ol>
          <p>
            Your data lives only under your own account. Nobody else can see it.
          </p>
          <Link to="/signup" className="btn">Get started</Link>
        </div>

        <div className="card">
          <h2>Built for serious applicants</h2>
          <p className="meta">
            This tool was built by a job seeker who applied to 23+ roles in a single day
            and got tired of retyping the same info into 23 different forms. It's free,
            it's open source, and it works.
          </p>
        </div>
      </main>
    </>
  )
}
