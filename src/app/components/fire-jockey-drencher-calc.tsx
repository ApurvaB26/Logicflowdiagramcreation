import React from "react";

// =====================================================================
// FIRE JOCKEY & DRENCHER PUMP CALCULATOR — Custom SVG Flow Diagram
// Logic: DB Fetch → Hydraulic Params → Friction & Head Calc →
//        System Pressure Summation → Multi-Pump Visual Output
// =====================================================================

const W = 1400;
const H = 2300;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#fjd-a)" />
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

// Triple Pump Output Dashboard
function PumpTripleOutput({ x, y }: { x: number; y: number }) {
  const pumps = [
    { title: "Sprinkler Jockey", color: C.blue, head: "75 m", flow: "180 LPM", icon: "\uD83D\uDCA6" },
    { title: "Hydrant Jockey", color: C.fire, head: "105 m", flow: "180 LPM", icon: "\uD83E\uDDEF" },
    { title: "Drencher Pump", color: C.amber, head: "165 m", flow: "3200 LPM", icon: "\uD83C\uDF0A" },
  ];
  const cardW = 340, cardH = 200, gap = 40;
  const totalW2 = pumps.length * cardW + (pumps.length - 1) * gap;
  const sx = x - totalW2 / 2;

  return (
    <g>
      {/* Title */}
      <rect x={sx} y={y} width={totalW2} height={48} rx={14} fill={C.fire.bd} />
      <text x={sx + totalW2 / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={700}>
        {"\uD83D\uDE92"} JOCKEY & DRENCHER PUMP OUTPUT DASHBOARD
      </text>

      {pumps.map((p, i) => {
        const px = sx + i * (cardW + gap);
        const py = y + 60;
        const metrics = [
          { label: "Required Head", value: p.head, icon: "\u2B06\uFE0F" },
          { label: "Flow Rate", value: p.flow, icon: "\uD83D\uDCA7" },
        ];
        const mw = (cardW - 30) / 2;
        return (
          <g key={i}>
            <rect x={px} y={py} width={cardW} height={cardH} rx={14}
              fill={p.color.bg} stroke={p.color.bd} strokeWidth={3} />
            <rect x={px} y={py} width={cardW} height={40} rx={14} fill={p.color.bd} />
            <rect x={px} y={py + 26} width={cardW} height={14} fill={p.color.bd} />
            <text x={px + cardW / 2} y={py + 26} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
              {p.icon} {p.title}
            </text>
            {metrics.map((m, mi) => {
              const mx = px + 10 + mi * (mw + 10);
              const my = py + 56;
              return (
                <g key={mi}>
                  <rect x={mx} y={my} width={mw} height={120} rx={10}
                    fill="#fff" stroke={p.color.bd} strokeWidth={1.5} />
                  <text x={mx + mw / 2} y={my + 30} textAnchor="middle" fontSize={26}>{m.icon}</text>
                  <text x={mx + mw / 2} y={my + 56} textAnchor="middle"
                    fill={p.color.tx} fontSize={12} fontWeight={600}>{m.label}</text>
                  <rect x={mx + 12} y={my + 66} width={mw - 24} height={2} fill={p.color.bd} opacity={0.2} />
                  <text x={mx + mw / 2} y={my + 92} textAnchor="middle"
                    fill={p.color.bd} fontSize={20} fontWeight={800}>{m.value}</text>
                  <text x={mx + mw / 2} y={my + 110} textAnchor="middle"
                    fill={p.color.tx} fontSize={9} opacity={0.6}>(Say Value)</text>
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
// MAIN COMPONENT
// =====================================================================
export function FireJockeyDrencherCalcSVG() {
  const Y = {
    entry: 40,
    step1: 180,
    fetchTable: 300,
    step2: 540,
    hydTable: 660,
    step3: 920,
    jockeyCalc: 1040,
    drencherCalc: 1160,
    safety: 1290,
    step4: 1430,
    jockeyFormula: 1540,
    drencherFormula: 1670,
    step5: 1830,
    pumpOutput: 1940,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="fjd-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* Phase Bands */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.fire.bd} />
      <PhaseBand y={Y.step1 - 15} h={330} label="STEP 1: DATA INITIALIZATION (AUTO-FETCH)" color={C.purple.bd} />
      <PhaseBand y={Y.step2 - 15} h={350} label="STEP 2: HYDRAULIC PARAMETER FETCH (EXCEL DATABASE)" color={C.cyan.bd} />
      <PhaseBand y={Y.step3 - 15} h={480} label="STEP 3: CALCULATION ENGINE (FRICTION & HEAD)" color={C.amber.bd} />
      <PhaseBand y={Y.step4 - 15} h={370} label="STEP 4: SYSTEM PRESSURE SUMMATION" color={C.teal.bd} />
      <PhaseBand y={Y.step5 - 15} h={330} label="STEP 5: VISUAL OUTPUT" color={C.fire.bd} />

      {/* Entry */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.fire.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Jockey & Drencher Pump Calculator" sub="Pressure Maintenance & Water Curtain Pumps"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.step1} />

      {/* Step 1: DB Fetch */}
      <StepBadge x={nx - 24} y={Y.step1 + nh / 2} num={1} color={C.purple.bd} />
      <Box x={nx} y={Y.step1} w={nw} h={nh}
        label="Data Initialization (Auto-Fetch)" sub="System Static Head & Building dimensions from DB"
        color={C.purple} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.step1 + nh} x2={CX} y2={Y.fetchTable} />

      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83D\uDD17 AUTO-FETCHED FROM MAIN PUMP MODULE & BUILDING DB"}
        headers={["Parameter", "Source", "Value", "Unit"]}
        rows={[
          ["System Static Head", "Main Pump Module", "Auto", "meters"],
          ["Basement Horizontal Run", "Building DB", "Auto", "meters"],
          ["Drencher Curtain Length", "Building DB", "Auto", "meters"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.fetchTable + 230} x2={CX} y2={Y.step2} />

      {/* Step 2: Hydraulic Params */}
      <StepBadge x={nx - 24} y={Y.step2 + nh / 2} num={2} color={C.cyan.bd} />
      <Box x={nx} y={Y.step2} w={nw} h={nh}
        label="Hydraulic Parameter Fetch" sub="Pipe Schedule & Friction Factors from Datasheet"
        color={C.cyan} badge="DATASHEET" />
      <Arrow x1={CX} y1={Y.step2 + nh} x2={CX} y2={Y.hydTable} />

      <DataTable x={tableX} y={Y.hydTable}
        title={"\uD83D\uDCC4 PIPE SCHEDULE & FLOW RATES (SHEETS 7-11)"}
        headers={["Pump Type", "Flow Rate", "Pipe Size", "Reference"]}
        rows={[
          ["Jockey Pump", "180 LPM", "50mm / 80mm", "Sheets 7-11"],
          ["Drencher Pump", "3200 LPM", "100mm / 150mm", "Sheets 7-11"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.hydTable + 200} x2={CX} y2={Y.step3} />

      {/* Step 3: Calc Engine */}
      <StepBadge x={nx - 24} y={Y.step3 + nh / 2} num={3} color={C.amber.bd} />
      <Box x={nx} y={Y.step3} w={nw} h={nh}
        label="Calculation Engine: Friction & Head" sub="Head loss through small-bore & high-volume pipes"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step3 + nh} x2={CX} y2={Y.jockeyCalc} />

      {/* Node A: Jockey */}
      <Box x={nx} y={Y.jockeyCalc} w={nw} h={nh}
        label="Node A: Jockey Head Loss" sub="Small-bore pipes (50mm/80mm) for pressure maintenance"
        color={C.blue} badge="CALC" />
      <Arrow x1={CX} y1={Y.jockeyCalc + nh} x2={CX} y2={Y.drencherCalc} />

      {/* Node B: Drencher */}
      <Box x={nx} y={Y.drencherCalc} w={nw} h={nh}
        label="Node B: Drencher Head Loss" sub="High-volume water curtain supply (100mm/150mm)"
        color={C.amber} badge="CALC" />
      <Arrow x1={CX} y1={Y.drencherCalc + nh} x2={CX} y2={Y.safety} />

      {/* Node C: Safety */}
      <FormulaBox x={CX - 280} y={Y.safety} w={560} h={76}
        formula="Safety Factor: All Friction Results \u00D7 1.2"
        note="Mandatory 20% safety margin applied to frictional head loss"
        color={C.rose} />

      {/* Side note */}
      <rect x={CX + 310} y={Y.safety + 6} width={220} height={64} rx={10}
        fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 420} y={Y.safety + 28} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDD25"} Safety Standard
      </text>
      <text x={CX + 420} y={Y.safety + 48} textAnchor="middle" fill={C.fire.tx} fontSize={10} opacity={0.8}>
        +20% on all friction values
      </text>
      <line x1={CX + 280} y1={Y.safety + 38} x2={CX + 310} y2={Y.safety + 38}
        stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.safety + 76} x2={CX} y2={Y.step4} />

      {/* Step 4: Pressure Summation */}
      <StepBadge x={nx - 24} y={Y.step4 + nh / 2} num={4} color={C.teal.bd} />
      <Box x={nx} y={Y.step4} w={nw} h={nh}
        label="System Pressure Summation" sub="Separate logic for Jockey vs Drencher pumps"
        color={C.teal} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.step4 + nh} x2={CX} y2={Y.jockeyFormula} />

      {/* Jockey formula */}
      <FormulaBox x={CX - 320} y={Y.jockeyFormula} w={640} h={76}
        formula="Jockey Head = Static + Friction + 0.5 Bar"
        note="0.5 Bar ensures jockey starts before main pump activates"
        color={C.blue} />

      {/* Side note */}
      <rect x={CX + 350} y={Y.jockeyFormula + 6} width={210} height={64} rx={10}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 455} y={Y.jockeyFormula + 28} textAnchor="middle" fill={C.blue.tx} fontSize={11} fontWeight={700}>
        {"\uD83D\uDCA1"} Jockey Logic
      </text>
      <text x={CX + 455} y={Y.jockeyFormula + 48} textAnchor="middle" fill={C.blue.tx} fontSize={10} opacity={0.8}>
        Starts before main pump
      </text>
      <line x1={CX + 320} y1={Y.jockeyFormula + 38} x2={CX + 350} y2={Y.jockeyFormula + 38}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.jockeyFormula + 76} x2={CX} y2={Y.drencherFormula} />

      {/* Drencher formula */}
      <FormulaBox x={CX - 320} y={Y.drencherFormula} w={640} h={76}
        formula="Drencher Head = Static + Friction + 3.5 Bar"
        note="3.5 Bar required to maintain effective water curtain pressure"
        color={C.amber} />

      <rect x={CX + 350} y={Y.drencherFormula + 6} width={210} height={64} rx={10}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 455} y={Y.drencherFormula + 28} textAnchor="middle" fill={C.amber.tx} fontSize={11} fontWeight={700}>
        {"\uD83D\uDCA1"} Drencher Logic
      </text>
      <text x={CX + 455} y={Y.drencherFormula + 48} textAnchor="middle" fill={C.amber.tx} fontSize={10} opacity={0.8}>
        Curtain pressure required
      </text>
      <line x1={CX + 320} y1={Y.drencherFormula + 38} x2={CX + 350} y2={Y.drencherFormula + 38}
        stroke={C.amber.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.drencherFormula + 76} x2={CX} y2={Y.step5} />

      {/* Step 5: Visual Output */}
      <StepBadge x={CX - 560} y={Y.pumpOutput + 170} num={5} color={C.fire.bd} />
      <PumpTripleOutput x={CX} y={Y.pumpOutput} />
    </svg>
  );
}
