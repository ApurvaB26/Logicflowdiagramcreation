import React from "react";

// =====================================================================
// RAINWATER HARVESTING (RWH) & TANK SIZING — Custom SVG Flow Diagram
// Logic: Catchment Input → Hydrology → Yield Engine → RWDP Sizing →
//        Collector & Velocity Guard → Tank Sizing → Dashboard
// =====================================================================

const W = 1400;
const H = 2800;
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
  arrow:  "#94a3b8",
};

function PhaseBand({ y, h, label, color }: { y: number; h: number; label: string; color: string }) {
  return (
    <g>
      <rect x={10} y={y} width={W - 20} height={h} rx={14}
        fill={`${color}08`} stroke={`${color}20`} strokeWidth={1.5} strokeDasharray="8,5" />
      <text x={24} y={y + 20} fill={color} fontSize={12} fontWeight={700} opacity={0.5} letterSpacing={1}>{label}</text>
    </g>
  );
}

function StepBadge({ x, y, num, color }: { x: number; y: number; num: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={color} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>{num}</text>
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
          <rect x={x + w - 82} y={y + 6} width={72} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 46} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={16} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={12} opacity={0.7}>{sub}</text>
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
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color.tx} fontSize={12} opacity={0.8}>{sub}</text>
    </g>
  );
}

