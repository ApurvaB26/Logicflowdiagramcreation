import React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// =====================================================================
// DETAILED DESIGN STAGE — COMPLETE FLOW CHART
// Layout follows concept-stage.tsx pattern: serpentine paired rows,
// tree-diagram fan-out/fan-in, color-coded phase bands, downward-only
// arrows, reject loops right side, position-aware arrow routing.
//
// Structure:
//   Part 1: Initiation
//   Part 2: Architect Drawing Coordination (auto-list, auto-mail, critical/beneficial gate)
//   Part 3: Detailed Input Data
//   Part 4: Detailed Calculations (service tree)
//   Part 5: Drawing Production
//   Part 6: Drawing Verification Checklist
//   Part 7: MEP Review & Detailed Review
//   Part 8: MEP Layout → Architect Agreement
//   Part 9: Final Verification & Completion
// =====================================================================

// ---- Types ----
interface DNode {
  id: string;
  label: string;
  sub: string;
  type: "process" | "decision" | "terminal" | "header" | "note" | "segment" | "service" | "checklist";
  color: string;
  bg: string;
  text: string;
  options?: string[];
  calcIds?: string[];
}
interface DConn {
  from: string;
  to: string;
  label?: string;
  style: "normal" | "reject" | "merge";
}

// ---- Color Palette ----
const CL = {
  blue:   { bg: "#dbeafe", bd: "#3b82f6", tx: "#1e40af", hd: "#3b82f6" },
  green:  { bg: "#d1fae5", bd: "#10b981", tx: "#065f46", hd: "#10b981" },
  purple: { bg: "#ede9fe", bd: "#8b5cf6", tx: "#5b21b6", hd: "#8b5cf6" },
  cyan:   { bg: "#cffafe", bd: "#06b6d4", tx: "#155e75", hd: "#06b6d4" },
  orange: { bg: "#fed7aa", bd: "#f97316", tx: "#9a3412", hd: "#f97316" },
  teal:   { bg: "#ccfbf1", bd: "#14b8a6", tx: "#134e4a", hd: "#14b8a6" },
  violet: { bg: "#e8d5ff", bd: "#a78bfa", tx: "#4c1d95", hd: "#a78bfa" },
  rose:   { bg: "#ffe4e6", bd: "#f43f5e", tx: "#9f1239", hd: "#f43f5e" },
  amber:  { bg: "#fef3c7", bd: "#f59e0b", tx: "#92400e", hd: "#f59e0b" },
  term:   { bg: "#059669", bd: "#34d399", tx: "#ffffff" },
  arrow: "#94a3b8",
  reject: "#ef4444",
  merge: "#3b82f6",
};

// ---- Builders ----
const hdr = (id: string, l: string, s: string, c: typeof CL.blue): DNode =>
  ({ id, label: l, sub: s, type: "header", color: c.hd, bg: c.hd, text: "#fff" });
const proc = (id: string, l: string, s: string, c: typeof CL.blue): DNode =>
  ({ id, label: l, sub: s, type: "process", color: c.bd, bg: c.bg, text: c.tx });
const dec = (id: string, l: string, s: string): DNode =>
  ({ id, label: l, sub: s, type: "decision", color: CL.amber.bd, bg: CL.amber.bg, text: CL.amber.tx });
const term = (id: string, l: string, s: string): DNode =>
  ({ id, label: l, sub: s, type: "terminal", color: CL.term.bd, bg: CL.term.bg, text: CL.term.tx });
const nt = (id: string, l: string, s: string, c: typeof CL.blue): DNode =>
  ({ id, label: l, sub: s, type: "note", color: c.bd, bg: c.bg, text: c.tx });
const chk = (id: string, l: string, s: string, c: typeof CL.blue): DNode =>
  ({ id, label: l, sub: s, type: "checklist", color: c.bd, bg: c.bg, text: c.tx });
const svc = (id: string, l: string, s: string, opts: string[], cids: string[], c: typeof CL.blue): DNode =>
  ({ id, label: l, sub: s, type: "service", color: c.bd, bg: c.bg, text: c.tx, options: opts, calcIds: cids });

