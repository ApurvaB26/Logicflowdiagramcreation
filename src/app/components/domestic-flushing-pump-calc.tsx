import React from "react";

// =====================================================================
// DOMESTIC & FLUSHING PUMP CALCULATIONS — Custom SVG Flow Diagram
// Phase 1: Project Data & Capacity Inputs (Q)
// Phase 2: Hydraulic Head (TDH) Calculations
// Phase 3: Selection & Output
// =====================================================================

const W = 1560;
const CX = W / 2; // 780 — main flow spine

// Colors — Bold Blue/Orange/Green system
const C = {
  blue:   { bg: "#dbeafe", bd: "#2563eb", tx: "#1e40af" },
  orange: { bg: "#fff7ed", bd: "#ea580c", tx: "#9a3412" },
  green:  { bg: "#d1fae5", bd: "#059669", tx: "#065f46" },
  purple: { bg: "#ede9fe", bd: "#7c3aed", tx: "#5b21b6" },
  cyan:   { bg: "#cffafe", bd: "#0891b2", tx: "#155e75" },
  rose:   { bg: "#ffe4e6", bd: "#e11d48", tx: "#9f1239" },
  amber:  { bg: "#fef3c7", bd: "#d97706", tx: "#92400e" },
  teal:   { bg: "#ccfbf1", bd: "#0d9488", tx: "#134e4a" },
  slate:  { bg: "#f1f5f9", bd: "#64748b", tx: "#334155" },
  fire:   { bg: "#fef2f2", bd: "#dc2626", tx: "#991b1b" },
  arrow:  "#94a3b8",
};

// ── Constants ──
const BW = 520;                // main box width
const BH = 64;                 // main box height
const BX = CX - BW / 2;       // main box left edge (centered)
const COL_W = 340;             // branch column width
const COL_GAP = 30;            // gap between branch columns
const TOTAL_3COL = COL_W * 3 + COL_GAP * 2; // total 3-col width
const COL_LX = CX - TOTAL_3COL / 2;         // left col start
const COL_MX = COL_LX + COL_W + COL_GAP;    // mid col start
const COL_RX = COL_MX + COL_W + COL_GAP;    // right col start
const NOTE_W = 300;            // note box width
const NOTE_X = BX + BW + 30;  // note box x (right of main box)

// =====================================================================
// REUSABLE SVG COMPONENTS
// =====================================================================

function PhaseBand({ y, h, label, color, icon }: { y: number; h: number; label: string; color: string; icon?: string }) {
  return (
    <g>
      <rect x={20} y={y} width={W - 40} height={h} rx={16}
        fill={`${color}08`} stroke={`${color}25`} strokeWidth={2} strokeDasharray="10,6" />
      <rect x={20} y={y} width={W - 40} height={36} rx={16} fill={`${color}12`} />
      <rect x={20} y={y + 24} width={W - 40} height={12} fill={`${color}12`} />
      <text x={40} y={y + 24} fill={color} fontSize={13} fontWeight={800} letterSpacing={1.2}>
        {icon ? `${icon}  ${label}` : label}
      </text>
    </g>
  );
}

function StepBadge({ x, y, num, color }: { x: number; y: number; num: number | string; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={color} />
      <circle cx={x} cy={y} r={18} fill="none" stroke="#fff" strokeWidth={2} opacity={0.25} />
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
          <text x={x + w - 46} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + (badge ? 34 : h / 2 - 4)} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>{label}</text>
      <text x={cx} y={y + (badge ? 50 : h / 2 + 12)} textAnchor="middle" fill={color.tx} fontSize={10} opacity={0.7}>{sub}</text>
    </g>
  );
}

function Diamond({ cx: dcx, cy: dcy, w, h, label, sub, color }: {
  cx: number; cy: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <polygon
        points={`${dcx},${dcy - h / 2} ${dcx + w / 2},${dcy} ${dcx},${dcy + h / 2} ${dcx - w / 2},${dcy}`}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5}
      />
      <text x={dcx} y={dcy - 4} textAnchor="middle" fill={color.tx} fontSize={12} fontWeight={700}>{label}</text>
      <text x={dcx} y={dcy + 12} textAnchor="middle" fill={color.tx} fontSize={9} opacity={0.7}>{sub}</text>
    </g>
  );
}

