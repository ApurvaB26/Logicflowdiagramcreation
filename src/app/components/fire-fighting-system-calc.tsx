import React from "react";

// =====================================================================
// FIRE FIGHTING SYSTEM CALCULATION — ULTRA-DETAILED DASHBOARD
// Mirrors Electrical Load Calc depth: Input Matrix → Calculation Stack
// → Zone Comparison → Safety Validation → Pump Selection
// =====================================================================

export function FireFightingSystemCalcSVG() {
  return (
    <svg
      viewBox="0 0 2400 3800"
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
      {/* HEADER BLOCK */}
      {/* ========================================== */}
      <g id="header">
        <rect x="40" y="30" width="2320" height="90" fill="url(#headerGrad)" stroke="#991b1b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="120" y="75" fontSize="32" fontWeight="700" fill="#ffffff">
          🔥 FIRE FIGHTING SYSTEM — HYDRAULIC CALCULATION DASHBOARD
        </text>
        <text x="120" y="105" fontSize="14" fontWeight="500" fill="#fef3c7">
          Standards: IS-15105 / NFPA-13 / IS-5290 | Hazen-Williams Method | Multi-Zone Pump Sizing
        </text>
        
        {/* Project Info Cards */}
        <rect x="1750" y="45" width="280" height="32" fill="rgba(255,255,255,0.2)" rx="6" />
        <text x="1765" y="67" fontSize="13" fontWeight="600" fill="#ffffff">
          📋 Project: Lodha Crown Tower-B
        </text>
        <rect x="2050" y="45" width="280" height="32" fill="rgba(255,255,255,0.2)" rx="6" />
        <text x="2065" y="67" fontSize="13" fontWeight="600" fill="#ffffff">
          🏗️ Hazard Class: Ordinary Hazard II
        </text>
      </g>

      {/* ========================================== */}
      {/* SECTION 1: WATER STORAGE INPUTS */}
      {/* ========================================== */}
      <g id="section1">
        {/* Section Header */}
        <rect x="40" y="150" width="1120" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="180" fontSize="18" fontWeight="700" fill="#5b21b6">
          📊 SECTION 1: WATER STORAGE INPUTS (Design Basis)
        </text>

        {/* Input Grid */}
        {/* Row 1: Headers */}
        <rect x="40" y="210" width="360" height="38" fill="#1e293b" />
        <text x="60" y="234" fontSize="13" fontWeight="700" fill="#ffffff">PARAMETER</text>
        <rect x="400" y="210" width="180" height="38" fill="#1e293b" />
        <text x="420" y="234" fontSize="13" fontWeight="700" fill="#ffffff">INPUT</text>
        <rect x="580" y="210" width="140" height="38" fill="#1e293b" />
        <text x="600" y="234" fontSize="13" fontWeight="700" fill="#ffffff">UNIT</text>
        <rect x="720" y="210" width="440" height="38" fill="#1e293b" />
        <text x="740" y="234" fontSize="13" fontWeight="700" fill="#ffffff">REFERENCE / NOTES</text>

        {/* Row 2: Occupancy Hazard Class */}
        <rect x="40" y="248" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="271" fontSize="12" fontWeight="600" fill="#1e40af">Occupancy Hazard Class</text>
        <rect x="400" y="248" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="271" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">Ordinary Hazard II</text>
        <rect x="580" y="248" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="271" fontSize="11" fill="#64748b">—</text>
        <rect x="720" y="248" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="271" fontSize="11" fill="#475569">IS-15105 Table 1: Light / Ordinary I-II / High</text>

        {/* Row 3: Design Density */}
        <rect x="40" y="284" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="307" fontSize="12" fontWeight="600" fill="#1e40af">Design Density (Water Intensity)</text>
        <rect x="400" y="284" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="307" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">12.2</text>
        <rect x="580" y="284" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="307" fontSize="11" fill="#64748b">L/min/m²</text>
        <rect x="720" y="284" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="307" fontSize="11" fill="#475569">NFPA-13 Fig. 12.2.2.1 for OH-II</text>

        {/* Row 4: Area of Operation */}
        <rect x="40" y="320" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="343" fontSize="12" fontWeight="600" fill="#1e40af">Area of Operation (Max Fire Zone)</text>
        <rect x="400" y="320" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="343" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">186</text>
        <rect x="580" y="320" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="343" fontSize="11" fill="#64748b">m²</text>
        <rect x="720" y="320" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="343" fontSize="11" fill="#475569">IS-15105: Min 1500 sqft = 139.4 m²</text>

        {/* Row 5: Flow Duration */}
        <rect x="40" y="356" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="379" fontSize="12" fontWeight="600" fill="#1e40af">Flow Duration (Reserve Time)</text>
        <rect x="400" y="356" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="379" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">60</text>
        <rect x="580" y="356" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="379" fontSize="11" fill="#64748b">Minutes</text>
        <rect x="720" y="356" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="379" fontSize="11" fill="#475569">Standard: 30 min (Light), 60 min (Ordinary)</text>

        {/* Row 6: Hydrant Flow Rate */}
        <rect x="40" y="392" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="415" fontSize="12" fontWeight="600" fill="#1e40af">Hydrant Flow Rate (Per Outlet)</text>
        <rect x="400" y="392" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="415" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">1800</text>
        <rect x="580" y="392" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="415" fontSize="11" fill="#64748b">LPM</text>
        <rect x="720" y="392" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="415" fontSize="11" fill="#475569">IS-5290: 1800 LPM @ 3.5 Bar</text>

        {/* Row 7: Linear Coverage (Drencher) */}
        <rect x="40" y="428" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="60" y="451" fontSize="12" fontWeight="600" fill="#1e40af">Linear Coverage (Water Curtain)</text>
        <rect x="400" y="428" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="420" y="451" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">45</text>
        <rect x="580" y="428" width="140" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="600" y="451" fontSize="11" fill="#64748b">Meters</text>
        <rect x="720" y="428" width="440" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="740" y="451" fontSize="11" fill="#475569">Drencher: 10 LPM/m linear coverage</text>
      </g>

      {/* ========================================== */}
      {/* SECTION 2: PUMP HYDRAULIC CONSTANTS */}
      {/* ========================================== */}
      <g id="section2">
        {/* Section Header */}
        <rect x="1200" y="150" width="1160" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="1220" y="180" fontSize="18" fontWeight="700" fill="#5b21b6">
          🔧 SECTION 2: HYDRAULIC CONSTANTS &amp; SYSTEM PARAMETERS
        </text>

        {/* Constants Grid */}
        <rect x="1200" y="210" width="360" height="38" fill="#1e293b" />
        <text x="1220" y="234" fontSize="13" fontWeight="700" fill="#ffffff">CONSTANT</text>
        <rect x="1560" y="210" width="180" height="38" fill="#1e293b" />
        <text x="1580" y="234" fontSize="13" fontWeight="700" fill="#ffffff">VALUE</text>
        <rect x="1740" y="210" width="120" height="38" fill="#1e293b" />
        <text x="1760" y="234" fontSize="13" fontWeight="700" fill="#ffffff">UNIT</text>
        <rect x="1860" y="210" width="500" height="38" fill="#1e293b" />
        <text x="1880" y="234" fontSize="13" fontWeight="700" fill="#ffffff">DESCRIPTION</text>

        {/* Hazen-Williams C */}
        <rect x="1200" y="248" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="271" fontSize="12" fontWeight="600" fill="#1e40af">Hazen-Williams 'C' Factor</text>
        <rect x="1560" y="248" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="271" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">120</text>
        <rect x="1740" y="248" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="271" fontSize="11" fill="#64748b">—</text>
        <rect x="1860" y="248" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="271" fontSize="11" fill="#475569">New Steel Pipe (GI Class C / MS)</text>

        {/* Coefficient of Discharge */}
        <rect x="1200" y="284" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="307" fontSize="12" fontWeight="600" fill="#1e40af">Coefficient of Discharge (Cd)</text>
        <rect x="1560" y="284" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="307" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">0.62</text>
        <rect x="1740" y="284" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="307" fontSize="11" fill="#64748b">—</text>
        <rect x="1860" y="284" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="307" fontSize="11" fill="#475569">Orifice plate efficiency standard</text>

        {/* Gravity */}
        <rect x="1200" y="320" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="343" fontSize="12" fontWeight="600" fill="#1e40af">Gravitational Acceleration</text>
        <rect x="1560" y="320" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="343" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">9.81</text>
        <rect x="1740" y="320" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="343" fontSize="11" fill="#64748b">m/s²</text>
        <rect x="1860" y="320" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="343" fontSize="11" fill="#475569">Pressure conversion: Bar = (ρ × g × h) / 10⁵</text>

        {/* Floor-to-Floor Height */}
        <rect x="1200" y="356" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="379" fontSize="12" fontWeight="600" fill="#1e40af">Floor-to-Floor Height (Typical)</text>
        <rect x="1560" y="356" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="379" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">3.35</text>
        <rect x="1740" y="356" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="379" fontSize="11" fill="#64748b">Meters</text>
        <rect x="1860" y="356" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="379" fontSize="11" fill="#475569">Architectural standard for static head calc</text>

        {/* Residual Pressure */}
        <rect x="1200" y="392" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="415" fontSize="12" fontWeight="600" fill="#1e40af">Target Residual Pressure (Pr)</text>
        <rect x="1560" y="392" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="415" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">3.5</text>
        <rect x="1740" y="392" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="415" fontSize="11" fill="#64748b">Bar</text>
        <rect x="1860" y="392" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="415" fontSize="11" fill="#475569">Minimum pressure at nozzle/sprinkler head</text>

        {/* Safety Factor */}
        <rect x="1200" y="428" width="360" height="36" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1" />
        <text x="1220" y="451" fontSize="12" fontWeight="600" fill="#1e40af">Safety Factor (Pump Sizing)</text>
        <rect x="1560" y="428" width="180" height="36" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
        <text x="1580" y="451" fontSize="12" fontWeight="700" fill="#0369a1" fontFamily="monospace">1.20</text>
        <rect x="1740" y="428" width="120" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1760" y="451" fontSize="11" fill="#64748b">—</text>
        <rect x="1860" y="428" width="500" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1880" y="451" fontSize="11" fill="#475569">20% margin (equivalent to electrical diversity)</text>
      </g>

      {/* ========================================== */}
      {/* SECTION 3: CALCULATION STACK (HIGH ZONE) */}
      {/* ========================================== */}
      <g id="section3">
        {/* Section Header */}
        <rect x="40" y="510" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="540" fontSize="18" fontWeight="700" fill="#5b21b6">
          🧮 SECTION 3: HYDRAULIC CALCULATION STACK — HIGH ZONE (Sprinkler System)
        </text>

        {/* Step 1: Design Flow Rate */}
        <rect x="40" y="580" width="1120" height="70" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="605" fontSize="14" fontWeight="700" fill="#92400e">
          STEP 1: Design Flow Rate (Q)
        </text>
        <text x="60" y="625" fontSize="12" fill="#78350f" fontFamily="monospace">
          Q = Design Density × Area of Operation
        </text>
        <text x="60" y="642" fontSize="12" fill="#78350f" fontFamily="monospace">
          Q = 12.2 L/min/m² × 186 m² = 2,269 LPM
        </text>

        {/* Step 2: Pipe Geometry Input */}
        <rect x="1200" y="580" width="1160" height="70" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="605" fontSize="14" fontWeight="700" fill="#1e40af">
          STEP 2: Pipe Schedule Input (Main Riser)
        </text>
        <text x="1220" y="625" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Material: GI Class C | DN: 150mm | Length: 185m
        </text>
        <text x="1220" y="642" fontSize="12" fill="#1e3a8a" fontFamily="monospace">
          Fittings: 12×Elbow (90°) + 3×Tee (Branch) + 2×NRV + 1×Butterfly Valve
        </text>

        {/* Step 3: Equivalent Length */}
        <rect x="40" y="670" width="1120" height="90" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="695" fontSize="14" fontWeight="700" fill="#92400e">
          STEP 3: Equivalent Length (Le) — K-Factor Method
        </text>
        <text x="60" y="715" fontSize="11" fill="#78350f" fontFamily="monospace">
          Elbow K=30, Tee K=60, NRV K=50, Butterfly K=20 (K-values × DN)
        </text>
        <text x="60" y="733" fontSize="11" fill="#78350f" fontFamily="monospace">
          Le = (12×30 + 3×60 + 2×50 + 1×20) × 0.15m = (360+180+100+20) × 0.15 = 99m
        </text>
        <text x="60" y="751" fontSize="12" fontWeight="600" fill="#92400e" fontFamily="monospace">
          Total Effective Length = Straight (185m) + Equivalent (99m) = 284m
        </text>

        {/* Step 4: Friction Loss Calculation */}
        <rect x="1200" y="670" width="1160" height="90" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="695" fontSize="14" fontWeight="700" fill="#92400e">
          STEP 4: Friction Head Loss (Hf) — Hazen-Williams Equation
        </text>
        <text x="1220" y="715" fontSize="11" fill="#78350f" fontFamily="monospace">
          Hf = 6.05 × 10⁴ × (Q / C)^1.85 × (L / D^4.87)
        </text>
        <text x="1220" y="733" fontSize="11" fill="#78350f" fontFamily="monospace">
          Hf = 6.05×10⁴ × (2269/120)^1.85 × (284 / 150^4.87) = 6.05×10⁴ × 18.90^1.85 × 0.0000168
        </text>
        <text x="1220" y="751" fontSize="12" fontWeight="600" fill="#92400e" fontFamily="monospace">
          Hf = 65.2 meters = 6.52 Bar
        </text>

        {/* Step 5: Static Head */}
        <rect x="40" y="780" width="1120" height="70" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="805" fontSize="14" fontWeight="700" fill="#92400e">
          STEP 5: Static Head (Hs) — Vertical Lift
        </text>
        <text x="60" y="825" fontSize="12" fill="#78350f" fontFamily="monospace">
          Hs = (Number of Floors × Floor Height) + Tank-to-Pump offset
        </text>
        <text x="60" y="842" fontSize="12" fontWeight="600" fill="#92400e" fontFamily="monospace">
          Hs = (32 floors × 3.35m) + 5m = 107.2m + 5m = 112.2 meters
        </text>

        {/* Step 6: Total Dynamic Head */}
        <rect x="1200" y="780" width="1160" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="805" fontSize="14" fontWeight="700" fill="#065f46">
          STEP 6: Total Dynamic Head (TDH) — Final Calculation
        </text>
        <text x="1220" y="825" fontSize="12" fill="#047857" fontFamily="monospace">
          TDH = Hs + Hf + Pr + (Safety Factor × 20%)
        </text>
        <text x="1220" y="843" fontSize="12" fill="#047857" fontFamily="monospace">
          TDH = 112.2m + 65.2m + (3.5 Bar × 10.2m/Bar) + (177.4m × 0.20)
        </text>
        <text x="1220" y="861" fontSize="14" fontWeight="700" fill="#065f46" fontFamily="monospace">
          TDH = 112.2 + 65.2 + 35.7 + 35.5 = 248.6 meters ≈ 250 meters
        </text>
      </g>

      {/* ========================================== */}
      {/* SECTION 4: ZONE COMPARISON TABLE */}
      {/* ========================================== */}
      <g id="section4">
        {/* Section Header */}
        <rect x="40" y="910" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="940" fontSize="18" fontWeight="700" fill="#5b21b6">
          📊 SECTION 4: MULTI-ZONE COMPARISON TABLE (High Zone vs Low Zone)
        </text>

        {/* Table Headers */}
        <rect x="40" y="980" width="400" height="40" fill="#1e293b" />
        <text x="60" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">PARAMETER</text>
        
        <rect x="440" y="980" width="350" height="40" fill="#dc2626" />
        <text x="520" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">HIGH ZONE (32F–18F)</text>
        
        <rect x="790" y="980" width="350" height="40" fill="#0891b2" />
        <text x="870" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">LOW ZONE (17F–GF)</text>
        
        <rect x="1140" y="980" width="280" height="40" fill="#7c3aed" />
        <text x="1190" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">HYDRANT SYSTEM</text>
        
        <rect x="1420" y="980" width="280" height="40" fill="#059669" />
        <text x="1460" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">WATER CURTAIN</text>
        
        <rect x="1700" y="980" width="660" height="40" fill="#1e293b" />
        <text x="1720" y="1005" fontSize="13" fontWeight="700" fill="#ffffff">DESIGN NOTES</text>

        {/* Row 1: Design Flow */}
        <rect x="40" y="1020" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="1043" fontSize="12" fontWeight="600" fill="#0f172a">Design Flow Rate (Q)</text>
        
        <rect x="440" y="1020" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="1043" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">2,269 LPM</text>
        
        <rect x="790" y="1020" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="1043" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">1,854 LPM</text>
        
        <rect x="1140" y="1020" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="1043" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">3,600 LPM</text>
        
        <rect x="1420" y="1020" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="1043" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">450 LPM</text>
        
        <rect x="1700" y="1020" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="1043" fontSize="11" fill="#475569">Sprinkler: Density × Area; Hydrant: 2×1800</text>

        {/* Row 2: TDH */}
        <rect x="40" y="1056" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="1079" fontSize="12" fontWeight="600" fill="#0f172a">Total Dynamic Head (TDH)</text>
        
        <rect x="440" y="1056" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="1079" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">250 meters</text>
        
        <rect x="790" y="1056" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="1079" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">180 meters</text>
        
        <rect x="1140" y="1056" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="1079" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">120 meters</text>
        
        <rect x="1420" y="1056" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="1079" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">85 meters</text>
        
        <rect x="1700" y="1056" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="1079" fontSize="11" fill="#475569">Includes Hs + Hf + Pr + 20% safety</text>

        {/* Row 3: Pump Power */}
        <rect x="40" y="1092" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="1115" fontSize="12" fontWeight="600" fill="#0f172a">Pump Power (P = ρgQH/η)</text>
        
        <rect x="440" y="1092" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="1115" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">155 kW</text>
        
        <rect x="790" y="1092" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="1115" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">92 kW</text>
        
        <rect x="1140" y="1092" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="1115" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">119 kW</text>
        
        <rect x="1420" y="1092" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="1115" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">10.5 kW</text>
        
        <rect x="1700" y="1092" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="1115" fontSize="11" fill="#475569">Assuming pump efficiency η = 75%</text>

        {/* Row 4: Nominal Pipe Size */}
        <rect x="40" y="1128" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="1151" fontSize="12" fontWeight="600" fill="#0f172a">Nominal Pipe Diameter (DN)</text>
        
        <rect x="440" y="1128" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="1151" fontSize="12" fontWeight="700" fill="#991b1b" fontFamily="monospace">150mm (6")</text>
        
        <rect x="790" y="1128" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="1151" fontSize="12" fontWeight="700" fill="#0e7490" fontFamily="monospace">125mm (5")</text>
        
        <rect x="1140" y="1128" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="1151" fontSize="12" fontWeight="700" fill="#6b21a8" fontFamily="monospace">200mm (8")</text>
        
        <rect x="1420" y="1128" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="1151" fontSize="12" fontWeight="700" fill="#065f46" fontFamily="monospace">80mm (3")</text>
        
        <rect x="1700" y="1128" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="1151" fontSize="11" fill="#475569">Velocity check: 1.5 m/s ≤ V ≤ 3.0 m/s</text>

        {/* Row 5: Selected Pump */}
        <rect x="40" y="1164" width="400" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="60" y="1187" fontSize="12" fontWeight="600" fill="#0f172a">Selected Pump Model</text>
        
        <rect x="440" y="1164" width="350" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="460" y="1187" fontSize="11" fontWeight="700" fill="#991b1b" fontFamily="monospace">KSB Omega 250-315/2</text>
        
        <rect x="790" y="1164" width="350" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="810" y="1187" fontSize="11" fontWeight="700" fill="#0e7490" fontFamily="monospace">Grundfos CR 125-18</text>
        
        <rect x="1140" y="1164" width="280" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="1160" y="1187" fontSize="11" fontWeight="700" fill="#6b21a8" fontFamily="monospace">Kirloskar KDS 200</text>
        
        <rect x="1420" y="1164" width="280" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="1440" y="1187" fontSize="11" fontWeight="700" fill="#065f46" fontFamily="monospace">CRI 3-80-6</text>
        
        <rect x="1700" y="1164" width="660" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1720" y="1187" fontSize="11" fill="#475569">Database lookup based on Q-H curve match</text>
      </g>

      {/* ========================================== */}
      {/* SECTION 5: PRESSURE PROFILE & SAFETY */}
      {/* ========================================== */}
      <g id="section5">
        {/* Section Header */}
        <rect x="40" y="1240" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="1270" fontSize="18" fontWeight="700" fill="#5b21b6">
          ⚠️ SECTION 5: PRESSURE PROFILE &amp; ORIFICE PLATE VALIDATION
        </text>

        {/* Pressure Profile Calculation */}
        <rect x="40" y="1310" width="1120" height="110" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="1335" fontSize="14" fontWeight="700" fill="#9f1239">
          PRESSURE PROFILE: Floor-wise Static Pressure Check
        </text>
        <text x="60" y="1355" fontSize="12" fill="#881337" fontFamily="monospace">
          Floor Pressure (Bar) = Pump Shut-off Head - (Floor Number × 3.35m × 0.0981 Bar/m)
        </text>
        <text x="60" y="1373" fontSize="12" fill="#881337" fontFamily="monospace">
          Example: Floor 5 = 25 Bar - (5 × 3.35 × 0.0981) = 25 - 1.64 = 23.36 Bar
        </text>
        <text x="60" y="1391" fontSize="12" fill="#881337" fontFamily="monospace">
          Floor 18 = 25 Bar - (18 × 3.35 × 0.0981) = 25 - 5.91 = 19.09 Bar
        </text>
        <text x="60" y="1409" fontSize="13" fontWeight="700" fill="#9f1239">
          ⚠️ ALERT: All floors 1-18 have pressure &gt; 7.0 Bar → Orifice Plate REQUIRED
        </text>

        {/* Orifice Plate Sizing */}
        <rect x="1200" y="1310" width="1160" height="110" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="1335" fontSize="14" fontWeight="700" fill="#92400e">
          ORIFICE PLATE SIZING: Pressure Drop Calculation
        </text>
        <text x="1220" y="1355" fontSize="12" fill="#78350f" fontFamily="monospace">
          Target Pressure Drop (ΔP) = Floor Pressure - 3.5 Bar (Target Residual)
        </text>
        <text x="1220" y="1373" fontSize="12" fill="#78350f" fontFamily="monospace">
          Floor 5: ΔP = 23.36 - 3.5 = 19.86 Bar
        </text>
        <text x="1220" y="1391" fontSize="12" fill="#78350f" fontFamily="monospace">
          Orifice Diameter (d) = √[(4×Q) / (Cd × π × √(2gΔP))] = √[(4×2269/60000) / (0.62×3.14×√19.6×19.86)]
        </text>
        <text x="1220" y="1409" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Result: Orifice Ø = 28.5mm for Floor 5 (round to standard 30mm)
        </text>

        {/* Safety Gate Indicator */}
        <rect x="40" y="1440" width="2320" height="90" fill="#fef2f2" stroke="#dc2626" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <g>
          {/* Red Alert Icon */}
          <circle cx="90" cy="1485" r="28" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <text x="90" y="1495" fontSize="24" fontWeight="700" fill="#ffffff" textAnchor="middle">⚠</text>
        </g>
        <text x="140" y="1475" fontSize="16" fontWeight="700" fill="#991b1b">
          SAFETY VALIDATION GATE: Pressure Compliance Check
        </text>
        <text x="140" y="1495" fontSize="13" fill="#7f1d1d" fontFamily="monospace">
          ✓ High Zone Pressure Profile: 19.09 Bar – 23.36 Bar → ORIFICE PLATES INSTALLED
        </text>
        <text x="140" y="1513" fontSize="13" fill="#7f1d1d" fontFamily="monospace">
          ✓ Low Zone Pressure Profile: 3.8 Bar – 6.5 Bar → WITHIN LIMITS (No orifice required)
        </text>
      </g>

      {/* ========================================== */}
      {/* SECTION 6: TANK SIZING & RESERVE */}
      {/* ========================================== */}
      <g id="section6">
        {/* Section Header */}
        <rect x="40" y="1570" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="1600" fontSize="18" fontWeight="700" fill="#5b21b6">
          💧 SECTION 6: WATER TANK SIZING &amp; RESERVE CALCULATION
        </text>

        {/* Tank Calculation */}
        <rect x="40" y="1640" width="1120" height="120" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="1665" fontSize="14" fontWeight="700" fill="#92400e">
          SPRINKLER RESERVE CALCULATION
        </text>
        <text x="60" y="1685" fontSize="12" fill="#78350f" fontFamily="monospace">
          Volume = Design Flow × Duration
        </text>
        <text x="60" y="1703" fontSize="12" fill="#78350f" fontFamily="monospace">
          High Zone: 2,269 LPM × 60 min = 136,140 liters ≈ 137 KL
        </text>
        <text x="60" y="1721" fontSize="12" fill="#78350f" fontFamily="monospace">
          Low Zone: 1,854 LPM × 60 min = 111,240 liters ≈ 112 KL
        </text>
        <text x="60" y="1739" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Total Sprinkler Reserve = 137 + 112 = 249 KL
        </text>
        <text x="60" y="1754" fontSize="11" fill="#78350f">
          Note: Rounded up to 250 KL for standard tank size
        </text>

        {/* Hydrant + Curtain Reserve */}
        <rect x="1200" y="1640" width="1160" height="120" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="1665" fontSize="14" fontWeight="700" fill="#92400e">
          HYDRANT &amp; WATER CURTAIN RESERVE
        </text>
        <text x="1220" y="1685" fontSize="12" fill="#78350f" fontFamily="monospace">
          Hydrant: 3,600 LPM × 60 min = 216,000 liters = 216 KL
        </text>
        <text x="1220" y="1703" fontSize="12" fill="#78350f" fontFamily="monospace">
          Water Curtain: 450 LPM × 60 min = 27,000 liters = 27 KL
        </text>
        <text x="1220" y="1721" fontSize="12" fill="#78350f" fontFamily="monospace">
          Jockey Pump (Pressure Maintenance): 15 KL
        </text>
        <text x="1220" y="1739" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          Total Hydrant System = 216 + 27 + 15 = 258 KL
        </text>
        <text x="1220" y="1754" fontSize="11" fill="#78350f">
          Note: Rounded up to 260 KL for standard tank size
        </text>

        {/* Grand Total */}
        <rect x="40" y="1780" width="2320" height="70" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <g>
          {/* Green Success Icon */}
          <circle cx="90" cy="1815" r="28" fill="#10b981" stroke="#059669" strokeWidth="2" />
          <text x="90" y="1825" fontSize="24" fontWeight="700" fill="#ffffff" textAnchor="middle">✓</text>
        </g>
        <text x="140" y="1808" fontSize="16" fontWeight="700" fill="#065f46">
          TOTAL FIRE RESERVE CAPACITY (Combined Underground Tank)
        </text>
        <text x="140" y="1828" fontSize="14" fill="#047857" fontFamily="monospace">
          Total = Sprinkler (250 KL) + Hydrant (260 KL) = 510 KL
        </text>
        <text x="140" y="1843" fontSize="12" fill="#047857">
          Tank Specification: 510,000 liters | Recommended: 2 × 260 KL tanks for redundancy
        </text>
      </g>

      {/* ========================================== */}
      {/* SECTION 7: PUMP SELECTION SUMMARY */}
      {/* ========================================== */}
      <g id="section7">
        {/* Section Header */}
        <rect x="40" y="1890" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="1920" fontSize="18" fontWeight="700" fill="#5b21b6">
          🔧 SECTION 7: PUMP SELECTION SUMMARY &amp; BOM (Bill of Materials)
        </text>

        {/* Pump BOM Table */}
        <rect x="40" y="1960" width="340" height="40" fill="#1e293b" />
        <text x="60" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">PUMP TYPE</text>
        
        <rect x="380" y="1960" width="280" height="40" fill="#1e293b" />
        <text x="400" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">FLOW (Q)</text>
        
        <rect x="660" y="1960" width="280" height="40" fill="#1e293b" />
        <text x="680" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">HEAD (H)</text>
        
        <rect x="940" y="1960" width="280" height="40" fill="#1e293b" />
        <text x="960" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">POWER (kW)</text>
        
        <rect x="1220" y="1960" width="450" height="40" fill="#1e293b" />
        <text x="1240" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">SELECTED MODEL</text>
        
        <rect x="1670" y="1960" width="120" height="40" fill="#1e293b" />
        <text x="1690" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">QTY</text>
        
        <rect x="1790" y="1960" width="570" height="40" fill="#1e293b" />
        <text x="1810" y="1985" fontSize="13" fontWeight="700" fill="#ffffff">DUTY CYCLE</text>

        {/* Row 1: High Zone Main Pump */}
        <rect x="40" y="2000" width="340" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="60" y="2023" fontSize="12" fontWeight="600" fill="#991b1b">High Zone Main Pump</text>
        
        <rect x="380" y="2000" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="2023" fontSize="12" fontFamily="monospace" fill="#0f172a">2,269 LPM</text>
        
        <rect x="660" y="2000" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2023" fontSize="12" fontFamily="monospace" fill="#0f172a">250 meters</text>
        
        <rect x="940" y="2000" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="2023" fontSize="12" fontFamily="monospace" fill="#0f172a">155 kW</text>
        
        <rect x="1220" y="2000" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2023" fontSize="11" fontFamily="monospace" fill="#0f172a">KSB Omega 250-315/2</text>
        
        <rect x="1670" y="2000" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="2023" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="2000" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="2023" fontSize="11" fill="#475569">Duty + Standby (Auto-alternate weekly)</text>

        {/* Row 2: Low Zone Main Pump */}
        <rect x="40" y="2036" width="340" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="60" y="2059" fontSize="12" fontWeight="600" fill="#0e7490">Low Zone Main Pump</text>
        
        <rect x="380" y="2036" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="2059" fontSize="12" fontFamily="monospace" fill="#0f172a">1,854 LPM</text>
        
        <rect x="660" y="2036" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2059" fontSize="12" fontFamily="monospace" fill="#0f172a">180 meters</text>
        
        <rect x="940" y="2036" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="2059" fontSize="12" fontFamily="monospace" fill="#0f172a">92 kW</text>
        
        <rect x="1220" y="2036" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2059" fontSize="11" fontFamily="monospace" fill="#0f172a">Grundfos CR 125-18</text>
        
        <rect x="1670" y="2036" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="2059" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="2036" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="2059" fontSize="11" fill="#475569">Duty + Standby (Auto-alternate weekly)</text>

        {/* Row 3: Hydrant Pump */}
        <rect x="40" y="2072" width="340" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="60" y="2095" fontSize="12" fontWeight="600" fill="#6b21a8">Hydrant System Pump</text>
        
        <rect x="380" y="2072" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="2095" fontSize="12" fontFamily="monospace" fill="#0f172a">3,600 LPM</text>
        
        <rect x="660" y="2072" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2095" fontSize="12" fontFamily="monospace" fill="#0f172a">120 meters</text>
        
        <rect x="940" y="2072" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="2095" fontSize="12" fontFamily="monospace" fill="#0f172a">119 kW</text>
        
        <rect x="1220" y="2072" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2095" fontSize="11" fontFamily="monospace" fill="#0f172a">Kirloskar KDS 200</text>
        
        <rect x="1670" y="2072" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1710" y="2095" fontSize="12" fontWeight="700" fill="#0f172a">1+1</text>
        
        <rect x="1790" y="2072" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="2095" fontSize="11" fill="#475569">Duty + Standby (Auto-alternate weekly)</text>

        {/* Row 4: Jockey Pump (High Zone) */}
        <rect x="40" y="2108" width="340" height="36" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        <text x="60" y="2131" fontSize="12" fontWeight="600" fill="#9a3412">Jockey Pump (High Zone)</text>
        
        <rect x="380" y="2108" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="2131" fontSize="12" fontFamily="monospace" fill="#0f172a">60 LPM</text>
        
        <rect x="660" y="2108" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2131" fontSize="12" fontFamily="monospace" fill="#0f172a">270 meters</text>
        
        <rect x="940" y="2108" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="2131" fontSize="12" fontFamily="monospace" fill="#0f172a">4.5 kW</text>
        
        <rect x="1220" y="2108" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2131" fontSize="11" fontFamily="monospace" fill="#0f172a">Grundfos CR 3-36</text>
        
        <rect x="1670" y="2108" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1730" y="2131" fontSize="12" fontWeight="700" fill="#0f172a">1</text>
        
        <rect x="1790" y="2108" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="2131" fontSize="11" fill="#475569">Pressure maintenance (Auto on/off)</text>

        {/* Row 5: Water Curtain Pump */}
        <rect x="40" y="2144" width="340" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="60" y="2167" fontSize="12" fontWeight="600" fill="#065f46">Water Curtain Pump</text>
        
        <rect x="380" y="2144" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="400" y="2167" fontSize="12" fontFamily="monospace" fill="#0f172a">450 LPM</text>
        
        <rect x="660" y="2144" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2167" fontSize="12" fontFamily="monospace" fill="#0f172a">85 meters</text>
        
        <rect x="940" y="2144" width="280" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="960" y="2167" fontSize="12" fontFamily="monospace" fill="#0f172a">10.5 kW</text>
        
        <rect x="1220" y="2144" width="450" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2167" fontSize="11" fontFamily="monospace" fill="#0f172a">CRI 3-80-6</text>
        
        <rect x="1670" y="2144" width="120" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1730" y="2167" fontSize="12" fontWeight="700" fill="#0f172a">1</text>
        
        <rect x="1790" y="2144" width="570" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1810" y="2167" fontSize="11" fill="#475569">Drencher system (Manual activation)</text>

        {/* Total Power Summary */}
        <rect x="40" y="2190" width="900" height="40" fill="#1e293b" />
        <text x="60" y="2215" fontSize="13" fontWeight="700" fill="#ffffff">TOTAL ELECTRICAL LOAD (All Pumps Running)</text>
        
        <rect x="940" y="2190" width="280" height="40" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
        <text x="960" y="2215" fontSize="14" fontWeight="700" fill="#92400e" fontFamily="monospace">381.0 kW</text>
        
        <rect x="1220" y="2190" width="1140" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1240" y="2215" fontSize="12" fill="#475569">Connected Load (DG Sizing): 381 kW × 1.25 = 476 kVA</text>
      </g>

      {/* ========================================== */}
      {/* SECTION 8: PIPE SCHEDULE & BOM */}
      {/* ========================================== */}
      <g id="section8">
        {/* Section Header */}
        <rect x="40" y="2270" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="2300" fontSize="18" fontWeight="700" fill="#5b21b6">
          📋 SECTION 8: PIPE SCHEDULE &amp; MATERIAL BOM (High Zone Example)
        </text>

        {/* Pipe BOM Table */}
        <rect x="40" y="2340" width="260" height="40" fill="#1e293b" />
        <text x="60" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">PIPE SEGMENT</text>
        
        <rect x="300" y="2340" width="160" height="40" fill="#1e293b" />
        <text x="320" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">DN (mm)</text>
        
        <rect x="460" y="2340" width="200" height="40" fill="#1e293b" />
        <text x="480" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">MATERIAL</text>
        
        <rect x="660" y="2340" width="160" height="40" fill="#1e293b" />
        <text x="680" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">LENGTH (m)</text>
        
        <rect x="820" y="2340" width="250" height="40" fill="#1e293b" />
        <text x="840" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">FITTINGS</text>
        
        <rect x="1070" y="2340" width="200" height="40" fill="#1e293b" />
        <text x="1090" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">VELOCITY (m/s)</text>
        
        <rect x="1270" y="2340" width="200" height="40" fill="#1e293b" />
        <text x="1290" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">Hf (Bar)</text>
        
        <rect x="1470" y="2340" width="890" height="40" fill="#1e293b" />
        <text x="1490" y="2365" fontSize="13" fontWeight="700" fill="#ffffff">REMARKS</text>

        {/* Row 1: Main Riser */}
        <rect x="40" y="2380" width="260" height="36" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
        <text x="60" y="2403" fontSize="12" fontWeight="600" fill="#991b1b">Main Riser (UGT-32F)</text>
        
        <rect x="300" y="2380" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="2403" fontSize="12" fontFamily="monospace" fill="#0f172a">150</text>
        
        <rect x="460" y="2380" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="2403" fontSize="11" fill="#0f172a">GI Class C</text>
        
        <rect x="660" y="2380" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2403" fontSize="12" fontFamily="monospace" fill="#0f172a">185.0</text>
        
        <rect x="820" y="2380" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="2403" fontSize="11" fill="#0f172a">12×Elbow + 3×Tee</text>
        
        <rect x="1070" y="2380" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="2403" fontSize="12" fontFamily="monospace" fill="#0f172a">2.14</text>
        
        <rect x="1270" y="2380" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="2403" fontSize="12" fontFamily="monospace" fill="#0f172a">6.52</text>
        
        <rect x="1470" y="2380" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="2403" fontSize="11" fill="#475569">Main vertical pipe from pump to terrace tank</text>

        {/* Row 2: Floor Branch */}
        <rect x="40" y="2416" width="260" height="36" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1" />
        <text x="60" y="2439" fontSize="12" fontWeight="600" fill="#0e7490">Floor Branch (Typical)</text>
        
        <rect x="300" y="2416" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="2439" fontSize="12" fontFamily="monospace" fill="#0f172a">100</text>
        
        <rect x="460" y="2416" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="2439" fontSize="11" fill="#0f172a">GI Class C</text>
        
        <rect x="660" y="2416" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2439" fontSize="12" fontFamily="monospace" fill="#0f172a">45.0</text>
        
        <rect x="820" y="2416" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="2439" fontSize="11" fill="#0f172a">6×Elbow + 1×Tee</text>
        
        <rect x="1070" y="2416" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="2439" fontSize="12" fontFamily="monospace" fill="#0f172a">1.82</text>
        
        <rect x="1270" y="2416" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="2439" fontSize="12" fontFamily="monospace" fill="#0f172a">0.85</text>
        
        <rect x="1470" y="2416" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="2439" fontSize="11" fill="#475569">Horizontal distribution per floor (32 branches total)</text>

        {/* Row 3: Sprinkler Laterals */}
        <rect x="40" y="2452" width="260" height="36" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1" />
        <text x="60" y="2475" fontSize="12" fontWeight="600" fill="#6b21a8">Sprinkler Laterals</text>
        
        <rect x="300" y="2452" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="2475" fontSize="12" fontFamily="monospace" fill="#0f172a">25</text>
        
        <rect x="460" y="2452" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="2475" fontSize="11" fill="#0f172a">GI Class B</text>
        
        <rect x="660" y="2452" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2475" fontSize="12" fontFamily="monospace" fill="#0f172a">3.5</text>
        
        <rect x="820" y="2452" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="2475" fontSize="11" fill="#0f172a">2×Elbow</text>
        
        <rect x="1070" y="2452" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="2475" fontSize="12" fontFamily="monospace" fill="#0f172a">1.35</text>
        
        <rect x="1270" y="2452" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="2475" fontSize="12" fontFamily="monospace" fill="#0f172a">0.12</text>
        
        <rect x="1470" y="2452" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="2475" fontSize="11" fill="#475569">Drop to sprinkler head (186 units total)</text>

        {/* Row 4: Orifice Plate Locations */}
        <rect x="40" y="2488" width="260" height="36" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
        <text x="60" y="2511" fontSize="12" fontWeight="600" fill="#9a3412">Orifice Plates (Low Floors)</text>
        
        <rect x="300" y="2488" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="2511" fontSize="12" fontFamily="monospace" fill="#0f172a">30</text>
        
        <rect x="460" y="2488" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="2511" fontSize="11" fill="#0f172a">SS316</text>
        
        <rect x="660" y="2488" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2511" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="820" y="2488" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="2511" fontSize="11" fill="#0f172a">Flanged</text>
        
        <rect x="1070" y="2488" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="2511" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="1270" y="2488" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="2511" fontSize="12" fontFamily="monospace" fill="#0f172a">19.86</text>
        
        <rect x="1470" y="2488" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="2511" fontSize="11" fill="#475569">Installed on Floors 1-18 to reduce pressure to 3.5 Bar</text>

        {/* Row 5: Valves & Controls */}
        <rect x="40" y="2524" width="260" height="36" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="60" y="2547" fontSize="12" fontWeight="600" fill="#065f46">NRV + Butterfly Valves</text>
        
        <rect x="300" y="2524" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="320" y="2547" fontSize="12" fontFamily="monospace" fill="#0f172a">150</text>
        
        <rect x="460" y="2524" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="480" y="2547" fontSize="11" fill="#0f172a">CI/DI</text>
        
        <rect x="660" y="2524" width="160" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="680" y="2547" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="820" y="2524" width="250" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="840" y="2547" fontSize="11" fill="#0f172a">2×NRV + 1×BFV</text>
        
        <rect x="1070" y="2524" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1090" y="2547" fontSize="12" fontFamily="monospace" fill="#0f172a">—</text>
        
        <rect x="1270" y="2524" width="200" height="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1290" y="2547" fontSize="12" fontFamily="monospace" fill="#0f172a">Included</text>
        
        <rect x="1470" y="2524" width="890" height="36" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1490" y="2547" fontSize="11" fill="#475569">Pump discharge line control valves (per IS-5290)</text>
      </g>

      {/* ========================================== */}
      {/* SECTION 9: COMPLIANCE & SIGN-OFF */}
      {/* ========================================== */}
      <g id="section9">
        {/* Section Header */}
        <rect x="40" y="2600" width="2320" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
        <text x="60" y="2630" fontSize="18" fontWeight="700" fill="#5b21b6">
          ✅ SECTION 9: STANDARDS COMPLIANCE &amp; ENGINEERING SIGN-OFF
        </text>

        {/* Compliance Checklist */}
        <rect x="40" y="2670" width="1120" height="200" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="60" y="2695" fontSize="14" fontWeight="700" fill="#0f172a">
          COMPLIANCE CHECKLIST (Standards Verification)
        </text>

        {/* Checklist Items */}
        <text x="80" y="2720" fontSize="12" fill="#059669">
          ✓ IS-15105:2002 — Installation &amp; Maintenance of Sprinkler Systems
        </text>
        <text x="80" y="2740" fontSize="12" fill="#059669">
          ✓ NFPA-13:2022 — Standard for Installation of Sprinkler Systems
        </text>
        <text x="80" y="2760" fontSize="12" fill="#059669">
          ✓ IS-5290:1969 — Code of Practice for Hydrant Installation
        </text>
        <text x="80" y="2780" fontSize="12" fill="#059669">
          ✓ NBC Part 4:2016 — Fire &amp; Life Safety (Section 7: Water Supply)
        </text>
        <text x="80" y="2800" fontSize="12" fill="#059669">
          ✓ Hazen-Williams Formula Verified (C=120 for new steel pipes)
        </text>
        <text x="80" y="2820" fontSize="12" fill="#059669">
          ✓ Pressure Profile Check: All floors within 3.5–7.0 Bar operating range
        </text>
        <text x="80" y="2840" fontSize="12" fill="#059669">
          ✓ Orifice Plate Sizing: Floors 1-18 protected from overpressure
        </text>
        <text x="80" y="2860" fontSize="12" fill="#059669">
          ✓ Pump Selection: Q-H curve matched with manufacturer datasheets
        </text>

        {/* Engineering Sign-off */}
        <rect x="1200" y="2670" width="1160" height="200" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" rx="6" filter="url(#dropShadow)" />
        <text x="1220" y="2695" fontSize="14" fontWeight="700" fill="#92400e">
          ENGINEERING SIGN-OFF &amp; APPROVALS
        </text>

        <text x="1240" y="2725" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Prepared by:</tspan> Sr. MEP Design Engineer
        </text>
        <text x="1240" y="2745" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Reviewed by:</tspan> Principal Fire Protection Consultant
        </text>
        <text x="1240" y="2765" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Approved by:</tspan> Chief MEP Consultant (PE License: MH-12345)
        </text>
        <text x="1240" y="2785" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Date:</tspan> March 12, 2026
        </text>
        <text x="1240" y="2805" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Revision:</tspan> Rev 02 (Post CFO Review)
        </text>
        <text x="1240" y="2825" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Project Code:</tspan> LODHA-CT-B-MEP-FF-001
        </text>
        <text x="1240" y="2845" fontSize="12" fill="#78350f">
          <tspan fontWeight="700">Drawing Status:</tspan> FOR CONSTRUCTION
        </text>

        {/* Warning Box */}
        <rect x="1240" y="2855" width="1100" height="15" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,2" rx="3" />
        <text x="1250" y="2866" fontSize="10" fill="#dc2626" fontStyle="italic">
          ⚠ Note: All field modifications require written approval from Principal Consultant
        </text>
      </g>

      {/* ========================================== */}
      {/* SECTION 10: VISUAL LEGEND */}
      {/* ========================================== */}
      <g id="legend">
        {/* Section Header */}
        <rect x="40" y="2910" width="2320" height="50" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
        <text x="60" y="2940" fontSize="18" fontWeight="700" fill="#ffffff">
          🎨 LEGEND: COLOR CODING &amp; SYMBOLS
        </text>

        {/* Legend Items */}
        <g transform="translate(60, 2980)">
          {/* Input */}
          <rect x="0" y="0" width="80" height="30" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
          <text x="90" y="20" fontSize="12" fontWeight="600" fill="#1e40af">Input / Constant</text>

          {/* Calculation */}
          <rect x="280" y="0" width="80" height="30" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="1.5" rx="4" />
          <text x="370" y="20" fontSize="12" fontWeight="600" fill="#92400e">Formula / Calculation</text>

          {/* Output */}
          <rect x="600" y="0" width="80" height="30" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="1.5" rx="4" />
          <text x="690" y="20" fontSize="12" fontWeight="600" fill="#065f46">Output / Result</text>

          {/* Safety */}
          <rect x="900" y="0" width="80" height="30" fill="url(#safetyGrad)" stroke="#f43f5e" strokeWidth="1.5" rx="4" />
          <text x="990" y="20" fontSize="12" fontWeight="600" fill="#9f1239">Safety / Validation</text>

          {/* High Zone */}
          <rect x="1200" y="0" width="80" height="30" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" rx="4" />
          <text x="1290" y="20" fontSize="12" fontWeight="600" fill="#991b1b">High Zone</text>

          {/* Low Zone */}
          <rect x="1480" y="0" width="80" height="30" fill="#ecfeff" stroke="#67e8f9" strokeWidth="1.5" rx="4" />
          <text x="1570" y="20" fontSize="12" fontWeight="600" fill="#0e7490">Low Zone</text>

          {/* Hydrant */}
          <rect x="1760" y="0" width="80" height="30" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" rx="4" />
          <text x="1850" y="20" fontSize="12" fontWeight="600" fill="#6b21a8">Hydrant System</text>

          {/* Curtain */}
          <rect x="2100" y="0" width="80" height="30" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1.5" rx="4" />
          <text x="2190" y="20" fontSize="12" fontWeight="600" fill="#065f46">Water Curtain</text>
        </g>
      </g>

      {/* ========================================== */}
      {/* SECTION 11: FORMULAS REFERENCE */}
      {/* ========================================== */}
      <g id="formulas">
        {/* Section Header */}
        <rect x="40" y="3050" width="2320" height="50" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
        <text x="60" y="3080" fontSize="18" fontWeight="700" fill="#ffffff">
          📐 KEY FORMULAS REFERENCE (Quick Lookup)
        </text>

        {/* Formula Cards */}
        <g id="formula-cards">
          {/* Formula 1 */}
          <rect x="40" y="3120" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="60" y="3145" fontSize="13" fontWeight="700" fill="#5b21b6">1. Design Flow Rate (Q)</text>
          <text x="60" y="3165" fontSize="11" fill="#6b21a8" fontFamily="monospace">Q = Density × Area</text>
          <text x="60" y="3182" fontSize="10" fill="#7c3aed">Units: L/min/m² × m² = LPM</text>
          <text x="60" y="3199" fontSize="10" fill="#7c3aed">Example: 12.2 × 186 = 2,269 LPM</text>

          {/* Formula 2 */}
          <rect x="600" y="3120" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="620" y="3145" fontSize="13" fontWeight="700" fill="#5b21b6">2. Hazen-Williams (Friction Loss)</text>
          <text x="620" y="3165" fontSize="11" fill="#6b21a8" fontFamily="monospace">Hf = 6.05×10⁴ × (Q/C)^1.85 × (L/D^4.87)</text>
          <text x="620" y="3182" fontSize="10" fill="#7c3aed">Q: Flow (LPM), C: 120, L: Length (m), D: Diameter (mm)</text>
          <text x="620" y="3199" fontSize="10" fill="#7c3aed">Result in meters of head</text>

          {/* Formula 3 */}
          <rect x="1160" y="3120" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="1180" y="3145" fontSize="13" fontWeight="700" fill="#5b21b6">3. Total Dynamic Head (TDH)</text>
          <text x="1180" y="3165" fontSize="11" fill="#6b21a8" fontFamily="monospace">TDH = Hs + Hf + Pr + (Safety × 20%)</text>
          <text x="1180" y="3182" fontSize="10" fill="#7c3aed">Hs: Static, Hf: Friction, Pr: Residual (3.5 Bar = 35.7m)</text>
          <text x="1180" y="3199" fontSize="10" fill="#7c3aed">All converted to meters</text>

          {/* Formula 4 */}
          <rect x="1720" y="3120" width="640" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="1740" y="3145" fontSize="13" fontWeight="700" fill="#5b21b6">4. Orifice Plate Diameter</text>
          <text x="1740" y="3165" fontSize="11" fill="#6b21a8" fontFamily="monospace">d = √[(4×Q/60000) / (Cd × π × √(2g×ΔP))]</text>
          <text x="1740" y="3182" fontSize="10" fill="#7c3aed">Q: LPM, Cd: 0.62, g: 9.81 m/s², ΔP: Pressure drop (Bar×10.2)</text>
          <text x="1740" y="3199" fontSize="10" fill="#7c3aed">Result in mm (round to nearest 5mm)</text>

          {/* Formula 5 */}
          <rect x="40" y="3230" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="60" y="3255" fontSize="13" fontWeight="700" fill="#5b21b6">5. Pump Power (P)</text>
          <text x="60" y="3275" fontSize="11" fill="#6b21a8" fontFamily="monospace">P = (ρ × g × Q × H) / η</text>
          <text x="60" y="3292" fontSize="10" fill="#7c3aed">ρ: 1000 kg/m³, g: 9.81, Q: m³/s, H: meters, η: 0.75</text>
          <text x="60" y="3309" fontSize="10" fill="#7c3aed">Convert LPM to m³/s: divide by 60,000</text>

          {/* Formula 6 */}
          <rect x="600" y="3230" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="620" y="3255" fontSize="13" fontWeight="700" fill="#5b21b6">6. Pipe Velocity (V)</text>
          <text x="620" y="3275" fontSize="11" fill="#6b21a8" fontFamily="monospace">V = (4 × Q) / (π × D²)</text>
          <text x="620" y="3292" fontSize="10" fill="#7c3aed">Q in m³/s, D in meters</text>
          <text x="620" y="3309" fontSize="10" fill="#7c3aed">Check: 1.5 ≤ V ≤ 3.0 m/s for fire systems</text>

          {/* Formula 7 */}
          <rect x="1160" y="3230" width="540" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="1180" y="3255" fontSize="13" fontWeight="700" fill="#5b21b6">7. Tank Volume</text>
          <text x="1180" y="3275" fontSize="11" fill="#6b21a8" fontFamily="monospace">V = Q × Duration</text>
          <text x="1180" y="3292" fontSize="10" fill="#7c3aed">Q: LPM, Duration: Minutes</text>
          <text x="1180" y="3309" fontSize="10" fill="#7c3aed">Result in liters (divide by 1000 for KL)</text>

          {/* Formula 8 */}
          <rect x="1720" y="3230" width="640" height="90" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" rx="6" />
          <text x="1740" y="3255" fontSize="13" fontWeight="700" fill="#5b21b6">8. Equivalent Length (Le)</text>
          <text x="1740" y="3275" fontSize="11" fill="#6b21a8" fontFamily="monospace">Le = Σ(Fitting K-factor × DN)</text>
          <text x="1740" y="3292" fontSize="10" fill="#7c3aed">Elbow: K=30, Tee: K=60, NRV: K=50, BFV: K=20</text>
          <text x="1740" y="3309" fontSize="10" fill="#7c3aed">DN in meters, Result: Total equivalent length (m)</text>
        </g>
      </g>

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}
      <g id="footer">
        <rect x="40" y="3360" width="2320" height="60" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="8" />
        <text x="120" y="3390" fontSize="13" fontWeight="600" fill="#94a3b8">
          MEP Digital Ecosystem — Fire Fighting System Hydraulic Calculator
        </text>
        <text x="120" y="3407" fontSize="11" fill="#64748b">
          © 2026 Lodha Engineering | IS-15105 / NFPA-13 / IS-5290 Compliant | Hazen-Williams Method | Rev 02
        </text>
        <text x="2100" y="3390" fontSize="13" fontWeight="700" fill="#ffffff">
          Page 1 of 1
        </text>
        <text x="2100" y="3407" fontSize="11" fill="#64748b">
          FOR CONSTRUCTION
        </text>
      </g>

      {/* End SVG */}
    </svg>
  );
}
