import './styles/blog.css'
import { LoadingProvider } from './context/LoadingContext'
import { WebsiteContentProvider } from './context/WebsiteContent'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider><WebsiteContentProvider><App /></WebsiteContentProvider></LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)
