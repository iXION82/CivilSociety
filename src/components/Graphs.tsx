import React from 'react';

interface GraphsProps {
  simMode: 'POINT_DOWN' | 'UDL_UP';
  loadFraction: number;
  isBroken: boolean;
  visible: boolean;
}

export default function Graphs({ simMode, loadFraction, isBroken, visible }: GraphsProps) {
  // Graph configuration
  const width = 200;
  const height = 150;
  const midY = height / 2;
  const padding = 20;
  const graphWidth = width - padding * 2;
  
  // Calculate max amplitude based on load
  const maxAmp = (height / 2 - 10) * loadFraction;
  
  // Colors based on state
  const color = isBroken 
    ? '#ef4444' // Red for failure
    : simMode === 'POINT_DOWN' 
      ? '#f59e0b' // Amber for Point Load 
      : '#3b82f6'; // Blue for UDL

  // ==== SVG Paths ====
  
  // SFD Path
  let sfdPath = '';
  if (simMode === 'POINT_DOWN') {
    // Point Load: Step function (Positive left, Negative right)
    sfdPath = `
      M ${padding} ${midY} 
      L ${padding} ${midY - maxAmp} 
      L ${padding + graphWidth / 2} ${midY - maxAmp} 
      L ${padding + graphWidth / 2} ${midY + maxAmp} 
      L ${padding + graphWidth} ${midY + maxAmp} 
      L ${padding + graphWidth} ${midY}
      Z
    `;
  } else {
    // UDL Upward: Linear (Negative left to Positive right)
    sfdPath = `
      M ${padding} ${midY}
      L ${padding} ${midY + maxAmp}
      L ${padding + graphWidth} ${midY - maxAmp}
      L ${padding + graphWidth} ${midY}
      Z
    `;
  }

  // BMD Path
  let bmdPath = '';
  if (simMode === 'POINT_DOWN') {
    // Point Load: Triangle (Max at center)
    // Note: BMD is usually drawn on the tension side. For downward point load, tension is at bottom.
    // So we draw it going *down* (positive Y in SVG).
    bmdPath = `
      M ${padding} ${midY}
      L ${padding + graphWidth / 2} ${midY + maxAmp}
      L ${padding + graphWidth} ${midY}
      Z
    `;
  } else {
    // UDL Upward: Parabola (Max at center)
    // Tension is at the top for upward UDL, so we draw it going *up* (negative Y in SVG).
    // Using a quadratic bezier curve (Q)
    bmdPath = `
      M ${padding} ${midY}
      Q ${padding + graphWidth / 2} ${midY - maxAmp * 2} ${padding + graphWidth} ${midY}
      Z
    `;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* SFD Graph (Left) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 glass-card p-4 hidden md:block">
        <h3 className="font-['Outfit'] text-sm tracking-wider font-bold mb-2 text-center" style={{ color }}>
          Shear Force (SFD)
        </h3>
        <svg width={width} height={height} className="overflow-visible">
          {/* Neutral Axis */}
          <line x1={padding} y1={midY} x2={width - padding} y2={midY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Graph Path */}
          <path 
            d={sfdPath} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
          />
          
          {/* Fill Area (Optional, using opacity) */}
          <path 
            d={sfdPath} 
            fill={color} 
            fillOpacity="0.1" 
          />
        </svg>
      </div>

      {/* BMD Graph (Right) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 glass-card p-4 hidden md:block">
        <h3 className="font-['Outfit'] text-sm tracking-wider font-bold mb-2 text-center" style={{ color }}>
          Bending Moment (BMD)
        </h3>
        <svg width={width} height={height} className="overflow-visible">
          {/* Neutral Axis */}
          <line x1={padding} y1={midY} x2={width - padding} y2={midY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Graph Path */}
          <path 
            d={bmdPath} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
          />
          
          {/* Fill Area */}
          <path 
            d={bmdPath} 
            fill={color} 
            fillOpacity="0.1" 
          />
        </svg>
      </div>

    </div>
  );
}
