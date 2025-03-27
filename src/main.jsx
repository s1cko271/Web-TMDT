import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ShopProvider } from './context/ShopContext'
import App from './App'
import './index.css'
// Import i18n configuration
import './i18n/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <App />
      </ShopProvider>
    </BrowserRouter>
  </React.StrictMode>,
)