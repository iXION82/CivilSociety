export default function Alumni() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl">
        <span className="inline-block text-xs tracking-[4px] uppercase text-amber-500 font-semibold mb-6 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          Alumni Network
        </span>
        <h1 className="font-['Outfit'] text-6xl md:text-8xl font-extrabold leading-tight mb-8">
          Coming <span className="gradient-text">Soon</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-12">
          We are currently building our alumni database. Check back later to connect with the distinguished graduates of the Civil Engineering Department at IIT ISM Dhanbad.
        </p>
        
        {/* Animated blueprint background elements for visual interest */}
        <div className="relative w-full h-48 border border-white/5 rounded-2xl overflow-hidden bg-black/20 flex items-center justify-center backdrop-blur-sm">
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(245,158,11,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />
           <div className="w-16 h-16 border-4 border-amber-500/30 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-red-500/30 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
           </div>
        </div>
      </div>
    </div>
  )
}
