import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import EducationEntry from '../../components/EducationEntry'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import {
  addEducation,
  updateEducation,
  deleteEducation,
} from '../../lib/firestore'

export default function Step4Education() {
  const { user } = useAuth()
  const { education, reload } = useProfile()
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
      await addEducation(user.uid, {
        level: '',
        fieldOfStudy: '',
        school: '',
        city: '',
        startDate: '',
        endDate: '',
        order: education.length,
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
        Object.entries(drafts).map(([id, entry]) => updateEducation(user.uid, id, entry))
      )
      await reload()
      setDrafts({})
      if (goNext) navigate('/wizard/role-templates')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(id) {
    if (!confirm('Remove this entry?')) return
    setBusy(true)
    try {
      await deleteEducation(user.uid, id)
      await reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <StepNav current="education" />
      <h1>Education & Certifications</h1>
      <p className="meta">Degrees, certificates, training programs — anything that belongs on your resume.</p>

      {education.length === 0 && (
        <div className="card">
          <p>No education or certifications yet.</p>
        </div>
      )}

      {education.map((e) => (
        <EducationEntry
          key={e.id}
          entry={getEntry(e)}
          onChange={(next) => setEntry(e, next)}
          onRemove={() => handleRemove(e.id)}
        />
      ))}

      <button type="button" className="btn secondary" onClick={handleAddNew} disabled={busy}>
        + Add education or certification
      </button>

      <div className="wizard-actions">
        <Link to="/wizard/experience" className="btn secondary">← Back</Link>
        <button onClick={() => handleSaveAll(true)} className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue →'}
        </button>
      </div>
    </>
  )
}
