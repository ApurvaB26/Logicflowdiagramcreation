import React from "react";

// =====================================================================
// WATER DEMAND CALCULATOR — Comprehensive 5-Phase SVG Flow Diagram
// Phase 1: Project Selection & Auto-Fetch
// Phase 2: User Validation & External Override
// Phase 3: Policy Engine (Lodha vs NBC 2016)
// Phase 4: Calculation & Results
// Phase 5: Export & Format Selection (MOEF vs Lodha)
// =====================================================================

const W = 1560;
const H = 3700;
const CX = W / 2;

// Colors — Bold Blue for system, Orange for decisions, Bright Green for outputs
const C = {
  blue:    { bg: "#dbeafe", bd: "#2563eb", tx: "#1e40af" },
  orange:  { bg: "#fff7ed", bd: "#ea580c", tx: "#9a3412" },
  green:   { bg: "#d1fae5", bd: "#059669", tx: "#065f46" },
  purple:  { bg: "#ede9fe", bd: "#7c3aed", tx: "#5b21b6" },
  cyan:    { bg: "#cffafe", bd: "#0891b2", tx: "#155e75" },
  rose:    { bg: "#ffe4e6", bd: "#e11d48", tx: "#9f1239" },
  amber:   { bg: "#fef3c7", bd: "#d97706", tx: "#92400e" },
  teal:    { bg: "#ccfbf1", bd: "#0d9488", tx: "#134e4a" },
  slate:   { bg: "#f1f5f9", bd: "#64748b", tx: "#334155" },
  arrow:   "#94a3b8",
};

// =====================================================================
// REUSABLE SVG COMPONENTS
// =====================================================================

function PhaseBand({ y, h, label, color, icon }: { y: number; h: number; label: string; color: string; icon?: string }) {
  return (
    <g>
      <rect x={16} y={y} width={W - 32} height={h} rx={16}
        fill={`${color}0a`} stroke={`${color}30`} strokeWidth={2} strokeDasharray="10,6" />
      <rect x={16} y={y} width={W - 32} height={36} rx={16} fill={`${color}15`} />
      <rect x={16} y={y + 24} width={W - 32} height={12} fill={`${color}15`} />
      <text x={36} y={y + 24} fill={color} fontSize={13} fontWeight={800} letterSpacing={1.2}>
        {icon ? `${icon}  ${label}` : label}
      </text>
    </g>
  );
}

function StepBadge({ x, y, num, color }: { x: number; y: number; num: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={20} fill={color} />
      <circle cx={x} cy={y} r={20} fill="none" stroke="#fff" strokeWidth={2} opacity={0.3} />
      <text x={x} y={y + 6} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>{num}</text>
    </g>
  );
}

