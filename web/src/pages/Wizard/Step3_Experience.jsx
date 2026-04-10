import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import ExperienceEntry from '../../components/ExperienceEntry'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from '../../lib/firestore'

export default function Step3Experience() {
  const { user } = useAuth()
  const { experience, reload } = useProfile()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [drafts, setDrafts] = useState({})

  function getEntry(e) {
    return drafts[e.id] || e
  }

  function setEntry(e, next) {
    setDrafts((d) => ({ ...d, [e.id]: next }))
  }

  async function handleAddNew() {
    setBusy(true)
    try {
      await addExperience(user.uid, {
        title: '',
        company: '',
        city: '',
        startDate: '',
        endDate: '',
        bullets: [''],
        order: experience.length,
      })
      await reload()
    } finally {
      setBusy(false)
    }
  }

  async function handleSaveAll(goNext = true) {
    setBusy(true)
    try {
      await Promise.all(
        Object.entries(drafts).map(([id, entry]) => updateExperience(user.uid, id, entry))
      )
      await reload()
      setDrafts({})
      if (goNext) navigate('/wizard/education')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(id) {
    if (!confirm('Remove this position?')) return
    setBusy(true)
    try {
      await deleteExperience(user.uid, id)
      await reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <StepNav current="experience" />
      <h1>Work experience</h1>
      <p className="meta">Add each position you want on your resume. Most recent first works best.</p>

      {experience.length === 0 && (
        <div className="card">
          <p>No experience yet. Add your first position to get started.</p>
        </div>
      )}

      {experience.map((e) => (
        <ExperienceEntry
          key={e.id}
          entry={getEntry(e)}
          onChange={(next) => setEntry(e, next)}
          onRemove={() => handleRemove(e.id)}
        />
      ))}

      <button type="button" className="btn secondary" onClick={handleAddNew} disabled={busy}>
        + Add a position
      </button>

      <div className="wizard-actions">
        <Link to="/wizard/profile" className="btn secondary">← Back</Link>
        <button onClick={() => handleSaveAll(true)} className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue →'}
        </button>
      </div>
    </>
  )
}
