import React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// =====================================================================
// TENDER STAGE — COMPLETE FLOW CHART
// Structure:
//   Part 1: Initiation (receive DD deliverables)
//   Part 2: BOQ Preparation (service-wise)
//   Part 3: Tender Package (Tech Specs + Approved Makes from DB, Schematics + Layouts user-selected)
//   Part 4: Tender Document Checklist (verify all 5 components)
//   Part 5: Float to DCO → Stage Complete
// =====================================================================

// ---- Types ----
interface TNode {
  id: string; label: string; sub: string;
  type: "process" | "decision" | "terminal" | "header" | "note" | "service" | "checklist";
  color: string; bg: string; text: string;
  options?: string[]; calcIds?: string[];
}
interface TConn { from: string; to: string; label?: string; style: "normal" | "reject" | "merge" }

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

const hdr = (id: string, l: string, s: string, c: typeof CL.blue): TNode =>
  ({ id, label: l, sub: s, type: "header", color: c.hd, bg: c.hd, text: "#fff" });
const proc = (id: string, l: string, s: string, c: typeof CL.blue): TNode =>
  ({ id, label: l, sub: s, type: "process", color: c.bd, bg: c.bg, text: c.tx });
const dec = (id: string, l: string, s: string): TNode =>
  ({ id, label: l, sub: s, type: "decision", color: CL.amber.bd, bg: CL.amber.bg, text: CL.amber.tx });
const term = (id: string, l: string, s: string): TNode =>
  ({ id, label: l, sub: s, type: "terminal", color: CL.term.bd, bg: CL.term.bg, text: CL.term.tx });
const nt = (id: string, l: string, s: string, c: typeof CL.blue): TNode =>
  ({ id, label: l, sub: s, type: "note", color: c.bd, bg: c.bg, text: c.tx });
const chk = (id: string, l: string, s: string, c: typeof CL.blue): TNode =>
  ({ id, label: l, sub: s, type: "checklist", color: c.bd, bg: c.bg, text: c.tx });
const svc = (id: string, l: string, s: string, opts: string[], cids: string[], c: typeof CL.blue): TNode =>
  ({ id, label: l, sub: s, type: "service", color: c.bd, bg: c.bg, text: c.tx, options: opts, calcIds: cids });

// =====================================================================
// ALL NODES
// =====================================================================
const NODES: TNode[] = [
  // ── PART 1: INITIATION ──
  hdr("T_INIT", "TENDER STAGE", "Receive Detailed Design Deliverables", CL.teal),
  proc("T_HO", "Project Handover", "\uD83D\uDCC1 Receive DD Package + Approved Drawings", CL.teal),
  proc("T_KO", "Tender Kickoff", "\uD83D\uDCC5 MEP + PMC + Client Alignment on scope", CL.teal),
  proc("T_SC", "Tender Strategy", "\uD83D\uDCCB Open / Limited / Negotiated tender type", CL.teal),

  // ── PART 2: BOQ PREPARATION ──
  hdr("T_P2", "PART 2: BOQ Preparation", "Service-wise Bill of Quantities", CL.orange),
  svc("T_BOQ_E", "Electrical BOQ", "\u26A1 Quantities",
    ["Cable Schedule", "Panel & DB BOQ", "Earthing & LP BOQ", "Switchgear BOQ", "Lighting BOQ"],
    [], CL.amber),
  svc("T_BOQ_P", "Plumbing BOQ", "\uD83D\uDCA7 Quantities",
    ["Pipe & Fitting BOQ", "Pump Schedule", "Sanitary Fixture", "Tank & Vessel BOQ", "Valve Schedule"],
    [], CL.blue),
  svc("T_BOQ_H", "HVAC BOQ", "\u2744\uFE0F Quantities",
    ["Duct & Insulation", "Equipment Schedule", "Diffuser & Grille", "Controls & BMS", "Refrigerant Piping"],
    [], CL.purple),
  svc("T_BOQ_F", "Firefighting BOQ", "\uD83D\uDD25 Quantities",
    ["Sprinkler System", "Hydrant System", "Detection & Alarm", "Suppression System", "Fire Pump Schedule"],
    [], CL.rose),
  hdr("T_BOQM", "All BOQs Complete", "Service-wise quantities merged", CL.orange),

  // ── PART 3: TENDER PACKAGE CREATION ──
  hdr("T_P3", "PART 3: Tender Package", "Compile Tender Package from BOQ + DB + Drawings", CL.purple),
  proc("T_TSD", "Fetch Technical Specs", "\uD83E\uDD16 Auto-fetch from DB per service of BOQ", CL.purple),
  proc("T_TAM", "Fetch Approved Makes", "\uD83E\uDD16 Auto-fetch from DB per service of BOQ", CL.purple),
  nt("T_N1", "\uD83D\uDDC3 DB Source", "Tech Specs & Approved Makes auto-fetched based on BOQ service type", CL.purple),
  proc("T_SCH_SEL", "Select Schematic Diagrams", "\u2611 User selects drawings from checkbox list", CL.cyan),
  proc("T_LAY_SEL", "Select Layouts", "\u2611 User selects layout drawings from checkbox list", CL.cyan),
  nt("T_N2", "\uD83D\uDCCB User Selection", "Checkbox list of available schematics & layouts for tender inclusion", CL.cyan),
  proc("T_PKG", "Assemble Tender Package", "\uD83D\uDCE6 Schematics + Tech Specs + Approved Makes + Layouts + BOQ", CL.green),

  // ── PART 4: TENDER DOCUMENT CHECKLIST ──
  hdr("T_P4", "PART 4: Tender Checklist", "Verify Tender Package Before Float", CL.teal),
  chk("T_CK1", "Tender Document Checklist", "\u2611 Verify all 5 components: Schematics, Specs, Makes, Layouts, BOQ", CL.teal),
  dec("T_D1", "Checklist Approved?", "All items verified & complete"),
  proc("T_REQ1", "Fix Missing Items", "\uD83D\uDCE8 Address gaps \u2192 loop back to package", CL.rose),

  // ── PART 5: FLOAT TO DCO ──
  hdr("T_P5", "PART 5: Float to DCO", "Send Tender Package for Attachment", CL.green),
  proc("T_FLT", "Float Tender Package", "\uD83D\uDCE4 Send approved package to DCO", CL.green),
  proc("T_DCO", "DCO Attachment", "\uD83D\uDCCE DCO attaches tender package for issue", CL.green),

  // ── COMPLETE ──
  term("T_DONE", "TENDER STAGE COMPLETE", "Proceed to VFC Stage"),
];

