import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))
const buildDate = new Date().toISOString().slice(0, 10)

export default defineConfig({
  base: '/demo2/',
  define: {
    __BUILD_INFO__: JSON.stringify(`v${version}-demo2 · ${buildDate}`),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
