import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProfileProvider } from './contexts/ProfileContext.jsx'

// `import.meta.env.BASE_URL` matches the `base` in vite.config.js so the
// router works both at localhost:5173 and at the GitHub Pages subpath.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
