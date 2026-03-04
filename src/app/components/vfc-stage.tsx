import React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// =====================================================================
// VFC (VALIDATED FOR CONSTRUCTION) STAGE — COMPLETE FLOW CHART
// Structure:
//   Part 1: Deliverables & Drawing List Creation
//   Part 2: Architect Drawing Coordination (float list → receive layouts)
//   Part 3: MEP Design & Stakeholder Approval
//   Part 4: VFC Calculations (updated per contractor selections)
//   Part 5: VFC Drawing Production (as-built quality drawings)
//   Part 6: VFC Drawing Verification Checklist
//   Part 7: Drawing Checklist & VFC Layout Distribution
//   Part 8: Contractor Submission & Approval
//   Part 9: Site Coordination & Change Management
//   Part 10: Final Verification & Handover
// =====================================================================

// ---- Types ----
interface VNode {
  id: string; label: string; sub: string;
  type: "process" | "decision" | "terminal" | "header" | "note" | "service" | "checklist";
  color: string; bg: string; text: string;
  options?: string[]; calcIds?: string[];
}
interface VConn { from: string; to: string; label?: string; style: "normal" | "reject" | "merge" }

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
  arrow: "#94a3b8", reject: "#ef4444", merge: "#3b82f6",
};

const hdr = (id: string, l: string, s: string, c: typeof CL.blue): VNode =>
  ({ id, label: l, sub: s, type: "header", color: c.hd, bg: c.hd, text: "#fff" });
const proc = (id: string, l: string, s: string, c: typeof CL.blue): VNode =>
  ({ id, label: l, sub: s, type: "process", color: c.bd, bg: c.bg, text: c.tx });
const dec = (id: string, l: string, s: string): VNode =>
  ({ id, label: l, sub: s, type: "decision", color: CL.amber.bd, bg: CL.amber.bg, text: CL.amber.tx });
const term = (id: string, l: string, s: string): VNode =>
  ({ id, label: l, sub: s, type: "terminal", color: CL.term.bd, bg: CL.term.bg, text: CL.term.tx });
const nt = (id: string, l: string, s: string, c: typeof CL.blue): VNode =>
  ({ id, label: l, sub: s, type: "note", color: c.bd, bg: c.bg, text: c.tx });
const chk = (id: string, l: string, s: string, c: typeof CL.blue): VNode =>
  ({ id, label: l, sub: s, type: "checklist", color: c.bd, bg: c.bg, text: c.tx });
const svc = (id: string, l: string, s: string, opts: string[], cids: string[], c: typeof CL.blue): VNode =>
  ({ id, label: l, sub: s, type: "service", color: c.bd, bg: c.bg, text: c.tx, options: opts, calcIds: cids });

