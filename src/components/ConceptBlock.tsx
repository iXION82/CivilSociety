import { useEffect, useRef } from 'react'

// ===== DRAWING FUNCTIONS (ported directly from _old/backgroundAnimations.ts) =====

function drawConstruction(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.75, groundY = h * 0.8, numFloors = 8, fw = 240, fh = 40
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.stroke()
  if (p > 0) { const fp = Math.min(1, p / 0.2); ctx.fillStyle = `rgba(100,100,110,${fp * 0.8})`; ctx.fillRect(cx - fw/2, groundY, fw, 60 * fp) }
  const bp = Math.max(0, (p - 0.2) / 0.7), ftd = Math.floor(bp * numFloors), cfp = (bp * numFloors) % 1
  ctx.strokeStyle = 'rgba(245,158,11,0.4)'
  for (let i = 0; i <= ftd; i++) {
    if (i === numFloors) continue
    const y = groundY - i * fh; let dh = fh; if (i === ftd) dh = fh * cfp
    for (let c = 0; c < 5; c++) { const colX = cx - fw/2 + (c/4) * fw; ctx.beginPath(); ctx.moveTo(colX, y); ctx.lineTo(colX, y - dh); ctx.stroke() }
    if (i < ftd) { ctx.beginPath(); ctx.moveTo(cx - fw/2, y - fh); ctx.lineTo(cx + fw/2, y - fh); ctx.stroke() }
  }
  if (bp > 0.1 && bp < 0.95) {
    const cy = groundY - ((ftd + cfp) * fh) - 20; ctx.strokeStyle = '#ef4444'
    ctx.beginPath(); ctx.moveTo(cx+fw/2+20, cy+40); ctx.lineTo(cx+fw/2+20, cy-60); ctx.moveTo(cx+fw/2+30, cy-40); ctx.lineTo(cx-fw+20, cy-40); ctx.moveTo(cx-fw/2, cy-40); ctx.lineTo(cx-fw/2, cy+(Math.sin(Date.now()/500)*10)-10); ctx.stroke()
  }
}

function drawSoil(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.25, baseY = h * 0.4, settle = p * 60, buildY = baseY + settle, t = Date.now() / 2000
  const layers = [{y: baseY, h: 80, c: '#2c251d', comp: 1}, {y: baseY+80, h: 120, c: '#362f26', comp: 0.6}, {y: baseY+200, h: h, c: '#1a1820', comp: 0.1}]
  const bw = 200, fy = buildY + 40
  ctx.fillStyle = '#444455'; ctx.fillRect(cx-bw/2, fy-300, bw, 300); ctx.fillStyle = '#666677'; ctx.fillRect(cx-bw/2-10, fy-5, bw+20, 40)
  let curY = baseY
  layers.forEach((layer, i) => {
    const lc = settle * layer.comp, lt = curY + (i === 0 ? settle : lc)
    ctx.beginPath()
    for (let x = 0; x <= w; x += 10) {
      let dist = Math.abs(x - cx), dep = 0
      if (dist < bw*2) dep = Math.cos(dist/(bw*2)*Math.PI/2)*lc
      const wave = Math.sin(x*0.01+t+i)*5, y = lt+wave+dep
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fillStyle = layer.c; ctx.fill(); curY += layer.h
  })
}

function drawEarthquake(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w*0.75, gy = h*0.8, bw = 160, bh = 400
  ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1+p*3; ctx.stroke()
  if (p > 0.1) {
    ctx.strokeStyle = `rgba(239,68,68,${Math.sin(p*Math.PI)*0.5})`; ctx.lineWidth = 2
    for (let i=1;i<=3;i++) { ctx.beginPath(); const r = (p*500+i*100)%600; ctx.arc(cx, gy+50, r, Math.PI, 0); ctx.stroke() }
  }
  const env = Math.sin(p*Math.PI), shake = Math.sin(p*50)*80*env
  ctx.save(); ctx.translate(cx, gy); ctx.rotate(shake/bh)
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2
  ctx.fillRect(-bw/2, -bh, bw, bh); ctx.strokeRect(-bw/2, -bh, bw, bh)
  ctx.strokeStyle = 'rgba(245,158,11,0.3)'; const nf = 5, fhh = bh/nf
  for (let i=0;i<nf;i++) { const yb = -(i*fhh), yt = -((i+1)*fhh); ctx.beginPath(); ctx.moveTo(-bw/2,yb); ctx.lineTo(bw/2,yt); ctx.moveTo(bw/2,yb); ctx.lineTo(-bw/2,yt); ctx.stroke() }
  if (p > 0.1) { ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-bw/2+20, 0, 8, 0, Math.PI*2); ctx.arc(bw/2-20, 0, 8, 0, Math.PI*2); ctx.fill() }
  ctx.restore()
}

