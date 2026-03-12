import React from "react";

// =====================================================================
// RAINWATER HARVESTING (RWH) & TANK SIZING — Custom SVG Flow Diagram
// Full architecture: Catchment Analysis → Hydrology Data → Yield Calculation →
// RWDP Sizing → Collector Hydraulics → Velocity Guard → Tank Sizing → Final Output
// =====================================================================

const W = 1600;
const H = 6500;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#rwh-a)" />
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

// Catchment Table Component
function CatchmentInputTable({ x, y }: { x: number; y: number }) {
  const tw = 900;
  const headers = ["Area Name", "Area (m²)", "Surface Type", "C-Factor"];
  const rows = [
    ["Terrace A", "User Input", "Hardscape", "0.95"],
    ["Terrace B", "User Input", "Hardscape", "0.95"],
    ["Mumty Roof", "User Input", "Metal Sheet", "0.90"],
    ["Garden Area", "User Input", "Softscape", "0.30"],
    ["+ Add Row", "", "", ""],
  ];
  const colW = tw / 4, rowH = 34, hdrY = y + 58;
  const th = 58 + (rows.length + 1) * (rowH + 4) + 18;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={48} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 34} width={tw} height={14} fill={C.blue.bd} />
      <text x={x + tw / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        📋 CATCHMENT INPUT TABLE — User adds multiple areas
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 4} y={hdrY} width={colW - 8} height={rowH} rx={8}
            fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} />
          <text x={x + i * colW + colW / 2} y={hdrY + 22} textAnchor="middle"
            fill={C.blue.tx} fontSize={13} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => {
        const isAddRow = row[0] === "+ Add Row";
        return (
          <g key={`r-${ri}`}>
            {row.map((cell, ci) => {
              const isInput = cell === "User Input";
              return (
                <g key={`c-${ri}-${ci}`}>
                  <rect x={x + ci * colW + 4} y={hdrY + (ri + 1) * (rowH + 4) + 4}
                    width={colW - 8} height={rowH} rx={8}
                    fill={isAddRow && ci === 0 ? C.teal.bg : isInput ? C.blue.bg : "#fff"}
                    stroke={isInput ? C.blue.bd : "#e2e8f0"}
                    strokeWidth={isInput ? 2 : 1.5}
                    strokeDasharray={isInput ? "6,3" : "none"} />
                  <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 4) + 26}
                    textAnchor="middle" fill={isAddRow ? C.teal.tx : isInput ? C.blue.tx : "#64748b"}
                    fontSize={12} fontWeight={isInput || isAddRow ? 600 : 500}>{cell}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// RWH Summary Dashboard
function RWHDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1200, dh = 280;
  const metrics = [
    { label: "Peak Flow", value: "XX LPS", icon: "💧", color: C.blue },
    { label: "Total Volume", value: "XXX KL", icon: "🌊", color: C.cyan },
    { label: "RWDP Count", value: "N × XXmm", icon: "🔧", color: C.purple },
    { label: "Tank Size", value: "XXX KL", icon: "🏗️", color: C.green },
  ];
  const cardW = (dw - 100) / 4, cardH = 150;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={18}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3.5} />
      <rect x={x} y={y} width={dw} height={52} rx={18} fill={C.blue.bd} />
      <rect x={x} y={y + 36} width={dw} height={16} fill={C.blue.bd} />
      <text x={x + dw / 2} y={y + 34} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🌈 RWH FINAL OUTPUT DASHBOARD — NBC 2016 Compliant
      </text>
      {metrics.map((m, i) => {
        const cx = x + 25 + i * (cardW + 20);
        const cy = y + 80;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={12}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2.5} />
            <text x={cx + cardW / 2} y={cy + 36} textAnchor="middle" fontSize={30}>{m.icon}</text>
            <text x={cx + cardW / 2} y={cy + 74} textAnchor="middle"
              fill={m.color.tx} fontSize={13} fontWeight={700}>{m.label}</text>
            <text x={cx + cardW / 2} y={cy + 120} textAnchor="middle"
              fill={m.color.bd} fontSize={20} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
      <text x={x + dw / 2} y={y + 256} textAnchor="middle" fill={C.slate.tx} fontSize={11} opacity={0.7}>
        Integrated with NBC 2016 Standards → Ready for Implementation
      </text>
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function RWHCalcSVG() {
  const Y = {
    entry: 40,
    
    // Phase 1: Catchment Analysis
    p1Start: 180,
    catchmentInput: 280,
    catchTable: 400,
    areaBreakdown: 680,
    surfaceType: 800,
    coefficientTable: 920,
    
    // Phase 2: Hydrology Data
    p2Start: 1180,
    rainfallInput: 1280,
    intensityTable: 1400,
    annualVsDesign: 1640,
    
    // Phase 3: Yield Calculation
    p3Start: 1780,
    yieldEngine: 1880,
    peakFlowFormula: 2000,
    harvestVolumeFormula: 2140,
    totalYield: 2280,
    
    // Phase 4: RWDP Sizing
    p4Start: 2400,
    rwdpInput: 2500,
    diameterSelect: 2620,
    nbcTableLookup: 2740,
    downcomerCount: 3000,
    
    // Phase 5: Collector Hydraulics
    p5Start: 3140,
    collectorInput: 3240,
    slopeInput: 3360,
    velocityCalc: 3480,
    manningFormula: 3620,
    
    // Phase 6: Velocity Guard
    p6Start: 3780,
    velocityCheck: 3880,
    velocityDecision: 4010,
    safeDesign: 4160,
    siltationAlarm: 4160,
    converge: 4280,
    
    // Phase 7: Tank Sizing
    p7Start: 4400,
    tankInput: 4500,
    nbcStandards: 4620,
    nbcTable: 4740,
    minCapacity: 4960,
    finalSelection: 5080,
    
    // Phase 8: Final Output
    p8Start: 5200,
    dashboard: 5300,
  };

  const nw = 500, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 450;
  const dashX = CX - 600;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="rwh-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <linearGradient id="rwh-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Title */}
      <rect x={CX - 520} y={Y.entry} width={1040} height={90} rx={20} fill="url(#rwh-title-grad)" />
      <text x={CX} y={Y.entry + 38} textAnchor="middle" fill="#fff" fontSize={26} fontWeight={800}>
        Rainwater Harvesting (RWH) & Tank Sizing Calculation
      </text>
      <text x={CX} y={Y.entry + 64} textAnchor="middle" fill="#fff" fontSize={13} opacity={0.9}>
        Catchment Analysis → Hydrology → Yield → RWDP Sizing → Collector → Velocity Guard → Tank → Output
      </text>

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 1 — CATCHMENT ANALYSIS
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p1Start} h={Y.p2Start - Y.p1Start - 20}
        label="PHASE 1 — CATCHMENT AREA ANALYSIS" color={C.blue.bd} />

      <Arrow x1={CX} y1={Y.entry + 90} x2={CX} y2={Y.catchmentInput} />

      <Box x={nx} y={Y.catchmentInput} w={nw} h={nh}
        label="Catchment Input Module"
        sub="Identify all roof/terrace areas contributing to rainwater collection"
        color={C.blue} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.catchmentInput + 4} w={280} h={82}
        title="Catchment Sources"
        lines={[
          "• Building terrace roofs",
          "• Mumty/service roofs",
          "• Podium terraces",
          "• Balconies (if applicable)"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.catchmentInput + nh} x2={CX} y2={Y.catchTable} />

      <CatchmentInputTable x={tableX} y={Y.catchTable} />
      <Arrow x1={CX} y1={Y.catchTable + 300} x2={CX} y2={Y.areaBreakdown} />

      <Box x={nx} y={Y.areaBreakdown} w={nw} h={nh}
        label="Total Area Breakdown"
        sub="Aggregate all catchment zones → Total Effective Area"
        color={C.cyan} badge="CALC" />
      <Arrow x1={CX} y1={Y.areaBreakdown + nh} x2={CX} y2={Y.surfaceType} />

      <Box x={nx} y={Y.surfaceType} w={nw} h={nh}
        label="Surface Type Classification"
        sub="Assign runoff coefficient based on hardscape vs softscape"
        color={C.purple} badge="CLASSIFY" />
      <Arrow x1={CX} y1={Y.surfaceType + nh} x2={CX} y2={Y.coefficientTable} />

      <DataTable x={tableX} y={Y.coefficientTable}
        title="🌍 RUN-OFF COEFFICIENT (C) DATABASE — NBC 2016 / IS 15498"
        headers={["Surface Type", "C Value", "Typical Area", "Reference"]}
        rows={[
          ["Concrete/Tiled Roof", "0.95", "Terraces", "NBC 2016"],
          ["Metal Sheet Roof", "0.90", "Mumty", "IS 15498"],
          ["Asphalt/Bitumen", "0.85", "Podiums", "NBC 2016"],
          ["Green Roof/Garden", "0.30", "Softscape", "IS 15498"],
        ]}
        color={C.purple}
      />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 2 — HYDROLOGY DATA
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p2Start} h={Y.p3Start - Y.p2Start - 20}
        label="PHASE 2 — HYDROLOGY DATA COLLECTION" color={C.cyan.bd} />

      <Arrow x1={CX} y1={Y.coefficientTable + 232} x2={CX} y2={Y.rainfallInput} />

      <Box x={nx} y={Y.rainfallInput} w={nw} h={nh}
        label="Rainfall Intensity Input (I)"
        sub="Enter peak rainfall intensity in mm/hr from local data"
        color={C.cyan} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.rainfallInput + 4} w={280} h={68}
        title="Data Source"
        lines={[
          "• IMD (India Meteorological Dept)",
          "• NBC regional rainfall charts",
          "• Project-specific intensity"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.rainfallInput + nh} x2={CX} y2={Y.intensityTable} />

      <DataTable x={tableX} y={Y.intensityTable}
        title="🌧️ DESIGN RAINFALL INTENSITY — Regional Reference"
        headers={["City/Region", "Peak Intensity", "Return Period", "Source"]}
        rows={[
          ["Mumbai", "113 mm/hr", "1 in 10 yr", "NBC 2016"],
          ["Bangalore", "90 mm/hr", "1 in 10 yr", "NBC 2016"],
          ["Chennai", "120 mm/hr", "1 in 10 yr", "NBC 2016"],
          ["Delhi/NCR", "75 mm/hr", "1 in 10 yr", "NBC 2016"],
          ["Hyderabad", "95 mm/hr", "1 in 10 yr", "NBC 2016"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.intensityTable + 272} x2={CX} y2={Y.annualVsDesign} />

      <Box x={nx} y={Y.annualVsDesign} w={nw} h={nh}
        label="Annual vs Design Intensity"
        sub="Use peak intensity for pipe sizing, annual average for tank volume"
        color={C.amber} badge="NOTE" />
      <AnnotationBox x={nx + nw + 30} y={Y.annualVsDesign + 4} w={280} h={68}
        title="Dual Approach"
        lines={[
          "• Peak I → RWDP pipe diameter",
          "• Annual avg → Tank capacity",
          "• Design for worst-case scenario"
        ]}
        color={C.amber} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 3 — YIELD CALCULATION ENGINE
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p3Start} h={Y.p4Start - Y.p3Start - 20}
        label="PHASE 3 — YIELD CALCULATION ENGINE (Rational Method)" color={C.amber.bd} />

      <Arrow x1={CX} y1={Y.annualVsDesign + nh} x2={CX} y2={Y.yieldEngine} />

      <Box x={nx} y={Y.yieldEngine} w={nw} h={nh}
        label="Yield Engine Activation"
        sub="Compute peak runoff + total harvestable volume"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.yieldEngine + nh} x2={CX} y2={Y.peakFlowFormula} />

      <FormulaBox x={CX - 400} y={Y.peakFlowFormula} w={800} h={86}
        formula="Qpeak = (C × I × A) / 3600"
        note="Peak runoff for RWDP pipe sizing — Q in L/sec, I in mm/hr, A in m², C = runoff coefficient"
        color={C.orange} />
      <Arrow x1={CX} y1={Y.peakFlowFormula + 86} x2={CX} y2={Y.harvestVolumeFormula} />

      <FormulaBox x={CX - 400} y={Y.harvestVolumeFormula} w={800} h={86}
        formula="Vharvest = (Area × Annual Rainfall × C) / 1000"
        note="Total harvestable volume in KL — Annual rainfall in mm, Area in m², C = coefficient"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.harvestVolumeFormula + 86} x2={CX} y2={Y.totalYield} />

      <Box x={CX - 300} y={Y.totalYield} w={600} h={86}
        label="Total Yield Output"
        sub="Qpeak (L/sec) for pipe sizing + Vharvest (KL) for tank sizing"
        color={C.teal} badge="OUTPUT" />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 4 — RWDP (RAINWATER DOWNCOMER PIPE) SIZING
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p4Start} h={Y.p5Start - Y.p4Start - 20}
        label="PHASE 4 — VERTICAL DOWNCOMER (RWDP) SIZING" color={C.purple.bd} />

      <Arrow x1={CX} y1={Y.totalYield + 86} x2={CX} y2={Y.rwdpInput} />

      <Box x={nx} y={Y.rwdpInput} w={nw} h={nh}
        label="RWDP Sizing Module"
        sub="Size vertical rainwater downcomers per NBC 2016 tables"
        color={C.purple} badge="SIZING" />
      <Arrow x1={CX} y1={Y.rwdpInput + nh} x2={CX} y2={Y.diameterSelect} />

      <Box x={nx} y={Y.diameterSelect} w={nw} h={nh}
        label="User Selects Pipe Diameter"
        sub="Choose from standard sizes: 75mm / 100mm / 150mm / 200mm"
        color={C.purple} badge="SELECT" />
      <AnnotationBox x={nx + nw + 30} y={Y.diameterSelect + 4} w={280} h={68}
        title="Standard Sizes"
        lines={[
          "• 75mm — small balconies",
          "• 100mm — typical terraces",
          "• 150mm — large roofs"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.diameterSelect + nh} x2={CX} y2={Y.nbcTableLookup} />

      <Box x={nx} y={Y.nbcTableLookup} w={nw} h={nh}
        label="NBC 2016 Downcomer Table Lookup"
        sub="Cross-reference selected diameter with flow capacity"
        color={C.cyan} badge="LOOKUP" />
      <Arrow x1={CX} y1={Y.nbcTableLookup + nh} x2={CX} y2={Y.downcomerCount} />

      <DataTable x={tableX} y={Y.downcomerCount}
        title="📊 NBC 2016 RAINWATER DOWNCOMER CAPACITY TABLE"
        headers={["Pipe Diameter", "Max Capacity (L/s)", "Max Area (m²)", "Standard"]}
        rows={[
          ["75 mm", "5.5", "30-40", "NBC 2016"],
          ["100 mm", "11.0", "50-70", "NBC 2016"],
          ["150 mm", "28.0", "120-150", "NBC 2016"],
          ["200 mm", "55.0", "200-250", "NBC 2016"],
        ]}
        color={C.purple}
      />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 5 — HORIZONTAL COLLECTOR HYDRAULICS
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p5Start} h={Y.p6Start - Y.p5Start - 20}
        label="PHASE 5 — HORIZONTAL COLLECTOR & PIPE ROUTING" color={C.teal.bd} />

      <Arrow x1={CX} y1={Y.downcomerCount + 232} x2={CX} y2={Y.collectorInput} />

      <Box x={nx} y={Y.collectorInput} w={nw} h={nh}
        label="Collector Pipe Configuration"
        sub="Horizontal pipe from downcomers to storage tank"
        color={C.teal} badge="CONFIG" />
      <Arrow x1={CX} y1={Y.collectorInput + nh} x2={CX} y2={Y.slopeInput} />

      <Box x={nx} y={Y.slopeInput} w={nw} h={nh}
        label="User Input: Pipe Slope (S)"
        sub="Enter slope as fraction (e.g., 1 in 100 = 0.01)"
        color={C.teal} badge="INPUT" />
      <AnnotationBox x={nx + nw + 30} y={Y.slopeInput + 4} w={280} h={68}
        title="Slope Guidelines"
        lines={[
          "• Minimum: 1 in 200 (0.005)",
          "• Recommended: 1 in 100 (0.01)",
          "• Steep: 1 in 50 (0.02)"
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.slopeInput + nh} x2={CX} y2={Y.velocityCalc} />

      <Box x={nx} y={Y.velocityCalc} w={nw} h={nh}
        label="Calculate Flow Velocity"
        sub="Apply Manning's equation for open channel/pipe flow"
        color={C.teal} badge="CALC" />
      <Arrow x1={CX} y1={Y.velocityCalc + nh} x2={CX} y2={Y.manningFormula} />

      <FormulaBox x={CX - 420} y={Y.manningFormula} w={840} h={86}
        formula="V = (1/n) × R^(2/3) × S^(1/2)  (Manning's Equation)"
        note="V = velocity (m/s), n = roughness (PVC=0.010), R = hydraulic radius (m), S = slope (fraction)"
        color={C.orange} />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 6 — VELOCITY GUARD (SILTATION PREVENTION)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p6Start} h={Y.p7Start - Y.p6Start - 20}
        label="PHASE 6 — VELOCITY GUARD (SILTATION PREVENTION)" color={C.rose.bd} />

      <Arrow x1={CX} y1={Y.manningFormula + 86} x2={CX} y2={Y.velocityCheck} />

      <Box x={nx} y={Y.velocityCheck} w={nw} h={nh}
        label="Velocity Range Validation"
        sub="Check if velocity meets self-cleansing requirement"
        color={C.rose} badge="CHECK" />
      <Arrow x1={CX} y1={Y.velocityCheck + nh} x2={CX} y2={Y.velocityDecision - 60} />

      <Diamond cx={CX} cy={Y.velocityDecision} rxD={220} ryD={60}
        label="V ≥ 0.5 m/s ?"
        sub="Siltation Prevention"
        color={C.rose} />

      {(() => {
        const leftX = CX - 310;
        const rightX = CX + 310;
        const bw = 260, bh = 96;
        const yBase = Y.velocityDecision + 60;
        return (
          <g>
            <line x1={CX - 220} y1={Y.velocityDecision} x2={leftX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.velocityDecision} x2={leftX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
            <rect x={leftX - 18} y={Y.velocityDecision - 18} width={36} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>

            <Box x={leftX - bw / 2} y={yBase} w={bw} h={bh}
              label="✅ Safe Design"
              sub="Velocity OK — No siltation risk"
              color={C.green} badge="PASS" />
            <text x={leftX} y={yBase + 74} textAnchor="middle" fill={C.green.tx} fontSize={10.5} opacity={0.8}>
              Proceed to tank sizing
            </text>

            <line x1={CX + 220} y1={Y.velocityDecision} x2={rightX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.velocityDecision} x2={rightX} y2={yBase} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
            <rect x={rightX - 14} y={Y.velocityDecision - 18} width={28} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>NO</text>

            <Box x={rightX - bw / 2} y={yBase} w={bw} h={bh}
              label="⚠️ SILTATION ALARM"
              sub="Adjust slope or diameter"
              color={C.rose} badge="WARN" />
            <text x={rightX} y={yBase + 74} textAnchor="middle" fill={C.rose.tx} fontSize={10.5} opacity={0.8}>
              Options: ↑ Slope / ↓ Diameter
            </text>

            <line x1={leftX} y1={yBase + bh} x2={leftX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={yBase + bh} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.converge} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.converge} x2={CX} y2={Y.p7Start + 80}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
          </g>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 7 — TANK SIZING (NBC 2016 INTEGRATION)
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p7Start} h={Y.p8Start - Y.p7Start - 20}
        label="PHASE 7 — TANK SIZING (NBC 2016 INTEGRATION)" color={C.green.bd} />

      <Box x={nx} y={Y.tankInput} w={nw} h={nh}
        label="Tank Sizing Module"
        sub="Determine minimum retention capacity based on harvested volume"
        color={C.green} badge="SIZING" />
      <Arrow x1={CX} y1={Y.tankInput + nh} x2={CX} y2={Y.nbcStandards} />

      <Box x={nx} y={Y.nbcStandards} w={nw} h={nh}
        label="NBC 2016 Tank Standards"
        sub="Fetch standard tank capacities from NBC database"
        color={C.green} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.nbcStandards + nh} x2={CX} y2={Y.nbcTable} />

      <DataTable x={tableX} y={Y.nbcTable}
        title="🏗️ NBC 2016 STANDARD TANK CAPACITIES"
        headers={["Capacity (KL)", "Typical Use", "Dimensions (LxWxH)", "Standard"]}
        rows={[
          ["10 KL", "Small buildings", "2.5m × 2.0m × 2.0m", "NBC 2016"],
          ["25 KL", "Medium buildings", "4.0m × 3.0m × 2.1m", "NBC 2016"],
          ["50 KL", "Large buildings", "5.0m × 4.0m × 2.5m", "NBC 2016"],
          ["100 KL", "High-rise", "6.0m × 5.5m × 3.0m", "NBC 2016"],
        ]}
        color={C.green}
      />
      <Arrow x1={CX} y1={Y.nbcTable + 232} x2={CX} y2={Y.minCapacity} />

      <Box x={nx} y={Y.minCapacity} w={nw} h={nh}
        label="Minimum Retention Capacity"
        sub="Compare harvested volume vs user-defined tank size"
        color={C.teal} badge="COMPARE" />
      <Arrow x1={CX} y1={Y.minCapacity + nh} x2={CX} y2={Y.finalSelection} />

      <Box x={CX - 300} y={Y.finalSelection} w={600} h={86}
        label="Final Tank Selection"
        sub="Suggest tank dimensions from NBC standard sizes (round up to next size)"
        color={C.green} badge="OUTPUT" />

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 8 — FINAL OUTPUT DASHBOARD
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p8Start} h={H - Y.p8Start - 30}
        label="PHASE 8 — FINAL OUTPUT DASHBOARD" color={C.blue.bd} />

      <Arrow x1={CX} y1={Y.finalSelection + 86} x2={CX} y2={Y.dashboard} />

      <RWHDashboard x={dashX} y={Y.dashboard} />

      {/* Final Node */}
      <rect x={CX - 360} y={Y.dashboard + 300} width={720} height={68} rx={20}
        fill={C.green.bd} stroke="#10b981" strokeWidth={3} />
      <text x={CX} y={Y.dashboard + 336} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        🏁 RWH System Design — COMPLETE
      </text>
      <text x={CX} y={Y.dashboard + 358} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.9}>
        Deliverables: RWDP Schedule + Tank Layout + Collector Routing + NBC Compliance Report
      </text>
    </svg>
  );
}
