import React from "react";

// =====================================================================
// DD_PIP — TRANSFER PIPE SIZING CALCULATION (Hunter's Method)
// Full 16-step workflow:
//   STAGE 1 — Input & Definition (Steps 1–4)
//     1. Start → 2. Building Profile → 3. Fixture Count per Toilet Type
//     → 4. Assign Fixture Units (WSFU/DFU from DB)
//   STAGE 2 — The Riser Logic (Steps 5–8)
//     5. Loop Init (Floor N, Top→Bottom) → 6. Sum WSFU for Floor
//     → 7. Cumulative Main Riser FU → 8. Combined Hot/Cold Decision (×1.4)
//   STAGE 3 — Flow Conversion (Steps 9–10)
//     9. Hunter's Curve DB Lookup → 10. GPM Result
//   STAGE 4 — Final Sizing Decision (Steps 11–12)
//     11. GPM Threshold Decision → 12. Pipe Diameter Assignment
//   STAGE 5 — Output Details (Steps 13–16)
//     13. Final Pipe Schedule → 14. Velocity & Pressure Check
//     → 15. Vent Pipe Diameters → 16. End
// =====================================================================

const W = 1600;
const H = 5100;
const CX = W / 2;

// ── Color Palette (consistent with cable-sizing-calc) ──
const C = {
  blue:   { bg: "#dbeafe", bd: "#3b82f6", tx: "#1e40af" },
  green:  { bg: "#d1fae5", bd: "#10b981", tx: "#065f46" },
  purple: { bg: "#ede9fe", bd: "#8b5cf6", tx: "#5b21b6" },
  amber:  { bg: "#fef3c7", bd: "#f59e0b", tx: "#92400e" },
  rose:   { bg: "#ffe4e6", bd: "#f43f5e", tx: "#9f1239" },
  cyan:   { bg: "#cffafe", bd: "#06b6d4", tx: "#155e75" },
  teal:   { bg: "#ccfbf1", bd: "#14b8a6", tx: "#134e4a" },
  orange: { bg: "#fed7aa", bd: "#f97316", tx: "#9a3412" },
  slate:  { bg: "#f1f5f9", bd: "#64748b", tx: "#334155" },
  arrow:  "#94a3b8",
  reject: "#ef4444",
};

// ── Box geometry ──
const BX = CX - 200;
const BW = 400;
const BH = 70;

// ── Reusable Primitives ──

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

function Box({ x, y, w, h, label, sub, color, badge, rx: rxP }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string; rx?: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rxP ?? 12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {badge && (
        <>
          <rect x={x + w - 100} y={y + 6} width={90} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 55} y={y + 20} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>{sub}</text>
    </g>
  );
}

function Oval({ cx, cy, w, h, label, sub, color }: {
  cx: number; cy: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2}
        fill={color.bg} stroke={color.bd} strokeWidth={3} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.75}>{sub}</text>
    </g>
  );
}

function Parallelogram({ x, y, w, h, label, sub, color, badge }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string;
}) {
  const skew = 20;
  const pts = `${x + skew},${y} ${x + w},${y} ${x + w - skew},${y + h} ${x},${y + h}`;
  const cx = x + w / 2;
  return (
    <g>
      <polygon points={pts} fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {badge && (
        <>
          <rect x={x + w - 110} y={y + 6} width={90} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 65} y={y + 20} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>{sub}</text>
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
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color.tx} fontSize={13} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color.tx} fontSize={10.5} opacity={0.8}>{sub}</text>
    </g>
  );
}

