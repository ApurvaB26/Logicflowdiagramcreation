import React from "react";

// =====================================================================
// TERRACE FIRE BOOSTER PUMP HEAD CALCULATOR — Custom SVG Flow Diagram
// Logic: Tank & Building Data → Pipe Material → Hazen-Williams Friction →
//        Total Head Summation → Final Output
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
  fire:   { bg: "#fef2f2", bd: "#dc2626", tx: "#991b1b" },
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

function Arrow({ x1, y1, x2, y2, color, dash }: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; dash?: boolean;
}) {
  const c = color || C.arrow;
  const isVert = Math.abs(x1 - x2) < 3;
  const d = isVert
    ? `M${x1},${y1} L${x2},${y2}`
    : `M${x1},${y1} L${x1},${(y1 + y2) / 2} L${x2},${(y1 + y2) / 2} L${x2},${y2}`;
  return (
    <path d={d} fill="none" stroke={c} strokeWidth={2.5}
      strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#tfb-a)" />
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
  const tw = 780, colW = tw / headers.length;
  const rowH = 34, hdrY = y + 56;
  const th = 56 + (rows.length + 1) * (rowH + 3) + 16;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={46} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={14} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>{title}</text>
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

// Final Output Dashboard
function BoosterOutput({ x, y }: { x: number; y: number }) {
  const dw = 800, dh = 200;
  const metrics = [
    { label: "Required Head\n(Meters)", value: "XX m", icon: "\u2B06\uFE0F", color: C.fire },
    { label: "Required Head\n(Bar)", value: "X.X Bar", icon: "\uD83D\uDCCA", color: C.amber },
    { label: "Say Value\n(Rounded)", value: "10 m", icon: "\u2705", color: C.green },
  ];
  const cardW = (dw - 60) / 3, cardH = 120;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.fire.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.fire.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.fire.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDE92"} TERRACE BOOSTER PUMP — FINAL OUTPUT
      </text>
      {metrics.map((m, i) => {
        const cx = x + 16 + i * (cardW + 12);
        const cy = y + 54;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={cx + cardW / 2} y={cy + 28} textAnchor="middle" fontSize={24}>{m.icon}</text>
            <text x={cx + cardW / 2} y={cy + 52} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[0]}</text>
            <text x={cx + cardW / 2} y={cy + 68} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[1]}</text>
            <text x={cx + cardW / 2} y={cy + 100} textAnchor="middle"
              fill={m.color.bd} fontSize={20} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function TerraceBoosterCalcSVG() {
  const Y = {
    entry: 40,
    step1: 180,
    fetchTable: 310,
    staticHead: 550,
    step2: 700,
    pipeTable: 810,
    step3: 1080,
    horizInput: 1190,
    fittings: 1330,
    totalPD: 1470,
    safety: 1600,
    step4: 1740,
    totalHead: 1850,
    step5: 2000,
    dashboard: 2000,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;
  const dashX = CX - 400;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="tfb-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* Phase Bands */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.fire.bd} />
      <PhaseBand y={Y.step1 - 15} h={490} label="STEP 1: BUILDING & TANK DATA (AUTO-FETCH)" color={C.purple.bd} />
      <PhaseBand y={Y.step2 - 15} h={350} label="STEP 2: PIPE MATERIAL & FRICTION DATA (DATASHEET)" color={C.cyan.bd} />
      <PhaseBand y={Y.step3 - 15} h={620} label="STEP 3: FRICTION LOSS ENGINE (HAZEN-WILLIAMS)" color={C.amber.bd} />
      <PhaseBand y={Y.step4 - 15} h={220} label="STEP 4: TOTAL HEAD SUMMATION" color={C.teal.bd} />
      <PhaseBand y={Y.step5 - 15} h={220} label="STEP 5: FINAL OUTPUT DASHBOARD" color={C.fire.bd} />

      {/* Entry */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.fire.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Terrace Fire Booster Pump Head" sub="Gravity-fed fire system \u2014 Booster pump sizing"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.step1} />

      {/* Step 1 */}
      <StepBadge x={nx - 24} y={Y.step1 + nh / 2} num={1} color={C.purple.bd} />
      <Box x={nx} y={Y.step1} w={nw} h={nh}
        label="Building & Tank Data (Auto-Fetch)" sub="Elevation data & tank levels from Main Building Database"
        color={C.purple} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.step1 + nh} x2={CX} y2={Y.fetchTable} />

      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83C\uDFD7\uFE0F BUILDING & TANK DATA — AUTO-FETCHED"}
        headers={["Parameter", "Source", "Value", "Unit"]}
        rows={[
          ["Topmost Hydrant/Sprinkler Elevation", "Main DB", "Auto", "meters"],
          ["Terrace Tank Low Water Level", "Main DB", "Auto", "meters"],
          ["Elevation Difference", "Calculated", "Auto", "meters"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.fetchTable + 230} x2={CX} y2={Y.staticHead} />

      {/* Static Head */}
      <FormulaBox x={CX - 300} y={Y.staticHead} w={600} h={76}
        formula="Static Head (G) = Tank Level \u2212 Most Remote Outlet"
        note="Usually negative or zero if tank is above outlet (gravity-fed)"
        color={C.purple} />

      {/* Side note */}
      <rect x={CX + 330} y={Y.staticHead + 6} width={240} height={64} rx={10}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 450} y={Y.staticHead + 28} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCA1"} Gravity Advantage
      </text>
      <text x={CX + 450} y={Y.staticHead + 48} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.8}>
        Tank above outlet = negative G
      </text>
      <line x1={CX + 300} y1={Y.staticHead + 38} x2={CX + 330} y2={Y.staticHead + 38}
        stroke={C.green.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.staticHead + 76} x2={CX} y2={Y.step2} />

      {/* Step 2 */}
      <StepBadge x={nx - 24} y={Y.step2 + nh / 2} num={2} color={C.cyan.bd} />
      <Box x={nx} y={Y.step2} w={nw} h={nh}
        label="Pipe Material & Friction Data" sub="GI Class C 100mm pipe \u2014 Sheet 12 reference"
        color={C.cyan} badge="DATASHEET" />
      <Arrow x1={CX} y1={Y.step2 + nh} x2={CX} y2={Y.pipeTable} />

      <DataTable x={tableX} y={Y.pipeTable}
        title={"\uD83D\uDCC4 PIPE & FLOW DATA (SHEET 12)"}
        headers={["Parameter", "Value", "Standard", "Notes"]}
        rows={[
          ["Pipe Material", "GI Class C", "IS Standard", "Fire service grade"],
          ["Internal Diameter", "100mm ID", "Sheet 12", "Standard size"],
          ["Flow Rate", "900 LPM", "Sheet 12", "Default constant"],
          ["C-Factor (H-W)", "120", "GI/Steel", "Hazen-Williams"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.pipeTable + 265} x2={CX} y2={Y.step3} />

      {/* Step 3 */}
      <StepBadge x={nx - 24} y={Y.step3 + nh / 2} num={3} color={C.amber.bd} />
      <Box x={nx} y={Y.step3} w={nw} h={nh}
        label="Friction Loss Engine (Hazen-Williams)" sub="Pipe run + fittings equivalent length method"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step3 + nh} x2={CX} y2={Y.horizInput} />

      {/* Node A */}
      <Box x={nx} y={Y.horizInput} w={nw} h={nh}
        label="Input: Horizontal Run to Farthest Shaft" sub="Measure distance in meters from terrace tank to outlet"
        color={C.amber} badge="INPUT" />
      <Arrow x1={CX} y1={Y.horizInput + nh} x2={CX} y2={Y.fittings} />

      {/* Node B */}
      <Box x={nx} y={Y.fittings} w={nw} h={nh}
        label="Fetch: Fittings & Equivalent Lengths" sub="Gate Valves (2), Swing Check Valve (1) from Database"
        color={C.amber} badge="DATABASE" />

      {/* Side: fittings detail */}
      <rect x={nx + nw + 30} y={Y.fittings - 4} width={260} height={84} rx={12}
        fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={nx + nw + 160} y={Y.fittings + 16} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>
        Fittings Equivalent Lengths
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 34} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        2\u00D7 Gate Valve | 1\u00D7 Swing Check
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 50} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        Total PD (A) + Valve PD (B)
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 66} textAnchor="middle" fill={C.slate.tx} fontSize={9} opacity={0.7}>
        Per pipe diameter from datasheet
      </text>
      <line x1={nx + nw} y1={Y.fittings + 38} x2={nx + nw + 30} y2={Y.fittings + 38}
        stroke={C.slate.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.fittings + nh} x2={CX} y2={Y.totalPD} />

      {/* Total PD */}
      <FormulaBox x={CX - 300} y={Y.totalPD} w={600} h={76}
        formula="Total P.D = Straight Pipe PD (A) + Valve & Fitting PD (B)"
        note="Sum of pressure drops across pipe run and all fittings"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.totalPD + 76} x2={CX} y2={Y.safety} />

      {/* Safety */}
      <FormulaBox x={CX - 300} y={Y.safety} w={600} h={76}
        formula="Friction Loss (C) = (A + B) \u00D7 1.2"
        note="20% Safety Factor applied to total friction losses"
        color={C.rose} />
      <Arrow x1={CX} y1={Y.safety + 76} x2={CX} y2={Y.step4} />

      {/* Step 4 */}
      <StepBadge x={nx - 24} y={Y.step4 + 38} num={4} color={C.teal.bd} />
      <FormulaBox x={CX - 340} y={Y.totalHead} w={680} h={80}
        formula="H = Friction Loss (C) + Static Head (G) + Residual (E = 3.5 Bar)"
        note="3.5 Bar = minimum residual pressure for effective firefighting"
        color={C.teal} />

      {/* Side note */}
      <rect x={CX + 370} y={Y.totalHead + 6} width={210} height={64} rx={10}
        fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 475} y={Y.totalHead + 28} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDD25"} E = 3.5 Bar
      </text>
      <text x={CX + 475} y={Y.totalHead + 48} textAnchor="middle" fill={C.fire.tx} fontSize={10} opacity={0.8}>
        NBC fire norm constant
      </text>
      <line x1={CX + 340} y1={Y.totalHead + 38} x2={CX + 370} y2={Y.totalHead + 38}
        stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.totalHead + 80} x2={CX} y2={Y.dashboard} />

      {/* Step 5: Dashboard */}
      <StepBadge x={dashX - 24} y={Y.dashboard + 100} num={5} color={C.fire.bd} />
      <BoosterOutput x={dashX} y={Y.dashboard} />
    </svg>
  );
}