// =====================================================================
// ALL NODES
// =====================================================================
const NODES: DNode[] = [
  // ── PART 1: INITIATION ──
  hdr("DD_INIT", "DETAILED DESIGN STAGE", "Receive Concept Stage Deliverables", CL.orange),

  // ── PART 2: ARCHITECT DRAWING COORDINATION ──
  hdr("DD_P2", "PART 2: Architect Drawing List", "Auto-generate & Mail Drawing Requirements", CL.violet),
  proc("DD_ADL", "Generate Drawing List", "\uD83D\uDCCB Auto-create list: Critical + Beneficial types", CL.violet),
  proc("DD_AML", "Auto-Mail to Architect", "\uD83D\uDCE7 System emails drawing list automatically", CL.violet),
  proc("DD_ARC", "Architect Shares Plans", "\uD83D\uDCE5 Architect returns requested drawings", CL.violet),
  proc("DD_RCV", "MEP Checks Received Plans", "\uD83D\uDD0D Compare received vs original drawing list", CL.violet),
  chk("DD_CK1C", "Critical Drawings Check", "\u2611 GA Plans, Sections, Structural, Fire exits", CL.rose),
  chk("DD_CK1B", "Beneficial Drawings Check", "\u2611 Ceiling heights, Landscape, Furniture layout", CL.teal),
  dec("DD_D1", "Critical List Complete?", "All critical drawings received?"),
  proc("DD_REQ1", "Request Missing Critical", "\uD83D\uDCE8 Notify Architect \u2192 re-request critical items", CL.rose),
  dec("DD_D1F", "Full List Complete?", "Critical + Beneficial both received?"),
  dec("DD_D1U", "User: Proceed Anyway?", "Only critical received \u2014 user decides"),
  proc("DD_REQ1B", "Request Beneficial Drawings", "\uD83D\uDCE8 Notify Architect \u2192 re-request beneficial", CL.rose),

  // ── PART 3: DETAILED INPUT DATA ──
  hdr("DD_P3", "PART 3: Detailed Input Data", "Floor-wise Data Collection & Validation", CL.blue),
  proc("DD_FW", "Floor-wise Area Data", "\uD83D\uDCCA Floor area, ceiling ht, usage per floor", CL.blue),
  proc("DD_EQ", "Equipment Schedules", "\uD83D\uDCCB Lifts, pumps, AHUs, panels per floor", CL.blue),
  proc("DD_LD", "Load Data per Floor", "\u26A1 Electrical + plumbing + HVAC loads/floor", CL.blue),
  proc("DD_FR", "Fire Safety Requirements", "\uD83D\uDD25 NBC / CFO compliance requirements", CL.blue),
  proc("DD_SH", "Shaft Locations & Sizes", "\uD83D\uDEE0 MEP shaft allocation per architect plan", CL.blue),
  nt("DD_N1", "\uD83D\uDDC3 Data Source", "All floor data auto-fetched from concept stage DB + architect plans", CL.blue),

  // ── PART 4: DETAILED CALCULATIONS ──
  hdr("DD_P4", "PART 4: Detailed Calculations", "Service-wise Detailed Engineering Calculations", CL.purple),
  svc("DD_SVC_E", "Electrical", "\u26A1 Detailed Calcs",
    ["Cable Sizing", "Panel Schedules", "SLD Diagrams", "Earthing Design", "Lightning Protection", "Bus Bar Sizing"],
    ["DD_CB", "DD_PNL", "DD_SLD", "DD_ERT", "DD_LTN", "DD_BUS"],
    CL.amber),
  svc("DD_SVC_P", "Plumbing", "\uD83D\uDCA7 Detailed Calcs",
    ["Pipe Sizing (H/C)", "Riser Diagrams", "Drainage Calcs", "Pump Selection", "Vent Pipe Sizing", "Water Meter Sizing"],
    ["DD_PIP", "DD_RSR", "DD_DRN", "DD_PMP", "DD_VNT", "DD_WMT"],
    CL.blue),
  svc("DD_SVC_H", "HVAC", "\u2744\uFE0F Detailed Calcs",
    ["Duct Sizing", "Equipment Selection", "VAV/FCU Selection", "BMS Integration", "Smoke Management"],
    ["DD_DCT", "DD_EQP", "DD_VAV", "DD_BMS", "DD_SMK"],
    CL.purple),
  svc("DD_SVC_F", "Firefighting", "\uD83D\uDD25 Detailed Calcs",
    ["Sprinkler Hydraulics", "Hydrant Layout", "Detection System", "PA/VA System", "Smoke Exhaust"],
    ["DD_SPR", "DD_HYD", "DD_DET", "DD_PAV", "DD_SMX"],
    CL.rose),
  hdr("DD_SVCM", "All Detail Calcs Complete", "Results merge \u2192 Format & Drawing Production", CL.purple),
  proc("DD_FMT", "Download Format Options", "\uD83D\uDCCB User selects calc download format", CL.purple),

  // ── PART 5: DRAWING PRODUCTION ──
  hdr("DD_P5", "PART 5: Drawing Production", "Floor-wise MEP Drawings per Service", CL.cyan),
  proc("DD_ELD", "Electrical Drawings", "\u26A1 SLD + Panel layout + cable routing/floor", CL.amber),
  proc("DD_PLD", "Plumbing Drawings", "\uD83D\uDCA7 Riser + drainage + piping layout/floor", CL.blue),
  proc("DD_HVD", "HVAC Drawings", "\u2744\uFE0F Duct layout + diffuser + equipment/floor", CL.purple),
  proc("DD_FFD", "Firefighting Drawings", "\uD83D\uDD25 Sprinkler + hydrant + detection/floor", CL.rose),
  proc("DD_PRM", "Plantroom Layouts", "\uD83C\uDFED Detailed pump room, STP, substation, chiller", CL.orange),
  proc("DD_FLR", "All Floor Layouts", "\uD83D\uDDFA Prepared from calculation output", CL.cyan),
  hdr("DD_DWM", "All Drawings Compiled", "Drawing register updated \u2192 Verification", CL.cyan),

  // ── PART 6: DRAWING VERIFICATION CHECKLIST ──
  hdr("DD_P6", "PART 6: Drawing Verification", "Verify All Drawings Before Proceeding", CL.teal),
  chk("DD_CK2", "MEP Drawing Checklist", "\u2611 Verify all floor-wise MEP drawings complete", CL.teal),
  dec("DD_D2", "All Drawings Complete?", "Check completeness of drawings"),
  proc("DD_REQ2", "Request Missing Drawings", "\uD83D\uDCE8 Flag incomplete drawings \u2192 loop back", CL.rose),

  // ── PART 7: MEP REVIEW & DETAILED REVIEW ──
  hdr("DD_P7", "PART 7: MEP Review & Calcs", "Review Plans + Policy Lookup + QC Check", CL.green),
  proc("DD_PR", "MEP Reviews & Comments", "\uD83D\uDCDD Review drawings, share comments", CL.violet),
  proc("DD_PLK", "Policy DB Lookup", "\uD83E\uDD16 System fetches policies from DB for review", CL.teal),
  proc("DD_RVC", "MEP Service Review", "\uD83E\uddEE All service-wise calcs verified from drawings", CL.purple),
  proc("DD_QC", "QC Checklist", "\u2611 Quality control against design standards", CL.green),
  dec("DD_D3", "QC Passed?", "Quality gate check"),
  proc("DD_RWK", "Rework Required", "\u270D\uFE0F Address review comments \u2192 loop back", CL.rose),

  // ── PART 8: MEP LAYOUT → ARCHITECT AGREEMENT ──
  hdr("DD_P8", "PART 8: Layout Sharing", "Share Layouts \u2192 Architect Review \u2192 Agreement", CL.orange),
  chk("DD_CK3", "MEP Layout Checklist", "\u2611 Verify all MEP layouts before sharing", CL.teal),
  proc("DD_SUB", "Share to Architect", "\uD83D\uDCE4 Send MEP layouts to Architect for review", CL.violet),
  proc("DD_ARV", "Architect Reviews", "\uD83D\uDD0D Architect reviews MEP layout drawings", CL.violet),
  dec("DD_D4", "Agreement?", "Architect \u2194 MEP Agreement on layouts"),
  proc("DD_REV", "MEP Revises Layouts", "\u270D\uFE0F Revise based on Architect feedback", CL.rose),

  // ── PART 9: FINAL VERIFICATION & COMPLETION ──
  hdr("DD_P9", "PART 9: Final Verification", "Final MEP Drawing Checklist \u2192 Stage Complete", CL.green),
  chk("DD_CK4", "Final MEP Drawing Checklist", "\u2611 All MEP drawings verified & revision-marked", CL.teal),
  proc("DD_REG", "Drawing Register", "\uD83D\uDDC2 Complete document register with revisions", CL.green),
  dec("DD_D5", "All Complete?", "Final gate check"),
  proc("DD_HOLD", "Stage On Hold", "\u23F8 Pending items \u2192 loop back to checklist", CL.rose),

  // ── COMPLETE ──
  term("DD_DONE", "DETAILED DESIGN COMPLETE", "Proceed to Tender Stage"),
];

