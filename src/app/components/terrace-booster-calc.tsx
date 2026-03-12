import React from "react";

// =====================================================================
// BALCONY & TERRACE RAINWATER PIPE SIZING CALCULATION — Custom SVG Flow Diagram
// Full architecture: Catchment Area Analysis → Hydraulic Load Calculation →
// Riser Distribution Logic → Pipe Diameter Determination → Final Output & Selection
// =====================================================================

const W = 1600;
const H = 4200;
const CX = W / 2;

const C = {
  blue:   { bg: "#dbeafe", bd: "#3b82f6", tx: "#1e40af" },
  green:  { bg: "#d1fae5", bd: "#10b981", tx: "#065f46" },
  purple: { bg: "#ede9fe", bd: "#8b5cf6", tx: "#5b21b6" },
  amber:  { bg: "#fef3c7", bd: "#f59e0b", tx: "#92400e" },
  rose:   { bg: "#ffe4e6", bd: "#f43f5e", tx: "#9f1239" },
  cyan:   { bg: "#cffafe", bd: "#06b6d4", tx: "#155e75" },
  teal:   { bg: "#ccfbf1", bd: "#14b8a6", tx: "#134e4a" },
  violet: { bg: "#e8d5ff", bd: "#a78bfa", tx: "#4c1d95" },
  slate:  { bg: "#f1f5f9", bd: "#64748b", tx: "#334155" },
  orange: { bg: "#fed7aa", bd: "#f97316", tx: "#9a3412" },
  arrow:  "#94a3b8",
};

function PhaseBand({ y, h, label, color }: { y: number; h: number; label: string; color: string }) {
  return (
    <g>
      <rect x={10} y={y} width={W - 20} height={h} rx={14}
        fill={`${color}08`} stroke={`${color}20`} strokeWidth={1.5} strokeDasharray="8,5" />
      <text x={24} y={y + 20} fill={color} fontSize={12} fontWeight={700} opacity={0.5} letterSpacing={1}>
        {label}
      </text>
    </g>
  );
}

function Box({ x, y, w, h, label, sub, color, badge }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {badge && (
        <>
          <rect x={x + w - 88} y={y + 6} width={78} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 49} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={11.5} opacity={0.7}>{sub}</text>
    </g>
  );
}

function Diamond({ cx, cy, rxD, ryD, label, sub, color }: {
  cx: number; cy: number; rxD: number; ryD: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <polygon
        points={`${cx},${cy - ryD} ${cx + rxD},${cy} ${cx},${cy + ryD} ${cx - rxD},${cy}`}
        fill={color.bg} stroke={color.bd} strokeWidth={3}
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.8}>{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, dash }: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; dash?: boolean;
}) {
  const c = color || C.arrow;
  const isVert = Math.abs(x1 - x2) < 3;
  const d = isVert
    ? `M${x1},${y1} L${x2},${y2}`
    : `M${x1},${y1} L${x1},${(y1 + y2) / 2} L${x2},${(y1 + y2) / 2} L${x2},${y2}`;
  return (
    <g>
      <path d={d} fill="none" stroke={c} strokeWidth={2.5}
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#rwp-a)" />
      {label && (
        <g>
          <rect x={(x1 + x2) / 2 - label.length * 4.2} y={(y1 + y2) / 2 - 12}
            width={label.length * 8.4 + 6} height={18} rx={4} fill="#fff" opacity={0.92} />
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 1}
            textAnchor="middle" fill={c} fontSize={11} fontWeight={600}>{label}</text>
        </g>
      )}
    </g>
  );
}

function FormulaBox({ x, y, w, h, formula, note, color }: {
  x: number; y: number; w: number; h: number;
  formula: string; note: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} strokeDasharray="8,4" />
      <rect x={x + w - 90} y={y + 6} width={80} height={22} rx={11} fill={color.bd} opacity={0.85} />
      <text x={x + w - 50} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>FORMULA</text>
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{formula}</text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>{note}</text>
    </g>
  );
}

function DataTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 900, colW = tw / headers.length;
  const rowH = 36, hdrY = y + 58;
  const th = 58 + (rows.length + 1) * (rowH + 4) + 18;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={48} rx={14} fill={color.bd} />
      <rect x={x} y={y + 34} width={tw} height={14} fill={color.bd} />
      <text x={x + tw / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>{title}</text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 4} y={hdrY} width={colW - 8} height={rowH} rx={8}
            fill={color.bg} stroke={color.bd} strokeWidth={2} />
          <text x={x + i * colW + colW / 2} y={hdrY + 24} textAnchor="middle"
            fill={color.tx} fontSize={13} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => (
            <g key={`c-${ri}-${ci}`}>
              <rect x={x + ci * colW + 4} y={hdrY + (ri + 1) * (rowH + 4) + 4}
                width={colW - 8} height={rowH} rx={8}
                fill="#fff" stroke="#e2e8f0" strokeWidth={1.5} />
              <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 4) + 26}
                textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={500}>{cell}</text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function AnnotationBox({ x, y, w, h, title, lines, color }: {
  x: number; y: number; w: number; h: number;
  title: string; lines: string[];
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10}
        fill={color.bg} stroke={color.bd} strokeWidth={2} strokeDasharray="6,4" />
      <text x={x + 14} y={y + 20} fill={color.tx} fontSize={12} fontWeight={700}>💡 {title}</text>
      {lines.map((line, i) => (
        <text key={i} x={x + 14} y={y + 40 + i * 16} fill={color.tx} fontSize={10.5} opacity={0.85}>
          {line}
        </text>
      ))}
    </g>
  );
}

