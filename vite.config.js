import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // El sitio se publica en GitHub Pages bajo /prueba-carro/.
  // En desarrollo Vite sigue usando la raíz (/).
  base: '/prueba-carro/',
  plugins: [react()],
})
