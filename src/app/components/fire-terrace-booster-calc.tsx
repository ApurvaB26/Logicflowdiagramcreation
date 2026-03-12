import React from "react";

// =====================================================================
// FTB — COMPREHENSIVE TERRACE FIRE BOOSTER PUMP HEAD CALCULATION
// 10-Section Flow: Building & Tank Data → Pipe Material → Hazen-Williams
// → Fitting Equiv Lengths → Friction Summation → +20% Safety → Static
// Head → Residual Pressure → Total Head → Output Dashboard
// Project: Lodha Crown Tower-B | GI Class C | C=120 | 900 LPM
// =====================================================================

const W = 1600;
const H = 7400;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#ftb-a)" />
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
export function FireTerraceBoosterCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="ftb-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="ftb-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={90} fill="url(#ftb-hdr)" stroke="#991b1b" strokeWidth={3} rx={14} />
      <text x={CX} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill="#fff">
        {"🏗️"} TERRACE FIRE BOOSTER PUMP HEAD — COMPREHENSIVE
      </text>
      <text x={CX} y={74} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fecaca">
        GI Class C Pipe | Hazen-Williams C=120 | 900 LPM Design Flow | IS-15105 / NBC Part 4
      </text>
      <text x={CX} y={94} textAnchor="middle" fontSize={11} fill="#fca5a5">
        Terrace Tank LWL → Straight Run + Fitting Equiv → +20% Safety → Static + 3.5 Bar Residual → Total Head
      </text>

      {/* ============================================== */}
      {/* SECTION 1: BUILDING & TERRACE TANK DATA       */}
      {/* ============================================== */}
      <PhaseBand y={130} h={480} label="SECTION 1 — BUILDING & TERRACE TANK DATA" color={C.blue.bd} />

      <Box x={CX - 280} y={160} w={560} h={64} label="STEP 1: Building Profile & Terrace Tank Location"
        sub="32F + 2B | Terrace Tank at Roof Level | LWL: 109.5m from ground"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={224} x2={CX} y2={252} />

      <Box x={CX - 280} y={252} w={560} h={64} label="STEP 2: Outlet & Supply Points"
        sub="Lowest hydrant outlet: 3.35m (1F) | Terrace hydrant: 108.85m (32F)"
        color={C.blue} badge="DB FETCH" />
      <Arrow x1={CX} y1={316} x2={CX} y2={350} />

      <DataTable x={CX - 390} y={350}
        title={"🏗️ TERRACE BOOSTER — BUILDING & TANK DATA"}
        headers={["Parameter", "Value", "Unit", "Source"]}
        rows={[
          ["Building Height", "112.2", "m", "Architect DWG"],
          ["Terrace Tank LWL", "109.5", "m", "Structural DWG"],
          ["Terrace Tank HWL", "112.0", "m", "Tank design"],
          ["Tank Capacity", "30.0", "m\u00B3", "Fire reserve"],
          ["Lowest Outlet (1F)", "3.35", "m", "Floor plan"],
          ["Highest Outlet (32F)", "108.85", "m", "Floor plan"],
          ["Floor-to-Floor", "3.35", "m", "Constant"],
          ["Booster Design Flow", "900", "LPM", "IS-5290 (single)"],
        ]}
        color={C.blue}
        colWidths={[220, 160, 120, 200]}
      />

      <NoteBox x={60} y={350} w={280} h={110} icon="💡" title="Terrace Booster Purpose"
        lines={["Gravity-fed from terrace tank", "Serves lower floors where", "gravity head is insufficient", "Typically below 15F for", "30-storey buildings"]}
        color={C.blue} />

      {/* ============================================== */}
      {/* SECTION 2: PIPE MATERIAL & SCHEDULE           */}
      {/* ============================================== */}
      <PhaseBand y={640} h={420} label="SECTION 2 — PIPE MATERIAL & HYDRAULIC CONSTANTS" color={C.purple.bd} />

      <Arrow x1={CX} y1={630} x2={CX} y2={680} />

      <Box x={CX - 280} y={680} w={560} h={64} label="STEP 3: Pipe Material Selection"
        sub="GI Class C (IS-1239) | DN100 | Internal Dia: 100.3mm | C=120 (New)"
        color={C.purple} badge="MATERIAL" />
      <Arrow x1={CX} y1={744} x2={CX} y2={774} />

      <DataTable x={CX - 390} y={774}
        title={"🔧 PIPE MATERIAL & CONSTANT DATABASE"}
        headers={["Parameter", "Value", "Unit", "Standard"]}
        rows={[
          ["Pipe Material", "GI Class C (Heavy)", "—", "IS-1239"],
          ["Nominal Diameter", "100", "mm", "DN100"],
          ["Internal Diameter", "100.3", "mm", "Schedule ref"],
          ["Hazen-Williams C", "120", "—", "New steel/GI"],
          ["Design Flow Rate Q", "900", "LPM", "IS-5290"],
          ["Flow Velocity", "1.90", "m/s", "V = Q / A"],
          ["Max Velocity Limit", "3.0", "m/s", "IS-15105"],
        ]}
        color={C.purple}
        colWidths={[220, 160, 120, 200]}
      />

      <NoteBox x={W - 340} y={774} w={280} h={110} icon="📐" title="Velocity Check"
        lines={["V = 4Q / (\u03C0D\u00B2)", "V = 4 x 0.015 / (\u03C0 x 0.1003\u00B2)", "V = 1.90 m/s", "\u2705 Within 3.0 m/s limit"]}
        color={C.green} />

      {/* ============================================== */}
      {/* SECTION 3: STRAIGHT PIPE RUN                  */}
      {/* ============================================== */}
      <PhaseBand y={1080} h={400} label="SECTION 3 — STRAIGHT PIPE RUN LENGTHS" color={C.teal.bd} />

      <Arrow x1={CX} y1={1070} x2={CX} y2={1120} />

      <Box x={CX - 280} y={1120} w={560} h={64}
        label="STEP 4: Pipe Route — Terrace Tank to Outlets"
        sub="Gravity downfeed from terrace tank through booster pump to lower floors"
        color={C.teal} badge="ROUTING" />
      <Arrow x1={CX} y1={1184} x2={CX} y2={1214} />

      <DataTable x={CX - 390} y={1214}
        title={"📏 STRAIGHT PIPE RUN SCHEDULE"}
        headers={["Section", "From", "To", "Length (m)", "DN (mm)"]}
        rows={[
          ["Tank Outlet to Pump", "Terrace Tank", "Booster Pump", "8.0", "100"],
          ["Pump Discharge", "Pump", "Header Tee", "3.0", "100"],
          ["Down Riser (32F→15F)", "32F", "15F Valve", "56.95", "100"],
          ["Floor Branch (typical)", "Riser Tee", "Hydrant Valve", "12.0", "65"],
          ["Total Straight Run", "—", "—", "79.95", "—"],
        ]}
        color={C.teal}
        colWidths={[200, 130, 130, 130, 110]}
      />

      {/* ============================================== */}
      {/* SECTION 4: FITTING EQUIVALENT LENGTHS         */}
      {/* ============================================== */}
      <PhaseBand y={1500} h={500} label="SECTION 4 — FITTING EQUIVALENT LENGTHS (K-FACTOR METHOD)" color={C.orange.bd} />

      <Arrow x1={CX} y1={1490} x2={CX} y2={1540} />

      <Box x={CX - 280} y={1540} w={560} h={64}
        label="STEP 5: Fitting Count & Equivalent Length Lookup"
        sub="IS-1239 / NFPA-13 Annex tables for GI Class C fittings"
        color={C.orange} badge="CALC" />
      <Arrow x1={CX} y1={1604} x2={CX} y2={1634} />

      <DataTable x={CX - 390} y={1634}
        title={"🔧 FITTING EQUIVALENT LENGTH TABLE (DN100 GI CLASS C)"}
        headers={["Fitting Type", "Qty", "Equiv/Each (m)", "Total (m)", "Reference"]}
        rows={[
          ["90\u00B0 Elbow", "6", "3.0", "18.0", "IS-1239 Table"],
          ["45\u00B0 Elbow", "2", "1.5", "3.0", "IS-1239 Table"],
          ["Tee (Branch Flow)", "3", "6.0", "18.0", "IS-1239 Table"],
          ["Gate Valve (Open)", "4", "0.7", "2.8", "IS-1239 Table"],
          ["Non-Return Valve", "1", "7.5", "7.5", "IS-1239 Table"],
          ["Butterfly Valve", "2", "2.5", "5.0", "IS-1239 Table"],
          ["Strainer (Y-type)", "1", "5.0", "5.0", "Mfr data"],
          ["Total Fitting Equiv", "—", "—", "59.3", "—"],
        ]}
        color={C.orange}
        colWidths={[200, 80, 140, 120, 160]}
      />

      {/* ============================================== */}
      {/* SECTION 5: HAZEN-WILLIAMS FRICTION CALC       */}
      {/* ============================================== */}
      <PhaseBand y={2030} h={460} label="SECTION 5 — HAZEN-WILLIAMS FRICTION CALCULATION" color={C.amber.bd} />

      <Arrow x1={CX} y1={2020} x2={CX} y2={2070} />

      <FormulaBlock x={CX - 360} y={2070} w={720} h={90}
        lines={[
          "Total Equivalent Length:",
          "L_eq = Straight Run + Fitting Equiv",
          "L_eq = 79.95 + 59.3 = 139.25 m",
        ]}
        color={C.purple} />
      <Arrow x1={CX} y1={2160} x2={CX} y2={2190} />

      <FormulaBlock x={CX - 360} y={2190} w={720} h={128}
        lines={[
          "Hazen-Williams Friction Loss:",
          "P = 6.05 x 10\u2074 x (Q/C)^1.85 / D^4.8657",
          "P = 6.05e4 x (900/120)^1.85 / 100.3^4.8657",
          "P = 0.0856 kPa/m",
          "Total Friction = 0.0856 x 139.25 = 11.92 kPa = 1.22 mWC",
        ]}
        color={C.amber} />

      <NoteBox x={60} y={2190} w={280} h={110} icon="🧮" title="Calculation Check"
        lines={["Q = 900 LPM = 0.015 m\u00B3/s", "D = 100.3 mm (internal)", "C = 120 (new GI)", "Unit: kPa/m per meter run", "1 kPa = 0.102 mWC"]}
        color={C.slate} />

      <Arrow x1={CX} y1={2318} x2={CX} y2={2348} />

      <Box x={CX - 280} y={2348} w={560} h={64}
        label="Raw Friction Loss = 1.22 mWC (11.92 kPa)"
        sub="Before safety factor application | DN100 @ 900 LPM over 139.25m equiv. length"
        color={C.cyan} badge="INTERIM" />

      {/* ============================================== */}
      {/* SECTION 6: +20% SAFETY FACTOR                 */}
      {/* ============================================== */}
      <PhaseBand y={2450} h={320} label="SECTION 6 — +20% SAFETY FACTOR ON FRICTION" color={C.rose.bd} />

      <Arrow x1={CX} y1={2422} x2={CX} y2={2490} />

      <FormulaBlock x={CX - 340} y={2490} w={680} h={108}
        lines={[
          "+20% Safety Factor (IS-15105 Mandatory):",
          "Raw Friction = 1.22 mWC",
          "Safety = 1.22 x 0.20 = 0.24 mWC",
          "Final Friction = 1.22 + 0.24 = 1.46 mWC",
        ]}
        color={C.rose} />
      <Arrow x1={CX} y1={2598} x2={CX} y2={2628} />

      <Box x={CX - 280} y={2628} w={560} h={64}
        label="Final Friction Loss = 1.46 mWC (14.30 kPa)"
        sub="Including +20% safety factor per IS-15105"
        color={C.rose} badge="WITH SAFETY" />

      <NoteBox x={W - 340} y={2490} w={280} h={90} icon="⚠️" title="Why +20% Safety?"
        lines={["Accounts for pipe aging", "Corrosion increases roughness", "Flow turbulence at fittings", "IS-15105 mandates minimum"]}
        color={C.rose} />

      {/* ============================================== */}
      {/* SECTION 7: STATIC HEAD CALCULATION            */}
      {/* ============================================== */}
      <PhaseBand y={2730} h={350} label="SECTION 7 — STATIC HEAD CALCULATION" color={C.blue.bd} />

      <Arrow x1={CX} y1={2702} x2={CX} y2={2770} />

      <FormulaBlock x={CX - 340} y={2770} w={680} h={128}
        lines={[
          "Static Head for Terrace Booster:",
          "H_static = Terrace Tank LWL - Lowest Outlet Elevation",
          "Note: Booster supplements gravity — static is NEGATIVE",
          "(Tank is ABOVE outlets, so gravity assists)",
          "H_static = 109.5m - 3.35m = 106.15m (gravity available)",
          "Required boost = zones where gravity < 3.5 Bar residual",
        ]}
        color={C.blue} />
      <Arrow x1={CX} y1={2898} x2={CX} y2={2928} />

      {/* Decision: Which floors need booster? */}
      <Diamond cx={CX} cy={2988} rxD={180} ryD={55}
        label="Gravity \u2265 3.5 Bar?"
        sub="Which floors need booster assist?" color={C.amber} />

      <Arrow x1={CX - 180} y1={2988} x2={160} y2={2988} color={C.green.bd} label="Above 15F" />
      <NoteBox x={60} y={2952} w={240} h={90} icon="\u2705" title="Gravity Sufficient"
        lines={["Floors 15F-32F", "Gravity head > 35.7 mWC", "No booster needed", "Direct gravity feed"]}
        color={C.green} />

      <Arrow x1={CX + 180} y1={2988} x2={W - 160} y2={2988} color={C.rose.bd} label="Below 15F" />
      <NoteBox x={W - 340} y={2952} w={280} h={90} icon="🔴" title="Booster Required"
        lines={["Floors 1F-14F", "Static head too high for gravity", "Booster must overcome residual", "deficit at lower floors"]}
        color={C.rose} />

      {/* ============================================== */}
      {/* SECTION 8: TOTAL HEAD SUMMATION               */}
      {/* ============================================== */}
      <PhaseBand y={3100} h={500} label="SECTION 8 — TOTAL HEAD SUMMATION & PUMP DUTY POINT" color={C.green.bd} />

      <Arrow x1={CX} y1={3050} x2={CX} y2={3140} />

      <FormulaBlock x={CX - 360} y={3140} w={720} h={168}
        lines={[
          "Terrace Booster Total Head Calculation:",
          "For lowest outlet (1F) — worst case scenario:",
          "",
          "Friction Loss (with safety) = 1.46 mWC",
          "Static Head (Tank LWL to 1F) = 109.5 - 3.35 = 106.15m",
          "Gravity Available = 106.15m (downward, assists flow)",
          "Residual Required = 3.5 Bar = 35.7 mWC",
          "Head Deficit = Residual - (Gravity - Friction) = 35.7 - (106.15 - 1.46)",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={3308} x2={CX} y2={3338} />

      <Diamond cx={CX} cy={3398} rxD={180} ryD={55}
        label="Deficit > 0?"
        sub="Need booster pump?" color={C.amber} />

      <Arrow x1={CX} y1={3453} x2={CX} y2={3490} color={C.green.bd} label="Gravity > Required" />

      {/* For mid-zone floors analysis */}
      <FormulaBlock x={CX - 360} y={3490} w={720} h={108}
        lines={[
          "Mid-Zone Analysis (Floor 8F — typical worst booster case):",
          "Gravity at 8F = 109.5 - 30.15 = 79.35m",
          "Residual Required = 35.7 mWC | Friction = 1.46 mWC",
          "Available Head = 79.35 - 1.46 - 35.7 = 42.19 mWC (gravity surplus)",
          "Booster TDH = Friction + Residual = 1.46 + 35.7 = 37.16m \u2248 38m",
        ]}
        color={C.teal} />

      {/* ============================================== */}
      {/* SECTION 9: FLOOR-BY-FLOOR PRESSURE ANALYSIS   */}
      {/* ============================================== */}
      <PhaseBand y={3640} h={520} label="SECTION 9 — FLOOR-BY-FLOOR PRESSURE ANALYSIS" color={C.violet.bd} />

      <Arrow x1={CX} y1={3610} x2={CX} y2={3680} />

      <DataTable x={CX - 390} y={3680}
        title={"📊 TERRACE BOOSTER — FLOOR PRESSURE PROFILE"}
        headers={["Floor", "Elev (m)", "Gravity (mWC)", "After Friction", "Residual", "Status"]}
        rows={[
          ["32F (Top)", "108.85", "0.65", "0.0", "0.0", "\u274C No flow"],
          ["28F", "95.45", "14.05", "12.59", "—", "\u26A0️ Low"],
          ["24F", "82.05", "27.45", "26.0", "—", "\u26A0️ Low"],
          ["20F", "68.65", "40.85", "39.39", "35.7", "\u2705 OK"],
          ["16F", "55.25", "54.25", "52.79", "35.7", "\u2705 OK"],
          ["12F", "41.85", "67.65", "66.19", "35.7", "\u2705 OK+"],
          ["8F", "28.45", "81.05", "79.59", "35.7", "\u2705 OK++"],
          ["4F", "15.05", "94.45", "93.0", "35.7", "\u26A0️ Orifice"],
          ["1F", "3.35", "106.15", "104.69", "35.7", "\u26A0️ Orifice"],
        ]}
        color={C.violet}
        colWidths={[90, 110, 130, 130, 120, 120]}
      />

      <NoteBox x={60} y={3680} w={280} h={100} icon="💡" title="Booster Logic"
        lines={["Floors 20F-32F: Gravity only", "Floors 1F-19F: Booster assist", "Floors 1F-4F: Orifice needed", "(Pressure > 7.0 Bar at outlet)"]}
        color={C.violet} />

      {/* ============================================== */}
      {/* SECTION 10: FINAL OUTPUT DASHBOARD            */}
      {/* ============================================== */}
      <PhaseBand y={4200} h={620} label="SECTION 10 — TERRACE BOOSTER OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={4180} x2={CX} y2={4250} />

      {/* KPI Row */}
      <ValueBlock x={60} y={4250} w={220} h={95} label="Booster TDH" value="38 m" unit="3.7 Bar" color={C.red} icon="🏗️" />
      <ValueBlock x={300} y={4250} w={220} h={95} label="Design Flow" value="900" unit="LPM" color={C.blue} icon="💧" />
      <ValueBlock x={540} y={4250} w={220} h={95} label="Friction (w/SF)" value="1.46" unit="mWC (+20%)" color={C.amber} icon="📐" />
      <ValueBlock x={780} y={4250} w={220} h={95} label="Motor Rating" value="15 HP" unit="11 kW" color={C.teal} icon="⚡" />
      <ValueBlock x={1020} y={4250} w={220} h={95} label="Pipe Size" value="DN100" unit="GI Class C" color={C.purple} icon="🔧" />
      <ValueBlock x={1260} y={4250} w={220} h={95} label="Served Floors" value="1F–19F" unit="Booster zone" color={C.orange} icon="🏢" />

      {/* Head Breakdown */}
      <FormulaBlock x={CX - 360} y={4380} w={720} h={130}
        lines={[
          "TERRACE BOOSTER — FINAL HEAD SUMMARY:",
          "Friction Loss (with +20% SF) = 1.46 mWC",
          "Static Head (Pump to lowest outlet) = Negligible (gravity-fed)",
          "Residual Pressure Required = 3.5 Bar = 35.7 mWC",
          "Total Head = 1.46 + 35.7 = 37.16 m \u2192 Say 38 m (3.7 Bar)",
          "Motor: 15 HP / 11 kW | Pump: Inline Booster (Grundfos/CRI)",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={4510} x2={CX} y2={4540} />

      {/* BOM */}
      <DataTable x={CX - 390} y={4540}
        title={"📦 TERRACE BOOSTER — BILL OF MATERIALS"}
        headers={["Item", "Qty", "Specification", "Make"]}
        rows={[
          ["Booster Pump (Duty)", "1", "900 LPM @ 38m, 15 HP", "Grundfos"],
          ["Booster Pump (Standby)", "1", "900 LPM @ 38m, 15 HP", "Grundfos"],
          ["Pressure Switch", "1 set", "Auto changeover type", "Danfoss"],
          ["Suction Header", "1", "DN150 MS Flanged", "IS-3589"],
          ["Delivery Header", "1", "DN100 GI Class C", "IS-1239"],
          ["NRV (DN100)", "2", "Swing check type", "Kirloskar"],
          ["Butterfly Valve (DN100)", "4", "Wafer type PN16", "Audco"],
          ["Pressure Gauge", "2", "0-16 Bar, SS body", "H-Guru"],
          ["Orifice Plates", "2 sets", "For floors 1F-4F", "SS304"],
        ]}
        color={C.green}
        colWidths={[220, 80, 260, 140]}
      />

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={4870} x2={CX} y2={4910} />
      <rect x={CX - 200} y={4910} width={400} height={56} rx={28}
        fill="#059669" stroke="#34d399" strokeWidth={3} />
      <text x={CX} y={4944} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"🏁"} FTB CALCULATION COMPLETE
      </text>

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 40} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        FTB-001 | Terrace Fire Booster Pump Head | Lodha Crown Tower-B | Rev 01 | IS-15105/IS-5290/NBC Part 4
      </text>
    </svg>
  );
}
