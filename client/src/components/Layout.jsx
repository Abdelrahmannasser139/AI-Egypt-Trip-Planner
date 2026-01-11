import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './navigation/Navbar'
import Footer from './navigation/Footer'
import ScrollToTop from './common/ScrollToTop'

const Layout = ({ children }) => {
  const location = useLocation()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  // Check if current page is homepage
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-16'}`}>
        {children}
      </main>
      <Footer />
      {showScrollToTop && <ScrollToTop />}
    </div>
  )
}

export default Layout
