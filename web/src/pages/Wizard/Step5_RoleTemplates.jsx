import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import CoverLetterTemplateEditor from '../../components/CoverLetterTemplateEditor'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { saveRoleTemplate, deleteRoleTemplate } from '../../lib/firestore'

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function Step5RoleTemplates() {
  const { user } = useAuth()
  const { roleTemplates, reload } = useProfile()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [drafts, setDrafts] = useState({})

  function getTemplate(t) {
    return drafts[t.key] || t
  }

  function setTemplate(t, next) {
    setDrafts((d) => ({ ...d, [t.key]: next }))
  }

  async function handleAddNew() {
    setBusy(true)
    try {
      const baseKey = `role-${roleTemplates.length + 1}`
      await saveRoleTemplate(user.uid, baseKey, {
        displayName: 'New role',
        professionalSummary: '',
        highlights: ['', '', '', '', ''],
        coverLetterParagraphs: [
          'I am writing to express my interest in the {{role}} position at {{company}}.',
          '',
          '',
          '',
        ],
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
        Object.entries(drafts).map(([key, t]) => {
          // If displayName changed, write under a new slug AND delete the old key.
          const newKey = slugify(t.displayName) || key
          const writes = [saveRoleTemplate(user.uid, newKey, t)]
          if (newKey !== key) writes.push(deleteRoleTemplate(user.uid, key))
          return Promise.all(writes)
        })
      )
      await reload()
      setDrafts({})
      if (goNext) navigate('/wizard/companies')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(key) {
    if (!confirm('Delete this role template?')) return
    setBusy(true)
    try {
      await deleteRoleTemplate(user.uid, key)
      await reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <StepNav current="role-templates" />
      <h1>Target roles</h1>
      <p className="meta">
        For each kind of role you're applying to (e.g. "Marketing Director"), write a
        cover letter template once. The app will substitute company-specific names at
        generation time using <code>{'{{company}}'}</code> and <code>{'{{role}}'}</code> placeholders.
      </p>

      {roleTemplates.length === 0 && (
        <div className="card">
          <p>No role templates yet. Add your first one to get started.</p>
        </div>
      )}

      {roleTemplates.map((t) => (
        <CoverLetterTemplateEditor
          key={t.key}
          template={getTemplate(t)}
          onChange={(next) => setTemplate(t, next)}
          onRemove={() => handleRemove(t.key)}
        />
      ))}

      <button type="button" className="btn secondary" onClick={handleAddNew} disabled={busy}>
        + Add a role template
      </button>

      <div className="wizard-actions">
        <Link to="/wizard/education" className="btn secondary">← Back</Link>
        <button onClick={() => handleSaveAll(true)} className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue →'}
        </button>
      </div>
    </>
  )
}
