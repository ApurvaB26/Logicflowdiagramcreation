import React from "react";

// =====================================================================
// FIRE JOCKEY & DRENCHER PUMP CALCULATOR — Custom SVG Flow Diagram
// Full architecture: Project Data → Pipe Schedule Fetch → Jockey Pump
// Hydraulic Calc → Drencher Pump Hydraulic Calc → Friction Loss Engine →
// Safety Factor → System Pressure → Pump Selection → Output Dashboard
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
  fire:   { bg: "#fef2f2", bd: "#dc2626", tx: "#991b1b" },
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#fjd-a)" />
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

function DataTable({ x, y, title, headers, rows, color }: {
  x: number; y: number; title: string;
  headers: string[]; rows: string[][];
  color: { bg: string; bd: string; tx: string };
}) {
  const tw = 800, colW = tw / headers.length;
  const rowH = 30, hdrY = y + 52;
  const th = 52 + (rows.length + 1) * (rowH + 2) + 12;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={color.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={44} rx={14} fill={color.bd} />
      <rect x={x} y={y + 32} width={tw} height={12} fill={color.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>{title}</text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={5}
            fill={color.bg} stroke={color.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 20} textAnchor="middle"
            fill={color.tx} fontSize={10.5} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => {
            const isAuto = cell === "Auto" || cell === "Auto-calc";
            return (
              <g key={`c-${ri}-${ci}`}>
                <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 2) + 2}
                  width={colW - 6} height={rowH} rx={5}
                  fill={isAuto ? C.green.bg : "#fff"}
                  stroke={isAuto ? C.green.bd : "#e2e8f0"} strokeWidth={isAuto ? 1.5 : 1} />
                <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 2) + 21}
                  textAnchor="middle"
                  fill={isAuto ? C.green.tx : "#64748b"} fontSize={10.5} fontWeight={isAuto ? 600 : 400}>{cell}</text>
              </g>
            );
          })}
        </g>
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

// Pump output dashboard with 3 pump cards
function PumpDashboard({ x, y }: { x: number; y: number }) {
  const dw = 1100, dh = 340;
  const pumps = [
    { title: "Jockey Pump", icon: "🔧", color: C.blue,
      metrics: [
        { label: "Flow", value: "180 LPM", icon: "💧" },
        { label: "Head", value: "XX m", icon: "📏" },
        { label: "Power", value: "XX kW", icon: "⚡" },
      ]},
    { title: "Drencher Pump", icon: "💦", color: C.amber,
      metrics: [
        { label: "Flow", value: "3200 LPM", icon: "💧" },
        { label: "Head", value: "XX m", icon: "📏" },
        { label: "Power", value: "XX kW", icon: "⚡" },
      ]},
    { title: "Drencher Standby", icon: "🔄", color: C.fire,
      metrics: [
        { label: "Flow", value: "3200 LPM", icon: "💧" },
        { label: "Head", value: "XX m", icon: "📏" },
        { label: "Power", value: "XX kW", icon: "⚡" },
      ]},
  ];
  const cardW = (dw - 60) / 3;

  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.fire.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.fire.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.fire.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={700}>
        {"📊"} JOCKEY & DRENCHER PUMP — FINAL SELECTION DASHBOARD
      </text>
      {pumps.map((p, pi) => {
        const px = x + 15 + pi * (cardW + 15);
        const py = y + 54;
        return (
          <g key={pi}>
            <rect x={px} y={py} width={cardW} height={220} rx={12}
              fill={p.color.bg} stroke={p.color.bd} strokeWidth={2.5} />
            <rect x={px} y={py} width={cardW} height={36} rx={12} fill={p.color.bd} />
            <rect x={px} y={py + 24} width={cardW} height={12} fill={p.color.bd} />
            <text x={px + cardW / 2} y={py + 24} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
              {p.icon} {p.title}
            </text>
            {p.metrics.map((m, mi) => {
              const my = py + 48 + mi * 56;
              return (
                <g key={mi}>
                  <rect x={px + 10} y={my} width={cardW - 20} height={46} rx={8}
                    fill="#fff" stroke={p.color.bd} strokeWidth={1.5} />
                  <text x={px + 30} y={my + 18} fill={p.color.tx} fontSize={20}>{m.icon}</text>
                  <text x={px + 55} y={my + 20} fill={p.color.tx} fontSize={12} fontWeight={600}>{m.label}</text>
                  <text x={px + cardW - 25} y={my + 20} textAnchor="end"
                    fill={p.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
                  <text x={px + cardW - 25} y={my + 38} textAnchor="end"
                    fill={p.color.tx} fontSize={9} opacity={0.6}>(Say Value)</text>
                </g>
              );
            })}
          </g>
        );
      })}
      <rect x={x + 15} y={y + dh - 50} width={dw - 30} height={36} rx={8}
        fill={C.violet.bg} stroke={C.violet.bd} strokeWidth={1.5} />
      <text x={x + dw / 2} y={y + dh - 30} textAnchor="middle" fill={C.violet.tx} fontSize={11} fontWeight={700}>
        ✅ NBC 2016 Part-4 | IS 15105 | TAC Compliant | Cross-link → Fire Pump (FFP) | Fire Tank (FTK)
      </text>
    </g>
  );
}


// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function FireJockeyDrencherCalcSVG() {
  const nh = 70;

  const Y = {
    entry:           50,
    // Section 1: Project Data
    projData:        200,
    projTable:       320,
    // Section 2: Pipe Schedule
    pipeHeader:      640,
    pipeTable:       760,
    // Section 3: Jockey Pump Hydraulics
    jkHeader:        1100,
    jkStatic:        1220,
    jkFriction:      1360,
    jkFrictionTable: 1480,
    jkTotal:         1800,
    // Section 4: Drencher Pump Hydraulics
    drnHeader:       1960,
    drnFlow:         2080,
    drnFriction:     2220,
    drnFrictionTable:2340,
    drnTotal:        2660,
    // Section 5: Safety Factor
    sfHeader:        2830,
    sfFormula:       2950,
    sfDecision:      3120,
    sfApply:         3240,
    sfSkip:          3240,
    sfConverge:      3390,
    // Section 6: System Pressure Summation
    sysHeader:       3500,
    jkSysFormula:    3620,
    drnSysFormula:   3790,
    // Section 7: Pump Selection
    pumpHeader:      3960,
    pumpDecision:    4100,
    pumpStd:         4220,
    pumpCustom:      4220,
    pumpConverge:    4370,
    pumpTable:       4480,
    // Section 8: Power Calculation
    powerHeader:     4820,
    powerFormula:    4940,
    powerTable:      5110,
    // Section 9: Standby & Redundancy
    redHeader:       5450,
    redDecision:     5590,
    redYes:          5710,
    redNo:           5710,
    redConverge:     5860,
    // Section 10: Dashboard
    dashboard:       5980,
    terminal:        6370,
  };

  const nw = 440;
  const nx = CX - nw / 2;
  const tableX = CX - 400;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="fjd-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* PHASE BANDS */}
      <PhaseBand y={Y.entry - 15}      h={120} label="ENTRY — JOCKEY & DRENCHER PUMP MODULE" color={C.fire.bd} />
      <PhaseBand y={Y.projData - 20}   h={Y.pipeHeader - Y.projData - 30} label="SECTION 1 — PROJECT DATA & SYSTEM PARAMETERS" color={C.purple.bd} />
      <PhaseBand y={Y.pipeHeader - 20} h={Y.jkHeader - Y.pipeHeader - 30} label="SECTION 2 — PIPE SCHEDULE & FLOW RATE DATABASE" color={C.cyan.bd} />
      <PhaseBand y={Y.jkHeader - 20}   h={Y.drnHeader - Y.jkHeader - 30} label="SECTION 3 — JOCKEY PUMP HYDRAULIC CALCULATION" color={C.blue.bd} />
      <PhaseBand y={Y.drnHeader - 20}  h={Y.sfHeader - Y.drnHeader - 30} label="SECTION 4 — DRENCHER PUMP HYDRAULIC CALCULATION" color={C.amber.bd} />
      <PhaseBand y={Y.sfHeader - 20}   h={Y.sysHeader - Y.sfHeader - 30} label="SECTION 5 — SAFETY FACTOR APPLICATION" color={C.rose.bd} />
      <PhaseBand y={Y.sysHeader - 20}  h={Y.pumpHeader - Y.sysHeader - 30} label="SECTION 6 — SYSTEM PRESSURE SUMMATION" color={C.teal.bd} />
      <PhaseBand y={Y.pumpHeader - 20} h={Y.powerHeader - Y.pumpHeader - 30} label="SECTION 7 — PUMP MODEL SELECTION" color={C.green.bd} />
      <PhaseBand y={Y.powerHeader - 20} h={Y.redHeader - Y.powerHeader - 30} label="SECTION 8 — MOTOR POWER CALCULATION" color={C.orange.bd} />
      <PhaseBand y={Y.redHeader - 20}  h={Y.dashboard - Y.redHeader - 30} label="SECTION 9 — STANDBY & REDUNDANCY CHECK" color={C.violet.bd} />
      <PhaseBand y={Y.dashboard - 20}  h={Y.terminal - Y.dashboard + 80} label="SECTION 10 — FINAL OUTPUT DASHBOARD" color={C.fire.bd} />

      {/* ENTRY */}
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="Start: Jockey & Drencher Pump Calc"
        sub="Pressure Maintenance & Water Curtain Pump Sizing"
        color={C.fire} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.projData} />

      {/* SECTION 1 */}
      <Box x={nx} y={Y.projData} w={nw} h={nh}
        label="Fetch System Parameters"
        sub="Auto-fetch from Fire Pump Module & Building DB"
        color={C.purple} badge="DB FETCH" />
      <Arrow x1={CX} y1={Y.projData + nh} x2={CX} y2={Y.projTable} />

      <DataTable x={tableX} y={Y.projTable}
        title={"🔗 AUTO-FETCHED FROM MAIN PUMP MODULE & BUILDING DB"}
        headers={["Parameter", "Source", "Value", "Unit"]}
        rows={[
          ["System Static Head", "Fire Pump Module", "Auto", "meters"],
          ["Building Height", "Main DB", "Auto", "meters"],
          ["Basement Depth", "Main DB", "Auto", "meters"],
          ["Horizontal Run (Basement)", "Building DB", "Auto", "meters"],
          ["Drencher Curtain Length", "Fire Design", "Auto", "meters"],
          ["No. of Drencher Nozzles", "Fire Design", "Auto", "Nos"],
          ["System Pressure (Main Pump)", "Fire Pump Module", "Auto", "Bar"],
        ]}
        color={C.purple}
      />

      <NoteBox x={CX + 320} y={Y.projTable + 30} w={240} h={80}
        icon="🔗" title="Cross-Module"
        lines={["Fire Pump Head (FFP)", "Fire Tank (FTK)", "Values auto-synced"]}
        color={C.violet} />
      <line x1={tableX + 800} y1={Y.projTable + 70} x2={CX + 320} y2={Y.projTable + 70}
        stroke={C.violet.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.projTable + 310} x2={CX} y2={Y.pipeHeader} />

      {/* SECTION 2 */}
      <Box x={nx} y={Y.pipeHeader} w={nw} h={nh}
        label="Pipe Schedule & Flow Rate Database"
        sub="Fetch pipe friction data from hydraulic datasheets"
        color={C.cyan} badge="DATASHEET" />
      <Arrow x1={CX} y1={Y.pipeHeader + nh} x2={CX} y2={Y.pipeTable} />

      <DataTable x={tableX} y={Y.pipeTable}
        title={"📄 PIPE SCHEDULE & FRICTION DATA (SHEETS 7-11)"}
        headers={["Pump Type", "Flow (LPM)", "Pipe Size", "C-Factor", "Reference"]}
        rows={[
          ["Jockey Pump", "180", "50mm / 80mm", "120", "IS 15105"],
          ["Drencher Pump", "3200", "100mm / 150mm", "120", "NBC Part-4"],
          ["Suction Line", "Varies", "Per pump", "120", "IS 2062"],
          ["Delivery Header", "Varies", "Per layout", "120", "IS 2062"],
        ]}
        color={C.cyan}
      />
      <Arrow x1={CX} y1={Y.pipeTable + 220} x2={CX} y2={Y.jkHeader} />

      {/* SECTION 3: JOCKEY */}
      <Box x={nx} y={Y.jkHeader} w={nw} h={nh}
        label="Jockey Pump Hydraulic Calculation"
        sub="Small-bore pipe head loss for pressure maintenance"
        color={C.blue} badge="JOCKEY" />
      <Arrow x1={CX} y1={Y.jkHeader + nh} x2={CX} y2={Y.jkStatic} />

      <FormulaBlock x={CX - 320} y={Y.jkStatic} w={640} h={90}
        lines={[
          "H_static = Building Height + Basement Depth",
          "H_static = Total vertical distance pump → highest outlet",
          "Includes suction lift from underground tank",
        ]}
        color={C.blue} />

      <NoteBox x={CX + 360} y={Y.jkStatic} w={220} h={70}
        icon="💡" title="Jockey Purpose"
        lines={["Maintains system pressure", "Starts before main pump"]}
        color={C.blue} />
      <line x1={CX + 320} y1={Y.jkStatic + 35} x2={CX + 360} y2={Y.jkStatic + 35}
        stroke={C.blue.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.jkStatic + 90} x2={CX} y2={Y.jkFriction} />

      <FormulaBlock x={CX - 320} y={Y.jkFriction} w={640} h={90}
        lines={[
          "H_friction_jk = Σ(L × f / d) for each pipe segment",
          "Hazen-Williams: h_f = 10.67 × Q^1.852 / (C^1.852 × d^4.87) × L",
          "Small-bore (50/80mm) → higher friction per unit length",
        ]}
        color={C.blue} />
      <Arrow x1={CX} y1={Y.jkFriction + 90} x2={CX} y2={Y.jkFrictionTable} />

      <DataTable x={tableX} y={Y.jkFrictionTable}
        title={"📊 JOCKEY PUMP — PIPE SEGMENT FRICTION ANALYSIS"}
        headers={["Segment", "Length (m)", "Diameter", "Flow (LPM)", "Head Loss (m)"]}
        rows={[
          ["Suction Line", "Auto", "80mm", "180", "Auto-calc"],
          ["Delivery Riser", "Auto", "50mm", "180", "Auto-calc"],
          ["Horizontal Run", "Auto", "50mm", "180", "Auto-calc"],
          ["Fittings (Equiv.)", "Auto", "—", "180", "Auto-calc"],
          ["TOTAL FRICTION", "—", "—", "—", "Auto-calc"],
        ]}
        color={C.blue}
      />
      <Arrow x1={CX} y1={Y.jkFrictionTable + 250} x2={CX} y2={Y.jkTotal} />

      <Box x={nx} y={Y.jkTotal} w={nw} h={nh}
        label="Jockey: Total Head = H_static + H_friction"
        sub="Before safety factor application"
        color={C.blue} badge="SUBTOTAL" />
      <Arrow x1={CX} y1={Y.jkTotal + nh} x2={CX} y2={Y.drnHeader} />

      {/* SECTION 4: DRENCHER */}
      <Box x={nx} y={Y.drnHeader} w={nw} h={nh}
        label="Drencher Pump Hydraulic Calculation"
        sub="High-volume water curtain supply head loss"
        color={C.amber} badge="DRENCHER" />
      <Arrow x1={CX} y1={Y.drnHeader + nh} x2={CX} y2={Y.drnFlow} />

      <FormulaBlock x={CX - 320} y={Y.drnFlow} w={640} h={90}
        lines={[
          "Q_drencher = N_nozzles × Q_per_nozzle",
          "Typical: 12–15 LPM per nozzle × nozzle count",
          "Total flow: 2500–4000 LPM typical range",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={Y.drnFlow + 90} x2={CX} y2={Y.drnFriction} />

      <FormulaBlock x={CX - 320} y={Y.drnFriction} w={640} h={90}
        lines={[
          "H_friction_drn = Σ(L × f / d) for large-bore segments",
          "100mm/150mm piping — lower friction per unit length",
          "But higher flow → significant cumulative loss",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={Y.drnFriction + 90} x2={CX} y2={Y.drnFrictionTable} />

      <DataTable x={tableX} y={Y.drnFrictionTable}
        title={"📊 DRENCHER PUMP — PIPE SEGMENT FRICTION ANALYSIS"}
        headers={["Segment", "Length (m)", "Diameter", "Flow (LPM)", "Head Loss (m)"]}
        rows={[
          ["Suction Line", "Auto", "150mm", "3200", "Auto-calc"],
          ["Delivery Riser", "Auto", "100mm", "3200", "Auto-calc"],
          ["Ring Main / Header", "Auto", "100mm", "3200", "Auto-calc"],
          ["Drencher Curtain Pipe", "Auto", "50mm", "Per nozzle", "Auto-calc"],
          ["Fittings (Equiv.)", "Auto", "—", "3200", "Auto-calc"],
          ["TOTAL FRICTION", "—", "—", "—", "Auto-calc"],
        ]}
        color={C.amber}
      />
      <Arrow x1={CX} y1={Y.drnFrictionTable + 280} x2={CX} y2={Y.drnTotal} />

      <Box x={nx} y={Y.drnTotal} w={nw} h={nh}
        label="Drencher: Total Head = H_static + H_friction"
        sub="Before safety factor application"
        color={C.amber} badge="SUBTOTAL" />
      <Arrow x1={CX} y1={Y.drnTotal + nh} x2={CX} y2={Y.sfHeader} />

      {/* SECTION 5: SAFETY FACTOR */}
      <Box x={nx} y={Y.sfHeader} w={nw} h={nh}
        label="Safety Factor Application"
        sub="Mandatory margin on friction head loss"
        color={C.rose} badge="SAFETY" />
      <Arrow x1={CX} y1={Y.sfHeader + nh} x2={CX} y2={Y.sfFormula} />

      <FormulaBlock x={CX - 320} y={Y.sfFormula} w={640} h={90}
        lines={[
          "H_friction_final = H_friction × Safety Factor",
          "Standard SF = 1.20 (20% margin on all friction)",
          "Accounts for pipe aging, fitting uncertainties",
        ]}
        color={C.rose} />

      <NoteBox x={CX + 360} y={Y.sfFormula} w={220} h={70}
        icon="🔥" title="Fire Safety Std"
        lines={["+20% on all friction", "NBC / IS 15105 requirement"]}
        color={C.fire} />
      <line x1={CX + 320} y1={Y.sfFormula + 35} x2={CX + 360} y2={Y.sfFormula + 35}
        stroke={C.fire.bd} strokeWidth={2} strokeDasharray="5,3" />

      <Arrow x1={CX} y1={Y.sfFormula + 90} x2={CX} y2={Y.sfDecision - 48} />

      <Diamond cx={CX} cy={Y.sfDecision} rxD={210} ryD={48}
        label="Additional Local Margin?"
        sub="Fire authority requires extra buffer?"
        color={C.rose} />

      <Arrow x1={CX - 140} y1={Y.sfDecision + 40} x2={CX - 300} y2={Y.sfApply}
        label="Yes (+10%)" color={C.reject} />
      <Box x={CX - 520} y={Y.sfApply} w={420} h={nh}
        label="Apply Additional 10% Authority Margin"
        sub="Total SF becomes 1.32 (1.20 × 1.10)"
        color={C.rose} badge="EXTRA SF" />

      <Arrow x1={CX + 140} y1={Y.sfDecision + 40} x2={CX + 300} y2={Y.sfSkip}
        label="No" color={C.green.bd} />
      <Box x={CX + 100} y={Y.sfSkip} w={420} h={nh}
        label="Standard 20% Safety Factor Sufficient"
        sub="SF = 1.20 per IS 15105 standard"
        color={C.green} badge="STANDARD" />

      <Arrow x1={CX - 300} y1={Y.sfApply + nh} x2={CX} y2={Y.sfConverge} />
      <Arrow x1={CX + 300} y1={Y.sfSkip + nh} x2={CX} y2={Y.sfConverge} />
      <Box x={nx} y={Y.sfConverge} w={nw} h={60}
        label="Safety-Adjusted Friction Locked"
        sub="Final friction values for both pumps determined"
        color={C.rose} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.sfConverge + 60} x2={CX} y2={Y.sysHeader} />

      {/* SECTION 6: SYSTEM PRESSURE */}
      <Box x={nx} y={Y.sysHeader} w={nw} h={nh}
        label="System Pressure Summation"
        sub="Separate TDH for Jockey vs Drencher pumps"
        color={C.teal} badge="TDH" />
      <Arrow x1={CX} y1={Y.sysHeader + nh} x2={CX} y2={Y.jkSysFormula} />

      <FormulaBlock x={CX - 340} y={Y.jkSysFormula} w={680} h={90}
        lines={[
          "JOCKEY TDH = H_static + H_friction_jk(×SF) + 5.0 m",
          "+5.0 m (0.5 Bar) ensures jockey starts before main pump",
          "Jockey must maintain system above main pump start pressure",
        ]}
        color={C.blue} />
      <Arrow x1={CX} y1={Y.jkSysFormula + 90} x2={CX} y2={Y.drnSysFormula} />

      <FormulaBlock x={CX - 340} y={Y.drnSysFormula} w={680} h={90}
        lines={[
          "DRENCHER TDH = H_static + H_friction_drn(×SF) + 35.0 m",
          "+35.0 m (3.5 Bar) for effective water curtain pressure",
          "Minimum nozzle pressure: 1.0 Bar at farthest nozzle",
        ]}
        color={C.amber} />
      <Arrow x1={CX} y1={Y.drnSysFormula + 90} x2={CX} y2={Y.pumpHeader} />

      {/* SECTION 7: PUMP SELECTION */}
      <Box x={nx} y={Y.pumpHeader} w={nw} h={nh}
        label="Pump Model Selection"
        sub="Match Q & H to manufacturer catalogue"
        color={C.green} badge="SELECTION" />
      <Arrow x1={CX} y1={Y.pumpHeader + nh} x2={CX} y2={Y.pumpDecision - 48} />

      <Diamond cx={CX} cy={Y.pumpDecision} rxD={210} ryD={48}
        label="Standard Model Available?"
        sub="Q-H point on manufacturer curve?"
        color={C.green} />

      <Arrow x1={CX - 140} y1={Y.pumpDecision + 40} x2={CX - 300} y2={Y.pumpStd}
        label="Yes" color={C.green.bd} />
      <Box x={CX - 520} y={Y.pumpStd} w={420} h={nh}
        label="Select Standard Catalogue Model"
        sub="Best efficiency point (BEP) within ±10% of design Q"
        color={C.green} badge="CATALOGUE" />

      <Arrow x1={CX + 140} y1={Y.pumpDecision + 40} x2={CX + 300} y2={Y.pumpCustom}
        label="No" color={C.reject} />
      <Box x={CX + 100} y={Y.pumpCustom} w={420} h={nh}
        label="Custom / Trimmed Impeller"
        sub="Impeller trim or custom model from manufacturer"
        color={C.amber} badge="CUSTOM" />

      <Arrow x1={CX - 300} y1={Y.pumpStd + nh} x2={CX} y2={Y.pumpConverge} />
      <Arrow x1={CX + 300} y1={Y.pumpCustom + nh} x2={CX} y2={Y.pumpConverge} />
      <Box x={nx} y={Y.pumpConverge} w={nw} h={60}
        label="Pump Models Locked"
        sub="Jockey & Drencher models selected from catalogue"
        color={C.green} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.pumpConverge + 60} x2={CX} y2={Y.pumpTable} />

      <DataTable x={tableX} y={Y.pumpTable}
        title={"📋 PUMP SELECTION SUMMARY"}
        headers={["Pump", "Flow (LPM)", "Head (m)", "Model", "Efficiency (%)"]}
        rows={[
          ["Jockey", "180", "Auto-calc", "Auto-select", "Auto"],
          ["Drencher (Main)", "3200", "Auto-calc", "Auto-select", "Auto"],
          ["Drencher (Standby)", "3200", "Auto-calc", "Same as main", "Auto"],
        ]}
        color={C.green}
      />
      <Arrow x1={CX} y1={Y.pumpTable + 180} x2={CX} y2={Y.powerHeader} />

      {/* SECTION 8: POWER */}
      <Box x={nx} y={Y.powerHeader} w={nw} h={nh}
        label="Motor Power Calculation"
        sub="Brake power + motor efficiency → rated power"
        color={C.orange} badge="POWER" />
      <Arrow x1={CX} y1={Y.powerHeader + nh} x2={CX} y2={Y.powerFormula} />

      <FormulaBlock x={CX - 340} y={Y.powerFormula} w={680} h={90}
        lines={[
          "P_brake = (Q × H × ρ × g) / (η_pump × 1000)",
          "P_motor = P_brake / η_motor",
          "Select next standard motor frame size (kW)",
        ]}
        color={C.orange} />
      <Arrow x1={CX} y1={Y.powerFormula + 90} x2={CX} y2={Y.powerTable} />

      <DataTable x={tableX} y={Y.powerTable}
        title={"⚡ MOTOR POWER SUMMARY"}
        headers={["Pump", "Brake HP", "Motor Eff", "Rated Power (kW)", "Starter Type"]}
        rows={[
          ["Jockey", "Auto-calc", "85%", "Auto-calc", "DOL / VFD"],
          ["Drencher (Electric)", "Auto-calc", "90%", "Auto-calc", "Star-Delta"],
          ["Drencher Standby", "Auto-calc", "90%", "Auto-calc", "Star-Delta"],
        ]}
        color={C.orange}
      />
      <Arrow x1={CX} y1={Y.powerTable + 180} x2={CX} y2={Y.redHeader} />

      {/* SECTION 9: REDUNDANCY */}
      <Box x={nx} y={Y.redHeader} w={nw} h={nh}
        label="Standby & Redundancy Check"
        sub="NBC requires 100% standby for fire drencher pump"
        color={C.violet} badge="REDUNDANCY" />
      <Arrow x1={CX} y1={Y.redHeader + nh} x2={CX} y2={Y.redDecision - 48} />

      <Diamond cx={CX} cy={Y.redDecision} rxD={220} ryD={48}
        label="Diesel Standby Required?"
        sub="Building height > 15m or essential category?"
        color={C.violet} />

      <Arrow x1={CX - 150} y1={Y.redDecision + 40} x2={CX - 300} y2={Y.redYes}
        label="Yes" color={C.green.bd} />
      <Box x={CX - 520} y={Y.redYes} w={420} h={nh}
        label="Diesel Engine Standby Drencher"
        sub="100% capacity diesel pump as per NBC requirement"
        color={C.fire} badge="DIESEL" />

      <Arrow x1={CX + 150} y1={Y.redDecision + 40} x2={CX + 300} y2={Y.redNo}
        label="No" color={C.reject} />
      <Box x={CX + 100} y={Y.redNo} w={420} h={nh}
        label="Electric Standby Sufficient"
        sub="Dual electric pumps with auto-changeover"
        color={C.green} badge="ELECTRIC" />

      <Arrow x1={CX - 300} y1={Y.redYes + nh} x2={CX} y2={Y.redConverge} />
      <Arrow x1={CX + 300} y1={Y.redNo + nh} x2={CX} y2={Y.redConverge} />
      <Box x={nx} y={Y.redConverge} w={nw} h={60}
        label="Redundancy Configuration Locked"
        sub="Standby type & count finalized"
        color={C.violet} badge="LOCKED" />
      <Arrow x1={CX} y1={Y.redConverge + 60} x2={CX} y2={Y.dashboard} />

      {/* SECTION 10: DASHBOARD */}
      <PumpDashboard x={CX - 550} y={Y.dashboard} />

      <Arrow x1={CX} y1={Y.dashboard + 340} x2={CX} y2={Y.terminal} />

      <Box x={nx} y={Y.terminal} w={nw} h={60}
        label="JOCKEY & DRENCHER CALC COMPLETE"
        sub="All outputs locked → Export to Report & BOQ"
        color={C.fire} badge="DONE" rx={30} />
    </svg>
  );
}
