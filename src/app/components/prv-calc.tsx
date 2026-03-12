import React from "react";

// =====================================================================
// PRV (Pressure Reducing Valve) CALCULATIONS — Custom SVG Flow Diagram
// Phase 1: Project & Structural Initialization
// Phase 2: Pressure Gradient Engine
// Phase 3: PRV Reset & Mapping
// Phase 4: Riser Sizing & WSFU Diversity
// Phase 5: Pipe Validation & Final BOM
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
  arrow:  "#94a3b8",
};

const BW = 520;
const BH = 64;
const BX = CX - BW / 2;
const AG = 34;
const NOTE_W = 310;
const NOTE_X = BX + BW + 30;

// ── Three-column layout for branching ──
const COL_W = 340;
const COL_GAP = 30;
const TOTAL_3COL = COL_W * 3 + COL_GAP * 2;
const COL_LX = CX - TOTAL_3COL / 2;
const COL_MX = COL_LX + COL_W + COL_GAP;
const COL_RX = COL_MX + COL_W + COL_GAP;

// =====================================================================
// REUSABLE SVG PRIMITIVES
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
  return <line x1={ax} y1={y1} x2={ax} y2={y2} stroke={c || C.arrow} strokeWidth={2} markerEnd="url(#prv-arrow)" />;
}

