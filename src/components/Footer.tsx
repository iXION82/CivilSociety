import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-white/[0.06] pt-16 px-12 pb-8">
      <div className="flex justify-between flex-wrap gap-12 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl gradient-text">▲</span>
            <span className="font-['Outfit'] font-bold text-xl">ASCE IIT ISM Dhanbad</span>
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
        <p className="text-[var(--text-muted)] text-sm">&copy; 2026 ASCE Student Chapter, IIT ISM Dhanbad. All rights reserved.</p>
      </div>
    </footer>
  )
}
