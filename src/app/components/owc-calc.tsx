import React from "react";

// =====================================================================
// OWC (Organic Waste Converter) CALCULATOR — Custom SVG Flow Diagram
// Logic: DB Fetch → Waste Generation → Bin Sizing → Infrastructure →
//        OWC Processing → Summary Dashboard Output
// =====================================================================

const W = 1400;
const H = 2200;
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
  main:   "#10b981",
  arrow:  "#94a3b8",
};

// ── Helper: Phase Band ──
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

// ── Helper: Step Badge ──
function StepBadge({ x, y, num, color }: { x: number; y: number; num: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={color} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {num}
      </text>
    </g>
  );
}

// ── Helper: Box ──
function Box({ x, y, w, h, label, sub, color, badge, rx }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string; rx?: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx ?? 12}
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

// ── Helper: Arrow ──
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#owc-a)" />
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

// ── Helper: Data Table ──
function DataTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 780, colW = tw / headers.length;
  const rowH = 34, hdrY = y + 56;
  const th = 56 + (rows.length + 1) * (rowH + 3) + 16;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={46} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={14} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {title}
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={6}
            fill={color.bg} stroke={color.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 22} textAnchor="middle"
            fill={color.tx} fontSize={13} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => (
            <g key={`c-${ri}-${ci}`}>
              <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 3) + 3}
                width={colW - 6} height={rowH} rx={6}
                fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
              <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 3) + 23}
                textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={400}>{cell}</text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// ── Helper: Formula Box ──
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
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>
        {formula}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>
        {note}
      </text>
    </g>
  );
}

