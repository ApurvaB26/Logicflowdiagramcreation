import React from "react";

// =====================================================================
// FIRE TANK SIZE ESTIMATION — Custom SVG Flow Diagram
// Full architecture: Project Data → NBC/IS Standards Lookup →
// Occupancy Classification → Sprinkler Duration → Hydrant Duration →
// Drencher/Hose Reel → Safety Factor Decision → Tank Compartment →
// Pump Room Sizing → Final Output Dashboard
// =====================================================================

const W = 1600;
const H = 7800;
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
  orange: { bg: "#fed7aa", bd: "#f97316", tx: "#9a3412" },
  fire:   { bg: "#fef2f2", bd: "#dc2626", tx: "#991b1b" },
  arrow:  "#94a3b8",
  reject: "#ef4444",
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

function Box({ x, y, w, h, label, sub, color, badge, rx: rxProp }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string; rx?: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rxProp ?? 12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {badge && (
        <>
          <rect x={x + w - 88} y={y + 6} width={78} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 49} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={11.5} opacity={0.7}>{sub}</text>
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
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.8}>{sub}</text>
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#ftk-a)" />
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

function FormulaBlock({ x, y, w, h, lines, color }: {
  x: number; y: number; w: number; h: number;
  lines: string[];
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      <rect x={x + w - 88} y={y + 6} width={78} height={20} rx={10} fill={color.bd} opacity={0.85} />
      <text x={x + w - 49} y={y + 19} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>FORMULA</text>
      {lines.map((line, i) => (
        <text key={i} x={x + w / 2} y={y + 32 + i * 18} textAnchor="middle" fill={color.tx}
          fontSize={12} fontWeight={i === 0 ? 700 : 500} fontFamily="monospace">
          {line}
        </text>
      ))}
    </g>
  );
}

function DataTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 800, colW = tw / headers.length;
  const rowH = 30, hdrY = y + 52;
  const th = 52 + (rows.length + 1) * (rowH + 2) + 12;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {title}
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={color.bg} stroke={color.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 20} textAnchor="middle"
            fill={color.tx} fontSize={10.5} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isAuto = cell === "Auto" || cell === "Auto-calc";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAuto ? C.green.bg : "#fff"}
                  stroke={isAuto ? C.green.bd : "#e2e8f0"} strokeWidth={isAuto ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle"
                  fill={isAuto ? C.green.tx : "#64748b"} fontSize={10.5} fontWeight={isAuto ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function NoteBox({ x, y, w, h, icon, title, lines, color }: {
  x: number; y: number; w: number; h: number;
  icon: string; title: string; lines: string[];
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2} strokeDasharray="7,4" />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>
        {icon} {title}
      </text>
      {lines.map((line, i) => (
        <text key={i} x={x + w / 2} y={y + 42 + i * 16} textAnchor="middle"
          fill={color.tx} fontSize={11} opacity={0.8}>{line}</text>
      ))}
    </g>
  );
}

function FireTankDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1000, dh = 300;
  const sections = [
    { label: "Sprinkler\nStorage", icon: "🔴", color: C.fire },
    { label: "Hydrant\nStorage", icon: "🧯", color: C.amber },
    { label: "Drencher\nStorage", icon: "💦", color: C.cyan },
    { label: "Hose Reel\nStorage", icon: "🔧", color: C.teal },
    { label: "Total Fire\nTank", icon: "🏗️", color: C.blue },
  ];
  const metrics = [
    { label: "Tank Volume", value: "XXX CUM", color: C.fire },
    { label: "Tank Dimensions", value: "L×B×D m", color: C.blue },
    { label: "Pump Room Area", value: "XX Sq.m", color: C.purple },
    { label: "Total Flow", value: "XX LPM", color: C.green },
  ];
  const cardW = (dw - 60) / 5;
  const metricW = (dw - 60) / 4;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.fire.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.fire.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.fire.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"📊"} FIRE TANK FINAL OUTPUT — Complete Storage & Sizing Summary
      </text>
      {sections.map((s, i) => {
        const cx = x + 12 + i * (cardW + 8);
        const cy = y + 52;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={55} rx={8}
              fill={s.color.bg} stroke={s.color.bd} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={cy + 18} textAnchor="middle" fontSize={16}>{s.icon}</text>
            <text x={cx + cardW / 2} y={cy + 34} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[0]}</text>
            <text x={cx + cardW / 2} y={cy + 46} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[1]}</text>
          </g>
        );
      })}
      {metrics.map((m, i) => {
        const cx = x + 12 + i * (metricW + 10);
        const cy = y + 120;
        return (
          <g key={`m-${i}`}>
            <rect x={cx} y={cy} width={metricW} height={56} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={cx + metricW / 2} y={cy + 22} textAnchor="middle"
              fill={m.color.tx} fontSize={13} fontWeight={700}>{m.label}</text>
            <text x={cx + metricW / 2} y={cy + 42} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
      <text x={x + dw / 2} y={y + 200} textAnchor="middle" fill={C.fire.tx} fontSize={10} opacity={0.6}>
        V_total = V_sprinkler + V_hydrant + V_drencher + V_hose_reel | Tank = V_total × Safety Factor
      </text>
      <rect x={x + 20} y={y + 220} width={dw - 40} height={56} rx={8}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1.5} />
      <text x={x + dw / 2} y={y + 240} textAnchor="middle" fill={C.violet.tx} fontSize={12} fontWeight={700}>
        ✅ Compliance: NBC 2016 Part-4 | IS 15105 | TAC Fire Safety | Local Fire NOC Requirements
      </text>
      <text x={x + dw / 2} y={y + 256} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
        Export → Fire Tank Drawing | Pump Room Layout | BOQ Input | Fire NOC Submission | Cross-link → FFP Calc
      </text>
      <text x={x + dw / 2} y={y + 270} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
        Cross-links → Fire Pump Head (FFP) | Fire Jockey & Drencher (FJD) | Terrace Booster (FTB)
      </text>
    </g>
  );
}


// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function FireTankCalcSVG() {
  const nh = 70;

  const Y = {
    entry:            50,
    // Section 1: Project Data
    projData:         200,
    projTable:        320,
    // Section 2: Occupancy Classification
    occHeader:        660,
    occDecision:      800,
    occHigh:          920,
    occLow:           920,
    occConverge:     1070,
    // Section 3: NBC Standards Fetch
    stdHeader:       1170,
    stdTable:        1290,
    // Section 4: Sprinkler Storage
    sprHeader:       1640,
    sprFormula:      1760,
    sprResult:       1930,
    // Section 5: Hydrant Storage
    hydHeader:       2070,
    hydFormula:      2190,
    hydResult:       2360,
    // Section 6: Drencher & Hose Reel
    drnHeader:       2500,
    drnDecision:     2640,
    drnYes:          2760,
    drnNo:           2760,
    drnConverge:     2910,
    hoseFormula:     3020,
    // Section 7: Summation
    sumHeader:       3180,
    sumTable:        3300,
    sumTotal:        3620,
    // Section 8: Safety Factor
    sfDecision:      3800,
    sfApply:         3920,
    sfSkip:          3920,
    sfConverge:      4070,
    // Section 9: Tank Sizing
    tankHeader:      4180,
    tankFormula:     4300,
    tankDecision:    4470,
    tankSingle:      4590,
    tankDual:        4590,
    tankConverge:    4740,
    tankDimensions:  4850,
    // Section 10: Pump Room
    pumpHeader:      5040,
    pumpTable:       5160,
    pumpArea:        5500,
    // Dashboard
    dashboard:       5680,
    terminal:        6030,
  };

  const nw = 440;
  const nx = CX - nw / 2;
  const tableX = CX - 400;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="ftk-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* PHASE BANDS */}
      <PhaseBand y={Y.entry - 15}      h={120} label="ENTRY — FIRE WATER TANK SIZING MODULE" color={C.fire.bd} />
      <PhaseBand y={Y.projData - 20}   h={Y.occHeader - Y.projData - 30} label="SECTION 1 — PROJECT DATA & BUILDING PARAMETERS" color={C.purple.bd} />
      <PhaseBand y={Y.occHeader - 20}  h={Y.stdHeader - Y.occHeader - 30} label="SECTION 2 — OCCUPANCY CLASSIFICATION (NBC PART-4)" color={C.amber.bd} />
      <PhaseBand y={Y.stdHeader - 20}  h={Y.sprHeader - Y.stdHeader - 30} label="SECTION 3 — NBC/IS FIRE SAFETY STANDARDS LOOKUP" color={C.blue.bd} />
      <PhaseBand y={Y.sprHeader - 20}  h={Y.hydHeader - Y.sprHeader - 30} label="SECTION 4 — SPRINKLER WATER STORAGE CALCULATION" color={C.fire.bd} />
      <PhaseBand y={Y.hydHeader - 20}  h={Y.drnHeader - Y.hydHeader - 30} label="SECTION 5 — HYDRANT WATER STORAGE CALCULATION" color={C.orange.bd} />
      <PhaseBand y={Y.drnHeader - 20}  h={Y.sumHeader - Y.drnHeader - 30} label="SECTION 6 — DRENCHER & HOSE REEL STORAGE" color={C.cyan.bd} />
      <PhaseBand y={Y.sumHeader - 20}  h={Y.sfDecision - Y.sumHeader - 80} label="SECTION 7 — TOTAL FIRE WATER SUMMATION" color={C.green.bd} />
      <PhaseBand y={Y.sfDecision - 80} h={Y.tankHeader - Y.sfDecision + 30} label="SECTION 8 — SAFETY FACTOR & AUTHORITY MARGIN" color={C.amber.bd} />
      <PhaseBand y={Y.tankHeader - 20} h={Y.pumpHeader - Y.tankHeader - 30} label="SECTION 9 — TANK DIMENSIONS & COMPARTMENT DESIGN" color={C.teal.bd} />
      <PhaseBand y={Y.pumpHeader - 20} h={Y.dashboard - Y.pumpHeader - 30} label="SECTION 10 — FIRE PUMP ROOM SIZING" color={C.violet.bd} />
      <PhaseBand y={Y.dashboard - 20}  h={Y.terminal - Y.dashboard + 80} label="FINAL OUTPUT DASHBOARD" color={C.fire.bd} />

      {/* ENTRY */}
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Start: Fire Water Tank Sizing"
        sub="NBC 2016 Part-4 / IS 15105 / TAC Compliance"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.projData} />

      {/* SECTION 1: PROJECT DATA */}
      <Box x={nx} y={Y.projData} w={nw} h={nh}
        label="Fetch Building Parameters"
        sub="Auto-fetch from main database for fire calc inputs"
        color={C.purple} badge="DB FETCH" />
      <Arrow x1={CX} y1={Y.projData + nh} x2={CX} y2={Y.projTable} />

      <DataTable x={tableX} y={Y.projTable}
        title={"📄 AUTO-FETCHED BUILDING DATA FOR FIRE TANK SIZING"}
        headers={["Parameter", "Source", "Value", "Unit"]}
        rows={[
          ["Building Height", "Main DB", "Auto", "m"],
          ["Number of Floors", "Main DB", "Auto", "Nos"],
          ["Total Built-up Area", "Main DB", "Auto", "Sq.m"],
          ["Basement Levels", "Main DB", "Auto", "Nos"],
          ["Occupancy Type", "Main DB", "Auto", "Group"],
          ["Sprinkler System Type", "Fire Design", "Auto", "Wet/Dry"],
          ["No. of Hydrant Outlets", "Fire Design", "Auto", "Nos"],
          ["Drencher Required", "Fire Design", "Auto", "Yes/No"],
        ]}
        color={C.purple}
      />
      <Arrow x1={CX} y1={Y.projTable + 356} x2={CX} y2={Y.occHeader} />

      {/* SECTION 2: OCCUPANCY CLASSIFICATION */}
      <Box x={nx} y={Y.occHeader} w={nw} h={nh}
        label="NBC Occupancy Classification"
        sub="Classify building per NBC 2016 Part-4 Table-1"
        color={C.amber} badge="CLASSIFY" />
      <Arrow x1={CX} y1={Y.occHeader + nh} x2={CX} y2={Y.occDecision - 48} />

      <Diamond cx={CX} cy={Y.occDecision} rxD={220} ryD={48}
        label="Occupancy Hazard Level?"
        sub="Light / Ordinary / High Hazard?"
        color={C.amber} />

      <Arrow x1={CX - 150} y1={Y.occDecision + 40} x2={CX - 300} y2={Y.occHigh}
        label="High Hazard" color={C.reject} />
      <Box x={CX - 520} y={Y.occHigh} w={420} h={nh}
        label="High Hazard: Industrial/Storage"
        sub="Sprinkler: 60 min | Hydrant: 120 min | Max flow rates"
        color={C.fire} badge="HIGH" />

      <Arrow x1={CX + 150} y1={Y.occDecision + 40} x2={CX + 300} y2={Y.occLow}
        label="Light/Ordinary" color={C.green.bd} />
      <Box x={CX + 100} y={Y.occLow} w={420} h={nh}
        label="Light/Ordinary: Residential/Office"
        sub="Sprinkler: 30 min | Hydrant: 60 min | Standard rates"
        color={C.green} badge="STANDARD" />

      <Arrow x1={CX - 300} y1={Y.occHigh + nh} x2={CX} y2={Y.occConverge} />
      <Arrow x1={CX + 300} y1={Y.occLow + nh} x2={CX} y2={Y.occConverge} />
      <Box x={nx} y={Y.occConverge} w={nw} h={60}
        label="Duration & Flow Parameters Locked"
        sub="Hazard-based durations set for all systems"
        color={C.amber} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.occConverge + 60} x2={CX} y2={Y.stdHeader} />

      {/* SECTION 3: NBC STANDARDS */}
      <Box x={nx} y={Y.stdHeader} w={nw} h={nh}
        label="Fetch NBC/IS Fire Standards"
        sub="Flow rates, durations & storage norms from DB"
        color={C.blue} badge="STANDARDS" />
      <Arrow x1={CX} y1={Y.stdHeader + nh} x2={CX} y2={Y.stdTable} />

      <DataTable x={tableX} y={Y.stdTable}
        title={"📋 NBC / IS FIRE WATER STORAGE STANDARDS"}
        headers={["System", "Flow Rate (LPM)", "Duration (min)", "Standard Ref"]}
        rows={[
          ["Sprinkler — Light Hazard", "680–900", "30", "IS 15105 / NBC"],
          ["Sprinkler — Ordinary", "900–1350", "60", "IS 15105 / NBC"],
          ["Internal Hydrant", "900", "60", "NBC Table 18"],
          ["External Hydrant", "2250", "30", "NBC Table 18"],
          ["Drencher System", "Per design", "30–60", "NBC / TAC"],
          ["Hose Reel", "40–50", "30", "IS 884"],
          ["Yard Hydrant (if req)", "1125", "30", "NBC"],
        ]}
        color={C.blue}
      />

      <NoteBox x={CX + 320} y={Y.stdTable + 40} w={240} h={90}
        icon="📘" title="Reference Codes"
        lines={["NBC 2016 Part-4 Fire", "IS 15105:2002 Sprinkler", "IS 884:1985 Hose Reel"]}
        color={C.blue} />
      <line x1={tableX + 800} y1={Y.stdTable + 85} x2={CX + 320} y2={Y.stdTable + 85}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.stdTable + 310} x2={CX} y2={Y.sprHeader} />

      {/* SECTION 4: SPRINKLER STORAGE */}
      <Box x={nx} y={Y.sprHeader} w={nw} h={nh}
        label="Sprinkler Water Storage Calculation"
        sub="Volume = Flow Rate × Duration"
        color={C.fire} badge="SPRINKLER" />
      <Arrow x1={CX} y1={Y.sprHeader + nh} x2={CX} y2={Y.sprFormula} />

      <FormulaBlock x={CX - 340} y={Y.sprFormula} w={680} h={90}
        lines={[
          "V_sprinkler = Q_sprinkler × T_sprinkler ÷ 1000",
          "V_sprinkler (CUM) = Flow (LPM) × Duration (min) ÷ 1000",
          "Example: 900 LPM × 30 min ÷ 1000 = 27 CUM",
        ]}
        color={C.fire} />

      <NoteBox x={CX + 380} y={Y.sprFormula} w={210} h={90}
        icon="🔴" title="Sprinkler Notes"
        lines={["IS 15105 compliant", "Wet pipe for heated areas", "Coverage: 12.5 m²/head"]}
        color={C.fire} />
      <line x1={CX + 340} y1={Y.sprFormula + 45} x2={CX + 380} y2={Y.sprFormula + 45}
        stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sprFormula + 90} x2={CX} y2={Y.sprResult} />
      <Box x={nx} y={Y.sprResult} w={nw} h={nh}
        label="Sprinkler Storage = V_sprinkler CUM"
        sub="Locked → feeds into total summation"
        color={C.fire} badge="OUTPUT" />
      <Arrow x1={CX} y1={Y.sprResult + nh} x2={CX} y2={Y.hydHeader} />

      {/* SECTION 5: HYDRANT STORAGE */}
      <Box x={nx} y={Y.hydHeader} w={nw} h={nh}
        label="Hydrant Water Storage Calculation"
        sub="Internal + External hydrant combined volume"
        color={C.orange} badge="HYDRANT" />
      <Arrow x1={CX} y1={Y.hydHeader + nh} x2={CX} y2={Y.hydFormula} />

      <FormulaBlock x={CX - 340} y={Y.hydFormula} w={680} h={90}
        lines={[
          "V_hydrant = (Q_internal × T_int + Q_external × T_ext) ÷ 1000",
          "Internal: 900 LPM × 60 min | External: 2250 LPM × 30 min",
          "V_hydrant = (54,000 + 67,500) ÷ 1000 = 121.5 CUM",
        ]}
        color={C.orange} />
      <Arrow x1={CX} y1={Y.hydFormula + 90} x2={CX} y2={Y.hydResult} />

      <Box x={nx} y={Y.hydResult} w={nw} h={nh}
        label="Hydrant Storage = V_hydrant CUM"
        sub="Locked → feeds into total summation"
        color={C.orange} badge="OUTPUT" />
      <Arrow x1={CX} y1={Y.hydResult + nh} x2={CX} y2={Y.drnHeader} />

      {/* SECTION 6: DRENCHER & HOSE REEL */}
      <Box x={nx} y={Y.drnHeader} w={nw} h={nh}
        label="Drencher & Hose Reel Storage"
        sub="Check if drencher system is required for this building"
        color={C.cyan} badge="DRENCHER" />
      <Arrow x1={CX} y1={Y.drnHeader + nh} x2={CX} y2={Y.drnDecision - 48} />

      <Diamond cx={CX} cy={Y.drnDecision} rxD={210} ryD={48}
        label="Drencher Required?"
        sub="Based on building height & refuge area?"
        color={C.cyan} />

      <Arrow x1={CX - 140} y1={Y.drnDecision + 40} x2={CX - 300} y2={Y.drnYes}
        label="Yes" color={C.green.bd} />
      <Box x={CX - 520} y={Y.drnYes} w={420} h={nh}
        label="Drencher: V = Q × T ÷ 1000"
        sub="Per refuge/podium area coverage × duration"
        color={C.cyan} badge="DRENCHER" />

      <Arrow x1={CX + 140} y1={Y.drnDecision + 40} x2={CX + 300} y2={Y.drnNo}
        label="No" color={C.reject} />
      <Box x={CX + 100} y={Y.drnNo} w={420} h={nh}
        label="Drencher Not Required"
        sub="V_drencher = 0 CUM → skip this component"
        color={C.slate} badge="N/A" />

      <Arrow x1={CX - 300} y1={Y.drnYes + nh} x2={CX} y2={Y.drnConverge} />
      <Arrow x1={CX + 300} y1={Y.drnNo + nh} x2={CX} y2={Y.drnConverge} />
      <Box x={nx} y={Y.drnConverge} w={nw} h={60}
        label="Drencher Volume Locked"
        sub="V_drencher determined → proceed to hose reel"
        color={C.cyan} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.drnConverge + 60} x2={CX} y2={Y.hoseFormula} />

      <FormulaBlock x={CX - 300} y={Y.hoseFormula} w={600} h={90}
        lines={[
          "V_hose_reel = Q_hose × T_hose ÷ 1000",
          "Standard: 40 LPM × 30 min ÷ 1000 = 1.2 CUM",
          "Minimum 1 CUM reserved for hose reel system",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={Y.hoseFormula + 90} x2={CX} y2={Y.sumHeader} />

      {/* SECTION 7: SUMMATION */}
      <Box x={nx} y={Y.sumHeader} w={nw} h={nh}
        label="Total Fire Water Summation"
        sub="Aggregate all system storage requirements"
        color={C.green} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.sumHeader + nh} x2={CX} y2={Y.sumTable} />

      <DataTable x={tableX} y={Y.sumTable}
        title={"📊 FIRE WATER STORAGE BREAKDOWN"}
        headers={["System", "Flow (LPM)", "Duration (min)", "Volume (CUM)", "Status"]}
        rows={[
          ["Sprinkler System", "Auto", "Auto", "Auto-calc", "✓"],
          ["Internal Hydrant", "900", "60", "Auto-calc", "✓"],
          ["External Hydrant", "2250", "30", "Auto-calc", "✓"],
          ["Drencher System", "Auto", "Auto", "Auto-calc", "—"],
          ["Hose Reel", "40", "30", "Auto-calc", "✓"],
          ["TOTAL", "—", "—", "Auto-calc", "✓"],
        ]}
        color={C.green}
      />
      <Arrow x1={CX} y1={Y.sumTable + 280} x2={CX} y2={Y.sumTotal} />

      <FormulaBlock x={CX - 340} y={Y.sumTotal} w={680} h={90}
        lines={[
          "V_total = V_sprinkler + V_hydrant + V_drencher + V_hose_reel",
          "All volumes in CUM (Cubic Metres)",
          "This is the NET fire water requirement before safety factor",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={Y.sumTotal + 90} x2={CX} y2={Y.sfDecision - 48} />

      {/* SECTION 8: SAFETY FACTOR */}
      <Diamond cx={CX} cy={Y.sfDecision} rxD={220} ryD={48}
        label="Apply Authority Margin?"
        sub="Fire authority requires additional buffer?"
        color={C.amber} />

      <Arrow x1={CX - 150} y1={Y.sfDecision + 40} x2={CX - 300} y2={Y.sfApply}
        label="Yes (10-20%)" color={C.green.bd} />
      <Box x={CX - 520} y={Y.sfApply} w={420} h={nh}
        label="Apply Safety Factor = 1.10 – 1.20"
        sub="Authority margin for peak demand / leakage"
        color={C.amber} badge="SAFETY" />

      <Arrow x1={CX + 150} y1={Y.sfDecision + 40} x2={CX + 300} y2={Y.sfSkip}
        label="No" color={C.reject} />
      <Box x={CX + 100} y={Y.sfSkip} w={420} h={nh}
        label="No Additional Margin Required"
        sub="NBC standard volumes already include buffer"
        color={C.green} badge="AS-IS" />

      <Arrow x1={CX - 300} y1={Y.sfApply + nh} x2={CX} y2={Y.sfConverge} />
      <Arrow x1={CX + 300} y1={Y.sfSkip + nh} x2={CX} y2={Y.sfConverge} />
      <Box x={nx} y={Y.sfConverge} w={nw} h={60}
        label="Design Fire Tank Volume Locked"
        sub="V_design = V_total × Safety Factor"
        color={C.amber} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.sfConverge + 60} x2={CX} y2={Y.tankHeader} />

      {/* SECTION 9: TANK DIMENSIONS */}
      <Box x={nx} y={Y.tankHeader} w={nw} h={nh}
        label="Tank Dimensions & Compartment Design"
        sub="L × B × D sizing with structural constraints"
        color={C.teal} badge="TANK" />
      <Arrow x1={CX} y1={Y.tankHeader + nh} x2={CX} y2={Y.tankFormula} />

      <FormulaBlock x={CX - 340} y={Y.tankFormula} w={680} h={90}
        lines={[
          "V_design = L × B × D (effective water depth)",
          "Depth: 2.5–4.0 m typical | Freeboard: 300mm min",
          "L:B ratio = 2:1 to 3:1 (structural efficiency)",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={Y.tankFormula + 90} x2={CX} y2={Y.tankDecision - 48} />

      <Diamond cx={CX} cy={Y.tankDecision} rxD={220} ryD={48}
        label="Tank Compartments?"
        sub="Volume > 150 CUM? NBC requires compartments"
        color={C.teal} />

      <Arrow x1={CX - 150} y1={Y.tankDecision + 40} x2={CX - 300} y2={Y.tankDual}
        label="Yes (>150 CUM)" color={C.green.bd} />
      <Box x={CX - 520} y={Y.tankDual} w={420} h={nh}
        label="Dual Compartment Tank"
        sub="2 cells with cross-connection — maintenance access"
        color={C.teal} badge="DUAL" />

      <Arrow x1={CX + 150} y1={Y.tankDecision + 40} x2={CX + 300} y2={Y.tankSingle}
        label="No (≤150)" color={C.reject} />
      <Box x={CX + 100} y={Y.tankSingle} w={420} h={nh}
        label="Single Compartment Tank"
        sub="Single cell sufficient — simpler construction"
        color={C.green} badge="SINGLE" />

      <Arrow x1={CX - 300} y1={Y.tankDual + nh} x2={CX} y2={Y.tankConverge} />
      <Arrow x1={CX + 300} y1={Y.tankSingle + nh} x2={CX} y2={Y.tankConverge} />
      <Box x={nx} y={Y.tankConverge} w={nw} h={60}
        label="Tank Configuration Locked"
        sub="Compartment count & dimensions finalized"
        color={C.teal} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.tankConverge + 60} x2={CX} y2={Y.tankDimensions} />

      <DataTable x={tableX} y={Y.tankDimensions}
        title={"📐 TANK DIMENSION SUMMARY"}
        headers={["Parameter", "Value", "Unit", "Remark"]}
        rows={[
          ["Effective Volume", "Auto-calc", "CUM", "Design volume"],
          ["Length (L)", "Auto-calc", "m", "Based on L:B ratio"],
          ["Breadth (B)", "Auto-calc", "m", "Based on L:B ratio"],
          ["Effective Depth", "Auto-calc", "m", "2.5–4.0 m range"],
          ["Freeboard", "300", "mm", "NBC minimum"],
          ["Compartments", "Auto", "Nos", "1 or 2"],
        ]}
        color={C.teal}
      />
      <Arrow x1={CX} y1={Y.tankDimensions + 260} x2={CX} y2={Y.pumpHeader} />

      {/* SECTION 10: PUMP ROOM */}
      <Box x={nx} y={Y.pumpHeader} w={nw} h={nh}
        label="Fire Pump Room Sizing"
        sub="Space for main pump, jockey pump, control panel"
        color={C.violet} badge="PUMP ROOM" />
      <Arrow x1={CX} y1={Y.pumpHeader + nh} x2={CX} y2={Y.pumpTable} />

      <DataTable x={tableX} y={Y.pumpTable}
        title={"🔧 FIRE PUMP ROOM EQUIPMENT LIST"}
        headers={["Equipment", "Quantity", "Footprint (m²)", "Remarks"]}
        rows={[
          ["Main Fire Pump (Electric)", "1", "Auto-calc", "As per FFP calc"],
          ["Standby Fire Pump (Diesel)", "1", "Auto-calc", "100% standby"],
          ["Jockey Pump", "1", "0.4", "Pressure maintenance"],
          ["Fire Control Panel", "1", "1.2", "MCC + annunciator"],
          ["Suction Header", "1", "1.5", "Common manifold"],
          ["Valve Assembly", "1 set", "1.0", "NRV, gate, butterfly"],
        ]}
        color={C.violet}
      />
      <Arrow x1={CX} y1={Y.pumpTable + 280} x2={CX} y2={Y.pumpArea} />

      <FormulaBlock x={CX - 340} y={Y.pumpArea} w={680} h={90}
        lines={[
          "Pump Room Area = Σ(Equipment Footprint) × 2.5",
          "2.5× factor for access corridors, maintenance clearance",
          "Min dimensions: 6m × 4m (24 sqm) per NBC guidelines",
        ]}
        color={C.violet} />
      <Arrow x1={CX} y1={Y.pumpArea + 90} x2={CX} y2={Y.dashboard} />

      {/* DASHBOARD */}
      <FireTankDashboard x={CX - 500} y={Y.dashboard} />

      <Arrow x1={CX} y1={Y.dashboard + 300} x2={CX} y2={Y.terminal} />

      <Box x={nx} y={Y.terminal} w={nw} h={60}
        label="FIRE TANK CALCULATION COMPLETE"
        sub="All outputs locked → Export to Report & BOQ"
        color={C.fire} badge="DONE" rx={30} />
    </svg>
  );
}
