import React from "react";

// =====================================================================
// P3B — ELECTRICAL LOAD CALCULATOR — Custom SVG Flow Diagram
// Full architecture: Supply Authority Norms → Apartment Load →
// Building Common Area → Society Common Area → MLCP → Other →
// Final Load Summary → Transformer Sizing → DG Sizing
// =====================================================================

const W = 1600;
const H = 7800;
const CX = W / 2;

// Colors
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

// ── Reusable SVG primitives ──

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
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {num}
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#ela)" />
      {label && (
        <g>
          <rect
            x={(x1 + x2) / 2 - label.length * 4.2}
            y={(y1 + y2) / 2 - 12}
            width={label.length * 8.4 + 6} height={18} rx={4} fill="#fff" opacity={0.92} />
          <text
            x={(x1 + x2) / 2}
            y={(y1 + y2) / 2 + 1}
            textAnchor="middle" fill={c} fontSize={11} fontWeight={600}>{label}</text>
        </g>
      )}
    </g>
  );
}

// Category card with items list
function CategoryCard({ x, y, w, h, title, items, color }: {
  x: number; y: number; w: number; h: number;
  title: string; items: string[];
  color: { bg: string; bd: string; tx: string };
}) {
  const hdrH = 34;
  const pillH = 20, pillGap = 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={color.bg} stroke={color.bd} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={hdrH} rx={12} fill={color.bd} />
      <rect x={x} y={y + hdrH - 6} width={w} height={6} fill={color.bd} />
      <text x={x + w / 2} y={y + 23} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>{title}</text>
      {items.map((item, i) => {
        const py = y + hdrH + 8 + i * (pillH + pillGap);
        const pw = w - 20;
        const px = x + 10;
        return (
          <g key={i}>
            <rect x={px} y={py} width={pw} height={pillH} rx={5}
              fill="#fff" stroke={color.bd} strokeWidth={1} opacity={0.9} />
            <text x={px + pw / 2} y={py + pillH / 2 + 4} textAnchor="middle"
              fill={color.tx} fontSize={10} fontWeight={500}>{item}</text>
          </g>
        );
      })}
    </g>
  );
}

// Norms data card
function NormsCard({ x, y }: { x: number; y: number }) {
  const w = 520, h = 200;
  const fields = [
    "Watt/Sq.mt values",
    "Maximum Diversity Factor (MDF)",
    "Essential Diversity Factor (EDF)",
    "Fire Diversity Factor (FDF)",
    "Circular Reference Number",
    "Effective Date",
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={w} height={42} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 30} width={w} height={12} fill={C.blue.bd} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {"📋"} Supply Authority Norms — Fetched Data
      </text>
      {fields.map((f, i) => {
        const fy = y + 52 + i * 24;
        return (
          <g key={i}>
            <circle cx={x + 22} cy={fy + 7} r={4} fill={C.blue.bd} />
            <text x={x + 34} y={fy + 12} fill={C.blue.tx} fontSize={12} fontWeight={500}>{f}</text>
            <rect x={x + w - 140} y={fy} width={120} height={18} rx={4}
              fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} strokeDasharray="4,2" />
            <text x={x + w - 80} y={fy + 13} textAnchor="middle" fill={C.blue.tx} fontSize={10} opacity={0.6}>
              Auto-fetched
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Formula block
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

// Apartment load table
function ApartmentTable({ x, y }: { x: number; y: number }) {
  const tw = 700, th = 240;
  const headers = ["Typology (BHK)", "No. of Apts", "Area (Sq.mt)", "Watt/Sq.mt", "TCL (kW)", "MD (kW)"];
  const rows = [
    ["1 BHK", "User Input", "Pre-filled", "Norm", "Auto", "Auto"],
    ["2 BHK", "User Input", "Pre-filled", "Norm", "Auto", "Auto"],
    ["3 BHK", "User Input", "Pre-filled", "Norm", "Auto", "Auto"],
    ["+ Add Row", "", "", "", "", ""],
  ];
  const colW = tw / 6;
  const rowH = 30;
  const hdrY = y + 52;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.purple.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={C.purple.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={C.purple.bd} />
      <text x={x + 18} y={y + 20} fill="#fff" fontSize={13} fontWeight={700}>
        {"📊"} APARTMENT LOAD MATRIX — BHK-wise Calculation
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        Auto-calculates TCL & MD per typology from norms or policy
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 20} textAnchor="middle"
            fill={C.purple.tx} fontSize={10.5} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isUser = cell === "User Input";
            const isAdd = cell === "+ Add Row";
            const isAuto = cell === "Auto";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect
                  x={x + ci * colW + 3}
                  y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAdd && ci === 0 ? C.teal.bg : "#fff"}
                  stroke={isUser ? C.blue.bd : isAuto ? C.green.bd : "#e2e8f0"}
                  strokeWidth={isUser || isAuto ? 1.5 : 1}
                  strokeDasharray={isUser ? "5,3" : "none"}
                />
                <text
                  x={x + ci * colW + colW / 2}
                  y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle"
                  fill={isUser ? C.blue.tx : isAdd ? C.teal.tx : isAuto ? C.green.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isUser || isAdd || isAuto ? 600 : 400}
                >
                  {cell}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// Entity summary table
function EntityTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 760, colW = tw / headers.length;
  const rowH = 28;
  const th = 48 + (rows.length + 1) * (rowH + 2) + 10;
  const hdrY = y + 50;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={tw} height={42} rx={14} fill={color.bd} />
      <rect x={x} y={y + 30} width={tw} height={12} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {title}
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 2} y={hdrY} width={colW - 4} height={rowH} rx={5}
            fill={color.bg} stroke={color.bd} strokeWidth={1.2} />
          <text x={x + i * colW + colW / 2} y={hdrY + 19} textAnchor="middle"
            fill={color.tx} fontSize={10} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => (
            <g key={`c-${ri}-${ci}`}>
              <rect
                x={x + ci * colW + 2}
                y={hdrY + (ri + 1) * (rowH + 2) + 2}
                width={colW - 4} height={rowH} rx={5}
                fill="#fff" stroke="#e2e8f0" strokeWidth={1}
              />
              <text
                x={x + ci * colW + colW / 2}
                y={hdrY + (ri + 1) * (rowH + 2) + 20}
                textAnchor="middle"
                fill="#64748b" fontSize={10} fontWeight={400}
              >
                {cell}
              </text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// Dashboard metric card row
function LoadSummaryDashboard({ x, y }: { x: number; y: number }) {
  const dw = 900, dh = 220;
  const sections = [
    { label: "Apartment\nLoad", icon: "🏠", color: C.blue },
    { label: "Building\nCommon", icon: "🏢", color: C.purple },
    { label: "Society\nCommon", icon: "🏘️", color: C.teal },
    { label: "MLCP\nLoad", icon: "🅿️", color: C.orange },
    { label: "Other\nLoad", icon: "📦", color: C.violet },
  ];
  const metrics = [
    { label: "Grand TCL", value: "Σ kW", color: C.blue },
    { label: "Grand MD", value: "Σ kW", color: C.green },
    { label: "Grand EMD", value: "Σ kW", color: C.amber },
    { label: "Grand FMD", value: "Σ kW", color: C.rose },
  ];
  const cardW = (dw - 50) / 5;
  const metricW = (dw - 50) / 4;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.green.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"📊"} FINAL LOAD SUMMARY ENGINE — Aggregated Output
      </text>
      {sections.map((s, i) => {
        const cx = x + 15 + i * (cardW + 6);
        const cy = y + 52;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={50} rx={8}
              fill={s.color.bg} stroke={s.color.bd} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={cy + 18} textAnchor="middle" fontSize={16}>{s.icon}</text>
            <text x={cx + cardW / 2} y={cy + 34} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[0]}</text>
            <text x={cx + cardW / 2} y={cy + 45} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[1]}</text>
          </g>
        );
      })}
      {metrics.map((m, i) => {
        const cx = x + 15 + i * (metricW + 8);
        const cy = y + 115;
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
      <text x={x + dw / 2} y={y + dh - 8} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.6}>
        All section totals aggregated → Grand TCL = Σ All TCL | Grand MD = Σ All MD | Grand EMD = Σ All EMD | Grand FMD = Σ All FMD
      </text>
    </g>
  );
}

// Demand formula card
function DemandFormulaCard({ x, y, color }: {
  x: number; y: number;
  color: { bg: string; bd: string; tx: string };
}) {
  const w = 500, h = 80;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      <rect x={x + w - 88} y={y + 6} width={78} height={20} rx={10} fill={color.bd} opacity={0.85} />
      <text x={x + w - 49} y={y + 19} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>FORMULA</text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle" fill={color.tx} fontSize={12} fontWeight={700} fontFamily="monospace">
        MD = TCL × MDF
      </text>
      <text x={x + w / 2} y={y + 50} textAnchor="middle" fill={color.tx} fontSize={12} fontWeight={700} fontFamily="monospace">
        EMD = TCL × EDF  |  FMD = TCL × FDF
      </text>
      <text x={x + w / 2} y={y + 68} textAnchor="middle" fill={color.tx} fontSize={10} opacity={0.6}>
        Applied to each entity line item
      </text>
    </g>
  );
}


// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function ElectricalLoadCalcSVG() {

  // ── Y positions — systematically spaced to prevent overlaps ──
  // Each position accounts for the full height of the element above + gap

  const nh = 70;   // standard box height
  const gap = 50;  // standard gap between elements

  const Y = {
    // ── Section 1 — Supply Authority (entry through converge) ──
    entry:         50,        // h=70 → bottom 120
    saDecision:    200,       // diamond ryD=55 → top 145, bottom 255
    saYesFetch:    320,       // h=70 → bottom 390
    saDisplay:     450,       // NormsCard h=200 → bottom 650
    saConfirm:     730,       // diamond ryD=48 → top 682, bottom 778
    saOverride:    840,       // h=60 → bottom 900
    saConverge:    970,       // h=60 → bottom 1030

    // ── Section 2 — Apartment Load ──
    aptHeader:     1100,      // h=70 → bottom 1170
    aptFetch:      1220,      // h=70 → bottom 1290
    aptDecision:   1370,      // diamond ryD=48 → bottom 1418
    // formula blocks at aptDecision+100=1470, h=86 → bottom 1556
    aptTable:      1620,      // h=240 → bottom 1860
    aptSummary:    1920,      // h=70 → bottom 1990
    aptConfirm:    2040,      // h=60 → bottom 2100

    // ── Section 3 — Building Common Area ──
    bcHeader:      2170,      // h=70 → bottom 2240
    bcCategories:  2300,      // Row1 h=240 (→2540), Row2 at 2560 h=140 (→2700), label 2720
    bcFetchEntity: 2800,      // h=70 → bottom 2870
    bcTclLogic:    2950,      // diamond → bottom 2998
    // formula blocks at 3040, h=70 → bottom 3110
    bcEntitySum:   3180,      // EntityTable 5 rows: th=48+6*30+10=238 → bottom 3418
    bcDemand:      3480,      // DemandCard h=80 → bottom 3560
    bcAggregate:   3620,      // h=70 → bottom 3690

    // ── Section 4 — Society Common Area ──
    scHeader:      3760,      // h=70 → bottom 3830
    scCategories:  3890,      // h=165 → bottom 4055
    scTcl:         4130,      // EntityTable 4 rows: th=48+5*30+10=208 → bottom 4338
    scDemand:      4400,      // h=80 → bottom 4480
    scAggregate:   4540,      // h=70 → bottom 4610

    // ── Section 5 — MLCP ──
    mlcpDecision:  4700,      // diamond ryD=48 → bottom 4748
    mlcpCats:      4830,      // h=150 → bottom 4980, note ~5010
    mlcpDemand:    5080,      // h=80 → bottom 5160
    mlcpAggregate: 5220,      // h=70 → bottom 5290

    // ── Section 6 — Other Load ──
    otherHeader:   5370,      // h=70 → bottom 5440
    otherCalc:     5500,      // method cards h=70 → bottom 5570
    otherDemand:   5640,      // h=70 → bottom 5710

    // ── Section 7 — Final Load Summary ──
    finalSummary:  5790,      // dashboard h=220 → bottom 6010

    // ── Section 8 & 9 — Transformer + DG Sizing (side by side) ──
    sizingStart:   6090,      // fan-out bar
    // Section 8 left: input(6140) → formula(6240) → select(6340) → output(6440) → bottom 6510
    // Section 9 right: gmd(6140) → fmd(6240) → decision(6350) → branches(6440) → converge(6530)
    //   → formula(6580) → select(6680) → output(6780) → bottom 6850

    // ── Section 10 — Final Output Summary ──
    finalOutput:   6950,      // h=320 → bottom 7270
  };

  const nw = 400;
  const nx = CX - nw / 2;

  // Section 8 (left) — Transformer Sizing Y positions
  const s8 = {
    input:   Y.sizingStart + 50,   // h=55 → bottom 6195
    formula: Y.sizingStart + 150,  // h=55 → bottom 6295
    select:  Y.sizingStart + 250,  // h=70 → bottom 6410
    output:  Y.sizingStart + 370,  // h=70 → bottom 6530
  };

  // Section 9 (right) — DG Sizing Y positions
  const s9 = {
    gmd:      Y.sizingStart + 50,   // h=55 → bottom 6195
    fmd:      Y.sizingStart + 150,  // h=55 → bottom 6295
    decision: Y.sizingStart + 310,  // diamond ryD=45 → bottom 6445
    branchY:  Y.sizingStart + 410,  // branch boxes h=50 → bottom 6550
    converge: Y.sizingStart + 510,  // h=55 → bottom 6655
    select:   Y.sizingStart + 610,  // h=70 → bottom 6770
    output:   Y.sizingStart + 730,  // h=70 → bottom 6890
  };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="ela" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="ela-blue" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blue.bd} />
        </marker>
        <marker id="ela-red" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
        </marker>
        <marker id="ela-green" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
      </defs>

      {/* ═══════════════════════════════════════════════════════════════
          PHASE BANDS — heights computed from actual content bounds
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.entry - 15}        h={130}  label="ENTRY — ELECTRICAL LOAD CALCULATOR" color={C.blue.bd} />
      <PhaseBand y={Y.saDecision - 30}   h={Y.saConverge + 60 - (Y.saDecision - 30) + 20} label="SECTION 1 — SUPPLY AUTHORITY NORMS" color={C.amber.bd} />
      <PhaseBand y={Y.aptHeader - 30}    h={Y.aptConfirm + 60 - (Y.aptHeader - 30) + 20} label="SECTION 2 — APARTMENT LOAD CALCULATION" color={C.purple.bd} />
      <PhaseBand y={Y.bcHeader - 30}     h={Y.bcAggregate + nh - (Y.bcHeader - 30) + 20} label="SECTION 3 — BUILDING COMMON AREA LOAD" color={C.cyan.bd} />
      <PhaseBand y={Y.scHeader - 30}     h={Y.scAggregate + nh - (Y.scHeader - 30) + 20} label="SECTION 4 — SOCIETY COMMON AREA LOAD" color={C.teal.bd} />
      <PhaseBand y={Y.mlcpDecision - 40} h={Y.mlcpAggregate + nh - (Y.mlcpDecision - 40) + 20} label="SECTION 5 — MLCP LOAD" color={C.orange.bd} />
      <PhaseBand y={Y.otherHeader - 30}  h={Y.otherDemand + nh - (Y.otherHeader - 30) + 20} label="SECTION 6 — OTHER LOAD" color={C.violet.bd} />
      <PhaseBand y={Y.finalSummary - 30} h={280} label="SECTION 7 — FINAL LOAD SUMMARY ENGINE" color={C.green.bd} />
      <PhaseBand y={Y.sizingStart - 40}  h={s9.output + 70 - (Y.sizingStart - 40) + 20} label="SECTION 8 — TRANSFORMER SIZING  |  SECTION 9 — DG SIZING" color={C.rose.bd} />
      <PhaseBand y={Y.finalOutput - 30}  h={370} label="SECTION 10 — FINAL OUTPUT SUMMARY" color={C.blue.bd} />

      {/* ═══════════════════════════════════════════════════════════════
          ENTRY — Project & Location
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={nx - 28} y={Y.entry + nh / 2} num={0} color={C.blue.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Start: Electrical Load Calculator"
        sub="Project Name, Location → Selected from Project Data"
        color={C.blue} badge="ENTRY" />

      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.saDecision - 55} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — SUPPLY AUTHORITY NORMS
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={CX - 220} y={Y.saDecision} num={1} color={C.amber.bd} />
      <Diamond cx={CX} cy={Y.saDecision} rxD={210} ryD={55}
        label="Regional Supply Authority"
        sub="Available for Selected Location?"
        color={C.amber} />

      {/* YES / NO branches */}
      {(() => {
        const noX = CX + 320;
        return (
          <g>
            {/* ── YES branch (center-down) ── */}
            <Arrow x1={CX} y1={Y.saDecision + 55} x2={CX} y2={Y.saYesFetch} label="Yes" color={C.green.bd} />

            {/* Fetch Supply Authority Norms */}
            <Box x={CX - 270} y={Y.saYesFetch} w={540} h={nh}
              label="Fetch Supply Authority Norms from DB"
              sub="Watt/Sq.mt, MDF, EDF, FDF, Circular Ref, Effective Date"
              color={C.blue} badge="DB FETCH" />

            {/* Norms data card */}
            <Arrow x1={CX} y1={Y.saYesFetch + nh} x2={CX} y2={Y.saDisplay} />
            <NormsCard x={CX - 260} y={Y.saDisplay} />

            {/* Arrow: NormsCard bottom → Confirm diamond */}
            <Arrow x1={CX} y1={Y.saDisplay + 200} x2={CX} y2={Y.saConfirm - 48} />
            <Diamond cx={CX} cy={Y.saConfirm} rxD={195} ryD={48}
              label="Proceed with these norms?"
              sub="User confirms or overrides"
              color={C.amber} />

            {/* Confirmed → Lock (left) */}
            <Arrow x1={CX - 130} y1={Y.saConfirm + 40} x2={CX - 250} y2={Y.saOverride}
              label="Confirmed" color={C.green.bd} />
            <Box x={CX - 420} y={Y.saOverride} w={340} h={60}
              label="Lock Values & Proceed"
              sub="Norms locked for this project session"
              color={C.green} badge="LOCKED" />

            {/* Not Matching → Override (right) */}
            <Arrow x1={CX + 130} y1={Y.saConfirm + 40} x2={CX + 250} y2={Y.saOverride}
              label="Override" color={C.reject} />
            <Box x={CX + 80} y={Y.saOverride} w={340} h={60}
              label="Enable Manual Override"
              sub="Save override with audit log → Proceed"
              color={C.rose} badge="OVERRIDE" />

            {/* Fan-in to converge */}
            <Arrow x1={CX - 250} y1={Y.saOverride + 60} x2={CX} y2={Y.saConverge} />
            <Arrow x1={CX + 250} y1={Y.saOverride + 60} x2={CX} y2={Y.saConverge} />

            {/* ── NO branch (right side) ── */}
            <line x1={CX + 210} y1={Y.saDecision} x2={noX} y2={Y.saDecision}
              stroke={C.reject} strokeWidth={2.5} markerEnd="url(#ela-red)" />
            <rect x={CX + 230} y={Y.saDecision - 14} width={34} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={CX + 247} y={Y.saDecision - 1} textAnchor="middle" fill={C.reject} fontSize={11} fontWeight={600}>No</text>

            <Box x={noX} y={Y.saDecision + 20} w={260} h={60}
              label="Fetch Company Policy"
              sub="Company defaults for Watt/Sq.mt, MDF etc."
              color={C.rose} badge="POLICY" />

            <Arrow x1={noX + 130} y1={Y.saDecision + 80} x2={noX + 130} y2={Y.saDecision + 120} />

            <Box x={noX} y={Y.saDecision + 120} w={260} h={60}
              label="Display & Confirm / Override"
              sub="User reviews company policy values"
              color={C.amber} badge="CONFIRM" />

            {/* NO branch → converge (dashed route down the right side) */}
            <path d={`M${noX + 130} ${Y.saDecision + 180} L${noX + 130} ${Y.saConverge + 30} L${CX + 200} ${Y.saConverge + 30}`}
              fill="none" stroke={C.reject} strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#ela-red)" />
          </g>
        );
      })()}

      {/* Converge node */}
      <Box x={CX - 200} y={Y.saConverge} w={400} h={60}
        label="Norms / Policy Confirmed"
        sub="Proceed with locked Watt/Sq.mt, MDF, EDF, FDF values"
        color={C.green} badge="PROCEED" />

      <Arrow x1={CX} y1={Y.saConverge + 60} x2={CX} y2={Y.aptHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — APARTMENT LOAD CALCULATION
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={nx - 28} y={Y.aptHeader + nh / 2} num={2} color={C.purple.bd} />
      <Box x={nx} y={Y.aptHeader} w={nw} h={nh}
        label="Section 2: Apartment Load"
        sub="Fetch Apartment Typology, No. of Apartments, Area"
        color={C.purple} badge="SECTION" />

      <Arrow x1={CX} y1={Y.aptHeader + nh} x2={CX} y2={Y.aptFetch} />

      <Box x={CX - 280} y={Y.aptFetch} w={560} h={nh}
        label="Fetch: Apartment Typology Data"
        sub="BHK types, No. of Apartments, Area (Sq.ft & Sq.mt) from project DB"
        color={C.blue} badge="DB FETCH" />

      <Arrow x1={CX} y1={Y.aptFetch + nh} x2={CX} y2={Y.aptDecision - 48} />

      {/* Decision: Supply Authority Norm vs Company Policy */}
      <Diamond cx={CX} cy={Y.aptDecision} rxD={195} ryD={48}
        label="Calculation Source?"
        sub="Supply Authority Norm or Company Policy?"
        color={C.amber} />

      {/* Case A & B — two formula branches */}
      {(() => {
        const leftCX = CX - 260;
        const rightCX = CX + 260;
        const formulaY = Y.aptDecision + 100;
        const formulaH = 86;
        return (
          <g>
            <Arrow x1={CX - 120} y1={Y.aptDecision + 40} x2={leftCX} y2={formulaY}
              label="Case A: Norm" color={C.blue.bd} />
            <FormulaBlock x={leftCX - 210} y={formulaY} w={420} h={formulaH} color={C.blue}
              lines={[
                "TCL/Apt = (Area × Watt/Sq.mt) / 1000",
                "Total TCL = TCL/Apt × No. of Apartments",
                "MD = TCL × MDF",
              ]} />

            <Arrow x1={CX + 120} y1={Y.aptDecision + 40} x2={rightCX} y2={formulaY}
              label="Case B: Policy" color={C.rose.bd} />
            <FormulaBlock x={rightCX - 210} y={formulaY} w={420} h={formulaH} color={C.rose}
              lines={[
                "Total TCL = Policy TCL × No. of Apartments",
                "MD = TCL × MDF",
                "No. of Meters = No. of Apartments",
              ]} />

            {/* Fan-in arrows to table */}
            <Arrow x1={leftCX} y1={formulaY + formulaH} x2={CX} y2={Y.aptTable} />
            <Arrow x1={rightCX} y1={formulaY + formulaH} x2={CX} y2={Y.aptTable} />
          </g>
        );
      })()}

      {/* Apartment Load Table */}
      <ApartmentTable x={CX - 350} y={Y.aptTable} />

      <Arrow x1={CX} y1={Y.aptTable + 240} x2={CX} y2={Y.aptSummary} />

      <Box x={CX - 240} y={Y.aptSummary} w={480} h={nh}
        label="Apartment Load Summary"
        sub="Total TCL, Total MD, No. of Meters → Store in Load Summary Engine"
        color={C.green} badge="SUMMARY" />

      <Arrow x1={CX} y1={Y.aptSummary + nh} x2={CX} y2={Y.aptConfirm} />

      <Box x={CX - 200} y={Y.aptConfirm} w={400} h={60}
        label="Confirm / Allow Override"
        sub="User reviews apartment totals, can manually adjust"
        color={C.amber} badge="CONFIRM" />

      <Arrow x1={CX} y1={Y.aptConfirm + 60} x2={CX} y2={Y.bcHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — BUILDING COMMON AREA LOAD
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={nx - 28} y={Y.bcHeader + nh / 2} num={3} color={C.cyan.bd} />
      <Box x={nx} y={Y.bcHeader} w={nw} h={nh}
        label="Section 3: Building Common Area"
        sub="Define Load Categories, Fetch Data, Calculate TCL & Demand"
        color={C.cyan} badge="SECTION" />

      <Arrow x1={CX} y1={Y.bcHeader + nh} x2={CX} y2={Y.bcCategories} />

      {/* Step 1 — Define Load Categories (6 cards in 2 rows of 3) */}
      {(() => {
        const cats = [
          { title: "1. Lighting & Small Power", items: ["GF Entrance Lobby", "Typical Floor Lobby", "Staircase", "Terrace", "Fire Lift Lobby", "Refuge Floor", "Service Floor", "Landscape"], color: C.amber },
          { title: "2. Lift Load", items: ["Passenger Lift", "Passenger + Fire Lift", "Firemen Evac / Service / Stretcher"], color: C.blue },
          { title: "3. HVAC Load", items: ["Meter Room (Ex Fan)", "Elec Room (Ex Fan)", "IBS Room (Ex Fan)", "OWC Room (Ex Fan)", "FCC Room (AC)", "Lift Machine Room (AC/ExF)", "Pressurization Fans ×4"], color: C.purple },
          { title: "4. PHE Load", items: ["Booster Pump"], color: C.teal },
          { title: "5. FF Load", items: ["Booster Pump"], color: C.rose },
          { title: "6. ELV / Comm & Misc", items: ["IBS Load", "FTTH Load", "Signage Load"], color: C.violet },
        ];
        const cw = 240, cgap = 16;
        const rowW = 3 * cw + 2 * cgap;
        const sx = CX - rowW / 2;
        const r1h = 240, r2h = 140;
        return (
          <g>
            {/* Row 1: cats 0-2 */}
            {cats.slice(0, 3).map((cat, i) => (
              <CategoryCard key={i} x={sx + i * (cw + cgap)} y={Y.bcCategories}
                w={cw} h={r1h} title={cat.title} items={cat.items} color={cat.color} />
            ))}
            {/* Row 2: cats 3-5 */}
            {cats.slice(3).map((cat, i) => (
              <CategoryCard key={i + 3} x={sx + i * (cw + cgap)} y={Y.bcCategories + r1h + 20}
                w={cw} h={r2h} title={cat.title} items={cat.items} color={cat.color} />
            ))}
            <text x={CX} y={Y.bcCategories + r1h + r2h + 50} textAnchor="middle" fill={C.cyan.tx} fontSize={11} opacity={0.6}>
              Step 1 — Define all building common area load categories
            </text>
          </g>
        );
      })()}

      {/* Arrow from categories bottom to fetch entity */}
      <Arrow x1={CX} y1={Y.bcCategories + 240 + 20 + 140 + 60} x2={CX} y2={Y.bcFetchEntity} />

      {/* Step 2 — Fetch Entity Data */}
      <Box x={CX - 300} y={Y.bcFetchEntity} w={600} h={nh}
        label="Step 2: Fetch Entity Data from Database"
        sub="For each entity: Area, No. of Units, Watt/Area, TCL/Unit, MDF, EDF, FDF"
        color={C.blue} badge="DB FETCH" />

      {/* Missing data note */}
      <rect x={CX + 320} y={Y.bcFetchEntity + 5} width={240} height={55} rx={10}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={CX + 440} y={Y.bcFetchEntity + 25} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>
        ⚠️ If Data Missing:
      </text>
      <text x={CX + 440} y={Y.bcFetchEntity + 42} textAnchor="middle" fill={C.rose.tx} fontSize={10}>
        Prompt User → Save to Database
      </text>

      <Arrow x1={CX} y1={Y.bcFetchEntity + nh} x2={CX} y2={Y.bcTclLogic - 48} />

      {/* Step 3 — TCL Calculation Logic */}
      <Diamond cx={CX} cy={Y.bcTclLogic} rxD={190} ryD={48}
        label="Calculation Method?"
        sub="By Area or By Units?"
        color={C.cyan} />

      {(() => {
        const leftCX = CX - 260;
        const rightCX = CX + 260;
        const formulaY = Y.bcTclLogic + 90;
        return (
          <g>
            <Arrow x1={CX - 120} y1={Y.bcTclLogic + 40} x2={leftCX} y2={formulaY}
              label="By Area" color={C.blue.bd} />
            <FormulaBlock x={leftCX - 200} y={formulaY} w={400} h={70} color={C.blue}
              lines={[
                "If Sq.mt: Area(Sq.ft) = 10.764 × Area(Sq.mt)",
                "TCL = Area(Sq.ft) × Watt/Area / 1000",
              ]} />

            <Arrow x1={CX + 120} y1={Y.bcTclLogic + 40} x2={rightCX} y2={formulaY}
              label="By Units" color={C.teal.bd} />
            <FormulaBlock x={rightCX - 200} y={formulaY} w={400} h={52} color={C.teal}
              lines={[
                "TCL = TCL per Unit × No. of Units",
              ]} />

            {/* Fan-in to entity summary */}
            <Arrow x1={leftCX} y1={formulaY + 70} x2={CX} y2={Y.bcEntitySum} />
            <Arrow x1={rightCX} y1={formulaY + 52} x2={CX} y2={Y.bcEntitySum} />
          </g>
        );
      })()}

      {/* Step 4 — Entity Summary Table (5 data rows) */}
      {/* EntityTable th = 48 + 6*30 + 10 = 238 */}
      <EntityTable x={CX - 380} y={Y.bcEntitySum} title="📋 Step 4 — Building Common Entity Summary (Confirm / Override)"
        headers={["Entity", "Area/Units", "Watt/Area", "TCL (kW)", "MDF", "EDF", "FDF"]}
        rows={[
          ["GF Entrance Lobby", "Area", "W/sqft", "Auto", "0.xx", "0.xx", "0.xx"],
          ["Passenger Lift", "Units", "TCL/Unit", "Auto", "0.xx", "0.xx", "0.xx"],
          ["Pressurization Fan", "Units", "TCL/Unit", "Auto", "0.xx", "0.xx", "0.xx"],
          ["Booster Pump (PHE)", "Units", "TCL/Unit", "Auto", "0.xx", "0.xx", "0.xx"],
          ["... (all entities)", "", "", "", "", "", ""],
        ]}
        color={C.cyan} />

      <Arrow x1={CX} y1={Y.bcEntitySum + 248} x2={CX} y2={Y.bcDemand} />

      {/* Step 5 — Demand Load Calculation */}
      <DemandFormulaCard x={CX - 250} y={Y.bcDemand} color={C.cyan} />

      <Arrow x1={CX} y1={Y.bcDemand + 80} x2={CX} y2={Y.bcAggregate} />

      {/* Step 6 — Aggregate Section 3 */}
      <Box x={CX - 260} y={Y.bcAggregate} w={520} h={nh}
        label="Aggregate: Building Common Area Totals"
        sub="Total TCL, Total MD, Total EMD, Total FMD → Store in Load Summary Engine"
        color={C.green} badge="AGGREGATE" />

      <Arrow x1={CX} y1={Y.bcAggregate + nh} x2={CX} y2={Y.scHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — SOCIETY COMMON AREA LOAD
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={nx - 28} y={Y.scHeader + nh / 2} num={4} color={C.teal.bd} />
      <Box x={nx} y={Y.scHeader} w={nw} h={nh}
        label="Section 4: Society Common Area"
        sub="PHE, FF, STP, OWC Load Categories"
        color={C.teal} badge="SECTION" />

      <Arrow x1={CX} y1={Y.scHeader + nh} x2={CX} y2={Y.scCategories} />

      {/* Society Categories — 4 cards */}
      {(() => {
        const cats = [
          { title: "1. PHE Load", items: ["UGT Domestic Transfer Pump", "UGT Flushing Transfer Pump", "Irrigation Pump", "Sump Pump"], color: C.blue },
          { title: "2. FF Load", items: ["Main Hydrant Pump", "Main Sprinkler Pump", "Hydrant Jockey", "Sprinkler Jockey"], color: C.rose },
          { title: "3. STP Load", items: ["STP Equipment"], color: C.teal },
          { title: "4. OWC Load", items: ["OWC Equipment"], color: C.amber },
        ];
        const cw = 230, cgap = 14;
        const rowW = 4 * cw + 3 * cgap;
        const sx = CX - rowW / 2;
        return (
          <g>
            {cats.map((cat, i) => (
              <CategoryCard key={i} x={sx + i * (cw + cgap)} y={Y.scCategories}
                w={cw} h={165} title={cat.title} items={cat.items} color={cat.color} />
            ))}
          </g>
        );
      })()}

      {/* Arrow from category cards to table */}
      <Arrow x1={CX} y1={Y.scCategories + 175} x2={CX} y2={Y.scTcl} />

      {/* EntityTable 4 rows: th = 48 + 5*30 + 10 = 208 */}
      <EntityTable x={CX - 380} y={Y.scTcl} title="📋 Society Common — TCL Calculation (Confirm / Override per Entity)"
        headers={["Entity", "No. of Units", "TCL/Unit", "TCL (kW)", "MDF", "EDF", "FDF"]}
        rows={[
          ["Domestic Transfer Pump", "User", "Datasheet", "Auto", "0.xx", "0.xx", "0.xx"],
          ["Main Hydrant Pump", "User", "Datasheet", "Auto", "0.xx", "0.xx", "0.xx"],
          ["STP Equipment", "User", "Datasheet", "Auto", "0.xx", "0.xx", "0.xx"],
          ["OWC Equipment", "User", "Datasheet", "Auto", "0.xx", "0.xx", "0.xx"],
        ]}
        color={C.teal} />

      <Arrow x1={CX} y1={Y.scTcl + 218} x2={CX} y2={Y.scDemand} />

      <DemandFormulaCard x={CX - 250} y={Y.scDemand} color={C.teal} />

      <Arrow x1={CX} y1={Y.scDemand + 80} x2={CX} y2={Y.scAggregate} />

      <Box x={CX - 260} y={Y.scAggregate} w={520} h={nh}
        label="Aggregate: Society Common Area Totals"
        sub="Total TCL, Total MD, Total EMD, Total FMD → Store in Load Summary Engine"
        color={C.green} badge="AGGREGATE" />

      <Arrow x1={CX} y1={Y.scAggregate + nh} x2={CX} y2={Y.mlcpDecision - 48} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — MLCP LOAD
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={CX - 220} y={Y.mlcpDecision} num={5} color={C.orange.bd} />
      <Diamond cx={CX} cy={Y.mlcpDecision} rxD={195} ryD={48}
        label="Does Project Have MLCP?"
        sub="Multi-Level Car Park Check"
        color={C.orange} />

      {/* NO branch — skip (right side) */}
      <line x1={CX + 195} y1={Y.mlcpDecision} x2={CX + 370} y2={Y.mlcpDecision}
        stroke={C.reject} strokeWidth={2.5} markerEnd="url(#ela-red)" />
      <rect x={CX + 210} y={Y.mlcpDecision - 14} width={34} height={18} rx={4} fill="#fff" opacity={0.92} />
      <text x={CX + 227} y={Y.mlcpDecision - 1} textAnchor="middle" fill={C.reject} fontSize={11} fontWeight={600}>No</text>
      <Box x={CX + 370} y={Y.mlcpDecision - 30} w={190} h={60}
        label="Skip Section"
        sub="No MLCP → Continue"
        color={C.slate} />
      {/* Skip arrow: route down right side to aggregate */}
      <path d={`M${CX + 560} ${Y.mlcpDecision + 30} L${CX + 580} ${Y.mlcpDecision + 30} L${CX + 580} ${Y.mlcpAggregate + 35} L${CX + 260} ${Y.mlcpAggregate + 35}`}
        fill="none" stroke={C.arrow} strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#ela)" />

      {/* YES branch — down */}
      <Arrow x1={CX} y1={Y.mlcpDecision + 48} x2={CX} y2={Y.mlcpCats} label="Yes" color={C.green.bd} />

      {/* MLCP Categories */}
      {(() => {
        const cats = [
          { title: "1. Lighting & Small Power", items: ["Lobby Lighting", "Parking Light", "Driveway Light", "Staircase"], color: C.amber },
          { title: "2. Lift Load", items: ["Passenger Lift"], color: C.blue },
          { title: "3. HVAC / 4. PHE", items: ["HVAC Load", "PHE Load"], color: C.purple },
          { title: "5. FF Load", items: ["Hydrant Pump", "Sprinkler Pump", "Jockey Pumps"], color: C.rose },
          { title: "6. EV Load", items: ["EV Charging Stations"], color: C.teal },
        ];
        const cw = 200, cgap = 12;
        const rowW = 5 * cw + 4 * cgap;
        const sx = CX - rowW / 2;
        return (
          <g>
            {cats.map((cat, i) => (
              <CategoryCard key={i} x={sx + i * (cw + cgap)} y={Y.mlcpCats}
                w={cw} h={150} title={cat.title} items={cat.items} color={cat.color} />
            ))}
            {/* Note */}
            <rect x={CX - 180} y={Y.mlcpCats + 165} width={360} height={28} rx={8}
              fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1.5} strokeDasharray="5,3" />
            <text x={CX} y={Y.mlcpCats + 183} textAnchor="middle" fill={C.amber.tx} fontSize={11} fontWeight={600}>
              💡 TCL Logic same as Section 3 (By Area or By Units)
            </text>
          </g>
        );
      })()}

      <Arrow x1={CX} y1={Y.mlcpCats + 200} x2={CX} y2={Y.mlcpDemand} />

      <DemandFormulaCard x={CX - 250} y={Y.mlcpDemand} color={C.orange} />

      <Arrow x1={CX} y1={Y.mlcpDemand + 80} x2={CX} y2={Y.mlcpAggregate} />

      <Box x={CX - 260} y={Y.mlcpAggregate} w={520} h={nh}
        label="Aggregate: MLCP Totals"
        sub="Total TCL, Total MD, Total EMD, Total FMD → Store in Load Summary Engine"
        color={C.green} badge="AGGREGATE" />

      <Arrow x1={CX} y1={Y.mlcpAggregate + nh} x2={CX} y2={Y.otherHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — OTHER LOAD
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={nx - 28} y={Y.otherHeader + nh / 2} num={6} color={C.violet.bd} />
      <Box x={nx} y={Y.otherHeader} w={nw} h={nh}
        label="Section 6: Other Load"
        sub="Clubhouse, KCA — Area/Unit/Direct Entry based"
        color={C.violet} badge="SECTION" />

      <Arrow x1={CX} y1={Y.otherHeader + nh} x2={CX} y2={Y.otherCalc} />

      {/* Other load method cards (3 side-by-side) */}
      {(() => {
        const methods = [
          { title: "Area Based", sub: "TCL = Area × W/Sqft / 1000", color: C.blue },
          { title: "Unit Based", sub: "TCL = TCL/Unit × No.", color: C.teal },
          { title: "Direct Entry", sub: "TCL = User-entered kW", color: C.amber },
        ];
        const cw = 260, mgap = 20;
        const rowW = 3 * cw + 2 * mgap;
        const sx = CX - rowW / 2;
        return (
          <g>
            {methods.map((m, i) => (
              <g key={i}>
                <rect x={sx + i * (cw + mgap)} y={Y.otherCalc} width={cw} height={70} rx={12}
                  fill={m.color.bg} stroke={m.color.bd} strokeWidth={2.5} />
                <text x={sx + i * (cw + mgap) + cw / 2} y={Y.otherCalc + 28} textAnchor="middle"
                  fill={m.color.tx} fontSize={14} fontWeight={700}>{m.title}</text>
                <text x={sx + i * (cw + mgap) + cw / 2} y={Y.otherCalc + 50} textAnchor="middle"
                  fill={m.color.tx} fontSize={11} fontFamily="monospace" opacity={0.7}>{m.sub}</text>
              </g>
            ))}
          </g>
        );
      })()}

      <Arrow x1={CX} y1={Y.otherCalc + 80} x2={CX} y2={Y.otherDemand} />

      <Box x={CX - 260} y={Y.otherDemand} w={520} h={nh}
        label="Aggregate: Other Load Totals"
        sub="MD = TCL × MDF | EMD = TCL × EDF | FMD = TCL × FDF → Store"
        color={C.green} badge="AGGREGATE" />

      <Arrow x1={CX} y1={Y.otherDemand + nh} x2={CX} y2={Y.finalSummary} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — FINAL LOAD SUMMARY ENGINE
      ═══════════════════════════════════════════════════════════════ */}
      <StepBadge x={CX - 450 - 28} y={Y.finalSummary + 110} num={7} color={C.green.bd} />
      <LoadSummaryDashboard x={CX - 450} y={Y.finalSummary} />

      <Arrow x1={CX} y1={Y.finalSummary + 220} x2={CX} y2={Y.sizingStart} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTIONS 8 & 9 — TRANSFORMER & DG SIZING (side by side)
      ═══════════════════════════════════════════════════════════════ */}
      {/* Fan-out horizontal bar */}
      {(() => {
        const leftCX = CX - 280;
        const rightCX = CX + 280;
        const barY = Y.sizingStart;
        return (
          <g>
            <line x1={CX} y1={barY} x2={CX} y2={barY + 20} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCX} y1={barY + 20} x2={rightCX} y2={barY + 20} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCX} y1={barY + 20} x2={leftCX} y2={barY + 40} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#ela)" />
            <line x1={rightCX} y1={barY + 20} x2={rightCX} y2={barY + 40} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#ela)" />

            <rect x={leftCX - 45} y={barY + 2} width={90} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftCX} y={barY + 15} textAnchor="middle" fill={C.amber.tx} fontSize={11} fontWeight={600}>Section 8</text>
            <rect x={rightCX - 45} y={barY + 2} width={90} height={18} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightCX} y={barY + 15} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={600}>Section 9</text>
          </g>
        );
      })()}

      {/* ────────────────────────────────────────────────────────────
          SECTION 8 — TRANSFORMER SIZING (left column)
      ──────────────────────────────────────────────────────────── */}
      {(() => {
        const colCX = CX - 280;
        const bw = 440;
        const bx = colCX - bw / 2;
        return (
          <g>
            {/* Step 1 — Sum all MD */}
            <StepBadge x={bx - 20} y={s8.input + 28} num={8} color={C.amber.bd} />
            <Box x={bx} y={s8.input} w={bw} h={55}
              label="Total Demand Load (kW) = Σ All Section MDs"
              sub="Sum of MD from Sections 2–6"
              color={C.amber} badge="INPUT" />

            <Arrow x1={colCX} y1={s8.input + 55} x2={colCX} y2={s8.formula} />

            {/* Step 2 — Convert to kVA */}
            <FormulaBlock x={bx} y={s8.formula} w={bw} h={55} color={C.amber}
              lines={[
                "Transformer kVA = Total MD ÷ 0.9",
                "Convert demand to apparent power",
              ]} />

            <Arrow x1={colCX} y1={s8.formula + 55} x2={colCX} y2={s8.select} />

            {/* Step 3 — Select standard rating */}
            <Box x={bx} y={s8.select} w={bw} h={70}
              label="Select Nearest Higher Standard Rating"
              sub="Standard: 500 / 750 / 1000 / 1500 / 2000 / 2500 kVA"
              color={C.blue} badge="STANDARD" />

            <Arrow x1={colCX} y1={s8.select + 70} x2={colCX} y2={s8.output} />

            {/* Output */}
            <rect x={bx} y={s8.output} width={bw} height={70} rx={14}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
            <rect x={bx + bw - 90} y={s8.output + 6} width={80} height={22} rx={11} fill={C.green.bd} />
            <text x={bx + bw - 50} y={s8.output + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>OUTPUT</text>
            <text x={bx + bw / 2} y={s8.output + 30} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={700}>
              ⚡ Recommended Transformer Size (kVA)
            </text>
            <text x={bx + bw / 2} y={s8.output + 50} textAnchor="middle" fill={C.green.tx} fontSize={12} opacity={0.8}>
              No. of Transformers
            </text>
          </g>
        );
      })()}

      {/* ────────────────────────────────────────────────────────────
          SECTION 9 — DG SIZING (right column)
      ──────────────────────────────────────────────────────────── */}
      {(() => {
        const colCX = CX + 280;
        const bw = 440;
        const bx = colCX - bw / 2;
        const branchLeftCX = colCX - 130;
        const branchRightCX = colCX + 130;
        return (
          <g>
            {/* Step 1 — Total Essential Load */}
            <StepBadge x={bx - 20} y={s9.gmd + 28} num={9} color={C.rose.bd} />
            <Box x={bx} y={s9.gmd} w={bw} h={55}
              label="Total Essential Load (GMD)"
              sub="GMD = Σ All Essential Loads from Sections 2–6"
              color={C.rose} badge="INPUT" />

            <Arrow x1={colCX} y1={s9.gmd + 55} x2={colCX} y2={s9.fmd} />

            {/* Step 2 — Total Fire Load */}
            <Box x={bx} y={s9.fmd} w={bw} h={55}
              label="Total Fire Load (FMD)"
              sub="FMD = Σ All Fire Loads from Sections 2–6"
              color={C.rose} badge="INPUT" />

            <Arrow x1={colCX} y1={s9.fmd + 55} x2={colCX} y2={s9.decision - 45} />

            {/* Step 3 — Decision: FMD > GMD? */}
            <Diamond cx={colCX} cy={s9.decision} rxD={160} ryD={45}
              label="FMD > GMD ?"
              sub="Compare fire vs essential"
              color={C.amber} />

            {/* YES branch — left: DG Base = FMD */}
            <Arrow x1={colCX - 100} y1={s9.decision + 35} x2={branchLeftCX} y2={s9.branchY}
              label="Yes" color={C.green.bd} />
            <rect x={branchLeftCX - 100} y={s9.branchY} width={200} height={50} rx={10}
              fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2.5} />
            <text x={branchLeftCX} y={s9.branchY + 22} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={700}>
              DG Base = FMD
            </text>
            <text x={branchLeftCX} y={s9.branchY + 40} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.7}>
              Fire load is higher
            </text>

            {/* NO branch — right: DG Base = GMD */}
            <Arrow x1={colCX + 100} y1={s9.decision + 35} x2={branchRightCX} y2={s9.branchY}
              label="No" color={C.reject} />
            <rect x={branchRightCX - 100} y={s9.branchY} width={200} height={50} rx={10}
              fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2.5} />
            <text x={branchRightCX} y={s9.branchY + 22} textAnchor="middle" fill={C.amber.tx} fontSize={13} fontWeight={700}>
              DG Base = GMD
            </text>
            <text x={branchRightCX} y={s9.branchY + 40} textAnchor="middle" fill={C.amber.tx} fontSize={10} opacity={0.7}>
              Essential load is higher
            </text>

            {/* Fan-in to converge (kVA formula) */}
            <Arrow x1={branchLeftCX} y1={s9.branchY + 50} x2={colCX} y2={s9.converge} />
            <Arrow x1={branchRightCX} y1={s9.branchY + 50} x2={colCX} y2={s9.converge} />

            {/* Step 4 — Convert to kVA */}
            <FormulaBlock x={bx} y={s9.converge} w={bw} h={55} color={C.rose}
              lines={[
                "DG kVA = DG Base Load ÷ 0.9",
                "Convert to apparent power",
              ]} />

            <Arrow x1={colCX} y1={s9.converge + 55} x2={colCX} y2={s9.select} />

            {/* Step 5 — Select standard rating */}
            <Box x={bx} y={s9.select} w={bw} h={70}
              label="Select Nearest Higher Standard DG Rating"
              sub="Standard: 500 / 750 / 1010 / 1500 / 2000 kVA"
              color={C.blue} badge="STANDARD" />

            <Arrow x1={colCX} y1={s9.select + 70} x2={colCX} y2={s9.output} />

            {/* Output */}
            <rect x={bx} y={s9.output} width={bw} height={70} rx={14}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
            <rect x={bx + bw - 90} y={s9.output + 6} width={80} height={22} rx={11} fill={C.green.bd} />
            <text x={bx + bw - 50} y={s9.output + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>OUTPUT</text>
            <text x={bx + bw / 2} y={s9.output + 30} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={700}>
              🔋 Recommended DG Size (kVA)
            </text>
            <text x={bx + bw / 2} y={s9.output + 50} textAnchor="middle" fill={C.green.tx} fontSize={12} opacity={0.8}>
              No. of DG Sets
            </text>
          </g>
        );
      })()}

      {/* Arrow from sizing sections to Section 10 */}
      <Arrow x1={CX - 280} y1={s8.output + 70} x2={CX} y2={Y.finalOutput} />
      <Arrow x1={CX + 280} y1={s9.output + 70} x2={CX} y2={Y.finalOutput} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10 — FINAL OUTPUT SUMMARY
      ═══════════════════════════════════════════════════════════════ */}
      {(() => {
        const dw = 900, dh = 320;
        const dx = CX - dw / 2;
        const dy = Y.finalOutput;
        const fields = [
          { label: "Total Connected Load (TCL)", value: "Σ kW", icon: "⚡", color: C.blue },
          { label: "Total Demand Load (MD)", value: "Σ kW", icon: "📊", color: C.green },
          { label: "Total Essential Load (GMD)", value: "Σ kW", icon: "🔌", color: C.amber },
          { label: "Total Fire Load (FMD)", value: "Σ kW", icon: "🔥", color: C.rose },
          { label: "Transformer Size", value: "kVA", icon: "⚡", color: C.purple },
          { label: "DG Size", value: "kVA", icon: "🔋", color: C.teal },
          { label: "Diversity Factors Used", value: "MDF / EDF / FDF", icon: "📐", color: C.cyan },
          { label: "Norm Reference", value: "Authority / Policy", icon: "📋", color: C.violet },
        ];
        const colW = (dw - 40) / 2;
        const rowH = 52;

        return (
          <g>
            <StepBadge x={dx - 28} y={dy + 150} num={10} color={C.blue.bd} />

            {/* Card background */}
            <rect x={dx} y={dy} width={dw} height={dh} rx={16}
              fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
            <rect x={dx} y={dy} width={dw} height={48} rx={16} fill={C.blue.bd} />
            <rect x={dx} y={dy + 34} width={dw} height={14} fill={C.blue.bd} />
            <text x={dx + dw / 2} y={dy + 32} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
              {"📋"} SECTION 10 — FINAL OUTPUT SUMMARY
            </text>

            {/* 2-column grid of output fields */}
            {fields.map((f, i) => {
              const col = i % 2;
              const row = Math.floor(i / 2);
              const fx = dx + 14 + col * (colW + 12);
              const fy = dy + 60 + row * (rowH + 8);

              return (
                <g key={i}>
                  <rect x={fx} y={fy} width={colW} height={rowH} rx={10}
                    fill={f.color.bg} stroke={f.color.bd} strokeWidth={2} />
                  <text x={fx + 14} y={fy + 20} fill={f.color.tx} fontSize={13} fontWeight={700}>
                    {f.icon} {f.label}
                  </text>
                  <rect x={fx + colW - 130} y={fy + 28} width={118} height={20} rx={6}
                    fill="#fff" stroke={f.color.bd} strokeWidth={1.2} strokeDasharray="4,2" />
                  <text x={fx + colW - 71} y={fy + 42} textAnchor="middle"
                    fill={f.color.bd} fontSize={11} fontWeight={600}>{f.value}</text>
                </g>
              );
            })}

            {/* Footer */}
            <text x={dx + dw / 2} y={dy + dh - 12} textAnchor="middle" fill={C.blue.tx} fontSize={10} opacity={0.5}>
              Complete electrical load analysis → Results fed to Space Matrix & Detailed Design stages
            </text>
          </g>
        );
      })()}

      {/* Final completion node */}
      {(() => {
        const endY = Y.finalOutput + 340;
        return (
          <g>
            <Arrow x1={CX} y1={Y.finalOutput + 320} x2={CX} y2={endY} />
            <rect x={CX - 220} y={endY} width={440} height={70} rx={35}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
            <text x={CX} y={endY + 30} textAnchor="middle" fill={C.green.tx} fontSize={16} fontWeight={700}>
              ✅ Electrical Load Calculation Complete
            </text>
            <text x={CX} y={endY + 50} textAnchor="middle" fill={C.green.tx} fontSize={11} opacity={0.7}>
              All outputs saved → Proceed to next stage
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
