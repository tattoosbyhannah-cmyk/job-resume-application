// Top-of-wizard breadcrumb showing 8 steps with current/done state.

const STEPS = [
  { path: 'welcome', label: '1. Welcome' },
  { path: 'profile', label: '2. Profile' },
  { path: 'experience', label: '3. Experience' },
  { path: 'education', label: '4. Education' },
  { path: 'role-templates', label: '5. Roles' },
  { path: 'companies', label: '6. Companies' },
  { path: 'generate', label: '7. Generate' },
  { path: 'bookmarklets', label: '8. Bookmarklets' },
]

export default function StepNav({ current }) {
  const currentIdx = STEPS.findIndex((s) => s.path === current)
  return (
    <div className="step-nav">
      {STEPS.map((step, i) => {
        const cls =
          i === currentIdx ? 'step current' :
          i < currentIdx ? 'step done' : 'step'
        return (
          <div key={step.path} className={cls}>{step.label}</div>
        )
      })}
    </div>
  )
}

export { STEPS }