const NM: Record<string, TNode> = {};
NODES.forEach((n) => { NM[n.id] = n; });

// =====================================================================
// CONNECTIONS
// =====================================================================
const CN: TConn[] = [
  // Part 1
  { from: "T_INIT", to: "T_HO", style: "normal" },
  { from: "T_HO", to: "T_KO", style: "normal" },
  { from: "T_KO", to: "T_SC", style: "normal" },
  { from: "T_SC", to: "T_P2", style: "normal" },

  // Part 2: BOQ — service tree handles T_P2 → T_BOQ_* → T_BOQM

  { from: "T_BOQM", to: "T_P3", style: "normal" },

  // Part 3: Tender Package — parallel: DB-fetched + user-selected
  { from: "T_P3", to: "T_TSD", style: "normal" },
  { from: "T_P3", to: "T_SCH_SEL", style: "normal" },
  { from: "T_TSD", to: "T_TAM", style: "normal" },
  { from: "T_SCH_SEL", to: "T_LAY_SEL", style: "normal" },
  { from: "T_TAM", to: "T_PKG", style: "normal" },
  { from: "T_LAY_SEL", to: "T_PKG", style: "normal" },
  { from: "T_PKG", to: "T_P4", style: "normal" },

  // Part 4
  { from: "T_P4", to: "T_CK1", style: "normal" },
  { from: "T_CK1", to: "T_D1", style: "normal" },
  { from: "T_D1", to: "T_P5", label: "Yes", style: "normal" },
  { from: "T_D1", to: "T_REQ1", label: "No \u2013 Missing", style: "reject" },
  { from: "T_REQ1", to: "T_CK1", label: "Re-verify", style: "reject" },

  // Part 5
  { from: "T_P5", to: "T_FLT", style: "normal" },
  { from: "T_FLT", to: "T_DCO", style: "normal" },
  { from: "T_DCO", to: "T_DONE", style: "normal" },
];

// =====================================================================
// GRID LAYOUT
// =====================================================================
const GRID: string[][] = [
  ["T_INIT"],                                              // 0
  ["T_HO"],                                                // 1
  ["T_KO", "T_SC"],                                        // 2

  ["T_P2"],                                                // 3
  ["T_BOQ_E", "T_BOQ_P", "T_BOQ_H", "T_BOQ_F"],           // 4 ← BOQ service cards
  ["T_BOQM"],                                              // 5

  ["T_P3"],                                                // 6
  ["T_TSD", "T_TAM"],                                      // 7
  ["T_SCH_SEL", "T_LAY_SEL"],                              // 8
  ["T_PKG"],                                               // 9

  ["T_P4"],                                                // 10
  ["T_CK1"],                                               // 11
  ["T_D1", "T_REQ1"],                                      // 12

  ["T_P5"],                                                // 13
  ["T_FLT"],                                               // 14
  ["T_DCO"],                                               // 15
  ["T_DONE"],                                              // 16
];