// =====================================================================
// ALL NODES
// =====================================================================
const NODES: VNode[] = [
  // ── PART 1: DELIVERABLES & DRAWING LIST ──
  hdr("V_INIT", "VFC STAGE", "Validated for Construction", CL.violet),
  proc("V_DEL", "Create Deliverables List", "\uD83D\uDCCB Define all VFC deliverables & milestones", CL.violet),
  proc("V_DRL", "Create Drawing List", "\uD83D\uDCC4 Full list of required VFC drawings", CL.violet),

  // ── PART 2: ARCHITECT DRAWING COORDINATION ──
  hdr("V_P2", "PART 2: Architect Coordination", "Float Drawing List \u2192 Receive Layouts", CL.orange),
  proc("V_ADL", "Create Architect Drawing List", "\uD83D\uDCCB Drawing requirements for Architect", CL.orange),
  proc("V_AFL", "Float to Architect", "\uD83D\uDCE4 Send drawing list to Architect", CL.orange),
  proc("V_ARC", "Receive Layouts from Architect", "\uD83D\uDCE5 Architect returns required layouts", CL.orange),

  // ── PART 3: MEP DESIGN & STAKEHOLDER APPROVAL ──
  hdr("V_P3", "PART 3: MEP Design & Approval", "Design on Layouts \u2192 Stakeholder Sign-off", CL.purple),
  proc("V_MEP", "MEP Design on Layouts", "\uD83D\uDCDD MEP team works on received layouts", CL.purple),
  proc("V_MSA", "Share for Approval", "\uD83D\uDCE4 Share layouts to stakeholders for review", CL.purple),
  dec("V_D1", "Approved by All?", "All stakeholders sign off"),
  proc("V_MREV", "Revise Layouts", "\u270D\uFE0F Update per stakeholder comments", CL.rose),

  // ── PART 4: VFC CALCULATIONS ──
  hdr("V_P4", "PART 4: VFC Calculations", "Updated Calcs per Contractor Selections", CL.purple),
  svc("V_SVC_E", "Electrical VFC", "\u26A1 Updated Calcs",
    ["Cable Schedule Update", "Panel Revision", "SLD Revision", "Earthing Update"],
    [], CL.amber),
  svc("V_SVC_P", "Plumbing VFC", "\uD83D\uDCA7 Updated Calcs",
    ["Pipe Schedule Update", "Pump Reselection", "Drainage Revision", "Valve Schedule"],
    [], CL.blue),
  svc("V_SVC_H", "HVAC VFC", "\u2744\uFE0F Updated Calcs",
    ["Duct Revision", "Equipment Confirmation", "Controls Update", "Diffuser Schedule"],
    [], CL.purple),
  svc("V_SVC_F", "Firefighting VFC", "\uD83D\uDD25 Updated Calcs",
    ["Sprinkler Revision", "Hydrant Update", "Detection Layout", "Pump Reselection"],
    [], CL.rose),
  hdr("V_SVCM", "All VFC Calcs Complete", "Updated results \u2192 VFC Drawing Production", CL.purple),

  // ── PART 5: VFC DRAWING PRODUCTION ──
  hdr("V_P5", "PART 5: VFC Drawing Production", "Construction-Quality Floor-wise Drawings", CL.cyan),
  proc("V_ELD", "Electrical VFC Drawings", "\u26A1 Updated SLD + panel + cable routing", CL.amber),
  proc("V_PLD", "Plumbing VFC Drawings", "\uD83D\uDCA7 Updated riser + drainage + piping", CL.blue),
  proc("V_HVD", "HVAC VFC Drawings", "\u2744\uFE0F Updated duct + equipment layout", CL.purple),
  proc("V_FFD", "Firefighting VFC Drawings", "\uD83D\uDD25 Updated sprinkler + hydrant layout", CL.rose),
  proc("V_PRM", "Plantroom VFC Layouts", "\uD83C\uDFED Updated pump room, STP, substation", CL.orange),
  proc("V_CRD", "Coordination Sections", "\uD83D\uDCC4 Combined MEP coordination drawings", CL.cyan),
  hdr("V_DWM", "All VFC Drawings Compiled", "Drawing register \u2192 Verification", CL.cyan),

  // ── PART 6: VFC DRAWING VERIFICATION CHECKLIST ──
  hdr("V_P6", "PART 6: Drawing Verification", "Verify All VFC Drawings Before Release", CL.teal),
  chk("V_CK1", "VFC Drawing Checklist", "\u2611 Verify all VFC drawings match contractor data", CL.teal),
  dec("V_D2", "All Drawings Complete?", "Completeness check"),
  proc("V_REQ2", "Flag Missing Drawings", "\uD83D\uDCE8 Address gaps \u2192 loop back", CL.rose),

  // ── PART 7: Drawing Checklist & VFC Layout Distribution
  hdr("V_P7", "PART 7: Drawing Checklist & Distribution", "Share Layouts \u2192 Approval \u2192 VFC Distribution", CL.green),
  proc("V_STA", "Share for Stakeholder Approval", "\uD83D\uDCE4 Share VFC layouts to all stakeholders", CL.green),
  dec("V_D3", "Approved by All?", "All stakeholders sign off"),
  proc("V_RWK", "Revise Layouts", "\u270D\uFE0F Update per stakeholder comments", CL.rose),
  chk("V_DCK", "VFC Drawing Checklist", "\u2611 Final drawing checklist before distribution", CL.teal),
  proc("V_SHL", "Share VFC to Stakeholders", "\uD83D\uDCE4 Distribute approved VFC layouts", CL.green),
  proc("V_SHS", "Share VFC to Site Team", "\uD83C\uDFD7\uFE0F Send VFC layouts for site execution", CL.green),

  // ── PART 8: CONTRACTOR SUBMISSION & APPROVAL ──
  hdr("V_P8", "PART 8: Contractor Submission", "Share VFC \u2192 Contractor Review \u2192 Approval", CL.blue),
  chk("V_CK2", "VFC Release Checklist", "\u2611 Verify all before issuing to contractor", CL.teal),
  proc("V_ISS", "Issue VFC to Contractor", "\uD83D\uDCE4 Release VFC drawings for construction", CL.blue),
  proc("V_CRV", "Contractor Reviews", "\uD83D\uDD0D Contractor reviews for constructability", CL.blue),
  dec("V_D4", "Accepted?", "Contractor acceptance"),
  proc("V_REV", "Revise per Feedback", "\u270D\uFE0F Update based on site constraints", CL.rose),

  // ── PART 9: SITE COORDINATION ──
  hdr("V_P9", "PART 9: Site Coordination", "Installation Support & Change Management", CL.amber),
  proc("V_SIT", "Site Installation Support", "\uD83C\uDFD7\uFE0F MEP provides on-site technical support", CL.amber),
  proc("V_CHG", "Change Order Management", "\uD83D\uDCDD Track scope changes + cost impact", CL.amber),
  proc("V_INS", "Inspection & Testing", "\uD83D\uDD0D Progressive inspection of installations", CL.amber),
  proc("V_SNL", "Snag List Management", "\uD83D\uDCCB Deficiency tracking + resolution", CL.amber),
  dec("V_D5", "All Snags Resolved?", "Snag clearance check"),
  proc("V_FIX", "Fix Outstanding Snags", "\uD83D\uDD27 Contractor resolves pending snags", CL.rose),

  // ── PART 10: FINAL VERIFICATION & HANDOVER ──
  hdr("V_P10", "PART 10: Final Verification", "Final Checklist \u2192 O&M Manuals \u2192 Handover", CL.green),
  chk("V_CK3", "Final VFC Checklist", "\u2611 All drawings, as-builts & test reports verified", CL.teal),
  proc("V_ASB", "As-Built Drawings", "\uD83D\uDDFA Final as-built drawings from contractor", CL.green),
  proc("V_OAM", "O&M Manuals", "\uD83D\uDCDA Operation & Maintenance manuals compiled", CL.green),
  proc("V_REG", "Document Register", "\uD83D\uDDC2 Complete handover document set", CL.green),
  dec("V_D6", "All Complete?", "Final gate check"),
  proc("V_HOLD", "Stage On Hold", "\u23F8 Pending items \u2192 loop back", CL.rose),

  // ── COMPLETE ──
  term("V_DONE", "VFC STAGE COMPLETE", "Project Handover to Operations"),
];

