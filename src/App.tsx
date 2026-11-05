import { Header } from './components/home/Header'
import { BlogPage } from './pages/BlogPage'
import { BlogArticlePage } from './pages/BlogArticlePage'
import { BlogCategoryPage } from './pages/BlogCategoryPage'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ToursPage } from './pages/ToursPage'
import { ContactPage } from './pages/ContactPage'
import { TourDetailsPage } from './pages/TourDetailsPage'
import { AboutPage } from './pages/AboutPage'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'auto', block: 'start' })
      }, 0)
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/tours/:slug" element={<TourDetailsPage />} />
      <Route path="/blog" element={<><Header /><BlogPage /></>} />
      <Route path="/blog/category/:slug" element={<><Header /><BlogCategoryPage /></>} />
      <Route path="/blog/:slug" element={<><Header /><BlogArticlePage /></>} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
