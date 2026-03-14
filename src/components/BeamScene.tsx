import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress, ScrollState } from '../hooks/useScrollProgress'
import Graphs from './Graphs'

// ===== CONSTANTS =====
const BEAM_LENGTH = 8
const BEAM_HEIGHT = 0.4
const BEAM_DEPTH = 0.6
const SUPPORT_OFFSET = 3.5
const SUPPORT_HEIGHT = 0.6
const GROUND_Y = -0.5
const BEAM_REST_Y = GROUND_Y + SUPPORT_HEIGHT + BEAM_HEIGHT / 2
const SPAN = SUPPORT_OFFSET * 2
const MAX_LOAD = 300
const MAX_DEFLECTION = SUPPORT_HEIGHT * 0.85
const HALF_LEN = BEAM_LENGTH / 2 - 0.05
const GRAVITY = 9.81
const BOUNCE_DAMPING = 0.3

// ===== DEFLECTION MATH =====
function beamDeflectionPoint(xFromCenter: number, loadFraction: number): number {
  const normalizedDist = Math.abs(xFromCenter) / SUPPORT_OFFSET
  if (normalizedDist > 1.0) return 0
  const L = SPAN
  const xFromLeft = (1 - normalizedDist) * (L / 2)
  const normalizedDeflection = (xFromLeft * (3 * L * L - 4 * xFromLeft * xFromLeft)) / (L * L * L)
  return normalizedDeflection * loadFraction * MAX_DEFLECTION
}

function beamDeflectionUDL(xFromCenter: number, loadFraction: number): number {
  const normalizedDist = Math.abs(xFromCenter) / SUPPORT_OFFSET
  if (normalizedDist > 1.0) return 0
  const L = SPAN
  const x_L = Math.abs(xFromCenter) / L
  const shape = 1 - 4.8 * (x_L * x_L) + 3.2 * (x_L * x_L * x_L * x_L)
  return shape * loadFraction * MAX_DEFLECTION
}

// ===== PHYSICS =====
interface PiecePhysics {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  angle: number; va: number; resting: boolean
}

function makeFreshPhysics(startX: number, side: number, vx: number, vy: number, va: number, vz: number): PiecePhysics {
  return { x: startX, y: BEAM_REST_Y, z: 0, vx: side * vx, vy, vz, angle: 0, va: va === 0 ? side * 1.5 : va, resting: false }
}

function getLowestY(cy: number, angle: number): number {
  const hw = HALF_LEN / 2, hh = BEAM_HEIGHT / 2
  const cosA = Math.cos(angle), sinA = Math.sin(angle)
  return cy + Math.min(-hw * sinA - hh * cosA, -hw * sinA + hh * cosA, hw * sinA - hh * cosA, hw * sinA + hh * cosA)
}

function stepPiece(p: PiecePhysics, dt: number) {
  if (p.resting) return
  p.vy -= GRAVITY * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.angle += p.va * dt
  const lowest = getLowestY(p.y, p.angle)
  if (lowest <= GROUND_Y) {
    p.y += (GROUND_Y - lowest)
    if (Math.abs(p.vy) < 1 && Math.abs(p.va) < 1) {
      p.vy = 0; p.vx = 0; p.vz = 0; p.va = 0; p.resting = true; p.angle = 0; p.y = GROUND_Y + BEAM_HEIGHT / 2
    } else {
      p.vy = Math.abs(p.vy) * BOUNCE_DAMPING; p.vx *= 0.8; p.vz *= 0.8; p.va *= -BOUNCE_DAMPING * 0.8
    }
  }
}

// ===== SUPPORT COMPONENT =====
function Support({ x }: { x: number }) {
  const shape = new THREE.Shape()
  shape.moveTo(-0.4, 0); shape.lineTo(0.4, 0); shape.lineTo(0, SUPPORT_HEIGHT); shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: BEAM_DEPTH + 0.1, bevelEnabled: false })
  return (
    <mesh geometry={geo} position={[x, GROUND_Y, -(BEAM_DEPTH + 0.1) / 2]} castShadow receiveShadow>
      <meshStandardMaterial color={0x556677} roughness={0.5} metalness={0.4} />
    </mesh>
  )
}