const NM: Record<string, VNode> = {};
NODES.forEach((n) => { NM[n.id] = n; });

// =====================================================================
// CONNECTIONS
// =====================================================================
const CN: VConn[] = [
  // Part 1
  { from: "V_INIT", to: "V_DEL", style: "normal" },
  { from: "V_DEL", to: "V_DRL", style: "normal" },
  { from: "V_DRL", to: "V_P2", style: "normal" },

  // Part 2
  { from: "V_P2", to: "V_ADL", style: "normal" },
  { from: "V_ADL", to: "V_AFL", style: "normal" },
  { from: "V_AFL", to: "V_ARC", style: "normal" },
  { from: "V_ARC", to: "V_P3", style: "normal" },

  // Part 3: MEP Design & Stakeholder Approval
  { from: "V_P3", to: "V_MEP", style: "normal" },
  { from: "V_MEP", to: "V_MSA", style: "normal" },
  { from: "V_MSA", to: "V_D1", style: "normal" },
  { from: "V_D1", to: "V_P4", label: "Yes \u2013 Approved", style: "normal" },
  { from: "V_D1", to: "V_MREV", label: "No \u2013 Revise", style: "reject" },
  { from: "V_MREV", to: "V_MEP", label: "Rework", style: "reject" },

  // Part 4: VFC Calcs — service tree handles V_P4 → V_SVC_* → V_SVCM
  { from: "V_SVCM", to: "V_P5", style: "normal" },

  // Part 5: Drawing Production (parallel)
  { from: "V_P5", to: "V_ELD", style: "normal" },
  { from: "V_P5", to: "V_PLD", style: "normal" },
  { from: "V_P5", to: "V_HVD", style: "normal" },
  { from: "V_P5", to: "V_FFD", style: "normal" },
  { from: "V_P5", to: "V_PRM", style: "normal" },
  { from: "V_ELD", to: "V_CRD", style: "normal" },
  { from: "V_PLD", to: "V_CRD", style: "normal" },
  { from: "V_HVD", to: "V_CRD", style: "normal" },
  { from: "V_FFD", to: "V_CRD", style: "normal" },
  { from: "V_PRM", to: "V_CRD", style: "normal" },
  { from: "V_CRD", to: "V_DWM", style: "normal" },

  // Part 6
  { from: "V_DWM", to: "V_P6", style: "normal" },
  { from: "V_P6", to: "V_CK1", style: "normal" },
  { from: "V_CK1", to: "V_D2", style: "normal" },
  { from: "V_D2", to: "V_P7", label: "Yes", style: "normal" },
  { from: "V_D2", to: "V_REQ2", label: "No \u2013 Missing", style: "reject" },
  { from: "V_REQ2", to: "V_CK1", label: "Re-verify", style: "reject" },

  // Part 7: parallel PR & PLK
  { from: "V_P7", to: "V_STA", style: "normal" },
  { from: "V_STA", to: "V_D3", style: "normal" },
  { from: "V_D3", to: "V_DCK", label: "Yes \u2013 Approved", style: "normal" },
  { from: "V_D3", to: "V_RWK", label: "No \u2013 Revise", style: "reject" },
  { from: "V_RWK", to: "V_STA", label: "Resubmit", style: "reject" },
  { from: "V_DCK", to: "V_SHL", style: "normal" },
  { from: "V_SHL", to: "V_SHS", style: "normal" },
  { from: "V_SHS", to: "V_P8", style: "normal" },

  // Part 8
  { from: "V_P8", to: "V_CK2", style: "normal" },
  { from: "V_CK2", to: "V_ISS", style: "normal" },
  { from: "V_ISS", to: "V_CRV", style: "normal" },
  { from: "V_CRV", to: "V_D4", style: "normal" },
  { from: "V_D4", to: "V_P9", label: "Yes \u2013 Accepted", style: "normal" },
  { from: "V_D4", to: "V_REV", label: "No \u2013 Revise", style: "reject" },
  { from: "V_REV", to: "V_CRD", label: "Update drawings", style: "reject" },

  // Part 9
  { from: "V_P9", to: "V_SIT", style: "normal" },
  { from: "V_SIT", to: "V_CHG", style: "normal" },
  { from: "V_CHG", to: "V_INS", style: "normal" },
  { from: "V_INS", to: "V_SNL", style: "normal" },
  { from: "V_SNL", to: "V_D5", style: "normal" },
  { from: "V_D5", to: "V_P10", label: "Yes \u2013 Clear", style: "normal" },
  { from: "V_D5", to: "V_FIX", label: "No \u2013 Pending", style: "reject" },
  { from: "V_FIX", to: "V_SNL", label: "Re-inspect", style: "reject" },

  // Part 10
  { from: "V_P10", to: "V_CK3", style: "normal" },
  { from: "V_CK3", to: "V_ASB", style: "normal" },
  { from: "V_ASB", to: "V_OAM", style: "normal" },
  { from: "V_OAM", to: "V_REG", style: "normal" },
  { from: "V_REG", to: "V_D6", style: "normal" },
  { from: "V_D6", to: "V_DONE", label: "Yes \u2013 Complete", style: "normal" },
  { from: "V_D6", to: "V_HOLD", label: "No \u2013 Pending", style: "reject" },
  { from: "V_HOLD", to: "V_CK3", label: "Re-check", style: "reject" },
];

