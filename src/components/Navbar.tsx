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
      <NavLink to="/" className="flex items-center gap-3">
        {/* Custom Logo SVG */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] group transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform duration-300 group-hover:scale-110">
            {/* Define the gradient for the paths */}
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" /> {/* Amber 500 */}
                <stop offset="100%" stopColor="#ef4444" /> {/* Red 500 */}
              </linearGradient>
            </defs>
            {/* Bridge Truss / Building Structure */}
            <path d="M2 20L22 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 14L22 14" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 20L4 8L12 2L20 8L20 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14L12 8L20 14" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2L12 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
            {/* Small nodes at intersections */}
            <circle cx="12" cy="8" r="1.5" fill="var(--bg-primary)" stroke="url(#logoGradient)" strokeWidth="1" />
            <circle cx="12" cy="14" r="1.5" fill="var(--bg-primary)" stroke="url(#logoGradient)" strokeWidth="1" />
          </svg>
        </div>
        
        {/* Typography */}
        <div className="flex flex-col leading-none">
          <span className="font-['Outfit'] font-extrabold text-xl tracking-wide gradient-text">ASCE</span>
          <span className="font-['Outfit'] font-medium text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase mt-0.5">IIT ISM Dhanbad</span>
        </div>
      </NavLink>

      <div className="flex gap-8">
        <NavLink to="/" className={linkClass} end>Home</NavLink>
        <NavLink to="/ism" className={linkClass}>ISM</NavLink>
        <a href="/#about" className="relative text-sm transition-colors duration-300 hover:text-amber-400 text-[var(--text-secondary)]">About</a>
        <a href="/#simulation" className="relative text-sm transition-colors duration-300 hover:text-amber-400 text-[var(--text-secondary)]">Simulation</a>
        <NavLink to="/events" className={linkClass}>Events</NavLink>
        <NavLink to="/team" className={linkClass}>Our Team</NavLink>
        <NavLink to="/professors" className={linkClass}>Professors</NavLink>
        <NavLink to="/alumni" className={linkClass}>Alumni</NavLink>
      </div>
    </nav>
  )
}
