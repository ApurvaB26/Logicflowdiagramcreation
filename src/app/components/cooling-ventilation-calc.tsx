import React from "react";

// =====================================================================
// VENT — COMPREHENSIVE BUILDING COOLING LOAD, VENTILATION &
// PRESSURIZATION CALCULATION FLOWCHART
// 16 Sections across 3 Phases:
//   Phase 1 (Cooling Load):  Inputs → Conduction → Solar → Occupancy
//     → Lighting → Equipment → Ventilation/Psychrometrics → ERSH/GTH/TR
//   Phase 2 (Pressurization): Hub → Staircase → Lift Well → Lift Lobby
//     → Common Output
//   Phase 3 (Dashboard): Summary Table + 12-KPI Dashboard + Bar Charts
// Standards: ASHRAE 62.1 / ASHRAE Fundamentals / NBC 2016 / IS 3103
// Project: Clariant Plot A2 — Commercial + Industrial Zones
// =====================================================================

const W = 1600;
const H = 6150;
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

/* ─── Helpers ─── */
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

function Sec({ y, num, title, color }: { y: number; num: string; title: string; color: string }) {
  return (
    <g>
      <rect x={CX - 310} y={y} width={620} height={38} rx={19} fill={color} />
      <text x={CX} y={y + 24} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {num} {title}
      </text>
    </g>
  );
}

function Arr({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.arrow} strokeWidth={2} markerEnd="url(#cv-arrow)" />;
}

function Diamond({ cx, cy, w, h, text, sub, c }: { cx: number; cy: number; w: number; h: number; text: string; sub?: string; c: typeof C.amber }) {
  const hw = w / 2, hh = h / 2;
  return (
    <g>
      <polygon points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={c.bg} stroke={c.bd} strokeWidth={2} />
      <text x={cx} y={sub ? cy - 5 : cy + 4} textAnchor="middle" fill={c.tx} fontSize={12} fontWeight={700}>{text}</text>
      {sub && <text x={cx} y={cy + 12} textAnchor="middle" fill={c.tx} fontSize={10}>{sub}</text>}
    </g>
  );
}

function Note({ x, y, w, lines, c }: { x: number; y: number; w: number; lines: string[]; c: typeof C.rose }) {
  const h = 22 + lines.length * 15;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={c.bg} stroke={c.bd} strokeWidth={1.5} strokeDasharray="6,3" />
      {lines.map((l, i) => (
        <text key={i} x={x + 10} y={y + 16 + i * 15} fill={c.tx} fontSize={10}>{l}</text>
      ))}
    </g>
  );
}