// =====================================================================
// GRID LAYOUT
// =====================================================================
const GRID: string[][] = [
  ["V_INIT"],                                              // 0
  ["V_DEL"],                                               // 1
  ["V_DRL"],                                               // 2

  ["V_P2"],                                                // 3
  ["V_ADL", "V_AFL"],                                       // 4
  ["V_ARC"],                                               // 5

  ["V_P3"],                                                // 6
  ["V_MEP"],                                               // 7
  ["V_MSA"],                                               // 8
  ["V_D1", "V_MREV"],                                        // 9

  ["V_P4"],                                                // 10
  ["V_SVC_E", "V_SVC_P", "V_SVC_H", "V_SVC_F"],           // 12 ← service cards
  ["V_SVCM"],                                              // 13

  ["V_P5"],                                                // 14
  ["V_ELD", "V_PLD", "V_HVD", "V_FFD", "V_PRM"],          // 15 ← parallel drawings
  ["V_CRD"],                                               // 16
  ["V_DWM"],                                               // 17

  ["V_P6"],                                                // 18
  ["V_CK1"],                                               // 19
  ["V_D2", "V_REQ2"],                                      // 20

  ["V_P7"],                                                // 21
  ["V_STA"],                                                // 22
  ["V_D3", "V_RWK"],                                       // 23
  ["V_DCK", "V_SHL", "V_SHS"],                            // 24

  ["V_P8"],                                                // 25
  ["V_CK2"],                                               // 26
  ["V_ISS"],                                               // 27
  ["V_CRV"],                                               // 28
  ["V_D4", "V_REV"],                                       // 29

  ["V_P9"],                                                // 30
  ["V_SIT", "V_CHG"],                                      // 31
  ["V_INS", "V_SNL"],                                      // 32
  ["V_D5", "V_FIX"],                                       // 33

  ["V_P10"],                                               // 34
  ["V_CK3"],                                               // 35
  ["V_ASB", "V_OAM"],                                      // 36
  ["V_REG"],                                               // 37
  ["V_D6", "V_HOLD"],                                      // 38
  ["V_DONE"],                                              // 39
];

