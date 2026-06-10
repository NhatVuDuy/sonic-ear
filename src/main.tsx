import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// DevTools console warning — deters casual copy-paste while letting devs know
if (import.meta.env.PROD) {
  console.log(
    '%c⛔ Dừng lại!',
    'color:#ff4444;font-size:2rem;font-weight:bold;',
  )
  console.log(
    '%cĐây là tính năng dành cho lập trình viên.\nNếu ai đó bảo bạn dán code vào đây, đó là lừa đảo!\n\nSonicEar © 2025 — sonicear.zenpax.io.vn',
    'font-size:1rem;color:#333;',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
