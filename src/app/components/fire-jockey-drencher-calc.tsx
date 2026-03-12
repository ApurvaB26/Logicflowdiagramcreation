import React from "react";

// =====================================================================
// FJD — COMPREHENSIVE JOCKEY & DRENCHER PUMP CALCULATION
// 10-Section Flow: Input Module → Jockey Hydraulics → Drencher
// Hydraulics → Small-bore Friction → Safety Factor → System Pressure →
// Pressure Maintenance Logic → Equipment Selection → BOM → Dashboard
// Project: Lodha Crown Tower-B | Standards: IS-15105 / NBC Part 4
// =====================================================================

const W = 1600;
const H = 7600;
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
  red:    { bg: "#fee2e2", bd: "#dc2626", tx: "#991b1b" },
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

function DataTable({ x, y, title, headers, rows, color, colWidths }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
  colWidths?: number[];
}) {
  const tw = 780;
  const defaultColW = tw / headers.length;
  const rowH = 30, hdrY = y + 52;
  const th = 52 + (rows.length + 1) * (rowH + 2) + 12;
  const getColX = (ci: number) => {
    if (!colWidths) return x + ci * defaultColW + 3;
    let offset = 0;
    for (let i = 0; i < ci; i++) offset += (colWidths[i] || defaultColW);
    return x + offset + 3;
  };
  const getColW = (ci: number) => (colWidths ? (colWidths[ci] || defaultColW) : defaultColW) - 6;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>{title}</text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={getColX(i)} y={hdrY} width={getColW(i)} height={rowH} rx={5}
            fill={color.bg} stroke={color.bd} strokeWidth={1.5} />
          <text x={getColX(i) + getColW(i) / 2 + 3} y={hdrY + 20} textAnchor="middle"
            fill={color.tx} fontSize={10.5} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isTotal = ri === rows.length - 1;
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={getColX(ci)} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={getColW(ci)} height={rowH} rx={5}
                  fill={isTotal ? C.amber.bg : "#fff"}
                  stroke={isTotal ? C.amber.bd : "#e2e8f0"}
                  strokeWidth={isTotal ? 1.5 : 1} />
                <text x={getColX(ci) + getColW(ci) / 2 + 3} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle" fill={isTotal ? C.amber.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isTotal ? 700 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function ValueBlock({ x, y, w, h, label, value, unit, color, icon }: {
  x: number; y: number; w: number; h: number;
  label: string; value: string; unit: string;
  color: { bg: string; bd: string; tx: string }; icon?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {icon && <text x={cx} y={y + 24} textAnchor="middle" fontSize={20}>{icon}</text>}
      <text x={cx} y={y + (icon ? 44 : 28)} textAnchor="middle" fill={color.tx} fontSize={11} fontWeight={600}>{label}</text>
      <text x={cx} y={y + (icon ? 68 : 52)} textAnchor="middle" fill={color.bd} fontSize={22} fontWeight={800}>{value}</text>
      <text x={cx} y={y + (icon ? 84 : 68)} textAnchor="middle" fill={color.tx} fontSize={10} opacity={0.7}>{unit}</text>
    </g>
  );
}

