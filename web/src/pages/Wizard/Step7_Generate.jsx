import { useState } from 'react'
import { Link } from 'react-router-dom'
import StepNav from '../../components/StepNav'
import { useProfile } from '../../contexts/ProfileContext'
import { downloadResumeDoc } from '../../lib/docx-generator'

export default function Step7Generate() {
  const { profile, experience, education, roleTemplates, companies, loading } = useProfile()
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  if (loading) return <div className="page-loader">Loading…</div>

  async function handleGenerate(company) {
    setError('')
    setBusyId(company.id)
    try {
      const role = roleTemplates.find((r) => r.key === company.roleKey)
      if (!role) throw new Error('Role template not found for this company.')
      await downloadResumeDoc({
        profile,
        experience,
        education,
        roleTemplate: role,
        company,
      })
    } catch (err) {
      setError(err.message || 'Generation failed')
    } finally {
      setBusyId(null)
    }
  }

  async function handleGenerateAll() {
    for (const c of companies) {
      // Sequential to avoid blob/file-saver race conditions
      // eslint-disable-next-line no-await-in-loop
      await handleGenerate(c)
    }
  }

  return (
    <>
      <StepNav current="generate" />
      <h1>Generate documents</h1>
      <p className="meta">
        Each click below builds a tailored cover letter + resume in a single .docx file
        and downloads it to your computer.
      </p>

      {!profile && (
        <div className="card">
          <p>You need a profile first. <Link to="/wizard/profile">Go set it up.</Link></p>
        </div>
      )}

      {companies.length === 0 && (
        <div className="card">
          <p>No companies yet. <Link to="/wizard/companies">Add some.</Link></p>
        </div>
      )}

      {companies.length > 0 && (
        <div className="card">
          <button className="btn" onClick={handleGenerateAll} disabled={busyId !== null}>
            Generate ALL ({companies.length} files)
          </button>
        </div>
      )}

      {roleTemplates.map((role) => {
        const list = companies.filter((c) => c.roleKey === role.key)
        if (list.length === 0) return null
        return (
          <div key={role.key} className="card">
            <h2>{role.displayName}</h2>
            <ul className="list-clean">
              {list.map((c) => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{c.companyName}</strong>
                    {c.jobTitle && <span className="meta"> · {c.jobTitle}</span>}
                  </div>
                  <button className="btn secondary" onClick={() => handleGenerate(c)} disabled={busyId === c.id}>
                    {busyId === c.id ? 'Generating…' : 'Download .docx'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {error && <div className="error">{error}</div>}

      <div className="wizard-actions">
        <Link to="/wizard/companies" className="btn secondary">← Back</Link>
        <Link to="/wizard/bookmarklets" className="btn">Continue →</Link>
      </div>
    </>
  )
}
