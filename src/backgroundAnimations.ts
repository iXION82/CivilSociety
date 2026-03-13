export function initBackgroundAnimations() {
  const blocks = document.querySelectorAll('.concept-block');
  
  // Track scroll progress for each block independently
  const blockData: {
    el: HTMLElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    type: string,
    targetProgress: number,
    currentProgress: number,
    contentEl: HTMLElement,
  }[] = [];

  blocks.forEach((block) => {
    const canvas = block.querySelector('canvas') as HTMLCanvasElement;
    const content = block.querySelector('.concept-content') as HTMLElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Determine type by canvas ID
    const type = canvas.id.replace('canvas-', '');
    
    blockData.push({
      el: block as HTMLElement,
      canvas,
      ctx,
      type,
      targetProgress: 0,
      currentProgress: 0,
      contentEl: content
    });
  });

  function resizeCanvases() {
    blockData.forEach(data => {
      // High DPI screens
      const dpr = window.devicePixelRatio || 1;
      const rect = data.canvas.getBoundingClientRect();
      data.canvas.width = rect.width * dpr;
      data.canvas.height = rect.height * dpr;
      data.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
  }

  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  // Track scrolling
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    blockData.forEach(data => {
      const rect = data.el.getBoundingClientRect();
      // Calculate progress: 0 when top of block hits bottom of screen,
      // 1 when bottom of block hits top of screen.
      // But we want progress while it's pinned.
      // The block is 200vh tall. The canvas is 100vh sticky.
      // The scrollable distance while pinned is exactly 100vh.
      
      const pinStart = rect.top + scrollY; // Absolute top of block
      const pinDistance = rect.height - windowHeight; // 100vh
      
      let p = (scrollY - pinStart) / pinDistance;
      p = Math.max(0, Math.min(1, p)); // Clamp 0 to 1
      
      data.targetProgress = p;

      // Toggle glass card active state for text fade in
      if (p > 0.05 && p < 0.95) {
        data.contentEl.classList.add('active');
      } else {
        data.contentEl.classList.remove('active');
      }
    });
  }, { passive: true });

  // Render loop
  function animate() {
    requestAnimationFrame(animate);

    blockData.forEach(data => {
      // Lerp for smooth scrolling
      data.currentProgress += (data.targetProgress - data.currentProgress) * 0.1;
      const p = data.currentProgress;

      const w = data.canvas.width / (window.devicePixelRatio || 1);
      const h = data.canvas.height / (window.devicePixelRatio || 1);

      data.ctx.clearRect(0, 0, w, h);

      // Only draw if visible (roughly)
      const rect = data.el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      switch (data.type) {
        case 'construction': drawConstruction(data.ctx, w, h, p); break;
        case 'soil': drawSoil(data.ctx, w, h, p); break;
        case 'earthquake': drawEarthquake(data.ctx, w, h, p); break;
        case 'wind': drawWind(data.ctx, w, h, p); break;
        case 'bridge': drawBridge(data.ctx, w, h, p); break;
      }
    });
  }
  
  // Need to force an initial scroll event to set positions
  window.dispatchEvent(new Event('scroll'));
  animate();
}

// ===== ANIMATION DRAWING FUNCTIONS =====