function FanArrow({ x1, y1, x2, y2, label, color: c }: {
  x1: number; y1: number; x2: number; y2: number; label?: string; color?: string;
}) {
  const cl = c || C.arrow;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <path d={`M${x1},${y1} L${x1},${my} L${x2},${my} L${x2},${y2}`}
        fill="none" stroke={cl} strokeWidth={2} markerEnd="url(#prv-arrow)" />
      {label && (
        <>
          <rect x={x2 - 32} y={y2 - 22} width={64} height={18} rx={9} fill="#fff" stroke={cl} strokeWidth={1} />
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

// =====================================================================
// MAIN SVG COMPONENT
// =====================================================================
export function PRVCalcSVG() {
  let Y = 20;

  // ═══ TITLE ═══
  const titleY = Y; Y += 90;

  // ═══ PHASE 1 — PROJECT & STRUCTURAL INITIALIZATION ═══
  const p1Y = Y; Y += 48;
  const s11Y = Y; Y += BH + AG;        // 1.1 Building Geometry
  const s12Y = Y; Y += BH + AG;        // 1.2 Vertical Mapping
  const s12OverrideY = Y; Y += 56 + AG; // Manual override note
  const s13Y = Y; Y += BH + AG;        // 1.3 Reference Levels
  const s14Y = Y; Y += BH + AG;        // 1.4 Design Constraints
  const p1H = Y - p1Y - 8;

  // ═══ PHASE 2 — PRESSURE GRADIENT ENGINE ═══
  const p2Y = Y; Y += 48;
  const s21Y = Y; Y += BH + AG;         // 2.1 Raw Head
  const s21FormulaY = Y; Y += 60 + AG;  // formula box
  const s22Y = Y; Y += BH + AG;         // 2.2 Correction Factor
  const s22DiaY = Y + 32; Y += 68 + AG; // decision diamond
  const s23Y = Y; Y += BH + AG;         // 2.3 Zone Logic Gate
  const s23BranchY = Y; Y += 100 + AG;  // 3 branch outcomes
  const s23MergeY = Y; Y += 56 + AG;    // merge
  const p2H = Y - p2Y - 8;

  // ═══ PHASE 3 — PRV RESET & MAPPING ═══
  const p3Y = Y; Y += 48;
  const s31Y = Y; Y += BH + AG;         // 3.1 PRV Station Placement
  const s32Y = Y; Y += BH + AG;         // 3.2 Pressure Reset Logic
  const s32FormulaY = Y; Y += 60 + AG;  // reset formula
  const s33Y = Y; Y += BH + AG;         // 3.3 PRV Schedule Output
  const s33TableY = Y; Y += 120 + AG;   // schedule table
  const p3H = Y - p3Y - 8;

  // ═══ PHASE 4 — RISER SIZING & WSFU DIVERSITY ═══
  const p4Y = Y; Y += 48;
  const s41Y = Y; Y += BH + AG;         // 4.1 Unit Mapping
  const s42Y = Y; Y += BH + AG;         // 4.2 WSFU Accumulation
  const s42TableY = Y; Y += 120 + AG;   // WSFU table
  const s43Y = Y; Y += BH + AG;         // 4.3 Hunter's Curve
  const s43FormulaY = Y; Y += 60 + AG;  // conversion
  const p4H = Y - p4Y - 8;

  // ═══ PHASE 5 — PIPE VALIDATION & FINAL BOM ═══
  const p5Y = Y; Y += 48;
  const s51Y = Y; Y += BH + AG;         // 5.1 Diameter Selection
  const s52Y = Y; Y += BH + AG;         // 5.2 Velocity & Friction Check
  const s52DiaY = Y + 32; Y += 68 + AG; // velocity check diamond
  const s53Y = Y; Y += BH + AG;         // 5.3 Output Generation
  const outTblY = Y; Y += 170 + AG;     // final output table
  const doneY = Y; Y += 64;
  const p5H = Y - p5Y - 8;

  const totalH = Y + 30;

  // Column centers
  const LC = COL_LX + COL_W / 2;
  const MC = COL_MX + COL_W / 2;
  const RC = COL_RX + COL_W / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${totalH}`} preserveAspectRatio="xMidYMin meet"
      style={{ display: "block" }} className="prv-calc-svg stage-chart-svg">
      <defs>
        <marker id="prv-arrow" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <linearGradient id="prv-title-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      <rect width={W} height={totalH} fill="#ffffff" rx={20} />

      {/* ══════════ TITLE ══════════ */}
      <rect x={CX - 400} y={titleY} width={800} height={72} rx={20} fill="url(#prv-title-grad)" />
      <text x={CX} y={titleY + 30} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800}>
        PRV (Pressure Reducing Valve) Calculations
      </text>
      <text x={CX} y={titleY + 52} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.85}>
        Building Geometry → Pressure Gradient → PRV Mapping → Riser Sizing → Pipe Validation & BOM
      </text>

      {/* ══════════════════════════════════════════════════════════════════
          PHASE 1 — PROJECT & STRUCTURAL INITIALIZATION
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p1Y} h={p1H} label="PHASE 1 — PROJECT & STRUCTURAL INITIALIZATION" color={C.blue.bd} icon="🏗️" />

      {/* 1.1 Building Geometry */}
      <Box x={BX} y={s11Y} w={BW} h={BH}
        label="Building Geometry"
        sub="Fetch Total Typ. Floors, Total Podiums & Building Name"
        color={C.blue} badge="DB" />
      <NoteBox x={NOTE_X} y={s11Y + 2} w={NOTE_W} h={56}
        text={["📥 Database Fetch:", "  • Total typical floors", "  • Total podium floors", "  • Building name / project ID"]}
        color={C.slate} />

      <VArrow y1={s11Y + BH} y2={s12Y} />

      {/* 1.2 Vertical Mapping */}
      <Box x={BX} y={s12Y} w={BW} h={BH}
        label="Vertical Height Mapping"
        sub="Auto-populate: Typ Floor 3.35m, Podium, Service 2m, Ground 4.2m"
        color={C.blue} badge="DB / MT" />

      <VArrow y1={s12Y + BH} y2={s12OverrideY} />

      {/* Manual Override */}
      <Box x={CX - 220} y={s12OverrideY} w={440} h={48}
        label="⌨️ Manual Override — User can type specific floor heights"
        sub="If heights differ from architectural standard, override per floor"
        color={C.amber} badge="MANUAL" />
      <NoteBox x={NOTE_X} y={s12OverrideY - 2} w={NOTE_W} h={48}
        text={["📐 Default Heights:", "  Typ=3.35m  Ground=4.2m  Service=2m"]}
        color={C.slate} />

      <VArrow y1={s12OverrideY + 48} y2={s13Y} />

      {/* 1.3 Reference Levels */}
      <Box x={BX} y={s13Y} w={BW} h={BH}
        label="Reference Levels"
        sub="Enter OHT Bottom Level (relative to roof) and UGT Depth"
        color={C.blue} badge="MT" />
      <NoteBox x={NOTE_X} y={s13Y + 2} w={NOTE_W} h={48}
        text={["🏢 Reference Points:", "  OHT bottom level & UGT depth"]}
        color={C.slate} />

      <VArrow y1={s13Y + BH} y2={s14Y} />

      {/* 1.4 Design Constraints */}
      <Box x={BX} y={s14Y} w={BW} h={BH}
        label="Design Constraints"
        sub="Min Fixture Pressure: 1.5 Bar (default) | Max: 3.5 Bar (default)"
        color={C.orange} badge="DD" />
      <NoteBox x={NOTE_X} y={s14Y + 2} w={NOTE_W} h={48}
        text={["⚙️ Design Defaults:", "  P_min = 1.5 Bar  |  P_max = 3.5 Bar"]}
        color={C.amber} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 2 — PRESSURE GRADIENT ENGINE
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p2Y} h={p2H} label="PHASE 2 — THE PRESSURE GRADIENT ENGINE (LOGIC BLOCK)" color={C.orange.bd} icon="⚡" />

      <VArrow y1={s14Y + BH} y2={s21Y} />

      {/* 2.1 Raw Head Calculation */}
      <Box x={BX} y={s21Y} w={BW} h={BH}
        label="Calculation of Raw Static Head"
        sub="Pressure at each floor from OHT elevation"
        color={C.blue} badge="AUTO CALC" />

      <VArrow y1={s21Y + BH} y2={s21FormulaY} />

      <FormulaBox x={CX - 260} y={s21FormulaY} w={520} h={52}
        formula="P_static = (Elev_Tank − Elev_Floor) / 10.2"
        note="Converts elevation difference (m) to pressure (bar)"
        color={C.amber} />

      <VArrow y1={s21FormulaY + 52} y2={s22Y} />

      {/* 2.2 Correction Factor */}
      <Box x={BX} y={s22Y} w={BW} h={BH}
        label="Correction Factor Application"
        sub="Account for internal pipe friction losses per floor"
        color={C.blue} badge="AUTO CALC" />

      <VArrow y1={s22Y + BH} y2={s22DiaY - 32} />

      <Diamond cx={CX} cy={s22DiaY} w={440} h={64}
        label="Floor Height > 4m ?"
        sub="Apply −0.3 Bar correction, ELSE apply −0.2 Bar"
        color={C.amber} />
      <NoteBox x={NOTE_X} y={s22DiaY - 26} w={NOTE_W} h={52}
        text={["🔧 Friction Loss Logic:", "  IF Floor Ht > 4m → −0.3 Bar", "  ELSE → −0.2 Bar correction"]}
        color={C.slate} />

      <VArrow y1={s22DiaY + 32} y2={s23Y} />

      {/* 2.3 Zone Logic Gate */}
      <Box x={BX} y={s23Y} w={BW} h={BH}
        label="Zone Logic Gate"
        sub="Route each floor to Booster / Gravity / PRV based on corrected pressure"
        color={C.purple} badge="SYSTEM" />

      {/* Fan-out to 3 zones */}
      <FanArrow x1={CX} y1={s23Y + BH} x2={LC} y2={s23BranchY} label="P < 1.5 Bar" color={C.rose.bd} />
      <VArrow y1={s23Y + BH} y2={s23BranchY} color={C.green.bd} />
      <FanArrow x1={CX} y1={s23Y + BH} x2={RC} y2={s23BranchY} label="P > 3.5 Bar" color={C.purple.bd} />

      {/* 3 Zone outcomes */}
      <Box x={COL_LX} y={s23BranchY} w={COL_W} h={76}
        label="🚀 Booster Pump Line"
        sub="Pressure too low — route to booster pump system for pressure augmentation"
        color={C.rose} badge="ZONE" />
      <Box x={COL_MX} y={s23BranchY} w={COL_W} h={76}
        label="✅ Direct Gravity Line"
        sub="1.5 ≤ P ≤ 3.5 Bar — pressure within acceptable range, no intervention"
        color={C.green} badge="ZONE" />
      <Box x={COL_RX} y={s23BranchY} w={COL_W} h={76}
        label="⚠️ TRIGGER PRV"
        sub="Pressure exceeds 3.5 Bar — install Pressure Reducing Valve on floor"
        color={C.purple} badge="ZONE" />

      {/* Fan-in */}
      <FanArrow x1={LC} y1={s23BranchY + 76} x2={CX} y2={s23MergeY} />
      <VArrow y1={s23BranchY + 76} y2={s23MergeY} />
      <FanArrow x1={RC} y1={s23BranchY + 76} x2={CX} y2={s23MergeY} />

      <Box x={CX - 200} y={s23MergeY} w={400} h={48}
        label="Zone Classification Complete"
        sub="Each floor tagged: Booster / Gravity / PRV"
        color={C.teal} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 3 — PRV RESET & MAPPING
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p3Y} h={p3H} label="PHASE 3 — PRV RESET & MAPPING" color={C.purple.bd} icon="🔧" />

      <VArrow y1={s23MergeY + 48} y2={s31Y} />

      {/* 3.1 PRV Station Placement */}
      <Box x={BX} y={s31Y} w={BW} h={BH}
        label="PRV Station Placement"
        sub="Identify each floor where pressure exceeds 3.5 Bar"
        color={C.purple} badge="AUTO CALC" />
      <NoteBox x={NOTE_X} y={s31Y + 2} w={NOTE_W} h={48}
        text={["📍 Placement Logic:", "  Scan all floors top-down", "  Flag first floor where P > 3.5 Bar"]}
        color={C.purple} />

      <VArrow y1={s31Y + BH} y2={s32Y} />

      {/* 3.2 Pressure Reset Logic */}
      <Box x={BX} y={s32Y} w={BW} h={BH}
        label="Pressure Reset Logic"
        sub="At PRV floor, reset starting pressure to 1.5 Bar"
        color={C.purple} badge="AUTO CALC" />

      <VArrow y1={s32Y + BH} y2={s32FormulaY} />

      <FormulaBox x={CX - 280} y={s32FormulaY} w={560} h={52}
        formula="P_next = 1.5 Bar + (Next Floor Drop / 10.2)"
        note="Subsequent floor pressures recalculated from the 1.5 Bar reset point"
        color={C.purple} />
      <NoteBox x={NOTE_X} y={s32FormulaY - 2} w={NOTE_W} h={52}
        text={["🔄 Reset Cascade:", "  PRV resets P to 1.5 Bar", "  Then re-accumulate downward"]}
        color={C.slate} />

      <VArrow y1={s32FormulaY + 52} y2={s33Y} />

      {/* 3.3 PRV Schedule Output */}
      <Box x={BX} y={s33Y} w={BW} h={BH}
        label="PRV Schedule Output"
        sub="Generate Floor # | Inlet P | Outlet P (1.5) | PRV Model"
        color={C.green} badge="OUTPUT" />

      <VArrow y1={s33Y + BH} y2={s33TableY} />

      <TableBox x={CX - 280} y={s33TableY} w={560}
        headers={["Floor #", "Inlet P (Bar)", "Outlet P (Bar)", "PRV Model"]}
        rows={[
          ["Floor 12", "4.2", "1.5", "PRV-50-DN40"],
          ["Floor 6", "5.8", "1.5", "PRV-50-DN50"],
          ["Floor 1", "7.1", "1.5", "PRV-65-DN50"],
        ]}
        color={C.purple} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 4 — RISER SIZING & WSFU DIVERSITY
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p4Y} h={p4H} label="PHASE 4 — RISER SIZING & WSFU DIVERSITY" color={C.cyan.bd} icon="📊" />

      <VArrow y1={s33TableY + 100} y2={s41Y} />

      {/* 4.1 Unit Mapping */}
      <Box x={BX} y={s41Y} w={BW} h={BH}
        label="Flat Type Unit Mapping"
        sub="Select Flat Type (Type-1 through Type-19) for each floor"
        color={C.blue} badge="DD" />
      <NoteBox x={NOTE_X} y={s41Y + 2} w={NOTE_W} h={56}
        text={["🏠 Flat Types:", "  Type-1 to Type-19", "  Each type has preset fixture list", "  Map type → floor → riser"]}
        color={C.slate} />

      <VArrow y1={s41Y + BH} y2={s42Y} />

      {/* 4.2 WSFU Accumulation */}
      <Box x={BX} y={s42Y} w={BW} h={BH}
        label="WSFU Accumulation (Top-Down Cumulative Sum)"
        sub="Auto-fetch fixture units: WC=3, Kitchen Sink=2, etc. from DB"
        color={C.cyan} badge="DB / AC" />

      <VArrow y1={s42Y + BH} y2={s42TableY} />

      <TableBox x={CX - 260} y={s42TableY} w={520}
        headers={["Fixture", "WSFU", "Typical Flat"]}
        rows={[
          ["WC (Water Closet)", "3", "All types"],
          ["Kitchen Sink", "2", "All types"],
          ["Lavatory Basin", "1", "All types"],
          ["Shower / Bath", "2", "Type-4+"],
          ["Washing Machine", "3", "Type-7+"],
        ]}
        color={C.cyan} />

      <VArrow y1={s42TableY + 140} y2={s43Y} />

      {/* 4.3 Hunter's Curve Conversion */}
      <Box x={BX} y={s43Y} w={BW} h={BH}
        label="Hunter's Curve Conversion"
        sub="Convert Σ WSFU → GPM using non-linear Hunter's Curve"
        color={C.cyan} badge="AUTO CALC" />
      <NoteBox x={NOTE_X} y={s43Y + 2} w={NOTE_W} h={48}
        text={["📈 Hunter's Curve:", "  Tank type or Flush Valve setting", "  Non-linear WSFU → GPM lookup"]}
        color={C.cyan} />

      <VArrow y1={s43Y + BH} y2={s43FormulaY} />

      <FormulaBox x={CX - 240} y={s43FormulaY} w={480} h={52}
        formula="GPM = Hunter_Lookup(Σ WSFU, Valve_Type)"
        note="Tank type vs Flush Valve — different curves for each"
        color={C.amber} />


      {/* ══════════════════════════════════════════════════════════════════
          PHASE 5 — PIPE VALIDATION & FINAL BOM
          ══════════════════════════════════════════════════════════════════ */}
      <PhaseBand y={p5Y} h={p5H} label="PHASE 5 — PIPE VALIDATION & FINAL BOM" color={C.green.bd} icon="✅" />

      <VArrow y1={s43FormulaY + 52} y2={s51Y} />

      {/* 5.1 Diameter Selection */}
      <Box x={BX} y={s51Y} w={BW} h={BH}
        label="Pipe Diameter Selection"
        sub="User selects nominal size: 25, 32, 40, 50, 65, 80, 100 mm"
        color={C.blue} badge="DD" />
      <NoteBox x={NOTE_X} y={s51Y + 2} w={NOTE_W} h={56}
        text={["🔧 Standard Pipe Sizes:", "  25mm | 32mm | 40mm | 50mm", "  65mm | 80mm | 100mm"]}
        color={C.slate} />

      <VArrow y1={s51Y + BH} y2={s52Y} />

      {/* 5.2 Velocity & Friction Check */}
      <Box x={BX} y={s52Y} w={BW} h={BH}
        label="Velocity & Friction Check"
        sub="Calculate V = Q / Area — check against 2.4 m/s limit"
        color={C.blue} badge="AUTO CALC" />

      <VArrow y1={s52Y + BH} y2={s52DiaY - 32} />

      <Diamond cx={CX} cy={s52DiaY} w={460} h={64}
        label="V > 2.4 m/s ?"
        sub="FLAG RED: Velocity Limit Exceeded — Upsize Pipe"
        color={C.rose} />
      <FormulaBox x={NOTE_X} y={s52DiaY - 24} w={NOTE_W} h={52}
        formula="V = Q / A = Q / (π × D² / 4)"
        note="Velocity must stay ≤ 2.4 m/s for domestic risers"
        color={C.amber} />

      <VArrow y1={s52DiaY + 32} y2={s53Y} />

      {/* 5.3 Output Generation */}
      <Box x={BX} y={s53Y} w={BW} h={BH}
        label="Output Generation"
        sub="Final Riser Schedule, Pump Duty Point (Q @ H), Total BOM"
        color={C.green} badge="OUTPUT" />

      <VArrow y1={s53Y + BH} y2={outTblY} />

      {/* Output Summary Table */}
      <rect x={CX - 460} y={outTblY - 6} width={920} height={162} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={outTblY + 18} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={800}>
        📋 Final Output — Riser Schedule & Bill of Materials
      </text>
      <TableBox x={CX - 430} y={outTblY + 28} w={860}
        headers={["Output Item", "Details", "Source", "Reference"]}
        rows={[
          ["Riser Schedule", "Pipe size per floor, WSFU, GPM", "Phase 4–5", "IS 2065"],
          ["PRV Schedule", "Floor, Inlet/Outlet P, Model", "Phase 3", "NBC 2016"],
          ["Pump Duty Point", "Q (m³/hr) @ H (m)", "Phase 2", "—"],
          ["Total BOM", "PRVs, Pipe lengths per size", "Phase 3–5", "Project"],
          ["Velocity Report", "V per riser, flagged exceeds", "Phase 5", "IS 2065"],
        ]}
        color={C.green} />

      <VArrow y1={outTblY + 158} y2={doneY} color={C.green.bd} />

      {/* DONE */}
      <rect x={CX - 260} y={doneY} width={520} height={56} rx={28}
        fill={C.green.bd} stroke="#34d399" strokeWidth={2.5} />
      <text x={CX} y={doneY + 24} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        🏁 PRV Calculation — COMPLETE
      </text>
      <text x={CX} y={doneY + 42} textAnchor="middle" fill="#fff" fontSize={10} opacity={0.85}>
        Results feed → Riser Diagram + Pump Schedule + Material Take-Off
      </text>
    </svg>
  );
}