// ===== POINT LOAD ARROW =====
function PointArrow({ visible, posY, scale, color }: { visible: boolean; posY: number; scale: number; color: THREE.Color }) {
  if (!visible) return null
  return (
    <group position={[0, posY, 0]} scale={[scale, scale, scale]}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}

// ===== UDL ARROWS =====
function UDLArrows({ visible, posY, color }: { visible: boolean; posY: number; color: THREE.Color }) {
  if (!visible) return null
  const arrows = []
  for (let i = 0; i < 9; i++) {
    const x = -SUPPORT_OFFSET + (i / 8) * SPAN
    arrows.push(
      <group key={i} position={[x, 0, 0]}>
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    )
  }
  return <group position={[0, posY, 0]}>{arrows}</group>
}

// ===== MAIN SCENE CONTENT =====
function SceneContent({ progress, simMode }: { progress: number; simMode: 'POINT_DOWN' | 'UDL_UP' }) {
  const beamRef = useRef<THREE.Mesh>(null)
  const leftRef = useRef<THREE.Mesh>(null)
  const rightRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const origPositions = useRef<Float32Array | null>(null)
  const isFractured = useRef(false)
  const leftPhys = useRef(makeFreshPhysics(-BEAM_LENGTH / 4, -1, 1.5, 0, 0, 0))
  const rightPhys = useRef(makeFreshPhysics(BEAM_LENGTH / 4, 1, 1.5, 0, 0, 0))

  // Arrow state
  const [arrowState, setArrowState] = useState({
    pointVisible: false, pointY: 5, pointScale: 1, pointColor: new THREE.Color(0xf59e0b),
    udlVisible: false, udlY: BEAM_REST_Y - BEAM_HEIGHT / 2 - 2, udlColor: new THREE.Color(0x3b82f6),
    fractured: false,
  })

  // Store original positions once
  useEffect(() => {
    if (beamRef.current) {
      const geo = beamRef.current.geometry as THREE.BufferGeometry
      origPositions.current = new Float32Array(geo.attributes.position.array)
    }
  }, [])

  const deformBeam = useCallback((loadFraction: number, isUDL: boolean) => {
    if (!beamRef.current || !origPositions.current) return
    const geo = beamRef.current.geometry as THREE.BufferGeometry
    const positions = geo.attributes.position.array as Float32Array
    const orig = origPositions.current
    for (let i = 0; i < positions.length; i += 3) {
      const origX = orig[i], origY = orig[i + 1]
      if (!isUDL) {
        const d = beamDeflectionPoint(origX, loadFraction)
        const worldY = BEAM_REST_Y + origY - d
        positions[i + 1] = Math.max(worldY, GROUND_Y + 0.02) - BEAM_REST_Y
      } else {
        const d = beamDeflectionUDL(origX, loadFraction)
        positions[i + 1] = BEAM_REST_Y + origY + d - BEAM_REST_Y
      }
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
  }, [])

  const colorBeam = useCallback((loadFraction: number, isUDL: boolean) => {
    if (!beamRef.current || !origPositions.current) return
    const geo = beamRef.current.geometry as THREE.BufferGeometry
    const colors = geo.attributes.color.array as Float32Array
    const orig = origPositions.current
    for (let i = 0; i < colors.length; i += 3) {
      const vi = i / 3
      const x = orig[vi * 3]
      const nd = Math.abs(x) / SUPPORT_OFFSET
      const ls = Math.max(0, (1 - nd)) * loadFraction
      let r: number, g: number, b: number
      if (ls < 0.2) { r = 0.53; g = 0.6; b = 0.67 }
      else {
        const t = Math.min(1, Math.max(0, (ls - 0.2) / 0.8))
        if (!isUDL) {
          if (t < 0.375) { const t2 = t / 0.375; r = 0.53*(1-t2)+0.2*t2; g = 0.6*(1-t2)+1*t2; b = 0.67*(1-t2)+0*t2 }
          else if (t < 0.75) { const t2 = (t-0.375)/0.375; r = 0.2*(1-t2)+1*t2; g = 1*(1-t2)+0.6*t2; b = 0*(1-t2)+0*t2 }
          else { const t2 = (t-0.75)/0.25; r = 1; g = 0.6*(1-t2)+0*t2; b = 0 }
        } else {
          if (t < 0.375) { const t2 = t / 0.375; r = 0.53*(1-t2)+0*t2; g = 0.6*(1-t2)+0.8*t2; b = 0.67*(1-t2)+1*t2 }
          else if (t < 0.75) { const t2 = (t-0.375)/0.375; r = 0*(1-t2)+0.8*t2; g = 0.8*(1-t2)+0*t2; b = 1 }
          else { const t2 = (t-0.75)/0.25; r = 0.8*(1-t2)+1*t2; g = 0; b = 1*(1-t2)+0*t2 }
        }
      }
      colors[i] = r!; colors[i+1] = g!; colors[i+2] = b!
    }
    geo.attributes.color.needsUpdate = true
  }, [])

  const fullReset = useCallback(() => {
    isFractured.current = false
    if (beamRef.current) beamRef.current.visible = true
    if (leftRef.current) leftRef.current.visible = false
    if (rightRef.current) rightRef.current.visible = false
    if (beamRef.current && origPositions.current) {
      const geo = beamRef.current.geometry as THREE.BufferGeometry
      ;(geo.attributes.position.array as Float32Array).set(origPositions.current)
      geo.attributes.position.needsUpdate = true
      geo.computeVertexNormals()
      const colors = geo.attributes.color.array as Float32Array
      for (let i = 0; i < colors.length; i += 3) { colors[i] = 0.53; colors[i+1] = 0.6; colors[i+2] = 0.67 }
      geo.attributes.color.needsUpdate = true
    }
    setArrowState(s => ({...s, pointVisible: false, udlVisible: false, fractured: false, pointColor: new THREE.Color(0xf59e0b), udlColor: new THREE.Color(0x3b82f6) }))
  }, [])

  const triggerFracture = useCallback((dir: 'DOWN' | 'UP') => {
    isFractured.current = true
    if (beamRef.current) beamRef.current.visible = false
    if (leftRef.current) leftRef.current.visible = true
    if (rightRef.current) rightRef.current.visible = true
    if (dir === 'DOWN') {
      leftPhys.current = makeFreshPhysics(-BEAM_LENGTH/4, -1, 1.5, 0, 0, 2)
      rightPhys.current = makeFreshPhysics(BEAM_LENGTH/4, 1, 1.5, 0, 0, 2)
    } else {
      leftPhys.current = makeFreshPhysics(-BEAM_LENGTH/4, -1, 1.5, 8, 8, 3)
      rightPhys.current = makeFreshPhysics(BEAM_LENGTH/4, 1, 1.5, 8, -8, 3)
    }
    setArrowState(s => ({...s, pointVisible: false, udlVisible: false, fractured: true}))
  }, [])

  useEffect(() => {
    fullReset()
  }, [simMode, fullReset])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const p = progress
    const cam = camera as THREE.PerspectiveCamera

    const clamped = Math.max(0, Math.min(1, p))

    if (simMode === 'POINT_DOWN') {
      // Camera
      if (clamped < 0.15) {
        const t = clamped / 0.15
        cam.position.set(8 * Math.cos(t * Math.PI * 0.5) * (1-t), 4 + (1-t)*2, 12 + (1-t)*3)
      } else if (clamped < 0.4) { cam.position.set(0, 4, 12) }
      else if (clamped < 0.75) { const t = (clamped-0.4)/0.35; cam.position.set(0, 3.5-t*0.5, 10-t*2) }
      else { const t = (clamped-0.75)/0.25; cam.position.set(Math.sin(t*Math.PI*0.3)*3, 3.5+t*0.5, 10+t*2) }
      cam.lookAt(0, clamped > 0.75 ? GROUND_Y + 0.5 : 0.5, 0)

      if (!isFractured.current) {
        if (clamped < 0.15) {
          setArrowState(s => ({...s, pointVisible: false, udlVisible: false }))
        } else if (clamped < 0.4) {
          const t = (clamped-0.15)/0.25
          const lf = t * 0.2
          deformBeam(lf, false); colorBeam(lf, false)
          setArrowState(s => ({...s, pointVisible: true, pointY: 5 - t*2.8, pointScale: 0.8 + t*0.2, udlVisible: false }))
        } else if (clamped < 0.75) {
          const t = (clamped-0.4)/0.35
          const lf = 0.2 + t*0.75
          deformBeam(lf, false); colorBeam(lf, false)
          const c = new THREE.Color(); c.setRGB(0.96, 0.62*(1-t*0.7), 0.04*(1-t))
          setArrowState(s => ({...s, pointVisible: true, pointY: 2.2 - t*0.5, pointScale: 1+t*0.4, pointColor: c, udlVisible: false }))
        } else {
          triggerFracture('DOWN')
        }
      }
    } else {
      const rev = 1 - clamped
      if (rev < 0.15) { cam.position.set(0, 1, 12) }
      else if (rev < 0.4) { const t = (rev-0.15)/0.25; cam.position.set(0, 1+t*2, 12-t*2) }
      else if (rev < 0.75) { const t = (rev-0.4)/0.35; cam.position.set(0, 3-t, 10-t*2) }
      else { const t = (rev-0.75)/0.25; cam.position.set(Math.sin(t*Math.PI*0.3)*4, 2+t, 8+t*2) }
      cam.lookAt(0, rev > 0.75 ? GROUND_Y + 1 : BEAM_REST_Y, 0)

      if (!isFractured.current) {
        if (rev < 0.15) { setArrowState(s => ({...s, udlVisible: false, pointVisible: false })) }
        else if (rev < 0.4) {
          const t = (rev-0.15)/0.25
          const lf = t * 0.2
          deformBeam(lf, true); colorBeam(lf, true)
          setArrowState(s => ({...s, udlVisible: true, udlY: (BEAM_REST_Y-BEAM_HEIGHT/2-2)*(1-t)+(BEAM_REST_Y-BEAM_HEIGHT/2), pointVisible: false }))
        } else if (rev < 0.75) {
          const t = (rev-0.4)/0.35
          const lf = 0.2 + t*0.75
          deformBeam(lf, true); colorBeam(lf, true)
          const c = new THREE.Color(); c.setRGB(0.23*(1-t)+t, 0.51*(1-t)+0.2*t, 0.96*(1-t)+0.4*t)
          setArrowState(s => ({...s, udlVisible: true, udlY: BEAM_REST_Y-BEAM_HEIGHT/2, udlColor: c, pointVisible: false }))
        } else {
          triggerFracture('UP')
        }
      }
    }

    // Physics for fracture pieces
    if (isFractured.current) {
      stepPiece(leftPhys.current, dt); stepPiece(rightPhys.current, dt)
      if (leftRef.current) {
        const lp = leftPhys.current
        leftRef.current.position.set(lp.x, lp.y, lp.z); leftRef.current.rotation.z = lp.angle
      }
      if (rightRef.current) {
        const rp = rightPhys.current
        rightRef.current.position.set(rp.x, rp.y, rp.z); rightRef.current.rotation.z = rp.angle
      }
    }
  })

  // Create beam geometry with vertex colors
  const beamGeo = new THREE.BoxGeometry(BEAM_LENGTH, BEAM_HEIGHT, BEAM_DEPTH, 80, 4, 1)
  const beamColors = new Float32Array(beamGeo.attributes.position.count * 3)
  for (let i = 0; i < beamColors.length; i += 3) { beamColors[i] = 0.53; beamColors[i+1] = 0.6; beamColors[i+2] = 0.67 }
  beamGeo.setAttribute('color', new THREE.BufferAttribute(beamColors, 3))

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={1.5} color={0x606080} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color={0xfff0e0} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-5, 3, -3]} intensity={1.5} color={0xf59e0b} distance={20} />

      {/* Ground */}
      <gridHelper args={[30, 30, 0x1a1a2e, 0x1a1a2e]} position={[0, GROUND_Y, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y + 0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={0x0d0d14} roughness={1} metalness={0} />
      </mesh>

      {/* Beam */}
      <mesh ref={beamRef} geometry={beamGeo} position={[0, BEAM_REST_Y, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={0x8899aa} roughness={0.4} metalness={0.6} vertexColors />
      </mesh>

      {/* Supports */}
      <Support x={-SUPPORT_OFFSET} />
      <Support x={SUPPORT_OFFSET} />

      {/* Arrows */}
      <PointArrow visible={arrowState.pointVisible} posY={arrowState.pointY} scale={arrowState.pointScale} color={arrowState.pointColor} />
      <UDLArrows visible={arrowState.udlVisible} posY={arrowState.udlY} color={arrowState.udlColor} />

      {/* Fracture pieces */}
      <mesh ref={leftRef} visible={false} castShadow receiveShadow>
        <boxGeometry args={[HALF_LEN, BEAM_HEIGHT, BEAM_DEPTH]} />
        <meshStandardMaterial color={0xcc3333} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh ref={rightRef} visible={false} castShadow receiveShadow>
        <boxGeometry args={[HALF_LEN, BEAM_HEIGHT, BEAM_DEPTH]} />
        <meshStandardMaterial color={0xcc3333} roughness={0.5} metalness={0.4} />
      </mesh>
    </>
  )
}

// ===== EXPORTED COMPONENT =====
export default function BeamScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [simMode, setSimMode] = useState<'POINT_DOWN' | 'UDL_UP'>('POINT_DOWN')

  useScrollProgress(sectionRef, useCallback((state: ScrollState) => {
    setProgress(state.progress)
    setOverlayVisible(state.progress > 0.01 && state.progress < 0.99)
    if (state.offBottom && simMode !== 'POINT_DOWN') {
      setSimMode('POINT_DOWN')
    } else if (state.offTop && simMode !== 'UDL_UP') {
      setSimMode('UDL_UP')
    }
  }, [simMode]))

  const p = simMode === 'POINT_DOWN' ? Math.max(0, Math.min(1, progress)) : 1 - Math.max(0, Math.min(1, progress))
  const isBroken = p >= 0.75
  
  const loadFraction = p < 0.15 ? 0
    : p < 0.4 ? ((p - 0.15) / 0.25) * 0.2
    : p < 0.75 ? 0.2 + ((p - 0.4) / 0.35) * 0.75
    : 0.95 // Frozen at breaking point
  
  const MAX_UDL = 50
  const loadVal = Math.round(loadFraction * (simMode === 'POINT_DOWN' ? MAX_LOAD : MAX_UDL))
  const unit = simMode === 'POINT_DOWN' ? 'kN' : 'kN/m'

  return (
    <section ref={sectionRef} id="simulation" className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          shadows
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 4, 12] }}
          gl={{ antialias: true }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color(0x0d0d14)
            scene.fog = new THREE.Fog(0x0d0d14, 15, 35)
          }}
        >
          <SceneContent progress={progress} simMode={simMode} />
        </Canvas>

        {/* Real-time Graphs (Fading in with overlay via visible prop) */}
        <Graphs
          simMode={simMode}
          loadFraction={loadFraction}
          isBroken={isBroken}
          visible={overlayVisible}
        />

        {/* Heading Text */}
        <div className={`absolute top-24 left-1/2 -translate-x-1/2 text-center transition-opacity duration-700 pointer-events-none ${overlayVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="inline-block text-xs md:text-sm tracking-[4px] uppercase font-semibold mb-2 px-4 py-1.5 rounded-full border bg-black/40 backdrop-blur-md"
            style={{ 
              color: simMode === 'POINT_DOWN' ? '#f59e0b' : '#3b82f6',
              borderColor: simMode === 'POINT_DOWN' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'
            }}>
            {simMode === 'POINT_DOWN' ? 'Stress Analysis' : 'Uplift Forces'}
          </span>
          <h2 className="font-['Outfit'] text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {simMode === 'POINT_DOWN' ? 'Concentrated Point Load' : 'Uniform Upward Load'}
          </h2>
        </div>

        {/* Overlay */}
        <div className={`sim-overlay ${overlayVisible ? 'visible' : ''}`}>
          <p className="font-['Outfit'] font-bold text-sm tracking-wider mb-2" style={{ color: isBroken ? '#ef4444' : 'var(--text-secondary)' }}>
            {isBroken ? (simMode === 'POINT_DOWN' ? '⚠ POINT FAILURE' : '⚠ UPWARD FAILURE') : `Load: ${loadVal} ${unit}`}
          </p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${loadFraction * 100}%`,
                background: isBroken
                  ? 'linear-gradient(90deg, #ef4444, #991b1b)'
                  : simMode === 'POINT_DOWN'
                    ? `linear-gradient(90deg, #f59e0b, hsl(${40 - loadFraction * 40}, 90%, 50%))`
                    : `linear-gradient(90deg, #3b82f6, hsl(${260 - loadFraction * 260}, 90%, 60%))`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

