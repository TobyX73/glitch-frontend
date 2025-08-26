import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import Navbar from './components/navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Navbar title="My App" />
  </StrictMode>,
)
