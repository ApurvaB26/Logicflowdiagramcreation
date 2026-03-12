import React from "react";

// =====================================================================
// FTK — COMPREHENSIVE FIRE TANK SIZE ESTIMATION
// 8-Section Flow: Building Data → Standards Lookup → Sprinkler Volume →
// Hydrant Volume → Drencher Volume → 300m³ Safety Gate → Tank Dims →
// Output Dashboard
// Project: Lodha Crown Tower-B | Hazard: Ordinary-II
// Standards: IS-15105 / NFPA-13 / IS-5290 / NBC Part 4
// =====================================================================

const W = 1600;
const H = 7200;
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
export function FireTankCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="ftk-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="ftk-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={90} fill="url(#ftk-hdr)" stroke="#991b1b" strokeWidth={3} rx={14} />
      <text x={CX} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill="#fff">
        {"🚨"} FIRE TANK SIZE ESTIMATION — COMPREHENSIVE FLOWCHART
      </text>
      <text x={CX} y={74} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fecaca">
        IS-15105 / NFPA-13 / IS-5290 / NBC Part 4 | Project: Lodha Crown Tower-B | Hazard: Ordinary-II
      </text>
      <text x={CX} y={94} textAnchor="middle" fontSize={11} fill="#fca5a5">
        Sprinkler Volume + Hydrant Volume + Drencher Volume + 300 m\u00B3 Safety Gate + Tank Dimensioning
      </text>

      {/* ============================================== */}
      {/* SECTION 1: BUILDING & OCCUPANCY DATA          */}
      {/* ============================================== */}
      <PhaseBand y={130} h={480} label="SECTION 1 — BUILDING DATA & OCCUPANCY CLASSIFICATION" color={C.red.bd} />

      <Box x={CX - 280} y={160} w={560} h={64} label="STEP 1: Fetch Building Profile"
        sub="Project: Lodha Crown Tower-B | 32F + 2B | 320 units | Height: 112.2m"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={224} x2={CX} y2={252} />

      <Box x={CX - 280} y={252} w={560} h={64} label="STEP 2: Occupancy Type & Basement Data"
        sub="High-Rise Residential | Basement Area: 8,400 m\u00B2 (2 levels) | Parking: 640 cars"
        color={C.blue} badge="DB FETCH" />
      <Arrow x1={CX} y1={316} x2={CX} y2={350} />

      <DataTable x={CX - 390} y={350}
        title={"🏗️ BUILDING PROFILE DATA SHEET"}
        headers={["Parameter", "Value", "Source", "Notes"]}
        rows={[
          ["Total Height", "112.2 m", "Architect DWG", "Including parapet"],
          ["Floors", "32F + 2B", "Area Statement", "Stilt + 32 typ"],
          ["Occupancy", "320 units", "Flat Matrix", "2/3/4 BHK mix"],
          ["Basement Area", "8,400 m\u00B2", "Architect DWG", "2 levels"],
          ["Hazard Class", "Ordinary-II", "NBC Part 4", "Per occupancy"],
          ["Built-up Area", "45,000 m\u00B2", "Area Statement", "Total"],
        ]}
        color={C.blue}
        colWidths={[200, 160, 180, 180]}
      />

      {/* ============================================== */}
      {/* SECTION 2: STANDARDS LOOKUP                   */}
      {/* ============================================== */}
      <PhaseBand y={640} h={480} label="SECTION 2 — FIRE WATER STANDARDS LOOKUP" color={C.purple.bd} />

      <Arrow x1={CX} y1={640} x2={CX} y2={680} />

      <Box x={CX - 280} y={680} w={560} h={64} label="STEP 3: Standards Database Lookup"
        sub="IS-15105 (Sprinkler) | NFPA-13 (Supplement) | IS-5290 (Hydrant) | NBC-2016"
        color={C.purple} badge="STANDARD" />
      <Arrow x1={CX} y1={744} x2={CX} y2={774} />

      <DataTable x={CX - 390} y={774}
        title={"📋 FIRE WATER VOLUME NORMS — IS-15105 / NFPA-13 / IS-5290"}
        headers={["System", "Flow (LPM)", "Duration (min)", "Volume (L)", "Volume (m\u00B3)"]}
        rows={[
          ["Sprinkler (Ordinary-II)", "1080", "60", "64,800", "64.8"],
          ["Hydrant (IS-5290)", "1800", "60", "108,000", "108.0"],
          ["Drencher/Water Curtain", "1470", "60", "88,200", "88.2"],
          ["Hose Reel (optional)", "—", "—", "—", "Incl."],
          ["Total Demand", "—", "—", "261,000", "261.0"],
        ]}
        color={C.purple}
        colWidths={[200, 120, 130, 160, 120]}
      />

      <NoteBox x={60} y={780} w={280} h={90} icon="📋" title="IS-15105 Key Provisions"
        lines={["Sec 5.2: Min 300 m\u00B3 for High-Rise", "Sec 7.1: Hydrant + Sprinkler combined", "Sec 9.3: Drencher where height > 15m", "Annex-A: Volume calculation tables"]}
        color={C.purple} />

      {/* ============================================== */}
      {/* SECTION 3: SPRINKLER VOLUME CALCULATION       */}
      {/* ============================================== */}
      <PhaseBand y={1140} h={380} label="SECTION 3 — SPRINKLER WATER VOLUME CALCULATION" color={C.teal.bd} />

      <Arrow x1={CX} y1={1130} x2={CX} y2={1180} />

      <Box x={CX - 280} y={1180} w={560} h={64} label="STEP 4: Sprinkler System Parameters"
        sub="Ordinary-II: Density 5.0 L/min/m\u00B2 | Area of Operation: 216 m\u00B2"
        color={C.teal} badge="INPUT" />
      <Arrow x1={CX} y1={1244} x2={CX} y2={1274} />

      <FormulaBlock x={CX - 340} y={1274} w={680} h={108}
        lines={[
          "Sprinkler Flow Rate:",
          "Q_spr = Design Density x Area of Operation",
          "Q_spr = 5.0 x 216 = 1,080 LPM",
          "Volume = Q_spr x Duration = 1,080 x 60 = 64,800 L = 64.8 m\u00B3",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={1382} x2={CX} y2={1412} />

      <Box x={CX - 280} y={1412} w={560} h={64}
        label="Sprinkler Water Volume = 64.8 m\u00B3"
        sub="Based on IS-15105 Ordinary Hazard Group II | 60 min duration"
        color={C.green} badge="RESULT" />

      <NoteBox x={W - 340} y={1274} w={280} h={100} icon="💡" title="K-Factor Reference"
        lines={["K-80: Standard spray", "K-115: Extended coverage", "K-160: Large drop", "K-200: ESFR heads"]}
        color={C.cyan} />

      {/* ============================================== */}
      {/* SECTION 4: HYDRANT VOLUME CALCULATION         */}
      {/* ============================================== */}
      <PhaseBand y={1540} h={380} label="SECTION 4 — HYDRANT WATER VOLUME CALCULATION" color={C.blue.bd} />

      <Arrow x1={CX} y1={1486} x2={CX} y2={1578} />

      <Box x={CX - 280} y={1578} w={560} h={64} label="STEP 5: Hydrant System Parameters"
        sub="IS-5290: 1800 LPM per hydrant | Duration: 60 min | 6 Bar residual"
        color={C.blue} badge="STANDARD" />
      <Arrow x1={CX} y1={1642} x2={CX} y2={1672} />

      <FormulaBlock x={CX - 340} y={1672} w={680} h={90}
        lines={[
          "Hydrant Water Volume:",
          "V_hyd = Flow Rate x Duration",
          "V_hyd = 1,800 x 60 = 108,000 L = 108.0 m\u00B3",
        ]}
        color={C.blue} />
      <Arrow x1={CX} y1={1762} x2={CX} y2={1792} />

      <Box x={CX - 280} y={1792} w={560} h={64}
        label="Hydrant Water Volume = 108.0 m\u00B3"
        sub="IS-5290 Standard | 1 hydrant @ 1800 LPM for 60 minutes"
        color={C.green} badge="RESULT" />

      <NoteBox x={60} y={1672} w={280} h={90} icon="🚒" title="IS-5290 Hydrant Norms"
        lines={["Single Hydrant: 900 LPM", "Double Hydrant: 1800 LPM", "Height > 30m: 1800 LPM", "Min Residual: 3.5 Bar"]}
        color={C.blue} />

      {/* ============================================== */}
      {/* SECTION 5: DRENCHER VOLUME CALCULATION        */}
      {/* ============================================== */}
      <PhaseBand y={1920} h={380} label="SECTION 5 — DRENCHER / WATER CURTAIN VOLUME" color={C.orange.bd} />

      <Arrow x1={CX} y1={1866} x2={CX} y2={1958} />

      <Box x={CX - 280} y={1958} w={560} h={64} label="STEP 6: Drencher / Water Curtain Parameters"
        sub="Linear coverage: 42.0m | Flow: 35 L/min per meter | Duration: 60 min"
        color={C.orange} badge="INPUT" />
      <Arrow x1={CX} y1={2022} x2={CX} y2={2052} />

      <FormulaBlock x={CX - 340} y={2052} w={680} h={108}
        lines={[
          "Drencher Water Volume:",
          "Q_drench = Linear Coverage x Flow per Meter",
          "Q_drench = 42.0 x 35 = 1,470 LPM",
          "V_drench = 1,470 x 60 = 88,200 L = 88.2 m\u00B3",
        ]}
        color={C.orange} />
      <Arrow x1={CX} y1={2160} x2={CX} y2={2190} />

      <Box x={CX - 280} y={2190} w={560} h={64}
        label="Drencher Water Volume = 88.2 m\u00B3"
        sub="Water curtain for building perimeter | 42m linear coverage"
        color={C.green} badge="RESULT" />

      {/* ============================================== */}
      {/* SECTION 6: 300 m\u00B3 SAFETY GATE DECISION       */}
      {/* ============================================== */}
      <PhaseBand y={2310} h={560} label="SECTION 6 — 300 m\u00B3 SAFETY GATE & TOTAL VOLUME" color={C.amber.bd} />

      <Arrow x1={CX} y1={2264} x2={CX} y2={2350} />

      <FormulaBlock x={CX - 340} y={2350} w={680} h={108}
        lines={[
          "Raw Total Fire Water Volume:",
          "V_total = V_sprinkler + V_hydrant + V_drencher",
          "V_total = 64.8 + 108.0 + 88.2 = 261.0 m\u00B3",
          "(Before safety gate check)",
        ]}
        color={C.purple} />
      <Arrow x1={CX} y1={2458} x2={CX} y2={2498} />

      {/* 300 m\u00B3 Decision Diamond */}
      <Diamond cx={CX} cy={2558} rxD={180} ryD={55}
        label="V_total \u2265 300 m\u00B3?"
        sub="IS-15105 Minimum for High-Rise" color={C.amber} />

      <Arrow x1={CX - 180} y1={2558} x2={160} y2={2558} color={C.rose.bd} label="NO (261 < 300)" />
      <NoteBox x={60} y={2522} w={260} h={90} icon="⬆️" title="Apply Safety Gate"
        lines={["261.0 m\u00B3 < 300 m\u00B3 minimum", "Round up to 300 m\u00B3", "IS-15105 Sec 5.2 mandatory"]}
        color={C.rose} />

      <Arrow x1={CX + 180} y1={2558} x2={W - 180} y2={2558} color={C.green.bd} label="YES" />
      <NoteBox x={W - 340} y={2530} w={260} h={70} icon="\u2705" title="Use Calculated"
        lines={["Use actual V_total", "No uplift required"]}
        color={C.green} />

      <Arrow x1={CX} y1={2613} x2={CX} y2={2650} />

      <FormulaBlock x={CX - 340} y={2650} w={680} h={90}
        lines={[
          "Final Fire Water Tank Volume:",
          "V_final = max(V_total, 300) = max(261.0, 300) = 300 m\u00B3",
          "Design Volume (with 10% freeboard): 300 x 1.10 = 330 m\u00B3",
        ]}
        color={C.green} />

      <Arrow x1={CX} y1={2740} x2={CX} y2={2770} />

      <Box x={CX - 280} y={2770} w={560} h={64}
        label={"Final Design Tank Volume: 330 m\u00B3"}
        sub="300 m\u00B3 usable + 10% freeboard = 330 m\u00B3 total | IS-15105 compliant"
        color={C.green} badge="OUTPUT" />

      {/* ============================================== */}
      {/* SECTION 7: TANK DIMENSIONING                  */}
      {/* ============================================== */}
      <PhaseBand y={2880} h={700} label="SECTION 7 — TANK DIMENSIONING & CONSTRUCTION TYPE" color={C.cyan.bd} />

      <Arrow x1={CX} y1={2844} x2={CX} y2={2920} />

      <Box x={CX - 280} y={2920} w={560} h={64} label="STEP 7: Tank Type Selection"
        sub="Underground RCC Tank (preferred) | Alternative: MS Welded Sectional"
        color={C.cyan} badge="DESIGN" />
      <Arrow x1={CX} y1={2984} x2={CX} y2={3014} />

      <DataTable x={CX - 390} y={3014}
        title={"📐 TANK DIMENSIONING OPTIONS"}
        headers={["Option", "L (m)", "W (m)", "D (m)", "Volume (m\u00B3)", "Type"]}
        rows={[
          ["Option A", "12.0", "9.0", "3.2", "345.6", "UG RCC"],
          ["Option B", "11.0", "10.0", "3.0", "330.0", "UG RCC"],
          ["Option C", "15.0", "7.5", "3.0", "337.5", "UG RCC"],
          ["Option D (Terrace)", "8.0", "6.0", "2.5", "120.0", "MS Sectional"],
          ["Selected: Option B", "11.0", "10.0", "3.0", "330.0", "\u2705 UG RCC"],
        ]}
        color={C.cyan}
        colWidths={[160, 90, 90, 90, 140, 130]}
      />
      <Arrow x1={CX} y1={3270} x2={CX} y2={3300} />

      <DataTable x={CX - 390} y={3300}
        title={"🏗️ TANK CONSTRUCTION SPECIFICATIONS"}
        headers={["Item", "Specification", "Standard", "Notes"]}
        rows={[
          ["Concrete Grade", "M30 (min)", "IS 456", "Waterproof concrete"],
          ["Reinforcement", "Fe 500D TMT", "IS 1786", "Anti-crack mesh"],
          ["Waterproofing", "Crystalline coat", "IS 9301", "Both sides"],
          ["Inlet DN", "150mm GI", "IS 1239", "Float valve"],
          ["Outlet DN", "200mm MS", "IS 3589", "Suction manifold"],
          ["Overflow DN", "150mm CI", "IS 1536", "To storm drain"],
          ["Vent Pipe", "100mm GI", "NBC", "Mosquito mesh"],
          ["Manhole", "600x600mm", "IS 14846", "CI Frame + Cover"],
        ]}
        color={C.teal}
        colWidths={[180, 200, 160, 180]}
      />

      {/* ============================================== */}
      {/* SECTION 8: COMPREHENSIVE OUTPUT DASHBOARD     */}
      {/* ============================================== */}
      <PhaseBand y={3640} h={600} label="SECTION 8 — FIRE TANK OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={3620} x2={CX} y2={3690} />

      {/* Dashboard KPI row */}
      <ValueBlock x={60} y={3690} w={200} h={95} label="Sprinkler Vol" value="64.8" unit="m\u00B3" color={C.teal} icon="🔥" />
      <ValueBlock x={280} y={3690} w={200} h={95} label="Hydrant Vol" value="108.0" unit="m\u00B3" color={C.blue} icon="🚒" />
      <ValueBlock x={500} y={3690} w={200} h={95} label="Drencher Vol" value="88.2" unit="m\u00B3" color={C.orange} icon="💧" />
      <ValueBlock x={720} y={3690} w={200} h={95} label="Raw Total" value="261.0" unit="m\u00B3" color={C.purple} icon="📊" />
      <ValueBlock x={940} y={3690} w={200} h={95} label="Safety Gate" value="300" unit="m\u00B3 (IS-15105)" color={C.amber} icon="⬆️" />
      <ValueBlock x={1160} y={3690} w={200} h={95} label="Design Vol" value="330" unit="m\u00B3 (+10% FB)" color={C.green} icon="\u2705" />

      {/* Volume Breakdown Visual */}
      <g>
        <rect x={60} y={3820} width={W - 120} height={200} rx={14} fill="#f0fdfa" stroke={C.teal.bd} strokeWidth={3} strokeDasharray="10,5" />
        <text x={CX} y={3850} textAnchor="middle" fill={C.teal.tx} fontSize={15} fontWeight={700}>
          {"📊"} FIRE WATER VOLUME BREAKDOWN (Stacked Bar)
        </text>

        {/* Stacked bar */}
        <rect x={120} y={3880} width={336} height={40} rx={6} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
        <text x={288} y={3905} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={700}>Sprinkler: 64.8 m\u00B3 (24.8%)</text>

        <rect x={456} y={3880} width={562} height={40} rx={6} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} />
        <text x={737} y={3905} textAnchor="middle" fill={C.blue.tx} fontSize={12} fontWeight={700}>Hydrant: 108.0 m\u00B3 (41.4%)</text>

        <rect x={1018} y={3880} width={458} height={40} rx={6} fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2} />
        <text x={1247} y={3905} textAnchor="middle" fill={C.orange.tx} fontSize={12} fontWeight={700}>Drencher: 88.2 m\u00B3 (33.8%)</text>

        {/* Safety gate indicator */}
        <line x1={120} y1={3940} x2={W - 120} y2={3940} stroke={C.amber.bd} strokeWidth={2} strokeDasharray="5,3" />
        <text x={CX} y={3968} textAnchor="middle" fill={C.amber.tx} fontSize={12} fontWeight={700}>
          IS-15105 Minimum: 300 m\u00B3 | Actual: 261.0 m\u00B3 \u2192 Rounded up to 300 m\u00B3
        </text>
        <text x={CX} y={3990} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={600}>
          With 10% Freeboard: 330 m\u00B3 | Tank Selected: 11.0m x 10.0m x 3.0m (UG RCC)
        </text>
      </g>

      {/* Final BOM */}
      <DataTable x={CX - 390} y={4060}
        title={"📦 FIRE WATER TANK — BILL OF MATERIALS"}
        headers={["Item", "Qty", "Size/Spec", "Material"]}
        rows={[
          ["Underground Fire Tank", "1", "11.0m x 10.0m x 3.0m", "RCC M30"],
          ["Suction Header", "1", "DN 200mm", "MS IS-3589"],
          ["Fill/Inlet Pipe", "1", "DN 150mm + Float Valve", "GI IS-1239"],
          ["Overflow Pipe", "1", "DN 150mm to storm drain", "CI IS-1536"],
          ["Level Indicator", "1", "Ultrasonic + Rod type", "SS304"],
          ["Access Manhole", "2", "600x600mm CI Frame", "IS 14846"],
          ["Vent Pipe", "2", "DN 100mm with mesh", "GI"],
          ["Anti-vortex Plate", "1", "Per suction nozzle", "SS316"],
        ]}
        color={C.green}
        colWidths={[200, 80, 260, 180]}
      />

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={4380} x2={CX} y2={4420} />
      <rect x={CX - 200} y={4420} width={400} height={56} rx={28}
        fill="#059669" stroke="#34d399" strokeWidth={3} />
      <text x={CX} y={4454} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"🏁"} FTK CALCULATION COMPLETE
      </text>

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 40} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        FTK-001 | Fire Tank Size Estimation | Lodha Crown Tower-B | Rev 01 | IS-15105/NFPA-13/IS-5290/NBC Part 4
      </text>
    </svg>
  );
}
