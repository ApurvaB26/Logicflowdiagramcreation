import React from "react";

// =====================================================================
// FIRE TANK SIZE ESTIMATION — Custom SVG Flow Diagram
// Logic: DB Fetch → Standards Lookup → Sprinkler/Hydrant/Drencher Calc →
//        Safety Decision Gate → Final Output Dashboard
// =====================================================================

const W = 1400;
const H = 2400;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#fts-a)" />
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

// Decision diamond
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

// 3-way calc fan-out
function CalcEngineTriple({ x, y }: { x: number; y: number }) {
  const cards = [
    { title: "Node A: Sprinkler Volume", formula: "V_spr = Area \u00D7 Flow Rate \u00D7 Duration", sub: "IS-15105 / NFPA-13 lookup", color: C.blue, icon: "\uD83D\uDCA6" },
    { title: "Node B: Hydrant Volume", formula: "V_hyd = 1800 LPM \u00D7 Duration", sub: "Standard hydrant flow rate", color: C.fire, icon: "\uD83E\uDDEF" },
    { title: "Node C: Drencher Volume", formula: "V_dre = Linear Length \u00D7 35 L/min/m", sub: "Water curtain input", color: C.amber, icon: "\uD83C\uDF0A" },
  ];
  const cardW = 360, cardH = 120, gap = 30;
  const totalW = cards.length * cardW + (cards.length - 1) * gap;
  const sx = x - totalW / 2;
  const barY = y - 35;
  const centers = cards.map((_, i) => sx + i * (cardW + gap) + cardW / 2);

  return (
    <g>
      {/* Trunk */}
      <line x1={x} y1={barY - 30} x2={x} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
      {/* Horizontal bar */}
      <line x1={centers[0]} y1={barY} x2={centers[2]} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
      {/* Branches */}
      {centers.map((cx, i) => (
        <line key={`ce-${i}`} x1={cx} y1={barY} x2={cx} y2={y}
          stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#fts-a)" />
      ))}
      {/* Cards */}
      {cards.map((c, i) => {
        const cx = sx + i * (cardW + gap);
        return (
          <g key={`cc-${i}`}>
            <rect x={cx} y={y} width={cardW} height={cardH} rx={12}
              fill={c.color.bg} stroke={c.color.bd} strokeWidth={2.5} />
            <rect x={cx} y={y} width={cardW} height={34} rx={12} fill={c.color.bd} />
            <rect x={cx} y={y + 22} width={cardW} height={12} fill={c.color.bd} />
            <text x={cx + cardW / 2} y={y + 22} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
              {c.icon} {c.title}
            </text>
            <text x={cx + cardW / 2} y={y + 58} textAnchor="middle" fill={c.color.tx} fontSize={14} fontWeight={700}>
              {c.formula}
            </text>
            <text x={cx + cardW / 2} y={y + 78} textAnchor="middle" fill={c.color.tx} fontSize={11} opacity={0.7}>
              {c.sub}
            </text>
            {/* SUM badge */}
            <rect x={cx + cardW / 2 - 36} y={y + cardH - 28} width={72} height={20} rx={10}
              fill={c.color.bd} opacity={0.15} />
            <text x={cx + cardW / 2} y={y + cardH - 14} textAnchor="middle"
              fill={c.color.bd} fontSize={10} fontWeight={600}>VOLUME</text>
          </g>
        );
      })}
    </g>
  );
}

