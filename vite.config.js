import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import proxyConfig from './vite.proxy.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxyConfig,
    port: 5173,
    host: true
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
})