import React from "react";

// =====================================================================
// OWC (Organic Waste Converter) CALCULATOR — Custom SVG Flow Diagram
// LODHA POLICY MEP-27 — Gold Standard Constants
// Auto-population only | Lodha Policy Norms | Validation Loop-Back
// Project Data → Auto-Population → Validation Gate → Lodha MEP-27 Norms →
// Waste Generation → Segregation (50/45/5) → Bin Sizing → Infrastructure →
// OWC Machine Selection (50% wet, 10% SF) → Compost → Dashboard
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
  gold:   { bg: "#fef9c3", bd: "#ca8a04", tx: "#713f12" },
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

// Redirect flag banner (input data click warning)
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

// ═══════════════════════════════════════════════════════════════════════
// LODHA POLICY MEP-27 — Gold Standard Norms Card
// ═══════════════════════════════════════════════════════════════════════
function LodhaNormsCard({ x, y }: { x: number; y: number }) {
  const w = 720, h = 520;
  const sections = [
    { heading: "RESIDENTIAL WASTE RATES", items: [
      { label: "Residential \u2014 Casa", value: "0.35 kg/cap/day", src: "MEP-27" },
      { label: "Residential \u2014 Aspi", value: "0.40 kg/cap/day", src: "MEP-27" },
      { label: "Residential \u2014 Hi End", value: "0.45 kg/cap/day", src: "MEP-27" },
    ]},
    { heading: "NON-RESIDENTIAL WASTE RATES", items: [
      { label: "Commercial", value: "0.20 kg/cap/day", src: "MEP-27" },
      { label: "Retail", value: "Variable (per use)", src: "MEP-27" },
      { label: "Horticulture", value: "20 kg/acre/day", src: "MEP-27" },
    ]},
    { heading: "DESIGN COMPOSITION (SOLID WASTE)", items: [
      { label: "Compostable (Wet)", value: "50%", src: "MEP-27" },
      { label: "Dry Waste", value: "45%", src: "MEP-27" },
      { label: "Inert", value: "5%", src: "MEP-27" },
    ]},
    { heading: "SWM ROOM & OWC SIZING FACTORS", items: [
      { label: "Waste Density (un-compacted)", value: "250 kg/m\u00B3", src: "MEP-27" },
      { label: "OWC Safety Margin (peak)", value: "1.10 (10%)", src: "MEP-27" },
      { label: "Collection Frequency", value: "1\u00D7 / 24 hrs", src: "MEP-27" },
    ]},
  ];

  let curY = y + 52;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#f8fafc" stroke={C.gold.bd} strokeWidth={3} />
      {/* Gold header bar */}
      <rect x={x} y={y} width={w} height={44} rx={14} fill={C.gold.bd} />
      <rect x={x} y={y + 32} width={w} height={12} fill={C.gold.bd} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {"\uD83C\uDFC6"} LODHA POLICY MEP-27 \u2014 Gold Standard Waste Generation Norms
      </text>

      {sections.map((sec, si) => {
        const secStartY = curY;
        // Section heading
        const headingY = secStartY + 4;
        curY = headingY + 22;

        const itemElements = sec.items.map((f, fi) => {
          const fy = curY + fi * 26;
          return (
            <g key={`${si}-${fi}`}>
              <circle cx={x + 30} cy={fy + 9} r={4} fill={C.gold.bd} />
              <text x={x + 44} y={fy + 14} fill={C.gold.tx} fontSize={12} fontWeight={500}>{f.label}</text>
              <rect x={x + 360} y={fy + 1} width={160} height={18} rx={4}
                fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
              <text x={x + 440} y={fy + 14} textAnchor="middle" fill={C.green.tx} fontSize={10.5} fontWeight={700}>
                {f.value}
              </text>
              <rect x={x + 560} y={fy + 1} width={70} height={18} rx={4}
                fill={C.gold.bg} stroke={C.gold.bd} strokeWidth={0.5} />
              <text x={x + 595} y={fy + 14} textAnchor="middle" fill={C.gold.tx} fontSize={9} fontWeight={600}>
                {f.src}
              </text>
            </g>
          );
        });

        curY = curY + sec.items.length * 26 + 14;

        return (
          <g key={`sec-${si}`}>
            <rect x={x + 14} y={headingY - 2} width={w - 28} height={18} rx={4} fill={C.gold.bd} opacity={0.15} />
            <text x={x + 22} y={headingY + 12} fill={C.gold.bd} fontSize={10} fontWeight={800} letterSpacing={0.8}>
              {sec.heading}
            </text>
            {itemElements}
          </g>
        );
      })}
    </g>
  );
}

