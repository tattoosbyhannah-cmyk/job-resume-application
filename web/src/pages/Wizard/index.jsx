// Wizard shell — handles routing between the 8 steps.

import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { logout } from '../../lib/auth'
import { Link, useNavigate } from 'react-router-dom'
import Step1Welcome from './Step1_Welcome'
import Step2Profile from './Step2_Profile'
import Step3Experience from './Step3_Experience'
import Step4Education from './Step4_Education'
import Step5RoleTemplates from './Step5_RoleTemplates'
import Step6Companies from './Step6_Companies'
import Step7Generate from './Step7_Generate'
import Step8Bookmarklets from './Step8_Bookmarklets'

export default function Wizard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <>
      <header className="app-header">
        <div className="brand">
          <Link to="/dashboard" style={{ color: 'inherit' }}>Job Toolkit</Link>
        </div>
        <div>
          <span className="meta" style={{ marginRight: 12 }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn secondary">Sign out</button>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route index element={<Step1Welcome />} />
          <Route path="welcome" element={<Step1Welcome />} />
          <Route path="profile" element={<Step2Profile />} />
          <Route path="experience" element={<Step3Experience />} />
          <Route path="education" element={<Step4Education />} />
          <Route path="role-templates" element={<Step5RoleTemplates />} />
          <Route path="companies" element={<Step6Companies />} />
          <Route path="generate" element={<Step7Generate />} />
          <Route path="bookmarklets" element={<Step8Bookmarklets />} />
          <Route path="*" element={<Navigate to="/wizard/welcome" replace />} />
        </Routes>
      </main>
    </>
  )
}