function VArrow({ y1, y2, x, color: c }: { y1: number; y2: number; x?: number; color?: string }) {
  const ax = x ?? CX;
  return <line x1={ax} y1={y1} x2={ax} y2={y2} stroke={c || C.arrow} strokeWidth={2} markerEnd="url(#dfp-arrow)" />;
}

function FanArrow({ x1, y1, x2, y2, label, color: c }: {
  x1: number; y1: number; x2: number; y2: number; label?: string; color?: string;
}) {
  const cl = c || C.arrow;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`}
        fill="none" stroke={cl} strokeWidth={2} markerEnd="url(#dfp-arrow)" />
      {label && (
        <>
          <rect x={x2 - 28} y={y2 - 22} width={56} height={18} rx={9} fill="#fff" stroke={cl} strokeWidth={1} />
          <text x={x2} y={y2 - 10} textAnchor="middle" fill={cl} fontSize={9} fontWeight={600}>{label}</text>
        </>
      )}
    </g>
  );
}

function NoteBox({ x, y, w, h, text: lines, color }: {
  x: number; y: number; w: number; h: number;
  text: string[];
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill={color.bg} stroke={color.bd} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={x + 10} y={y + 16} fill={color.tx} fontSize={10} fontWeight={700}>
        {lines[0]}
      </text>
      {lines.slice(1).map((l, i) => (
        <text key={i} x={x + 10} y={y + 30 + i * 14} fill={color.tx} fontSize={9} opacity={0.8}>
          {l}
        </text>
      ))}
    </g>
  );
}

function TableBox({ x, y, w, headers, rows, color }: {
  x: number; y: number; w: number;
  headers: string[];
  rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const rowH = 22;
  const h = 28 + rows.length * rowH + 4;
  const colW = w / headers.length;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#fff" stroke={color.bd} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={26} rx={10} fill={color.bd} />
      <rect x={x} y={y + 16} width={w} height={10} fill={color.bd} />
      {headers.map((hd, i) => (
        <text key={i} x={x + i * colW + colW / 2} y={y + 17} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>{hd}</text>
      ))}
      {rows.map((row, ri) => (
        <g key={ri}>
          {ri > 0 && <line x1={x + 4} y1={y + 28 + ri * rowH} x2={x + w - 4} y2={y + 28 + ri * rowH} stroke={color.bd} strokeWidth={0.5} opacity={0.3} />}
          {row.map((cell, ci) => (
            <text key={ci} x={x + ci * colW + colW / 2} y={y + 28 + ri * rowH + 15} textAnchor="middle" fill={color.tx} fontSize={9.5}>{cell}</text>
          ))}
        </g>
      ))}
    </g>
  );
}

function FormulaBox({ x, y, w, h, formula, note, color }: {
  x: number; y: number; w: number; h: number;
  formula: string; note?: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={color.bg} stroke={color.bd} strokeWidth={2} />
      <text x={x + w / 2} y={y + h / 2 - (note ? 4 : 0)} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>{formula}</text>
      {note && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={9} opacity={0.7}>{note}</text>}
    </g>
  );
}

// =====================================================================
// MAIN SVG COMPONENT
// =====================================================================
export function DomesticFlushingPumpCalcSVG() {
  // Y-cursor — everything flows downward from here
  let Y = 20;

  // ═══════════════════════════════════════════════════
  // TITLE
  // ═══════════════════════════════════════════════════
  const titleY = Y;
  Y += 90;

  // ═══════════════════════════════════════════════════
  // PHASE 1 — PROJECT DATA & CAPACITY
  // ═══════════════════════════════════════════════════
  const p1Y = Y;
  Y += 48;

  // Step 1: Entry
  const entryY = Y; Y += BH + 20;

  // Step 2: Strategy Diamond
  const stratDiaY = Y + 38; Y += 80;

  // 3 strategy columns
  const stratColY = Y; Y += 90;

  // Merge
  const stratMergeY = Y; Y += 60 + 18;

  // Step 3: Capacity Diamond
  const capDiaY = Y + 38; Y += 80;

  // 3 capacity columns
  const capColY = Y; Y += 200;

  // Merge
  const capMergeY = Y; Y += 56 + 18;

  // Q output
  const qOutY = Y; Y += BH + 20;

  const p1H = Y - p1Y - 8;

  // ═══════════════════════════════════════════════════
  // PHASE 2 — TDH CALCULATIONS
  // ═══════════════════════════════════════════════════
  const p2Y = Y;
  Y += 48;

  // Step A: Static Head
  const stepAY = Y; Y += BH + 16;
  const formulaAY = Y; Y += 60 + 16;

  // Step B: Friction
  const stepBY = Y; Y += BH + 16;
  const diaMatY = Y + 32; Y += 68;
  const formulaBY = Y; Y += 120;

  // Step C: Minor losses
  const stepCY = Y; Y += BH + 16;
  const formulaCY = Y; Y += 60 + 16;

  // Step D: Residual
  const stepDY = Y; Y += BH + 16;
  const tableDY = Y; Y += 120;

  // TDH big formula
  const tdhFormulaY = Y; Y += 74 + 16;
  // TDH output
  const tdhOutY = Y; Y += BH + 20;

  const p2H = Y - p2Y - 8;

  // ═══════════════════════════════════════════════════
  // PHASE 3 — SELECTION & OUTPUT
  // ═══════════════════════════════════════════════════
  const p3Y = Y;
  Y += 48;

  // Config diamond
  const cfgDiaY = Y + 38; Y += 80;
  // 3 config columns
  const cfgColY = Y; Y += 160;
  // Merge
  const cfgMergeY = Y; Y += 56 + 18;

  // Steps 5-6-7 linear
  const step5Y = Y; Y += BH + 16;
  const step6Y = Y; Y += BH + 16;
  const step7Y = Y; Y += BH + 20;

  // Output table
  const outTblY = Y; Y += 170;

  // Done
  const doneY = Y; Y += 64;

  const p3H = Y - p3Y - 8;
  const totalH = Y + 30;

  // Column centers for fan-out/in
  const LC = COL_LX + COL_W / 2;
  const MC = COL_MX + COL_W / 2;
  const RC = COL_RX + COL_W / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${totalH}`} preserveAspectRatio="xMidYMin meet"
      style={{ display: "block" }} className="dfp-calc-svg stage-chart-svg">
      <defs>
        <marker id="dfp-arrow" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <linearGradient id="dfp-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* White background */}
      <rect width={W} height={totalH} fill="#ffffff" rx={20} />

      {/* ══════════ TITLE ══════════ */}
      <rect x={CX - 380} y={titleY} width={760} height={72} rx={20} fill="url(#dfp-title-grad)" />
      <text x={CX} y={titleY + 30} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800}>
        Domestic & Flushing Pump Calculations
      </text>
      <text x={CX} y={titleY + 52} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.85}>
        Flow Rate (Q) + Total Dynamic Head (TDH) + Pump Selection & Infrastructure Outputs
      </text>

      {/* ══════════ PHASE 1 ══════════ */}
      <PhaseBand y={p1Y} h={p1H} label="PHASE 1 — PROJECT DATA & CAPACITY INPUTS" color={C.blue.bd} icon="📋" />

      {/* Step 1: Entry */}
      <StepBadge x={BX - 28} y={entryY + BH / 2} num={1} color={C.blue.bd} />
      <Box x={BX} y={entryY} w={BW} h={BH}
        label="Project Data Entry"
        sub="Building type, height, floor count, population, water demand"
        color={C.blue} badge="INPUT" />
      <NoteBox x={NOTE_X} y={entryY} w={NOTE_W} h={64}
        text={["📥 Input Sources:", "• Architect drawings → Floor count & heights", "• Water demand calc (P3A) → Tank volumes", "• Fire system type → Pump category"]}
        color={C.slate} />

      <VArrow y1={entryY + BH} y2={stratDiaY - 38} />

      {/* Step 2: Strategy Diamond */}
      <StepBadge x={BX - 28} y={stratDiaY} num={2} color={C.orange.bd} />
      <Diamond cx={CX} cy={stratDiaY} w={440} h={70}
        label="System Strategy Selection"
        sub="Choose pumping strategy based on building height & zoning"
        color={C.amber} />

      {/* Fan-out to 3 strategies */}
      <FanArrow x1={CX} y1={stratDiaY + 35} x2={LC} y2={stratColY} label="Type 1" />
      <VArrow y1={stratDiaY + 35} y2={stratColY} />
      <FanArrow x1={CX} y1={stratDiaY + 35} x2={RC} y2={stratColY} label="Type 3" />

      {/* 3 Strategy boxes */}
      <Box x={COL_LX} y={stratColY} w={COL_W} h={76}
        label="Gravity System"
        sub="Pressure from elevation difference only. Simplest — no active pressure control."
        color={C.green} badge="OPTION" />
      <Box x={COL_MX} y={stratColY} w={COL_W} h={76}
        label="PRV (Pressure Reducing Valve)"
        sub="One high-pressure pump with PRVs reducing pressure at lower floors."
        color={C.purple} badge="OPTION" />
      <Box x={COL_RX} y={stratColY} w={COL_W} h={76}
        label="MSMO (Multi-Stage Multi-Outlet)"
        sub="Specialized pumps with multiple outlets for different pressure zones."
        color={C.cyan} badge="OPTION" />

      {/* Fan-in */}
      <FanArrow x1={LC} y1={stratColY + 76} x2={CX} y2={stratMergeY} />
      <VArrow y1={stratColY + 76} y2={stratMergeY} />
      <FanArrow x1={RC} y1={stratColY + 76} x2={CX} y2={stratMergeY} />

      {/* Strategy Merge */}
      <Box x={CX - 200} y={stratMergeY} w={400} h={50}
        label="Strategy Selected → Proceed to Q Calculation"
        sub="System type determines pump sizing approach"
        color={C.teal} />

      <VArrow y1={stratMergeY + 50} y2={capDiaY - 38} />

      {/* Step 3: Capacity Diamond */}
      <StepBadge x={BX - 28} y={capDiaY} num={3} color={C.blue.bd} />
      <Diamond cx={CX} cy={capDiaY} w={400} h={70}
        label="Pump Category"
        sub="Which system is this pump serving?"
        color={C.amber} />

      {/* Fan-out to 3 capacity branches */}
      <FanArrow x1={CX} y1={capDiaY + 35} x2={LC} y2={capColY} label="Fire" color={C.fire.bd} />
      <VArrow y1={capDiaY + 35} y2={capColY} color={C.blue.bd} />
      <FanArrow x1={CX} y1={capDiaY + 35} x2={RC} y2={capColY} label="Sump" color={C.purple.bd} />

      {/* Fire branch */}
      <Box x={COL_LX} y={capColY} w={COL_W} h={64}
        label="Fire System Sizing"
        sub="Based on hazard class (Ordinary / High)"
        color={C.fire} badge="FIRE" />
      <TableBox x={COL_LX + 10} y={capColY + 74} w={COL_W - 20}
        headers={["Pump Type", "Flow (LPM)"]}
        rows={[["Main Pump", "2850"], ["Booster", "900"], ["Jockey", "180"]]}
        color={C.fire} />

      {/* Domestic/Transfer branch */}
      <Box x={COL_MX} y={capColY} w={COL_W} h={64}
        label="Domestic / Transfer"
        sub="Tank volume ÷ Filling time"
        color={C.blue} badge="DOMESTIC" />
      <FormulaBox x={COL_MX + 10} y={capColY + 74} w={COL_W - 20} h={55}
        formula="Q = V / t"
        note="e.g. 26 m³ ÷ 120 min = 13 m³/hr"
        color={C.blue} />
      <NoteBox x={COL_MX + 10} y={capColY + 138} w={COL_W - 20} h={42}
        text={["💡 V = tank capacity from P3A", "   t = filling time (design parameter)"]}
        color={C.slate} />

      {/* Sump branch */}
      <Box x={COL_RX} y={capColY} w={COL_W} h={64}
        label="Sump Pump Sizing"
        sub="Worst-case of sprinkler burst vs tank drain"
        color={C.purple} badge="SUMP" />
      <NoteBox x={COL_RX + 10} y={capColY + 74} w={COL_W - 20} h={80}
        text={[
          "📐 Worst-case logic:",
          "  Case A: Sprinkler burst inflow ≈ 17 Lps",
          "  Case B: Tank drain in 10 hrs",
          "  Q_sump = max(Case A, Case B)",
        ]}
        color={C.purple} />

      {/* Fan-in */}
      <FanArrow x1={LC} y1={capColY + 190} x2={CX} y2={capMergeY} />
      <VArrow y1={capColY + 190} y2={capMergeY} />
      <FanArrow x1={RC} y1={capColY + 190} x2={CX} y2={capMergeY} />

      {/* Capacity Merge */}
      <Box x={CX - 200} y={capMergeY} w={400} h={48}
        label="Flow Rate (Q) Determined"
        sub="All pump categories → individual Q values locked"
        color={C.teal} />

      <VArrow y1={capMergeY + 48} y2={qOutY} />

      {/* Q Output */}
      <Box x={BX} y={qOutY} w={BW} h={BH}
        label="📊 Phase 1 Output: Flow Rate Q (m³/hr or LPM)"
        sub="Feeds into Phase 2 for TDH calculation"
        color={C.green} badge="OUTPUT" />


      {/* ══════════ PHASE 2 ══════════ */}
      <PhaseBand y={p2Y} h={p2H} label="PHASE 2 — HYDRAULIC HEAD (TDH) CALCULATIONS" color={C.orange.bd} icon="🔧" />

      <VArrow y1={qOutY + BH} y2={stepAY} />

      {/* Step A */}
      <StepBadge x={BX - 28} y={stepAY + BH / 2} num="A" color={C.orange.bd} />
      <Box x={BX} y={stepAY} w={BW} h={BH}
        label="Step A: Static Head (Hs)"
        sub="Vertical height difference: pump centerline → highest discharge point"
        color={C.blue} badge="HEAD" />
      <NoteBox x={NOTE_X} y={stepAY + 4} w={NOTE_W} h={52}
        text={["📐 Static head = elevation difference", "   between pump and highest outlet"]}
        color={C.slate} />

      <VArrow y1={stepAY + BH} y2={formulaAY} />

      <FormulaBox x={CX - 230} y={formulaAY} w={460} h={52}
        formula="Head (bar) = Height (m) / 10.2"
        note="Converts vertical distance to pressure equivalent"
        color={C.amber} />

      <VArrow y1={formulaAY + 52} y2={stepBY} />

      {/* Step B */}
      <StepBadge x={BX - 28} y={stepBY + BH / 2} num="B" color={C.orange.bd} />
      <Box x={BX} y={stepBY} w={BW} h={BH}
        label="Step B: Frictional Loss (Hf)"
        sub="Based on pipe material & diameter — Hazen-Williams method"
        color={C.blue} badge="HEAD" />

      <VArrow y1={stepBY + BH} y2={diaMatY - 32} />

      <Diamond cx={CX} cy={diaMatY} w={360} h={58}
        label="Pipe Material?"
        sub="Steel / Copper / PVC / GI"
        color={C.amber} />

      <VArrow y1={diaMatY + 29} y2={formulaBY} />

      {/* Friction formula + side table */}
      <FormulaBox x={BX} y={formulaBY} w={360} h={52}
        formula="4 ft loss per 100 ft pipe length"
        note="Hazen-Williams C factor per material"
        color={C.amber} />
      <TableBox x={BX + 380} y={formulaBY} w={380}
        headers={["Material", "C Factor", "Typical Use"]}
        rows={[
          ["Steel", "120", "Fire mains"],
          ["Copper", "140", "Domestic hot"],
          ["PVC/CPVC", "150", "Cold supply"],
          ["GI Pipe", "100", "Legacy systems"],
        ]}
        color={C.cyan} />

      <VArrow y1={formulaBY + 52} y2={stepCY} />

      {/* Step C */}
      <StepBadge x={BX - 28} y={stepCY + BH / 2} num="C" color={C.orange.bd} />
      <Box x={BX} y={stepCY} w={BW} h={BH}
        label="Step C: Fitting / Minor Losses (Hm)"
        sub="Resistance from elbows, tees, valves — simplified method"
        color={C.blue} badge="HEAD" />
      <NoteBox x={NOTE_X} y={stepCY + 2} w={NOTE_W} h={56}
        text={["💡 Equivalent Length Method:", "  Each fitting = equiv. pipe length", "  Elbows, tees, gate/check valves"]}
        color={C.slate} />

      <VArrow y1={stepCY + BH} y2={formulaCY} />

      <FormulaBox x={CX - 230} y={formulaCY} w={460} h={52}
        formula="Hm = 0.30 × Hf  (30% of pipe friction)"
        note="Simplified: 30% multiplier of total frictional loss"
        color={C.amber} />

      <VArrow y1={formulaCY + 52} y2={stepDY} />

      {/* Step D */}
      <StepBadge x={BX - 28} y={stepDY + BH / 2} num="D" color={C.orange.bd} />
      <Box x={BX} y={stepDY} w={BW} h={BH}
        label="Step D: Residual Pressure (Hr)"
        sub='Leftover pressure needed at fixture for proper operation'
        color={C.blue} badge="HEAD" />

      <VArrow y1={stepDY + BH} y2={tableDY} />

      <TableBox x={CX - 240} y={tableDY} w={480}
        headers={["Fixture Type", "Required Pressure", "Reference"]}
        rows={[
          ["Fire Hydrant", "3.5 bar", "IS 15105"],
          ["Domestic Tap", "0.5 bar", "NBC 2016"],
          ["Flushing Valve", "1.0 bar", "IS 2065"],
          ["Shower / Basin", "0.7 bar", "IS 2065"],
        ]}
        color={C.cyan} />

      <VArrow y1={tableDY + 118} y2={tdhFormulaY} />

      {/* TDH Formula — prominent */}
      <rect x={CX - 320} y={tdhFormulaY} width={640} height={68} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
      <text x={CX} y={tdhFormulaY + 28} textAnchor="middle" fill={C.green.tx} fontSize={20} fontWeight={800}>
        TDH = Hs + Hf + Hm + Hr
      </text>
      <text x={CX} y={tdhFormulaY + 50} textAnchor="middle" fill={C.green.tx} fontSize={11} opacity={0.8}>
        Total Dynamic Head = Static + Friction + Minor Losses + Residual Pressure
      </text>

      <VArrow y1={tdhFormulaY + 68} y2={tdhOutY} color={C.green.bd} />

      <Box x={BX} y={tdhOutY} w={BW} h={BH}
        label="📊 Phase 2 Output: TDH (meters or bar)"
        sub="Combined with Q from Phase 1 → Duty Point for pump selection"
        color={C.green} badge="OUTPUT" />


      {/* ══════════ PHASE 3 ══════════ */}
      <PhaseBand y={p3Y} h={p3H} label="PHASE 3 — PUMP SELECTION & INFRASTRUCTURE OUTPUT" color={C.green.bd} icon="✅" />

      <VArrow y1={tdhOutY + BH} y2={cfgDiaY - 38} color={C.green.bd} />

      <StepBadge x={BX - 28} y={cfgDiaY} num={4} color={C.green.bd} />
      <Diamond cx={CX} cy={cfgDiaY} w={420} h={70}
        label="Pump Configuration"
        sub="Select duty/standby arrangement per system type"
        color={C.amber} />

      {/* Fan-out */}
      <FanArrow x1={CX} y1={cfgDiaY + 35} x2={LC} y2={cfgColY} label="Fire" color={C.fire.bd} />
      <VArrow y1={cfgDiaY + 35} y2={cfgColY} color={C.blue.bd} />
      <FanArrow x1={CX} y1={cfgDiaY + 35} x2={RC} y2={cfgColY} label="Sump" color={C.purple.bd} />

      {/* Fire config */}
      <Box x={COL_LX} y={cfgColY} w={COL_W} h={56}
        label="Fire Pump Set"
        sub="1 Electric Main + 1 Diesel Standby + 1 Jockey"
        color={C.fire} badge="CONFIG" />
      <NoteBox x={COL_LX + 10} y={cfgColY + 66} w={COL_W - 20} h={72}
        text={["🔥 Fire Configuration:", "  • Main: Electric motor-driven", "  • Standby: Diesel engine-driven", "  • Jockey: Maintains line pressure"]}
        color={C.fire} />

      {/* Domestic config */}
      <Box x={COL_MX} y={cfgColY} w={COL_W} h={56}
        label="Domestic Pump Set"
        sub="1 Working + 1 Standby (Duty sharing)"
        color={C.blue} badge="CONFIG" />
      <NoteBox x={COL_MX + 10} y={cfgColY + 66} w={COL_W - 20} h={72}
        text={["💧 Domestic Configuration:", "  • Duty pump: Primary operation", "  • Standby: Auto-switchover", "  • Optional VFD for efficiency"]}
        color={C.cyan} />

      {/* Sump config */}
      <Box x={COL_RX} y={cfgColY} w={COL_W} h={56}
        label="Sump Pump Set"
        sub="Multiple small pumps (e.g. 3 Nos) — duty sharing"
        color={C.purple} badge="CONFIG" />
      <NoteBox x={COL_RX + 10} y={cfgColY + 66} w={COL_W - 20} h={72}
        text={["🔧 Sump Configuration:", "  • 3 pumps for redundancy", "  • Auto-level float switch", "  • Handles peak burst inflows"]}
        color={C.purple} />

      {/* Fan-in */}
      <FanArrow x1={LC} y1={cfgColY + 148} x2={CX} y2={cfgMergeY} />
      <VArrow y1={cfgColY + 148} y2={cfgMergeY} />
      <FanArrow x1={RC} y1={cfgColY + 148} x2={CX} y2={cfgMergeY} />

      <Box x={CX - 200} y={cfgMergeY} w={400} h={48}
        label="Pump Configuration Locked"
        sub="All systems → config + count finalized"
        color={C.teal} />

      <VArrow y1={cfgMergeY + 48} y2={step5Y} />

      {/* Step 5: Header */}
      <StepBadge x={BX - 28} y={step5Y + BH / 2} num={5} color={C.green.bd} />
      <Box x={BX} y={step5Y} w={BW} h={BH}
        label="Header Size Determination"
        sub="Pipe diameter to keep velocity within safe limits (V ≤ 3.0 m/s)"
        color={C.cyan} badge="INFRA" />
      <NoteBox x={NOTE_X} y={step5Y + 4} w={NOTE_W} h={52}
        text={["📐 V = Q / A → Select diameter", "   where V ≤ 3.0 m/s for domestic mains"]}
        color={C.slate} />

      <VArrow y1={step5Y + BH} y2={step6Y} />

      {/* Step 6: Power */}
      <StepBadge x={BX - 28} y={step6Y + BH / 2} num={6} color={C.green.bd} />
      <Box x={BX} y={step6Y} w={BW} h={BH}
        label="Power Requirement (kW / HP)"
        sub="Motor sizing based on duty point (Q @ H)"
        color={C.cyan} badge="INFRA" />
      <FormulaBox x={NOTE_X} y={step6Y + 4} w={NOTE_W} h={52}
        formula="P = (ρ × g × Q × H) / (η × 1000)"
        note="η = pump efficiency (typically 60–75%)"
        color={C.amber} />

      <VArrow y1={step6Y + BH} y2={step7Y} />

      {/* Step 7: Tank */}
      <StepBadge x={BX - 28} y={step7Y + BH / 2} num={7} color={C.green.bd} />
      <Box x={BX} y={step7Y} w={BW} h={BH}
        label="Sump / Tank Volume & Dimensions"
        sub="Finalizing L × W × D of pits and tanks"
        color={C.cyan} badge="INFRA" />
      <NoteBox x={NOTE_X} y={step7Y + 4} w={NOTE_W} h={52}
        text={["📐 Volume from Water Demand (P3A)", "   Dimensions for pump room layout"]}
        color={C.slate} />

      <VArrow y1={step7Y + BH} y2={outTblY} />

      {/* Output Summary Table */}
      <rect x={CX - 460} y={outTblY - 6} width={920} height={162} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={outTblY + 18} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={800}>
        📋 Final Pump Schedule — Summary Output
      </text>
      <TableBox x={CX - 430} y={outTblY + 28} w={860}
        headers={["Parameter", "Domestic", "Flushing", "Sump", "Fire Main"]}
        rows={[
          ["Flow Rate Q", "13 m³/hr", "8 m³/hr", "17 Lps", "2850 LPM"],
          ["TDH (H)", "45 m", "42 m", "15 m", "65 m"],
          ["Motor Power", "5.5 kW", "3.7 kW", "2.2 kW", "37 kW"],
          ["No. of Pumps", "1W + 1S", "1W + 1S", "3 Nos", "1E + 1D + 1J"],
          ["Header Size", "65 mm", "50 mm", "80 mm", "150 mm"],
        ]}
        color={C.green} />

      <VArrow y1={outTblY + 158} y2={doneY} color={C.green.bd} />

      {/* DONE */}
      <rect x={CX - 240} y={doneY} width={480} height={56} rx={28}
        fill={C.green.bd} stroke="#34d399" strokeWidth={2.5} />
      <text x={CX} y={doneY + 24} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        🏁 Domestic & Flushing Pump Calc — COMPLETE
      </text>
      <text x={CX} y={doneY + 42} textAnchor="middle" fill="#fff" fontSize={10} opacity={0.85}>
        Results feed → Space Matrix + Electrical Load Sheet + BOQ
      </text>
    </svg>
  );
}
