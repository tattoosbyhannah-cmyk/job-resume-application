// Edit/create form for a single work experience entry. Used inside
// Step3_Experience as a repeatable list.

import { useState, useEffect } from 'react'
import FormField from './FormField'

export default function ExperienceEntry({ entry, onChange, onRemove }) {
  const [local, setLocal] = useState(entry || { bullets: [''] })

  useEffect(() => { setLocal(entry || { bullets: [''] }) }, [entry])

  function update(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  function updateBullet(i, value) {
    const bullets = [...(local.bullets || [])]
    bullets[i] = value
    update('bullets', bullets)
  }

  function addBullet() {
    update('bullets', [...(local.bullets || []), ''])
  }

  function removeBullet(i) {
    const bullets = [...(local.bullets || [])]
    bullets.splice(i, 1)
    update('bullets', bullets)
  }

  return (
    <div className="card">
      <div className="field-row">
        <FormField id={`title-${local.id || 'new'}`} label="Job title" value={local.title} onChange={(v) => update('title', v)} required />
        <FormField id={`company-${local.id || 'new'}`} label="Company" value={local.company} onChange={(v) => update('company', v)} required />
      </div>
      <div className="field-row">
        <FormField id={`city-${local.id || 'new'}`} label="City, State (or Remote)" value={local.city} onChange={(v) => update('city', v)} />
        <div className="field-row" style={{ gridTemplateColumns: '1fr 1fr', margin: 0 }}>
          <FormField id={`start-${local.id || 'new'}`} label="Start (e.g. Jan 2020)" value={local.startDate} onChange={(v) => update('startDate', v)} />
          <FormField id={`end-${local.id || 'new'}`} label="End (or 'Present')" value={local.endDate} onChange={(v) => update('endDate', v)} />
        </div>
      </div>

      <div className="field">
        <label>Bullet points</label>
        {(local.bullets || []).map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input className="input" value={b} onChange={(e) => updateBullet(i, e.target.value)} placeholder="What you did, with numbers if possible" />
            <button type="button" className="btn secondary" onClick={() => removeBullet(i)}>×</button>
          </div>
        ))}
        <button type="button" className="btn secondary" onClick={addBullet}>+ Add bullet</button>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button type="button" className="btn danger" onClick={onRemove}>Remove this position</button>
      </div>
    </div>
  )
}
