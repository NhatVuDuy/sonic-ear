import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { execSync } from 'child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const buildTime = new Date().toISOString().slice(0, 16).replace('T', ' ')

export default defineConfig({
  define: {
    __BUILD_INFO__: JSON.stringify(`${commitHash} · ${buildTime} UTC`),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
