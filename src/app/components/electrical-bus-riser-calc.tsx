import React from "react";

// =====================================================================
// ELECTRICAL BUS RISER SYSTEM — COMPREHENSIVE DESIGN PACKAGE
// Flat Unit Load → Bus Riser Loading → Voltage Drop → Hardware BOM
// =====================================================================

export function ElectricalBusRiserCalcSVG() {
  return (
    <svg
      viewBox="0 0 2400 7200"
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#eab308", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ca8a04", stopOpacity: 1 }} />
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
        <linearGradient id="alertGrad" x1="0%" y1="0%" x2="0%" y2="100%">
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
      {/* MASTER HEADER */}
      {/* ========================================== */}
      <g id="master-header">
        <rect x="40" y="30" width="2320" height="110" fill="url(#headerGrad)" stroke="#ca8a04" strokeWidth="3" rx="12" filter="url(#dropShadow)" />
        <text x="120" y="70" fontSize="36" fontWeight="800" fill="#422006">
          ⚡ ELECTRICAL BUS RISER SYSTEM — COMPLETE DESIGN CALCULATION
        </text>
        <text x="120" y="105" fontSize="14" fontWeight="600" fill="#78350f">
          Flat Unit Load | Floor Aggregation | Bus Duct Sizing | Current &amp; Voltage Drop | Hardware BOM | Validation Dashboard
        </text>
        <text x="120" y="125" fontSize="12" fontWeight="500" fill="#a16207">
          Project: Lodha Crown Tower-B | System: 3Ph+1E+1N Sandwich Type AL | Vendor: C&amp;S Electric | 33 Floors + Basement
        </text>
      </g>

      {/* ========================================== */}
      {/* PHASE A: FLAT UNIT LOAD CALCULATION */}
      {/* ========================================== */}
      <g id="phase-a">
        <rect x="40" y="170" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="202" fontSize="20" fontWeight="700" fill="#ffffff">
          PHASE A: FLAT UNIT LOAD CALCULATION (Sheet: FLAT UNIT LOAD)
        </text>

        {/* A1: Fixture Inventory */}
        <rect x="40" y="240" width="1140" height="250" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="265" fontSize="14" fontWeight="700" fill="#1e40af">
          A1: FIXTURE INVENTORY — Typical 3BHK Apartment (1200 sqft)
        </text>

        {/* Fixture Table Headers */}
        <rect x="70" y="285" width="320" height="35" fill="#1e293b" />
        <text x="90" y="307" fontSize="12" fontWeight="700" fill="#ffffff">FIXTURE TYPE</text>
        <rect x="390" y="285" width="120" height="35" fill="#1e293b" />
        <text x="410" y="307" fontSize="12" fontWeight="700" fill="#ffffff">QTY</text>
        <rect x="510" y="285" width="150" height="35" fill="#1e293b" />
        <text x="530" y="307" fontSize="12" fontWeight="700" fill="#ffffff">WATTAGE (W)</text>
        <rect x="660" y="285" width="180" height="35" fill="#1e293b" />
        <text x="680" y="307" fontSize="12" fontWeight="700" fill="#ffffff">LOAD (W)</text>
        <rect x="840" y="285" width="320" height="35" fill="#1e293b" />
        <text x="860" y="307" fontSize="12" fontWeight="700" fill="#ffffff">NOTES</text>

        {/* Light Points */}
        <rect x="70" y="320" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="340" fontSize="11" fill="#0f172a">Light Points (LED)</text>
        <rect x="390" y="320" width="120" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="430" y="340" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">18</text>
        <rect x="510" y="320" width="150" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="550" y="340" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">12</text>
        <rect x="660" y="320" width="180" height="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="700" y="340" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">216</text>
        <rect x="840" y="320" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="860" y="340" fontSize="10" fill="#475569">Living + Bed + Kitchen</text>

        {/* Ceiling Fans */}
        <rect x="70" y="350" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="370" fontSize="11" fill="#0f172a">Ceiling Fans (BLDC)</text>
        <rect x="390" y="350" width="120" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="430" y="370" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">5</text>
        <rect x="510" y="350" width="150" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="550" y="370" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">75</text>
        <rect x="660" y="350" width="180" height="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="700" y="370" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">375</text>
        <rect x="840" y="350" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="860" y="370" fontSize="10" fill="#475569">3 Bedrooms + 2 Hall</text>

        {/* 6A Sockets */}
        <rect x="70" y="380" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="400" fontSize="11" fill="#0f172a">6A Sockets (General)</text>
        <rect x="390" y="380" width="120" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="430" y="400" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">12</text>
        <rect x="510" y="380" width="150" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="550" y="400" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">100</text>
        <rect x="660" y="380" width="180" height="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="700" y="400" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">1,200</text>
        <rect x="840" y="380" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="860" y="400" fontSize="10" fill="#475569">Mobile chargers, TV, etc.</text>

        {/* 16A Sockets */}
        <rect x="70" y="410" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="430" fontSize="11" fill="#0f172a">16A Sockets (Heavy Duty)</text>
        <rect x="390" y="410" width="120" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="430" y="430" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">8</text>
        <rect x="510" y="410" width="150" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="550" y="430" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">500</text>
        <rect x="660" y="410" width="180" height="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="700" y="430" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">4,000</text>
        <rect x="840" y="410" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="860" y="430" fontSize="10" fill="#475569">Fridge, Microwave, Washing Machine</text>

        {/* AC Points */}
        <rect x="70" y="440" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="460" fontSize="11" fill="#0f172a">Air Conditioner (1.5 TR each)</text>
        <rect x="390" y="440" width="120" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="430" y="460" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">3</text>
        <rect x="510" y="440" width="150" height="30" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="550" y="460" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">1,500</text>
        <rect x="660" y="440" width="180" height="30" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="700" y="460" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">4,500</text>
        <rect x="840" y="440" width="320" height="30" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="860" y="460" fontSize="10" fill="#475569">Per TR = 1000W (cooling load)</text>

        {/* Total Connected Load */}
        <rect x="70" y="470" width="590" height="35" fill="#1e293b" />
        <text x="90" y="492" fontSize="13" fontWeight="700" fill="#ffffff">TOTAL CONNECTED LOAD (CL)</text>
        <rect x="660" y="470" width="180" height="35" fill="#fef3c7" stroke="#fde68a" strokeWidth="2" />
        <text x="680" y="492" fontSize="14" fontWeight="700" fontFamily="monospace" fill="#92400e">10,291 W</text>
        <rect x="840" y="470" width="320" height="35" fill="#1e293b" />
        <text x="860" y="492" fontSize="11" fill="#ffffff">≈ 10.3 kW per flat</text>

        {/* A2: Maximum Demand Calculation */}
        <rect x="1220" y="240" width="1140" height="250" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="265" fontSize="14" fontWeight="700" fill="#92400e">
          A2: MAXIMUM DEMAND (MD) AT DB LEVEL — Diversity Factor Application
        </text>

        {/* Diversity Logic */}
        <rect x="1250" y="290" width="1090" height="50" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="6" />
        <text x="1270" y="310" fontSize="12" fontWeight="700" fill="#78350f">
          DIVERSITY FACTOR (DF) — Lodha MEP Policy
        </text>
        <text x="1270" y="328" fontSize="11" fill="#78350f" fontFamily="monospace">
          Not all fixtures operate simultaneously → Apply DF = 0.60 (60% simultaneous usage)
        </text>

        {/* MD Calculation */}
        <rect x="1250" y="355" width="1090" height="60" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="6" />
        <text x="1270" y="375" fontSize="12" fontWeight="700" fill="#78350f">
          FORMULA: Maximum Demand (MD) = CL × DF
        </text>
        <text x="1270" y="393" fontSize="11" fill="#78350f" fontFamily="monospace">
          MD = 10,291 W × 0.60 = 6,175 W
        </text>
        <text x="1270" y="408" fontSize="13" fontWeight="700" fill="#92400e" fontFamily="monospace">
          MD PER FLAT = 6.18 kW (Real-World Peak Load)
        </text>

        {/* Technical Detail Box */}
        <rect x="1250" y="430" width="1090" height="50" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" rx="6" />
        <text x="1270" y="450" fontSize="11" fontWeight="700" fill="#5b21b6">
          📋 TECHNICAL NOTE: Diversity Factor Rationale
        </text>
        <text x="1270" y="468" fontSize="10" fill="#6b21a8">
          At any given time, only 60% of apartment load is active (e.g., not all ACs + fans + lights on together).
          This DF varies: Office = 0.70, Retail = 0.80, Residential = 0.55–0.65 per NBC 2016.
        </text>
      </g>

      {/* ========================================== */}
      {/* PHASE B: BUS RISER LOADING & SIZING */}
      {/* ========================================== */}
      <g id="phase-b">
        <rect x="40" y="520" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="552" fontSize="20" fontWeight="700" fill="#ffffff">
          PHASE B: BUS RISER LOADING &amp; SIZING (Sheet: T1 Lodha Policy)
        </text>

        {/* B1: Floor Aggregation */}
        <rect x="40" y="590" width="1140" height="180" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="615" fontSize="14" fontWeight="700" fill="#92400e">
          B1: FLOOR LOAD AGGREGATION — Vertical Spine Calculation
        </text>

        {/* Floor Load Table */}
        <rect x="70" y="640" width="300" height="30" fill="#1e293b" />
        <text x="90" y="660" fontSize="11" fontWeight="700" fill="#ffffff">FLOOR</text>
        <rect x="370" y="640" width="200" height="30" fill="#1e293b" />
        <text x="390" y="660" fontSize="11" fontWeight="700" fill="#ffffff">FLATS/FLOOR</text>
        <rect x="570" y="640" width="220" height="30" fill="#1e293b" />
        <text x="590" y="660" fontSize="11" fontWeight="700" fill="#ffffff">MD PER FLAT (kW)</text>
        <rect x="790" y="640" width="200" height="30" fill="#1e293b" />
        <text x="810" y="660" fontSize="11" fontWeight="700" fill="#ffffff">FLOOR LOAD (kW)</text>
        <rect x="990" y="640" width="170" height="30" fill="#1e293b" />
        <text x="1010" y="660" fontSize="11" fontWeight="700" fill="#ffffff">FORMULA</text>

        {/* Floor 1-10 */}
        <rect x="70" y="670" width="300" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="688" fontSize="11" fill="#0f172a">Floors 1-10</text>
        <rect x="370" y="670" width="200" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="688" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">4</text>
        <rect x="570" y="670" width="220" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="610" y="688" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">6.18</text>
        <rect x="790" y="670" width="200" height="28" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="820" y="688" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">24.72</text>
        <rect x="990" y="670" width="170" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1010" y="688" fontSize="10" fontFamily="monospace" fill="#64748b">4 × 6.18</text>

        {/* Floor 11-20 */}
        <rect x="70" y="698" width="300" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="716" fontSize="11" fill="#0f172a">Floors 11-20</text>
        <rect x="370" y="698" width="200" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="716" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">4</text>
        <rect x="570" y="698" width="220" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="610" y="716" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">6.18</text>
        <rect x="790" y="698" width="200" height="28" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="820" y="716" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">24.72</text>
        <rect x="990" y="698" width="170" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1010" y="716" fontSize="10" fontFamily="monospace" fill="#64748b">4 × 6.18</text>

        {/* Floor 21-33 */}
        <rect x="70" y="726" width="300" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="744" fontSize="11" fill="#0f172a">Floors 21-33</text>
        <rect x="370" y="726" width="200" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="744" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">4</text>
        <rect x="570" y="726" width="220" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="610" y="744" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">6.18</text>
        <rect x="790" y="726" width="200" height="28" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="820" y="744" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">24.72</text>
        <rect x="990" y="726" width="170" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1010" y="744" fontSize="10" fontFamily="monospace" fill="#64748b">4 × 6.18</text>

        {/* B2: Bus Riser Diversity */}
        <rect x="1220" y="590" width="1140" height="180" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="615" fontSize="14" fontWeight="700" fill="#92400e">
          B2: BUS RISER DIVERSITY FACTOR — Entire Vertical Riser
        </text>

        <text x="1260" y="645" fontSize="12" fill="#78350f" fontFamily="monospace">
          Total Floors: 33 | Flats per Floor: 4 | Total Flats: 132
        </text>
        <text x="1260" y="665" fontSize="12" fill="#78350f" fontFamily="monospace">
          Total Floor Load (if all flats at MD): 132 × 6.18 kW = 815.76 kW
        </text>

        <rect x="1260" y="685" width="1060" height="40" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="6" />
        <text x="1280" y="705" fontSize="11" fontWeight="700" fill="#78350f">
          RISER DIVERSITY FACTOR (DF₂) = 0.40 (40% simultaneous load across entire building)
        </text>

        <text x="1260" y="740" fontSize="13" fill="#78350f" fontFamily="monospace">
          Bus Riser Demand = 815.76 kW × 0.40 = 326.30 kW
        </text>
        <text x="1260" y="758" fontSize="14" fontWeight="700" fill="#92400e" fontFamily="monospace">
          TOTAL BUS RISER LOAD = 326.30 kW (Design Load for Bus Duct)
        </text>

        {/* B3: Current Calculation */}
        <rect x="40" y="790" width="2320" height="150" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="815" fontSize="14" fontWeight="700" fill="#92400e">
          B3: CURRENT CALCULATION (Ampere Rating)
        </text>

        <rect x="80" y="840" width="2240" height="45" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="6" />
        <text x="100" y="860" fontSize="13" fontWeight="700" fill="#78350f">
          FORMULA: I = (kW × 1000) / (√3 × V × pf)
        </text>
        <text x="100" y="878" fontSize="12" fill="#78350f" fontFamily="monospace">
          Where: kW = 326.30, V = 415V (3-Phase), pf = 0.85 (Power Factor for residential mixed load)
        </text>

        <text x="80" y="910" fontSize="13" fill="#78350f" fontFamily="monospace">
          I = (326,300) / (1.732 × 415 × 0.85) = 326,300 / 611.42 = 533.7 Amps
        </text>
        <text x="80" y="928" fontSize="15" fontWeight="700" fill="#92400e" fontFamily="monospace">
          CALCULATED CURRENT (I_calc) = 534 Amps (rounded up)
        </text>

        {/* B4: Bus Bar Selection */}
        <rect x="40" y="960" width="2320" height="120" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="985" fontSize="14" fontWeight="700" fill="#065f46">
          B4: BUS BAR SELECTION — 90% Loading Limit Application
        </text>

        <text x="80" y="1010" fontSize="12" fill="#047857" fontFamily="monospace">
          90% Loading Safety Margin: I_calc / 0.90 = 534 / 0.90 = 593 Amps (minimum rated capacity)
        </text>
        <text x="80" y="1030" fontSize="12" fill="#047857" fontFamily="monospace">
          Available Standard Ratings: 400A | 630A | 800A | 1000A | 1250A | 1600A | 2000A
        </text>
        <text x="80" y="1050" fontSize="15" fontWeight="700" fill="#065f46" fontFamily="monospace">
          SELECTED BUS BAR: 630A (Next higher standard rating)
        </text>
        <text x="80" y="1070" fontSize="11" fill="#059669">
          Note: Actual loading = 534A / 630A = 84.8% ✓ WITHIN SAFE LIMITS
        </text>
      </g>

      {/* ========================================== */}
      {/* PHASE C: VOLTAGE DROP & VALIDATION */}
      {/* ========================================== */}
      <g id="phase-c">
        <rect x="40" y="1110" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="1142" fontSize="20" fontWeight="700" fill="#ffffff">
          PHASE C: VOLTAGE DROP CALCULATION &amp; VALIDATION (Sheets: REF &amp; T1)
        </text>

        {/* C1: Bus Duct Constants */}
        <rect x="40" y="1180" width="1140" height="220" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1205" fontSize="14" fontWeight="700" fill="#1e40af">
          C1: BUS DUCT CONSTANTS — C&amp;S Sandwich Type AL (Reference Data)
        </text>

        {/* Reference Table */}
        <rect x="70" y="1230" width="240" height="30" fill="#1e293b" />
        <text x="90" y="1250" fontSize="11" fontWeight="700" fill="#ffffff">BUS BAR RATING</text>
        <rect x="310" y="1230" width="260" height="30" fill="#1e293b" />
        <text x="330" y="1250" fontSize="11" fontWeight="700" fill="#ffffff">mV/mtr/A (Voltage Drop)</text>
        <rect x="570" y="1230" width="200" height="30" fill="#1e293b" />
        <text x="590" y="1250" fontSize="11" fontWeight="700" fill="#ffffff">ENCLOSURE</text>
        <rect x="770" y="1230" width="390" height="30" fill="#1e293b" />
        <text x="790" y="1250" fontSize="11" fontWeight="700" fill="#ffffff">SYSTEM TYPE</text>

        {/* 400A */}
        <rect x="70" y="1260" width="240" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1278" fontSize="11" fontFamily="monospace" fill="#0f172a">400A</text>
        <rect x="310" y="1260" width="260" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="1278" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.038</text>
        <rect x="570" y="1260" width="200" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="590" y="1278" fontSize="10" fill="#64748b">Sandwich AL</text>
        <rect x="770" y="1260" width="390" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="790" y="1278" fontSize="10" fill="#64748b">3Ph+1E+1N (5-pole)</text>

        {/* 630A (Selected) */}
        <rect x="70" y="1288" width="240" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="110" y="1306" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">630A ✓</text>
        <rect x="310" y="1288" width="260" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="370" y="1306" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">0.029</text>
        <rect x="570" y="1288" width="200" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="590" y="1306" fontSize="10" fontWeight="700" fill="#991b1b">Sandwich AL</text>
        <rect x="770" y="1288" width="390" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="790" y="1306" fontSize="10" fontWeight="700" fill="#991b1b">3Ph+1E+1N (5-pole)</text>

        {/* 800A */}
        <rect x="70" y="1316" width="240" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1334" fontSize="11" fontFamily="monospace" fill="#0f172a">800A</text>
        <rect x="310" y="1316" width="260" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="1334" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.024</text>
        <rect x="570" y="1316" width="200" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="590" y="1334" fontSize="10" fill="#64748b">Sandwich AL</text>
        <rect x="770" y="1316" width="390" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="790" y="1334" fontSize="10" fill="#64748b">3Ph+1E+1N (5-pole)</text>

        {/* 1000A */}
        <rect x="70" y="1344" width="240" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1362" fontSize="11" fontFamily="monospace" fill="#0f172a">1000A</text>
        <rect x="310" y="1344" width="260" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="1362" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.020</text>
        <rect x="570" y="1344" width="200" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="590" y="1362" fontSize="10" fill="#64748b">Sandwich AL</text>
        <rect x="770" y="1344" width="390" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="790" y="1362" fontSize="10" fill="#64748b">3Ph+1E+1N (5-pole)</text>

        {/* 1600A */}
        <rect x="70" y="1372" width="240" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1390" fontSize="11" fontFamily="monospace" fill="#0f172a">1600A</text>
        <rect x="310" y="1372" width="260" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="370" y="1390" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.015</text>
        <rect x="570" y="1372" width="200" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="590" y="1390" fontSize="10" fill="#64748b">Sandwich AL</text>
        <rect x="770" y="1372" width="390" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="790" y="1390" fontSize="10" fill="#64748b">3Ph+1E+1N (5-pole)</text>

        {/* C2: Voltage Drop Calculation */}
        <rect x="1220" y="1180" width="1140" height="220" fill="url(#calcGrad)" stroke="#f59e0b" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="1240" y="1205" fontSize="14" fontWeight="700" fill="#92400e">
          C2: VOLTAGE DROP CALCULATION — Cumulative Height Method
        </text>

        <rect x="1260" y="1235" width="1060" height="55" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" rx="6" />
        <text x="1280" y="1255" fontSize="13" fontWeight="700" fill="#78350f">
          FORMULA: Vd = I × L × (mV/mtr/A) / 1000
        </text>
        <text x="1280" y="1275" fontSize="11" fill="#78350f" fontFamily="monospace">
          Where: I = 534A, L = Cumulative Length (m), mV/mtr/A = 0.029 (from 630A rating)
        </text>

        <text x="1260" y="1310" fontSize="12" fill="#78350f" fontFamily="monospace">
          Building Height: 33 floors × 3.35m/floor = 110.55 meters
        </text>
        <text x="1260" y="1330" fontSize="12" fill="#78350f" fontFamily="monospace">
          Horizontal Run (Basement to Riser): 15 meters
        </text>
        <text x="1260" y="1350" fontSize="12" fill="#78350f" fontFamily="monospace">
          Total Length (L): 110.55 + 15 = 125.55 meters
        </text>

        <text x="1260" y="1375" fontSize="13" fill="#78350f" fontFamily="monospace">
          Vd = 534 × 125.55 × 0.029 / 1000 = 1.945 Volts
        </text>
        <text x="1260" y="1393" fontSize="14" fontWeight="700" fill="#92400e" fontFamily="monospace">
          VOLTAGE DROP = 1.95 V (0.47% of 415V) ✓ WELL WITHIN LIMITS
        </text>

        {/* C3: Validation Dashboard */}
        <rect x="40" y="1420" width="2320" height="120" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="3" rx="8" filter="url(#dropShadow)" />
        <g>
          <circle cx="90" cy="1480" r="28" fill="#10b981" stroke="#059669" strokeWidth="2" />
          <text x="90" y="1490" fontSize="24" fontWeight="700" fill="#ffffff" textAnchor="middle">✓</text>
        </g>
        <text x="140" y="1465" fontSize="16" fontWeight="700" fill="#065f46">
          VALIDATION GATE: CURRENT &amp; VOLTAGE DROP CHECK
        </text>
        <text x="140" y="1490" fontSize="13" fill="#047857" fontFamily="monospace">
          ✓ Current Result: I_calc (534A) &lt; I_rated (630A) → PASS (Margin: 96A)
        </text>
        <text x="140" y="1510" fontSize="13" fill="#047857" fontFamily="monospace">
          ✓ V.D Result: 0.47% &lt; 3% (permissible limit per IS 732) → PASS
        </text>
        <text x="140" y="1530" fontSize="13" fill="#047857" fontFamily="monospace">
          ✓ Loading Check: 84.8% &lt; 90% (safety limit) → PASS
        </text>
      </g>

      {/* ========================================== */}
      {/* PHASE D: DERATING & AMBIENT CORRECTION */}
      {/* ========================================== */}
      <g id="phase-d">
        <rect x="40" y="1570" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="1602" fontSize="20" fontWeight="700" fill="#ffffff">
          PHASE D: DERATING MATRIX — Ambient Temperature &amp; Loading Factors
        </text>

        {/* Derating Table */}
        <rect x="40" y="1640" width="2320" height="200" fill="url(#alertGrad)" stroke="#f43f5e" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1665" fontSize="14" fontWeight="700" fill="#9f1239">
          D1: TEMPERATURE DERATING FACTORS (Ambient vs Rated Capacity)
        </text>

        {/* Derating Headers */}
        <rect x="70" y="1690" width="280" height="30" fill="#1e293b" />
        <text x="90" y="1710" fontSize="11" fontWeight="700" fill="#ffffff">AMBIENT TEMP (°C)</text>
        <rect x="350" y="1690" width="300" height="30" fill="#1e293b" />
        <text x="370" y="1710" fontSize="11" fontWeight="700" fill="#ffffff">DERATING FACTOR</text>
        <rect x="650" y="1690" width="350" height="30" fill="#1e293b" />
        <text x="670" y="1710" fontSize="11" fontWeight="700" fill="#ffffff">EFFECTIVE CAPACITY (630A base)</text>
        <rect x="1000" y="1690" width="1340" height="30" fill="#1e293b" />
        <text x="1020" y="1710" fontSize="11" fontWeight="700" fill="#ffffff">NOTES</text>

        {/* 35°C */}
        <rect x="70" y="1720" width="280" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1738" fontSize="11" fontFamily="monospace" fill="#0f172a">35°C</text>
        <rect x="350" y="1720" width="300" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="1738" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">1.00</text>
        <rect x="650" y="1720" width="350" height="28" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="720" y="1738" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#065f46">630A (100%)</text>
        <rect x="1000" y="1720" width="1340" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1020" y="1738" fontSize="10" fill="#475569">Standard rated temperature (no derating)</text>

        {/* 40°C */}
        <rect x="70" y="1748" width="280" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1766" fontSize="11" fontFamily="monospace" fill="#0f172a">40°C</text>
        <rect x="350" y="1748" width="300" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="1766" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.96</text>
        <rect x="650" y="1748" width="350" height="28" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="720" y="1766" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">605A (96%)</text>
        <rect x="1000" y="1748" width="1340" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1020" y="1766" fontSize="10" fill="#475569">Mumbai/Typical Indian climate</text>

        {/* 45°C (Critical) */}
        <rect x="70" y="1776" width="280" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="110" y="1794" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">45°C ⚠</text>
        <rect x="350" y="1776" width="300" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="410" y="1794" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">0.91</text>
        <rect x="650" y="1776" width="350" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="720" y="1794" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#991b1b">573A (91%)</text>
        <rect x="1000" y="1776" width="1340" height="28" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
        <text x="1020" y="1794" fontSize="10" fontWeight="700" fill="#991b1b">Enclosed electrical room / Summer peak (still safe: 534A &lt; 573A)</text>

        {/* 50°C */}
        <rect x="70" y="1804" width="280" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="110" y="1822" fontSize="11" fontFamily="monospace" fill="#0f172a">50°C</text>
        <rect x="350" y="1804" width="300" height="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="410" y="1822" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">0.86</text>
        <rect x="650" y="1804" width="350" height="28" fill="#ffe4e6" stroke="#fca5a5" strokeWidth="1" />
        <text x="720" y="1822" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#9f1239">542A (86%)</text>
        <rect x="1000" y="1804" width="1340" height="28" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="1020" y="1822" fontSize="10" fill="#475569">Extreme condition (forced ventilation required)</text>
      </g>

      {/* ========================================== */}
      {/* PHASE E: HARDWARE INVENTORY & BOM */}
      {/* ========================================== */}
      <g id="phase-e">
        <rect x="40" y="1870" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="1902" fontSize="20" fontWeight="700" fill="#ffffff">
          PHASE E: HARDWARE INVENTORY &amp; BILL OF MATERIALS (BOM)
        </text>

        {/* BOM Table */}
        <rect x="40" y="1940" width="2320" height="330" fill="url(#inputGrad)" stroke="#3b82f6" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
        <text x="60" y="1965" fontSize="14" fontWeight="700" fill="#1e40af">
          E1: COMPONENT COUNT — Automated Hardware Calculation
        </text>

        {/* BOM Headers */}
        <rect x="70" y="1990" width="380" height="35" fill="#1e293b" />
        <text x="90" y="2012" fontSize="12" fontWeight="700" fill="#ffffff">COMPONENT</text>
        <rect x="450" y="1990" width="200" height="35" fill="#1e293b" />
        <text x="470" y="2012" fontSize="12" fontWeight="700" fill="#ffffff">RATING/SIZE</text>
        <rect x="650" y="1990" width="140" height="35" fill="#1e293b" />
        <text x="670" y="2012" fontSize="12" fontWeight="700" fill="#ffffff">QTY</text>
        <rect x="790" y="1990" width="180" height="35" fill="#1e293b" />
        <text x="810" y="2012" fontSize="12" fontWeight="700" fill="#ffffff">LOCATION</text>
        <rect x="970" y="1990" width="1370" height="35" fill="#1e293b" />
        <text x="990" y="2012" fontSize="12" fontWeight="700" fill="#ffffff">DESCRIPTION / NOTES</text>

        {/* Bus Duct Main */}
        <rect x="70" y="2025" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2045" fontSize="11" fontWeight="600" fill="#0f172a">Bus Duct (Main Riser)</text>
        <rect x="450" y="2025" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2045" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">630A</text>
        <rect x="650" y="2025" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2045" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">126 m</text>
        <rect x="790" y="2025" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2045" fontSize="10" fill="#64748b">Basement to Terrace</text>
        <rect x="970" y="2025" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2045" fontSize="10" fill="#475569">3Ph+1E+1N Sandwich AL (C&amp;S Electric)</text>

        {/* Tap-Off 125A */}
        <rect x="70" y="2057" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2077" fontSize="11" fontWeight="600" fill="#0f172a">Tap-Off Units (Floor DB)</text>
        <rect x="450" y="2057" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2077" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">125A</text>
        <rect x="650" y="2057" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2077" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">33</text>
        <rect x="790" y="2057" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2077" fontSize="10" fill="#64748b">Each floor (1-33)</text>
        <rect x="970" y="2057" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2077" fontSize="10" fill="#475569">Feeds 4 flats per floor (4 × 6.18kW = 24.72kW → ~35A per floor)</text>

        {/* Tap-Off 160A */}
        <rect x="70" y="2089" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2109" fontSize="11" fontWeight="600" fill="#0f172a">Tap-Off Units (Common Area)</text>
        <rect x="450" y="2089" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2109" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">160A</text>
        <rect x="650" y="2089" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2109" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">5</text>
        <rect x="790" y="2089" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2109" fontSize="10" fill="#64748b">Basement, Lobby, Terrace</text>
        <rect x="970" y="2089" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2109" fontSize="10" fill="#475569">Lifts, common lighting, HVAC, water pumps</text>

        {/* Bus Duct Reducer */}
        <rect x="70" y="2121" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2141" fontSize="11" fontWeight="600" fill="#0f172a">Bus Duct Reducer</text>
        <rect x="450" y="2121" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2141" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">630A → 400A</text>
        <rect x="650" y="2121" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2141" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">1</text>
        <rect x="790" y="2121" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2141" fontSize="10" fill="#64748b">Floor 20 (mid-rise)</text>
        <rect x="970" y="2121" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2141" fontSize="10" fill="#475569">Load reduces after Floor 20 (lower floors only)</text>

        {/* End Cap */}
        <rect x="70" y="2153" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2173" fontSize="11" fontWeight="600" fill="#0f172a">Bus Duct End Cap</text>
        <rect x="450" y="2153" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2173" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">630A</text>
        <rect x="650" y="2153" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2173" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">1</text>
        <rect x="790" y="2153" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2173" fontSize="10" fill="#64748b">Terrace (top termination)</text>
        <rect x="970" y="2153" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2173" fontSize="10" fill="#475569">Weatherproof IP65 enclosure for top end</text>

        {/* EFU (Electrical Feed Unit) */}
        <rect x="70" y="2185" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2205" fontSize="11" fontWeight="600" fill="#0f172a">EFU (Electrical Feed Unit)</text>
        <rect x="450" y="2185" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2205" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">630A MCCB</text>
        <rect x="650" y="2185" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2205" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">1</text>
        <rect x="790" y="2185" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2205" fontSize="10" fill="#64748b">Basement (origin)</text>
        <rect x="970" y="2185" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2205" fontSize="10" fill="#475569">Incoming feeder protection from Main LT Panel</text>

        {/* Support Brackets */}
        <rect x="70" y="2217" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2237" fontSize="11" fontWeight="600" fill="#0f172a">Support Brackets (MS)</text>
        <rect x="450" y="2217" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2237" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">Heavy Duty</text>
        <rect x="650" y="2217" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2237" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">45</text>
        <rect x="790" y="2217" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2237" fontSize="10" fill="#64748b">Every 3m vertical</text>
        <rect x="970" y="2217" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2237" fontSize="10" fill="#475569">126m / 3m spacing = 42 supports + 3 spares</text>

        {/* Earthing Lugs */}
        <rect x="70" y="2249" width="380" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="90" y="2269" fontSize="11" fontWeight="600" fill="#0f172a">Earthing Lugs (Cu)</text>
        <rect x="450" y="2249" width="200" height="32" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="490" y="2269" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#0369a1">50mm² Cu</text>
        <rect x="650" y="2249" width="140" height="32" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
        <text x="690" y="2269" fontSize="11" fontWeight="700" fontFamily="monospace" fill="#92400e">38</text>
        <rect x="790" y="2249" width="180" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="810" y="2269" fontSize="10" fill="#64748b">All tap-offs + EFU</text>
        <rect x="970" y="2249" width="1370" height="32" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        <text x="990" y="2269" fontSize="10" fill="#475569">33 tap-offs + 5 common + 1 EFU = 39 (38 rounded)</text>
      </g>

      {/* ========================================== */}
      {/* SUMMARY DASHBOARD */}
      {/* ========================================== */}
      <g id="summary">
        <rect x="40" y="2300" width="2320" height="50" fill="#3730a3" stroke="#4338ca" strokeWidth="2" rx="8" />
        <text x="60" y="2332" fontSize="20" fontWeight="700" fill="#ffffff">
          EXECUTIVE SUMMARY DASHBOARD — Key Design Outputs
        </text>

        {/* Summary Cards */}
        <g id="summary-cards">
          {/* Card 1 */}
          <rect x="40" y="2370" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="60" y="2395" fontSize="14" fontWeight="700" fill="#065f46">
            ⚡ BUS RISER DESIGN LOAD
          </text>
          <text x="60" y="2420" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            326.30 kW
          </text>
          <text x="60" y="2440" fontSize="11" fill="#059669">
            132 Flats × 6.18 kW × 0.40 DF
          </text>
          <text x="60" y="2453" fontSize="11" fill="#059669">
            Calculated Current: 534 Amps
          </text>

          {/* Card 2 */}
          <rect x="640" y="2370" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="660" y="2395" fontSize="14" fontWeight="700" fill="#065f46">
            🔌 SELECTED BUS BAR
          </text>
          <text x="660" y="2420" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            630 Amps
          </text>
          <text x="660" y="2440" fontSize="11" fill="#059669">
            C&amp;S Sandwich Type AL
          </text>
          <text x="660" y="2453" fontSize="11" fill="#059669">
            Loading: 84.8% (Safe Margin: 15.2%)
          </text>

          {/* Card 3 */}
          <rect x="1240" y="2370" width="560" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1260" y="2395" fontSize="14" fontWeight="700" fill="#065f46">
            📉 VOLTAGE DROP
          </text>
          <text x="1260" y="2420" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            1.95 V
          </text>
          <text x="1260" y="2440" fontSize="11" fill="#059669">
            0.47% of 415V (3-Phase)
          </text>
          <text x="1260" y="2453" fontSize="11" fill="#059669">
            Well within 3% limit per IS 732
          </text>

          {/* Card 4 */}
          <rect x="1840" y="2370" width="520" height="90" fill="url(#outputGrad)" stroke="#10b981" strokeWidth="2" rx="8" filter="url(#dropShadow)" />
          <text x="1860" y="2395" fontSize="14" fontWeight="700" fill="#065f46">
            🏗️ RISER LENGTH
          </text>
          <text x="1860" y="2420" fontSize="24" fontWeight="700" fill="#047857" fontFamily="monospace">
            126 meters
          </text>
          <text x="1860" y="2440" fontSize="11" fill="#059669">
            33 Floors × 3.35m + 15m horizontal
          </text>
          <text x="1860" y="2453" fontSize="11" fill="#059669">
            Basement to Terrace (110.55m + 15m)
          </text>
        </g>
      </g>

      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}
      <g id="footer">
        <rect x="40" y="2490" width="2320" height="80" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="8" />
        <text x="120" y="2520" fontSize="14" fontWeight="700" fill="#ffffff">
          ⚡ MEP Digital Ecosystem — ELECTRICAL BUS RISER SYSTEM CALCULATION
        </text>
        <text x="120" y="2540" fontSize="12" fill="#94a3b8">
          Flat Unit Load | Floor Aggregation | Bus Duct Sizing | Current &amp; Voltage Drop | Hardware BOM | Validation Dashboard
        </text>
        <text x="120" y="2555" fontSize="11" fill="#64748b">
          © 2026 Lodha Engineering | IS 732 / NBC 2016 Compliant | C&amp;S Sandwich Type AL | Rev 02
        </text>
        <text x="2100" y="2525" fontSize="14" fontWeight="700" fill="#ffffff">
          Page 1 of 1
        </text>
        <text x="2100" y="2545" fontSize="11" fill="#64748b">
          FOR CONSTRUCTION
        </text>
      </g>

      {/* End SVG */}
    </svg>
  );
}
