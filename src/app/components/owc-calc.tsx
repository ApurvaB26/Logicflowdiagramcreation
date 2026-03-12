import React from "react";

// =====================================================================
// OWC (Organic Waste Converter) CALCULATOR — Custom SVG Flow Diagram
// Auto-population only | Lodha Policy Norms | Validation Gate
// Project Data → Auto-Population → Lodha Norms → Waste Generation →
// Segregation → Bin Sizing → Infrastructure → OWC Machine → Compost → Dashboard
// =====================================================================

const W = 1600;
const H = 6800;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#owc-a)" />
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

function DataTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 780, colW = tw / headers.length;
  const rowH = 28, hdrY = y + 52;
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
          <text x={x + i * colW + colW / 2} y={hdrY + 19} textAnchor="middle"
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
                  stroke={isAuto ? C.green.bd : "#e2e8f0"}
                  strokeWidth={isAuto ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 20}
                  textAnchor="middle"
                  fill={isAuto ? C.green.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isAuto ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
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

// Redirect flag banner
function RedirectFlag({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={40} rx={8}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={x + 22} y={y + 17} fill={C.amber.tx} fontSize={14}>
        {"\u26A0\uFE0F"}
      </text>
      <text x={x + 42} y={y + 17} fill={C.amber.tx} fontSize={11} fontWeight={700}>
        To modify any input data, click the cell {"\u2192"} Redirects to Main Input Page
      </text>
      <text x={x + 42} y={y + 33} fill={C.amber.tx} fontSize={10} opacity={0.7}>
        All project parameters are fetched from the central database. Changes must be made at the source.
      </text>
    </g>
  );
}

// Lodha Policy Norms card (replaces NBC/CPHEEO)
function LodhaNormsCard({ x, y }: { x: number; y: number }) {
  const w = 600, h = 240;
  const fields = [
    { label: "Residential Waste Rate", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "Commercial Waste Rate", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "Wet : Dry Ratio", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "Density \u2014 Wet Waste", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "Density \u2014 Dry Waste", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "OWC Safety Factor", value: "As per Lodha Policy", src: "Lodha Policy" },
    { label: "Per-capita Generation Rate", value: "As per Lodha Policy", src: "Lodha Policy" },
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#f8fafc" stroke={C.amber.bd} strokeWidth={3} />
      <rect x={x} y={y} width={w} height={42} rx={14} fill={C.amber.bd} />
      <rect x={x} y={y + 30} width={w} height={12} fill={C.amber.bd} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {"\uD83C\uDFE2"} LODHA POLICY \u2014 Waste Generation Norms
      </text>
      {fields.map((f, i) => {
        const fy = y + 52 + i * 26;
        return (
          <g key={i}>
            <circle cx={x + 22} cy={fy + 9} r={4} fill={C.amber.bd} />
            <text x={x + 34} y={fy + 14} fill={C.amber.tx} fontSize={12} fontWeight={500}>{f.label}</text>
            <rect x={x + 310} y={fy + 1} width={140} height={18} rx={4}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
            <text x={x + 380} y={fy + 14} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={600}>
              {f.value}
            </text>
            <text x={x + 520} y={fy + 14} textAnchor="middle" fill={C.amber.tx} fontSize={9} opacity={0.6}>
              {f.src}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Bin sizing table
function BinSizingTable({ x, y }: { x: number; y: number }) {
  const tw = 800, th = 250;
  const headers = ["Bin Type", "Capacity (L)", "Footprint (m\u00b2)", "Colour Code", "Stream", "Nos Required"];
  const rows = [
    ["HDPE 120L", "120", "0.24", "Green", "Wet Waste", "Auto-calc"],
    ["HDPE 240L", "240", "0.42", "Green", "Wet Waste", "Auto-calc"],
    ["HDPE 1100L", "1100", "1.05", "Blue", "Dry Waste", "Auto-calc"],
    ["HDPE 660L", "660", "0.82", "Blue", "Dry Waste", "Auto-calc"],
    ["Hazardous 30L", "30", "0.08", "Red", "Biomedical", "Auto-calc"],
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
        {"\uD83D\uDCCA"} BIN DATABASE \u2014 Available Sizes & Specifications (Lodha Policy)
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        System auto-selects optimal bin mix based on waste volume
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
            const isAuto = cell === "Auto-calc";
            const isGreen = cell === "Green";
            const isBlue = cell === "Blue";
            const isRed = cell === "Red";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAuto ? C.green.bg : isGreen ? "#d1fae5" : isBlue ? "#dbeafe" : isRed ? "#ffe4e6" : "#fff"}
                  stroke={isAuto ? C.green.bd : "#e2e8f0"} strokeWidth={isAuto ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 20}
                  textAnchor="middle"
                  fill={isAuto ? C.green.tx : "#64748b"} fontSize={10} fontWeight={isAuto ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// OWC Machine selection table
function OWCMachineTable({ x, y }: { x: number; y: number }) {
  const tw = 760, th = 220;
  const headers = ["Model", "Capacity (kg/day)", "Power (kW)", "Footprint (m\u00b2)", "Cycle (hrs)", "Selection"];
  const rows = [
    ["OWC-50", "50", "1.5", "1.2", "18\u201324", "\u2014"],
    ["OWC-100", "100", "2.2", "2.0", "18\u201324", "\u2014"],
    ["OWC-200", "200", "3.7", "3.5", "16\u201320", "\u2014"],
    ["OWC-500", "500", "7.5", "6.0", "16\u201320", "Auto-select"],
  ];
  const colW = tw / 6;
  const rowH = 28;
  const hdrY = y + 50;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={C.green.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={C.green.bd} />
      <text x={x + 18} y={y + 20} fill="#fff" fontSize={13} fontWeight={700}>
        {"\u2699\uFE0F"} OWC MACHINE DATABASE \u2014 Standard Models & Specifications
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        Auto-selects smallest machine {"\u2265"} required capacity with safety factor
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 19} textAnchor="middle"
            fill={C.green.tx} fontSize={10} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isSelect = cell === "Auto-select";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isSelect ? C.teal.bg : "#fff"}
                  stroke={isSelect ? C.teal.bd : "#e2e8f0"} strokeWidth={isSelect ? 2 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 20}
                  textAnchor="middle"
                  fill={isSelect ? C.teal.tx : "#64748b"} fontSize={10}
                  fontWeight={isSelect ? 700 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

// Final summary dashboard
function OWCSummaryDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1000, dh = 280;
  const sections = [
    { label: "Total Daily\nWaste", icon: "\uD83D\uDDD1\uFE0F", color: C.slate },
    { label: "Wet Waste\n(Organic)", icon: "\uD83D\uDFE2", color: C.green },
    { label: "Dry Waste\n(Recyclable)", icon: "\uD83D\uDD35", color: C.blue },
    { label: "OWC Machine\nCapacity", icon: "\u2699\uFE0F", color: C.teal },
    { label: "Compost\nOutput", icon: "\uD83C\uDF31", color: C.green },
  ];
  const metrics = [
    { label: "Green Bins", value: "XX Nos", color: C.green },
    { label: "Blue Bins", value: "XX Nos", color: C.blue },
    { label: "Garbage Room", value: "XX Sq.m", color: C.amber },
    { label: "OWC Room", value: "XX Sq.m", color: C.teal },
  ];
  const cardW = (dw - 60) / 5;
  const metricW = (dw - 60) / 4;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.green.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"\uD83D\uDCCA"} OWC FINAL OUTPUT DASHBOARD \u2014 Complete Waste Management Summary
      </text>
      {sections.map((s, i) => {
        const scx = x + 12 + i * (cardW + 8);
        const scy = y + 52;
        return (
          <g key={i}>
            <rect x={scx} y={scy} width={cardW} height={55} rx={8}
              fill={s.color.bg} stroke={s.color.bd} strokeWidth={1.5} />
            <text x={scx + cardW / 2} y={scy + 18} textAnchor="middle" fontSize={16}>{s.icon}</text>
            <text x={scx + cardW / 2} y={scy + 34} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[0]}</text>
            <text x={scx + cardW / 2} y={scy + 46} textAnchor="middle"
              fill={s.color.tx} fontSize={9} fontWeight={600}>{s.label.split("\n")[1]}</text>
          </g>
        );
      })}
      {metrics.map((m, i) => {
        const mcx = x + 12 + i * (metricW + 10);
        const mcy = y + 120;
        return (
          <g key={`m-${i}`}>
            <rect x={mcx} y={mcy} width={metricW} height={56} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={mcx + metricW / 2} y={mcy + 22} textAnchor="middle"
              fill={m.color.tx} fontSize={13} fontWeight={700}>{m.label}</text>
            <text x={mcx + metricW / 2} y={mcy + 42} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
      <text x={x + dw / 2} y={y + 200} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.6}>
        Total Waste = Wet + Dry | Bin Count per stream | Garbage Room = Bin footprint {"\u00D7"} 1.5 | OWC = Wet {"\u00D7"} SF
      </text>

      {/* Compliance row */}
      <rect x={x + 20} y={y + 216} width={dw - 40} height={44} rx={8}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1.5} />
      <text x={x + dw / 2} y={y + 234} textAnchor="middle" fill={C.violet.tx} fontSize={12} fontWeight={700}>
        {"\u2705"} Compliance: Lodha Policy Norms | SWM Rules 2016 | State PCB Norms
      </text>
      <text x={x + dw / 2} y={y + 250} textAnchor="middle" fill={C.violet.tx} fontSize={10} opacity={0.7}>
        Export {"\u2192"} Concept Report | BOQ Input | SWM Plan Drawing | IGBC/GRIHA Submission
      </text>
    </g>
  );
}


// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function OWCCalcSVG() {

  // ── Computed Y positions with proper spacing ──
  // DataTable(8 rows) height: 52 + 9*30 + 12 = 334
  // DataTable(4 rows) height: 52 + 5*30 + 12 = 224
  // DataTable(3 rows) height: 52 + 4*30 + 12 = 184

  const nw = 440;
  const nx = CX - nw / 2;
  const tableX = CX - 390;

  // ── Y coordinate map (carefully computed, no overlaps) ──
  const Y = {
    // Section 0: Entry
    entry:          50,
    // Section 1: Project Data Auto-Fetch
    dbFetch:        170,
    fetchTable:     290,
    redirectFlag:   648,  // 290 + 334 + 24
    // Section 2: Population (Auto only + Validation)
    popHeader:      740,
    popAutoCalc:    860,
    popValidate:    1010, // diamond cy
    popApproved:    1120,
    // Section 3: Lodha Policy Norms (no acceptance diamond)
    normsHeader:    1240,
    normsCard:      1360,
    normsLocked:    1650,
    // Section 4: Waste Generation Engine
    wasteHeader:    1770,
    wasteFormula:   1890,
    wasteTotal:     2030,
    wasteTable:     2150,
    // Section 5: Segregation (60/40)
    segHeader:      2440,
    segSplit:       2590,
    segWetCalc:     2620,
    segDryCalc:     2620,
    segConverge:    2810,
    // Section 6: Bin Sizing
    binHeader:      2930,
    binTable:       3050,
    binFormula:     3350,
    binResult:      3490,
    // Section 7: Infrastructure
    infraHeader:    3740,
    garbageRoom:    3860,
    garbageFormula: 3980,
    infraDecision:  4130,  // diamond cy
    infraCentral:   4240,
    infraDist:      4240,
    infraConverge:  4370,
    // Section 8: OWC Machine Selection
    owcHeader:      4490,
    owcCapacity:    4610,
    owcTable:       4750,
    owcDecision:    5030,  // diamond cy
    owcMulti:       5140,
    owcSingle:      5140,
    owcConverge:    5270,
    // Section 9: Composting & Sludge
    compHeader:     5390,
    compCalc:       5510,
    compStreams:     5660,
    sludgeCalc:     5840,
    // Section 10: Final Dashboard
    dashboard:      5980,
    // Terminal
    terminal:       6310,
  };

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="owc-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="owc-green" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
        <marker id="owc-red" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
        </marker>
      </defs>

      {/* ═══════════════════════════════════════════════════════════════
          PHASE BANDS
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.entry - 15}       h={100}  label="ENTRY \u2014 OWC CALCULATION MODULE" color={C.blue.bd} />
      <PhaseBand y={Y.dbFetch - 20}     h={Y.popHeader - Y.dbFetch - 30} label="SECTION 1 \u2014 PROJECT DATA AUTO-FETCH FROM MAIN DATABASE" color={C.purple.bd} />
      <PhaseBand y={Y.popHeader - 20}   h={Y.normsHeader - Y.popHeader - 30} label="SECTION 2 \u2014 AUTO POPULATION CALCULATION & VALIDATION GATE" color={C.blue.bd} />
      <PhaseBand y={Y.normsHeader - 20} h={Y.wasteHeader - Y.normsHeader - 30} label="SECTION 3 \u2014 LODHA POLICY WASTE GENERATION NORMS" color={C.amber.bd} />
      <PhaseBand y={Y.wasteHeader - 20} h={Y.segHeader - Y.wasteHeader - 30} label="SECTION 4 \u2014 WASTE GENERATION ENGINE" color={C.orange.bd} />
      <PhaseBand y={Y.segHeader - 20}   h={Y.binHeader - Y.segHeader - 30} label="SECTION 5 \u2014 WASTE SEGREGATION (WET/DRY SPLIT)" color={C.teal.bd} />
      <PhaseBand y={Y.binHeader - 20}   h={Y.infraHeader - Y.binHeader - 30} label="SECTION 6 \u2014 BIN CAPACITY & SIZING (LODHA POLICY)" color={C.cyan.bd} />
      <PhaseBand y={Y.infraHeader - 20} h={Y.owcHeader - Y.infraHeader - 30} label="SECTION 7 \u2014 INFRASTRUCTURE PLANNING (GARBAGE ROOM)" color={C.violet.bd} />
      <PhaseBand y={Y.owcHeader - 20}   h={Y.compHeader - Y.owcHeader - 30} label="SECTION 8 \u2014 OWC MACHINE SELECTION & SIZING" color={C.green.bd} />
      <PhaseBand y={Y.compHeader - 20}  h={Y.dashboard - Y.compHeader - 30} label="SECTION 9 \u2014 COMPOSTING OUTPUT & SLUDGE HANDLING" color={C.rose.bd} />
      <PhaseBand y={Y.dashboard - 20}   h={Y.terminal - Y.dashboard + 120} label="SECTION 10 \u2014 FINAL OUTPUT DASHBOARD" color={C.green.bd} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 0 — ENTRY
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.entry} w={nw} h={70}
        label="Start: OWC Calculation Module"
        sub="Organic Waste Converter \u2014 Sizing, Bins & Infrastructure"
        color={C.blue} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + 70} x2={CX} y2={Y.dbFetch} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — PROJECT DATA AUTO-FETCH
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.dbFetch} w={nw} h={70}
        label="Connect to Main Building Database"
        sub="Auto-fetch key project parameters for waste calculation"
        color={C.purple} badge="DB FETCH" />
      <Arrow x1={CX} y1={Y.dbFetch + 70} x2={CX} y2={Y.fetchTable} />

      <DataTable x={tableX} y={Y.fetchTable}
        title={"\uD83D\uDCC4 AUTO-FETCHED DATA FROM MAIN DATABASE"}
        headers={["Parameter", "Source", "Value", "Logic"]}
        rows={[
          ["Project Name & Location", "Main DB", "Auto", "Direct fetch"],
          ["Total Number of Flats", "Main DB", "Auto", "Direct fetch"],
          ["Typology Mix (BHK)", "Main DB", "Auto", "1/2/3/4 BHK counts"],
          ["Total Carpet Area (sqm)", "Main DB", "Auto", "Sum all units"],
          ["Total Car Parks", "Main DB", "Auto", "Direct fetch"],
          ["Occupancy Rate (persons/flat)", "Main DB", "Auto", "BHK-wise standard"],
          ["Total Population", "Calculated", "Auto-calc", "\u03A3(Flats \u00D7 Occupancy)"],
          ["Commercial Area (sqm)", "Main DB", "Auto", "If applicable"],
        ]}
        color={C.purple}
      />

      {/* Redirect flag below input table */}
      <RedirectFlag x={tableX} y={Y.redirectFlag} w={780} />

      <Arrow x1={CX} y1={Y.redirectFlag + 50} x2={CX} y2={Y.popHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — AUTO POPULATION CALCULATION & VALIDATION GATE
          (Manual override removed — auto-population only)
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.popHeader} w={nw} h={70}
        label="Auto Population Computation"
        sub="System auto-calculates from Main DB \u2014 no manual override"
        color={C.blue} badge="AUTO-CALC" />
      <Arrow x1={CX} y1={Y.popHeader + 70} x2={CX} y2={Y.popAutoCalc} />

      <Box x={CX - 320} y={Y.popAutoCalc} w={640} h={80}
        label={`Auto: \u03A3(Flats \u00D7 BHK Occupancy Rate)`}
        sub="Standard: 1BHK=2.5, 2BHK=3.5, 3BHK=4.5, 4BHK=5.5 persons/unit"
        color={C.green} badge="AUTO" />

      {/* Side note: no manual */}
      <NoteBox x={CX + 360} y={Y.popAutoCalc - 10} w={220} h={80}
        icon={"\uD83D\uDD12"} title="Manual Disabled"
        lines={["Population is auto-fetched", "No manual override allowed", "Change at Main Input only"]}
        color={C.slate} />
      <line x1={CX + 320} y1={Y.popAutoCalc + 40} x2={CX + 360} y2={Y.popAutoCalc + 40}
        stroke={C.slate.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.popAutoCalc + 80} x2={CX} y2={Y.popValidate - 50} />

      {/* ── VALIDATION GATE ── */}
      <Diamond cx={CX} cy={Y.popValidate} rxD={220} ryD={50}
        label="Validate & Approve Data?"
        sub="User must review and approve before proceeding"
        color={C.blue} />

      {/* Approved → proceed */}
      <Arrow x1={CX} y1={Y.popValidate + 50} x2={CX} y2={Y.popApproved}
        label="Approved" color={C.green.bd} />
      <Box x={nx} y={Y.popApproved} w={nw} h={60}
        label="Population Validated & Locked (P)"
        sub="Approved by user \u2014 locked for all downstream calcs"
        color={C.green} badge="LOCKED" />

      {/* Not Approved → redirect to main input */}
      <Arrow x1={CX + 220} y1={Y.popValidate} x2={CX + 440} y2={Y.popValidate}
        label="Not Approved" color={C.reject} />
      <g>
        <rect x={CX + 440} y={Y.popValidate - 40} width={340} height={80} rx={12}
          fill={C.rose.bg} stroke={C.reject} strokeWidth={2.5} />
        <rect x={CX + 440 + 340 - 100} y={Y.popValidate - 34} width={90} height={22} rx={11} fill={C.reject} opacity={0.85} />
        <text x={CX + 440 + 340 - 55} y={Y.popValidate - 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>REDIRECT</text>
        <text x={CX + 610} y={Y.popValidate - 8} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={700}>
          {"\u26A0\uFE0F"} Redirect to Main Input Page
        </text>
        <text x={CX + 610} y={Y.popValidate + 12} textAnchor="middle" fill={C.rose.tx} fontSize={11} opacity={0.7}>
          Modify source data at origin
        </text>
        <text x={CX + 610} y={Y.popValidate + 28} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.6}>
          Then re-enter OWC module
        </text>
      </g>

      <Arrow x1={CX} y1={Y.popApproved + 60} x2={CX} y2={Y.normsHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — LODHA POLICY NORMS (no acceptance/override diamond)
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.normsHeader} w={nw} h={70}
        label="Fetch Waste Generation Norms"
        sub="Lodha Policy Norms \u2014 Applied automatically"
        color={C.amber} badge="NORMS" />
      <Arrow x1={CX} y1={Y.normsHeader + 70} x2={CX} y2={Y.normsCard} />

      <LodhaNormsCard x={CX - 300} y={Y.normsCard} />

      {/* Side reference */}
      <NoteBox x={CX + 340} y={Y.normsCard + 30} w={240} h={100}
        icon={"\uD83C\uDFE2"} title="Lodha Policy"
        lines={["Lodha-specific waste norms", "Applied as per project policy", "Values will be updated", "by user-provided data"]}
        color={C.amber} />
      <line x1={CX + 300} y1={Y.normsCard + 80} x2={CX + 340} y2={Y.normsCard + 80}
        stroke={C.amber.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.normsCard + 240} x2={CX} y2={Y.normsLocked} />

      <Box x={nx} y={Y.normsLocked} w={nw} h={60}
        label="Lodha Norms Locked (R kg/cap/day)"
        sub="Policy values auto-applied \u2014 no override option"
        color={C.green} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.normsLocked + 60} x2={CX} y2={Y.wasteHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — WASTE GENERATION ENGINE
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.wasteHeader} w={nw} h={70}
        label="Waste Generation Calculation Engine"
        sub="Compute total daily solid waste from population & norms"
        color={C.orange} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.wasteHeader + 70} x2={CX} y2={Y.wasteFormula} />

      <FormulaBlock x={CX - 320} y={Y.wasteFormula} w={640} h={90}
        lines={[
          "W_total = P \u00D7 R",
          "W_total = Population \u00D7 Waste Rate (kg/cap/day)",
          "Example: 2000 persons \u00D7 0.45 = 900 kg/day",
        ]}
        color={C.orange} />

      {/* Side: additional sources */}
      <NoteBox x={CX + 360} y={Y.wasteFormula} w={240} h={90}
        icon={"\uD83D\uDCE6"} title="Additional Sources"
        lines={["+ Commercial area waste", "+ Club/Amenity area waste", "+ Visitor waste (5% uplift)"]}
        color={C.orange} />
      <line x1={CX + 320} y1={Y.wasteFormula + 45} x2={CX + 360} y2={Y.wasteFormula + 45}
        stroke={C.orange.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.wasteFormula + 90} x2={CX} y2={Y.wasteTotal} />

      <Box x={CX - 280} y={Y.wasteTotal} w={560} h={70}
        label="Total Daily Waste = W_total + W_commercial + W_visitor"
        sub="Aggregated daily solid waste generation (kg/day)"
        color={C.orange} badge="TOTAL" />

      <Arrow x1={CX} y1={Y.wasteTotal + 70} x2={CX} y2={Y.wasteTable} />

      <DataTable x={tableX} y={Y.wasteTable}
        title={"\uD83D\uDCCA WASTE GENERATION BREAKDOWN"}
        headers={["Source", "Population/Area", "Rate", "Waste (kg/day)"]}
        rows={[
          ["Residential", "P persons", "As per Lodha Policy", "Auto-calc"],
          ["Commercial", "Area sqm", "As per Lodha Policy", "Auto-calc"],
          ["Club/Amenity", "Area sqm", "As per Lodha Policy", "Auto-calc"],
          ["Visitor (5%)", "Estimated", "5% of residential", "Auto-calc"],
        ]}
        color={C.orange}
      />
      <Arrow x1={CX} y1={Y.wasteTable + 224} x2={CX} y2={Y.segHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — WASTE SEGREGATION (60:40)
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.segHeader} w={nw} h={70}
        label="Waste Segregation at Source"
        sub="SWM Rules 2016 \u2014 Mandatory source segregation"
        color={C.teal} badge="SEGREGATION" />
      <Arrow x1={CX} y1={Y.segHeader + 70} x2={CX} y2={Y.segSplit - 50} />

      {/* Fan-out to Wet/Dry */}
      {(() => {
        const leftX = CX - 340;
        const rightX = CX + 60;
        const boxW = 280;
        const barY = Y.segSplit - 30;
        return (
          <g>
            <line x1={CX} y1={barY} x2={CX} y2={barY + 5}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX + boxW / 2} y1={barY + 5} x2={rightX + boxW / 2} y2={barY + 5}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX + boxW / 2} y1={barY + 5} x2={leftX + boxW / 2} y2={Y.segWetCalc}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
            <line x1={rightX + boxW / 2} y1={barY + 5} x2={rightX + boxW / 2} y2={Y.segDryCalc}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
            {/* Labels */}
            <rect x={leftX + boxW / 2 - 22} y={barY - 14} width={44} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX + boxW / 2} y={barY - 3} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>60%</text>
            <rect x={rightX + boxW / 2 - 22} y={barY - 14} width={44} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX + boxW / 2} y={barY - 3} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>40%</text>
          </g>
        );
      })()}

      {/* Wet Waste (left) */}
      <Box x={CX - 340} y={Y.segWetCalc} w={280} h={80}
        label="Wet Waste (Organic)"
        sub="60% of total \u2192 Kitchen/Food waste"
        color={C.green} badge="WET" />
      <FormulaBlock x={CX - 370} y={Y.segWetCalc + 90} w={340} h={60}
        lines={["W_wet = W_total \u00D7 0.60", "Volume_wet = W_wet \u00F7 500 kg/m\u00B3"]}
        color={C.green} />

      {/* Dry Waste (right) */}
      <Box x={CX + 60} y={Y.segDryCalc} w={280} h={80}
        label="Dry Waste (Recyclable)"
        sub="40% of total \u2192 Paper/Plastic/Glass"
        color={C.blue} badge="DRY" />
      <FormulaBlock x={CX + 30} y={Y.segDryCalc + 90} w={340} h={60}
        lines={["W_dry = W_total \u00D7 0.40", "Volume_dry = W_dry \u00F7 150 kg/m\u00B3"]}
        color={C.blue} />

      {/* Converge */}
      <Arrow x1={CX - 200} y1={Y.segWetCalc + 150} x2={CX} y2={Y.segConverge} />
      <Arrow x1={CX + 200} y1={Y.segDryCalc + 150} x2={CX} y2={Y.segConverge} />
      <Box x={nx} y={Y.segConverge} w={nw} h={60}
        label="Segregated Volumes Calculated"
        sub="Wet volume + Dry volume \u2192 inputs to bin sizing"
        color={C.teal} badge="PROCEED" />
      <Arrow x1={CX} y1={Y.segConverge + 60} x2={CX} y2={Y.binHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — BIN CAPACITY & SIZING
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.binHeader} w={nw} h={70}
        label="Bin Sizing Engine"
        sub="Fetch bin specs from DB \u2192 auto-select optimal mix"
        color={C.cyan} badge="SIZING" />
      <Arrow x1={CX} y1={Y.binHeader + 70} x2={CX} y2={Y.binTable} />

      <BinSizingTable x={CX - 400} y={Y.binTable} />

      <Arrow x1={CX} y1={Y.binTable + 250} x2={CX} y2={Y.binFormula} />

      <FormulaBlock x={CX - 340} y={Y.binFormula} w={680} h={90}
        lines={[
          "N_wet_bins = Volume_wet \u00F7 (Bin_capacity_L \u00F7 1000) \u00F7 \u03B7",
          "N_dry_bins = Volume_dry \u00F7 (Bin_capacity_L \u00F7 1000) \u00F7 \u03B7",
          "\u03B7 = Fill efficiency factor (0.75\u20130.85) | Collection freq: 1\u00D7/day",
        ]}
        color={C.cyan} />

      <Arrow x1={CX} y1={Y.binFormula + 90} x2={CX} y2={Y.binResult} />

      <DataTable x={tableX} y={Y.binResult}
        title={"\uD83D\uDCCB BIN REQUIREMENT SUMMARY"}
        headers={["Stream", "Daily Volume (m\u00B3)", "Bin Size", "Fill Factor", "Nos Required"]}
        rows={[
          ["Wet (Green)", "Auto-calc", "240L", "0.80", "Auto-calc"],
          ["Dry (Blue)", "Auto-calc", "1100L", "0.75", "Auto-calc"],
          ["Hazardous (Red)", "Nominal", "30L", "\u2014", "2 min"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.binResult + 184} x2={CX} y2={Y.infraHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — INFRASTRUCTURE PLANNING
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.infraHeader} w={nw} h={70}
        label="Garbage Room Infrastructure"
        sub="Sizing based on total bin footprint + circulation"
        color={C.violet} badge="INFRA" />
      <Arrow x1={CX} y1={Y.infraHeader + 70} x2={CX} y2={Y.garbageRoom} />

      <Box x={CX - 280} y={Y.garbageRoom} w={560} h={70}
        label="Calculate Total Bin Footprint"
        sub={`\u03A3(N_bins \u00D7 Footprint per bin) for all streams`}
        color={C.violet} badge="COMPUTE" />
      <Arrow x1={CX} y1={Y.garbageRoom + 70} x2={CX} y2={Y.garbageFormula} />

      <FormulaBlock x={CX - 340} y={Y.garbageFormula} w={680} h={90}
        lines={[
          "A_garbage = \u03A3(N_i \u00D7 FP_i) \u00D7 CF",
          "CF = Circulation Factor = 1.50 (50% extra for access/movement)",
          "Minimum area as per Lodha Policy norms",
        ]}
        color={C.violet} />

      {/* Side note */}
      <NoteBox x={CX + 380} y={Y.garbageFormula} w={220} h={90}
        icon={"\uD83D\uDCA1"} title="Design Rules"
        lines={["Min headroom: 2.4m", "Washable flooring req'd", "Ventilation: 6 ACH min"]}
        color={C.violet} />
      <line x1={CX + 340} y1={Y.garbageFormula + 45} x2={CX + 380} y2={Y.garbageFormula + 45}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.garbageFormula + 90} x2={CX} y2={Y.infraDecision - 48} />

      <Diamond cx={CX} cy={Y.infraDecision} rxD={210} ryD={48}
        label="Layout Strategy?"
        sub="Centralized or Distributed Collection?"
        color={C.violet} />

      {/* Centralized (left) */}
      <Arrow x1={CX - 140} y1={Y.infraDecision + 40} x2={CX - 300} y2={Y.infraCentral}
        label="Centralized" color={C.green.bd} />
      <Box x={CX - 520} y={Y.infraCentral} w={420} h={70}
        label="Single Garbage Room at Basement"
        sub="One large room \u2014 simpler O&M, higher area need"
        color={C.green} badge="OPTION A" />

      {/* Distributed (right) */}
      <Arrow x1={CX + 140} y1={Y.infraDecision + 40} x2={CX + 300} y2={Y.infraDist}
        label="Distributed" color={C.reject} />
      <Box x={CX + 100} y={Y.infraDist} w={420} h={70}
        label="Multiple Collection Points per Wing"
        sub="Smaller rooms per block \u2014 lower per-room area"
        color={C.amber} badge="OPTION B" />

      {/* Converge */}
      <Arrow x1={CX - 300} y1={Y.infraCentral + 70} x2={CX} y2={Y.infraConverge} />
      <Arrow x1={CX + 300} y1={Y.infraDist + 70} x2={CX} y2={Y.infraConverge} />
      <Box x={nx} y={Y.infraConverge} w={nw} h={60}
        label="Garbage Room Area Finalized"
        sub="Layout selected \u2192 area locked for drawing input"
        color={C.violet} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.infraConverge + 60} x2={CX} y2={Y.owcHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8 — OWC MACHINE SELECTION
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.owcHeader} w={nw} h={70}
        label="OWC Machine Sizing Engine"
        sub="Select machine based on wet waste capacity requirement"
        color={C.green} badge="SIZING" />
      <Arrow x1={CX} y1={Y.owcHeader + 70} x2={CX} y2={Y.owcCapacity} />

      <FormulaBlock x={CX - 300} y={Y.owcCapacity} w={600} h={90}
        lines={[
          "OWC_req = W_wet \u00D7 Safety Factor",
          "Safety Factor = 1.15 \u2013 1.25 (for peak days)",
          "Select smallest machine \u2265 OWC_req from DB",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={Y.owcCapacity + 90} x2={CX} y2={Y.owcTable} />

      <OWCMachineTable x={CX - 380} y={Y.owcTable} />

      <Arrow x1={CX} y1={Y.owcTable + 220} x2={CX} y2={Y.owcDecision - 48} />

      <Diamond cx={CX} cy={Y.owcDecision} rxD={220} ryD={48}
        label="Single Machine Sufficient?"
        sub={`Required capacity \u2264 largest single unit?`}
        color={C.green} />

      {/* Single (left) */}
      <Arrow x1={CX - 150} y1={Y.owcDecision + 40} x2={CX - 300} y2={Y.owcSingle}
        label="Yes" color={C.green.bd} />
      <Box x={CX - 520} y={Y.owcSingle} w={420} h={70}
        label="Single OWC Unit Selected"
        sub="1 \u00D7 Machine model from DB \u2014 lowest footprint"
        color={C.green} badge="SINGLE" />

      {/* Multiple (right) */}
      <Arrow x1={CX + 150} y1={Y.owcDecision + 40} x2={CX + 300} y2={Y.owcMulti}
        label="No" color={C.reject} />
      <Box x={CX + 100} y={Y.owcMulti} w={420} h={70}
        label="Multiple OWC Units in Parallel"
        sub="N \u00D7 smaller machines to meet total capacity"
        color={C.amber} badge="PARALLEL" />

      {/* Converge */}
      <Arrow x1={CX - 300} y1={Y.owcSingle + 70} x2={CX} y2={Y.owcConverge} />
      <Arrow x1={CX + 300} y1={Y.owcMulti + 70} x2={CX} y2={Y.owcConverge} />
      <Box x={nx} y={Y.owcConverge} w={nw} h={60}
        label="OWC Configuration Finalized"
        sub="Machine model, quantity & OWC room area locked"
        color={C.green} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.owcConverge + 60} x2={CX} y2={Y.compHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9 — COMPOSTING OUTPUT & SLUDGE
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.compHeader} w={nw} h={70}
        label="Composting & By-product Analysis"
        sub="OWC output: compost + leachate + residual sludge"
        color={C.rose} badge="ANALYSIS" />
      <Arrow x1={CX} y1={Y.compHeader + 70} x2={CX} y2={Y.compCalc} />

      <FormulaBlock x={CX - 340} y={Y.compCalc} w={680} h={90}
        lines={[
          "Compost Output = W_wet \u00D7 Conversion Ratio (0.25\u20130.35)",
          "Leachate Volume = W_wet \u00D7 0.05 \u2013 0.10 (5\u201310% by weight)",
          "Residual = W_wet \u2212 Compost \u2212 Leachate (sent to landfill)",
        ]}
        color={C.rose} />
      <Arrow x1={CX} y1={Y.compCalc + 90} x2={CX} y2={Y.compStreams - 30} />

      {/* 3-way fan-out for compost streams */}
      {(() => {
        const streams = [
          { label: "Compost Output", sub: "25\u201335% of wet waste", sub2: "Garden/Landscape use", color: C.green, icon: "\uD83C\uDF31" },
          { label: "Leachate", sub: "5\u201310% liquid by-product", sub2: "Routed to STP inlet", color: C.cyan, icon: "\uD83D\uDCA7" },
          { label: "Residual / Reject", sub: "Remaining inert waste", sub2: "Sent to municipal landfill", color: C.slate, icon: "\uD83D\uDE9B" },
        ];
        const cardW = 280, cardH = 100, gapX = 40;
        const totalW = streams.length * cardW + (streams.length - 1) * gapX;
        const sx = CX - totalW / 2;
        const barY = Y.compStreams;
        const centers = streams.map((_, i) => sx + i * (cardW + gapX) + cardW / 2);

        return (
          <g>
            <line x1={CX} y1={barY - 30} x2={CX} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={centers[0]} y1={barY} x2={centers[centers.length - 1]} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            {centers.map((ccx, i) => (
              <line key={`cs-${i}`} x1={ccx} y1={barY} x2={ccx} y2={barY + 20}
                stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
            ))}
            {streams.map((s, i) => {
              const scx = sx + i * (cardW + gapX);
              return (
                <g key={`s-${i}`}>
                  <rect x={scx} y={barY + 20} width={cardW} height={cardH} rx={12}
                    fill={s.color.bg} stroke={s.color.bd} strokeWidth={2.5} />
                  <rect x={scx} y={barY + 20} width={cardW} height={30} rx={12} fill={s.color.bd} />
                  <rect x={scx} y={barY + 38} width={cardW} height={12} fill={s.color.bd} />
                  <text x={scx + cardW / 2} y={barY + 40} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
                    {s.icon} {s.label}
                  </text>
                  <text x={scx + cardW / 2} y={barY + 68} textAnchor="middle" fill={s.color.tx} fontSize={11} fontWeight={600}>
                    {s.sub}
                  </text>
                  <text x={scx + cardW / 2} y={barY + 86} textAnchor="middle" fill={s.color.tx} fontSize={10} opacity={0.7}>
                    {s.sub2}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Sludge/dry waste disposal */}
      <Arrow x1={CX} y1={Y.compStreams + 140} x2={CX} y2={Y.sludgeCalc} />
      <Box x={CX - 280} y={Y.sludgeCalc} w={560} h={70}
        label="Dry Waste Disposal Strategy"
        sub="Recyclables to vendor | Rejects to municipal collection"
        color={C.slate} badge="DISPOSAL" />

      {/* Side note */}
      <NoteBox x={CX + 320} y={Y.sludgeCalc} w={240} h={70}
        icon={"\u267B\uFE0F"} title="Recycling Target"
        lines={["\u2265 80% diversion from landfill", "Per SWM Rules 2016"]}
        color={C.teal} />
      <line x1={CX + 280} y1={Y.sludgeCalc + 35} x2={CX + 320} y2={Y.sludgeCalc + 35}
        stroke={C.teal.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sludgeCalc + 70} x2={CX} y2={Y.dashboard} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10 — FINAL OUTPUT DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      <OWCSummaryDashboard x={CX - 500} y={Y.dashboard} />

      <Arrow x1={CX} y1={Y.dashboard + 280} x2={CX} y2={Y.terminal} />

      {/* Terminal */}
      <Box x={nx} y={Y.terminal} w={nw} h={60}
        label="OWC CALCULATION COMPLETE"
        sub="All outputs locked \u2192 Export to Report & BOQ"
        color={C.green} badge="DONE" rx={30} />
    </svg>
  );
}