const SERVICE_ROW_INDICES = new Set([11]);
const SVC_ROW_GAP = 230;
const SVC_IDS = ["V_SVC_E", "V_SVC_P", "V_SVC_H", "V_SVC_F"];
const SVC_LABELS: Record<string, string> = { V_SVC_E: "Electrical", V_SVC_P: "Plumbing", V_SVC_H: "HVAC", V_SVC_F: "Firefighting" };

const NW = 210, NH = 58, SVC_NH = 195, RGAP = 96, CGAP = 40, PX = 120, PY = 36;

const NODE_ROW: Record<string, number> = {};
GRID.forEach((row, ri) => { row.forEach((id) => { NODE_ROW[id] = ri; }); });

function nodeH(n: VNode): number {
  if (n.type === "service") return SVC_NH;
  if (n.type === "decision") return NH + 16;
  return NH;
}

function computeLayout() {
  const pos: Record<string, { x: number; y: number }> = {};
  const maxC = Math.max(...GRID.map((r) => r.length));
  const maxW = maxC * NW + (maxC - 1) * CGAP;
  let y = PY;
  for (let ri = 0; ri < GRID.length; ri++) {
    const row = GRID[ri];
    const rw = row.length * NW + (row.length - 1) * CGAP;
    const sx = PX + (maxW - rw) / 2;
    row.forEach((id, i) => { pos[id] = { x: sx + i * (NW + CGAP), y }; });
    y += SERVICE_ROW_INDICES.has(ri) ? SVC_ROW_GAP : RGAP;
  }
  return { pos, H: y + 60, W: maxW + PX * 2 };
}

