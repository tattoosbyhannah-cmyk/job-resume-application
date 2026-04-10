// Reusable labeled form field. Used by every wizard step.

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  help = '',
  textarea = false,
  rows = 4,
}) {
  const props = {
    id,
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    required,
    placeholder,
  }
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required && ' *'}</label>
      {textarea ? (
        <textarea className="textarea" rows={rows} {...props} />
      ) : (
        <input className="input" type={type} {...props} />
      )}
      {help && <div className="help">{help}</div>}
    </div>
  )
}
