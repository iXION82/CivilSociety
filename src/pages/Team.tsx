export default function Team() {
  const members = [
    { name: 'Deepak Kumar', role: 'President', desc: 'Leading the chapter with a vision for structural excellence and innovation in civil engineering education.' },
    { name: 'Matam Sai Yashwanth', role: 'Vice President', desc: 'Supporting chapter initiatives and fostering academic collaboration across departments.' },
    { name: 'Abhishek Raj', role: 'Secretary', desc: 'Coordinating all chapter activities, communications, and maintaining organizational records.' },
    { name: 'Pari Agrawal', role: 'Event Coordinator', desc: 'Planning and executing workshops, guest lectures, and technical competitions.' },
    { name: 'Rishit Bhardwaj', role: 'Event Coordinator', desc: 'Managing event logistics and ensuring memorable experiences for all participants.' },
  ]

  return (
    <div className="pt-32 pb-20 px-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          Our Leadership
        </span>
        <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
          Meet the <span className="gradient-text">Team</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m) => (
          <div key={m.name} className="glass-card p-8 flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-500/30 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h3 className="font-['Outfit'] text-xl font-semibold">{m.name}</h3>
              <span className="text-amber-500 text-sm font-medium tracking-wider uppercase">{m.role}</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{m.desc}</p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-[var(--text-muted)] hover:text-amber-400 transition-colors text-sm">📱 Contact</a>
              <a href="#" className="text-[var(--text-muted)] hover:text-amber-400 transition-colors text-sm">💼 LinkedIn</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
