import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import Home from './pages/Home'
import Team from './pages/Team'
import Events from './pages/Events'
import Professors from './pages/Professors'
import Alumni from './pages/Alumni'
import ISM from './pages/ISM'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Show loader on route change
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <PageLoader visible={loading} />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ism" element={<ISM />} />
          <Route path="/professors" element={<Professors />} />
          <Route path="/alumni" element={<Alumni />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
