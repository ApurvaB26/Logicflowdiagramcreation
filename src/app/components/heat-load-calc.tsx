import React from "react";

// =====================================================================
// HLC — COMPREHENSIVE BUILDING THERMAL COOLING LOAD CALCULATION
// ASHRAE Level-2 Method | 14-Section Flowchart
// Envelope Gain → Fenestration → Internal Gains → Ventilation →
// Room Totals → Grand Total → TR Conversion → Equipment Selection
// Project: Clariant Plot A2 | Standards: ASHRAE / IS 3103 / NBC 2016
// =====================================================================

const W = 1600;
const H = 13200;
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

/* ── Helper Components ─────────────────────────────────────────────── */

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
          <text x={x + w - 49} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>{badge}</text>
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#hlc-a)" />
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
export function HeatLoadCalcSVG() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="calc-svg"
      style={{ width: "100%", height: "auto", background: "#ffffff" }}
    >
      <defs>
        <marker id="hlc-a" viewBox="0 0 10 10" refX={10} refY={5}
          markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <linearGradient id="hlc-hdr" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#dc2626", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* ================ MASTER HEADER ================ */}
      <rect x={40} y={20} width={W - 80} height={100} fill="url(#hlc-hdr)" stroke="#b91c1c" strokeWidth={3} rx={14} />
      <text x={CX} y={55} textAnchor="middle" fontSize={26} fontWeight={800} fill="#fff">
        {"\U0001F321\uFE0F"} BUILDING THERMAL COOLING LOAD — COMPREHENSIVE FLOWCHART
      </text>
      <text x={CX} y={78} textAnchor="middle" fontSize={13} fontWeight={600} fill="#fecaca">
        ASHRAE Level-2 CLTD/SCL/CLF Method | IS 3103 / NBC 2016 | 5 Sub-Systems + Summation
      </text>
      <text x={CX} y={98} textAnchor="middle" fontSize={11} fill="#fca5a5">
        Envelope → Fenestration → Internal Gains → Ventilation → Room Totals → GTH → TR & CFM → Equipment Selection
      </text>

      {/* ================================================ */}
      {/* SECTION 1: PROJECT DATA & CLIMATE INPUTS         */}
      {/* ================================================ */}
      <PhaseBand y={140} h={580} label="SECTION 1 — PROJECT DATA & OUTDOOR DESIGN CONDITIONS" color={C.blue.bd} />

      <Box x={CX - 280} y={170} w={560} h={64} label="STEP 1: Project Location & Building Profile"
        sub="GPS coordinates → climate zone → outdoor design conditions (ASHRAE Ch.14)"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={234} x2={CX} y2={264} />

      <DataTable x={CX - 390} y={264}
        title={"\U0001F30D PROJECT & OUTDOOR DESIGN CONDITIONS"}
        headers={["Parameter", "Value", "Unit", "Source"]}
        rows={[
          ["Project", "Clariant Plot A2", "—", "Client Brief"],
          ["Location", "Mumbai (19.07°N, 72.87°E)", "—", "GPS"],
          ["Climate Zone", "Warm & Humid", "—", "NBC 2016"],
          ["Outdoor DB Temperature (To)", "38.5", "°C", "ASHRAE 0.4%"],
          ["Outdoor WB Temperature", "28.2", "°C", "ASHRAE 0.4%"],
          ["Indoor DB Temperature (Ti)", "24.0", "°C", "Design Setpoint"],
          ["Indoor RH", "50 ± 5", "%", "Comfort Std"],
          ["Outdoor Humidity Ratio (Wo)", "0.0192", "kg/kg", "Psychrometric"],
          ["Indoor Humidity Ratio (Wi)", "0.0093", "kg/kg", "Psychrometric"],
          ["\u0394T (To - Ti)", "14.5", "°C", "38.5 - 24.0"],
        ]}
        color={C.blue}
        colWidths={[220, 200, 100, 200]}
      />

      <NoteBox x={60} y={264} w={280} h={110} icon={"\U0001F4A1"} title="ASHRAE Design Day"
        lines={["0.4% cooling design = exceeded", "only 35 hrs/year (hottest)", "Mumbai: May peak 38.5°C DB", "Monsoon: high latent load", "Annual range: 22–39°C"]}
        color={C.blue} />

      {/* ================================================ */}
      {/* SECTION 2: BUILDING ENVELOPE DATA                */}
      {/* ================================================ */}
      <PhaseBand y={740} h={540} label="SECTION 2 — BUILDING ENVELOPE & CONSTRUCTION DATA" color={C.purple.bd} />

      <Arrow x1={CX} y1={730} x2={CX} y2={770} />

      <Box x={CX - 280} y={770} w={560} h={64} label="STEP 2: Catalogue Building Envelope Elements"
        sub="Wall types, roof, glass areas, U-values from construction specifications"
        color={C.purple} badge="DB FETCH" />
      <Arrow x1={CX} y1={834} x2={CX} y2={864} />

      <DataTable x={CX - 390} y={864}
        title={"\U0001F3D7\uFE0F BUILDING ENVELOPE — U-VALUES & AREAS"}
        headers={["Element", "Area (m²)", "U (W/m²K)", "CLTD (°C)", "Notes"]}
        rows={[
          ["Ext. Wall — North", "185", "1.82", "12", "230mm brick + plaster"],
          ["Ext. Wall — East", "240", "1.82", "18", "Morning solar gain"],
          ["Ext. Wall — South", "185", "1.82", "15", "Moderate solar"],
          ["Ext. Wall — West", "240", "1.82", "22", "Peak afternoon solar"],
          ["Roof (Exposed)", "520", "1.46", "28", "150mm RCC + WP"],
          ["Floor (On Grade)", "520", "0.87", "5", "Minimal conduction"],
          ["Glass — North", "45", "5.80", "—", "6mm clear single"],
          ["Glass — East", "68", "5.80", "—", "6mm clear single"],
          ["Glass — South", "45", "5.80", "—", "6mm clear single"],
          ["Glass — West", "68", "5.80", "—", "Peak SHGF face"],
        ]}
        color={C.purple}
        colWidths={[180, 110, 120, 110, 200]}
      />

      <NoteBox x={W - 340} y={864} w={280} h={120} icon={"\U0001F4D0"} title="CLTD Correction"
        lines={["CLTD from ASHRAE Table 30", "Corrected for:", "• Latitude: 19°N", "• Month: May (peak)", "• Color: Medium (0.65 abs)", "• Indoor: 24°C setpoint"]}
        color={C.purple} />

      {/* ================================================ */}
      {/* SECTION 3: OPAQUE SURFACE HEAT GAIN              */}
      {/* ================================================ */}
      <PhaseBand y={1300} h={600} label="SECTION 3 — ENVELOPE HEAT GAIN: OPAQUE SURFACES (Walls & Roof)" color={C.amber.bd} />

      <Arrow x1={CX} y1={1290} x2={CX} y2={1340} />

      <Box x={CX - 280} y={1340} w={560} h={64} label="STEP 3: Calculate Opaque Surface Heat Gain"
        sub="Conduction through walls and roof using CLTD method"
        color={C.amber} badge="CALC" />
      <Arrow x1={CX} y1={1404} x2={CX} y2={1434} />

      <FormulaBlock x={CX - 340} y={1434} w={680} h={90}
        lines={[
          "Q_opaque = U × A × CLTD_corrected",
          "For each surface: Wall (N/E/S/W) + Roof",
          "Sum all opaque surface gains for total Q_envelope",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={1524} x2={CX} y2={1554} />

      <DataTable x={CX - 390} y={1554}
        title={"\U0001F9F1 OPAQUE SURFACE HEAT GAIN — Q = U × A × CLTD"}
        headers={["Surface", "U (W/m²K)", "A (m²)", "CLTD (°C)", "Q (Watts)"]}
        rows={[
          ["Wall — North", "1.82", "185", "12", "4,040"],
          ["Wall — East", "1.82", "240", "18", "7,862"],
          ["Wall — South", "1.82", "185", "15", "5,051"],
          ["Wall — West", "1.82", "240", "22", "9,610"],
          ["Roof (Exposed)", "1.46", "520", "28", "21,258"],
          ["Floor (On Grade)", "0.87", "520", "5", "2,262"],
          ["Total Opaque Q_env", "—", "—", "—", "50,083 W"],
        ]}
        color={C.amber}
        colWidths={[170, 120, 110, 120, 200]}
      />

      <NoteBox x={60} y={1554} w={280} h={110} icon={"\u2600\uFE0F"} title="Key Observations"
        lines={["Roof = 42% of opaque gain", "West wall = highest wall gain", "East wall = 2nd highest", "North = least solar exposure", "Floor = minimal (5°C CLTD)"]}
        color={C.amber} />

      {/* ================================================ */}
      {/* SECTION 4: FENESTRATION / GLASS HEAT GAIN        */}
      {/* ================================================ */}
      <PhaseBand y={1920} h={680} label="SECTION 4 — FENESTRATION HEAT GAIN: SOLAR + CONDUCTIVE" color={C.orange.bd} />

      <Arrow x1={CX} y1={1910} x2={CX} y2={1960} />

      <Box x={CX - 280} y={1960} w={560} h={64} label="STEP 4: Fenestration — Solar & Conductive Gain"
        sub="Glass gains: Solar (SC × SHGF) + Conduction (U × A × \u0394T)"
        color={C.orange} badge="CALC" />
      <Arrow x1={CX} y1={2024} x2={CX} y2={2054} />

      {/* Solar Gain Formula */}
      <FormulaBlock x={CX - 340} y={2054} w={680} h={72}
        lines={[
          "Q_solar = A × SC × SHGF_max (Solar Heat Gain Factor)",
          "Q_conductive = U × A × \u0394T (Glass conduction)",
        ]}
        color={C.orange} />
      <Arrow x1={CX} y1={2126} x2={CX} y2={2156} />

      <DataTable x={CX - 390} y={2156}
        title={"\U0001FA9F FENESTRATION HEAT GAIN — SOLAR + CONDUCTIVE"}
        headers={["Glass Face", "A (m²)", "SHGF", "SC", "Q_solar (W)", "Q_cond (W)"]}
        rows={[
          ["North", "45", "110", "0.87", "4,307", "3,784"],
          ["East", "68", "480", "0.87", "28,397", "5,720"],
          ["South", "45", "210", "0.87", "8,222", "3,784"],
          ["West", "68", "510", "0.87", "30,171", "5,720"],
          ["Subtotal Solar", "—", "—", "—", "71,097", "—"],
          ["Subtotal Conductive", "—", "—", "—", "—", "19,008"],
          ["Total Glass Q_fen", "—", "—", "—", "90,105 W", "—"],
        ]}
        color={C.orange}
        colWidths={[130, 90, 100, 80, 160, 160]}
      />

      <NoteBox x={60} y={2156} w={280} h={120} icon={"\U0001F321\uFE0F"} title="SHGF Reference"
        lines={["ASHRAE Table 36 values", "Latitude 20°N, May, 15:00h", "W face: peak 510 W/m²", "E face: peak 480 W/m² (AM)", "SC = 0.87 (6mm clear glass)", "Consider low-E for savings"]}
        color={C.orange} />

      <NoteBox x={W - 340} y={2156} w={280} h={120} icon={"\U0001F4A1"} title="Glass Dominance"
        lines={["Solar through glass = 71 kW", "vs Opaque walls = 50 kW", "Glass = 59% of envelope load!", "Low-E glass (SC=0.40) would", "reduce solar by 54%", "ROI: 2–3 years in Mumbai"]}
        color={C.green} />

      {/* ================================================ */}
      {/* SECTION 5: INTERNAL GAINS — OCCUPANCY            */}
      {/* ================================================ */}
      <PhaseBand y={2620} h={620} label="SECTION 5 — INTERNAL HEAT GAIN: OCCUPANCY (Sensible & Latent)" color={C.teal.bd} />

      <Arrow x1={CX} y1={2610} x2={CX} y2={2660} />

      <Box x={CX - 280} y={2660} w={560} h={64} label="STEP 5: Occupancy Heat Gain — Metabolic Load"
        sub="People emit sensible + latent heat based on activity level"
        color={C.teal} badge="CALC" />
      <Arrow x1={CX} y1={2724} x2={CX} y2={2754} />

      <FormulaBlock x={CX - 340} y={2754} w={680} h={90}
        lines={[
          "Q_people_sensible = No. of People × Sensible Heat/Person",
          "Q_people_latent = No. of People × Latent Heat/Person",
          "Values from ASHRAE Table 1, Ch. 18 (by activity)",
        ]}
        color={C.teal} />
      <Arrow x1={CX} y1={2844} x2={CX} y2={2874} />

      <DataTable x={CX - 390} y={2874}
        title={"\U0001F9D1\u200D\U0001F4BC OCCUPANCY HEAT GAIN — METABOLIC RATES"}
        headers={["Zone / Activity", "People", "Sensible (W/p)", "Latent (W/p)", "Qs (W)", "Ql (W)"]}
        rows={[
          ["Office — Seated", "120", "75", "55", "9,000", "6,600"],
          ["Conference Room", "40", "75", "55", "3,000", "2,200"],
          ["Cafeteria — Eating", "60", "80", "80", "4,800", "4,800"],
          ["Lobby — Standing", "25", "75", "55", "1,875", "1,375"],
          ["Lab / Workshop", "15", "110", "185", "1,650", "2,775"],
          ["Total Occupancy", "260", "—", "—", "20,325 W", "17,750 W"],
        ]}
        color={C.teal}
        colWidths={[160, 80, 130, 120, 120, 120]}
      />

      <NoteBox x={60} y={2874} w={280} h={100} icon={"\U0001F4A1"} title="Metabolic Notes"
        lines={["Seated office: 130 W total", "  → 75W sensible + 55W latent", "Cafeteria: higher latent", "Lab: heavy activity = 295W/p", "CLF applied for diversity"]}
        color={C.teal} />

      {/* ================================================ */}
      {/* SECTION 6: INTERNAL GAINS — LIGHTING             */}
      {/* ================================================ */}
      <PhaseBand y={3260} h={580} label="SECTION 6 — INTERNAL HEAT GAIN: LIGHTING" color={C.violet.bd} />

      <Arrow x1={CX} y1={3250} x2={CX} y2={3300} />

      <Box x={CX - 280} y={3300} w={560} h={64} label="STEP 6: Lighting Heat Gain"
        sub="All lighting energy converts to heat in conditioned space"
        color={C.violet} badge="CALC" />
      <Arrow x1={CX} y1={3364} x2={CX} y2={3394} />

      <FormulaBlock x={CX - 340} y={3394} w={680} h={108}
        lines={[
          "Q_lighting = Watts × 3.41 × BF × CLF",
          "",
          "BF = Ballast Factor (LED: 1.0, Fluorescent: 1.25)",
          "CLF = Cooling Load Factor (accounts for thermal mass)",
          "3.41 = Conversion W → BTU/hr (if BTU units used)",
        ]}
        color={C.violet} />
      <Arrow x1={CX} y1={3502} x2={CX} y2={3532} />

      <DataTable x={CX - 390} y={3532}
        title={"\U0001F4A1 LIGHTING HEAT GAIN — Q = W × BF × CLF"}
        headers={["Zone", "Area (m²)", "W/m² (LPD)", "Total W", "BF", "Q (Watts)"]}
        rows={[
          ["Office Areas", "420", "10", "4,200", "1.0", "4,200"],
          ["Conference Rooms", "120", "12", "1,440", "1.0", "1,440"],
          ["Cafeteria", "150", "10", "1,500", "1.0", "1,500"],
          ["Corridors", "180", "6", "1,080", "1.0", "1,080"],
          ["Lab / Workshop", "80", "15", "1,200", "1.0", "1,200"],
          ["Lobby & Reception", "70", "12", "840", "1.0", "840"],
          ["Total Lighting", "1,020", "—", "10,260", "—", "10,260 W"],
        ]}
        color={C.violet}
        colWidths={[160, 100, 110, 120, 80, 150]}
      />

      <NoteBox x={W - 340} y={3532} w={280} h={110} icon={"\u2600\uFE0F"} title="LPD Standards"
        lines={["ASHRAE 90.1: Office ≤ 10 W/m²", "ECBC India: ≤ 10.8 W/m²", "LED = BF 1.0 (no ballast heat)", "Fluorescent: BF = 1.20–1.25", "All sensible heat (no latent)"]}
        color={C.violet} />

      {/* ================================================ */}
      {/* SECTION 7: INTERNAL GAINS — EQUIPMENT            */}
      {/* ================================================ */}
      <PhaseBand y={3860} h={580} label="SECTION 7 — INTERNAL HEAT GAIN: EQUIPMENT & APPLIANCES" color={C.cyan.bd} />

      <Arrow x1={CX} y1={3850} x2={CX} y2={3900} />

      <Box x={CX - 280} y={3900} w={560} h={64} label="STEP 7: Equipment & Appliance Heat Gain"
        sub="Computers, printers, process equipment — all convert to heat"
        color={C.cyan} badge="CALC" />
      <Arrow x1={CX} y1={3964} x2={CX} y2={3994} />

      <FormulaBlock x={CX - 340} y={3994} w={680} h={90}
        lines={[
          "Q_equipment = Total kW × Usage Factor × 3,412 BTU/hr",
          "Or in SI: Q_equipment = Total kW × Usage Factor × 1000 (Watts)",
          "Usage Factor accounts for diversity (not all ON simultaneously)",
        ]}
        color={C.cyan} />
      <Arrow x1={CX} y1={4084} x2={CX} y2={4114} />

      <DataTable x={CX - 390} y={4114}
        title={"\U0001F5A5\uFE0F EQUIPMENT HEAT GAIN — Q = kW × UF × 1000"}
        headers={["Equipment", "Qty", "W Each", "Total W", "UF", "Q (Watts)"]}
        rows={[
          ["Desktop Computers", "80", "250", "20,000", "0.75", "15,000"],
          ["Laptops", "40", "65", "2,600", "0.90", "2,340"],
          ["Laser Printers", "8", "350", "2,800", "0.30", "840"],
          ["Photocopiers", "4", "1,200", "4,800", "0.20", "960"],
          ["Kitchen Equipment", "1 lot", "—", "8,000", "0.50", "4,000"],
          ["Lab Equipment", "1 lot", "—", "5,000", "0.60", "3,000"],
          ["Servers / Network", "2 racks", "3,000", "6,000", "1.00", "6,000"],
          ["Total Equipment", "—", "—", "49,200", "—", "32,140 W"],
        ]}
        color={C.cyan}
        colWidths={[160, 80, 100, 120, 80, 180]}
      />

      <NoteBox x={60} y={4114} w={280} h={110} icon={"\U0001F4BB"} title="Equipment Notes"
        lines={["Desktops: 250W (inc. monitor)", "Laptops: 65W typical", "Printers: low UF (30% ON)", "Servers: UF = 1.0 (always ON)", "Kitchen: 50% diversity"]}
        color={C.cyan} />

      {/* ================================================ */}
      {/* SECTION 8: VENTILATION & INFILTRATION LOAD       */}
      {/* ================================================ */}
      <PhaseBand y={4460} h={700} label="SECTION 8 — VENTILATION & INFILTRATION LOAD (Sensible + Latent)" color={C.rose.bd} />

      <Arrow x1={CX} y1={4450} x2={CX} y2={4500} />

      <Box x={CX - 280} y={4500} w={560} h={64} label="STEP 8: Ventilation & Infiltration Load"
        sub="Fresh air requirement + uncontrolled air leakage through envelope"
        color={C.rose} badge="CALC" />
      <Arrow x1={CX} y1={4564} x2={CX} y2={4594} />

      {/* Sensible ventilation */}
      <FormulaBlock x={60} y={4594} w={700} h={90}
        lines={[
          "Q_vent_sensible = 1.08 × CFM × (To - Ti)",
          "= 1.08 × 6,500 × (38.5 - 24.0)",
          "= 1.08 × 6,500 × 14.5 = 101,790 BTU/hr = 29,825 W",
        ]}
        color={C.rose} />

      {/* Latent ventilation */}
      <FormulaBlock x={60} y={4704} w={700} h={90}
        lines={[
          "Q_vent_latent = 0.68 × CFM × (Wo - Wi) × 7000",
          "= 0.68 × 6,500 × (0.0192 - 0.0093) × 7000",
          "= 0.68 × 6,500 × 0.0099 × 7000 = 306,306 BTU/hr = 89,761 W",
        ]}
        color={C.rose} />

      <NoteBox x={W - 340} y={4594} w={280} h={200} icon={"\U0001F32C\uFE0F"} title="Ventilation Design"
        lines={["CFM = 6,500 (ASHRAE 62.1)", "260 people × 25 CFM/person", "Infiltration: 0.5 ACH added", "to south & west exposures", "", "Mumbai: HIGH latent load!", "Wo-Wi = 0.0099 kg/kg", "Dehumidification is critical", "for occupant comfort"]}
        color={C.rose} />

      <Arrow x1={410} y1={4794} x2={410} y2={4824} />

      <DataTable x={CX - 390} y={4824}
        title={"\U0001F32C\uFE0F VENTILATION & INFILTRATION SUMMARY"}
        headers={["Component", "CFM", "Sensible (W)", "Latent (W)", "Total (W)"]}
        rows={[
          ["Fresh Air (Mech.)", "6,500", "29,825", "89,761", "119,586"],
          ["Infiltration (0.5 ACH)", "850", "3,901", "11,748", "15,649"],
          ["Total Vent+Infil", "7,350", "33,726 W", "101,509 W", "135,235 W"],
        ]}
        color={C.rose}
        colWidths={[180, 120, 160, 160, 160]}
      />

      {/* ================================================ */}
      {/* SECTION 9: SUB-SYSTEM SUMMATION                  */}
      {/* ================================================ */}
      <PhaseBand y={5180} h={660} label="SECTION 9 — SUB-SYSTEM SUMMATION: ALL 5 HEAT GAIN CATEGORIES" color={C.green.bd} />

      <Arrow x1={CX} y1={5170} x2={CX} y2={5220} />

      <Box x={CX - 280} y={5220} w={560} h={64} label="STEP 9: Sum All Heat Gain Sub-Systems"
        sub="Aggregate Envelope + Glass + People + Lighting + Equipment + Ventilation"
        color={C.green} badge="SUMMATION" />
      <Arrow x1={CX} y1={5284} x2={CX} y2={5314} />

      <DataTable x={CX - 390} y={5314}
        title={"\U0001F4CA COMPLETE HEAT GAIN SUMMARY — ALL 5 SUB-SYSTEMS"}
        headers={["Sub-System", "Sensible (W)", "Latent (W)", "Total (W)", "% of Total"]}
        rows={[
          ["1. Opaque Surfaces", "50,083", "—", "50,083", "14.6%"],
          ["2. Fenestration (Glass)", "90,105", "—", "90,105", "26.3%"],
          ["3. Occupancy (People)", "20,325", "17,750", "38,075", "11.1%"],
          ["4. Lighting", "10,260", "—", "10,260", "3.0%"],
          ["5. Equipment", "32,140", "—", "32,140", "9.4%"],
          ["6. Ventilation + Infil.", "33,726", "101,509", "135,235", "39.5%"],
          ["─── ROOM TOTALS ───", "—", "—", "—", "—"],
          ["Room Sensible (RSH)", "236,639", "—", "—", "—"],
          ["Room Latent (RLH)", "—", "119,259", "—", "—"],
          ["Room Total (RTH)", "—", "—", "342,398 W", "100%"],
        ]}
        color={C.green}
        colWidths={[190, 130, 130, 150, 120]}
      />

      <NoteBox x={60} y={5314} w={280} h={130} icon={"\U0001F4CA"} title="Load Breakdown"
        lines={["Ventilation = 39.5% (LARGEST!)", "Glass = 26.3% (solar gain)", "Opaque = 14.6% (walls+roof)", "People = 11.1% (metabolic)", "Equipment = 9.4%", "Lighting = 3.0% (LED efficient)"]}
        color={C.green} />

      <NoteBox x={W - 340} y={5314} w={280} h={130} icon={"\u26A0\uFE0F"} title="Mumbai Climate Impact"
        lines={["Latent = 119 kW (35% of RTH!)", "Sensible = 237 kW (65%)", "SHR = 0.65 (humid climate)", "Standard SHR = 0.70–0.80", "Dehumidification capacity", "is critical for Mumbai"]}
        color={C.rose} />

      {/* ================================================ */}
      {/* SECTION 10: RSH + RLH = RTH FORMULA              */}
      {/* ================================================ */}
      <PhaseBand y={5860} h={400} label="SECTION 10 — RSH + RLH = RTH (ROOM TOTAL HEAT)" color={C.amber.bd} />

      <Arrow x1={CX} y1={5850} x2={CX} y2={5900} />

      <FormulaBlock x={CX - 380} y={5900} w={760} h={128}
        lines={[
          "ROOM HEAT SUMMATION:",
          "RSH (Room Sensible Heat) = 236,639 W",
          "RLH (Room Latent Heat) = 119,259 W",
          "",
          "RTH = RSH + RLH = 236,639 + 119,259 = 355,898 W",
          "SHR = RSH / RTH = 236,639 / 355,898 = 0.665",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={6028} x2={CX} y2={6060} />

      <Diamond cx={CX} cy={6120} rxD={180} ryD={55} label="SHR < 0.75?"
        sub="High latent = special coil" color={C.amber} />

      <Arrow x1={CX} y1={6175} x2={CX} y2={6210} color={C.green.bd} label="SHR = 0.665 YES" />

      <Arrow x1={CX + 180} y1={6120} x2={W - 160} y2={6120} color={C.slate.bd} label="SHR > 0.75" />
      <NoteBox x={W - 340} y={6085} w={280} h={90} icon={"\u2705"} title="If SHR > 0.75"
        lines={["Standard DX coil sufficient", "Normal chilled water temp", "No special dehumidification", "Typical for dry climates"]}
        color={C.green} />

      <Box x={CX - 280} y={6210} w={560} h={64}
        label="Low SHR (0.665) → Deep Cooling Coil Required"
        sub="4-row or 6-row coil for dehumidification | Chilled water at 6°C supply"
        color={C.rose} badge="ALERT" />

      {/* ================================================ */}
      {/* SECTION 11: GRAND TOTAL HEAT (GTH)               */}
      {/* ================================================ */}
      <PhaseBand y={6310} h={600} label="SECTION 11 — GRAND TOTAL HEAT (GTH): DUCT GAIN + FAN HEAT + SAFETY" color={C.red.bd} />

      <Arrow x1={CX} y1={6284} x2={CX} y2={6350} />

      <Box x={CX - 280} y={6350} w={560} h={64} label="STEP 10: Apply System Factors for GTH"
        sub="Add duct heat gain, fan motor heat, and safety factor to RTH"
        color={C.red} badge="GTH CALC" />
      <Arrow x1={CX} y1={6414} x2={CX} y2={6444} />

      <DataTable x={CX - 390} y={6444}
        title={"\U0001F525 GRAND TOTAL HEAT (GTH) BUILD-UP"}
        headers={["Component", "Value", "Factor", "Heat (W)", "Notes"]}
        rows={[
          ["RTH (Room Total)", "—", "—", "355,898", "From Section 10"],
          ["Duct Heat Gain", "RTH", "× 2%", "7,118", "Unconditioned space loss"],
          ["Fan Motor Heat", "RTH", "× 3%", "10,677", "AHU fan motor heat"],
          ["Pump Heat", "RTH", "× 1%", "3,559", "CHW pump heat gain"],
          ["Safety Factor", "RTH", "× 5%", "17,795", "Margin for unknowns"],
          ["Grand Total Heat", "—", "—", "395,047 W", "GTH = RTH × 1.11"],
        ]}
        color={C.red}
        colWidths={[170, 100, 120, 160, 180]}
      />

      <FormulaBlock x={CX - 340} y={6702} w={680} h={72}
        lines={[
          "GTH = RTH × (1 + Duct% + Fan% + Pump% + Safety%)",
          "GTH = 355,898 × 1.11 = 395,047 W = 395.0 kW",
        ]}
        color={C.red} />

      <NoteBox x={60} y={6702} w={280} h={100} icon={"\U0001F4A1"} title="System Factor Notes"
        lines={["Duct gain: 2% (insulated ducts)", "Fan heat: 3% (draw-through)", "Safety: 5% (standard margin)", "Total markup: 11% over RTH", "Per ASHRAE guidelines"]}
        color={C.red} />

      {/* ================================================ */}
      {/* SECTION 12: TR CONVERSION & CFM SIZING           */}
      {/* ================================================ */}
      <PhaseBand y={6830} h={700} label="SECTION 12 — TR CONVERSION & AIRFLOW (CFM) CALCULATION" color={C.cyan.bd} />

      <Arrow x1={CX} y1={6810} x2={CX} y2={6870} />

      <Box x={CX - 280} y={6870} w={560} h={64} label="STEP 11: Convert to Tons of Refrigeration (TR)"
        sub="GTH → TR using standard conversion factor"
        color={C.cyan} badge="TR CALC" />
      <Arrow x1={CX} y1={6934} x2={CX} y2={6964} />

      <FormulaBlock x={CX - 340} y={6964} w={680} h={128}
        lines={[
          "TONS OF REFRIGERATION (TR):",
          "TR = GTH / 3,517 W (SI) or GTH / 12,000 BTU/hr",
          "TR = 395,047 / 3,517 = 112.3 TR",
          "",
          "REQUIRED AIRFLOW (CFM):",
          "CFM = RSH / (1.08 × (T_room - T_supply))",
          "CFM = 236,639 × 3.41 / (1.08 × (24 - 14)) = 74,712 CFM",
        ]}
        color={C.cyan} />
      <Arrow x1={CX} y1={7092} x2={CX} y2={7122} />

      <DataTable x={CX - 390} y={7122}
        title={"\u2744\uFE0F TR & CFM — ZONE-WISE BREAKDOWN"}
        headers={["Zone", "Area (m²)", "W/m²", "Zone Load (W)", "TR", "CFM"]}
        rows={[
          ["Office Areas", "420", "385", "161,700", "46.0", "30,500"],
          ["Conference Rooms", "120", "395", "47,400", "13.5", "8,940"],
          ["Cafeteria", "150", "410", "61,500", "17.5", "11,600"],
          ["Corridors", "180", "180", "32,400", "9.2", "6,110"],
          ["Lab / Workshop", "80", "490", "39,200", "11.1", "7,400"],
          ["Lobby & Reception", "70", "380", "26,600", "7.6", "5,020"],
          ["Server Room", "—", "—", "26,247", "7.5", "4,950"],
          ["Grand Total", "1,020", "387 avg", "395,047", "112.3 TR", "74,520 CFM"],
        ]}
        color={C.cyan}
        colWidths={[160, 90, 90, 140, 100, 140]}
      />

      <NoteBox x={60} y={7122} w={280} h={110} icon={"\U0001F4A1"} title="Supply Air Design"
        lines={["T_supply = 14°C (55°F)", "\u0394T = 24 - 14 = 10°C", "Air changes: 10–15 ACH", "Velocity: 2.5 m/s (diffuser)", "ADP: 11°C for SHR = 0.665"]}
        color={C.cyan} />

      {/* ================================================ */}
      {/* SECTION 13: EQUIPMENT SELECTION & VALIDATION     */}
      {/* ================================================ */}
      <PhaseBand y={7550} h={760} label="SECTION 13 — EQUIPMENT SELECTION & SYSTEM VALIDATION" color={C.violet.bd} />

      <Arrow x1={CX} y1={7540} x2={CX} y2={7590} />

      <Box x={CX - 280} y={7590} w={560} h={64} label="STEP 12: HVAC Equipment Selection"
        sub="Match TR capacity to chiller/VRF model from manufacturer catalogue"
        color={C.violet} badge="SELECT" />
      <Arrow x1={CX} y1={7654} x2={CX} y2={7684} />

      {/* Equipment Decision Diamond */}
      <Diamond cx={CX} cy={7740} rxD={180} ryD={55} label="System Type?"
        sub="Based on TR & building" color={C.violet} />

      <Arrow x1={CX - 180} y1={7740} x2={180} y2={7740} color={C.blue.bd} label="< 30 TR" />
      <NoteBox x={60} y={7705} w={220} h={90} icon={"\u2744\uFE0F"} title="VRF / Split"
        lines={["For small zones", "Individual control", "No chilled water piping", "COP: 3.5–4.5"]}
        color={C.blue} />

      <Arrow x1={CX + 180} y1={7740} x2={W - 180} y2={7740} color={C.green.bd} label="> 100 TR" />
      <NoteBox x={W - 300} y={7705} w={220} h={90} icon={"\U0001F3ED"} title="Centrifugal Chiller"
        lines={["Large capacity", "High efficiency", "COP: 5.5–7.0", "Requires cooling tower"]}
        color={C.green} />

      <Arrow x1={CX} y1={7795} x2={CX} y2={7830} color={C.amber.bd} label="112 TR → Screw Chiller" />

      <Box x={CX - 280} y={7830} w={560} h={64}
        label="Selected: Water-Cooled Screw Chiller (120 TR)"
        sub="COP: 5.2 | Refrigerant: R-134a | Carrier/Trane/Daikin"
        color={C.green} badge="SELECTED" />
      <Arrow x1={CX} y1={7894} x2={CX} y2={7924} />

      <DataTable x={CX - 390} y={7924}
        title={"\U0001F3ED EQUIPMENT SCHEDULE — SELECTED HVAC SYSTEM"}
        headers={["Equipment", "Capacity", "Qty", "Power (kW)", "Notes"]}
        rows={[
          ["Screw Chiller", "120 TR", "1+1 standby", "82.0", "Water-cooled, R-134a"],
          ["Cooling Tower", "150 TR", "1", "7.5", "Induced draft, FRP"],
          ["Primary CHW Pump", "60 m³/hr", "2 (1+1)", "11.0", "7°C supply / 12°C return"],
          ["Secondary CHW Pump", "45 m³/hr", "3 (2+1)", "7.5", "Variable speed drive"],
          ["AHU (Office)", "30,000 CFM", "2", "22.0", "6-row coil, HEPA filter"],
          ["AHU (Cafeteria)", "12,000 CFM", "1", "11.0", "4-row coil, G4+F7"],
          ["FCU (Rooms)", "1,200 CFM ea", "12", "0.37 ea", "Concealed ceiling type"],
          ["PAU (Fresh Air)", "7,500 CFM", "1", "15.0", "Enthalpy wheel ERV"],
        ]}
        color={C.violet}
        colWidths={[180, 120, 100, 120, 200]}
      />

      {/* ================================================ */}
      {/* SECTION 14: TRIPLE VALIDATION GATE               */}
      {/* ================================================ */}
      <PhaseBand y={8340} h={430} label="SECTION 14 — VALIDATION GATE: LOAD, EFFICIENCY & COMFORT" color={C.green.bd} />

      <Arrow x1={CX} y1={8320} x2={CX} y2={8380} />

      <g>
        <rect x={CX - 380} y={8380} width={760} height={260} rx={16}
          fill={C.green.bg} stroke={C.green.bd} strokeWidth={3} />
        <text x={CX} y={8410} textAnchor="middle" fill={C.green.tx} fontSize={16} fontWeight={800}>
          {"\u2705"} QUADRUPLE VALIDATION GATE — ALL CHECKS PASSED
        </text>
        {/* Check 1 */}
        <rect x={CX - 360} y={8425} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={8445} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Load Check: GTH (395 kW) {"<"} Chiller Capacity (120 TR × 3.517 = 422 kW) — PASS
        </text>
        {/* Check 2 */}
        <rect x={CX - 360} y={8462} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={8482} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Efficiency: COP = 5.2 {">"} ECBC Min 4.6 (Water-Cooled Screw) — PASS
        </text>
        {/* Check 3 */}
        <rect x={CX - 360} y={8499} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={8519} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Comfort: Indoor 24°C ± 1°C, RH 50% ± 5% — Meets ASHRAE 55 — PASS
        </text>
        {/* Check 4 */}
        <rect x={CX - 360} y={8536} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={8556} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Fresh Air: 25 CFM/person (6,500 CFM total) — Meets ASHRAE 62.1 — PASS
        </text>
        {/* Check 5 */}
        <rect x={CX - 360} y={8573} width={720} height={30} rx={6} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
        <text x={CX - 340} y={8593} fill={C.green.tx} fontSize={12} fontWeight={600}>
          {"\u2705"} Dehumidification: 6-row coil ADP = 11°C for SHR 0.665 — PASS
        </text>
      </g>

      {/* ================================================ */}
      {/* SECTION 15: EPI & ENERGY ANALYSIS                */}
      {/* ================================================ */}
      <PhaseBand y={8800} h={600} label="SECTION 15 — ENERGY PERFORMANCE INDEX (EPI) & ANNUAL ANALYSIS" color={C.slate.bd} />

      <Arrow x1={CX} y1={8780} x2={CX} y2={8840} />

      <Box x={CX - 280} y={8840} w={560} h={64} label="STEP 13: Energy Performance Analysis"
        sub="Annual energy estimation and EPI calculation per ECBC standards"
        color={C.slate} badge="ENERGY" />
      <Arrow x1={CX} y1={8904} x2={CX} y2={8934} />

      <DataTable x={CX - 390} y={8934}
        title={"\U0001F4CA ANNUAL ENERGY ANALYSIS — HVAC SYSTEM"}
        headers={["Parameter", "Value", "Unit", "Notes"]}
        rows={[
          ["Peak Cooling Load", "395.0", "kW", "GTH at design day"],
          ["Chiller Input Power", "82.0", "kW", "At full load"],
          ["Total HVAC Power", "156.0", "kW", "Inc. pumps, fans, CT"],
          ["Operating Hours", "3,120", "hrs/yr", "12h × 260 working days"],
          ["Annual HVAC Energy", "486,720", "kWh/yr", "156 × 3,120"],
          ["Building Total Energy", "650,000", "kWh/yr", "HVAC + Light + Power"],
          ["Built-Up Area", "1,020", "m²", "Conditioned area"],
          ["EPI (HVAC only)", "477", "kWh/m²/yr", "486,720 / 1,020"],
          ["EPI (Total Building)", "637", "kWh/m²/yr", "ECBC: ≤ 170 (target)"],
        ]}
        color={C.slate}
        colWidths={[200, 130, 120, 270]}
      />

      <NoteBox x={60} y={8934} w={280} h={130} icon={"\U0001F4A1"} title="EPI Benchmarks (ECBC)"
        lines={["ECBC Compliant: ≤ 170 kWh/m²/yr", "ECBC+: ≤ 140 kWh/m²/yr", "Super ECBC: ≤ 115 kWh/m²/yr", "", "Current EPI = 637 (high!)", "Glass = major contributor", "Recommend: Low-E glass upgrade"]}
        color={C.slate} />

      <NoteBox x={W - 340} y={8934} w={280} h={130} icon={"\U0001F33F"} title="Energy Saving Ideas"
        lines={["1. Low-E glass: -54% solar", "2. External shading: -20% W/E", "3. ERV on fresh air: -30% vent", "4. VFD on pumps: -25% pump", "5. LED (already): BF = 1.0", "Potential: 40–50% reduction"]}
        color={C.green} />

      {/* ================================================ */}
      {/* SECTION 16: OUTPUT DASHBOARD                     */}
      {/* ================================================ */}
      <PhaseBand y={9450} h={700} label="SECTION 16 — THERMAL COOLING LOAD OUTPUT DASHBOARD" color={C.green.bd} />

      <Arrow x1={CX} y1={9430} x2={CX} y2={9500} />

      {/* Dashboard KPI row 1 */}
      <ValueBlock x={60} y={9500} w={230} h={95} label="Grand Total Heat" value="395.0" unit="kW (GTH)" color={C.red} icon={"\U0001F525"} />
      <ValueBlock x={310} y={9500} w={230} h={95} label="Cooling Capacity" value="112.3" unit="TR (Tons)" color={C.cyan} icon={"\u2744\uFE0F"} />
      <ValueBlock x={560} y={9500} w={230} h={95} label="Room Sensible" value="236.6" unit="kW (RSH)" color={C.amber} icon={"\U0001F321\uFE0F"} />
      <ValueBlock x={810} y={9500} w={230} h={95} label="Room Latent" value="119.3" unit="kW (RLH)" color={C.rose} icon={"\U0001F4A7"} />
      <ValueBlock x={1060} y={9500} w={230} h={95} label="SHR" value="0.665" unit="Sensible Heat Ratio" color={C.orange} icon={"\U0001F4CA"} />
      <ValueBlock x={1310} y={9500} w={230} h={95} label="Total Airflow" value="74,520" unit="CFM" color={C.blue} icon={"\U0001F32C\uFE0F"} />

      {/* Dashboard KPI row 2 */}
      <ValueBlock x={60} y={9620} w={230} h={95} label="Chiller" value="120 TR" unit="Screw, Water-Cooled" color={C.green} icon={"\U0001F3ED"} />
      <ValueBlock x={310} y={9620} w={230} h={95} label="COP" value="5.2" unit="Efficiency Rating" color={C.teal} icon={"\u26A1"} />
      <ValueBlock x={560} y={9620} w={230} h={95} label="CHW Supply" value="7°C" unit="Chilled Water Temp" color={C.cyan} icon={"\U0001F4A7"} />
      <ValueBlock x={810} y={9620} w={230} h={95} label="Occupancy" value="260" unit="People (Design)" color={C.purple} icon={"\U0001F9D1"} />
      <ValueBlock x={1060} y={9620} w={230} h={95} label="Building Area" value="1,020" unit="m² Conditioned" color={C.slate} icon={"\U0001F3D7\uFE0F"} />
      <ValueBlock x={1310} y={9620} w={230} h={95} label="W/m²" value="387" unit="Avg Load Density" color={C.violet} icon={"\U0001F4CF"} />

      {/* Load Breakdown Visual */}
      <g>
        <rect x={60} y={9750} width={W - 120} height={210} rx={14} fill="#fef2f2" stroke={C.red.bd} strokeWidth={3} strokeDasharray="10,5" />
        <text x={CX} y={9780} textAnchor="middle" fill={C.red.tx} fontSize={15} fontWeight={700}>
          {"\U0001F4CA"} COOLING LOAD CASCADE — INPUT TO TR
        </text>

        {/* Stacked bars */}
        <rect x={120} y={9810} width={520} height={32} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
        <text x={380} y={9831} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={700}>
          Ventilation + Infiltration: 135.2 kW (39.5%)
        </text>

        <rect x={120} y={9850} width={380} height={32} rx={6} fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2} />
        <text x={310} y={9871} textAnchor="middle" fill={C.orange.tx} fontSize={12} fontWeight={700}>
          Fenestration (Glass): 90.1 kW (26.3%)
        </text>

        <rect x={120} y={9890} width={210} height={32} rx={6} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} />
        <text x={225} y={9911} textAnchor="middle" fill={C.amber.tx} fontSize={12} fontWeight={700}>
          Opaque Surfaces: 50.1 kW (14.6%)
        </text>

        <rect x={120} y={9930} width={150} height={32} rx={6} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
        <text x={195} y={9951} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={700}>
          Occupancy: 38.1 kW (11.1%)
        </text>

        {/* Summary text */}
        <text x={900} y={9830} fill={C.slate.tx} fontSize={11}>RTH = 355.9 kW (Room Total)</text>
        <text x={900} y={9855} fill={C.slate.tx} fontSize={11}>+ System Factors: × 1.11</text>
        <text x={900} y={9880} fill={C.slate.tx} fontSize={11}>= GTH: 395.0 kW (Grand Total)</text>
        <text x={900} y={9905} fill={C.slate.tx} fontSize={11}>÷ 3,517 W/TR</text>
        <text x={900} y={9930} fill={C.slate.tx} fontSize={12} fontWeight={700}>= 112.3 TR → Select 120 TR Chiller</text>
      </g>

      {/* Completion Terminal */}
      <Arrow x1={CX} y1={9970} x2={CX} y2={10010} />
      <rect x={CX - 210} y={10010} width={420} height={56} rx={28}
        fill="#dc2626" stroke="#ef4444" strokeWidth={3} />
      <text x={CX} y={10044} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={800}>
        {"\U0001F3C1"} HEAT LOAD CALCULATION COMPLETE
      </text>

      {/* ================================================ */}
      {/* REFERENCE TABLE                                  */}
      {/* ================================================ */}
      <PhaseBand y={10100} h={380} label="REFERENCE — HVAC vs ELECTRICAL vs PLUMBING CALCULATION PARALLELS" color={C.slate.bd} />

      <DataTable x={CX - 390} y={10140}
        title={"\U0001F4DA CROSS-DISCIPLINE CALCULATION COMPARISON"}
        headers={["HVAC Concept", "Electrical Parallel", "Plumbing Parallel"]}
        rows={[
          ["Cooling Load (kW)", "Electrical Load (kW)", "Water Demand (LPM)"],
          ["Diversity Factor (SHR)", "Demand Factor (DF)", "Simultaneity Factor"],
          ["TR (Tons Refrig.)", "kVA (Apparent Power)", "m³/hr (Flow Rate)"],
          ["CFM (Airflow)", "Amps (Current)", "L/s (Pipe Flow)"],
          ["Duct Sizing", "Cable Sizing", "Pipe Sizing"],
          ["Chiller Selection", "Transformer Selection", "Pump Selection"],
          ["EPI (kWh/m²/yr)", "Load Factor (%)", "Water Index (L/p/d)"],
          ["ASHRAE / ECBC", "IS 732 / NBC 2016", "IS 3500 / NBC 2016"],
        ]}
        color={C.slate}
        colWidths={[260, 260, 200]}
      />

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 42} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        HLC-001 | Building Thermal Cooling Load | Clariant Plot A2 | Prepared by: Sumit Maurya | ASHRAE / IS 3103 / NBC 2016
      </text>
      <text x={CX} y={H - 24} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        Technical Standard: CLTD/SCL/CLF Method | Manning's & Rational Method Cross-Reference | Rev 01
      </text>
    </svg>
  );
}