// Build lookup
const NM: Record<string, DNode> = {};
NODES.forEach((n) => { NM[n.id] = n; });

// =====================================================================
// CONNECTIONS
// =====================================================================
const CN: DConn[] = [
  // Part 1: Initiation → Part 2
  { from: "DD_INIT", to: "DD_P2", style: "normal" },

  // Part 2: Architect Drawing Coordination
  { from: "DD_P2", to: "DD_ADL", style: "normal" },
  { from: "DD_ADL", to: "DD_AML", style: "normal" },
  { from: "DD_AML", to: "DD_ARC", style: "normal" },
  { from: "DD_ARC", to: "DD_RCV", style: "normal" },
  { from: "DD_RCV", to: "DD_CK1C", style: "normal" },
  { from: "DD_RCV", to: "DD_CK1B", style: "normal" },
  { from: "DD_CK1C", to: "DD_D1", style: "normal" },
  { from: "DD_CK1B", to: "DD_D1", style: "normal" },
  { from: "DD_D1", to: "DD_D1F", label: "Yes", style: "normal" },
  { from: "DD_D1", to: "DD_REQ1", label: "No \u2013 Missing", style: "reject" },
  { from: "DD_REQ1", to: "DD_ARC", label: "Re-request", style: "reject" },
  { from: "DD_D1F", to: "DD_P3", label: "Yes \u2013 Full", style: "normal" },
  { from: "DD_D1F", to: "DD_D1U", label: "No \u2013 Critical Only", style: "normal" },
  { from: "DD_D1U", to: "DD_P3", label: "Yes \u2013 Proceed", style: "normal" },
  { from: "DD_D1U", to: "DD_REQ1B", label: "No \u2013 Wait", style: "reject" },
  { from: "DD_REQ1B", to: "DD_ARC", label: "Re-request", style: "reject" },

  // Part 3: Detailed Input Data
  { from: "DD_P3", to: "DD_FW", style: "normal" },
  { from: "DD_FW", to: "DD_EQ", style: "normal" },
  { from: "DD_EQ", to: "DD_LD", style: "normal" },
  { from: "DD_LD", to: "DD_FR", style: "normal" },
  { from: "DD_FR", to: "DD_SH", style: "normal" },
  { from: "DD_SH", to: "DD_P4", style: "normal" },

  // Part 4: Detailed Calcs — Service tree handles DD_P4 → DD_SVC_* → DD_SVCM
  { from: "DD_SVCM", to: "DD_FMT", style: "normal" },
  { from: "DD_FMT", to: "DD_P5", style: "normal" },

  // Part 5: Drawing Production (parallel fan-out/fan-in)
  { from: "DD_P5", to: "DD_ELD", style: "normal" },
  { from: "DD_P5", to: "DD_PLD", style: "normal" },
  { from: "DD_P5", to: "DD_HVD", style: "normal" },
  { from: "DD_P5", to: "DD_FFD", style: "normal" },
  { from: "DD_P5", to: "DD_PRM", style: "normal" },
  { from: "DD_ELD", to: "DD_FLR", style: "normal" },
  { from: "DD_PLD", to: "DD_FLR", style: "normal" },
  { from: "DD_HVD", to: "DD_FLR", style: "normal" },
  { from: "DD_FFD", to: "DD_FLR", style: "normal" },
  { from: "DD_PRM", to: "DD_FLR", style: "normal" },
  { from: "DD_FLR", to: "DD_DWM", style: "normal" },

  // Part 6: Drawing Verification Checklist
  { from: "DD_DWM", to: "DD_P6", style: "normal" },
  { from: "DD_P6", to: "DD_CK2", style: "normal" },
  { from: "DD_CK2", to: "DD_D2", style: "normal" },
  { from: "DD_D2", to: "DD_P7", label: "Yes", style: "normal" },
  { from: "DD_D2", to: "DD_REQ2", label: "No \u2013 Missing", style: "reject" },
  { from: "DD_REQ2", to: "DD_CK2", label: "Re-verify", style: "reject" },

  // Part 7: MEP Review & Detailed Review (parallel PR & PLK)
  { from: "DD_P7", to: "DD_PR", style: "normal" },
  { from: "DD_P7", to: "DD_PLK", style: "normal" },
  { from: "DD_PR", to: "DD_RVC", style: "normal" },
  { from: "DD_PLK", to: "DD_RVC", style: "normal" },
  { from: "DD_RVC", to: "DD_QC", style: "normal" },
  { from: "DD_QC", to: "DD_D3", style: "normal" },
  { from: "DD_D3", to: "DD_P8", label: "Yes \u2013 Pass", style: "normal" },
  { from: "DD_D3", to: "DD_RWK", label: "No \u2013 Fail", style: "reject" },
  { from: "DD_RWK", to: "DD_PR", label: "Rework", style: "reject" },

  // Part 8: MEP Layout → Architect Agreement
  { from: "DD_P8", to: "DD_CK3", style: "normal" },
  { from: "DD_CK3", to: "DD_SUB", style: "normal" },
  { from: "DD_SUB", to: "DD_ARV", style: "normal" },
  { from: "DD_ARV", to: "DD_D4", style: "normal" },
  { from: "DD_D4", to: "DD_P9", label: "Yes \u2013 Agreed", style: "normal" },
  { from: "DD_D4", to: "DD_REV", label: "No \u2013 Reject", style: "reject" },
  { from: "DD_REV", to: "DD_FLR", label: "Revise Layouts", style: "reject" },

  // Part 9: Final Verification & Completion
  { from: "DD_P9", to: "DD_CK4", style: "normal" },
  { from: "DD_CK4", to: "DD_REG", style: "normal" },
  { from: "DD_REG", to: "DD_D5", style: "normal" },
  { from: "DD_D5", to: "DD_DONE", label: "Yes \u2013 Complete", style: "normal" },
  { from: "DD_D5", to: "DD_HOLD", label: "No \u2013 Pending", style: "reject" },
  { from: "DD_HOLD", to: "DD_CK4", label: "Re-check", style: "reject" },
];

