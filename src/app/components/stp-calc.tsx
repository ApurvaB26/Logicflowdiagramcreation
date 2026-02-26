import React from "react";

// =====================================================================
// STP (Sewage Treatment Plant) CALCULATOR — Custom SVG Flow Diagram
// Modules: Data Integration → Sewer Generation (80/100 Rule) →
//          Infrastructure Sizing → Treated Water Reuse → Output Dashboard
// =====================================================================

const W = 1400;
const H = 2600;
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
  main:   "#06b6d4",
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

function StepBadge({ x, y, num, color, label }: { x: number; y: number; num: number; color: string; label?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={color} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {label || num}
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#stp-a)" />
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

// ── Reuse Streams Visual ──
function ReuseStreams({ x, y }: { x: number; y: number }) {
  const streams = [
    { label: "Stream A", title: "Flushing Purpose", sub: "Auto-balance against FW", color: C.blue, icon: "\uD83D\uDEB0" },
    { label: "Stream B", title: "Irrigation / Garden", sub: "Landscape water supply", color: C.green, icon: "\uD83C\uDF31" },
    { label: "Stream C", title: "Sludge Handling", sub: "~3\u20135% of total", color: C.amber, icon: "\u{1F9F1}" },
    { label: "Stream D", title: "Cooling / HVAC", sub: "CT Makeup water", color: C.cyan, icon: "\u2744\uFE0F" },
  ];
  const cardW = 240, cardH = 110, gap = 24;
  const totalW = streams.length * cardW + (streams.length - 1) * gap;
  const sx = x - totalW / 2;

  const barY = y - 35;
  const centers = streams.map((_, i) => sx + i * (cardW + gap) + cardW / 2);

  return (
    <g>
      {/* Trunk from above */}
      <line x1={x} y1={barY - 30} x2={x} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
      {/* Horizontal bar */}
      <line x1={centers[0]} y1={barY} x2={centers[centers.length - 1]} y2={barY}
        stroke={C.arrow} strokeWidth={2.5} />
      {/* Branch lines to each card */}
      {centers.map((cx, i) => (
        <line key={`rs-${i}`} x1={cx} y1={barY} x2={cx} y2={y}
          stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#stp-a)" />
      ))}
      {/* Stream labels on branches */}
      {streams.map((s, i) => (
        <g key={`rl-${i}`}>
          <rect x={centers[i] - 30} y={barY - 18} width={60} height={16} rx={4} fill="#fff" opacity={0.92} />
          <text x={centers[i]} y={barY - 6} textAnchor="middle" fill="#475569" fontSize={10} fontWeight={600}>
            {s.label}
          </text>
        </g>
      ))}
      {/* Stream Cards */}
      {streams.map((s, i) => {
        const cx = sx + i * (cardW + gap);
        return (
          <g key={`sc-${i}`}>
            <rect x={cx} y={y} width={cardW} height={cardH} rx={12}
              fill={s.color.bg} stroke={s.color.bd} strokeWidth={2.5} />
            <rect x={cx} y={y} width={cardW} height={34} rx={12} fill={s.color.bd} />
            <rect x={cx} y={y + 22} width={cardW} height={12} fill={s.color.bd} />
            <text x={cx + cardW / 2} y={y + 22} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
              {s.icon} {s.title}
            </text>
            <text x={cx + cardW / 2} y={y + 56} textAnchor="middle" fill={s.color.tx} fontSize={12} fontWeight={600}>
              {s.sub}
            </text>
            {/* Output badge */}
            <rect x={cx + cardW / 2 - 36} y={y + cardH - 28} width={72} height={20} rx={10}
              fill={s.color.bd} opacity={0.15} />
            <text x={cx + cardW / 2} y={y + cardH - 14} textAnchor="middle"
              fill={s.color.bd} fontSize={10} fontWeight={600}>ALLOCATED</text>
          </g>
        );
      })}
    </g>
  );
}

// ── Summary Dashboard ──
function STPSummary({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 180;
  const metrics = [
    { label: "Total Sewage\nGenerated", value: "XXX CUM", icon: "\uD83D\uDCA7", color: C.blue },
    { label: "Proposed STP\nSize", value: "XXX CUM", icon: "\u{1F3ED}", color: C.teal },
    { label: "Area Required\n(Sq.m)", value: "XXX Sq.m", icon: "\uD83D\uDCCF", color: C.purple },
    { label: "Reuse\nEfficiency", value: "XX %", icon: "\u267B\uFE0F", color: C.green },
  ];
  const cardW = (dw - 80) / 4;
  const cardH = 100;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.teal.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.teal.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.teal.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDCCA"} STP FINAL OUTPUT DASHBOARD
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
// MAIN EXPORTED COMPONENT
// =====================================================================
export function STPCalcSVG() {
  const Y = {
    entry: 40,
    mod1Header: 180,
    fetchDW: 290,
    fetchFW: 410,
    mod2Header: 560,
    sewDom: 670,
    sewFlush: 810,
    totalSTP: 950,
    mod3Header: 1100,
    stpCapacity: 1210,
    areaCalc: 1350,
    mod4Header: 1500,
    reuseStreams: 1640,
    excessDischarge: 1830,
    mod5Dashboard: 1960,
    // Extended for excess
    excessFormula: 2100,
    dashboard: 2260,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const dashX = CX - 550;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="stp-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="stp-cyan" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cyan.bd} />
        </marker>
      </defs>

      {/* ═══ PHASE BANDS ═══ */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.blue.bd} />
      <PhaseBand y={Y.mod1Header - 15} h={350} label="MODULE 1: DATA INTEGRATION (AUTO-FETCH FROM WATER DEMAND)" color={C.purple.bd} />
      <PhaseBand y={Y.mod2Header - 15} h={500} label="MODULE 2: SEWER GENERATION LOGIC (THE 80/100 RULE)" color={C.amber.bd} />
      <PhaseBand y={Y.mod3Header - 15} h={370} label="MODULE 3: INFRASTRUCTURE SIZING" color={C.cyan.bd} />
      <PhaseBand y={Y.mod4Header - 15} h={550} label="MODULE 4: TREATED WATER REUSE STRATEGY" color={C.teal.bd} />
      <PhaseBand y={Y.excessFormula - 15} h={130} label="DISCHARGE CALCULATION" color={C.rose.bd} />
      <PhaseBand y={Y.dashboard - 15} h={200} label="MODULE 5: FINAL OUTPUT DASHBOARD" color={C.green.bd} />

      {/* ═══ ENTRY ═══ */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.blue.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="STP Calculation Module" sub="Sewage Treatment Plant Sizing & Reuse Strategy"
        color={C.blue} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.mod1Header} />

      {/* ═══ MODULE 1: Data Integration ═══ */}
      <StepBadge x={nx - 24} y={Y.mod1Header + nh / 2} num={1} color={C.purple.bd} label="M1" />
      <Box x={nx} y={Y.mod1Header} w={nw} h={nh}
        label="Module 1: Data Integration" sub="Fetch values from Water Demand Tank Flowchart"
        color={C.purple} badge="AUTO-FETCH" />
      <Arrow x1={CX} y1={Y.mod1Header + nh} x2={CX} y2={Y.fetchDW} />

      {/* Fetch DW */}
      <Box x={nx} y={Y.fetchDW} w={nw} h={nh}
        label="Fetch: Domestic Water Requirement (DW)" sub="From Water Demand Tank Flowchart \u2192 Domestic KL/day"
        color={C.blue} badge="FETCH" />

      {/* Side: Link indicator */}
      <rect x={nx + nw + 30} y={Y.fetchDW + 8} width={200} height={60} rx={10}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={nx + nw + 130} y={Y.fetchDW + 30} textAnchor="middle" fill={C.violet.tx} fontSize={11} fontWeight={700}>
        {"\uD83D\uDD17"} Cross-Module Link
      </text>
      <text x={nx + nw + 130} y={Y.fetchDW + 50} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.8}>
        Water Demand Calc (P3A)
      </text>
      <line x1={nx + nw} y1={Y.fetchDW + 38} x2={nx + nw + 30} y2={Y.fetchDW + 38}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.fetchDW + nh} x2={CX} y2={Y.fetchFW} />

      {/* Fetch FW */}
      <Box x={nx} y={Y.fetchFW} w={nw} h={nh}
        label="Fetch: Flushing Water Requirement (FW)" sub="From Water Demand Tank Flowchart \u2192 Flushing KL/day"
        color={C.blue} badge="FETCH" />
      <Arrow x1={CX} y1={Y.fetchFW + nh} x2={CX} y2={Y.mod2Header} />

      {/* ═══ MODULE 2: Sewer Generation ═══ */}
      <StepBadge x={nx - 24} y={Y.mod2Header + nh / 2} num={2} color={C.amber.bd} label="M2" />
      <Box x={nx} y={Y.mod2Header} w={nw} h={nh}
        label="Module 2: Sewer Generation Logic" sub="The 80/100 Rule \u2014 Industry Standard Conversion"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.mod2Header + nh} x2={CX} y2={Y.sewDom} />

      {/* Sewage from Domestic */}
      <FormulaBox x={CX - 280} y={Y.sewDom} w={560} h={76}
        formula="S_dom = DW \u00D7 0.80"
        note="80% of Domestic Water converts to sewage"
        color={C.amber} />

      {/* Side note */}
      <rect x={CX + 310} y={Y.sewDom + 6} width={220} height={64} rx={10}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 420} y={Y.sewDom + 28} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCA1"} 80% Rule
      </text>
      <text x={CX + 420} y={Y.sewDom + 48} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.8}>
        20% consumed/evaporated
      </text>
      <line x1={CX + 280} y1={Y.sewDom + 38} x2={CX + 310} y2={Y.sewDom + 38}
        stroke={C.rose.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sewDom + 76} x2={CX} y2={Y.sewFlush} />

      {/* Sewage from Flushing */}
      <FormulaBox x={CX - 280} y={Y.sewFlush} w={560} h={76}
        formula="S_flush = FW \u00D7 1.00"
        note="100% of Flushing Water converts to sewage"
        color={C.amber} />

      {/* Side note */}
      <rect x={CX + 310} y={Y.sewFlush + 6} width={220} height={64} rx={10}
        fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 420} y={Y.sewFlush + 28} textAnchor="middle" fill={C.cyan.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCA1"} 100% Rule
      </text>
      <text x={CX + 420} y={Y.sewFlush + 48} textAnchor="middle" fill={C.cyan.tx} fontSize={10} opacity={0.8}>
        All flushing becomes sewage
      </text>
      <line x1={CX + 280} y1={Y.sewFlush + 38} x2={CX + 310} y2={Y.sewFlush + 38}
        stroke={C.cyan.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sewFlush + 76} x2={CX} y2={Y.totalSTP} />

      {/* Total STP Input */}
      <Box x={CX - 260} y={Y.totalSTP} w={520} h={76}
        label="Total STP Input = S_dom + S_flush" sub="Combined sewage generation (CMD / CUM per day)"
        color={C.green} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.totalSTP + 76} x2={CX} y2={Y.mod3Header} />

      {/* ═══ MODULE 3: Infrastructure Sizing ═══ */}
      <StepBadge x={nx - 24} y={Y.mod3Header + nh / 2} num={3} color={C.cyan.bd} label="M3" />
      <Box x={nx} y={Y.mod3Header} w={nw} h={nh}
        label="Module 3: Infrastructure Sizing" sub="Proposed STP Capacity & Area Requirement"
        color={C.cyan} badge="SIZING" />
      <Arrow x1={CX} y1={Y.mod3Header + nh} x2={CX} y2={Y.stpCapacity} />

      {/* STP Capacity */}
      <Box x={nx} y={Y.stpCapacity} w={nw} h={nh}
        label="Proposed STP Capacity = Total STP Input" sub="Capacity set equal to total daily sewage generation"
        color={C.cyan} badge="SET" />
      <Arrow x1={CX} y1={Y.stpCapacity + nh} x2={CX} y2={Y.areaCalc} />

      {/* Area Calculation */}
      <FormulaBox x={CX - 300} y={Y.areaCalc} w={600} h={76}
        formula="Area (sqm) = STP Capacity (CUM) \u00D7 1.0 Sq.M/KLD"
        note="Includes FWT (Fresh Water Tank) & Pumping area"
        color={C.cyan} />
      <Arrow x1={CX} y1={Y.areaCalc + 76} x2={CX} y2={Y.mod4Header} />

      {/* ═══ MODULE 4: Treated Water Reuse ═══ */}
      <StepBadge x={nx - 24} y={Y.mod4Header + nh / 2} num={4} color={C.teal.bd} label="M4" />
      <Box x={nx} y={Y.mod4Header} w={nw} h={nh}
        label="Module 4: Treated Water Reuse Strategy" sub="Split treated water into multiple reuse streams"
        color={C.teal} badge="STRATEGY" />
      <Arrow x1={CX} y1={Y.mod4Header + nh} x2={CX} y2={Y.reuseStreams - 65} />

      {/* 4-way reuse stream fan-out */}
      <ReuseStreams x={CX} y={Y.reuseStreams} />

      {/* Fan-in from streams */}
      {(() => {
        const streams = 4;
        const cardW = 240, gap = 24;
        const totalW = streams * cardW + (streams - 1) * gap;
        const sx = CX - totalW / 2;
        const centers = Array.from({ length: streams }, (_, i) => sx + i * (cardW + gap) + cardW / 2);
        const fanY = Y.reuseStreams + 110 + 30;
        return (
          <g>
            {centers.map((cx, i) => (
              <line key={`fi-${i}`} x1={cx} y1={Y.reuseStreams + 110} x2={cx} y2={fanY}
                stroke={C.arrow} strokeWidth={2.5} />
            ))}
            <line x1={centers[0]} y1={fanY} x2={centers[centers.length - 1]} y2={fanY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={fanY} x2={CX} y2={Y.excessFormula}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#stp-a)" />
          </g>
        );
      })()}

      {/* ═══ EXCESS DISCHARGE ═══ */}
      <FormulaBox x={CX - 300} y={Y.excessFormula} w={600} h={76}
        formula="Excess Water = Total Treated \u2212 Total Reused"
        note="Remaining treated water discharged to external drainage"
        color={C.rose} />
      <Arrow x1={CX} y1={Y.excessFormula + 76} x2={CX} y2={Y.dashboard} />

      {/* ═══ MODULE 5: Dashboard ═══ */}
      <StepBadge x={dashX - 24} y={Y.dashboard + 90} num={5} color={C.teal.bd} label="M5" />
      <STPSummary x={dashX} y={Y.dashboard} />
    </svg>
  );
}
