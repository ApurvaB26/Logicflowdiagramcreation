import React from "react";

// =====================================================================
// DD_ERT — COMPREHENSIVE SHORT CIRCUIT & EARTHING DESIGN CALCULATION
// 11-Section Flow: Project Inputs → Transformer Fault Level → DG Fault
// Level → Combined Source Fault → Cable Impedance Data → Distribution
// Panel Fault → Protection Grading → Adiabatic Conductor Sizing →
// Earth Strip Selection → Summary Mapping Table → Output Dashboard
// Standards: IS 3043 / IEC 60909 / IS 732 / IS 8437 / NBC 2016
// Project: Clariant Plot A2 — 1000 kVA TR + 500 kVA DG
// =====================================================================

const W = 1600;
const H = 12800;
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

/* ─── helpers ─── */
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

function SectionTitle({ y, num, title, color }: { y: number; num: string; title: string; color: string }) {
  return (
    <g>
      <rect x={CX - 300} y={y} width={600} height={40} rx={20} fill={color} />
      <text x={CX} y={y + 25} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {num} — {title}
      </text>
    </g>
  );
}

function Arr({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.arrow} strokeWidth={2} markerEnd="url(#ert-arrow)" />;
}

function Diamond({ cx, cy, w, h, text, sub, c }: { cx: number; cy: number; w: number; h: number; text: string; sub?: string; c: typeof C.amber }) {
  const hw = w / 2, hh = h / 2;
  return (
    <g>
      <polygon points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={c.bg} stroke={c.bd} strokeWidth={2} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={c.tx} fontSize={12} fontWeight={700}>{text}</text>
      {sub && <text x={cx} y={cy + 12} textAnchor="middle" fill={c.tx} fontSize={10}>{sub}</text>}
    </g>
  );
}

function Annotation({ x, y, w, lines, c }: { x: number; y: number; w: number; lines: string[]; c: typeof C.rose }) {
  const h = 24 + lines.length * 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={c.bg} stroke={c.bd} strokeWidth={1.5} strokeDasharray="6,3" />
      {lines.map((l, i) => (
        <text key={i} x={x + 10} y={y + 18 + i * 16} fill={c.tx} fontSize={11}>{l}</text>
      ))}
    </g>
  );
}