// Summary Dashboard
function FTSSummary({ x, y }: { x: number; y: number }) {
  const dw = 1000, dh = 180;
  const metrics = [
    { label: "Fire Water Tank\nCapacity", value: "XXX m\u00B3", icon: "\uD83D\uDEA8", color: C.fire },
    { label: "Sprinkler\nDemand", value: "XXX m\u00B3", icon: "\uD83D\uDCA6", color: C.blue },
    { label: "Hydrant\nDemand", value: "XXX m\u00B3", icon: "\uD83E\uDDEF", color: C.amber },
  ];
  const cardW = (dw - 60) / 3, cardH = 100;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.fire.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.fire.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.fire.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDCCA"} FIRE TANK SIZING — FINAL OUTPUT
      </text>
      {metrics.map((m, i) => {
        const cx = x + 16 + i * (cardW + 12);
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
export function FireTankCalcSVG() {
  const Y = {
    entry: 40,
    step1: 180,
    fetchTable: 310,
    step2: 580,
    stdTable: 690,
    step3: 960,
    calcEngine: 1100,
    fanIn: 1240,
    totalVol: 1340,
    step4: 1480,
    decision: 1610,
    pathYes: 1740,
    pathNo: 1740,
    converge: 1870,
    step5: 2010,
    dashboard: 2130,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;
  const dashX = CX - 500;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="fts-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* Phase Bands */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.fire.bd} />
      <PhaseBand y={Y.step1 - 15} h={370} label="STEP 1: DATA INITIALIZATION (AUTO-FETCH)" color={C.purple.bd} />
      <PhaseBand y={Y.step2 - 15} h={350} label="STEP 2: STANDARDS & LIBRARY FETCH (IS-15105 / NFPA-13)" color={C.cyan.bd} />
      <PhaseBand y={Y.step3 - 15} h={420} label="STEP 3: CALCULATION ENGINE (SPRINKLER / HYDRANT / DRENCHER)" color={C.amber.bd} />
      <PhaseBand y={Y.step4 - 15} h={370} label="STEP 4: DECISION GATE (300 m\u00B3 SAFETY COMPLIANCE)" color={C.rose.bd} />
      <PhaseBand y={Y.step5 - 15} h={80} label="STEP 5: FINAL OUTPUT" color={C.fire.bd} />
      <PhaseBand y={Y.dashboard - 15} h={200} label="FIRE TANK SIZING DASHBOARD" color={C.fire.bd} />

      {/* Entry */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.fire.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Fire Tank Size Estimation" sub="Water Storage for Sprinkler, Hydrant & Drencher Systems"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.step1} />

      {/* Step 1: DB Fetch */}
      <StepBadge x={nx - 24} y={Y.step1 + nh / 2} num={1} color={C.purple.bd} />
      <Box x={nx} y={Y.step1} w={nw} h={nh}
        label="Connect to Main Project Database" sub="Auto-fetch building & hazard classification data"
        color={C.purple} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.step1 + nh} x2={CX} y2={Y.fetchTable} />

      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83C\uDFD7\uFE0F PROJECT DATA — AUTO-FETCHED"}
        headers={["Parameter", "Source", "Value", "Classification"]}
        rows={[
          ["Building Occupancy Type", "Main DB", "Auto", "Residential / Commercial"],
          ["Total Basement Area (sqm)", "Main DB", "Auto", "sqm"],
          ["Hazard Classification", "Main DB", "Auto", "Light / Ordinary"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.fetchTable + 230} x2={CX} y2={Y.step2} />

      {/* Step 2: Standards Fetch */}
      <StepBadge x={nx - 24} y={Y.step2 + nh / 2} num={2} color={C.cyan.bd} />
      <Box x={nx} y={Y.step2} w={nw} h={nh}
        label="Standards & Library Fetch" sub="IS-15105 / NFPA-13 tables from Datasheet & Excel"
        color={C.cyan} badge="DATASHEET" />
      <Arrow x1={CX} y1={Y.step2 + nh} x2={CX} y2={Y.stdTable} />

      <DataTable x={tableX} y={Y.stdTable}
        title={"\uD83D\uDCC4 FIRE STANDARDS LOOKUP — IS-15105 / NFPA-13"}
        headers={["Variable", "Standard", "Value", "Unit"]}
        rows={[
          ["Sprinkler Flow Rate", "IS-15105", "Lookup", "L/min/m\u00B2"],
          ["Hydrant Flow Rate", "NBC/CFO", "1800", "LPM"],
          ["Operation Duration", "IS-15105", "30 or 60", "minutes"],
          ["Drencher Rate", "Standard", "35", "L/min/m"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.stdTable + 260} x2={CX} y2={Y.step3} />

      {/* Step 3: Calc Engine */}
      <StepBadge x={nx - 24} y={Y.step3 + nh / 2} num={3} color={C.amber.bd} />
      <Box x={nx} y={Y.step3} w={nw} h={nh}
        label="Calculation Engine (Automated)" sub="Parallel volume calculations for all fire systems"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step3 + nh} x2={CX} y2={Y.calcEngine - 65} />

      {/* Triple calc fan-out */}
      <CalcEngineTriple x={CX} y={Y.calcEngine} />

      {/* Fan-in from triple calcs */}
      {(() => {
        const cardW = 360, gap = 30;
        const totalW2 = 3 * cardW + 2 * gap;
        const sx = CX - totalW2 / 2;
        const centers = [0, 1, 2].map(i => sx + i * (cardW + gap) + cardW / 2);
        const fanY = Y.calcEngine + 120 + 30;
        return (
          <g>
            {centers.map((cx, i) => (
              <line key={`fi-${i}`} x1={cx} y1={Y.calcEngine + 120} x2={cx} y2={fanY}
                stroke={C.arrow} strokeWidth={2.5} />
            ))}
            <line x1={centers[0]} y1={fanY} x2={centers[2]} y2={fanY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={fanY} x2={CX} y2={Y.totalVol}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#fts-a)" />
          </g>
        );
      })()}

      {/* Total volume summation */}
      <Box x={CX - 280} y={Y.totalVol} w={560} h={76}
        label="Total Fire Water Demand = V_spr + V_hyd + V_dre" sub="Combined volume in cubic meters (m\u00B3)"
        color={C.green} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.totalVol + 76} x2={CX} y2={Y.step4} />

      {/* Step 4: Decision Gate */}
      <StepBadge x={nx - 24} y={Y.step4 + nh / 2} num={4} color={C.rose.bd} />
      <Box x={nx} y={Y.step4} w={nw} h={nh}
        label="Decision Gate: Safety Compliance" sub="Compare vs 300 m\u00B3 minimum (Ordinary Hazard Basements)"
        color={C.rose} badge="DECISION" />
      <Arrow x1={CX} y1={Y.step4 + nh} x2={CX} y2={Y.decision - 55} />

      {/* Diamond */}
      <Diamond cx={CX} cy={Y.decision} rxD={220} ryD={55}
        label="Calculated \u2265 300 m\u00B3 ?" sub="NBC Ordinary Hazard Minimum"
        color={C.rose} />

      {/* Two branches */}
      {(() => {
        const leftX = CX - 300;
        const rightX = CX + 300;
        const bw = 240, bh = 76;
        return (
          <g>
            {/* Left: YES */}
            <line x1={CX - 220} y1={Y.decision} x2={leftX} y2={Y.decision}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.decision} x2={leftX} y2={Y.pathYes}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#fts-a)" />
            <rect x={leftX - 18} y={Y.decision - 18} width={36} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.decision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>

            <Box x={leftX - bw / 2} y={Y.pathYes} w={bw} h={bh}
              label="Final Tank = Calculated" sub="Use calculated volume directly"
              color={C.green} badge="PASS" />

            {/* Right: NO */}
            <line x1={CX + 220} y1={Y.decision} x2={rightX} y2={Y.decision}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.decision} x2={rightX} y2={Y.pathNo}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#fts-a)" />
            <rect x={rightX - 14} y={Y.decision - 18} width={28} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.decision - 6} textAnchor="middle" fill={C.fire.bd} fontSize={11} fontWeight={700}>NO</text>

            <Box x={rightX - bw / 2} y={Y.pathNo} w={bw} h={bh}
              label="Final Tank = 300 m\u00B3" sub="Override: NBC minimum enforced"
              color={C.fire} badge="OVERRIDE" />

            {/* Converge */}
            <line x1={leftX} y1={Y.pathYes + bh} x2={leftX} y2={Y.converge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.pathNo + bh} x2={rightX} y2={Y.converge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.converge} x2={rightX} y2={Y.converge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.converge} x2={CX} y2={Y.step5}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#fts-a)" />
          </g>
        );
      })()}

      {/* Step 5: Final */}
      <StepBadge x={nx - 24} y={Y.step5 + 20} num={5} color={C.fire.bd} />
      <Box x={nx} y={Y.step5} w={nw} h={56}
        label="Final Fire Water Tank Capacity" sub="Selected value after compliance check"
        color={C.green} badge="FINAL" />
      <Arrow x1={CX} y1={Y.step5 + 56} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      <FTSSummary x={dashX} y={Y.dashboard} />
    </svg>
  );
}