function drawWind(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w*0.25, gy = h*0.9, bw = 140, bh = 500
  ctx.save()
  const sa = -p*0.05, vib = Math.sin(Date.now()/50)*0.005*p
  ctx.translate(cx, gy); ctx.rotate(sa+vib); ctx.translate(-cx, -gy)
  ctx.fillStyle = '#222230'; ctx.fillRect(cx-bw/2, gy-bh, bw, bh)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1
  for (let c=1;c<=6;c++) { const wx = cx-bw/2+c*(bw/7); ctx.beginPath(); ctx.moveTo(wx, gy-bh+10); ctx.lineTo(wx, gy-40); ctx.stroke() }
  for (let y=gy-bh+30;y<gy-40;y+=30) { ctx.beginPath(); ctx.moveTo(cx-bw/2+5, y); ctx.lineTo(cx+bw/2-5, y); ctx.stroke() }
  ctx.restore()
  const wi = p*1.5, t = Date.now()/1000
  ctx.strokeStyle = `rgba(100,150,255,${0.1+p*0.4})`; ctx.lineWidth = 2
  for (let i=0;i<25;i++) {
    const baseY = (gy-bh-50)+(i/25)*(bh+100), ss = 1+(1-(i/25)), dash = (t*100*ss)%100
    ctx.setLineDash([30,70]); ctx.lineDashOffset = -dash*(1+wi); ctx.beginPath()
    for (let x=w;x>=0;x-=20) {
      let y = baseY; const d = Math.abs(x-cx)
      if (d<bw&&y>gy-bh&&y<gy) { const pd = y>(gy-bh/2)?1:-1; y += (bw-d)*0.8*pd; if(x>cx) y+=Math.sin(x*0.05-t*5)*20*wi }
      else if (x>cx&&y>gy-bh&&y<gy) { const dc = Math.max(0,1-(x-cx)/400); y+=Math.sin(x*0.05-t*5*ss+i)*30*wi*dc }
      if (x===w) ctx.moveTo(x,y); else ctx.lineTo(x,y)
    }; ctx.stroke()
  }; ctx.setLineDash([])
}

function drawDam(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w*0.5, gy = h*0.9, dh = 600, dtY = gy-dh, wd = dh*0.1+p*dh*0.85, wsY = gy-wd
  ctx.fillStyle = 'rgba(56,189,248,0.2)'; ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(cx,gy); ctx.lineTo(cx,wsY)
  const t = Date.now()/500; for (let x=cx;x>=0;x-=20) ctx.lineTo(x, wsY+Math.sin(x*0.05+t)*10)
  ctx.lineTo(0,wsY); ctx.fill()
  ctx.fillStyle = '#444455'; ctx.beginPath(); ctx.moveTo(cx,gy); ctx.lineTo(cx+250,gy); ctx.lineTo(cx+40,dtY); ctx.lineTo(cx,dtY); ctx.fill()
  ctx.strokeStyle = '#2c251d'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0,gy+5); ctx.lineTo(w,gy+5); ctx.stroke()
  if (wd > 50) {
    ctx.strokeStyle = 'rgba(239,68,68,0.8)'; ctx.fillStyle = 'rgba(239,68,68,0.8)'; ctx.lineWidth = 2
    for (let i=1;i<=15;i++) { const y = wsY+(i/15)*wd, pm = (y-wsY)*0.6; if (pm>5) { ctx.beginPath(); ctx.moveTo(cx-pm-10,y); ctx.lineTo(cx-10,y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx-10,y); ctx.lineTo(cx-20,y-5); ctx.lineTo(cx-20,y+5); ctx.fill() } }
    ctx.strokeStyle='rgba(239,68,68,0.3)';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(cx-10,wsY);ctx.lineTo(cx-(wd*0.6)-10,gy);ctx.lineTo(cx-10,gy);ctx.stroke();ctx.setLineDash([])
  }
  if (p>0.5) { const si=(p-0.5)*2; const gr=ctx.createLinearGradient(cx,gy,cx+250,gy-dh/2); gr.addColorStop(0,`rgba(245,158,11,${si*0.4})`); gr.addColorStop(1,'rgba(68,68,85,0)'); ctx.fillStyle=gr; ctx.beginPath(); ctx.moveTo(cx,gy); ctx.lineTo(cx+250,gy); ctx.lineTo(cx+40,dtY); ctx.lineTo(cx,dtY); ctx.fill() }
}

const drawFns: Record<string, (ctx: CanvasRenderingContext2D, w: number, h: number, p: number) => void> = {
  construction: drawConstruction,
  soil: drawSoil,
  earthquake: drawEarthquake,
  wind: drawWind,
  dam: drawDam,
}

// ===== REACT COMPONENT =====

interface Props {
  type: string
  title: string
  icon: string
  description: string
  align?: 'left' | 'right'
}

export default function ConceptBlock({ type, title, icon, description, align = 'right' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const currentRef = useRef(0)
  const activeRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const block = blockRef.current
    if (!canvas || !block) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawFn = drawFns[type]
    if (!drawFn) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      canvas!.width = rect.width * dpr
      canvas!.height = rect.height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function onScroll() {
      const rect = block!.getBoundingClientRect()
      const pinStart = rect.top + window.scrollY
      const pinDist = rect.height - window.innerHeight
      progressRef.current = Math.max(0, Math.min(1, (window.scrollY - pinStart) / pinDist))
      activeRef.current = progressRef.current > 0.05 && progressRef.current < 0.95
    }

    let animId = 0
    function animate() {
      animId = requestAnimationFrame(animate)
      currentRef.current += (progressRef.current - currentRef.current) * 0.1
      
      const content = contentRef.current
      if (content) {
        if (activeRef.current) content.classList.add('active')
        else content.classList.remove('active')
      }

      const w = canvas!.width / (window.devicePixelRatio || 1)
      const h = canvas!.height / (window.devicePixelRatio || 1)
      ctx!.clearRect(0, 0, w, h)
      const rect = block!.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      drawFn(ctx!, w, h, currentRef.current)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.dispatchEvent(new Event('scroll'))
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [type])

  return (
    <div ref={blockRef} className="concept-block">
      <canvas ref={canvasRef} className="concept-bg-canvas" />
      <div ref={contentRef} className={`concept-content ${align === 'left' ? 'ml-12 mr-auto' : 'mr-12 ml-auto'} max-w-md`}>
        <div className="glass-card p-8">
          <div className="text-3xl mb-4">{icon}</div>
          <h3 className="font-['Outfit'] text-2xl font-bold mb-3">{title}</h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}
