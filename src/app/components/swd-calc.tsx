import React from "react";

// =====================================================================
// STORM WATER DRAINAGE (SWD) HYDRAULIC CALCULATOR — Custom SVG Flow Diagram
// Logic: Input Module → Rational Method → Design Params → Manning's Eq →
//        Velocity Decision → Capacity Check → Final Output
// =====================================================================

const W = 1400;
const H = 2500;
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
  arrow:  "#94a3b8",
};

function PhaseBand({ y, h, label, color }: { y: number; h: number; label: string; color: string }) {
  return (
    <g>
      <rect x={10} y={y} width={W - 20} height={h} rx={14}
        fill={`${color}08`} stroke={`${color}20`} strokeWidth={1.5} strokeDasharray="8,5" />
      <text x={24} y={y + 20} fill={color} fontSize={12} fontWeight={700} opacity={0.5} letterSpacing={1}>{label}</text>
    </g>
  );
}

function StepBadge({ x, y, num, color }: { x: number; y: number; num: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill={color} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>{num}</text>
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
          <rect x={x + w - 82} y={y + 6} width={72} height={22} rx={11} fill={color.bd} opacity={0.85} />
          <text x={x + w - 46} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}
            style={{ textTransform: "uppercase" as const }}>{badge}</text>
        </>
      )}
      <text x={cx} y={y + h / 2 - 6} textAnchor="middle" fill={color.tx} fontSize={16} fontWeight={700}>{label}</text>
      <text x={cx} y={y + h / 2 + 12} textAnchor="middle" fill={color.tx} fontSize={12} opacity={0.7}>{sub}</text>
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
        strokeDasharray={dash ? "8,5" : "none"} markerEnd="url(#swd-a)" />
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

function FormulaBox({ x, y, w, h, formula, note, color }: {
  x: number; y: number; w: number; h: number;
  formula: string; note: string;
  color: { bg: string; bd: string; tx: string };
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12}
        fill={color.bg} stroke={color.bd} strokeWidth={2.5} strokeDasharray="8,4" />
      <rect x={x + w - 90} y={y + 6} width={80} height={22} rx={11} fill={color.bd} opacity={0.85} />
      <text x={x + w - 50} y={y + 20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>FORMULA</text>
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{formula}</text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={color.tx} fontSize={11} opacity={0.7}>{note}</text>
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
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color.tx} fontSize={15} fontWeight={700}>{label}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={color.tx} fontSize={12} opacity={0.8}>{sub}</text>
    </g>
  );
}

