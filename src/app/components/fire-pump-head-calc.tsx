import React from "react";

// =====================================================================
// FIRE PUMP HEAD CALCULATOR — Comprehensive 5-Phase SVG Flow Diagram
// Phase 1: Project Selection & Data Source Toggle (CFO NOC vs NBC)
// Phase 2: User Validation & Automated Extraction
// Phase 3: Policy Engine — NBC 2016 / UDCPR Tank Standards
// Phase 4: Calculation Engine — Hazen-Williams + Motor Power
// Phase 5: Floor-Wise Pump Set Output (MSMO vs End Suction) & Export
// =====================================================================

const W = 1560;
const H = 5600;
const CX = W / 2;

// Colors — Bold Blue for system, Orange for decisions, Bright Green for outputs
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
  fire:   { bg: "#fef2f2", bd: "#dc2626", tx: "#991b1b" },
  arrow:  "#94a3b8",
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

function StepBadge({ x, y, num, color }: { x: number; y: number; num: number | string; color: string }) {
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#fp-a)" />
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

function FormulaBox({ x, y, w, h, title, formula, note, color }: {
  x: number; y: number; w: number; h: number;
  title: string; formula: string; note: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill={color.bg} stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={w} height={42} rx={14} fill={color.bd} />
      <rect x={x} y={y + 28} width={w} height={14} fill={color.bd} />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>
        {title}
      </text>
      <rect x={x + 20} y={y + 54} width={w - 40} height={38} rx={8}
        fill="#fff" stroke={color.bd} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + 78} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>
        {formula}
      </text>
      <text x={x + w / 2} y={y + h - 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>
        {note}
      </text>
    </g>
  );
}

// =====================================================================
// DATA SOURCE TOGGLE
// =====================================================================
function DataSourceToggle({ x, y }: { x: number; y: number }) {
  const tw = 520, th = 100;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={40} rx={14} fill={C.orange.bd} />
      <rect x={x} y={y + 28} width={tw} height={12} fill={C.orange.bd} />
      <text x={x + tw / 2} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\uD83D\uDD00"} DATA SOURCE TOGGLE — Select Input Method
      </text>
      <rect x={x + 20} y={y + 52} width={230} height={36} rx={10}
        fill="#fff" stroke={C.orange.bd} strokeWidth={2} />
      <text x={x + 135} y={y + 74} textAnchor="middle" fill={C.orange.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCC4"} Upload CFO NOC
      </text>
      <rect x={x + 270} y={y + 52} width={230} height={36} rx={10}
        fill="#fff" stroke={C.orange.bd} strokeWidth={2} />
      <text x={x + 385} y={y + 74} textAnchor="middle" fill={C.orange.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDCD6"} Manual / NBC 2016 Fallback
      </text>
    </g>
  );
}

// =====================================================================
// NOC EXTRACTION PANEL
// =====================================================================
function NOCExtractionPanel({ x, y }: { x: number; y: number }) {
  const pw = 440, ph = 250;
  const fields = [
    { label: "Underground Tank Capacity", value: "Extracted", unit: "m\u00B3", icon: "\uD83D\uDEE2\uFE0F" },
    { label: "Overhead Tank Capacity", value: "Extracted", unit: "m\u00B3", icon: "\uD83D\uDDFC" },
    { label: "Fire Break Tank", value: "Extracted", unit: "m\u00B3", icon: "\uD83D\uDD25" },
    { label: "Pump Requirement Type", value: "Auto", unit: "-", icon: "\u2699\uFE0F" },
  ];
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.cyan.bd} />
      <rect x={x} y={y + 28} width={pw} height={14} fill={C.cyan.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\uD83D\uDCC4"} CFO NOC — Automated Extraction
      </text>
      <text x={x + pw / 2} y={y + 60} textAnchor="middle" fill={C.cyan.tx} fontSize={11} opacity={0.8}>
        System parses uploaded NOC document
      </text>
      {fields.map((f, i) => {
        const ry = y + 74 + i * 40;
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={pw - 28} height={32} rx={8}
              fill="#fff" stroke={C.cyan.bd} strokeWidth={1.2} />
            <text x={x + 42} y={ry + 21} fill={C.cyan.tx} fontSize={11} fontWeight={600}>
              {f.icon} {f.label}
            </text>
            <rect x={x + pw - 120} y={ry + 4} width={96} height={24} rx={6}
              fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={1} />
            <text x={x + pw - 72} y={ry + 20} textAnchor="middle"
              fill={C.cyan.bd} fontSize={10} fontWeight={700}>{f.value} {f.unit}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// NBC 2016 FALLBACK PANEL
// =====================================================================
function NBCFallbackPanel({ x, y }: { x: number; y: number }) {
  const pw = 440, ph = 250;
  const defaults = [
    { label: "Underground Tank (UGT)", value: "200", unit: "m\u00B3 / tower", icon: "\uD83D\uDEE2\uFE0F", note: "NBC Standard" },
    { label: "Overhead Tank (OHT)", value: "100", unit: "m\u00B3 / tower", icon: "\uD83D\uDDFC", note: "NBC Standard" },
    { label: "Fire Break Tank", value: "100", unit: "m\u00B3", icon: "\uD83D\uDD25", note: "Heights > 65m" },
  ];
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.amber.bd} />
      <rect x={x} y={y + 28} width={pw} height={14} fill={C.amber.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\uD83D\uDCD6"} NBC 2016 / UDCPR — Default Values
      </text>
      <text x={x + pw / 2} y={y + 60} textAnchor="middle" fill={C.amber.tx} fontSize={11} opacity={0.8}>
        Auto-populated when no NOC is provided
      </text>
      {defaults.map((d, i) => {
        const ry = y + 76 + i * 50;
        return (
          <g key={i}>
            <rect x={x + 14} y={ry} width={pw - 28} height={40} rx={8}
              fill="#fff" stroke={C.amber.bd} strokeWidth={1.5} />
            <text x={x + 42} y={ry + 18} fill={C.amber.tx} fontSize={12} fontWeight={700}>
              {d.icon} {d.label}
            </text>
            <text x={x + 42} y={ry + 33} fill={C.amber.tx} fontSize={10} opacity={0.65}>
              {d.note}
            </text>
            <rect x={x + pw - 140} y={ry + 6} width={116} height={28} rx={8}
              fill={C.amber.bd} opacity={0.15} />
            <text x={x + pw - 82} y={ry + 25} textAnchor="middle"
              fill={C.amber.bd} fontSize={13} fontWeight={800}>{d.value} {d.unit}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// TANKAGE SUMMARY (Left Panel)
// =====================================================================
function TankageSummary({ x, y }: { x: number; y: number }) {
  const pw = 360, ph = 280;
  const tanks = [
    { label: "Underground\nTank (UGT)", value: "200 m\u00B3", icon: "\uD83D\uDEE2\uFE0F", color: C.blue },
    { label: "Overhead\nTank (OHT)", value: "100 m\u00B3", icon: "\uD83D\uDDFC", color: C.teal },
    { label: "Fire Break\nTank (BPT)", value: "100 m\u00B3", icon: "\uD83D\uDD25", color: C.fire },
  ];
  const cardW = (pw - 50) / 3, cardH = 120;
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 28} width={pw} height={14} fill={C.blue.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\uD83D\uDEE2\uFE0F"} TANKAGE
      </text>
      <text x={x + pw / 2} y={y + 62} textAnchor="middle" fill={C.blue.tx} fontSize={11} fontWeight={600}>
        Fetched from NOC or NBC Defaults
      </text>
      {tanks.map((t, i) => {
        const tx = x + 14 + i * (cardW + 8);
        const ty = y + 80;
        return (
          <g key={i}>
            <rect x={tx} y={ty} width={cardW} height={cardH} rx={10}
              fill={t.color.bg} stroke={t.color.bd} strokeWidth={1.5} />
            <text x={tx + cardW / 2} y={ty + 26} textAnchor="middle" fontSize={22}>{t.icon}</text>
            {t.label.split("\n").map((line, li) => (
              <text key={li} x={tx + cardW / 2} y={ty + 46 + li * 14} textAnchor="middle"
                fill={t.color.tx} fontSize={10} fontWeight={600}>{line}</text>
            ))}
            <rect x={tx + 8} y={ty + cardH - 32} width={cardW - 16} height={22} rx={6}
              fill={t.color.bd} opacity={0.15} />
            <text x={tx + cardW / 2} y={ty + cardH - 16} textAnchor="middle"
              fill={t.color.bd} fontSize={12} fontWeight={800}>{t.value}</text>
          </g>
        );
      })}
      <text x={x + pw / 2} y={y + ph - 16} textAnchor="middle" fill={C.slate.tx} fontSize={10} opacity={0.6}>
        Per Tower Basis | NBC 2016 / UDCPR Standards
      </text>
    </g>
  );
}

// =====================================================================
// PUMP INPUT PANEL (Center Panel)
// =====================================================================
function PumpInputPanel({ x, y }: { x: number; y: number }) {
  const pw = 440, ph = 380;
  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={3} />
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.orange.bd} />
      <rect x={x} y={y + 28} width={pw} height={14} fill={C.orange.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\u2699\uFE0F"} PUMP INPUTS — User Configuration
      </text>
      <text x={x + 24} y={y + 66} fill={C.orange.tx} fontSize={12} fontWeight={700}>
        Select Pump Type
      </text>
      <rect x={x + 20} y={y + 74} width={pw - 40} height={36} rx={8}
        fill="#fff" stroke={C.orange.bd} strokeWidth={2} />
      <text x={x + 36} y={y + 97} fill={C.orange.tx} fontSize={12} fontWeight={600}>
        {"\u25BC"} Single Outlet (End Suction) | Multi-Outlet (MSMO)
      </text>
      <text x={x + 24} y={y + 130} fill={C.orange.tx} fontSize={12} fontWeight={700}>
        Pipe Diameter (D)
      </text>
      <rect x={x + 20} y={y + 138} width={pw - 40} height={36} rx={8}
        fill="#fff" stroke={C.orange.bd} strokeWidth={1.5} />
      <text x={x + 36} y={y + 161} fill={C.slate.tx} fontSize={11} fontWeight={500}>
        Enter diameter in mm (e.g. 100, 150)
      </text>
      <rect x={x + pw - 72} y={y + 142} width={44} height={28} rx={6}
        fill={C.orange.bd} opacity={0.15} />
      <text x={x + pw - 50} y={y + 160} textAnchor="middle" fill={C.orange.bd} fontSize={10} fontWeight={700}>mm</text>
      <text x={x + 24} y={y + 194} fill={C.orange.tx} fontSize={12} fontWeight={700}>
        Horizontal Length
      </text>
      <rect x={x + 20} y={y + 202} width={190} height={36} rx={8}
        fill="#fff" stroke={C.orange.bd} strokeWidth={1.5} />
      <text x={x + 36} y={y + 225} fill={C.slate.tx} fontSize={11} fontWeight={500}>Meters</text>
      <text x={x + 234} y={y + 194} fill={C.orange.tx} fontSize={12} fontWeight={700}>
        Vertical Length
      </text>
      <rect x={x + 230} y={y + 202} width={190} height={36} rx={8}
        fill="#fff" stroke={C.orange.bd} strokeWidth={1.5} />
      <text x={x + 246} y={y + 225} fill={C.slate.tx} fontSize={11} fontWeight={500}>Meters</text>
      <rect x={x + 20} y={y + 252} width={pw - 40} height={48} rx={10}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <text x={x + pw / 2} y={y + 272} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={700}>
        {"\u26A1"} Total Equiv. Length = (Horiz + Vert) {"\u00D7"} 1.25
      </text>
      <text x={x + pw / 2} y={y + 290} textAnchor="middle" fill={C.teal.tx} fontSize={10} opacity={0.7}>
        25% fittings allowance auto-applied
      </text>
      <rect x={x + 20} y={y + 312} width={pw - 40} height={54} rx={10}
        fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={1.5} strokeDasharray="6,3" />
      <text x={x + pw / 2} y={y + 332} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>
        {"\uD83D\uDCCB"} Reference Constants
      </text>
      <text x={x + pw / 2} y={y + 350} textAnchor="middle" fill={C.slate.tx} fontSize={10} opacity={0.75}>
        Q(Main)=2850 LPM | Q(Jockey)=180 LPM | Static=3.5 Bar | C=120
      </text>
    </g>
  );
}

// =====================================================================
// EFFICIENCY LOOKUP TABLE
// =====================================================================
function EfficiencyLookup({ x, y }: { x: number; y: number }) {
  const tw = 520, th = 200;
  const rows = [
    { type: "End Suction (Single Outlet)", head: "\u2264 130m", eff: "75%", color: C.blue },
    { type: "MSMO (Multi-Outlet)", head: "\u2264 210m", eff: "70%", color: C.amber },
  ];
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.purple.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={42} rx={14} fill={C.purple.bd} />
      <rect x={x} y={y + 28} width={tw} height={14} fill={C.purple.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"\uD83D\uDCCA"} EFFICIENCY LOOKUP TABLE
      </text>
      {["Pump Type", "Max Head", "Efficiency (\u03B7)"].map((h, i) => {
        const colW = i === 0 ? 240 : 140;
        const hx = x + (i === 0 ? 10 : i === 1 ? 254 : 398);
        return (
          <g key={i}>
            <rect x={hx} y={y + 52} width={colW - 8} height={30} rx={6}
              fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} />
            <text x={hx + (colW - 8) / 2} y={y + 72} textAnchor="middle"
              fill={C.purple.tx} fontSize={12} fontWeight={700}>{h}</text>
          </g>
        );
      })}
      {rows.map((r, i) => {
        const ry = y + 92 + i * 42;
        return (
          <g key={i}>
            <rect x={x + 10} y={ry} width={232} height={34} rx={6}
              fill={r.color.bg} stroke={r.color.bd} strokeWidth={1.2} />
            <text x={x + 126} y={ry + 22} textAnchor="middle"
              fill={r.color.tx} fontSize={11} fontWeight={600}>{r.type}</text>
            <rect x={x + 254} y={ry} width={132} height={34} rx={6}
              fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
            <text x={x + 320} y={ry + 22} textAnchor="middle"
              fill={C.slate.tx} fontSize={12} fontWeight={600}>{r.head}</text>
            <rect x={x + 398} y={ry} width={112} height={34} rx={6}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
            <text x={x + 454} y={ry + 22} textAnchor="middle"
              fill={C.green.bd} fontSize={14} fontWeight={800}>{r.eff}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// THREE-PANEL UI LAYOUT
// =====================================================================
function ThreePanelUI({ x, y }: { x: number; y: number }) {
  const totalW = 1200;
  const sx = x - totalW / 2;
  return (
    <g>
      <rect x={sx} y={y} width={totalW} height={48} rx={14} fill={C.fire.bd} />
      <text x={sx + totalW / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={800}>
        {"\uD83C\uDFD7\uFE0F"} PROJECT: [Project Name] — TOWER: [Tower Reference]
      </text>
      <TankageSummary x={sx} y={y + 60} />
      <PumpInputPanel x={sx + 380} y={y + 60} />
      {/* Right Panel: Live Results */}
      <g>
        <rect x={sx + 840} y={y + 60} width={360} height={380} rx={14}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
        <rect x={sx + 840} y={y + 60} width={360} height={42} rx={14} fill={C.green.bd} />
        <rect x={sx + 840} y={y + 88} width={360} height={14} fill={C.green.bd} />
        <text x={sx + 1020} y={y + 88} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
          {"\uD83D\uDCCA"} LIVE RESULTS
        </text>
        {[
          { label: "Pump Head", value: "XXX m", sub: "Static+Friction+35m", icon: "\u2B06\uFE0F" },
          { label: "Motor Rating", value: "XXX KW", sub: "(Q\u00D7H) / (367.2\u00D7\u03B7)", icon: "\u26A1" },
          { label: "Total Electrical Load", value: "XXX KW", sub: "Main + Jockey + Standby", icon: "\uD83D\uDD0C" },
          { label: "Friction Loss", value: "XXX m", sub: "Hazen-Williams (C=120)", icon: "\uD83D\uDCC9" },
        ].map((r, i) => {
          const ry = y + 116 + i * 78;
          return (
            <g key={i}>
              <rect x={sx + 856} y={ry} width={328} height={66} rx={10}
                fill="#fff" stroke={C.green.bd} strokeWidth={1.5} />
              <text x={sx + 880} y={ry + 22} fill={C.green.tx} fontSize={18}>{r.icon}</text>
              <text x={sx + 906} y={ry + 22} fill={C.green.tx} fontSize={12} fontWeight={700}>{r.label}</text>
              <text x={sx + 906} y={ry + 40} fill={C.green.tx} fontSize={10} opacity={0.65}>{r.sub}</text>
              <rect x={sx + 1076} y={ry + 8} width={96} height={28} rx={8}
                fill={C.green.bd} opacity={0.15} />
              <text x={sx + 1124} y={ry + 27} textAnchor="middle"
                fill={C.green.bd} fontSize={14} fontWeight={800}>{r.value}</text>
              <text x={sx + 906} y={ry + 58} fill={C.green.tx} fontSize={9} opacity={0.5}>
                {i === 0 ? "Real-time calculation" : i === 1 ? "Auto-rounded up" : i === 2 ? "Sum of all pumps" : "Per Hazen-Williams"}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

// =====================================================================
// FLOOR-WISE PUMP SET CARD — Reusable for each floor level
// =====================================================================
function FloorPumpCard({ x, y, floorLabel, floorIcon, floorColor, pumps, conditional }: {
  x: number; y: number;
  floorLabel: string; floorIcon: string;
  floorColor: { bg: string; bd: string; tx: string };
  pumps: { name: string; flow: string; head: string; kw: string; icon: string }[];
  conditional?: boolean;
}) {
  const pw = 660, rowH = 38;
  const headerH = 48;
  const tableHeaderH = 32;
  const ph = headerH + tableHeaderH + pumps.length * (rowH + 3) + 20 + (conditional ? 28 : 0);

  return (
    <g>
      <rect x={x} y={y} width={pw} height={ph} rx={14}
        fill="#f8fafc" stroke={floorColor.bd} strokeWidth={3} />
      {/* Floor header */}
      <rect x={x} y={y} width={pw} height={headerH} rx={14} fill={floorColor.bd} />
      <rect x={x} y={y + 34} width={pw} height={14} fill={floorColor.bd} />
      <text x={x + pw / 2} y={y + 30} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
        {floorIcon} {floorLabel}
      </text>
      {conditional && (
        <>
          <rect x={x + pw - 180} y={y + headerH + 4} width={170} height={22} rx={11}
            fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1.5} />
          <text x={x + pw - 95} y={y + headerH + 18} textAnchor="middle"
            fill={C.rose.tx} fontSize={10} fontWeight={700}>
            {"\u26A0\uFE0F"} Conditional (if applicable)
          </text>
        </>
      )}
      {/* Table header row */}
      {(() => {
        const cols = [
          { label: "Pump Name", w: 240 },
          { label: "Flow (LPM)", w: 110 },
          { label: "Head (m)", w: 110 },
          { label: "Motor (KW)", w: 110 },
          { label: "", w: 60 },
        ];
        let cx = x + 10;
        const thy = y + headerH + (conditional ? 28 : 4);
        return (
          <g>
            {cols.map((col, ci) => {
              const el = (
                <g key={ci}>
                  {col.label && (
                    <>
                      <rect x={cx} y={thy} width={col.w} height={tableHeaderH} rx={6}
                        fill={floorColor.bg} stroke={floorColor.bd} strokeWidth={1.5} />
                      <text x={cx + col.w / 2} y={thy + 21} textAnchor="middle"
                        fill={floorColor.tx} fontSize={11} fontWeight={700}>{col.label}</text>
                    </>
                  )}
                </g>
              );
              cx += col.w + 4;
              return el;
            })}
            {/* Data rows */}
            {pumps.map((p, pi) => {
              let rx = x + 10;
              const ry = thy + tableHeaderH + 6 + pi * (rowH + 3);
              const vals = [
                { text: `${p.icon} ${p.name}`, w: 240, bold: true },
                { text: p.flow, w: 110, bold: false },
                { text: p.head, w: 110, bold: false },
                { text: p.kw, w: 110, bold: true },
              ];
              return (
                <g key={pi}>
                  {vals.map((v, vi) => {
                    const el = (
                      <g key={vi}>
                        <rect x={rx} y={ry} width={v.w} height={rowH} rx={6}
                          fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
                        <text x={rx + (vi === 0 ? 12 : v.w / 2)} y={ry + 24}
                          textAnchor={vi === 0 ? "start" : "middle"}
                          fill={vi === 3 ? floorColor.bd : C.slate.tx}
                          fontSize={vi === 0 ? 11 : 12}
                          fontWeight={v.bold ? 700 : 500}>{v.text}</text>
                      </g>
                    );
                    rx += v.w + 4;
                    return el;
                  })}
                  {/* Status indicator */}
                  <rect x={rx} y={ry} width={56} height={rowH} rx={6}
                    fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
                  <text x={rx + 28} y={ry + 24} textAnchor="middle"
                    fill={C.green.bd} fontSize={11} fontWeight={700}>{"\u2705"}</text>
                </g>
              );
            })}
          </g>
        );
      })()}
    </g>
  );
}

// =====================================================================
// MSMO PUMP SET — Floor-wise output
// =====================================================================
function MSMOPumpOutput({ x, y }: { x: number; y: number }) {
  const pw = 680;
  // UGT Floor pump set
  const ugtPumps = [
    { name: "Main Hydrant Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\uD83D\uDE92" },
    { name: "Main Sprinkler Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\uD83D\uDCA6" },
    { name: "Hydrant Jockey Pump", flow: "180", head: "XXX", kw: "XXX", icon: "\uD83D\uDD27" },
    { name: "Sprinkler Jockey Pump", flow: "180", head: "XXX", kw: "XXX", icon: "\uD83D\uDD27" },
    { name: "Standby Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u267B\uFE0F" },
  ];
  const terracePumps = [
    { name: "Terrace Booster Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u2B06\uFE0F" },
  ];
  const fireBreakPumps = [
    { name: "Fire Break Booster Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\uD83D\uDD25" },
    { name: "Fire Break Jockey Pump", flow: "180", head: "XXX", kw: "XXX", icon: "\uD83D\uDD27" },
  ];

  const ugtH = 48 + 32 + 5 * 41 + 20;
  const terrH = 48 + 32 + 1 * 41 + 20;
  const fbH = 48 + 32 + 2 * 41 + 20 + 28;
  const gap = 20;

  return (
    <g>
      {/* MSMO Label */}
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.fire.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>
        {"\uD83D\uDE92"} MSMO (Multi-Outlet) — FLOOR-WISE PUMP SET
      </text>

      <FloorPumpCard x={x + 10} y={y + 54} floorLabel="UGT LEVEL — Underground Pump Room"
        floorIcon={"\uD83D\uDEE2\uFE0F"} floorColor={C.blue} pumps={ugtPumps} />

      <FloorPumpCard x={x + 10} y={y + 54 + ugtH + gap} floorLabel="TERRACE LEVEL — Booster Pump"
        floorIcon={"\uD83C\uDFD7\uFE0F"} floorColor={C.teal} pumps={terracePumps} />

      <FloorPumpCard x={x + 10} y={y + 54 + ugtH + gap + terrH + gap}
        floorLabel="FIRE BREAK FLOOR — (Height > 65m)"
        floorIcon={"\uD83D\uDD25"} floorColor={C.fire} pumps={fireBreakPumps} conditional />
    </g>
  );
}

// =====================================================================
// END SUCTION PUMP SET — Floor-wise output
// =====================================================================
function EndSuctionPumpOutput({ x, y }: { x: number; y: number }) {
  const pw = 680;
  const ugtPumps = [
    { name: "Electrical Main Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u26A1" },
    { name: "Diesel Standby Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u26FD" },
    { name: "Electrical Jockey Pump", flow: "180", head: "XXX", kw: "XXX", icon: "\uD83D\uDD27" },
    { name: "Electrical Standby Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u267B\uFE0F" },
  ];
  const terracePumps = [
    { name: "Terrace Booster Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\u2B06\uFE0F" },
  ];
  const fireBreakPumps = [
    { name: "Fire Break Booster Pump", flow: "2850", head: "XXX", kw: "XXX", icon: "\uD83D\uDD25" },
    { name: "Fire Break Jockey Pump", flow: "180", head: "XXX", kw: "XXX", icon: "\uD83D\uDD27" },
  ];

  const ugtH = 48 + 32 + 4 * 41 + 20;
  const terrH = 48 + 32 + 1 * 41 + 20;
  const fbH = 48 + 32 + 2 * 41 + 20 + 28;
  const gap = 20;

  return (
    <g>
      {/* End Suction Label */}
      <rect x={x} y={y} width={pw} height={42} rx={14} fill={C.amber.bd} />
      <text x={x + pw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>
        {"\u26A1"} END SUCTION (Single Outlet) — FLOOR-WISE PUMP SET
      </text>

      <FloorPumpCard x={x + 10} y={y + 54} floorLabel="UGT LEVEL — Underground Pump Room"
        floorIcon={"\uD83D\uDEE2\uFE0F"} floorColor={C.blue} pumps={ugtPumps} />

      <FloorPumpCard x={x + 10} y={y + 54 + ugtH + gap} floorLabel="TERRACE LEVEL — Booster Pump"
        floorIcon={"\uD83C\uDFD7\uFE0F"} floorColor={C.teal} pumps={terracePumps} />

      <FloorPumpCard x={x + 10} y={y + 54 + ugtH + gap + terrH + gap}
        floorLabel="FIRE BREAK FLOOR — (Height > 65m)"
        floorIcon={"\uD83D\uDD25"} floorColor={C.fire} pumps={fireBreakPumps} conditional />
    </g>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function FirePumpHeadCalcSVG() {
  const Y = {
    // Phase 1
    p1Start: 60,
    entry: 80,
    projectFetch: 180,
    towerSelect: 280,
    dataSource: 380,
    // Phase 2
    p2Start: 520,
    decision: 560,
    nocPanel: 680,
    nbcPanel: 680,
    merge: 970,
    validationReview: 1060,
    // Phase 3
    p3Start: 1210,
    policyEngine: 1240,
    threePanel: 1350,
    // Phase 4
    p4Start: 1830,
    calcEngine: 1860,
    equivLengthFormula: 1970,
    frictionFormula: 2120,
    pumpHeadFormula: 2290,
    efficiencyTable: 2450,
    motorFormula: 2700,
    safetyCheck: 2870,
    // Phase 5 — Floor-wise pump set output
    p5Start: 3030,
    pumpTypeDiamond: 3090,
    msmoOutput: 3240,
    endSuctionOutput: 3240,
    summaryMerge: 4120,
    totalLoadDash: 4200,
    exportNode: 4440,
    finalEnd: 4560,
  };

  const nw = 500, nh = 76;
  const nx = CX - nw / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="fp-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="fp-red" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.fire.bd} />
        </marker>
        <marker id="fp-green" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
      </defs>

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 1: PROJECT SELECTION & DATA SOURCE
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p1Start} h={440} label="PHASE 1 — PROJECT SELECTION & DATA SOURCE TOGGLE" color={C.fire.bd} icon={"\uD83C\uDFD7\uFE0F"} />

      <StepBadge x={nx - 28} y={Y.entry + nh / 2} num={1} color={C.fire.bd} />
      <SysBox x={nx} y={Y.entry} w={nw} h={nh}
        label="Fire Pump Head Calculation" sub="Hydrant & Sprinkler System \u2014 NBC / CFO NOC Compliance"
        icon={"\uD83D\uDE92"} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.projectFetch} />

      <SysBox x={nx} y={Y.projectFetch} w={nw} h={nh}
        label="Auto-Fetch Project & Tower Data" sub="Pull project name, tower reference, building height from DB"
        icon={"\uD83D\uDDC3\uFE0F"} badge="DATABASE" />
      <Arrow x1={CX} y1={Y.projectFetch + nh} x2={CX} y2={Y.towerSelect} />

      <g>
        <rect x={nx} y={Y.towerSelect} width={nw} height={nh} rx={14}
          fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={3} />
        <rect x={nx + nw - 110} y={Y.towerSelect + 8} width={96} height={24} rx={12} fill={C.orange.bd} />
        <text x={nx + nw - 62} y={Y.towerSelect + 24} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>USER INPUT</text>
        <text x={CX} y={Y.towerSelect + nh / 2 - 6} textAnchor="middle" fill={C.orange.tx} fontSize={16} fontWeight={700}>
          Select Tower / Building Block
        </text>
        <text x={CX} y={Y.towerSelect + nh / 2 + 14} textAnchor="middle" fill={C.orange.tx} fontSize={12} opacity={0.7}>
          Dropdown: Tower A, Tower B, Podium, etc.
        </text>
      </g>
      <Arrow x1={CX} y1={Y.towerSelect + nh} x2={CX} y2={Y.dataSource} />

      <DataSourceToggle x={CX - 260} y={Y.dataSource} />
      <Arrow x1={CX} y1={Y.dataSource + 100} x2={CX} y2={Y.p2Start} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 2: USER VALIDATION & AUTOMATED EXTRACTION
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p2Start} h={660} label="PHASE 2 \u2014 USER VALIDATION & DATA EXTRACTION" color={C.orange.bd} icon={"\u270D\uFE0F"} />

      <DecisionDiamond cx={CX} cy={Y.decision + 50} rxD={160} ryD={48}
        label="CFO NOC Uploaded?" sub="Check data source selection" />

      <Arrow x1={CX - 160} y1={Y.decision + 50} x2={CX - 320} y2={Y.nocPanel} label="YES" color={C.cyan.bd} />
      <NOCExtractionPanel x={CX - 540} y={Y.nocPanel} />

      <Arrow x1={CX + 160} y1={Y.decision + 50} x2={CX + 320} y2={Y.nbcPanel} label="NO" color={C.amber.bd} />
      <NBCFallbackPanel x={CX + 100} y={Y.nbcPanel} />

      <Arrow x1={CX - 320} y1={Y.nocPanel + 250} x2={CX} y2={Y.merge} color={C.cyan.bd} />
      <Arrow x1={CX + 320} y1={Y.nbcPanel + 250} x2={CX} y2={Y.merge} color={C.amber.bd} />

      <SysBox x={nx} y={Y.merge} w={nw} h={nh}
        label="Merge: Tank Capacities Confirmed" sub="UGT, OHT, Fire Break Tank values locked for calculation"
        icon={"\u2705"} badge="MERGED" />
      <Arrow x1={CX} y1={Y.merge + nh} x2={CX} y2={Y.validationReview} />

      <g>
        <rect x={nx - 40} y={Y.validationReview} width={nw + 80} height={120} rx={14}
          fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2.5} strokeDasharray="8,5" />
        <text x={CX} y={Y.validationReview + 24} textAnchor="middle"
          fill={C.orange.tx} fontSize={14} fontWeight={700}>
          {"\uD83D\uDCCB"} USER VALIDATION CHECKLIST
        </text>
        {[
          "\u2611 Tank capacities match NOC / NBC requirements",
          "\u2611 Building height & tower reference correct",
          "\u2611 Pump duty flow requirements confirmed (2850 LPM main)",
          "\u2611 Override values if special conditions apply",
        ].map((item, i) => (
          <text key={i} x={CX - 220} y={Y.validationReview + 48 + i * 20}
            fill={C.orange.tx} fontSize={11} fontWeight={500}>{item}</text>
        ))}
      </g>
      <Arrow x1={CX} y1={Y.validationReview + 120} x2={CX} y2={Y.p3Start} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 3: POLICY ENGINE — THREE-PANEL UI LAYOUT
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p3Start} h={580} label="PHASE 3 \u2014 POLICY ENGINE & UI LAYOUT (NBC / UDCPR STANDARDS)" color={C.blue.bd} icon={"\uD83D\uDCDC"} />

      <StepBadge x={nx - 28} y={Y.policyEngine + nh / 2} num={3} color={C.blue.bd} />
      <SysBox x={nx} y={Y.policyEngine} w={nw} h={nh}
        label="Apply NBC 2016 / UDCPR Fire Standards" sub="Load policy rules for tank sizing, pump selection, and pipe constants"
        icon={"\uD83D\uDCDC"} badge="POLICY" />
      <Arrow x1={CX} y1={Y.policyEngine + nh} x2={CX} y2={Y.threePanel} />

      <ThreePanelUI x={CX} y={Y.threePanel} />
      <Arrow x1={CX} y1={Y.threePanel + 460} x2={CX} y2={Y.p4Start} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 4: CALCULATION ENGINE — HAZEN-WILLIAMS + MOTOR POWER
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p4Start} h={1170} label="PHASE 4 \u2014 CALCULATION ENGINE (HAZEN-WILLIAMS + MOTOR POWER)" color={C.purple.bd} icon={"\uD83E\uddEE"} />

      <StepBadge x={nx - 28} y={Y.calcEngine + nh / 2} num={4} color={C.purple.bd} />
      <SysBox x={nx} y={Y.calcEngine} w={nw} h={nh}
        label="Friction Loss Calculation Engine" sub="Hazen-Williams Method \u2014 C=120 for MS/GI Pipes"
        icon={"\u2699\uFE0F"} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.calcEngine + nh} x2={CX} y2={Y.equivLengthFormula} />

      <FormulaBox x={CX - 400} y={Y.equivLengthFormula} w={800} h={110}
        title={"\uD83D\uDCCF STEP 4A: TOTAL EQUIVALENT LENGTH"}
        formula="L_equiv = (Horizontal Length + Vertical Length) \u00D7 1.25"
        note="25% fittings allowance applied (Gate Valves, Elbows, Check Valves, Tees)"
        color={C.amber} />

      <g>
        <rect x={CX + 420} y={Y.equivLengthFormula + 10} width={260} height={90} rx={12}
          fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} strokeDasharray="6,3" />
        <text x={CX + 550} y={Y.equivLengthFormula + 30} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>
          {"\uD83D\uDD27"} Fittings Equivalent
        </text>
        <text x={CX + 550} y={Y.equivLengthFormula + 48} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
          Gate Valve: 0.5m | Elbow: 1.2m
        </text>
        <text x={CX + 550} y={Y.equivLengthFormula + 63} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
          Check Valve: 3.5m | Tee: 2.0m
        </text>
        <text x={CX + 550} y={Y.equivLengthFormula + 80} textAnchor="middle" fill={C.slate.tx} fontSize={9} opacity={0.65}>
          25% lump-sum per NBC fire norms
        </text>
        <line x1={CX + 400} y1={Y.equivLengthFormula + 55} x2={CX + 420} y2={Y.equivLengthFormula + 55}
          stroke={C.slate.bd} strokeWidth={2} strokeDasharray="5,3" />
      </g>

      <Arrow x1={CX} y1={Y.equivLengthFormula + 110} x2={CX} y2={Y.frictionFormula} />

      <FormulaBox x={CX - 400} y={Y.frictionFormula} w={800} h={130}
        title={"\uD83D\uDD25 STEP 4B: HAZEN-WILLIAMS FRICTION LOSS"}
        formula="h_f = 10.67 \u00D7 L \u00D7 Q\u00B9\u22C5\u2078\u2075 / (C\u00B9\u22C5\u2078\u2075 \u00D7 d\u2074\u22C5\u2078\u2077)"
        note="L=Equiv Length(m) | Q=Flow(m\u00B3/s) | C=120(MS Pipes) | d=Internal Dia(m)"
        color={C.purple} />

      <rect x={CX - 340} y={Y.frictionFormula + 132} width={680} height={38} rx={8}
        fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={2} />
      <text x={CX} y={Y.frictionFormula + 156} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
        {"\uD83D\uDD25"} Hazen-Williams C = 120 for MS/GI Pipes | Q(Main) = 2850 LPM = 0.0475 m{"\u00B3"}/s
      </text>

      <Arrow x1={CX} y1={Y.frictionFormula + 172} x2={CX} y2={Y.pumpHeadFormula} />

      <FormulaBox x={CX - 400} y={Y.pumpHeadFormula} w={800} h={120}
        title={"\u2B06\uFE0F STEP 4C: TOTAL PUMP HEAD SUMMATION"}
        formula="H_pump = Min. Discharge Pressure (35m) + Vertical Head + Friction Loss (h_f)"
        note="Minimum discharge pressure = 3.5 Bar = 35 meters as per NBC fire norms"
        color={C.teal} />

      <g>
        <rect x={CX + 420} y={Y.pumpHeadFormula + 10} width={240} height={80} rx={10}
          fill={C.fire.bg} stroke={C.fire.bd} strokeWidth={2} strokeDasharray="6,3" />
        <text x={CX + 540} y={Y.pumpHeadFormula + 32} textAnchor="middle" fill={C.fire.tx} fontSize={12} fontWeight={700}>
          {"\uD83D\uDD25"} NBC Requirement
        </text>
        <text x={CX + 540} y={Y.pumpHeadFormula + 50} textAnchor="middle" fill={C.fire.tx} fontSize={11} fontWeight={600}>
          Static Pressure = 3.5 Bar
        </text>
        <text x={CX + 540} y={Y.pumpHeadFormula + 68} textAnchor="middle" fill={C.fire.tx} fontSize={10} opacity={0.7}>
          = 35 meters minimum
        </text>
        <line x1={CX + 400} y1={Y.pumpHeadFormula + 50} x2={CX + 420} y2={Y.pumpHeadFormula + 50}
          stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />
      </g>

      <Arrow x1={CX} y1={Y.pumpHeadFormula + 120} x2={CX} y2={Y.efficiencyTable} />

      <StepBadge x={CX - 288} y={Y.efficiencyTable + 100} num="4.1" color={C.purple.bd} />
      <EfficiencyLookup x={CX - 260} y={Y.efficiencyTable} />

      <g>
        <rect x={CX + 280} y={Y.efficiencyTable} width={320} height={200} rx={14}
          fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2.5} strokeDasharray="8,5" />
        <text x={CX + 440} y={Y.efficiencyTable + 24} textAnchor="middle"
          fill={C.orange.tx} fontSize={13} fontWeight={700}>
          {"\u2699\uFE0F"} EFFICIENCY DECISION LOGIC
        </text>
        {[
          "IF Pump = End Suction",
          "  AND Head \u2264 130m",
          "  THEN \u03B7 = 75%",
          "",
          "IF Pump = MSMO",
          "  AND Head \u2264 210m",
          "  THEN \u03B7 = 70%",
          "",
          "ELSE: Manual override required",
        ].map((line, i) => (
          <text key={i} x={CX + 300} y={Y.efficiencyTable + 48 + i * 17}
            fill={C.orange.tx} fontSize={11} fontWeight={line.startsWith("  THEN") ? 700 : 500}>
            {line}
          </text>
        ))}
        <line x1={CX + 260} y1={Y.efficiencyTable + 100} x2={CX + 280} y2={Y.efficiencyTable + 100}
          stroke={C.orange.bd} strokeWidth={2} strokeDasharray="5,3" />
      </g>

      <Arrow x1={CX} y1={Y.efficiencyTable + 200} x2={CX} y2={Y.motorFormula} />

      <FormulaBox x={CX - 400} y={Y.motorFormula} w={800} h={130}
        title={"\u26A1 STEP 4D: MOTOR POWER CALCULATION"}
        formula="Motor Power (KW) = (Q \u00D7 H) / (367.2 \u00D7 \u03B7)"
        note="Q = Flow in LPM | H = Total Pump Head in meters | \u03B7 = Pump Efficiency (0.70 or 0.75)"
        color={C.amber} />

      <g>
        <rect x={CX + 420} y={Y.motorFormula + 10} width={260} height={90} rx={12}
          fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} strokeDasharray="6,3" />
        <text x={CX + 550} y={Y.motorFormula + 32} textAnchor="middle" fill={C.cyan.tx} fontSize={11} fontWeight={700}>
          {"\uD83D\uDCA7"} Flow Reference (NBC)
        </text>
        <text x={CX + 550} y={Y.motorFormula + 52} textAnchor="middle" fill={C.cyan.tx} fontSize={10}>
          Main Pump: Q = 2850 LPM
        </text>
        <text x={CX + 550} y={Y.motorFormula + 68} textAnchor="middle" fill={C.cyan.tx} fontSize={10}>
          Jockey Pump: Q = 180 LPM
        </text>
        <text x={CX + 550} y={Y.motorFormula + 84} textAnchor="middle" fill={C.cyan.tx} fontSize={9} opacity={0.65}>
          As per NBC 2016 / Fire Authority
        </text>
        <line x1={CX + 400} y1={Y.motorFormula + 55} x2={CX + 420} y2={Y.motorFormula + 55}
          stroke={C.cyan.bd} strokeWidth={2} strokeDasharray="5,3" />
      </g>

      <Arrow x1={CX} y1={Y.motorFormula + 130} x2={CX} y2={Y.safetyCheck} />

      <g>
        <rect x={nx - 40} y={Y.safetyCheck} width={nw + 80} height={100} rx={14}
          fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={3} />
        <rect x={nx - 40} y={Y.safetyCheck} width={nw + 80} height={42} rx={14} fill={C.rose.bd} />
        <rect x={nx - 40} y={Y.safetyCheck + 28} width={nw + 80} height={14} fill={C.rose.bd} />
        <text x={CX} y={Y.safetyCheck + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>
          {"\u26A0\uFE0F"} SAFETY & COMPLIANCE CHECK
        </text>
        <text x={CX} y={Y.safetyCheck + 60} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={600}>
          {"\u2611"} Pump head within manufacturer range | {"\u2611"} Motor KW rounded to next standard size
        </text>
        <text x={CX} y={Y.safetyCheck + 80} textAnchor="middle" fill={C.rose.tx} fontSize={11} opacity={0.75}>
          {"\u2611"} Efficiency matches pump type | {"\u2611"} Flow rate meets NBC minimum requirement
        </text>
      </g>

      <Arrow x1={CX} y1={Y.safetyCheck + 100} x2={CX} y2={Y.p5Start} />

      {/* ═══════════════════════════════════════════════════════════════
          PHASE 5: FLOOR-WISE PUMP SET OUTPUT & EXPORT
      ═══════════════════════════════════════════════════════════════ */}
      <PhaseBand y={Y.p5Start} h={1530} label="PHASE 5 \u2014 FLOOR-WISE PUMP SET OUTPUT (MSMO vs END SUCTION) & EXPORT" color={C.green.bd} icon={"\uD83D\uDE92"} />

      <StepBadge x={nx - 28} y={Y.pumpTypeDiamond + 50} num={5} color={C.green.bd} />

      {/* Pump Type Decision Diamond */}
      <DecisionDiamond cx={CX} cy={Y.pumpTypeDiamond + 50} rxD={180} ryD={50}
        label="Pump Type Selected?" sub="MSMO or End Suction" />

      {/* Left: MSMO branch */}
      <Arrow x1={CX - 180} y1={Y.pumpTypeDiamond + 50} x2={CX - 370} y2={Y.msmoOutput} label="MSMO" color={C.fire.bd} />
      <MSMOPumpOutput x={CX - 710} y={Y.msmoOutput} />

      {/* Right: End Suction branch */}
      <Arrow x1={CX + 180} y1={Y.pumpTypeDiamond + 50} x2={CX + 370} y2={Y.endSuctionOutput} label="END SUCTION" color={C.amber.bd} />
      <EndSuctionPumpOutput x={CX + 30} y={Y.endSuctionOutput} />

      {/* Merge arrows down */}
      <Arrow x1={CX - 370} y1={Y.msmoOutput + 830} x2={CX} y2={Y.summaryMerge} color={C.fire.bd} />
      <Arrow x1={CX + 370} y1={Y.endSuctionOutput + 780} x2={CX} y2={Y.summaryMerge} color={C.amber.bd} />

      {/* Summary merge node */}
      <SysBox x={nx} y={Y.summaryMerge} w={nw} h={nh}
        label="Merge: All Pump Sets Compiled" sub="UGT + Terrace + Fire Break (if applicable) \u2014 Combined Output"
        icon={"\u2705"} badge="COMPILED" />
      <Arrow x1={CX} y1={Y.summaryMerge + nh} x2={CX} y2={Y.totalLoadDash} />

      {/* ─── TOTAL ELECTRICAL LOAD SUMMARY ─── */}
      <g>
        {(() => {
          const dx = CX - 480, dw = 960, dh = 200;
          const metrics = [
            { label: "Main Pump\nTotal KW", value: "XXX KW", icon: "\uD83D\uDE92", color: C.fire, sub: "Hydrant + Sprinkler" },
            { label: "Jockey Pump\nTotal KW", value: "XXX KW", icon: "\uD83D\uDD27", color: C.blue, sub: "Hydrant + Sprinkler" },
            { label: "Booster\nPump KW", value: "XXX KW", icon: "\u2B06\uFE0F", color: C.teal, sub: "Terrace + Fire Break" },
            { label: "Standby\nPump KW", value: "XXX KW", icon: "\u267B\uFE0F", color: C.amber, sub: "Backup capacity" },
            { label: "Grand Total\nElec. Load", value: "XXX KW", icon: "\uD83D\uDD0C", color: C.green, sub: "All pumps combined" },
          ];
          const cardW = (dw - 100) / 5, cardH = 110;
          return (
            <g>
              <rect x={dx} y={Y.totalLoadDash} width={dw} height={dh} rx={16}
                fill="#f0fdf4" stroke={C.green.bd} strokeWidth={3} />
              <rect x={dx} y={Y.totalLoadDash} width={dw} height={44} rx={16} fill={C.green.bd} />
              <rect x={dx} y={Y.totalLoadDash + 30} width={dw} height={14} fill={C.green.bd} />
              <text x={dx + dw / 2} y={Y.totalLoadDash + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
                {"\uD83D\uDD0C"} TOTAL ELECTRICAL LOAD SUMMARY — All Pump Sets
              </text>
              {metrics.map((m, i) => {
                const cx = dx + 16 + i * (cardW + 12);
                const cy = Y.totalLoadDash + 56;
                return (
                  <g key={i}>
                    <rect x={cx} y={cy} width={cardW} height={cardH} rx={12}
                      fill="#fff" stroke={m.color.bd} strokeWidth={2} />
                    <text x={cx + cardW / 2} y={cy + 22} textAnchor="middle" fontSize={20}>{m.icon}</text>
                    {m.label.split("\n").map((line, li) => (
                      <text key={li} x={cx + cardW / 2} y={cy + 40 + li * 13} textAnchor="middle"
                        fill={m.color.tx} fontSize={10} fontWeight={600}>{line}</text>
                    ))}
                    <rect x={cx + 8} y={cy + cardH - 36} width={cardW - 16} height={22} rx={6}
                      fill={m.color.bd} opacity={0.15} />
                    <text x={cx + cardW / 2} y={cy + cardH - 20} textAnchor="middle"
                      fill={m.color.bd} fontSize={13} fontWeight={800}>{m.value}</text>
                    <text x={cx + cardW / 2} y={cy + cardH - 4} textAnchor="middle"
                      fill={m.color.tx} fontSize={8} opacity={0.6}>{m.sub}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}
      </g>
      <Arrow x1={CX} y1={Y.totalLoadDash + 200} x2={CX} y2={Y.exportNode} />

      {/* Export Node */}
      <OutputBox x={nx - 60} y={Y.exportNode} w={nw + 120} h={nh}
        label="Export: PDF Report + Excel Pump Schedule" sub="Floor-wise pump schedule, motor specs, pipe sizing \u2014 engineer handoff"
        icon={"\uD83D\uDCE4"} />

      <g>
        <rect x={CX + 330} y={Y.exportNode - 10} width={260} height={96} rx={12}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} strokeDasharray="6,3" />
        <text x={CX + 460} y={Y.exportNode + 14} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
          {"\uD83D\uDCC1"} Export Formats
        </text>
        {[
          "\u2705 PDF Summary (Lodha Style)",
          "\u2705 Excel Floor-wise Pump Schedule",
          "\u2705 PNG Flowchart (3\u00D7 HD)",
        ].map((fmt, i) => (
          <text key={i} x={CX + 360} y={Y.exportNode + 38 + i * 20}
            fill={C.green.tx} fontSize={11} fontWeight={500}>{fmt}</text>
        ))}
        <line x1={CX + 310} y1={Y.exportNode + 38} x2={CX + 330} y2={Y.exportNode + 38}
          stroke={C.green.bd} strokeWidth={2} strokeDasharray="5,3" />
      </g>

      <Arrow x1={CX} y1={Y.exportNode + nh} x2={CX} y2={Y.finalEnd} />

      {/* Final End */}
      <g>
        <rect x={CX - 180} y={Y.finalEnd} width={360} height={56} rx={28}
          fill={C.green.bd} stroke={C.green.bd} strokeWidth={3} />
        <text x={CX} y={Y.finalEnd + 34} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={800}>
          {"\u2705"} FIRE PUMP CALCULATION COMPLETE
        </text>
      </g>
    </svg>
  );
}