// =====================================================================
// GRID LAYOUT
// =====================================================================
const GRID: string[][] = [
  // Part 1: Initiation
  ["DD_INIT"],                                           // 0

  // Part 2: Architect Drawing Coordination
  ["DD_P2"],                                             // 1
  ["DD_ADL"],                                            // 4 ← auto-generate drawing list
  ["DD_AML"],                                            // 5 ← auto-mail to architect
  ["DD_ARC"],                                            // 6 ← architect returns plans
  ["DD_RCV"],                                            // 7 ← MEP checks received vs list
  ["DD_CK1C", "DD_CK1B"],                               // 8 ← critical & beneficial sections
  ["DD_D1", "DD_REQ1"],                                  // 9 ← critical complete?
  ["DD_D1F"],                                            // 10 ← full list check
  ["DD_D1U", "DD_REQ1B"],                                // 11 ← user proceed or wait?

  // Part 3: Detailed Input Data
  ["DD_P3"],                                             // 12
  ["DD_FW", "DD_EQ"],                                    // 13
  ["DD_LD", "DD_FR"],                                    // 14
  ["DD_SH"],                                             // 15

  // Part 4: Detailed Calculations (Service Tree)
  ["DD_P4"],                                             // 16
  ["DD_SVC_E", "DD_SVC_P", "DD_SVC_H", "DD_SVC_F"],     // 17 ← service cards
  ["DD_SVCM"],                                           // 18
  ["DD_FMT"],                                            // 19

  // Part 5: Drawing Production
  ["DD_P5"],                                             // 20
  ["DD_ELD", "DD_PLD", "DD_HVD", "DD_FFD", "DD_PRM"],   // 21 ← parallel drawings
  ["DD_FLR"],                                            // 22
  ["DD_DWM"],                                            // 23

  // Part 6: Drawing Verification Checklist
  ["DD_P6"],                                             // 24
  ["DD_CK2"],                                            // 25
  ["DD_D2", "DD_REQ2"],                                  // 26

  // Part 7: MEP Review & Detailed Review
  ["DD_P7"],                                             // 27
  ["DD_PR", "DD_PLK"],                                   // 28 ← parallel: review + policy
  ["DD_RVC"],                                            // 29
  ["DD_QC"],                                             // 30
  ["DD_D3", "DD_RWK"],                                   // 31

  // Part 8: MEP Layout → Architect Agreement
  ["DD_P8"],                                             // 32
  ["DD_CK3"],                                            // 33
  ["DD_SUB"],                                            // 34
  ["DD_ARV"],                                            // 35
  ["DD_D4", "DD_REV"],                                   // 36

  // Part 9: Final Verification & Completion
  ["DD_P9"],                                             // 37
  ["DD_CK4"],                                            // 38
  ["DD_REG"],                                            // 39
  ["DD_D5", "DD_HOLD"],                                  // 40
  ["DD_DONE"],                                           // 41
];

// Service card row needs extra space
const SERVICE_ROW_INDICES = new Set([15]);
const SVC_ROW_GAP = 290;

// Service tree constants
const SVC_IDS = ["DD_SVC_E", "DD_SVC_P", "DD_SVC_H", "DD_SVC_F"];
const SVC_LABELS: Record<string, string> = {
  DD_SVC_E: "Electrical",
  DD_SVC_P: "Plumbing",
  DD_SVC_H: "HVAC",
  DD_SVC_F: "Firefighting",
};

// =====================================================================
// LAYOUT ENGINE
// =====================================================================
const NW = 210;
const NH = 58;
const SVC_NH = 235;
const RGAP = 96;
const CGAP = 40;
const PX = 120;
const PY = 36;

// Note annotations
interface Ann { pid: string; nid: string; dx: number; dy: number }
const ANNS: Ann[] = [
  { pid: "DD_SH", nid: "DD_N1", dx: NW + 8, dy: 2 },
];

// Build node→row lookup
const NODE_ROW: Record<string, number> = {};
GRID.forEach((row, ri) => { row.forEach((id) => { NODE_ROW[id] = ri; }); });

function nodeH(n: DNode): number {
  if (n.type === "service") return SVC_NH;
  if (n.type === "decision") return NH + 16;
  return NH;
}

function computeLayout() {
  const pos: Record<string, { x: number; y: number }> = {};
  const rowY: number[] = [];
  const maxC = Math.max(...GRID.map((r) => r.length));
  const maxW = maxC * NW + (maxC - 1) * CGAP;
  let y = PY;
  for (let ri = 0; ri < GRID.length; ri++) {
    rowY.push(y);
    const row = GRID[ri];
    const rw = row.length * NW + (row.length - 1) * CGAP;
    const sx = PX + (maxW - rw) / 2;
    row.forEach((id, i) => { pos[id] = { x: sx + i * (NW + CGAP), y }; });
    y += SERVICE_ROW_INDICES.has(ri) ? SVC_ROW_GAP : RGAP;
  }
  return { pos, rowY, H: y + 60, W: maxW + PX * 2 };
}

