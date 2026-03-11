import React from "react";

// =====================================================================
// DD_CB — ELECTRICAL CABLE SIZING & VOLTAGE DROP CALCULATION
// Full 19-step workflow:
//   1. Start → 2. User Input (Col 1,2) → 3. Voltage Selection (Col 3)
//   → 4. Additional Inputs (Col 4,5) → 5. FLC Decision (Col 6)
//   → 6. Diversity Factors (Col 7,8) → 7. Demand Load (Col 9)
//   → 8. Cable Selection (Col 10–13) → 9. DB Fetch (Col 14–16)
//   → 10. Manual Input (Col 17) → 11. DB Fetch Derating (Col 18–26)
//   → 12. Total Derating (Col 27) → 13. Derated Capacity (Col 28)
//   → 14. Effective Capacity (Col 29) → 15. VD Decision (Col 30)
//   → 16. %VD (Col 31) → 17. Validation → 18. Final Cable (Col 32)
//   → 19. End
// =====================================================================

const W = 1600;
const H = 5050;
const CX = W / 2;

// ── Color Palette ──
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

// Standard rectangle box
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

// Oval terminal
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

// Parallelogram (user input)
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

// Diamond decision
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

// Cylinder (database fetch)
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
      {/* Body */}
      <path
        d={`M${x},${y + ellH} L${x},${y + h - ellH} Q${x},${y + h} ${cx},${y + h} Q${x + w},${y + h} ${x + w},${y + h - ellH} L${x + w},${y + ellH}`}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5}
      />
      {/* Top ellipse */}
      <ellipse cx={cx} cy={y + ellH} rx={w / 2} ry={ellH}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} />
      {/* Inner shadow ellipse */}
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

// Warning triangle
function WarningTriangle({ cx, cy, size, label, sub, color }: {
  cx: number; cy: number; size: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
}) {
  const top = `${cx},${cy - size * 0.6}`;
  const left = `${cx - size * 0.7},${cy + size * 0.5}`;
  const right = `${cx + size * 0.7},${cy + size * 0.5}`;
  return (
    <g>
      <polygon points={`${top} ${right} ${left}`}
        fill={color.bg} stroke={color.bd} strokeWidth={3} />
      <text x={cx} y={cy - 2} textAnchor="middle" fill={color.tx} fontSize={22} fontWeight={700}>!</text>
      <text x={cx} y={cy + size * 0.5 + 20} textAnchor="middle" fill={color.tx} fontSize={12} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + size * 0.5 + 36} textAnchor="middle" fill={color.tx} fontSize={10} opacity={0.7}>{sub}</text>
    </g>
  );
}

// Arrow connector
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#csa)" />
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