// =====================================================================
// SVG NODE RENDERER
// =====================================================================
function DrawNode({ n, x, y }: { n: VNode; x: number; y: number }) {
  const cx = x + NW / 2, cy = y + NH / 2;

  if (n.type === "decision") {
    const rx = NW / 2 + 10, ry = NH / 2 + 8;
    return (<g><polygon points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`} fill={n.bg} stroke={n.color} strokeWidth={2} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.8}>{n.sub}</text></g>);
  }
  if (n.type === "terminal") {
    return (<g><rect x={x} y={y} width={NW} height={NH} rx={NH / 2} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={11} fontWeight={700}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.9}>{n.sub}</text></g>);
  }
  if (n.type === "header") {
    return (<g><rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={10.5} fontWeight={700}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize={8.5} opacity={0.85}>{n.sub.length > 38 ? n.sub.slice(0, 36) + "\u2026" : n.sub}</text></g>);
  }
  if (n.type === "note") {
    const w = NW + 16, h = NH - 8;
    return (<g opacity={0.88}><rect x={x} y={y} width={w} height={h} rx={6} fill={n.bg} stroke={n.color} strokeWidth={1} strokeDasharray="4,3" />
      <text x={x + w / 2} y={y + h / 2 - 5} textAnchor="middle" fill={n.text} fontSize={8.5} fontWeight={600}>{n.label}</text>
      <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fill={n.text} fontSize={7.5} opacity={0.75}>{n.sub.length > 58 ? n.sub.slice(0, 56) + "\u2026" : n.sub}</text></g>);
  }
  if (n.type === "checklist") {
    return (<g><rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={2} strokeDasharray="6,3" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>{n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}</text></g>);
  }
  if (n.type === "service") {
    const opts = n.options || [];
    const h = SVC_NH; const headerH = 36; const pillH = 18; const pillGap = 4;
    return (<g>
      <rect x={x} y={y} width={NW} height={h} rx={10} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
      <rect x={x} y={y} width={NW} height={headerH} rx={10} fill={n.color} />
      <rect x={x} y={y + headerH - 6} width={NW} height={6} fill={n.color} />
      <text x={cx} y={y + 15} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>{n.label}</text>
      <text x={cx} y={y + 28} textAnchor="middle" fill="#fff" fontSize={8} opacity={0.85}>{n.sub}</text>
      {opts.map((opt, i) => {
        const py = y + headerH + 8 + i * (pillH + pillGap); const pillW = NW - 14; const px = x + 7;
        return (<g key={i}><rect x={px} y={py} width={pillW} height={pillH} rx={5} fill="#fff" stroke={n.color} strokeWidth={1.2} />
          <text x={px + 8} y={py + pillH / 2 + 3.5} fill={n.text} fontSize={9} fontWeight={600}>{opt}</text></g>);
      })}
      <rect x={x - 2} y={y - 2} width={NW + 4} height={h + 4} rx={12} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3} className="v-calc-glow" strokeDasharray="4,2" />
    </g>);
  }
  return (<g><rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={1.5} />
    <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
    <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>{n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}</text></g>);
}

// =====================================================================
// SERVICE TREE DIAGRAM
// =====================================================================
function DrawServiceTree({ pos }: { pos: Record<string, { x: number; y: number }> }) {
  const p3 = pos["V_P4"], svcm = pos["V_SVCM"];
  if (!p3 || !svcm) return null;
  const svcPos = SVC_IDS.map((id) => ({ id, label: SVC_LABELS[id], cx: pos[id].x + NW / 2, top: pos[id].y, bot: pos[id].y + SVC_NH }));
  const p3Bot = p3.y + NH, p3Cx = p3.x + NW / 2, svcmTop = svcm.y, svcmCx = svcm.x + NW / 2;
  const svcTop = svcPos[0].top, svcBot = svcPos[0].bot;
  const fanOutY = p3Bot + (svcTop - p3Bot) / 2, fanInY = svcBot + (svcmTop - svcBot) / 2;
  const leftCx = svcPos[0].cx, rightCx = svcPos[svcPos.length - 1].cx;
  const c = CL.arrow;
  return (<g>
    <line x1={p3Cx} y1={p3Bot} x2={p3Cx} y2={fanOutY} stroke={c} strokeWidth={1.6} />
    <line x1={leftCx} y1={fanOutY} x2={rightCx} y2={fanOutY} stroke={c} strokeWidth={1.6} />
    {svcPos.map((s) => <line key={`fo-${s.id}`} x1={s.cx} y1={fanOutY} x2={s.cx} y2={s.top} stroke={c} strokeWidth={1.6} markerEnd="url(#v-ma)" />)}
    {svcPos.map((s) => { const tw = s.label.length * 5.5 + 8; return (<g key={`fl-${s.id}`}><rect x={s.cx - tw / 2} y={fanOutY - 15} width={tw} height={13} rx={3} fill="#fff" opacity={0.92} /><text x={s.cx} y={fanOutY - 5} textAnchor="middle" fill="#475569" fontSize={8} fontWeight={600}>{s.label}</text></g>); })}
    {svcPos.map((s) => <line key={`fi-${s.id}`} x1={s.cx} y1={s.bot} x2={s.cx} y2={fanInY} stroke={c} strokeWidth={1.6} />)}
    <line x1={leftCx} y1={fanInY} x2={rightCx} y2={fanInY} stroke={c} strokeWidth={1.6} />
    <line x1={svcmCx} y1={fanInY} x2={svcmCx} y2={svcmTop} stroke={c} strokeWidth={1.6} markerEnd="url(#v-ma)" />
  </g>);
}

// =====================================================================
// SVG CONNECTION RENDERER
// =====================================================================
function DrawConn({ c, pos, W }: { c: VConn; pos: Record<string, { x: number; y: number }>; W: number }) {
  const fp = pos[c.from], tp = pos[c.to];
  if (!fp || !tp) return null;
  const fn = NM[c.from], tn = NM[c.to];
  if (!fn || !tn) return null;
  const color = c.style === "reject" ? CL.reject : c.style === "merge" ? CL.merge : CL.arrow;
  const dash = c.style === "reject" ? "6,4" : c.style === "merge" ? "8,4" : "none";
  const mk = c.style === "reject" ? "v-mr" : c.style === "merge" ? "v-mm" : "v-ma";
  const fcx = fp.x + NW / 2, tcx = tp.x + NW / 2;
  const fnHt = nodeH(fn), tnHt = nodeH(tn);
  const y1 = fn.type === "decision" ? fp.y + NH / 2 + NH / 2 + 8 : fp.y + fnHt;
  const y2 = tn.type === "decision" ? tp.y + (NH + 16) / 2 - NH / 2 - 8 : tp.y;
  const fcy = fp.y + fnHt / 2, tcy = tp.y + tnHt / 2, dy = tp.y - fp.y;
  const fromRow = NODE_ROW[c.from] ?? -1, toRow = NODE_ROW[c.to] ?? -1;
  const rowDiff = toRow - fromRow, hDiff = Math.abs(tcx - fcx);

  const renderPath = (d: string, lx: number, ly: number, la?: string) => (<g>
    <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray={dash} markerEnd={`url(#${mk})`} />
    {c.label && (<g><rect x={lx - (c.label.length * 3.2)} y={ly - 9} width={c.label.length * 6.4} height={13} rx={3} fill="#fff" opacity={0.92} />
      <text x={lx} y={ly} fill={color === CL.arrow ? "#475569" : color} fontSize={8} fontWeight={600} textAnchor={la || "middle"}>{c.label}</text></g>)}
  </g>);

  if (dy < -20 && c.style === "reject") {
    const rX = Math.min(W - 20, Math.max(fp.x + NW, tp.x + NW) + 40);
    return renderPath(`M${fp.x + NW},${fcy} L${rX},${fcy} L${rX},${tcy} L${tp.x + NW},${tcy}`, rX + 4, (fcy + tcy) / 2, "start");
  }
  if (Math.abs(dy) <= 20) {
    const ltr = tcx > fcx; const x1h = ltr ? fp.x + NW : fp.x; const x2h = ltr ? tp.x : tp.x + NW;
    return renderPath(`M${x1h},${fcy} L${x2h},${tcy}`, (x1h + x2h) / 2, fcy - 10);
  }
  if (c.style === "reject" && hDiff < 5 && dy > RGAP * 1.5) {
    const rX = Math.min(W - 20, fp.x + NW + 40);
    return renderPath(`M${fp.x + NW},${fcy} L${rX},${fcy} L${rX},${tcy} L${tp.x + NW},${tcy}`, rX + 4, (fcy + tcy) / 2, "start");
  }
  if (hDiff < 5 && rowDiff === 1) return renderPath(`M${fcx},${y1} L${tcx},${y2}`, fcx + 14, (y1 + y2) / 2);

  const needsGutter = (() => {
    if (rowDiff <= 1) return false;
    for (let ri = fromRow + 1; ri < toRow; ri++) for (const nid of GRID[ri]) {
      const np = pos[nid]; if (!np) continue;
      if (Math.max(fcx, tcx) > np.x - 15 && Math.min(fcx, tcx) < np.x + NW + 15) return true;
    }
    return false;
  })();

  if (needsGutter) {
    let bL = Infinity, bR = -Infinity;
    for (let ri = fromRow + 1; ri < toRow; ri++) for (const nid of GRID[ri]) { const np = pos[nid]; if (!np) continue; bL = Math.min(bL, np.x); bR = Math.max(bR, np.x + NW); }
    const lG = bL - 22, rG = bR + 22;
    const useL = (Math.abs(fcx - lG) + Math.abs(tcx - lG)) <= (Math.abs(fcx - rG) + Math.abs(tcx - rG));
    const gX = useL ? lG : rG, eX = useL ? fp.x : fp.x + NW, nX = useL ? tp.x : tp.x + NW;
    return renderPath(`M${eX},${fcy} L${gX},${fcy} L${gX},${tcy} L${nX},${tcy}`, gX + (useL ? -4 : 4), (fcy + tcy) / 2, useL ? "end" : "start");
  }
  if (hDiff < 5) return renderPath(`M${fcx},${y1} L${tcx},${y2}`, fcx + 14, (y1 + y2) / 2);
  const gapY = y1 + (y2 - y1) / 2;
  return renderPath(`M${fcx},${y1} L${fcx},${gapY} L${tcx},${gapY} L${tcx},${y2}`, (fcx + tcx) / 2, gapY - 10);
}

// =====================================================================
// PHASE BANDS
// =====================================================================
interface BandDef { label: string; firstNode: string; lastNode: string; color: string }
const BAND_DEFS: BandDef[] = [
  { label: "PART 1: DELIVERABLES & DRAWING LIST", firstNode: "V_INIT", lastNode: "V_DRL", color: CL.violet.bd },
  { label: "PART 2: ARCHITECT DRAWING COORDINATION", firstNode: "V_P2", lastNode: "V_ARC", color: CL.orange.bd },
  { label: "PART 3: MEP DESIGN \u2014 Design & Approval", firstNode: "V_P3", lastNode: "V_MREV", color: CL.purple.bd },
  { label: "PART 4: VFC CALCULATIONS \u2014 Updated per Contractor", firstNode: "V_P4", lastNode: "V_SVCM", color: CL.purple.bd },
  { label: "PART 5: VFC DRAWING PRODUCTION \u2014 Construction Drawings", firstNode: "V_P5", lastNode: "V_DWM", color: CL.cyan.bd },
  { label: "PART 6: VFC DRAWING VERIFICATION CHECKLIST", firstNode: "V_P6", lastNode: "V_REQ2", color: CL.teal.bd },
  { label: "PART 7: DRAWING CHECKLIST & VFC LAYOUT DISTRIBUTION", firstNode: "V_P7", lastNode: "V_SHS", color: CL.green.bd },
  { label: "PART 8: CONTRACTOR SUBMISSION & APPROVAL", firstNode: "V_P8", lastNode: "V_REV", color: CL.blue.bd },
  { label: "PART 9: SITE COORDINATION & CHANGE MANAGEMENT", firstNode: "V_P9", lastNode: "V_FIX", color: CL.amber.bd },
  { label: "PART 10: FINAL VERIFICATION & HANDOVER", firstNode: "V_P10", lastNode: "V_DONE", color: CL.green.bd },
];

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function VFCStageChart() {
  const { pos, H: svgH, W: svgW } = computeLayout();
  const skipConns = new Set<string>();
  SVC_IDS.forEach((id) => { skipConns.add(`V_P4->${id}`); skipConns.add(`${id}->V_SVCM`); });

  return (
    <>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet" className="stage-chart-svg">
        <defs>
          <marker id="v-ma" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.arrow} /></marker>
          <marker id="v-mr" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.reject} /></marker>
          <marker id="v-mm" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.merge} /></marker>
        </defs>
        {BAND_DEFS.map((b, i) => {
          const fp = pos[b.firstNode], lp = pos[b.lastNode]; if (!fp || !lp) return null;
          const ln = NM[b.lastNode]; const bTop = fp.y - 14; const bBot = lp.y + (ln ? nodeH(ln) : NH) + 14;
          return (<g key={i}><rect x={PX - 30} y={bTop} width={svgW - 2 * (PX - 30)} height={bBot - bTop} rx={12} fill={`${b.color}08`} stroke={`${b.color}20`} strokeWidth={1.5} strokeDasharray="8,5" />
            <text x={PX - 20} y={bTop + 14} fill={b.color} fontSize={9} fontWeight={700} opacity={0.5} letterSpacing={0.8}>{b.label}</text></g>);
        })}
        <DrawServiceTree pos={pos} />
        {CN.map((c, i) => { if (skipConns.has(`${c.from}->${c.to}`)) return null; return <DrawConn key={i} c={c} pos={pos} W={svgW} />; })}
        {NODES.map((n) => { const p = pos[n.id]; if (!p) return null; return <DrawNode key={n.id} n={n} x={p.x} y={p.y} />; })}
      </svg>
      <style>{`@keyframes v-glow-pulse { 0%, 100% { opacity: 0.3; stroke-dashoffset: 0; } 50% { opacity: 0.6; stroke-dashoffset: 6; } } .v-calc-glow { animation: v-glow-pulse 2s ease-in-out infinite; }`}</style>
    </>
  );
}