const SERVICE_ROW_INDICES = new Set([4]);
const SVC_ROW_GAP = 210;
const SVC_IDS = ["T_BOQ_E", "T_BOQ_P", "T_BOQ_H", "T_BOQ_F"];
const SVC_LABELS: Record<string, string> = { T_BOQ_E: "Electrical", T_BOQ_P: "Plumbing", T_BOQ_H: "HVAC", T_BOQ_F: "Firefighting" };

const NW = 210, NH = 58, SVC_NH = 210, RGAP = 96, CGAP = 40, PX = 120, PY = 36;

interface Ann { pid: string; nid: string; dx: number; dy: number }
const ANNS: Ann[] = [
  { pid: "T_TAM", nid: "T_N1", dx: NW + 8, dy: 2 },
  { pid: "T_LAY_SEL", nid: "T_N2", dx: NW + 8, dy: 2 },
];

const NODE_ROW: Record<string, number> = {};
GRID.forEach((row, ri) => { row.forEach((id) => { NODE_ROW[id] = ri; }); });

function nodeH(n: TNode): number {
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
function DrawNode({ n, x, y }: { n: TNode; x: number; y: number }) {
  const cx = x + NW / 2, cy = y + NH / 2;

  if (n.type === "decision") {
    const rx = NW / 2 + 10, ry = NH / 2 + 8;
    return (<g>
      <polygon points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`} fill={n.bg} stroke={n.color} strokeWidth={2} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.8}>{n.sub}</text>
    </g>);
  }
  if (n.type === "terminal") {
    return (<g>
      <rect x={x} y={y} width={NW} height={NH} rx={NH / 2} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={11} fontWeight={700}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={9} opacity={0.9}>{n.sub}</text>
    </g>);
  }
  if (n.type === "header") {
    return (<g>
      <rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={2.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize={10.5} fontWeight={700}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#fff" fontSize={8.5} opacity={0.85}>{n.sub.length > 38 ? n.sub.slice(0, 36) + "\u2026" : n.sub}</text>
    </g>);
  }
  if (n.type === "note") {
    const w = NW + 16, h = NH - 8;
    return (<g opacity={0.88}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={n.bg} stroke={n.color} strokeWidth={1} strokeDasharray="4,3" />
      <text x={x + w / 2} y={y + h / 2 - 5} textAnchor="middle" fill={n.text} fontSize={8.5} fontWeight={600}>{n.label}</text>
      <text x={x + w / 2} y={y + h / 2 + 7} textAnchor="middle" fill={n.text} fontSize={7.5} opacity={0.75}>{n.sub.length > 58 ? n.sub.slice(0, 56) + "\u2026" : n.sub}</text>
    </g>);
  }
  if (n.type === "checklist") {
    return (<g>
      <rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={2} strokeDasharray="6,3" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>{n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}</text>
    </g>);
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
        const py = y + headerH + 8 + i * (pillH + pillGap);
        const pillW = NW - 14; const px = x + 7;
        return (<g key={i}><rect x={px} y={py} width={pillW} height={pillH} rx={5} fill="#fff" stroke={n.color} strokeWidth={1.2} />
          <text x={px + 8} y={py + pillH / 2 + 3.5} fill={n.text} fontSize={9} fontWeight={600}>{opt}</text></g>);
      })}
      <rect x={x - 2} y={y - 2} width={NW + 4} height={h + 4} rx={12} fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3} className="t-calc-glow" strokeDasharray="4,2" />
    </g>);
  }
  return (<g>
    <rect x={x} y={y} width={NW} height={NH} rx={8} fill={n.bg} stroke={n.color} strokeWidth={1.5} />
    <text x={cx} y={cy - 4} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>{n.label}</text>
    <text x={cx} y={cy + 10} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>{n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}</text>
  </g>);
}

// =====================================================================
// SERVICE TREE DIAGRAM
// =====================================================================
function DrawServiceTree({ pos }: { pos: Record<string, { x: number; y: number }> }) {
  const p2 = pos["T_P2"], boqm = pos["T_BOQM"];
  if (!p2 || !boqm) return null;
  const svcPos = SVC_IDS.map((id) => ({ id, label: SVC_LABELS[id], cx: pos[id].x + NW / 2, top: pos[id].y, bot: pos[id].y + SVC_NH }));
  const p2Bot = p2.y + NH, p2Cx = p2.x + NW / 2, boqmTop = boqm.y, boqmCx = boqm.x + NW / 2;
  const svcTop = svcPos[0].top, svcBot = svcPos[0].bot;
  const fanOutY = p2Bot + (svcTop - p2Bot) / 2, fanInY = svcBot + (boqmTop - svcBot) / 2;
  const leftCx = svcPos[0].cx, rightCx = svcPos[svcPos.length - 1].cx;
  const c = CL.arrow;
  return (<g>
    <line x1={p2Cx} y1={p2Bot} x2={p2Cx} y2={fanOutY} stroke={c} strokeWidth={1.6} />
    <line x1={leftCx} y1={fanOutY} x2={rightCx} y2={fanOutY} stroke={c} strokeWidth={1.6} />
    {svcPos.map((s) => <line key={`fo-${s.id}`} x1={s.cx} y1={fanOutY} x2={s.cx} y2={s.top} stroke={c} strokeWidth={1.6} markerEnd="url(#t-ma)" />)}
    {svcPos.map((s) => { const tw = s.label.length * 5.5 + 8; return (<g key={`fl-${s.id}`}><rect x={s.cx - tw / 2} y={fanOutY - 15} width={tw} height={13} rx={3} fill="#fff" opacity={0.92} /><text x={s.cx} y={fanOutY - 5} textAnchor="middle" fill="#475569" fontSize={8} fontWeight={600}>{s.label}</text></g>); })}
    {svcPos.map((s) => <line key={`fi-${s.id}`} x1={s.cx} y1={s.bot} x2={s.cx} y2={fanInY} stroke={c} strokeWidth={1.6} />)}
    <line x1={leftCx} y1={fanInY} x2={rightCx} y2={fanInY} stroke={c} strokeWidth={1.6} />
    <line x1={boqmCx} y1={fanInY} x2={boqmCx} y2={boqmTop} stroke={c} strokeWidth={1.6} markerEnd="url(#t-ma)" />
  </g>);
}

// =====================================================================
// SVG CONNECTION RENDERER
// =====================================================================
function DrawConn({ c, pos, W }: { c: TConn; pos: Record<string, { x: number; y: number }>; W: number }) {
  const fp = pos[c.from], tp = pos[c.to];
  if (!fp || !tp) return null;
  const fn = NM[c.from], tn = NM[c.to];
  if (!fn || !tn) return null;
  const color = c.style === "reject" ? CL.reject : c.style === "merge" ? CL.merge : CL.arrow;
  const dash = c.style === "reject" ? "6,4" : c.style === "merge" ? "8,4" : "none";
  const mk = c.style === "reject" ? "t-mr" : c.style === "merge" ? "t-mm" : "t-ma";
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
  { label: "PART 1: INITIATION \u2014 Tender Kickoff", firstNode: "T_INIT", lastNode: "T_SC", color: CL.teal.bd },
  { label: "PART 2: BOQ PREPARATION \u2014 Service-wise Quantities", firstNode: "T_P2", lastNode: "T_BOQM", color: CL.orange.bd },
  { label: "PART 3: TENDER PACKAGE CREATION", firstNode: "T_P3", lastNode: "T_PKG", color: CL.purple.bd },
  { label: "PART 4: TENDER DOCUMENT CHECKLIST", firstNode: "T_P4", lastNode: "T_REQ1", color: CL.teal.bd },
  { label: "PART 5: FLOAT TO DCO", firstNode: "T_P5", lastNode: "T_DONE", color: CL.green.bd },
];

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function TenderStageChart() {
  const { pos, H: svgH, W: svgW } = computeLayout();
  const skipConns = new Set<string>();
  SVC_IDS.forEach((id) => { skipConns.add(`T_P2->${id}`); skipConns.add(`${id}->T_BOQM`); });

  return (
    <>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }} preserveAspectRatio="xMidYMin meet" className="stage-chart-svg">
        <defs>
          <marker id="t-ma" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.arrow} /></marker>
          <marker id="t-mr" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.reject} /></marker>
          <marker id="t-mm" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={CL.merge} /></marker>
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
        {ANNS.map((a) => {
          const pp = pos[a.pid]; const nn = NM[a.nid]; if (!pp || !nn) return null;
          const ax = pp.x + a.dx, ay = pp.y + a.dy;
          return (<g key={a.nid}><line x1={pp.x + (a.dx > 0 ? NW : 0)} y1={pp.y + NH / 2} x2={ax + (a.dx > 0 ? 0 : NW + 16)} y2={ay + (NH - 8) / 2} stroke={nn.color} strokeWidth={1} strokeDasharray="4,3" opacity={0.5} /><DrawNode n={nn} x={ax} y={ay} /></g>);
        })}
      </svg>
      <style>{`@keyframes t-glow-pulse { 0%, 100% { opacity: 0.3; stroke-dashoffset: 0; } 50% { opacity: 0.6; stroke-dashoffset: 6; } } .t-calc-glow { animation: t-glow-pulse 2s ease-in-out infinite; }`}</style>
    </>
  );
}