// Column fields card
function ColumnCard({ x, y, w, title, fields, color }: {
  x: number; y: number; w: number;
  title: string;
  fields: { col: string; name: string; type: "manual" | "dropdown" | "auto" | "fetch" }[];
  color: { bg: string; bd: string; tx: string };
}) {
  const hdrH = 40;
  const rowH = 32;
  const h = hdrH + fields.length * (rowH + 4) + 12;
  const cx = x + w / 2;
  const typeColors: Record<string, { bg: string; bd: string; tx: string; label: string }> = {
    manual:   { bg: "#dbeafe", bd: "#3b82f6", tx: "#1e40af", label: "Manual" },
    dropdown: { bg: "#ede9fe", bd: "#8b5cf6", tx: "#5b21b6", label: "Dropdown" },
    auto:     { bg: "#d1fae5", bd: "#10b981", tx: "#065f46", label: "Auto" },
    fetch:    { bg: "#cffafe", bd: "#06b6d4", tx: "#155e75", label: "DB Fetch" },
  };

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={2.5} />
      <rect x={x} y={y} width={w} height={hdrH} rx={14} fill={color.bd} />
      <rect x={x} y={y + hdrH - 8} width={w} height={8} fill={color.bd} />
      <text x={cx} y={y + 26} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {title}
      </text>
      {fields.map((f, i) => {
        const fy = y + hdrH + 8 + i * (rowH + 4);
        const tc = typeColors[f.type];
        const colW = 70;
        const nameW = w - colW - 100 - 30;
        return (
          <g key={i}>
            {/* Column number */}
            <rect x={x + 8} y={fy} width={colW} height={rowH} rx={6}
              fill={color.bg} stroke={color.bd} strokeWidth={1.2} />
            <text x={x + 8 + colW / 2} y={fy + 21} textAnchor="middle"
              fill={color.tx} fontSize={10} fontWeight={700}>{f.col}</text>
            {/* Field name */}
            <rect x={x + colW + 14} y={fy} width={nameW} height={rowH} rx={6}
              fill="#fff" stroke="#e2e8f0" strokeWidth={1} />
            <text x={x + colW + 14 + nameW / 2} y={fy + 21} textAnchor="middle"
              fill="#334155" fontSize={10.5} fontWeight={600}>{f.name}</text>
            {/* Type badge */}
            <rect x={x + w - 96} y={fy + 4} width={82} height={rowH - 8} rx={12}
              fill={tc.bg} stroke={tc.bd} strokeWidth={1} />
            <text x={x + w - 55} y={fy + 21} textAnchor="middle"
              fill={tc.tx} fontSize={9} fontWeight={700}>{tc.label}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN SVG COMPONENT
// =====================================================================
export function CableSizingCalcSVG() {
  // Layout constants
  const BW = 440;          // standard box width
  const BH = 70;           // standard box height
  const BX = CX - BW / 2; // box left x
  const FBW = 480;         // formula block width
  const FBX = CX - FBW / 2;

  return (
    <svg
      className="stage-chart-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block", margin: "0 auto", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
    >
      <defs>
        <marker id="csa" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
        <marker id="csa-green" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.green.bd} />
        </marker>
        <marker id="csa-red" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
        </marker>
        <marker id="csa-amber" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.amber.bd} />
        </marker>
        <linearGradient id="csg-title" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* ══════════════════════════════════════════════════ */}
      {/* TITLE BANNER                                       */}
      {/* ══════════════════════════════════════════════════ */}
      <rect x={100} y={10} width={W - 200} height={64} rx={16}
        fill="url(#csg-title)" opacity={0.95} />
      <text x={CX} y={36} textAnchor="middle" fill="#fff" fontSize={20} fontWeight={800} letterSpacing={0.5}>
        {"⚡"} Electrical Cable Sizing & Voltage Drop Calculation
      </text>
      <text x={CX} y={58} textAnchor="middle" fill="#fff" fontSize={12} opacity={0.85}>
        IS 3961 / IEC 60502 — 32-Column Spreadsheet Workflow — Step-by-step Algorithm
      </text>

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 1: USER INPUT — Load Description & Parameters */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={90} h={520} label="PHASE 1: USER INPUT — Load Description & Parameters" color={C.blue.bd} />

      {/* Step 1: START */}
      <StepBadge x={BX - 30} y={135} num={1} color={C.green.bd} />
      <Oval cx={CX} cy={135} w={360} h={54} label="START" sub="Cable Sizing Calculation Workflow" color={C.green} />

      <Arrow x1={CX} y1={162} x2={CX} y2={200} />

      {/* Step 2: User Input — Col 1, Col 2 */}
      <StepBadge x={BX - 30} y={230} num={2} color={C.blue.bd} />
      <Parallelogram x={BX - 20} y={200} w={BW + 40} h={BH}
        label="User Input: Load Description & Total Load"
        sub="Column 1 — Load Description  |  Column 2 — Total Load"
        color={C.blue} badge="INPUT" />
      {/* Side note for Col 1 */}
      <rect x={BX + BW + 60} y={200} width={280} height={30} rx={8}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} strokeDasharray="4,3" />
      <text x={BX + BW + 200} y={220} textAnchor="middle" fill={C.blue.tx} fontSize={10} fontWeight={600}>
        Col 1: Free text description of the load
      </text>
      <rect x={BX + BW + 60} y={236} width={280} height={30} rx={8}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} strokeDasharray="4,3" />
      <text x={BX + BW + 200} y={256} textAnchor="middle" fill={C.blue.tx} fontSize={10} fontWeight={600}>
        Col 2: Total Load in kW (manual entry)
      </text>

      <Arrow x1={CX} y1={270} x2={CX} y2={310} />

      {/* Step 3: Voltage Selection — Col 3 */}
      <StepBadge x={BX - 30} y={343} num={3} color={C.purple.bd} />
      <Parallelogram x={BX - 20} y={310} w={BW + 40} h={BH}
        label="Col 3 — Supply Voltage"
        sub="Dropdown Selection: 415 V | 230 V"
        color={C.purple} badge="DROPDOWN" />
      {/* Dropdown options */}
      <rect x={BX + BW + 60} y={316} width={200} height={54} rx={10}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} />
      <text x={BX + BW + 160} y={336} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={700}>
        Voltage Options
      </text>
      <text x={BX + BW + 120} y={354} fill={C.purple.tx} fontSize={10}>{"▸ 415 V (Three Phase)"}</text>
      <text x={BX + BW + 120} y={368} fill={C.purple.tx} fontSize={10}>{"▸ 230 V (Single Phase)"}</text>

      <Arrow x1={CX} y1={380} x2={CX} y2={420} />

      {/* Step 4: Additional Inputs — Col 4, Col 5 */}
      <StepBadge x={BX - 30} y={455} num={4} color={C.blue.bd} />
      <Parallelogram x={BX - 20} y={420} w={BW + 40} h={BH + 10}
        label="Additional User Inputs"
        sub="Column 4 — Power Factor (PF)  |  Column 5 — Length of Cable (m)"
        color={C.blue} badge="INPUT" />
      {/* Side notes */}
      <rect x={BX + BW + 60} y={425} width={260} height={26} rx={8}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} strokeDasharray="4,3" />
      <text x={BX + BW + 190} y={443} textAnchor="middle" fill={C.blue.tx} fontSize={10} fontWeight={600}>
        Col 4: PF = 0.80 to 0.95 typical
      </text>
      <rect x={BX + BW + 60} y={457} width={260} height={26} rx={8}
        fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1} strokeDasharray="4,3" />
      <text x={BX + BW + 190} y={475} textAnchor="middle" fill={C.blue.tx} fontSize={10} fontWeight={600}>
        Col 5: Cable route length in meters
      </text>

      <Arrow x1={CX} y1={500} x2={CX} y2={635} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 2: FULL LOAD CURRENT CALCULATION              */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={620} h={420} label="PHASE 2: FULL LOAD CURRENT — Voltage-based Calculation (Col 6)" color={C.amber.bd} />

      {/* Step 5: FLC Decision Diamond — Col 6 */}
      <StepBadge x={BX - 30} y={695} num={5} color={C.amber.bd} />
      <Diamond cx={CX} cy={695} rxD={180} ryD={60}
        label="Col 6 — Full Load Current"
        sub="Decision: Supply Voltage?"
        color={C.amber} />

      {/* Left branch: 415V */}
      <Arrow x1={CX - 180} y1={695} x2={280} y2={695} color={C.amber.bd} />
      <text x={CX - 195} y={688} textAnchor="end" fill={C.amber.tx} fontSize={11} fontWeight={700}>415 V</text>
      <Arrow x1={280} y1={695} x2={280} y2={800} color={C.amber.bd} />
      <FormulaBlock x={80} y={800} w={400} h={100} color={C.orange}
        lines={[
          "Case 1: Supply Voltage = 415 V",
          "I = (Total Load) / (1.732 × 415 × PF)",
          "     × 1000",
          "I = Col 2 / (1.732 × 415 × Col 4) × 1000",
        ]} />

      {/* Right branch: 230V */}
      <Arrow x1={CX + 180} y1={695} x2={W - 280} y2={695} color={C.amber.bd} />
      <text x={CX + 195} y={688} fill={C.amber.tx} fontSize={11} fontWeight={700}>230 V</text>
      <Arrow x1={W - 280} y1={695} x2={W - 280} y2={800} color={C.amber.bd} />
      <FormulaBlock x={W - 480} y={800} w={400} h={100} color={C.cyan}
        lines={[
          "Case 2: Supply Voltage = 230 V",
          "I = (Total Load) / (230 × PF)",
          "     × 1000",
          "I = Col 2 / (230 × Col 4) × 1000",
        ]} />

      {/* Merge arrows back to center */}
      <Arrow x1={280} y1={900} x2={280} y2={960} color={C.arrow} />
      <Arrow x1={W - 280} y1={900} x2={W - 280} y2={960} color={C.arrow} />
      <line x1={280} y1={960} x2={W - 280} y2={960} stroke={C.arrow} strokeWidth={2.5} />
      <Arrow x1={CX} y1={960} x2={CX} y2={1010} color={C.arrow} />

      {/* Merge node */}
      <rect x={CX - 140} y={1010} width={280} height={40} rx={20}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={1035} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        Col 6: Full Load Current (Amps) — Calculated
      </text>

      <Arrow x1={CX} y1={1050} x2={CX} y2={1100} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 3: DEMAND CALCULATION                        */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={1100} h={310} label="PHASE 3: DEMAND CALCULATION — Diversity Factor & Demand Load" color={C.teal.bd} />

      {/* Step 6: Diversity Factor Inputs — Col 7, Col 8 */}
      <StepBadge x={BX - 30} y={1165} num={6} color={C.blue.bd} />
      <Parallelogram x={BX - 20} y={1130} w={BW + 40} h={BH + 10}
        label="Diversity Factor Inputs"
        sub="Column 7 — Demand Factor  |  Column 8 — Diversity Factor"
        color={C.blue} badge="INPUT" />
      <rect x={BX + BW + 60} y={1140} width={270} height={26} rx={8}
        fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={1} />
      <text x={BX + BW + 195} y={1158} textAnchor="middle" fill={C.teal.tx} fontSize={10} fontWeight={600}>
        Manual entry: 0.0 to 1.0 typical range
      </text>

      <Arrow x1={CX} y1={1210} x2={CX} y2={1260} />

      {/* Step 7: Demand Load Calculation — Col 9 */}
      <StepBadge x={BX - 30} y={1295} num={7} color={C.green.bd} />
      <Box x={BX - 20} y={1260} w={BW + 40} h={BH}
        label="Col 9 — Demand Load"
        sub="Demand Load = Col 7 × Col 8 (Demand Factor × Diversity Factor)"
        color={C.green} badge="CALC" />
      <FormulaBlock x={BX + BW + 60} y={1260} w={300} h={68} color={C.purple}
        lines={[
          "Col 9 = Col 7 × Col 8",
          "Demand Load (kW)",
        ]} />

      <Arrow x1={CX} y1={1330} x2={CX} y2={1470} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 4: CABLE SELECTION & BASE DATA               */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={1430} h={550} label="PHASE 4: CABLE SELECTION PARAMETERS & DATABASE FETCH" color={C.purple.bd} />

      {/* Step 8: Cable Selection Parameters — Col 10–13 */}
      <StepBadge x={BX - 80} y={1500} num={8} color={C.purple.bd} />
      <ColumnCard x={BX - 60} y={1470} w={BW + 120}
        title={"📋 Cable Selection Parameters — Dropdown Selections"}
        fields={[
          { col: "Col 10", name: "Cable Type", type: "dropdown" },
          { col: "Col 11", name: "Cable Material", type: "dropdown" },
          { col: "Col 12", name: "Cable Core Type", type: "dropdown" },
          { col: "Col 13", name: "Installation Method", type: "dropdown" },
        ]}
        color={C.purple} />
      {/* Side notes for dropdown options */}
      <rect x={BX + BW + 100} y={1486} width={280} height={120} rx={10}
        fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} />
      <text x={BX + BW + 240} y={1508} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={700}>
        Dropdown Options
      </text>
      <text x={BX + BW + 120} y={1530} fill={C.purple.tx} fontSize={10}>{"▸ XLPE / PVC / PILC / Armoured"}</text>
      <text x={BX + BW + 120} y={1548} fill={C.purple.tx} fontSize={10}>{"▸ Copper (Cu) / Aluminium (Al)"}</text>
      <text x={BX + BW + 120} y={1566} fill={C.purple.tx} fontSize={10}>{"▸ Single Core / Multi Core"}</text>
      <text x={BX + BW + 120} y={1584} fill={C.purple.tx} fontSize={10}>{"▸ Tray / Conduit / Direct Buried / Ladder"}</text>

      <Arrow x1={CX} y1={1670} x2={CX} y2={1720} />

      {/* Step 9: Fetch Cable Base Data — Col 14–16 */}
      <StepBadge x={BX - 80} y={1790} num={9} color={C.cyan.bd} />
      <Cylinder x={BX - 60} y={1720} w={BW + 120} h={140}
        label="Fetch from Cable Database"
        sub="Col 14: Cable Size  |  Col 15: Current Capacity  |  Col 16: Resistance (R)"
        color={C.cyan} badge="DB FETCH" />
      {/* Fields detail */}
      <rect x={BX + BW + 100} y={1740} width={280} height={100} rx={10}
        fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={1.5} />
      <text x={BX + BW + 240} y={1762} textAnchor="middle" fill={C.cyan.tx} fontSize={11} fontWeight={700}>
        Auto-fetched from Cable DB
      </text>
      <text x={BX + BW + 120} y={1784} fill={C.cyan.tx} fontSize={10}>{"▸ Col 14: Cable Size (sq.mm)"}</text>
      <text x={BX + BW + 120} y={1802} fill={C.cyan.tx} fontSize={10}>{"▸ Col 15: Current Capacity (Amps)"}</text>
      <text x={BX + BW + 120} y={1820} fill={C.cyan.tx} fontSize={10}>{"▸ Col 16: Cable Resistance R (Ω/km)"}</text>

      <Arrow x1={CX} y1={1880} x2={CX} y2={2030} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 5: DERATING PARAMETERS                       */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={2000} h={780} label="PHASE 5: DERATING PARAMETERS — Temperature, Grouping & Installation Factors" color={C.orange.bd} />

      {/* Step 10: Manual Input — Col 17 */}
      <StepBadge x={BX - 30} y={2065} num={10} color={C.blue.bd} />
      <Parallelogram x={BX - 20} y={2030} w={BW + 40} h={BH}
        label="Col 17 — No. of Cable / Run"
        sub="Manual Entry: Number of parallel cables per circuit run"
        color={C.blue} badge="INPUT" />

      <Arrow x1={CX} y1={2100} x2={CX} y2={2160} />

      {/* Step 11: Fetch Derating Parameters — Col 18–26 */}
      <StepBadge x={BX - 80} y={2310} num={11} color={C.cyan.bd} />
      <ColumnCard x={BX - 60} y={2160} w={BW + 120}
        title={"🗄️ Fetch Derating Parameters from Cable Database"}
        fields={[
          { col: "Col 18", name: "Ambient Temperature Factor (k1)", type: "fetch" },
          { col: "Col 19", name: "Grouping Factor (k2)", type: "fetch" },
          { col: "Col 20", name: "Soil Thermal Resistivity Factor (k3)", type: "fetch" },
          { col: "Col 21", name: "Installation Depth Factor (k4)", type: "fetch" },
          { col: "Col 22", name: "Other Derating Factor (k5)", type: "fetch" },
          { col: "Col 23", name: "Reactance X (Ω/km)", type: "fetch" },
          { col: "Col 24", name: "Additional Cable Data", type: "fetch" },
          { col: "Col 25", name: "Additional Cable Data", type: "fetch" },
          { col: "Col 26", name: "Additional Cable Data", type: "fetch" },
        ]}
        color={C.cyan} />

      <Arrow x1={CX} y1={2580} x2={CX} y2={2640} />

      {/* Step 12: Total Derating Factor — Col 27 */}
      <StepBadge x={BX - 30} y={2675} num={12} color={C.green.bd} />
      <Box x={BX - 40} y={2640} w={BW + 80} h={BH}
        label="Col 27 — Total Derating Factor (Kt)"
        sub="Kt = k1 × k2 × k3 × k4 × k5 = Col 18 × Col 19 × Col 20 × Col 21 × Col 22"
        color={C.green} badge="CALC" />
      <FormulaBlock x={BX + BW + 80} y={2640} w={340} h={68} color={C.purple}
        lines={[
          "Kt = k1 × k2 × k3 × k4 × k5",
          "Col 27 = Col 18×19×20×21×22",
        ]} />

      <Arrow x1={CX} y1={2710} x2={CX} y2={2830} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 6: CABLE CAPACITY                            */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={2800} h={380} label="PHASE 6: CABLE CAPACITY — Derated & Effective Current Capacity" color={C.green.bd} />

      {/* Step 13: Derated Cable Capacity — Col 28 */}
      <StepBadge x={BX - 30} y={2865} num={13} color={C.green.bd} />
      <Box x={BX - 40} y={2830} w={BW + 80} h={BH}
        label="Col 28 — Derated Cable Capacity"
        sub="Derated Amps = Col 15 (Cable Current Capacity) × Col 27 (Kt)"
        color={C.green} badge="CALC" />
      <FormulaBlock x={BX + BW + 80} y={2830} w={340} h={50} color={C.purple}
        lines={[
          "Col 28 = Col 15 × Col 27",
        ]} />

      <Arrow x1={CX} y1={2900} x2={CX} y2={2960} />

      {/* Step 14: Effective Current Capacity — Col 29 */}
      <StepBadge x={BX - 30} y={2995} num={14} color={C.green.bd} />
      <Box x={BX - 40} y={2960} w={BW + 80} h={BH}
        label="Col 29 — Effective Current Capacity"
        sub="Effective Amps = Col 28 (Derated Amps) × Col 17 (No. of Cable / Run)"
        color={C.green} badge="CALC" />
      <FormulaBlock x={BX + BW + 80} y={2960} w={340} h={50} color={C.purple}
        lines={[
          "Col 29 = Col 28 × Col 17",
        ]} />

      <Arrow x1={CX} y1={3030} x2={CX} y2={3235} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 7: VOLTAGE DROP                              */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={3200} h={900} label="PHASE 7: VOLTAGE DROP — Calculation & Validation Check" color={C.rose.bd} />

      {/* Step 15: Voltage Drop Decision — Col 30 */}
      <StepBadge x={BX - 30} y={3295} num={15} color={C.amber.bd} />
      <Diamond cx={CX} cy={3295} rxD={180} ryD={60}
        label="Col 30 — Voltage Drop"
        sub="Decision: Supply Voltage?"
        color={C.amber} />

      {/* Left branch: 230V */}
      <Arrow x1={CX - 180} y1={3295} x2={280} y2={3295} color={C.amber.bd} />
      <text x={CX - 195} y={3288} textAnchor="end" fill={C.amber.tx} fontSize={11} fontWeight={700}>230 V</text>
      <Arrow x1={280} y1={3295} x2={280} y2={3400} color={C.amber.bd} />
      <FormulaBlock x={40} y={3400} w={480} h={120} color={C.cyan}
        lines={[
          "Case 1: Voltage = 230 V",
          "VD = (FLC × L × N × (R×0.8 + X×0.6))",
          "     / 1000",
          "VD = (Col6 × Col5 × Col17 ×",
          "     (Col16×0.8 + Col23×0.6)) / 1000",
        ]} />

      {/* Right branch: 415V */}
      <Arrow x1={CX + 180} y1={3295} x2={W - 280} y2={3295} color={C.amber.bd} />
      <text x={CX + 195} y={3288} fill={C.amber.tx} fontSize={11} fontWeight={700}>415 V</text>
      <Arrow x1={W - 280} y1={3295} x2={W - 280} y2={3400} color={C.amber.bd} />
      <FormulaBlock x={W - 520} y={3400} w={480} h={120} color={C.orange}
        lines={[
          "Case 2: Voltage = 415 V",
          "VD = 1.732 × FLC × L × N ×",
          "     (R×0.8 + X×0.6) / 1000",
          "VD = 1.732 × Col6 × Col5 × Col17 ×",
          "     (Col16×0.8 + Col23×0.6) / 1000",
        ]} />

      {/* Merge */}
      <Arrow x1={280} y1={3520} x2={280} y2={3570} color={C.arrow} />
      <Arrow x1={W - 280} y1={3520} x2={W - 280} y2={3570} color={C.arrow} />
      <line x1={280} y1={3570} x2={W - 280} y2={3570} stroke={C.arrow} strokeWidth={2.5} />
      <Arrow x1={CX} y1={3570} x2={CX} y2={3620} color={C.arrow} />

      <rect x={CX - 160} y={3620} width={320} height={40} rx={20}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={3645} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
        Col 30: Voltage Drop (Volts) — Calculated
      </text>

      <Arrow x1={CX} y1={3660} x2={CX} y2={3720} />

      {/* Step 16: % Voltage Drop — Col 31 */}
      <StepBadge x={BX - 30} y={3755} num={16} color={C.green.bd} />
      <Box x={BX - 40} y={3720} w={BW + 80} h={BH}
        label="Col 31 — % Voltage Drop"
        sub="% VD = (Voltage Drop / Supply Voltage) × 100 = (Col 30 / Col 3) × 100"
        color={C.green} badge="CALC" />
      <FormulaBlock x={BX + BW + 80} y={3720} w={320} h={50} color={C.purple}
        lines={[
          "Col 31 = (Col 30 / Col 3) × 100",
        ]} />

      <Arrow x1={CX} y1={3790} x2={CX} y2={3885} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 8: VALIDATION CHECK                          */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={3860} h={450} label="PHASE 8: VALIDATION CHECK — Voltage Drop Limit Compliance" color={C.rose.bd} />

      {/* Step 17: Validation Diamond */}
      <StepBadge x={BX - 30} y={3950} num={17} color={C.rose.bd} />
      <Diamond cx={CX} cy={3950} rxD={200} ryD={65}
        label="Is % VD < 6% ?"
        sub="Validation Gate"
        color={C.amber} />

      {/* YES branch — down */}
      <Arrow x1={CX} y1={4015} x2={CX} y2={4080} color={C.green.bd} />
      <rect x={CX - 30} y={4025} width={60} height={22} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={4040} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>YES</text>

      {/* Pass badge */}
      <rect x={CX - 120} y={4080} width={240} height={40} rx={20}
        fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={4105} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>
        {"✅"} VD within limits — Continue
      </text>

      {/* NO branch — right to warning */}
      <Arrow x1={CX + 200} y1={3950} x2={W - 300} y2={3950} color={C.reject} />
      <rect x={CX + 210} y={3938} width={40} height={22} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={CX + 230} y={3953} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>NO</text>

      {/* Warning Triangle */}
      <WarningTriangle cx={W - 220} cy={3940} size={60}
        label="ALERT: Voltage Drop Exceeds Limit!"
        sub="Re-select cable size or reduce run length"
        color={C.rose} />
      {/* Feedback loop arrow */}
      <path d={`M${W - 220},${4010} L${W - 220},${4060} Q${W - 220},${4080} ${W - 240},${4080} L${W - 380},${4080} Q${W - 400},${4080} ${W - 400},${4060} L${W - 400},${1780} Q${W - 400},${1760} ${W - 380},${1760} L${BX + BW + 40},${1760}`}
        fill="none" stroke={C.reject} strokeWidth={2} strokeDasharray="8,5" markerEnd="url(#csa-red)" />
      <rect x={W - 420} y={2400} width={100} height={22} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1} />
      <text x={W - 370} y={2415} textAnchor="middle" fill={C.rose.tx} fontSize={9} fontWeight={700}>Re-select Cable</text>

      <Arrow x1={CX} y1={4120} x2={CX} y2={4370} />

      {/* ══════════════════════════════════════════════════ */}
      {/* PHASE 9: FINAL OUTPUT                              */}
      {/* ══════════════════════════════════════════════════ */}
      <PhaseBand y={4330} h={420} label="PHASE 9: FINAL OUTPUT — Cable Quantity & Completion" color={C.green.bd} />

      {/* Step 18: Final Cable Quantity — Col 32 */}
      <StepBadge x={BX - 30} y={4410} num={18} color={C.green.bd} />
      <Box x={BX - 40} y={4370} w={BW + 80} h={BH + 10}
        label="Col 32 — Total Cable"
        sub="Total Cable = 2 × Col 17 (No. of Cable / Run)"
        color={C.teal} badge="OUTPUT" />
      <FormulaBlock x={BX + BW + 80} y={4380} w={300} h={50} color={C.purple}
        lines={[
          "Col 32 = 2 × Col 17",
        ]} />

      <Arrow x1={CX} y1={4450} x2={CX} y2={4510} />

      {/* Summary table */}
      <rect x={CX - 380} y={4510} width={760} height={110} rx={14}
        fill="#f8fafc" stroke={C.amber.bd} strokeWidth={2.5} />
      <rect x={CX - 380} y={4510} width={760} height={36} rx={14} fill={C.amber.bd} />
      <rect x={CX - 380} y={4534} width={760} height={12} fill={C.amber.bd} />
      <text x={CX} y={4536} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
        {"📊"} OUTPUT SUMMARY — Cable Sizing Results
      </text>
      {[
        ["Col 6: FLC (A)", "Col 9: Demand (kW)", "Col 14: Cable Size", "Col 27: Derating Kt"],
        ["Col 28: Derated A", "Col 29: Effective A", "Col 30: VD (V)", "Col 31: %VD"],
      ].map((row, ri) => (
        <g key={ri}>
          {row.map((cell, ci) => {
            const cw = 178;
            const cx2 = CX - 370 + ci * (cw + 8);
            const cy2 = 4558 + ri * 28;
            return (
              <g key={ci}>
                <rect x={cx2} y={cy2} width={cw} height={24} rx={6}
                  fill={ri === 0 ? C.green.bg : C.teal.bg}
                  stroke={ri === 0 ? C.green.bd : C.teal.bd} strokeWidth={1} />
                <text x={cx2 + cw / 2} y={cy2 + 16} textAnchor="middle"
                  fill={ri === 0 ? C.green.tx : C.teal.tx} fontSize={10} fontWeight={600}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}

      <Arrow x1={CX} y1={4620} x2={CX} y2={4680} />

      {/* Step 19: END */}
      <StepBadge x={BX - 30} y={4720} num={19} color={C.green.bd} />
      <Oval cx={CX} cy={4720} w={380} h={54}
        label={"🏁 END"}
        sub="Cable Sizing Calculation Completed"
        color={C.green} />

      {/* ══════════════════════════════════════════════════ */}
      {/* LEGEND                                             */}
      {/* ══════════════════════════════════════════════════ */}
      <rect x={40} y={4820} width={W - 80} height={170} rx={14}
        fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1.5} />
      <text x={80} y={4850} fill="#334155" fontSize={14} fontWeight={700}>
        {"📖"} LEGEND — Flowchart Symbols
      </text>

      {/* Row 1 */}
      {[
        { x: 80, label: "Start / End", shape: "oval", color: C.green },
        { x: 360, label: "Process / Calculation", shape: "rect", color: C.green },
        { x: 680, label: "User Input", shape: "para", color: C.blue },
        { x: 980, label: "Decision / Condition", shape: "diamond", color: C.amber },
        { x: 1300, label: "Database Fetch", shape: "cylinder", color: C.cyan },
      ].map((item, i) => {
        const iy = 4875;
        if (item.shape === "oval") {
          return (
            <g key={i}>
              <rect x={item.x} y={iy} width={60} height={24} rx={12}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "rect") {
          return (
            <g key={i}>
              <rect x={item.x} y={iy} width={60} height={24} rx={6}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        if (item.shape === "para") {
          return (
            <g key={i}>
              <polygon points={`${item.x + 8},${iy} ${item.x + 60},${iy} ${item.x + 52},${iy + 24} ${item.x},${iy + 24}`}
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
        { x: 80, label: "Validation Alert", color: C.rose },
        { x: 360, label: "Formula Block", color: C.purple },
        { x: 680, label: "Dropdown Selection", color: C.purple },
        { x: 980, label: "Auto-calculated", color: C.green },
        { x: 1300, label: "Reject / Re-loop", color: { bg: "#ffe4e6", bd: C.reject, tx: "#9f1239" } },
      ].map((item, i) => {
        const iy = 4920;
        if (i === 0) {
          return (
            <g key={i}>
              <polygon points={`${item.x + 20},${iy} ${item.x + 40},${iy + 24} ${item.x},${iy + 24}`}
                fill={item.color.bg} stroke={item.color.bd} strokeWidth={2} />
              <text x={item.x + 60} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
            </g>
          );
        }
        return (
          <g key={i}>
            <rect x={item.x} y={iy} width={60} height={24} rx={6}
              fill={item.color.bg} stroke={item.color.bd} strokeWidth={2}
              strokeDasharray={i === 4 ? "5,3" : "none"} />
            <text x={item.x + 80} y={iy + 16} fill="#475569" fontSize={11} fontWeight={600}>{item.label}</text>
          </g>
        );
      })}

      {/* Footer */}
      <text x={CX} y={4980} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        Electrical Cable Sizing & Voltage Drop Calculation — IS 3961 / IEC 60502 — MEP Digital Ecosystem
      </text>
    </svg>
  );
}
