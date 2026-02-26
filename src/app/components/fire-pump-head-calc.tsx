import React from "react";

// =====================================================================
// FIRE PUMP HEAD CALCULATOR — Custom SVG Flow Diagram
// Logic: Building Profile → Pipe Network Constants → Friction Loss Engine →
//        System Pressure Summation → Multi-Zone Output
// =====================================================================

const W = 1400;
const H = 2500;
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
  main:   "#dc2626",
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#fp-a)" />
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
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>
        {formula}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>
        {note}
      </text>
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

// ── Multi-Zone Pump Output ──
function PumpZoneOutput({ x, y }: { x: number; y: number }) {
  const zones = [
    {
      title: "High Zone Pump",
      color: C.fire,
      metrics: [
        { label: "Required Head", value: "XXX m", icon: "\u2B06\uFE0F" },
        { label: "Duty Flow Rate", value: "3200 LPM", icon: "\uD83D\uDCA7" },
        { label: "Selected Say Value", value: "185 m", icon: "\u2705" },
      ],
    },
    {
      title: "Low Zone Pump",
      color: C.amber,
      metrics: [
        { label: "Required Head", value: "XXX m", icon: "\u2B06\uFE0F" },
        { label: "Duty Flow Rate", value: "3200 LPM", icon: "\uD83D\uDCA7" },
        { label: "Selected Say Value", value: "XXX m", icon: "\u2705" },
      ],
    },
  ];

  const cardW = 480, cardH = 230, gap = 60;
  const totalW = 2 * cardW + gap;
  const sx = x - totalW / 2;

  return (
    <g>
      {/* Title bar */}
      <rect x={sx} y={y} width={totalW} height={48} rx={14} fill={C.fire.bd} />
      <text x={sx + totalW / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={700}>
        {"\uD83D\uDE92"} MULTI-ZONE FIRE PUMP OUTPUT DASHBOARD
      </text>

      {zones.map((zone, zi) => {
        const zx = sx + zi * (cardW + gap);
        const zy = y + 60;
        const metricW = (cardW - 40) / 3;
        return (
          <g key={zi}>
            {/* Zone Card */}
            <rect x={zx} y={zy} width={cardW} height={cardH} rx={14}
              fill={zone.color.bg} stroke={zone.color.bd} strokeWidth={3} />
            {/* Zone Header */}
            <rect x={zx} y={zy} width={cardW} height={42} rx={14} fill={zone.color.bd} />
            <rect x={zx} y={zy + 28} width={cardW} height={14} fill={zone.color.bd} />
            <text x={zx + cardW / 2} y={zy + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
              {zone.title}
            </text>
            {/* Per NBC note */}
            <text x={zx + cardW / 2} y={zy + 62} textAnchor="middle" fill={zone.color.tx} fontSize={11} opacity={0.7}>
              As per NBC / Fire Authority Norms
            </text>

            {/* Metric Cards */}
            {zone.metrics.map((m, mi) => {
              const mx = zx + 14 + mi * (metricW + 6);
              const my = zy + 78;
              const mh = 130;
              return (
                <g key={mi}>
                  <rect x={mx} y={my} width={metricW} height={mh} rx={10}
                    fill="#fff" stroke={zone.color.bd} strokeWidth={1.5} />
                  <text x={mx + metricW / 2} y={my + 30} textAnchor="middle" fontSize={26}>{m.icon}</text>
                  <text x={mx + metricW / 2} y={my + 56} textAnchor="middle"
                    fill={zone.color.tx} fontSize={12} fontWeight={600}>{m.label}</text>
                  <rect x={mx + 12} y={my + 70} width={metricW - 24} height={2} fill={zone.color.bd} opacity={0.2} />
                  <text x={mx + metricW / 2} y={my + 100} textAnchor="middle"
                    fill={zone.color.bd} fontSize={20} fontWeight={800}>{m.value}</text>
                  <text x={mx + metricW / 2} y={my + 118} textAnchor="middle"
                    fill={zone.color.tx} fontSize={9} opacity={0.6}>
                    {mi === 1 ? "(NBC Std)" : mi === 2 ? "(Rounded)" : "(Calculated)"}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function FirePumpHeadCalcSVG() {
  const Y = {
    entry: 40,
    step1Header: 180,
    fetchTable: 310,
    staticHead: 560,
    step2Header: 720,
    pipeTable: 840,
    step3Header: 1120,
    straightPipe: 1230,
    fittings: 1370,
    totalEquiv: 1510,
    frictionFormula: 1640,
    step4Header: 1790,
    totalHead: 1900,
    safetyLogic: 2040,
    step5Output: 2180,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="fp-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="fp-red" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fire.bd} />
        </marker>
      </defs>

      {/* ═══ PHASE BANDS ═══ */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.fire.bd} />
      <PhaseBand y={Y.step1Header - 15} h={510} label="STEP 1: BUILDING PROFILE (MAIN DATABASE FETCH)" color={C.purple.bd} />
      <PhaseBand y={Y.step2Header - 15} h={370} label="STEP 2: PIPE NETWORK CONSTANTS (DATASHEET FETCH)" color={C.cyan.bd} />
      <PhaseBand y={Y.step3Header - 15} h={640} label="STEP 3: FRICTION LOSS ENGINE (HAZEN-WILLIAMS LOGIC)" color={C.amber.bd} />
      <PhaseBand y={Y.step4Header - 15} h={350} label="STEP 4: SYSTEM PRESSURE SUMMATION" color={C.teal.bd} />
      <PhaseBand y={Y.step5Output - 15} h={320} label="STEP 5: MULTI-ZONE OUTPUT" color={C.fire.bd} />

      {/* ═══ ENTRY ═══ */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.fire.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Fire Pump Head Calculation" sub="Hydrant & Sprinkler System \u2014 NBC / CFO Compliance"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.step1Header} />

      {/* ═══ STEP 1: Building Profile ═══ */}
      <StepBadge x={nx - 24} y={Y.step1Header + nh / 2} num={1} color={C.purple.bd} />
      <Box x={nx} y={Y.step1Header} w={nw} h={nh}
        label="Building Profile (DB Auto-Fetch)" sub="Fetch elevation data & floor count from Main Database"
        color={C.purple} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.step1Header + nh} x2={CX} y2={Y.fetchTable} />

      {/* Fetch Table */}
      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83C\uDFD7\uFE0F BUILDING PROFILE \u2014 AUTO-FETCHED FROM MAIN DATABASE"}
        headers={["Parameter", "Source", "Value", "Unit"]}
        rows={[
          ["Highest Hydrant Elevation", "Main DB", "Auto", "meters"],
          ["Tank Invert Level", "Main DB", "Auto", "meters"],
          ["Number of Floors", "Main DB", "Auto", "count"],
          ["Pump Centerline Level", "Derived", "Auto", "meters"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.fetchTable + 270} x2={CX} y2={Y.staticHead} />

      {/* Static Head Formula */}
      <FormulaBox x={CX - 320} y={Y.staticHead} w={640} h={76}
        formula="H_static = Highest Outlet Elevation \u2212 Pump Centerline Level"
        note="Vertical pressure difference the pump must overcome"
        color={C.purple} />

      {/* Side note */}
      <rect x={CX + 350} y={Y.staticHead + 6} width={220} height={64} rx={10}
        fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 460} y={Y.staticHead + 28} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDD25"} Critical Input
      </text>
      <text x={CX + 460} y={Y.staticHead + 48} textAnchor="middle" fill={C.fire.tx} fontSize={10} opacity={0.8}>
        Defines minimum pump duty
      </text>
      <line x1={CX + 320} y1={Y.staticHead + 38} x2={CX + 350} y2={Y.staticHead + 38}
        stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.staticHead + 76} x2={CX} y2={Y.step2Header} />

      {/* ═══ STEP 2: Pipe Network Constants ═══ */}
      <StepBadge x={nx - 24} y={Y.step2Header + nh / 2} num={2} color={C.cyan.bd} />
      <Box x={nx} y={Y.step2Header} w={nw} h={nh}
        label="Pipe Network Constants (Datasheet)" sub="Pull Pipe Schedule (PIPESCHED) from Sheet 1"
        color={C.cyan} badge="DATASHEET" />
      <Arrow x1={CX} y1={Y.step2Header + nh} x2={CX} y2={Y.pipeTable} />

      {/* Pipe Schedule Table */}
      <DataTable x={tableX} y={Y.pipeTable}
        title={"\uD83D\uDCC4 PIPE SCHEDULE (PIPESCHED) \u2014 GI CLASS C PIPES"}
        headers={["Nominal Size", "Internal Dia (mm)", "C-Factor", "Material"]}
        rows={[
          ["50mm", "52.5", "120", "GI Class C"],
          ["65mm", "68.0", "120", "GI Class C"],
          ["80mm", "80.5", "120", "GI Class C"],
          ["100mm", "105.0", "120", "GI / Steel"],
          ["150mm", "155.0", "120", "GI / Steel"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.pipeTable + 320} x2={CX} y2={Y.step3Header} />

      {/* ═══ STEP 3: Friction Loss Engine ═══ */}
      <StepBadge x={nx - 24} y={Y.step3Header + nh / 2} num={3} color={C.amber.bd} />
      <Box x={nx} y={Y.step3Header} w={nw} h={nh}
        label="Friction Loss Engine" sub="Hazen-Williams Method \u2014 Most critical calculation"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step3Header + nh} x2={CX} y2={Y.straightPipe} />

      {/* Node A: Straight Pipe */}
      <Box x={nx} y={Y.straightPipe} w={nw} h={nh}
        label="Input: Straight Pipe Length" sub="Measure farthest shaft route (horizontal + vertical runs)"
        color={C.amber} badge="INPUT" />
      <Arrow x1={CX} y1={Y.straightPipe + nh} x2={CX} y2={Y.fittings} />

      {/* Node B: Fittings */}
      <Box x={nx} y={Y.fittings} w={nw} h={nh}
        label="Fetch: Fittings & Equivalent Lengths" sub="Gate Valves, Elbows, Check Valves from Database Sheet"
        color={C.amber} badge="DATABASE" />

      {/* Side: Fittings detail */}
      <rect x={nx + nw + 30} y={Y.fittings - 4} width={260} height={84} rx={12}
        fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={nx + nw + 160} y={Y.fittings + 16} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>
        Fitting Equivalent Lengths
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 34} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        Gate Valve: 0.5m | Elbow: 1.2m
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 50} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        Check Valve: 3.5m | Tee: 2.0m
      </text>
      <text x={nx + nw + 160} y={Y.fittings + 66} textAnchor="middle" fill={C.slate.tx} fontSize={9} opacity={0.7}>
        Values from datasheet (per pipe dia)
      </text>
      <line x1={nx + nw} y1={Y.fittings + 38} x2={nx + nw + 30} y2={Y.fittings + 38}
        stroke={C.slate.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.fittings + nh} x2={CX} y2={Y.totalEquiv} />

      {/* Total Equivalent Length */}
      <FormulaBox x={CX - 300} y={Y.totalEquiv} w={600} h={76}
        formula="L_total = L_straight + L_fittings"
        note="Sum of straight pipe + equivalent lengths of all fittings"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.totalEquiv + 76} x2={CX} y2={Y.frictionFormula} />

      {/* Friction Loss Formula */}
      <FormulaBox x={CX - 340} y={Y.frictionFormula} w={680} h={80}
        formula="h_f = 6.78 \u00D7 (V / C)^1.85 \u00D7 (L / D^1.165)"
        note="Hazen-Williams friction loss formula \u2014 V=velocity, C=pipe factor, L=length, D=diameter"
        color={C.amber} />

      {/* Key note */}
      <rect x={CX - 340} y={Y.frictionFormula + 82} width={680} height={36} rx={8}
        fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={CX} y={Y.frictionFormula + 106} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDD25"} Hazen-Williams C = 120 for GI/Steel pipes (fire service standard)
      </text>

      <Arrow x1={CX} y1={Y.frictionFormula + 120} x2={CX} y2={Y.step4Header} />

      {/* ═══ STEP 4: System Pressure ═══ */}
      <StepBadge x={nx - 24} y={Y.step4Header + nh / 2} num={4} color={C.teal.bd} />
      <Box x={nx} y={Y.step4Header} w={nw} h={nh}
        label="System Pressure Summation" sub="Total head = Static + Friction + Residual Requirement"
        color={C.teal} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.step4Header + nh} x2={CX} y2={Y.totalHead} />

      {/* Total Head Formula */}
      <FormulaBox x={CX - 340} y={Y.totalHead} w={680} h={76}
        formula="H_total = H_static + H_friction + Residual Pressure (3.5 Bar)"
        note="Residual pressure requirement as per NBC fire norms"
        color={C.teal} />
      <Arrow x1={CX} y1={Y.totalHead + 76} x2={CX} y2={Y.safetyLogic} />

      {/* Safety Margin */}
      <Box x={CX - 280} y={Y.safetyLogic} w={560} h={76}
        label="Safety Logic: +20% on Friction Component" sub="Mandatory safety margin as per Sheet 3/4/5/6 standards"
        color={C.rose} badge="SAFETY" />

      {/* Side: Sheet reference */}
      <rect x={CX + 310} y={Y.safetyLogic + 6} width={220} height={64} rx={10}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 420} y={Y.safetyLogic + 28} textAnchor="middle" fill={C.violet.tx} fontSize={11} fontWeight={700}>
        {"\uD83D\uDCC1"} Reference Sheets
      </text>
      <text x={CX + 420} y={Y.safetyLogic + 48} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.8}>
        Sheet 3 / 4 / 5 / 6
      </text>
      <line x1={CX + 280} y1={Y.safetyLogic + 38} x2={CX + 310} y2={Y.safetyLogic + 38}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.safetyLogic + 76} x2={CX} y2={Y.step5Output} />

      {/* ═══ STEP 5: Multi-Zone Output ═══ */}
      <StepBadge x={CX - totalOutputW() / 2 - 24} y={Y.step5Output + 150} num={5} color={C.fire.bd} />
      <PumpZoneOutput x={CX} y={Y.step5Output} />
    </svg>
  );
}

function totalOutputW() { return 2 * 480 + 60; }