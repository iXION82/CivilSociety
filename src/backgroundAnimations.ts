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
        case 'dam': drawDam(data.ctx, w, h, p); break;
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
  const swayAngle = -p * 0.05; // Base angle (radians) - Negative because wind blows Right->Left
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

function drawDam(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
  const cx = w * 0.5; // Center
  const groundY = h * 0.9;
  const damHeight = 600;
  const damTopY = groundY - damHeight; // Very tall dam
  
  // The water level rises from the bottom as you scroll
  // Add a small base water level so it's not empty
  const waterDepth = (damHeight * 0.1) + p * (damHeight * 0.85); 
  const waterSurfaceY = groundY - waterDepth;

  // Draw Water (Left side of the dam)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)'; // Light blue transparent
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(cx, groundY);
  ctx.lineTo(cx, waterSurfaceY);
  
  // Wavy water surface
  const t = Date.now() / 500;
  for (let x = cx; x >= 0; x -= 20) {
    const waveY = Math.sin(x * 0.05 + t) * 10;
    ctx.lineTo(x, waterSurfaceY + waveY);
  }
  ctx.lineTo(0, waterSurfaceY);
  ctx.fill();

  // Draw Dam (Gravity Dam Profile - thicker at base)
  ctx.fillStyle = '#444455';
  ctx.beginPath();
  ctx.moveTo(cx, groundY); // Heel (upstream)
  ctx.lineTo(cx + 250, groundY); // Toe (downstream)
  ctx.lineTo(cx + 40, damTopY); // Top downstream edge
  ctx.lineTo(cx, damTopY); // Top upstream edge (vertical face)
  ctx.fill();

  // Draw foundation line
  ctx.strokeStyle = '#2c251d';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 5);
  ctx.lineTo(w, groundY + 5);
  ctx.stroke();

  // Draw Hydrostatic Pressure Distribution (Triangular load)
  // Pressure = density * gravity * depth
  // Represented as horizontal arrows pushing against the vertical face (cx)
  if (waterDepth > 50) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // Red arrows
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.lineWidth = 2;

    const numArrows = 15;
    // We only draw arrows underwater
    for (let i = 1; i <= numArrows; i++) {
      const y = waterSurfaceY + (i / numArrows) * waterDepth;
      
      // Depth relative to surface determines pressure (arrow length)
      const depthAtY = y - waterSurfaceY;
      const pressureMagnitude = depthAtY * 0.6; // Scale factor for visual

      if (pressureMagnitude > 5) {
        const arrowStartX = cx - pressureMagnitude - 10; // Keep it slightly off the wall
        const arrowEndX = cx - 10;

        // Draw shaft
        ctx.beginPath();
        ctx.moveTo(arrowStartX, y);
        ctx.lineTo(arrowEndX, y);
        ctx.stroke();

        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowEndX, y);
        ctx.lineTo(arrowEndX - 10, y - 5);
        ctx.lineTo(arrowEndX - 10, y + 5);
        ctx.fill();
      }
    }

    // Draw the bounding triangle of the pressure distribution
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - 10, waterSurfaceY);
    ctx.lineTo(cx - (waterDepth * 0.6) - 10, groundY);
    ctx.lineTo(cx - 10, groundY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Visual stress on the dam (color shift at base based on total water volume)
  // Only show stress when water is high
  if (p > 0.5) {
     const stressIntensity = (p - 0.5) * 2; // 0 to 1
     const gradient = ctx.createLinearGradient(cx, groundY, cx + 250, groundY - damHeight/2);
     gradient.addColorStop(0, `rgba(245, 158, 11, ${stressIntensity * 0.4})`); // Amber stress at toe
     gradient.addColorStop(1, 'rgba(68, 68, 85, 0)'); // Normal color higher up
     
     ctx.fillStyle = gradient;
     ctx.beginPath();
     ctx.moveTo(cx, groundY);
     ctx.lineTo(cx + 250, groundY);
     ctx.lineTo(cx + 40, damTopY);
     ctx.lineTo(cx, damTopY);
     ctx.fill();
  }
}