// Final Output Dashboard
function RWPDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 260;
  const metrics = [
    { label: "Peak Flow", value: "XX L/sec", icon: "💧", color: C.blue },
    { label: "Duty Flow/Pipe", value: "XX L/sec", icon: "📊", color: C.cyan },
    { label: "Calculated Size", value: "XXX mm", icon: "📐", color: C.purple },
    { label: "Selected Size", value: "XXX mm", icon: "✅", color: C.green },
  ];
  const cardW = (dw - 80) / 4, cardH = 140;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={18}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3.5} />
      <rect x={x} y={y} width={dw} height={52} rx={18} fill={C.blue.bd} />
      <rect x={x} y={y + 36} width={dw} height={16} fill={C.blue.bd} />
      <text x={x + dw / 2} y={y + 34} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🌧️ RAINWATER DOWNCOMER (RWP) SIZING DASHBOARD
      </text>
      {metrics.map((m, i) => {
        const cx = x + 20 + i * (cardW + 16);
        const cy = y + 74;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={12}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2.5} />
            <text x={cx + cardW / 2} y={cy + 32} textAnchor="middle" fontSize={28}>{m.icon}</text>
            <text x={cx + cardW / 2} y={cy + 68} textAnchor="middle"
              fill={m.color.tx} fontSize={13} fontWeight={700}>{m.label}</text>
            <text x={cx + cardW / 2} y={cy + 110} textAnchor="middle"
              fill={m.color.bd} fontSize={20} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
      <text x={x + dw / 2} y={y + 240} textAnchor="middle" fill={C.slate.tx} fontSize={11} opacity={0.7}>
        Schedule Updated → Rainwater Pipe (RWP) Schedule for Site Installation
      </text>
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function TerraceBoosterCalcSVG() {
  const Y = {
    entry: 40,
    
    // Phase 1: Catchment Area Analysis
    p1Start: 180,
    areaInput: 280,
    segments: 380,
    runoffCoef: 500,
    coeffTable: 600,
    rainfallInput: 810,
    
    // Phase 2: Hydraulic Load Calculation
    p2Start: 950,
    peakFlowCalc: 1050,
    flowFormula: 1170,
    unitConversion: 1300,
    conversionNote: 1410,
    
    // Phase 3: Riser Distribution Logic
    p3Start: 1530,
    numPipes: 1630,
    dutyFlow: 1750,
    dutyFormula: 1870,
    maxArea: 1990,
    maxAreaNote: 2100,
    
    // Phase 4: Pipe Diameter Determination
    p4Start: 2220,
    theoreticalCalc: 2320,
    sizingTable: 2440,
    safetyFactor: 2720,
    
    // Phase 5: Final Output & Selection
    p5Start: 2860,
    calculatedSize: 2960,
    selectedSize: 3080,
    dashboard: 3200,
  };

  const nw = 500, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 450;
  const dashX = CX - 550;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="rwp-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <linearGradient id="rwp-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Title */}
      <rect x={CX - 500} y={Y.entry} width={1000} height={90} rx={20} fill="url(#rwp-title-grad)" />
      <text x={CX} y={Y.entry + 38} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800}>
        Balcony & Terrace Rainwater Pipe Sizing Calculation
      </text>
      <text x={CX} y={Y.entry + 64} textAnchor="middle" fill="#fff" fontSize={13} opacity={0.9}>
        Catchment Analysis → Hydraulic Load → Riser Distribution → Pipe Sizing → Final Selection
      </text>

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 1 — CATCHMENT AREA ANALYSIS (The "Connected Load" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p1Start} h={Y.p2Start - Y.p1Start - 20}
        label="PHASE 1 — CATCHMENT AREA ANALYSIS (The 'Connected Load' Layer)" color={C.blue.bd} />

      <Arrow x1={CX} y1={Y.entry + 90} x2={CX} y2={Y.areaInput} />

      {/* Step 1: Area Served */}
      <Box x={nx} y={Y.areaInput} w={nw} h={nh}
        label="Define Area Served (m²)"
        sub="Identify specific balcony, terrace, or mumty roof segments"
        color={C.blue} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.areaInput + 4} w={280} h={68}
        title="Area Identification"
        lines={[
          "• Balcony decks per flat",
          "• Terrace roofs (habitable/non-hab)",
          "• Mumty/service roof areas"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.areaInput + nh} x2={CX} y2={Y.segments} />

      {/* Multiple Segments */}
      <Box x={nx} y={Y.segments} w={nw} h={nh}
        label="Identify Drainage Segments"
        sub="Break down total area into individual catchment zones"
        color={C.blue} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.segments + 4} w={280} h={82}
        title="Segmentation Strategy"
        lines={[
          "• Segment A: North terrace",
          "• Segment B: South terrace",
          "• Segment C: Mumty roof",
          "• Sum all segments for total area"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.segments + nh} x2={CX} y2={Y.runoffCoef} />

      {/* Step 2: Run-off Coefficient */}
      <Box x={nx} y={Y.runoffCoef} w={nw} h={nh}
        label="Assign Run-Off Coefficient (C)"
        sub="Typically 1.0 for concrete/tiled decks (100% runoff)"
        color={C.purple} badge="STANDARD" />
      <Arrow x1={CX} y1={Y.runoffCoef + nh} x2={CX} y2={Y.coeffTable} />

      <DataTable x={tableX} y={Y.coeffTable}
        title="🏗️ RUN-OFF COEFFICIENT (C) — Surface Type Database"
        headers={["Surface Type", "Coefficient (C)", "Application", "Reference"]}
        rows={[
          ["Concrete/Tiled Deck", "1.00", "Balcony/Terrace", "Project Std"],
          ["Metal Sheeting", "0.95", "Mumty roofs", "NBC 2016"],
          ["Gravel Ballast", "0.60", "Green roofs", "IS 15498"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.coeffTable + 196} x2={CX} y2={Y.rainfallInput} />

      {/* Step 3: Rainfall Intensity */}
      <Box x={nx} y={Y.rainfallInput} w={nw} h={nh}
        label="Establish Design Rainfall Intensity (I)"
        sub="Local peak intensity (e.g., 113 mm/hr per project standard)"
        color={C.cyan} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.rainfallInput + 4} w={280} h={68}
        title="Intensity Source"
        lines={[
          "• Local metrological data",
          "• NBC/IS 13174 regional tables",
          "• Project-specific design value"
        ]}
        color={C.slate} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 2 — HYDRAULIC LOAD CALCULATION (The "Demand" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p2Start} h={Y.p3Start - Y.p2Start - 20}
        label="PHASE 2 — HYDRAULIC LOAD CALCULATION (The 'Demand' Layer)" color={C.amber.bd} />

      <Arrow x1={CX} y1={Y.rainfallInput + nh} x2={CX} y2={Y.peakFlowCalc} />

      {/* Peak Flow Calculation */}
      <Box x={nx} y={Y.peakFlowCalc} w={nw} h={nh}
        label="Calculate Peak Flow Rate (Q)"
        sub="Apply Rational Method to compute discharge in Liters per second"
        color={C.amber} badge="CALC" />
      <Arrow x1={CX} y1={Y.peakFlowCalc + nh} x2={CX} y2={Y.flowFormula} />

      {/* Formula Block */}
      <FormulaBox x={CX - 400} y={Y.flowFormula} w={800} h={86}
        formula="Q = (Area × Intensity × C) / 3600"
        note="Q in Liters/sec — Area in m², Intensity in mm/hr, C = dimensionless run-off coefficient"
        color={C.orange} />
      <Arrow x1={CX} y1={Y.flowFormula + 86} x2={CX} y2={Y.unitConversion} />

      {/* Unit Conversion Check */}
      <Box x={nx} y={Y.unitConversion} w={nw} h={nh}
        label="Ensure Unit Consistency"
        sub="Convert from m³/hr to L/sec if needed"
        color={C.amber} badge="CHECK" />
      <Arrow x1={CX} y1={Y.unitConversion + nh} x2={CX} y2={Y.conversionNote} />

      <AnnotationBox x={CX - 380} y={Y.conversionNote} w={760} h={60}
        title="Unit Conversion Reference"
        lines={[
          "1 m³/hr = 0.278 L/sec  |  1 L/sec = 3.6 m³/hr  |  Ensure correct units before pipe sizing"
        ]}
        color={C.amber} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 3 — RISER DISTRIBUTION LOGIC (The "Distribution" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p3Start} h={Y.p4Start - Y.p3Start - 20}
        label="PHASE 3 — RISER DISTRIBUTION LOGIC (The 'Distribution' Layer)" color={C.purple.bd} />

      <Arrow x1={CX} y1={Y.conversionNote + 60} x2={CX} y2={Y.numPipes} />

      {/* Number of Pipes */}
      <Box x={nx} y={Y.numPipes} w={nw} h={nh}
        label="Determine Number of Vertical Pipes (N)"
        sub="Based on architectural constraints and drain point locations"
        color={C.purple} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.numPipes + 4} w={280} h={82}
        title="Pipe Distribution"
        lines={[
          "• Single pipe: small balconies",
          "• 2 pipes: large terraces",
          "• 4+ pipes: roof areas",
          "• Per architectural drain layout"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.numPipes + nh} x2={CX} y2={Y.dutyFlow} />

      {/* Duty Flow per Pipe */}
      <Box x={nx} y={Y.dutyFlow} w={nw} h={nh}
        label="Calculate Duty Flow per Pipe (Qp)"
        sub="Divide total peak flow by number of downcomers"
        color={C.purple} badge="CALC" />
      <Arrow x1={CX} y1={Y.dutyFlow + nh} x2={CX} y2={Y.dutyFormula} />

      <FormulaBox x={CX - 340} y={Y.dutyFormula} w={680} h={86}
        formula="Qp = Q ÷ N  (Duty Flow per Pipe)"
        note="Qp in L/sec — ensures each riser is adequately sized for proportional load"
        color={C.purple} />
      <Arrow x1={CX} y1={Y.dutyFormula + 86} x2={CX} y2={Y.maxArea} />

      {/* Engineering Rule */}
      <Box x={nx} y={Y.maxArea} w={nw} h={nh}
        label="Engineering Rule: Max Area per Pipe"
        sub="Prevent localized flooding/ponding at drain points"
        color={C.rose} badge="RULE" />
      <Arrow x1={CX} y1={Y.maxArea + nh} x2={CX} y2={Y.maxAreaNote} />

      <AnnotationBox x={CX - 380} y={Y.maxAreaNote} w={760} h={60}
        title="Area Per Pipe Guideline"
        lines={[
          "Typical max: 50-70 m² per 100mm pipe  |  Larger areas require multiple downcomers or larger diameter"
        ]}
        color={C.rose} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 4 — PIPE DIAMETER DETERMINATION (The "Sizing" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p4Start} h={Y.p5Start - Y.p4Start - 20}
        label="PHASE 4 — PIPE DIAMETER DETERMINATION (The 'Sizing' Layer)" color={C.cyan.bd} />

      <Arrow x1={CX} y1={Y.maxAreaNote + 60} x2={CX} y2={Y.theoreticalCalc} />

      {/* Theoretical Diameter */}
      <Box x={nx} y={Y.theoreticalCalc} w={nw} h={nh}
        label="Calculate Theoretical Pipe Diameter"
        sub="Based on vertical flow capacity (gravity-fed drainage)"
        color={C.cyan} badge="CALC" />
      <AnnotationBox x={nx + nw + 30} y={Y.theoreticalCalc + 4} w={280} h={68}
        title="Flow Capacity Formula"
        lines={[
          "Q = A × V (Continuity equation)",
          "Assume V = 1.5 - 2.0 m/s vertical",
          "Solve for diameter from flow area"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.theoreticalCalc + nh} x2={CX} y2={Y.sizingTable} />

      {/* Sizing Tables */}
      <DataTable x={tableX} y={Y.sizingTable}
        title="📋 PIPE CAPACITY TABLE — Standard Vertical Rainwater Downcomers"
        headers={["Pipe Diameter", "Max Flow (L/sec)", "Typical Area", "Standard"]}
        rows={[
          ["100 mm", "8.0", "40-50 m²", "NBC 2016"],
          ["110 mm", "10.0", "50-60 m²", "IS 15498"],
          ["125 mm", "14.0", "60-75 m²", "NBC 2016"],
          ["150 mm", "22.0", "80-100 m²", "IS 15498"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.sizingTable + 240} x2={CX} y2={Y.safetyFactor} />

      {/* Safety Factor */}
      <Box x={nx} y={Y.safetyFactor} w={nw} h={nh}
        label="Apply Safety Factor (Fill Ratio)"
        sub="Ensure pipe handles peak at ~2/3 full for vertical risers"
        color={C.teal} badge="SAFETY" />
      <AnnotationBox x={nx + nw + 30} y={Y.safetyFactor + 4} w={280} h={68}
        title="Design Practice"
        lines={[
          "• Never design at 100% capacity",
          "• Maintain 2/3rd fill for air gaps",
          "• Prevents backpressure/overflow"
        ]}
        color={C.slate} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 5 — FINAL OUTPUT & SELECTION (The "Schedule" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p5Start} h={H - Y.p5Start - 30}
        label="PHASE 5 — FINAL OUTPUT & SELECTION (The 'Schedule' Layer)" color={C.green.bd} />

      <Arrow x1={CX} y1={Y.safetyFactor + nh} x2={CX} y2={Y.calculatedSize} />

      {/* Calculated Size */}
      <Box x={nx} y={Y.calculatedSize} w={nw} h={nh}
        label="Output 1: Calculated Pipe Size (mm)"
        sub="The exact mathematical requirement from flow analysis"
        color={C.purple} badge="OUTPUT" />
      <Arrow x1={CX} y1={Y.calculatedSize + nh} x2={CX} y2={Y.selectedSize} />

      {/* Selected Size */}
      <Box x={nx} y={Y.selectedSize} w={nw} h={nh}
        label="Output 2: Selected Pipe Size (mm)"
        sub="Rounding up to nearest standard commercial size"
        color={C.green} badge="OUTPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.selectedSize + 4} w={280} h={68}
        title="Commercial Standards"
        lines={[
          "Standard sizes: 110mm, 125mm, 150mm",
          "Always round UP, never down",
          "Match to available pipe inventory"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.selectedSize + nh} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      <RWPDashboard x={dashX} y={Y.dashboard} />

      {/* Final Node */}
      <rect x={CX - 340} y={Y.dashboard + 280} width={680} height={68} rx={20}
        fill={C.green.bd} stroke="#10b981" strokeWidth={3} />
      <text x={CX} y={Y.dashboard + 316} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🏁 Rainwater Pipe (RWP) Schedule — COMPLETE
      </text>
      <text x={CX} y={Y.dashboard + 338} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.9}>
        Updated Schedule → Site Installation + Contractor BOM + Plumbing Coordination
      </text>
    </svg>
  );
}