// ── Summary Dashboard ──
function OWCSummary({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 180;
  const metrics = [
    { label: "Total Daily\nWaste", value: "XXX kg", icon: "\u{1F5D1}\uFE0F", color: C.slate },
    { label: "Wet Bins\n(Green)", value: "XX Nos", icon: "\u{1F7E2}", color: C.green },
    { label: "Dry Bins\n(Blue)", value: "XX Nos", icon: "\uD83D\uDD35", color: C.blue },
    { label: "OWC Capacity\n(kg/day)", value: "XXX kg", icon: "\u267B\uFE0F", color: C.teal },
  ];
  const cardW = (dw - 80) / 4;
  const cardH = 100;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.green.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDCCA"} OWC FINAL OUTPUT DASHBOARD
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

// ── Segregation Split Visual ──
function SegregationSplit({ x, y }: { x: number; y: number }) {
  const boxW = 280, boxH = 80, gap = 120;
  const leftX = x - boxW - gap / 2;
  const rightX = x + gap / 2;
  const barY = y - 30;
  return (
    <g>
      {/* Horizontal bar */}
      <line x1={leftX + boxW / 2} y1={barY} x2={rightX + boxW / 2} y2={barY}
        stroke={C.arrow} strokeWidth={2.5} />
      {/* Trunk up */}
      <line x1={x} y1={barY - 30} x2={x} y2={barY}
        stroke={C.arrow} strokeWidth={2.5} />
      {/* Branches down */}
      <line x1={leftX + boxW / 2} y1={barY} x2={leftX + boxW / 2} y2={y}
        stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
      <line x1={rightX + boxW / 2} y1={barY} x2={rightX + boxW / 2} y2={y}
        stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
      {/* Labels */}
      <g>
        <rect x={leftX + boxW / 2 - 20} y={barY - 18} width={40} height={16} rx={4} fill="#fff" opacity={0.92} />
        <text x={leftX + boxW / 2} y={barY - 6} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>60%</text>
      </g>
      <g>
        <rect x={rightX + boxW / 2 - 20} y={barY - 18} width={40} height={16} rx={4} fill="#fff" opacity={0.92} />
        <text x={rightX + boxW / 2} y={barY - 6} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>40%</text>
      </g>
      {/* Wet Waste Box */}
      <Box x={leftX} y={y} w={boxW} h={boxH}
        label="Wet Waste (Organic)" sub="60% of Total Daily Waste"
        color={C.green} badge="OUTPUT" />
      {/* Dry Waste Box */}
      <Box x={rightX} y={y} w={boxW} h={boxH}
        label="Dry Waste (Recyclable)" sub="40% of Total Daily Waste"
        color={C.blue} badge="OUTPUT" />
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function OWCCalcSVG() {
  const Y = {
    entry: 40,
    dbFetch: 180,
    fetchTable: 310,
    wasteEngine: 580,
    totalWaste: 720,
    segregation: 880,
    binHeader: 1020,
    binCalc: 1100,
    binFormula: 1240,
    infraHeader: 1380,
    carPark: 1470,
    garbageRoom: 1610,
    owcHeader: 1760,
    owcCalc: 1840,
    dashboard: 2000,
  };

  const nw = 420, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;
  const dashX = CX - 550;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="owc-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* ═══ PHASE BANDS ═══ */}
      <PhaseBand y={Y.entry - 15} h={110} label="STEP 0: ENTRY POINT" color={C.blue.bd} />
      <PhaseBand y={Y.dbFetch - 15} h={360} label="STEP 1: DATA INITIALIZATION (AUTO-FETCH FROM MAIN DATABASE)" color={C.purple.bd} />
      <PhaseBand y={Y.wasteEngine - 15} h={400} label="STEP 2: WASTE GENERATION ENGINE (CPHEEO/NBC STANDARDS)" color={C.amber.bd} />
      <PhaseBand y={Y.binHeader - 15} h={330} label="STEP 3: BIN CAPACITY & SIZING (NBC 2016)" color={C.cyan.bd} />
      <PhaseBand y={Y.infraHeader - 15} h={340} label="STEP 4: INFRASTRUCTURE PLANNING" color={C.teal.bd} />
      <PhaseBand y={Y.owcHeader - 15} h={180} label="STEP 5: OWC PROCESSING NODE" color={C.green.bd} />
      <PhaseBand y={Y.dashboard - 15} h={200} label="FINAL OUTPUT: OWC SUMMARY DASHBOARD" color={C.green.bd} />

      {/* ═══ STEP 0: Entry ═══ */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.blue.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="OWC Calculation Module" sub="Organic Waste Converter Sizing & Bin Planning"
        color={C.blue} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.dbFetch} />

      {/* ═══ STEP 1: DB Auto-Fetch ═══ */}
      <StepBadge x={nx - 24} y={Y.dbFetch + nh / 2} num={1} color={C.purple.bd} />
      <Box x={nx} y={Y.dbFetch} w={nw} h={nh}
        label="Connect to Main Building Database" sub="Auto-fetch key project parameters"
        color={C.purple} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.dbFetch + nh} x2={CX} y2={Y.fetchTable} />

      {/* Fetch Data Table */}
      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83D\uDCC4 AUTO-FETCHED DATA FROM MAIN DATABASE"}
        headers={["Parameter", "Source", "Value", "Logic"]}
        rows={[
          ["Total Number of Flats", "Main DB", "Auto", "Direct fetch"],
          ["Total Carpet Area (sqm)", "Main DB", "Auto", "Direct fetch"],
          ["Total Car Parks", "Main DB", "Auto", "Direct fetch"],
          ["Total Population", "Calculated", "Auto", "Flats \u00D7 Occupancy"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.fetchTable + 270} x2={CX} y2={Y.wasteEngine} />

      {/* ═══ STEP 2: Waste Generation ═══ */}
      <StepBadge x={nx - 24} y={Y.wasteEngine + nh / 2} num={2} color={C.amber.bd} />
      <Box x={nx} y={Y.wasteEngine} w={nw} h={nh}
        label="Per Capita Waste Generation Rate" sub="CPHEEO/NBC: 0.45 kg/person/day (Residential)"
        color={C.amber} badge="INPUT" />
      <Arrow x1={CX} y1={Y.wasteEngine + nh} x2={CX} y2={Y.totalWaste} />

      {/* Total Daily Waste Formula */}
      <FormulaBox x={CX - 280} y={Y.totalWaste} w={560} h={76}
        formula="W_total = Population \u00D7 0.45 kg/person/day"
        note="Total daily solid waste generated for the project"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.totalWaste + 76} x2={CX} y2={Y.segregation - 30} />

      {/* Segregation Split: Wet 60% / Dry 40% */}
      <SegregationSplit x={CX} y={Y.segregation} />

      {/* Fan-in from segregation to bin section */}
      {(() => {
        const leftCx = CX - 280 / 2 - 60;
        const rightCx = CX + 280 / 2 + 60;
        const fanY = Y.segregation + 80 + 30;
        return (
          <g>
            <line x1={leftCx} y1={Y.segregation + 80} x2={leftCx} y2={fanY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightCx} y1={Y.segregation + 80} x2={rightCx} y2={fanY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={fanY} x2={rightCx} y2={fanY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={fanY} x2={CX} y2={Y.binHeader}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
          </g>
        );
      })()}

      {/* ═══ STEP 3: Bin Capacity & Sizing ═══ */}
      <StepBadge x={nx - 24} y={Y.binHeader + nh / 2} num={3} color={C.cyan.bd} />
      <Box x={nx} y={Y.binHeader} w={nw} h={nh}
        label="Fetch Bin Capacity from Database" sub="HDPE Bins: 120L / 240L / 1100L (NBC 2016)"
        color={C.cyan} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.binHeader + nh} x2={CX} y2={Y.binCalc} />

      <Box x={nx} y={Y.binCalc} w={nw} h={nh}
        label="Calculate Number of Bins Required" sub="Separate for Wet (Green) and Dry (Blue) streams"
        color={C.cyan} badge="PROCESS" />
      <Arrow x1={CX} y1={Y.binCalc + nh} x2={CX} y2={Y.binFormula} />

      <FormulaBox x={CX - 300} y={Y.binFormula} w={600} h={76}
        formula="No. of Bins = Total Waste Volume \u00F7 (Bin Capacity \u00D7 Efficiency Factor)"
        note="Efficiency factor accounts for fill-rate and collection frequency"
        color={C.cyan} />
      <Arrow x1={CX} y1={Y.binFormula + 76} x2={CX} y2={Y.infraHeader} />

      {/* ═══ STEP 4: Infrastructure Planning ═══ */}
      <StepBadge x={nx - 24} y={Y.infraHeader + nh / 2} num={4} color={C.teal.bd} />
      <Box x={nx} y={Y.infraHeader} w={nw} h={nh}
        label="Car Park Waste Calculation" sub="Waste from parking areas based on sqm (NBC/CPHEEO)"
        color={C.teal} badge="PROCESS" />
      <Arrow x1={CX} y1={Y.infraHeader + nh} x2={CX} y2={Y.carPark} />

      <Box x={CX - 260} y={Y.carPark} w={520} h={76}
        label="Collection Point Logic" sub="Centralized Garbage Room sizing based on total bin footprint"
        color={C.teal} badge="PROCESS" />

      {/* Side note: 50% circulation */}
      <rect x={CX + 300} y={Y.carPark} width={280} height={76} rx={12}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} strokeDasharray="7,4" />
      <text x={CX + 440} y={Y.carPark + 28} textAnchor="middle" fill={C.amber.tx} fontSize={13} fontWeight={700}>
        {"\uD83D\uDCA1"} Design Rule
      </text>
      <text x={CX + 440} y={Y.carPark + 48} textAnchor="middle" fill={C.amber.tx} fontSize={12} opacity={0.8}>
        Total bin footprint + 50%
      </text>
      <text x={CX + 440} y={Y.carPark + 64} textAnchor="middle" fill={C.amber.tx} fontSize={12} opacity={0.8}>
        circulation space = Room Area
      </text>
      <line x1={CX + 260} y1={Y.carPark + 38} x2={CX + 300} y2={Y.carPark + 38}
        stroke={C.amber.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.carPark + 76} x2={CX} y2={Y.garbageRoom} />

      <FormulaBox x={CX - 320} y={Y.garbageRoom} w={640} h={76}
        formula="Garbage Room Area = (N_wet_bins \u00D7 A_bin + N_dry_bins \u00D7 A_bin) \u00D7 1.5"
        note="1.5 factor = bin footprint + 50% circulation/access space"
        color={C.teal} />
      <Arrow x1={CX} y1={Y.garbageRoom + 76} x2={CX} y2={Y.owcHeader} />

      {/* ═══ STEP 5: OWC Processing ═══ */}
      <StepBadge x={nx - 24} y={Y.owcHeader + nh / 2} num={5} color={C.green.bd} />
      <Box x={nx} y={Y.owcHeader} w={nw} h={nh}
        label="OWC Capacity Calculation" sub="Based on total daily Wet Waste quantity"
        color={C.green} badge="PROCESS" />
      <Arrow x1={CX} y1={Y.owcHeader + nh} x2={CX} y2={Y.owcCalc} />

      <FormulaBox x={CX - 280} y={Y.owcCalc} w={560} h={76}
        formula="OWC Capacity (kg/day) = Total Wet Waste (kg) \u00D7 Safety Factor"
        note="Safety factor 1.1\u20131.2 for peak generation days"
        color={C.green} />
      <Arrow x1={CX} y1={Y.owcCalc + 76} x2={CX} y2={Y.dashboard} />

      {/* ═══ FINAL OUTPUT ═══ */}
      <StepBadge x={dashX - 24} y={Y.dashboard + 90} num={6} color={C.green.bd} />
      <OWCSummary x={dashX} y={Y.dashboard} />
    </svg>
  );
}