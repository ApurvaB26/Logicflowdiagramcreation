import React from "react";

// =====================================================================
// STP (SEWAGE TREATMENT PLANT) COMPREHENSIVE CALCULATION
// 3-Section Flow: Total Water Demand → Sewer Generation & STP Treatment
// → Treated Water Balance & Reuse
// Project: Multi-Tower Residential (Towers 1-14)
// Values: 1647.21 CMD Total, 1126.48 Potable, 520.73 Flush
// =====================================================================

const W = 1600;
const H = 5400;
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
  arrow:  "#94a3b8",
  reject: "#ef4444",
};

// ── Helper: Phase Band ──
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

// ── Helper: Rounded box ──
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

// ── Helper: Diamond ──
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

// ── Helper: Arrow ──
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

// ── Helper: Formula Block ──
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

// ── Helper: Note Box ──
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

// ── Reusable: Styled Data Table ──
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
  const getColW = (ci: number) => {
    if (!colWidths) return defaultColW - 6;
    return (colWidths[ci] || defaultColW) - 6;
  };

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
            const isHighlight = cell.includes("1647") || cell.includes("1126") || cell.includes("520.73");
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={getColX(ci)} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={getColW(ci)} height={rowH} rx={5}
                  fill={isTotal ? C.amber.bg : isHighlight ? C.green.bg : "#fff"}
                  stroke={isTotal ? C.amber.bd : isHighlight ? C.green.bd : "#e2e8f0"}
                  strokeWidth={isTotal || isHighlight ? 1.5 : 1} />
                <text x={getColX(ci) + getColW(ci) / 2 + 3} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle"
                  fill={isTotal ? C.amber.tx : isHighlight ? C.green.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isTotal || isHighlight ? 700 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// ── Big Value Block ──
function ValueBlock({ x, y, w, h, label, value, unit, color, icon }: {
  x: number; y: number; w: number; h: number;
  label: string; value: string; unit: string;
  color: { bg: string; bd: string; tx: string };
  icon?: string;
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

// ── Sub-flowchart: STP Capacity box ──
function STPCapacitySubChart({ x, y }: { x: number; y: number }) {
  const bw = 380, bh = 260;
  return (
    <g>
      <rect x={x} y={y} width={bw} height={bh} rx={16}
        fill="#f0fdfa" stroke={C.teal.bd} strokeWidth={3} strokeDasharray="10,5" />
      <rect x={x} y={y} width={bw} height={38} rx={16} fill={C.teal.bd} />
      <rect x={x} y={y + 26} width={bw} height={12} fill={C.teal.bd} />
      <text x={x + bw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"🏗️"} PROPOSED STP CAPACITY
      </text>

      {/* STP Input */}
      <rect x={x + 30} y={y + 52} width={bw - 60} height={36} rx={8}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} />
      <text x={x + bw / 2} y={y + 68} textAnchor="middle" fill={C.blue.tx} fontSize={12} fontWeight={700}>
        STP Input: 1478.23 CMD
      </text>
      <text x={x + bw / 2} y={y + 82} textAnchor="middle" fill={C.blue.tx} fontSize={9} opacity={0.7}>
        Total sewer generated
      </text>

      {/* Arrow */}
      <line x1={x + bw / 2} y1={y + 88} x2={x + bw / 2} y2={y + 102}
        stroke={C.teal.bd} strokeWidth={2} markerEnd="url(#stp-a)" />

      {/* +10% Buffer */}
      <rect x={x + 30} y={y + 102} width={bw - 60} height={36} rx={8}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} />
      <text x={x + bw / 2} y={y + 118} textAnchor="middle" fill={C.amber.tx} fontSize={12} fontWeight={700}>
        + 10% Extra Buffer: 147.82 CMD
      </text>
      <text x={x + bw / 2} y={y + 132} textAnchor="middle" fill={C.amber.tx} fontSize={9} opacity={0.7}>
        Safety margin for peak loads
      </text>

      {/* Arrow */}
      <line x1={x + bw / 2} y1={y + 138} x2={x + bw / 2} y2={y + 152}
        stroke={C.teal.bd} strokeWidth={2} markerEnd="url(#stp-a)" />

      {/* Total STP Capacity */}
      <rect x={x + 20} y={y + 152} width={bw - 40} height={40} rx={10}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2.5} />
      <text x={x + bw / 2} y={y + 170} textAnchor="middle" fill={C.teal.tx} fontSize={14} fontWeight={800}>
        TOTAL STP CAPACITY: 1626.06 CMD
      </text>
      <text x={x + bw / 2} y={y + 186} textAnchor="middle" fill={C.teal.tx} fontSize={9} opacity={0.7}>
        1478.23 + 147.82 = 1626.06
      </text>

      {/* Arrow */}
      <line x1={x + bw / 2} y1={y + 192} x2={x + bw / 2} y2={y + 206}
        stroke={C.teal.bd} strokeWidth={2} markerEnd="url(#stp-a)" />

      {/* Area */}
      <rect x={x + 40} y={y + 206} width={bw - 80} height={36} rx={8}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
      <text x={x + bw / 2} y={y + 222} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={700}>
        Approx Area: 1300.85 Sq.mtr
      </text>
      <text x={x + bw / 2} y={y + 236} textAnchor="middle" fill={C.purple.tx} fontSize={9} opacity={0.7}>
        @ 0.8 m²/KLD (SBR technology)
      </text>
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function STPCalcSVG() {
  const nh = 70;

  // Y positions for each section
  const Y = {
    // Master header
    header:           40,
    // Section 1: Total Water Demand
    sec1Band:         180,
    sec1Header:       210,
    demandTable:      310,
    totalDemand:      650,
    splitNode:        770,
    potableBlock:     890,
    flushBlock:       890,
    // Section 2: Sewer Generation & STP Treatment
    sec2Band:         1060,
    sec2Header:       1090,
    sewerDomBox:      1190,
    sewerDomFormula:  1290,
    sewerFlushBox:    1430,
    sewerFlushFormula:1530,
    sewerMerge:       1680,
    sewerTotal:       1770,
    stpCapacity:      1920,
    treatedWater:     2220,
    treatedFormula:   2310,
    // Section 3: Treated Water Balance & Reuse
    sec3Band:         2480,
    sec3Header:       2510,
    treatedNode:      2610,
    reuseFanout:      2740,
    reuseCards:       2790,
    excessCalc:       3100,
    // Final Summary Dashboard
    dashBand:         3310,
    dashboard:        3340,
    complianceNote:   3740,
    terminal:         3870,
  };

  const nw = 500;
  const nx = CX - nw / 2;
  const tableX = CX - 390;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="stp-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="stp-green" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
        <marker id="stp-blue" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blue.bd} />
        </marker>
        <marker id="stp-amber" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber.bd} />
        </marker>
        <marker id="stp-teal" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.teal.bd} />
        </marker>
        <marker id="stp-rose" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rose.bd} />
        </marker>
        <linearGradient id="stpHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#0891b2", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#155e75", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="stpShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="2" result="offsetblur" />
          <feFlood floodColor="#000000" floodOpacity="0.12" />
          <feComposite in2="offsetblur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ════════════════════════════════════════════════════ */}
      {/* MASTER HEADER                                       */}
      {/* ════════════════════════════════════════════════════ */}
      <g>
        <rect x={40} y={Y.header} width={W - 80} height={100} fill="url(#stpHeaderGrad)" stroke="#155e75" strokeWidth={3} rx={12} filter="url(#stpShadow)" />
        <text x={80} y={Y.header + 32} fontSize={28} fontWeight={800} fill="#ffffff">
          {"🏭"} STP — SEWAGE TREATMENT PLANT CALCULATION
        </text>
        <text x={80} y={Y.header + 56} fontSize={14} fontWeight={600} fill="#a5f3fc">
          Total Water Demand → Sewer Generation → STP Sizing → Treated Water Balance & Reuse
        </text>
        <text x={80} y={Y.header + 78} fontSize={12} fontWeight={500} fill="#67e8f9">
          Project: Multi-Tower Residential Complex (Towers 1–14) | Standards: CPHEEO Manual / NBC 2016 / CPCB Guidelines / IS 1172
        </text>
        <rect x={W - 260} y={Y.header + 10} width={170} height={32} rx={16} fill="#ffffff" opacity={0.15} />
        <text x={W - 175} y={Y.header + 30} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
          {"📐"} 3-SECTION FLOW
        </text>
      </g>

      {/* ════════════════════════════════════════════════════ */}
      {/* SECTION 1: TOTAL WATER DEMAND                       */}
      {/* ════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.sec1Band} h={Y.sec2Band - Y.sec1Band - 20} label="SECTION 1 — TOTAL WATER DEMAND (CMD) — Towers 1–14" color={C.blue.bd} />

      <Box x={nx} y={Y.sec1Header} w={nw} h={nh}
        label="TOTAL PROJECT WATER DEMAND (CMD)"
        sub="Multi-Tower Residential — Towers 1 through 14"
        color={C.blue} badge="SECTION 1" />
      <Arrow x1={CX} y1={Y.sec1Header + nh} x2={CX} y2={Y.demandTable} />

      {/* Occupancy Breakdown Table */}
      <DataTable x={tableX} y={Y.demandTable}
        title={"📊 OCCUPANCY-WISE WATER DEMAND BREAKDOWN — Towers 1–14"}
        headers={["Occupancy Type", "Units", "Persons/Unit", "Total Persons", "L/Person/Day", "Demand (CMD)"]}
        colWidths={[160, 90, 110, 120, 120, 180]}
        rows={[
          ["Studio",    "200", "3.0", "600",   "135", "81.00"],
          ["1 BHK",     "300", "4.0", "1,200", "135", "162.00"],
          ["2 BHK",     "400", "5.0", "2,000", "135", "270.00"],
          ["3 BHK",     "200", "5.0", "1,000", "135", "135.00"],
          ["Penthouse", "50",  "6.0", "300",   "150", "45.00"],
          ["Amenity Club", "—", "—",  "500",   "45",  "22.50"],
          ["Swimming Pool", "2", "—",  "—",    "—",   "30.00"],
          ["Landscape/Irrig.", "—", "—", "—",  "—",   "112.00"],
          ["Commercial", "80", "—",   "400",   "45",  "18.00"],
          ["Staff/Service", "—", "—",  "350",  "45",  "15.75"],
          ["Firefighting Reserve", "—", "—", "—", "—", "10.00"],
          ["TOTAL PROJECT", "1,232+", "—", "6,350+", "—", "1,647.21"],
        ]}
        color={C.blue}
      />

      <NoteBox x={CX + 310} y={Y.demandTable + 60} w={240} h={100}
        icon="📋" title="Standards Applied"
        lines={["IS 1172:1993", "NBC 2016 Part 8", "CPHEEO Manual 2016", "Local Body Norms"]}
        color={C.violet} />
      <line x1={tableX + 780} y1={Y.demandTable + 110} x2={CX + 310} y2={Y.demandTable + 110}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      {/* Total Demand result */}
      <Arrow x1={CX} y1={Y.demandTable + 440} x2={CX} y2={Y.totalDemand} />

      <g>
        <rect x={CX - 260} y={Y.totalDemand} width={520} height={80} rx={14}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} filter="url(#stpShadow)" />
        <text x={CX} y={Y.totalDemand + 28} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>
          {"💧"} TOTAL PROJECT WATER DEMAND
        </text>
        <text x={CX} y={Y.totalDemand + 52} textAnchor="middle" fill={C.green.bd} fontSize={26} fontWeight={800}>
          1,647.21 CMD
        </text>
        <text x={CX} y={Y.totalDemand + 70} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.7}>
          Cubic Metres per Day (all towers combined)
        </text>
      </g>

      {/* Split node */}
      <Arrow x1={CX} y1={Y.totalDemand + 80} x2={CX} y2={Y.splitNode} />

      <Diamond cx={CX} cy={Y.splitNode} rxD={200} ryD={46}
        label="DEMAND SPLIT"
        sub="Potable vs. Flushing"
        color={C.amber} />

      {/* Left branch: Potable Water (68.4%) */}
      <path d={`M${CX - 140},${Y.splitNode + 35} L${CX - 340},${Y.splitNode + 35} L${CX - 340},${Y.potableBlock}`}
        fill="none" stroke={C.blue.bd} strokeWidth={2.5} markerEnd="url(#stp-blue)" />
      <g>
        <rect x={CX - 380} y={Y.splitNode + 15} width={80} height={20} rx={4} fill="#fff" opacity={0.92} />
        <text x={CX - 340} y={Y.splitNode + 29} textAnchor="middle" fill={C.blue.bd} fontSize={11} fontWeight={700}>68.4%</text>
      </g>

      <ValueBlock x={CX - 520} y={Y.potableBlock} w={360} h={100}
        label="POTABLE WATER (68.4%)"
        value="1,126.48" unit="CMD — Domestic / Drinking / Cooking"
        color={C.blue} icon="🚰" />

      <NoteBox x={CX - 520} y={Y.potableBlock + 115} w={360} h={60}
        icon="💡" title="Potable = Total × 0.684"
        lines={["1,647.21 × 0.684 = 1,126.48 CMD"]}
        color={C.blue} />

      {/* Right branch: Flush Water (31.6%) */}
      <path d={`M${CX + 140},${Y.splitNode + 35} L${CX + 340},${Y.splitNode + 35} L${CX + 340},${Y.flushBlock}`}
        fill="none" stroke={C.amber.bd} strokeWidth={2.5} markerEnd="url(#stp-amber)" />
      <g>
        <rect x={CX + 300} y={Y.splitNode + 15} width={80} height={20} rx={4} fill="#fff" opacity={0.92} />
        <text x={CX + 340} y={Y.splitNode + 29} textAnchor="middle" fill={C.amber.bd} fontSize={11} fontWeight={700}>31.6%</text>
      </g>

      <ValueBlock x={CX + 160} y={Y.flushBlock} w={360} h={100}
        label="FLUSH WATER (31.6%)"
        value="520.73" unit="CMD — Toilet Flushing"
        color={C.amber} icon="🚿" />

      <NoteBox x={CX + 160} y={Y.flushBlock + 115} w={360} h={60}
        icon="💡" title="Flush = Total × 0.316"
        lines={["1,647.21 × 0.316 = 520.73 CMD"]}
        color={C.amber} />

      {/* ════════════════════════════════════════════════════ */}
      {/* SECTION 2: SEWER GENERATION & STP TREATMENT          */}
      {/* ════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.sec2Band} h={Y.sec3Band - Y.sec2Band - 20} label="SECTION 2 — SEWER GENERATION & STP TREATMENT" color={C.teal.bd} />

      <Box x={nx} y={Y.sec2Header} w={nw} h={nh}
        label="SEWER GENERATION ENGINE"
        sub="85% Domestic + 100% Flushing → Total Sewage Calculation"
        color={C.teal} badge="SECTION 2" />

      {/* Potable path into Sewer calculation (left side) */}
      <Arrow x1={CX - 340} y1={Y.potableBlock + 175} x2={CX - 340} y2={Y.sewerDomBox} color={C.blue.bd} />

      <g>
        <rect x={CX - 540} y={Y.sewerDomBox} width={400} height={70} rx={12}
          fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2.5} />
        <text x={CX - 340} y={Y.sewerDomBox + 26} textAnchor="middle" fill={C.blue.tx} fontSize={14} fontWeight={700}>
          SEWER from Domestic (85%)
        </text>
        <text x={CX - 340} y={Y.sewerDomBox + 46} textAnchor="middle" fill={C.blue.tx} fontSize={12} opacity={0.8}>
          0.85 × 1,126.48 = 957.51 CMD
        </text>
        <text x={CX - 340} y={Y.sewerDomBox + 62} textAnchor="middle" fill={C.blue.tx} fontSize={10} opacity={0.6}>
          15% consumed/evaporated/absorbed
        </text>
      </g>

      <Arrow x1={CX - 340} y1={Y.sewerDomBox + 70} x2={CX - 340} y2={Y.sewerDomFormula} color={C.blue.bd} />

      <FormulaBlock x={CX - 540} y={Y.sewerDomFormula} w={400} h={90}
        lines={[
          "S_domestic = Potable × 0.85",
          "= 1,126.48 × 0.85",
          "= 957.51 CMD",
          "Source: CPHEEO Manual 2016",
        ]}
        color={C.blue} />

      {/* Flush path into Sewer calculation (right side) */}
      <Arrow x1={CX + 340} y1={Y.flushBlock + 175} x2={CX + 340} y2={Y.sewerFlushBox} color={C.amber.bd} />

      <g>
        <rect x={CX + 140} y={Y.sewerFlushBox} width={400} height={70} rx={12}
          fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2.5} />
        <text x={CX + 340} y={Y.sewerFlushBox + 26} textAnchor="middle" fill={C.amber.tx} fontSize={14} fontWeight={700}>
          SEWER from Flushing (100%)
        </text>
        <text x={CX + 340} y={Y.sewerFlushBox + 46} textAnchor="middle" fill={C.amber.tx} fontSize={12} opacity={0.8}>
          1.00 × 520.73 = 520.73 CMD
        </text>
        <text x={CX + 340} y={Y.sewerFlushBox + 62} textAnchor="middle" fill={C.amber.tx} fontSize={10} opacity={0.6}>
          100% enters sewage — no loss
        </text>
      </g>

      <Arrow x1={CX + 340} y1={Y.sewerFlushBox + 70} x2={CX + 340} y2={Y.sewerFlushFormula} color={C.amber.bd} />

      <FormulaBlock x={CX + 140} y={Y.sewerFlushFormula} w={400} h={90}
        lines={[
          "S_flushing = Flush × 1.00",
          "= 520.73 × 1.00",
          "= 520.73 CMD",
          "All flush water → STP inlet",
        ]}
        color={C.amber} />

      {/* Merge lines to center */}
      <path d={`M${CX - 340},${Y.sewerDomFormula + 90} L${CX - 340},${Y.sewerMerge} L${CX},${Y.sewerMerge}`}
        fill="none" stroke={C.blue.bd} strokeWidth={2.5} />
      <path d={`M${CX + 340},${Y.sewerFlushFormula + 90} L${CX + 340},${Y.sewerMerge} L${CX},${Y.sewerMerge}`}
        fill="none" stroke={C.amber.bd} strokeWidth={2.5} />

      {/* Merge indicator circle */}
      <circle cx={CX} cy={Y.sewerMerge} r={18} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={3} />
      <text x={CX} y={Y.sewerMerge + 5} textAnchor="middle" fill={C.teal.tx} fontSize={16} fontWeight={800}>+</text>

      <Arrow x1={CX} y1={Y.sewerMerge + 18} x2={CX} y2={Y.sewerTotal} color={C.teal.bd} />

      {/* Total Sewer Generated */}
      <g>
        <rect x={CX - 280} y={Y.sewerTotal} width={560} height={100} rx={16}
          fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={3} filter="url(#stpShadow)" />
        <text x={CX} y={Y.sewerTotal + 24} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={700}>
          {"🔗"} TOTAL SEWER GENERATED / STP INPUT (CMD)
        </text>
        <text x={CX} y={Y.sewerTotal + 52} textAnchor="middle" fill={C.teal.bd} fontSize={28} fontWeight={800}>
          1,478.23 CMD
        </text>
        <text x={CX} y={Y.sewerTotal + 72} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={600}>
          957.51 (Domestic) + 520.73 (Flushing)
        </text>
        <text x={CX} y={Y.sewerTotal + 88} textAnchor="middle" fill={C.teal.tx} fontSize={10} opacity={0.6}>
          This feeds into STP capacity sizing & treated water output
        </text>
      </g>

      {/* Branch to STP Capacity sub-chart (right side) */}
      <path d={`M${CX + 280},${Y.sewerTotal + 50} L${CX + 360},${Y.sewerTotal + 50} L${CX + 360},${Y.stpCapacity}`}
        fill="none" stroke={C.teal.bd} strokeWidth={2.5} strokeDasharray="8,4" markerEnd="url(#stp-teal)" />
      <g>
        <rect x={CX + 290} y={Y.sewerTotal + 36} width={60} height={18} rx={4} fill="#fff" opacity={0.92} />
        <text x={CX + 320} y={Y.sewerTotal + 49} textAnchor="middle" fill={C.teal.bd} fontSize={9} fontWeight={700}>SIZING</text>
      </g>

      <STPCapacitySubChart x={CX + 180} y={Y.stpCapacity} />

      {/* Main flow continues down to Treated Water */}
      <Arrow x1={CX} y1={Y.sewerTotal + 100} x2={CX} y2={Y.treatedWater} />

      <g>
        <rect x={CX - 300} y={Y.treatedWater} width={340} height={70} rx={12}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
        <text x={CX - 130} y={Y.treatedWater + 24} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>
          Treated Water Generated
        </text>
        <text x={CX - 130} y={Y.treatedWater + 44} textAnchor="middle" fill={C.green.tx} fontSize={11}>
          90% Efficiency of STP Treatment
        </text>
        <text x={CX - 130} y={Y.treatedWater + 62} textAnchor="middle" fill={C.green.bd} fontSize={10} fontWeight={600}>
          Technology: SBR (Sequencing Batch Reactor)
        </text>
      </g>

      <Arrow x1={CX - 130} y1={Y.treatedWater + 70} x2={CX - 130} y2={Y.treatedFormula} color={C.green.bd} />

      <FormulaBlock x={CX - 370} y={Y.treatedFormula} w={480} h={110}
        lines={[
          "Treated Water = STP Input × Efficiency",
          "= 1,478.23 × 0.90",
          "= 1,330.41 CMD",
          "Remaining 10% = sludge + process losses",
          "Reject: 1,478.23 − 1,330.41 = 147.82 CMD",
        ]}
        color={C.green} />

      <NoteBox x={CX + 160} y={Y.treatedFormula} w={260} h={100}
        icon="♻️" title="90% SBR Efficiency"
        lines={["BOD Removal: 95–98%", "TSS < 10 mg/L", "CPCB Compliant Output", "Reuse-grade water"]}
        color={C.green} />
      <line x1={CX + 110} y1={Y.treatedFormula + 50} x2={CX + 160} y2={Y.treatedFormula + 50}
        stroke={C.green.bd} strokeWidth={2} strokeDasharray="5,3" />

      {/* ════════════════════════════════════════════════════ */}
      {/* SECTION 3: TREATED WATER BALANCE & REUSE             */}
      {/* ════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.sec3Band} h={Y.dashBand - Y.sec3Band - 20} label="SECTION 3 — TREATED WATER BALANCE & REUSE" color={C.green.bd} />

      <Box x={nx - 50} y={Y.sec3Header} w={nw + 100} h={nh}
        label="TREATED WATER DISTRIBUTION"
        sub="Allocate 1,330.41 CMD across reuse purposes"
        color={C.green} badge="SECTION 3" />

      <Arrow x1={CX - 130} y1={Y.treatedFormula + 110} x2={CX} y2={Y.sec3Header} />

      {/* Treated Water Source Node */}
      <g>
        <rect x={CX - 200} y={Y.treatedNode} width={400} height={70} rx={14}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} filter="url(#stpShadow)" />
        <text x={CX} y={Y.treatedNode + 26} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
          {"♻️"} TREATED WATER AVAILABLE
        </text>
        <text x={CX} y={Y.treatedNode + 50} textAnchor="middle" fill={C.green.bd} fontSize={22} fontWeight={800}>
          1,330.41 CMD
        </text>
        <text x={CX} y={Y.treatedNode + 64} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.7}>
          SBR-treated, reuse-grade quality
        </text>
      </g>

      <Arrow x1={CX} y1={Y.treatedNode + 70} x2={CX} y2={Y.reuseFanout} />

      {/* Fan-out bar */}
      <line x1={CX} y1={Y.reuseFanout} x2={CX} y2={Y.reuseFanout + 20}
        stroke={C.arrow} strokeWidth={2.5} />

      {/* 4 Reuse branches */}
      {(() => {
        const branches = [
          { label: "FLUSHING PURPOSE",    sub: "100% of Requirement",       value: "520.73 CMD",  pct: "39.1%", color: C.blue,  icon: "🚿", note: "Loops back to Section 1 flush req." },
          { label: "IRRIGATION PURPOSE",  sub: "Landscape & Garden",        value: "112.00 CMD",  pct: "8.4%",  color: C.green, icon: "🌱", note: "Fixed landscape area demand" },
          { label: "SLUDGE (5% STP IN)",  sub: "5% of STP Input",          value: "73.91 CMD",   pct: "5.6%",  color: C.slate, icon: "🪨", note: "1,478.23 × 0.05 = 73.91" },
          { label: "EXCESS → SEWER",      sub: "Discharged to Muni. Sewer", value: "623.77 CMD",  pct: "46.9%", color: C.rose,  icon: "🔻", note: "1,330.41 − (520.73+112+73.91)" },
        ];
        const cardW = 300, cardH = 190, gapX = 24;
        const totalBW = branches.length * cardW + (branches.length - 1) * gapX;
        const sx = CX - totalBW / 2;
        const barY = Y.reuseFanout + 20;
        const centers = branches.map((_, i) => sx + i * (cardW + gapX) + cardW / 2);

        return (
          <g>
            {/* Horizontal bar */}
            <line x1={centers[0]} y1={barY} x2={centers[centers.length - 1]} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            {/* Drop-down arrows to each card */}
            {centers.map((cx, i) => (
              <line key={`drop-${i}`} x1={cx} y1={barY} x2={cx} y2={barY + 30}
                stroke={branches[i].color.bd} strokeWidth={2.5} markerEnd="url(#stp-a)" />
            ))}
            {/* Cards */}
            {branches.map((b, i) => {
              const bx = sx + i * (cardW + gapX);
              const by = barY + 30;
              return (
                <g key={`br-${i}`}>
                  <rect x={bx} y={by} width={cardW} height={cardH} rx={14}
                    fill={b.color.bg} stroke={b.color.bd} strokeWidth={2.5} />
                  {/* Header bar */}
                  <rect x={bx} y={by} width={cardW} height={34} rx={14} fill={b.color.bd} />
                  <rect x={bx} y={by + 20} width={cardW} height={14} fill={b.color.bd} />
                  <text x={bx + cardW / 2} y={by + 22} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                    {b.icon} {b.label}
                  </text>
                  {/* Percentage badge */}
                  <rect x={bx + cardW - 60} y={by + 40} width={50} height={18} rx={9} fill={b.color.bd} opacity={0.2} />
                  <text x={bx + cardW - 35} y={by + 52} textAnchor="middle" fill={b.color.bd} fontSize={10} fontWeight={700}>{b.pct}</text>
                  {/* Sub description */}
                  <text x={bx + cardW / 2} y={by + 58} textAnchor="middle" fill={b.color.tx} fontSize={11} fontWeight={600}>
                    {b.sub}
                  </text>
                  {/* Big value */}
                  <text x={bx + cardW / 2} y={by + 90} textAnchor="middle" fill={b.color.bd} fontSize={24} fontWeight={800}>
                    {b.value}
                  </text>
                  {/* Formula / note */}
                  <rect x={bx + 10} y={by + 110} width={cardW - 20} height={36} rx={8}
                    fill="#fff" stroke={b.color.bd} strokeWidth={1} strokeDasharray="4,3" />
                  <text x={bx + cardW / 2} y={by + 132} textAnchor="middle" fill={b.color.tx} fontSize={10} fontWeight={500}>
                    {b.note}
                  </text>
                  {/* Status */}
                  <rect x={bx + cardW / 2 - 40} y={by + 155} width={80} height={22} rx={11} fill={b.color.bd} opacity={0.15} />
                  <text x={bx + cardW / 2} y={by + 169} textAnchor="middle" fill={b.color.bd} fontSize={10} fontWeight={700}>ALLOCATED</text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Flushing loop-back arrow (left card → annotation) */}
      <NoteBox x={40} y={Y.reuseCards + 230} w={260} h={80}
        icon="🔄" title="Flushing Loop-Back"
        lines={["520.73 CMD recycled back to", "match Section 1 Flush Demand", "Zero fresh water for flushing!"]}
        color={C.blue} />

      {/* Excess Discharge Calculation Detail */}
      <Arrow x1={CX} y1={Y.reuseCards + 230} x2={CX} y2={Y.excessCalc} />

      <g>
        <rect x={CX - 380} y={Y.excessCalc} width={760} height={140} rx={14}
          fill="#fff8f8" stroke={C.rose.bd} strokeWidth={3} />
        <rect x={CX - 380} y={Y.excessCalc} width={760} height={38} rx={14} fill={C.rose.bd} />
        <rect x={CX - 380} y={Y.excessCalc + 26} width={760} height={12} fill={C.rose.bd} />
        <text x={CX} y={Y.excessCalc + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
          {"🔻"} EXCESS DISCHARGE CALCULATION — Water Balance Verification
        </text>

        <text x={CX - 340} y={Y.excessCalc + 62} fill={C.rose.tx} fontSize={12} fontWeight={700} fontFamily="monospace">
          Treated Water Available:           1,330.41 CMD
        </text>
        <text x={CX - 340} y={Y.excessCalc + 82} fill={C.blue.tx} fontSize={12} fontWeight={600} fontFamily="monospace">
          − Flushing Reuse:                   520.73 CMD
        </text>
        <text x={CX - 340} y={Y.excessCalc + 98} fill={C.green.tx} fontSize={12} fontWeight={600} fontFamily="monospace">
          − Irrigation:                       112.00 CMD
        </text>
        <text x={CX - 340} y={Y.excessCalc + 114} fill={C.slate.tx} fontSize={12} fontWeight={600} fontFamily="monospace">
          − Sludge (5% of 1,478.23):           73.91 CMD
        </text>
        <line x1={CX - 340} y1={Y.excessCalc + 120} x2={CX + 340} y2={Y.excessCalc + 120}
          stroke={C.rose.bd} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={CX - 340} y={Y.excessCalc + 136} fill={C.rose.bd} fontSize={14} fontWeight={800} fontFamily="monospace">
          = EXCESS DISCHARGED TO SEWER:       623.77 CMD
        </text>
      </g>

      {/* ════════════════════════════════════════════════════ */}
      {/* FINAL SUMMARY DASHBOARD                              */}
      {/* ════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.dashBand} h={Y.terminal - Y.dashBand + 80} label="FINAL OUTPUT — STP DESIGN SUMMARY DASHBOARD" color={C.teal.bd} />

      <Arrow x1={CX} y1={Y.excessCalc + 140} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      {(() => {
        const dx = 60, dw = W - 120, dy = Y.dashboard;
        const cards = [
          { label: "Total Water\nDemand", value: "1,647.21", unit: "CMD", icon: "💧", color: C.blue },
          { label: "Total Sewer\nGenerated", value: "1,478.23", unit: "CMD", icon: "🔗", color: C.amber },
          { label: "STP Capacity\n(+10%)", value: "1,626.06", unit: "CMD", icon: "🏗️", color: C.teal },
          { label: "Treated Water\nOutput", value: "1,330.41", unit: "CMD", icon: "♻️", color: C.green },
          { label: "STP Area\nRequired", value: "1,300.85", unit: "Sq.mtr", icon: "📐", color: C.purple },
        ];
        const reuse = [
          { label: "Flushing Reuse", value: "520.73 CMD", color: C.blue },
          { label: "Irrigation", value: "112.00 CMD", color: C.green },
          { label: "Sludge", value: "73.91 CMD", color: C.slate },
          { label: "Excess Discharge", value: "623.77 CMD", color: C.rose },
        ];
        const cardW = (dw - 60) / cards.length;
        const reuseW = (dw - 60) / reuse.length;

        return (
          <g>
            <rect x={dx} y={dy} width={dw} height={340} rx={16}
              fill="#f8fafc" stroke={C.teal.bd} strokeWidth={3} />
            <rect x={dx} y={dy} width={dw} height={44} rx={16} fill={C.teal.bd} />
            <rect x={dx} y={dy + 30} width={dw} height={14} fill={C.teal.bd} />
            <text x={CX} y={dy + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
              {"📊"} STP FINAL OUTPUT DASHBOARD — Complete Sewage & Reuse Summary
            </text>

            {/* Top row: 5 KPI cards */}
            {cards.map((c, i) => {
              const cx = dx + 12 + i * (cardW + 8);
              const cy = dy + 56;
              return (
                <g key={`dc-${i}`}>
                  <rect x={cx} y={cy} width={cardW} height={90} rx={10}
                    fill={c.color.bg} stroke={c.color.bd} strokeWidth={2} />
                  <text x={cx + cardW / 2} y={cy + 18} textAnchor="middle" fontSize={18}>{c.icon}</text>
                  <text x={cx + cardW / 2} y={cy + 36} textAnchor="middle" fill={c.color.tx} fontSize={10} fontWeight={600}>
                    {c.label.split("\n")[0]}
                  </text>
                  <text x={cx + cardW / 2} y={cy + 48} textAnchor="middle" fill={c.color.tx} fontSize={10} fontWeight={600}>
                    {c.label.split("\n")[1]}
                  </text>
                  <text x={cx + cardW / 2} y={cy + 68} textAnchor="middle" fill={c.color.bd} fontSize={16} fontWeight={800}>
                    {c.value}
                  </text>
                  <text x={cx + cardW / 2} y={cy + 82} textAnchor="middle" fill={c.color.tx} fontSize={9} opacity={0.7}>
                    {c.unit}
                  </text>
                </g>
              );
            })}

            {/* Separator */}
            <line x1={dx + 20} y1={dy + 160} x2={dx + dw - 20} y2={dy + 160}
              stroke="#e2e8f0" strokeWidth={1.5} />
            <text x={CX} y={dy + 178} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight={600}>
              TREATED WATER REUSE ALLOCATION
            </text>

            {/* Bottom row: 4 reuse metric cards */}
            {reuse.map((r, i) => {
              const rx = dx + 12 + i * (reuseW + 10);
              const ry = dy + 192;
              return (
                <g key={`rm-${i}`}>
                  <rect x={rx} y={ry} width={reuseW} height={56} rx={10}
                    fill={r.color.bg} stroke={r.color.bd} strokeWidth={2} />
                  <text x={rx + reuseW / 2} y={ry + 22} textAnchor="middle"
                    fill={r.color.tx} fontSize={12} fontWeight={700}>{r.label}</text>
                  <text x={rx + reuseW / 2} y={ry + 42} textAnchor="middle"
                    fill={r.color.bd} fontSize={15} fontWeight={800}>{r.value}</text>
                </g>
              );
            })}

            {/* Formula summary line */}
            <text x={CX} y={dy + 274} textAnchor="middle" fill={C.teal.tx} fontSize={10} opacity={0.6}>
              Sewer = Potable×0.85 + Flush×1.00 | STP Cap = Sewer + 10% | Treated = STP Input × 0.90 | Excess = Treated − Σ(Reuse)
            </text>

            {/* Compliance bar */}
            <rect x={dx + 20} y={dy + 290} width={dw - 40} height={36} rx={8}
              fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1.5} />
            <text x={CX} y={dy + 308} textAnchor="middle" fill={C.violet.tx} fontSize={11} fontWeight={700}>
              {"✅"} Compliance: CPCB Guidelines | NBC 2016 | State PCB Discharge Norms | IS 11624 | CPHEEO Manual
            </text>
            <text x={CX} y={dy + 322} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
              Export → Concept Report | STP Room Drawing | BOQ Input | IGBC/GRIHA Water Credit Submission
            </text>
          </g>
        );
      })()}

      {/* Terminal */}
      <Arrow x1={CX} y1={Y.dashboard + 340} x2={CX} y2={Y.terminal} />

      <Box x={CX - 220} y={Y.terminal} w={440} h={60}
        label="STP CALCULATION COMPLETE"
        sub="All outputs locked → Export to Report & BOQ"
        color={C.teal} badge="DONE" rx={30} />
    </svg>
  );
}
