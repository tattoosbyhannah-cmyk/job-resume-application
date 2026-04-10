import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import FormField from '../../components/FormField'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { addCompany, updateCompany, deleteCompany } from '../../lib/firestore'

export default function Step6Companies() {
  const { user } = useAuth()
  const { roleTemplates, companies, reload } = useProfile()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [drafts, setDrafts] = useState({})

  function getCompany(c) {
    return drafts[c.id] || c
  }

  function setCompanyDraft(c, next) {
    setDrafts((d) => ({ ...d, [c.id]: next }))
  }

  async function handleAddNew(roleKey) {
    setBusy(true)
    try {
      await addCompany(user.uid, {
        roleKey,
        companyName: '',
        jobTitle: '',
        hiringManager: 'Hiring Manager',
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
        Object.entries(drafts).map(([id, c]) => updateCompany(user.uid, id, c))
      )
      await reload()
      setDrafts({})
      if (goNext) navigate('/wizard/generate')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove(id) {
    if (!confirm('Remove this company?')) return
    setBusy(true)
    try {
      await deleteCompany(user.uid, id)
      await reload()
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <StepNav current="companies" />
      <h1>Target companies</h1>
      <p className="meta">
        Add the specific companies you're applying to under each role. We'll generate
        one tailored .docx per company in the next step.
      </p>

      {roleTemplates.length === 0 && (
        <div className="card">
          <p>You don't have any role templates yet. <Link to="/wizard/role-templates">Add a role first</Link>.</p>
        </div>
      )}

      {roleTemplates.map((role) => {
        const list = companies.filter((c) => c.roleKey === role.key)
        return (
          <div key={role.key} className="card">
            <h2>{role.displayName}</h2>
            {list.length === 0 && <p className="meta">No companies yet for this role.</p>}
            {list.map((c) => {
              const draft = getCompany(c)
              return (
                <div key={c.id} style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
                  <FormField id={`co-${c.id}`} label="Company name" value={draft.companyName} onChange={(v) => setCompanyDraft(c, { ...draft, companyName: v })} required />
                  <div className="field-row">
                    <FormField id={`title-${c.id}`} label="Exact job title (optional)" value={draft.jobTitle} onChange={(v) => setCompanyDraft(c, { ...draft, jobTitle: v })} />
                    <FormField id={`hm-${c.id}`} label="Hiring manager (optional)" value={draft.hiringManager} onChange={(v) => setCompanyDraft(c, { ...draft, hiringManager: v })} />
                  </div>
                  <button type="button" className="btn danger" onClick={() => handleRemove(c.id)}>Remove</button>
                </div>
              )
            })}
            <button type="button" className="btn secondary" style={{ marginTop: 12 }} onClick={() => handleAddNew(role.key)} disabled={busy}>
              + Add a company
            </button>
          </div>
        )
      })}

      <div className="wizard-actions">
        <Link to="/wizard/role-templates" className="btn secondary">← Back</Link>
        <button onClick={() => handleSaveAll(true)} className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save & continue →'}
        </button>
      </div>
    </>
  )
}