// Input table for catchment
function CatchmentTable({ x, y }: { x: number; y: number }) {
  const tw = 780, th = 240;
  const headers = ["Area Name", "Area (sqm)", "Surface Type", "C-Factor"];
  const rows = [
    ["Terrace A", "User Input", "Hardscape", "0.95"],
    ["Terrace B", "User Input", "Hardscape", "0.95"],
    ["Garden Area", "User Input", "Softscape", "0.30"],
    ["+ Add Row", "", "", ""],
  ];
  const colW = tw / 4, rowH = 30, hdrY = y + 56;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={46} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 32} width={tw} height={14} fill={C.blue.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {"\uD83D\uDCC4"} CATCHMENT INPUT TABLE \u2014 User adds areas
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={6}
            fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 20} textAnchor="middle"
            fill={C.blue.tx} fontSize={12} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isUser = cell === "User Input";
            const isAdd = cell === "+ Add Row";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 3) + 3}
                  width={colW - 6} height={rowH} rx={6}
                  fill={isAdd && ci === 0 ? C.teal.bg : "#fff"}
                  stroke={isUser ? C.blue.bd : "#e2e8f0"}
                  strokeWidth={isUser ? 2 : 1}
                  strokeDasharray={isUser ? "6,3" : "none"} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 3) + 23}
                  textAnchor="middle" fill={isUser ? C.blue.tx : isAdd ? C.teal.tx : "#64748b"}
                  fontSize={11} fontWeight={isUser || isAdd ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// RWH Summary Dashboard
function RWHSummary({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 180;
  const metrics = [
    { label: "Peak Flow\n(LPS)", value: "XX LPS", icon: "\uD83D\uDCA7", color: C.blue },
    { label: "Total Volume\n(KL)", value: "XXX KL", icon: "\uD83C\uDF0A", color: C.cyan },
    { label: "Pipe Schedule\n(RWDP)", value: "XXmm \u00D7 N", icon: "\uD83D\uDD27", color: C.purple },
    { label: "Tank Size\n(Recommended)", value: "XXX KL", icon: "\uD83C\uDFD7\uFE0F", color: C.green },
  ];
  const cardW = (dw - 80) / 4, cardH = 100;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.blue.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.blue.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDCCA"} RWH FINAL OUTPUT DASHBOARD
      </text>
      {metrics.map((m, i) => {
        const cx = x + 20 + i * (cardW + 16);
        const cy = y + 54;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={cx + cardW / 2} y={cy + 24} textAnchor="middle" fontSize={22}>{m.icon}</text>
            <text x={cx + cardW / 2} y={cy + 46} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[0]}</text>
            <text x={cx + cardW / 2} y={cy + 62} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[1]}</text>
            <text x={cx + cardW / 2} y={cy + 86} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function RWHCalcSVG() {
  const Y = {
    entry: 40,
    catchment: 180,
    catchTable: 300,
    hydrology: 580,
    yieldEngine: 720,
    peakRunoff: 840,
    harvestVol: 970,
    rwdp: 1110,
    rwdpSelect: 1230,
    rwdpCheck: 1370,
    collector: 1520,
    velocity: 1660,
    alarm: 1810,
    alarmYes: 1940,
    alarmNo: 1940,
    alarmConverge: 2070,
    tankSizing: 2150,
    tankCompare: 2280,
    dashboard: 2430,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;
  const dashX = CX - 550;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="rwh-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* Phase Bands */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.blue.bd} />
      <PhaseBand y={Y.catchment - 15} h={370} label="STEP 1: CATCHMENT INPUT" color={C.blue.bd} />
      <PhaseBand y={Y.hydrology - 15} h={110} label="STEP 2: HYDROLOGY INPUT" color={C.cyan.bd} />
      <PhaseBand y={Y.yieldEngine - 15} h={350} label="STEP 3: YIELD ENGINE (CALCULATION)" color={C.amber.bd} />
      <PhaseBand y={Y.rwdp - 15} h={380} label="STEP 4: VERTICAL DOWNCOMER (RWDP) SIZING" color={C.purple.bd} />
      <PhaseBand y={Y.collector - 15} h={520} label="STEP 5: HORIZONTAL COLLECTOR & VELOCITY GUARD" color={C.teal.bd} />
      <PhaseBand y={Y.tankSizing - 15} h={250} label="STEP 6: TANK SIZING (NBC 2016 INTEGRATION)" color={C.green.bd} />
      <PhaseBand y={Y.dashboard - 15} h={200} label="FINAL OUTPUT: RWH DASHBOARD" color={C.blue.bd} />

      {/* Entry */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.blue.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="RWH & Tank Sizing Calculator" sub="Rainwater Harvesting \u2014 NBC 2016 Compliant"
        color={C.blue} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.catchment} />

      {/* Step 1: Catchment */}
      <StepBadge x={nx - 24} y={Y.catchment + nh / 2} num={1} color={C.blue.bd} />
      <Box x={nx} y={Y.catchment} w={nw} h={nh}
        label="Catchment Input" sub="Area Name, Area (sqm), Surface Type [Hardscape/Softscape]"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={Y.catchment + nh} x2={CX} y2={Y.catchTable} />

      <CatchmentTable x={tableX} y={Y.catchTable} />

      {/* Coefficients side note */}
      <rect x={tableX + 810} y={Y.catchTable + 20} width={240} height={80} rx={12}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={tableX + 930} y={Y.catchTable + 42} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCA1"} Runoff Coefficients
      </text>
      <text x={tableX + 930} y={Y.catchTable + 60} textAnchor="middle" fill={C.teal.tx} fontSize={10}>
        Hardscape: C = 0.95
      </text>
      <text x={tableX + 930} y={Y.catchTable + 76} textAnchor="middle" fill={C.teal.tx} fontSize={10}>
        Softscape: C = 0.30
      </text>

      <Arrow x1={CX} y1={Y.catchTable + 240} x2={CX} y2={Y.hydrology} />

      {/* Step 2: Hydrology */}
      <StepBadge x={nx - 24} y={Y.hydrology + nh / 2} num={2} color={C.cyan.bd} />
      <Box x={nx} y={Y.hydrology} w={nw} h={nh}
        label="Hydrology Input" sub="Peak Rainfall Intensity (mm/hr) \u2014 User input"
        color={C.cyan} badge="INPUT" />
      <Arrow x1={CX} y1={Y.hydrology + nh} x2={CX} y2={Y.yieldEngine} />

      {/* Step 3: Yield Engine */}
      <StepBadge x={nx - 24} y={Y.yieldEngine + nh / 2} num={3} color={C.amber.bd} />
      <Box x={nx} y={Y.yieldEngine} w={nw} h={nh}
        label="Yield Engine (Calculation)" sub="Peak runoff for pipe sizing + Total harvestable volume"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.yieldEngine + nh} x2={CX} y2={Y.peakRunoff} />

      {/* Peak Runoff */}
      <FormulaBox x={CX - 300} y={Y.peakRunoff} w={600} h={76}
        formula="Q_peak = (C \u00D7 I \u00D7 A) / 3600"
        note="Peak runoff for pipe sizing (Rational Method)"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.peakRunoff + 76} x2={CX} y2={Y.harvestVol} />

      {/* Harvest Volume */}
      <FormulaBox x={CX - 300} y={Y.harvestVol} w={600} h={76}
        formula="V_harvest = Area \u00D7 Intensity \u00D7 C"
        note="Total harvestable volume per catchment area"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.harvestVol + 76} x2={CX} y2={Y.rwdp} />

      {/* Step 4: RWDP Sizing */}
      <StepBadge x={nx - 24} y={Y.rwdp + nh / 2} num={4} color={C.purple.bd} />
      <Box x={nx} y={Y.rwdp} w={nw} h={nh}
        label="Vertical Downcomer (RWDP) Sizing" sub="User selects pipe diameter for rainwater downcomer"
        color={C.purple} badge="SIZING" />
      <Arrow x1={CX} y1={Y.rwdp + nh} x2={CX} y2={Y.rwdpSelect} />

      <Box x={nx} y={Y.rwdpSelect} w={nw} h={nh}
        label="User Selects Pipe Diameter" sub="Dropdown: 75mm / 100mm / 150mm / 200mm"
        color={C.purple} badge="INPUT" />
      <Arrow x1={CX} y1={Y.rwdpSelect + nh} x2={CX} y2={Y.rwdpCheck} />

      <Box x={nx} y={Y.rwdpCheck} w={nw} h={nh}
        label="NBC 2016 Downcomer Table Check" sub="Output: Number of Downcomers Required"
        color={C.purple} badge="DATABASE" />

      {/* Side note */}
      <rect x={nx + nw + 30} y={Y.rwdpCheck + 4} width={240} height={68} rx={10}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={nx + nw + 150} y={Y.rwdpCheck + 24} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>
        {"\u2705"} Capacity Check
      </text>
      <text x={nx + nw + 150} y={Y.rwdpCheck + 44} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.8}>
        vs NBC 2016 Downcomer Table
      </text>
      <text x={nx + nw + 150} y={Y.rwdpCheck + 60} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.8}>
        Auto-validate diameter
      </text>
      <line x1={nx + nw} y1={Y.rwdpCheck + 38} x2={nx + nw + 30} y2={Y.rwdpCheck + 38}
        stroke={C.green.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.rwdpCheck + nh} x2={CX} y2={Y.collector} />

      {/* Step 5: Collector & Velocity Guard */}
      <StepBadge x={nx - 24} y={Y.collector + nh / 2} num={5} color={C.teal.bd} />
      <Box x={nx} y={Y.collector} w={nw} h={nh}
        label="Horizontal Collector & Velocity Guard" sub="User inputs pipe slope \u2192 Manning's equation"
        color={C.teal} badge="PROCESS" />
      <Arrow x1={CX} y1={Y.collector + nh} x2={CX} y2={Y.velocity} />

      <FormulaBox x={CX - 320} y={Y.velocity} w={640} h={76}
        formula="V = (1/n) \u00D7 R^(2/3) \u00D7 S^(1/2)"
        note="Manning's Equation \u2014 n = roughness, R = hydraulic radius, S = slope"
        color={C.teal} />
      <Arrow x1={CX} y1={Y.velocity + 76} x2={CX} y2={Y.alarm - 55} />

      {/* Velocity Decision */}
      <Diamond cx={CX} cy={Y.alarm} rxD={200} ryD={55}
        label="V \u2265 0.5 m/sec ?" sub="Siltation check"
        color={C.rose} />

      {/* YES path */}
      {(() => {
        const leftX = CX - 300;
        const rightX = CX + 300;
        const bw = 220, bh = 76;
        return (
          <g>
            <line x1={CX - 200} y1={Y.alarm} x2={leftX} y2={Y.alarm} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.alarm} x2={leftX} y2={Y.alarmYes} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
            <rect x={leftX - 18} y={Y.alarm - 18} width={36} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.alarm - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>
            <Box x={leftX - bw / 2} y={Y.alarmYes} w={bw} h={bh}
              label="Safe Design" sub="Velocity OK \u2014 proceed"
              color={C.green} badge="PASS" />

            {/* NO path */}
            <line x1={CX + 200} y1={Y.alarm} x2={rightX} y2={Y.alarm} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.alarm} x2={rightX} y2={Y.alarmNo} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
            <rect x={rightX - 14} y={Y.alarm - 18} width={28} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.alarm - 6} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>NO</text>
            <Box x={rightX - bw / 2} y={Y.alarmNo} w={bw} h={bh}
              label="SILTATION ALARM" sub="\u2191 Slope / \u2193 Diameter / Smoother"
              color={C.rose} badge="ALARM" />

            {/* Converge */}
            <line x1={leftX} y1={Y.alarmYes + bh} x2={leftX} y2={Y.alarmConverge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.alarmNo + bh} x2={rightX} y2={Y.alarmConverge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.alarmConverge} x2={rightX} y2={Y.alarmConverge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.alarmConverge} x2={CX} y2={Y.tankSizing}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#rwh-a)" />
          </g>
        );
      })()}

      {/* Step 6: Tank Sizing */}
      <StepBadge x={nx - 24} y={Y.tankSizing + nh / 2} num={6} color={C.green.bd} />
      <Box x={nx} y={Y.tankSizing} w={nw} h={nh}
        label="Tank Sizing (NBC 2016 Integration)" sub="Fetch standard capacities from NBC 2016 database"
        color={C.green} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.tankSizing + nh} x2={CX} y2={Y.tankCompare} />

      <Box x={CX - 280} y={Y.tankCompare} w={560} h={76}
        label="Min Retention Capacity vs User-Defined Size" sub="Suggest tank dimensions from NBC standard sizes"
        color={C.green} badge="COMPARE" />
      <Arrow x1={CX} y1={Y.tankCompare + 76} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      <StepBadge x={dashX - 24} y={Y.dashboard + 90} num={7} color={C.blue.bd} />
      <RWHSummary x={dashX} y={Y.dashboard} />
    </svg>
  );
}