function drawConstruction(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.75; // Right aligned
  const groundY = h * 0.8;
  const numFloors = 8;
  const floorWidth = 240;
  const floorHeight = 40;
  
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;

  // Ground line
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.stroke();

  // Foundation (progress 0 - 0.2)
  if (p > 0) {
    const fProg = Math.min(1, p / 0.2);
    ctx.fillStyle = `rgba(100, 100, 110, ${fProg * 0.8})`;
    ctx.fillRect(cx - floorWidth/2, groundY, floorWidth, 60 * fProg);
  }

  // Floors (progress 0.2 - 0.9)
  const buildProg = Math.max(0, (p - 0.2) / 0.7);
  const floorsToDraw = Math.floor(buildProg * numFloors);
  const currentFloorProgress = (buildProg * numFloors) % 1;

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'; // Amber skeleton
  
  for (let i = 0; i <= floorsToDraw; i++) {
    if (i === numFloors) continue;
    
    let y = groundY - (i * floorHeight);
    let drawHeight = floorHeight;
    
    // Animate the top-most floor growing upwards
    if (i === floorsToDraw) {
      drawHeight = floorHeight * currentFloorProgress;
    }
    
    // Columns
    const cols = 5;
    for (let c = 0; c < cols; c++) {
      const colX = cx - floorWidth/2 + (c / (cols-1)) * floorWidth;
      ctx.beginPath();
      ctx.moveTo(colX, y);
      ctx.lineTo(colX, y - drawHeight);
      ctx.stroke();
    }
    
    // Horizontal beams (drawn when columns reach full height)
    if (i < floorsToDraw) {
      ctx.beginPath();
      ctx.moveTo(cx - floorWidth/2, y - floorHeight);
      ctx.lineTo(cx + floorWidth/2, y - floorHeight);
      ctx.stroke();
    }
  }

  // Crane (emerges at top)
  if (buildProg > 0.1 && buildProg < 0.95) {
    const craneY = groundY - ((floorsToDraw + currentFloorProgress) * floorHeight) - 20;
    ctx.strokeStyle = '#ef4444'; // Red crane
    ctx.beginPath();
    ctx.moveTo(cx + floorWidth/2 + 20, craneY + 40); // Base
    ctx.lineTo(cx + floorWidth/2 + 20, craneY - 60); // Tower
    ctx.moveTo(cx + floorWidth/2 + 30, craneY - 40); // Arm back
    ctx.lineTo(cx - floorWidth + 20, craneY - 40); // Arm forward
    // Cable
    ctx.moveTo(cx - floorWidth/2, craneY - 40);
    ctx.lineTo(cx - floorWidth/2, craneY + (Math.sin(Date.now()/500) * 10) - 10);
    ctx.stroke();
  }
}

