import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path matches the GitHub Pages subpath for this repo.
// https://tattoosbyhannah-cmyk.github.io/job-resume-application/
export default defineConfig({
  plugins: [react()],
  base: '/job-resume-application/',
})