export function EarthingCalcSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <defs>
        <marker id="ert-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill={C.arrow} />
        </marker>
        <linearGradient id="ert-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <filter id="ert-glow">
          <feDropShadow dx={0} dy={2} stdDeviation={4} floodColor="#00000015" />
        </filter>
      </defs>

      {/* BG */}
      <rect width={W} height={H} rx={18} fill="#f8fafc" />

      {/* ───────── HEADER ───────── */}
      <rect x={40} y={30} width={W - 80} height={110} rx={16} fill="url(#ert-head)" filter="url(#ert-glow)" />
      <text x={CX} y={68} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800}>⚡ Short Circuit &amp; Earthing Design Calculation</text>
      <text x={CX} y={92} textAnchor="middle" fill="#94dbf7" fontSize={13}>IS 3043 / IEC 60909 / IS 732 / IS 8437 — Fault Level Analysis &amp; Earthing Conductor Sizing</text>
      <text x={CX} y={112} textAnchor="middle" fill="#67e8f9" fontSize={11}>Project: Clariant Plot A2 — 1000 kVA Transformer + 500 kVA DG Set</text>
      <text x={CX} y={128} textAnchor="middle" fill="#67e8f9" fontSize={10}>Voltage: 433V 3φ | System: TN-S | Soil Resistivity: 50 Ω·m | Fault Duration: 1 sec</text>

      {/* ═══════════════ PHASE 1: SOURCE FAULT LEVEL ═══════════════ */}
      <PhaseBand y={160} h={2600} label="▌ PHASE 1 — SOURCE FAULT LEVEL CALCULATION" color="#3b82f6" />

      {/* Section 1: Project & Transformer Input Data */}
      <SectionTitle y={190} num="§1" title="Project & Transformer Input Data" color="#3b82f6" />
      <Arr x1={CX} y1={230} x2={CX} y2={250} />

      {/* Input box — Transformer Data */}
      <rect x={CX - 340} y={250} width={680} height={180} rx={12} fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={2} filter="url(#ert-glow)" />
      <text x={CX} y={275} textAnchor="middle" fill={C.blue.tx} fontSize={14} fontWeight={700}>📋 Transformer Nameplate Data</text>
      {[
        ["Rating", "1000 kVA", "Transformer capacity"],
        ["Secondary Voltage (V₂)", "433 V", "Line-to-line 3-phase"],
        ["% Impedance (Z%)", "5.0%", "From nameplate / test certificate"],
        ["IS Tolerance", "–10%", "Negative tolerance per IS 2026"],
        ["Effective Z%", "4.5%", "= 5.0% × (1 – 0.10)"],
        ["Winding Configuration", "Dyn11", "Delta primary, Star secondary"],
        ["Cooling Type", "ONAN", "Oil Natural Air Natural"],
      ].map(([label, val, note], i) => (
        <g key={i}>
          <text x={CX - 310} y={300 + i * 20} fill={C.blue.tx} fontSize={11} fontWeight={600}>{label}:</text>
          <text x={CX - 30} y={300 + i * 20} fill={C.blue.tx} fontSize={11} fontWeight={700}>{val}</text>
          <text x={CX + 120} y={300 + i * 20} fill={C.blue.tx} fontSize={10} opacity={0.7}>← {note}</text>
        </g>
      ))}

      <Annotation x={CX + 380} y={260} w={170} lines={["📌 IS 2026-2011", "Tolerance: ±10% on Z%", "Use worst-case", "(–10% = lower Z", " = higher fault)"]} c={C.rose} />

      <Arr x1={CX} y1={430} x2={CX} y2={460} />

      {/* Section 2: Transformer Ohmic Impedance Conversion */}
      <SectionTitle y={460} num="§2" title="Transformer Ohmic Impedance Conversion" color="#8b5cf6" />
      <Arr x1={CX} y1={500} x2={CX} y2={525} />

      {/* Formula Block */}
      <rect x={CX - 320} y={525} width={640} height={200} rx={12} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
      <text x={CX} y={550} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={700}>🧮 Convert %Z to Ohmic Value</text>
      
      {/* Main formula */}
      <rect x={CX - 280} y={565} width={560} height={40} rx={8} fill="#fff" stroke={C.purple.bd} strokeWidth={1} />
      <text x={CX} y={590} textAnchor="middle" fill={C.purple.tx} fontSize={14} fontWeight={800}>
        Z (Ω) = (%Z × 10 × kV²) / Base kVA
      </text>

      {/* Step by step */}
      {[
        "Step 1: kV = 433/1000 = 0.433 kV",
        "Step 2: kV² = 0.433² = 0.1875 kV²",
        "Step 3: Z = (4.5 × 10 × 0.1875) / 1000",
        "Step 4: Z = 8.4375 / 1000 = 0.00844 Ω",
      ].map((s, i) => (
        <text key={i} x={CX - 260} y={625 + i * 20} fill={C.purple.tx} fontSize={11}>{s}</text>
      ))}

      <rect x={CX - 200} y={700} width={400} height={18} rx={4} fill={C.green.bg} stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={713} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>✅ Z_transformer = 0.00844 Ω (at 433V base)</text>

      <Annotation x={60} y={540} w={200} lines={["⚠️ Voltage Factor (c)", "Per IEC 60909:", "c = 1.1 for Vₙ ≤ 1kV", "(max voltage scenario)", "Applied in next step"]} c={C.amber} />

      <Arr x1={CX} y1={725} x2={CX} y2={755} />

      {/* Section 3: Transformer Fault Current */}
      <SectionTitle y={755} num="§3" title="Transformer Fault Current Calculation" color="#f59e0b" />
      <Arr x1={CX} y1={795} x2={CX} y2={820} />

      <rect x={CX - 320} y={820} width={640} height={210} rx={12} fill={C.amber.bg} stroke={C.amber.bd} strokeWidth={2} />
      <text x={CX} y={845} textAnchor="middle" fill={C.amber.tx} fontSize={13} fontWeight={700}>🧮 Three-Phase Symmetrical Fault Current</text>

      <rect x={CX - 280} y={860} width={560} height={40} rx={8} fill="#fff" stroke={C.amber.bd} strokeWidth={1} />
      <text x={CX} y={885} textAnchor="middle" fill={C.amber.tx} fontSize={14} fontWeight={800}>
        I_f = (V × c) / (√3 × Z)
      </text>

      {[
        "V = 433 V (secondary line voltage)",
        "c = 1.1 (voltage factor per IEC 60909, Table 1)",
        "Z = 0.00844 Ω (from §2)",
        "√3 = 1.732",
        "I_f = (433 × 1.1) / (1.732 × 0.00844)",
        "I_f = 476.3 / 0.01462 = 32,578 A",
      ].map((s, i) => (
        <text key={i} x={CX - 260} y={920 + i * 20} fill={C.amber.tx} fontSize={11}>{s}</text>
      ))}

      <Arr x1={CX} y1={1030} x2={CX} y2={1060} />

      {/* Decision: Round to Standard */}
      <Diamond cx={CX} cy={1100} w={380} h={70} text="Round to Standard Rating?" sub="IS 8623 / IEC 61439" c={C.amber} />

      <Arr x1={CX} y1={1135} x2={CX} y2={1165} />

      <rect x={CX - 180} y={1165} width={360} height={50} rx={10} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={1186} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>📊 Transformer Fault Level = 32.6 kA</text>
      <text x={CX} y={1202} textAnchor="middle" fill={C.green.tx} fontSize={10}>→ Standard Rating: 36 kA (next standard up)</text>

      <Annotation x={CX + 230} y={1060} w={180} lines={["📌 Standard Ratings:", "• 10 kA, 16 kA", "• 25 kA, 36 kA", "• 50 kA, 65 kA", "• 80 kA, 100 kA", "Per IS 8623-1"]} c={C.cyan} />

      <Arr x1={CX} y1={1215} x2={CX} y2={1250} />

      {/* Section 4: DG Set Fault Level */}
      <SectionTitle y={1250} num="§4" title="DG Set Fault Level Calculation" color="#06b6d4" />
      <Arr x1={CX} y1={1290} x2={CX} y2={1320} />

      <rect x={CX - 340} y={1320} width={680} height={140} rx={12} fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} />
      <text x={CX} y={1345} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={700}>🔧 DG Set Sub-Transient Reactance Method</text>

      {[
        ["DG Capacity", "500 kVA"],
        ["Sub-Transient Reactance (X″d)", "15%"],
        ["Effective X″d (with tolerance)", "13.5%"],
        ["Rated Current = 500 / (√3 × 0.433)", "667 A"],
      ].map(([label, val], i) => (
        <g key={i}>
          <text x={CX - 300} y={1370 + i * 20} fill={C.cyan.tx} fontSize={11} fontWeight={600}>{label}:</text>
          <text x={CX + 50} y={1370 + i * 20} fill={C.cyan.tx} fontSize={11} fontWeight={700}>{val}</text>
        </g>
      ))}

      <rect x={CX - 250} y={1458} width={500} height={36} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX} y={1480} textAnchor="middle" fill={C.cyan.tx} fontSize={12} fontWeight={800}>
        I_f(DG) = I_rated / X″d = 667 / 0.135 = 4,941 A ≈ 5.0 kA
      </text>

      <Arr x1={CX} y1={1500} x2={CX} y2={1530} />

      <rect x={CX - 180} y={1530} width={360} height={45} rx={10} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={1549} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>📊 DG Fault Level = 5.0 kA</text>
      <text x={CX} y={1565} textAnchor="middle" fill={C.green.tx} fontSize={10}>→ Say 10 kA (next standard up)</text>

      <Annotation x={60} y={1340} w={200} lines={["💡 DG Fault < TR Fault", "DG typically 3× to 5×", "rated current only.", "Motor contribution", "adds ~15% more."]} c={C.teal} />

      <Arr x1={CX} y1={1575} x2={CX} y2={1610} />

      {/* Section 5: Combined Source Fault */}
      <SectionTitle y={1610} num="§5" title="Combined Source Fault Level" color="#14b8a6" />
      <Arr x1={CX} y1={1650} x2={CX} y2={1680} />

      <rect x={CX - 320} y={1680} width={640} height={160} rx={12} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <text x={CX} y={1705} textAnchor="middle" fill={C.teal.tx} fontSize={13} fontWeight={700}>🔀 Parallel Source Summation (Worst Case)</text>

      <rect x={CX - 270} y={1720} width={540} height={36} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={1743} textAnchor="middle" fill={C.teal.tx} fontSize={13} fontWeight={800}>
        I_total = I_f(TR) + I_f(DG) + I_motor = 32.6 + 5.0 + 4.9 = 42.5 kA
      </text>

      {[
        "TR contribution: 32.6 kA (dominant source)",
        "DG contribution: 5.0 kA (if paralleled with TR during changeover)",
        "Motor contribution: ~15% of TR = 4.9 kA (induction motor back-feed)",
        "Design Fault Level = 42.5 kA → Say 50 kA (for main panel)",
      ].map((s, i) => (
        <text key={i} x={CX - 260} y={1775 + i * 18} fill={C.teal.tx} fontSize={11}>{s}</text>
      ))}

      {/* Decision */}
      <Arr x1={CX} y1={1840} x2={CX} y2={1870} />
      <Diamond cx={CX} cy={1910} w={420} h={70} text="TR & DG on same bus (parallel)?" sub="Or separate panels with interlocking?" c={C.amber} />

      {/* Yes/No branches */}
      <text x={CX + 230} y={1910} fill={C.green.tx} fontSize={11} fontWeight={700}>YES → 50 kA</text>
      <text x={CX - 280} y={1910} fill={C.rose.tx} fontSize={11} fontWeight={700}>NO → 36 kA (TR only)</text>

      <Arr x1={CX} y1={1945} x2={CX} y2={1980} />

      <rect x={CX - 220} y={1980} width={440} height={50} rx={10} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={2000} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>✅ Phase 1 Output: Source Fault Level</text>
      <text x={CX} y={2018} textAnchor="middle" fill={C.green.tx} fontSize={11}>MDB Design: 50 kA | TR-only: 36 kA | DG-only: 10 kA</text>

      {/* ═══════════════ PHASE 2: DISTRIBUTION FAULT ═══════════════ */}
      <PhaseBand y={2070} h={2600} label="▌ PHASE 2 — DISTRIBUTION / PANEL FAULT LEVEL" color="#f59e0b" />

      {/* Section 6: Cable Impedance Data */}
      <SectionTitle y={2100} num="§6" title="Cable Impedance Data Collection" color="#f59e0b" />
      <Arr x1={CX} y1={2140} x2={CX} y2={2170} />

      {/* Cable data table */}
      <rect x={CX - 380} y={2170} width={760} height={280} rx={12} fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} />
      <text x={CX} y={2195} textAnchor="middle" fill={C.slate.tx} fontSize={13} fontWeight={700}>📋 Cable Data from Manufacturer Charts (per IS 694 / IS 7098)</text>

      {/* Table header */}
      {(() => {
        const cols = ["Feeder", "Cable Type", "Size (mm²)", "Runs", "Length (m)", "R (Ω/km)", "X (Ω/km)"];
        const xs = [CX - 350, CX - 250, CX - 140, CX - 50, CX + 30, CX + 130, CX + 240];
        return (
          <g>
            <rect x={CX - 360} y={2210} width={720} height={24} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={2227} fill={C.blue.tx} fontSize={10} fontWeight={700}>{c}</text>
            ))}
            {[
              ["MDB → SMDB-1", "Al XLPE", "3×400", "2", "45", "0.0778", "0.073"],
              ["MDB → SMDB-2", "Al XLPE", "3×300", "2", "60", "0.100", "0.075"],
              ["SMDB-1 → CDB-1", "Al XLPE", "3×185", "1", "30", "0.164", "0.078"],
              ["SMDB-1 → CDB-2", "Cu XLPE", "3×95", "1", "25", "0.193", "0.080"],
              ["SMDB-2 → CDB-3", "Al XLPE", "3×150", "1", "40", "0.206", "0.079"],
              ["SMDB-2 → LDB-1", "Cu XLPE", "3×25", "1", "20", "0.727", "0.083"],
              ["CDB-1 → MCC-1", "Cu XLPE", "3×70", "1", "15", "0.268", "0.081"],
              ["CDB-2 → MCC-2", "Cu XLPE", "3×50", "1", "12", "0.387", "0.082"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={2255 + i * 22} fill={C.slate.tx} fontSize={10}>{v}</text>
                ))}
                <line x1={CX - 350} y1={2262 + i * 22} x2={CX + 340} y2={2262 + i * 22} stroke="#e2e8f0" strokeWidth={0.5} />
              </g>
            ))}
          </g>
        );
      })()}

      <Annotation x={CX + 400} y={2180} w={160} lines={["📌 Data Sources:", "• IS 694:2010", "• IS 7098 Part I/II", "• Manufacturer catalog", "• Polycab / Havells"]} c={C.purple} />

      <Arr x1={CX} y1={2450} x2={CX} y2={2480} />

      {/* Section 7: Cable Impedance Calculation */}
      <SectionTitle y={2480} num="§7" title="Cable Impedance Calculation" color="#8b5cf6" />
      <Arr x1={CX} y1={2520} x2={CX} y2={2550} />

      <rect x={CX - 340} y={2550} width={680} height={260} rx={12} fill={C.purple.bg} stroke={C.purple.bd} strokeWidth={2} />
      <text x={CX} y={2575} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={700}>🧮 Total Cable Impedance per Feeder</text>

      <rect x={CX - 290} y={2590} width={580} height={36} rx={8} fill="#fff" stroke={C.purple.bd} strokeWidth={1} />
      <text x={CX} y={2613} textAnchor="middle" fill={C.purple.tx} fontSize={13} fontWeight={800}>
        Z_cable = √(R² + X²) × (Length / 1000) / No. of Runs
      </text>

      <text x={CX} y={2648} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={600}>Example: MDB → SMDB-1 (Al XLPE 3×400mm², 2 runs, 45m)</text>
      {[
        "R_total = 0.0778 × (45/1000) / 2 = 0.001751 Ω",
        "X_total = 0.073 × (45/1000) / 2 = 0.001643 Ω",
        "Z_cable = √(0.001751² + 0.001643²) = 0.002402 Ω",
      ].map((s, i) => (
        <text key={i} x={CX - 260} y={2675 + i * 20} fill={C.purple.tx} fontSize={11}>{s}</text>
      ))}

      <text x={CX} y={2748} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={600}>Convert to %Z on system base:</text>
      <rect x={CX - 240} y={2758} width={480} height={36} rx={8} fill="#fff" stroke={C.purple.bd} strokeWidth={1} />
      <text x={CX} y={2781} textAnchor="middle" fill={C.purple.tx} fontSize={12} fontWeight={800}>
        %Z_cable = (Z_cable × Base kVA) / (10 × kV²) = (0.002402 × 1000) / (10 × 0.1875) = 1.28%
      </text>

      <Arr x1={CX} y1={2810} x2={CX} y2={2840} />

      {/* Section 8: Downstream Panel Fault Levels */}
      <SectionTitle y={2840} num="§8" title="Downstream Panel Fault Level Calculation" color="#f97316" />
      <Arr x1={CX} y1={2880} x2={CX} y2={2910} />

      <rect x={CX - 380} y={2910} width={760} height={310} rx={12} fill={C.orange.bg} stroke={C.orange.bd} strokeWidth={2} />
      <text x={CX} y={2935} textAnchor="middle" fill={C.orange.tx} fontSize={13} fontWeight={700}>📊 Cumulative Impedance & Panel Fault Levels</text>

      <rect x={CX - 340} y={2950} width={680} height={36} rx={8} fill="#fff" stroke={C.orange.bd} strokeWidth={1} />
      <text x={CX} y={2973} textAnchor="middle" fill={C.orange.tx} fontSize={13} fontWeight={800}>
        Z_total = Z_source + Z_cable₁ + Z_cable₂ + ... → I_f = V × c / (√3 × Z_total)
      </text>

      {/* Results table */}
      {(() => {
        const cols = ["Panel", "Z_source (Ω)", "Z_cable (Ω)", "Z_total (Ω)", "I_f (kA)", "Std Rating"];
        const xs = [CX - 340, CX - 210, CX - 80, CX + 40, CX + 160, CX + 270];
        return (
          <g>
            <rect x={CX - 350} y={3000} width={700} height={22} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={3015} fill={C.blue.tx} fontSize={10} fontWeight={700}>{c}</text>
            ))}
            {[
              ["MDB", "0.00844", "—", "0.00844", "32.6", "36 kA"],
              ["SMDB-1", "0.00844", "0.00240", "0.01084", "25.4", "25 kA"],
              ["SMDB-2", "0.00844", "0.00345", "0.01189", "23.1", "25 kA"],
              ["CDB-1", "0.01084", "0.00544", "0.01628", "16.9", "16 kA"],
              ["CDB-2", "0.01084", "0.00527", "0.01611", "17.1", "25 kA"],
              ["CDB-3", "0.01189", "0.00883", "0.02072", "13.3", "16 kA"],
              ["LDB-1", "0.01189", "0.01461", "0.02650", "10.4", "10 kA"],
              ["MCC-1", "0.01628", "0.00419", "0.02047", "13.4", "16 kA"],
              ["MCC-2", "0.01611", "0.00476", "0.02087", "13.2", "16 kA"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={3040 + i * 22} fill={C.orange.tx} fontSize={10}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <Annotation x={60} y={2920} w={195} lines={["💡 Key Observation:", "Fault current ↓ as", "distance from source ↑", "MDB: 32.6 kA", "LDB-1: 10.4 kA", "(68% attenuation)"]} c={C.teal} />

      <Arr x1={CX} y1={3220} x2={CX} y2={3260} />

      {/* Section 9: Protection Grading Decision */}
      <SectionTitle y={3260} num="§9" title="Protection Coordination & Withstand Verification" color="#e11d48" />
      <Arr x1={CX} y1={3300} x2={CX} y2={3330} />

      <Diamond cx={CX} cy={3370} w={500} h={80} text="Panel Short Circuit Rating ≥ Calculated Fault?" sub="Breaker breaking capacity ≥ I_f at that point?" c={C.amber} />

      {/* Yes path */}
      <Arr x1={CX + 130} y1={3410} x2={CX + 130} y2={3440} />
      <rect x={CX + 30} y={3440} width={220} height={40} rx={8} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX + 140} y={3464} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>✅ PASS — Proceed</text>

      {/* No path */}
      <Arr x1={CX - 130} y1={3410} x2={CX - 130} y2={3440} />
      <rect x={CX - 260} y={3440} width={260} height={55} rx={8} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
      <text x={CX - 130} y={3460} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>❌ FAIL — Action Required:</text>
      <text x={CX - 130} y={3478} textAnchor="middle" fill={C.rose.tx} fontSize={10}>Upgrade breaker / add current-limiting fuse</text>
      <text x={CX - 130} y={3490} textAnchor="middle" fill={C.rose.tx} fontSize={10}>or increase cable size to attenuate fault</text>

      {/* Breaker selection table */}
      <Arr x1={CX} y1={3500} x2={CX} y2={3530} />

      <rect x={CX - 350} y={3530} width={700} height={180} rx={12} fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} />
      <text x={CX} y={3555} textAnchor="middle" fill={C.slate.tx} fontSize={12} fontWeight={700}>📋 Breaker Selection Summary</text>

      {(() => {
        const cols = ["Panel", "Fault (kA)", "Breaker Type", "Rating", "Breaking Cap."];
        const xs = [CX - 310, CX - 160, CX - 10, CX + 130, CX + 260];
        return (
          <g>
            <rect x={CX - 330} y={3570} width={660} height={22} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={3585} fill={C.blue.tx} fontSize={10} fontWeight={700}>{c}</text>
            ))}
            {[
              ["MDB", "32.6 kA", "MCCB (ACB incomer)", "1600A", "50 kA"],
              ["SMDB-1", "25.4 kA", "MCCB", "800A", "36 kA"],
              ["SMDB-2", "23.1 kA", "MCCB", "630A", "36 kA"],
              ["CDB-1", "16.9 kA", "MCCB", "250A", "25 kA"],
              ["CDB-3", "13.3 kA", "MCCB", "160A", "16 kA"],
              ["LDB-1", "10.4 kA", "MCB/MCCB", "100A", "10 kA"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={3610 + i * 20} fill={C.slate.tx} fontSize={10}>{v}</text>
                ))}
              </g>
            ))}
          </g>
        );
      })()}

      <rect x={CX - 200} y={3720} width={400} height={30} rx={8} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={3740} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>✅ Phase 2 Output: All Panels Verified</text>

      {/* ═══════════════ PHASE 3: EARTHING CONDUCTOR SIZING ═══════════════ */}
      <PhaseBand y={3790} h={3500} label="▌ PHASE 3 — EARTHING CONDUCTOR SIZING" color="#10b981" />

      {/* Section 10: Adiabatic Equation */}
      <SectionTitle y={3820} num="§10" title="Adiabatic Conductor Sizing (IS 3043)" color="#10b981" />
      <Arr x1={CX} y1={3860} x2={CX} y2={3890} />

      <rect x={CX - 340} y={3890} width={680} height={200} rx={12} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX} y={3915} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>🧮 Earth Conductor Cross-Section — Adiabatic Method</text>

      <rect x={CX - 280} y={3935} width={560} height={45} rx={8} fill="#fff" stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={3958} textAnchor="middle" fill={C.green.tx} fontSize={16} fontWeight={800}>
        A = I × √t / k
      </text>
      <text x={CX} y={3975} textAnchor="middle" fill={C.green.tx} fontSize={10}>
        Where: A = cross-section (mm²), I = fault current (A), t = fault duration (s), k = material constant
      </text>

      {/* Material constants table */}
      <rect x={CX - 250} y={3995} width={500} height={80} rx={8} fill="#fff" stroke={C.green.bd} strokeWidth={1} />
      <text x={CX} y={4015} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>Material Constant (k) — IS 3043 Table 3</text>
      {[
        ["Copper (Cu) conductor", "k = 205"],
        ["Galvanized Iron (GI) strip", "k = 80"],
        ["Aluminium (Al) conductor", "k = 126"],
        ["Galvanized Steel wire rope", "k = 78"],
      ].map(([mat, val], i) => (
        <g key={i}>
          <text x={CX - 200} y={4035 + i * 16} fill={C.green.tx} fontSize={10}>{mat}</text>
          <text x={CX + 120} y={4035 + i * 16} fill={C.green.tx} fontSize={10} fontWeight={700}>{val}</text>
        </g>
      ))}

      <Annotation x={CX + 370} y={3900} w={180} lines={["⚠️ IS 3043 Clause 10", "t = protection device", "clearance time.", "For MCCB: t ≈ 1 sec", "For ACB: t ≈ 0.5 sec", "Use 1 sec (worst case)"]} c={C.rose} />

      <Arr x1={CX} y1={4090} x2={CX} y2={4120} />

      {/* Section 11: Conductor Sizing Calculations */}
      <SectionTitle y={4120} num="§11" title="Equipment-wise Earth Conductor Sizing" color="#059669" />
      <Arr x1={CX} y1={4160} x2={CX} y2={4190} />

      <rect x={CX - 380} y={4190} width={760} height={500} rx={12} fill={C.teal.bg} stroke={C.teal.bd} strokeWidth={2} />
      <text x={CX} y={4215} textAnchor="middle" fill={C.teal.tx} fontSize={13} fontWeight={700}>📊 Earthing Conductor Sizing — All Equipment</text>

      {/* Example calculation */}
      <rect x={CX - 350} y={4230} width={700} height={80} rx={8} fill="#fff" stroke={C.teal.bd} strokeWidth={1} />
      <text x={CX} y={4250} textAnchor="middle" fill={C.teal.tx} fontSize={12} fontWeight={600}>Worked Example: 1000 kVA Transformer Earthing</text>
      {[
        "I = 32,600 A (fault current at MDB), t = 1 sec, Material: GI (k = 80)",
        "A = 32,600 × √1 / 80 = 407.5 mm²",
        "Select: 2 runs of 50 × 6 mm GI flat = 2 × 300 = 600 mm² > 407.5 mm² ✓",
      ].map((s, i) => (
        <text key={i} x={CX - 320} y={4270 + i * 18} fill={C.teal.tx} fontSize={11}>{s}</text>
      ))}

      {/* Full sizing table */}
      {(() => {
        const cols = ["Equipment", "I_f (kA)", "t (s)", "Material", "k", "A_req (mm²)", "Selected Strip", "A_prov (mm²)"];
        const xs = [CX - 350, CX - 230, CX - 150, CX - 80, CX - 10, CX + 50, CX + 160, CX + 310];
        return (
          <g>
            <rect x={CX - 360} y={4325} width={720} height={22} rx={4} fill={C.blue.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={4340} fill={C.blue.tx} fontSize={9} fontWeight={700}>{c}</text>
            ))}
            {[
              ["1000kVA TR", "32.6", "1.0", "GI", "80", "407.5", "2× 50×6 mm GI", "600"],
              ["500kVA DG", "5.0", "1.0", "GI", "80", "62.5", "1× 40×6 mm GI", "240"],
              ["MDB (ACB)", "32.6", "1.0", "Cu", "205", "159.0", "1× 50×6 mm Cu", "300"],
              ["SMDB-1", "25.4", "1.0", "GI", "80", "317.5", "2× 40×6 mm GI", "480"],
              ["SMDB-2", "23.1", "1.0", "GI", "80", "288.8", "2× 40×6 mm GI", "480"],
              ["CDB-1", "16.9", "1.0", "GI", "80", "211.3", "1× 50×6 mm GI", "300"],
              ["CDB-2", "17.1", "1.0", "Cu", "205", "83.4", "1× 25×6 mm Cu", "150"],
              ["CDB-3", "13.3", "1.0", "GI", "80", "166.3", "1× 40×6 mm GI", "240"],
              ["LDB-1", "10.4", "1.0", "GI", "80", "130.0", "1× 40×3 mm GI", "120*"],
              ["MCC-1", "13.4", "1.0", "GI", "80", "167.5", "1× 40×6 mm GI", "240"],
              ["MCC-2", "13.2", "1.0", "GI", "80", "165.0", "1× 40×6 mm GI", "240"],
            ].map((row, i) => (
              <g key={i}>
                {row.map((v, j) => (
                  <text key={j} x={xs[j]} y={4365 + i * 22} fill={C.teal.tx} fontSize={9}>{v}</text>
                ))}
                {i < 10 && <line x1={CX - 350} y1={4373 + i * 22} x2={CX + 370} y2={4373 + i * 22} stroke="#99f6e4" strokeWidth={0.5} />}
              </g>
            ))}
          </g>
        );
      })()}

      <Annotation x={60} y={4340} w={200} lines={["⚠️ LDB-1: 120 mm²", "< 130 mm² required.", "Upgrade to 40×6 mm", "(240 mm²) or verify", "with 0.5 sec clearing."]} c={C.rose} />

      <rect x={CX - 180} y={4610} width={360} height={26} rx={6} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={1} />
      <text x={CX} y={4627} textAnchor="middle" fill={C.rose.tx} fontSize={10} fontWeight={600}>* LDB-1: flagged for review — A_prov &lt; A_req — upgrade strip size</text>

      <Arr x1={CX} y1={4640} x2={CX} y2={4670} />

      <Diamond cx={CX} cy={4710} w={460} h={80} text="A_provided ≥ A_required for ALL entries?" sub="Verify minimum 120% safety margin preferred" c={C.amber} />

      <Arr x1={CX + 140} y1={4750} x2={CX + 140} y2={4790} />
      <rect x={CX + 50} y={4790} width={200} height={35} rx={8} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2} />
      <text x={CX + 150} y={4812} textAnchor="middle" fill={C.green.tx} fontSize={11} fontWeight={700}>✅ PASS → Proceed</text>

      <Arr x1={CX - 140} y1={4750} x2={CX - 140} y2={4790} />
      <rect x={CX - 280} y={4790} width={280} height={35} rx={8} fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2} />
      <text x={CX - 140} y={4812} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={700}>❌ Upgrade Strip → Recalculate</text>

      {/* Earth Pit Design */}
      <Arr x1={CX} y1={4830} x2={CX} y2={4860} />

      <rect x={CX - 320} y={4860} width={640} height={200} rx={12} fill={C.cyan.bg} stroke={C.cyan.bd} strokeWidth={2} />
      <text x={CX} y={4885} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={700}>🔩 Earth Pit Resistance Verification (IS 3043)</text>

      <rect x={CX - 270} y={4900} width={540} height={36} rx={8} fill="#fff" stroke={C.cyan.bd} strokeWidth={1} />
      <text x={CX} y={4923} textAnchor="middle" fill={C.cyan.tx} fontSize={13} fontWeight={800}>
        R = ρ / (2π × L) × [ln(8L/d) – 1]
      </text>

      {[
        "ρ = 50 Ω·m (soil resistivity — measured by Wenner method)",
        "L = 3.0 m (electrode length — CI pipe / Cu rod)",
        "d = 0.04 m (electrode diameter — 40mm GI pipe)",
        "R = 50 / (2π × 3) × [ln(8×3/0.04) – 1] = 2.65 × [ln(600) – 1]",
        "R = 2.65 × [6.397 – 1] = 2.65 × 5.397 = 14.3 Ω per pit",
        "For 4 pits in parallel: R_net = 14.3 / 4 = 3.58 Ω",
        "Target: < 2 Ω (IS 3043) → Need 8 pits: 14.3 / 8 = 1.79 Ω ✓",
      ].map((s, i) => (
        <text key={i} x={CX - 250} y={4950 + i * 16} fill={C.cyan.tx} fontSize={10}>{s}</text>
      ))}

      <Arr x1={CX} y1={5060} x2={CX} y2={5090} />

      <rect x={CX - 220} y={5090} width={440} height={50} rx={10} fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
      <text x={CX} y={5110} textAnchor="middle" fill={C.green.tx} fontSize={13} fontWeight={700}>✅ Phase 3 Output: Earthing Design Complete</text>
      <text x={CX} y={5128} textAnchor="middle" fill={C.green.tx} fontSize={10}>All conductors sized + Earth pit count: 8 nos. (R_net = 1.79 Ω &lt; 2 Ω)</text>

      {/* ═══════════════ SUMMARY TABLE ═══════════════ */}
      <PhaseBand y={5180} h={600} label="▌ SUMMARY — INPUT TO OUTPUT MAPPING" color="#8b5cf6" />

      <SectionTitle y={5210} num="§S" title="Phase Summary — Input → Process → Output" color="#8b5cf6" />
      <Arr x1={CX} y1={5250} x2={CX} y2={5280} />

      <rect x={CX - 380} y={5280} width={760} height={200} rx={12} fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={2} />
      {(() => {
        const cols = ["Phase", "Input Data", "Detailed Process", "Final Output"];
        const xs = [CX - 360, CX - 230, CX - 30, CX + 230];
        return (
          <g>
            <rect x={CX - 365} y={5295} width={730} height={24} rx={4} fill={C.purple.bg} />
            {cols.map((c, i) => (
              <text key={i} x={xs[i]} y={5311} fill={C.purple.tx} fontSize={11} fontWeight={700}>{c}</text>
            ))}
            {[
              ["1. Source", "kVA, %Z, X″d", "Ohmic conversion + Voltage Factor", "Standard Fault Rating (kA)"],
              ["2. Distribution", "Cable R/X, Length", "Impedance Addition (Zs + Zc)", "Panel Withstand Capacity"],
              ["3. Protection", "I_sc, Material k, Time t", "Adiabatic Sizing (I√t / k)", "Earthing Strip Size & Qty"],
            ].map((row, i) => {
              const rowY = 5340 + i * 46;
              return (
                <g key={i}>
                  <rect x={CX - 365} y={rowY - 8} width={730} height={38} rx={4} fill={i % 2 === 0 ? "#f5f3ff" : "#faf5ff"} />
                  {row.map((v, j) => (
                    <text key={j} x={xs[j]} y={rowY + 8} fill={C.violet.tx} fontSize={10} fontWeight={j === 0 ? 700 : 400}>{v}</text>
                  ))}
                  {/* sub-description */}
                  {i === 0 && <text x={xs[1]} y={rowY + 22} fill={C.violet.tx} fontSize={9} opacity={0.7}>TR nameplate + DG test cert</text>}
                  {i === 1 && <text x={xs[1]} y={rowY + 22} fill={C.violet.tx} fontSize={9} opacity={0.7}>Per feeder from mfr. catalog</text>}
                  {i === 2 && <text x={xs[1]} y={rowY + 22} fill={C.violet.tx} fontSize={9} opacity={0.7}>GI/Cu + clearing time</text>}
                </g>
              );
            })}
          </g>
        );
      })()}

      {/* ═══════════════ DASHBOARD ═══════════════ */}
      <PhaseBand y={5520} h={900} label="▌ OUTPUT DASHBOARD" color="#059669" />

      <SectionTitle y={5550} num="§D" title="Short Circuit & Earthing Design Dashboard" color="#059669" />
      <Arr x1={CX} y1={5590} x2={CX} y2={5620} />

      {/* KPI Cards - Row 1 */}
      {[
        { label: "TR Fault Level", value: "32.6 kA", sub: "→ 36 kA std", bg: C.amber.bg, bd: C.amber.bd, tx: C.amber.tx },
        { label: "DG Fault Level", value: "5.0 kA", sub: "→ 10 kA std", bg: C.cyan.bg, bd: C.cyan.bd, tx: C.cyan.tx },
        { label: "Combined Fault", value: "42.5 kA", sub: "→ 50 kA design", bg: C.rose.bg, bd: C.rose.bd, tx: C.rose.tx },
        { label: "MDB Breaker", value: "ACB 1600A", sub: "50 kA breaking", bg: C.purple.bg, bd: C.purple.bd, tx: C.purple.tx },
      ].map((kpi, i) => {
        const kx = 80 + i * 370;
        return (
          <g key={i}>
            <rect x={kx} y={5620} width={340} height={80} rx={12} fill={kpi.bg} stroke={kpi.bd} strokeWidth={2} />
            <text x={kx + 170} y={5648} textAnchor="middle" fill={kpi.tx} fontSize={11} fontWeight={600}>{kpi.label}</text>
            <text x={kx + 170} y={5672} textAnchor="middle" fill={kpi.tx} fontSize={20} fontWeight={800}>{kpi.value}</text>
            <text x={kx + 170} y={5690} textAnchor="middle" fill={kpi.tx} fontSize={10}>{kpi.sub}</text>
          </g>
        );
      })}

      {/* KPI Cards - Row 2 */}
      {[
        { label: "Earth Resistance", value: "1.79 Ω", sub: "< 2 Ω (IS 3043)", bg: C.green.bg, bd: C.green.bd, tx: C.green.tx },
        { label: "Earth Pits", value: "8 Nos.", sub: "CI Pipe 3m deep", bg: C.teal.bg, bd: C.teal.bd, tx: C.teal.tx },
        { label: "TR Earth Strip", value: "2× 50×6 GI", sub: "600 mm² provided", bg: C.blue.bg, bd: C.blue.bd, tx: C.blue.tx },
        { label: "Soil Resistivity", value: "50 Ω·m", sub: "Wenner method", bg: C.slate.bg, bd: C.slate.bd, tx: C.slate.tx },
      ].map((kpi, i) => {
        const kx = 80 + i * 370;
        return (
          <g key={i}>
            <rect x={kx} y={5720} width={340} height={80} rx={12} fill={kpi.bg} stroke={kpi.bd} strokeWidth={2} />
            <text x={kx + 170} y={5748} textAnchor="middle" fill={kpi.tx} fontSize={11} fontWeight={600}>{kpi.label}</text>
            <text x={kx + 170} y={5772} textAnchor="middle" fill={kpi.tx} fontSize={20} fontWeight={800}>{kpi.value}</text>
            <text x={kx + 170} y={5790} textAnchor="middle" fill={kpi.tx} fontSize={10}>{kpi.sub}</text>
          </g>
        );
      })}

      {/* KPI Cards - Row 3 */}
      {[
        { label: "Panels Verified", value: "9 / 9", sub: "All pass withstand", bg: C.green.bg, bd: C.green.bd, tx: C.green.tx },
        { label: "Material: GI Strip", value: "~42 m", sub: "40×6 + 50×6 assorted", bg: C.orange.bg, bd: C.orange.bd, tx: C.orange.tx },
        { label: "Material: Cu Strip", value: "~8 m", sub: "25×6 + 50×6 Cu", bg: C.amber.bg, bd: C.amber.bd, tx: C.amber.tx },
        { label: "Total BOQ Items", value: "14 Lines", sub: "Strip + Pit + Clamps", bg: C.violet.bg, bd: C.violet.bd, tx: C.violet.tx },
      ].map((kpi, i) => {
        const kx = 80 + i * 370;
        return (
          <g key={i}>
            <rect x={kx} y={5820} width={340} height={80} rx={12} fill={kpi.bg} stroke={kpi.bd} strokeWidth={2} />
            <text x={kx + 170} y={5848} textAnchor="middle" fill={kpi.tx} fontSize={11} fontWeight={600}>{kpi.label}</text>
            <text x={kx + 170} y={5872} textAnchor="middle" fill={kpi.tx} fontSize={20} fontWeight={800}>{kpi.value}</text>
            <text x={kx + 170} y={5890} textAnchor="middle" fill={kpi.tx} fontSize={10}>{kpi.sub}</text>
          </g>
        );
      })}

      {/* Fault Cascade Visualization */}
      <rect x={80} y={5930} width={W - 160} height={120} rx={12} fill="#f0fdf4" stroke={C.green.bd} strokeWidth={1.5} />
      <text x={CX} y={5955} textAnchor="middle" fill={C.green.tx} fontSize={12} fontWeight={700}>⚡ Fault Level Cascade — Source to Distribution</text>

      {[
        { label: "MDB", kA: "32.6", pct: 100, color: "#ef4444" },
        { label: "SMDB-1", kA: "25.4", pct: 78, color: "#f97316" },
        { label: "SMDB-2", kA: "23.1", pct: 71, color: "#f59e0b" },
        { label: "CDB-1", kA: "16.9", pct: 52, color: "#eab308" },
        { label: "CDB-2", kA: "17.1", pct: 52, color: "#84cc16" },
        { label: "CDB-3", kA: "13.3", pct: 41, color: "#22c55e" },
        { label: "LDB-1", kA: "10.4", pct: 32, color: "#14b8a6" },
        { label: "MCC-1", kA: "13.4", pct: 41, color: "#06b6d4" },
        { label: "MCC-2", kA: "13.2", pct: 40, color: "#3b82f6" },
      ].map((bar, i) => {
        const bx = 110 + i * 152;
        const barW = 120;
        const barMaxH = 60;
        const barH = barMaxH * (bar.pct / 100);
        return (
          <g key={i}>
            <rect x={bx} y={5970 + (barMaxH - barH)} width={barW} height={barH} rx={4} fill={bar.color} opacity={0.8} />
            <text x={bx + barW / 2} y={5970 + barMaxH - barH - 4} textAnchor="middle" fill={bar.color} fontSize={9} fontWeight={700}>{bar.kA} kA</text>
            <text x={bx + barW / 2} y={6040} textAnchor="middle" fill="#64748b" fontSize={8} fontWeight={600}>{bar.label}</text>
          </g>
        );
      })}

      {/* Cross reference */}
      <rect x={80} y={6080} width={W - 160} height={70} rx={12} fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={1} />
      <text x={CX} y={6102} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>🔗 Cross-Reference — Related Calculations</text>
      {[
        "Electrical: Cable Sizing (DD_CB) → feeds cable R/X data for §6 | Bus Riser (EBR) → panel hierarchy",
        "Electrical: Load Calc (P3B) → TR kVA & DG kVA source data | Panel Schedule → breaker ratings",
        "Lightning: LP Design (DD_LTN) → shared earth pit system | IS 3043 Clause 12 — combined earthing",
      ].map((s, i) => (
        <text key={i} x={CX} y={6120 + i * 14} textAnchor="middle" fill={C.slate.tx} fontSize={9}>{s}</text>
      ))}

      {/* Footer */}
      <rect x={40} y={H - 70} width={W - 80} height={50} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={2} />
      <text x={CX} y={H - 42} textAnchor="middle" fill="#64748b" fontSize={12} fontWeight={600}>
        ERT-001 | Short Circuit & Earthing Design | Clariant Plot A2 | Prepared by: Sumit Maurya | IS 3043 / IEC 60909 / IS 732
      </text>
      <text x={CX} y={H - 24} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        Technical Standard: Adiabatic Method | Fault Level at 433V 3φ TN-S System | Rev 01
      </text>
    </svg>
  );
}