// =====================================================================
// SVG NODE RENDERER
// =====================================================================
function DrawNode({ n, x, y, onCalcItemClick }: {
  n: DNode; x: number; y: number;
  onCalcItemClick?: (calcId: string) => void;
}) {
  const cx = x + NW / 2, cy = y + NH / 2;

  if (n.type === "decision") {
    const rx = NW / 2 + 10, ry = NH / 2 + 8;
    return (
      <g>
        <polygon
          points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`}
          fill={n.bg} stroke={n.color} strokeWidth={2}
        />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.8}>{n.sub}</text>
      </g>
    );
  }

  if (n.type === "terminal") {
    return (
      <g>
        <rect x={x} y={y} width={NW} height={NH} rx={NH / 2} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={11} fontWeight={700}>{n.label}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.9}>{n.sub}</text>
      </g>
    );
  }

  if (n.type === "header") {
    return (
      <g>
        <rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={10.5} fontWeight={700}>{n.label}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize={8.5} opacity={0.85}>
          {n.sub.length > 38 ? n.sub.slice(0, 36) + "\u2026" : n.sub}
        </text>
      </g>
    );
  }

  if (n.type === "note") {
    const w = NW + 16, h = NH - 8;
    return (
      <g opacity={0.88}>
        <rect x={x} y={y} width={w} height={h} rx={6}
          fill={n.bg} stroke={n.color} strokeWidth={1} strokeDasharray="4,3" />
        <text x={x + w / 2} y={y + h / 2 - 5} textAnchor="middle" fill={n.text} fontSize={8.5} fontWeight={600}>{n.label}</text>
        <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fill={n.text} fontSize={7.5} opacity={0.75}>
          {n.sub.length > 58 ? n.sub.slice(0, 56) + "\u2026" : n.sub}
        </text>
      </g>
    );
  }

  if (n.type === "checklist") {
    return (
      <g>
        <rect x={x} y={y} width={NW} height={NH} rx={8}
          fill={n.bg} stroke={n.color} strokeWidth={2} strokeDasharray="6,3" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>
          {n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}
        </text>
      </g>
    );
  }

  if (n.type === "service") {
    const opts = n.options || [];
    const cids = n.calcIds || [];
    const h = SVC_NH;
    const headerH = 36;
    const pillH = 18;
    const pillGap = 4;

    return (
      <g>
        <rect x={x} y={y} width={NW} height={h} rx={10}
          fill={n.bg} stroke={n.color} strokeWidth={2.5} />
        <rect x={x} y={y} width={NW} height={headerH} rx={10} fill={n.color} />
        <rect x={x} y={y + headerH - 6} width={NW} height={6} fill={n.color} />
        <text x={cx} y={y + 15} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
          {n.label}
        </text>
        <text x={cx} y={y + 28} textAnchor="middle" fill="#fff" fontSize={8} opacity={0.85}>
          {n.sub}
        </text>
        {opts.map((opt, i) => {
          const py = y + headerH + 8 + i * (pillH + pillGap);
          const pillW = NW - 14;
          const px = x + 7;
          const calcId = cids[i];
          return (
            <g key={i}
              onClick={calcId && onCalcItemClick ? (e: React.MouseEvent) => { e.stopPropagation(); onCalcItemClick(calcId); } : undefined}
              style={calcId ? { cursor: "pointer" } : undefined}
            >
              <rect x={px} y={py} width={pillW} height={pillH} rx={5}
                fill="#fff" stroke={n.color} strokeWidth={1.2} />
              <text x={px + 8} y={py + pillH / 2 + 3.5}
                fill={n.text} fontSize={9} fontWeight={600}>
                {opt}
              </text>
              {calcId && (
                <>
                  <rect x={px + pillW - 12} y={py + 3} width={8} height={pillH - 6} rx={3}
                    fill={n.color} opacity={0.2} />
                  <text x={px + pillW - 8} y={py + pillH / 2 + 3} textAnchor="middle"
                    fill={n.color} fontSize={7} fontWeight={700}>{"\u203A"}</text>
                </>
              )}
            </g>
          );
        })}
        <rect x={x - 2} y={y - 2} width={NW + 4} height={h + 4} rx={12}
          fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3}
          className="calc-glow" strokeDasharray="4,2" />
      </g>
    );
  }

  // ── process (default) ──
  return (
    <g>
      <rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={1.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>
        {n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}
      </text>
    </g>
  );
}

// =====================================================================
// SERVICE TREE DIAGRAM — Fan-out from DD_P4 and fan-in to DD_SVCM
// =====================================================================
function DrawServiceTree({ pos }: { pos: Record<string, { x: number; y: number }> }) {
  const p4 = pos["DD_P4"];
  const svcm = pos["DD_SVCM"];
  if (!p4 || !svcm) return null;

  const svcPositions = SVC_IDS.map((id) => ({
    id,
    label: SVC_LABELS[id],
    cx: pos[id].x + NW / 2,
    top: pos[id].y,
    bot: pos[id].y + SVC_NH,
  }));

  const p4Bot = p4.y + NH;
  const p4Cx = p4.x + NW / 2;
  const svcmTop = svcm.y;
  const svcmCx = svcm.x + NW / 2;
  const svcTop = svcPositions[0].top;
  const svcBot = svcPositions[0].bot;

  const fanOutBarY = p4Bot + (svcTop - p4Bot) / 2;
  const fanInBarY = svcBot + (svcmTop - svcBot) / 2;

  const leftCx = svcPositions[0].cx;
  const rightCx = svcPositions[svcPositions.length - 1].cx;
  const color = CL.arrow;

  return (
    <g>
      <line x1={p4Cx} y1={p4Bot} x2={p4Cx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      <line x1={leftCx} y1={fanOutBarY} x2={rightCx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      {svcPositions.map((s) => (
        <line key={`sfo-${s.id}`}
          x1={s.cx} y1={fanOutBarY} x2={s.cx} y2={s.top}
          stroke={color} strokeWidth={1.6} markerEnd="url(#dd-ma)" />
      ))}
      {svcPositions.map((s) => {
        const lx = s.cx;
        const ly = fanOutBarY - 5;
        const lbl = s.label;
        const tw = lbl.length * 5.5 + 8;
        return (
          <g key={`sfl-${s.id}`}>
            <rect x={lx - tw / 2} y={ly - 10} width={tw} height={13} rx={3} fill="#fff" opacity={0.92} />
            <text x={lx} y={ly} textAnchor="middle" fill="#475569" fontSize={8} fontWeight={600}>{lbl}</text>
          </g>
        );
      })}
      {svcPositions.map((s) => (
        <line key={`sfi-${s.id}`}
          x1={s.cx} y1={s.bot} x2={s.cx} y2={fanInBarY}
          stroke={color} strokeWidth={1.6} />
      ))}
      <line x1={leftCx} y1={fanInBarY} x2={rightCx} y2={fanInBarY} stroke={color} strokeWidth={1.6} />
      <line x1={svcmCx} y1={fanInBarY} x2={svcmCx} y2={svcmTop}
        stroke={color} strokeWidth={1.6} markerEnd="url(#dd-ma)" />
    </g>
  );
}

// =====================================================================
// SVG CONNECTION RENDERER
// =====================================================================
function DrawConn({ c, pos, W }: { c: DConn; pos: Record<string, { x: number; y: number }>; W: number }) {
  const fp = pos[c.from], tp = pos[c.to];
  if (!fp || !tp) return null;
  const fn = NM[c.from], tn = NM[c.to];
  if (!fn || !tn) return null;

  const color = c.style === "reject" ? CL.reject : c.style === "merge" ? CL.merge : CL.arrow;
  const dash = c.style === "reject" ? "6,4" : c.style === "merge" ? "8,4" : "none";
  const mk = c.style === "reject" ? "dd-mr" : c.style === "merge" ? "dd-mm" : "dd-ma";

  const fcx = fp.x + NW / 2;
  const tcx = tp.x + NW / 2;
  const fnHt = nodeH(fn);
  const tnHt = nodeH(tn);

  const y1 = fn.type === "decision" ? fp.y + NH / 2 + NH / 2 + 8 : fp.y + fnHt;
  const y2 = tn.type === "decision" ? tp.y + (NH + 16) / 2 - NH / 2 - 8 : tp.y;

  const fcy = fp.y + fnHt / 2;
  const tcy = tp.y + tnHt / 2;
  const dy = tp.y - fp.y;

  const fromRow = NODE_ROW[c.from] ?? -1;
  const toRow = NODE_ROW[c.to] ?? -1;
  const rowDiff = toRow - fromRow;
  const hDiff = Math.abs(tcx - fcx);

  const renderPath = (d: string, labelX: number, labelY: number, labelAnchor?: string) => (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray={dash} markerEnd={`url(#${mk})`} />
      {c.label && (
        <g>
          <rect x={labelX - (c.label.length * 3.2)} y={labelY - 9}
            width={c.label.length * 6.4} height={13} rx={3} fill="#fff" opacity={0.92} />
          <text x={labelX} y={labelY} fill={color === CL.arrow ? "#475569" : color}
            fontSize={8} fontWeight={600} textAnchor={labelAnchor || "middle"}>{c.label}</text>
        </g>
      )}
    </g>
  );

  // Going UP — reject loop
  if (dy < -20 && c.style === "reject") {
    const rightX = Math.min(W - 20, Math.max(fp.x + NW, tp.x + NW) + 40);
    const sx = fp.x + NW;
    const sy = fcy;
    const ex = tp.x + NW;
    const ey = tcy;
    const d = `M${sx},${sy} L${rightX},${sy} L${rightX},${ey} L${ex},${ey}`;
    return renderPath(d, rightX + 4, (sy + ey) / 2, "start");
  }

  // Same row — horizontal
  if (Math.abs(dy) <= 20) {
    const ltr = tcx > fcx;
    const x1h = ltr ? fp.x + NW : fp.x;
    const x2h = ltr ? tp.x : tp.x + NW;
    const d = `M${x1h},${fcy} L${x2h},${tcy}`;
    return renderPath(d, (x1h + x2h) / 2, fcy - 10);
  }

  // Going DOWN reject — route right side
  if (c.style === "reject" && hDiff < 5 && dy > RGAP * 1.5) {
    const rightX = Math.min(W - 20, fp.x + NW + 40);
    const d = `M${fp.x + NW},${fcy} L${rightX},${fcy} L${rightX},${tcy} L${tp.x + NW},${tcy}`;
    return renderPath(d, rightX + 4, (fcy + tcy) / 2, "start");
  }

  // Straight down
  if (hDiff < 5 && rowDiff === 1) {
    const d = `M${fcx},${y1} L${tcx},${y2}`;
    return renderPath(d, fcx + 14, (y1 + y2) / 2);
  }

  // Gutter routing
  const needsGutter = (() => {
    if (rowDiff <= 1) return false;
    for (let ri = fromRow + 1; ri < toRow; ri++) {
      for (const nid of GRID[ri]) {
        const np = pos[nid];
        if (!np) continue;
        const nLeft = np.x - 15;
        const nRight = np.x + NW + 15;
        const minPathX = Math.min(fcx, tcx);
        const maxPathX = Math.max(fcx, tcx);
        if (maxPathX > nLeft && minPathX < nRight) return true;
      }
    }
    return false;
  })();

  if (needsGutter) {
    let blockLeftMin = Infinity;
    let blockRightMax = -Infinity;
    for (let ri = fromRow + 1; ri < toRow; ri++) {
      for (const nid of GRID[ri]) {
        const np = pos[nid];
        if (!np) continue;
        blockLeftMin = Math.min(blockLeftMin, np.x);
        blockRightMax = Math.max(blockRightMax, np.x + NW);
      }
    }
    const GUTTER_MARGIN = 22;
    const closeLeftGutter = blockLeftMin - GUTTER_MARGIN;
    const closeRightGutter = blockRightMax + GUTTER_MARGIN;
    const leftDist = Math.abs(fcx - closeLeftGutter) + Math.abs(tcx - closeLeftGutter);
    const rightDist = Math.abs(fcx - closeRightGutter) + Math.abs(tcx - closeRightGutter);
    const useLeft = leftDist <= rightDist;
    const gutterX = useLeft ? closeLeftGutter : closeRightGutter;
    const exitX = useLeft ? fp.x : fp.x + NW;
    const enterX = useLeft ? tp.x : tp.x + NW;
    const d = `M${exitX},${fcy} L${gutterX},${fcy} L${gutterX},${tcy} L${enterX},${tcy}`;
    const labelOffset = useLeft ? -4 : 4;
    return renderPath(d, gutterX + labelOffset, (fcy + tcy) / 2, useLeft ? "end" : "start");
  }

  // Same column skip rows
  if (hDiff < 5) {
    const d = `M${fcx},${y1} L${tcx},${y2}`;
    return renderPath(d, fcx + 14, (y1 + y2) / 2);
  }

  // L-shape
  const gapY = y1 + (y2 - y1) / 2;
  const d = `M${fcx},${y1} L${fcx},${gapY} L${tcx},${gapY} L${tcx},${y2}`;
  return renderPath(d, (fcx + tcx) / 2, gapY - 10);
}

// =====================================================================
// PHASE BACKGROUND BANDS
// =====================================================================
interface BandDef { label: string; firstNode: string; lastNode: string; color: string }
const BAND_DEFS: BandDef[] = [
  { label: "PART 1: INITIATION \u2014 Project Handover & Kickoff", firstNode: "DD_INIT", lastNode: "DD_SC", color: CL.orange.bd },
  { label: "PART 2: ARCHITECT COORDINATION \u2014 Receive Final Drawings", firstNode: "DD_P2", lastNode: "DD_REQ1", color: CL.violet.bd },
  { label: "PART 3: DETAILED INPUT DATA \u2014 Floor-wise Collection", firstNode: "DD_P3", lastNode: "DD_SH", color: CL.blue.bd },
  { label: "PART 4: DETAILED CALCULATIONS \u2014 Service-wise Engineering", firstNode: "DD_P4", lastNode: "DD_FMT", color: CL.purple.bd },
  { label: "PART 5: DRAWING PRODUCTION \u2014 Floor-wise MEP Drawings", firstNode: "DD_P5", lastNode: "DD_DWM", color: CL.cyan.bd },
  { label: "PART 6: DRAWING VERIFICATION CHECKLIST", firstNode: "DD_P6", lastNode: "DD_REQ2", color: CL.teal.bd },
  { label: "PART 7: MEP REVIEW & CALCULATIONS", firstNode: "DD_P7", lastNode: "DD_RWK", color: CL.green.bd },
  { label: "PART 8: MEP LAYOUT \u2192 ARCHITECT AGREEMENT", firstNode: "DD_P8", lastNode: "DD_REV", color: CL.orange.bd },
  { label: "PART 9: FINAL VERIFICATION & COMPLETION", firstNode: "DD_P9", lastNode: "DD_DONE", color: CL.green.bd },
];

// =====================================================================
// CALC DETAIL OVERLAY (placeholder flows for detailed design calcs)
// =====================================================================
interface CalcStep { id: string; label: string; sub: string; type: "input" | "process" | "formula" | "output" | "decision" }
interface CalcFlow { title: string; icon: string; color: string; accentBg: string; steps: CalcStep[]; connections: { from: string; to: string; label?: string }[] }

const DD_CALC_FLOWS: Record<string, CalcFlow> = {
  DD_CB: {
    title: "Cable Sizing Calculation",
    icon: "\u26A1", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "C1", label: "Input: Load per Circuit", sub: "KW per panel per floor", type: "input" },
      { id: "C2", label: "Current Calculation", sub: "I = P / (V \u00D7 PF \u00D7 \u221A3)", type: "formula" },
      { id: "C3", label: "Cable Selection", sub: "IS 3961 / IEC 60502 current rating lookup", type: "process" },
      { id: "C4", label: "Voltage Drop Check", sub: "VD% = (I \u00D7 L \u00D7 Zc) / V \u00D7 100", type: "formula" },
      { id: "C5", label: "Short Circuit Rating", sub: "I\u00B2t withstand verification", type: "formula" },
      { id: "C6", label: "Output: Cable Schedule", sub: "Size + Type + Route \u2192 BOQ", type: "output" },
    ],
    connections: [{ from: "C1", to: "C2" }, { from: "C2", to: "C3" }, { from: "C3", to: "C4" }, { from: "C4", to: "C5" }, { from: "C5", to: "C6" }],
  },
  DD_PNL: {
    title: "Panel Schedule Design",
    icon: "\uD83D\uDCCB", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "P1", label: "Input: Circuit List", sub: "All circuits per panel per floor", type: "input" },
      { id: "P2", label: "Load Balancing", sub: "R-Y-B phase distribution", type: "process" },
      { id: "P3", label: "Breaker Selection", sub: "MCB/MCCB rating per circuit", type: "process" },
      { id: "P4", label: "Output: Panel Schedule", sub: "Complete panel schedule drawing", type: "output" },
    ],
    connections: [{ from: "P1", to: "P2" }, { from: "P2", to: "P3" }, { from: "P3", to: "P4" }],
  },
  DD_SLD: {
    title: "SLD (Single Line Diagram)",
    icon: "\u26A1", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "S1", label: "Input: Transformer Data", sub: "kVA rating + incoming voltage", type: "input" },
      { id: "S2", label: "Main Bus Selection", sub: "Bus bar rating from total load", type: "process" },
      { id: "S3", label: "Outgoing Feeder Design", sub: "Circuit breaker + cable per feeder", type: "formula" },
      { id: "S4", label: "Protection Coordination", sub: "Relay settings + discrimination", type: "process" },
      { id: "S5", label: "Output: SLD Drawing", sub: "Complete single line diagram", type: "output" },
    ],
    connections: [{ from: "S1", to: "S2" }, { from: "S2", to: "S3" }, { from: "S3", to: "S4" }, { from: "S4", to: "S5" }],
  },
  DD_ERT: {
    title: "Earthing Design",
    icon: "\u26A1", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "E1", label: "Input: Soil Resistivity", sub: "Site survey data (\u03C1 \u03A9\u00B7m)", type: "input" },
      { id: "E2", label: "Earth Electrode Sizing", sub: "IS 3043 pipe/plate electrode calc", type: "formula" },
      { id: "E3", label: "Earth Pit Design", sub: "Depth + backfill + maintenance access", type: "process" },
      { id: "E4", label: "Output: Earthing Layout", sub: "Electrode locations + conductor routing", type: "output" },
    ],
    connections: [{ from: "E1", to: "E2" }, { from: "E2", to: "E3" }, { from: "E3", to: "E4" }],
  },
  DD_LTN: {
    title: "Lightning Protection",
    icon: "\u26A1", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "L1", label: "Input: Building Geometry", sub: "Height + footprint + location", type: "input" },
      { id: "L2", label: "Risk Assessment", sub: "IS/IEC 62305 risk calculation", type: "formula" },
      { id: "L3", label: "Protection Level", sub: "LPL I/II/III/IV selection", type: "decision" },
      { id: "L4", label: "Air Terminal Design", sub: "Rolling sphere / mesh method", type: "process" },
      { id: "L5", label: "Output: LP Layout", sub: "Air terminals + down conductors + earth", type: "output" },
    ],
    connections: [{ from: "L1", to: "L2" }, { from: "L2", to: "L3" }, { from: "L3", to: "L4" }, { from: "L4", to: "L5" }],
  },
  DD_BUS: {
    title: "Bus Bar Sizing",
    icon: "\u26A1", color: "#f59e0b", accentBg: "#fef3c7",
    steps: [
      { id: "B1", label: "Input: Total Load", sub: "Max demand at bus bar section", type: "input" },
      { id: "B2", label: "Current Rating Calc", sub: "I = kVA / (V \u00D7 \u221A3)", type: "formula" },
      { id: "B3", label: "Bus Bar Selection", sub: "Cu/Al size from manufacturer tables", type: "process" },
      { id: "B4", label: "Output: Bus Bar Schedule", sub: "Size + material + rating \u2192 SLD", type: "output" },
    ],
    connections: [{ from: "B1", to: "B2" }, { from: "B2", to: "B3" }, { from: "B3", to: "B4" }],
  },
  DD_PIP: {
    title: "Pipe Sizing (Hot/Cold)",
    icon: "\uD83D\uDCA7", color: "#2563eb", accentBg: "#dbeafe",
    steps: [
      { id: "PS1", label: "Input: Fixture Units", sub: "FU count per floor per riser", type: "input" },
      { id: "PS2", label: "Flow Rate Calc", sub: "Hunter's method \u2192 probable flow", type: "formula" },
      { id: "PS3", label: "Velocity Check", sub: "Target 1.0\u20132.0 m/s per IS 2065", type: "formula" },
      { id: "PS4", label: "Pipe Diameter", sub: "D = \u221A(4Q/\u03C0V) \u2192 standard size", type: "formula" },
      { id: "PS5", label: "Output: Pipe Schedule", sub: "Size per riser + branch \u2192 drawings", type: "output" },
    ],
    connections: [{ from: "PS1", to: "PS2" }, { from: "PS2", to: "PS3" }, { from: "PS3", to: "PS4" }, { from: "PS4", to: "PS5" }],
  },
  DD_SPR: {
    title: "Sprinkler Hydraulic Calc",
    icon: "\uD83D\uDD25", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [
      { id: "SP1", label: "Input: Hazard Classification", sub: "Light/Ordinary/Extra hazard per NBC", type: "input" },
      { id: "SP2", label: "Design Area & Density", sub: "Density (mm/min) \u00D7 Area (m\u00B2)", type: "formula" },
      { id: "SP3", label: "Hydraulic Calculation", sub: "K-factor + pressure at each head", type: "formula" },
      { id: "SP4", label: "Pipe Network Sizing", sub: "Tree/Loop system pipe sizing", type: "process" },
      { id: "SP5", label: "Output: Sprinkler Layout", sub: "Head locations + pipe sizes \u2192 drawings", type: "output" },
    ],
    connections: [{ from: "SP1", to: "SP2" }, { from: "SP2", to: "SP3" }, { from: "SP3", to: "SP4" }, { from: "SP4", to: "SP5" }],
  },
};

