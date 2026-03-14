import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-white/[0.06] pt-16 px-12 pb-8">
      <div className="flex justify-between flex-wrap gap-12 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* Custom Logo SVG */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path d="M2 20L22 20" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 14L22 14" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 20L4 8L12 2L20 8L20 20" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 14L12 8L20 14" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 2L12 20" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1.5" fill="var(--bg-secondary)" stroke="url(#footerLogoGradient)" strokeWidth="1" />
                <circle cx="12" cy="14" r="1.5" fill="var(--bg-secondary)" stroke="url(#footerLogoGradient)" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Typography */}
            <div className="flex flex-col leading-none">
              <span className="font-['Outfit'] font-extrabold text-xl tracking-wide gradient-text">ASCE</span>
              <span className="font-['Outfit'] font-medium text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase mt-0.5">IIT ISM Dhanbad</span>
            </div>
          </div>
          <p className="text-[var(--text-muted)] text-sm">Engineering the structures of tomorrow.</p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-2">
            <h4 className="font-['Outfit'] font-semibold text-sm tracking-wider uppercase text-[var(--text-secondary)] mb-2">Society</h4>
            <a href="/#about" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">About Us</a>
            <Link to="/team" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Team</Link>
            <Link to="/events" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Events</Link>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-['Outfit'] font-semibold text-sm tracking-wider uppercase text-[var(--text-secondary)] mb-2">Resources</h4>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Publications</a>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Workshops</a>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Research</a>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-['Outfit'] font-semibold text-sm tracking-wider uppercase text-[var(--text-secondary)] mb-2">Connect</h4>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">LinkedIn</a>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Twitter</a>
            <a href="#" className="text-[var(--text-muted)] text-sm hover:text-amber-400 transition-colors">Email Us</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06] mt-12 pt-6 text-center">
        <p className="text-[var(--text-muted)] text-sm">&copy; 2026 ASCE Student Chapter, IIT ISM Dhanbad. All rights reserved. || Design & Developed by <a href='trivalent102103@gmail.com'
          className='hover:text-white'
        >Trivalent</a></p>
      </div>
    </footer>
  )
}
