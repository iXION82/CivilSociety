export default function Events() {
  const events = [
    { icon: '🤝', title: 'Alumni Interaction', desc: 'Connect with distinguished alumni from top civil engineering firms. Gain industry insights, career guidance, and networking opportunities that bridge the gap between academia and the professional world.', tags: ['Networking', 'Career', 'Mentorship'] },
    { icon: '🛠️', title: 'Skill Building Workshop', desc: 'Hands-on sessions focusing on modern engineering software like AutoCAD, STAAD Pro, and ETABS. Learn practical field skills including surveying, soil testing, and structural analysis techniques.', tags: ['Hands-on', 'Software', 'Technical'] },
    { icon: '🏭', title: 'Industry Interaction', desc: 'Direct exposure to leading civil engineering firms and ongoing mega-projects. Hear from professionals working on infrastructure that defines skylines and connects communities.', tags: ['Industry', 'Projects', 'Infrastructure'] },
    { icon: '📚', title: 'Academia Interaction', desc: 'Engage with distinguished professors and researchers on cutting-edge structural technologies, sustainable construction materials, and the future of smart infrastructure.', tags: ['Research', 'Innovation', 'Academic'] },
  ]

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <div className="text-center mb-16 px-12">
        <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          What's Coming Next
        </span>
        <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
          Upcoming <span className="gradient-text">Events</span>
        </h2>
        <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
          Stay updated with the latest activities and gatherings organized by the ASCE Student Chapter, IIT ISM Dhanbad.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-[900px] mx-auto px-12 pb-16">
        <div className="relative pl-10">
          {events.map((evt, i) => (
            <div key={evt.title} className="relative mb-12">
              <div className="timeline-dot" />
              {i < events.length - 1 && <div className="timeline-connector" />}

              <div className="glass-card timeline-card p-8 flex flex-col gap-4 transition-transform duration-300">
                <span className="font-['Outfit'] font-semibold text-xs tracking-[2px] uppercase text-red-400">
                  Coming Soon
                </span>
                <div>
                  <span className="text-2xl mr-2">{evt.icon}</span>
                  <h3 className="font-['Outfit'] text-xl font-semibold inline">{evt.title}</h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{evt.desc}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {evt.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-medium tracking-wider rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
