# ASCE Student Chapter — IIT (ISM) Dhanbad

A high-performance, interactive, and visually stunning web application built for the **American Society of Civil Engineers (ASCE) Student Chapter** at the **Indian Institute of Technology (Indian School of Mines), Dhanbad**.

This project provides an immersive experience showcasing structural civil engineering concepts using interactive 3D physics simulations (Three.js/React Three Fiber) and dynamic 2D animations (HTML5 Canvas).

---

## 🚀 Key Features

### 1. **Interactive 3D Beam Simulation** ([BeamScene.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/components/BeamScene.tsx))
- Fully-interactive 3D physics-based structural beam deflection and fracture simulator.
- **Scroll-Linked Animations**: Utilizes scroll progress to apply dynamic loading.
- **Loading Configurations**:
  - **Point Load (Concentrated)**: Upward/downward force applied at a single point, resulting in bending deflection, color mapping for stress distribution, and central fracture.
  - **UDL (Uniformly Distributed Load)**: Load distributed along the beam span, demonstrating parabolic bending and support reaction force dynamics.
- **Live Structural Diagrams** ([Graphs.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/components/Graphs.tsx)): Renders live-updating **Shear Force Diagrams (SFD)** and **Bending Moment Diagrams (BMD)** using responsive SVGs linked to the load intensity.

### 2. **2D Canvas Physics Visualizations** ([ConceptBlock.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/components/ConceptBlock.tsx))
Interactive, scroll-animated HTML5 Canvas scenes illustrating fundamental civil engineering dynamics:
- **🏗️ Construction Time-lapse**: Sequential phasing showing foundation casting, column/beam raising, slab installation, and dynamic tower crane operations.
- **🏠 Soil Settlement**: Layered soil structure demonstrating uneven clay consolidation, ground compression, and building tilting.
- **🌍 Earthquake Dynamics**: Seismic wave generation, base isolation dampening, and structural response in cross-braced vs. unbraced high-rise buildings.
- **💨 Aerodynamic Wind Loads**: Airflow lines, vortex shedding, and high-rise structural flex under dynamic wind pressure.
- **🌊 Hydrostatic Pressure (Dam)**: Exponential pressure distribution against a retaining wall, showing base thickening design principles.

### 3. **Academic & Leadership Directories**
- **Know Your Professors** ([Professors.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/pages/Professors.tsx)): Profile directory of the Civil Engineering Department faculty at IIT (ISM) Dhanbad, equipped with contact information and direct links to their institutional profiles.
- **Student Leadership** ([Team.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/pages/Team.tsx)): Current student committee directory detailing coordinates of chapter officers.
- **Historical Timeline** ([ISM.tsx](file:///c:/Users/lenov/OneDrive/Desktop/Civil%20Society/three/src/pages/ISM.tsx)): Interactive milestone timeline highlighting the legacy of IIT (ISM) Dhanbad from its 1926 inception under Lord Irwin through its Centenary Year (2025-26).

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber (R3F)](https://r3f.docs.pmnd.rs/) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation Platform**: [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)

---

## 📁 Directory Structure

```text
three/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── assets/             # Brand logos, SVGs, and images
│   ├── components/         # Reusable UI & Simulation Components
│   │   ├── BeamScene.tsx   # Core 3D structural beam simulator
│   │   ├── Graphs.tsx      # SVG-based live SFD & BMD graphs
│   │   ├── ConceptBlock.tsx# HTML5 Canvas animations for core concepts
│   │   ├── Navbar.tsx      # Responsive header with branding
│   │   ├── Footer.tsx      # Interactive page footer
│   │   └── PageLoader.tsx  # Dynamic loading screen
│   ├── hooks/
│   │   └── useScrollProgress.ts # Custom scroll state tracker
│   ├── pages/              # App views / routed components
│   │   ├── Home.tsx        # Homepage containing Hero, About, and Sim
│   │   ├── ISM.tsx         # IIT (ISM) Dhanbad History & Rankings
│   │   ├── Professors.tsx  # Department Faculty Directory
│   │   ├── Team.tsx        # Student Executive Committee
│   │   ├── Events.tsx      # Upcoming ASCE Events timeline
│   │   └── Alumni.tsx      # Alumni Portal (Coming Soon)
│   ├── App.tsx             # Route declarations & main layout wrapper
│   ├── index.css           # Global custom styles & tailwind imports
│   └── main.tsx            # Application entry point
├── package.json            # Dependencies & build scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Setup Instructions

1. Navigate to the project root directory:
   ```bash
   cd three
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Spin up the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

4. Build the application for production:
   ```bash
   npm run build
   ```
   This creates a static production build in the `dist/` directory.

5. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🛡️ License
This project is open-source and maintained by the ASCE Student Chapter, IIT (ISM) Dhanbad.
