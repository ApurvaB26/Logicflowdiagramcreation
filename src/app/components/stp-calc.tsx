import React from "react";

// =====================================================================
// STP (Sewage Treatment Plant) CALCULATOR — Custom SVG Flow Diagram
// Full architecture: Project Data → Water Demand Cross-Link →
// Sewer Generation (80/100 Rule) → STP Technology Selection →
// Capacity Sizing → Area Calculation → Treated Water Reuse →
// Excess Discharge → Compliance Check → Output Dashboard
// =====================================================================

const W = 1600;
const H = 8200;
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
  const tw = 780, colW = tw / headers.length;
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
            const isFetch = cell === "Fetched";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAuto ? C.green.bg : isFetch ? C.blue.bg : "#fff"}
                  stroke={isAuto ? C.green.bd : isFetch ? C.blue.bd : "#e2e8f0"}
                  strokeWidth={isAuto || isFetch ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle"
                  fill={isAuto ? C.green.tx : isFetch ? C.blue.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isAuto || isFetch ? 600 : 400}>{cell}</text>
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

// STP Technology comparison table
function TechCompareTable({ x, y }: { x: number; y: number }) {
  const tw = 900, th = 240;
  const headers = ["Technology", "Area (m²/KLD)", "Power (kW/KLD)", "BOD Removal", "Sludge", "Cost Index"];
  const rows = [
    ["SBR", "0.8–1.0", "0.6–0.8", "95–98%", "Low", "Medium"],
    ["MBR", "0.5–0.7", "1.0–1.5", "98–99%", "Very Low", "High"],
    ["MBBR", "0.8–1.2", "0.5–0.7", "90–95%", "Medium", "Medium"],
    ["Extended Aeration", "1.2–1.5", "0.8–1.0", "85–92%", "High", "Low"],
    ["RBC", "1.0–1.3", "0.3–0.5", "80–90%", "Medium", "Low"],
  ];
  const colW = tw / 6;
  const rowH = 28;
  const hdrY = y + 50;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={C.cyan.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={C.cyan.bd} />
      <text x={x + 18} y={y + 20} fill="#fff" fontSize={13} fontWeight={700}>
        {"⚙️"} STP TECHNOLOGY COMPARISON — Auto-selection based on project parameters
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        System evaluates area constraint, power budget & treatment quality requirements
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 19} textAnchor="middle"
            fill={C.cyan.tx} fontSize={10} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isHighlight = ri === 0; // SBR as default recommendation
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isHighlight ? C.teal.bg : "#fff"}
                  stroke={isHighlight ? C.teal.bd : "#e2e8f0"} strokeWidth={isHighlight ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 20}
                  textAnchor="middle"
                  fill={isHighlight ? C.teal.tx : "#64748b"} fontSize={10}
                  fontWeight={isHighlight ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// Final dashboard
function STPDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1000, dh = 300;
  const sections = [
    { label: "Total Sewage\nGenerated", icon: "💧", color: C.blue },
    { label: "Proposed STP\nCapacity", icon: "🏭", color: C.teal },
    { label: "Treated Water\nOutput", icon: "♻️", color: C.green },
    { label: "Area Required\n(Sq.m)", icon: "📐", color: C.purple },
    { label: "Power Required\n(kW)", icon: "⚡", color: C.amber },
  ];
  const metrics = [
    { label: "Flushing Reuse", value: "XX KLD", color: C.blue },
    { label: "Irrigation", value: "XX KLD", color: C.green },
    { label: "CT Makeup", value: "XX KLD", color: C.cyan },
    { label: "Excess Discharge", value: "XX KLD", color: C.rose },
  ];
  const cardW = (dw - 60) / 5;
  const metricW = (dw - 60) / 4;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.teal.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.teal.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.teal.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"📊"} STP FINAL OUTPUT DASHBOARD — Complete Sewage & Reuse Summary
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
      <text x={x + dw / 2} y={y + 200} textAnchor="middle" fill={C.teal.tx} fontSize={10} opacity={0.6}>
        Sewage = DW×0.80 + FW×1.00 | STP Cap = Sewage + 10% safety | Reuse priority: Flushing → Irrigation → CT
      </text>
      <rect x={x + 20} y={y + 220} width={dw - 40} height={56} rx={8}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1.5} />
      <text x={x + dw / 2} y={y + 240} textAnchor="middle" fill={C.violet.tx} fontSize={12} fontWeight={700}>
        ✅ Compliance: CPCB Guidelines | NBC 2016 | State PCB Discharge Norms | IS 11624
      </text>
      <text x={x + dw / 2} y={y + 256} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
        Export → Concept Report | STP Room Drawing | BOQ Input | IGBC/GRIHA Water Credit Submission
      </text>
      <text x={x + dw / 2} y={y + 270} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
        Cross-links → Water Demand (P3A) for flushing balance | OWC for leachate input
      </text>
    </g>
  );
}


// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function STPCalcSVG() {
  const nh = 70;

  const Y = {
    entry:          50,
    // Section 1: Data Integration
    mod1Header:     200,
    fetchTable:     320,
    crossLink:      650,
    // Section 2: Sewer Generation (80/100)
    mod2Header:     820,
    sewDomFormula:  940,
    sewFlushFormula:1120,
    sewTotal:       1300,
    sewBreakdown:   1410,
    // Section 3: Safety & Peak Factor
    peakHeader:     1720,
    peakDecision:   1860,
    peakYes:        1980,
    peakNo:         1980,
    peakConverge:   2130,
    // Section 4: Technology Selection
    techHeader:     2250,
    techTable:      2370,
    techDecision:   2680,
    techAuto:       2800,
    techManual:     2800,
    techConverge:   2950,
    // Section 5: STP Capacity & Area
    capHeader:      3070,
    capFormula:     3190,
    areaFormula:    3360,
    powerFormula:   3530,
    // Section 6: Treated Water Quality
    qualityHeader:  3700,
    qualityTable:   3820,
    qualityDecision:4160,
    qualityPass:    4280,
    qualityFail:    4280,
    qualityConverge:4430,
    // Section 7: Reuse Strategy
    reuseHeader:    4550,
    reuseStreams:    4700,
    reuseBalance:   4960,
    // Section 8: Excess Discharge
    excessHeader:   5130,
    excessFormula:  5250,
    excessDecision: 5420,
    excessSewer:    5540,
    excessWater:    5540,
    excessConverge: 5690,
    // Section 9: Sludge Handling
    sludgeHeader:   5800,
    sludgeCalc:     5920,
    sludgeDisposal: 6090,
    // Section 10: Dashboard
    dashboard:      6280,
    terminal:       6630,
  };

  const nw = 440;
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
        <marker id="stp-red" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
        </marker>
      </defs>

      {/* PHASE BANDS */}
      <PhaseBand y={Y.entry - 15}         h={120} label="ENTRY — STP CALCULATION MODULE" color={C.blue.bd} />
      <PhaseBand y={Y.mod1Header - 20}    h={Y.mod2Header - Y.mod1Header - 30} label="SECTION 1 — DATA INTEGRATION (CROSS-MODULE FETCH)" color={C.purple.bd} />
      <PhaseBand y={Y.mod2Header - 20}    h={Y.peakHeader - Y.mod2Header - 30} label="SECTION 2 — SEWER GENERATION ENGINE (80/100 RULE)" color={C.amber.bd} />
      <PhaseBand y={Y.peakHeader - 20}    h={Y.techHeader - Y.peakHeader - 30} label="SECTION 3 — PEAK FACTOR & SAFETY MARGIN" color={C.orange.bd} />
      <PhaseBand y={Y.techHeader - 20}    h={Y.capHeader - Y.techHeader - 30} label="SECTION 4 — STP TECHNOLOGY SELECTION" color={C.cyan.bd} />
      <PhaseBand y={Y.capHeader - 20}     h={Y.qualityHeader - Y.capHeader - 30} label="SECTION 5 — STP CAPACITY, AREA & POWER SIZING" color={C.teal.bd} />
      <PhaseBand y={Y.qualityHeader - 20} h={Y.reuseHeader - Y.qualityHeader - 30} label="SECTION 6 — TREATED WATER QUALITY CHECK" color={C.green.bd} />
      <PhaseBand y={Y.reuseHeader - 20}   h={Y.excessHeader - Y.reuseHeader - 30} label="SECTION 7 — TREATED WATER REUSE STRATEGY" color={C.blue.bd} />
      <PhaseBand y={Y.excessHeader - 20}  h={Y.sludgeHeader - Y.excessHeader - 30} label="SECTION 8 — EXCESS DISCHARGE CALCULATION" color={C.rose.bd} />
      <PhaseBand y={Y.sludgeHeader - 20}  h={Y.dashboard - Y.sludgeHeader - 30} label="SECTION 9 — SLUDGE HANDLING & DISPOSAL" color={C.slate.bd} />
      <PhaseBand y={Y.dashboard - 20}     h={Y.terminal - Y.dashboard + 80} label="SECTION 10 — FINAL OUTPUT DASHBOARD" color={C.teal.bd} />

      {/* ═══ ENTRY ═══ */}
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Start: STP Calculation Module"
        sub="Sewage Treatment Plant — Sizing, Technology & Reuse"
        color={C.blue} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.mod1Header} />

      {/* ═══ SECTION 1: DATA INTEGRATION ═══ */}
      <Box x={nx} y={Y.mod1Header} w={nw} h={nh}
        label="Module 1: Cross-Module Data Integration"
        sub="Fetch water demand values from P3A (Water Demand Calc)"
        color={C.purple} badge="AUTO-FETCH" />
      <Arrow x1={CX} y1={Y.mod1Header + nh} x2={CX} y2={Y.fetchTable} />

      <DataTable x={tableX} y={Y.fetchTable}
        title={"📄 AUTO-FETCHED FROM WATER DEMAND CALCULATION (P3A)"}
        headers={["Parameter", "Source Module", "Value", "Unit"]}
        rows={[
          ["Domestic Water (DW)", "P3A Water Demand", "Fetched", "KLD"],
          ["Flushing Water (FW)", "P3A Water Demand", "Fetched", "KLD"],
          ["Total Population", "P3A Water Demand", "Fetched", "Persons"],
          ["Total Flats", "Main DB", "Fetched", "Nos"],
          ["Commercial Area", "Main DB", "Fetched", "Sq.m"],
          ["Swimming Pool Volume", "Main DB", "Fetched", "CUM"],
          ["Irrigation Area", "Main DB", "Fetched", "Sq.m"],
          ["Cooling Tower Capacity", "Main DB", "Fetched", "TR"],
        ]}
        color={C.purple}
      />

      {/* Cross-link indicator */}
      <NoteBox x={CX + 310} y={Y.fetchTable + 40} w={240} h={90}
        icon="🔗" title="Cross-Module Link"
        lines={["Water Demand Calc (P3A)", "Values auto-synced", "Any P3A change updates STP"]}
        color={C.violet} />
      <line x1={tableX + 780} y1={Y.fetchTable + 85} x2={CX + 310} y2={Y.fetchTable + 85}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.fetchTable + 340} x2={CX} y2={Y.mod2Header} />

      {/* ═══ SECTION 2: SEWER GENERATION (80/100 RULE) ═══ */}
      <Box x={nx} y={Y.mod2Header} w={nw} h={nh}
        label="Module 2: Sewer Generation Engine"
        sub="The 80/100 Rule — Industry Standard Sewage Conversion"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.mod2Header + nh} x2={CX} y2={Y.sewDomFormula} />

      <FormulaBlock x={CX - 320} y={Y.sewDomFormula} w={640} h={90}
        lines={[
          "S_domestic = DW × 0.80",
          "80% of domestic water converts to sewage",
          "Remaining 20% consumed/evaporated/absorbed",
        ]}
        color={C.amber} />

      <NoteBox x={CX + 360} y={Y.sewDomFormula} w={220} h={90}
        icon="💡" title="80% Rule"
        lines={["CPHEEO Manual 2016", "IS 1172:1993 basis", "Conservative estimate"]}
        color={C.rose} />
      <line x1={CX + 320} y1={Y.sewDomFormula + 45} x2={CX + 360} y2={Y.sewDomFormula + 45}
        stroke={C.rose.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sewDomFormula + 90} x2={CX} y2={Y.sewFlushFormula} />

      <FormulaBlock x={CX - 320} y={Y.sewFlushFormula} w={640} h={90}
        lines={[
          "S_flushing = FW × 1.00",
          "100% of flushing water converts to sewage",
          "All flush water enters drainage → STP inlet",
        ]}
        color={C.amber} />

      <NoteBox x={CX + 360} y={Y.sewFlushFormula} w={220} h={90}
        icon="💡" title="100% Rule"
        lines={["All flushing → sewage", "Grey water pathway", "No evaporation loss"]}
        color={C.cyan} />
      <line x1={CX + 320} y1={Y.sewFlushFormula + 45} x2={CX + 360} y2={Y.sewFlushFormula + 45}
        stroke={C.cyan.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sewFlushFormula + 90} x2={CX} y2={Y.sewTotal} />

      <Box x={CX - 280} y={Y.sewTotal} w={560} h={nh}
        label="Total Sewage = S_domestic + S_flushing"
        sub="Combined daily sewage generation (KLD / CUM per day)"
        color={C.green} badge="SUMMATION" />
      <Arrow x1={CX} y1={Y.sewTotal + nh} x2={CX} y2={Y.sewBreakdown} />

      <DataTable x={tableX} y={Y.sewBreakdown}
        title={"📊 SEWER GENERATION BREAKDOWN"}
        headers={["Source", "Water Input (KLD)", "Conversion", "Sewage (KLD)"]}
        rows={[
          ["Domestic Water", "Fetched", "× 0.80", "Auto-calc"],
          ["Flushing Water", "Fetched", "× 1.00", "Auto-calc"],
          ["Swimming Pool Backwash", "Fetched", "× 0.05", "Auto-calc"],
          ["Commercial (if any)", "Fetched", "× 0.80", "Auto-calc"],
          ["TOTAL SEWAGE", "—", "—", "Auto-calc"],
        ]}
        color={C.amber}
      />
      <Arrow x1={CX} y1={Y.sewBreakdown + 250} x2={CX} y2={Y.peakHeader} />

      {/* ═══ SECTION 3: PEAK FACTOR ═══ */}
      <Box x={nx} y={Y.peakHeader} w={nw} h={nh}
        label="Peak Factor & Safety Margin"
        sub="Apply peaking factor for design capacity"
        color={C.orange} badge="SAFETY" />
      <Arrow x1={CX} y1={Y.peakHeader + nh} x2={CX} y2={Y.peakDecision - 48} />

      <Diamond cx={CX} cy={Y.peakDecision} rxD={210} ryD={48}
        label="Apply Peak Factor?"
        sub="Population > 500 persons?"
        color={C.orange} />

      <Arrow x1={CX - 140} y1={Y.peakDecision + 40} x2={CX - 300} y2={Y.peakYes}
        label="Yes (>500)" color={C.green.bd} />
      <Box x={CX - 520} y={Y.peakYes} w={420} h={nh}
        label="Apply Peak Factor = 1.5"
        sub="Design Sewage = Total × 1.5 for peak hour flow"
        color={C.orange} badge="PEAK" />

      <Arrow x1={CX + 140} y1={Y.peakDecision + 40} x2={CX + 300} y2={Y.peakNo}
        label="No (≤500)" color={C.reject} />
      <Box x={CX + 100} y={Y.peakNo} w={420} h={nh}
        label="Apply Safety Factor = 1.10"
        sub="10% margin only for small developments"
        color={C.green} badge="SAFETY" />

      <Arrow x1={CX - 300} y1={Y.peakYes + nh} x2={CX} y2={Y.peakConverge} />
      <Arrow x1={CX + 300} y1={Y.peakNo + nh} x2={CX} y2={Y.peakConverge} />
      <Box x={nx} y={Y.peakConverge} w={nw} h={60}
        label="Design Sewage Capacity Locked"
        sub="Peak-adjusted capacity for STP sizing"
        color={C.orange} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.peakConverge + 60} x2={CX} y2={Y.techHeader} />

      {/* ═══ SECTION 4: TECHNOLOGY SELECTION ═══ */}
      <Box x={nx} y={Y.techHeader} w={nw} h={nh}
        label="STP Technology Selection"
        sub="Evaluate treatment technologies against project constraints"
        color={C.cyan} badge="TECHNOLOGY" />
      <Arrow x1={CX} y1={Y.techHeader + nh} x2={CX} y2={Y.techTable} />

      <TechCompareTable x={CX - 450} y={Y.techTable} />

      <Arrow x1={CX} y1={Y.techTable + 240} x2={CX} y2={Y.techDecision - 48} />

      <Diamond cx={CX} cy={Y.techDecision} rxD={210} ryD={48}
        label="Auto-Select Technology?"
        sub="System recommendation acceptable?"
        color={C.cyan} />

      <Arrow x1={CX - 140} y1={Y.techDecision + 40} x2={CX - 300} y2={Y.techAuto}
        label="Auto" color={C.green.bd} />
      <Box x={CX - 520} y={Y.techAuto} w={420} h={nh}
        label="System Recommends: SBR Technology"
        sub="Best balance of area, power & treatment quality"
        color={C.teal} badge="RECOMMENDED" />

      <Arrow x1={CX + 140} y1={Y.techDecision + 40} x2={CX + 300} y2={Y.techManual}
        label="Manual" color={C.reject} />
      <Box x={CX + 100} y={Y.techManual} w={420} h={nh}
        label="User Selects Alternative Technology"
        sub="Manual selection → parameters update accordingly"
        color={C.rose} badge="OVERRIDE" />

      <Arrow x1={CX - 300} y1={Y.techAuto + nh} x2={CX} y2={Y.techConverge} />
      <Arrow x1={CX + 300} y1={Y.techManual + nh} x2={CX} y2={Y.techConverge} />
      <Box x={nx} y={Y.techConverge} w={nw} h={60}
        label="Technology Locked"
        sub="Area/power coefficients set per selected technology"
        color={C.cyan} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.techConverge + 60} x2={CX} y2={Y.capHeader} />

      {/* ═══ SECTION 5: CAPACITY, AREA & POWER ═══ */}
      <Box x={nx} y={Y.capHeader} w={nw} h={nh}
        label="STP Capacity & Infrastructure Sizing"
        sub="Calculate capacity, area & power from design sewage"
        color={C.teal} badge="SIZING" />
      <Arrow x1={CX} y1={Y.capHeader + nh} x2={CX} y2={Y.capFormula} />

      <FormulaBlock x={CX - 340} y={Y.capFormula} w={680} h={90}
        lines={[
          "STP Capacity (KLD) = Design Sewage (KLD)",
          "Round up to nearest standard size: 50/100/150/200/300/500 KLD",
          "Standard sizes per CPHEEO / manufacturer catalogue",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={Y.capFormula + 90} x2={CX} y2={Y.areaFormula} />

      <FormulaBlock x={CX - 340} y={Y.areaFormula} w={680} h={90}
        lines={[
          "STP Area (sqm) = Capacity (KLD) × Area Factor (m²/KLD)",
          "SBR: 0.8–1.0 m²/KLD | MBR: 0.5–0.7 m²/KLD",
          "Add 20% for utility corridor & pump room",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={Y.areaFormula + 90} x2={CX} y2={Y.powerFormula} />

      <FormulaBlock x={CX - 340} y={Y.powerFormula} w={680} h={90}
        lines={[
          "STP Power (kW) = Capacity (KLD) × Power Factor (kW/KLD)",
          "SBR: 0.6–0.8 kW/KLD | MBR: 1.0–1.5 kW/KLD",
          "Include blower, pump, control panel, lighting loads",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={Y.powerFormula + 90} x2={CX} y2={Y.qualityHeader} />

      {/* ═══ SECTION 6: TREATED WATER QUALITY ═══ */}
      <Box x={nx} y={Y.qualityHeader} w={nw} h={nh}
        label="Treated Water Quality Parameters"
        sub="CPCB discharge norms & reuse standards verification"
        color={C.green} badge="QUALITY" />
      <Arrow x1={CX} y1={Y.qualityHeader + nh} x2={CX} y2={Y.qualityTable} />

      <DataTable x={tableX} y={Y.qualityTable}
        title={"📋 TREATED WATER QUALITY STANDARDS (CPCB / NBC)"}
        headers={["Parameter", "Inlet (mg/L)", "Outlet Target", "Reuse Std", "Status"]}
        rows={[
          ["BOD", "200–300", "< 10", "< 10", "Auto"],
          ["COD", "400–600", "< 50", "< 50", "Auto"],
          ["TSS", "200–400", "< 20", "< 10", "Auto"],
          ["pH", "6.5–8.0", "6.5–8.5", "6.5–8.5", "Auto"],
          ["Turbidity (NTU)", "50–100", "< 5", "< 2", "Auto"],
          ["Faecal Coliform", "10⁶–10⁸", "< 1000", "< 230", "Auto"],
          ["Total Nitrogen", "30–50", "< 10", "< 10", "Auto"],
        ]}
        color={C.green}
      />
      <Arrow x1={CX} y1={Y.qualityTable + 310} x2={CX} y2={Y.qualityDecision - 48} />

      <Diamond cx={CX} cy={Y.qualityDecision} rxD={220} ryD={48}
        label="Quality Meets Standards?"
        sub="All parameters within CPCB limits?"
        color={C.green} />

      <Arrow x1={CX - 150} y1={Y.qualityDecision + 40} x2={CX - 300} y2={Y.qualityPass}
        label="Pass" color={C.green.bd} />
      <Box x={CX - 520} y={Y.qualityPass} w={420} h={nh}
        label="Quality Approved — Proceed to Reuse"
        sub="All parameters within CPCB discharge & reuse limits"
        color={C.green} badge="APPROVED" />

      <Arrow x1={CX + 150} y1={Y.qualityDecision + 40} x2={CX + 300} y2={Y.qualityFail}
        label="Fail" color={C.reject} />
      <Box x={CX + 100} y={Y.qualityFail} w={420} h={nh}
        label="Upgrade Technology / Add Tertiary"
        sub="Add sand filter/UV/ozone → re-evaluate quality"
        color={C.rose} badge="UPGRADE" />

      <Arrow x1={CX - 300} y1={Y.qualityPass + nh} x2={CX} y2={Y.qualityConverge} />
      <Arrow x1={CX + 300} y1={Y.qualityFail + nh} x2={CX} y2={Y.qualityConverge} />
      <Box x={nx} y={Y.qualityConverge} w={nw} h={60}
        label="Treated Water Quality Validated"
        sub="Quality locked → proceed to reuse allocation"
        color={C.green} badge="PROCEED" />
      <Arrow x1={CX} y1={Y.qualityConverge + 60} x2={CX} y2={Y.reuseHeader} />

      {/* ═══ SECTION 7: REUSE STRATEGY ═══ */}
      <Box x={nx} y={Y.reuseHeader} w={nw} h={nh}
        label="Treated Water Reuse Strategy"
        sub="Allocate treated water to multiple reuse streams"
        color={C.blue} badge="REUSE" />
      <Arrow x1={CX} y1={Y.reuseHeader + nh} x2={CX} y2={Y.reuseStreams - 30} />

      {/* 4-way fan-out */}
      {(() => {
        const streams = [
          { label: "Flushing", sub: "Auto-balance vs FW demand", color: C.blue, icon: "🚿" },
          { label: "Irrigation", sub: "Landscape water supply", color: C.green, icon: "🌱" },
          { label: "CT Makeup", sub: "Cooling tower water", color: C.cyan, icon: "❄️" },
          { label: "Misc. / Reserve", sub: "Car wash, fire reserve", color: C.amber, icon: "📦" },
        ];
        const cardW = 250, cardH = 100, gapX = 30;
        const totalW = streams.length * cardW + (streams.length - 1) * gapX;
        const sx = CX - totalW / 2;
        const barY = Y.reuseStreams;
        const centers = streams.map((_, i) => sx + i * (cardW + gapX) + cardW / 2);

        return (
          <g>
            <line x1={CX} y1={barY - 30} x2={CX} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={centers[0]} y1={barY} x2={centers[centers.length - 1]} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            {centers.map((cx, i) => (
              <line key={`rs-${i}`} x1={cx} y1={barY} x2={cx} y2={barY + 20}
                stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#stp-a)" />
            ))}
            {streams.map((s, i) => {
              const cx = sx + i * (cardW + gapX);
              return (
                <g key={`sc-${i}`}>
                  <rect x={cx} y={barY + 20} width={cardW} height={cardH} rx={12}
                    fill={s.color.bg} stroke={s.color.bd} strokeWidth={2.5} />
                  <rect x={cx} y={barY + 20} width={cardW} height={30} rx={12} fill={s.color.bd} />
                  <rect x={cx} y={barY + 38} width={cardW} height={12} fill={s.color.bd} />
                  <text x={cx + cardW / 2} y={barY + 40} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                    {s.icon} {s.label}
                  </text>
                  <text x={cx + cardW / 2} y={barY + 72} textAnchor="middle" fill={s.color.tx} fontSize={11}>
                    {s.sub}
                  </text>
                  <rect x={cx + cardW / 2 - 36} y={barY + cardH - 4} width={72} height={20} rx={10}
                    fill={s.color.bd} opacity={0.15} />
                  <text x={cx + cardW / 2} y={barY + cardH + 10} textAnchor="middle"
                    fill={s.color.bd} fontSize={10} fontWeight={600}>ALLOCATED</text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Water balance */}
      <Arrow x1={CX} y1={Y.reuseStreams + 150} x2={CX} y2={Y.reuseBalance} />
      <FormulaBlock x={CX - 340} y={Y.reuseBalance} w={680} h={90}
        lines={[
          "Water Balance: Treated Output = Σ(Reuse Streams) + Excess",
          "Priority: Flushing (1st) → Irrigation (2nd) → CT (3rd) → Misc",
          "Flushing reuse auto-reduces fresh flushing water demand",
        ]}
        color={C.blue} />
      <Arrow x1={CX} y1={Y.reuseBalance + 90} x2={CX} y2={Y.excessHeader} />

      {/* ═══ SECTION 8: EXCESS DISCHARGE ═══ */}
      <Box x={nx} y={Y.excessHeader} w={nw} h={nh}
        label="Excess Water Calculation"
        sub="Treated water remaining after all reuse allocation"
        color={C.rose} badge="EXCESS" />
      <Arrow x1={CX} y1={Y.excessHeader + nh} x2={CX} y2={Y.excessFormula} />

      <FormulaBlock x={CX - 320} y={Y.excessFormula} w={640} h={90}
        lines={[
          "Excess = Total Treated − Σ(All Reuse Streams)",
          "If Excess > 0 → route to discharge point",
          "If Excess ≤ 0 → zero liquid discharge achieved (ZLD)",
        ]}
        color={C.rose} />
      <Arrow x1={CX} y1={Y.excessFormula + 90} x2={CX} y2={Y.excessDecision - 48} />

      <Diamond cx={CX} cy={Y.excessDecision} rxD={210} ryD={48}
        label="Excess Water > 0?"
        sub="Is there surplus treated water?"
        color={C.rose} />

      <Arrow x1={CX - 140} y1={Y.excessDecision + 40} x2={CX - 300} y2={Y.excessSewer}
        label="Yes" color={C.reject} />
      <Box x={CX - 520} y={Y.excessSewer} w={420} h={nh}
        label="Route to Municipal Sewer / Stormwater"
        sub="Discharge per CPCB norms → consent required"
        color={C.rose} badge="DISCHARGE" />

      <Arrow x1={CX + 140} y1={Y.excessDecision + 40} x2={CX + 300} y2={Y.excessWater}
        label="No (ZLD)" color={C.green.bd} />
      <Box x={CX + 100} y={Y.excessWater} w={420} h={nh}
        label="Zero Liquid Discharge Achieved"
        sub="100% reuse — IGBC/GRIHA bonus credit eligible"
        color={C.green} badge="ZLD ✓" />

      <Arrow x1={CX - 300} y1={Y.excessSewer + nh} x2={CX} y2={Y.excessConverge} />
      <Arrow x1={CX + 300} y1={Y.excessWater + nh} x2={CX} y2={Y.excessConverge} />
      <Box x={nx} y={Y.excessConverge} w={nw} h={60}
        label="Discharge Strategy Finalized"
        sub="Excess volume & discharge point locked"
        color={C.rose} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.excessConverge + 60} x2={CX} y2={Y.sludgeHeader} />

      {/* ═══ SECTION 9: SLUDGE HANDLING ═══ */}
      <Box x={nx} y={Y.sludgeHeader} w={nw} h={nh}
        label="Sludge Generation & Handling"
        sub="Estimate sludge quantity and disposal strategy"
        color={C.slate} badge="SLUDGE" />
      <Arrow x1={CX} y1={Y.sludgeHeader + nh} x2={CX} y2={Y.sludgeCalc} />

      <FormulaBlock x={CX - 340} y={Y.sludgeCalc} w={680} h={90}
        lines={[
          "Sludge Volume = STP Capacity × Sludge Factor",
          "SBR: 3–5% of flow | MBR: 1–3% of flow",
          "Dewatered sludge: press cake → compost or disposal",
        ]}
        color={C.slate} />
      <Arrow x1={CX} y1={Y.sludgeCalc + 90} x2={CX} y2={Y.sludgeDisposal} />

      <DataTable x={tableX} y={Y.sludgeDisposal}
        title={"📋 SLUDGE HANDLING STRATEGY"}
        headers={["Stage", "Process", "Output", "Disposal"]}
        rows={[
          ["Primary", "Screening & Grit", "Screenings", "Landfill"],
          ["Secondary", "Bio Sludge", "Thickened sludge", "Dewatering"],
          ["Dewatering", "Filter Press/Belt", "Press cake (20% DS)", "Composting"],
          ["Final", "Sun drying/Composting", "Dry sludge", "Garden/Disposal"],
        ]}
        color={C.slate}
      />

      <NoteBox x={CX + 310} y={Y.sludgeDisposal + 20} w={240} h={80}
        icon="♻️" title="Sludge Reuse"
        lines={["Composted sludge →", "Garden/landscape manure", "Per SWM Rules 2016"]}
        color={C.teal} />
      <line x1={tableX + 780} y1={Y.sludgeDisposal + 60} x2={CX + 310} y2={Y.sludgeDisposal + 60}
        stroke={C.teal.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sludgeDisposal + 200} x2={CX} y2={Y.dashboard} />

      {/* ═══ SECTION 10: FINAL DASHBOARD ═══ */}
      <STPDashboard x={CX - 500} y={Y.dashboard} />

      <Arrow x1={CX} y1={Y.dashboard + 300} x2={CX} y2={Y.terminal} />

      <Box x={nx} y={Y.terminal} w={nw} h={60}
        label="STP CALCULATION COMPLETE"
        sub="All outputs locked → Export to Report & BOQ"
        color={C.teal} badge="DONE" rx={30} />
    </svg>
  );
}
