import { useEffect, useRef } from 'react'

interface Props {
  visible: boolean
}

export default function PageLoader({ visible }: Props) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = visible ? '85%' : '100%'
    }
  }, [visible])

  return (
    <div
      id="page-loader"
      className="transition-opacity duration-600"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        display: visible ? 'flex' : 'none',
      }}
    >
      <div className="loader-blueprint" />
      <div className="relative z-2 flex flex-col items-center gap-8">
        <div className="w-30 h-30 text-amber-500">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <rect x="15" y="100" width="30" height="8" rx="2" fill="currentColor" opacity="0.6" />
            <rect x="27" y="20" width="6" height="80" fill="currentColor" />
            <line x1="27" y1="30" x2="33" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="33" y1="30" x2="27" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="27" y1="50" x2="33" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="33" y1="50" x2="27" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <rect x="30" y="18" width="65" height="5" rx="1" fill="currentColor" />
            <rect x="5" y="18" width="25" height="5" rx="1" fill="currentColor" />
            <rect x="5" y="23" width="12" height="8" rx="1" fill="currentColor" opacity="0.7" />
            <rect x="24" y="10" width="12" height="10" rx="2" fill="currentColor" opacity="0.5" />
            <line x1="80" y1="23" x2="80" y2="65" stroke="currentColor" strokeWidth="1.5" className="crane-cable" />
            <path d="M76 65 L84 65 L82 72 Q80 76 78 72 Z" fill="currentColor" className="crane-hook" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <span className="technical-text font-['Outfit'] font-bold text-xs tracking-[4px] text-amber-500 uppercase mb-2">
            INITIALIZING STRUCTURE
          </span>
          <div className="w-60 h-1 bg-white/5 rounded-full overflow-hidden">
            <div ref={barRef} className="loader-bar w-0 transition-all duration-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