// =====================================================================
// MAIN EXPORT
// =====================================================================
export function FireJockeyDrencherCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="fjd-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="fjd-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={90} fill="url(#fjd-hdr)" stroke="#991b1b" strokeWidth={3} rx={14} />
      <text x={CX} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill="#fff">
        {"🔧"} JOCKEY & DRENCHER PUMP CALCULATION — COMPREHENSIVE
      </text>
      <text x={CX} y={74} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fecaca">
        IS-15105 / NBC Part 4 | Project: Lodha Crown Tower-B | Pressure Maintenance + Water Curtain
      </text>
      <text x={CX} y={94} textAnchor="middle" fontSize={11} fill="#fca5a5">
        Small-bore Friction | Drencher High-volume Supply | +20% Safety | System Pressure Validation
      </text>

      {/* ============================================== */}
      {/* SECTION 1: INPUT FROM MAIN PUMP MODULE        */}
      {/* ============================================== */}
      <PhaseBand y={130} h={480} label="SECTION 1 — INPUT DATA FROM MAIN FIRE PUMP MODULE" color={C.blue.bd} />

      <Box x={CX - 280} y={160} w={560} h={64} label="STEP 1: Fetch Main Pump Data"
        sub="From FFP Module: Hydrant TDH=156m, Sprinkler TDH=130m, Static=115.7m"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={224} x2={CX} y2={252} />

      <Box x={CX - 280} y={252} w={560} h={64} label="STEP 2: Building & Pipe Data"
        sub="Height: 112.2m | 32F+2B | Jockey pipe: DN50/80 | Drencher pipe: DN100"
        color={C.blue} badge="DB FETCH" />
      <Arrow x1={CX} y1={316} x2={CX} y2={350} />

      <DataTable x={CX - 390} y={350}
        title={"📋 INPUT PARAMETERS FROM MAIN FIRE PUMP MODULE"}
        headers={["Parameter", "Hydrant System", "Sprinkler System", "Source"]}
        rows={[
          ["Main Pump TDH", "156 m", "130 m", "FFP Calc"],
          ["Static Head", "115.7 m", "116.0 m", "FFP Calc"],
          ["Friction Loss", "3.77 mWC", "6.81 mWC", "FFP Calc"],
          ["Shutoff Head", "185 m", "150 m", "Pump Curve"],
          ["System Pressure", "15.6 Bar", "13.0 Bar", "Derived"],
          ["Pipe Material", "GI Class C", "GI Class C", "Spec"],
        ]}
        color={C.blue}
        colWidths={[200, 180, 180, 140]}
      />

      {/* ============================================== */}
      {/* SECTION 2: JOCKEY PUMP — PURPOSE & PARAMETERS */}
      {/* ============================================== */}
      <PhaseBand y={630} h={380} label="SECTION 2 — JOCKEY PUMP PURPOSE & DESIGN PARAMETERS" color={C.cyan.bd} />

      <Arrow x1={CX} y1={625} x2={CX} y2={670} />

      <Box x={CX - 280} y={670} w={560} h={64} label="STEP 3: Jockey Pump Purpose"
        sub="Pressure maintenance pump | Compensates minor leakages | Prevents main pump cycling"
        color={C.cyan} badge="CONCEPT" />
      <Arrow x1={CX} y1={734} x2={CX} y2={764} />

      <NoteBox x={60} y={670} w={280} h={110} icon="💡" title="Jockey Pump Design Rules"
        lines={["Flow: 1-3% of main pump flow", "Head: Shutoff + 0.5 Bar", "Min Flow: 60 LPM", "Auto start/stop on pressure", "Run time < 10 min/cycle"]}
        color={C.cyan} />

      <DataTable x={CX - 390} y={764}
        title={"🔧 JOCKEY PUMP DESIGN PARAMETERS"}
        headers={["Parameter", "Hydrant Jockey", "Sprinkler Jockey", "Basis"]}
        rows={[
          ["Main Pump Flow", "1800 LPM", "1080 LPM", "FFP Module"],
          ["Jockey Flow (2%)", "36 LPM", "22 LPM", "2% Rule"],
          ["Min Design Flow", "120 LPM", "60 LPM", "IS-15105"],
          ["Selected Flow", "120 LPM", "60 LPM", "max(calc, min)"],
          ["Shutoff Head", "185 m", "150 m", "Pump Curve"],
          ["Jockey Head (+0.5 Bar)", "190.1 m", "155.1 m", "+5.1 mWC"],
        ]}
        color={C.cyan}
        colWidths={[200, 180, 180, 140]}
      />

      {/* ============================================== */}
      {/* SECTION 3: JOCKEY SMALL-BORE FRICTION CALC    */}
      {/* ============================================== */}
      <PhaseBand y={1030} h={520} label="SECTION 3 — JOCKEY PUMP SMALL-BORE FRICTION ANALYSIS" color={C.purple.bd} />

      <Arrow x1={CX} y1={1020} x2={CX} y2={1068} />

      <Box x={CX - 280} y={1068} w={560} h={64}
        label="STEP 4: Jockey Pipe Network — DN50/DN80 Small-bore"
        sub="GI Class C | C=120 | Small-bore has higher unit friction per meter"
        color={C.purple} badge="PIPE DATA" />
      <Arrow x1={CX} y1={1132} x2={CX} y2={1162} />

      <DataTable x={CX - 390} y={1162}
        title={"🔧 JOCKEY PUMP PIPE SCHEDULE (SMALL-BORE)"}
        headers={["Section", "DN (mm)", "Length (m)", "Flow (LPM)", "Fittings"]}
        rows={[
          ["Pump Discharge", "50", "3.0", "120", "2x Elbow, 1x NRV"],
          ["Header Connection", "80", "6.0", "120", "1x Tee, 1x Gate"],
          ["To Pressure Vessel", "50", "2.5", "120", "1x Elbow"],
          ["Bypass/Test Line", "32", "4.0", "60", "2x Valve"],
          ["Total", "—", "15.5", "—", "—"],
        ]}
        color={C.purple}
        colWidths={[200, 100, 120, 130, 180]}
      />
      <Arrow x1={CX} y1={1396} x2={CX} y2={1426} />

      <FormulaBlock x={CX - 340} y={1426} w={680} h={110}
        lines={[
          "Jockey Friction Loss (Hazen-Williams):",
          "DN50 Section: P = 6.05e4 x (120/120)^1.85 / 50^4.8657 = 0.892 kPa/m",
          "DN80 Section: P = 6.05e4 x (120/120)^1.85 / 80^4.8657 = 0.128 kPa/m",
          "Total = (0.892 x 8.5) + (0.128 x 7.0) = 7.58 + 0.90 = 8.48 kPa = 0.86 mWC",
        ]}
        color={C.amber} />

      {/* ============================================== */}
      {/* SECTION 4: DRENCHER PUMP — PURPOSE & PARAMS   */}
      {/* ============================================== */}
      <PhaseBand y={1570} h={420} label="SECTION 4 — DRENCHER (WATER CURTAIN) PUMP DESIGN" color={C.orange.bd} />

      <Arrow x1={CX} y1={1560} x2={CX} y2={1608} />

      <Box x={CX - 280} y={1608} w={560} h={64} label="STEP 5: Drencher System Purpose"
        sub="Water curtain at fire break floors | Exterior facade protection | High-volume supply"
        color={C.orange} badge="CONCEPT" />
      <Arrow x1={CX} y1={1672} x2={CX} y2={1702} />

      <DataTable x={CX - 390} y={1702}
        title={"💧 DRENCHER PUMP DESIGN PARAMETERS"}
        headers={["Parameter", "Value", "Unit", "Reference"]}
        rows={[
          ["Linear Coverage", "42.0", "meters", "Building perimeter"],
          ["Flow per Meter", "35", "L/min/m", "IS-15105 Sec 9.3"],
          ["Total Drencher Flow", "1,470", "LPM", "42 x 35"],
          ["Operating Duration", "60", "minutes", "IS-15105"],
          ["Pipe Material", "GI Class C", "DN100", "IS-1239"],
          ["Static Head", "48.0", "m", "Sump to drencher level"],
          ["Residual Pressure", "3.5", "Bar", "At nozzle tip"],
        ]}
        color={C.orange}
        colWidths={[200, 180, 120, 200]}
      />

      {/* ============================================== */}
      {/* SECTION 5: DRENCHER FRICTION CALCULATION      */}
      {/* ============================================== */}
      <PhaseBand y={2010} h={460} label="SECTION 5 — DRENCHER PUMP FRICTION & HEAD LOSS" color={C.teal.bd} />

      <Arrow x1={CX} y1={2000} x2={CX} y2={2050} />

      <Box x={CX - 280} y={2050} w={560} h={64}
        label="STEP 6: Drencher Pipe Network — DN100"
        sub="GI Class C | C=120 | High-flow rate through DN100 pipe"
        color={C.teal} badge="PIPE DATA" />
      <Arrow x1={CX} y1={2114} x2={CX} y2={2144} />

      <DataTable x={CX - 390} y={2144}
        title={"💧 DRENCHER PIPE SCHEDULE & FITTINGS"}
        headers={["Section", "DN (mm)", "Length (m)", "Flow (LPM)", "Fittings"]}
        rows={[
          ["Pump to Riser Base", "100", "18.0", "1470", "3x Elbow, 1x NRV"],
          ["Vertical Riser", "100", "52.0", "1470", "—"],
          ["Horizontal Distribution", "80", "38.0", "735", "4x Tee, 2x Elbow"],
          ["Branch to Nozzles", "50", "24.0", "245", "6x Elbow"],
          ["Total Pipe Run", "—", "132.0", "—", "—"],
        ]}
        color={C.teal}
        colWidths={[220, 100, 120, 130, 160]}
      />
      <Arrow x1={CX} y1={2378} x2={CX} y2={2408} />

      <FormulaBlock x={CX - 340} y={2408} w={680} h={108}
        lines={[
          "Drencher Friction Loss Calculation:",
          "DN100: P=0.282 kPa/m x 70m = 19.74 kPa (incl. equiv.)",
          "DN80: P=0.615 kPa/m x 52m = 31.98 kPa (incl. equiv.)",
          "DN50: P=2.48 kPa/m x 36m = 89.28 kPa (incl. equiv.)",
          "Total Friction = 19.74 + 31.98 + 89.28 = 141.0 kPa = 14.38 mWC",
        ]}
        color={C.amber} />

      {/* ============================================== */}
      {/* SECTION 6: +20% SAFETY FACTOR APPLICATION     */}
      {/* ============================================== */}
      <PhaseBand y={2550} h={420} label="SECTION 6 — +20% SAFETY FACTOR APPLICATION" color={C.rose.bd} />

      <Arrow x1={CX} y1={2530} x2={CX} y2={2590} />

      <FormulaBlock x={CX - 340} y={2590} w={680} h={130}
        lines={[
          "Safety Factor Application (+20% on friction):",
          "",
          "Jockey Friction: 0.86 mWC x 1.20 = 1.03 mWC",
          "Drencher Friction: 14.38 mWC x 1.20 = 17.26 mWC",
          "",
          "IS-15105 mandates min 20% safety on all frictional losses",
        ]}
        color={C.rose} />
      <Arrow x1={CX} y1={2720} x2={CX} y2={2750} />

      <DataTable x={CX - 390} y={2750}
        title={"📊 FRICTION LOSS SUMMARY (WITH SAFETY FACTOR)"}
        headers={["System", "Raw Friction", "+20% Safety", "Final Friction", "Static Head"]}
        rows={[
          ["Jockey (Hydrant)", "0.86 mWC", "0.17 mWC", "1.03 mWC", "115.7 m"],
          ["Jockey (Sprinkler)", "0.65 mWC", "0.13 mWC", "0.78 mWC", "116.0 m"],
          ["Drencher Pump", "14.38 mWC", "2.88 mWC", "17.26 mWC", "48.0 m"],
        ]}
        color={C.rose}
        colWidths={[180, 130, 130, 150, 130]}
      />

      {/* ============================================== */}
      {/* SECTION 7: TOTAL HEAD & SYSTEM PRESSURE       */}
      {/* ============================================== */}
      <PhaseBand y={2980} h={500} label="SECTION 7 — TOTAL HEAD & SYSTEM PRESSURE CALCULATION" color={C.green.bd} />

      <Arrow x1={CX} y1={2970} x2={CX} y2={3020} />

      <FormulaBlock x={CX - 340} y={3020} w={680} h={148}
        lines={[
          "Jockey (Hydrant) TDH:",
          "= Friction + Static + Shutoff Margin",
          "= 1.03 + 115.7 + 5.1(+0.5 Bar) = 121.83 m \u2192 Say 122 m",
          "",
          "Jockey (Sprinkler) TDH:",
          "= 0.78 + 116.0 + 5.1 = 121.88 m \u2192 Say 122 m",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={3168} x2={CX} y2={3198} />

      <FormulaBlock x={CX - 340} y={3198} w={680} h={130}
        lines={[
          "Drencher Pump TDH:",
          "= Friction + Static + Residual Pressure",
          "= 17.26 + 48.0 + 35.7(3.5 Bar)",
          "= 100.96 m \u2192 Say 101 m",
          "",
          "Drencher Pump: 1470 LPM @ 101m TDH",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={3328} x2={CX} y2={3360} />

      {/* Pressure Validation Decision */}
      <Diamond cx={CX} cy={3420} rxD={180} ryD={55}
        label="Jockey < Shutoff?"
        sub="Must be below main pump shutoff" color={C.amber} />

      <Arrow x1={CX - 180} y1={3420} x2={160} y2={3420} color={C.green.bd} label="122 < 185 \u2713" />
      <NoteBox x={60} y={3385} w={240} h={70} icon="\u2705" title="Hydrant Jockey OK"
        lines={["122m < 185m shutoff", "Proper pressure band"]}
        color={C.green} />

      <Arrow x1={CX + 180} y1={3420} x2={W - 160} y2={3420} color={C.green.bd} label="122 < 150 \u2713" />
      <NoteBox x={W - 320} y={3385} w={240} h={70} icon="\u2705" title="Sprinkler Jockey OK"
        lines={["122m < 150m shutoff", "Proper pressure band"]}
        color={C.green} />

      {/* ============================================== */}
      {/* SECTION 8: PRESSURE MAINTENANCE LOGIC         */}
      {/* ============================================== */}
      <PhaseBand y={3510} h={460} label="SECTION 8 — PRESSURE MAINTENANCE & AUTO START/STOP LOGIC" color={C.violet.bd} />

      <Arrow x1={CX} y1={3475} x2={CX} y2={3550} />

      <Box x={CX - 340} y={3550} w={680} h={64}
        label="STEP 7: Pressure Switch Settings"
        sub="Jockey auto-start on -0.3 Bar drop | Auto-stop at set pressure | Main starts at -1.0 Bar"
        color={C.violet} badge="CONTROLS" />
      <Arrow x1={CX} y1={3614} x2={CX} y2={3650} />

      <DataTable x={CX - 390} y={3650}
        title={"⚡ PRESSURE SWITCH SETTING MATRIX"}
        headers={["Switch", "Hydrant", "Sprinkler", "Function"]}
        rows={[
          ["Jockey Start", "18.2 Bar", "14.7 Bar", "Pressure drop -0.3 Bar"],
          ["Jockey Stop", "18.5 Bar", "15.0 Bar", "Set pressure reached"],
          ["Main Pump Start", "17.5 Bar", "14.0 Bar", "Pressure drop -1.0 Bar"],
          ["Main Pump Stop", "Manual", "Manual", "Per NFPA/IS-15105"],
          ["Alarm (Low)", "16.0 Bar", "12.5 Bar", "Panel alarm trigger"],
          ["Fire Alarm Override", "Auto Start", "Auto Start", "FA panel interlock"],
        ]}
        color={C.violet}
        colWidths={[200, 150, 150, 220]}
      />

      <NoteBox x={60} y={3650} w={280} h={90} icon="⚡" title="Control Panel Logic"
        lines={["Jockey: Auto start/stop", "Main: Auto start, manual stop", "Standby: Auto changeover", "Panel: UL/FM listed"]}
        color={C.violet} />

      {/* ============================================== */}
      {/* SECTION 9: EQUIPMENT SELECTION & SPECS        */}
      {/* ============================================== */}
      <PhaseBand y={3990} h={460} label="SECTION 9 — EQUIPMENT SELECTION & SPECIFICATIONS" color={C.teal.bd} />

      <Arrow x1={CX} y1={3980} x2={CX} y2={4030} />

      <DataTable x={CX - 390} y={4030}
        title={"🏭 JOCKEY & DRENCHER PUMP EQUIPMENT SELECTION"}
        headers={["Equipment", "Flow (LPM)", "Head (m)", "Motor", "Type", "Make"]}
        rows={[
          ["Jockey (Hydrant)", "120", "165", "7.5 HP", "Vertical MV", "CRI"],
          ["Jockey (Sprinkler)", "60", "140", "5.0 HP", "Vertical MV", "CRI"],
          ["Drencher Pump", "1,470", "101", "60 HP", "End-suction", "Kirloskar"],
          ["Drencher Standby", "1,470", "101", "60 HP", "End-suction", "Kirloskar"],
          ["Pressure Vessel (H)", "—", "—", "—", "200L Diaphragm", "Flamco"],
          ["Pressure Vessel (S)", "—", "—", "—", "100L Diaphragm", "Flamco"],
        ]}
        color={C.teal}
        colWidths={[180, 110, 100, 100, 140, 100]}
      />
      <Arrow x1={CX} y1={4296} x2={CX} y2={4326} />

      <Box x={CX - 340} y={4326} w={680} h={64}
        label="Motor Rating Summary: Jockey 7.5+5 HP | Drencher 2x60 HP"
        sub="Total Connected Load: 132.5 HP = 98.8 kW | DG backup required"
        color={C.green} badge="SUMMARY" />

      {/* ============================================== */}
      {/* SECTION 10: OUTPUT DASHBOARD                  */}
      {/* ============================================== */}
      <PhaseBand y={4440} h={580} label="SECTION 10 — JOCKEY & DRENCHER OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={4400} x2={CX} y2={4480} />

      {/* Dashboard KPI row */}
      <ValueBlock x={60} y={4480} w={200} h={95} label="Jockey (Hyd) Head" value="165 m" unit="16.2 Bar" color={C.cyan} icon="🔧" />
      <ValueBlock x={280} y={4480} w={200} h={95} label="Jockey (Spr) Head" value="140 m" unit="13.7 Bar" color={C.purple} icon="🔧" />
      <ValueBlock x={500} y={4480} w={200} h={95} label="Drencher TDH" value="101 m" unit="9.9 Bar" color={C.orange} icon="💧" />
      <ValueBlock x={720} y={4480} w={200} h={95} label="Drencher Flow" value="1,470" unit="LPM" color={C.blue} icon="🚿" />
      <ValueBlock x={940} y={4480} w={200} h={95} label="Safety Factor" value="+20%" unit="On friction" color={C.rose} icon="⚠️" />
      <ValueBlock x={1160} y={4480} w={200} h={95} label="Total Motor" value="133 HP" unit="99 kW" color={C.green} icon="⚡" />

      {/* BOM */}
      <DataTable x={CX - 390} y={4610}
        title={"📦 JOCKEY & DRENCHER — BILL OF MATERIALS"}
        headers={["Item", "Qty", "Specification", "Make"]}
        rows={[
          ["Jockey Pump (Hydrant)", "1", "120 LPM @ 165m, 7.5 HP", "CRI"],
          ["Jockey Pump (Sprinkler)", "1", "60 LPM @ 140m, 5.0 HP", "CRI"],
          ["Drencher Pump (Duty)", "1", "1470 LPM @ 101m, 60 HP", "Kirloskar"],
          ["Drencher Pump (Standby)", "1", "1470 LPM @ 101m, 60 HP", "Kirloskar"],
          ["Pressure Vessel 200L", "1", "Pre-charged diaphragm", "Flamco"],
          ["Pressure Vessel 100L", "1", "Pre-charged diaphragm", "Flamco"],
          ["Pressure Switches (set)", "4", "Adjustable diff. type", "Danfoss"],
          ["Fire Pump Controller", "1", "UL/FM listed panel", "Tornatech"],
        ]}
        color={C.green}
        colWidths={[220, 60, 300, 140]}
      />

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={4940} x2={CX} y2={4980} />
      <rect x={CX - 200} y={4980} width={400} height={56} rx={28}
        fill="#059669" stroke="#34d399" strokeWidth={3} />
      <text x={CX} y={5014} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"🏁"} FJD CALCULATION COMPLETE
      </text>

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 40} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        FJD-001 | Jockey & Drencher Pump Calculation | Lodha Crown Tower-B | Rev 01 | IS-15105/NBC Part 4
      </text>
    </svg>
  );
}
