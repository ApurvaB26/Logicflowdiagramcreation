import React from "react";

// =====================================================================
// INTEGRATED WATER & STP MASS-BALANCE FLOWCHART
// Engineering-Grade Water Balance — Database-First Approach
// Matches Electrical Load Schedule depth (~1000+ lines)
//
// Stage 1: Automated Data Harvesting [DB Fetch]
//   A. Population Data — Lodha Multipliers (3,4,5,6)
//   B. Architectural Geometry — Heights, Landscape Area
// Stage 2: The Demand Segmenter (MEP-21 Logic)
//   Domestic 90 LPCD | Flushing 45 LPCD | Horticulture 5 L/m2
// Stage 3: STP Treatment & Recovery Module
//   Inlet 80% | STP Buffer 10% | Recovery 95%
// Stage 4: "Excess & Makeup" Decision Engine
//   Delta = Q_Rec - (Q_Flu + Q_Hor)
// Stage 5: Storage Sizing (Regional Selection)
//   MMRDA 1.0 Day | Local 0.5 Day | Common OHT 0.5 Day
// Stage 6: Pumping & Hydraulic Output
//   Transfer Flow | TDH | Dry Run Protection
// =====================================================================

const W = 1600;
const H = 5600;
const CX = W / 2;

// ── MEP-21 / Lodha Policy Constants ──
const LODHA = {
  dom_lpcd: 90,
  flu_lpcd: 45,
  hor_rate: 5,          // L/m2/day
  occ: { "1BHK": 3, "2BHK": 4, "3BHK": 5, "4BHK+": 6 },
  discharge: 0.80,      // 80% sewage discharge factor
  stp_buffer: 1.10,     // 10% safety buffer
  stp_recovery: 0.95,   // 95% recovery
  mmrda_ugt_day: 1.0,
  local_ugt_day: 0.5,
  oht_day: 0.5,
  pump_fill_hrs: 2,
  residual_bar: 1.5,
  commercial_lpcd: 15,  // retail visitors
};

// Colors
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
  indigo: { bg: "#e0e7ff", bd: "#4f46e5", tx: "#3730a3" },
  arrow:  "#94a3b8",
};

// =====================================================================
// REUSABLE SVG COMPONENTS
// =====================================================================

function PhaseBand({ y, h, label, color, icon, stageNum }: {
  y: number; h: number; label: string; color: string; icon?: string; stageNum?: number;
}) {
  return (
    <g>
      <rect x={16} y={y} width={W - 32} height={h} rx={16}
        fill={`${color}0a`} stroke={`${color}30`} strokeWidth={2} strokeDasharray="10,6" />
      <rect x={16} y={y} width={W - 32} height={40} rx={16} fill={`${color}18`} />
      <rect x={16} y={y + 26} width={W - 32} height={14} fill={`${color}18`} />
      {stageNum !== undefined && (
        <>
          <circle cx={42} cy={y + 20} r={16} fill={color} />
          <text x={42} y={y + 25} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>{stageNum}</text>
        </>
      )}
      <text x={stageNum !== undefined ? 68 : 36} y={y + 26} fill={color} fontSize={13} fontWeight={800} letterSpacing={1.1}>
        {icon ? `${icon}  ${label}` : label}
      </text>
    </g>
  );
}

function SysBox({ x, y, w, h, label, sub, icon, badge, color }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; icon?: string; badge?: string;
  color?: { bg: string; bd: string; tx: string };
}) {
  const cl = color || C.blue;
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill={cl.bg} stroke={cl.bd} strokeWidth={3} />
      {badge && (
        <>
          <rect x={x + w - 110} y={y + 8} width={96} height={24} rx={12} fill={cl.bd} />
          <text x={x + w - 62} y={y + 24} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      {icon && <text x={x + 18} y={y + h / 2 + 6} fontSize={20}>{icon}</text>}
      <text x={cx + (icon ? 10 : 0)} y={y + h / 2 - 6} textAnchor="middle" fill={cl.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx + (icon ? 10 : 0)} y={y + h / 2 + 14} textAnchor="middle" fill={cl.tx} fontSize={11} opacity={0.7}>{sub}</text>
    </g>
  );
}

function DecisionDiamond({ cx, cy, rxD, ryD, label, sub, color }: {
  cx: number; cy: number; rxD: number; ryD: number;
  label: string; sub: string; color?: { bg: string; bd: string; tx: string };
}) {
  const cl = color || C.orange;
  return (
    <g>
      <polygon
        points={`${cx},${cy - ryD} ${cx + rxD},${cy} ${cx},${cy + ryD} ${cx - rxD},${cy}`}
        fill={cl.bg} stroke={cl.bd} strokeWidth={3}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={cl.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={cl.tx} fontSize={11} opacity={0.8}>{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, label, dash, marker }: {
  x1: number; y1: number; x2: number; y2: number;
  color?: string; label?: string; dash?: boolean; marker?: string;
}) {
  const c = color || C.arrow;
  const mk = marker || "wda";
  const isVert = Math.abs(x1 - x2) < 3;
  const d = isVert
    ? `M${x1},${y1} L${x2},${y2}`
    : `M${x1},${y1} L${x1},${(y1 + y2) / 2} L${x2},${(y1 + y2) / 2} L${x2},${y2}`;
  return (
    <g>
      <path d={d} fill="none" stroke={c} strokeWidth={2.5}
        strokeDasharray={dash ? "8,5" : "none"} markerEnd={`url(#${mk})`} />
      {label && (
        <g>
          <rect x={(x1 + x2) / 2 - label.length * 4} y={(y1 + y2) / 2 - 12}
            width={label.length * 8 + 8} height={18} rx={4} fill="#fff" opacity={0.95} />
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 1}
            textAnchor="middle" fill={c} fontSize={11} fontWeight={700}>{label}</text>
        </g>
      )}
    </g>
  );
}

function FormulaBox({ x, y, w, h, formulas, title, color }: {
  x: number; y: number; w: number; h: number;
  formulas: string[]; title: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={w} height={34} rx={12} fill={color.bd} />
      <rect x={x} y={y + 22} width={w} height={12} fill={color.bd} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
        {title}
      </text>
      {formulas.map((f, i) => (
        <text key={i} x={x + w / 2} y={y + 52 + i * 20} textAnchor="middle"
          fill={color.tx} fontSize={12} fontWeight={600}>{f}</text>
      ))}
    </g>
  );
}

function DbIcon({ x, y, size }: { x: number; y: number; size: number }) {
  const w = size, h = size * 1.2;
  const ry = size * 0.22;
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} fill={C.blue.bd} opacity={0.2} stroke={C.blue.bd} strokeWidth={1.5} />
      <rect x={x} y={y + ry} width={w} height={h - 2 * ry} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
      <ellipse cx={x + w / 2} cy={y + h - ry} rx={w / 2} ry={ry} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} fill={C.blue.bd} opacity={0.4} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fill={C.blue.tx} fontSize={8} fontWeight={700}>DB</text>
    </g>
  );
}

function AnnotationNote({ x, y, w, h, title, lines, color, icon }: {
  x: number; y: number; w: number; h: number;
  title: string; lines: string[];
  color: { bg: string; bd: string; tx: string }; icon?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8}
        fill={color.bg} stroke={color.bd} strokeWidth={1.5} strokeDasharray="5,3" />
      <text x={x + 12} y={y + 18} fill={color.tx} fontSize={10} fontWeight={700}>
        {icon || ""} {title}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={x + 12} y={y + 36 + i * 14} fill={color.tx} fontSize={9} opacity={0.8}>{l}</text>
      ))}
    </g>
  );
}

