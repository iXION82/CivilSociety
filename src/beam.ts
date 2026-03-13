import * as THREE from 'three';

export function initBeamSimulation() {
  const canvas = document.getElementById('beam-canvas') as HTMLCanvasElement;
  const simSection = document.getElementById('simulation') as HTMLElement;
  const simOverlay = document.getElementById('sim-overlay') as HTMLElement;
  const loadBarFill = document.getElementById('load-bar-fill') as HTMLElement;
  const loadLabel = document.getElementById('load-label') as HTMLElement;

  if (!canvas || !simSection) return;

  // ===== RENDERER =====
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ===== SCENE =====
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d14);
  scene.fog = new THREE.Fog(0x0d0d14, 15, 35);

  // ===== CAMERA =====
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 4, 12);
  camera.lookAt(0, 0.5, 0);

  // ===== LIGHTS =====
  const ambientLight = new THREE.AmbientLight(0x404060, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff0e0, 1.2);
  dirLight.position.set(5, 8, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 30;
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;
  scene.add(dirLight);

  const rimLight = new THREE.PointLight(0xf59e0b, 0.6, 20);
  rimLight.position.set(-5, 3, -3);
  scene.add(rimLight);

  // ===== GROUND =====
  const GROUND_Y = -0.5;

  const gridHelper = new THREE.GridHelper(30, 30, 0x1a1a2e, 0x1a1a2e);
  gridHelper.position.y = GROUND_Y;
  scene.add(gridHelper);

  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0d0d14,
    roughness: 1,
    metalness: 0,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y + 0.01;
  ground.receiveShadow = true;
  scene.add(ground);

  // ===== BEAM PARAMETERS =====
  const BEAM_LENGTH = 8;
  const BEAM_HEIGHT = 0.4;
  const BEAM_DEPTH = 0.6;
  const SUPPORT_OFFSET = 3.5;
  const SUPPORT_HEIGHT = 0.6;
  const BEAM_REST_Y = GROUND_Y + SUPPORT_HEIGHT + BEAM_HEIGHT / 2;
  const SPAN = SUPPORT_OFFSET * 2;
  const MAX_LOAD = 300;
  const MAX_DEFLECTION = SUPPORT_HEIGHT * 0.85; // don't go all the way to ground

  // ===== CREATE BEAM =====
  const beamSegments = 80;
  const beamGeo = new THREE.BoxGeometry(BEAM_LENGTH, BEAM_HEIGHT, BEAM_DEPTH, beamSegments, 4, 1);
  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x8899aa,
    roughness: 0.4,
    metalness: 0.6,
    vertexColors: true,
  });

  const beamColors = new Float32Array(beamGeo.attributes.position.count * 3);
  for (let i = 0; i < beamColors.length; i += 3) {
    beamColors[i] = 0.53;
    beamColors[i + 1] = 0.6;
    beamColors[i + 2] = 0.67;
  }
  beamGeo.setAttribute('color', new THREE.BufferAttribute(beamColors, 3));

  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = BEAM_REST_Y;
  beam.castShadow = true;
  beam.receiveShadow = true;
  scene.add(beam);

  const originalPositions = new Float32Array(beamGeo.attributes.position.array.length);
  originalPositions.set(beamGeo.attributes.position.array);

  // ===== CREATE SUPPORTS =====
  function createSupport(x: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, 0);
    shape.lineTo(0.4, 0);
    shape.lineTo(0, SUPPORT_HEIGHT);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, { depth: BEAM_DEPTH + 0.1, bevelEnabled: false });
    const mat = new THREE.MeshStandardMaterial({ color: 0x556677, roughness: 0.5, metalness: 0.4 });
    const support = new THREE.Mesh(geo, mat);
    support.position.set(x, GROUND_Y, -(BEAM_DEPTH + 0.1) / 2);
    support.castShadow = true;
    support.receiveShadow = true;
    scene.add(support);
    return support;
  }

  createSupport(-SUPPORT_OFFSET);
  createSupport(SUPPORT_OFFSET);

  // ===== LOAD ARROW =====
  const arrowGroup = new THREE.Group();
  const shaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 16);
  const arrowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.5 });
  const shaft = new THREE.Mesh(shaftGeo, arrowMat);
  shaft.position.y = 1;
  const headGeo = new THREE.ConeGeometry(0.2, 0.5, 16);
  const head = new THREE.Mesh(headGeo, arrowMat);
  head.position.y = 0;
  head.rotation.x = Math.PI;
  arrowGroup.add(shaft, head);
  arrowGroup.position.set(0, 5, 0);
  arrowGroup.visible = false;
  scene.add(arrowGroup);

  // ===== FRACTURE PIECES (free-fall, no pivot) =====
  const HALF_LEN = BEAM_LENGTH / 2 - 0.05;

  const leftHalfGeo = new THREE.BoxGeometry(HALF_LEN, BEAM_HEIGHT, BEAM_DEPTH);
  const leftFracMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5, metalness: 0.4 });
  const leftHalf = new THREE.Mesh(leftHalfGeo, leftFracMat);
  leftHalf.castShadow = true;
  leftHalf.receiveShadow = true;
  leftHalf.visible = false;
  scene.add(leftHalf);

  const rightHalfGeo = new THREE.BoxGeometry(HALF_LEN, BEAM_HEIGHT, BEAM_DEPTH);
  const rightFracMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5, metalness: 0.4 });
  const rightHalf = new THREE.Mesh(rightHalfGeo, rightFracMat);
  rightHalf.castShadow = true;
  rightHalf.receiveShadow = true;
  rightHalf.visible = false;
  scene.add(rightHalf);

  // ===== FRACTURE PHYSICS STATE =====
  // Simple free-fall: each piece has position, velocity, rotation, angular velocity
  // Pieces fall under gravity and stop when their bottom edge hits the ground
  interface PiecePhysics {
    x: number;
    y: number;
    vx: number;
    vy: number;
    angle: number;    // rotation around Z
    va: number;       // angular velocity
    resting: boolean;
  }

  const GRAVITY = 9.81;
  const BOUNCE_DAMPING = 0.3;    // energy kept on bounce
  const REST_THRESHOLD = 0.05;   // velocity below which we consider resting

  let leftPhys: PiecePhysics = makeFreshPhysics(-BEAM_LENGTH / 4, -1);
  let rightPhys: PiecePhysics = makeFreshPhysics(BEAM_LENGTH / 4, 1);
  let isFractured = false;
  let scrollProgress = 0;

  function makeFreshPhysics(startX: number, side: number): PiecePhysics {
    return {
      x: startX,
      y: BEAM_REST_Y,
      vx: side * 0.3,   // slight horizontal push outward
      vy: 0,
      angle: 0,
      va: side * 0.5,    // slight spin
      resting: false,
    };
  }

  // Get the lowest Y point of a rotated box (center at y, rotated by angle, half-height h/2)
  function getLowestY(cy: number, angle: number): number {
    // The four corners of the box cross-section are at offsets:
    // (±halfLen, ±halfHeight) rotated by angle
    // We only care about the lowest Y
    const hw = HALF_LEN / 2;
    const hh = BEAM_HEIGHT / 2;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Corner offsets in Y after rotation
    const y1 = -hw * sinA - hh * cosA;
    const y2 = -hw * sinA + hh * cosA;
    const y3 = hw * sinA - hh * cosA;
    const y4 = hw * sinA + hh * cosA;

    return cy + Math.min(y1, y2, y3, y4);
  }

  function stepPiece(phys: PiecePhysics, dt: number) {
    if (phys.resting) return;

    // Apply gravity
    phys.vy -= GRAVITY * dt;

    // Update position
    phys.x += phys.vx * dt;
    phys.y += phys.vy * dt;
    phys.angle += phys.va * dt;

    // Check ground collision
    const lowestY = getLowestY(phys.y, phys.angle);
    if (lowestY <= GROUND_Y) {
      // Push piece up so lowest point is at ground
      phys.y += (GROUND_Y - lowestY);

      // Bounce or rest
      if (Math.abs(phys.vy) < REST_THRESHOLD && Math.abs(phys.va) < REST_THRESHOLD) {
        // Come to rest
        phys.vy = 0;
        phys.vx = 0;
        phys.va = 0;
        phys.resting = true;

        // Settle to flat on ground
        phys.angle = 0;
        phys.y = GROUND_Y + BEAM_HEIGHT / 2;
      } else {
        // Bounce
        phys.vy = Math.abs(phys.vy) * BOUNCE_DAMPING;
        phys.vx *= 0.8;
        phys.va *= -BOUNCE_DAMPING;
      }
    }
  }

  function applyPhysicsToMesh(mesh: THREE.Mesh, phys: PiecePhysics) {
    mesh.position.x = phys.x;
    mesh.position.y = phys.y;
    mesh.position.z = 0;
    mesh.rotation.z = phys.angle;
  }

  // ===== EULER-BERNOULLI DEFLECTION =====
  function beamDeflectionAtX(xFromCenter: number, loadFraction: number): number {
    const normalizedDist = Math.abs(xFromCenter) / SUPPORT_OFFSET;
    if (normalizedDist > 1.0) return 0;

    const L = SPAN;
    const xFromLeft = (1 - normalizedDist) * (L / 2);
    const normalizedDeflection = (xFromLeft * (3 * L * L - 4 * xFromLeft * xFromLeft)) / (L * L * L);

    return normalizedDeflection * loadFraction * MAX_DEFLECTION;
  }

  function deformBeam(loadFraction: number) {
    const positions = beamGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const origX = originalPositions[i];
      const origY = originalPositions[i + 1];
      const deflection = beamDeflectionAtX(origX, loadFraction);

      const worldY = BEAM_REST_Y + origY - deflection;
      const clampedWorldY = Math.max(worldY, GROUND_Y + 0.02);
      positions[i + 1] = clampedWorldY - BEAM_REST_Y;
    }
    beamGeo.attributes.position.needsUpdate = true;
    beamGeo.computeVertexNormals();
  }

  function colorBeam(loadFraction: number) {
    const colors = beamGeo.attributes.color.array as Float32Array;
    for (let i = 0; i < colors.length; i += 3) {
      const vertIndex = i / 3;
      const x = originalPositions[vertIndex * 3];
      const normalizedDist = Math.abs(x) / SUPPORT_OFFSET;
      const localStress = Math.max(0, (1 - normalizedDist)) * loadFraction;

      let r: number, g: number, b: number;
      if (localStress < 0.2) {
        r = 0.53; g = 0.6; b = 0.67;
      } else if (localStress < 0.5) {
        const t = (localStress - 0.2) / 0.3;
        r = 0.53 * (1 - t) + 0.2 * t;
        g = 0.6 * (1 - t) + 0.8 * t;
        b = 0.67 * (1 - t) + 0.2 * t;
      } else if (localStress < 0.8) {
        const t = (localStress - 0.5) / 0.3;
        r = 0.2 * (1 - t) + 1.0 * t;
        g = 0.8 * (1 - t) + 0.85 * t;
        b = 0.2 * (1 - t) + 0.1 * t;
      } else {
        const t = (localStress - 0.8) / 0.2;
        r = 1.0;
        g = 0.85 * (1 - t) + 0.15 * t;
        b = 0.1 * (1 - t);
      }
      colors[i] = r;
      colors[i + 1] = g;
      colors[i + 2] = b;
    }
    beamGeo.attributes.color.needsUpdate = true;
  }

  function resetBeam() {
    const positions = beamGeo.attributes.position.array as Float32Array;
    positions.set(originalPositions);
    beamGeo.attributes.position.needsUpdate = true;
    beamGeo.computeVertexNormals();

    const colors = beamGeo.attributes.color.array as Float32Array;
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0.53;
      colors[i + 1] = 0.6;
      colors[i + 2] = 0.67;
    }
    beamGeo.attributes.color.needsUpdate = true;

    arrowMat.color.setHex(0xf59e0b);
    loadLabel.style.color = '#f59e0b';
    loadBarFill.style.background = 'var(--gradient-main)';
  }

  // ===== SCROLL PROGRESS =====
  function getScrollProgress(): number {
    const rect = simSection.getBoundingClientRect();
    const sectionTop = -rect.top;
    const sectionHeight = rect.height - window.innerHeight;
    return Math.max(0, Math.min(1, sectionTop / sectionHeight));
  }

  // ===== UPDATE =====
  function updateSimulation(progress: number, dt: number) {
    if (progress > 0.01 && progress < 0.99) {
      simOverlay.classList.add('visible');
    } else {
      simOverlay.classList.remove('visible');
    }

    // ===== PHASE 1: Camera intro + reset (0 – 0.15) =====
    if (progress < 0.15) {
      const t = progress / 0.15;
      camera.position.x = 8 * Math.cos(t * Math.PI * 0.5) * (1 - t);
      camera.position.z = 12 + (1 - t) * 3;
      camera.position.y = 4 + (1 - t) * 2;
      camera.lookAt(0, 0.5, 0);

      // Full reset
      beam.visible = true;
      arrowGroup.visible = false;
      leftHalf.visible = false;
      rightHalf.visible = false;
      isFractured = false;
      leftPhys = makeFreshPhysics(-BEAM_LENGTH / 4, -1);
      rightPhys = makeFreshPhysics(BEAM_LENGTH / 4, 1);
      resetBeam();

      loadBarFill.style.width = '0%';
      loadLabel.textContent = 'Load: 0 kN';
    }

    // ===== PHASE 2: Arrow descends (0.15 – 0.4) =====
    else if (progress < 0.4 && !isFractured) {
      const t = (progress - 0.15) / 0.25;
      camera.position.set(0, 4, 12);
      camera.lookAt(0, 0.5, 0);

      beam.visible = true;
      arrowGroup.visible = true;
      leftHalf.visible = false;
      rightHalf.visible = false;

      arrowGroup.position.y = 5 - t * 2.8;
      arrowGroup.scale.setScalar(0.8 + t * 0.2);

      const loadFraction = t * 0.2;
      deformBeam(loadFraction);
      colorBeam(loadFraction);

      const loadKN = Math.round(loadFraction * MAX_LOAD);
      loadBarFill.style.width = `${loadFraction * 100}%`;
      loadLabel.textContent = `Load: ${loadKN} kN`;
    }

    // ===== PHASE 3: Heavy load, beam deflects (0.4 – 0.75) =====
    else if (progress < 0.75 && !isFractured) {
      const t = (progress - 0.4) / 0.35;
      camera.position.set(0, 3.5 - t * 0.5, 10 - t * 2);
      camera.lookAt(0, 0.5 - t * 0.3, 0);

      beam.visible = true;
      arrowGroup.visible = true;
      leftHalf.visible = false;
      rightHalf.visible = false;

      arrowGroup.position.y = 2.2 - t * 0.5;
      arrowGroup.scale.setScalar(1.0 + t * 0.4);

      const r = 0.96;
      const g = 0.62 * (1 - t * 0.7);
      const bCol = 0.04 * (1 - t);
      arrowMat.color.setRGB(r, g, bCol);

      const loadFraction = 0.2 + t * 0.75;
      deformBeam(loadFraction);
      colorBeam(loadFraction);

      const loadKN = Math.round(loadFraction * MAX_LOAD);
      loadBarFill.style.width = `${loadFraction * 100}%`;
      loadLabel.textContent = `Load: ${loadKN} kN`;
      loadBarFill.style.background = `linear-gradient(90deg, #f59e0b, hsl(${40 - t * 40}, 90%, 50%))`;
    }

    // ===== PHASE 4: Fracture + free-fall (0.75 – 1.0) =====
    else if (progress >= 0.75) {
      if (!isFractured) {
        isFractured = true;
        beam.visible = false;
        arrowGroup.visible = false;

        // Show fracture pieces, initialize physics
        leftHalf.visible = true;
        rightHalf.visible = true;
        leftPhys = makeFreshPhysics(-BEAM_LENGTH / 4, -1);
        rightPhys = makeFreshPhysics(BEAM_LENGTH / 4, 1);
      }

      // Step physics with real delta time
      stepPiece(leftPhys, dt);
      stepPiece(rightPhys, dt);

      // Apply to meshes
      applyPhysicsToMesh(leftHalf, leftPhys);
      applyPhysicsToMesh(rightHalf, rightPhys);

      // Camera watches the fall
      const orbitT = (progress - 0.75) / 0.25;
      camera.position.set(
        Math.sin(orbitT * Math.PI * 0.3) * 3,
        3.5 + orbitT * 0.5,
        10 + orbitT * 2
      );
      camera.lookAt(0, GROUND_Y + 0.5, 0);

      // Load indicator
      loadBarFill.style.width = '100%';
      loadBarFill.style.background = 'linear-gradient(90deg, #ef4444, #991b1b)';
      loadLabel.textContent = '⚠ BEAM FAILURE';
      loadLabel.style.color = '#ef4444';
    }
  }

  // ===== EVENTS =====
  window.addEventListener('scroll', () => {
    scrollProgress = getScrollProgress();
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ===== RENDER LOOP =====
  let prevTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min((now - prevTime) / 1000, 0.05);
    prevTime = now;

    updateSimulation(scrollProgress, dt);
    renderer.render(scene, camera);
  }
  animate();
}
