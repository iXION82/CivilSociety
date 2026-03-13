import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isSubPage = location.pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm transition-colors duration-300 hover:text-amber-400 ${isActive ? 'text-amber-400 nav-link-active' : 'text-[var(--text-secondary)]'}`

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-12 py-4 border-b border-white/[0.06] transition-all duration-300 ${
        scrolled || isSubPage
          ? 'bg-[rgba(10,10,15,0.9)] backdrop-blur-2xl'
          : 'bg-[rgba(10,10,15,0.6)] backdrop-blur-xl'
      }`}
    >
      <NavLink to="/" className="flex items-center gap-2 font-[var(--font-primary)] font-bold text-xl">
        <span className="text-2xl gradient-text">▲</span>
        <span className="font-['Outfit'] font-bold">ASCE IIT ISM Dhanbad</span>
      </NavLink>

      <div className="flex gap-8">
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <a href="/#about" className="relative text-sm transition-colors duration-300 hover:text-amber-400 text-[var(--text-secondary)]">About</a>
        <a href="/#simulation" className="relative text-sm transition-colors duration-300 hover:text-amber-400 text-[var(--text-secondary)]">Simulation</a>
        <NavLink to="/events" className={linkClass}>Events</NavLink>
        <NavLink to="/team" className={linkClass}>Our Team</NavLink>
      </div>
    </nav>
  )
}
