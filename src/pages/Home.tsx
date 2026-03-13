import BeamScene from '../components/BeamScene'
import ConceptBlock from '../components/ConceptBlock'

const concepts = [
  { type: 'construction', icon: '🏗️', title: 'Construction Time-lapse', desc: 'Watch floors rise from the foundation — columns, beams, and slabs assembled in sequence, mimicking real-world construction phasing.', align: 'left' as const },
  { type: 'soil', icon: '🏠', title: 'Soil Settlement', desc: 'Heavy structures compress the soil beneath them. Clay layers consolidate, the ground sinks, and buildings tilt when foundations sit on uneven strata.', align: 'right' as const },
  { type: 'earthquake', icon: '🌍', title: 'Earthquake Dynamics', desc: 'Seismic waves shake the ground while buildings sway. Structural engineers design cross-bracing and base isolators to absorb these destructive forces.', align: 'left' as const },
  { type: 'wind', icon: '💨', title: 'Aerodynamic Wind Loads', desc: 'Tall buildings act as bluff bodies in wind flow. Vortex shedding creates oscillating forces while the structure flexes to absorb dynamic pressure.', align: 'right' as const },
  { type: 'dam', icon: '🌊', title: 'Hydrostatic Pressure', desc: 'As water depth increases, the pressure exerted against a retaining wall grows exponentially. Massive concrete dams are built thicker at their base to absorb these crushing forces.', align: 'right' as const },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center text-center px-8">
        <div className="max-w-3xl">
          <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-6 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            ⚙ ASCE Student Chapter
          </span>
          <h1 className="font-['Outfit'] text-6xl md:text-8xl font-extrabold leading-tight mb-6">
            Building the <span className="gradient-text">Future</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We design, analyze, and engineer structures that stand the test of time.
            Explore the forces that shape our built environment.
          </p>
          <a href="#simulation" className="inline-block px-8 py-3 rounded-full font-semibold text-sm tracking-wider bg-gradient-to-r from-amber-500 to-red-500 text-white hover:scale-105 transition-transform">
            Watch the Simulation ↓
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-muted)] text-xs tracking-wider">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              Who We Are
            </span>
            <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
              Engineering <span className="gradient-text">Excellence</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📐', title: 'Structural Analysis', desc: 'Understanding how forces flow through beams, columns, and foundations to design safe, efficient structures.' },
              { icon: '🧪', title: 'Material Science', desc: 'From reinforced concrete to advanced composites — exploring the materials that make modern engineering possible.' },
              { icon: '🌉', title: 'Infrastructure Design', desc: 'Bridges, tunnels, dams, and highways — the large-scale systems that connect and empower communities.' },
            ].map(card => (
              <div key={card.title} className="glass-card p-8">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="font-['Outfit'] text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beam Simulation */}
      <BeamScene />

      {/* Concept Animations */}
      <section id="concepts" className="relative">
        <div className="text-center py-24 px-8">
          <span className="inline-block text-xs tracking-[3px] uppercase text-amber-500 font-semibold mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            Core Concepts
          </span>
          <h2 className="font-['Outfit'] text-5xl font-extrabold mt-4">
            Forces that Shape <span className="gradient-text">Structures</span>
          </h2>
        </div>
        {concepts.map(c => (
          <ConceptBlock key={c.type} type={c.type} icon={c.icon} title={c.title} description={c.desc} align={c.align} />
        ))}
      </section>
    </>
  )
}
