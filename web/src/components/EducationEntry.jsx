// Edit/create form for a single education or certification entry.

import { useState, useEffect } from 'react'
import FormField from './FormField'

export default function EducationEntry({ entry, onChange, onRemove }) {
  const [local, setLocal] = useState(entry || {})

  useEffect(() => { setLocal(entry || {}) }, [entry])

  function update(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  return (
    <div className="card">
      <div className="field-row">
        <FormField
          id={`level-${local.id || 'new'}`}
          label="Level / Credential"
          placeholder="Bachelor of Arts, Certification, MBA, etc."
          value={local.level}
          onChange={(v) => update('level', v)}
          required
        />
        <FormField
          id={`field-${local.id || 'new'}`}
          label="Field of study"
          value={local.fieldOfStudy}
          onChange={(v) => update('fieldOfStudy', v)}
        />
      </div>
      <div className="field-row">
        <FormField id={`school-${local.id || 'new'}`} label="School / Institution" value={local.school} onChange={(v) => update('school', v)} required />
        <FormField id={`city-${local.id || 'new'}`} label="City" value={local.city} onChange={(v) => update('city', v)} />
      </div>
      <div className="field-row">
        <FormField id={`start-${local.id || 'new'}`} label="Start year" value={local.startDate} onChange={(v) => update('startDate', v)} />
        <FormField id={`end-${local.id || 'new'}`} label="End year (or expected)" value={local.endDate} onChange={(v) => update('endDate', v)} />
      </div>

      <div style={{ textAlign: 'right' }}>
        <button type="button" className="btn danger" onClick={onRemove}>Remove</button>
      </div>
    </div>
  )
}
