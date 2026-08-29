import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA offline support — ONLY on the web.
// Inside the Capacitor native app the assets are already local, so the SW is
// redundant and its skipWaiting/clients.claim → controllerchange → reload
// causes an unnecessary reload right after launch.
if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        if (!reg) return
        reg.addEventListener('updatefound', () => {
          const installing = reg.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              try { installing.postMessage('SKIP_WAITING') } catch {}
            }
          })
        })
      })
      .catch(() => {})

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      // Reload only after a real update, not initial controller arrival.
      // Defer briefly to avoid flicker on first install.
      setTimeout(() => window.location.reload(), 50)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
