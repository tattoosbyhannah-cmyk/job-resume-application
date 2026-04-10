import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import FormField from '../../components/FormField'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { saveProfile } from '../../lib/firestore'

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  portfolioUrl: '',
  currentCompany: '',
  workAuth: true,
  needsSponsorship: false,
}

export default function Step2Profile() {
  const { user } = useAuth()
  const { profile, reload } = useProfile()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) setForm({ ...EMPTY, ...profile })
    else if (user?.email) setForm((f) => ({ ...f, email: user.email }))
  }, [profile, user])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave(goNext = true) {
    setError('')
    setBusy(true)
    try {
      await saveProfile(user.uid, form)
      await reload()
      if (goNext) navigate('/wizard/experience')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <StepNav current="profile" />
      <h1>Your profile</h1>
      <p className="meta">This is the contact info that goes at the top of every resume and cover letter.</p>

      <div className="card">
        <div className="field-row">
          <FormField id="firstName" label="First name" value={form.firstName} onChange={(v) => update('firstName', v)} required />
          <FormField id="lastName" label="Last name" value={form.lastName} onChange={(v) => update('lastName', v)} required />
        </div>
        <div className="field-row">
          <FormField id="email" label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required />
          <FormField id="phone" label="Phone" value={form.phone} onChange={(v) => update('phone', v)} placeholder="555-123-4567" required />
        </div>
        <FormField
          id="location"
          label="Location (City, State)"
          value={form.location}
          onChange={(v) => update('location', v)}
          placeholder="Walnut Creek, CA"
          required
        />
        <FormField id="currentCompany" label="Current company" value={form.currentCompany} onChange={(v) => update('currentCompany', v)} />
        <FormField id="linkedinUrl" label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => update('linkedinUrl', v)} placeholder="https://linkedin.com/in/your-handle" />
        <FormField id="portfolioUrl" label="Portfolio / personal website" value={form.portfolioUrl} onChange={(v) => update('portfolioUrl', v)} placeholder="https://yoursite.com" />

        <div className="field">
          <label>Are you legally authorized to work in the US?</label>
          <select className="input" value={form.workAuth ? 'yes' : 'no'} onChange={(e) => update('workAuth', e.target.value === 'yes')}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="field">
          <label>Will you now or in the future require sponsorship for an employment visa?</label>
          <select className="input" value={form.needsSponsorship ? 'yes' : 'no'} onChange={(e) => update('needsSponsorship', e.target.value === 'yes')}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}
      </div>

      <div className="wizard-actions">
        <Link to="/wizard/welcome" className="btn secondary">← Back</Link>
        <button onClick={() => handleSave(true)} className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue →'}
        </button>
      </div>
    </>
  )
}