export function CoolingVentilationCalcSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <defs>
        <marker id="cv-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill={C.arrow} />
        </marker>
        <linearGradient id="cv-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="cv-glow">
          <feDropShadow dx={0} dy={2} stdDeviation={4} floodColor="#00000015" />
        </filter>
      </defs>

      {/* BG */}
      <rect width={W} height={H} rx={18} fill="#f8fafc" />

      {/* ───────── HEADER ───────── */}
      <rect x={40} y={30} width={W - 80} height={110} rx={16} fill="url(#cv-head)" filter="url(#cv-glow)" />
      <text x={CX} y={66} textAnchor="middle" fill="#fff" fontSize={21} fontWeight={800}>
        {"❄\uFE0F"} Building Cooling Load, Ventilation &amp; Pressurization
      </text>
      <text x={CX} y={90} textAnchor="middle" fill="#c4b5fd" fontSize={13}>
        ASHRAE Fundamentals / ASHRAE 62.1 / NBC 2016 / IS 3103 &mdash; Comprehensive HVAC Design
      </text>
      <text x={CX} y={110} textAnchor="middle" fill="#a5b4fc" fontSize={11}>
        Project: Clariant Plot A2 | Location: 18.5&deg;N, 73.8&deg;E | Climate Zone: Hot &amp; Humid
      </text>
      <text x={CX} y={128} textAnchor="middle" fill="#a5b4fc" fontSize={10}>
        Outdoor: 42&deg;C DBT / 27&deg;C WBT | Indoor: 24&deg;C / 50% RH | Total BUA: 12,500 m&sup2;
      </text>

      {/* ═══════ PHASE 1 — COOLING LOAD CALCULATION ═══════ */}
      <PhaseBand y={160} h={3580} label="PHASE 1 — BUILDING COOLING LOAD CALCULATION (ASHRAE)" color="#3b82f6" />

      {/* ── §1 INPUT & AMBIENT CONDITIONS ── */}
      <Sec y={190} num="§1" title="Input &amp; Ambient Design Conditions" color="#3b82f6" />
      <Arr x1={CX} y1={228} x2={CX} y2={250} />

      {/* Two input boxes side by side */}
      <rect x={80} y={250} width={660} height={220} rx={12} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} filter="url(#cv-glow)" />
      <text x={410} y={275} textAnchor="middle" fill={C.blue.tx} fontSize={13} fontWeight={700}>{"🌍"} Geographic &amp; Outdoor Design Data</text>
      {[
        ["Latitude / Longitude", "18.52\u00b0N / 73.85\u00b0E"],
        ["Climate Zone (NBC)", "Hot & Humid (Zone III)"],
        ["Outdoor DBT (design)", "42\u00b0C (107.6\u00b0F)"],
        ["Outdoor WBT (coincident)", "27\u00b0C (80.6\u00b0F)"],
        ["Daily Range", "11\u00b0C"],
        ["Outdoor Humidity Ratio (W\u2092)", "118 gr/lb"],
        ["Solar Declination (Jun 21)", "+23.45\u00b0"],
        ["Clearness Factor", "1.0 (clear sky)"],
        ["Wind Speed (design)", "3.5 m/s"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={110} y={300 + i * 18} fill={C.blue.tx} fontSize={10} fontWeight={600}>{label}:</text>
          <text x={400} y={300 + i * 18} fill={C.blue.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      <rect x={860} y={250} width={660} height={220} rx={12} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} filter="url(#cv-glow)" />
      <text x={1190} y={275} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={700}>{"🏢"} Indoor Design Parameters</text>
      {[
        ["Indoor Temperature (T\u1D62)", "24\u00b0C (75.2\u00b0F)"],
        ["Indoor RH", "50% (\u00b15%)"],
        ["Indoor Humidity Ratio (W\u1D62)", "65 gr/lb"],
        ["Air Changes/Hour (ACPH)", "Per room type (table below)"],
        ["Occupancy Density", "10 m\u00b2/person (office)"],
        ["Fresh Air (ASHRAE 62.1)", "8.5 L/s per person + 0.6 L/s\u00b7m\u00b2"],
        ["Pressurization", "+12.5 Pa (positive pressure)"],
        ["Noise Criteria", "NC-35 (office) / NC-40 (lab)"],
        ["Filtration", "MERV-13 (minimum)"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={890} y={300 + i * 18} fill={C.purple.tx} fontSize={10} fontWeight={600}>{label}:</text>
          <text x={1190} y={300 + i * 18} fill={C.purple.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      <Arr x1={CX} y1={470} x2={CX} y2={500} />

      {/* ── §2 EXTERNAL LOADS — CONDUCTION ── */}
      <Sec y={500} num="§2" title="External Load: Conduction (Walls / Roof / Floor)" color="#8b5cf6" />
      <Arr x1={CX} y1={538} x2={CX} y2={560} />

      <rect x={CX - 380} y={560} width={760} height={310} rx={12} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
      <text x={CX} y={585} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={700}>{"🧮"} Conduction Heat Gain — CLTD Method</text>

      {/* Master formula */}
      <rect x={CX - 300} y={598} width={600} height={36} rx={8} fill="#fff" stroke={C.purple.bd} strokeWidth={1.5} />
      <text x={CX} y={621} textAnchor="middle" fill={C.purple.tx} fontSize={14} fontWeight={800}>
        Q = U {"×"} A {"×"} CLTD_corrected {"×"} LM {"×"} K (BTU/hr)
      </text>

      <text x={CX - 340} y={655} fill={C.purple.tx} fontSize={11} fontWeight={700}>Variable Reference:</text>
      {[
        ["U = Overall heat transfer coeff.", "Wall: 0.45, Roof: 0.36, Floor: 0.28 BTU/hr·ft²·°F"],
        ["A = Surface area", "Per architectural drawings (ft²)"],
        ["CLTD = Cooling Load Temp Diff.", "From ASHRAE Table 30/32 (corrected for latitude & month)"],
        ["LM = Latitude-Month correction", "ASHRAE Table 33"],
        ["K = Color adjustment factor", "Dark=1.0, Medium=0.83, Light=0.65"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 340} y={675 + i * 18} fill={C.purple.tx} fontSize={10}>{label}</text>
          <text x={CX + 50} y={675 + i * 18} fill={C.purple.tx} fontSize={10} fontWeight={600}>{val}</text>
        </g>
      ))}

      {/* Results mini-table */}
      {(() => {
        const cols = ["Surface", "U", "A (ft\u00b2)", "CLTD", "LM", "K", "Q (BTU/hr)"];
        const xs = [CX - 350, CX - 240, CX - 160, CX - 60, CX + 20, CX + 90, CX + 170];
        return (
          <g>
            <rect x={CX - 360} y={770} width={720} height={22} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={785} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["North Wall", "0.45", "3,200", "14", "0", "0.83", "16,867"],
              ["South Wall", "0.45", "2,800", "22", "+2", "0.83", "23,310"],
              ["East Wall", "0.45", "1,500", "28", "+1", "1.0", "19,530"],
              ["West Wall", "0.45", "1,500", "30", "+1", "1.0", "20,925"],
              ["Roof (flat)", "0.36", "8,000", "38", "0", "0.83", "90,662"],
              ["Floor (on grade)", "0.28", "8,000", "5", "—", "—", "11,200"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={796 + i * 14} fill={C.purple.tx} fontSize={9}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <rect x={CX - 160} y={875} width={320} height={20} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={889} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>{"✅"} Total Conduction = 182,494 BTU/hr</text>

      <Note x={CX + 400} y={570} w={170} lines={["\u26A0\uFE0F CLTD Correction:", "CLTD_c = CLTD + (25.5 - T\u1D63)", "+ (T\u2092 - 29.4)", "T\u1D63 = indoor (24\u00b0C)", "T\u2092 = outdoor mean"]} c={C.amber} />

      <Arr x1={CX} y1={900} x2={CX} y2={930} />

      {/* ── §3 SOLAR RADIATION — FENESTRATION ── */}
      <Sec y={930} num="§3" title="External Load: Solar Radiation (Fenestration)" color="#f59e0b" />
      <Arr x1={CX} y1={968} x2={CX} y2={990} />

      <rect x={CX - 360} y={990} width={720} height={280} rx={12} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} />
      <text x={CX} y={1015} textAnchor="middle" fill={C.amber.tx} fontSize={13} fontWeight={700}>{"☀\uFE0F"} Fenestration Solar Heat Gain</text>

      <rect x={CX - 300} y={1030} width={600} height={36} rx={8} fill="#fff" stroke={C.amber.bd} strokeWidth={1.5} />
      <text x={CX} y={1053} textAnchor="middle" fill={C.amber.tx} fontSize={14} fontWeight={800}>
        Q = A {"×"} SC {"×"} SHGF {"×"} CLF (BTU/hr)
      </text>

      {[
        "A = Glass area (ft\u00b2) — per orientation from drawings",
        "SC = Shading Coefficient (single clear = 1.0, double low-e = 0.45)",
        "SHGF = Solar Heat Gain Factor (BTU/hr\u00b7ft\u00b2) — ASHRAE Table 36",
        "CLF = Cooling Load Factor — accounts for thermal mass delay",
      ].map((s, i) => (
        <text key={i} x={CX - 320} y={1085 + i * 18} fill={C.amber.tx} fontSize={10}>{s}</text>
      ))}

      {/* Solar results */}
      {(() => {
        const cols = ["Orientation", "A (ft\u00b2)", "SC", "SHGF", "CLF", "Q (BTU/hr)"];
        const xs = [CX - 320, CX - 180, CX - 80, CX + 10, CX + 110, CX + 210];
        return (
          <g>
            <rect x={CX - 330} y={1162} width={660} height={20} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={1176} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["North", "800", "0.45", "36", "0.73", "9,461"],
              ["South", "600", "0.45", "118", "0.59", "18,860"],
              ["East", "400", "0.45", "216", "0.53", "20,606"],
              ["West", "400", "0.45", "216", "0.55", "21,384"],
              ["Skylight", "200", "0.60", "250", "0.80", "24,000"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={1198 + i * 18} fill={C.amber.tx} fontSize={9}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <rect x={CX - 160} y={1283} width={320} height={22} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={1298} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>{"✅"} Total Solar = 94,311 BTU/hr</text>

      <Note x={60} y={1000} w={190} lines={["\uD83D\uDCCC ASHRAE Tables:", "\u2022 Table 36: SHGF by lat/mo", "\u2022 Table 37: SC values", "\u2022 Table 38: CLF values", "\u2022 Shade factor if overhang"]} c={C.cyan} />

      <Arr x1={CX} y1={1310} x2={CX} y2={1340} />

      {/* ── §4 INTERNAL LOADS — OCCUPANCY ── */}
      <Sec y={1340} num="§4" title="Internal Load: Occupancy (Sensible + Latent)" color="#06b6d4" />
      <Arr x1={CX} y1={1378} x2={CX} y2={1400} />

      <rect x={CX - 360} y={1400} width={720} height={260} rx={12} fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} />
      <text x={CX} y={1425} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={700}>{"👥"} Metabolic Heat Gain per Occupant</text>

      <rect x={CX - 300} y={1438} width={280} height={32} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX - 160} y={1458} textAnchor="middle" fill={C.cyan.tx} fontSize={12} fontWeight={800}>
        Q_s = N {"×"} SHG {"×"} CLF
      </text>
      <rect x={CX + 20} y={1438} width={280} height={32} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX + 160} y={1458} textAnchor="middle" fill={C.cyan.tx} fontSize={12} fontWeight={800}>
        Q_l = N {"×"} LHG
      </text>

      {(() => {
        const cols = ["Activity", "N", "SHG", "LHG", "CLF", "Q_s", "Q_l"];
        const xs = [CX - 330, CX - 200, CX - 120, CX - 40, CX + 40, CX + 130, CX + 240];
        return (
          <g>
            <rect x={CX - 340} y={1485} width={680} height={20} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={1499} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["Office (seated)", "250", "245", "205", "0.71", "43,488", "51,250"],
              ["Lab (standing)", "80", "250", "250", "0.80", "16,000", "20,000"],
              ["Cafeteria", "120", "275", "275", "0.49", "16,170", "33,000"],
              ["Conference", "60", "245", "205", "0.75", "11,025", "12,300"],
              ["Lobby/Reception", "40", "245", "155", "0.65", "6,370", "6,200"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={1520 + i * 18} fill={C.cyan.tx} fontSize={9}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <rect x={CX - 200} y={1624} width={400} height={22} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={1639} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>
        {"✅"} Occupancy: Sensible = 93,053 | Latent = 122,750 BTU/hr
      </text>

      <Note x={CX + 380} y={1410} w={175} lines={["\uD83D\uDCCC ASHRAE Table 1:", "\u2022 SHG/LHG per activity", "\u2022 Adjusted metabolic", "\u2022 CLF from Table 37", "\u2022 N = design occupancy"]} c={C.rose} />

      <Arr x1={CX} y1={1660} x2={CX} y2={1690} />

      {/* ── §5 INTERNAL LOADS — LIGHTING ── */}
      <Sec y={1690} num="§5" title="Internal Load: Lighting Heat Gain" color="#14b8a6" />
      <Arr x1={CX} y1={1728} x2={CX} y2={1750} />

      <rect x={CX - 340} y={1750} width={680} height={220} rx={12} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <text x={CX} y={1775} textAnchor="middle" fill={C.teal.tx} fontSize={13} fontWeight={700}>{"💡"} Lighting Heat Gain</text>

      <rect x={CX - 280} y={1790} width={560} height={36} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1.5} />
      <text x={CX} y={1813} textAnchor="middle" fill={C.teal.tx} fontSize={14} fontWeight={800}>
        Q = Total Watts {"×"} Ballast Factor {"×"} CLF {"×"} 3.412 BTU/hr
      </text>

      {[
        "Ballast Factor: Magnetic = 1.25, Electronic = 1.0, LED = 1.0",
        "CLF = Cooling Load Factor (lights) — from ASHRAE Table 38",
        "Space Factor: accounts for % light to return air plenum",
      ].map((s, i) => (
        <text key={i} x={CX - 300} y={1845 + i * 16} fill={C.teal.tx} fontSize={10}>{s}</text>
      ))}

      {[
        ["Office zones: 85,000 W \u00d7 1.0 \u00d7 0.72 \u00d7 3.412", "= 208,752 BTU/hr"],
        ["Lab zones: 12,000 W \u00d7 1.0 \u00d7 0.80 \u00d7 3.412", "=  32,756 BTU/hr"],
        ["Common areas: 8,000 W \u00d7 1.0 \u00d7 0.65 \u00d7 3.412", "=  17,743 BTU/hr"],
      ].map(([calc, result], i) => (
        <g key={i}>
          <text x={CX - 280} y={1900 + i * 18} fill={C.teal.tx} fontSize={10} fontFamily="monospace">{calc}</text>
          <text x={CX + 180} y={1900 + i * 18} fill={C.teal.tx} fontSize={10} fontWeight={700}>{result}</text>
        </g>
      ))}

      <rect x={CX - 150} y={1948} width={300} height={20} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={1962} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>{"✅"} Total Lighting = 259,251 BTU/hr</text>

      <Arr x1={CX} y1={1960} x2={CX} y2={1990} />

      {/* ── §6 INTERNAL LOADS — EQUIPMENT ── */}
      <Sec y={1990} num="§6" title="Internal Load: Equipment &amp; Appliances" color="#f97316" />
      <Arr x1={CX} y1={2028} x2={CX} y2={2050} />

      <rect x={CX - 360} y={2050} width={720} height={240} rx={12} fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2} />
      <text x={CX} y={2075} textAnchor="middle" fill={C.orange.tx} fontSize={13} fontWeight={700}>{"🖥\uFE0F"} Equipment Heat Gain with Diversity Factors</text>

      <rect x={CX - 300} y={2090} width={600} height={32} rx={8} fill="#fff" stroke={C.orange.bd} strokeWidth={1.5} />
      <text x={CX} y={2110} textAnchor="middle" fill={C.orange.tx} fontSize={13} fontWeight={800}>
        Q = Connected Load (W) {"×"} Diversity Factor {"×"} Use Factor {"×"} 3.412
      </text>

      {(() => {
        const cols = ["Equipment Type", "Load (W)", "DF", "UF", "Q (BTU/hr)"];
        const xs = [CX - 320, CX - 140, CX - 20, CX + 60, CX + 170];
        return (
          <g>
            <rect x={CX - 330} y={2135} width={660} height={20} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={2149} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["Computers (250 nos.)", "62,500", "0.80", "0.75", "128,250"],
              ["Printers / Copiers", "8,000", "0.60", "0.50", "8,198"],
              ["Lab Equipment", "45,000", "0.70", "0.80", "85,997"],
              ["UPS / Server Room", "25,000", "1.00", "1.00", "85,300"],
              ["Misc. Plug Loads", "15,000", "0.50", "0.60", "15,354"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={2170 + i * 18} fill={C.orange.tx} fontSize={9}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <rect x={CX - 150} y={2267} width={300} height={20} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={2281} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>{"✅"} Total Equipment = 323,099 BTU/hr</text>

      <Note x={60} y={2060} w={195} lines={["\uD83D\uDCA1 Diversity Factors:", "\u2022 Similar to Electrical", "  Demand Factors", "\u2022 DF \u00d7 UF = effective", "  heat to conditioned space", "\u2022 Motor heat: In/Out split"]} c={C.amber} />

      <Arr x1={CX} y1={2290} x2={CX} y2={2320} />

      {/* ── §7 VENTILATION & PSYCHROMETRICS ── */}
      <Sec y={2320} num="§7" title="Ventilation &amp; Infiltration (Psychrometric Branch)" color="#e11d48" />
      <Arr x1={CX} y1={2358} x2={CX} y2={2380} />

      <rect x={CX - 380} y={2380} width={760} height={340} rx={12} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
      <text x={CX} y={2400} textAnchor="middle" fill={C.rose.tx} fontSize={13} fontWeight={700}>{"🌬\uFE0F"} Ventilation &amp; Infiltration Heat Gain</text>

      {/* Sensible formula */}
      <rect x={CX - 340} y={2412} width={330} height={50} rx={8} fill="#fff" stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={CX - 175} y={2432} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>Sensible Heat:</text>
      <text x={CX - 175} y={2452} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={800}>
        Q_s = 1.08 {"×"} CFM {"×"} {"Δ"}T
      </text>

      {/* Latent formula */}
      <rect x={CX + 10} y={2412} width={340} height={50} rx={8} fill="#fff" stroke={C.rose.bd} strokeWidth={1.5} />
      <text x={CX + 180} y={2432} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>Latent Heat:</text>
      <text x={CX + 180} y={2452} textAnchor="middle" fill={C.rose.tx} fontSize={12} fontWeight={800}>
        Q_l = 0.68 {"×"} CFM {"×"} {"Δ"}W
      </text>

      <text x={CX - 350} y={2485} fill={C.rose.tx} fontSize={10} fontWeight={600}>Where:</text>
      {[
        "\u0394T = (T_outdoor - T_indoor) = 42 - 24 = 18\u00b0C = 32.4\u00b0F",
        "\u0394W = (W_outdoor - W_indoor) = 118 - 65 = 53 grains/lb",
        "Ventilation CFM = 12,500 \u00d7 10.76 \u00d7 0.6 / 0.472 = 10,850 CFM (ASHRAE 62.1)",
        "Infiltration CFM = 0.3 ACH \u00d7 Volume / 60 = 2,800 CFM (crack method estimate)",
      ].map((s, i) => (
        <text key={i} x={CX - 350} y={2503 + i * 16} fill={C.rose.tx} fontSize={10}>{s}</text>
      ))}

      {/* Calculation results */}
      <rect x={CX - 330} y={2575} width={660} height={68} rx={8} fill="#fff" stroke={C.rose.bd} strokeWidth={1} />
      <text x={CX} y={2593} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>Calculation Results:</text>
      {[
        ["Ventilation Sensible:", "1.08 \u00d7 10,850 \u00d7 32.4 = 379,555 BTU/hr"],
        ["Ventilation Latent:", "0.68 \u00d7 10,850 \u00d7 53 = 390,878 BTU/hr"],
        ["Infiltration Sensible:", "1.08 \u00d7 2,800 \u00d7 32.4 = 97,978 BTU/hr"],
        ["Infiltration Latent:", "0.68 \u00d7 2,800 \u00d7 53 = 100,912 BTU/hr"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 300} y={2610 + i * 14} fill={C.rose.tx} fontSize={9} fontWeight={600}>{label}</text>
          <text x={CX - 60} y={2610 + i * 14} fill={C.rose.tx} fontSize={9}>{val}</text>
        </g>
      ))}

      {/* Bypass Factor note */}
      <rect x={CX - 180} y={2668} width={360} height={28} rx={6} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1} />
      <text x={CX} y={2685} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={600}>
        {"⚙\uFE0F"} Coil Bypass Factor (BF) = 0.15 | Effective = {"("}1 - BF{")"} {"×"} Q
      </text>

      <Note x={CX + 400} y={2390} w={165} lines={["\uD83D\uDCCC Psychrometric:", "\u2022 Plot outdoor state", "\u2022 Plot indoor state", "\u2022 Draw ADP line", "\u2022 BF = (T_off - T_adp)", "  / (T_room - T_adp)", "\u2022 BF typ. 0.1\u20130.2"]} c={C.violet} />

      <Arr x1={CX} y1={2700} x2={CX} y2={2720} />

      {/* ── §8 FINAL COOLING LOAD — ERSH / GTH / TR ── */}
      <Sec y={2720} num="§8" title="Final Output: ERSH &#x2192; GTH &#x2192; TR &#x2192; Supply CFM" color="#059669" />
      <Arr x1={CX} y1={2758} x2={CX} y2={2780} />

      <rect x={CX - 380} y={2780} width={760} height={475} rx={12} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={2808} textAnchor="middle" fill={C.green.tx} fontSize={14} fontWeight={700}>{"📊"} Grand Summation &amp; Equipment Capacity</text>

      {/* RSHG */}
      <rect x={CX - 350} y={2820} width={700} height={105} rx={8} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={2840} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>Room Sensible Heat Gain (RSHG)</text>
      {[
        ["Conduction (walls+roof+floor)", "182,494"],
        ["Solar (fenestration)", "94,311"],
        ["Occupancy (sensible)", "93,053"],
        ["Lighting", "259,251"],
        ["Equipment", "323,099"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 320} y={2858 + i * 15} fill={C.green.tx} fontSize={9}>{label}</text>
          <text x={CX + 140} y={2858 + i * 15} fill={C.green.tx} fontSize={10} fontWeight={600} textAnchor="end">{val}</text>
        </g>
      ))}
      <line x1={CX - 50} y1={2920} x2={CX + 140} y2={2920} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX + 140} y={2916} textAnchor="end" fill={C.green.tx} fontSize={10} fontWeight={700}>RSHG = 952,208</text>

      {/* ERSH */}
      <rect x={CX - 350} y={2935} width={340} height={55} rx={8} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1.5} />
      <text x={CX - 180} y={2955} textAnchor="middle" fill={C.amber.tx} fontSize={11} fontWeight={700}>ERSH Calculation</text>
      <text x={CX - 180} y={2972} textAnchor="middle" fill={C.amber.tx} fontSize={10}>ERSH = RSHG + (BF {"×"} OASH)</text>
      <text x={CX - 180} y={2986} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={700}>= 952,208 + (0.15 {"×"} 477,533) = 1,023,838</text>

      {/* ERLH */}
      <rect x={CX + 10} y={2935} width={340} height={55} rx={8} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={1.5} />
      <text x={CX + 180} y={2955} textAnchor="middle" fill={C.purple.tx} fontSize={11} fontWeight={700}>ERLH Calculation</text>
      <text x={CX + 180} y={2972} textAnchor="middle" fill={C.purple.tx} fontSize={10}>ERLH = RLHG + (BF {"×"} OALH)</text>
      <text x={CX + 180} y={2986} textAnchor="middle" fill={C.purple.tx} fontSize={10} fontWeight={700}>= 122,750 + (0.15 {"×"} 491,790) = 196,519</text>

      {/* ERSHF */}
      <rect x={CX - 250} y={3000} width={500} height={30} rx={6} fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX} y={3019} textAnchor="middle" fill={C.cyan.tx} fontSize={11} fontWeight={700}>
        ERSHF = ERSH / (ERSH + ERLH) = 1,023,838 / 1,220,357 = 0.839
      </text>

      {/* GTH */}
      <rect x={CX - 300} y={3045} width={600} height={52} rx={10} fill="#fff" stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={3065} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>Grand Total Heat (GTH)</text>
      <text x={CX} y={3085} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={800}>
        GTH = ERSH + ERLH + Ventilation (S+L) = 1,023,838 + 196,519 + 770,433 = 1,990,790 BTU/hr
      </text>

      {/* TR conversion */}
      <rect x={CX - 220} y={3110} width={440} height={45} rx={10} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2.5} />
      <text x={CX} y={3130} textAnchor="middle" fill={C.blue.tx} fontSize={13} fontWeight={800}>
        TR = GTH / 12,000 = 1,990,790 / 12,000 = 165.9 TR
      </text>
      <text x={CX} y={3148} textAnchor="middle" fill={C.blue.tx} fontSize={10} fontWeight={600}>
        {"→"} Selected: 170 TR (next standard capacity) {"→"} 2 {"×"} 85 TR Chillers
      </text>

      {/* Supply CFM */}
      <rect x={CX - 220} y={3165} width={440} height={40} rx={10} fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={2} />
      <text x={CX} y={3183} textAnchor="middle" fill={C.violet.tx} fontSize={12} fontWeight={700}>
        Supply CFM = ERSH / (1.08 {"×"} {"Δ"}T_supply)
      </text>
      <text x={CX} y={3198} textAnchor="middle" fill={C.violet.tx} fontSize={10} fontWeight={600}>
        = 1,023,838 / (1.08 {"×"} 20) = 47,400 CFM | AHU: 4 nos. {"×"} 12,000 CFM
      </text>

      <rect x={CX - 200} y={3215} width={400} height={30} rx={8} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={3234} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>{"✅"} Phase 1 Complete: 170 TR | 47,400 CFM</text>

      {/* ═══════ PHASE 2 — PRESSURIZATION ═══════ */}
      <PhaseBand y={3280} h={2260} label="PHASE 2 — PRESSURIZATION SYSTEM DESIGN (NBC / NFPA 92)" color="#f59e0b" />

      {/* ── §9 SELECTION HUB ── */}
      <Sec y={3310} num="§9" title="Pressurization Type Selection Hub" color="#f59e0b" />
      <Arr x1={CX} y1={3348} x2={CX} y2={3380} />

      <Diamond cx={CX} cy={3430} w={520} h={90} text="Select Pressurization Type" sub="[Staircase] | [Lift Well] | [Lift Lobby]" c={C.amber} />

      {/* Three branch arrows */}
      <line x1={CX - 260} y1={3430} x2={CX - 450} y2={3430} stroke={C.amber.bd} strokeWidth={2} />
      <line x1={CX - 450} y1={3430} x2={CX - 450} y2={3510} stroke={C.amber.bd} strokeWidth={2} markerEnd="url(#cv-arrow)" />
      <text x={CX - 450} y={3500} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={700}>A: Staircase</text>

      <Arr x1={CX} y1={3475} x2={CX} y2={3510} />
      <text x={CX} y={3505} textAnchor="middle" fill={C.cyan.tx} fontSize={10} fontWeight={700}>B: Lift Well</text>

      <line x1={CX + 260} y1={3430} x2={CX + 450} y2={3430} stroke={C.amber.bd} strokeWidth={2} />
      <line x1={CX + 450} y1={3430} x2={CX + 450} y2={3510} stroke={C.amber.bd} strokeWidth={2} markerEnd="url(#cv-arrow)" />
      <text x={CX + 450} y={3500} textAnchor="middle" fill={C.teal.tx} fontSize={10} fontWeight={700}>C: Lift Lobby</text>

      {/* ── §10 BRANCH A: STAIRCASE PRESSURIZATION ── */}
      <Sec y={3530} num="§10" title="Branch A: Staircase Pressurization" color="#dc2626" />
      <Arr x1={CX} y1={3568} x2={CX} y2={3590} />

      <rect x={CX - 380} y={3590} width={760} height={480} rx={12} fill={C.red.bg} stroke={C.red.bd} strokeWidth={2} />
      <text x={CX} y={3615} textAnchor="middle" fill={C.red.tx} fontSize={13} fontWeight={700}>{"🔥"} Staircase Pressurization — NBC Clause 7.3</text>

      {/* Inputs */}
      <text x={CX - 350} y={3640} fill={C.red.tx} fontSize={11} fontWeight={700}>Input Data (ASHRAE Table 1 / NBC):</text>
      {[
        ["Number of floors", "G + 14 = 15 floors"],
        ["Stair door size", "1.0 m \u00d7 2.1 m = 2.1 m\u00b2"],
        ["Wall leakage area (per floor)", "0.01 m\u00b2 (tight construction)"],
        ["Floor leakage area (per floor)", "0.005 m\u00b2"],
        ["Design \u0394P", "50 Pa (min. per NBC)"],
        ["Doors open simultaneously", "3 nos. (fire scenario)"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 340} y={3660 + i * 16} fill={C.red.tx} fontSize={10}>{label}:</text>
          <text x={CX + 10} y={3660 + i * 16} fill={C.red.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      {/* Effective leakage */}
      <rect x={CX - 340} y={3762} width={680} height={70} rx={8} fill="#fff" stroke={C.red.bd} strokeWidth={1} />
      <text x={CX} y={3782} textAnchor="middle" fill={C.red.tx} fontSize={11} fontWeight={700}>Step 1: Effective Leakage Area (A_e)</text>
      <text x={CX - 310} y={3800} fill={C.red.tx} fontSize={10}>
        A_e = {"Σ"}(wall leakage + floor leakage) per floor = (0.01 + 0.005) {"×"} 15 = 0.225 m{"\u00b2"}
      </text>
      <text x={CX - 310} y={3818} fill={C.red.tx} fontSize={10}>
        Q_leakage = 0.827 {"×"} A_e {"×"} {"√"}({"Δ"}P) = 0.827 {"×"} 0.225 {"×"} {"√"}50 = 1.316 m{"\u00b3"}/s = 4,738 m{"\u00b3"}/hr
      </text>

      {/* Door open velocity */}
      <rect x={CX - 340} y={3842} width={680} height={70} rx={8} fill="#fff" stroke={C.red.bd} strokeWidth={1} />
      <text x={CX} y={3862} textAnchor="middle" fill={C.red.tx} fontSize={11} fontWeight={700}>Step 2: Door Open Air Velocity Check (Critical)</text>
      <text x={CX - 310} y={3880} fill={C.red.tx} fontSize={10}>
        Q_door = v {"×"} A_door {"×"} N_doors = 0.75 {"×"} 2.1 {"×"} 3 = 4.725 m{"\u00b3"}/s = 17,010 m{"\u00b3"}/hr
      </text>
      <text x={CX - 310} y={3898} fill={C.red.tx} fontSize={10} fontWeight={600}>
        {"⚠\uFE0F"} v = 0.75 m/s minimum through open door (NFPA 92 / NBC) — This GOVERNS!
      </text>

      {/* Total */}
      <rect x={CX - 340} y={3922} width={680} height={55} rx={8} fill="#fff" stroke={C.red.bd} strokeWidth={1} />
      <text x={CX} y={3942} textAnchor="middle" fill={C.red.tx} fontSize={11} fontWeight={700}>Step 3: Total Staircase Air Requirement</text>
      <text x={CX - 310} y={3960} fill={C.red.tx} fontSize={10}>
        Q_total = Q_leakage + Q_door = 4,738 + 17,010 = 21,748 m{"\u00b3"}/hr = 12,800 CFM
      </text>

      {/* Result */}
      <rect x={CX - 200} y={3988} width={400} height={26} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={4005} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>
        Staircase Fan: 21,750 CMH / 12,800 CFM @ 60mm WG static
      </text>

      <rect x={CX - 340} y={4026} width={680} height={38} rx={8} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1} />
      <text x={CX} y={4044} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={600}>
        {"📌"} Safety: Add 15% for leakage {"→"} 21,750 {"×"} 1.15 = 25,013 CMH {"→"} Select 25,000 CMH fan
      </text>

      <Note x={CX + 400} y={3600} w={165} lines={["\uD83D\uDCCC ASHRAE Table 1:", "\u2022 Tight: 0.01 m\u00b2/floor", "\u2022 Average: 0.02 m\u00b2/floor", "\u2022 Loose: 0.04 m\u00b2/floor", "\u2022 Floor: 50% of wall"]} c={C.slate} />

      <Arr x1={CX} y1={4070} x2={CX} y2={4100} />

      {/* ── §11 BRANCH B: LIFT WELL PRESSURIZATION ── */}
      <Sec y={4100} num="§11" title="Branch B: Lift Well Pressurization" color="#06b6d4" />
      <Arr x1={CX} y1={4138} x2={CX} y2={4160} />

      <rect x={CX - 380} y={4160} width={760} height={440} rx={12} fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} />
      <text x={CX} y={4185} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={700}>{"🛗"} Lift Well Pressurization — Sheet 7 Method</text>

      <text x={CX - 350} y={4210} fill={C.cyan.tx} fontSize={11} fontWeight={700}>Input Data:</text>
      {[
        ["Shaft wall area (per floor)", "12.5 m\u00b2"],
        ["Number of floors", "15"],
        ["Lift car fan cutout area", "0.12 m\u00b2 per car"],
        ["Number of lifts", "3 nos."],
        ["Rope hole area (per car)", "0.015 m\u00b2"],
        ["Landing door gap area", "0.008 m\u00b2 per door"],
        ["Design \u0394P", "25 Pa (lift well)"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 340} y={4230 + i * 16} fill={C.cyan.tx} fontSize={10}>{label}:</text>
          <text x={CX + 30} y={4230 + i * 16} fill={C.cyan.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      {/* Master formula */}
      <rect x={CX - 340} y={4350} width={680} height={42} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1.5} />
      <text x={CX} y={4370} textAnchor="middle" fill={C.cyan.tx} fontSize={12} fontWeight={700}>Lift Well Leakage Formula (Sheet 7):</text>
      <text x={CX} y={4387} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={800}>
        Q = L {"×"} T {"×"} {"√"}(2 {"×"} {"Δ"}P / {"ρ"}) {"×"} 1000 (m{"³"}/hr)
      </text>

      {/* Leakage breakdown */}
      <rect x={CX - 340} y={4402} width={680} height={105} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX} y={4420} textAnchor="middle" fill={C.cyan.tx} fontSize={11} fontWeight={700}>Leakage Components:</text>
      {[
        ["Landing door gaps:", "0.008 \u00d7 15 doors = 0.120 m\u00b2", "Q\u2081 = 0.827 \u00d7 0.120 \u00d7 \u221A25 = 0.496 m\u00b3/s"],
        ["Car fan cutouts:", "0.12 \u00d7 3 cars = 0.360 m\u00b2", "Q\u2082 = 0.827 \u00d7 0.360 \u00d7 \u221A25 = 1.489 m\u00b3/s"],
        ["Rope holes:", "0.015 \u00d7 3 cars = 0.045 m\u00b2", "Q\u2083 = 0.827 \u00d7 0.045 \u00d7 \u221A25 = 0.186 m\u00b3/s"],
        ["Shaft wall leakage:", "0.005 \u00d7 12.5 \u00d7 15 = 0.938 m\u00b2", "Q\u2084 = 0.827 \u00d7 0.938 \u00d7 \u221A25 = 3.879 m\u00b3/s"],
      ].map(([label, area, calc], i) => (
        <g key={i}>
          <text x={CX - 320} y={4438 + i * 16} fill={C.cyan.tx} fontSize={9} fontWeight={600}>{label}</text>
          <text x={CX - 100} y={4438 + i * 16} fill={C.cyan.tx} fontSize={9}>{area}</text>
          <text x={CX + 120} y={4438 + i * 16} fill={C.cyan.tx} fontSize={9} fontWeight={600}>{calc}</text>
        </g>
      ))}
      <text x={CX} y={4510} textAnchor="middle" fill={C.cyan.tx} fontSize={10} fontWeight={700}>
        Q_total = (0.496 + 1.489 + 0.186 + 3.879) = 6.050 m{"\u00b3"}/s = 21,780 m{"\u00b3"}/hr
      </text>

      {/* Result */}
      <rect x={CX - 200} y={4525} width={400} height={26} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={4542} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>
        Lift Well Fan: 21,780 CMH / 12,820 CFM @ 40mm WG static
      </text>

      <rect x={CX - 340} y={4560} width={680} height={32} rx={8} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={1} />
      <text x={CX} y={4580} textAnchor="middle" fill={C.amber.tx} fontSize={10} fontWeight={600}>
        {"📌"} Add 10% safety {"→"} 21,780 {"×"} 1.10 = 23,958 CMH {"→"} Select 24,000 CMH fan
      </text>

      <Note x={60} y={4170} w={195} lines={["\uD83D\uDCA1 Sheet 7 Reference:", "\u2022 \u03C1 = 1.2 kg/m\u00b3 (air)", "\u2022 Cd = 0.65 for gaps", "\u2022 Include all leakage", "  paths: doors, cutouts,", "  ropes, shaft walls"]} c={C.teal} />

      <Arr x1={CX} y1={4600} x2={CX} y2={4630} />

      {/* ── §12 BRANCH C: LIFT LOBBY PRESSURIZATION ── */}
      <Sec y={4630} num="§12" title="Branch C: Lift Lobby Pressurization" color="#14b8a6" />
      <Arr x1={CX} y1={4668} x2={CX} y2={4690} />

      <rect x={CX - 380} y={4690} width={760} height={430} rx={12} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <text x={CX} y={4715} textAnchor="middle" fill={C.teal.tx} fontSize={13} fontWeight={700}>{"🚪"} Lift Lobby Pressurization — Pressure Sandwich</text>

      <text x={CX - 350} y={4740} fill={C.teal.tx} fontSize={11} fontWeight={700}>Input Data:</text>
      {[
        ["Lobby door type", "Double leaf: 1.2 m \u00d7 2.1 m each = 5.04 m\u00b2"],
        ["Number of lobbies", "15 (one per floor)"],
        ["Landing door to shaft", "Single leaf: 0.9 m \u00d7 2.1 m = 1.89 m\u00b2"],
        ["Lobby wall leakage", "0.008 m\u00b2 per floor"],
        ["Design \u0394P", "50 Pa (lobby to corridor)"],
        ["Pressure sandwich effect", "Lobby > Corridor > Staircase"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 340} y={4758 + i * 16} fill={C.teal.tx} fontSize={10}>{label}:</text>
          <text x={CX} y={4758 + i * 16} fill={C.teal.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      {/* Leakage through closed doors */}
      <rect x={CX - 340} y={4862} width={680} height={70} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={4882} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>Leakage Through Closed Landing Doors:</text>
      <text x={CX - 310} y={4900} fill={C.teal.tx} fontSize={10}>
        A_gap = door perimeter {"×"} gap width = (2{"×"}0.9 + 2{"×"}2.1) {"×"} 0.003 = 0.018 m{"\u00b2"}/door
      </text>
      <text x={CX - 310} y={4918} fill={C.teal.tx} fontSize={10}>
        Q_closed = 0.827 {"×"} (0.018 {"×"} 15) {"×"} {"√"}50 = 1.404 m{"\u00b3"}/s {"×"} 50% safety = 2.106 m{"\u00b3"}/s
      </text>

      {/* Door open flow */}
      <rect x={CX - 340} y={4942} width={680} height={55} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={4962} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>Door Open Air Flow (2 doors open simultaneously):</text>
      <text x={CX - 310} y={4980} fill={C.teal.tx} fontSize={10}>
        Q_open = v {"×"} A_door {"×"} N = 0.75 {"×"} 5.04 {"×"} 2 = 7.560 m{"\u00b3"}/s = 27,216 m{"\u00b3"}/hr
      </text>

      {/* Wall leakage */}
      <rect x={CX - 340} y={5007} width={680} height={40} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={5025} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>Wall Leakage (all floors):</text>
      <text x={CX - 310} y={5040} fill={C.teal.tx} fontSize={10}>
        Q_wall = 0.827 {"×"} (0.008 {"×"} 15) {"×"} {"√"}50 = 0.702 m{"\u00b3"}/s = 2,527 m{"\u00b3"}/hr
      </text>

      {/* Total */}
      <rect x={CX - 340} y={5058} width={680} height={28} rx={6} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={5076} textAnchor="middle" fill={C.teal.tx} fontSize={11} fontWeight={700}>
        Q_total = Q_closed + Q_open + Q_wall = 7,582 + 27,216 + 2,527 = 37,325 m{"\u00b3"}/hr
      </text>

      <rect x={CX - 200} y={5094} width={400} height={26} rx={6} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={5111} textAnchor="middle" fill={C.green.tx} fontSize={10} fontWeight={700}>
        Lift Lobby Fan: 37,325 CMH / 21,970 CFM @ 50mm WG static
      </text>

      <Note x={CX + 400} y={4700} w={165} lines={["\u26A0\uFE0F Pressure Sandwich:", "\u2022 Stair > 50 Pa", "\u2022 Lobby > 25 Pa", "\u2022 Corridor = 0 Pa (ref)", "\u2022 50% safety on closed", "  door leakage (NBC)"]} c={C.rose} />

      <Arr x1={CX} y1={5130} x2={CX} y2={5160} />

      {/* ── §13 COMMON OUTPUT — FAN SELECTION ── */}
      <Sec y={5160} num="§13" title="Common Output: Summation &#x2192; Diversities &#x2192; Fan Selection" color="#8b5cf6" />
      <Arr x1={CX} y1={5198} x2={CX} y2={5220} />

      <rect x={CX - 380} y={5220} width={760} height={300} rx={12} fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={2} />
      <text x={CX} y={5248} textAnchor="middle" fill={C.violet.tx} fontSize={13} fontWeight={700}>{"📋"} Pressurization Fan Selection Summary</text>

      {(() => {
        const cols = ["System", "Q_calc (CMH)", "Safety %", "Q_design (CMH)", "CFM", "Static (mm)", "Fan Type"];
        const xs = [CX - 360, CX - 220, CX - 110, CX, CX + 120, CX + 220, CX + 305];
        return (
          <g>
            <rect x={CX - 365} y={5265} width={730} height={22} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={5280} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["Staircase-1", "21,748", "15%", "25,000", "14,720", "60", "Axial"],
              ["Staircase-2", "21,748", "15%", "25,000", "14,720", "60", "Axial"],
              ["Lift Well (3 lifts)", "21,780", "10%", "24,000", "14,130", "40", "Centrifugal"],
              ["Lift Lobby", "37,325", "10%", "41,000", "24,130", "50", "Centrifugal"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={5305 + i * 22} fill={C.violet.tx} fontSize={9}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      {/* Diversity */}
      <rect x={CX - 340} y={5400} width={680} height={45} rx={8} fill="#fff" stroke={C.violet.bd} strokeWidth={1} />
      <text x={CX} y={5420} textAnchor="middle" fill={C.violet.tx} fontSize={11} fontWeight={700}>Diversity Application (Not all systems peak simultaneously):</text>
      <text x={CX} y={5438} textAnchor="middle" fill={C.violet.tx} fontSize={10}>
        Combined = (25k + 25k + 24k + 41k) {"×"} 0.85 diversity = 97,750 CMH total system air
      </text>

      {/* Total */}
      <rect x={CX - 220} y={5460} width={440} height={48} rx={10} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={5480} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>{"✅"} Phase 2 Complete: Pressurization System</text>
      <text x={CX} y={5498} textAnchor="middle" fill={C.green.tx} fontSize={10}>4 Fans | Total: 115,000 CMH (installed) | 97,750 CMH (diversified)</text>

      {/* ═══════ PHASE 3 — DASHBOARD ═══════ */}
      <PhaseBand y={5550} h={500} label="PHASE 3 — SUMMARY &amp; OUTPUT DASHBOARD" color="#059669" />

      <Sec y={5580} num="§14" title="Combined Cooling Load &amp; Pressurization Dashboard" color="#059669" />
      <Arr x1={CX} y1={5618} x2={CX} y2={5640} />

      {/* KPI Row 1 */}
      {[
        { label: "Cooling Load", value: "170 TR", sub: "2 \u00d7 85 TR Chillers", bg: C.blue.bg, bd: C.blue.bd, tx: C.blue.tx },
        { label: "Supply Air", value: "47,400 CFM", sub: "4 \u00d7 12,000 CFM AHU", bg: C.purple.bg, bd: C.purple.bd, tx: C.purple.tx },
        { label: "Grand Total Heat", value: "1.99M BTU", sub: "ERSH + ERLH + OA", bg: C.amber.bg, bd: C.amber.bd, tx: C.amber.tx },
        { label: "ERSHF", value: "0.839", sub: "Sensible Heat Factor", bg: C.cyan.bg, bd: C.cyan.bd, tx: C.cyan.tx },
      ].map((kpi, i) => {
        const kx = 80 + i * 370;
        return (
          <g key={i}>
            <rect x={kx} y={5640} width={340} height={75} rx={12} fill={kpi.bg} stroke={kpi.bd} strokeWidth={2} />
            <text x={kx + 170} y={5663} textAnchor="middle" fill={kpi.tx} fontSize={10} fontWeight={600}>{kpi.label}</text>
            <text x={kx + 170} y={5688} textAnchor="middle" fill={kpi.tx} fontSize={20} fontWeight={800}>{kpi.value}</text>
            <text x={kx + 170} y={5705} textAnchor="middle" fill={kpi.tx} fontSize={9}>{kpi.sub}</text>
          </g>
        );
      })}

      {/* KPI Row 2 */}
      {[
        { label: "Staircase Fans", value: "2 \u00d7 25k CMH", sub: "Axial @ 60mm WG", bg: C.red.bg, bd: C.red.bd, tx: C.red.tx },
        { label: "Lift Well Fan", value: "24,000 CMH", sub: "Centrifugal @ 40mm", bg: C.teal.bg, bd: C.teal.bd, tx: C.teal.tx },
        { label: "Lobby Fan", value: "41,000 CMH", sub: "Centrifugal @ 50mm", bg: C.green.bg, bd: C.green.bd, tx: C.green.tx },
        { label: "Total Press. Air", value: "97,750 CMH", sub: "85% diversity applied", bg: C.orange.bg, bd: C.orange.bd, tx: C.orange.tx },
      ].map((kpi, i) => {
        const kx = 80 + i * 370;
        return (
          <g key={i}>
            <rect x={kx} y={5730} width={340} height={75} rx={12} fill={kpi.bg} stroke={kpi.bd} strokeWidth={2} />
            <text x={kx + 170} y={5753} textAnchor="middle" fill={kpi.tx} fontSize={10} fontWeight={600}>{kpi.label}</text>
            <text x={kx + 170} y={5778} textAnchor="middle" fill={kpi.tx} fontSize={20} fontWeight={800}>{kpi.value}</text>
            <text x={kx + 170} y={5795} textAnchor="middle" fill={kpi.tx} fontSize={9}>{kpi.sub}</text>
          </g>
        );
      })}

      {/* Load Breakdown Bar Chart */}
      <rect x={80} y={5830} width={W - 160} height={120} rx={12} fill="#f0fdf4" stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={5855} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>{"📊"} Cooling Load Breakdown (BTU/hr)</text>

      {[
        { label: "Conduction", val: 182494, color: "#8b5cf6" },
        { label: "Solar", val: 94311, color: "#f59e0b" },
        { label: "Occupancy", val: 215803, color: "#06b6d4" },
        { label: "Lighting", val: 259251, color: "#14b8a6" },
        { label: "Equipment", val: 323099, color: "#f97316" },
        { label: "Vent. S", val: 477533, color: "#ef4444" },
        { label: "Vent. L", val: 491790, color: "#ec4899" },
      ].map((bar, i) => {
        const bx = 120 + i * 196;
        const barW = 160;
        const maxH = 55;
        const barH = maxH * (bar.val / 500000);
        return (
          <g key={i}>
            <rect x={bx} y={5870 + (maxH - barH)} width={barW} height={barH} rx={4} fill={bar.color} opacity={0.8} />
            <text x={bx + barW / 2} y={5870 + maxH - barH - 4} textAnchor="middle" fill={bar.color} fontSize={8} fontWeight={700}>
              {(bar.val / 1000).toFixed(0)}k
            </text>
            <text x={bx + barW / 2} y={5935} textAnchor="middle" fill="#64748b" fontSize={7} fontWeight={600}>{bar.label}</text>
          </g>
        );
      })}

      {/* Cross reference */}
      <rect x={80} y={5970} width={W - 160} height={60} rx={12} fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={1} />
      <text x={CX} y={5990} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>{"🔗"} Cross-Reference &mdash; Related Calculations</text>
      {[
        "HVAC: Heat Load (P3D) \u2192 shared TR data | Duct Sizing (DD_DCT) \u2192 AHU CFM distribution | Equipment (DD_EQP) \u2192 chiller model",
        "Electrical: Load Calc (P3B) \u2192 fan motor kW | Cable Sizing (DD_CB) \u2192 fan feeder cables | Bus Riser (EBR) \u2192 HVAC panel hierarchy",
      ].map((s, i) => (
        <text key={i} x={CX} y={6008 + i * 14} textAnchor="middle" fill={C.slate.tx} fontSize={9}>{s}</text>
      ))}

      {/* Footer */}
      <rect x={40} y={H - 60} width={W - 80} height={44} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 34} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={600}>
        VENT-001 | Cooling Load &amp; Pressurization | Clariant Plot A2 | Prepared by: Sumit Maurya | ASHRAE / NBC / NFPA 92
      </text>
      <text x={CX} y={H - 18} textAnchor="middle" fill="#94a3b8" fontSize={10}>
        170 TR Cooling | 47,400 CFM Supply | 4 Pressurization Fans | 115,000 CMH Installed | Rev 01
      </text>
    </svg>
  );
}