function SysBox({ x, y, w, h, label, sub, icon, badge }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; icon?: string; badge?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={3} />
      {badge && (
        <>
          <rect x={x + w - 110} y={y + 8} width={96} height={24} rx={12} fill={C.blue.bd} />
          <text x={x + w - 62} y={y + 24} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      {icon && <text x={x + 18} y={y + h / 2 + 6} fontSize={20}>{icon}</text>}
      <text x={cx + (icon ? 10 : 0)} y={y + h / 2 - 6} textAnchor="middle" fill={C.blue.tx} fontSize={16} fontWeight={700}>{label}</text>
      <text x={cx + (icon ? 10 : 0)} y={y + h / 2 + 14} textAnchor="middle" fill={C.blue.tx} fontSize={12} opacity={0.7}>{sub}</text>
    </g>
  );
}

function DecisionDiamond({ cx, cy, rxD, ryD, label, sub }: {
  cx: number; cy: number; rxD: number; ryD: number;
  label: string; sub: string;
}) {
  return (
    <g>
      <polygon
        points={`${cx},${cy - ryD} ${cx + rxD},${cy} ${cx},${cy + ryD} ${cx - rxD},${cy}`}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={3}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={C.orange.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={C.orange.tx} fontSize={12} opacity={0.8}>{sub}</text>
    </g>
  );
}

function OutputBox({ x, y, w, h, label, sub, icon }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string; icon?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
      {icon && <text x={x + 18} y={y + h / 2 + 6} fontSize={20}>{icon}</text>}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={C.green.tx} fontSize={16} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 14} textAnchor="middle" fill={C.green.tx} fontSize={12} opacity={0.75}>{sub}</text>
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#wda)" />
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

// =====================================================================
// DATA DASHBOARD — Fetched Tower Data Display
// =====================================================================
function DataDashboard({ x, y }: { x: number; y: number }) {
  const dw = 960, dh = 200;
  const fields = [
    { label: "Floors", value: "Auto", icon: "\uD83C\uDFE2", color: C.blue },
    { label: "Units", value: "Auto", icon: "\uD83C\uDFE0", color: C.blue },
    { label: "Typology", value: "Auto", icon: "\uD83D\uDCCB", color: C.purple },
    { label: "Occupancy", value: "Auto", icon: "\uD83D\uDC65", color: C.teal },
    { label: "Landscape\nArea", value: "Auto", icon: "\uD83C\uDF33", color: C.green },
    { label: "Car Park\nCount", value: "Auto", icon: "\uD83D\uDE97", color: C.amber },
    { label: "HVAC\nMakeup", value: "Auto", icon: "\u2744\uFE0F", color: C.cyan },
  ];
  const cardW = (dw - 60) / 7;
  const cardH = 110;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={44} rx={16} fill={C.blue.bd} />
      <rect x={x} y={y + 30} width={dw} height={14} fill={C.blue.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"\uD83D\uDDC3\uFE0F"} MASTER MATRIX DATA — Auto-Fetched from Database
      </text>
      {fields.map((f, i) => {
        const cx = x + 16 + i * (cardW + 6);
        const cy = y + 56;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={10}
              fill={f.color.bg} stroke={f.color.bd} strokeWidth={1.5} />
            <text x={cx + cardW / 2} y={cy + 22} textAnchor="middle" fontSize={20}>{f.icon}</text>
            {f.label.split("\n").map((line, li) => (
              <text key={li} x={cx + cardW / 2} y={cy + 42 + li * 14} textAnchor="middle"
                fill={f.color.tx} fontSize={10} fontWeight={600}>{line}</text>
            ))}
            <rect x={cx + 8} y={cy + cardH - 30} width={cardW - 16} height={22} rx={6}
              fill={f.color.bd} opacity={0.15} />
            <text x={cx + cardW / 2} y={cy + cardH - 14} textAnchor="middle"
              fill={f.color.bd} fontSize={12} fontWeight={800}>{f.value}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// EXTERNAL DEMAND INPUT PANEL
// =====================================================================
function ExternalDemandPanel({ x, y, w }: { x: number; y: number; w: number }) {
  const pw = w, ph = 220;
  const items = [
    { label: "Swimming Pool", icon: "\uD83C\uDFCA", unit: "KLD" },
    { label: "Irrigation / Landscaping", icon: "\uD83C\uDF3F", unit: "KLD" },
    { label: "Car Washing", icon: "\uD83D\uDE97", unit: "KLD" },
    { label: "HVAC Makeup Water", icon: "\u2744\uFE0F", unit: "KLD" },
    { label: "Club House / Amenities", icon: "\uD83C\uDFAA", unit: "KLD" },
  ];
  const rowH = 28, startY = y + 52;

  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={40} rx={14} fill={C.orange.bd} />
      <rect x={x} y={y + 28} width={pw} height={12} fill={C.orange.bd} />
      <text x={x + pw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\u270D"} EXTERNAL DEMAND — Manual Entry
      </text>
      {items.map((it, i) => {
        const ry = startY + i * (rowH + 5);
        return (
          <g key={i}>
            <rect x={x + 12} y={ry} width={pw - 24} height={rowH} rx={7}
              fill="#fff" stroke={C.orange.bd} strokeWidth={1.2} />
            <text x={x + 34} y={ry + 19} fill={C.orange.tx} fontSize={11} fontWeight={600}>
              {it.icon} {it.label}
            </text>
            <rect x={x + pw - 100} y={ry + 3} width={76} height={rowH - 6} rx={5}
              fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={1} strokeDasharray="4,3" />
            <text x={x + pw - 62} y={ry + 19} textAnchor="middle"
              fill={C.orange.tx} fontSize={10} fontWeight={600}>{it.unit}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// DATA REVIEW PANEL
// =====================================================================
function DataReviewPanel({ x, y, w }: { x: number; y: number; w: number }) {
  const ph = 220;
  const items = [
    "Floors & Units \u2014 verify count",
    "Typology \u2014 confirm unit mix",
    "Occupancy \u2014 override if special",
    "Landscape Area \u2014 update if revised",
    "Car Parks \u2014 verify count",
    "HVAC Makeup \u2014 confirm tonnage",
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={ph} rx={14}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2.5} strokeDasharray="8,5" />
      <text x={x + w / 2} y={y + 28} textAnchor="middle"
        fill={C.orange.tx} fontSize={13} fontWeight={700}>
        {"\uD83D\uDCCB"} DATA REVIEW PANEL
      </text>
      <text x={x + w / 2} y={y + 48} textAnchor="middle"
        fill={C.orange.tx} fontSize={11} opacity={0.75}>
        Validate fetched data &amp; adjust if needed
      </text>
      {items.map((item, i) => (
        <g key={i}>
          <rect x={x + 14} y={y + 62 + i * 25} width={w - 28} height={20} rx={5}
            fill="#fff" stroke={C.orange.bd} strokeWidth={0.8} />
          <text x={x + 30} y={y + 77 + i * 25} fill={C.orange.tx} fontSize={10} fontWeight={500}>
            {"\u2611"} {item}
          </text>
        </g>
      ))}
    </g>
  );
}

// =====================================================================
// POLICY CARD with formula display
// =====================================================================
function PolicyCard({ x, y, title, formula1, formula2, desc, color, isWarning }: {
  x: number; y: number; title: string;
  formula1: string; formula2: string; desc: string;
  color: { bg: string; bd: string; tx: string };
  isWarning?: boolean;
}) {
  const cw = 440, ch = 200;
  return (
    <g>
      <rect x={x} y={y} width={cw} height={ch} rx={14}
        fill={color.bg} stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={cw} height={42} rx={14} fill={color.bd} />
      <rect x={x} y={y + 28} width={cw} height={14} fill={color.bd} />
      <text x={x + cw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={800}>
        {title}
      </text>
      {/* Formula box */}
      <rect x={x + 18} y={y + 56} width={cw - 36} height={38} rx={8}
        fill="#fff" stroke={color.bd} strokeWidth={1.5} />
      <text x={x + cw / 2} y={y + 72} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>
        Domestic: {formula1}
      </text>
      <text x={x + cw / 2} y={y + 88} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>
        Flushing: {formula2}
      </text>
      {/* Description */}
      <rect x={x + 18} y={y + 104} width={cw - 36} height={42} rx={8}
        fill={`${color.bd}12`} />
      <text x={x + cw / 2} y={y + 122} textAnchor="middle" fill={color.tx} fontSize={12} opacity={0.85}>
        {desc}
      </text>
      <text x={x + cw / 2} y={y + 138} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.65}>
        Values pre-populated from policy database
      </text>
      {/* Verify badge */}
      <rect x={x + cw / 2 - 60} y={y + ch - 42} width={120} height={28} rx={14}
        fill={color.bd} opacity={0.9} />
      <text x={x + cw / 2} y={y + ch - 23} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
        {"\u2705"} User Verifies
      </text>
      {isWarning && (
        <g>
          <rect x={x + 8} y={y + ch + 10} width={cw - 16} height={44} rx={8}
            fill="#fef2f2" stroke="#ef4444" strokeWidth={2} />
          <text x={x + cw / 2} y={y + ch + 28} textAnchor="middle" fill="#dc2626" fontSize={11} fontWeight={700}>
            {"\u26A0\uFE0F"} Warning: Standard lower than internal company policy.
          </text>
          <text x={x + cw / 2} y={y + ch + 44} textAnchor="middle" fill="#dc2626" fontSize={10} fontWeight={600}>
            Verify with Lead Engineer before proceeding.
          </text>
        </g>
      )}
    </g>
  );
}

// =====================================================================
// FORMULA BLOCK — Engineering calculation display
// =====================================================================
function FormulaBlock({ x, y, w }: { x: number; y: number; w: number }) {
  const fw = w, fh = 160;
  return (
    <g>
      <rect x={x} y={y} width={fw} height={fh} rx={14}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={3} />
      <rect x={x} y={y} width={fw} height={42} rx={14} fill={C.purple.bd} />
      <rect x={x} y={y + 28} width={fw} height={14} fill={C.purple.bd} />
      <text x={x + fw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\uD83E\uddEE"} MASTER FORMULA — Total Water Demand Calculation
      </text>
      {/* Main formula */}
      <rect x={x + 20} y={y + 54} width={fw - 40} height={42} rx={10}
        fill="#fff" stroke={C.purple.bd} strokeWidth={2} />
      <text x={x + fw / 2} y={y + 80} textAnchor="middle" fill={C.purple.tx} fontSize={14} fontWeight={800}>
        Total Demand = (Occupancy {"\u00D7"} LPCD) + (Landscape {"\u00D7"} 5) + (Cars {"\u00D7"} 2.5) + HVAC Makeup
      </text>
      {/* Breakdown */}
      <text x={x + fw / 2} y={y + 116} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={600}>
        Summation runs instantly after Policy selection | All values in KLD (Kilo Litres per Day)
      </text>
      <text x={x + fw / 2} y={y + 140} textAnchor="middle" fill={C.purple.tx} fontSize={11} opacity={0.65}>
        Landscape rate: 5 L/sqm/day | Car wash: 2.5 L/car/day | HVAC: from tower matrix auto-fetch
      </text>
    </g>
  );
}

// =====================================================================
// RESULTS DASHBOARD
// =====================================================================
function ResultsDashboard({ x, y }: { x: number; y: number }) {
  const dw = 960, dh = 190;
  const metrics = [
    { label: "Domestic\nDemand", value: "XXX KLD", icon: "\uD83C\uDFE0", color: C.blue, sub: "Pop \u00D7 165 (or 135) LPCD" },
    { label: "Flushing\nDemand", value: "XXX KLD", icon: "\uD83D\uDEB0", color: C.teal, sub: "Pop \u00D7 45 LPCD" },
    { label: "External\nDemand", value: "XXX KLD", icon: "\uD83C\uDF3F", color: C.amber, sub: "Landscape+Car+HVAC" },
    { label: "Total Daily\nRequirement", value: "XXX KLD", icon: "\uD83D\uDCA7", color: C.green, sub: "Grand Total All Sources" },
  ];
  const cardW = (dw - 80) / 4;
  const cardH = 105;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f0fdf4" stroke={C.green.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={44} rx={16} fill={C.green.bd} />
      <rect x={x} y={y + 30} width={dw} height={14} fill={C.green.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {"\uD83D\uDCCA"} CALCULATED OUTPUT — Final KLD Results
      </text>
      {metrics.map((m, i) => {
        const cx = x + 16 + i * (cardW + 16);
        const cy = y + 56;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={12}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={cx + cardW / 2} y={cy + 20} textAnchor="middle" fontSize={18}>{m.icon}</text>
            {m.label.split("\n").map((line, li) => (
              <text key={li} x={cx + cardW / 2} y={cy + 38 + li * 14} textAnchor="middle"
                fill={m.color.tx} fontSize={11} fontWeight={700}>{line}</text>
            ))}
            <text x={cx + cardW / 2} y={cy + 74} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={900}>{m.value}</text>
            <text x={cx + cardW / 2} y={cy + 94} textAnchor="middle"
              fill={m.color.tx} fontSize={9} opacity={0.6}>{m.sub}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// EXPORT FORMAT CARD
// =====================================================================
function ExportCard({ x, y, title, icon, items, color, docIcon }: {
  x: number; y: number; title: string; icon: string;
  items: string[]; color: { bg: string; bd: string; tx: string }; docIcon: string;
}) {
  const cw = 430, ch = 230;
  const rowH = 28;
  return (
    <g>
      <rect x={x} y={y} width={cw} height={ch} rx={14}
        fill={color.bg} stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={cw} height={46} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={cw} height={14} fill={color.bd} />
      <text x={x + cw / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {icon} {title}
      </text>
      {items.map((it, i) => {
        const ry = y + 60 + i * (rowH + 4);
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={cw - 28} height={rowH} rx={7}
              fill="#fff" stroke={color.bd} strokeWidth={1.2} opacity={0.9} />
            <text x={x + 34} y={ry + 19} fill={color.tx} fontSize={12} fontWeight={600}>
              {"\u2022"} {it}
            </text>
          </g>
        );
      })}
      {/* Document download */}
      <rect x={x + cw / 2 - 50} y={y + ch - 38} width={100} height={28} rx={14}
        fill={color.bd} />
      <text x={x + cw / 2} y={y + ch - 19} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
        {docIcon} Download
      </text>
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function WaterDemandCalcSVG() {
  // ── Y positions for each phase — generous spacing to prevent overlaps ──
  const Y = {
    // Phase 1: Project Selection
    p1Band: 10,
    towerSelect: 65,
    autoFetch: 180,
    dataDash: 300,
    // Phase 2: User Validation
    p2Band: 535,
    reviewDecision: 620,
    panels: 750,           // both panels on same row
    adjustedCalc: 1030,
    // Phase 3: Policy Engine
    p3Band: 1150,
    policyDecision: 1230,
    policyCards: 1400,
    policyConverge: 1700,
    // Phase 4: Calculation & Results
    p4Band: 1790,
    formulaBlock: 1860,
    calcProcess: 2080,
    resultsDash: 2210,
    // Phase 5: Export & Format
    p5Band: 2460,
    formatDecision: 2545,
    exportCards: 2710,
    exportConverge: 2990,
    finalDone: 3080,
  };

  const nh = 76;
  const nw = 420;
  const nx = CX - nw / 2;

  // Dashboard dimensions
  const dashW = 960, dashX = CX - dashW / 2;

  // Phase 2 panel dimensions — side by side, NO overlap
  const panelGap = 50;
  const panelW = 420;
  const leftPanelX = CX - panelGap / 2 - panelW;   // left panel
  const rightPanelX = CX + panelGap / 2;             // right panel
  const panelH = 220;

  // Policy card positions
  const pCardW = 440, pCardGap = 60;
  const pTotalW = 2 * pCardW + pCardGap;
  const pX0 = CX - pTotalW / 2;

  // Export card positions
  const eCardW = 430, eCardGap = 60;
  const eTotalW = 2 * eCardW + eCardGap;
  const eX0 = CX - eTotalW / 2;

  // Formula
  const fmW = 880, fmX = CX - fmW / 2;

  // Results dashboard
  const resDashW = 960, resDashX = CX - resDashW / 2;

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
      </defs>

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 1: PROJECT SELECTION
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p1Band} h={505} label="PHASE 1: PROJECT SELECTION & AUTO-FETCH" color={C.blue.bd} icon={"\uD83C\uDFE2"} />

      {/* Step 1: Tower Selection */}
      <StepBadge x={nx - 30} y={Y.towerSelect + nh / 2} num={1} color={C.blue.bd} />
      <SysBox x={nx} y={Y.towerSelect} w={nw} h={nh}
        label="Select Tower" sub="Dropdown: Tower 1 / Tower 2 / Tower 3"
        icon={"\uD83C\uDFE2"} badge="INPUT" />

      {/* Arrow: Tower → Auto Fetch */}
      <Arrow x1={CX} y1={Y.towerSelect + nh} x2={CX} y2={Y.autoFetch} />

      {/* Step 2: Auto Fetch */}
      <StepBadge x={nx - 30} y={Y.autoFetch + nh / 2} num={2} color={C.blue.bd} />
      <SysBox x={nx} y={Y.autoFetch} w={nw} h={nh}
        label="Auto-Fetch from Master Matrix" sub="System triggers database lookup for selected tower"
        icon={"\uD83D\uDDC3\uFE0F"} badge="SYSTEM" />
      <DbIcon x={nx + nw + 24} y={Y.autoFetch + 14} size={44} />
      <line x1={nx + nw} y1={Y.autoFetch + nh / 2} x2={nx + nw + 24} y2={Y.autoFetch + nh / 2 - 2}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />

      {/* Arrow: Auto Fetch → Data Dashboard */}
      <Arrow x1={CX} y1={Y.autoFetch + nh} x2={CX} y2={Y.dataDash} />

      {/* Step 3: Data Dashboard Display */}
      <DataDashboard x={dashX} y={Y.dataDash} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 2: USER VALIDATION & EXTERNAL OVERRIDE
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p2Band} h={570} label="PHASE 2: USER VALIDATION & EXTERNAL OVERRIDE" color={C.orange.bd} icon={"\u270D"} />

      {/* Arrow: Dashboard → Review Decision */}
      <Arrow x1={CX} y1={Y.dataDash + 200} x2={CX} y2={Y.reviewDecision - 55} />

      {/* Decision: Review & Edit Data */}
      <StepBadge x={CX - 220} y={Y.reviewDecision} num={3} color={C.orange.bd} />
      <DecisionDiamond cx={CX} cy={Y.reviewDecision} rxD={200} ryD={52}
        label="Review & Edit Data" sub="User validates auto-fetched data" />

      {/* Trunk down from diamond → split to two panels */}
      <line x1={CX} y1={Y.reviewDecision + 52} x2={CX} y2={Y.reviewDecision + 85}
        stroke={C.arrow} strokeWidth={2.5} />
      {/* Horizontal bar spanning both panel centers */}
      {(() => {
        const leftCenterX = leftPanelX + panelW / 2;
        const rightCenterX = rightPanelX + panelW / 2;
        return (
          <g>
            <line x1={leftCenterX} y1={Y.reviewDecision + 85} x2={rightCenterX} y2={Y.reviewDecision + 85}
              stroke={C.arrow} strokeWidth={2.5} />
            {/* Branch to left panel */}
            <line x1={leftCenterX} y1={Y.reviewDecision + 85} x2={leftCenterX} y2={Y.panels}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            {/* Branch to right panel */}
            <line x1={rightCenterX} y1={Y.reviewDecision + 85} x2={rightCenterX} y2={Y.panels}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            {/* Labels */}
            <rect x={leftCenterX - 62} y={Y.reviewDecision + 66} width={124} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={leftCenterX} y={Y.reviewDecision + 79} textAnchor="middle" fill={C.orange.tx} fontSize={11} fontWeight={700}>
              {"\uD83D\uDCCB"} Validate Data
            </text>
            <rect x={rightCenterX - 68} y={Y.reviewDecision + 66} width={136} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={rightCenterX} y={Y.reviewDecision + 79} textAnchor="middle" fill={C.orange.tx} fontSize={11} fontWeight={700}>
              {"\u270D"} Add External Demand
            </text>
          </g>
        );
      })()}

      {/* Left panel: Data Review */}
      <DataReviewPanel x={leftPanelX} y={Y.panels} w={panelW} />

      {/* Right panel: External Demand */}
      <ExternalDemandPanel x={rightPanelX} y={Y.panels} w={panelW} />

      {/* Fan-in: Both panels → Adjusted Base Demand */}
      {(() => {
        const leftCenterX = leftPanelX + panelW / 2;
        const rightCenterX = rightPanelX + panelW / 2;
        const panelBot = Y.panels + panelH;
        const mergeBarY = panelBot + 30;
        return (
          <g>
            <line x1={leftCenterX} y1={panelBot} x2={leftCenterX} y2={mergeBarY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightCenterX} y1={panelBot} x2={rightCenterX} y2={mergeBarY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCenterX} y1={mergeBarY} x2={rightCenterX} y2={mergeBarY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={mergeBarY} x2={CX} y2={Y.adjustedCalc}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            {/* "Recalculate if changed" label */}
            <rect x={CX - 80} y={mergeBarY + 8} width={160} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={CX} y={mergeBarY + 21} textAnchor="middle" fill={C.orange.tx} fontSize={10} fontWeight={700}>
              {"\uD83D\uDD04"} Recalculate if changed
            </text>
          </g>
        );
      })()}

      {/* Adjusted Base Demand */}
      <StepBadge x={nx - 30} y={Y.adjustedCalc + nh / 2} num={4} color={C.blue.bd} />
      <SysBox x={nx} y={Y.adjustedCalc} w={nw} h={nh}
        label="Adjusted Base Demand" sub="Recalculated with user edits + external demands"
        icon={"\uD83D\uDCC8"} badge="PROCESS" />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 3: THE POLICY ENGINE
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p3Band} h={620} label="PHASE 3: THE POLICY ENGINE — MANDATORY SELECTION" color={C.purple.bd} icon={"\uD83D\uDCDC"} />

      {/* Arrow: Adjusted → Policy Decision */}
      <Arrow x1={CX} y1={Y.adjustedCalc + nh} x2={CX} y2={Y.policyDecision - 55} />

      {/* Decision: Choose Calculation Standard */}
      <StepBadge x={CX - 225} y={Y.policyDecision} num={5} color={C.orange.bd} />
      <DecisionDiamond cx={CX} cy={Y.policyDecision} rxD={210} ryD={55}
        label="Choose Calculation Standard" sub="Mandatory: Select Policy" />

      {/* Fan-out to two policy cards */}
      <line x1={CX} y1={Y.policyDecision + 55} x2={CX} y2={Y.policyDecision + 95}
        stroke={C.arrow} strokeWidth={2.5} />
      {(() => {
        const leftCx = pX0 + pCardW / 2;
        const rightCx = pX0 + pCardW + pCardGap + pCardW / 2;
        return (
          <g>
            <line x1={leftCx} y1={Y.policyDecision + 95} x2={rightCx} y2={Y.policyDecision + 95}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={Y.policyDecision + 95} x2={leftCx} y2={Y.policyCards}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            <line x1={rightCx} y1={Y.policyDecision + 95} x2={rightCx} y2={Y.policyCards}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            {/* Path labels */}
            <rect x={leftCx - 50} y={Y.policyDecision + 77} width={100} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={leftCx} y={Y.policyDecision + 90} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={700}>Path A</text>
            <rect x={rightCx - 50} y={Y.policyDecision + 77} width={100} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={rightCx} y={Y.policyDecision + 90} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={700}>Path B</text>
          </g>
        );
      })()}

      {/* Policy Cards */}
      <PolicyCard x={pX0} y={Y.policyCards}
        title={"\uD83C\uDFE2 LODHA POLICY"}
        formula1="Total Pop \u00D7 165 LPCD"
        formula2="Total Pop \u00D7 45 LPCD"
        desc="Internal company standard \u2014 higher allocation"
        color={C.rose} />
      <PolicyCard x={pX0 + pCardW + pCardGap} y={Y.policyCards}
        title={"\uD83D\uDCD6 NBC 2016"}
        formula1="Total Pop \u00D7 135 LPCD"
        formula2="Total Pop \u00D7 45 LPCD"
        desc="National Building Code \u2014 government standard"
        color={C.cyan}
        isWarning={true} />

      {/* Fan-in from policy cards */}
      {(() => {
        const leftCx = pX0 + pCardW / 2;
        const rightCx = pX0 + pCardW + pCardGap + pCardW / 2;
        const policyCardH = 200;
        const warningH = 54;  // warning box height + gap
        const leftBot = Y.policyCards + policyCardH;
        const rightBot = Y.policyCards + policyCardH + warningH;
        const barY = Math.max(leftBot, rightBot) + 25;
        return (
          <g>
            <line x1={leftCx} y1={leftBot} x2={leftCx} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightCx} y1={rightBot} x2={rightCx} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={barY} x2={rightCx} y2={barY}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={barY} x2={CX} y2={Y.policyConverge}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
          </g>
        );
      })()}

      {/* Policy Converge */}
      <SysBox x={CX - 220} y={Y.policyConverge} w={440} h={64}
        label="Policy Applied" sub="LPCD values locked \u2192 proceed to calculation"
        badge="LOCKED" />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 4: CALCULATION & RESULTS
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p4Band} h={620} label="PHASE 4: CALCULATION & RESULTS" color={C.green.bd} icon={"\uD83E\uddEE"} />

      {/* Arrow: Policy Converge → Formula */}
      <Arrow x1={CX} y1={Y.policyConverge + 64} x2={CX} y2={Y.formulaBlock} />

      {/* Formula Block */}
      <StepBadge x={fmX - 30} y={Y.formulaBlock + 80} num={6} color={C.purple.bd} />
      <FormulaBlock x={fmX} y={Y.formulaBlock} w={fmW} />

      {/* Arrow: Formula → Calc Process */}
      <Arrow x1={CX} y1={Y.formulaBlock + 160} x2={CX} y2={Y.calcProcess} />

      {/* Calculate Final KLD */}
      <StepBadge x={nx - 30} y={Y.calcProcess + nh / 2} num={7} color={C.blue.bd} />
      <SysBox x={nx} y={Y.calcProcess} w={nw} h={nh}
        label="Calculate Final KLD" sub="Instant computation after policy selection"
        icon={"\u2699\uFE0F"} badge="PROCESS" />

      {/* DB fetch indicator */}
      <DbIcon x={nx + nw + 24} y={Y.calcProcess + 14} size={44} />
      <line x1={nx + nw} y1={Y.calcProcess + nh / 2} x2={nx + nw + 24} y2={Y.calcProcess + nh / 2 - 2}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />
      <text x={nx + nw + 80} y={Y.calcProcess + nh / 2 + 4} fill={C.blue.tx} fontSize={10} fontWeight={600}>
        Policy DB
      </text>

      {/* Arrow: Calc Process → Results */}
      <Arrow x1={CX} y1={Y.calcProcess + nh} x2={CX} y2={Y.resultsDash} />

      {/* Results Dashboard */}
      <StepBadge x={resDashX - 30} y={Y.resultsDash + 95} num={8} color={C.green.bd} />
      <ResultsDashboard x={resDashX} y={Y.resultsDash} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 5: EXPORT & FORMAT SELECTION
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p5Band} h={710} label="PHASE 5: EXPORT & FORMAT SELECTION" color={C.teal.bd} icon={"\uD83D\uDCE4"} />

      {/* Arrow: Results → Format Decision */}
      <Arrow x1={CX} y1={Y.resultsDash + 190} x2={CX} y2={Y.formatDecision - 55} />

      {/* Decision: Choose Output Report Format */}
      <StepBadge x={CX - 230} y={Y.formatDecision} num={9} color={C.orange.bd} />
      <DecisionDiamond cx={CX} cy={Y.formatDecision} rxD={220} ryD={55}
        label="Choose Output Report Format" sub="User selects download format" />

      {/* Fan-out to two export cards */}
      <line x1={CX} y1={Y.formatDecision + 55} x2={CX} y2={Y.formatDecision + 95}
        stroke={C.arrow} strokeWidth={2.5} />
      {(() => {
        const leftCx = eX0 + eCardW / 2;
        const rightCx = eX0 + eCardW + eCardGap + eCardW / 2;
        return (
          <g>
            <line x1={leftCx} y1={Y.formatDecision + 95} x2={rightCx} y2={Y.formatDecision + 95}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={Y.formatDecision + 95} x2={leftCx} y2={Y.exportCards}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            <line x1={rightCx} y1={Y.formatDecision + 95} x2={rightCx} y2={Y.exportCards}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#wda)" />
            {/* Labels */}
            <rect x={leftCx - 52} y={Y.formatDecision + 77} width={104} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={leftCx} y={Y.formatDecision + 90} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={700}>Option 1</text>
            <rect x={rightCx - 52} y={Y.formatDecision + 77} width={104} height={18} rx={4} fill="#fff" opacity={0.95} />
            <text x={rightCx} y={Y.formatDecision + 90} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={700}>Option 2</text>
          </g>
        );
      })()}

      {/* Export Cards */}
      <ExportCard x={eX0} y={Y.exportCards}
        title="MOEF FORMAT"
        icon={"\uD83C\uDF0D"}
        items={[
          "Environmental Clearance Report",
          "STP Inflow / Outflow Summary",
          "Water Balance Diagram",
          "Recycling % for Government Submittal",
          "Treated Water Reuse Breakdown",
        ]}
        color={C.teal}
        docIcon={"\uD83D\uDCC4"} />
      <ExportCard x={eX0 + eCardW + eCardGap} y={Y.exportCards}
        title="LODHA FORMAT"
        icon={"\uD83C\uDFE2"}
        items={[
          "Internal MEP Design Report",
          "Tank Sizing \u2014 Domestic & Flushing",
          "Basement & Terrace Tank Dimensions",
          "Pump Duty Points & Selection",
          "Construction-Ready BOQ Summary",
        ]}
        color={C.blue}
        docIcon={"\uD83D\uDCC4"} />

      {/* Fan-in from export cards */}
      {(() => {
        const leftCx = eX0 + eCardW / 2;
        const rightCx = eX0 + eCardW + eCardGap + eCardW / 2;
        const botY = Y.exportCards + 230;
        return (
          <g>
            <line x1={leftCx} y1={botY} x2={leftCx} y2={Y.exportConverge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightCx} y1={botY} x2={rightCx} y2={Y.exportConverge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftCx} y1={Y.exportConverge} x2={rightCx} y2={Y.exportConverge}
              stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.exportConverge} x2={CX} y2={Y.finalDone}
              stroke={C.green.bd} strokeWidth={2.5} markerEnd="url(#wda-green)" />
          </g>
        );
      })()}

      {/* FINAL: Report Generated */}
      <g>
        <rect x={CX - 200} y={Y.finalDone} width={400} height={70} rx={35}
          fill={C.green.bd} stroke="#34d399" strokeWidth={3} />
        <text x={CX} y={Y.finalDone + 30} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
          {"\uD83D\uDCE4"} REPORT GENERATED
        </text>
        <text x={CX} y={Y.finalDone + 52} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.85}>
          Water Demand Calculation Complete {"\u2192"} Download Ready
        </text>
      </g>

      {/* ═══════════════════════════════════════════════════════════════
          SIDE ANNOTATIONS — positioned to avoid all overlaps
      ═══════════════════════════════════════════════════════════════ */}

      {/* Auto-fetch DB note — far left, aligned with auto-fetch row */}
      <g>
        <rect x={40} y={Y.autoFetch - 5} width={200} height={50} rx={8}
          fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={50} y={Y.autoFetch + 14} fill={C.cyan.tx} fontSize={10} fontWeight={700}>
          {"\uD83D\uDDC3\uFE0F"} Master Matrix Database
        </text>
        <text x={50} y={Y.autoFetch + 30} fill={C.cyan.tx} fontSize={9} opacity={0.75}>
          Floors, Units, Typology, Occ,
        </text>
        <text x={50} y={Y.autoFetch + 42} fill={C.cyan.tx} fontSize={9} opacity={0.75}>
          Landscape, Cars, HVAC data
        </text>
        <line x1={240} y1={Y.autoFetch + 20} x2={nx} y2={Y.autoFetch + nh / 2}
          stroke={C.cyan.bd} strokeWidth={1.5} strokeDasharray="4,3" />
      </g>

      {/* Policy engine logic note — far left, below phase 3 band header */}
      <g>
        <rect x={40} y={Y.policyDecision - 30} width={220} height={65} rx={8}
          fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={50} y={Y.policyDecision - 12} fill={C.amber.tx} fontSize={10} fontWeight={700}>
          {"\uD83D\uDCA1"} POLICY ENGINE LOGIC
        </text>
        <text x={50} y={Y.policyDecision + 4} fill={C.amber.tx} fontSize={9} opacity={0.8}>
          Lodha: 165 LPCD domestic + 45 flush
        </text>
        <text x={50} y={Y.policyDecision + 18} fill={C.amber.tx} fontSize={9} opacity={0.8}>
          NBC: 135 LPCD domestic + 45 flush
        </text>
        <text x={50} y={Y.policyDecision + 32} fill={C.amber.tx} fontSize={9} opacity={0.8}>
          Selection is MANDATORY before calc
        </text>
      </g>

      {/* Formula reference note — far right, aligned with formula block */}
      <g>
        <rect x={fmX + fmW + 30} y={Y.formulaBlock + 10} width={190} height={80} rx={8}
          fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={fmX + fmW + 40} y={Y.formulaBlock + 30} fill={C.purple.tx} fontSize={10} fontWeight={700}>
          {"\uD83E\uddEE"} FORMULA REFERENCE
        </text>
        <text x={fmX + fmW + 40} y={Y.formulaBlock + 48} fill={C.purple.tx} fontSize={9} opacity={0.8}>
          Landscape: 5 L/sqm/day
        </text>
        <text x={fmX + fmW + 40} y={Y.formulaBlock + 62} fill={C.purple.tx} fontSize={9} opacity={0.8}>
          Car wash: 2.5 L/car/day
        </text>
        <text x={fmX + fmW + 40} y={Y.formulaBlock + 76} fill={C.purple.tx} fontSize={9} opacity={0.8}>
          HVAC: Auto from matrix
        </text>
        <line x1={fmX + fmW + 30} y1={Y.formulaBlock + 50} x2={fmX + fmW} y2={Y.formulaBlock + 80}
          stroke={C.purple.bd} strokeWidth={1.5} strokeDasharray="4,3" />
      </g>

      {/* Output logic note — far left, below export cards start */}
      <g>
        <rect x={40} y={Y.exportCards + 40} width={200} height={90} rx={8}
          fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={1.5} strokeDasharray="5,3" />
        <text x={50} y={Y.exportCards + 60} fill={C.teal.tx} fontSize={10} fontWeight={700}>
          {"\uD83D\uDCA1"} OUTPUT LOGIC
        </text>
        <text x={50} y={Y.exportCards + 78} fill={C.teal.tx} fontSize={9} opacity={0.8}>
          Same numbers, different view:
        </text>
        <text x={50} y={Y.exportCards + 92} fill={C.teal.tx} fontSize={9} opacity={0.8}>
          MOEF = Water Balance Diagram
        </text>
        <text x={50} y={Y.exportCards + 106} fill={C.teal.tx} fontSize={9} opacity={0.8}>
          Lodha = Tank Sizing Report
        </text>
        <text x={50} y={Y.exportCards + 120} fill={C.teal.tx} fontSize={9} opacity={0.8}>
          (Basement + Terrace dims)
        </text>
      </g>

      {/* Error handling note — far right, below export cards start */}
      <g>
        <rect x={eX0 + eTotalW + 30} y={Y.exportCards + 40} width={200} height={80} rx={8}
          fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
        <text x={eX0 + eTotalW + 40} y={Y.exportCards + 60} fill={C.rose.tx} fontSize={10} fontWeight={700}>
          {"\u26A0\uFE0F"} ERROR HANDLING
        </text>
        <text x={eX0 + eTotalW + 40} y={Y.exportCards + 78} fill={C.rose.tx} fontSize={9} opacity={0.8}>
          If NBC chosen for Lodha:
        </text>
        <text x={eX0 + eTotalW + 40} y={Y.exportCards + 92} fill={C.rose.tx} fontSize={9} opacity={0.8}>
          Warning badge triggers
        </text>
        <text x={eX0 + eTotalW + 40} y={Y.exportCards + 106} fill={C.rose.tx} fontSize={9} opacity={0.8}>
          {"\u2192"} Verify with Lead Eng.
        </text>
      </g>

      {/* ═══════════════════════════════════════════════════════════════
          COLOR LEGEND — bottom
      ═══════════════════════════════════════════════════════════════ */}
      <g>
        <rect x={CX - 390} y={H - 130} width={780} height={100} rx={14}
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
        <text x={CX} y={H - 102} textAnchor="middle" fill="#475569" fontSize={13} fontWeight={800}>
          VISUAL LEGEND
        </text>
        {[
          { label: "System Step", color: C.blue.bd, bg: C.blue.bg },
          { label: "User Decision", color: C.orange.bd, bg: C.orange.bg },
          { label: "Final Output", color: C.green.bd, bg: C.green.bg },
          { label: "Formula / Calc", color: C.purple.bd, bg: C.purple.bg },
          { label: "DB Fetch", color: C.cyan.bd, bg: C.cyan.bg },
          { label: "Warning", color: C.rose.bd, bg: C.rose.bg },
        ].map((item, i) => {
          const lx = CX - 360 + i * 124;
          return (
            <g key={i}>
              <rect x={lx} y={H - 80} width={112} height={34} rx={8}
                fill={item.bg} stroke={item.color} strokeWidth={2} />
              <text x={lx + 56} y={H - 58} textAnchor="middle"
                fill={item.color} fontSize={10} fontWeight={700}>{item.label}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
