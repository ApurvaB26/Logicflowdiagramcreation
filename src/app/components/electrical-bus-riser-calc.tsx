import React from "react";

// =====================================================================
// EBR — COMPREHENSIVE ELECTRICAL BUS RISER SYSTEM CALCULATION
// 11-Section Flowchart: Project Profile → Flat Unit Load → Maximum
// Demand → Floor Aggregation → Riser Diversity → Current Calc →
// Bus Bar Selection → Voltage Drop → Derating Matrix → Hardware BOM
// → Output Dashboard
// Project: Lodha Crown Tower-B | 132 Flats | 33F + Basement
// Standards: IS 732 / NBC 2016 / C&S Electric Sandwich AL
// =====================================================================

const W = 1600;
const H = 9800;
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
  red:    { bg: "#fee2e2", bd: "#dc2626", tx: "#991b1b" },
  arrow:  "#94a3b8",
  reject: "#ef4444",
};

/* ── Shared helper components ────────────────────────────────────── */

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

function Box({ x, y, w, h, label, sub, color, badge }: {
  x: number; y: number; w: number; h: number;
  label: string; sub: string;
  color: { bg: string; bd: string; tx: string };
  badge?: string;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#ebr-a)" />
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
  const getColW = (ci: number) => (colWidths ? (colWidths[ci] || defaultColW) : defaultColW) - 6;

  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>{title}</text>
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
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={getColX(ci)} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={getColW(ci)} height={rowH} rx={5}
                  fill={isTotal ? C.amber.bg : "#fff"}
                  stroke={isTotal ? C.amber.bd : "#e2e8f0"}
                  strokeWidth={isTotal ? 1.5 : 1} />
                <text x={getColX(ci) + getColW(ci) / 2 + 3} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle" fill={isTotal ? C.amber.tx : "#64748b"}
                  fontSize={10.5} fontWeight={isTotal ? 700 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function ValueBlock({ x, y, w, h, label, value, unit, color, icon }: {
  x: number; y: number; w: number; h: number;
  label: string; value: string; unit: string;
  color: { bg: string; bd: string; tx: string }; icon?: string;
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

// =====================================================================
// MAIN EXPORT
// =====================================================================
export function ElectricalBusRiserCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="ebr-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="ebr-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#eab308", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#ca8a04", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={90} fill="url(#ebr-hdr)" stroke="#ca8a04" strokeWidth={3} rx={14} />
      <text x={CX} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill="#422006">
        {"\u26A1"} ELECTRICAL BUS RISER — COMPREHENSIVE FLOWCHART
      </text>
      <text x={CX} y={74} textAnchor="middle" fontSize={13} fontWeight={600} fill="#78350f">
        IS 732 / NBC 2016 | Project: Lodha Crown Tower-B | 33F + Basement | C&S Sandwich AL
      </text>
      <text x={CX} y={94} textAnchor="middle" fontSize={11} fill="#a16207">
        Flat Load → Diversity → Floor Aggregation → Current Calc → Bus Bar Selection → Voltage Drop → Derating → BOM
      </text>

      {/* ============================================== */}
      {/* SECTION 1: PROJECT DATA & BUILDING PROFILE    */}
      {/* ============================================== */}
      <PhaseBand y={130} h={520} label="SECTION 1 — PROJECT DATA & BUILDING PROFILE" color={C.blue.bd} />

      <Box x={CX - 280} y={160} w={560} h={64} label="STEP 1: Fetch Building Profile"
        sub="Project: Lodha Crown Tower-B | 33F + 2B | Height: 112.2m | 132 Flats"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={224} x2={CX} y2={252} />

      <Box x={CX - 280} y={252} w={560} h={64} label="STEP 2: Electrical System Basis"
        sub="3-Phase + Neutral + Earth | 415V / 240V | C&S Sandwich Type AL Bus Duct"
        color={C.blue} badge="DB FETCH" />
      <Arrow x1={CX} y1={316} x2={CX} y2={350} />

      <DataTable x={CX - 390} y={350}
        title={"\u26A1 BUILDING ELECTRICAL PROFILE"}
        headers={["Parameter", "Value", "Unit", "Source"]}
        rows={[
          ["Total Floors", "33 + 2 Basement", "—", "Architect DWG"],
          ["Floor-to-Floor Height", "3.35", "m", "Structural"],
          ["Flats per Floor", "4 (2BHK + 3BHK mix)", "—", "Area Statement"],
          ["Total Flats", "132", "nos", "4 × 33"],
          ["Building Height", "112.2", "m", "Including parapet"],
          ["Flat Area (Typical 3BHK)", "1,200", "sqft", "Layout plan"],
          ["Supply Voltage", "415V (3Ph) / 240V (1Ph)", "V", "MSEDCL"],
          ["Power Factor (Design)", "0.85", "—", "NBC 2016"],
        ]}
        color={C.blue}
        colWidths={[220, 200, 120, 180]}
      />

      {/* ============================================== */}
      {/* SECTION 2: FLAT UNIT LOAD — FIXTURE INVENTORY */}
      {/* ============================================== */}
      <PhaseBand y={680} h={500} label="SECTION 2 — FLAT UNIT LOAD: FIXTURE INVENTORY" color={C.purple.bd} />

      <Arrow x1={CX} y1={672} x2={CX} y2={720} />

      <Box x={CX - 280} y={720} w={560} h={64} label="STEP 3: Enumerate Fixtures per Flat"
        sub="Typical 3BHK (1200 sqft): Lights, Fans, Sockets, ACs, Appliances"
        color={C.purple} badge="INPUT" />
      <Arrow x1={CX} y1={784} x2={CX} y2={814} />

      <DataTable x={CX - 390} y={814}
        title={"\U0001F4CB FLAT FIXTURE INVENTORY — Typical 3BHK (1200 sqft)"}
        headers={["Fixture Type", "Qty", "Watts Each", "Total (W)", "Notes"]}
        rows={[
          ["Light Points (LED)", "18", "12 W", "216", "Living+Bed+Kitchen"],
          ["Ceiling Fans (BLDC)", "5", "75 W", "375", "3 Bed + 2 Hall"],
          ["6A Sockets (General)", "12", "100 W", "1,200", "Chargers, TV, etc."],
          ["16A Sockets (Heavy)", "8", "500 W", "4,000", "Fridge, Microwave, WM"],
          ["Air Conditioners (1.5TR)", "3", "1,500 W", "4,500", "Per TR = 1000W"],
          ["Connected Load (CL)", "—", "—", "10,291 W", "\u2248 10.3 kW per flat"],
        ]}
        color={C.purple}
        colWidths={[200, 70, 120, 120, 210]}
      />

      <NoteBox x={60} y={814} w={280} h={110} icon={"\U0001F4A1"} title="Load Assumptions"
        lines={["LED lights: 12W (replaces 60W)", "BLDC fans: 75W (replaces 120W)", "AC: 1.5TR \u2248 1500W cooling", "16A: Fridge, Microwave, WM", "Future provision included"]}
        color={C.purple} />

      {/* ============================================== */}
      {/* SECTION 3: MAXIMUM DEMAND — DIVERSITY FACTOR  */}
      {/* ============================================== */}
      <PhaseBand y={1200} h={500} label="SECTION 3 — MAXIMUM DEMAND WITH DIVERSITY FACTOR" color={C.amber.bd} />

      <Arrow x1={CX} y1={1190} x2={CX} y2={1240} />

      <Box x={CX - 280} y={1240} w={560} h={64} label="STEP 4: Apply Diversity Factor (DF)"
        sub="Not all fixtures operate simultaneously — Apply DF per Lodha MEP Policy"
        color={C.amber} badge="CALC" />
      <Arrow x1={CX} y1={1304} x2={CX} y2={1334} />

      <FormulaBlock x={CX - 340} y={1334} w={680} h={108}
        lines={[
          "Maximum Demand (MD) per Flat:",
          "MD = Connected Load (CL) \u00D7 Diversity Factor (DF)",
          "MD = 10,291 W \u00D7 0.60 = 6,175 W",
          "MD PER FLAT = 6.18 kW (Real-World Peak Load)",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={1442} x2={CX} y2={1472} />

      {/* Diversity Factor Decision */}
      <Diamond cx={CX} cy={1528} rxD={160} ryD={55} label="DF Selection?"
        sub="By occupancy type" color={C.amber} />

      <Arrow x1={CX - 160} y1={1528} x2={180} y2={1528} color={C.blue.bd} label="Office: 0.70" />
      <NoteBox x={60} y={1495} w={220} h={70} icon={"\U0001F3E2"} title="Office / Commercial"
        lines={["DF = 0.70 (70%)", "Higher simultaneity"]}
        color={C.blue} />

      <Arrow x1={CX + 160} y1={1528} x2={W - 180} y2={1528} color={C.rose.bd} label="Retail: 0.80" />
      <NoteBox x={W - 300} y={1495} w={220} h={70} icon={"\U0001F6CD\uFE0F"} title="Retail / Mall"
        lines={["DF = 0.80 (80%)", "Continuous operation"]}
        color={C.rose} />

      <Arrow x1={CX} y1={1583} x2={CX} y2={1614} color={C.amber.bd} label="Residential: 0.60" />

      <Box x={CX - 280} y={1614} w={560} h={64}
        label="Residential DF = 0.60 Selected (Lodha Policy)"
        sub="MD = 10,291 W \u00D7 0.60 = 6,175 W \u2248 6.18 kW per flat"
        color={C.green} badge="SELECTED" />

      <NoteBox x={60} y={1600} w={280} h={90} icon={"\U0001F4CB"} title="NBC 2016 DF Reference"
        lines={["Residential: 0.55–0.65", "Office: 0.65–0.75", "Retail: 0.75–0.85", "Hospital: 0.80–0.90"]}
        color={C.slate} />

      {/* ============================================== */}
      {/* SECTION 4: FLOOR LOAD AGGREGATION            */}
      {/* ============================================== */}
      <PhaseBand y={1720} h={460} label="SECTION 4 — FLOOR LOAD AGGREGATION (VERTICAL SPINE)" color={C.teal.bd} />

      <Arrow x1={CX} y1={1688} x2={CX} y2={1760} />

      <Box x={CX - 280} y={1760} w={560} h={64} label="STEP 5: Calculate Per-Floor Load"
        sub="4 flats/floor \u00D7 6.18 kW/flat = 24.72 kW per floor"
        color={C.teal} badge="CALC" />
      <Arrow x1={CX} y1={1824} x2={CX} y2={1854} />

      <DataTable x={CX - 390} y={1854}
        title={"\U0001F3E2 FLOOR LOAD AGGREGATION TABLE"}
        headers={["Floor Group", "Floors", "Flats/Floor", "MD/Flat (kW)", "Floor Load (kW)"]}
        rows={[
          ["Low Zone", "1–10", "4", "6.18", "24.72"],
          ["Mid Zone", "11–20", "4", "6.18", "24.72"],
          ["High Zone", "21–33", "4", "6.18", "24.72"],
          ["Total (33 Floors)", "1–33", "132 flats", "—", "815.76 kW"],
        ]}
        color={C.teal}
        colWidths={[160, 120, 130, 160, 150]}
      />

      <NoteBox x={W - 340} y={1854} w={280} h={100} icon={"\U0001F4CA"} title="Aggregation Check"
        lines={["33 floors \u00D7 4 flats = 132 flats", "132 \u00D7 6.18 kW = 815.76 kW", "This is BEFORE riser DF", "Actual load will be lower"]}
        color={C.teal} />

      {/* ============================================== */}
      {/* SECTION 5: BUS RISER DIVERSITY & DESIGN LOAD */}
      {/* ============================================== */}
      <PhaseBand y={2190} h={460} label="SECTION 5 — BUS RISER DIVERSITY & TOTAL DESIGN LOAD" color={C.orange.bd} />

      <Arrow x1={CX} y1={2180} x2={CX} y2={2230} />

      <Box x={CX - 280} y={2230} w={560} h={64} label="STEP 6: Apply Riser Diversity Factor (DF\u2082)"
        sub="Entire building diversity — not all floors at peak simultaneously"
        color={C.orange} badge="CALC" />
      <Arrow x1={CX} y1={2294} x2={CX} y2={2324} />

      <FormulaBlock x={CX - 340} y={2324} w={680} h={128}
        lines={[
          "Bus Riser Total Design Load:",
          "DF\u2082 = 0.40 (40% simultaneous load across building)",
          "",
          "Bus Riser Demand = Total Floor Load \u00D7 DF\u2082",
          "= 815.76 kW \u00D7 0.40 = 326.30 kW",
          "TOTAL BUS RISER DESIGN LOAD = 326.30 kW",
        ]}
        color={C.orange} />

      <NoteBox x={60} y={2324} w={280} h={110} icon={"\U0001F4A1"} title="Why DF\u2082 = 0.40?"
        lines={["132 flats in single tower", "Staggered usage patterns", "Not all ACs + kitchens on", "simultaneously across 33 floors", "Lodha policy: 0.35–0.45 typical"]}
        color={C.orange} />

      <Arrow x1={CX} y1={2452} x2={CX} y2={2482} />

      <Box x={CX - 280} y={2482} w={560} h={64}
        label="Bus Riser Design Load = 326.30 kW"
        sub="132 Flats \u00D7 6.18 kW \u00D7 0.40 DF\u2082 | Used for Bus Duct sizing"
        color={C.green} badge="OUTPUT" />

      {/* ============================================== */}
      {/* SECTION 6: CURRENT CALCULATION (AMPERE)      */}
      {/* ============================================== */}
      <PhaseBand y={2580} h={460} label="SECTION 6 — CURRENT CALCULATION (AMPERE RATING)" color={C.cyan.bd} />

      <Arrow x1={CX} y1={2556} x2={CX} y2={2620} />

      <Box x={CX - 280} y={2620} w={560} h={64} label="STEP 7: Calculate Design Current"
        sub="3-Phase system: I = kW \u00D7 1000 / (\u221A3 \u00D7 V \u00D7 pf)"
        color={C.cyan} badge="FORMULA" />
      <Arrow x1={CX} y1={2684} x2={CX} y2={2714} />

      <FormulaBlock x={CX - 360} y={2714} w={720} h={148}
        lines={[
          "3-Phase Current Calculation:",
          "I = (kW \u00D7 1000) / (\u221A3 \u00D7 V \u00D7 pf)",
          "",
          "Where: kW = 326.30, V = 415V, pf = 0.85",
          "I = 326,300 / (1.732 \u00D7 415 \u00D7 0.85)",
          "I = 326,300 / 611.42 = 533.7 Amps",
          "I_calc = 534 Amps (rounded up)",
        ]}
        color={C.cyan} />

      <NoteBox x={W - 340} y={2714} w={280} h={110} icon={"\U0001F4D0"} title="Design Parameters"
        lines={["V = 415V (3-Phase line-to-line)", "pf = 0.85 (residential mixed)", "\u221A3 = 1.732", "Current rounded UP for safety", "Per IS 732 / NBC 2016"]}
        color={C.cyan} />

      <Arrow x1={CX} y1={2862} x2={CX} y2={2892} />

      <Box x={CX - 280} y={2892} w={560} h={64}
        label="Calculated Current I = 534 Amps"
        sub="At 415V, pf=0.85 for 326.30 kW bus riser design load"
        color={C.green} badge="RESULT" />

      {/* ============================================== */}
      {/* SECTION 7: BUS BAR SELECTION (90% RULE)      */}
      {/* ============================================== */}
      <PhaseBand y={2990} h={560} label="SECTION 7 — BUS BAR SELECTION & 90% LOADING RULE" color={C.violet.bd} />

      <Arrow x1={CX} y1={2966} x2={CX} y2={3030} />

      <Box x={CX - 280} y={3030} w={560} h={64} label="STEP 8: Apply 90% Loading Safety Limit"
        sub="Bus bar must not exceed 90% of rated capacity for thermal safety"
        color={C.violet} badge="RULE" />
      <Arrow x1={CX} y1={3094} x2={CX} y2={3124} />

      <FormulaBlock x={CX - 340} y={3124} w={680} h={90}
        lines={[
          "Minimum Required Rating:",
          "I_min = I_calc / 0.90 = 534 / 0.90 = 593 Amps",
          "Next higher standard: 630A (from 400/630/800/1000/1600)",
        ]}
        color={C.violet} />
      <Arrow x1={CX} y1={3214} x2={CX} y2={3244} />

      <DataTable x={CX - 390} y={3244}
        title={"\U0001F50C STANDARD BUS BAR RATING SELECTION TABLE"}
        headers={["Rating (A)", "mV/mtr/A", "System Type", "Loading @534A", "Status"]}
        rows={[
          ["400A", "0.038", "3Ph+1E+1N Sandwich AL", "133.5%", "\u274C Overloaded"],
          ["630A \u2713", "0.029", "3Ph+1E+1N Sandwich AL", "84.8%", "\u2705 Selected"],
          ["800A", "0.024", "3Ph+1E+1N Sandwich AL", "66.8%", "\u26A0\uFE0F Oversized"],
          ["1000A", "0.020", "3Ph+1E+1N Sandwich AL", "53.4%", "\u26A0\uFE0F Oversized"],
          ["1600A", "0.015", "3Ph+1E+1N Sandwich AL", "33.4%", "\u26A0\uFE0F Oversized"],
        ]}
        color={C.violet}
        colWidths={[130, 120, 230, 140, 120]}
      />

      <Arrow x1={CX} y1={3508} x2={CX} y2={3538} />

      {/* Selection Diamond */}
      <Diamond cx={CX} cy={3538} rxD={0} ryD={0} label="" sub="" color={C.amber} />

      <Box x={CX - 280} y={3508} w={560} h={64}
        label="Selected: 630A C&S Sandwich Type AL"
        sub="Loading: 534A / 630A = 84.8% \u2705 Within 90% safety limit"
        color={C.green} badge="SELECTED" />

      {/* ============================================== */}
      {/* SECTION 8: VOLTAGE DROP CALCULATION           */}
      {/* ============================================== */}
      <PhaseBand y={3610} h={560} label="SECTION 8 — VOLTAGE DROP CALCULATION & VALIDATION" color={C.amber.bd} />

      <Arrow x1={CX} y1={3582} x2={CX} y2={3650} />

      <Box x={CX - 280} y={3650} w={560} h={64} label="STEP 9: Calculate Voltage Drop"
        sub="Cumulative height method using C&S vendor data (mV/mtr/A)"
        color={C.amber} badge="CALC" />
      <Arrow x1={CX} y1={3714} x2={CX} y2={3744} />

      <FormulaBlock x={CX - 360} y={3744} w={720} h={168}
        lines={[
          "Voltage Drop Calculation:",
          "Vd = I \u00D7 L \u00D7 (mV/mtr/A) / 1000",
          "",
          "I = 534 Amps (design current)",
          "L = 33 floors \u00D7 3.35m + 15m horizontal = 125.55 m",
          "mV/mtr/A = 0.029 (630A C&S Sandwich AL)",
          "",
          "Vd = 534 \u00D7 125.55 \u00D7 0.029 / 1000 = 1.945 V",
        ]}
        color={C.amber} />

      <NoteBox x={60} y={3744} w={280} h={110} icon={"\U0001F4CF"} title="Length Breakdown"
        lines={["Vertical: 33 \u00D7 3.35m = 110.55m", "Horizontal: 15.0m (basement)", "Total: 125.55m", "From: Basement LT Panel", "To: Terrace termination"]}
        color={C.slate} />

      <Arrow x1={CX} y1={3912} x2={CX} y2={3950} />

      {/* VD Decision */}
      <Diamond cx={CX} cy={4010} rxD={180} ryD={55} label="Vd \u2264 3% of 415V?"
        sub="IS 732 permissible limit" color={C.amber} />

      <Arrow x1={CX} y1={4065} x2={CX} y2={4100} color={C.green.bd} label="0.47% \u2264 3% \u2713 PASS" />

      <Arrow x1={CX + 180} y1={4010} x2={W - 160} y2={4010} color={C.rose.bd} label="If > 3%" />
      <NoteBox x={W - 340} y={3975} w={280} h={90} icon={"\u26A0\uFE0F"} title="If V.D. Fails"
        lines={["Increase bus bar rating", "Or reduce run length", "Or add sub-distribution", "Check IS 732 Clause 5.4"]}
        color={C.rose} />

      <Box x={CX - 280} y={4100} w={560} h={64}
        label="Voltage Drop = 1.95V (0.47% of 415V)"
        sub="\u2705 PASS — Well within 3% IS 732 permissible limit | Margin: 2.53%"
        color={C.green} badge="PASS" />

      {/* ============================================== */}
      {/* SECTION 9: TEMPERATURE DERATING MATRIX       */}
      {/* ============================================== */}
      <PhaseBand y={4210} h={560} label="SECTION 9 — TEMPERATURE DERATING & AMBIENT CORRECTION" color={C.rose.bd} />

      <Arrow x1={CX} y1={4174} x2={CX} y2={4250} />

      <Box x={CX - 280} y={4250} w={560} h={64} label="STEP 10: Temperature Derating Check"
        sub="Bus bar capacity reduces at higher ambient temperatures"
        color={C.rose} badge="DERATING" />
      <Arrow x1={CX} y1={4314} x2={CX} y2={4344} />

      <DataTable x={CX - 390} y={4344}
        title={"\U0001F321\uFE0F TEMPERATURE DERATING MATRIX (630A BASE)"}
        headers={["Ambient (\u00B0C)", "Derating Factor", "Effective (A)", "534A Safe?", "Notes"]}
        rows={[
          ["35\u00B0C", "1.00", "630A (100%)", "\u2705 YES", "Standard rated temp"],
          ["40\u00B0C", "0.96", "605A (96%)", "\u2705 YES", "Mumbai typical"],
          ["45\u00B0C", "0.91", "573A (91%)", "\u2705 YES", "Enclosed room / summer"],
          ["50\u00B0C", "0.86", "542A (86%)", "\u2705 YES*", "Forced ventilation needed"],
          ["55\u00B0C", "0.82", "517A (82%)", "\u274C NO", "Exceeds — upsize to 800A"],
        ]}
        color={C.rose}
        colWidths={[130, 140, 150, 120, 200]}
      />

      <Arrow x1={CX} y1={4610} x2={CX} y2={4640} />

      {/* Derating Decision */}
      <Diamond cx={CX} cy={4700} rxD={180} ryD={55} label="Ambient \u2264 50\u00B0C?"
        sub="Critical temperature threshold" color={C.amber} />

      <Arrow x1={CX} y1={4755} x2={CX} y2={4790} color={C.green.bd} label="Mumbai 40\u00B0C \u2713" />

      <Arrow x1={CX + 180} y1={4700} x2={W - 160} y2={4700} color={C.rose.bd} label="> 50\u00B0C" />
      <NoteBox x={W - 340} y={4665} w={280} h={90} icon={"\U0001F534"} title="If Temp > 50\u00B0C"
        lines={["Upsize to 800A bus bar", "Or add forced ventilation", "Or insulate riser shaft", "Check C&S derating curves"]}
        color={C.rose} />

      <Box x={CX - 280} y={4790} w={560} h={64}
        label="Derated: 605A @ 40\u00B0C \u2014 534A still safe"
        sub="\u2705 PASS — At Mumbai ambient (40\u00B0C), effective capacity = 605A > 534A"
        color={C.green} badge="PASS" />

      {/* ============================================== */}
      {/* SECTION 10: VALIDATION GATE — ALL 3 CHECKS   */}
      {/* ============================================== */}
      <PhaseBand y={4890} h={340} label="SECTION 10 — TRIPLE VALIDATION GATE" color={C.green.bd} />

      <Arrow x1={CX} y1={4864} x2={CX} y2={4930} />

      <g>
        <rect x={CX - 380} y={4930} width={760} height={170} rx={16}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
        <text x={CX} y={4960} textAnchor="middle" fill={C.green.tx} fontSize={16} fontWeight={800}>
          {"\u2705"} TRIPLE VALIDATION GATE — ALL CHECKS PASSED
        </text>
        {/* Check 1 */}
        <rect x={CX - 360} y={4975} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={4995} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Current Check: I_calc (534A) {"<"} I_rated (630A) — PASS (Margin: 96A / 15.2%)
        </text>
        {/* Check 2 */}
        <rect x={CX - 360} y={5010} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={5030} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Voltage Drop: 0.47% {"<"} 3.0% (IS 732 limit) — PASS (Margin: 2.53%)
        </text>
        {/* Check 3 */}
        <rect x={CX - 360} y={5045} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={5065} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Derating: 605A @ 40\u00B0C {">"} 534A — PASS (Margin: 71A / 13.3%)
        </text>
      </g>

      {/* ============================================== */}
      {/* SECTION 11: HARDWARE INVENTORY & BOM         */}
      {/* ============================================== */}
      <PhaseBand y={5260} h={560} label="SECTION 11 — HARDWARE BILL OF MATERIALS (BOM)" color={C.blue.bd} />

      <Arrow x1={CX} y1={5240} x2={CX} y2={5300} />

      <Box x={CX - 280} y={5300} w={560} h={64} label="STEP 11: Automated Hardware Count"
        sub="Component quantities derived from floor count, flat count, and riser length"
        color={C.blue} badge="BOM" />
      <Arrow x1={CX} y1={5364} x2={CX} y2={5394} />

      <DataTable x={CX - 390} y={5394}
        title={"\U0001F4E6 BUS RISER HARDWARE — BILL OF MATERIALS"}
        headers={["Component", "Rating/Size", "Qty", "Location", "Notes"]}
        rows={[
          ["Bus Duct (Main Riser)", "630A", "126 m", "Bsmt → Terrace", "C&S Sandwich AL 3Ph+1E+1N"],
          ["Tap-Off Units (Floor DB)", "125A", "33", "Each floor", "Feeds 4 flats (35A/floor)"],
          ["Tap-Off Units (Common)", "160A", "5", "Bsmt/Lobby/Terr", "Lifts, HVAC, common light"],
          ["Bus Duct Reducer", "630A→400A", "1", "Floor 20", "Load reduces above F20"],
          ["Bus Duct End Cap", "630A", "1", "Terrace", "IP65 weatherproof"],
          ["EFU (Feed Unit)", "630A MCCB", "1", "Basement", "From Main LT Panel"],
          ["Support Brackets (MS)", "Heavy Duty", "45", "Every 3m vert.", "42 + 3 spares"],
          ["Earthing Lugs (Cu)", "50mm\u00B2", "38", "All tap-offs+EFU", "33+5+1=39 (\u224838)"],
          ["Total Components", "—", "—", "—", "Complete BOM"],
        ]}
        color={C.blue}
        colWidths={[190, 120, 70, 160, 200]}
      />

      {/* ============================================== */}
      {/* SECTION 12: FLOOR-BY-FLOOR V.D. PROFILE      */}
      {/* ============================================== */}
      <PhaseBand y={5850} h={560} label="SECTION 12 — FLOOR-BY-FLOOR VOLTAGE DROP PROFILE" color={C.violet.bd} />

      <Arrow x1={CX} y1={5830} x2={CX} y2={5890} />

      <Box x={CX - 280} y={5890} w={560} h={64} label="STEP 12: Cumulative V.D. at Each Zone"
        sub="Voltage drop increases with distance from basement EFU"
        color={C.violet} badge="ANALYSIS" />
      <Arrow x1={CX} y1={5954} x2={CX} y2={5984} />

      <DataTable x={CX - 390} y={5984}
        title={"\U0001F4CA FLOOR-BY-FLOOR VOLTAGE DROP PROFILE"}
        headers={["Floor", "Height (m)", "Cum. Length", "Vd (V)", "Vd (%)", "Status"]}
        rows={[
          ["B2 (EFU)", "0.0", "15.0 m", "0.23", "0.06%", "\u2705 Origin"],
          ["GF", "3.35", "18.35 m", "0.28", "0.07%", "\u2705 OK"],
          ["5F", "20.1", "35.1 m", "0.54", "0.13%", "\u2705 OK"],
          ["10F", "36.85", "51.85 m", "0.80", "0.19%", "\u2705 OK"],
          ["15F", "53.6", "68.6 m", "1.06", "0.26%", "\u2705 OK"],
          ["20F", "70.35", "85.35 m", "1.32", "0.32%", "\u2705 OK"],
          ["25F", "87.1", "102.1 m", "1.58", "0.38%", "\u2705 OK"],
          ["30F", "103.85", "118.85 m", "1.84", "0.44%", "\u2705 OK"],
          ["33F (Top)", "112.2", "127.2 m", "1.97", "0.47%", "\u2705 OK"],
        ]}
        color={C.violet}
        colWidths={[110, 110, 120, 100, 100, 100]}
      />

      <NoteBox x={60} y={5984} w={280} h={100} icon={"\U0001F4A1"} title="V.D. Profile Notes"
        lines={["V.D. increases linearly", "Worst case at topmost floor", "All floors < 0.5% V.D.", "Well within 3% IS 732 limit", "No additional measures needed"]}
        color={C.violet} />

      {/* ============================================== */}
      {/* SECTION 13: COMPARATIVE ANALYSIS              */}
      {/* ============================================== */}
      <PhaseBand y={6440} h={500} label="SECTION 13 — MATERIAL & COST COMPARATIVE ANALYSIS" color={C.slate.bd} />

      <Arrow x1={CX} y1={6420} x2={CX} y2={6480} />

      <DataTable x={CX - 390} y={6480}
        title={"\U0001F4B0 BUS DUCT MATERIAL COMPARISON — AL vs CU"}
        headers={["Parameter", "Aluminium (Selected)", "Copper (Alternative)", "Remark"]}
        rows={[
          ["Conductor Material", "Aluminium", "Copper", "C&S standard options"],
          ["Weight (kg/m)", "12.5", "22.0", "AL is 43% lighter"],
          ["mV/mtr/A @ 630A", "0.029", "0.018", "CU has lower V.D."],
          ["V.D. for this project", "1.95V (0.47%)", "1.21V (0.29%)", "Both within 3%"],
          ["Approx. Cost/meter", "\u20B9 4,200", "\u20B9 8,500", "CU is 2\u00D7 costlier"],
          ["IP Rating", "IP54", "IP54", "Same enclosure"],
          ["Short Circuit Rating", "40kA / 1sec", "50kA / 1sec", "CU slightly better"],
          ["Recommendation", "\u2705 SELECTED", "Use if V.D. critical", "AL is cost-effective"],
        ]}
        color={C.slate}
        colWidths={[180, 210, 210, 160]}
      />

      <NoteBox x={60} y={6480} w={280} h={100} icon={"\U0001F4A1"} title="Selection Rationale"
        lines={["AL Sandwich selected for:", "• Cost optimization (50% less)", "• Sufficient V.D. margin", "• Adequate fault rating", "• Standard for residential"]}
        color={C.slate} />

      <Arrow x1={CX} y1={6790} x2={CX} y2={6820} />

      {/* Single Line Diagram reference */}
      <Box x={CX - 340} y={6820} w={680} h={80}
        label="ELECTRICAL RISER SINGLE LINE DIAGRAM (SLD)"
        sub="Main LT Panel → 630A MCCB (EFU) → 630A Bus Duct Riser → 33\u00D7 125A Tap-offs → Floor DBs → 4\u00D7 Flat MCBs"
        color={C.cyan} badge="SLD REF" />

      {/* ============================================== */}
      {/* SECTION 14: COMPREHENSIVE OUTPUT DASHBOARD    */}
      {/* ============================================== */}
      <PhaseBand y={6950} h={620} label="SECTION 14 — ELECTRICAL BUS RISER OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={6910} x2={CX} y2={7000} />

      {/* Dashboard KPI row 1 */}
      <ValueBlock x={60} y={7000} w={220} h={95} label="Design Load" value="326.3" unit="kW" color={C.amber} icon={"\u26A1"} />
      <ValueBlock x={300} y={7000} w={220} h={95} label="Design Current" value="534 A" unit="@ 415V, pf=0.85" color={C.cyan} icon={"\U0001F50C"} />
      <ValueBlock x={540} y={7000} w={220} h={95} label="Bus Bar Rating" value="630 A" unit="C&S Sandwich AL" color={C.violet} icon={"\U0001F3ED"} />
      <ValueBlock x={780} y={7000} w={220} h={95} label="Loading" value="84.8%" unit="Within 90% limit" color={C.green} icon={"\u2705"} />
      <ValueBlock x={1020} y={7000} w={220} h={95} label="Voltage Drop" value="0.47%" unit="1.95V of 415V" color={C.amber} icon={"\U0001F4C9"} />
      <ValueBlock x={1260} y={7000} w={220} h={95} label="Riser Length" value="126 m" unit="Bsmt to Terrace" color={C.blue} icon={"\U0001F3D7\uFE0F"} />

      {/* Dashboard KPI row 2 */}
      <ValueBlock x={60} y={7120} w={220} h={95} label="Total Flats" value="132" unit="4/floor \u00D7 33F" color={C.teal} icon={"\U0001F3E0"} />
      <ValueBlock x={300} y={7120} w={220} h={95} label="MD per Flat" value="6.18" unit="kW (DF=0.60)" color={C.purple} icon={"\U0001F4A1"} />
      <ValueBlock x={540} y={7120} w={220} h={95} label="Tap-Off Units" value="38" unit="33 Floor + 5 Common" color={C.orange} icon={"\U0001F527"} />
      <ValueBlock x={780} y={7120} w={220} h={95} label="Support Brackets" value="45" unit="Every 3m vertical" color={C.slate} icon={"\U0001F529"} />
      <ValueBlock x={1020} y={7120} w={220} h={95} label="Derated @40\u00B0C" value="605 A" unit="534A still safe" color={C.rose} icon={"\U0001F321\uFE0F"} />
      <ValueBlock x={1260} y={7120} w={220} h={95} label="Vendor" value="C&S" unit="Electric India" color={C.blue} icon={"\U0001F3ED"} />

      {/* Stacked Load Breakdown */}
      <g>
        <rect x={60} y={7250} width={W - 120} height={180} rx={14} fill="#f0f9ff" stroke={C.blue.bd} strokeWidth={3} strokeDasharray="10,5" />
        <text x={CX} y={7280} textAnchor="middle" fill={C.blue.tx} fontSize={15} fontWeight={700}>
          {"\U0001F4CA"} BUS RISER LOAD FLOW — DIVERSITY CASCADE
        </text>

        {/* Bar chart representation */}
        <rect x={120} y={7310} width={400} height={36} rx={6} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
        <text x={320} y={7333} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={700}>
          Connected Load: 10.3 kW/flat \u00D7 132 = 1,359 kW (100%)
        </text>

        <rect x={120} y={7354} width={290} height={36} rx={6} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} />
        <text x={265} y={7377} textAnchor="middle" fill={C.amber.tx} fontSize={12} fontWeight={700}>
          After Flat DF (0.60): 815.76 kW (60%)
        </text>

        <rect x={120} y={7398} width={160} height={36} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
        <text x={200} y={7421} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>
          After Riser DF (0.40): 326.3 kW (24%)
        </text>

        <text x={950} y={7340} fill={C.slate.tx} fontSize={11}>Connected Load: 1,359 kW</text>
        <text x={950} y={7360} fill={C.slate.tx} fontSize={11}>\u00D7 Flat DF 0.60 = 815.76 kW</text>
        <text x={950} y={7380} fill={C.slate.tx} fontSize={11}>\u00D7 Riser DF 0.40 = 326.30 kW</text>
        <text x={950} y={7400} fill={C.slate.tx} fontSize={12} fontWeight={700}>Final: 326.3 kW → 534A → 630A Bus Bar</text>
      </g>

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={7440} x2={CX} y2={7480} />
      <rect x={CX - 200} y={7480} width={400} height={56} rx={28}
        fill="#ca8a04" stroke="#eab308" strokeWidth={3} />
      <text x={CX} y={7514} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"\U0001F3C1"} EBR CALCULATION COMPLETE
      </text>

      {/* ============================================== */}
      {/* REFERENCE: ELECTRICAL ↔ PLUMBING COMPARISON   */}
      {/* ============================================== */}
      <PhaseBand y={7580} h={380} label="REFERENCE — ELECTRICAL vs PLUMBING TECHNICAL DEPTH COMPARISON" color={C.slate.bd} />

      <DataTable x={CX - 390} y={7620}
        title={"\U0001F4CA ELECTRICAL BUS RISER vs PLUMBING RISER — DESIGN PARALLELS"}
        headers={["Electrical Concept", "Plumbing Equivalent", "Unit"]}
        rows={[
          ["Connected Load (kW)", "Design Flow Rate (LPM)", "kW / LPM"],
          ["Diversity Factor (0.40–0.60)", "Simultaneity Factor (0.5–0.7)", "Ratio"],
          ["Voltage Drop (%)", "Friction Head Loss (Bar)", "% / Bar"],
          ["Bus Bar Size (630A)", "Pipe Diameter (DN100)", "A / mm"],
          ["Tap-Off Unit (125A)", "Floor Valve / Branch", "A / DN"],
          ["MCCB Rating (Amps)", "PRV Setting (Bar)", "A / Bar"],
          ["Temperature Derating", "Pipe Material Hazen C", "Factor"],
          ["Phase Balance (R-Y-B)", "Zone Balance (High/Low)", "—"],
        ]}
        color={C.slate}
        colWidths={[270, 270, 120]}
      />

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 40} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        EBR-001 | Electrical Bus Riser System | Lodha Crown Tower-B | Rev 02 | IS 732 / NBC 2016 / C&S Electric
      </text>
    </svg>
  );
}
