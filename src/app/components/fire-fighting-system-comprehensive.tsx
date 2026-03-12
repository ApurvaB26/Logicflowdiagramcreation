import React from "react";

// =====================================================================
// COMPREHENSIVE FIRE FIGHTING SYSTEM CALCULATION
// Consolidates: Fire Pump Head + Fire Tank + Jockey/Drencher + 
// Terrace Booster + Hydraulic Dashboard — ALL IN ONE FLOWCHART
// =====================================================================

export function FireFightingSystemCalcSVG() {
  return (
    <svg
      viewBox="0 0 2400 8500"
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="inputGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#dbeafe", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#bfdbfe", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="calcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fef3c7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fde68a", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="outputGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#d1fae5", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a7f3d0", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="safetyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ffe4e6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#fecdd3", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ede9fe", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ddd6fe", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#cffafe", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a5f3fc", stopOpacity: 1 }} />
        </linearGradient>

        {/* Drop Shadow */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feFlood floodColor="#000000" floodOpacity="0.15" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ========================================== */}
      {/* MASTER HEADER */}
      {/* ========================================== */}
      <g id="master-header">
        <rect x="40" y="30" width="2320" height="110" fill="url(#headerGrad)" stroke="#991b1b" strokeWidth="3" rx="12" filter="url(#dropShadow)" />
        <text x="120" y="70" fontSize="36" fontWeight="800" fill="#ffffff">
          🔥 COMPREHENSIVE FIRE FIGHTING SYSTEM — COMPLETE DESIGN PACKAGE
        </text>
        <text x="120" y="105" fontSize="14" fontWeight="600" fill="#fef3c7">
          Pump Head | Tank Sizing | Jockey/Drencher | Terrace Booster | Multi-Zone Hydraulics | Pressure Profile | BOM
        </text>
        <text x="120" y="125" fontSize="12" fontWeight="500" fill="#fca5a5">
          Standards: IS-15105 / NFPA-13 / IS-5290 / NBC Part 4 | Project: Lodha Crown Tower-B | Hazard: Ordinary II
        </text>
      </g>

      {/* ========================================== */}
      {/* PART A: PROJECT INITIATION & DATA SOURCE */}
      {/* ========================================== */}
      <g id="part-a">
        <rect x="40" y="170" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="202" fontSize="20" fontWeight="700" fill="#ffffff">
          PART A: PROJECT INITIATION &amp; DATA SOURCE SELECTION
        </text>

        {/* Project Selection */}
        <rect x="40" y="240" width="740" height="90" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="265" fontSize="14" fontWeight="700" fill="#1e40af">
          STEP A1: Project Selection &amp; Building Profile
        </text>
        <text x="60" y="285" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          • Project: Lodha Crown Tower-B (High-Rise Residential)
        </text>
        <text x="60" y="303" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          • Floors: 32F + 2B | Height: 112.2m | Occupancy: 320 units
        </text>
        <text x="60" y="321" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          • Location: Mumbai (Zone III seismic) | Built-up: 45,000 sqm
        </text>

        {/* CFO NOC Toggle */}
        <rect x="820" y="240" width="740" height="90" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="840" y="265" fontSize="14" fontWeight="700" fill="#92400e">
          STEP A2: Data Source Toggle (CFO NOC vs NBC)
        </text>
        <text x="840" y="285" fontSize="12" fill="#78350f" fontFamily="monospace">
          🔀 IF CFO_NOC_Available == TRUE:
        </text>
        <text x="860" y="303" fontSize="11" fill="#78350f" fontFamily="monospace">
          → Extract: Tank capacity, pump specs, sprinkler density
        </text>
        <text x="840" y="321" fontSize="12" fill="#78350f" fontFamily="monospace">
          ELSE: Apply NBC 2016 Part 4 + UDCPR defaults
        </text>

        {/* Auto Extract */}
        <rect x="1600" y="240" width="760" height="90" fill="url(#purpleGrad)" stroke="#8b5cf6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1620" y="265" fontSize="14" fontWeight="700" fill="#5b21b6">
          STEP A3: Automated Data Extraction
        </text>
        <text x="1620" y="285" fontSize="11" fill="#6b21a8" fontFamily="monospace">
          From CFO NOC PDF: OCR → Parse "Fire Tank: 510 KL"
        </text>
        <text x="1620" y="303" fontSize="11" fill="#6b21a8" fontFamily="monospace">
          From Architect DWG: Extract Floor-to-Floor = 3.35m
        </text>
        <text x="1620" y="321" fontSize="11" fill="#6b21a8" fontFamily="monospace">
          Validation: User confirms extracted values before proceeding
        </text>
      </g>

      {/* ========================================== */}
      {/* PART B: HAZARD CLASS & WATER DEMAND */}
      {/* ========================================== */}
      <g id="part-b">
        <rect x="40" y="360" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="392" fontSize="20" fontWeight="700" fill="#ffffff">
          PART B: HAZARD CLASSIFICATION &amp; WATER DEMAND CALCULATION
        </text>

        {/* Hazard Class Grid */}
        <rect x="40" y="430" width="1140" height="180" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="455" fontSize="14" fontWeight="700" fill="#1e40af">
          B1: OCCUPANCY HAZARD CLASS MATRIX (IS-15105 Table 1)
        </text>
        
        {/* Hazard Table */}
        <rect x="70" y="470" width="280" height="30" fill="#1e293b" />
        <text x="90" y="490" fontSize="11" fontWeight="700" fill="#ffffff">HAZARD CLASS</text>
        <rect x="350" y="470" width="200" height="30" fill="#1e293b" />
        <text x="370" y="490" fontSize="11" fontWeight="700" fill="#ffffff">DENSITY (L/min/m²)</text>
        <rect x="550" y="470" width="200" height="30" fill="#1e293b" />
        <text x="570" y="490" fontSize="11" fontWeight="700" fill="#ffffff">AREA (m²)</text>
        <rect x="750" y="470" width="220" height="30" fill="#1e293b" />
        <text x="770" y="490" fontSize="11" fontWeight="700" fill="#ffffff">DURATION (min)</text>
        <rect x="970" y="470" width="190" height="30" fill="#1e293b" />
        <text x="990" y="490" fontSize="11" fontWeight="700" fill="#ffffff">TYPICAL USE</text>

        {/* Light Hazard */}
        <rect x="70" y="500" width="280" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="520" fontSize="11" fill="#0f172a">Light Hazard</text>
        <rect x="350" y="500" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="520" fontSize="11" fontFamily="monospace" fill="#0f172a">5.0</text>
        <rect x="550" y="500" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="570" y="520" fontSize="11" fontFamily="monospace" fill="#0f172a">84</text>
        <rect x="750" y="500" width="220" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="520" fontSize="11" fontFamily="monospace" fill="#0f172a">30</text>
        <rect x="970" y="500" width="190" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="520" fontSize="10" fill="#64748b">Office, Hotel</text>

        {/* Ordinary I */}
        <rect x="70" y="530" width="280" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="550" fontSize="11" fill="#0f172a">Ordinary Hazard I</text>
        <rect x="350" y="530" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="550" fontSize="11" fontFamily="monospace" fill="#0f172a">10.2</text>
        <rect x="550" y="530" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="570" y="550" fontSize="11" fontFamily="monospace" fill="#0f172a">139</text>
        <rect x="750" y="530" width="220" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="550" fontSize="11" fontFamily="monospace" fill="#0f172a">60</text>
        <rect x="970" y="530" width="190" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="550" fontSize="10" fill="#64748b">Parking, Mill</text>

        {/* Ordinary II (Selected) */}
        <rect x="70" y="560" width="280" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="90" y="580" fontSize="11" fontWeight="700" fill="#991b1b">Ordinary Hazard II ✓</text>
        <rect x="350" y="560" width="200" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="370" y="580" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">12.2</text>
        <rect x="550" y="560" width="200" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="570" y="580" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">186</text>
        <rect x="750" y="560" width="220" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="770" y="580" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">60</text>
        <rect x="970" y="560" width="190" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="990" y="580" fontSize="10" fontWeight="700" fill="#991b1b">Residential</text>

        {/* High Hazard */}
        <rect x="70" y="590" width="280" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="610" fontSize="11" fill="#0f172a">High Hazard</text>
        <rect x="350" y="590" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="610" fontSize="11" fontFamily="monospace" fill="#0f172a">20.4</text>
        <rect x="550" y="590" width="200" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="570" y="610" fontSize="11" fontFamily="monospace" fill="#0f172a">260</text>
        <rect x="750" y="590" width="220" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="610" fontSize="11" fontFamily="monospace" fill="#0f172a">90</text>
        <rect x="970" y="590" width="190" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="610" fontSize="10" fill="#64748b">Warehouse</text>

        {/* Hydrant System */}
        <rect x="1220" y="430" width="1140" height="90" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="455" fontSize="14" fontWeight="700" fill="#9f1239">
          B2: HYDRANT SYSTEM REQUIREMENTS (IS-5290)
        </text>
        <text x="1240" y="475" fontSize="12" fill="#881337" fontFamily="monospace">
          • Flow per Hydrant: 1,800 LPM @ 3.5 Bar residual pressure
        </text>
        <text x="1240" y="493" fontSize="12" fill="#881337" fontFamily="monospace">
          • Simultaneous Hydrants: 2 outlets (Ground floor design basis)
        </text>
        <text x="1240" y="511" fontSize="12" fill="#881337" fontFamily="monospace">
          • Total Hydrant Flow: 3,600 LPM | Duration: 60 minutes
        </text>

        {/* Water Curtain */}
        <rect x="1220" y="540" width="1140" height="70" fill="url(#cyanGrad)" stroke="#0891b2" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="565" fontSize="14" fontWeight="700" fill="#155e75">
          B3: WATER CURTAIN / DRENCHER SYSTEM
        </text>
        <text x="1240" y="585" fontSize="12" fill="#0e7490" fontFamily="monospace">
          • Linear Coverage: 45 meters | Density: 10 LPM/meter
        </text>
        <text x="1240" y="602" fontSize="12" fill="#0e7490" fontFamily="monospace">
          • Total Drencher Flow: 450 LPM | Location: Property boundary
        </text>
      </g>

      {/* ========================================== */}
      {/* PART C: HYDRAULIC CONSTANTS & FORMULAS */}
      {/* ========================================== */}
      <g id="part-c">
        <rect x="40" y="640" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="672" fontSize="20" fontWeight="700" fill="#ffffff">
          PART C: HYDRAULIC CONSTANTS &amp; ENGINEERING FORMULAS
        </text>

        {/* Constants Table */}
        <rect x="40" y="710" width="1140" height="220" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="735" fontSize="14" fontWeight="700" fill="#1e40af">
          C1: SYSTEM CONSTANTS &amp; COEFFICIENTS
        </text>

        {/* Constant Headers */}
        <rect x="70" y="755" width="360" height="30" fill="#1e293b" />
        <text x="90" y="775" fontSize="11" fontWeight="700" fill="#ffffff">CONSTANT</text>
        <rect x="430" y="755" width="180" height="30" fill="#1e293b" />
        <text x="450" y="775" fontSize="11" fontWeight="700" fill="#ffffff">VALUE</text>
        <rect x="610" y="755" width="140" height="30" fill="#1e293b" />
        <text x="630" y="775" fontSize="11" fontWeight="700" fill="#ffffff">UNIT</text>
        <rect x="750" y="755" width="410" height="30" fill="#1e293b" />
        <text x="770" y="775" fontSize="11" fontWeight="700" fill="#ffffff">APPLICATION</text>

        {/* Constants Rows */}
        <rect x="70" y="785" width="360" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="803" fontSize="11" fill="#0f172a">Hazen-Williams 'C' Factor</text>
        <rect x="430" y="785" width="180" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="450" y="803" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">120</text>
        <rect x="610" y="785" width="140" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="630" y="803" fontSize="10" fill="#64748b">—</text>
        <rect x="750" y="785" width="410" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="803" fontSize="10" fill="#475569">New GI/MS steel pipe (friction calc)</text>

        <rect x="70" y="813" width="360" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="831" fontSize="11" fill="#0f172a">Coefficient of Discharge (Cd)</text>
        <rect x="430" y="813" width="180" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="450" y="831" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.62</text>
        <rect x="610" y="813" width="140" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="630" y="831" fontSize="10" fill="#64748b">—</text>
        <rect x="750" y="813" width="410" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="831" fontSize="10" fill="#475569">Orifice plate efficiency</text>

        <rect x="70" y="841" width="360" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="859" fontSize="11" fill="#0f172a">Gravitational Acceleration (g)</text>
        <rect x="430" y="841" width="180" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="450" y="859" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">9.81</text>
        <rect x="610" y="841" width="140" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="630" y="859" fontSize="10" fill="#64748b">m/s²</text>
        <rect x="750" y="841" width="410" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="859" fontSize="10" fill="#475569">Pressure conversion: 1 Bar = 10.2m H₂O</text>

        <rect x="70" y="869" width="360" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="887" fontSize="11" fill="#0f172a">Floor-to-Floor Height</text>
        <rect x="430" y="869" width="180" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="450" y="887" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">3.35</text>
        <rect x="610" y="869" width="140" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="630" y="887" fontSize="10" fill="#64748b">Meters</text>
        <rect x="750" y="869" width="410" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="887" fontSize="10" fill="#475569">Static head calculation basis</text>

        <rect x="70" y="897" width="360" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="915" fontSize="11" fill="#0f172a">Residual Pressure (Pr)</text>
        <rect x="430" y="897" width="180" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="450" y="915" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">3.5</text>
        <rect x="610" y="897" width="140" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="630" y="915" fontSize="10" fill="#64748b">Bar</text>
        <rect x="750" y="897" width="410" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="770" y="915" fontSize="10" fill="#475569">Min pressure at sprinkler/hydrant nozzle</text>

        {/* Formula Reference */}
        <rect x="1220" y="710" width="1140" height="220" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="735" fontSize="14" fontWeight="700" fill="#92400e">
          C2: KEY FORMULAS REFERENCE
        </text>

        {/* Formula 1 */}
        <rect x="1250" y="755" width="1090" height="36" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="4" />
        <text x="1270" y="773" fontSize="11" fontWeight="700" fill="#78350f">1. Design Flow Rate (Q):</text>
        <text x="1270" y="785" fontSize="10" fill="#78350f" fontFamily="monospace">Q = Density × Area = 12.2 L/min/m² × 186 m² = 2,269 LPM</text>

        {/* Formula 2 */}
        <rect x="1250" y="795" width="1090" height="36" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="4" />
        <text x="1270" y="813" fontSize="11" fontWeight="700" fill="#78350f">2. Hazen-Williams (Friction Loss):</text>
        <text x="1270" y="825" fontSize="9" fill="#78350f" fontFamily="monospace">Hf = 6.05×10⁴ × (Q/C)^1.85 × (L/D^4.87) — Result in meters</text>

        {/* Formula 3 */}
        <rect x="1250" y="835" width="1090" height="36" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="4" />
        <text x="1270" y="853" fontSize="11" fontWeight="700" fill="#78350f">3. Total Dynamic Head (TDH):</text>
        <text x="1270" y="865" fontSize="10" fill="#78350f" fontFamily="monospace">TDH = Hs (Static) + Hf (Friction) + Pr (Residual) + 20% Safety</text>

        {/* Formula 4 */}
        <rect x="1250" y="875" width="1090" height="36" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="4" />
        <text x="1270" y="893" fontSize="11" fontWeight="700" fill="#78350f">4. Pump Power (P):</text>
        <text x="1270" y="905" fontSize="10" fill="#78350f" fontFamily="monospace">P = (ρ × g × Q × H) / η where ρ=1000 kg/m³, η=0.75</text>
      </g>

      {/* ========================================== */}
      {/* PART D: FIRE PUMP HEAD CALCULATION */}
      {/* ========================================== */}
      <g id="part-d">
        <rect x="40" y="960" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="992" fontSize="20" fontWeight="700" fill="#ffffff">
          PART D: FIRE PUMP HEAD CALCULATION (High Zone: 32F–18F)
        </text>

        {/* Step 1: Design Flow */}
        <rect x="40" y="1030" width="740" height="90" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1055" fontSize="14" fontWeight="700" fill="#92400e">
          D1: DESIGN FLOW RATE (Q) — Sprinkler System
        </text>
        <text x="60" y="1075" fontSize="12" fill="#78350f" fontFamily="monospace">
          Q = Density × Area of Operation
        </text>
        <text x="60" y="1093" fontSize="12" fill="#78350f" fontFamily="monospace">
          Q = 12.2 L/min/m² × 186 m²
        </text>
        <text x="60" y="1111" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Q = 2,269 LPM (Sprinkler High Zone)
        </text>

        {/* Step 2: Pipe Geometry */}
        <rect x="820" y="1030" width="770" height="90" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="840" y="1055" fontSize="14" fontWeight="700" fill="#1e40af">
          D2: PIPE SCHEDULE INPUT (Main Riser)
        </text>
        <text x="840" y="1075" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Material: GI Class C | Nominal Diameter (DN): 150mm
        </text>
        <text x="840" y="1093" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Straight Length: 185m | Fittings: 12×90° Elbow + 3×Tee
        </text>
        <text x="840" y="1111" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          + 2×Non-Return Valve + 1×Butterfly Valve
        </text>

        {/* Step 3: Equivalent Length */}
        <rect x="1630" y="1030" width="730" height="90" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1650" y="1055" fontSize="14" fontWeight="700" fill="#92400e">
          D3: EQUIVALENT LENGTH (Le) — K-Factor Method
        </text>
        <text x="1650" y="1075" fontSize="11" fill="#78350f" fontFamily="monospace">
          Elbow K=30, Tee K=60, NRV K=50, BFV K=20
        </text>
        <text x="1650" y="1093" fontSize="11" fill="#78350f" fontFamily="monospace">
          Le = (12×30 + 3×60 + 2×50 + 1×20) × DN
        </text>
        <text x="1650" y="1111" fontSize="12" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Le = 660 × 0.15m = 99m → Total: 185+99 = 284m
        </text>

        {/* Step 4: Friction Loss */}
        <rect x="40" y="1140" width="1120" height="110" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1165" fontSize="14" fontWeight="700" fill="#92400e">
          D4: FRICTION HEAD LOSS (Hf) — Hazen-Williams Equation
        </text>
        <text x="60" y="1185" fontSize="11" fill="#78350f" fontFamily="monospace">
          Hf = 6.05 × 10⁴ × (Q / C)^1.85 × (L / D^4.87)
        </text>
        <text x="60" y="1203" fontSize="11" fill="#78350f" fontFamily="monospace">
          Hf = 6.05×10⁴ × (2269/120)^1.85 × (284 / 150^4.87)
        </text>
        <text x="60" y="1221" fontSize="11" fill="#78350f" fontFamily="monospace">
          Hf = 6.05×10⁴ × 18.90^1.85 × 0.0000168
        </text>
        <text x="60" y="1239" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Hf = 65.2 meters = 6.52 Bar (Friction Loss)
        </text>

        {/* Step 5: Static Head */}
        <rect x="1200" y="1140" width="1160" height="110" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1220" y="1165" fontSize="14" fontWeight="700" fill="#92400e">
          D5: STATIC HEAD (Hs) — Vertical Elevation Difference
        </text>
        <text x="1220" y="1185" fontSize="12" fill="#78350f" fontFamily="monospace">
          Pump Location: Basement (-6m from GL)
        </text>
        <text x="1220" y="1203" fontSize="12" fill="#78350f" fontFamily="monospace">
          Highest Outlet: Floor 32 → (32 × 3.35m) + 6m = 113.2m
        </text>
        <text x="1220" y="1221" fontSize="12" fill="#78350f" fontFamily="monospace">
          Tank Offset (Terrace to pump): +5m
        </text>
        <text x="1220" y="1239" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Hs = 113.2m + 5m = 118.2 meters (Static Head)
        </text>

        {/* Step 6: Total Dynamic Head */}
        <rect x="40" y="1270" width="2320" height="120" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1295" fontSize="16" fontWeight="700" fill="#065f46">
          D6: TOTAL DYNAMIC HEAD (TDH) — FINAL PUMP HEAD REQUIREMENT
        </text>
        <text x="60" y="1320" fontSize="13" fill="#047857" fontFamily="monospace">
          TDH = Hs (Static) + Hf (Friction) + Pr (Residual) + Safety Factor (20%)
        </text>
        <text x="60" y="1340" fontSize="13" fill="#047857" fontFamily="monospace">
          TDH = 118.2m + 65.2m + (3.5 Bar × 10.2m/Bar) + (219.1m × 0.20)
        </text>
        <text x="60" y="1360" fontSize="13" fill="#047857" fontFamily="monospace">
          TDH = 118.2 + 65.2 + 35.7 + 43.8
        </text>
        <text x="60" y="1380" fontSize="18" fontWeight="700" fill="#065f46" fontFamily="monospace">
          TDH = 262.9 meters ≈ 265 meters (ROUNDED UP FOR PUMP SELECTION)
        </text>
      </g>

      {/* ========================================== */}
      {/* PART E: FIRE TANK SIZING */}
      {/* ========================================== */}
      <g id="part-e">
        <rect x="40" y="1420" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="1452" fontSize="20" fontWeight="700" fill="#ffffff">
          PART E: FIRE TANK SIZE ESTIMATION &amp; WATER RESERVE
        </text>

        {/* Sprinkler Reserve */}
        <rect x="40" y="1490" width="740" height="120" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1515" fontSize="14" fontWeight="700" fill="#92400e">
          E1: SPRINKLER RESERVE (All Zones)
        </text>
        <text x="60" y="1535" fontSize="12" fill="#78350f" fontFamily="monospace">
          Volume = Flow Rate × Duration
        </text>
        <text x="60" y="1555" fontSize="12" fill="#78350f" fontFamily="monospace">
          High Zone: 2,269 LPM × 60 min = 136,140 L
        </text>
        <text x="60" y="1575" fontSize="12" fill="#78350f" fontFamily="monospace">
          Low Zone: 1,854 LPM × 60 min = 111,240 L
        </text>
        <text x="60" y="1595" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Total Sprinkler: 247,380 L ≈ 250 KL
        </text>

        {/* Hydrant Reserve */}
        <rect x="820" y="1490" width="740" height="120" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="840" y="1515" fontSize="14" fontWeight="700" fill="#92400e">
          E2: HYDRANT SYSTEM RESERVE
        </text>
        <text x="840" y="1535" fontSize="12" fill="#78350f" fontFamily="monospace">
          Hydrant: 3,600 LPM × 60 min = 216,000 L
        </text>
        <text x="840" y="1555" fontSize="12" fill="#78350f" fontFamily="monospace">
          Water Curtain: 450 LPM × 60 min = 27,000 L
        </text>
        <text x="840" y="1575" fontSize="12" fill="#78350f" fontFamily="monospace">
          Jockey Pump Reserve: 15,000 L
        </text>
        <text x="840" y="1595" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Total Hydrant: 258,000 L ≈ 260 KL
        </text>

        {/* Grand Total */}
        <rect x="1600" y="1490" width="760" height="120" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <g>
          <circle cx="1650" cy="1550" r="28" fill="#10b981" stroke="#059669" strokeWidth="2" />
          <text x="1650" y="1560" fontSize="24" fontWeight="700" fill="#ffffff" textAnchor="middle">✓</text>
        </g>
        <text x="1700" y="1525" fontSize="14" fontWeight="700" fill="#065f46">
          E3: TOTAL FIRE RESERVE
        </text>
        <text x="1700" y="1550" fontSize="13" fill="#047857" fontFamily="monospace">
          Sprinkler: 250 KL
        </text>
        <text x="1700" y="1570" fontSize="13" fill="#047857" fontFamily="monospace">
          Hydrant System: 260 KL
        </text>
        <text x="1700" y="1595" fontSize="16" fontWeight="700" fill="#065f46" fontFamily="monospace">
          TOTAL = 510 KL
        </text>

        {/* Tank Spec */}
        <rect x="40" y="1630" width="2320" height="70" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1660" fontSize="14" fontWeight="700" fill="#92400e">
          E4: TANK SPECIFICATION &amp; CONFIGURATION
        </text>
        <text x="60" y="1680" fontSize="12" fill="#78350f" fontFamily="monospace">
          Total Capacity: 510,000 Liters (510 KL) | Configuration: Underground Concrete Tank | Dimensions: 15m × 12m × 3.5m (L×W×D)
        </text>
        <text x="60" y="1695" fontSize="11" fill="#78350f">
          Recommendation: Split into 2×260 KL tanks for redundancy | Material: RCC M30 grade with waterproofing | Access: Manhole + Ladder
        </text>
      </g>

      {/* ========================================== */}
      {/* PART F: JOCKEY PUMP & DRENCHER */}
      {/* ========================================== */}
      <g id="part-f">
        <rect x="40" y="1730" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="1762" fontSize="20" fontWeight="700" fill="#ffffff">
          PART F: JOCKEY PUMP &amp; DRENCHER SYSTEM CALCULATIONS
        </text>

        {/* Jockey Pump Spec */}
        <rect x="40" y="1800" width="1140" height="150" fill="url(#purpleGrad)" stroke="#8b5cf6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1825" fontSize="14" fontWeight="700" fill="#5b21b6">
          F1: JOCKEY PUMP SIZING (Pressure Maintenance)
        </text>
        <text x="60" y="1845" fontSize="12" fill="#6b21a8" fontFamily="monospace">
          Purpose: Maintain system pressure, compensate for minor leaks
        </text>
        <text x="60" y="1865" fontSize="12" fill="#6b21a8" fontFamily="monospace">
          Flow Rate (Q): 10% of main pump = 2,269 × 0.10 = 227 LPM
        </text>
        <text x="60" y="1885" fontSize="12" fill="#6b21a8" fontFamily="monospace">
          Typical Design: 60 LPM (standard for high-rise residential)
        </text>
        <text x="60" y="1905" fontSize="12" fill="#6b21a8" fontFamily="monospace">
          Head (H): Main pump TDH + 20m margin = 265m + 20m = 285 meters
        </text>
        <text x="60" y="1925" fontSize="13" fontWeight="700" fill="#5b21b6" fontFamily="monospace">
          Selected: Grundfos CR 3-36 (60 LPM @ 285m) | Power: 4.5 kW
        </text>
        <text x="60" y="1943" fontSize="11" fill="#6b21a8">
          Control: Pressure switch auto-start at 9.8 Bar, auto-stop at 10.2 Bar
        </text>

        {/* Drencher Pump */}
        <rect x="1220" y="1800" width="1140" height="150" fill="url(#cyanGrad)" stroke="#0891b2" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="1825" fontSize="14" fontWeight="700" fill="#155e75">
          F2: DRENCHER PUMP SIZING (Water Curtain System)
        </text>
        <text x="1240" y="1845" fontSize="12" fill="#0e7490" fontFamily="monospace">
          Purpose: Perimeter fire barrier at property boundary
        </text>
        <text x="1240" y="1865" fontSize="12" fill="#0e7490" fontFamily="monospace">
          Linear Coverage: 45 meters | Nozzle Spacing: 2.5m (18 nozzles)
        </text>
        <text x="1240" y="1885" fontSize="12" fill="#0e7490" fontFamily="monospace">
          Flow per meter: 10 LPM | Total Flow (Q): 45m × 10 = 450 LPM
        </text>
        <text x="1240" y="1905" fontSize="12" fill="#0e7490" fontFamily="monospace">
          Head (H): Static (15m) + Friction (25m) + Nozzle Pr (35m) = 75m → 85m with safety
        </text>
        <text x="1240" y="1925" fontSize="13" fontWeight="700" fill="#155e75" fontFamily="monospace">
          Selected: CRI 3-80-6 (450 LPM @ 85m) | Power: 10.5 kW
        </text>
        <text x="1240" y="1943" fontSize="11" fill="#0e7490">
          Activation: Manual deluge valve + Electric solenoid (fire panel interlock)
        </text>
      </g>

      {/* ========================================== */}
      {/* PART G: TERRACE BOOSTER PUMP */}
      {/* ========================================== */}
      <g id="part-g">
        <rect x="40" y="1980" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="2012" fontSize="20" fontWeight="700" fill="#ffffff">
          PART G: TERRACE RWP BOOSTER PUMP (Rainwater + Fire Emergency Backup)
        </text>

        {/* RWP Booster Logic */}
        <rect x="40" y="2050" width="1140" height="140" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="2075" fontSize="14" fontWeight="700" fill="#1e40af">
          G1: TERRACE RAINWATER PUMPING REQUIREMENT
        </text>
        <text x="60" y="2095" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Terrace Area: 850 m² | Rainfall Intensity: 150 mm/hr (Mumbai design)
        </text>
        <text x="60" y="2115" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Peak Flow (Q) = (Catchment × Intensity × C) / 60
        </text>
        <text x="60" y="2135" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Q = (850 m² × 0.150 m/hr × 0.90) / 60 = 1.91 m³/min = 1,912 LPM
        </text>
        <text x="60" y="2155" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Head (H): Terrace to UGT = 112m + 15m margin = 127 meters
        </text>
        <text x="60" y="2175" fontSize="13" fontWeight="700" fill="#1e40af" fontFamily="monospace">
          Design: 2,000 LPM @ 130m (rounded for pump selection)
        </text>

        {/* Dual Purpose Design */}
        <rect x="1220" y="2050" width="1140" height="140" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="2075" fontSize="14" fontWeight="700" fill="#9f1239">
          G2: DUAL-PURPOSE FIRE EMERGENCY BACKUP
        </text>
        <text x="1240" y="2095" fontSize="12" fill="#881337" fontFamily="monospace">
          Fire Mode: Can be manually activated to supplement main fire pump
        </text>
        <text x="1240" y="2115" fontSize="12" fill="#881337" fontFamily="monospace">
          Interlocking: Fire panel can auto-start terrace pump if main pump fails
        </text>
        <text x="1240" y="2135" fontSize="12" fill="#881337" fontFamily="monospace">
          Capacity Contribution: 2,000 LPM adds to system (partial floor coverage)
        </text>
        <text x="1240" y="2155" fontSize="13" fontWeight="700" fill="#9f1239" fontFamily="monospace">
          Selected: Grundfos CR 150-22 (2,000 LPM @ 130m) | Power: 68 kW
        </text>
        <text x="1240" y="2175" fontSize="11" fill="#881337">
          Configuration: 1 Duty + 1 Standby (auto-alternate weekly) | VFD controlled
        </text>
      </g>

      {/* ========================================== */}
      {/* PART H: MULTI-ZONE COMPARISON */}
      {/* ========================================== */}
      <g id="part-h">
        <rect x="40" y="2220" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="2252" fontSize="20" fontWeight="700" fill="#ffffff">
          PART H: MULTI-ZONE SYSTEM COMPARISON (High Zone vs Low Zone vs Hydrant vs Curtain)
        </text>

        {/* Zone Table Headers */}
        <rect x="40" y="2290" width="400" height="40" fill="#1e293b" />
        <text x="60" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">PARAMETER</text>
        
        <rect x="440" y="2290" width="350" height="40" fill="#dc2626" />
        <text x="520" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">HIGH ZONE (32F–18F)</text>
        
        <rect x="790" y="2290" width="350" height="40" fill="#0891b2" />
        <text x="870" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">LOW ZONE (17F–GF)</text>
        
        <rect x="1140" y="2290" width="280" height="40" fill="#7c3aed" />
        <text x="1190" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">HYDRANT SYSTEM</text>
        
        <rect x="1420" y="2290" width="280" height="40" fill="#059669" />
        <text x="1460" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">WATER CURTAIN</text>
        
        <rect x="1700" y="2290" width="660" height="40" fill="#1e293b" />
        <text x="1720" y="2315" fontSize="13" fontWeight="700" fill="#ffffff">DESIGN NOTES</text>

        {/* Row 1: Design Flow */}
        <rect x="40" y="2330" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2353" fontSize="12" fontWeight="600" fill="#0f172a">Design Flow Rate (Q)</text>
        
        <rect x="440" y="2330" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2353" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">2,269 LPM</text>
        
        <rect x="790" y="2330" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2353" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">1,854 LPM</text>
        
        <rect x="1140" y="2330" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2353" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">3,600 LPM</text>
        
        <rect x="1420" y="2330" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2353" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">450 LPM</text>
        
        <rect x="1700" y="2330" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2353" fontSize="11" fill="#475569">Sprinkler: Density × Area; Hydrant: 2×1800</text>

        {/* Row 2: TDH */}
        <rect x="40" y="2366" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2389" fontSize="12" fontWeight="600" fill="#0f172a">Total Dynamic Head (TDH)</text>
        
        <rect x="440" y="2366" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2389" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">265 meters</text>
        
        <rect x="790" y="2366" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2389" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">180 meters</text>
        
        <rect x="1140" y="2366" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2389" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">120 meters</text>
        
        <rect x="1420" y="2366" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2389" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">85 meters</text>
        
        <rect x="1700" y="2366" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2389" fontSize="11" fill="#475569">Includes Hs + Hf + Pr + 20% safety</text>

        {/* Row 3: Pump Power */}
        <rect x="40" y="2402" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2425" fontSize="12" fontWeight="600" fill="#0f172a">Pump Power (kW)</text>
        
        <rect x="440" y="2402" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2425" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">165 kW</text>
        
        <rect x="790" y="2402" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2425" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">92 kW</text>
        
        <rect x="1140" y="2402" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2425" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">119 kW</text>
        
        <rect x="1420" y="2402" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2425" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">10.5 kW</text>
        
        <rect x="1700" y="2402" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2425" fontSize="11" fill="#475569">P = (ρgQH)/η, η=75%</text>

        {/* Row 4: Pipe Diameter */}
        <rect x="40" y="2438" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2461" fontSize="12" fontWeight="600" fill="#0f172a">Nominal Diameter (DN)</text>
        
        <rect x="440" y="2438" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2461" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">150mm (6")</text>
        
        <rect x="790" y="2438" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2461" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">125mm (5")</text>
        
        <rect x="1140" y="2438" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2461" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">200mm (8")</text>
        
        <rect x="1420" y="2438" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2461" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">80mm (3")</text>
        
        <rect x="1700" y="2438" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2461" fontSize="11" fill="#475569">Velocity: 1.5 ≤ V ≤ 3.0 m/s</text>

        {/* Row 5: Pump Model */}
        <rect x="40" y="2474" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2497" fontSize="12" fontWeight="600" fill="#0f172a">Selected Pump Model</text>
        
        <rect x="440" y="2474" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2497" fontSize="11" fontWeight="700" fill="#991b1b" fontFamily="monospace">KSB Omega 265-320/2</text>
        
        <rect x="790" y="2474" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2497" fontSize="11" fontWeight="700" fill="#0e7490" fontFamily="monospace">Grundfos CR 125-18</text>
        
        <rect x="1140" y="2474" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2497" fontSize="11" fontWeight="700" fill="#6b21a8" fontFamily="monospace">Kirloskar KDS 200</text>
        
        <rect x="1420" y="2474" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2497" fontSize="11" fontWeight="700" fill="#065f46" fontFamily="monospace">CRI 3-80-6</text>
        
        <rect x="1700" y="2474" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2497" fontSize="11" fill="#475569">Q-H curve match from database</text>

        {/* Row 6: Duty Cycle */}
        <rect x="40" y="2510" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="2533" fontSize="12" fontWeight="600" fill="#0f172a">Configuration</text>
        
        <rect x="440" y="2510" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="2533" fontSize="11" fill="#991b1b">1+1 (Duty + Standby)</text>
        
        <rect x="790" y="2510" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="2533" fontSize="11" fill="#0e7490">1+1 (Auto-alternate)</text>
        
        <rect x="1140" y="2510" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="2533" fontSize="11" fill="#6b21a8">1+1 (Duty + Standby)</text>
        
        <rect x="1420" y="2510" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="2533" fontSize="11" fill="#065f46">1 (Single pump)</text>
        
        <rect x="1700" y="2510" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="2533" fontSize="11" fill="#475569">Per IS-15105 redundancy requirements</text>
      </g>

      {/* ========================================== */}
      {/* PART I: PRESSURE PROFILE & ORIFICE */}
      {/* ========================================== */}
      <g id="part-i">
        <rect x="40" y="2580" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="2612" fontSize="20" fontWeight="700" fill="#ffffff">
          PART I: PRESSURE PROFILE VALIDATION &amp; ORIFICE PLATE SIZING
        </text>

        {/* Floor Pressure Calculation */}
        <rect x="40" y="2650" width="1140" height="130" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="2675" fontSize="14" fontWeight="700" fill="#9f1239">
          I1: FLOOR-WISE PRESSURE PROFILE (Gravity-Based Calculation)
        </text>
        <text x="60" y="2695" fontSize="12" fill="#881337" fontFamily="monospace">
          Floor Pressure (Bar) = Pump Shut-off Head - (Floor × 3.35m × 0.0981 Bar/m)
        </text>
        <text x="60" y="2715" fontSize="12" fill="#881337" fontFamily="monospace">
          Example: Floor 5 = 26.5 Bar - (5 × 3.35 × 0.0981) = 26.5 - 1.64 = 24.86 Bar
        </text>
        <text x="60" y="2735" fontSize="12" fill="#881337" fontFamily="monospace">
          Floor 18 = 26.5 Bar - (18 × 3.35 × 0.0981) = 26.5 - 5.91 = 20.59 Bar
        </text>
        <text x="60" y="2755" fontSize="13" fontWeight="700" fill="#9f1239">
          ⚠️ ALERT: Floors 1-18 have pressure &gt; 7.0 Bar → ORIFICE PLATES REQUIRED
        </text>
        <text x="60" y="2772" fontSize="11" fill="#881337">
          Reason: Excessive pressure damages sprinkler heads and causes hose whip hazard
        </text>

        {/* Orifice Sizing */}
        <rect x="1220" y="2650" width="1140" height="130" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="2675" fontSize="14" fontWeight="700" fill="#92400e">
          I2: ORIFICE PLATE DIAMETER CALCULATION
        </text>
        <text x="1240" y="2695" fontSize="12" fill="#78350f" fontFamily="monospace">
          Target Pressure Drop (ΔP) = Floor Pressure - 3.5 Bar (Residual)
        </text>
        <text x="1240" y="2715" fontSize="12" fill="#78350f" fontFamily="monospace">
          Floor 5: ΔP = 24.86 - 3.5 = 21.36 Bar
        </text>
        <text x="1240" y="2735" fontSize="11" fill="#78350f" fontFamily="monospace">
          Orifice Diameter: d = √[(4×Q/60000) / (Cd × π × √(2g×ΔP×10.2))]
        </text>
        <text x="1240" y="2755" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Result: d = 27.8mm → Round to standard Ø30mm (SS316 plate)
        </text>
        <text x="1240" y="2772" fontSize="11" fill="#78350f">
          Installation: Flanged connection on each floor branch before first sprinkler
        </text>

        {/* Safety Gate */}
        <rect x="40" y="2800" width="2320" height="90" fill="#fef2f2" stroke="#dc2626" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <g>
          <circle cx="90" cy="2845" r="28" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <text x="90" y="2855" fontSize="24" fontWeight="700" fill="#ffffff" textAnchor="middle">⚠</text>
        </g>
        <text x="140" y="2835" fontSize="16" fontWeight="700" fill="#991b1b">
          SAFETY VALIDATION GATE: Pressure Compliance Check
        </text>
        <text x="140" y="2855" fontSize="13" fill="#7f1d1d" fontFamily="monospace">
          ✓ High Zone: Floors 1-18 → ORIFICE PLATES INSTALLED (Ø30mm SS316)
        </text>
        <text x="140" y="2873" fontSize="13" fill="#7f1d1d" fontFamily="monospace">
          ✓ Low Zone: Floors 19-32 → WITHIN LIMITS 3.8-6.8 Bar (No orifice required)
        </text>
      </g>

      {/* ========================================== */}
      {/* PART J: COMPLETE PUMP BOM */}
      {/* ========================================== */}
      <g id="part-j">
        <rect x="40" y="2920" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="2952" fontSize="20" fontWeight="700" fill="#ffffff">
          PART J: COMPLETE PUMP BILL OF MATERIALS (BOM) &amp; ELECTRICAL LOAD
        </text>

        {/* BOM Table Headers */}
        <rect x="40" y="2990" width="340" height="40" fill="#1e293b" />
        <text x="60" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">PUMP TYPE</text>
        
        <rect x="380" y="2990" width="280" height="40" fill="#1e293b" />
        <text x="400" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">FLOW (Q)</text>
        
        <rect x="660" y="2990" width="280" height="40" fill="#1e293b" />
        <text x="680" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">HEAD (H)</text>
        
        <rect x="940" y="2990" width="280" height="40" fill="#1e293b" />
        <text x="960" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">POWER (kW)</text>
        
        <rect x="1220" y="2990" width="450" height="40" fill="#1e293b" />
        <text x="1240" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">SELECTED MODEL</text>
        
        <rect x="1670" y="2990" width="120" height="40" fill="#1e293b" />
        <text x="1690" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">QTY</text>
        
        <rect x="1790" y="2990" width="570" height="40" fill="#1e293b" />
        <text x="1810" y="3015" fontSize="13" fontWeight="700" fill="#ffffff">NOTES</text>

        {/* High Zone Main */}
        <rect x="40" y="3030" width="340" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="60" y="3053" fontSize="12" fontWeight="600" fill="#991b1b">High Zone Main Pump</text>
        
        <rect x="380" y="3030" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3053" fontSize="12" fontFamily="monospace" fill="#0f172a">2,269 LPM</text>
        
        <rect x="660" y="3030" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3053" fontSize="12" fontFamily="monospace" fill="#0f172a">265 meters</text>
        
        <rect x="940" y="3030" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3053" fontSize="12" fontFamily="monospace" fill="#0f172a">165 kW</text>
        
        <rect x="1220" y="3030" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3053" fontSize="11" fontFamily="monospace" fill="#0f172a">KSB Omega 265-320/2</text>
        
        <rect x="1670" y="3030" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="3053" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="3030" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3053" fontSize="11" fill="#475569">Duty + Standby (Auto-alternate)</text>

        {/* Low Zone Main */}
        <rect x="40" y="3066" width="340" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="60" y="3089" fontSize="12" fontWeight="600" fill="#0e7490">Low Zone Main Pump</text>
        
        <rect x="380" y="3066" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3089" fontSize="12" fontFamily="monospace" fill="#0f172a">1,854 LPM</text>
        
        <rect x="660" y="3066" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3089" fontSize="12" fontFamily="monospace" fill="#0f172a">180 meters</text>
        
        <rect x="940" y="3066" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3089" fontSize="12" fontFamily="monospace" fill="#0f172a">92 kW</text>
        
        <rect x="1220" y="3066" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3089" fontSize="11" fontFamily="monospace" fill="#0f172a">Grundfos CR 125-18</text>
        
        <rect x="1670" y="3066" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="3089" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="3066" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3089" fontSize="11" fill="#475569">Duty + Standby (Auto-alternate)</text>

        {/* Hydrant */}
        <rect x="40" y="3102" width="340" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="60" y="3125" fontSize="12" fontWeight="600" fill="#6b21a8">Hydrant System Pump</text>
        
        <rect x="380" y="3102" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3125" fontSize="12" fontFamily="monospace" fill="#0f172a">3,600 LPM</text>
        
        <rect x="660" y="3102" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3125" fontSize="12" fontFamily="monospace" fill="#0f172a">120 meters</text>
        
        <rect x="940" y="3102" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3125" fontSize="12" fontFamily="monospace" fill="#0f172a">119 kW</text>
        
        <rect x="1220" y="3102" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3125" fontSize="11" fontFamily="monospace" fill="#0f172a">Kirloskar KDS 200</text>
        
        <rect x="1670" y="3102" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="3125" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="3102" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3125" fontSize="11" fill="#475569">Manual start from hydrant cabinet</text>

        {/* Jockey */}
        <rect x="40" y="3138" width="340" height="36" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        <text x="60" y="3161" fontSize="12" fontWeight="600" fill="#9a3412">Jockey Pump (High Zone)</text>
        
        <rect x="380" y="3138" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3161" fontSize="12" fontFamily="monospace" fill="#0f172a">60 LPM</text>
        
        <rect x="660" y="3138" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3161" fontSize="12" fontFamily="monospace" fill="#0f172a">285 meters</text>
        
        <rect x="940" y="3138" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3161" fontSize="12" fontFamily="monospace" fill="#0f172a">4.5 kW</text>
        
        <rect x="1220" y="3138" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3161" fontSize="11" fontFamily="monospace" fill="#0f172a">Grundfos CR 3-36</text>
        
        <rect x="1670" y="3138" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1730" y="3161" fontSize="12" fontWeight="700" fill="#0f172a">1</text>
        
        <rect x="1790" y="3138" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3161" fontSize="11" fill="#475569">Pressure switch 9.8-10.2 Bar</text>

        {/* Water Curtain */}
        <rect x="40" y="3174" width="340" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="60" y="3197" fontSize="12" fontWeight="600" fill="#065f46">Water Curtain/Drencher</text>
        
        <rect x="380" y="3174" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3197" fontSize="12" fontFamily="monospace" fill="#0f172a">450 LPM</text>
        
        <rect x="660" y="3174" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3197" fontSize="12" fontFamily="monospace" fill="#0f172a">85 meters</text>
        
        <rect x="940" y="3174" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3197" fontSize="12" fontFamily="monospace" fill="#0f172a">10.5 kW</text>
        
        <rect x="1220" y="3174" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3197" fontSize="11" fontFamily="monospace" fill="#0f172a">CRI 3-80-6</text>
        
        <rect x="1670" y="3174" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1730" y="3197" fontSize="12" fontWeight="700" fill="#0f172a">1</text>
        
        <rect x="1790" y="3174" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3197" fontSize="11" fill="#475569">Manual deluge valve activation</text>

        {/* Terrace RWP */}
        <rect x="40" y="3210" width="340" height="36" fill="#cffafe" stroke="#67e8f9" strokeWidth="1" />
        <text x="60" y="3233" fontSize="12" fontWeight="600" fill="#155e75">Terrace RWP Booster</text>
        
        <rect x="380" y="3210" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="3233" fontSize="12" fontFamily="monospace" fill="#0f172a">2,000 LPM</text>
        
        <rect x="660" y="3210" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3233" fontSize="12" fontFamily="monospace" fill="#0f172a">130 meters</text>
        
        <rect x="940" y="3210" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="3233" fontSize="12" fontFamily="monospace" fill="#0f172a">68 kW</text>
        
        <rect x="1220" y="3210" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3233" fontSize="11" fontFamily="monospace" fill="#0f172a">Grundfos CR 150-22</text>
        
        <rect x="1670" y="3210" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="3233" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="3210" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="3233" fontSize="11" fill="#475569">VFD + Fire emergency backup</text>

        {/* Total Power */}
        <rect x="40" y="3256" width="900" height="40" fill="#1e293b" />
        <text x="60" y="3281" fontSize="13" fontWeight="700" fill="#ffffff">TOTAL ELECTRICAL LOAD (All Pumps)</text>
        
        <rect x="940" y="3256" width="280" height="40" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
        <text x="960" y="3281" fontSize="14" fontWeight="700" fill="#92400e" fontFamily="monospace">527.0 kW</text>
        
        <rect x="1220" y="3256" width="1140" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="3281" fontSize="12" fill="#475569">DG Set Sizing: 527 kW × 1.25 = 659 kVA (Use 750 kVA DG)</text>
      </g>

      {/* ========================================== */}
      {/* PART K: PIPE SCHEDULE DETAIL */}
      {/* ========================================== */}
      <g id="part-k">
        <rect x="40" y="3330" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="3362" fontSize="20" fontWeight="700" fill="#ffffff">
          PART K: COMPLETE PIPE SCHEDULE &amp; MATERIAL BOM
        </text>

        {/* Pipe Headers */}
        <rect x="40" y="3400" width="260" height="40" fill="#1e293b" />
        <text x="60" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">PIPE SEGMENT</text>
        
        <rect x="300" y="3400" width="160" height="40" fill="#1e293b" />
        <text x="320" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">DN (mm)</text>
        
        <rect x="460" y="3400" width="200" height="40" fill="#1e293b" />
        <text x="480" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">MATERIAL</text>
        
        <rect x="660" y="3400" width="160" height="40" fill="#1e293b" />
        <text x="680" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">LENGTH (m)</text>
        
        <rect x="820" y="3400" width="250" height="40" fill="#1e293b" />
        <text x="840" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">FITTINGS</text>
        
        <rect x="1070" y="3400" width="200" height="40" fill="#1e293b" />
        <text x="1090" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">VELOCITY (m/s)</text>
        
        <rect x="1270" y="3400" width="200" height="40" fill="#1e293b" />
        <text x="1290" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">Hf (Bar)</text>
        
        <rect x="1470" y="3400" width="890" height="40" fill="#1e293b" />
        <text x="1490" y="3425" fontSize="13" fontWeight="700" fill="#ffffff">REMARKS</text>

        {/* Main Riser High */}
        <rect x="40" y="3440" width="260" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="60" y="3463" fontSize="12" fontWeight="600" fill="#991b1b">Main Riser High Zone</text>
        
        <rect x="300" y="3440" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="3463" fontSize="12" fontFamily="monospace" fill="#0f172a">150</text>
        
        <rect x="460" y="3440" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="3463" fontSize="11" fill="#0f172a">GI Class C</text>
        
        <rect x="660" y="3440" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3463" fontSize="12" fontFamily="monospace" fill="#0f172a">185.0</text>
        
        <rect x="820" y="3440" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="3463" fontSize="11" fill="#0f172a">12×Elbow + 3×Tee + 2×NRV</text>
        
        <rect x="1070" y="3440" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="3463" fontSize="12" fontFamily="monospace" fill="#0f172a">2.14</text>
        
        <rect x="1270" y="3440" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="3463" fontSize="12" fontFamily="monospace" fill="#0f172a">6.52</text>
        
        <rect x="1470" y="3440" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="3463" fontSize="11" fill="#475569">Vertical from UGT to Floor 32 tank</text>

        {/* Floor Branch */}
        <rect x="40" y="3476" width="260" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="60" y="3499" fontSize="12" fontWeight="600" fill="#0e7490">Floor Branch (Typical)</text>
        
        <rect x="300" y="3476" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="3499" fontSize="12" fontFamily="monospace" fill="#0f172a">100</text>
        
        <rect x="460" y="3476" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="3499" fontSize="11" fill="#0f172a">GI Class C</text>
        
        <rect x="660" y="3476" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3499" fontSize="12" fontFamily="monospace" fill="#0f172a">45.0</text>
        
        <rect x="820" y="3476" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="3499" fontSize="11" fill="#0f172a">6×Elbow + 1×Tee</text>
        
        <rect x="1070" y="3476" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="3499" fontSize="12" fontFamily="monospace" fill="#0f172a">1.82</text>
        
        <rect x="1270" y="3476" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="3499" fontSize="12" fontFamily="monospace" fill="#0f172a">0.85</text>
        
        <rect x="1470" y="3476" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="3499" fontSize="11" fill="#475569">Horizontal distribution (32 floors)</text>

        {/* Sprinkler Laterals */}
        <rect x="40" y="3512" width="260" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="60" y="3535" fontSize="12" fontWeight="600" fill="#6b21a8">Sprinkler Laterals</text>
        
        <rect x="300" y="3512" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="3535" fontSize="12" fontFamily="monospace" fill="#0f172a">25</text>
        
        <rect x="460" y="3512" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="3535" fontSize="11" fill="#0f172a">GI Class B</text>
        
        <rect x="660" y="3512" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3535" fontSize="12" fontFamily="monospace" fill="#0f172a">3.5</text>
        
        <rect x="820" y="3512" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="3535" fontSize="11" fill="#0f172a">2×Elbow</text>
        
        <rect x="1070" y="3512" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="3535" fontSize="12" fontFamily="monospace" fill="#0f172a">1.35</text>
        
        <rect x="1270" y="3512" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="3535" fontSize="12" fontFamily="monospace" fill="#0f172a">0.12</text>
        
        <rect x="1470" y="3512" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="3535" fontSize="11" fill="#475569">Drop to sprinkler head (186 nos)</text>

        {/* Hydrant Main */}
        <rect x="40" y="3548" width="260" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="60" y="3571" fontSize="12" fontWeight="600" fill="#991b1b">Hydrant Main Line</text>
        
        <rect x="300" y="3548" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="3571" fontSize="12" fontFamily="monospace" fill="#0f172a">200</text>
        
        <rect x="460" y="3548" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="3571" fontSize="11" fill="#0f172a">MS Sch 40</text>
        
        <rect x="660" y="3548" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3571" fontSize="12" fontFamily="monospace" fill="#0f172a">125.0</text>
        
        <rect x="820" y="3548" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="3571" fontSize="11" fill="#0f172a">8×Elbow + 18×Tee (outlets)</text>
        
        <rect x="1070" y="3548" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="3571" fontSize="12" fontFamily="monospace" fill="#0f172a">1.91</text>
        
        <rect x="1270" y="3548" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="3571" fontSize="12" fontFamily="monospace" fill="#0f172a">2.85</text>
        
        <rect x="1470" y="3548" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="3571" fontSize="11" fill="#475569">Ring main with 18 landing valves</text>

        {/* Orifice Plates */}
        <rect x="40" y="3584" width="260" height="36" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        <text x="60" y="3607" fontSize="12" fontWeight="600" fill="#9a3412">Orifice Plates</text>
        
        <rect x="300" y="3584" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="3607" fontSize="12" fontFamily="monospace" fill="#0f172a">30</text>
        
        <rect x="460" y="3584" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="3607" fontSize="11" fill="#0f172a">SS316</text>
        
        <rect x="660" y="3584" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="3607" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="820" y="3584" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="3607" fontSize="11" fill="#0f172a">Flanged PN16</text>
        
        <rect x="1070" y="3584" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="3607" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="1270" y="3584" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="3607" fontSize="12" fontFamily="monospace" fill="#0f172a">21.36</text>
        
        <rect x="1470" y="3584" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="3607" fontSize="11" fill="#475569">Floors 1-18 (18 nos total)</text>
      </g>

      {/* ========================================== */}
      {/* PART L: COMPLIANCE & SIGN-OFF */}
      {/* ========================================== */}
      <g id="part-l">
        <rect x="40" y="3650" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="3682" fontSize="20" fontWeight="700" fill="#ffffff">
          PART L: STANDARDS COMPLIANCE &amp; ENGINEERING SIGN-OFF
        </text>

        {/* Compliance */}
        <rect x="40" y="3720" width="1140" height="220" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="3745" fontSize="14" fontWeight="700" fill="#0f172a">
          L1: COMPLIANCE CHECKLIST
        </text>
        <text x="80" y="3770" fontSize="12" fill="#059669">
          ✓ IS-15105:2002 — Installation &amp; Maintenance of Sprinkler Systems
        </text>
        <text x="80" y="3790" fontSize="12" fill="#059669">
          ✓ NFPA-13:2022 — Standard for Installation of Sprinkler Systems
        </text>
        <text x="80" y="3810" fontSize="12" fill="#059669">
          ✓ IS-5290:1969 — Code of Practice for Hydrant Installation
        </text>
        <text x="80" y="3830" fontSize="12" fill="#059669">
          ✓ NBC Part 4:2016 — Fire &amp; Life Safety (Section 7: Water Supply)
        </text>
        <text x="80" y="3850" fontSize="12" fill="#059669">
          ✓ Hazen-Williams Formula (C=120 for new steel pipes)
        </text>
        <text x="80" y="3870" fontSize="12" fill="#059669">
          ✓ Pressure Profile: All floors within 3.5–7.0 Bar operating range
        </text>
        <text x="80" y="3890" fontSize="12" fill="#059669">
          ✓ Orifice Plate Sizing: Floors 1-18 protected from overpressure
        </text>
        <text x="80" y="3910" fontSize="12" fill="#059669">
          ✓ Pump Selection: Q-H curve matched with manufacturer datasheets
        </text>
        <text x="80" y="3930" fontSize="12" fill="#059669">
          ✓ Redundancy: All critical pumps have Duty + Standby configuration
        </text>

        {/* Sign-off */}
        <rect x="1220" y="3720" width="1140" height="220" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="3745" fontSize="14" fontWeight="700" fill="#92400e">
          L2: ENGINEERING SIGN-OFF
        </text>
        <text x="1260" y="3775" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Prepared by:</tspan> Sr. MEP Design Engineer (Fire Protection)
        </text>
        <text x="1260" y="3795" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Reviewed by:</tspan> Principal Fire Protection Consultant
        </text>
        <text x="1260" y="3815" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Approved by:</tspan> Chief MEP Consultant (PE License: MH-12345)
        </text>
        <text x="1260" y="3835" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Date:</tspan> March 12, 2026
        </text>
        <text x="1260" y="3855" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Revision:</tspan> Rev 03 (Post Fire Authority Approval)
        </text>
        <text x="1260" y="3875" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Project Code:</tspan> LODHA-CT-B-MEP-FIRE-001
        </text>
        <text x="1260" y="3895" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Drawing Status:</tspan> FOR CONSTRUCTION
        </text>
        <text x="1260" y="3915" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Fire NOC Reference:</tspan> CFO/MMR/2026/FIRE/0142
        </text>

        <rect x="1260" y="3925" width="1080" height="15" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,2" rx="3" />
        <text x="1270" y="3936" fontSize="10" fill="#dc2626" fontStyle="italic">
          ⚠ All field modifications require written approval from Chief Fire Officer
        </text>
      </g>

      {/* ========================================== */}
      {/* PART M: SUMMARY DASHBOARD */}
      {/* ========================================== */}
      <g id="part-m">
        <rect x="40" y="3970" width="2320" height="50" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" rx="8" />
        <text x="60" y="4002" fontSize="20" fontWeight="700" fill="#ffffff">
          PART M: EXECUTIVE SUMMARY DASHBOARD (Quick Reference)
        </text>

        {/* Summary Cards */}
        <g id="summary-cards">
          {/* Card 1 */}
          <rect x="40" y="4040" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="60" y="4065" fontSize="14" fontWeight="700" fill="#065f46">
            💧 TOTAL WATER RESERVE
          </text>
          <text x="60" y="4090" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            510 KL
          </text>
          <text x="60" y="4110" fontSize="11" fill="#059669">
            Sprinkler: 250 KL | Hydrant: 260 KL
          </text>
          <text x="60" y="4123" fontSize="11" fill="#059669">
            Configuration: 2×260 KL Underground Tanks
          </text>

          {/* Card 2 */}
          <rect x="640" y="4040" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="660" y="4065" fontSize="14" fontWeight="700" fill="#065f46">
            ⚡ TOTAL ELECTRICAL LOAD
          </text>
          <text x="660" y="4090" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            527 kW
          </text>
          <text x="660" y="4110" fontSize="11" fill="#059669">
            DG Set Requirement: 750 kVA
          </text>
          <text x="660" y="4123" fontSize="11" fill="#059669">
            Main: 257 kW | Jockey: 4.5 kW | RWP: 68 kW
          </text>

          {/* Card 3 */}
          <rect x="1240" y="4040" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1260" y="4065" fontSize="14" fontWeight="700" fill="#065f46">
            🚀 HIGH ZONE PUMP
          </text>
          <text x="1260" y="4090" fontSize="18" fontWeight="700" fill="#047857" fontFamily="monospace">
            2,269 LPM @ 265m
          </text>
          <text x="1260" y="4110" fontSize="11" fill="#059669">
            Model: KSB Omega 265-320/2 (165 kW)
          </text>
          <text x="1260" y="4123" fontSize="11" fill="#059669">
            Serves: Floors 18-32 (High Zone)
          </text>

          {/* Card 4 */}
          <rect x="1840" y="4040" width="520" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1860" y="4065" fontSize="14" fontWeight="700" fill="#065f46">
            🔥 HYDRANT SYSTEM
          </text>
          <text x="1860" y="4090" fontSize="18" fontWeight="700" fill="#047857" fontFamily="monospace">
            3,600 LPM @ 120m
          </text>
          <text x="1860" y="4110" fontSize="11" fill="#059669">
            Model: Kirloskar KDS 200 (119 kW)
          </text>
          <text x="1860" y="4123" fontSize="11" fill="#059669">
            18 Landing Valves | DN 200mm Main
          </text>

          {/* Card 5 */}
          <rect x="40" y="4150" width="560" height="90" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="60" y="4175" fontSize="14" fontWeight="700" fill="#9f1239">
            ⚠️ ORIFICE PLATES
          </text>
          <text x="60" y="4200" fontSize="18" fontWeight="700" fill="#881337" fontFamily="monospace">
            18 Nos (Ø30mm SS316)
          </text>
          <text x="60" y="4220" fontSize="11" fill="#9f1239">
            Installed on Floors 1-18
          </text>
          <text x="60" y="4233" fontSize="11" fill="#9f1239">
            Purpose: Pressure reduction 24.9 → 3.5 Bar
          </text>

          {/* Card 6 */}
          <rect x="640" y="4150" width="560" height="90" fill="url(#purpleGrad)" stroke="#8b5cf6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="660" y="4175" fontSize="14" fontWeight="700" fill="#5b21b6">
            🔄 JOCKEY PUMP
          </text>
          <text x="660" y="4200" fontSize="18" fontWeight="700" fill="#6b21a8" fontFamily="monospace">
            60 LPM @ 285m
          </text>
          <text x="660" y="4220" fontSize="11" fill="#5b21b6">
            Model: Grundfos CR 3-36 (4.5 kW)
          </text>
          <text x="660" y="4233" fontSize="11" fill="#5b21b6">
            Pressure Switch: 9.8-10.2 Bar
          </text>

          {/* Card 7 */}
          <rect x="1240" y="4150" width="560" height="90" fill="url(#cyanGrad)" stroke="#0891b2" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1260" y="4175" fontSize="14" fontWeight="700" fill="#155e75">
            💦 WATER CURTAIN
          </text>
          <text x="1260" y="4200" fontSize="18" fontWeight="700" fill="#0e7490" fontFamily="monospace">
            450 LPM @ 85m
          </text>
          <text x="1260" y="4220" fontSize="11" fill="#155e75">
            Model: CRI 3-80-6 (10.5 kW)
          </text>
          <text x="1260" y="4233" fontSize="11" fill="#155e75">
            45m coverage | 18 nozzles @ 2.5m spacing
          </text>

          {/* Card 8 */}
          <rect x="1840" y="4150" width="520" height="90" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1860" y="4175" fontSize="14" fontWeight="700" fill="#1e40af">
            🏗️ TERRACE RWP BOOSTER
          </text>
          <text x="1860" y="4200" fontSize="18" fontWeight="700" fill="#1e3a8a" fontFamily="monospace">
            2,000 LPM @ 130m
          </text>
          <text x="1860" y="4220" fontSize="11" fill="#1e40af">
            Model: Grundfos CR 150-22 (68 kW)
          </text>
          <text x="1860" y="4233" fontSize="11" fill="#1e40af">
            Dual Purpose: RWP + Fire Backup
          </text>
        </g>
      </g>

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}
      <g id="footer">
        <rect x="40" y="4270" width="2320" height="80" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="8" />
        <text x="120" y="4300" fontSize="14" fontWeight="700" fill="#ffffff">
          🔥 MEP Digital Ecosystem — COMPREHENSIVE FIRE FIGHTING SYSTEM CALCULATION
        </text>
        <text x="120" y="4320" fontSize="12" fill="#94a3b8">
          Pump Head | Tank Sizing | Jockey/Drencher | Terrace Booster | Multi-Zone Hydraulics | Pressure Profile | Complete BOM
        </text>
        <text x="120" y="4335" fontSize="11" fill="#64748b">
          © 2026 Lodha Engineering | IS-15105 / NFPA-13 / IS-5290 / NBC Part 4 Compliant | Hazen-Williams Method | Rev 03
        </text>
        <text x="2100" y="4305" fontSize="14" fontWeight="700" fill="#ffffff">
          Page 1 of 1
        </text>
        <text x="2100" y="4325" fontSize="11" fill="#64748b">
          FOR CONSTRUCTION
        </text>
      </g>

      {/* End SVG */}
    </svg>
  );
}