// Input Table
function InputTable({ x, y }: { x: number; y: number }) {
  const tw = 780;
  const headers = ["Parameter", "Input Type", "Value", "Unit"];
  const rows = [
    ["Area Served Name", "User Input", "Text", "\u2014"],
    ["Catchment Area", "User Input", "Number", "sqm"],
    ["Runoff Coefficient (C)", "User Input", "0\u20131.0", "\u2014"],
    ["Rainfall Intensity (I)", "User Input", "Number", "mm/hr"],
  ];
  const colW = tw / 4, rowH = 34, hdrY = y + 56;
  const th = 56 + (rows.length + 1) * (rowH + 3) + 16;
  return (
    <g>
      <rect x={x} y={y} width={tw} height={th} rx={14}
        fill="#f8fafc" stroke={C.blue.bd} strokeWidth={3} />
      <rect x={x} y={y} width={tw} height={46} rx={14} fill={C.blue.bd} />
      <rect x={x} y={y + 32} width={tw} height={14} fill={C.blue.bd} />
      <text x={x + tw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>
        {"\uD83D\uDCC4"} STORM WATER INPUT MODULE
      </text>
      {headers.map((h, i) => (
        <g key={`h-${i}`}>
          <rect x={x + i * colW + 3} y={hdrY} width={colW - 6} height={rowH} rx={6}
            fill={C.blue.bg} stroke={C.blue.bd} strokeWidth={1.5} />
          <text x={x + i * colW + colW / 2} y={hdrY + 22} textAnchor="middle"
            fill={C.blue.tx} fontSize={13} fontWeight={700}>{h}</text>
        </g>
      ))}
      {rows.map((row, ri) => (
        <g key={`r-${ri}`}>
          {row.map((cell, ci) => (
            <g key={`c-${ri}-${ci}`}>
              <rect x={x + ci * colW + 3} y={hdrY + (ri + 1) * (rowH + 3) + 3}
                width={colW - 6} height={rowH} rx={6}
                fill={ci === 1 ? C.blue.bg : "#fff"}
                stroke={ci === 1 ? C.blue.bd : "#e2e8f0"}
                strokeWidth={ci === 1 ? 2 : 1}
                strokeDasharray={ci === 1 ? "6,3" : "none"} />
              <text x={x + ci * colW + colW / 2} y={hdrY + (ri + 1) * (rowH + 3) + 23}
                textAnchor="middle" fill={ci === 1 ? C.blue.tx : "#64748b"}
                fontSize={12} fontWeight={ci === 1 ? 600 : 400}>{cell}</text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

// Output Dashboard
function SWDSummary({ x, y }: { x: number; y: number }) {
  const dw = 1000, dh = 180;
  const metrics = [
    { label: "Pipe Diameter\n(mm)", value: "XXX mm", icon: "\uD83D\uDD27", color: C.purple },
    { label: "Actual Velocity\n(m/sec)", value: "X.XX m/s", icon: "\uD83D\uDCA8", color: C.cyan },
    { label: "Carrying Capacity\n(m\u00B3/sec)", value: "X.XX", icon: "\uD83C\uDF0A", color: C.blue },
  ];
  const cardW = (dw - 60) / 3, cardH = 100;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={dh} rx={16}
        fill="#f8fafc" stroke={C.cyan.bd} strokeWidth={3} />
      <rect x={x} y={y} width={dw} height={42} rx={16} fill={C.cyan.bd} />
      <rect x={x} y={y + 28} width={dw} height={14} fill={C.cyan.bd} />
      <text x={x + dw / 2} y={y + 28} textAnchor="middle" fill="#fff" fontSize={16} fontWeight={700}>
        {"\uD83D\uDCCA"} SWD HYDRAULIC OUTPUT DASHBOARD
      </text>
      {metrics.map((m, i) => {
        const cx = x + 16 + i * (cardW + 12);
        const cy = y + 54;
        return (
          <g key={i}>
            <rect x={cx} y={cy} width={cardW} height={cardH} rx={10}
              fill={m.color.bg} stroke={m.color.bd} strokeWidth={2} />
            <text x={cx + cardW / 2} y={cy + 24} textAnchor="middle" fontSize={22}>{m.icon}</text>
            <text x={cx + cardW / 2} y={cy + 46} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[0]}</text>
            <text x={cx + cardW / 2} y={cy + 62} textAnchor="middle"
              fill={m.color.tx} fontSize={12} fontWeight={600}>{m.label.split("\n")[1]}</text>
            <text x={cx + cardW / 2} y={cy + 86} textAnchor="middle"
              fill={m.color.bd} fontSize={16} fontWeight={800}>{m.value}</text>
          </g>
        );
      })}
    </g>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function SWDCalcSVG() {
  const Y = {
    entry: 40,
    step1: 180,
    inputTable: 300,
    step2: 580,
    runoff: 700,
    step3: 840,
    designParams: 960,
    step4: 1100,
    pipeCalc: 1210,
    velocityCalc: 1350,
    step5: 1510,
    velocityDecision: 1640,
    pathYes: 1770,
    pathNo: 1770,
    converge: 1920,
    step6: 2000,
    capacityCheck: 2120,
    dashboard: 2260,
  };

  const nw = 450, nh = 76;
  const nx = CX - nw / 2;
  const tableX = CX - 390;
  const dashX = CX - 500;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet">
      <defs>
        <marker id="swd-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={9} markerHeight={9} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
        </marker>
      </defs>

      {/* Phase Bands */}
      <PhaseBand y={Y.entry - 15} h={110} label="ENTRY POINT" color={C.cyan.bd} />
      <PhaseBand y={Y.step1 - 15} h={370} label="STEP 1: INPUT MODULE" color={C.blue.bd} />
      <PhaseBand y={Y.step2 - 15} h={230} label="STEP 2: HYDRAULIC RUNOFF (RATIONAL METHOD)" color={C.amber.bd} />
      <PhaseBand y={Y.step3 - 15} h={230} label="STEP 3: DESIGN PARAMETER INPUT" color={C.cyan.bd} />
      <PhaseBand y={Y.step4 - 15} h={370} label="STEP 4: AUTOMATED CALCULATION ENGINE" color={C.purple.bd} />
      <PhaseBand y={Y.step5 - 15} h={460} label="STEP 5: VELOCITY MONITOR (DECISION NODE)" color={C.rose.bd} />
      <PhaseBand y={Y.step6 - 15} h={230} label="STEP 6: CAPACITY CHECK" color={C.teal.bd} />
      <PhaseBand y={Y.dashboard - 15} h={200} label="FINAL OUTPUT: SWD DASHBOARD" color={C.cyan.bd} />

      {/* Entry */}
      <StepBadge x={nx - 24} y={Y.entry + nh / 2} num={0} color={C.cyan.bd} />
      <Box x={nx} y={Y.entry} w={nw} h={nh}
        label="SWD Hydraulic Calculator" sub="Storm Water Drainage \u2014 Pipe & Channel Sizing"
        color={C.cyan} badge="ENTRY" />
      <Arrow x1={CX} y1={Y.entry + nh} x2={CX} y2={Y.step1} />

      {/* Step 1: Input */}
      <StepBadge x={nx - 24} y={Y.step1 + nh / 2} num={1} color={C.blue.bd} />
      <Box x={nx} y={Y.step1} w={nw} h={nh}
        label="Input Module" sub="Area, runoff coefficient, rainfall intensity"
        color={C.blue} badge="INPUT" />
      <Arrow x1={CX} y1={Y.step1 + nh} x2={CX} y2={Y.inputTable} />

      <InputTable x={tableX} y={Y.inputTable} />
      <Arrow x1={CX} y1={Y.inputTable + 265} x2={CX} y2={Y.step2} />

      {/* Step 2: Rational Method */}
      <StepBadge x={nx - 24} y={Y.step2 + nh / 2} num={2} color={C.amber.bd} />
      <Box x={nx} y={Y.step2} w={nw} h={nh}
        label="Hydraulic Runoff Calculation" sub="Rational Method for peak storm runoff"
        color={C.amber} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step2 + nh} x2={CX} y2={Y.runoff} />

      <FormulaBox x={CX - 300} y={Y.runoff} w={600} h={76}
        formula="Q = (C \u00D7 I \u00D7 Area) / 3600"
        note="Rational Method \u2014 Q in m\u00B3/sec, I in mm/hr"
        color={C.amber} />
      <Arrow x1={CX} y1={Y.runoff + 76} x2={CX} y2={Y.step3} />

      {/* Step 3: Design Params */}
      <StepBadge x={nx - 24} y={Y.step3 + nh / 2} num={3} color={C.cyan.bd} />
      <Box x={nx} y={Y.step3} w={nw} h={nh}
        label="Design Parameter Input" sub="Pipe/Channel Slope (S) & Manning's Roughness (n)"
        color={C.cyan} badge="INPUT" />
      <Arrow x1={CX} y1={Y.step3 + nh} x2={CX} y2={Y.designParams} />

      {/* Side: Manning's n values */}
      <rect x={nx + nw + 30} y={Y.designParams - 30} width={260} height={100} rx={12}
        fill={C.slate.bg} stroke={C.slate.bd} strokeWidth={2} strokeDasharray="6,3" />
      <text x={nx + nw + 160} y={Y.designParams - 10} textAnchor="middle" fill={C.slate.tx} fontSize={11} fontWeight={700}>
        Manning's n Reference
      </text>
      <text x={nx + nw + 160} y={Y.designParams + 8} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        PVC: n = 0.010 | Concrete: n = 0.013
      </text>
      <text x={nx + nw + 160} y={Y.designParams + 24} textAnchor="middle" fill={C.slate.tx} fontSize={10}>
        CI/DI: n = 0.012 | Earth: n = 0.025
      </text>
      <text x={nx + nw + 160} y={Y.designParams + 46} textAnchor="middle" fill={C.slate.tx} fontSize={9} opacity={0.7}>
        Typical values from NBC/CPHEEO
      </text>

      <Box x={nx} y={Y.designParams} w={nw} h={nh}
        label="User Inputs: Slope (S) & Roughness (n)" sub="Pipe slope as fraction, n from material type"
        color={C.cyan} badge="INPUT" />
      <Arrow x1={CX} y1={Y.designParams + nh} x2={CX} y2={Y.step4} />

      {/* Step 4: Automated Calc Engine */}
      <StepBadge x={nx - 24} y={Y.step4 + nh / 2} num={4} color={C.purple.bd} />
      <Box x={nx} y={Y.step4} w={nw} h={nh}
        label="Automated Calculation Engine" sub="Pipe diameter/channel dimensions + flow velocity"
        color={C.purple} badge="ENGINE" />
      <Arrow x1={CX} y1={Y.step4 + nh} x2={CX} y2={Y.pipeCalc} />

      <Box x={nx} y={Y.pipeCalc} w={nw} h={nh}
        label="Calculate Pipe Diameter / Channel Size" sub="Based on required flow capacity from Step 2"
        color={C.purple} badge="SIZING" />
      <Arrow x1={CX} y1={Y.pipeCalc + nh} x2={CX} y2={Y.velocityCalc} />

      <FormulaBox x={CX - 320} y={Y.velocityCalc} w={640} h={76}
        formula="V = (1/n) \u00D7 R^(2/3) \u00D7 S^(1/2)"
        note="Manning's Equation \u2014 V = flow velocity, R = hydraulic radius"
        color={C.purple} />
      <Arrow x1={CX} y1={Y.velocityCalc + 76} x2={CX} y2={Y.step5} />

      {/* Step 5: Velocity Monitor */}
      <StepBadge x={nx - 24} y={Y.step5 + nh / 2} num={5} color={C.rose.bd} />
      <Box x={nx} y={Y.step5} w={nw} h={nh}
        label="Velocity Monitor (Decision Node)" sub="Check: Is calculated velocity \u2265 0.5 m/sec?"
        color={C.rose} badge="DECISION" />
      <Arrow x1={CX} y1={Y.step5 + nh} x2={CX} y2={Y.velocityDecision - 55} />

      <Diamond cx={CX} cy={Y.velocityDecision} rxD={220} ryD={55}
        label="V \u2265 0.5 m/sec ?" sub="Siltation Risk Assessment"
        color={C.rose} />

      {/* Decision branches */}
      {(() => {
        const leftX = CX - 310;
        const rightX = CX + 310;
        const bw = 250, bh = 90;
        return (
          <g>
            {/* YES */}
            <line x1={CX - 220} y1={Y.velocityDecision} x2={leftX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.velocityDecision} x2={leftX} y2={Y.pathYes} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={leftX - 18} y={Y.velocityDecision - 18} width={36} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={leftX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.green.bd} fontSize={11} fontWeight={700}>YES</text>

            <rect x={leftX - bw / 2} y={Y.pathYes} width={bw} height={bh} rx={12}
              fill={C.green.bg} stroke={C.green.bd} strokeWidth={2.5} />
            <rect x={leftX - bw / 2} y={Y.pathYes} width={bw} height={34} rx={12} fill={C.green.bd} />
            <rect x={leftX - bw / 2} y={Y.pathYes + 22} width={bw} height={12} fill={C.green.bd} />
            <text x={leftX} y={Y.pathYes + 22} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
              {"\u2705"} Safe Design
            </text>
            <text x={leftX} y={Y.pathYes + 56} textAnchor="middle" fill={C.green.tx} fontSize={12}>
              Velocity OK \u2014 No siltation risk
            </text>
            <text x={leftX} y={Y.pathYes + 74} textAnchor="middle" fill={C.green.tx} fontSize={11} opacity={0.7}>
              Proceed to capacity check
            </text>

            {/* NO */}
            <line x1={CX + 220} y1={Y.velocityDecision} x2={rightX} y2={Y.velocityDecision} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.velocityDecision} x2={rightX} y2={Y.pathNo} stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
            <rect x={rightX - 14} y={Y.velocityDecision - 18} width={28} height={16} rx={4} fill="#fff" opacity={0.92} />
            <text x={rightX} y={Y.velocityDecision - 6} textAnchor="middle" fill={C.rose.bd} fontSize={11} fontWeight={700}>NO</text>

            <rect x={rightX - bw / 2} y={Y.pathNo} width={bw} height={bh} rx={12}
              fill={C.rose.bg} stroke={C.rose.bd} strokeWidth={2.5} />
            <rect x={rightX - bw / 2} y={Y.pathNo} width={bw} height={34} rx={12} fill={C.rose.bd} />
            <rect x={rightX - bw / 2} y={Y.pathNo + 22} width={bw} height={12} fill={C.rose.bd} />
            <text x={rightX} y={Y.pathNo + 22} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>
              {"\u26A0\uFE0F"} SILTATION ALARM
            </text>
            <text x={rightX} y={Y.pathNo + 50} textAnchor="middle" fill={C.rose.tx} fontSize={11} fontWeight={600}>
              Options:
            </text>
            <text x={rightX} y={Y.pathNo + 66} textAnchor="middle" fill={C.rose.tx} fontSize={10}>
              \u2191 Increase Slope | \u2193 Decrease Diameter
            </text>
            <text x={rightX} y={Y.pathNo + 80} textAnchor="middle" fill={C.rose.tx} fontSize={10}>
              Use Smoother Material (lower n)
            </text>

            {/* Converge */}
            <line x1={leftX} y1={Y.pathYes + bh} x2={leftX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={rightX} y1={Y.pathNo + bh} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={leftX} y1={Y.converge} x2={rightX} y2={Y.converge} stroke={C.arrow} strokeWidth={2.5} />
            <line x1={CX} y1={Y.converge} x2={CX} y2={Y.step6}
              stroke={C.arrow} strokeWidth={2.5} markerEnd="url(#swd-a)" />
          </g>
        );
      })()}

      {/* Step 6: Capacity Check */}
      <StepBadge x={nx - 24} y={Y.step6 + nh / 2} num={6} color={C.teal.bd} />
      <Box x={nx} y={Y.step6} w={nw} h={nh}
        label="Capacity Check" sub="Ensure Q_cap > Q_peak (Carrying Capacity > Peak Runoff)"
        color={C.teal} badge="CHECK" />
      <Arrow x1={CX} y1={Y.step6 + nh} x2={CX} y2={Y.capacityCheck} />

      <FormulaBox x={CX - 300} y={Y.capacityCheck} w={600} h={76}
        formula="Q_cap = A \u00D7 V \u2265 Q_peak"
        note="Pipe area \u00D7 velocity must exceed design peak runoff"
        color={C.teal} />
      <Arrow x1={CX} y1={Y.capacityCheck + 76} x2={CX} y2={Y.dashboard} />

      {/* Dashboard */}
      <StepBadge x={dashX - 24} y={Y.dashboard + 90} num={7} color={C.cyan.bd} />
      <SWDSummary x={dashX} y={Y.dashboard} />
    </svg>
  );
}
