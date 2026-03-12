import React from "react";

// =====================================================================
// FFP — COMPREHENSIVE FIRE PUMP HEAD CALCULATION
// 10-Section Flow: Project & Hazard → Water Storage Inputs → Hydrant
// Demand → Sprinkler Demand → Pipe Hydraulics → Hazen-Williams →
// Friction & Minor Losses → TDH → High/Low Zone Compare → Dashboard
// Project: Lodha Crown Tower-B | Hazard: Ordinary II
// Standards: IS-15105 / NFPA-13 / IS-5290 / NBC Part 4
// =====================================================================

const W = 1600;
const H = 7800;
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#ffp-a)" />
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
  const getColW = (ci: number) => {
    if (!colWidths) return defaultColW - 6;
    return (colWidths[ci] || defaultColW) - 6;
  };

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
                  textAnchor="middle"
                  fill={isTotal ? C.amber.tx : "#64748b"}
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
  color: { bg: string; bd: string; tx: string };
  icon?: string;
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
export function FirePumpHeadCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="ffp-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="ffp-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#991b1b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={90} fill="url(#ffp-hdr)" stroke="#991b1b" strokeWidth={3} rx={14} />
      <text x={CX} y={52} textAnchor="middle" fontSize={28} fontWeight={800} fill="#fff">
        {"🔥"} FIRE PUMP HEAD CALCULATION — COMPREHENSIVE FLOWCHART
      </text>
      <text x={CX} y={74} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fecaca">
        IS-15105 / NFPA-13 / IS-5290 / NBC Part 4 | Project: Lodha Crown Tower-B | Hazard: Ordinary-II
      </text>
      <text x={CX} y={94} textAnchor="middle" fontSize={11} fill="#fca5a5">
        Hydrant + Sprinkler + Multi-Zone Hydraulics + Hazen-Williams Friction + Pump Duty Point Selection
      </text>

      {/* ============================================== */}
      {/* SECTION 1: PROJECT DATA & HAZARD CLASSIFICATION */}
      {/* ============================================== */}
      <PhaseBand y={130} h={540} label="SECTION 1 — PROJECT DATA & HAZARD CLASSIFICATION" color={C.red.bd} />

      <Box x={CX - 280} y={160} w={560} h={64} label="STEP 1: Fetch Project Profile"
        sub="Project: Lodha Crown Tower-B | 32F + 2B | Height: 112.2m"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={224} x2={CX} y2={252} />

      <Box x={CX - 280} y={252} w={560} h={64} label="STEP 2: Occupancy & Hazard Classification"
        sub="NBC Part 4 → Residential High-Rise → Ordinary Hazard Group II"
        color={C.blue} badge="DB FETCH" />
      <Arrow x1={CX} y1={316} x2={CX} y2={344} />

      {/* Hazard Class Decision */}
      <Diamond cx={CX} cy={398} rxD={140} ryD={50} label="Hazard Class?"
        sub="Light / Ordinary / High" color={C.amber} />
      <Arrow x1={CX - 140} y1={398} x2={200} y2={398} color={C.blue.bd} label="Light" />
      <Arrow x1={CX + 140} y1={398} x2={W - 200} y2={398} color={C.rose.bd} label="High" />
      <Arrow x1={CX} y1={448} x2={CX} y2={476} color={C.amber.bd} label="Ordinary-II" />

      {/* Light / High side notes */}
      <NoteBox x={60} y={376} w={240} h={70} icon="💡" title="Light Hazard"
        lines={["Density: 2.25 L/min/m\u00B2", "Duration: 30 min"]} color={C.blue} />
      <NoteBox x={W - 300} y={376} w={240} h={70} icon="⚠️" title="High Hazard"
        lines={["Density: 12.2 L/min/m\u00B2", "Duration: 90 min"]} color={C.rose} />

      {/* Selected params */}
      <Box x={CX - 280} y={476} w={560} h={64} label="Ordinary-II Parameters Selected"
        sub="Density: 5.0 L/min/m\u00B2 | Area of Op: 216 m\u00B2 | Duration: 60 min"
        color={C.green} badge="SELECTED" />
      <Arrow x1={CX} y1={540} x2={CX} y2={570} />

      <DataTable x={CX - 390} y={570} title={"🔥 HAZARD CLASSIFICATION MATRIX"}
        headers={["Parameter", "Light", "Ordinary-I", "Ordinary-II", "High"]}
        rows={[
          ["Design Density (L/min/m\u00B2)", "2.25", "4.0", "5.0", "12.2"],
          ["Area of Operation (m\u00B2)", "84", "139", "216", "260"],
          ["Sprinkler Flow Duration (min)", "30", "60", "60", "90"],
          ["Hydrant Flow Rate (LPM)", "900", "1800", "1800", "2700"],
          ["Hydrant Duration (min)", "30", "60", "60", "60"],
        ]}
        color={C.red}
        colWidths={[180, 120, 140, 150, 190]}
      />

      {/* ============================================== */}
      {/* SECTION 2: WATER STORAGE INPUTS              */}
      {/* ============================================== */}
      <PhaseBand y={840} h={400} label="SECTION 2 — WATER STORAGE DEMAND INPUTS" color={C.blue.bd} />

      <Arrow x1={CX} y1={835} x2={CX} y2={870} />
      <Box x={CX - 280} y={870} w={560} h={64} label="STEP 3: Sprinkler Water Volume"
        sub="Q_spr = Density x Area x Duration = 5.0 x 216 x 60 = 64,800 L"
        color={C.purple} badge="FORMULA" />
      <Arrow x1={CX} y1={934} x2={CX} y2={962} />

      <Box x={CX - 280} y={962} w={560} h={64} label="STEP 4: Hydrant Water Volume"
        sub="Q_hyd = 1800 LPM x 60 min = 108,000 L = 108.0 m\u00B3"
        color={C.purple} badge="FORMULA" />
      <Arrow x1={CX} y1={1026} x2={CX} y2={1054} />

      <Box x={CX - 280} y={1054} w={560} h={64} label="STEP 5: Drencher / Water Curtain Volume"
        sub="Linear Coverage 42m x 35 L/min/m x 60 min = 88,200 L = 88.2 m\u00B3"
        color={C.purple} badge="FORMULA" />
      <Arrow x1={CX} y1={1118} x2={CX} y2={1146} />

      <FormulaBlock x={CX - 280} y={1146} w={560} h={88}
        lines={[
          "Total Fire Water = Sprinkler + Hydrant + Drencher",
          "= 64,800 + 108,000 + 88,200 = 261,000 L",
          "= 261.0 m\u00B3 → Apply max(261.0, 300) = 300 m\u00B3",
        ]}
        color={C.amber} />

      {/* ============================================== */}
      {/* SECTION 3: HYDRANT SYSTEM DEMAND             */}
      {/* ============================================== */}
      <PhaseBand y={1260} h={470} label="SECTION 3 — HYDRANT SYSTEM HYDRAULIC DEMAND" color={C.teal.bd} />

      <Arrow x1={CX} y1={1250} x2={CX} y2={1290} />
      <Box x={CX - 280} y={1290} w={560} h={64} label="STEP 6: Hydrant Design Flow Rate"
        sub="IS-5290 → 1800 LPM per hydrant (6 Bar residual at nozzle)"
        color={C.teal} badge="STANDARD" />
      <Arrow x1={CX} y1={1354} x2={CX} y2={1382} />

      <DataTable x={CX - 390} y={1382} title={"🚒 HYDRANT PIPE SCHEDULE (IS-1239 GI Class C)"}
        headers={["Section", "DN (mm)", "Length (m)", "Flow (LPM)", "Velocity (m/s)"]}
        rows={[
          ["Pump to Riser Base", "150", "25.0", "1800", "1.62"],
          ["Riser (B1 to 32F)", "150", "118.0", "1800", "1.62"],
          ["Floor Branch (Typ)", "65", "18.0", "450", "2.24"],
          ["Landing Valve Conn", "50", "3.5", "450", "3.60"],
          ["Total Pipe Run", "—", "164.5", "—", "—"],
        ]}
        color={C.teal}
        colWidths={[190, 100, 120, 130, 140]}
      />
      <Arrow x1={CX} y1={1612} x2={CX} y2={1640} />

      <Box x={CX - 280} y={1640} w={560} h={64} label="STEP 7: Hydrant Static Head"
        sub="H_s = Sump LWL to Highest Outlet = 3.5m + 112.2m = 115.7m"
        color={C.cyan} badge="CALC" />

      {/* ============================================== */}
      {/* SECTION 4: SPRINKLER SYSTEM DEMAND           */}
      {/* ============================================== */}
      <PhaseBand y={1740} h={470} label="SECTION 4 — SPRINKLER SYSTEM HYDRAULIC DEMAND" color={C.purple.bd} />

      <Arrow x1={CX} y1={1710} x2={CX} y2={1770} />
      <Box x={CX - 280} y={1770} w={560} h={64} label="STEP 8: Sprinkler Design Flow Rate"
        sub="Q = Density x Area = 5.0 x 216 = 1080 LPM (NFPA-13)"
        color={C.purple} badge="STANDARD" />
      <Arrow x1={CX} y1={1834} x2={CX} y2={1862} />

      <DataTable x={CX - 390} y={1862} title={"🔥 SPRINKLER PIPE NETWORK SCHEDULE"}
        headers={["Section", "DN (mm)", "Length (m)", "Flow (LPM)", "K-Factor"]}
        rows={[
          ["Pump to Riser", "100", "22.0", "1080", "—"],
          ["Riser Vertical", "100", "118.0", "1080", "—"],
          ["Cross Main (Typ)", "80", "24.0", "540", "—"],
          ["Branch Line", "32", "3.6", "80", "K=80"],
          ["Sprinkler Head", "15", "0.3", "80", "K=80"],
          ["Total Pipe Run", "—", "167.9", "—", "—"],
        ]}
        color={C.purple}
        colWidths={[190, 100, 120, 130, 140]}
      />
      <Arrow x1={CX} y1={2118} x2={CX} y2={2146} />

      <Box x={CX - 280} y={2146} w={560} h={64} label="STEP 9: Sprinkler Static Head"
        sub="H_s = Sump LWL to Highest Head = 3.5m + 112.2m + 0.3m = 116.0m"
        color={C.cyan} badge="CALC" />

      {/* ============================================== */}
      {/* SECTION 5: HAZEN-WILLIAMS FRICTION ENGINE     */}
      {/* ============================================== */}
      <PhaseBand y={2240} h={550} label="SECTION 5 — HAZEN-WILLIAMS FRICTION CALCULATION ENGINE" color={C.orange.bd} />

      <Arrow x1={CX} y1={2218} x2={CX} y2={2280} />

      <Box x={CX - 280} y={2280} w={560} h={64} label="STEP 10: Constants & Material Data"
        sub="C=120 (New Steel/GI) | Gravity g=9.81 m/s\u00B2 | Cd=0.62"
        color={C.blue} badge="CONSTANTS" />

      {/* Side note: Hazen-Williams constants */}
      <NoteBox x={60} y={2280} w={280} h={100} icon="📋" title="Hazen-Williams C Values"
        lines={["New Steel/GI: C = 120", "Old Steel/GI: C = 100", "Copper: C = 140", "Plastic (CPVC): C = 150"]}
        color={C.slate} />

      <Arrow x1={CX} y1={2344} x2={CX} y2={2380} />

      <FormulaBlock x={CX - 360} y={2380} w={720} h={110}
        lines={[
          "Hazen-Williams Friction Loss Formula:",
          "P = 6.05 x 10\u2074 x (Q / C)\u00B9\u00B7\u2078\u2075 / D\u2074\u00B7\u2078\u2076\u2075\u2077",
          "Where: P = pressure loss (kPa/m), Q = flow (LPM)",
          "C = pipe roughness constant, D = internal diameter (mm)",
        ]}
        color={C.amber} />

      <Arrow x1={CX} y1={2490} x2={CX} y2={2520} />

      <DataTable x={CX - 390} y={2520} title={"🧮 FITTING EQUIVALENT LENGTH TABLE (K-FACTORS)"}
        headers={["Fitting Type", "DN 50", "DN 65", "DN 80", "DN 100", "DN 150"]}
        rows={[
          ["90\u00B0 Elbow", "1.5m", "2.0m", "2.4m", "3.0m", "4.6m"],
          ["45\u00B0 Elbow", "0.8m", "1.0m", "1.2m", "1.5m", "2.3m"],
          ["Tee (Branch)", "3.0m", "4.0m", "5.0m", "6.0m", "9.0m"],
          ["Gate Valve", "0.4m", "0.5m", "0.6m", "0.7m", "1.0m"],
          ["Check (NRV)", "4.0m", "5.0m", "6.0m", "7.5m", "11.5m"],
          ["Butterfly Valve", "—", "—", "2.0m", "2.5m", "3.5m"],
        ]}
        color={C.orange}
        colWidths={[180, 100, 100, 100, 100, 100]}
      />

      {/* ============================================== */}
      {/* SECTION 6: HYDRANT FRICTION LOSS WALKTHROUGH  */}
      {/* ============================================== */}
      <PhaseBand y={2820} h={520} label="SECTION 6 — HYDRANT PUMP: FRICTION LOSS WALKTHROUGH" color={C.teal.bd} />

      <Arrow x1={CX} y1={2810} x2={CX} y2={2855} />

      <Box x={CX - 340} y={2855} w={680} h={64}
        label="STEP 11: Hydrant Equivalent Length Summation"
        sub="Straight: 164.5m | Fittings: 8x Elbows + 3x Tees + 2x NRV + 1x BFV"
        color={C.teal} badge="CALC" />
      <Arrow x1={CX} y1={2919} x2={CX} y2={2950} />

      <FormulaBlock x={CX - 340} y={2950} w={680} h={128}
        lines={[
          "Equivalent Length = Straight + Fittings",
          "Elbows: 8 x 4.6m = 36.8m (DN150)",
          "Tees: 3 x 9.0m = 27.0m | NRVs: 2 x 11.5m = 23.0m",
          "BFV: 1 x 3.5m = 3.5m",
          "Total Equiv Length = 164.5 + 36.8 + 27.0 + 23.0 + 3.5 = 254.8m",
        ]}
        color={C.purple} />
      <Arrow x1={CX} y1={3078} x2={CX} y2={3108} />

      <FormulaBlock x={CX - 340} y={3108} w={680} h={90}
        lines={[
          "Friction Loss @ DN150, Q=1800 LPM, C=120:",
          "P = 6.05x10\u2074 x (1800/120)\u00B9\u00B7\u2078\u2075 / 150\u2074\u00B7\u2078\u2076\u2075\u2077",
          "P = 0.145 kPa/m x 254.8m = 36.95 kPa = 3.77 mWC",
        ]}
        color={C.amber} />

      <NoteBox x={60} y={3108} w={240} h={70} icon="📐" title="Unit Conversion"
        lines={["1 Bar = 10.2 mWC", "1 kPa = 0.102 mWC"]}
        color={C.slate} />

      {/* ============================================== */}
      {/* SECTION 7: TOTAL DYNAMIC HEAD (HYDRANT)      */}
      {/* ============================================== */}
      <PhaseBand y={3360} h={520} label="SECTION 7 — HYDRANT PUMP: TOTAL DYNAMIC HEAD" color={C.green.bd} />

      <Arrow x1={CX} y1={3345} x2={CX} y2={3400} />

      <FormulaBlock x={CX - 360} y={3400} w={720} h={148}
        lines={[
          "TDH = Friction Loss + Static Head + Residual Pressure + Safety",
          "Friction Loss = 3.77 mWC",
          "Static Head = 115.7 m",
          "Residual Pressure = 3.5 Bar = 35.7 mWC (at nozzle)",
          "Safety Factor = 20% on friction = 0.75 mWC",
          "TDH = 3.77 + 115.7 + 35.7 + 0.75 = 155.92 m \u2248 156 m",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={3548} x2={CX} y2={3580} />

      {/* Hydrant Decision Diamond */}
      <Diamond cx={CX} cy={3640} rxD={160} ryD={55} label="TDH \u2264 185m?"
        sub="High Zone Pump Limit" color={C.amber} />
      <Arrow x1={CX} y1={3695} x2={CX} y2={3730} color={C.green.bd} label="156m \u2264 185m \u2713 PASS" />

      <Box x={CX - 280} y={3730} w={560} h={64}
        label={"Hydrant Pump Duty Point: 1800 LPM @ 156m"}
        sub="Motor: 75 HP / 55 kW | Pump Type: Horizontal Split-case (Kirloskar)"
        color={C.green} badge="OUTPUT" />

      <NoteBox x={W - 340} y={3620} w={280} h={90} icon="⚠️" title="If TDH > 185m"
        lines={["Multi-stage pump required", "or zone splitting needed", "High Zone: 185m max"]}
        color={C.rose} />

      {/* ============================================== */}
      {/* SECTION 8: SPRINKLER PUMP TDH                */}
      {/* ============================================== */}
      <PhaseBand y={3840} h={600} label="SECTION 8 — SPRINKLER PUMP: TOTAL DYNAMIC HEAD" color={C.purple.bd} />

      <Arrow x1={CX} y1={3804} x2={CX} y2={3875} />

      <Box x={CX - 340} y={3875} w={680} h={64}
        label="STEP 12: Sprinkler Equivalent Length"
        sub="Straight: 167.9m | Fittings: 10x Elbows(DN100) + 4x Tees + 2x NRV"
        color={C.purple} badge="CALC" />
      <Arrow x1={CX} y1={3939} x2={CX} y2={3970} />

      <FormulaBlock x={CX - 340} y={3970} w={680} h={108}
        lines={[
          "Equiv Length = 167.9 + (10x3.0) + (4x6.0) + (2x7.5)",
          "= 167.9 + 30.0 + 24.0 + 15.0 = 236.9m",
          "Friction @ DN100, Q=1080 LPM, C=120:",
          "P = 0.282 kPa/m x 236.9m = 66.81 kPa = 6.81 mWC",
        ]}
        color={C.purple} />
      <Arrow x1={CX} y1={4078} x2={CX} y2={4108} />

      <FormulaBlock x={CX - 340} y={4108} w={680} h={130}
        lines={[
          "Sprinkler TDH Calculation:",
          "Friction Loss = 6.81 mWC",
          "Static Head = 116.0 m",
          "Residual Pressure = 0.5 Bar = 5.1 mWC (at sprinkler head)",
          "Safety Factor = 20% on friction = 1.36 mWC",
          "TDH = 6.81 + 116.0 + 5.1 + 1.36 = 129.27 m \u2248 130 m",
        ]}
        color={C.green} />
      <Arrow x1={CX} y1={4238} x2={CX} y2={4268} />

      <Box x={CX - 280} y={4268} w={560} h={64}
        label={"Sprinkler Pump Duty Point: 1080 LPM @ 130m"}
        sub="Motor: 50 HP / 37 kW | Pump Type: End-suction (Grundfos)"
        color={C.green} badge="OUTPUT" />

      {/* ============================================== */}
      {/* SECTION 9: PRESSURE PROFILE & ORIFICE CHECK  */}
      {/* ============================================== */}
      <PhaseBand y={4380} h={740} label="SECTION 9 — PRESSURE PROFILE & ORIFICE PLATE VALIDATION" color={C.rose.bd} />

      <Arrow x1={CX} y1={4338} x2={CX} y2={4420} />

      <Box x={CX - 280} y={4420} w={560} h={64}
        label="STEP 13: Floor-by-Floor Pressure Profile"
        sub="Floor-to-Floor: 3.35m | Pump Shutoff: 185m (Hydrant), 150m (Sprinkler)"
        color={C.rose} badge="ANALYSIS" />
      <Arrow x1={CX} y1={4484} x2={CX} y2={4514} />

      <DataTable x={CX - 390} y={4514}
        title={"📊 FLOOR PRESSURE PROFILE — HYDRANT SYSTEM"}
        headers={["Floor", "Elev (m)", "Static (Bar)", "Residual (Bar)", "Total (Bar)", "Status"]}
        rows={[
          ["32F (Top)", "112.2", "0.0", "3.5", "3.5", "\u2705 OK"],
          ["24F", "85.1", "2.7", "3.5", "6.2", "\u2705 OK"],
          ["16F", "58.0", "5.3", "3.5", "8.8", "\u26A0️ Orifice"],
          ["8F", "30.9", "8.0", "3.5", "11.5", "\u26A0️ Orifice"],
          ["GF", "3.5", "10.7", "3.5", "14.2", "\u26A0️ Orifice"],
          ["B2", "0.0", "11.0", "3.5", "14.5", "\u26A0️ Orifice"],
        ]}
        color={C.rose}
        colWidths={[100, 120, 130, 130, 130, 100]}
      />
      <Arrow x1={CX} y1={4760} x2={CX} y2={4790} />

      {/* Orifice Decision */}
      <Diamond cx={CX} cy={4848} rxD={180} ryD={55}
        label="Floor Pressure > 7.0 Bar?"
        sub="Orifice Plate Required per IS-15105" color={C.amber} />

      <Arrow x1={CX + 180} y1={4848} x2={W - 180} y2={4848} color={C.rose.bd} label="YES" />
      <NoteBox x={W - 340} y={4812} w={260} h={90} icon="🔴" title="Orifice Required"
        lines={["Cd = 0.62 | Target: 3.5 Bar", "d = Q / (Cd x A x \u221A(2gH))", "Typical: 25-40mm orifice"]}
        color={C.rose} />

      <Arrow x1={CX - 180} y1={4848} x2={160} y2={4848} color={C.green.bd} label="NO" />
      <NoteBox x={60} y={4812} w={240} h={70} icon="\u2705" title="No Orifice Needed"
        lines={["Pressure within limits", "Direct connection OK"]}
        color={C.green} />

      <Arrow x1={CX} y1={4903} x2={CX} y2={4940} />

      <FormulaBlock x={CX - 340} y={4940} w={680} h={90}
        lines={[
          "Orifice Plate Sizing (IS-15105 Annex-B):",
          "d_orifice = Q / (Cd x \u03C0/4 x D\u00B2 x \u221A(2 x g x \u0394H))",
          "For GF: \u0394H = 14.2 - 7.0 = 7.2 Bar → d \u2248 32mm orifice plate",
        ]}
        color={C.amber} />

      {/* ============================================== */}
      {/* SECTION 10: HIGH/LOW ZONE COMPARISON          */}
      {/* ============================================== */}
      <PhaseBand y={5080} h={480} label="SECTION 10 — HIGH ZONE vs LOW ZONE PUMP COMPARISON" color={C.violet.bd} />

      <Arrow x1={CX} y1={5050} x2={CX} y2={5120} />

      <DataTable x={CX - 390} y={5120}
        title={"⚡ HIGH ZONE vs LOW ZONE — PUMP SPECIFICATION COMPARISON"}
        headers={["Parameter", "HIGH Zone (Hydrant)", "HIGH Zone (Sprinkler)", "LOW Zone (Booster)"]}
        rows={[
          ["Design Flow (LPM)", "1800", "1080", "900"],
          ["Static Head (m)", "115.7", "116.0", "52.0"],
          ["Friction Loss (mWC)", "3.77", "6.81", "2.10"],
          ["Residual Pressure (mWC)", "35.7", "5.1", "35.7"],
          ["Safety Factor (mWC)", "0.75", "1.36", "0.42"],
          ["Total Dynamic Head (m)", "156", "130", "90"],
          ["Motor Rating", "75 HP / 55 kW", "50 HP / 37 kW", "30 HP / 22 kW"],
          ["Pump Type", "Horizontal Split", "End-suction", "Inline Booster"],
          ["Pressure Limit (Bar)", "18.5", "15.0", "12.0"],
        ]}
        color={C.violet}
        colWidths={[200, 200, 200, 180]}
      />

      {/* ============================================== */}
      {/* SECTION 11: COMPREHENSIVE OUTPUT DASHBOARD    */}
      {/* ============================================== */}
      <PhaseBand y={5620} h={600} label="SECTION 11 — FIRE PUMP HEAD OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={5600} x2={CX} y2={5670} />

      {/* Dashboard KPI row */}
      <ValueBlock x={60} y={5670} w={220} h={95} label="Hydrant Pump TDH" value="156 m" unit="15.3 Bar" color={C.red} icon="🚒" />
      <ValueBlock x={300} y={5670} w={220} h={95} label="Sprinkler Pump TDH" value="130 m" unit="12.7 Bar" color={C.purple} icon="🔥" />
      <ValueBlock x={540} y={5670} w={220} h={95} label="Total Fire Water" value="300 m\u00B3" unit="Min IS-15105" color={C.blue} icon="💧" />
      <ValueBlock x={780} y={5670} w={220} h={95} label="Hydrant Motor" value="75 HP" unit="55 kW" color={C.teal} icon="⚡" />
      <ValueBlock x={1020} y={5670} w={220} h={95} label="Sprinkler Motor" value="50 HP" unit="37 kW" color={C.orange} icon="⚡" />
      <ValueBlock x={1260} y={5670} w={220} h={95} label="Orifice Floors" value="4 / 6" unit="Below 16F" color={C.rose} icon="🔴" />

      {/* Final BOM Summary */}
      <DataTable x={CX - 390} y={5800}
        title={"📦 PUMP BILL OF MATERIALS (BOM) — FIRE FIGHTING SYSTEM"}
        headers={["Equipment", "Qty", "Spec", "Motor", "Make"]}
        rows={[
          ["Main Fire Pump (Hydrant)", "1+1S", "1800 LPM @ 156m", "75 HP", "Kirloskar"],
          ["Sprinkler Pump", "1+1S", "1080 LPM @ 130m", "50 HP", "Grundfos"],
          ["Jockey Pump (Hydrant)", "1", "120 LPM @ 165m", "7.5 HP", "CRI"],
          ["Jockey Pump (Sprinkler)", "1", "60 LPM @ 140m", "5 HP", "CRI"],
          ["Low Zone Booster", "1+1S", "900 LPM @ 90m", "30 HP", "Kirloskar"],
          ["Fire Water Tank", "1", "300 m\u00B3 (Underground)", "—", "RCC/MS"],
          ["Orifice Plates", "4 sets", "25-40mm per floor", "—", "SS304"],
        ]}
        color={C.green}
        colWidths={[200, 80, 200, 120, 120]}
      />

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={6120} x2={CX} y2={6160} />
      <rect x={CX - 200} y={6160} width={400} height={56} rx={28}
        fill="#059669" stroke="#34d399" strokeWidth={3} />
      <text x={CX} y={6194} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"🏁"} FFP CALCULATION COMPLETE
      </text>

      {/* ============================================== */}
      {/* COMPARISON TABLE (Elec ↔ Fire)               */}
      {/* ============================================== */}
      <PhaseBand y={6260} h={380} label="REFERENCE — ELECTRICAL ↔ FIRE FIGHTING TECHNICAL COMPARISON" color={C.slate.bd} />

      <DataTable x={CX - 390} y={6300}
        title={"📊 ELECTRICAL vs FIREFIGHTING — TECHNICAL DEPTH COMPARISON"}
        headers={["Electrical Reference", "Fire Fighting Equivalent", "Unit"]}
        rows={[
          ["Connected Load (kW)", "Design Flow Rate (LPM)", "kW / LPM"],
          ["Diversity Factor", "Safety Factor (1.2x)", "Ratio"],
          ["Voltage Drop (%)", "Friction Head Loss (Bar)", "% / Bar"],
          ["Cable Size (sq.mm)", "Nominal Pipe Diameter (mm)", "mm"],
          ["Circuit Breaker Rating", "Orifice Plate Sizing (mm)", "A / mm"],
          ["Transformer Sizing (kVA)", "Pump Motor Sizing (HP)", "kVA / HP"],
          ["Short Circuit Current (kA)", "Pump Shutoff Head (m)", "kA / m"],
          ["Phase Balance (R-Y-B)", "Zone Balance (High/Low)", "—"],
        ]}
        color={C.slate}
        colWidths={[270, 270, 120]}
      />

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 40} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        FFP-001 | Fire Pump Head Calculation | Lodha Crown Tower-B | Rev 01 | IS-15105/NFPA-13/IS-5290/NBC Part 4
      </text>
    </svg>
  );
}