// Occupancy table per Lodha Policy
function OccupancyTable({ x, y }: { x: number; y: number }) {
  const tw = 500, th = 200;
  const headers = ["Typology", "Persons/Unit", "Source"];
  const rows = [
    ["1 BHK", "3 persons", "Lodha MEP-27"],
    ["2 BHK", "4 persons", "Lodha MEP-27"],
    ["3 BHK", "5 persons", "Lodha MEP-27"],
    ["4 BHK & above", "6 persons", "Lodha MEP-27"],
  ];
  const colW = tw / 3;
  const rowH = 26;
  const hdrY = y + 48;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={tw} height={40} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 28} width={tw} height={12} fill={C.blue.bd} />
      <text x={x + tw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
        {"\uD83C\uDFE0"} OCCUPANCY LOGIC \u2014 Lodha MEP-27
      </text>
      {headers.map((h, i) => (
        <g key={`oh-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 17} textAnchor="middle"
            fill={C.blue.tx} fontSize={10} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`or-${ri}`}>
          {row.map((cell, ci) => (
            <g key={`oc-${ri}-${ci}`}>
              <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                width={colW - 6} height={rowH} rx={5}
                fill={ci === 1 ? C.green.bg : "#fff"}
                stroke={ci === 1 ? C.green.bd : "#e2e8f0"} strokeWidth={ci === 1 ? 1.5 : 1} />
              <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 19}
                textAnchor="middle"
                fill={ci === 1 ? C.green.tx : "#64748b"} fontSize={10} fontWeight={ci === 1 ? 700 : 400}>{cell}</text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// Bin sizing table
function BinSizingTable({ x, y }: { x: number; y: number }) {
  const tw = 800, th = 280;
  const headers = ["Bin Type", "Capacity (L)", "Footprint (m\u00b2)", "Colour Code", "Stream", "Nos Required"];
  const rows = [
    ["HDPE 120L", "120", "0.24", "Green", "Wet (50%)", "Auto-calc"],
    ["HDPE 240L", "240", "0.42", "Green", "Wet (50%)", "Auto-calc"],
    ["HDPE 1100L", "1100", "1.05", "Blue", "Dry (45%)", "Auto-calc"],
    ["HDPE 660L", "660", "0.82", "Blue", "Dry (45%)", "Auto-calc"],
    ["Inert 120L", "120", "0.24", "Grey", "Inert (5%)", "Auto-calc"],
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
        {"\uD83D\uDCCA"} BIN DATABASE \u2014 Sizes & Specs (Lodha MEP-27: 50/45/5 Split)
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        Auto-selects optimal bin mix | Density: 250 kg/m{"\u00B3"} (un-compacted) | Collection: 1{"\u00D7"}/24h
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
            const isGrey = cell === "Grey";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAuto ? C.green.bg : isGreen ? "#d1fae5" : isBlue ? "#dbeafe" : isRed ? "#ffe4e6" : isGrey ? "#f1f5f9" : "#fff"}
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
        {"\u2699\uFE0F"} OWC MACHINE DATABASE \u2014 Capacity based on 50% Wet Waste (Lodha MEP-27)
      </text>
      <text x={x + 18} y={y + 38} fill="#fff" fontSize={10} opacity={0.8}>
        Auto-selects smallest machine {"\u2265"} (W_wet {"\u00D7"} 1.10 safety factor) | Collection: 1{"\u00D7"}/24h
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
  const dw = 1100, dh = 320;
  const sections = [
    { label: "Total Daily\nWaste", icon: "\uD83D\uDDD1\uFE0F", color: C.slate },
    { label: "Wet 50%\n(Compostable)", icon: "\uD83D\uDFE2", color: C.green },
    { label: "Dry 45%\n(Recyclable)", icon: "\uD83D\uDD35", color: C.blue },
    { label: "Inert 5%\n(Landfill)", icon: "\u26AA", color: C.slate },
    { label: "OWC Machine\n(50%\u00D71.10 SF)", icon: "\u2699\uFE0F", color: C.teal },
    { label: "Compost\nOutput", icon: "\uD83C\uDF31", color: C.green },
  ];
  const metrics = [
    { label: "Green Bins", value: "XX Nos", color: C.green },
    { label: "Blue Bins", value: "XX Nos", color: C.blue },
    { label: "Grey Bins", value: "XX Nos", color: C.slate },
    { label: "Garbage Room", value: "XX Sq.m", color: C.amber },
    { label: "OWC Room", value: "XX Sq.m", color: C.teal },
  ];
  const cardW = (dw - 80) / 6;
  const metricW = (dw - 70) / 5;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.green.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"\uD83C\uDFC6"} OWC FINAL DASHBOARD \u2014 Lodha MEP-27 Gold Standard Output
      </text>
      {sections.map((s, i) => {
        const scx = x + 12 + i * (cardW + 6);
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
        const mcx = x + 12 + i * (metricW + 6);
        const mcy = y + 120;
        return (
          <g key={`m-${i}`}>
            <rect x={mcx} y={mcy} width={metricW} height={56} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={mcx + metricW / 2} y={mcy + 22} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={700}>{m.label}</text>
            <text x={mcx + metricW / 2} y={mcy + 42} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
      <text x={x + dw / 2} y={y + 198} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.6}>
        W_total = P{"\u00D7"}R | Wet=50% | Dry=45% | Inert=5% | OWC = Wet{"\u00D7"}1.10 | Density=250 kg/m{"\u00B3"} | Collect 1{"\u00D7"}/24h
      </text>

      {/* Compliance row */}
      <rect x={x + 20} y={y + 216} width={dw - 40} height={44} rx={8}
        fill={C.gold.bg} stroke={C.gold.bd} strokeWidth={2} />
      <text x={x + dw / 2} y={y + 234} textAnchor="middle" fill={C.gold.tx} fontSize={12} fontWeight={700}>
        {"\uD83C\uDFC6"} Gold Standard: Lodha Policy MEP-27 | SWM Rules 2016 | State PCB Norms
      </text>
      <text x={x + dw / 2} y={y + 250} textAnchor="middle" fill={C.gold.tx} fontSize={10} opacity={0.7}>
        Export {"\u2192"} Concept Report | BOQ Input | SWM Plan Drawing | IGBC/GRIHA Submission
      </text>

      {/* Lodha rates reference strip */}
      <rect x={x + 20} y={y + 272} width={dw - 40} height={32} rx={6}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1} />
      <text x={x + dw / 2} y={y + 293} textAnchor="middle" fill={C.violet.tx} fontSize={10} fontWeight={600}>
        Rates: Casa=0.35 | Aspi=0.40 | HiEnd=0.45 | Comm=0.20 | Horti=20 kg/acre | Occ: 1BHK=3, 2BHK=4, 3BHK=5, 4BHK+=6
      </text>
    </g>
  );
}


// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function OWCCalcSVG() {

  const nw = 460;
  const nx = CX - nw / 2;
  const tableX = CX - 390;

  // ── Y coordinate map (carefully computed, no overlaps) ──
  // DataTable(8 rows): h = 52 + 9*30 + 12 = 334
  // DataTable(6 rows): h = 52 + 7*30 + 12 = 274
  // DataTable(4 rows): h = 52 + 5*30 + 12 = 214
  // LodhaNormsCard: h = 520
  // OccupancyTable: h = 200
  // BinSizingTable: h = 280
  // OWCMachineTable: h = 220
  // OWCSummaryDashboard: h = 320

  const Y = {
    // Section 0: Entry
    entry:          50,
    // Section 1: Project Data Auto-Fetch
    dbFetch:        170,
    fetchTable:     290,
    redirectFlag:   648,  // 290 + 334 + 24
    // Section 2: Population (Auto only + Validation Loop-back)
    popHeader:      740,
    occTable:       860,
    popAutoCalc:    1110,
    popValidate:    1260, // diamond cy
    popApproved:    1370,
    // Section 3: Lodha Policy MEP-27 Norms
    normsHeader:    1490,
    normsCard:      1610,
    normsLocked:    2180,
    // Section 4: Waste Generation Engine
    wasteHeader:    2300,
    wasteFormula:   2420,
    wasteTotal:     2570,
    wasteTable:     2690,
    // Section 5: Segregation (50/45/5 three-way)
    segHeader:      2980,
    segSplit:       3130,
    segWetCalc:     3160,
    segDryCalc:     3160,
    segInertCalc:   3160,
    segConverge:    3380,
    // Section 6: Bin Sizing
    binHeader:      3500,
    binTable:       3620,
    binFormula:     3950,
    binResult:      4090,
    // Section 7: Infrastructure
    infraHeader:    4440,
    garbageRoom:    4560,
    garbageFormula: 4680,
    infraDecision:  4830,  // diamond cy
    infraCentral:   4940,
    infraDist:      4940,
    infraConverge:  5070,
    // Section 8: OWC Machine Selection
    owcHeader:      5190,
    owcCapacity:    5310,
    owcTable:       5460,
    owcDecision:    5740,  // diamond cy
    owcMulti:       5850,
    owcSingle:      5850,
    owcConverge:    5980,
    // Section 9: Composting & Sludge
    compHeader:     6100,
    compCalc:       6220,
    compStreams:     6380,
    sludgeCalc:     6560,
    // Section 10: Final Dashboard
    dashboard:      6700,
    // Terminal
    terminal:       7070,
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
      <PhaseBand y={Y.entry - 15}       h={100}  label="ENTRY \u2014 OWC CALCULATION MODULE (LODHA MEP-27)" color={C.blue.bd} />
      <PhaseBand y={Y.dbFetch - 20}     h={Y.popHeader - Y.dbFetch - 30} label="SECTION 1 \u2014 PROJECT DATA AUTO-FETCH FROM MAIN DATABASE" color={C.purple.bd} />
      <PhaseBand y={Y.popHeader - 20}   h={Y.normsHeader - Y.popHeader - 30} label="SECTION 2 \u2014 AUTO POPULATION (LODHA OCCUPANCY) & VALIDATION LOOP" color={C.blue.bd} />
      <PhaseBand y={Y.normsHeader - 20} h={Y.wasteHeader - Y.normsHeader - 30} label="SECTION 3 \u2014 LODHA POLICY MEP-27 GOLD STANDARD NORMS" color={C.gold.bd} />
      <PhaseBand y={Y.wasteHeader - 20} h={Y.segHeader - Y.wasteHeader - 30} label="SECTION 4 \u2014 WASTE GENERATION ENGINE (PER-CAPITA LODHA RATES)" color={C.orange.bd} />
      <PhaseBand y={Y.segHeader - 20}   h={Y.binHeader - Y.segHeader - 30} label="SECTION 5 \u2014 WASTE SEGREGATION (50% WET / 45% DRY / 5% INERT)" color={C.teal.bd} />
      <PhaseBand y={Y.binHeader - 20}   h={Y.infraHeader - Y.binHeader - 30} label="SECTION 6 \u2014 BIN CAPACITY & SIZING (250 kg/m\u00B3 DENSITY)" color={C.cyan.bd} />
      <PhaseBand y={Y.infraHeader - 20} h={Y.owcHeader - Y.infraHeader - 30} label="SECTION 7 \u2014 INFRASTRUCTURE PLANNING (GARBAGE / SWM ROOM)" color={C.violet.bd} />
      <PhaseBand y={Y.owcHeader - 20}   h={Y.compHeader - Y.owcHeader - 30} label="SECTION 8 \u2014 OWC MACHINE SELECTION (50% WET \u00D7 1.10 SF)" color={C.green.bd} />
      <PhaseBand y={Y.compHeader - 20}  h={Y.dashboard - Y.compHeader - 30} label="SECTION 9 \u2014 COMPOSTING OUTPUT & SLUDGE HANDLING" color={C.rose.bd} />
      <PhaseBand y={Y.dashboard - 20}   h={Y.terminal - Y.dashboard + 120} label="SECTION 10 \u2014 FINAL OUTPUT DASHBOARD (LODHA MEP-27)" color={C.green.bd} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 0 — ENTRY
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.entry} w={nw} h={70}
        label="Start: OWC Calculation Module"
        sub="Lodha MEP-27 Gold Standard \u2014 Sizing, Bins & Infrastructure"
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
          ["Occupancy Rate (per unit)", "Lodha MEP-27", "Auto", "1BHK=3,2=4,3=5,4+=6"],
          ["Total Population", "Calculated", "Auto-calc", "\u03A3(Flats \u00D7 Lodha Occ)"],
          ["Commercial Area (sqm)", "Main DB", "Auto", "If applicable"],
        ]}
        color={C.purple}
      />

      {/* Redirect flag below input table */}
      <RedirectFlag x={tableX} y={Y.redirectFlag} w={780} />

      <Arrow x1={CX} y1={Y.redirectFlag + 50} x2={CX} y2={Y.popHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — AUTO POPULATION (LODHA OCCUPANCY) & VALIDATION
          Manual override removed — auto-population only
          NOT APPROVED → loops back to re-calculate
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.popHeader} w={nw} h={70}
        label="Auto Population Computation"
        sub="Lodha MEP-27 Occupancy Logic \u2014 no manual override"
        color={C.blue} badge="AUTO-CALC" />
      <Arrow x1={CX} y1={Y.popHeader + 70} x2={CX} y2={Y.occTable} />

      {/* Occupancy Table */}
      <OccupancyTable x={CX - 250} y={Y.occTable} />

      {/* Side note */}
      <NoteBox x={CX + 300} y={Y.occTable + 20} w={260} h={100}
        icon={"\uD83C\uDFC6"} title="Lodha MEP-27"
        lines={["Gold Standard Occupancy", "1BHK=3, 2BHK=4", "3BHK=5, 4BHK+=6 persons", "No manual override"]}
        color={C.gold} />
      <line x1={CX + 250} y1={Y.occTable + 70} x2={CX + 300} y2={Y.occTable + 70}
        stroke={C.gold.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.occTable + 200} x2={CX} y2={Y.popAutoCalc} />

      <Box x={CX - 320} y={Y.popAutoCalc} w={640} h={80}
        label={`Auto: \u03A3(Flats \u00D7 Lodha Occupancy Rate)`}
        sub="Lodha MEP-27: 1BHK=3, 2BHK=4, 3BHK=5, 4BHK+=6 persons/unit"
        color={C.green} badge="AUTO" />

      <Arrow x1={CX} y1={Y.popAutoCalc + 80} x2={CX} y2={Y.popValidate - 50} />

      {/* ── VALIDATION GATE ── */}
      <Diamond cx={CX} cy={Y.popValidate} rxD={220} ryD={50}
        label="Validate & Approve Data?"
        sub="User must review and approve before proceeding"
        color={C.blue} />

      {/* Approved → proceed downward */}
      <Arrow x1={CX} y1={Y.popValidate + 50} x2={CX} y2={Y.popApproved}
        label="Approved" color={C.green.bd} />
      <Box x={nx} y={Y.popApproved} w={nw} h={60}
        label="Population Validated & Locked (P)"
        sub="Approved by user \u2014 locked for all downstream calcs"
        color={C.green} badge="LOCKED" />

      {/* Not Approved → Loop back to re-calculate (curved path right → up → back to popHeader) */}
      <Arrow x1={CX + 220} y1={Y.popValidate} x2={CX + 460} y2={Y.popValidate}
        label="Not Approved" color={C.reject} />
      {/* Loop-back box */}
      <g>
        <rect x={CX + 460} y={Y.popValidate - 42} width={300} height={84} rx={12}
          fill={C.rose.bg} stroke={C.reject} strokeWidth={2.5} />
        <rect x={CX + 460 + 300 - 90} y={Y.popValidate - 36} width={80} height={22} rx={11} fill={C.reject} opacity={0.85} />
        <text x={CX + 460 + 300 - 50} y={Y.popValidate - 22} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>LOOP BACK</text>
        <text x={CX + 610} y={Y.popValidate - 6} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={700}>
          {"\uD83D\uDD04"} Re-calculate Population
        </text>
        <text x={CX + 610} y={Y.popValidate + 14} textAnchor="middle" fill={C.rose.tx} fontSize={11} opacity={0.7}>
          System re-fetches data from DB
        </text>
        <text x={CX + 610} y={Y.popValidate + 30} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.6}>
          and restarts population calc
        </text>
      </g>
      {/* Loop-back curved arrow: right box → up → back to popHeader */}
      <path
        d={`M${CX + 760},${Y.popValidate - 42} L${CX + 760},${Y.popHeader + 35} L${CX + nw / 2 + 10},${Y.popHeader + 35}`}
        fill="none" stroke={C.reject} strokeWidth={2.5} strokeDasharray="8,5" markerEnd="url(#owc-red)" />
      <rect x={CX + 694} y={Y.popHeader + 50} width={90} height={16} rx={4} fill="#fff" opacity={0.92} />
      <text x={CX + 739} y={Y.popHeader + 61} textAnchor="middle" fill={C.reject} fontSize={10} fontWeight={600}>Re-enter {"\u21BA"}</text>

      <Arrow x1={CX} y1={Y.popApproved + 60} x2={CX} y2={Y.normsHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — LODHA POLICY MEP-27 GOLD STANDARD NORMS
          (No acceptance/override diamond — auto-applied)
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.normsHeader} w={nw} h={70}
        label="Fetch Waste Generation Norms"
        sub="Lodha Policy MEP-27 \u2014 Gold Standard \u2014 Auto-applied"
        color={C.gold} badge="MEP-27" />
      <Arrow x1={CX} y1={Y.normsHeader + 70} x2={CX} y2={Y.normsCard} />

      <LodhaNormsCard x={CX - 360} y={Y.normsCard} />

      {/* Side reference */}
      <NoteBox x={CX + 400} y={Y.normsCard + 60} w={240} h={120}
        icon={"\uD83C\uDFC6"} title="Gold Standard"
        lines={["Lodha Policy MEP-27", "Rates auto-applied", "No manual override", "No acceptance required", "All values are final"]}
        color={C.gold} />
      <line x1={CX + 360} y1={Y.normsCard + 120} x2={CX + 400} y2={Y.normsCard + 120}
        stroke={C.gold.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.normsCard + 520} x2={CX} y2={Y.normsLocked} />

      <Box x={nx} y={Y.normsLocked} w={nw} h={60}
        label="Lodha MEP-27 Norms Locked"
        sub="Gold Standard values auto-applied \u2014 no override"
        color={C.green} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.normsLocked + 60} x2={CX} y2={Y.wasteHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — WASTE GENERATION ENGINE (LODHA RATES)
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.wasteHeader} w={nw} h={70}
        label="Waste Generation Calculation Engine"
        sub="Compute total daily waste using Lodha MEP-27 per-capita rates"
        color={C.orange} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.wasteHeader + 70} x2={CX} y2={Y.wasteFormula} />

      <FormulaBlock x={CX - 340} y={Y.wasteFormula} w={680} h={100}
        lines={[
          "W_res = \u03A3(Pop_typology \u00D7 R_typology)",
          "R: Casa=0.35 | Aspi=0.40 | HiEnd=0.45 kg/cap/day",
          "W_comm = Pop_comm \u00D7 0.20 kg/cap/day",
          "W_horti = Acres \u00D7 20 kg/acre/day",
        ]}
        color={C.orange} />

      {/* Side: additional sources */}
      <NoteBox x={CX + 380} y={Y.wasteFormula} w={220} h={100}
        icon={"\uD83D\uDCE6"} title="Lodha Rates"
        lines={["Casa: 0.35 kg/cap/day", "Aspi: 0.40 kg/cap/day", "Hi End: 0.45 kg/cap/day", "Commercial: 0.20"]}
        color={C.orange} />
      <line x1={CX + 340} y1={Y.wasteFormula + 50} x2={CX + 380} y2={Y.wasteFormula + 50}
        stroke={C.orange.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.wasteFormula + 100} x2={CX} y2={Y.wasteTotal} />

      <Box x={CX - 300} y={Y.wasteTotal} w={600} h={70}
        label="Total Daily Waste = W_res + W_comm + W_horti"
        sub="Aggregated daily solid waste generation (kg/day) per Lodha MEP-27"
        color={C.orange} badge="TOTAL" />

      <Arrow x1={CX} y1={Y.wasteTotal + 70} x2={CX} y2={Y.wasteTable} />

      <DataTable x={tableX} y={Y.wasteTable}
        title={"\uD83D\uDCCA WASTE GENERATION BREAKDOWN (LODHA MEP-27 RATES)"}
        headers={["Source", "Population/Area", "Rate (MEP-27)", "Waste (kg/day)"]}
        rows={[
          ["Residential \u2014 Casa", "P_casa persons", "0.35 kg/cap/day", "Auto-calc"],
          ["Residential \u2014 Aspi", "P_aspi persons", "0.40 kg/cap/day", "Auto-calc"],
          ["Residential \u2014 Hi End", "P_hiend persons", "0.45 kg/cap/day", "Auto-calc"],
          ["Commercial", "P_comm persons", "0.20 kg/cap/day", "Auto-calc"],
          ["Horticulture", "Area (acres)", "20 kg/acre/day", "Auto-calc"],
          ["Retail", "Variable", "Per specific use", "Auto-calc"],
        ]}
        color={C.orange}
      />
      <Arrow x1={CX} y1={Y.wasteTable + 274} x2={CX} y2={Y.segHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — WASTE SEGREGATION (50% WET / 45% DRY / 5% INERT)
          Three-way split per Lodha MEP-27 Design Composition
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.segHeader} w={nw} h={70}
        label="Waste Segregation \u2014 Three-Way Split"
        sub="Lodha MEP-27: 50% Compostable | 45% Dry | 5% Inert"
        color={C.teal} badge="SEGREGATION" />
      <Arrow x1={CX} y1={Y.segHeader + 70} x2={CX} y2={Y.segSplit - 50} />

      {/* Three-way fan-out: Wet / Dry / Inert */}
      {(() => {
        const boxW = 250;
        const gapX = 30;
        const totalW = 3 * boxW + 2 * gapX;
        const startX = CX - totalW / 2;
        const paths = [
          { x: startX, pct: "50%", label: "Wet (Compostable)", sub: "Kitchen/Food/Organic", color: C.green, badge: "WET 50%" },
          { x: startX + boxW + gapX, pct: "45%", label: "Dry (Recyclable)", sub: "Paper/Plastic/Glass", color: C.blue, badge: "DRY 45%" },
          { x: startX + 2 * (boxW + gapX), pct: "5%", label: "Inert (Residual)", sub: "Debris/Non-recyclable", color: C.slate, badge: "INERT 5%" },
        ];
        const barY = Y.segSplit - 30;
        const centers = paths.map(p => p.x + boxW / 2);

        return (
          <g>
            <line x1={CX} y1={barY} x2={CX} y2={barY + 5}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={centers[0]} y1={barY + 5} x2={centers[2]} y2={barY + 5}
              stroke={C.arrow} strokeWidth={2.5} />
            {centers.map((cx, i) => (
              <g key={`fan-${i}`}>
                <line x1={cx} y1={barY + 5} x2={cx} y2={Y.segWetCalc}
                  stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#owc-a)" />
                <rect x={cx - 22} y={barY - 14} width={44} height={16} rx={4} fill="#fff" opacity={0.92} />
                <text x={cx} y={barY - 3} textAnchor="middle" fill="#475569" fontSize={11} fontWeight={600}>{paths[i].pct}</text>
              </g>
            ))}
            {paths.map((p, i) => (
              <g key={`seg-${i}`}>
                <Box x={p.x} y={Y.segWetCalc} w={boxW} h={70}
                  label={p.label} sub={p.sub}
                  color={p.color} badge={p.badge} />
              </g>
            ))}
          </g>
        );
      })()}

      {/* Formula blocks below each path */}
      <FormulaBlock x={CX - 560} y={Y.segWetCalc + 82} w={270} h={60}
        lines={["W_wet = W_total \u00D7 0.50", "Vol = W_wet \u00F7 250 kg/m\u00B3"]}
        color={C.green} />
      <FormulaBlock x={CX - 135} y={Y.segWetCalc + 82} w={270} h={60}
        lines={["W_dry = W_total \u00D7 0.45", "Vol = W_dry \u00F7 250 kg/m\u00B3"]}
        color={C.blue} />
      <FormulaBlock x={CX + 290} y={Y.segWetCalc + 82} w={270} h={60}
        lines={["W_inert = W_total \u00D7 0.05", "To municipal landfill"]}
        color={C.slate} />

      {/* Converge from 3 paths */}
      <Arrow x1={CX - 425} y1={Y.segWetCalc + 142} x2={CX} y2={Y.segConverge} />
      <Arrow x1={CX} y1={Y.segWetCalc + 142} x2={CX} y2={Y.segConverge} />
      <Arrow x1={CX + 425} y1={Y.segWetCalc + 142} x2={CX} y2={Y.segConverge} />
      <Box x={nx} y={Y.segConverge} w={nw} h={60}
        label="Three-Stream Volumes Calculated"
        sub="Wet 50% + Dry 45% + Inert 5% \u2192 inputs to bin sizing"
        color={C.teal} badge="PROCEED" />
      <Arrow x1={CX} y1={Y.segConverge + 60} x2={CX} y2={Y.binHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — BIN CAPACITY & SIZING
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.binHeader} w={nw} h={70}
        label="Bin Sizing Engine"
        sub="Density: 250 kg/m\u00B3 | Collection: 1\u00D7/24h | Lodha MEP-27"
        color={C.cyan} badge="SIZING" />
      <Arrow x1={CX} y1={Y.binHeader + 70} x2={CX} y2={Y.binTable} />

      <BinSizingTable x={CX - 400} y={Y.binTable} />

      <Arrow x1={CX} y1={Y.binTable + 280} x2={CX} y2={Y.binFormula} />

      <FormulaBlock x={CX - 340} y={Y.binFormula} w={680} h={90}
        lines={[
          "N_wet_bins = (W_wet \u00F7 250) \u00F7 (Bin_L \u00F7 1000) \u00F7 \u03B7",
          "N_dry_bins = (W_dry \u00F7 250) \u00F7 (Bin_L \u00F7 1000) \u00F7 \u03B7",
          "\u03B7 = Fill factor (0.75\u20130.85) | Density = 250 kg/m\u00B3 | Collect 1\u00D7/24h",
        ]}
        color={C.cyan} />

      <Arrow x1={CX} y1={Y.binFormula + 90} x2={CX} y2={Y.binResult} />

      <DataTable x={tableX} y={Y.binResult}
        title={"\uD83D\uDCCB BIN REQUIREMENT SUMMARY (50/45/5 SPLIT)"}
        headers={["Stream", "Daily Vol (m\u00B3)", "Bin Size", "Fill Factor", "Nos Required"]}
        rows={[
          ["Wet 50% (Green)", "Auto-calc", "240L", "0.80", "Auto-calc"],
          ["Dry 45% (Blue)", "Auto-calc", "1100L", "0.75", "Auto-calc"],
          ["Inert 5% (Grey)", "Auto-calc", "120L", "0.80", "Auto-calc"],
          ["Hazardous (Red)", "Nominal", "30L", "\u2014", "2 min"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.binResult + 214} x2={CX} y2={Y.infraHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — INFRASTRUCTURE PLANNING
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.infraHeader} w={nw} h={70}
        label="Garbage / SWM Room Infrastructure"
        sub="Sizing based on total bin footprint + circulation"
        color={C.violet} badge="INFRA" />
      <Arrow x1={CX} y1={Y.infraHeader + 70} x2={CX} y2={Y.garbageRoom} />

      <Box x={CX - 300} y={Y.garbageRoom} w={600} h={70}
        label="Calculate Total Bin Footprint (3 Streams)"
        sub={`\u03A3(N_bins \u00D7 FP per bin) for Wet + Dry + Inert streams`}
        color={C.violet} badge="COMPUTE" />
      <Arrow x1={CX} y1={Y.garbageRoom + 70} x2={CX} y2={Y.garbageFormula} />

      <FormulaBlock x={CX - 340} y={Y.garbageFormula} w={680} h={90}
        lines={[
          "A_garbage = \u03A3(N_i \u00D7 FP_i) \u00D7 CF",
          "CF = Circulation Factor = 1.50 (50% extra for access)",
          "Waste Density = 250 kg/m\u00B3 (un-compacted) per Lodha MEP-27",
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
        label="Single SWM Room at Basement"
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
        label="SWM Room Area Finalized"
        sub="Layout selected \u2192 area locked for drawing input"
        color={C.violet} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.infraConverge + 60} x2={CX} y2={Y.owcHeader} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 8 — OWC MACHINE SELECTION (50% WET × 1.10 SF)
          Based on cumulative 50% wet waste using Lodha per-capita rates
      ═══════════════════════════════════════════════════════════════ */}
      <Box x={nx} y={Y.owcHeader} w={nw} h={70}
        label="OWC Machine Sizing Engine"
        sub="Based on 50% wet waste \u00D7 1.10 safety factor (Lodha MEP-27)"
        color={C.green} badge="SIZING" />
      <Arrow x1={CX} y1={Y.owcHeader + 70} x2={CX} y2={Y.owcCapacity} />

      <FormulaBlock x={CX - 340} y={Y.owcCapacity} w={680} h={100}
        lines={[
          "OWC_req = W_wet \u00D7 1.10  (10% safety margin for peak days)",
          "W_wet = W_total \u00D7 0.50  (Lodha MEP-27 composition)",
          "Select smallest machine \u2265 OWC_req from DB",
          "Collection frequency: 1\u00D7 every 24 hours",
        ]}
        color={C.green} />

      {/* Side note */}
      <NoteBox x={CX + 380} y={Y.owcCapacity + 5} w={220} h={90}
        icon={"\uD83C\uDFC6"} title="Lodha MEP-27"
        lines={["Wet = 50% of total", "Safety Factor = 1.10", "10% peak-day margin"]}
        color={C.gold} />
      <line x1={CX + 340} y1={Y.owcCapacity + 50} x2={CX + 380} y2={Y.owcCapacity + 50}
        stroke={C.gold.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.owcCapacity + 100} x2={CX} y2={Y.owcTable} />

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

      <FormulaBlock x={CX - 340} y={Y.compCalc} w={680} h={100}
        lines={[
          "Compost Output = W_wet \u00D7 Conversion Ratio (0.25\u20130.35)",
          "Leachate Volume = W_wet \u00D7 0.05 \u2013 0.10 (5\u201310% by weight)",
          "Residual = W_wet \u2212 Compost \u2212 Leachate",
          "W_wet = Total Waste \u00D7 0.50 (Lodha MEP-27)",
        ]}
        color={C.rose} />
      <Arrow x1={CX} y1={Y.compCalc + 100} x2={CX} y2={Y.compStreams - 30} />

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

      {/* Dry waste + Inert disposal */}
      <Arrow x1={CX} y1={Y.compStreams + 140} x2={CX} y2={Y.sludgeCalc} />
      <Box x={CX - 300} y={Y.sludgeCalc} w={600} h={70}
        label="Dry (45%) + Inert (5%) Disposal Strategy"
        sub="Recyclables to vendor | Inerts to municipal collection"
        color={C.slate} badge="DISPOSAL" />

      {/* Side note */}
      <NoteBox x={CX + 340} y={Y.sludgeCalc} w={240} h={70}
        icon={"\u267B\uFE0F"} title="Recycling Target"
        lines={["\u2265 80% diversion from landfill", "Per SWM Rules 2016"]}
        color={C.teal} />
      <line x1={CX + 300} y1={Y.sludgeCalc + 35} x2={CX + 340} y2={Y.sludgeCalc + 35}
        stroke={C.teal.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sludgeCalc + 70} x2={CX} y2={Y.dashboard} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 10 — FINAL OUTPUT DASHBOARD
      ═══════════════════════════════════════════════════════════════ */}
      <OWCSummaryDashboard x={CX - 550} y={Y.dashboard} />

      <Arrow x1={CX} y1={Y.dashboard + 320} x2={CX} y2={Y.terminal} />

      {/* Terminal */}
      <Box x={nx} y={Y.terminal} w={nw} h={60}
        label="OWC CALCULATION COMPLETE"
        sub="Lodha MEP-27 Gold Standard \u2192 Export to Report & BOQ"
        color={C.green} badge="DONE" rx={30} />
    </svg>
  );
}
