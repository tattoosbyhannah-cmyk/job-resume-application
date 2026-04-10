// Edit a single role template (Marketing Director, Head of Creative, etc.).
// Captures: display name, professional summary, 5 highlights, 4-5 cover
// letter paragraphs. Use {{company}}, {{role}}, {{hiring}} as placeholders
// — they're substituted at generation time.

import { useState, useEffect } from 'react'
import FormField from './FormField'

export default function CoverLetterTemplateEditor({ template, onChange, onRemove }) {
  const [local, setLocal] = useState(
    template || { highlights: ['', '', '', '', ''], coverLetterParagraphs: ['', '', '', ''] }
  )

  useEffect(() => {
    setLocal(template || { highlights: ['', '', '', '', ''], coverLetterParagraphs: ['', '', '', ''] })
  }, [template])

  function update(field, value) {
    const next = { ...local, [field]: value }
    setLocal(next)
    onChange(next)
  }

  function updateArray(field, i, value) {
    const arr = [...(local[field] || [])]
    arr[i] = value
    update(field, arr)
  }

  function addItem(field) {
    update(field, [...(local[field] || []), ''])
  }

  function removeItem(field, i) {
    const arr = [...(local[field] || [])]
    arr.splice(i, 1)
    update(field, arr)
  }

  return (
    <div className="card">
      <FormField
        id={`role-name-${local.key || 'new'}`}
        label="Role display name"
        placeholder="Marketing Director, Head of Creative, etc."
        value={local.displayName}
        onChange={(v) => update('displayName', v)}
        required
      />

      <FormField
        id={`summary-${local.key || 'new'}`}
        label="Professional summary"
        textarea
        rows={4}
        value={local.professionalSummary}
        onChange={(v) => update('professionalSummary', v)}
        help="2-3 sentences. Use {{company}} or {{role}} as placeholders if you want them substituted."
        required
      />

      <div className="field">
        <label>Key highlights (5 bullets)</label>
        {(local.highlights || []).map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input className="input" value={h} onChange={(e) => updateArray('highlights', i, e.target.value)} placeholder={`Highlight ${i + 1}`} />
            <button type="button" className="btn secondary" onClick={() => removeItem('highlights', i)}>×</button>
          </div>
        ))}
        <button type="button" className="btn secondary" onClick={() => addItem('highlights')}>+ Add highlight</button>
      </div>

      <div className="field">
        <label>Cover letter paragraphs</label>
        <div className="help" style={{ marginBottom: 8 }}>
          4-5 paragraphs. Use <code>{'{{company}}'}</code> and <code>{'{{role}}'}</code> placeholders so each company gets a personalized version.
        </div>
        {(local.coverLetterParagraphs || []).map((p, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <textarea
              className="textarea"
              value={p}
              onChange={(e) => updateArray('coverLetterParagraphs', i, e.target.value)}
              placeholder={`Paragraph ${i + 1}`}
              rows={4}
            />
            <button type="button" className="btn secondary" onClick={() => removeItem('coverLetterParagraphs', i)} style={{ marginTop: 4 }}>Remove paragraph</button>
          </div>
        ))}
        <button type="button" className="btn secondary" onClick={() => addItem('coverLetterParagraphs')}>+ Add paragraph</button>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button type="button" className="btn danger" onClick={onRemove}>Delete this role template</button>
      </div>
    </div>
  )
}
