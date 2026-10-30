import { Link } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import BookmarkletInstallCard from '../../components/BookmarkletInstallCard'
import { useProfile } from '../../contexts/ProfileContext'
import {
  buildLeverBookmarklet,
  buildGreenhouseBookmarklet,
} from '../../lib/bookmarklet-builder'

export default function Step8Bookmarklets() {
  const { profile, loading } = useProfile()

  if (loading) return <div className="page-loader">Loading…</div>

  if (!profile) {
    return (
      <>
        <StepNav current="bookmarklets" />
        <div className="card">
          <p>You need a profile first. <Link to="/wizard/profile">Go set it up.</Link></p>
        </div>
      </>
    )
  }

  const leverUrl = buildLeverBookmarklet(profile)
  const greenhouseUrl = buildGreenhouseBookmarklet(profile)

  return (
    <>
      <StepNav current="bookmarklets" />
      <h1>Install your bookmarklets</h1>
      <p className="meta">
        These two browser shortcuts auto-fill your name, email, phone, location,
        links (LinkedIn, portfolio, GitHub), and work-authorization answers on Lever
        and Greenhouse application pages. They do NOT click submit — you'll always
        have a chance to review.
      </p>

      <BookmarkletInstallCard
        name="Lever Auto-Fill"
        description="Use this on any jobs.lever.co/*/apply page."
        url={leverUrl}
      />

      <BookmarkletInstallCard
        name="Greenhouse Auto-Fill"
        description="Use this on any boards.greenhouse.io application page."
        url={greenhouseUrl}
      />

      <div className="card">
        <h2>Test it</h2>
        <p>
          Open a real Lever job page and click your new bookmarklet. You should see
          the form fill instantly with your info. Then review, fix anything that needs
          adjusting, and submit.
        </p>
        <p>
          Example Lever page to test on:{' '}
          <a href="https://jobs.lever.co/jobgether" target="_blank" rel="noreferrer">
            jobs.lever.co/jobgether
          </a>
        </p>
      </div>

      <div className="wizard-actions">
        <Link to="/wizard/generate" className="btn secondary">← Back</Link>
        <Link to="/dashboard" className="btn">Done — go to dashboard</Link>
      </div>
    </>
  )
}
