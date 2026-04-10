import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Wizard from './pages/Wizard'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page-loader">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/wizard/*"
        element={
          <RequireAuth>
            <Wizard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
