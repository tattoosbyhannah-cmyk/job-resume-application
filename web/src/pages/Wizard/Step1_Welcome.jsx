import { Link } from 'react-router-dom'
import StepNav from '../../components/StepNav'

export default function Step1Welcome() {
  return (
    <>
      <StepNav current="welcome" />
      <h1>Welcome to the wizard</h1>
      <div className="card">
        <p>
          This wizard takes about 15 minutes and gathers the information needed to
          generate tailored cover letters and resumes for every job you apply to.
          You'll only need to do this once.
        </p>
        <h2>What you'll need</h2>
        <ul>
          <li>Your contact info (name, email, phone, location)</li>
          <li>LinkedIn, portfolio, and GitHub URLs (optional)</li>
          <li>A list of your past jobs with bullet points for each</li>
          <li>Education and certifications</li>
          <li>For each role you're targeting (e.g. "Marketing Director"), a cover letter template you write once and re-use across companies</li>
        </ul>
        <p className="meta">
          Your data is saved automatically as you go and lives only under your account.
          Nobody else can see it.
        </p>
      </div>
      <div className="wizard-actions">
        <Link to="/dashboard" className="btn secondary">Cancel</Link>
        <Link to="/wizard/profile" className="btn">Start →</Link>
      </div>
    </>
  )
}