function Cylinder({ x, y, w, h, label, sub, color, badge }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string;
}) {
  const ellH = 14;
  const cx = x + w / 2;
  return (
    <g>
      <path
        d={`M${x},${y + ellH} L${x},${y + h - ellH} Q${x},${y + h} ${cx},${y + h} Q${x + w},${y + h} ${x + w},${y + h - ellH} L${x + w},${y + ellH}`}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5}
      />
      <ellipse cx={cx} cy={y + ellH} rx={w / 2} ry={ellH}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      <ellipse cx={cx} cy={y + ellH} rx={w / 2 - 4} ry={ellH - 3}
        fill="none" stroke={color.bd} strokeWidth={0.8} opacity={0.3} />
      {badge && (
        <>
          <rect x={x + w - 110} y={y + ellH + 8} width={90} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 65} y={y + ellH + 22} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 + ellH / 2 - 4} textAnchor="middle" fill={color.tx} fontSize={14} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + ellH / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>{sub}</text>
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#psc-arrow)" />
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

// Fixture unit table
function FUTable({ x, y, w }: { x: number; y: number; w: number }) {
  const hdrH = 36;
  const rowH = 30;
  const rows = [
    { fixture: "Wash Basin",     wsfu: "1.5", dfu: "1" },
    { fixture: "WC (Flush Tank)", wsfu: "3",   dfu: "3" },
    { fixture: "Shower",          wsfu: "2",   dfu: "2" },
    { fixture: "Kitchen Sink",    wsfu: "1.5", dfu: "2" },
    { fixture: "Urinal",          wsfu: "1",   dfu: "2" },
    { fixture: "Washing Machine", wsfu: "2",   dfu: "2" },
  ];
  const h = hdrH + rows.length * rowH + 8;
  const colW = [w * 0.42, w * 0.29, w * 0.29];

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={2.5} />
      {/* Header */}
      <rect x={x} y={y} width={w} height={hdrH} rx={12} fill={C.cyan.bd} />
      <rect x={x} y={y + hdrH - 8} width={w} height={8} fill={C.cyan.bd} />
      {["Fixture Type", "WSFU", "DFU"].map((hdr, ci) => {
        const hx = x + colW.slice(0, ci).reduce((a, b) => a + b, 0) + colW[ci] / 2;
        return (
          <text key={ci} x={hx} y={y + 24} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>{hdr}</text>
        );
      })}
      {/* Data rows */}
      {rows.map((row, ri) => {
        const ry = y + hdrH + 4 + ri * rowH;
        const vals = [row.fixture, row.wsfu, row.dfu];
        return (
          <g key={ri}>
            {ri > 0 && <line x1={x + 8} y1={ry} x2={x + w - 8} y2={ry} stroke="#e2e8f0" strokeWidth={1} />}
            {vals.map((val, ci) => {
              const vx = x + colW.slice(0, ci).reduce((a, b) => a + b, 0) + colW[ci] / 2;
              return (
                <text key={ci} x={vx} y={ry + 20} textAnchor="middle" fill={C.cyan.tx} fontSize={11}
                  fontWeight={ci === 0 ? 600 : 500} fontFamily={ci > 0 ? "monospace" : undefined}>{val}</text>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// GPM threshold table
function ThresholdTable({ x, y, w }: { x: number; y: number; w: number }) {
  const hdrH = 36;
  const rowH = 30;
  const rows = [
    { range: "GPM \u2264 45",         pipe: "50 mm" },
    { range: "45 < GPM \u2264 70",    pipe: "65 mm" },
    { range: "70 < GPM \u2264 130",   pipe: "80 mm" },
    { range: "130 < GPM \u2264 250",  pipe: "100 mm" },
    { range: "250 < GPM \u2264 500",  pipe: "125 mm" },
  ];
  const h = hdrH + rows.length * rowH + 8;
  const colW = [w * 0.58, w * 0.42];

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill="#f8fafc" stroke={C.amber.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={w} height={hdrH} rx={12} fill={C.amber.bd} />
      <rect x={x} y={y + hdrH - 8} width={w} height={8} fill={C.amber.bd} />
      {["GPM Range", "Pipe Diameter"].map((hdr, ci) => {
        const hx = x + colW.slice(0, ci).reduce((a, b) => a + b, 0) + colW[ci] / 2;
        return (
          <text key={ci} x={hx} y={y + 24} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>{hdr}</text>
        );
      })}
      {rows.map((row, ri) => {
        const ry = y + hdrH + 4 + ri * rowH;
        const vals = [row.range, row.pipe];
        return (
          <g key={ri}>
            {ri > 0 && <line x1={x + 8} y1={ry} x2={x + w - 8} y2={ry} stroke="#e2e8f0" strokeWidth={1} />}
            {vals.map((val, ci) => {
              const vx = x + colW.slice(0, ci).reduce((a, b) => a + b, 0) + colW[ci] / 2;
              return (
                <text key={ci} x={vx} y={ry + 20} textAnchor="middle"
                  fill={ci === 1 ? C.green.tx : C.amber.tx} fontSize={11}
                  fontWeight={ci === 1 ? 700 : 500} fontFamily="monospace">{val}</text>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// Loop visualizer
function LoopBracket({ x, y1, y2, label, color }: {
  x: number; y1: number; y2: number; label: string;
  color: { bg: string; bd: string; tx: string };
}) {
  const r = 12;
  return (
    <g>
      <path d={`M${x + r},${y1} Q${x},${y1} ${x},${y1 + r} L${x},${y2 - r} Q${x},${y2} ${x + r},${y2}`}
        fill="none" stroke={color.bd} strokeWidth={2.5} strokeDasharray="6,4" />
      <circle cx={x} cy={(y1 + y2) / 2} r={4} fill={color.bd} />
      <rect x={x - 60} y={(y1 + y2) / 2 - 14} width={56} height={28} rx={8}
        fill={color.bg} stroke={color.bd} strokeWidth={1.5} />
      <text x={x - 32} y={(y1 + y2) / 2 + 4} textAnchor="middle"
        fill={color.tx} fontSize={10} fontWeight={700}>{label}</text>
    </g>
  );
}


// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function PipeSizingCalcSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block", margin: "0 auto", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
    >
      {/* ── Arrow Markers ── */}
      <defs>
        <marker id="psc-arrow" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="psc-blue" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blue.bd} />
        </marker>
        <marker id="psc-green" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
        <marker id="psc-red" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
        </marker>
        <marker id="psc-amber" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber.bd} />
        </marker>
        <linearGradient id="psc-bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="url(#psc-bg-grad)" rx={16} />

      {/* Title */}
      <text x={CX} y={38} textAnchor="middle" fill="#1e293b" fontSize={22} fontWeight={800}>
        {"\uD83D\uDCA7"} Transfer Pipe Sizing Calculation
      </text>
      <text x={CX} y={58} textAnchor="middle" fill="#64748b" fontSize={13}>
        Hunter{"'"}s Method — Fixture Unit {"→"} GPM {"→"} Pipe Diameter — IS 2065 / NBC
      </text>

      {/* ══════════════════════════════════════════════════ */}
      {/* STAGE 1: INPUT & DEFINITION                        */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={80} h={750} label="STAGE 1: INPUT & DEFINITION — Building Profile, Fixtures & Fixture Units" color={C.blue.bd} />

      {/* Step 1: START */}
      <StepBadge x={BX - 30} y={140} num={1} color={C.green.bd} />
      <Oval cx={CX} cy={140} w={380} h={54}
        label={"\uD83C\uDFD7\uFE0F Transfer Pipe Sizing — START"}
        sub="Hunter's Method | IS 2065 / NBC Standards"
        color={C.green} />

      <Arrow x1={CX} y1={167} x2={CX} y2={220} />

      {/* Step 2: Building Profile Input */}
      <StepBadge x={BX - 70} y={255} num={2} color={C.blue.bd} />
      <Parallelogram x={BX - 60} y={220} w={BW + 120} h={BH}
        label="Input 1: Building Profile"
        sub="Number of floors, floor height (m), building type"
        color={C.blue} badge="USER INPUT" />

      {/* Side note — building data */}
      <FormulaBlock x={BX + BW + 100} y={220} w={300} h={60} color={C.slate}
        lines={[
          "Typical: 5–40 Floors",
          "Floor Height: 2.7–3.6 m",
        ]} />

      <Arrow x1={CX} y1={290} x2={CX} y2={340} />

      {/* Step 3: Fixture Count per Toilet Type */}
      <StepBadge x={BX - 70} y={375} num={3} color={C.blue.bd} />
      <Parallelogram x={BX - 60} y={340} w={BW + 120} h={BH + 10}
        label="Input 2: Fixture Count per Toilet Type"
        sub="e.g., Type-1: 1 Wash Basin, 1 WC, 1 Shower per floor"
        color={C.blue} badge="USER INPUT" />

      {/* Side note — toilet types */}
      <rect x={BX + BW + 100} y={330} width={320} height={100} rx={12}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
      <rect x={BX + BW + 320} y={336} width={90} height={22} rx={11} fill={C.purple.bd} opacity={0.85} />
      <text x={BX + BW + 365} y={350} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>EXAMPLE</text>
      <text x={BX + BW + 260} y={366} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={600}>Type-1: 1 WB + 1 WC + 1 SH</text>
      <text x={BX + BW + 260} y={384} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={600}>Type-2: 2 WB + 2 WC + 2 SH</text>
      <text x={BX + BW + 260} y={402} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={600}>Type-3: 1 WB + 1 WC (no shower)</text>
      <text x={BX + BW + 260} y={420} textAnchor="middle" fill={C.purple.tx} fontSize={10} opacity={0.6}>Toilet types defined in project schedule</text>

      <Arrow x1={CX} y1={420} x2={CX} y2={480} />

      {/* Step 4: Assign Fixture Units — DB Fetch */}
      <StepBadge x={BX - 70} y={535} num={4} color={C.cyan.bd} />
      <Cylinder x={BX - 60} y={480} w={BW + 120} h={110}
        label="Assign Fixture Units (WSFU / DFU)"
        sub="Database: Toilet Types Sheet — Standard FU Values"
        color={C.cyan} badge="DB FETCH" />

      {/* Fixture Unit reference table — positioned to the right */}
      <FUTable x={BX + BW + 100} y={460} w={380} />

      {/* Definition note */}
      <rect x={60} y={620} width={340} height={90} rx={12}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <rect x={310} y={626} width={80} height={20} rx={10} fill={C.teal.bd} opacity={0.85} />
      <text x={350} y={639} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>DEFINITION</text>
      <text x={230} y={660} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>WSFU = Water Supply Fixture Unit</text>
      <text x={230} y={678} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>DFU = Drainage Fixture Unit</text>
      <text x={230} y={696} textAnchor="middle" fill={C.teal.tx} fontSize={10} opacity={0.7}>Values per IS 2065 / NBC India Table 2</text>

      {/* Formula: Total Floor FU */}
      <FormulaBlock x={BX - 40} y={700} w={BW + 80} h={70} color={C.purple}
        lines={[
          "Floor WSFU = \u03A3 (Fixture Count \u00D7 WSFU per Fixture)",
          "Floor DFU  = \u03A3 (Fixture Count \u00D7 DFU per Fixture)",
        ]} />

      <Arrow x1={CX} y1={770} x2={CX} y2={880} />

      {/* ══════════════════════════════════════════════════ */}
      {/* STAGE 2: THE RISER LOGIC (LOOP)                    */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={850} h={1030} label="STAGE 2: THE RISER LOGIC — Floor-by-Floor Loop (Top to Bottom)" color={C.amber.bd} />

      {/* Loop bracket on the left side */}
      <LoopBracket x={90} y1={920} y2={1770} label="LOOP" color={C.amber} />

      {/* Step 5: Loop Initialization */}
      <StepBadge x={BX - 30} y={940} num={5} color={C.amber.bd} />
      <Box x={BX - 40} y={910} w={BW + 80} h={BH}
        label="Loop Init: Floor N (Top \u2192 Bottom)"
        sub="Start from highest occupied floor, iterate downward"
        color={C.amber} badge="LOOP START" />

      {/* Loop annotation */}
      <rect x={BX + BW + 80} y={910} width={340} height={60} rx={12}
        fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2} />
      <text x={BX + BW + 250} y={936} textAnchor="middle" fill={C.orange.tx} fontSize={12} fontWeight={700}>
        {"🔄"} For N = Top Floor down to Ground Floor
      </text>
      <text x={BX + BW + 250} y={956} textAnchor="middle" fill={C.orange.tx} fontSize={10} opacity={0.7}>
        Each iteration calculates sub-riser + cumulative main riser
      </text>

      <Arrow x1={CX} y1={980} x2={CX} y2={1040} />

      {/* Step 6: Sum WSFU for Floor N */}
      <StepBadge x={BX - 30} y={1075} num={6} color={C.amber.bd} />
      <Box x={BX - 40} y={1040} w={BW + 80} h={BH}
        label="Sum WSFU for Floor N"
        sub="Sub Riser FU = (Fixtures on Floor N) \u00D7 (Unit Count)"
        color={C.purple} badge="CALC" />

      <FormulaBlock x={BX + BW + 80} y={1040} w={380} h={70} color={C.purple}
        lines={[
          "Sub Riser FU(N) = \u03A3 (Count_i \u00D7 WSFU_i)",
          "e.g., 1\u00D71.5 + 1\u00D73 + 1\u00D72 = 6.5 WSFU",
        ]} />

      <Arrow x1={CX} y1={1110} x2={CX} y2={1170} />

      {/* Step 7: Cumulative Main Riser FU */}
      <StepBadge x={BX - 30} y={1205} num={7} color={C.amber.bd} />
      <Box x={BX - 40} y={1170} w={BW + 80} h={BH}
        label="Cumulative Main Riser FU"
        sub="Main Riser FU = Sub Riser FU + FU of all floors above"
        color={C.green} badge="ACCUMULATE" />

      <FormulaBlock x={BX + BW + 80} y={1170} w={380} h={70} color={C.purple}
        lines={[
          "Main Riser FU(N) = Sub Riser FU(N)",
          "  + Main Riser FU(N+1)  [floor above]",
        ]} />

      {/* Side note — cumulative illustration */}
      <rect x={60} y={1170} width={280} height={100} rx={12}
        fill="#f8fafc" stroke={C.slate.bd} strokeWidth={1.5} />
      <text x={200} y={1195} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>Cumulative Example</text>
      <text x={200} y={1215} textAnchor="middle" fill={C.slate.tx} fontSize={10} fontFamily="monospace">Floor 10: 6.5 FU (sub only)</text>
      <text x={200} y={1233} textAnchor="middle" fill={C.slate.tx} fontSize={10} fontFamily="monospace">Floor  9: 6.5 + 6.5 = 13.0 FU</text>
      <text x={200} y={1251} textAnchor="middle" fill={C.slate.tx} fontSize={10} fontFamily="monospace">Floor  8: 6.5 + 13.0 = 19.5 FU</text>
      <text x={200} y={1265} textAnchor="middle" fill={C.slate.tx} fontSize={9} opacity={0.6}>...accumulating downward</text>

      <Arrow x1={CX} y1={1240} x2={CX} y2={1320} />

      {/* Step 8: Combined Hot/Cold Decision */}
      <StepBadge x={BX - 30} y={1385} num={8} color={C.amber.bd} />
      <Diamond cx={CX} cy={1385} rxD={220} ryD={70}
        label="Is it a Combined Hot/Cold Line?"
        sub="Hot & Cold water in single riser?"
        color={C.amber} />

      {/* YES branch — left */}
      <Arrow x1={CX - 220} y1={1385} x2={240} y2={1385} color={C.green.bd} />
      <rect x={CX - 265} y={1372} width={40} height={22} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX - 245} y={1387} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>YES</text>

      <Box x={80} y={1440} w={320} h={70}
        label="Multiply WSFU \u00D7 1.4"
        sub="Combined Hot + Cold correction factor"
        color={C.orange} badge="ADJUST" />

      <FormulaBlock x={80} y={1520} w={320} h={50} color={C.purple}
        lines={[
          "Adjusted FU = Main Riser FU \u00D7 1.4",
        ]} />

      {/* NO branch — right */}
      <Arrow x1={CX + 220} y1={1385} x2={W - 240} y2={1385} color={C.blue.bd} />
      <rect x={CX + 225} y={1372} width={36} height={22} rx={6} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
      <text x={CX + 243} y={1387} textAnchor="middle" fill={C.blue.tx} fontSize={11} fontWeight={700}>NO</text>

      <Box x={W - 400} y={1440} w={320} h={70}
        label="Use Direct WSFU"
        sub="No correction — single-temperature riser"
        color={C.blue} badge="DIRECT" />

      {/* Merge arrows back to center */}
      <Arrow x1={240} y1={1570} x2={240} y2={1620} color={C.arrow} />
      <Arrow x1={W - 240} y1={1510} x2={W - 240} y2={1620} color={C.arrow} />
      <line x1={240} y1={1620} x2={W - 240} y2={1620} stroke={C.arrow} strokeWidth={2.5} />
      <Arrow x1={CX} y1={1620} x2={CX} y2={1670} color={C.arrow} />

      <rect x={CX - 160} y={1670} width={320} height={40} rx={20}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={1695} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        Final FU for Floor N {"→"} Ready for Lookup
      </text>

      {/* Loop-back arrow */}
      <Arrow x1={CX} y1={1710} x2={CX} y2={1760} />

      {/* Loop repeat decision */}
      <Diamond cx={CX} cy={1800} rxD={180} ryD={50}
        label="More Floors Below?"
        sub="N > Ground?"
        color={C.amber} />

      {/* YES — loop back */}
      <path d={`M${CX + 180},${1800} L${W - 120},${1800} L${W - 120},${940} L${BX + BW + 40},${940}`}
        fill="none" stroke={C.amber.bd} strokeWidth={2} strokeDasharray="8,5" markerEnd="url(#psc-amber)" />
      <rect x={W - 170} y={1360} width={44} height={22} rx={6} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1.5} />
      <text x={W - 148} y={1375} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={700}>YES</text>

      {/* NO — continue down */}
      <Arrow x1={CX} y1={1850} x2={CX} y2={1960} color={C.arrow} />
      <rect x={CX - 16} y={1855} width={36} height={22} rx={6} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
      <text x={CX + 2} y={1870} textAnchor="middle" fill={C.blue.tx} fontSize={11} fontWeight={700}>NO</text>


      {/* ══════════════════════════════════════════════════ */}
      {/* STAGE 3: FLOW CONVERSION — HUNTER'S CURVE          */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={1930} h={560} label="STAGE 3: FLOW CONVERSION — Hunter's Curve (FU → GPM Lookup)" color={C.cyan.bd} />

      {/* Step 9: Hunter's Curve DB Lookup */}
      <StepBadge x={BX - 70} y={2030} num={9} color={C.cyan.bd} />
      <Cylinder x={BX - 60} y={1980} w={BW + 120} h={110}
        label="Hunter's Curve Lookup — FU \u2192 GPM"
        sub="Database Sheet: FU-to-GPM conversion table (Flush Tank type)"
        color={C.cyan} badge="DB LOOKUP" />

      {/* Hunter's curve example table */}
      {(() => {
        const tx = BX + BW + 100;
        const ty = 1970;
        const tw = 380;
        const hdrH2 = 36;
        const rowH2 = 28;
        const exRows = [
          { fu: "20",  gpm: "15.0" },
          { fu: "50",  gpm: "29.1" },
          { fu: "100", gpm: "43.9" },
          { fu: "200", gpm: "65.0" },
          { fu: "500", gpm: "130.0" },
          { fu: "1000", gpm: "208.0" },
        ];
        const th = hdrH2 + exRows.length * rowH2 + 8;
        return (
          <g>
            <rect x={tx} y={ty} width={tw} height={th} rx={12}
              fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={2.5} />
            <rect x={tx} y={ty} width={tw} height={hdrH2} rx={12} fill={C.cyan.bd} />
            <rect x={tx} y={ty + hdrH2 - 8} width={tw} height={8} fill={C.cyan.bd} />
            <text x={tx + tw * 0.3} y={ty + 24} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
              Fixture Units (FU)
            </text>
            <text x={tx + tw * 0.73} y={ty + 24} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>
              GPM (Flush Tank)
            </text>
            {exRows.map((row, ri) => {
              const ry = ty + hdrH2 + 4 + ri * rowH2;
              return (
                <g key={ri}>
                  {ri > 0 && <line x1={tx + 8} y1={ry} x2={tx + tw - 8} y2={ry} stroke="#e2e8f0" strokeWidth={1} />}
                  <text x={tx + tw * 0.3} y={ry + 19} textAnchor="middle"
                    fill={C.cyan.tx} fontSize={11} fontWeight={500} fontFamily="monospace">{row.fu}</text>
                  <text x={tx + tw * 0.73} y={ry + 19} textAnchor="middle"
                    fill={C.amber.tx} fontSize={11} fontWeight={700} fontFamily="monospace">{row.gpm}</text>
                </g>
              );
            })}
            <rect x={tx + tw - 100} y={ty + 6} width={90} height={20} rx={10} fill="rgba(255,255,255,0.3)" />
            <text x={tx + tw - 55} y={ty + 19} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>HUNTER{"'"}S CURVE</text>
          </g>
        );
      })()}

      <Arrow x1={CX} y1={2090} x2={CX} y2={2160} />

      {/* Step 10: GPM Result */}
      <StepBadge x={BX - 30} y={2195} num={10} color={C.green.bd} />
      <Box x={BX - 40} y={2160} w={BW + 80} h={BH}
        label="GPM Value for Each Floor Segment"
        sub="Interpolated from Hunter's Curve based on cumulative FU"
        color={C.green} badge="RESULT" />

      <FormulaBlock x={BX + BW + 80} y={2165} w={380} h={70} color={C.purple}
        lines={[
          "GPM = f(Main Riser FU)",
          "Interpolated from FU-GPM Database",
        ]} />

      {/* Annotation: conversion note */}
      <rect x={60} y={2200} width={280} height={70} rx={12}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={1.5} />
      <text x={200} y={2225} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>{"💡"} Conversion Note</text>
      <text x={200} y={2245} textAnchor="middle" fill={C.teal.tx} fontSize={10}>1 GPM = 0.0631 L/s = 3.785 L/min</text>
      <text x={200} y={2260} textAnchor="middle" fill={C.teal.tx} fontSize={9} opacity={0.7}>Use GPM for pipe sizing lookup</text>

      {/* Connecting note between stages */}
      <rect x={CX - 200} y={2310} width={400} height={30} rx={15}
        fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1.5} />
      <text x={CX} y={2330} textAnchor="middle" fill={C.amber.tx} fontSize={11} fontWeight={700}>
        {"📊"} GPM values computed for every floor segment {"→"} Size pipes
      </text>

      <Arrow x1={CX} y1={2340} x2={CX} y2={2480} />


      {/* ══════════════════════════════════════════════════ */}
      {/* STAGE 4: FINAL SIZING DECISION                     */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={2440} h={900} label="STAGE 4: FINAL SIZING DECISION — GPM Threshold → Pipe Diameter" color={C.amber.bd} />

      {/* Step 11: GPM Threshold Decision */}
      <StepBadge x={BX - 70} y={2560} num={11} color={C.amber.bd} />
      <Diamond cx={CX} cy={2560} rxD={240} ryD={80}
        label="GPM Threshold Check"
        sub="Match GPM to standard pipe size range"
        color={C.amber} />

      {/* Threshold table on the right */}
      <ThresholdTable x={BX + BW + 80} y={2490} w={380} />

      {/* Decision branches — cascade */}
      {(() => {
        const branches = [
          { label: "GPM \u2264 45", pipe: "50 mm", color: C.green },
          { label: "45 < GPM \u2264 70", pipe: "65 mm", color: C.blue },
          { label: "70 < GPM \u2264 130", pipe: "80 mm", color: C.purple },
          { label: "130 < GPM \u2264 250", pipe: "100 mm", color: C.amber },
          { label: "GPM > 250", pipe: "125 mm", color: C.orange },
        ];
        const startY = 2700;
        const bw = 240;
        const bh = 46;
        const gap = 12;
        const startX = CX - (branches.length * (bw + gap)) / 2 + gap / 2;

        return (
          <g>
            <Arrow x1={CX} y1={2640} x2={CX} y2={2680} />
            {/* Distribution line */}
            <line x1={startX + bw / 2} y1={2680} x2={startX + (branches.length - 1) * (bw + gap) + bw / 2} y2={2680}
              stroke={C.arrow} strokeWidth={2.5} />

            {branches.map((b, i) => {
              const bx = startX + i * (bw + gap);
              const bcx = bx + bw / 2;
              return (
                <g key={i}>
                  <Arrow x1={bcx} y1={2680} x2={bcx} y2={startY} />
                  {/* Condition */}
                  <rect x={bx} y={startY} width={bw} height={bh} rx={10}
                    fill={b.color.bg} stroke={b.color.bd} strokeWidth={2} />
                  <text x={bcx} y={startY + 18} textAnchor="middle" fill={b.color.tx} fontSize={10} fontWeight={600}>{b.label}</text>
                  <text x={bcx} y={startY + 34} textAnchor="middle" fill={b.color.tx} fontSize={13} fontWeight={800}>{"→"} {b.pipe}</text>
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* Merge back */}
      {(() => {
        const branches = 5;
        const bw = 240;
        const gap = 12;
        const startX = CX - (branches * (bw + gap)) / 2 + gap / 2;
        const mergeY = 2808;
        return (
          <g>
            <line x1={startX + bw / 2} y1={mergeY} x2={startX + (branches - 1) * (bw + gap) + bw / 2} y2={mergeY}
              stroke={C.arrow} strokeWidth={2.5} />
            {Array.from({ length: branches }).map((_, i) => {
              const bcx = startX + i * (bw + gap) + bw / 2;
              return <Arrow key={i} x1={bcx} y1={2746} x2={bcx} y2={mergeY} />;
            })}
            <Arrow x1={CX} y1={mergeY} x2={CX} y2={2870} />
          </g>
        );
      })()}

      {/* Step 12: Pipe Diameter Assignment */}
      <StepBadge x={BX - 30} y={2905} num={12} color={C.green.bd} />
      <Box x={BX - 40} y={2870} w={BW + 80} h={BH}
        label="Pipe Diameter Assigned for Floor Segment"
        sub="Standard commercial pipe size selected from threshold match"
        color={C.green} badge="OUTPUT" />

      <FormulaBlock x={BX + BW + 80} y={2870} w={380} h={70} color={C.purple}
        lines={[
          "Pipe \u00D8 = Threshold(GPM) \u2192 IS 2065 Std.",
          "Velocity V = Q / A = GPM \u00D7 k / (D\u00B2)",
        ]} />

      {/* Velocity check annotation */}
      <rect x={60} y={2920} width={280} height={70} rx={12}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={200} y={2945} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>{"⚠️"} Velocity Check</text>
      <text x={200} y={2963} textAnchor="middle" fill={C.rose.tx} fontSize={10}>Target: 1.5 – 3.0 m/s</text>
      <text x={200} y={2978} textAnchor="middle" fill={C.rose.tx} fontSize={9} opacity={0.7}>If V {">"} 3.0 m/s, upsize pipe diameter</text>

      <Arrow x1={CX} y1={2940} x2={CX} y2={3020} />

      {/* Velocity validation diamond */}
      <StepBadge x={BX - 30} y={3080} num={13} color={C.rose.bd} />
      <Diamond cx={CX} cy={3080} rxD={200} ryD={60}
        label="V \u2264 3.0 m/s ?"
        sub="Velocity within acceptable range?"
        color={C.amber} />

      {/* YES — down */}
      <Arrow x1={CX} y1={3140} x2={CX} y2={3200} color={C.green.bd} />
      <rect x={CX - 24} y={3148} width={48} height={22} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={3163} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>YES</text>

      {/* NO — right, upsize and loop back */}
      <Arrow x1={CX + 200} y1={3080} x2={W - 300} y2={3080} color={C.reject} />
      <rect x={CX + 205} y={3068} width={36} height={22} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={CX + 223} y={3083} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>NO</text>

      <rect x={W - 380} y={3050} width={240} height={60} rx={12}
        fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2.5} />
      <text x={W - 260} y={3075} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={700}>{"⬆️"} Upsize Pipe</text>
      <text x={W - 260} y={3095} textAnchor="middle" fill={C.rose.tx} fontSize={10} opacity={0.7}>Select next larger diameter</text>

      {/* Loop back to step 12 */}
      <path d={`M${W - 260},${3110} L${W - 260},${3140} Q${W - 260},${3160} ${W - 280},${3160} L${W - 400},${3160} Q${W - 420},${3160} ${W - 420},${3140} L${W - 420},${2900} Q${W - 420},${2880} ${W - 400},${2880} L${BX + BW + 40},${2880}`}
        fill="none" stroke={C.reject} strokeWidth={2} strokeDasharray="8,5" markerEnd="url(#psc-red)" />
      <rect x={W - 420} y={2960} width={80} height={22} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1} />
      <text x={W - 380} y={2975} textAnchor="middle" fill={C.rose.tx} fontSize={9} fontWeight={700}>Re-size</text>

      <rect x={CX - 130} y={3200} width={260} height={36} rx={18}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={3223} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        {"✅"} Pipe Size Confirmed for Segment
      </text>

      <Arrow x1={CX} y1={3236} x2={CX} y2={3400} />


      {/* ══════════════════════════════════════════════════ */}
      {/* STAGE 5: OUTPUT DETAILS                            */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={3370} h={1420} label="STAGE 5: OUTPUT DETAILS — Pipe Schedule, Velocity, Pressure Drop & Vent Sizing" color={C.green.bd} />

      {/* Step 14: Final Pipe Schedule */}
      <StepBadge x={BX - 70} y={3470} num={14} color={C.green.bd} />
      <Box x={BX - 60} y={3430} w={BW + 120} h={BH + 10}
        label="Final Pipe Schedule — All Floor Segments"
        sub="Document: Pipe diameter for every floor riser segment"
        color={C.green} badge="DOCUMENT" />

      {/* Pipe schedule illustration */}
      {(() => {
        const tx = BX + BW + 100;
        const ty = 3420;
        const tw = 380;
        const hdrH2 = 36;
        const rowH2 = 28;
        const sched = [
          { floor: "Terrace → 10th", fu: "6.5",  gpm: "5.2",   pipe: "50 mm" },
          { floor: "10th → 9th",     fu: "13.0", gpm: "9.0",   pipe: "50 mm" },
          { floor: "9th → 5th",      fu: "39.0", gpm: "24.5",  pipe: "50 mm" },
          { floor: "5th → 3rd",      fu: "52.0", gpm: "32.0",  pipe: "50 mm" },
          { floor: "3rd → Ground",   fu: "65.0", gpm: "38.0",  pipe: "50 mm" },
          { floor: "Main Riser",     fu: "130.0", gpm: "67.0", pipe: "65 mm" },
        ];
        const th = hdrH2 + sched.length * rowH2 + 8;
        const cols = ["Segment", "Cum. FU", "GPM", "\u00D8 Pipe"];
        const colW2 = [tw * 0.32, tw * 0.22, tw * 0.22, tw * 0.24];
        return (
          <g>
            <rect x={tx} y={ty} width={tw} height={th} rx={12}
              fill="#f8fafc" stroke={C.green.bd} strokeWidth={2.5} />
            <rect x={tx} y={ty} width={tw} height={hdrH2} rx={12} fill={C.green.bd} />
            <rect x={tx} y={ty + hdrH2 - 8} width={tw} height={8} fill={C.green.bd} />
            {cols.map((c, ci) => (
              <text key={ci} x={tx + colW2.slice(0, ci).reduce((a, b) => a + b, 0) + colW2[ci] / 2} y={ty + 24}
                textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>{c}</text>
            ))}
            {sched.map((row, ri) => {
              const ry = ty + hdrH2 + 4 + ri * rowH2;
              const vals = [row.floor, row.fu, row.gpm, row.pipe];
              return (
                <g key={ri}>
                  {ri > 0 && <line x1={tx + 8} y1={ry} x2={tx + tw - 8} y2={ry} stroke="#e2e8f0" strokeWidth={1} />}
                  {vals.map((v, ci) => (
                    <text key={ci}
                      x={tx + colW2.slice(0, ci).reduce((a, b) => a + b, 0) + colW2[ci] / 2}
                      y={ry + 19} textAnchor="middle"
                      fill={ci === 3 ? C.green.tx : C.slate.tx}
                      fontSize={10} fontWeight={ci === 3 ? 700 : 500}
                      fontFamily={ci > 0 ? "monospace" : undefined}>{v}</text>
                  ))}
                </g>
              );
            })}
            <rect x={tx + tw - 110} y={ty + 6} width={100} height={20} rx={10} fill="rgba(255,255,255,0.3)" />
            <text x={tx + tw - 60} y={ty + 19} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>EXAMPLE DATA</text>
          </g>
        );
      })()}

      <Arrow x1={CX} y1={3510} x2={CX} y2={3590} />

      {/* Step 15: Velocity & Pressure Drop Check */}
      <StepBadge x={BX - 30} y={3625} num={15} color={C.purple.bd} />
      <Box x={BX - 40} y={3590} w={BW + 80} h={BH + 10}
        label="Velocity & Pressure Drop Verification"
        sub="V = Q / A (target 1.5–3.0 m/s) | \u0394P per Hazen-Williams"
        color={C.purple} badge="VERIFY" />

      <FormulaBlock x={BX + BW + 80} y={3580} w={380} h={90} color={C.purple}
        lines={[
          "V = (4 \u00D7 Q) / (\u03C0 \u00D7 D\u00B2)",
          "Q in L/s, D in m",
          "\u0394P = (10.67 \u00D7 L \u00D7 Q^1.852) / (C^1.852 \u00D7 D^4.87)",
        ]} />

      {/* Hazen-Williams note */}
      <rect x={60} y={3600} width={280} height={80} rx={12}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={1.5} />
      <text x={200} y={3625} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>{"📐"} Hazen-Williams</text>
      <text x={200} y={3645} textAnchor="middle" fill={C.teal.tx} fontSize={10}>C = 120 (Steel), 150 (Copper/PVC)</text>
      <text x={200} y={3663} textAnchor="middle" fill={C.teal.tx} fontSize={10}>Max \u0394P = 40 kPa/100m typical</text>

      <Arrow x1={CX} y1={3670} x2={CX} y2={3750} />

      {/* Step 16: Vent Pipe Diameters */}
      <StepBadge x={BX - 30} y={3785} num={16} color={C.teal.bd} />
      <Box x={BX - 40} y={3750} w={BW + 80} h={BH + 10}
        label="Vent Pipe Diameters"
        sub="Soil Stack vent: 100 mm | Waste Stack vent: 80 mm"
        color={C.teal} badge="OUTPUT" />

      {/* Vent pipe sizing table */}
      {(() => {
        const tx = BX + BW + 80;
        const ty = 3740;
        const tw = 400;
        const hdrH2 = 36;
        const rowH2 = 30;
        const ventRows = [
          { stack: "Soil Stack (WC)",   vent: "100 mm", note: "Mandatory per NBC" },
          { stack: "Waste Stack (Basin)", vent: "80 mm",  note: "Min. \u00BD of stack \u00D8" },
          { stack: "Combined Stack",     vent: "100 mm", note: "Largest connected" },
          { stack: "Branch Vent",        vent: "50 mm",  note: "Min. 50 mm for < 8 DFU" },
        ];
        const th = hdrH2 + ventRows.length * rowH2 + 8;
        return (
          <g>
            <rect x={tx} y={ty} width={tw} height={th} rx={12}
              fill="#f8fafc" stroke={C.teal.bd} strokeWidth={2.5} />
            <rect x={tx} y={ty} width={tw} height={hdrH2} rx={12} fill={C.teal.bd} />
            <rect x={tx} y={ty + hdrH2 - 8} width={tw} height={8} fill={C.teal.bd} />
            {["Stack Type", "Vent \u00D8", "Note"].map((h, ci) => {
              const cw = ci === 0 ? tw * 0.4 : ci === 1 ? tw * 0.25 : tw * 0.35;
              const cx2 = tx + (ci === 0 ? 0 : ci === 1 ? tw * 0.4 : tw * 0.65) + cw / 2;
              return (
                <text key={ci} x={cx2} y={ty + 24} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>{h}</text>
              );
            })}
            {ventRows.map((row, ri) => {
              const ry = ty + hdrH2 + 4 + ri * rowH2;
              const vals = [row.stack, row.vent, row.note];
              return (
                <g key={ri}>
                  {ri > 0 && <line x1={tx + 8} y1={ry} x2={tx + tw - 8} y2={ry} stroke="#e2e8f0" strokeWidth={1} />}
                  {vals.map((v, ci) => {
                    const cw = ci === 0 ? tw * 0.4 : ci === 1 ? tw * 0.25 : tw * 0.35;
                    const cx2 = tx + (ci === 0 ? 0 : ci === 1 ? tw * 0.4 : tw * 0.65) + cw / 2;
                    return (
                      <text key={ci} x={cx2} y={ry + 20} textAnchor="middle"
                        fill={ci === 1 ? C.green.tx : C.teal.tx}
                        fontSize={10} fontWeight={ci === 1 ? 700 : 500}>{v}</text>
                    );
                  })}
                </g>
              );
            })}
          </g>
        );
      })()}

      <Arrow x1={CX} y1={3830} x2={CX} y2={3920} />

      {/* Output Summary Table */}
      <rect x={CX - 420} y={3920} width={840} height={130} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={2.5} />
      <rect x={CX - 420} y={3920} width={840} height={36} rx={14} fill={C.blue.bd} />
      <rect x={CX - 420} y={3944} width={840} height={12} fill={C.blue.bd} />
      <text x={CX} y={3946} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"📊"} OUTPUT SUMMARY — Transfer Pipe Sizing Results
      </text>
      {[
        ["Floor Segment", "Cumulative FU", "Flow Rate (GPM)", "Pipe \u00D8 (mm)"],
        ["Velocity (m/s)", "Pressure Drop (\u0394P)", "Vent \u00D8 (mm)", "Standard Ref."],
      ].map((row, ri) => (
        <g key={ri}>
          {row.map((cell, ci) => {
            const cw = 196;
            const cx2 = CX - 410 + ci * (cw + 8);
            const cy2 = 3968 + ri * 28;
            return (
              <g key={ci}>
                <rect x={cx2} y={cy2} width={cw} height={24} rx={6}
                  fill={ri === 0 ? C.blue.bg : C.green.bg}
                  stroke={ri === 0 ? C.blue.bd : C.green.bd} strokeWidth={1} />
                <text x={cx2 + cw / 2} y={cy2 + 16} textAnchor="middle"
                  fill={ri === 0 ? C.blue.tx : C.green.tx} fontSize={10} fontWeight={600}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}

      <Arrow x1={CX} y1={4050} x2={CX} y2={4120} />

      {/* Reference Standards */}
      <rect x={CX - 300} y={4120} width={600} height={70} rx={12}
        fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={1.5} />
      <text x={CX} y={4145} textAnchor="middle" fill={C.slate.tx} fontSize={12} fontWeight={700}>
        {"📋"} Reference Standards
      </text>
      <text x={CX} y={4165} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        IS 2065 (Code of Practice for Water Supply) | NBC India Part 9 | ASHRAE Handbook: Fundamentals
      </text>
      <text x={CX} y={4180} textAnchor="middle" fill={C.slate.tx} fontSize={10} opacity={0.7}>
        Hunter{"'"}s Curve (Flush Tank) | Hazen-Williams Formula for Pressure Drop
      </text>

      <Arrow x1={CX} y1={4190} x2={CX} y2={4260} />

      {/* Step 16 (Final): END */}
      <Oval cx={CX} cy={4300} w={380} h={54}
        label={"\uD83C\uDFC1 Transfer Pipe Sizing — COMPLETE"}
        sub="All floor segments sized, verified & documented"
        color={C.green} />


      {/* ══════════════════════════════════════════════════ */}
      {/* LEGEND                                             */}
      {/* ══════════════════════════════════════════════════ */}
      <rect x={40} y={4400} width={W - 80} height={180} rx={16}
        fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={4430} textAnchor="middle" fill="#334155" fontSize={14} fontWeight={700}>LEGEND — Symbol Reference</text>

      {/* Row 1 */}
      {[
        { x: 80, shape: "oval", label: "Start / End", color: C.green },
        { x: 360, shape: "parallelogram", label: "User Input", color: C.blue },
        { x: 640, shape: "rectangle", label: "Process / Calc", color: C.purple },
        { x: 920, shape: "diamond", label: "Decision", color: C.amber },
        { x: 1200, shape: "cylinder", label: "Database Lookup", color: C.cyan },
      ].map((item, i) => {
        const iy = 4450;
        if (item.shape === "oval") {
          return (
            <g key={i}>
              <rect x={item.x} y={iy} width={60} height={24} rx={12}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "parallelogram") {
          return (
            <g key={i}>
              <polygon points={`${item.x + 8},${iy} ${item.x + 60},${iy} ${item.x + 52},${iy + 24} ${item.x},${iy + 24}`}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "rectangle") {
          return (
            <g key={i}>
              <rect x={item.x} y={iy} width={60} height={24} rx={6}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "diamond") {
          return (
            <g key={i}>
              <polygon points={`${item.x + 30},${iy} ${item.x + 60},${iy + 12} ${item.x + 30},${iy + 24} ${item.x},${iy + 12}`}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "cylinder") {
          return (
            <g key={i}>
              <rect x={item.x + 5} y={iy + 4} width={50} height={20} rx={4}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <ellipse cx={item.x + 30} cy={iy + 6} rx={25} ry={6}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={1.5} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        return null;
      })}

      {/* Row 2 */}
      {[
        { x: 80, label: "Formula Block", color: C.purple },
        { x: 360, label: "Loop Bracket", color: C.amber },
        { x: 640, label: "Threshold Table", color: C.amber },
        { x: 920, label: "Auto-calculated", color: C.green },
        { x: 1200, label: "Reject / Re-loop", color: { bg: "#ffe4e6", bd: C.reject, tx: "#9f1239" } },
      ].map((item, i) => {
        const iy = 4490;
        return (
          <g key={i}>
            <rect x={item.x} y={iy} width={60} height={20} rx={6}
              fill={item.color.bg} stroke={item.color.bd} strokeWidth={1.5} />
            <text x={item.x + 80} y={iy + 14} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
          </g>
        );
      })}

      {/* Row 3 — sizing summary */}
      {[
        { label: "50 mm", sub: "\u2264 45 GPM", color: C.green },
        { label: "65 mm", sub: "\u2264 70 GPM", color: C.blue },
        { label: "80 mm", sub: "\u2264 130 GPM", color: C.purple },
        { label: "100 mm", sub: "\u2264 250 GPM", color: C.amber },
        { label: "125 mm", sub: "> 250 GPM", color: C.orange },
      ].map((item, i) => {
        const ix = 80 + i * 280;
        const iy = 4530;
        return (
          <g key={i}>
            <rect x={ix} y={iy} width={100} height={24} rx={12}
              fill={item.color.bg} stroke={item.color.bd} strokeWidth={1.5} />
            <text x={ix + 50} y={iy + 16} textAnchor="middle" fill={item.color.tx} fontSize={10} fontWeight={700}>{item.label}</text>
            <text x={ix + 115} y={iy + 16} fill="#64748b" fontSize={10}>{item.sub}</text>
          </g>
        );
      })}

      {/* Footer */}
      <text x={CX} y={4590} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        Transfer Pipe Sizing Calculation — Hunter{"'"}s Method — IS 2065 / NBC India — MEP Digital Ecosystem
      </text>
    </svg>
  );
}
