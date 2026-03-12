import React from "react";

// =====================================================================
// STORM WATER DRAINAGE (SWD) & PIPE SIZING CALCULATION — Custom SVG Flow Diagram
// Full architecture: Hydrological Input Data → Channel & Node Geometry →
// Hydraulic Analysis → Validation & Compliance → Final Output Schedule
// =====================================================================

const W = 1600;
const H = 5200;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#swd-a)" />
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
function SWDDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 260;
  const metrics = [
    { label: "Run-off (Qg)", value: "XX m³/s", icon: "🌧️", color: C.cyan },
    { label: "Capacity (Rcc)", value: "XX m³/s", icon: "🌊", color: C.blue },
    { label: "Velocity (V)", value: "X.X m/s", icon: "💨", color: C.purple },
    { label: "Pipe/Channel", value: "XXX mm", icon: "🔧", color: C.green },
  ];
  const cardW = (dw - 80) / 4, cardH = 140;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={18}
        fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={3.5} />
      <rect x={x} y={y} width={dw} height={52} rx={18} fill={C.cyan.bd} />
      <rect x={x} y={y + 36} width={dw} height={16} fill={C.cyan.bd} />
      <text x={x + dw / 2} y={y + 34} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🌊 SWD HYDRAULIC OUTPUT DASHBOARD
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
        Status: ✅ Design validated per NBC 2016 / IS 13174 standards
      </text>
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function SWDCalcSVG() {
  const Y = {
    entry: 40,
    
    // Phase 1: Hydrological Input
    p1Start: 180,
    step1: 280,
    catchArea: 380,
    rainfall: 500,
    runoffCoef: 620,
    runoffTable: 740,
    runoffFormula: 940,
    
    // Phase 2: Channel & Node Geometry
    p2Start: 1080,
    nodeInput: 1180,
    conveyanceDecision: 1300,
    openChannel: 1450,
    closedPipe: 1450,
    converge: 1620,
    geometryCalc: 1730,
    geometryFormula: 1850,
    
    // Phase 3: Hydraulic Analysis
    p3Start: 1970,
    slopeInput: 2070,
    manningN: 2190,
    manningTable: 2290,
    velocityFormula: 2500,
    capacityFormula: 2640,
    
    // Phase 4: Validation & Compliance
    p4Start: 2780,
    capacityCheck: 2880,
    capacityDecision: 3010,
    velocityCheck: 3180,
    velocityDecision: 3310,
    continuity: 3480,
    statusResult: 3600,
    
    // Phase 5: Final Output
    p5Start: 3720,
    specification: 3820,
    layout: 3940,
    dashboard: 4080,
  };

  const nw = 500, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 450;
  const dashX = CX - 550;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="swd-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <linearGradient id="swd-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Title */}
      <rect x={CX - 500} y={Y.entry} width={1000} height={90} rx={20} fill="url(#swd-title-grad)" />
      <text x={CX} y={Y.entry + 38} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800}>
        Storm Water Drainage (SWD) & Pipe Sizing Calculation
      </text>
      <text x={CX} y={Y.entry + 64} textAnchor="middle" fill="#fff" fontSize={13} opacity={0.9}>
        Hydrological Input → Channel Geometry → Hydraulic Analysis → Validation → Final Schedule
      </text>

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 1 — HYDROLOGICAL INPUT DATA (The "Connected Load" Equivalent)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p1Start} h={Y.p2Start - Y.p1Start - 20} 
        label="PHASE 1 — HYDROLOGICAL INPUT DATA (The 'Connected Load' Equivalent)" color={C.cyan.bd} />

      <Arrow x1={CX} y1={Y.entry + 90} x2={CX} y2={Y.step1} />

      {/* Step 1 */}
      <Box x={nx} y={Y.step1} w={nw} h={nh}
        label="Define Catchment Area (A)"
        sub="Input catchment area in Hectares (Ha) or convert from sqm"
        color={C.cyan} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.step1 + 4} w={280} h={68}
        title="Catchment Definition"
        lines={[
          "• Total drainage area served",
          "• Include roads, roofs, landscapes",
          "• Convert: 1 Ha = 10,000 sqm"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.step1 + nh} x2={CX} y2={Y.catchArea} />

      <Box x={nx} y={Y.catchArea} w={nw} h={nh}
        label="Enter Area (A) Value"
        sub="User input: Catchment area in Hectares"
        color={C.cyan} badge="VALUE" />
      <Arrow x1={CX} y1={Y.catchArea + nh} x2={CX} y2={Y.rainfall} />

      {/* Step 2 */}
      <Box x={nx} y={Y.rainfall} w={nw} h={nh}
        label="Determine Rainfall Intensity (I)"
        sub="Input local peak intensity in mm/hr (meteorological data)"
        color={C.blue} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.rainfall + 4} w={280} h={68}
        title="Rainfall Data Source"
        lines={[
          "• Local metrological department",
          "• NBC/IS 13174 reference tables",
          "• Project-specific intensity values"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.rainfall + nh} x2={CX} y2={Y.runoffCoef} />

      {/* Step 3 */}
      <Box x={nx} y={Y.runoffCoef} w={nw} h={nh}
        label="Assign Run-off Coefficient (C)"
        sub="Based on surface type: Concrete/Paved vs Landscape"
        color={C.purple} badge="LOOKUP" />
      <Arrow x1={CX} y1={Y.runoffCoef + nh} x2={CX} y2={Y.runoffTable} />

      <DataTable x={tableX} y={Y.runoffTable}
        title="🌍 RUN-OFF COEFFICIENT (C) — Surface Type Database"
        headers={["Surface Type", "Coefficient (C)", "Typical Use", "Reference"]}
        rows={[
          ["Concrete/Paved", "0.90", "Roads, pavements", "IS 13174"],
          ["Asphalt", "0.85", "Driveways", "NBC 2016"],
          ["Gravel/Crushed Stone", "0.50", "Parking areas", "CPHEEO"],
          ["Landscape/Garden", "0.30", "Green areas", "IS 13174"],
          ["Dense Vegetation", "0.20", "Forest/parks", "NBC 2016"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.runoffTable + 260} x2={CX} y2={Y.runoffFormula} />

      {/* Formula Block */}
      <FormulaBox x={CX - 380} y={Y.runoffFormula} w={760} h={86}
        formula="Qg = C × I × A  (Run-off Generated)"
        note="Rational Method — Q in m³/sec, I in mm/hr, A in Hectares, C = dimensionless"
        color={C.cyan} />
      <AnnotationBox x={nx - 380} y={Y.runoffFormula + 96} w={760} h={42}
        title="Unit Conversion"
        lines={["Qg (m³/sec) = (C × I × A × 10,000) ÷ 3,600,000  [converting Ha to sqm and hr to sec]"]}
        color={C.amber} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 2 — CHANNEL & NODE GEOMETRY (The "Distribution" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p2Start} h={Y.p3Start - Y.p2Start - 20}
        label="PHASE 2 — CHANNEL & NODE GEOMETRY (The 'Distribution' Layer)" color={C.blue.bd} />

      <Arrow x1={CX} y1={Y.runoffFormula + 138} x2={CX} y2={Y.nodeInput} />

      {/* Node Path Input */}
      <Box x={nx} y={Y.nodeInput} w={nw} h={nh}
        label="Define Node Path & Total Length"
        sub="From Node X to Node Y — enter total drainage path length"
        color={C.blue} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.nodeInput + 4} w={280} h={68}
        title="Node Definition"
        lines={[
          "• Node X = upstream point",
          "• Node Y = downstream point",
          "• Total length = pipe/channel run"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.nodeInput + nh} x2={CX} y2={Y.conveyanceDecision - 60} />

      {/* Decision Diamond */}
      <Diamond cx={CX} cy={Y.conveyanceDecision} rxD={240} ryD={60}
        label="Select Conveyance Type"
        sub="Open Channel or Closed Pipe?"
        color={C.amber} />

      {/* Branch paths */}
      {(() => {
        const leftX = CX - 360;
        const rightX = CX + 360;
        const bw = 300, bh = 140;
        return (
          <g>
            {/* Left: Open Channel */}
            <line x1={CX - 240} y1={Y.conveyanceDecision} x2={leftX} y2={Y.conveyanceDecision} 
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.conveyanceDecision} x2={leftX} y2={Y.openChannel}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={leftX - 32} y={Y.conveyanceDecision - 18} width={64} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.conveyanceDecision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>
              OPEN
            </text>

            <Box x={leftX - bw / 2} y={Y.openChannel} w={bw} h={bh}
              label="Open Channel"
              sub="Define Width (W), Depth (D), Free Board"
              color={C.green} badge="OPEN" />
            <text x={leftX} y={Y.openChannel + 50} textAnchor="middle" fill={C.green.tx} fontSize={10.5} fontWeight={600}>
              Free Board: 0.05m - 0.1m
            </text>
            <text x={leftX} y={Y.openChannel + 68} textAnchor="middle" fill={C.green.tx} fontSize={10}>
              Calculate: Wetted Perimeter (P)
            </text>
            <text x={leftX} y={Y.openChannel + 84} textAnchor="middle" fill={C.green.tx} fontSize={10}>
              Flow Area (A) = W × D
            </text>
            <text x={leftX} y={Y.openChannel + 100} textAnchor="middle" fill={C.green.tx} fontSize={10}>
              Hydraulic Radius (R) = A / P
            </text>

            {/* Right: Closed Pipe */}
            <line x1={CX + 240} y1={Y.conveyanceDecision} x2={rightX} y2={Y.conveyanceDecision}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.conveyanceDecision} x2={rightX} y2={Y.closedPipe}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={rightX - 32} y={Y.conveyanceDecision - 18} width={64} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.conveyanceDecision - 6} textAnchor="middle" fill={C.purple.bd} fontSize={11} fontWeight={700}>
              CLOSED
            </text>

            <Box x={rightX - bw / 2} y={Y.closedPipe} w={bw} h={bh}
              label="Closed Pipe"
              sub="Define Pipe Diameter (D₁) in mm"
              color={C.purple} badge="PIPE" />
            <text x={rightX} y={Y.closedPipe + 50} textAnchor="middle" fill={C.purple.tx} fontSize={10.5} fontWeight={600}>
              Standard Sizes: 100, 150, 200, 250mm
            </text>
            <text x={rightX} y={Y.closedPipe + 68} textAnchor="middle" fill={C.purple.tx} fontSize={10}>
              Calculate: Flow Area (A)
            </text>
            <text x={rightX} y={Y.closedPipe + 84} textAnchor="middle" fill={C.purple.tx} fontSize={10}>
              A = π × D₁² / 4
            </text>
            <text x={rightX} y={Y.closedPipe + 100} textAnchor="middle" fill={C.purple.tx} fontSize={10}>
              Hydraulic Radius (R) = D₁ / 4
            </text>

            {/* Converge */}
            <line x1={leftX} y1={Y.openChannel + bh} x2={leftX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.closedPipe + bh} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.converge} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.converge} x2={CX} y2={Y.geometryCalc}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
          </g>
        );
      })()}

      {/* Geometry Calculation */}
      <Box x={nx} y={Y.geometryCalc} w={nw} h={nh}
        label="Calculate Wetted Perimeter & Flow Area"
        sub="Compute hydraulic parameters based on selected type"
        color={C.teal} badge="CALC" />
      <Arrow x1={CX} y1={Y.geometryCalc + nh} x2={CX} y2={Y.geometryFormula} />

      <FormulaBox x={CX - 340} y={Y.geometryFormula} w={680} h={86}
        formula="R = A / P  (Hydraulic Radius)"
        note="R = Hydraulic Radius, A = Flow Area, P = Wetted Perimeter"
        color={C.teal} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 3 — HYDRAULIC ANALYSIS (The "Loss & Drop" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p3Start} h={Y.p4Start - Y.p3Start - 20}
        label="PHASE 3 — HYDRAULIC ANALYSIS (The 'Loss & Drop' Layer)" color={C.amber.bd} />

      <Arrow x1={CX} y1={Y.geometryFormula + 86} x2={CX} y2={Y.slopeInput} />

      {/* Slope Input */}
      <Box x={nx} y={Y.slopeInput} w={nw} h={nh}
        label="Define Longitudinal Slope (S)"
        sub="Enter slope as 1 in 100, 1 in 200, or 1 in 300"
        color={C.amber} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.slopeInput + 4} w={280} h={68}
        title="Slope Guidelines"
        lines={[
          "• Minimum: 1 in 300 (flat terrain)",
          "• Standard: 1 in 200 (normal)",
          "• Steep: 1 in 100 (hilly areas)"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.slopeInput + nh} x2={CX} y2={Y.manningN} />

      {/* Manning's n */}
      <Box x={nx} y={Y.manningN} w={nw} h={nh}
        label="Assign Manning's Roughness (n)"
        sub="Material-based friction coefficient from reference tables"
        color={C.amber} badge="LOOKUP" />
      <Arrow x1={CX} y1={Y.manningN + nh} x2={CX} y2={Y.manningTable} />

      <DataTable x={tableX} y={Y.manningTable}
        title="🔧 MANNING'S ROUGHNESS COEFFICIENT (n) — Material Database"
        headers={["Material", "n Value", "Application", "Reference"]}
        rows={[
          ["PVC Pipe", "0.010", "Modern drainage", "IS 13174"],
          ["Concrete (smooth)", "0.013", "Standard drains", "NBC 2016"],
          ["Cast Iron / DI", "0.012", "Heavy duty", "CPHEEO"],
          ["Earth Channel", "0.025", "Open drains", "IS 13174"],
        ]}
        color={C.amber}
      />
      <Arrow x1={CX} y1={Y.manningTable + 226} x2={CX} y2={Y.velocityFormula} />

      {/* Manning's Equation */}
      <FormulaBox x={CX - 400} y={Y.velocityFormula} w={800} h={86}
        formula="V = (1/n) × R^(2/3) × S^(1/2)  (Manning's Equation)"
        note="V = Flow Velocity (m/s), n = Roughness, R = Hydraulic Radius (m), S = Slope (fraction)"
        color={C.orange} />
      <Arrow x1={CX} y1={Y.velocityFormula + 86} x2={CX} y2={Y.capacityFormula} />

      {/* Carrying Capacity */}
      <FormulaBox x={CX - 360} y={Y.capacityFormula} w={720} h={86}
        formula="Rcc = A × V  (Carrying Capacity)"
        note="Rcc in m³/sec — must exceed Qg (run-off generated) for design to be valid"
        color={C.teal} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 4 — VALIDATION & COMPLIANCE (The "Protection & Sizing" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p4Start} h={Y.p5Start - Y.p4Start - 20}
        label="PHASE 4 — VALIDATION & COMPLIANCE (The 'Protection & Sizing' Layer)" color={C.rose.bd} />

      <Arrow x1={CX} y1={Y.capacityFormula + 86} x2={CX} y2={Y.capacityCheck} />

      {/* Check 1: Capacity */}
      <Box x={nx} y={Y.capacityCheck} w={nw} h={nh}
        label="Check 1: Capacity Validation"
        sub="Is Carrying Capacity (Rcc) > Run-off Generated (Qg)?"
        color={C.rose} badge="CHECK" />
      <Arrow x1={CX} y1={Y.capacityCheck + nh} x2={CX} y2={Y.capacityDecision - 60} />

      <Diamond cx={CX} cy={Y.capacityDecision} rxD={220} ryD={60}
        label="Rcc > Qg ?"
        sub="Capacity Check"
        color={C.rose} />

      {(() => {
        const leftX = CX - 310;
        const rightX = CX + 310;
        const bw = 260, bh = 90;
        const yBase = Y.capacityDecision + 60;
        return (
          <g>
            <line x1={CX - 220} y1={Y.capacityDecision} x2={leftX} y2={Y.capacityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.capacityDecision} x2={leftX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={leftX - 18} y={Y.capacityDecision - 18} width={36} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.capacityDecision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>

            <Box x={leftX - bw / 2} y={yBase} w={bw} h={bh}
              label="✅ Capacity OK"
              sub="Design meets capacity requirement"
              color={C.green} badge="PASS" />

            <line x1={CX + 220} y1={Y.capacityDecision} x2={rightX} y2={Y.capacityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.capacityDecision} x2={rightX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={rightX - 14} y={Y.capacityDecision - 18} width={28} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.capacityDecision - 6} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>NO</text>

            <Box x={rightX - bw / 2} y={yBase} w={bw} h={bh}
              label="❌ REDESIGN"
              sub="Increase slope or channel size"
              color={C.rose} badge="FAIL" />

            <line x1={leftX} y1={yBase + bh} x2={leftX} y2={Y.velocityCheck - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={yBase + bh} x2={rightX} y2={Y.velocityCheck - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.velocityCheck - 30} x2={rightX} y2={Y.velocityCheck - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.velocityCheck - 30} x2={CX} y2={Y.velocityCheck}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
          </g>
        );
      })()}

      {/* Check 2: Velocity */}
      <Box x={nx} y={Y.velocityCheck} w={nw} h={nh}
        label="Check 2: Velocity Range Validation"
        sub="Is Velocity between 0.6 m/s (self-cleansing) and 3.0 m/s (non-scouring)?"
        color={C.rose} badge="CHECK" />
      <Arrow x1={CX} y1={Y.velocityCheck + nh} x2={CX} y2={Y.velocityDecision - 60} />

      <Diamond cx={CX} cy={Y.velocityDecision} rxD={240} ryD={60}
        label="0.6 ≤ V ≤ 3.0 ?"
        sub="Velocity Range Check"
        color={C.rose} />

      {(() => {
        const leftX = CX - 310;
        const rightX = CX + 310;
        const bw = 260, bh = 90;
        const yBase = Y.velocityDecision + 60;
        return (
          <g>
            <line x1={CX - 240} y1={Y.velocityDecision} x2={leftX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.velocityDecision} x2={leftX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={leftX - 18} y={Y.velocityDecision - 18} width={36} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>

            <Box x={leftX - bw / 2} y={yBase} w={bw} h={bh}
              label="✅ Velocity OK"
              sub="No siltation or scouring risk"
              color={C.green} badge="PASS" />

            <line x1={CX + 240} y1={Y.velocityDecision} x2={rightX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.velocityDecision} x2={rightX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={rightX - 14} y={Y.velocityDecision - 18} width={28} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>NO</text>

            <Box x={rightX - bw / 2} y={yBase} w={bw} h={bh}
              label="⚠️ ADJUST"
              sub="Modify slope/diameter/material"
              color={C.rose} badge="WARN" />

            <line x1={leftX} y1={yBase + bh} x2={leftX} y2={Y.continuity - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={yBase + bh} x2={rightX} y2={Y.continuity - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.continuity - 30} x2={rightX} y2={Y.continuity - 30} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.continuity - 30} x2={CX} y2={Y.continuity}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
          </g>
        );
      })()}

      {/* Check 3: Continuity */}
      <Box x={nx} y={Y.continuity} w={nw} h={nh}
        label="Check 3: Continuity Equation"
        sub="Verify Diameter (D) using Q = A × V"
        color={C.teal} badge="CHECK" />
      <Arrow x1={CX} y1={Y.continuity + nh} x2={CX} y2={Y.statusResult} />

      <Box x={CX - 280} y={Y.statusResult} w={560} h={86}
        label="Output: Status Result"
        sub="Final validation: 'Okay' or 'Redesign Required'"
        color={C.green} badge="RESULT" />
      <text x={CX} y={Y.statusResult + 64} textAnchor="middle" fill={C.green.tx} fontSize={12} opacity={0.8}>
        If all checks pass → Status = ✅ OKAY | If any check fails → Status = ⚠️ REDESIGN
      </text>

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 5 — FINAL OUTPUT (The "Schedule" Layer)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p5Start} h={H - Y.p5Start - 30}
        label="PHASE 5 — FINAL OUTPUT (The 'Schedule' Layer)" color={C.green.bd} />

      <Arrow x1={CX} y1={Y.statusResult + 86} x2={CX} y2={Y.specification} />

      {/* Final Specification */}
      <Box x={nx} y={Y.specification} w={nw} h={nh}
        label="Final Specification Output"
        sub="Channel Size (W × D) or Pipe Diameter (mm)"
        color={C.green} badge="OUTPUT" />
      <Arrow x1={CX} y1={Y.specification + nh} x2={CX} y2={Y.layout} />

      {/* Final Layout */}
      <Box x={nx} y={Y.layout} w={nw} h={nh}
        label="Final Layout Data"
        sub="Invert Levels (IL) and Finished Ground Levels (FGL)"
        color={C.green} badge="OUTPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.layout + 4} w={280} h={68}
        title="Layout Deliverables"
        lines={[
          "• IL = Invert Level (bottom of pipe)",
          "• FGL = Finished Ground Level",
          "• Cover depth = FGL - IL"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.layout + nh} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      <SWDDashboard x={dashX} y={Y.dashboard} />

      {/* Final Node */}
      <rect x={CX - 340} y={Y.dashboard + 280} width={680} height={68} rx={20}
        fill={C.green.bd} stroke="#10b981" strokeWidth={3} />
      <text x={CX} y={Y.dashboard + 316} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🏁 Storm Water Pipe/Channel Schedule — COMPLETE
      </text>
      <text x={CX} y={Y.dashboard + 338} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.9}>
        Ready for Site Execution → Contractor BOM + Excavation Schedule + Construction Drawings
      </text>
    </svg>
  );
}
