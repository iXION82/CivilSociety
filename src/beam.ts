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

  // ===== GROUND GRID =====
  const gridHelper = new THREE.GridHelper(30, 30, 0x1a1a2e, 0x1a1a2e);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper);

  // Ground plane for shadows
  const groundGeo = new THREE.PlaneGeometry(30, 30);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0d0d14,
    roughness: 1,
    metalness: 0,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.49;
  ground.receiveShadow = true;
  scene.add(ground);

  // ===== BEAM PARAMETERS =====
  const BEAM_LENGTH = 8;
  const BEAM_HEIGHT = 0.4;
  const BEAM_DEPTH = 0.6;
  const SUPPORT_OFFSET = 3.5; // distance from center to each support

  // ===== CREATE BEAM =====
  const beamSegments = 60;
  const beamGeo = new THREE.BoxGeometry(BEAM_LENGTH, BEAM_HEIGHT, BEAM_DEPTH, beamSegments, 4, 1);
  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x8899aa,
    roughness: 0.4,
    metalness: 0.6,
    vertexColors: true,
  });

  // Initialize vertex colors (neutral grey-blue)
  const beamColors = new Float32Array(beamGeo.attributes.position.count * 3);
  for (let i = 0; i < beamColors.length; i += 3) {
    beamColors[i] = 0.53;
    beamColors[i + 1] = 0.6;
    beamColors[i + 2] = 0.67;
  }
  beamGeo.setAttribute('color', new THREE.BufferAttribute(beamColors, 3));

  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.y = 1.0;
  beam.castShadow = true;
  beam.receiveShadow = true;
  scene.add(beam);

  // Store original positions for deformation
  const originalPositions = new Float32Array(beamGeo.attributes.position.array.length);
  originalPositions.set(beamGeo.attributes.position.array);

  // ===== CREATE SUPPORTS (triangular prisms) =====
  function createSupport(x: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-0.35, 0);
    shape.lineTo(0.35, 0);
    shape.lineTo(0, 0.5);
    shape.closePath();

    const extrudeSettings = { depth: BEAM_DEPTH + 0.1, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x445566,
      roughness: 0.5,
      metalness: 0.4,
    });
    const support = new THREE.Mesh(geo, mat);
    support.position.set(x, -0.5, -(BEAM_DEPTH + 0.1) / 2);
    support.castShadow = true;
    support.receiveShadow = true;
    scene.add(support);
    return support;
  }

  const leftSupport = createSupport(-SUPPORT_OFFSET);
  const rightSupport = createSupport(SUPPORT_OFFSET);

  // ===== CREATE LOAD ARROW =====
  const arrowGroup = new THREE.Group();

  // Arrow shaft (cylinder)
  const shaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 16);
  const arrowMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.5 });
  const shaft = new THREE.Mesh(shaftGeo, arrowMat);
  shaft.position.y = 1;

  // Arrow head (cone)
  const headGeo = new THREE.ConeGeometry(0.2, 0.5, 16);
  const head = new THREE.Mesh(headGeo, arrowMat);
  head.position.y = 0;
  head.rotation.x = Math.PI; // point downward

  arrowGroup.add(shaft);
  arrowGroup.add(head);
  arrowGroup.position.set(0, 5, 0); // start high above beam
  arrowGroup.visible = false;
  scene.add(arrowGroup);

  // ===== FRACTURE PIECES =====
  const fracturedPieces: THREE.Mesh[] = [];
  let fractureCreated = false;

  function createFracturePieces() {
    if (fractureCreated) return;
    fractureCreated = true;

    // Left half
    const leftGeo = new THREE.BoxGeometry(BEAM_LENGTH / 2 - 0.05, BEAM_HEIGHT, BEAM_DEPTH);
    const leftMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5, metalness: 0.4 });
    const leftPiece = new THREE.Mesh(leftGeo, leftMat);
    leftPiece.position.copy(beam.position);
    leftPiece.position.x -= BEAM_LENGTH / 4;
    leftPiece.castShadow = true;
    leftPiece.visible = false;
    scene.add(leftPiece);
    fracturedPieces.push(leftPiece);

    // Right half
    const rightGeo = new THREE.BoxGeometry(BEAM_LENGTH / 2 - 0.05, BEAM_HEIGHT, BEAM_DEPTH);
    const rightMat = new THREE.MeshStandardMaterial({ color: 0xcc3333, roughness: 0.5, metalness: 0.4 });
    const rightPiece = new THREE.Mesh(rightGeo, rightMat);
    rightPiece.position.copy(beam.position);
    rightPiece.position.x += BEAM_LENGTH / 4;
    rightPiece.castShadow = true;
    rightPiece.visible = false;
    scene.add(rightPiece);
    fracturedPieces.push(rightPiece);
  }

  // ===== DEBRIS PARTICLES =====
  const debrisParticles: THREE.Mesh[] = [];
  let debrisCreated = false;

  function createDebris() {
    if (debrisCreated) return;
    debrisCreated = true;

    const debrisGeo = new THREE.TetrahedronGeometry(0.06);
    const debrisMat = new THREE.MeshStandardMaterial({ color: 0x997755, roughness: 0.8 });

    for (let i = 0; i < 40; i++) {
      const piece = new THREE.Mesh(debrisGeo, debrisMat.clone());
      piece.position.set(
        (Math.random() - 0.5) * 1.0,
        beam.position.y,
        (Math.random() - 0.5) * BEAM_DEPTH
      );
      piece.visible = false;
      scene.add(piece);
      debrisParticles.push(piece);
    }
  }

  createFracturePieces();
  createDebris();

  // ===== SCROLL-DRIVEN ANIMATION =====
  let scrollProgress = 0;
  let isFractured = false;

  function getScrollProgress() {
    const rect = simSection.getBoundingClientRect();
    const sectionTop = -rect.top;
    const sectionHeight = rect.height - window.innerHeight;
    return Math.max(0, Math.min(1, sectionTop / sectionHeight));
  }

  function updateSimulation(progress: number) {
    // Show/hide overlay
    if (progress > 0.01 && progress < 0.99) {
      simOverlay.classList.add('visible');
    } else {
      simOverlay.classList.remove('visible');
    }

    // ===== PHASE 1: Camera orbit in (0 - 0.15) =====
    if (progress < 0.15) {
      const t = progress / 0.15;
      camera.position.x = 8 * Math.cos(t * Math.PI * 0.5) * (1 - t) + 0;
      camera.position.z = 12 + (1 - t) * 3;
      camera.position.y = 4 + (1 - t) * 2;
      camera.lookAt(0, 0.5, 0);

      // Reset beam
      beam.visible = true;
      arrowGroup.visible = false;
      isFractured = false;
      resetBeam();
      hideFracture();
    }

    // ===== PHASE 2: Arrow comes down (0.15 - 0.4) =====
    else if (progress < 0.4) {
      const t = (progress - 0.15) / 0.25;
      camera.position.set(0, 4, 12);
      camera.lookAt(0, 0.5, 0);

      arrowGroup.visible = true;
      arrowGroup.position.y = 5 - t * 2.8; // descend toward beam
      arrowGroup.scale.setScalar(0.8 + t * 0.2);

      // Update load indicator
      const loadPercent = t * 30;
      loadBarFill.style.width = `${loadPercent}%`;
      loadLabel.textContent = `Load: ${Math.round(loadPercent * 3.3)} kN`;

      // Small deflection starts
      deformBeam(t * 0.15);
      colorBeam(t * 0.15);
    }

    // ===== PHASE 3: Increasing load, beam deflects (0.4 - 0.7) =====
    else if (progress < 0.7) {
      const t = (progress - 0.4) / 0.3;
      camera.position.set(0, 3.5 - t * 0.5, 10 - t * 2);
      camera.lookAt(0, 0.5 - t * 0.3, 0);

      arrowGroup.visible = true;
      arrowGroup.position.y = 2.2 - t * 0.6;
      arrowGroup.scale.setScalar(1.0 + t * 0.5);

      // Arrow color from amber to red
      const r = 0.96;
      const g = 0.62 * (1 - t * 0.7);
      const b = 0.04 * (1 - t);
      (arrowMat as THREE.MeshStandardMaterial).color.setRGB(r, g, b);

      // Deflection increases
      const deflection = 0.15 + t * 0.85;
      deformBeam(deflection);
      colorBeam(deflection);

      // Update load indicator
      const loadPercent = 30 + t * 60;
      loadBarFill.style.width = `${loadPercent}%`;
      loadLabel.textContent = `Load: ${Math.round(loadPercent * 3.3)} kN`;
      loadBarFill.style.background = `linear-gradient(90deg, #f59e0b, hsl(${40 - t * 40}, 90%, 50%))`;
    }

    // ===== PHASE 4: Beam fractures (0.7 - 1.0) =====
    else {
      const t = (progress - 0.7) / 0.3;

      if (!isFractured) {
        isFractured = true;
        beam.visible = false;
        arrowGroup.visible = false;

        // Show fracture pieces
        fracturedPieces.forEach(p => {
          p.visible = true;
          p.position.y = beam.position.y;
          p.rotation.set(0, 0, 0);
        });

        // Show debris
        debrisParticles.forEach(p => {
          p.visible = true;
          p.position.y = beam.position.y;
        });
      }

      // Animate fracture pieces falling & rotating
      if (fracturedPieces.length >= 2) {
        // Left piece pivots around left support
        fracturedPieces[0].position.y = beam.position.y - t * 2.5;
        fracturedPieces[0].position.x = -BEAM_LENGTH / 4 - t * 0.5;
        fracturedPieces[0].rotation.z = t * 0.5;

        // Right piece pivots around right support
        fracturedPieces[1].position.y = beam.position.y - t * 2.5;
        fracturedPieces[1].position.x = BEAM_LENGTH / 4 + t * 0.5;
        fracturedPieces[1].rotation.z = -t * 0.5;
      }

      // Debris flies outward
      debrisParticles.forEach((p, i) => {
        const angle = (i / debrisParticles.length) * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        p.position.x = Math.cos(angle) * t * speed;
        p.position.y = beam.position.y + t * (2 - i * 0.05) - t * t * 4;
        p.position.z = Math.sin(angle) * t * speed * 0.6;
        p.rotation.x += 0.1;
        p.rotation.z += 0.05;
        // Fade out with opacity
        ((p.material as THREE.MeshStandardMaterial)).opacity = 1 - t;
        ((p.material as THREE.MeshStandardMaterial)).transparent = true;
      });

      // Camera pulls back
      camera.position.set(t * 2, 4 + t * 1, 10 + t * 3);
      camera.lookAt(0, 0, 0);

      // Update load indicator
      loadBarFill.style.width = '100%';
      loadBarFill.style.background = 'linear-gradient(90deg, #ef4444, #991b1b)';
      loadLabel.textContent = '⚠ BEAM FAILURE';
      loadLabel.style.color = '#ef4444';
    }
  }

  function deformBeam(amount: number) {
    const positions = beamGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const origX = originalPositions[i];
      const origY = originalPositions[i + 1];

      // Parabolic deflection — max at center, zero at supports
      const normalizedX = origX / (BEAM_LENGTH / 2);
      const distFromCenter = Math.abs(normalizedX);
      const deflection = (1 - distFromCenter * distFromCenter) * amount * 0.8;

      positions[i + 1] = origY - deflection;
    }
    beamGeo.attributes.position.needsUpdate = true;
    beamGeo.computeVertexNormals();
  }

  function colorBeam(stress: number) {
    const colors = beamGeo.attributes.color.array as Float32Array;
    const positions = beamGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < colors.length; i += 3) {
      const vertIndex = i / 3;
      const x = positions[vertIndex * 3];
      const normalizedX = Math.abs(x) / (BEAM_LENGTH / 2);
      const localStress = (1 - normalizedX) * stress;

      // Green → Yellow → Red gradient based on stress
      const color = new THREE.Color();
      if (localStress < 0.5) {
        color.setRGB(
          0.2 + localStress * 1.6,
          0.7,
          0.2
        );
      } else {
        color.setRGB(
          1.0,
          0.7 * (1 - (localStress - 0.5) * 2),
          0.1
        );
      }
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    beamGeo.attributes.color.needsUpdate = true;
  }

  function resetBeam() {
    const positions = beamGeo.attributes.position.array as Float32Array;
    positions.set(originalPositions);
    beamGeo.attributes.position.needsUpdate = true;
    beamGeo.computeVertexNormals();

    // Reset colors
    const colors = beamGeo.attributes.color.array as Float32Array;
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = 0.53;
      colors[i + 1] = 0.6;
      colors[i + 2] = 0.67;
    }
    beamGeo.attributes.color.needsUpdate = true;

    // Reset arrow material color
    arrowMat.color.setHex(0xf59e0b);

    // Reset load label color
    loadLabel.style.color = '#f59e0b';
    loadBarFill.style.background = 'var(--gradient-main)';
  }

  function hideFracture() {
    fracturedPieces.forEach(p => p.visible = false);
    debrisParticles.forEach(p => p.visible = false);
  }

  // ===== SCROLL LISTENER =====
  function onScroll() {
    scrollProgress = getScrollProgress();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== RESIZE =====
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ===== ANIMATION LOOP =====
  function animate() {
    requestAnimationFrame(animate);
    updateSimulation(scrollProgress);
    renderer.render(scene, camera);
  }
  animate();
}
