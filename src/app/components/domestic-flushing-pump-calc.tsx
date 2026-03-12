import React from "react";

// =====================================================================
// PUMP HEAD & FLOW RATE CALCULATION LOGIC — Custom SVG Flow Diagram
// Phase 1: Input & Data Gathering
// Phase 2: Flow Rate (Q) Calculation
// Phase 3: Head (H) & Pressure Loss Analysis
// Phase 4: Final Output & Pump Sizing
// =====================================================================

const W = 1560;
const CX = W / 2;

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

const BW = 520;
const BH = 64;
const BX = CX - BW / 2;
const AG = 48;
const NOTE_W = 310;
const NOTE_X = BX + BW + 30;

// ── Four-column layout for branching ──
const COL_W4 = 280;
const COL_GAP4 = 20;
const TOTAL_4COL = COL_W4 * 4 + COL_GAP4 * 3;
const COL4_1X = CX - TOTAL_4COL / 2;
const COL4_2X = COL4_1X + COL_W4 + COL_GAP4;
const COL4_3X = COL4_2X + COL_W4 + COL_GAP4;
const COL4_4X = COL4_3X + COL_W4 + COL_GAP4;

// ── Three-column layout (for phase 3 notes) ──
const COL_W = 340;
const COL_GAP = 30;

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
  const my = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`}
        fill="none" stroke={cl} strokeWidth={2} markerEnd="url(#dfp-arrow)" />
      {label && (
        <>
          <rect x={x2 - 36} y={y2 - 22} width={72} height={18} rx={9} fill="#fff" stroke={cl} strokeWidth={1} />
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
  let Y = 20;

  // ═══ TITLE ═══
  const titleY = Y; Y += 90;

  // ═══ PHASE 1 — INPUT & DATA GATHERING ═══
  const p1Y = Y; Y += 48;
  const startY = Y; Y += BH + AG;       // Start node
  const inputAY = Y; Y += BH + AG;      // Input A: Building Height
  const inputBY = Y; Y += BH + AG;      // Input B: Tank Locations
  const inputCY = Y; Y += BH + AG;      // Input C: System Type
  const p1H = Y - p1Y - 8;

  // ═══ PHASE 2 — FLOW RATE (Q) CALCULATION ═══
  const p2Y = Y; Y += 48;
  const decDiaY = Y + 38; Y += 80 + 6;  // Decision diamond
  const pathColY = Y; Y += 140 + AG;    // 4 path columns
  const pathMergeY = Y; Y += 56 + AG;   // Merge
  const qOutY = Y; Y += BH + AG;        // Q output
  const p2H = Y - p2Y - 8;

  // ═══ PHASE 3 — HEAD (H) & PRESSURE LOSS ANALYSIS ═══
  const p3Y = Y; Y += 48;
  const step1Y = Y; Y += BH + AG;       // Static Head
  const formula1Y = Y; Y += 60 + AG;    // formula
  const step2Y = Y; Y += BH + AG;       // Friction Loss
  const formula2Y = Y; Y += 60 + AG;    // formula
  const step3Y = Y; Y += BH + AG;       // Fitting Losses
  const formula3Y = Y; Y += 60 + AG;    // formula
  const step4Y = Y; Y += BH + AG;       // Residual Pressure
  const table4Y = Y; Y += 120 + AG;     // table
  const p3H = Y - p3Y - 8;

  // ═══ PHASE 4 — FINAL OUTPUT & PUMP SIZING ═══
  const p4Y = Y; Y += 48;
  const tdhFormulaY = Y; Y += 74 + AG;  // TDH formula
  const out1Y = Y; Y += BH + AG;        // Output 1: Duty Point
  const out2Y = Y; Y += BH + AG;        // Output 2: Standby
  const out3Y = Y; Y += BH + AG;        // Output 3: Jockey
  const outTblY = Y; Y += 170 + AG;     // Final schedule table
  const doneY = Y; Y += 64;
  const p4H = Y - p4Y - 8;

  const totalH = Y + 30;

  // Column centers for 4-way fan-out
  const C1 = COL4_1X + COL_W4 / 2;
  const C2 = COL4_2X + COL_W4 / 2;
  const C3 = COL4_3X + COL_W4 / 2;
  const C4 = COL4_4X + COL_W4 / 2;

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

      <rect width={W} height={totalH} fill="#ffffff" rx={20} />

      {/* ══════════ TITLE ══════════ */}
      <rect x={CX - 400} y={titleY} width={800} height={72} rx={20} fill="url(#dfp-title-grad)" />
      <text x={CX} y={titleY + 30} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800}>
        Pump Head & Flow Rate Calculation Logic
      </text>
      <text x={CX} y={titleY + 52} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.85}>
        Input & Data Gathering {"→"} Flow Rate (Q) {"→"} Head & Pressure Loss {"→"} Final Pump Sizing
      </text>


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 1 — INPUT & DATA GATHERING
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p1Y} h={p1H} label="PHASE 1 — INPUT & DATA GATHERING" color={C.blue.bd} icon="📋" />

      {/* Start Node */}
      <Box x={BX} y={startY} w={BW} h={BH}
        label="Project Architectural & Plumbing Data"
        sub="Starting point — gather all project-level input data"
        color={C.blue} badge="START" />
      <NoteBox x={NOTE_X} y={startY + 2} w={NOTE_W} h={56}
        text={["📥 Data Sources:", "  • Architectural drawings", "  • Plumbing design briefs", "  • Project specifications"]}
        color={C.slate} />

      <VArrow y1={startY + BH} y2={inputAY} />

      {/* Input A */}
      <Box x={BX} y={inputAY} w={BW} h={BH}
        label="Building Height & Number of Floors"
        sub="Referencing floor-to-floor height from architect drawings"
        color={C.blue} badge="INPUT" />
      <NoteBox x={NOTE_X} y={inputAY + 2} w={NOTE_W} h={48}
        text={["🏢 Floor Data:", "  Floor-to-floor height, total floors", "  Basement / podium / typical counts"]}
        color={C.slate} />

      <VArrow y1={inputAY + BH} y2={inputBY} />

      {/* Input B */}
      <Box x={BX} y={inputBY} w={BW} h={BH}
        label="Tank Locations"
        sub="UGT Level vs. OHT / Terrace Level — elevation reference points"
        color={C.blue} badge="INPUT" />
      <NoteBox x={NOTE_X} y={inputBY + 2} w={NOTE_W} h={48}
        text={["📐 Tank Elevations:", "  UGT depth below ground", "  OHT / Terrace tank level above datum"]}
        color={C.slate} />

      <VArrow y1={inputBY + BH} y2={inputCY} />

      {/* Input C */}
      <Box x={BX} y={inputCY} w={BW} h={BH}
        label="System Type Selection"
        sub="Domestic, Fire, Irrigation, or STP — determines Q calculation path"
        color={C.orange} badge="INPUT" />
      <NoteBox x={NOTE_X} y={inputCY + 2} w={NOTE_W} h={56}
        text={["⚙️ System Types:", "  • Domestic / Grey Water", "  • Fire System (NFPA)", "  • Irrigation / Landscape", "  • Sump / Drainage"]}
        color={C.amber} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 2 — FLOW RATE (Q) CALCULATION
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p2Y} h={p2H} label="PHASE 2 — FLOW RATE (Q) CALCULATION" color={C.orange.bd} icon="💧" />

      <VArrow y1={inputCY + BH} y2={decDiaY - 38} />

      {/* Decision Diamond */}
      <Diamond cx={CX} cy={decDiaY} w={480} h={70}
        label="Calculate Demand Based on System Type"
        sub="Route to appropriate flow rate calculation method"
        color={C.amber} />

      {/* Fan-out to 4 paths */}
      <FanArrow x1={CX} y1={decDiaY + 35} x2={C1} y2={pathColY} label="Domestic" color={C.blue.bd} />
      <FanArrow x1={CX} y1={decDiaY + 35} x2={C2} y2={pathColY} label="Fire" color={C.fire.bd} />
      <FanArrow x1={CX} y1={decDiaY + 35} x2={C3} y2={pathColY} label="Irrigation" color={C.green.bd} />
      <FanArrow x1={CX} y1={decDiaY + 35} x2={C4} y2={pathColY} label="Sump" color={C.purple.bd} />

      {/* Path 1: Domestic/Grey Water */}
      <Box x={COL4_1X} y={pathColY} w={COL_W4} h={64}
        label="Domestic / Grey Water"
        sub="Tank Volume ÷ Filling Time"
        color={C.blue} badge="PATH 1" />
      <FormulaBox x={COL4_1X + 5} y={pathColY + 72} w={COL_W4 - 10} h={52}
        formula="Q = V / t"
        note="Standard filling time = 120 minutes"
        color={C.blue} />

      {/* Path 2: Fire System */}
      <Box x={COL4_2X} y={pathColY} w={COL_W4} h={64}
        label="Fire System"
        sub="Per NFPA Standards"
        color={C.fire} badge="PATH 2" />
      <NoteBox x={COL4_2X + 5} y={pathColY + 72} w={COL_W4 - 10} h={52}
        text={["🔥 Fire Flow Rates:", "  Main Pump: 2850 LPM", "  Jockey Pump: 180 LPM"]}
        color={C.fire} />

      {/* Path 3: Irrigation */}
      <Box x={COL4_3X} y={pathColY} w={COL_W4} h={64}
        label="Irrigation / Landscape"
        sub="Area-based demand calculation"
        color={C.green} badge="PATH 3" />
      <FormulaBox x={COL4_3X + 5} y={pathColY + 72} w={COL_W4 - 10} h={52}
        formula="Q = Area × 5 L/m² ÷ t"
        note="Irrigation window: 1-2 hours"
        color={C.green} />

      {/* Path 4: Sump/Drainage */}
      <Box x={COL4_4X} y={pathColY} w={COL_W4} h={64}
        label="Sump / Drainage"
        sub="Worst-case inflow analysis"
        color={C.purple} badge="PATH 4" />
      <NoteBox x={COL4_4X + 5} y={pathColY + 72} w={COL_W4 - 10} h={52}
        text={["📐 Sump Logic:", "  Inflow: Sprinkler burst / seepage", "  vs. Sump holding volume"]}
        color={C.purple} />

      {/* Fan-in */}
      <FanArrow x1={C1} y1={pathColY + 130} x2={CX} y2={pathMergeY} />
      <FanArrow x1={C2} y1={pathColY + 130} x2={CX} y2={pathMergeY} />
      <FanArrow x1={C3} y1={pathColY + 130} x2={CX} y2={pathMergeY} />
      <FanArrow x1={C4} y1={pathColY + 130} x2={CX} y2={pathMergeY} />

      <Box x={CX - 200} y={pathMergeY} w={400} h={48}
        label="Flow Rate (Q) Determined"
        sub="System-specific Q values locked — proceed to head calculation"
        color={C.teal} />

      <VArrow y1={pathMergeY + 48} y2={qOutY} />

      <Box x={BX} y={qOutY} w={BW} h={BH}
        label="Phase 2 Output: Flow Rate Q (m³/hr or LPM)"
        sub="Feeds into Phase 3 for TDH calculation"
        color={C.green} badge="OUTPUT" />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 3 — HEAD (H) & PRESSURE LOSS ANALYSIS
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p3Y} h={p3H} label="PHASE 3 — HEAD (H) & PRESSURE LOSS ANALYSIS" color={C.orange.bd} icon="🔧" />

      <VArrow y1={qOutY + BH} y2={step1Y} />

      {/* Step 1: Static Head */}
      <Box x={BX} y={step1Y} w={BW} h={BH}
        label="Static Head (Hs)"
        sub="Vertical height difference: Pump Centerline → Highest Discharge Point"
        color={C.blue} badge="HEAD" />
      <NoteBox x={NOTE_X} y={step1Y + 2} w={NOTE_W} h={56}
        text={["📐 Static Head:", "  Vertical distance between pump", "  centerline and highest outlet", "  Convert meters → bar ÷ 10.2"]}
        color={C.slate} />

      <VArrow y1={step1Y + BH} y2={formula1Y} />

      <FormulaBox x={CX - 240} y={formula1Y} w={480} h={52}
        formula="Hs (bar) = Height (m) / 10.2"
        note="Converts vertical distance to pressure equivalent"
        color={C.amber} />

      <VArrow y1={formula1Y + 52} y2={step2Y} />

      {/* Step 2: Friction Loss */}
      <Box x={BX} y={step2Y} w={BW} h={BH}
        label="Friction Loss — Pipes (Hf)"
        sub="Apply loss factor (4 ft per 100 ft run) to vertical & horizontal pipe lengths"
        color={C.blue} badge="HEAD" />
      <NoteBox x={NOTE_X} y={step2Y + 2} w={NOTE_W} h={56}
        text={["📏 Friction Calculation:", "  Hazen-Williams method", "  4 ft loss per 100 ft pipe run", "  Both vertical & horizontal lengths"]}
        color={C.slate} />

      <VArrow y1={step2Y + BH} y2={formula2Y} />

      <FormulaBox x={CX - 260} y={formula2Y} w={520} h={52}
        formula="Hf = (4 ft / 100 ft) × Total Pipe Length"
        note="Applied to both vertical risers and horizontal distribution"
        color={C.amber} />

      <VArrow y1={formula2Y + 52} y2={step3Y} />

      {/* Step 3: Fitting Losses */}
      <Box x={BX} y={step3Y} w={BW} h={BH}
        label="Fitting Losses (Hm)"
        sub="Add 30% safety factor to pipe friction for Valves, Bends & Tees"
        color={C.blue} badge="HEAD" />
      <NoteBox x={NOTE_X} y={step3Y + 2} w={NOTE_W} h={56}
        text={["💡 Equivalent Length Method:", "  Elbows, tees, gate/check valves", "  30% safety factor on Hf", "  Accounts for all minor losses"]}
        color={C.slate} />

      <VArrow y1={step3Y + BH} y2={formula3Y} />

      <FormulaBox x={CX - 240} y={formula3Y} w={480} h={52}
        formula="Hm = 0.30 × Hf  (30% of pipe friction)"
        note="Simplified: 30% multiplier of total frictional loss"
        color={C.amber} />

      <VArrow y1={formula3Y + 52} y2={step4Y} />

      {/* Step 4: Residual Pressure */}
      <Box x={BX} y={step4Y} w={BW} h={BH}
        label="Residual Pressure (Hr)"
        sub='Best practice requirement at the farthest/highest fixture'
        color={C.blue} badge="HEAD" />

      <VArrow y1={step4Y + BH} y2={table4Y} />

      <TableBox x={CX - 240} y={table4Y} w={480}
        headers={["System Type", "Required Pressure", "Reference"]}
        rows={[
          ["Domestic Tap", "1.0 Bar", "Best Practice"],
          ["Fire Hydrant", "3.5 Bar", "IS 15105 / NFPA"],
          ["Flushing Valve", "1.0 Bar", "IS 2065"],
          ["Shower / Basin", "0.7 Bar", "IS 2065"],
        ]}
        color={C.cyan} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 4 — FINAL OUTPUT & PUMP SIZING
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p4Y} h={p4H} label="PHASE 4 — FINAL OUTPUT & PUMP SIZING" color={C.green.bd} icon="✅" />

      <VArrow y1={table4Y + 118} y2={tdhFormulaY} />

      {/* TDH Formula — prominent */}
      <rect x={CX - 340} y={tdhFormulaY} width={680} height={68} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
      <text x={CX} y={tdhFormulaY + 28} textAnchor="middle" fill={C.green.tx} fontSize={20} fontWeight={800}>
        TDH = Static Head + Friction Loss + Fitting Loss + Residual Pressure
      </text>
      <text x={CX} y={tdhFormulaY + 50} textAnchor="middle" fill={C.green.tx} fontSize={11} opacity={0.8}>
        Total Dynamic Head = Hs + Hf + Hm + Hr
      </text>

      <VArrow y1={tdhFormulaY + 68} y2={out1Y} color={C.green.bd} />

      {/* Output 1: Main Pump Duty Point */}
      <Box x={BX} y={out1Y} w={BW} h={BH}
        label="Main Pump Duty Point"
        sub="Flow Rate (Q) in LPM @ Head (H) in Meters — defines pump selection"
        color={C.green} badge="OUTPUT" />
      <NoteBox x={NOTE_X} y={out1Y + 2} w={NOTE_W} h={48}
        text={["🎯 Duty Point:", "  Q (LPM) @ H (meters)", "  Plotted on manufacturer curve"]}
        color={C.green} />

      <VArrow y1={out1Y + BH} y2={out2Y} />

      {/* Output 2: Standby Pump */}
      <Box x={BX} y={out2Y} w={BW} h={BH}
        label="Standby Pump Requirement"
        sub="1 Working + 1 Standby configuration — auto-switchover on failure"
        color={C.cyan} badge="OUTPUT" />
      <NoteBox x={NOTE_X} y={out2Y + 2} w={NOTE_W} h={48}
        text={["🔄 Redundancy:", "  1W + 1S standard config", "  Auto-changeover on fault/alarm"]}
        color={C.cyan} />

      <VArrow y1={out2Y + BH} y2={out3Y} />

      {/* Output 3: Jockey Pump */}
      <Box x={BX} y={out3Y} w={BW} h={BH}
        label="Jockey Pump Specification"
        sub="Small pump to maintain system pressure during no-demand periods"
        color={C.cyan} badge="OUTPUT" />
      <NoteBox x={NOTE_X} y={out3Y + 2} w={NOTE_W} h={48}
        text={["⚡ Jockey Pump:", "  Maintains line pressure", "  Prevents main pump cycling"]}
        color={C.cyan} />

      <VArrow y1={out3Y + BH} y2={outTblY} />

      {/* Final Output Summary Table */}
      <rect x={CX - 460} y={outTblY - 6} width={920} height={162} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={outTblY + 18} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={800}>
        Final Pump Schedule for Procurement
      </text>
      <TableBox x={CX - 430} y={outTblY + 28} w={860}
        headers={["Parameter", "Domestic", "Fire Main", "Irrigation", "Sump"]}
        rows={[
          ["Flow Rate Q", "13 m³/hr", "2850 LPM", "5 m³/hr", "17 Lps"],
          ["TDH (H)", "45 m", "65 m", "30 m", "15 m"],
          ["Motor Power", "5.5 kW", "37 kW", "2.2 kW", "2.2 kW"],
          ["Configuration", "1W + 1S", "1E + 1D + 1J", "1W + 1S", "3 Nos"],
          ["Residual P", "1.0 Bar", "3.5 Bar", "1.0 Bar", "—"],
        ]}
        color={C.green} />

      <VArrow y1={outTblY + 158} y2={doneY} color={C.green.bd} />

      {/* DONE */}
      <rect x={CX - 260} y={doneY} width={520} height={56} rx={28}
        fill={C.green.bd} stroke="#34d399" strokeWidth={2.5} />
      <text x={CX} y={doneY + 24} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        Pump Head & Flow Rate Calculation — COMPLETE
      </text>
      <text x={CX} y={doneY + 42} textAnchor="middle" fill="#fff" fontSize={10} opacity={0.85}>
        Final Pump Schedule {"→"} Procurement + Electrical Load Sheet + Space Matrix
      </text>
    </svg>
  );
}
