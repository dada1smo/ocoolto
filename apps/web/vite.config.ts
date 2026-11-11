import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // strictPort: fail loudly instead of silently drifting to another port
  server: { port: 5180, strictPort: true, proxy: { '/api': 'http://localhost:8787' } },
})