function drawSoil(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.25; // Left aligned
  const baseY = h * 0.4;
  const settleAmount = p * 60; // Max 60px settlement
  const buildingBaseY = baseY + settleAmount;

  // Draw soil layers
  const t = Date.now() / 2000;
  
  const layers = [
    { y: baseY, h: 80, c: '#2c251d', comp: 1.0 }, // Clay
    { y: baseY + 80, h: 120, c: '#362f26', comp: 0.6 }, // Silt
    { y: baseY + 200, h: h, c: '#1a1820', comp: 0.1 } // Bedrock
  ];

  const bw = 200; // Define BEFORE the loop uses it
  
  // Draw building FIRST so it sits behind the soil (soil has higher z-index)
  // We push the base Y down by 40px so it's always buried in the top layer
  const foundationY = buildingBaseY + 40;
  
  ctx.fillStyle = '#444455';
  ctx.fillRect(cx - bw/2, foundationY - 300, bw, 300);
  ctx.fillStyle = '#666677'; // Foundation
  ctx.fillRect(cx - bw/2 - 10, foundationY - 5, bw + 20, 40); // Taller foundation

  let currentY = baseY;
  layers.forEach((layer, i) => {
    // Compress upper layers more than lower layers based on building weight
    const layerCompression = settleAmount * layer.comp;
    const layerTop = currentY + (i === 0 ? settleAmount : layerCompression);
    
    ctx.beginPath();
    // Wavy top line
    for(let x = 0; x <= w; x += 10) {
      // Depression near the building
      let dist = Math.abs(x - cx);
      let depression = 0;
      if (dist < bw * 2) {
        // Bell curve depression
        depression = Math.cos(dist / (bw*2) * Math.PI/2) * layerCompression;
      }
      
      const wave = Math.sin(x * 0.01 + t + i) * 5;
      const y = layerTop + wave + depression;
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = layer.c;
    ctx.fill();
    
    currentY += layer.h;
  });
}

function drawEarthquake(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.75;
  const groundY = h * 0.8;
  const bw = 160;
  const bh = 400;

  // Ground line
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(w, groundY);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1 + p * 3; // Ground line thickens to show energy
  ctx.stroke();

  // Seismic waves in ground
  if (p > 0.1) {
    ctx.strokeStyle = `rgba(239, 68, 68, ${Math.sin(p * Math.PI) * 0.5})`;
    ctx.lineWidth = 2;
    for(let i=1; i<=3; i++) {
       ctx.beginPath();
       const r = (p * 500 + i * 100) % 600;
       ctx.arc(cx, groundY + 50, r, Math.PI, 0);
       ctx.stroke();
    }
  }

  // Building sway formula
  // Damped sine wave: amplitude peaks in middle of scroll
  const envelope = Math.sin(p * Math.PI); 
  // Fast shaking, tied to progress
  const shake = Math.sin(p * 50) * 80 * envelope; 

  ctx.save();
  ctx.translate(cx, groundY); // Center of rotation at base
  ctx.rotate((shake / bh)); // Rotate based on lateral deflection

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;

  // Frame
  ctx.fillRect(-bw/2, -bh, bw, bh);
  ctx.strokeRect(-bw/2, -bh, bw, bh);

  // Cross bracing (X shapes) - essential for seismic!
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  const numFloors = 5;
  const fh = bh / numFloors;
  for (let i = 0; i < numFloors; i++) {
    const yBot = -(i * fh);
    const yTop = -((i+1) * fh);
    ctx.beginPath();
    ctx.moveTo(-bw/2, yBot);
    ctx.lineTo(bw/2, yTop);
    ctx.moveTo(bw/2, yBot);
    ctx.lineTo(-bw/2, yTop);
    ctx.stroke();
  }

  // Base isolator visualization (glowing dots at base)
  if (p > 0.1) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-bw/2 + 20, 0, 8, 0, Math.PI*2);
    ctx.arc(bw/2 - 20, 0, 8, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.restore();
}

function drawWind(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.25;
  const groundY = h * 0.9;
  const bw = 140;
  const bh = 500;
  
  ctx.save();
  // Simulate building sway/flex at the top due to aerodynamic loads
  const swayAngle = p * 0.05; // Base angle (radians)
  const vibration = Math.sin(Date.now() / 50) * 0.005 * p; // High frequency low amplitude flutter
  
  ctx.translate(cx, groundY); // Pin rotation to ground
  ctx.rotate(swayAngle + vibration);
  ctx.translate(-cx, -groundY);

  // Building Frame
  ctx.fillStyle = '#222230';
  ctx.fillRect(cx - bw/2, groundY - bh, bw, bh);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;

  // Draw detailed windows (groups of vertical glass panes)
  const windowCols = 6;
  const windowSpacingX = bw / (windowCols + 1);
  for (let c = 1; c <= windowCols; c++) {
    const wx = cx - bw/2 + c * windowSpacingX;
    ctx.beginPath();
    // Leave space at bottom for lobby
    ctx.moveTo(wx, groundY - bh + 10);
    ctx.lineTo(wx, groundY - 40);
    ctx.stroke();
  }
  
  // Horizontal floors
  for (let y = groundY - bh + 30; y < groundY - 40; y += 30) {
    ctx.beginPath();
    ctx.moveTo(cx - bw/2 + 5, y);
    ctx.lineTo(cx + bw/2 - 5, y);
    ctx.stroke();
  }
  
  ctx.restore(); // Restore context to draw wind normally without rotation

  // Wind lines
  // The wind speed increases with height and progress
  const windIntensity = p * 1.5;
  ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 + p * 0.4})`;
  ctx.lineWidth = 2;

  const t = Date.now() / 1000;
  const numLines = 25;

  for (let i = 0; i < numLines; i++) {
    // Faster wind at top
    const speedScale = 1 + (1 - (i / numLines)) * 2; 
    const phaseOffset = i * 1.5; // Stagger lines
    
    // Animate x position across screen
    let x = (t * 200 * speedScale + phaseOffset * 100) % w;
    x = (x + w) % w; // Handle negative wrapping if needed (it shouldn't be)
    // Actually, drawing continuous flowing lines is better:
  }
  
  // Alternative: draw continuous flowing streamlines
  for (let i = 0; i < numLines; i++) {
    const baseY = (groundY - bh - 50) + (i / numLines) * (bh + 100);
    const speedScale = 1 + (1 - (i / numLines)); 
    const dashOffset = (t * 100 * speedScale) % 100;
    
    ctx.setLineDash([30, 70]);
    ctx.lineDashOffset = -dashOffset * (1 + windIntensity);

    ctx.beginPath();
    // Draw line from right to left (wind blowing left)
    // Wait, let's blow left to right.
    for (let x = w; x >= 0; x -= 20) {
      let y = baseY;
      
      // Deflection around building
      const distFromCenter = Math.abs(x - cx);
      if (distFromCenter < bw && y > groundY - bh && y < groundY) {
         // Push wind up or down around the building
         const pushDir = y > (groundY - bh/2) ? 1 : -1;
         const pushAmt = (bw - distFromCenter) * 0.8 * pushDir;
         y += pushAmt;
         // Simulate vortex shedding behind building
         if (x > cx) {
           y += Math.sin(x * 0.05 - t * 5) * 20 * windIntensity;
         }
      } else if (x > cx && y > groundY - bh && y < groundY) {
         // Wake turbulence behind building
         const decay = Math.max(0, 1 - (x - cx) / 400);
         y += Math.sin(x * 0.05 - t * 5 * speedScale + i) * 30 * windIntensity * decay;
      }

      if (x === w) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawBridge(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.5; // Center
  const groundY = h * 0.8;
  const towerDist = 400; // Distance between towers
  const towerH = 300;
  const deckY = groundY - 150;
  
  // Towers
  ctx.fillStyle = '#444455';
  ctx.fillRect(cx - towerDist/2 - 10, groundY - towerH, 20, towerH);
  ctx.fillRect(cx + towerDist/2 - 10, groundY - towerH, 20, towerH);
  
  // Load location (truck) moves across bridge based on progress p
  const loadX = (w * 0.1) + p * (w * 0.8);
  
  // Deck deflection formula
  // Deck is a simple line, but dips down near the load
  const maxDeflection = 30; // 30px max dip
  const TOWER_GAP = towerDist/2;
  
  ctx.strokeStyle = '#888899';
  ctx.lineWidth = 6;
  ctx.beginPath();
  
  for (let x = 0; x <= w; x += 10) {
    let y = deckY;
    
    // Apply deflection ONLY if between towers (with small padding so ends don't drop)
    if (x > cx - TOWER_GAP + 10 && x < cx + TOWER_GAP - 10) {
       // Deflection influence radius
       const distToLoad = Math.abs(x - loadX);
       if (distToLoad < 180) {
          const influence = Math.cos((distToLoad / 180) * Math.PI / 2);
          // Only deflect if load is also firmly on the suspended span
          if (loadX > cx - TOWER_GAP + 50 && loadX < cx + TOWER_GAP - 50) {
            y += influence * maxDeflection;
          }
       }
    }
    
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Main suspension cable
  ctx.strokeStyle = '#f59e0b'; // Amber cables
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Left anchor to left tower
  ctx.moveTo(cx - towerDist/2 - 150, deckY);
  ctx.quadraticCurveTo(cx - towerDist/2 - 75, groundY - towerH + 20, cx - towerDist/2, groundY - towerH);
  
  // Left tower to right tower (parabola)
  // Deflect parabola slightly based on load
  let loadSag = 0;
  if (loadX > cx - towerDist/2 && loadX < cx + towerDist/2) {
    // Parabola sags more towards the load
    loadSag = maxDeflection * 0.8; 
  }
  
  // To draw a dynamic parabola we use bezier or quadratic. 
  // A standard suspension cable is a parabola, best approximated with quadratic.
  // The control point x needs to shift towards the load.
  let cpX = cx;
  if(loadX > cx - towerDist/2 && loadX < cx + towerDist/2) {
     cpX = cx + (loadX - cx) * 0.3; // Shift control point slightly towards load
  }
  
  ctx.quadraticCurveTo(cpX, deckY + 50 + loadSag, cx + towerDist/2, groundY - towerH);
  
  // Right tower to right anchor
  ctx.quadraticCurveTo(cx + towerDist/2 + 75, groundY - towerH + 20, cx + towerDist/2 + 150, deckY);
  ctx.stroke();

  // Draw suspender cables (vertical lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  const numSuspenders = 30;
  for (let i = 1; i < numSuspenders; i++) {
    const x = cx - towerDist/2 + (i / numSuspenders) * towerDist;
    // Find y of main cable at x by interpolation
    const t = i / numSuspenders;
    // Quadratic bezier y formula: (1-t)^2*y1 + 2(1-t)t*yc + t^2*y2
    const y1 = groundY - towerH;
    const yc = deckY + 50 + loadSag;
    const y2 = groundY - towerH;
    const cableY = Math.pow(1-t, 2)*y1 + 2*(1-t)*t*yc + Math.pow(t, 2)*y2;
    
    // Find y of deck at x
    let dY = deckY;
    const distToLoad = Math.abs(x - loadX);
    if (distToLoad < 180 && loadX > cx - TOWER_GAP + 50 && loadX < cx + TOWER_GAP - 50) {
      if (x > cx - TOWER_GAP + 10 && x < cx + TOWER_GAP - 10) { // Safety clamp for suspenders too
         dY += Math.cos((distToLoad / 180) * Math.PI / 2) * maxDeflection;
      }
    }
    
    ctx.beginPath();
    ctx.moveTo(x, cableY);
    ctx.lineTo(x, dY);
    ctx.stroke();
  }

  // Draw Load (Truck)
  ctx.fillStyle = '#ef4444';
  let tY = deckY;
  if (loadX > cx - TOWER_GAP + 50 && loadX < cx + TOWER_GAP - 50) {
      tY += maxDeflection; // Load is at center of deflection
  }
  ctx.fillRect(loadX - 20, tY - 15, 40, 15);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(loadX - 10, tY, 4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(loadX + 10, tY, 4, 0, Math.PI*2); ctx.fill();
}