// =====================================================================
// CALC DETAIL OVERLAY COMPONENT
// =====================================================================
function CalcDetailOverlay({ calcId, onClose }: { calcId: string; onClose: () => void }) {
  const flow = DD_CALC_FLOWS[calcId];
  if (!flow) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[#64748b] text-sm">Detailed calculation flowchart coming soon for <strong>{calcId}</strong></p>
          <button onClick={onClose} className="mt-4 px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#334155] text-sm font-medium hover:bg-[#e2e8f0]">Close</button>
        </motion.div>
      </motion.div>
    );
  }

  const stepH = 56, stepW = 220, gap = 72;
  const svgH = flow.steps.length * (stepH + gap) + 40;
  const svgW = stepW + 160;
  const cx = svgW / 2;
  const stepColors: Record<string, { bg: string; bd: string }> = {
    input:    { bg: "#dbeafe", bd: "#2563eb" },
    process:  { bg: "#dbeafe", bd: "#2563eb" },
    formula:  { bg: "#ede9fe", bd: "#7c3aed" },
    output:   { bg: "#d1fae5", bd: "#059669" },
    decision: { bg: "#fff7ed", bd: "#ea580c" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: flow.accentBg }}>{flow.icon}</div>
            <div>
              <h3 className="text-[#0f172a] text-base font-bold">{flow.title}</h3>
              <p className="text-[#94a3b8] text-xs">Detailed Design Stage Calculation</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0]">
            <span className="text-lg">&times;</span>
          </button>
        </div>
        <div className="p-6">
          <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMin meet">
            <defs>
              <marker id="dd-ov-a" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            {flow.steps.map((step, i) => {
              const sy = 20 + i * (stepH + gap);
              const sc = stepColors[step.type] || stepColors.process;
              return (
                <g key={step.id}>
                  <rect x={cx - stepW / 2} y={sy} width={stepW} height={stepH} rx={10}
                    fill={sc.bg} stroke={sc.bd} strokeWidth={2} />
                  <text x={cx} y={sy + 22} textAnchor="middle" fill={sc.bd} fontSize={11} fontWeight={700}>{step.label}</text>
                  <text x={cx} y={sy + 40} textAnchor="middle" fill="#475569" fontSize={9} opacity={0.8}>
                    {step.sub.length > 45 ? step.sub.slice(0, 43) + "\u2026" : step.sub}
                  </text>
                  {i < flow.steps.length - 1 && (
                    <line x1={cx} y1={sy + stepH} x2={cx} y2={sy + stepH + gap}
                      stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#dd-ov-a)" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =====================================================================
// MAIN EXPORTED COMPONENT
// =====================================================================
export function DetailedDesignStageChart() {
  const [activeCalc, setActiveCalc] = useState<string | null>(null);
  const handleCalcItemClick = useCallback((calcId: string) => { setActiveCalc(calcId); }, []);

  const { pos, H: svgH, W: svgW } = computeLayout();

  // Connections to skip (handled by tree diagrams)
  const skipConns = new Set<string>();
  // Service tree handles DD_P4 → DD_SVC_* → DD_SVCM
  SVC_IDS.forEach((id) => {
    skipConns.add(`DD_P4->${id}`);
    skipConns.add(`${id}->DD_SVCM`);
  });

  return (
    <>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block" }} preserveAspectRatio="xMidYMin meet" className="stage-chart-svg">
        <defs>
          <marker id="dd-ma" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.arrow} />
          </marker>
          <marker id="dd-mr" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.reject} />
          </marker>
          <marker id="dd-mm" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.merge} />
          </marker>
        </defs>

        {/* Phase background bands */}
        {BAND_DEFS.map((b, i) => {
          const fp = pos[b.firstNode], lp = pos[b.lastNode];
          if (!fp || !lp) return null;
          const fn = NM[b.firstNode], ln = NM[b.lastNode];
          const bTop = fp.y - 14;
          const bBot = lp.y + (ln ? nodeH(ln) : NH) + 14;
          return (
            <g key={i}>
              <rect x={PX - 30} y={bTop} width={svgW - 2 * (PX - 30)} height={bBot - bTop}
                rx={12} fill={`${b.color}08`} stroke={`${b.color}20`} strokeWidth={1.5} strokeDasharray="8,5" />
              <text x={PX - 20} y={bTop + 14} fill={b.color} fontSize={9} fontWeight={700} opacity={0.5} letterSpacing={0.8}>
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Service tree diagram */}
        <DrawServiceTree pos={pos} />

        {/* Connections */}
        {CN.map((c, i) => {
          const key = `${c.from}->${c.to}`;
          if (skipConns.has(key)) return null;
          return <DrawConn key={i} c={c} pos={pos} W={svgW} />;
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          return <DrawNode key={n.id} n={n} x={p.x} y={p.y} onCalcItemClick={handleCalcItemClick} />;
        })}

        {/* Note annotations */}
        {ANNS.map((a) => {
          const pp = pos[a.pid];
          const nn = NM[a.nid];
          if (!pp || !nn) return null;
          const ax = pp.x + a.dx, ay = pp.y + a.dy;
          return (
            <g key={a.nid}>
              <line x1={pp.x + (a.dx > 0 ? NW : 0)} y1={pp.y + NH / 2}
                x2={ax + (a.dx > 0 ? 0 : NW + 16)} y2={ay + (NH - 8) / 2}
                stroke={nn.color} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} />
              <DrawNode n={nn} x={ax} y={ay} />
            </g>
          );
        })}
      </svg>

      {/* Calc Detail Overlay */}
      <AnimatePresence>
        {activeCalc && (
          <CalcDetailOverlay calcId={activeCalc} onClose={() => setActiveCalc(null)} />
        )}
      </AnimatePresence>

      {/* Glow animation style */}
      <style>{`
        @keyframes dd-glow-pulse {
          0%, 100% { opacity: 0.3; stroke-dashoffset: 0; }
          50% { opacity: 0.6; stroke-dashoffset: 6; }
        }
        .calc-glow { animation: dd-glow-pulse 2s ease-in-out infinite; }
      `}</style>
    </>
  );
}