// =====================================================================
// STAGE 1: POPULATION HARVESTING TABLE (Lodha Multipliers)
// =====================================================================
function PopulationTable({ x, y }: { x: number; y: number }) {
  const tw = 780, th = 280;
  const cols = [
    { label: "Unit Type", w: 120 },
    { label: "Count", w: 80 },
    { label: "Lodha Occ.\nMultiplier", w: 110 },
    { label: "Population\n(Auto-Calc)", w: 120 },
    { label: "Dom. Demand\n90 LPCD", w: 120 },
    { label: "Flush Demand\n45 LPCD", w: 120 },
    { label: "Status", w: 90 },
  ];
  const rows = [
    { type: "1 BHK", count: "Auto", mult: "3", pop: "Auto", dom: "Auto", flu: "Auto", status: "DB" },
    { type: "2 BHK", count: "Auto", mult: "4", pop: "Auto", dom: "Auto", flu: "Auto", status: "DB" },
    { type: "3 BHK", count: "Auto", mult: "5", pop: "Auto", dom: "Auto", flu: "Auto", status: "DB" },
    { type: "4 BHK+", count: "Auto", mult: "6", pop: "Auto", dom: "Auto", flu: "Auto", status: "DB" },
    { type: "Commercial", count: "Manual", mult: "-", pop: "Manual", dom: "15 LPCD", flu: "-", status: "INPUT" },
    { type: "TOTAL", count: "-", mult: "-", pop: "\u03A3 Pop", dom: "\u03A3 Q_Dom", flu: "\u03A3 Q_Flu", status: "\u2713" },
  ];
  const rowH = 32, headerH = 44;
  let colX = x + 10;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      {/* Title bar */}
      <rect x={x} y={y} width={tw} height={headerH} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 30} width={tw} height={14} fill={C.blue.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>
        {"\uD83D\uDC65"} POPULATION DATA — Lodha Occupancy Multipliers (MEP-21)
      </text>
      {/* Column headers */}
      {(() => {
        let cx = x + 10;
        return cols.map((col, i) => {
          const el = (
            <g key={`ch-${i}`}>
              <rect x={cx} y={y + headerH + 4} width={col.w} height={30} rx={5}
                fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} />
              {col.label.split("\n").map((line, li) => (
                <text key={li} x={cx + col.w / 2} y={y + headerH + 18 + li * 12}
                  textAnchor="middle" fill={C.blue.tx} fontSize={9} fontWeight={700}>{line}</text>
              ))}
            </g>
          );
          cx += col.w + 4;
          return el;
        });
      })()}
      {/* Data rows */}
      {rows.map((row, ri) => {
        let cx = x + 10;
        const ry = y + headerH + 40 + ri * (rowH + 2);
        const isTotal = row.type === "TOTAL";
        const isManual = row.status === "INPUT";
        const vals = [row.type, row.count, row.mult, row.pop, row.dom, row.flu, row.status];
        return (
          <g key={`row-${ri}`}>
            {vals.map((v, ci) => {
              const cw = cols[ci].w;
              const el = (
                <g key={`cell-${ri}-${ci}`}>
                  <rect x={cx} y={ry} width={cw} height={rowH} rx={5}
                    fill={isTotal ? C.green.bg : isManual ? C.orange.bg : "#fff"}
                    stroke={isTotal ? C.green.bd : isManual ? C.orange.bd : C.blue.bd}
                    strokeWidth={isTotal ? 2 : 1} />
                  <text x={cx + cw / 2} y={ry + 20} textAnchor="middle"
                    fill={isTotal ? C.green.tx : isManual ? C.orange.tx : C.blue.tx}
                    fontSize={11} fontWeight={isTotal ? 800 : 600}>{v}</text>
                </g>
              );
              cx += cw + 4;
              return el;
            })}
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// STAGE 1: ARCHITECTURAL GEOMETRY CARDS
// =====================================================================
function GeometryCards({ x, y }: { x: number; y: number }) {
  const cw = 640, ch = 140;
  const items = [
    { label: "Building Height", value: "Auto m", icon: "\uD83C\uDFE2", sub: "For Head Calc", color: C.cyan },
    { label: "Landscape Area", value: "Auto m\u00B2", icon: "\uD83C\uDF33", sub: "Irrigation Demand", color: C.green },
    { label: "Basement Floors", value: "Auto", icon: "\uD83C\uDFED", sub: "Tank Locations", color: C.amber },
    { label: "Terrace Level", value: "Auto m", icon: "\u2B06", sub: "OHT Head Ref", color: C.purple },
  ];
  const cardW = (cw - 40) / 4;

  return (
    <g>
      <rect x={x} y={y} width={cw} height={ch} rx={14}
        fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={cw} height={34} rx={14} fill={C.cyan.bd} />
      <rect x={x} y={y + 20} width={cw} height={14} fill={C.cyan.bd} />
      <text x={x + cw / 2} y={y + 22} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
        {"\uD83D\uDCCF"} ARCHITECTURAL GEOMETRY — Auto-Fetched
      </text>
      {items.map((it, i) => {
        const ix = x + 10 + i * (cardW + 8);
        return (
          <g key={i}>
            <rect x={ix} y={y + 42} width={cardW} height={86} rx={8}
              fill={it.color.bg} stroke={it.color.bd} strokeWidth={1.5} />
            <text x={ix + cardW / 2} y={y + 60} textAnchor="middle" fontSize={16}>{it.icon}</text>
            <text x={ix + cardW / 2} y={y + 76} textAnchor="middle"
              fill={it.color.tx} fontSize={10} fontWeight={700}>{it.label}</text>
            <rect x={ix + 8} y={y + 100} width={cardW - 16} height={20} rx={5}
              fill={it.color.bd} opacity={0.15} />
            <text x={ix + cardW / 2} y={y + 114} textAnchor="middle"
              fill={it.color.bd} fontSize={11} fontWeight={800}>{it.value}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// STAGE 2: 3-STREAM DEMAND DASHBOARD
// =====================================================================
function DemandStreams({ x, y }: { x: number; y: number }) {
  const sw = 380, sh = 220;
  const gap = 30;
  const totalW = 3 * sw + 2 * gap;
  const streams = [
    {
      title: "DOMESTIC (Q_Dom)", icon: "\uD83C\uDFE0", color: C.blue,
      formula: `Population \u00D7 ${LODHA.dom_lpcd} LPCD`,
      details: ["Potable water for drinking, cooking,", "bathing, washing per MEP-21 Pg. 3", `Rate: ${LODHA.dom_lpcd} Litres/Capita/Day`],
      output: "Q_Dom = XXX KLD",
    },
    {
      title: "FLUSHING (Q_Flu)", icon: "\uD83D\uDEB0", color: C.teal,
      formula: `Population \u00D7 ${LODHA.flu_lpcd} LPCD`,
      details: ["Non-potable recycled water for WC", "flushing per MEP-21 Pg. 3", `Rate: ${LODHA.flu_lpcd} Litres/Capita/Day`],
      output: "Q_Flu = XXX KLD",
    },
    {
      title: "HORTICULTURE (Q_Hor)", icon: "\uD83C\uDF3F", color: C.green,
      formula: `Area \u00D7 ${LODHA.hor_rate} L/m\u00B2/day`,
      details: ["Landscape irrigation from treated", "water per MEP-21 Pg. 5", `Rate: ${LODHA.hor_rate} Litres per m\u00B2 per Day`],
      output: "Q_Hor = XXX KLD",
    },
  ];

  return (
    <g>
      {streams.map((s, i) => {
        const sx = x + i * (sw + gap);
        return (
          <g key={i}>
            <rect x={sx} y={y} width={sw} height={sh} rx={14}
              fill={s.color.bg} stroke={s.color.bd} strokeWidth={3} />
            {/* Header */}
            <rect x={sx} y={y} width={sw} height={40} rx={14} fill={s.color.bd} />
            <rect x={sx} y={y + 26} width={sw} height={14} fill={s.color.bd} />
            <text x={sx + sw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              {s.icon} {s.title}
            </text>
            {/* Formula */}
            <rect x={sx + 14} y={y + 50} width={sw - 28} height={32} rx={8}
              fill="#fff" stroke={s.color.bd} strokeWidth={1.5} />
            <text x={sx + sw / 2} y={y + 72} textAnchor="middle"
              fill={s.color.tx} fontSize={12} fontWeight={700}>{s.formula}</text>
            {/* Details */}
            {s.details.map((d, di) => (
              <text key={di} x={sx + sw / 2} y={y + 100 + di * 16} textAnchor="middle"
                fill={s.color.tx} fontSize={10} opacity={0.8}>{d}</text>
            ))}
            {/* Output */}
            <rect x={sx + sw / 2 - 80} y={y + sh - 38} width={160} height={28} rx={14}
              fill={s.color.bd} />
            <text x={sx + sw / 2} y={y + sh - 19} textAnchor="middle"
              fill="#fff" fontSize={12} fontWeight={800}>{s.output}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// STAGE 3: STP MASS-BALANCE MODULE
// =====================================================================
function STPModule({ x, y }: { x: number; y: number }) {
  const mw = 1100, mh = 380;

  return (
    <g>
      <rect x={x} y={y} width={mw} height={mh} rx={16}
        fill="#f8fafc" stroke={C.purple.bd} strokeWidth={3} />
      {/* Title */}
      <rect x={x} y={y} width={mw} height={42} rx={16} fill={C.purple.bd} />
      <rect x={x} y={y + 28} width={mw} height={14} fill={C.purple.bd} />
      <text x={x + mw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\u267B\uFE0F"} STP TREATMENT & RECOVERY MODULE — Mass Balance
      </text>

      {/* Step 1: Inlet Feed */}
      <rect x={x + 30} y={y + 60} width={300} height={90} rx={12}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2.5} />
      <text x={x + 180} y={y + 82} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={800}>
        SEWAGE INLET FEED
      </text>
      <rect x={x + 50} y={y + 94} width={260} height={24} rx={6}
        fill="#fff" stroke={C.rose.bd} strokeWidth={1} />
      <text x={x + 180} y={y + 111} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={700}>
        Q_Dom {"\u00D7"} {LODHA.discharge} = Sewage Inflow
      </text>
      <text x={x + 180} y={y + 138} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.8}>
        80% of Domestic discharge factor
      </text>

      {/* Arrow 1 → 2 */}
      <line x1={x + 330} y1={y + 105} x2={x + 400} y2={y + 105}
        stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />

      {/* Step 2: STP Design Capacity */}
      <rect x={x + 400} y={y + 60} width={300} height={90} rx={12}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2.5} />
      <text x={x + 550} y={y + 82} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={800}>
        STP DESIGN CAPACITY
      </text>
      <rect x={x + 420} y={y + 94} width={260} height={24} rx={6}
        fill="#fff" stroke={C.purple.bd} strokeWidth={1} />
      <text x={x + 550} y={y + 111} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={700}>
        Inlet {"\u00D7"} {LODHA.stp_buffer} = STP Size
      </text>
      <text x={x + 550} y={y + 138} textAnchor="middle" fill={C.purple.tx} fontSize={10} opacity={0.8}>
        10% Safety Buffer for surge capacity
      </text>

      {/* Arrow 2 → 3 */}
      <line x1={x + 700} y1={y + 105} x2={x + 770} y2={y + 105}
        stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />

      {/* Step 3: Recycled Yield */}
      <rect x={x + 770} y={y + 60} width={300} height={90} rx={12}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={x + 920} y={y + 82} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={800}>
        RECYCLED YIELD (Q_Rec)
      </text>
      <rect x={x + 790} y={y + 94} width={260} height={24} rx={6}
        fill="#fff" stroke={C.green.bd} strokeWidth={1} />
      <text x={x + 920} y={y + 111} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        Inlet {"\u00D7"} {LODHA.stp_recovery} = Q_Rec
      </text>
      <text x={x + 920} y={y + 138} textAnchor="middle" fill={C.green.tx} fontSize={10} opacity={0.8}>
        95% recovery after process loss
      </text>

      {/* Process Flow Summary Bar */}
      <rect x={x + 60} y={y + 180} width={mw - 120} height={50} rx={10}
        fill={C.indigo.bg} stroke={C.indigo.bd} strokeWidth={2} />
      <text x={x + mw / 2} y={y + 200} textAnchor="middle" fill={C.indigo.tx} fontSize={13} fontWeight={800}>
        MASS BALANCE: Q_Dom({LODHA.dom_lpcd} LPCD) {"\u2192"} Sewage({LODHA.discharge * 100}%) {"\u2192"} STP(+{(LODHA.stp_buffer - 1) * 100}%) {"\u2192"} Treated({LODHA.stp_recovery * 100}%) = Q_Rec
      </text>
      <text x={x + mw / 2} y={y + 220} textAnchor="middle" fill={C.indigo.tx} fontSize={11} opacity={0.7}>
        Net recovery from domestic supply: {LODHA.dom_lpcd} {"\u00D7"} {LODHA.discharge} {"\u00D7"} {LODHA.stp_recovery} = {(LODHA.dom_lpcd * LODHA.discharge * LODHA.stp_recovery).toFixed(1)} LPCD effective per capita
      </text>

      {/* Loss breakdown annotation */}
      <rect x={x + 60} y={y + 248} width={mw - 120} height={110} rx={10}
        fill="#fff" stroke={C.slate.bd} strokeWidth={1.5} strokeDasharray="6,4" />
      <text x={x + mw / 2} y={y + 270} textAnchor="middle" fill={C.slate.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCCA"} PROCESS LOSS BREAKDOWN
      </text>
      {/* 3-column loss items */}
      {[
        { label: "Domestic \u2192 Sewage", value: `${(1 - LODHA.discharge) * 100}% retained`, icon: "\uD83D\uDCA7", x: x + 120 },
        { label: "STP Safety Buffer", value: `+${(LODHA.stp_buffer - 1) * 100}% capacity`, icon: "\uD83D\uDEE1", x: x + mw / 2 - 60 },
        { label: "Treatment Loss", value: `${(1 - LODHA.stp_recovery) * 100}% process loss`, icon: "\u2699\uFE0F", x: x + mw - 280 },
      ].map((item, i) => (
        <g key={i}>
          <rect x={item.x} y={y + 286} width={220} height={55} rx={8}
            fill={i === 0 ? C.rose.bg : i === 1 ? C.amber.bg : C.cyan.bg}
            stroke={i === 0 ? C.rose.bd : i === 1 ? C.amber.bd : C.cyan.bd}
            strokeWidth={1.5} />
          <text x={item.x + 110} y={y + 305} textAnchor="middle" fontSize={11} fontWeight={700}
            fill={i === 0 ? C.rose.tx : i === 1 ? C.amber.tx : C.cyan.tx}>
            {item.icon} {item.label}
          </text>
          <text x={item.x + 110} y={y + 325} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={i === 0 ? C.rose.bd : i === 1 ? C.amber.bd : C.cyan.bd}>
            {item.value}
          </text>
        </g>
      ))}
    </g>
  );
}

// =====================================================================
// STAGE 4: DECISION ENGINE OUTPUT PATHS
// =====================================================================
function DeficitPath({ x, y }: { x: number; y: number }) {
  const pw = 440, ph = 200;
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={40} rx={14} fill={C.rose.bd} />
      <rect x={x} y={y + 26} width={pw} height={14} fill={C.rose.bd} />
      <text x={x + pw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
        {"\u26A0\uFE0F"} DEFICIT PATH (\u0394 &lt; 0)
      </text>
      <rect x={x + 16} y={y + 50} width={pw - 32} height={32} rx={8}
        fill="#fff" stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={x + pw / 2} y={y + 72} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={700}>
        Municipal Makeup Required
      </text>
      <text x={x + pw / 2} y={y + 104} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={600}>
        Action: Trigger Municipal Makeup Line
      </text>
      <text x={x + pw / 2} y={y + 122} textAnchor="middle" fill={C.rose.tx} fontSize={11} opacity={0.8}>
        Deficit Amount added to Flushing UGT
      </text>
      <text x={x + pw / 2} y={y + 140} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.7}>
        Connection: Municipal Supply {"\u2192"} Flushing UGT
      </text>
      {/* Cost indicator */}
      <rect x={x + pw / 2 - 90} y={y + ph - 44} width={180} height={30} rx={8}
        fill={C.rose.bd} />
      <text x={x + pw / 2} y={y + ph - 24} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
        {"\uD83D\uDCB0"} Increased Daily Ops Cost
      </text>
    </g>
  );
}

function SurplusPath({ x, y }: { x: number; y: number }) {
  const pw = 440, ph = 200;
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={40} rx={14} fill={C.green.bd} />
      <rect x={x} y={y + 26} width={pw} height={14} fill={C.green.bd} />
      <text x={x + pw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
        {"\u2705"} SURPLUS PATH (\u0394 &gt; 0)
      </text>
      <rect x={x + 16} y={y + 50} width={pw - 32} height={32} rx={8}
        fill="#fff" stroke={C.green.bd} strokeWidth={1.5} />
      <text x={x + pw / 2} y={y + 72} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>
        Excess Recycled Water Available
      </text>
      <text x={x + pw / 2} y={y + 104} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={600}>
        Routing Priority (in order):
      </text>
      {["1. Solar Panel Cleaning", "2. Car Wash Station", "3. External Disposal / Sale"].map((item, i) => (
        <text key={i} x={x + pw / 2} y={y + 122 + i * 16} textAnchor="middle"
          fill={C.green.tx} fontSize={10} opacity={0.8}>{item}</text>
      ))}
      {/* Revenue indicator */}
      <rect x={x + pw / 2 - 90} y={y + ph - 44} width={180} height={30} rx={8}
        fill={C.green.bd} />
      <text x={x + pw / 2} y={y + ph - 24} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
        {"\uD83D\uDCB0"} Revenue Opportunity
      </text>
    </g>
  );
}

// =====================================================================
// STAGE 5: STORAGE SIZING COMPARISON
// =====================================================================
function StorageSizing({ x, y }: { x: number; y: number }) {
  const totalW = 1100, totalH = 440;

  return (
    <g>
      <rect x={x} y={y} width={totalW} height={totalH} rx={16}
        fill="#f8fafc" stroke={C.amber.bd} strokeWidth={3} />
      {/* Title */}
      <rect x={x} y={y} width={totalW} height={42} rx={16} fill={C.amber.bd} />
      <rect x={x} y={y + 28} width={totalW} height={14} fill={C.amber.bd} />
      <text x={x + totalW / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\uD83D\uDCC0"} STORAGE SIZING — Regional Selection Gate
      </text>

      {/* Two columns: MMRDA | Local */}
      {[
        {
          title: "MMRDA REGION", color: C.blue, ugt: LODHA.mmrda_ugt_day,
          items: [
            { label: "UGT Potable", formula: `Q_Dom \u00D7 ${LODHA.mmrda_ugt_day} Day`, icon: "\uD83D\uDCA7" },
            { label: "UGT Flushing", formula: `(Q_Flu + Makeup) \u00D7 ${LODHA.mmrda_ugt_day} Day`, icon: "\uD83D\uDEB0" },
            { label: "OHT All Zones", formula: `All \u00D7 ${LODHA.oht_day} Day (Fixed)`, icon: "\u2B06" },
            { label: "Fire Tank", formula: "As per NBC / CFO Norms", icon: "\uD83D\uDD25" },
          ],
        },
        {
          title: "LOCAL / PMC REGION", color: C.teal, ugt: LODHA.local_ugt_day,
          items: [
            { label: "UGT Potable", formula: `Q_Dom \u00D7 ${LODHA.local_ugt_day} Day`, icon: "\uD83D\uDCA7" },
            { label: "UGT Flushing", formula: `(Q_Flu + Makeup) \u00D7 ${LODHA.local_ugt_day} Day`, icon: "\uD83D\uDEB0" },
            { label: "OHT All Zones", formula: `All \u00D7 ${LODHA.oht_day} Day (Fixed)`, icon: "\u2B06" },
            { label: "Fire Tank", formula: "As per NBC / CFO Norms", icon: "\uD83D\uDD25" },
          ],
        },
      ].map((region, ri) => {
        const rw = (totalW - 60) / 2;
        const rx = x + 20 + ri * (rw + 20);
        return (
          <g key={ri}>
            <rect x={rx} y={y + 54} width={rw} height={totalH - 72} rx={12}
              fill={region.color.bg} stroke={region.color.bd} strokeWidth={2.5} />
            {/* Region header */}
            <rect x={rx} y={y + 54} width={rw} height={36} rx={12} fill={region.color.bd} />
            <rect x={rx} y={y + 78} width={rw} height={12} fill={region.color.bd} />
            <text x={rx + rw / 2} y={y + 78} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={800}>
              {ri === 0 ? "\uD83C\uDFD9" : "\uD83C\uDFE0"} {region.title}
            </text>
            {/* Storage items */}
            {region.items.map((item, ii) => {
              const iy = y + 102 + ii * 80;
              return (
                <g key={ii}>
                  <rect x={rx + 14} y={iy} width={rw - 28} height={68} rx={10}
                    fill="#fff" stroke={region.color.bd} strokeWidth={1.5} />
                  <text x={rx + rw / 2} y={iy + 20} textAnchor="middle"
                    fill={region.color.tx} fontSize={12} fontWeight={700}>
                    {item.icon} {item.label}
                  </text>
                  <rect x={rx + 24} y={iy + 30} width={rw - 48} height={26} rx={6}
                    fill={region.color.bg} stroke={region.color.bd} strokeWidth={1} />
                  <text x={rx + rw / 2} y={iy + 48} textAnchor="middle"
                    fill={region.color.tx} fontSize={11} fontWeight={600}>{item.formula}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// STAGE 6: PUMPING & HYDRAULIC OUTPUT DASHBOARD
// =====================================================================
function PumpDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 340;
  const pumps = [
    {
      label: "Domestic\nTransfer", icon: "\uD83D\uDCA7", color: C.blue,
      flow: `UGT_Dom / ${LODHA.pump_fill_hrs} hrs`,
      head: "Static + Friction + 1.5 Bar",
      protection: "UGT Low-Level Sensor",
    },
    {
      label: "Flushing\nTransfer", icon: "\uD83D\uDEB0", color: C.teal,
      flow: `UGT_Flu / ${LODHA.pump_fill_hrs} hrs`,
      head: "Static + Friction + 1.5 Bar",
      protection: "UGT Low-Level Sensor",
    },
    {
      label: "STP Feed\nPump", icon: "\u267B\uFE0F", color: C.purple,
      flow: "Sewage Inflow / 16 hrs",
      head: "STP Inlet Level + Friction",
      protection: "Collection Sump Sensor",
    },
    {
      label: "Treated Water\nTransfer", icon: "\u2705", color: C.green,
      flow: "Q_Rec / Operating Hrs",
      head: "Treated Tank \u2192 Flushing UGT",
      protection: "Treated Tank Low-Level",
    },
  ];
  const cardW = (dw - 80) / 4;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.indigo.bd} strokeWidth={3} />
      {/* Title */}
      <rect x={x} y={y} width={dw} height={44} rx={16} fill={C.indigo.bd} />
      <rect x={x} y={y + 30} width={dw} height={14} fill={C.indigo.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\u2699\uFE0F"} PUMPING & HYDRAULIC OUTPUT — Transfer Lines
      </text>

      {/* TDH formula bar */}
      <rect x={x + 30} y={y + 54} width={dw - 60} height={36} rx={8}
        fill={C.indigo.bg} stroke={C.indigo.bd} strokeWidth={1.5} />
      <text x={x + dw / 2} y={y + 78} textAnchor="middle" fill={C.indigo.tx} fontSize={13} fontWeight={700}>
        TDH = Static Head (m) + Friction Loss (m) + {LODHA.residual_bar} Bar Residual Pressure | Flow = Tank Vol / {LODHA.pump_fill_hrs} hrs
      </text>

      {/* Pump cards */}
      {pumps.map((p, i) => {
        const px = x + 16 + i * (cardW + 16);
        const py = y + 102;
        return (
          <g key={i}>
            <rect x={px} y={py} width={cardW} height={dh - 118} rx={12}
              fill={p.color.bg} stroke={p.color.bd} strokeWidth={2} />
            {/* Header */}
            <rect x={px} y={py} width={cardW} height={36} rx={12} fill={p.color.bd} />
            <rect x={px} y={py + 24} width={cardW} height={12} fill={p.color.bd} />
            <text x={px + cardW / 2} y={py + 22} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
              {p.icon} {p.label.replace("\n", " ")}
            </text>
            {/* Flow */}
            <text x={px + 12} y={py + 52} fill={p.color.tx} fontSize={9} fontWeight={700}>FLOW (Q):</text>
            <rect x={px + 8} y={py + 58} width={cardW - 16} height={22} rx={5}
              fill="#fff" stroke={p.color.bd} strokeWidth={1} />
            <text x={px + cardW / 2} y={py + 74} textAnchor="middle"
              fill={p.color.tx} fontSize={9} fontWeight={600}>{p.flow}</text>
            {/* Head */}
            <text x={px + 12} y={py + 96} fill={p.color.tx} fontSize={9} fontWeight={700}>HEAD (H):</text>
            <rect x={px + 8} y={py + 102} width={cardW - 16} height={22} rx={5}
              fill="#fff" stroke={p.color.bd} strokeWidth={1} />
            <text x={px + cardW / 2} y={py + 118} textAnchor="middle"
              fill={p.color.tx} fontSize={9} fontWeight={600}>{p.head}</text>
            {/* Protection */}
            <text x={px + 12} y={py + 140} fill={p.color.tx} fontSize={9} fontWeight={700}>PROTECTION:</text>
            <rect x={px + 8} y={py + 146} width={cardW - 16} height={22} rx={5}
              fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1} />
            <text x={px + cardW / 2} y={py + 162} textAnchor="middle"
              fill={C.rose.tx} fontSize={9} fontWeight={600}>{p.protection}</text>
            {/* Duty point */}
            <rect x={px + cardW / 2 - 50} y={py + 178} width={100} height={24} rx={6}
              fill={p.color.bd} />
            <text x={px + cardW / 2} y={py + 194} textAnchor="middle"
              fill="#fff" fontSize={10} fontWeight={700}>Q=XX, H=XX</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// FINAL: WATER USAGE SYNOPSIS (MEP-21 Pg. 7 Format)
// =====================================================================
function WaterSynopsis({ x, y }: { x: number; y: number }) {
  const sw = 1200, sh = 340;
  const rows = [
    { cat: "Domestic Supply (Potable)", source: "Municipal", rate: `${LODHA.dom_lpcd} LPCD`, qty: "Q_Dom KLD", tank: "Potable UGT \u2192 OHT" },
    { cat: "Flushing (Non-Potable)", source: "STP Treated", rate: `${LODHA.flu_lpcd} LPCD`, qty: "Q_Flu KLD", tank: "Flushing UGT \u2192 OHT" },
    { cat: "Horticulture / Irrigation", source: "STP Treated", rate: `${LODHA.hor_rate} L/m\u00B2/day`, qty: "Q_Hor KLD", tank: "Irrigation Sump" },
    { cat: "STP Inlet (Sewage)", source: "Domestic 80%", rate: `${LODHA.discharge}\u00D7Q_Dom`, qty: "Inlet KLD", tank: "Collection Sump" },
    { cat: "STP Design Capacity", source: "Inlet+10%", rate: `${LODHA.stp_buffer}\u00D7Inlet`, qty: "STP KLD", tank: "STP Plant" },
    { cat: "Recycled Yield (Q_Rec)", source: "STP Output", rate: `${LODHA.stp_recovery}\u00D7Inlet`, qty: "Q_Rec KLD", tank: "Treated Water Tank" },
    { cat: "Excess / Deficit (\u0394)", source: "Balance", rate: "Q_Rec-(Q_Flu+Q_Hor)", qty: "\u0394 KLD", tank: "Decision Gate" },
  ];
  const colWidths = [280, 140, 160, 130, 240];
  const rowH = 30, headerH = 46;

  return (
    <g>
      <rect x={x} y={y} width={sw} height={sh} rx={16}
        fill="#f0fdf4" stroke={C.green.bd} strokeWidth={3} />
      {/* Title */}
      <rect x={x} y={y} width={sw} height={headerH} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 32} width={sw} height={14} fill={C.green.bd} />
      <text x={x + sw / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\uD83D\uDCCA"} WATER USAGE SYNOPSIS — MEP-21 Page 7 Format
      </text>
      {/* Column headers */}
      {(() => {
        const labels = ["Category", "Source", "Rate / Factor", "Quantity", "Storage"];
        let cx = x + 20;
        return labels.map((lbl, i) => {
          const el = (
            <g key={i}>
              <rect x={cx} y={y + headerH + 6} width={colWidths[i]} height={28} rx={6}
                fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.2} />
              <text x={cx + colWidths[i] / 2} y={y + headerH + 25} textAnchor="middle"
                fill={C.green.tx} fontSize={10} fontWeight={800}>{lbl}</text>
            </g>
          );
          cx += colWidths[i] + 6;
          return el;
        });
      })()}
      {/* Data rows */}
      {rows.map((row, ri) => {
        let cx = x + 20;
        const ry = y + headerH + 40 + ri * (rowH + 4);
        const vals = [row.cat, row.source, row.rate, row.qty, row.tank];
        const isDelta = ri === rows.length - 1;
        return (
          <g key={ri}>
            {vals.map((v, ci) => {
              const cw = colWidths[ci];
              const el = (
                <g key={ci}>
                  <rect x={cx} y={ry} width={cw} height={rowH} rx={5}
                    fill={isDelta ? C.amber.bg : "#fff"}
                    stroke={isDelta ? C.amber.bd : C.green.bd}
                    strokeWidth={isDelta ? 2 : 1} />
                  <text x={cx + cw / 2} y={ry + 20} textAnchor="middle"
                    fill={isDelta ? C.amber.tx : C.green.tx}
                    fontSize={10} fontWeight={isDelta ? 800 : 600}>{v}</text>
                </g>
              );
              cx += cw + 6;
              return el;
            })}
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// LODHA NORMS REFERENCE CARD
// =====================================================================
function LodhaNormsCard({ x, y }: { x: number; y: number }) {
  const cw = 350, ch = 420;
  const groups = [
    {
      title: "Occupancy Multipliers", items: [
        `1 BHK: ${LODHA.occ["1BHK"]} persons`,
        `2 BHK: ${LODHA.occ["2BHK"]} persons`,
        `3 BHK: ${LODHA.occ["3BHK"]} persons`,
        `4 BHK+: ${LODHA.occ["4BHK+"]} persons`,
      ],
    },
    {
      title: "Demand Rates (MEP-21)", items: [
        `Domestic: ${LODHA.dom_lpcd} LPCD`,
        `Flushing: ${LODHA.flu_lpcd} LPCD`,
        `Total Split: ${LODHA.dom_lpcd + LODHA.flu_lpcd} LPCD`,
        `Horticulture: ${LODHA.hor_rate} L/m\u00B2/day`,
        `Commercial: ${LODHA.commercial_lpcd} LPCD`,
      ],
    },
    {
      title: "STP Parameters", items: [
        `Discharge: ${LODHA.discharge * 100}% of domestic`,
        `Safety Buffer: ${(LODHA.stp_buffer - 1) * 100}%`,
        `Recovery: ${LODHA.stp_recovery * 100}%`,
      ],
    },
    {
      title: "Storage & Pumping", items: [
        `MMRDA UGT: ${LODHA.mmrda_ugt_day} Day`,
        `Local UGT: ${LODHA.local_ugt_day} Day`,
        `OHT (all): ${LODHA.oht_day} Day`,
        `Pump Fill: ${LODHA.pump_fill_hrs} hrs`,
        `Residual: ${LODHA.residual_bar} Bar`,
      ],
    },
  ];

  let gy = y + 44;
  return (
    <g>
      <rect x={x} y={y} width={cw} height={ch} rx={14}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={cw} height={36} rx={14} fill={C.amber.bd} />
      <rect x={x} y={y + 22} width={cw} height={14} fill={C.amber.bd} />
      <text x={x + cw / 2} y={y + 24} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={800}>
        {"\uD83D\uDCDC"} LODHA POLICY MEP-21 NORMS
      </text>
      {groups.map((g, gi) => {
        const groupY = gy;
        const groupH = 18 + g.items.length * 16;
        gy += groupH + 6;
        return (
          <g key={gi}>
            <text x={x + 14} y={groupY + 14} fill={C.amber.tx} fontSize={10} fontWeight={800}>{g.title}</text>
            {g.items.map((item, ii) => (
              <text key={ii} x={x + 22} y={groupY + 30 + ii * 16}
                fill={C.amber.tx} fontSize={9} fontWeight={500} opacity={0.85}>
                {"\u2022"} {item}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function WaterDemandCalcSVG() {
  // ── Y Coordinate Map for all 6 Stages ──
  const Y = {
    // Stage 1: Automated Data Harvesting
    s1Band: 10,
    s1_towerSelect: 70,
    s1_autoFetch: 185,
    s1_popTable: 310,
    s1_geometry: 620,
    s1_validation: 790,
    // Stage 2: Demand Segmenter
    s2Band: 910,
    s2_header: 970,
    s2_streams: 1070,
    s2_totalDemand: 1330,
    // Stage 3: STP Module
    s3Band: 1440,
    s3_header: 1500,
    s3_module: 1590,
    s3_output: 2000,
    // Stage 4: Decision Engine
    s4Band: 2110,
    s4_balanceFormula: 2170,
    s4_decision: 2340,
    s4_paths: 2480,
    s4_converge: 2720,
    // Stage 5: Storage Sizing
    s5Band: 2830,
    s5_regionSelect: 2890,
    s5_sizing: 3030,
    s5_output: 3510,
    // Stage 6: Pumping Output
    s6Band: 3630,
    s6_header: 3690,
    s6_dashboard: 3780,
    s6_synopsis: 4180,
    // Final
    finalDone: 4570,
    legend: 4700,
    normsCard: 4850,
  };

  const nh = 76;
  const nw = 440;
  const nx = CX - nw / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="wda" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="wda-blue" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blue.bd} />
        </marker>
        <marker id="wda-green" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
        <marker id="wda-orange" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.orange.bd} />
        </marker>
        <marker id="wda-rose" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.rose.bd} />
        </marker>
        <marker id="wda-purple" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.purple.bd} />
        </marker>
      </defs>

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 1: AUTOMATED DATA HARVESTING [DB FETCH]
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s1Band} h={870} label="STAGE 1: AUTOMATED DATA HARVESTING [DB FETCH]" color={C.blue.bd} icon={"\uD83D\uDDC3\uFE0F"} stageNum={1} />

      {/* 1.1 Tower Selection */}
      <SysBox x={nx} y={Y.s1_towerSelect} w={nw} h={nh}
        label="Select Project / Tower" sub="Dropdown: Auto-display Building List from DB"
        icon={"\uD83C\uDFE2"} badge="INPUT" />
      <DbIcon x={nx + nw + 24} y={Y.s1_towerSelect + 14} size={44} />
      <line x1={nx + nw} y1={Y.s1_towerSelect + nh / 2} x2={nx + nw + 24} y2={Y.s1_towerSelect + nh / 2 - 2}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s1_towerSelect + nh} x2={CX} y2={Y.s1_autoFetch} />

      {/* 1.2 Auto Fetch */}
      <SysBox x={nx} y={Y.s1_autoFetch} w={nw} h={nh}
        label="Auto-Fetch Unit Inventory" sub="Backend: Fetch all unit-wise populations & areas"
        icon={"\uD83E\uDD16"} badge="SYSTEM" />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s1_autoFetch + nh} x2={CX} y2={Y.s1_popTable} />

      {/* 1.3 Population Table */}
      <PopulationTable x={CX - 390} y={Y.s1_popTable} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s1_popTable + 280} x2={CX} y2={Y.s1_geometry} />

      {/* 1.4 Architectural Geometry */}
      <GeometryCards x={CX - 320} y={Y.s1_geometry} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s1_geometry + 140} x2={CX} y2={Y.s1_validation} />

      {/* 1.5 Input Data Validation Gate */}
      <DecisionDiamond cx={CX} cy={Y.s1_validation} rxD={210} ryD={52}
        label="Input Data Validated?" sub="User approves fetched data before proceeding" />

      {/* Reject path */}
      {(() => {
        const rejectX = CX + 220;
        const rejectY = Y.s1_validation;
        return (
          <g>
            <line x1={CX + 210} y1={rejectY} x2={rejectX + 60} y2={rejectY}
              stroke={C.rose.bd} strokeWidth={2.5} markerEnd="url(#wda-rose)" />
            <rect x={rejectX + 60} y={rejectY - 28} width={180} height={56} rx={10}
              fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
            <text x={rejectX + 150} y={rejectY - 6} textAnchor="middle"
              fill={C.rose.tx} fontSize={11} fontWeight={700}>{"\u26A0"} Not Approved</text>
            <text x={rejectX + 150} y={rejectY + 12} textAnchor="middle"
              fill={C.rose.tx} fontSize={10} opacity={0.8}>Loop back for re-entry</text>
            {/* Loop arrow back up */}
            <path d={`M${rejectX + 240},${rejectY} L${rejectX + 280},${rejectY} L${rejectX + 280},${Y.s1_towerSelect + nh / 2} L${nx + nw},${Y.s1_towerSelect + nh / 2}`}
              fill="none" stroke={C.rose.bd} strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#wda-rose)" />
            {/* Label */}
            <rect x={rejectX + 68} y={rejectY - 48} width={60} height={16} rx={4} fill="#fff" opacity={0.95} />
            <text x={rejectX + 98} y={rejectY - 36} textAnchor="middle"
              fill={C.rose.bd} fontSize={10} fontWeight={700}>No</text>
          </g>
        );
      })()}

      {/* Yes path label */}
      <rect x={CX - 22} y={Y.s1_validation + 55} width={44} height={16} rx={4} fill="#fff" opacity={0.95} />
      <text x={CX} y={Y.s1_validation + 66} textAnchor="middle"
        fill={C.green.bd} fontSize={10} fontWeight={700}>{"\u2713"} Yes</text>

      {/* Arrow to Stage 2 */}
      <Arrow x1={CX} y1={Y.s1_validation + 52} x2={CX} y2={Y.s2Band + 50} />

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 2: THE DEMAND SEGMENTER (MEP-21 Logic)
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s2Band} h={390} label="STAGE 2: THE DEMAND SEGMENTER (MEP-21 LOGIC)" color={C.teal.bd} icon={"\uD83D\uDCA7"} stageNum={2} />

      {/* 2.1 Segmenter Header */}
      <SysBox x={nx} y={Y.s2_header} w={nw} h={nh}
        label="Split Total Demand into 3 Streams" sub={`MEP-21: ${LODHA.dom_lpcd} Dom + ${LODHA.flu_lpcd} Flu + ${LODHA.hor_rate} L/m\u00B2 Hor`}
        icon={"\uD83D\uDD00"} badge="PROCESS" color={C.teal} />

      {/* Fan-out bar */}
      {(() => {
        const streamW = 380, streamGap = 30;
        const totalStreamW = 3 * streamW + 2 * streamGap;
        const streamX = CX - totalStreamW / 2;
        const centers = [0, 1, 2].map(i => streamX + i * (streamW + streamGap) + streamW / 2);
        const barY = Y.s2_header + nh + 18;
        return (
          <g>
            <line x1={CX} y1={Y.s2_header + nh} x2={CX} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={centers[0]} y1={barY} x2={centers[2]} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            {centers.map((cx, i) => (
              <line key={i} x1={cx} y1={barY} x2={cx} y2={Y.s2_streams}
                stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            ))}
            {["Domestic", "Flushing", "Horticulture"].map((lbl, i) => (
              <g key={i}>
                <rect x={centers[i] - 44} y={barY - 14} width={88} height={14} rx={3} fill="#fff" opacity={0.92} />
                <text x={centers[i]} y={barY - 4} textAnchor="middle" fill="#475569" fontSize={9} fontWeight={700}>{lbl}</text>
              </g>
            ))}
          </g>
        );
      })()}

      {/* 2.2 Three Demand Streams */}
      {(() => {
        const streamW = 380, streamGap = 30;
        const totalStreamW = 3 * streamW + 2 * streamGap;
        const streamX = CX - totalStreamW / 2;
        return <DemandStreams x={streamX} y={Y.s2_streams} />;
      })()}

      {/* Fan-in from streams to total */}
      {(() => {
        const streamW = 380, streamGap = 30;
        const totalStreamW = 3 * streamW + 2 * streamGap;
        const streamX = CX - totalStreamW / 2;
        const centers = [0, 1, 2].map(i => streamX + i * (streamW + streamGap) + streamW / 2);
        const streamBot = Y.s2_streams + 220;
        const barY = streamBot + 16;
        return (
          <g>
            {centers.map((cx, i) => (
              <line key={i} x1={cx} y1={streamBot} x2={cx} y2={barY}
                stroke={C.arrow} strokeWidth={2.5} />
            ))}
            <line x1={centers[0]} y1={barY} x2={centers[2]} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={barY} x2={CX} y2={Y.s2_totalDemand}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
          </g>
        );
      })()}

      {/* 2.3 Total Demand */}
      <SysBox x={nx} y={Y.s2_totalDemand} w={nw} h={nh}
        label="Total Segmented Demand" sub="Q_Dom + Q_Flu + Q_Hor = Total Daily KLD"
        icon={"\uD83D\uDCCA"} badge="OUTPUT" color={C.green} />

      {/* Arrow to Stage 3 */}
      <Arrow x1={CX} y1={Y.s2_totalDemand + nh} x2={CX} y2={Y.s3Band + 50} />

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 3: STP TREATMENT & RECOVERY MODULE
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s3Band} h={640} label="STAGE 3: STP TREATMENT & RECOVERY MODULE" color={C.purple.bd} icon={"\u267B\uFE0F"} stageNum={3} />

      {/* 3.1 STP Header */}
      <SysBox x={nx} y={Y.s3_header} w={nw} h={nh}
        label="Calculate STP Mass Balance" sub="Inlet Feed \u2192 Treatment \u2192 Recovery Yield"
        icon={"\u267B\uFE0F"} badge="PROCESS" color={C.purple} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s3_header + nh} x2={CX} y2={Y.s3_module} />

      {/* 3.2 STP Module */}
      <STPModule x={CX - 550} y={Y.s3_module} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s3_module + 380} x2={CX} y2={Y.s3_output} />

      {/* 3.3 STP Output */}
      <SysBox x={nx} y={Y.s3_output} w={nw} h={nh}
        label="Recycled Water Available (Q_Rec)" sub={`Net yield: ${(LODHA.stp_recovery * 100).toFixed(0)}% of sewage inflow`}
        icon={"\u2705"} badge="OUTPUT" color={C.green} />

      {/* Arrow to Stage 4 */}
      <Arrow x1={CX} y1={Y.s3_output + nh} x2={CX} y2={Y.s4Band + 50} />

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 4: "EXCESS & MAKEUP" DECISION ENGINE
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s4Band} h={690} label={'STAGE 4: THE "EXCESS & MAKEUP" DECISION ENGINE'} color={C.orange.bd} icon={"\u2696\uFE0F"} stageNum={4} />

      {/* 4.1 Balance Formula */}
      <FormulaBox x={CX - 400} y={Y.s4_balanceFormula} w={800} h={120}
        title={"\uD83E\uddEE BALANCE EQUATION — The Logic Gate"}
        formulas={[
          `\u0394 = Q_Rec \u2212 (Q_Flu + Q_Hor)`,
          `If \u0394 < 0: Deficit \u2192 Municipal Makeup Required`,
          `If \u0394 > 0: Surplus \u2192 Excess Recycled Water Available`,
        ]}
        color={C.orange} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s4_balanceFormula + 120} x2={CX} y2={Y.s4_decision - 55} />

      {/* 4.2 Decision Diamond */}
      <DecisionDiamond cx={CX} cy={Y.s4_decision} rxD={210} ryD={55}
        label={"\u0394 = Q_Rec \u2212 (Q_Flu + Q_Hor)"}
        sub="Positive or Negative?" />

      {/* Fan-out to Deficit and Surplus paths */}
      {(() => {
        const pathW = 440, pathGap = 80;
        const totalPathW = 2 * pathW + pathGap;
        const pathX = CX - totalPathW / 2;
        const leftCx = pathX + pathW / 2;
        const rightCx = pathX + pathW + pathGap + pathW / 2;
        const barY = Y.s4_decision + 75;
        return (
          <g>
            <line x1={CX} y1={Y.s4_decision + 55} x2={CX} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={barY} x2={rightCx} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={barY} x2={leftCx} y2={Y.s4_paths}
              stroke={C.rose.bd} strokeWidth={2.5} markerEnd="url(#wda-rose)" />
            <line x1={rightCx} y1={barY} x2={rightCx} y2={Y.s4_paths}
              stroke={C.green.bd} strokeWidth={2.5} markerEnd="url(#wda-green)" />
            {/* Labels */}
            <rect x={leftCx - 55} y={barY - 16} width={110} height={16} rx={4} fill="#fff" opacity={0.95} />
            <text x={leftCx} y={barY - 5} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>
              {"\u0394"} &lt; 0 (Deficit)
            </text>
            <rect x={rightCx - 55} y={barY - 16} width={110} height={16} rx={4} fill="#fff" opacity={0.95} />
            <text x={rightCx} y={barY - 5} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>
              {"\u0394"} &gt; 0 (Surplus)
            </text>
          </g>
        );
      })()}

      {/* 4.3 Deficit & Surplus Paths */}
      {(() => {
        const pathW = 440, pathGap = 80;
        const totalPathW = 2 * pathW + pathGap;
        const pathX = CX - totalPathW / 2;
        return (
          <g>
            <DeficitPath x={pathX} y={Y.s4_paths} />
            <SurplusPath x={pathX + pathW + pathGap} y={Y.s4_paths} />
          </g>
        );
      })()}

      {/* Fan-in from paths */}
      {(() => {
        const pathW = 440, pathGap = 80;
        const totalPathW = 2 * pathW + pathGap;
        const pathX = CX - totalPathW / 2;
        const leftCx = pathX + pathW / 2;
        const rightCx = pathX + pathW + pathGap + pathW / 2;
        const pathBot = Y.s4_paths + 200;
        const barY = pathBot + 20;
        return (
          <g>
            <line x1={leftCx} y1={pathBot} x2={leftCx} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightCx} y1={pathBot} x2={rightCx} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={barY} x2={rightCx} y2={barY} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={barY} x2={CX} y2={Y.s4_converge}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
          </g>
        );
      })()}

      {/* 4.4 Converge */}
      <SysBox x={nx} y={Y.s4_converge} w={nw} h={nh}
        label="Water Balance Determined" sub="Makeup or Excess identified \u2192 proceed to storage"
        icon={"\u2705"} badge="RESOLVED" color={C.green} />

      {/* Arrow to Stage 5 */}
      <Arrow x1={CX} y1={Y.s4_converge + nh} x2={CX} y2={Y.s5Band + 50} />

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 5: STORAGE SIZING (Regional Selection)
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s5Band} h={740} label="STAGE 5: STORAGE SIZING (REGIONAL SELECTION)" color={C.amber.bd} icon={"\uD83D\uDCC0"} stageNum={5} />

      {/* 5.1 Region Selection */}
      <DecisionDiamond cx={CX} cy={Y.s5_regionSelect} rxD={220} ryD={55}
        label="Select Region" sub="MMRDA or Local / PMC?"
        color={C.amber} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s5_regionSelect + 55} x2={CX} y2={Y.s5_sizing} />

      {/* 5.2 Storage Sizing */}
      <StorageSizing x={CX - 550} y={Y.s5_sizing} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s5_sizing + 440} x2={CX} y2={Y.s5_output} />

      {/* 5.3 Storage Output */}
      <SysBox x={nx} y={Y.s5_output} w={nw} h={nh}
        label="Tank Sizes Calculated" sub="UGT Potable + UGT Flushing + OHT + Fire Tank"
        icon={"\uD83D\uDCC0"} badge="OUTPUT" color={C.green} />

      {/* Arrow to Stage 6 */}
      <Arrow x1={CX} y1={Y.s5_output + nh} x2={CX} y2={Y.s6Band + 50} />

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 6: PUMPING & HYDRAULIC OUTPUT
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.s6Band} h={910} label="STAGE 6: PUMPING & HYDRAULIC OUTPUT" color={C.indigo.bd} icon={"\u2699\uFE0F"} stageNum={6} />

      {/* 6.1 Header */}
      <SysBox x={nx} y={Y.s6_header} w={nw} h={nh}
        label="Calculate Pump Duty Points" sub={`Flow = Tank / ${LODHA.pump_fill_hrs}hrs | TDH = Static + Friction + ${LODHA.residual_bar} Bar`}
        icon={"\u2699\uFE0F"} badge="PROCESS" color={C.indigo} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s6_header + nh} x2={CX} y2={Y.s6_dashboard} />

      {/* 6.2 Pump Dashboard */}
      <PumpDashboard x={CX - 550} y={Y.s6_dashboard} />

      {/* Arrow */}
      <Arrow x1={CX} y1={Y.s6_dashboard + 340} x2={CX} y2={Y.s6_synopsis} />

      {/* 6.3 Water Usage Synopsis */}
      <WaterSynopsis x={CX - 600} y={Y.s6_synopsis} />

      {/* Arrow to Final */}
      <Arrow x1={CX} y1={Y.s6_synopsis + 340} x2={CX} y2={Y.finalDone}
        color={C.green.bd} marker="wda-green" />

      {/* ═══════════════════════════════════════════════════════════════
          FINAL: COMPLETE
      ═══════════════════════════════════════════════════════════════ */}
      <g>
        <rect x={CX - 260} y={Y.finalDone} width={520} height={80} rx={40}
          fill={C.green.bd} stroke="#34d399" strokeWidth={3} />
        <text x={CX} y={Y.finalDone + 30} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
          {"\uD83D\uDCE4"} WATER BALANCE CALCULATION COMPLETE
        </text>
        <text x={CX} y={Y.finalDone + 52} textAnchor="middle" fill="#fff" fontSize={13} opacity={0.85}>
          Integrated Water & STP Mass-Balance {"\u2192"} MEP-21 Synopsis Ready
        </text>
        <text x={CX} y={Y.finalDone + 68} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.7}>
          All pump duty points, tank sizes & TDH values generated
        </text>
      </g>

      {/* ═══════════════════════════════════════════════════════════════
          VISUAL LEGEND
      ═══════════════════════════════════════════════════════════════ */}
      <g>
        <rect x={CX - 490} y={Y.legend} width={980} height={100} rx={14}
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
        <text x={CX} y={Y.legend + 20} textAnchor="middle" fill="#475569" fontSize={13} fontWeight={800}>
          VISUAL LEGEND
        </text>
        {[
          { label: "System/DB Step", color: C.blue.bd, bg: C.blue.bg },
          { label: "Decision Gate", color: C.orange.bd, bg: C.orange.bg },
          { label: "Output / Result", color: C.green.bd, bg: C.green.bg },
          { label: "Formula / Calc", color: C.purple.bd, bg: C.purple.bg },
          { label: "STP / Treatment", color: C.rose.bd, bg: C.rose.bg },
          { label: "Storage / Tank", color: C.amber.bd, bg: C.amber.bg },
          { label: "Hydraulic", color: C.indigo.bd, bg: C.indigo.bg },
        ].map((item, i) => {
          const lx = CX - 470 + i * 138;
          return (
            <g key={i}>
              <rect x={lx} y={Y.legend + 36} width={126} height={42} rx={8}
                fill={item.bg} stroke={item.color} strokeWidth={2} />
              <text x={lx + 63} y={Y.legend + 62} textAnchor="middle"
                fill={item.color} fontSize={10} fontWeight={700}>{item.label}</text>
            </g>
          );
        })}
      </g>

      {/* ═══════════════════════════════════════════════════════════════
          LODHA NORMS REFERENCE — Side Panel
      ═══════════════════════════════════════════════════════════════ */}
      <LodhaNormsCard x={40} y={Y.normsCard} />

      {/* ═══════════════════════════════════════════════════════════════
          SIDE ANNOTATIONS
      ═══════════════════════════════════════════════════════════════ */}

      {/* Stage 1: DB Fetch annotation */}
      <AnnotationNote x={40} y={Y.s1_autoFetch - 10} w={220} h={80}
        title="DATABASE-FIRST" icon={"\uD83D\uDDC3\uFE0F"}
        lines={[
          "All data auto-fetched from",
          "project master matrix DB.",
          "No manual entry for population.",
          "Auto-populate only mode."
        ]}
        color={C.cyan} />

      {/* Stage 2: MEP-21 reference */}
      <AnnotationNote x={40} y={Y.s2_streams + 30} w={200} h={90}
        title="MEP-21 RATES" icon={"\uD83D\uDCDC"}
        lines={[
          `Domestic: ${LODHA.dom_lpcd} LPCD (Potable)`,
          `Flushing: ${LODHA.flu_lpcd} LPCD (Non-Potable)`,
          `Total: ${LODHA.dom_lpcd + LODHA.flu_lpcd} LPCD per capita`,
          `Horticulture: ${LODHA.hor_rate} L/m\u00B2/day`,
          `Commercial: ${LODHA.commercial_lpcd} LPCD visitors`
        ]}
        color={C.teal} />

      {/* Stage 4: Decision logic annotation */}
      <AnnotationNote x={W - 290} y={Y.s4_balanceFormula + 10} w={240} h={100}
        title="DECISION ENGINE LOGIC" icon={"\u2696\uFE0F"}
        lines={[
          "The 'Logic Gate' determines",
          "daily operational costs.",
          "\u0394 < 0 \u2192 Buy municipal water",
          "\u0394 > 0 \u2192 Revenue from excess",
          "\u0394 = 0 \u2192 Perfect balance (rare)"
        ]}
        color={C.orange} />

      {/* Stage 5: Regional logic annotation */}
      <AnnotationNote x={W - 290} y={Y.s5_regionSelect - 30} w={240} h={90}
        title="REGIONAL TOGGLE" icon={"\uD83C\uDFD9"}
        lines={[
          `MMRDA: UGT = ${LODHA.mmrda_ugt_day} Day storage`,
          `Local/PMC: UGT = ${LODHA.local_ugt_day} Day storage`,
          `OHT: ${LODHA.oht_day} Day (both regions)`,
          "Selection impacts tank cost &",
          "pump sizing significantly."
        ]}
        color={C.amber} />

      {/* Stage 6: Pump formula annotation */}
      <AnnotationNote x={W - 290} y={Y.s6_dashboard + 20} w={240} h={90}
        title="TDH FORMULA" icon={"\u2699\uFE0F"}
        lines={[
          "TDH = Static + Friction + Residual",
          `Residual: ${LODHA.residual_bar} Bar minimum`,
          `Fill Time: ${LODHA.pump_fill_hrs} hours`,
          "Q = Tank Volume / Fill Time",
          "Dry run: UGT low-level sensor"
        ]}
        color={C.indigo} />
    </svg>
  );
}
