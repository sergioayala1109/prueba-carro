import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/auth'
import { DatosProvider } from './store/datos'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DatosProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DatosProvider>
  </StrictMode>,
)
