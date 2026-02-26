import React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WaterDemandCalcSVG } from "./water-demand-calc";
import { ElectricalLoadCalcSVG } from "./electrical-load-calc";
import { OWCCalcSVG } from "./owc-calc";
import { STPCalcSVG } from "./stp-calc";
import { FirePumpHeadCalcSVG } from "./fire-pump-head-calc";
import { FireTankCalcSVG } from "./fire-tank-calc";
import { FireJockeyDrencherCalcSVG } from "./fire-jockey-drencher-calc";
import { TerraceBoosterCalcSVG } from "./terrace-booster-calc";
import { RWHCalcSVG } from "./rwh-calc";
import { SWDCalcSVG } from "./swd-calc";

// =====================================================================
// CONCEPT STAGE — COMPLETE DETAILED FLOW CHART
// Layout: serpentine paired rows, 4 segment cards in a single row with
// tree-diagram fan-out/fan-in, color-coded phase bands, downward-only
// arrows, reject loops right side, position-aware arrow routing.
// =====================================================================

// ---- Types ----
interface CNode {
  id: string;
  label: string;
  sub: string;
  type: "process" | "decision" | "terminal" | "header" | "note" | "segment" | "service";
  color: string;
  bg: string;
  text: string;
  options?: string[];
  calcIds?: string[];
}
interface CConn {
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
const hdr = (id: string, l: string, s: string, c: typeof CL.blue): CNode =>
  ({ id, label: l, sub: s, type: "header", color: c.hd, bg: c.hd, text: "#fff" });
const proc = (id: string, l: string, s: string, c: typeof CL.blue): CNode =>
  ({ id, label: l, sub: s, type: "process", color: c.bd, bg: c.bg, text: c.tx });
const dec = (id: string, l: string, s: string): CNode =>
  ({ id, label: l, sub: s, type: "decision", color: CL.amber.bd, bg: CL.amber.bg, text: CL.amber.tx });
const term = (id: string, l: string, s: string): CNode =>
  ({ id, label: l, sub: s, type: "terminal", color: CL.term.bd, bg: CL.term.bg, text: CL.term.tx });
const nt = (id: string, l: string, s: string, c: typeof CL.blue): CNode =>
  ({ id, label: l, sub: s, type: "note", color: c.bd, bg: c.bg, text: c.tx });
const seg = (id: string, l: string, s: string, opts: string[], c: typeof CL.blue): CNode =>
  ({ id, label: l, sub: s, type: "segment", color: c.bd, bg: c.bg, text: c.tx, options: opts });
const svc = (id: string, l: string, s: string, opts: string[], cids: string[], c: typeof CL.blue): CNode =>
  ({ id, label: l, sub: s, type: "service", color: c.bd, bg: c.bg, text: c.tx, options: opts, calcIds: cids });

// =====================================================================
// ALL NODES
// =====================================================================
const NODES: CNode[] = [
  // ── INITIATION ──
  hdr("INIT", "CONCEPT STAGE", "Architect Initiates New Project", CL.blue),
  proc("DATA", "Architect Shares Data", "Area Statement + Project Plan", CL.blue),

  // ── TRACK A: INPUT MATRIX ──
  hdr("TA", "TRACK A: Input Matrix", "Project Data Collection (Parallel)", CL.blue),
  proc("A1", "1. Project Category", "\u{1F4CB} Dropdown: Residential / Commercial / Office / Retail", CL.blue),

  // ── CATEGORY → SEGMENT 4-WAY BRANCH (single row, tree diagram) ──
  seg("A2R", "Residential", "\u{1F4CB} Dropdown", ["Hi-end", "Luxury", "Aspirational", "Casa", "Crown"], CL.blue),
  seg("A2C", "Commercial", "\u{1F4CB} Dropdown", ["(per Commercial", "policy)"], CL.blue),
  seg("A2O", "Office", "\u{1F4CB} Dropdown", ["Excelus", "I-think", "Supremus"], CL.blue),
  seg("A2T", "Retail", "\u{1F4CB} Dropdown", ["Boulevard", "Experia"], CL.blue),
  hdr("A2M", "Segment Selected", "Category + Segment Confirmed \u2192 Continue", CL.blue),

  proc("A3",  "3. No. of Buildings",      "\u270d Manual Typing \u2192 Calcs & Planning", CL.blue),
  proc("A4",  "4. Plot Area",             "\u270d Manual Typing", CL.blue),
  proc("A5",  "5. Built Up Area",         "\u270d Manual Typing", CL.blue),
  proc("A6",  "6. FSI",                   "\u270d Manual Typing", CL.blue),
  proc("A7",  "7. Flat Matrix",           "\u{1F4CB} DD (1BHK/2BHK) + \u270d Qty (Manual)", CL.blue),
  nt("A7N",   "\u270e Editable in DB",    "Flat typology editable in database | Select type first then qty", CL.blue),
  proc("A8",  "8. Carpet Area",           "\u270d Manual Typing", CL.blue),
  proc("A9",  "9. Area Statement",        "\u270d Manual Typing: Hardscape + Softscape", CL.blue),
  proc("A10", "10. Building Height",      "\u270d Manual Typing", CL.blue),
  proc("A11", "11. Floor-to-Floor Height", "\u270d Manual Typing", CL.blue),
  proc("A12", "12. Car Parks",            "\u270d Manual Typing", CL.blue),
  proc("A13", "13. Location",             "\u270d Manual Typing: Coords \u2192 Google Auto", CL.blue),
  nt("A13N",  "Region \u2192 Format",     "MSEDCL (Maharashtra) / KSEDCL (Karnataka) etc.", CL.blue),
  proc("A14", "14. Society Formation",    "\u{1F518} Button + \u2611 Checkboxes \u2192 Submit", CL.blue),
  nt("A14N",  "Society Flow",             "Auto-show Society 2 after 1st Submit, repeat for more", CL.blue),

  // ── TRACK B: DESIGN DELIVERABLES ──
  hdr("TB",  "TRACK B: Design Deliverables", "Timeline & Drawing Control (Parallel)", CL.teal),
  proc("B1", "Select Building",           "\u{1F4CB} Dropdown: Auto-display Building List", CL.teal),
  proc("B2", "Stage-wise Service List",   "\u{1F916} Auto-generated per Stage", CL.teal),
  proc("B3", "Service-wise Dates",        "\u{1F916} Auto-generated per Service per Stage", CL.teal),
  proc("B4", "Policy DB Lookup",          "\u{1F916} System auto-generates dates from DB", CL.teal),
  proc("B5", "Drawing Checklist",         "\u2611 Checkboxes: Separate list per stage", CL.teal),

  // ── MERGE ──
  hdr("MRG", "TRACKS MERGE", "Both Tracks Complete \u2192 Continue", CL.green),

  // ── PART 2: MEP POLICY STUDY ──
  hdr("P2",  "PART 2: MEP Policy Study",  "Database Studies Required Policies", CL.green),
  proc("P2A", "Electrical Policy",        "Electrical Design Standards", CL.green),
  proc("P2B", "Plumbing Policy",          "Plumbing Design Standards", CL.green),
  proc("P2C", "Firefighting Policy",      "Fire Protection Standards", CL.green),
  proc("P2D", "Plantroom Policy",         "Plant Room Requirements", CL.green),
  proc("P2E", "Backup Policy",            "Backup Systems Standards", CL.green),

  // ── PART 3: CALCULATIONS (Service-wise) ──
  hdr("P3",  "PART 3: Calculations",      "Service-wise Calculations — Click any item to view flow", CL.purple),
  svc("SVC_E", "Electrical", "\u26A1 Calculations",
    ["Electrical Load Calc"],
    ["P3B"],
    CL.amber),
  svc("SVC_P", "Plumbing", "\uD83D\uDCA7 Calculations",
    ["Water Demand Calc", "OWC Calculations", "STP Calculations", "Dom. & Flush Pump", "Ext. Sewer & Storm", "RWH Calculator", "SWD Calculator", "Transfer Pipe Sizing"],
    ["P3A", "OWC", "STP", "DFP", "P3E", "RWH", "SWD", "P3T"],
    CL.blue),
  svc("SVC_H", "HVAC", "\u2744\uFE0F Calculations",
    ["Heat Load Calc", "Ventilation Calc", "Pressurisation Calc"],
    ["P3D", "VENT", "PRESS"],
    CL.purple),
  svc("SVC_F", "Firefighting", "\uD83D\uDD25 Calculations",
    ["Fire Pump Head", "Fire Tank Sizing", "Jockey & Drencher", "Terrace Booster", "Transfer Pipe Sizing"],
    ["FFP", "FTK", "FJD", "FTB", "P3T"],
    CL.rose),
  hdr("SVCM", "All Service Calcs Complete", "Results merge \u2192 Formatting & Download", CL.purple),
  proc("P3L", "Location-Based Formatting", "GPS \u2192 Region \u2192 MSEDCL/KSEDCL etc.", CL.purple),
  proc("P3F", "Download Format Options",  "Lodha / MOEF / MSEDCL / NBC / CAM Est.", CL.purple),

  // ── PART 4: SPACE MATRIX ──
  hdr("P4",  "PART 4: Space Matrix",      "MEP Design Shares Space Matrix", CL.cyan),
  proc("P4A", "Space Matrix Table",       "Table format fed to DB \u2014 Data from Calcs", CL.cyan),
  proc("P4B", "Display Input Data",       "Shows inputs used to fill the matrix", CL.cyan),
  proc("P4C", "User Editable Inputs",     "User can edit some of the input values", CL.cyan),

  // ── PART 5: DETAILED SPACE PLANNING ──
  hdr("P5",  "PART 5: Detailed Space Planning", "MEP Shares Layout with Space Matrix", CL.orange),
  proc("S1",  "UGT Layout (Detailed)",    "Pump Room + Tanks + Pump Blocks", CL.orange),
  proc("S2",  "STP Layout (Blocks)",      "Total Area Shown in Block Only", CL.orange),
  proc("S3",  "OWC Layout (Detailed)",    "Machine Room + Wet Storage Area", CL.orange),
  proc("S4",  "Substation & DG (Detail)", "Detailed Substation + DG Layout", CL.orange),
  proc("S5",  "Lifts Space Planning",     "No. of Lifts + Size + Space (DB data)", CL.orange),
  dec("SD1",  "Commercial Project?",      "Check Project Type"),
  proc("S6",  "Chiller Space Planning",   "Only for Commercial Projects", CL.orange),
  proc("S7",  "Toilet Vent & Pressurize", "Ventilation + Pressurization (DB data)", CL.orange),
  nt("SN1",  "Data Source",               "Ventilation, Pressurization & Lifts data from DB", CL.orange),
  dec("SD2",  "Height > 90m?",            "Fire Break Floor Check"),
  dec("SD3",  "User Wants Plan?",         "Optional: UGT + Fire Break"),
  dec("SD4",  "As Per CFO or NBC?",       "Standard Selection"),
  proc("S8",  "Fire Break Floor + UGT",   "As per selected standard (CFO/NBC)", CL.rose),
  proc("SSK", "Skip Fire Plan",           "Height \u226490m or User Declined", CL.orange),

  // ── PART 6: ARCHITECT CONVERGENCE ──
  hdr("P6",  "PART 6: Architect Convergence", "Master Plan Integration", CL.violet),
  proc("P6A", "Architect Receives",       "Space Matrix + Space Planning Layout", CL.violet),
  proc("P6B", "Architect Shares Master",  "Includes MEP: UGT/STP locations etc.", CL.violet),
  proc("P6C", "MEP Reviews Master Plan",  "Review Architect's Incorporation", CL.violet),
  dec("P6D",  "Plan Finalized?",          "MEP + Architect Agreement"),
  proc("P6E", "MEP Detailed Space Plan",  "UGT internals, OWC detail, Sub/DG etc.", CL.violet),
  proc("P6F", "Architect Concept Plan",   "All Floor Plans Shared by Architect", CL.violet),

  // ── PART 7: ARCHITECT PLANS DRAWING CHECKLIST ──
  hdr("P7",   "PART 7: Plans Verification", "Verify Received Plans Before Proceeding", CL.teal),
  proc("CK1", "Architect Plans Checklist", "\u2611 Verify all floor plans received from Architect", CL.teal),
  dec("CKD1", "All Plans Received?",      "Check completeness of drawings"),
  proc("CK1R","Request Missing Plans",    "\u{1F4E8} Notify Architect \u2192 loop back", CL.rose),

  // ── PART 8: MEP REVIEW + CALCULATIONS ──
  hdr("P8",   "PART 8: MEP Review & Calcs", "Review Plans + Policy Lookup + Calculations", CL.purple),
  proc("R1",  "MEP Reviews & Comments",   "\u{1F4DD} Review plans, share comments to Architect", CL.violet),
  proc("R2",  "Policy DB Lookup",          "\u{1F916} System fetches policies from DB for calcs", CL.teal),
  proc("R3",  "MEP Service Calculations",  "\u{1F9EE} All service-wise calcs from reviewed plans", CL.purple),
  proc("R4",  "Download Format Options",   "\u{1F4CB} User selects calc download format", CL.purple),
  proc("R5",  "All Floor Layouts",         "\u{1F5FA} Prepared from calculation output", CL.cyan),

  // ── PART 9: MEP LAYOUT → ARCHITECT AGREEMENT ──
  hdr("P9",   "PART 9: Layout Sharing", "Share Layouts \u2192 Architect Review \u2192 Agreement", CL.orange),
  proc("CK2", "MEP Layout Checklist",     "\u2611 Verify all MEP layouts before sharing", CL.teal),
  proc("R6",  "Share to Architect",        "\u{1F4E4} Send MEP layouts to Architect for review", CL.violet),
  proc("R7",  "Architect Reviews",         "\u{1F50D} Architect reviews MEP layout drawings", CL.violet),
  dec("RD1",  "Agreement?",               "Architect \u2194 MEP Agreement on layouts"),
  proc("R7R", "MEP Revises Layouts",       "\u270D Revise based on Architect feedback", CL.rose),

  // ── PART 10: FINAL CHECKLIST & COMPLETION ──
  hdr("P10",  "PART 10: Final Verification", "Final MEP Drawing Checklist \u2192 Stage Complete", CL.green),
  proc("CK3", "Final MEP Drawing Checklist", "\u2611 All MEP drawings verified & complete", CL.teal),
  dec("CKD2", "All Complete?",             "Final gate check"),
  proc("R8",  "Stage On Hold",             "\u23F8 Pending items \u2192 loop back to checklist", CL.rose),

  // ── COMPLETE ──
  term("DONE", "CONCEPT STAGE COMPLETE",  "Proceed to Schematic Design Stage"),
];

// Build lookup
const NM: Record<string, CNode> = {};
NODES.forEach((n) => { NM[n.id] = n; });

// =====================================================================
// CONNECTIONS — A1↔segment and segment↔A2M handled by tree renderer
// =====================================================================
const CN: CConn[] = [
  { from: "INIT", to: "DATA", style: "normal" },
  { from: "DATA", to: "TA",   style: "normal" },
  { from: "DATA", to: "TB",   style: "normal" },

  // Track A (tree handles A1→segments→A2M)
  { from: "TA",  to: "A1",  style: "normal" },
  { from: "A2M", to: "A3",  style: "normal" },
  { from: "A3",  to: "A4",  style: "normal" },
  { from: "A4",  to: "A5",  style: "normal" },
  { from: "A5",  to: "A6",  style: "normal" },
  { from: "A6",  to: "A7",  style: "normal" },
  { from: "A7",  to: "A8",  style: "normal" },
  { from: "A8",  to: "A9",  style: "normal" },
  { from: "A9",  to: "A10", style: "normal" },
  { from: "A10", to: "A11", style: "normal" },
  { from: "A11", to: "A12", style: "normal" },
  { from: "A12", to: "A13", style: "normal" },
  { from: "A13", to: "A14", style: "normal" },
  // Height check after all inputs
  { from: "A14", to: "SD2", style: "normal" },
  { from: "SD2", to: "SD3", label: "Yes (>90m)", style: "normal" },
  { from: "SD2", to: "SSK", label: "No (\u226490m)", style: "normal" },
  { from: "SD3", to: "SD4", label: "Yes", style: "normal" },
  { from: "SD3", to: "SSK", label: "No", style: "normal" },
  { from: "SD4", to: "S8",  style: "normal" },
  { from: "S8",  to: "MRG", style: "normal" },
  { from: "SSK", to: "MRG", style: "normal" },

  // Track B
  { from: "TB",  to: "B1",  style: "normal" },
  { from: "B1",  to: "B2",  style: "normal" },
  { from: "B2",  to: "B3",  style: "normal" },
  { from: "B3",  to: "B4",  style: "normal" },
  { from: "B4",  to: "B5",  style: "normal" },
  { from: "B5",  to: "MRG", style: "normal" },

  // Merge → Policies
  { from: "MRG", to: "P2", style: "normal" },
  { from: "P2",  to: "P2A", style: "normal" },
  { from: "P2",  to: "P2B", style: "normal" },
  { from: "P2",  to: "P2C", style: "normal" },
  { from: "P2",  to: "P2D", style: "normal" },
  { from: "P2",  to: "P2E", style: "normal" },

  // Policies → Calculations
  { from: "P2A", to: "P3", style: "normal" },
  { from: "P2B", to: "P3", style: "normal" },
  { from: "P2C", to: "P3", style: "normal" },
  { from: "P2D", to: "P3", style: "normal" },
  { from: "P2E", to: "P3", style: "normal" },

  // Calculations — Service tree handles P3 → SVC_* → SVCM
  { from: "SVCM", to: "P3L", style: "normal" },
  { from: "P3L",  to: "P3F", style: "normal" },
  { from: "P3F",  to: "P4",  style: "normal" },

  // Space Matrix
  { from: "P4",  to: "P4A", style: "normal" },
  { from: "P4A", to: "P4B", style: "normal" },
  { from: "P4B", to: "P4C", style: "normal" },
  { from: "P4C", to: "P5",  style: "normal" },

  // Space Planning
  { from: "P5", to: "S1", style: "normal" },
  { from: "P5", to: "S2", style: "normal" },
  { from: "P5", to: "S3", style: "normal" },
  { from: "P5", to: "S4", style: "normal" },
  { from: "P5", to: "S5", style: "normal" },
  { from: "S1", to: "S7", style: "normal" },
  { from: "S2", to: "S7", style: "normal" },
  { from: "S3", to: "S7", style: "normal" },
  { from: "S4", to: "S7", style: "normal" },
  { from: "S5",  to: "SD1", style: "normal" },
  { from: "SD1", to: "S6",  label: "Yes", style: "normal" },
  { from: "SD1", to: "S7",  label: "No", style: "normal" },
  { from: "S6",  to: "S7",  style: "normal" },
  { from: "S7",  to: "P6",  style: "normal" },

  // Architect Convergence (Part 6)
  { from: "P6",  to: "P6A", style: "normal" },
  { from: "P6A", to: "P6B", style: "normal" },
  { from: "P6B", to: "P6C", style: "normal" },
  { from: "P6C", to: "P6D", style: "normal" },
  { from: "P6D", to: "P6E", label: "Yes", style: "normal" },
  { from: "P6D", to: "P6C", label: "No \u2013 Revise", style: "reject" },
  { from: "P6E", to: "P6F", style: "normal" },

  // Part 7: Architect Plans Drawing Checklist
  { from: "P6F", to: "P7",   style: "normal" },
  { from: "P7",  to: "CK1",  style: "normal" },
  { from: "CK1", to: "CKD1", style: "normal" },
  { from: "CKD1",to: "P8",   label: "Yes", style: "normal" },
  { from: "CKD1",to: "CK1R", label: "No \u2013 Missing", style: "reject" },
  { from: "CK1R",to: "CK1",  label: "Re-verify", style: "reject" },

  // Part 8: MEP Review + Calculations (parallel R1 & R2)
  { from: "P8",  to: "R1",   style: "normal" },
  { from: "P8",  to: "R2",   style: "normal" },
  { from: "R1",  to: "R3",   style: "normal" },
  { from: "R2",  to: "R3",   style: "normal" },
  { from: "R3",  to: "R4",   style: "normal" },
  { from: "R4",  to: "R5",   style: "normal" },

  // Part 9: MEP Layout → Architect Agreement
  { from: "R5",  to: "P9",   style: "normal" },
  { from: "P9",  to: "CK2",  style: "normal" },
  { from: "CK2", to: "R6",   style: "normal" },
  { from: "R6",  to: "R7",   style: "normal" },
  { from: "R7",  to: "RD1",  style: "normal" },
  { from: "RD1", to: "P10",  label: "Yes \u2013 Agreed", style: "normal" },
  { from: "RD1", to: "R7R",  label: "No \u2013 Reject", style: "reject" },
  { from: "R7R", to: "R5",   label: "Revise Layouts", style: "reject" },

  // Part 10: Final Checklist & Completion
  { from: "P10", to: "CK3",  style: "normal" },
  { from: "CK3", to: "CKD2", style: "normal" },
  { from: "CKD2",to: "DONE", label: "Yes \u2013 Complete", style: "normal" },
  { from: "CKD2",to: "R8",   label: "No \u2013 Pending", style: "reject" },
  { from: "R8",  to: "CK3",  label: "Re-check", style: "reject" },
];

// =====================================================================
// GRID LAYOUT — All 4 segment cards on ONE row
// =====================================================================
const GRID: string[][] = [
  ["INIT"],                              // 0
  ["DATA"],                              // 1
  ["TA", "TB"],                          // 2
  ["A1", "B1"],                          // 3
  ["A2R", "A2C", "A2O", "A2T"],         // 4  ← all 4 segments in one row
  ["A2M", "B2"],                         // 5
  ["A3",  "A4",  "B3"],                  // 6
  ["A5",  "A6",  "B4"],                  // 7
  ["A7",  "A8",  "B5"],                  // 8
  ["A9",  "A10"],                        // 9
  ["A11", "A12"],                        // 10
  ["A13", "A14"],                        // 11
  ["SD2"],                               // 12  ← Height check after all inputs
  ["SD3", "SSK"],                        // 13
  ["SD4"],                               // 14
  ["S8"],                                // 15
  ["MRG"],                               // 16
  ["P2"],                                // 17
  ["P2A", "P2B", "P2C", "P2D", "P2E"],  // 18
  ["P3"],                                // 19
  ["SVC_E", "SVC_P", "SVC_H", "SVC_F"],  // 20 ← service cards
  ["SVCM"],                              // 21 ← services merged
  ["P3L", "P3F"],                        // 22
  ["P4"],                                // 23
  ["P4A", "P4B", "P4C"],                // 23
  ["P5"],                                // 24
  ["S1", "S2", "S3", "S4", "S5"],       // 25
  ["SD1", "S6"],                         // 26
  ["S7"],                                // 27
  ["P6"],                                // 28
  ["P6A", "P6B"],                        // 29
  ["P6C"],                               // 30
  ["P6D"],                               // 31
  ["P6E"],                               // 32
  ["P6F"],                               // 33

  // Part 7: Architect Plans Verification
  ["P7"],                                // 34
  ["CK1"],                               // 35
  ["CKD1", "CK1R"],                      // 36

  // Part 8: MEP Review & Calculations
  ["P8"],                                // 37
  ["R1", "R2"],                          // 38  ← parallel: review + policy
  ["R3"],                                // 39
  ["R4"],                                // 40
  ["R5"],                                // 41

  // Part 9: MEP Layout → Architect Agreement
  ["P9"],                                // 42
  ["CK2"],                               // 43
  ["R6"],                                // 44
  ["R7"],                                // 45
  ["RD1", "R7R"],                        // 46

  // Part 10: Final Checklist & Completion
  ["P10"],                               // 47
  ["CK3"],                               // 48
  ["CKD2", "R8"],                        // 49
  ["DONE"],                              // 50
];

// Only row 4 (the single segment row) needs extra vertical space
const SEGMENT_ROW_INDICES = new Set([4]);
const SEG_ROW_GAP = 140; // extra height for the segment card row

// Service card row (row 20) also needs extra space
const SERVICE_ROW_INDICES = new Set([20]);
const SVC_ROW_GAP = 290;

// Service tree constants
const SVC_IDS = ["SVC_E", "SVC_P", "SVC_H", "SVC_F"];
const SVC_LABELS: Record<string, string> = {
  SVC_E: "Electrical",
  SVC_P: "Plumbing",
  SVC_H: "HVAC",
  SVC_F: "Firefighting",
};

// =====================================================================
// LAYOUT ENGINE
// =====================================================================
const NW = 210;
const NH = 58;
const SEG_NH = 110;
const SVC_NH = 235;
const RGAP = 96;
const CGAP = 40;
const PX = 120;
const PY = 36;

// Note annotations
interface Ann { pid: string; nid: string; dx: number; dy: number }
const ANNS: Ann[] = [
  { pid: "A7",  nid: "A7N",  dx: -(NW + 24), dy: 0 },
  { pid: "A13", nid: "A13N", dx: -(NW + 24), dy: 0 },
  { pid: "A14", nid: "A14N", dx: NW + 16, dy: 0 },
  { pid: "S7",  nid: "SN1",  dx: NW + 8, dy: 2 },
];

// Build node→row lookup
const NODE_ROW: Record<string, number> = {};
GRID.forEach((row, ri) => { row.forEach((id) => { NODE_ROW[id] = ri; }); });

// Segment labels for tree diagram
const SEG_LABELS: Record<string, string> = {
  A2R: "Residential",
  A2C: "Commercial",
  A2O: "Office",
  A2T: "Retail",
};
const SEG_IDS = ["A2R", "A2C", "A2O", "A2T"];

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
    y += SEGMENT_ROW_INDICES.has(ri) ? SEG_ROW_GAP : SERVICE_ROW_INDICES.has(ri) ? SVC_ROW_GAP : RGAP;
  }
  return { pos, rowY, H: y + 60, W: maxW + PX * 2 };
}

function nodeH(n: CNode): number {
  if (n.type === "segment") return SEG_NH;
  if (n.type === "service") return SVC_NH;
  if (n.type === "decision") return NH + 16;
  return NH;
}

// =====================================================================
// CLICKABLE CALCULATION NODE IDs
// =====================================================================
// Service cards handle calc clicks internally; no individual calc nodes needed
const CALC_NODE_IDS = new Set<string>();
const SVC_NODE_IDS = new Set(["SVC_E", "SVC_P", "SVC_H", "SVC_F"]);

// =====================================================================
// SVG NODE RENDERER
// =====================================================================
function DrawNode({ n, x, y, onClick, onCalcItemClick }: {
  n: CNode; x: number; y: number;
  onClick?: () => void;
  onCalcItemClick?: (calcId: string) => void;
}) {
  const cx = x + NW / 2, cy = y + NH / 2;
  const isClickable = CALC_NODE_IDS.has(n.id);
  const handleClick = isClickable && onClick ? onClick : undefined;

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

  if (n.type === "segment") {
    const opts = n.options || [];
    const h = SEG_NH;
    const headerH = 32;
    const pillH = 14;
    const pillGap = 3;

    return (
      <g>
        <rect x={x} y={y} width={NW} height={h} rx={10}
          fill={n.bg} stroke={n.color} strokeWidth={2} />
        <rect x={x} y={y} width={NW} height={headerH} rx={10} fill={n.color} />
        <rect x={x} y={y + headerH - 6} width={NW} height={6} fill={n.color} />
        <text x={cx} y={y + 14} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
          {n.label}
        </text>
        <text x={cx} y={y + 25} textAnchor="middle" fill="#fff" fontSize={8} opacity={0.85}>
          {n.sub}
        </text>
        {opts.map((opt, i) => {
          const py = y + headerH + 6 + i * (pillH + pillGap);
          const pillW = NW - 16;
          const px = x + 8;
          return (
            <g key={i}>
              <rect x={px} y={py} width={pillW} height={pillH} rx={4}
                fill="#fff" stroke={n.color} strokeWidth={0.8} opacity={0.9} />
              <text x={px + pillW / 2} y={py + pillH / 2 + 3.5} textAnchor="middle"
                fill={n.text} fontSize={9} fontWeight={500}>
                {opt}
              </text>
            </g>
          );
        })}
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
        {/* Card background */}
        <rect x={x} y={y} width={NW} height={h} rx={10}
          fill={n.bg} stroke={n.color} strokeWidth={2.5} />
        {/* Header */}
        <rect x={x} y={y} width={NW} height={headerH} rx={10} fill={n.color} />
        <rect x={x} y={y + headerH - 6} width={NW} height={6} fill={n.color} />
        <text x={cx} y={y + 15} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
          {n.label}
        </text>
        <text x={cx} y={y + 28} textAnchor="middle" fill="#fff" fontSize={8} opacity={0.85}>
          {n.sub}
        </text>
        {/* Clickable calc pills */}
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
              {/* Click indicator */}
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
        {/* Animated glow */}
        <rect x={x - 2} y={y - 2} width={NW + 4} height={h + 4} rx={12}
          fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.3}
          className="calc-glow" strokeDasharray="4,2" />
      </g>
    );
  }

  // ── process (default) — with clickable calc node styling ──
  if (isClickable) {
    return (
      <g onClick={handleClick} style={{ cursor: "pointer" }}>
        {/* Glow ring on hover (CSS handles via class) */}
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={11}
          fill="none" stroke={n.color} strokeWidth={2} opacity={0.3}
          className="calc-glow" strokeDasharray="4,2" />
        <rect x={x} y={y} width={NW} height={NH} rx={8}
          fill={n.bg} stroke={n.color} strokeWidth={2} />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={n.text} fontSize={10} fontWeight={600}>
          {n.label}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fill={n.text} fontSize={8.5} opacity={0.75}>
          {n.sub.length > 40 ? n.sub.slice(0, 38) + "\u2026" : n.sub}
        </text>
        {/* Click indicator */}
        <rect x={x + NW / 2 - 32} y={y + NH - 14} width={64} height={12} rx={6}
          fill={n.color} opacity={0.85} />
        <text x={cx} y={y + NH - 5} textAnchor="middle" fill="#fff" fontSize={7} fontWeight={600}>
          \uD83D\uDD0D Click to expand
        </text>
      </g>
    );
  }

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
// TREE DIAGRAM RENDERER — Fan-out from A1 and fan-in to A2M
// Renders as: trunk line → horizontal bar → vertical branches → cards
// =====================================================================
function DrawTreeDiagram({ pos }: { pos: Record<string, { x: number; y: number }> }) {
  const a1 = pos["A1"];
  const a2m = pos["A2M"];
  if (!a1 || !a2m) return null;

  const segPositions = SEG_IDS.map((id) => ({
    id,
    label: SEG_LABELS[id],
    cx: pos[id].x + NW / 2,
    top: pos[id].y,
    bot: pos[id].y + SEG_NH,
  }));

  const a1Bot = a1.y + NH;       // A1 bottom center
  const a1Cx = a1.x + NW / 2;
  const a2mTop = a2m.y;          // A2M top center
  const a2mCx = a2m.x + NW / 2;
  const segTop = segPositions[0].top;
  const segBot = segPositions[0].bot;

  // Fan-out: horizontal bar Y is midway between A1 bottom and segment tops
  const fanOutBarY = a1Bot + (segTop - a1Bot) / 2;
  // Fan-in: horizontal bar Y is midway between segment bottoms and A2M top
  const fanInBarY = segBot + (a2mTop - segBot) / 2;

  const leftCx = segPositions[0].cx;
  const rightCx = segPositions[segPositions.length - 1].cx;

  const color = CL.arrow;

  return (
    <g>
      {/* ═══ FAN-OUT: A1 → segments ═══ */}
      {/* Trunk: A1 bottom → bar */}
      <line x1={a1Cx} y1={a1Bot} x2={a1Cx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      {/* Horizontal bar spanning all segment centers */}
      <line x1={leftCx} y1={fanOutBarY} x2={rightCx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      {/* Vertical branches: bar → each segment top (with arrowheads) */}
      {segPositions.map((s) => (
        <line key={`fo-${s.id}`}
          x1={s.cx} y1={fanOutBarY} x2={s.cx} y2={s.top}
          stroke={color} strokeWidth={1.6} markerEnd="url(#ma)" />
      ))}
      {/* Labels on each branch */}
      {segPositions.map((s) => {
        const lx = s.cx;
        const ly = fanOutBarY - 5;
        const lbl = s.label;
        const tw = lbl.length * 5.5 + 8;
        return (
          <g key={`fl-${s.id}`}>
            <rect x={lx - tw / 2} y={ly - 10} width={tw} height={13} rx={3} fill="#fff" opacity={0.92} />
            <text x={lx} y={ly} textAnchor="middle" fill="#475569" fontSize={8} fontWeight={600}>{lbl}</text>
          </g>
        );
      })}

      {/* ═══ FAN-IN: segments → A2M ═══ */}
      {/* Vertical branches: each segment bottom → bar (no arrowhead on branches) */}
      {segPositions.map((s) => (
        <line key={`fi-${s.id}`}
          x1={s.cx} y1={s.bot} x2={s.cx} y2={fanInBarY}
          stroke={color} strokeWidth={1.6} />
      ))}
      {/* Horizontal bar */}
      <line x1={leftCx} y1={fanInBarY} x2={rightCx} y2={fanInBarY} stroke={color} strokeWidth={1.6} />
      {/* Trunk: bar → A2M top (with arrowhead) */}
      <line x1={a2mCx} y1={fanInBarY} x2={a2mCx} y2={a2mTop}
        stroke={color} strokeWidth={1.6} markerEnd="url(#ma)" />
    </g>
  );
}

// =====================================================================
// SERVICE TREE DIAGRAM — Fan-out from P3 and fan-in to SVCM
// =====================================================================
function DrawServiceTree({ pos }: { pos: Record<string, { x: number; y: number }> }) {
  const p3 = pos["P3"];
  const svcm = pos["SVCM"];
  if (!p3 || !svcm) return null;

  const svcPositions = SVC_IDS.map((id) => ({
    id,
    label: SVC_LABELS[id],
    cx: pos[id].x + NW / 2,
    top: pos[id].y,
    bot: pos[id].y + SVC_NH,
  }));

  const p3Bot = p3.y + NH;
  const p3Cx = p3.x + NW / 2;
  const svcmTop = svcm.y;
  const svcmCx = svcm.x + NW / 2;
  const svcTop = svcPositions[0].top;
  const svcBot = svcPositions[0].bot;

  const fanOutBarY = p3Bot + (svcTop - p3Bot) / 2;
  const fanInBarY = svcBot + (svcmTop - svcBot) / 2;

  const leftCx = svcPositions[0].cx;
  const rightCx = svcPositions[svcPositions.length - 1].cx;
  const color = CL.arrow;

  return (
    <g>
      {/* FAN-OUT: P3 → service cards */}
      <line x1={p3Cx} y1={p3Bot} x2={p3Cx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      <line x1={leftCx} y1={fanOutBarY} x2={rightCx} y2={fanOutBarY} stroke={color} strokeWidth={1.6} />
      {svcPositions.map((s) => (
        <line key={`sfo-${s.id}`}
          x1={s.cx} y1={fanOutBarY} x2={s.cx} y2={s.top}
          stroke={color} strokeWidth={1.6} markerEnd="url(#ma)" />
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

      {/* FAN-IN: service cards → SVCM */}
      {svcPositions.map((s) => (
        <line key={`sfi-${s.id}`}
          x1={s.cx} y1={s.bot} x2={s.cx} y2={fanInBarY}
          stroke={color} strokeWidth={1.6} />
      ))}
      <line x1={leftCx} y1={fanInBarY} x2={rightCx} y2={fanInBarY} stroke={color} strokeWidth={1.6} />
      <line x1={svcmCx} y1={fanInBarY} x2={svcmCx} y2={svcmTop}
        stroke={color} strokeWidth={1.6} markerEnd="url(#ma)" />
    </g>
  );
}

// =====================================================================
// SVG CONNECTION RENDERER — Position-Aware Routing
// =====================================================================
function DrawConn({
  c, pos, W
}: {
  c: CConn;
  pos: Record<string, { x: number; y: number }>;
  W: number;
}) {
  const fp = pos[c.from], tp = pos[c.to];
  if (!fp || !tp) return null;
  const fn = NM[c.from], tn = NM[c.to];
  if (!fn || !tn) return null;

  const color = c.style === "reject" ? CL.reject : c.style === "merge" ? CL.merge : CL.arrow;
  const dash = c.style === "reject" ? "6,4" : c.style === "merge" ? "8,4" : "none";
  const mk = c.style === "reject" ? "mr" : c.style === "merge" ? "mm" : "ma";

  const fcx = fp.x + NW / 2;
  const tcx = tp.x + NW / 2;
  const fnHt = nodeH(fn);
  const tnHt = nodeH(tn);

  const srcBot = fp.y + fnHt;
  const y1 = fn.type === "decision" ? fp.y + NH / 2 + NH / 2 + 8 : srcBot;
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

  // ── Going UP — reject loop: route around right side ──
  if (dy < -20 && c.style === "reject") {
    const rightX = Math.min(W - 20, Math.max(fp.x + NW, tp.x + NW) + 40);
    const sx = fp.x + NW;
    const sy = fcy;
    const ex = tp.x + NW;
    const ey = tcy;
    const d = `M${sx},${sy} L${rightX},${sy} L${rightX},${ey} L${ex},${ey}`;
    return renderPath(d, rightX + 4, (sy + ey) / 2, "start");
  }

  // ── Same row — horizontal ──
  if (Math.abs(dy) <= 20) {
    const ltr = tcx > fcx;
    const x1 = ltr ? fp.x + NW : fp.x;
    const x2 = ltr ? tp.x : tp.x + NW;
    const d = `M${x1},${fcy} L${x2},${tcy}`;
    return renderPath(d, (x1 + x2) / 2, fcy - 10);
  }

  // ── Going DOWN reject (same column, long distance) — route right side ──
  if (c.style === "reject" && hDiff < 5 && dy > RGAP * 1.5) {
    const rightX = Math.min(W - 20, fp.x + NW + 40);
    const d = `M${fp.x + NW},${fcy} L${rightX},${fcy} L${rightX},${tcy} L${tp.x + NW},${tcy}`;
    return renderPath(d, rightX + 4, (fcy + tcy) / 2, "start");
  }

  // ── Straight down (same column, adjacent row) ──
  if (hDiff < 5 && rowDiff === 1) {
    const d = `M${fcx},${y1} L${tcx},${y2}`;
    return renderPath(d, fcx + 14, (y1 + y2) / 2);
  }

  // ── Check if we need gutter routing (skip-row through boxes) ──
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
        if (maxPathX > nLeft && minPathX < nRight) {
          return true;
        }
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

  // ── Same column, skip rows but no blocking boxes ──
  if (hDiff < 5) {
    const d = `M${fcx},${y1} L${tcx},${y2}`;
    return renderPath(d, fcx + 14, (y1 + y2) / 2);
  }

  // ── Adjacent-row L-shape ──
  const gapY = y1 + (y2 - y1) / 2;
  const d = `M${fcx},${y1} L${fcx},${gapY} L${tcx},${gapY} L${tcx},${y2}`;
  return renderPath(d, (fcx + tcx) / 2, gapY - 10);
}

// =====================================================================
// PHASE BACKGROUND BANDS
// =====================================================================
interface BandDef { label: string; firstNode: string; lastNode: string; color: string }
const BAND_DEFS: BandDef[] = [
  { label: "INITIATION", firstNode: "INIT", lastNode: "DATA", color: CL.blue.bd },
  { label: "PARALLEL TRACKS \u2014 Part 1: Input Matrix + Design Deliverables", firstNode: "TA", lastNode: "A14", color: CL.teal.bd },
  { label: "BUILDING HEIGHT CHECK \u2014 Fire Break Floor Decision", firstNode: "SD2", lastNode: "S8", color: CL.rose.bd },
  { label: "PART 2: MEP POLICY STUDY", firstNode: "P2", lastNode: "P2E", color: CL.green.bd },
  { label: "PART 3: SERVICE-WISE CALCULATIONS", firstNode: "P3", lastNode: "P3F", color: CL.purple.bd },
  { label: "PART 4: SPACE MATRIX", firstNode: "P4", lastNode: "P4C", color: CL.cyan.bd },
  { label: "PART 5: DETAILED SPACE PLANNING", firstNode: "P5", lastNode: "S7", color: CL.orange.bd },
  { label: "PART 6: ARCHITECT CONVERGENCE \u2192 CONCEPT PLAN", firstNode: "P6", lastNode: "P6F", color: CL.violet.bd },
  { label: "PART 7: ARCHITECT PLANS DRAWING CHECKLIST", firstNode: "P7", lastNode: "CK1R", color: CL.teal.bd },
  { label: "PART 8: MEP REVIEW & CALCULATIONS", firstNode: "P8", lastNode: "R5", color: CL.purple.bd },
  { label: "PART 9: MEP LAYOUT \u2192 ARCHITECT AGREEMENT", firstNode: "P9", lastNode: "R7R", color: CL.orange.bd },
  { label: "PART 10: FINAL VERIFICATION & COMPLETION", firstNode: "P10", lastNode: "DONE", color: CL.green.bd },
];

// =====================================================================
// CALCULATION DETAIL SUB-FLOWCHARTS (placeholder — replace with real data)
// =====================================================================
interface CalcStep {
  id: string;
  label: string;
  sub: string;
  type: "input" | "process" | "formula" | "output" | "decision";
}
interface CalcFlow {
  title: string;
  icon: string;
  color: string;
  accentBg: string;
  steps: CalcStep[];
  connections: { from: string; to: string; label?: string }[];
}

const CALC_FLOWS: Record<string, CalcFlow> = {
  P3A: {
    title: "Water Demand Calculation",
    icon: "\uD83D\uDCA7",
    color: "#2563eb",
    accentBg: "#dbeafe",
    steps: [
      { id: "W1", label: "Input: Flat Matrix", sub: "No. of flats \u00d7 type (1BHK/2BHK/3BHK)", type: "input" },
      { id: "W2", label: "Per Capita Demand", sub: "DB Lookup: Litres per person per day", type: "process" },
      { id: "W3", label: "Population Estimate", sub: "Flats \u00d7 Avg Occupancy per type", type: "formula" },
      { id: "W4", label: "Daily Water Demand", sub: "Population \u00d7 Per Capita \u00d7 Flushing Factor", type: "formula" },
      { id: "W5", label: "Peak Hour Factor", sub: "Apply peak demand multiplier (1.5\u00d7\u20132.5\u00d7)", type: "process" },
      { id: "W6", label: "Fire Reserve", sub: "As per NBC / Local Authority norms", type: "process" },
      { id: "W7", label: "Storage Tank Sizing", sub: "Daily Demand + Fire Reserve + Buffer", type: "formula" },
      { id: "W8", label: "Output: Total Water Demand", sub: "Litres/day + Tank Size (L) \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "W1", to: "W2" }, { from: "W2", to: "W3" }, { from: "W3", to: "W4" },
      { from: "W4", to: "W5" }, { from: "W5", to: "W6" }, { from: "W6", to: "W7" },
      { from: "W7", to: "W8" },
    ],
  },
  P3B: {
    title: "Electrical Load Calculation",
    icon: "\u26A1",
    color: "#f59e0b",
    accentBg: "#fef3c7",
    steps: [
      { id: "E1", label: "Input: Built Up Area", sub: "Area Statement + Flat Matrix + Amenities", type: "input" },
      { id: "E2", label: "Connected Load", sub: "Sum of all electrical loads per unit", type: "formula" },
      { id: "E3", label: "Demand Factor", sub: "DB Lookup: Demand factor per category", type: "process" },
      { id: "E4", label: "Diversified Load", sub: "Connected Load \u00d7 Demand Factor", type: "formula" },
      { id: "E5", label: "Common Area Load", sub: "Lighting + Pumps + Lifts + HVAC", type: "process" },
      { id: "E6", label: "Total Electrical Load", sub: "Diversified + Common Area + Spare", type: "formula" },
      { id: "E7", label: "Transformer Sizing", sub: "Total Load \u00f7 Power Factor \u2192 kVA", type: "formula" },
      { id: "E8", label: "DG Set Sizing", sub: "Essential Load \u2192 DG Capacity", type: "formula" },
      { id: "E9", label: "Output: Load Summary", sub: "kW / kVA / DG Size \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "E1", to: "E2" }, { from: "E2", to: "E3" }, { from: "E3", to: "E4" },
      { from: "E4", to: "E5" }, { from: "E5", to: "E6" }, { from: "E6", to: "E7" },
      { from: "E7", to: "E8" }, { from: "E8", to: "E9" },
    ],
  },
  P3C: {
    title: "Pump Head Calculation",
    icon: "\uD83D\uDD27",
    color: "#10b981",
    accentBg: "#d1fae5",
    steps: [
      { id: "PH1", label: "Input: Building Height", sub: "Total height + Floor-to-Floor height", type: "input" },
      { id: "PH2", label: "Static Head", sub: "Height difference: Source to Highest Outlet", type: "formula" },
      { id: "PH3", label: "Pipe Sizing", sub: "Based on flow rate \u2192 velocity method", type: "process" },
      { id: "PH4", label: "Friction Losses", sub: "Hazen-Williams / Darcy-Weisbach formula", type: "formula" },
      { id: "PH5", label: "Minor Losses", sub: "Fittings + Valves + Bends (K-factor)", type: "formula" },
      { id: "PH6", label: "Residual Pressure", sub: "Min pressure at highest outlet (7\u201310m)", type: "process" },
      { id: "PH7", label: "Total Dynamic Head", sub: "Static + Friction + Minor + Residual", type: "formula" },
      { id: "PH8", label: "Output: Pump Selection", sub: "TDH + Flow Rate \u2192 Pump Model from DB", type: "output" },
    ],
    connections: [
      { from: "PH1", to: "PH2" }, { from: "PH2", to: "PH3" }, { from: "PH3", to: "PH4" },
      { from: "PH4", to: "PH5" }, { from: "PH5", to: "PH6" }, { from: "PH6", to: "PH7" },
      { from: "PH7", to: "PH8" },
    ],
  },
  P3D: {
    title: "Heat Load Calculation",
    icon: "\uD83C\uDF21\uFE0F",
    color: "#ef4444",
    accentBg: "#fee2e2",
    steps: [
      { id: "H1", label: "Input: Area + Location", sub: "Built Up Area + GPS Coordinates", type: "input" },
      { id: "H2", label: "Climate Data Lookup", sub: "DB: Outdoor Temp, Humidity, Solar Gain", type: "process" },
      { id: "H3", label: "Sensible Heat Load", sub: "Wall + Roof + Glass + People + Equipment", type: "formula" },
      { id: "H4", label: "Latent Heat Load", sub: "People + Infiltration + Fresh Air", type: "formula" },
      { id: "H5", label: "Total Cooling Load", sub: "Sensible + Latent + Safety Factor", type: "formula" },
      { id: "H6", label: "TR Calculation", sub: "Total Load \u00f7 3024 = Tonnes of Refrigeration", type: "formula" },
      { id: "H7", label: "Equipment Sizing", sub: "Chiller / VRF / Split AC selection", type: "process" },
      { id: "H8", label: "Output: HVAC Summary", sub: "TR + Equipment \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "H1", to: "H2" }, { from: "H2", to: "H3" }, { from: "H3", to: "H4" },
      { from: "H4", to: "H5" }, { from: "H5", to: "H6" }, { from: "H6", to: "H7" },
      { from: "H7", to: "H8" },
    ],
  },
  P3E: {
    title: "External Storm & Sewer Water Calculation",
    icon: "🌧️",
    color: "#0891b2",
    accentBg: "#cffafe",
    steps: [
      { id: "SW1", label: "Input: Site Data", sub: "Plot Area + Impervious Area + Soil Type", type: "input" },
      { id: "SW2", label: "Rainfall Intensity Lookup", sub: "DB: IDF Curves + Return Period (yrs)", type: "process" },
      { id: "SW3", label: "Runoff Coefficient (C)", sub: "Based on Surface Type + Land Use", type: "formula" },
      { id: "SW4", label: "Storm Water Flow (Q)", sub: "Rational Method: Q = C × I × A / 360", type: "formula" },
      { id: "SW5", label: "Drain Sizing", sub: "Manning's Equation → Pipe / Channel Size", type: "formula" },
      { id: "SW6", label: "Sewer Load Estimation", sub: "Population × Per Capita Sewage + Infiltration", type: "process" },
      { id: "SW7", label: "Sewer Pipe Sizing", sub: "Flow Velocity Check + Min Gradient", type: "formula" },
      { id: "SW8", label: "STP Capacity", sub: "Peak Sewage Flow → STP Plant Sizing", type: "process" },
      { id: "SW9", label: "Rainwater Harvesting Check", sub: "NBC / Local Body Mandate → RWH Tank Size", type: "decision" },
      { id: "SW10", label: "Output: Storm & Sewer Summary", sub: "Drain Sizes + STP + RWH → Space Matrix", type: "output" },
    ],
    connections: [
      { from: "SW1", to: "SW2" }, { from: "SW2", to: "SW3" }, { from: "SW3", to: "SW4" },
      { from: "SW4", to: "SW5" }, { from: "SW5", to: "SW6" }, { from: "SW6", to: "SW7" },
      { from: "SW7", to: "SW8" }, { from: "SW8", to: "SW9" }, { from: "SW9", to: "SW10" },
    ],
  },
  P3T: {
    title: "Transfer Pipe Sizing Calculation",
    icon: "🔧",
    color: "#7c3aed",
    accentBg: "#ede9fe",
    steps: [
      { id: "TP1", label: "Input: Pump Selection Data", sub: "Selected Pump Model + Flow Rate + Head", type: "input" },
      { id: "TP2", label: "Equipment Schedule Review", sub: "All MEP Equipment Locations + Connections", type: "input" },
      { id: "TP3", label: "Flow Rate per Transfer Line", sub: "GPM / LPS from Pump Duty Point", type: "process" },
      { id: "TP4", label: "Velocity Constraint Check", sub: "Target: 1.5–3.0 m/s (Pressure) / 0.6–1.2 m/s (Gravity)", type: "formula" },
      { id: "TP5", label: "Pipe Diameter Calculation", sub: "D = √(4Q / πV) → Round to Standard Size", type: "formula" },
      { id: "TP6", label: "Friction Loss Calculation", sub: "Hazen-Williams / Darcy-Weisbach Method", type: "formula" },
      { id: "TP7", label: "Fitting & Valve Losses", sub: "Equivalent Length Method → Total Minor Losses", type: "formula" },
      { id: "TP8", label: "Total Head Loss Verification", sub: "Static + Friction + Minor ≤ Pump Available Head", type: "decision" },
      { id: "TP9", label: "Material & Insulation Spec", sub: "GI / CPVC / HDPE + Insulation Type per Code", type: "process" },
      { id: "TP10", label: "Output: Pipe Schedule", sub: "Pipe Sizes + Material + Route → BOQ & Drawings", type: "output" },
    ],
    connections: [
      { from: "TP1", to: "TP2" }, { from: "TP2", to: "TP3" }, { from: "TP3", to: "TP4" },
      { from: "TP4", to: "TP5" }, { from: "TP5", to: "TP6" }, { from: "TP6", to: "TP7" },
      { from: "TP7", to: "TP8" }, { from: "TP8", to: "TP9" }, { from: "TP9", to: "TP10" },
    ],
  },
  OWC: {
    title: "OWC Calculations",
    icon: "\u267B\uFE0F",
    color: "#10b981",
    accentBg: "#d1fae5",
    steps: [
      { id: "O1", label: "Input: Population & Waste Data", sub: "Flats \u00d7 Occupancy \u00d7 Waste/person/day", type: "input" },
      { id: "O2", label: "Wet & Dry Waste Estimation", sub: "Segregation ratio from DB norms", type: "process" },
      { id: "O3", label: "OWC Machine Capacity", sub: "Daily organic waste (kg) \u2192 Machine rating", type: "formula" },
      { id: "O4", label: "Output: OWC Sizing", sub: "Machine capacity + Space requirement \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "O1", to: "O2" }, { from: "O2", to: "O3" }, { from: "O3", to: "O4" },
    ],
  },
  STP: {
    title: "STP (Sewage Treatment Plant) Calculations",
    icon: "\uD83C\uDFED",
    color: "#06b6d4",
    accentBg: "#cffafe",
    steps: [
      { id: "ST1", label: "Fetch Domestic Water (DW)", sub: "From Water Demand Tank Flowchart", type: "input" },
      { id: "ST2", label: "Fetch Flushing Water (FW)", sub: "From Water Demand Tank Flowchart", type: "input" },
      { id: "ST3", label: "Sewage from Domestic", sub: "S_dom = DW \u00D7 0.80 (80% Rule)", type: "formula" },
      { id: "ST4", label: "Sewage from Flushing", sub: "S_flush = FW \u00D7 1.00 (100% Rule)", type: "formula" },
      { id: "ST5", label: "Total STP Input", sub: "S_dom + S_flush = Total Sewage (CMD)", type: "process" },
      { id: "ST6", label: "STP Capacity & Area", sub: "Area = Capacity \u00D7 1.0 Sq.M/KLD (incl. FWT)", type: "formula" },
      { id: "ST7", label: "Treated Water Reuse", sub: "Flushing + Irrigation + Sludge + Cooling", type: "process" },
      { id: "ST8", label: "Output: STP Summary", sub: "Sewage, STP Size, Area, Reuse %", type: "output" },
    ],
    connections: [
      { from: "ST1", to: "ST2" }, { from: "ST2", to: "ST3" }, { from: "ST3", to: "ST4" },
      { from: "ST4", to: "ST5" }, { from: "ST5", to: "ST6" }, { from: "ST6", to: "ST7" },
      { from: "ST7", to: "ST8" },
    ],
  },
  DFP: {
    title: "Domestic & Flushing Pump Calculations",
    icon: "\uD83D\uDD27",
    color: "#06b6d4",
    accentBg: "#cffafe",
    steps: [
      { id: "DF1", label: "Input: Building Height & Demand", sub: "Floor count, water demand per floor", type: "input" },
      { id: "DF2", label: "Static Head Calculation", sub: "Height: sump to highest outlet", type: "formula" },
      { id: "DF3", label: "Friction & Minor Losses", sub: "Pipe routing, fittings, valves", type: "formula" },
      { id: "DF4", label: "Total Dynamic Head (TDH)", sub: "Static + Friction + Minor + Residual", type: "formula" },
      { id: "DF5", label: "Flow Rate Calculation", sub: "Peak demand per system", type: "process" },
      { id: "DF6", label: "Pump Selection", sub: "TDH + Flow \u2192 Pump model from DB", type: "process" },
      { id: "DF7", label: "Output: Pump Schedule", sub: "Pump size, motor rating, no. of pumps", type: "output" },
    ],
    connections: [
      { from: "DF1", to: "DF2" }, { from: "DF2", to: "DF3" }, { from: "DF3", to: "DF4" },
      { from: "DF4", to: "DF5" }, { from: "DF5", to: "DF6" }, { from: "DF6", to: "DF7" },
    ],
  },
  VENT: {
    title: "Ventilation Calculations",
    icon: "\uD83C\uDF2C\uFE0F",
    color: "#8b5cf6",
    accentBg: "#ede9fe",
    steps: [
      { id: "V1", label: "Input: Room Data", sub: "Volume, occupancy, activity type", type: "input" },
      { id: "V2", label: "Air Change Rate (ACH)", sub: "NBC / ASHRAE lookup per room type", type: "process" },
      { id: "V3", label: "Fresh Air Requirement", sub: "CFM = Volume \u00d7 ACH / 60", type: "formula" },
      { id: "V4", label: "Duct Sizing", sub: "Equal friction / velocity method", type: "formula" },
      { id: "V5", label: "Fan Selection", sub: "Total CFM + Static pressure \u2192 Fan model", type: "process" },
      { id: "V6", label: "Output: Ventilation Schedule", sub: "Fan sizes + Duct layout \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "V1", to: "V2" }, { from: "V2", to: "V3" }, { from: "V3", to: "V4" },
      { from: "V4", to: "V5" }, { from: "V5", to: "V6" },
    ],
  },
  PRESS: {
    title: "Pressurisation Calculations",
    icon: "\uD83C\uDFD7\uFE0F",
    color: "#14b8a6",
    accentBg: "#ccfbf1",
    steps: [
      { id: "PR1", label: "Input: Stairwell / Lobby Data", sub: "Height, floor area, door leakage area", type: "input" },
      { id: "PR2", label: "Pressure Differential", sub: "NBC norm: 25\u201350 Pa across door", type: "process" },
      { id: "PR3", label: "Leakage Air Calculation", sub: "Q = C\u00d7A\u00d7\u0394P^n", type: "formula" },
      { id: "PR4", label: "Door Open Air Velocity", sub: "Min 0.75 m/s through open door", type: "formula" },
      { id: "PR5", label: "Total Air Flow Required", sub: "Max(leakage, door-open) + safety factor", type: "formula" },
      { id: "PR6", label: "Fan Selection", sub: "CFM + static pressure \u2192 Fan model from DB", type: "process" },
      { id: "PR7", label: "Output: Pressurisation Schedule", sub: "Fan sizes + Shaft details \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "PR1", to: "PR2" }, { from: "PR2", to: "PR3" }, { from: "PR3", to: "PR4" },
      { from: "PR4", to: "PR5" }, { from: "PR5", to: "PR6" }, { from: "PR6", to: "PR7" },
    ],
  },
  FFP: {
    title: "Firefighting Pump Calculations",
    icon: "\uD83D\uDE92",
    color: "#dc2626",
    accentBg: "#fee2e2",
    steps: [
      { id: "FF1", label: "Input: Building Data", sub: "Height, area, occupancy, NBC class", type: "input" },
      { id: "FF2", label: "Hydrant System Demand", sub: "Flow rate + residual pressure per NBC/CFO", type: "process" },
      { id: "FF3", label: "Sprinkler System Demand", sub: "Design density \u00d7 Area of operation", type: "formula" },
      { id: "FF4", label: "Static Head Calculation", sub: "Sump to highest sprinkler/hydrant", type: "formula" },
      { id: "FF5", label: "Friction & Minor Losses", sub: "Hazen-Williams for fire pipe network", type: "formula" },
      { id: "FF6", label: "Pump Duty Point", sub: "Total head + flow for each pump type", type: "formula" },
      { id: "FF7", label: "Jockey Pump Sizing", sub: "Pressure maintenance pump selection", type: "process" },
      { id: "FF8", label: "Output: Fire Pump Schedule", sub: "Hydrant + Sprinkler + Jockey \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "FF1", to: "FF2" }, { from: "FF2", to: "FF3" }, { from: "FF3", to: "FF4" },
      { from: "FF4", to: "FF5" }, { from: "FF5", to: "FF6" }, { from: "FF6", to: "FF7" },
      { from: "FF7", to: "FF8" },
    ],
  },
  FTK: {
    title: "Fire Tank Size Estimation",
    icon: "\uD83D\uDEA8",
    color: "#dc2626",
    accentBg: "#fee2e2",
    steps: [
      { id: "FT1", label: "Fetch Building Data", sub: "Occupancy type, basement area, hazard class", type: "input" },
      { id: "FT2", label: "Standards Lookup", sub: "IS-15105 / NFPA-13 tables from datasheet", type: "process" },
      { id: "FT3", label: "Sprinkler Volume Calc", sub: "Area \u00D7 Flow Rate \u00D7 Duration", type: "formula" },
      { id: "FT4", label: "Hydrant Volume Calc", sub: "1800 LPM \u00D7 Duration", type: "formula" },
      { id: "FT5", label: "Drencher Volume Calc", sub: "Linear length \u00D7 35 L/min/m", type: "formula" },
      { id: "FT6", label: "Safety Decision Gate", sub: "Compare vs 300 m\u00B3 minimum (Ordinary Hazard)", type: "decision" },
      { id: "FT7", label: "Output: Tank Capacity", sub: "Total Fire Water Tank (m\u00B3), Sprinkler & Hydrant demand", type: "output" },
    ],
    connections: [
      { from: "FT1", to: "FT2" }, { from: "FT2", to: "FT3" }, { from: "FT3", to: "FT4" },
      { from: "FT4", to: "FT5" }, { from: "FT5", to: "FT6" }, { from: "FT6", to: "FT7" },
    ],
  },
  FJD: {
    title: "Fire Jockey & Drencher Pump Calculations",
    icon: "\uD83D\uDD27",
    color: "#dc2626",
    accentBg: "#fee2e2",
    steps: [
      { id: "JD1", label: "Fetch System Static Head", sub: "From Main Pump Module + basement run length", type: "input" },
      { id: "JD2", label: "Hydraulic Parameters", sub: "Pipe schedule, friction factors from datasheet", type: "process" },
      { id: "JD3", label: "Jockey Head Loss", sub: "Small-bore pipes (50/80mm) friction calc", type: "formula" },
      { id: "JD4", label: "Drencher Head Loss", sub: "High-volume water curtain supply calc", type: "formula" },
      { id: "JD5", label: "Safety Factor (+20%)", sub: "Apply 1.2\u00D7 to all frictional results", type: "formula" },
      { id: "JD6", label: "System Pressure Summation", sub: "Jockey: +0.5 Bar | Drencher: +3.5 Bar", type: "process" },
      { id: "JD7", label: "Output: Pump Schedule", sub: "Sprinkler Jockey, Hydrant Jockey, Drencher Say values", type: "output" },
    ],
    connections: [
      { from: "JD1", to: "JD2" }, { from: "JD2", to: "JD3" }, { from: "JD3", to: "JD4" },
      { from: "JD4", to: "JD5" }, { from: "JD5", to: "JD6" }, { from: "JD6", to: "JD7" },
    ],
  },
  FTB: {
    title: "Terrace Fire Booster Pump Head",
    icon: "\uD83C\uDFD7\uFE0F",
    color: "#dc2626",
    accentBg: "#fee2e2",
    steps: [
      { id: "TB1", label: "Fetch Building & Tank Data", sub: "Topmost outlet elevation, terrace tank LWL", type: "input" },
      { id: "TB2", label: "Pipe Material & Friction Data", sub: "GI Class C @ 100mm, C=120, 900 LPM", type: "process" },
      { id: "TB3", label: "Hazen-Williams Friction Loss", sub: "Straight run + fittings equivalent lengths", type: "formula" },
      { id: "TB4", label: "Safety Factor (+20%)", sub: "Applied on sum of pipe + fitting losses", type: "formula" },
      { id: "TB5", label: "Total Head Summation", sub: "Friction + Static + Residual (3.5 Bar)", type: "formula" },
      { id: "TB6", label: "Output: Booster Pump Head", sub: "Head in Bar & Meters, rounded Say value", type: "output" },
    ],
    connections: [
      { from: "TB1", to: "TB2" }, { from: "TB2", to: "TB3" }, { from: "TB3", to: "TB4" },
      { from: "TB4", to: "TB5" }, { from: "TB5", to: "TB6" },
    ],
  },
  RWH: {
    title: "Rainwater Harvesting & Tank Sizing",
    icon: "\uD83C\uDF27\uFE0F",
    color: "#3b82f6",
    accentBg: "#dbeafe",
    steps: [
      { id: "RW1", label: "Catchment Input", sub: "Area name, sqm, surface type (C=0.95/0.30)", type: "input" },
      { id: "RW2", label: "Hydrology Input", sub: "Peak rainfall intensity (mm/hr)", type: "input" },
      { id: "RW3", label: "Yield Engine", sub: "Peak runoff Q + harvestable volume V", type: "formula" },
      { id: "RW4", label: "RWDP Downcomer Sizing", sub: "Pipe dia \u2192 NBC 2016 table check", type: "process" },
      { id: "RW5", label: "Collector & Velocity Guard", sub: "Manning\u2019s eqn, V < 0.5 siltation alarm", type: "formula" },
      { id: "RW6", label: "Tank Sizing (NBC 2016)", sub: "Standard capacities, min retention vs user", type: "process" },
      { id: "RW7", label: "Output: RWH Dashboard", sub: "Peak flow, volume, pipe schedule, tank dims", type: "output" },
    ],
    connections: [
      { from: "RW1", to: "RW2" }, { from: "RW2", to: "RW3" }, { from: "RW3", to: "RW4" },
      { from: "RW4", to: "RW5" }, { from: "RW5", to: "RW6" }, { from: "RW6", to: "RW7" },
    ],
  },
  SWD: {
    title: "Storm Water Drainage Hydraulic Calculator",
    icon: "\u{1F30A}",
    color: "#3b82f6",
    accentBg: "#dbeafe",
    steps: [
      { id: "SW1", label: "Input: Catchment & Coefficients", sub: "Area, runoff coeff (C), intensity (I)", type: "input" },
      { id: "SW2", label: "Rational Method Runoff", sub: "Q = (C \u00D7 I \u00D7 Area) / 3600", type: "formula" },
      { id: "SW3", label: "Design Parameters", sub: "Pipe slope (S), Manning\u2019s n", type: "input" },
      { id: "SW4", label: "Pipe/Channel Sizing", sub: "Required diameter + flow velocity", type: "formula" },
      { id: "SW5", label: "Velocity Monitor", sub: "V \u2265 0.5? Safe vs Siltation Alarm", type: "decision" },
      { id: "SW6", label: "Capacity Check", sub: "Q_cap > Q_peak verification", type: "process" },
      { id: "SW7", label: "Output: SWD Schedule", sub: "Pipe dia, velocity, carrying capacity", type: "output" },
    ],
    connections: [
      { from: "SW1", to: "SW2" }, { from: "SW2", to: "SW3" }, { from: "SW3", to: "SW4" },
      { from: "SW4", to: "SW5" }, { from: "SW5", to: "SW6" }, { from: "SW6", to: "SW7" },
    ],
  },
};

// =====================================================================
// CALCULATION DETAIL OVERLAY COMPONENT
// =====================================================================
function downloadCalcPNG(containerRef: React.RefObject<HTMLDivElement | null>, title: string) {
  const container = containerRef.current;
  if (!container) return;
  const svgEl = container.querySelector("svg") as SVGSVGElement | null;
  if (!svgEl) {
    alert("Calculation SVG not found.");
    return;
  }

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  // Get real dimensions from viewBox or bounding rect
  const vb = svgEl.viewBox?.baseVal;
  const w = (vb && vb.width > 0) ? vb.width : svgEl.getBoundingClientRect().width;
  const h = (vb && vb.height > 0) ? vb.height : svgEl.getBoundingClientRect().height;

  const scale = 3;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  // Remove width:100% style that custom SVGs use
  clone.style.width = "";
  clone.style.display = "block";

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const safeName = title.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      a.download = `${safeName}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, "image/png");

    URL.revokeObjectURL(url);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert("Failed to render PNG. Try again.");
  };
  img.src = url;
}

function CalcDetailOverlay({ calcId, onClose }: { calcId: string; onClose: () => void }) {
  const flow = CALC_FLOWS[calcId];
  const svgContainerRef = useRef<HTMLDivElement | null>(null);
  if (!flow) return null;

  const nodeW2 = 260;
  const nodeH2 = 60;
  const gap2 = 36;
  const px2 = 50;
  const py2 = 30;
  const totalH = py2 + flow.steps.length * (nodeH2 + gap2) + 20;
  const totalW = nodeW2 + px2 * 2;

  const typeColors: Record<string, { bg: string; bd: string; icon: string }> = {
    input:    { bg: "#dbeafe", bd: "#3b82f6", icon: "\u{1F4E5}" },
    process:  { bg: "#d1fae5", bd: "#10b981", icon: "\u2699\uFE0F" },
    formula:  { bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83E\uddEE" },
    output:   { bg: "#fef3c7", bd: "#f59e0b", icon: "\u{1F4E4}" },
    decision: { bg: "#ffe4e6", bd: "#f43f5e", icon: "\u2753" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          top: "1vh",
          left: "1vw",
          right: "1vw",
          bottom: "1vh",
          backgroundColor: "#fff",
          border: `3px solid ${flow.color}`,
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: flow.color }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "24px" }}>{flow.icon}</span>
            <div>
              <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>{flow.title}</h2>
              <p className="text-white" style={{ fontSize: "12px", opacity: 0.75, margin: 0 }}>
                Detailed Algorithm Flow — Click outside or press ESC to close
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadCalcPNG(svgContainerRef, flow.title)}
              className="flex items-center gap-1.5 rounded-full hover:opacity-80 transition-opacity px-3"
              style={{
                height: 36,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
              title="Download as PNG"
            >
              ⬇ PNG
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
              style={{
                width: 36, height: 36,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: "18px",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-3 border-b flex-wrap" style={{ borderColor: "#e5e7eb" }}>
          {calcId === "P3A" ? (
            <>
              {[
                { label: "System Step", bg: "#dbeafe", bd: "#2563eb", icon: "\uD83D\uDDC3\uFE0F" },
                { label: "User Decision", bg: "#fff7ed", bd: "#ea580c", icon: "\u25C7" },
                { label: "Final Output", bg: "#d1fae5", bd: "#059669", icon: "\uD83D\uDCCA" },
                { label: "Formula / Calc", bg: "#ede9fe", bd: "#7c3aed", icon: "\uD83E\uddEE" },
                { label: "DB Fetch", bg: "#cffafe", bd: "#0891b2", icon: "\uD83D\uDDC3" },
                { label: "Warning", bg: "#ffe4e6", bd: "#e11d48", icon: "\u26A0\uFE0F" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="rounded" style={{ width: 14, height: 14, backgroundColor: item.bg, border: `1.5px solid ${item.bd}` }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{item.icon} {item.label}</span>
                </div>
              ))}
            </>
          ) : calcId === "P3B" ? (
            <>
              {[
                { label: "Entry / Input", bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDCE5" },
                { label: "Decision", bg: "#fef3c7", bd: "#f59e0b", icon: "\u25C7" },
                { label: "Section Header", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83D\uDCC2" },
                { label: "DB Fetch", bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDDC3" },
                { label: "Formula", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83E\uddEE" },
                { label: "Override / Confirm", bg: "#fef3c7", bd: "#f59e0b", icon: "\u2705" },
                { label: "Aggregate", bg: "#d1fae5", bd: "#10b981", icon: "\u2211" },
                { label: "Category Card", bg: "#cffafe", bd: "#06b6d4", icon: "\uD83D\uDCC4" },
                { label: "Sizing Output", bg: "#ffe4e6", bd: "#f43f5e", icon: "\u26A1" },
                { label: "Dashboard", bg: "#d1fae5", bd: "#10b981", icon: "\uD83D\uDCCA" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="rounded" style={{ width: 14, height: 14, backgroundColor: item.bg, border: `1.5px solid ${item.bd}` }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{item.icon} {item.label}</span>
                </div>
              ))}
            </>
          ) : ["OWC","STP","FFP","FTK","FJD","FTB","RWH","SWD"].includes(calcId) ? (
            <>
              {[
                { label: "Entry", bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDCE5" },
                { label: "Database", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83D\uDDC3" },
                { label: "Process", bg: "#cffafe", bd: "#06b6d4", icon: "\u2699\uFE0F" },
                { label: "Formula", bg: "#fef3c7", bd: "#f59e0b", icon: "\uD83E\uddEE" },
                { label: "Table", bg: "#f1f5f9", bd: "#64748b", icon: "\uD83D\uDCC4" },
                { label: "Output", bg: "#d1fae5", bd: "#10b981", icon: "\uD83D\uDCCA" },
                { label: "Logic Note", bg: "#ffe4e6", bd: "#f43f5e", icon: "\uD83D\uDCA1" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="rounded" style={{ width: 14, height: 14, backgroundColor: item.bg, border: `1.5px solid ${item.bd}` }} />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>{item.icon} {item.label}</span>
                </div>
              ))}
            </>
          ) : (
            Object.entries(typeColors).map(([type, c]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="rounded" style={{ width: 14, height: 14, backgroundColor: c.bg, border: `1.5px solid ${c.bd}` }} />
                <span style={{ fontSize: "11px", color: "#64748b", textTransform: "capitalize" as const }}>{c.icon} {type}</span>
              </div>
            ))
          )}
        </div>

        {/* Scrollable SVG Flow */}
        <div className="overflow-auto flex-1" ref={svgContainerRef}>
          {calcId === "P3A" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <WaterDemandCalcSVG />
            </div>
          ) : calcId === "P3B" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <ElectricalLoadCalcSVG />
            </div>
          ) : calcId === "OWC" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <OWCCalcSVG />
            </div>
          ) : calcId === "STP" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <STPCalcSVG />
            </div>
          ) : calcId === "FFP" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <FirePumpHeadCalcSVG />
            </div>
          ) : calcId === "FTK" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <FireTankCalcSVG />
            </div>
          ) : calcId === "FJD" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <FireJockeyDrencherCalcSVG />
            </div>
          ) : calcId === "FTB" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <TerraceBoosterCalcSVG />
            </div>
          ) : calcId === "RWH" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <RWHCalcSVG />
            </div>
          ) : calcId === "SWD" ? (
            <div style={{ minWidth: "1600px", padding: "10px 0" }}>
              <SWDCalcSVG />
            </div>
          ) : (
            /* Generic linear flow for other calculations */
            <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} style={{ display: "block", margin: "0 auto" }}>
              <defs>
                <marker id="calc-arrow" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={flow.color} />
                </marker>
              </defs>

              {/* Connections */}
              {flow.connections.map((conn, i) => {
                const fi = flow.steps.findIndex((s) => s.id === conn.from);
                const ti = flow.steps.findIndex((s) => s.id === conn.to);
                if (fi < 0 || ti < 0) return null;
                const cy1 = py2 + fi * (nodeH2 + gap2) + nodeH2;
                const cy2 = py2 + ti * (nodeH2 + gap2);
                const ccx = px2 + nodeW2 / 2;
                return (
                  <g key={i}>
                    <line x1={ccx} y1={cy1} x2={ccx} y2={cy2}
                      stroke={flow.color} strokeWidth={2} markerEnd="url(#calc-arrow)" opacity={0.6} />
                    {conn.label && (
                      <text x={ccx + 10} y={(cy1 + cy2) / 2 + 3} fill={flow.color} fontSize={9} fontWeight={600}>
                        {conn.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {flow.steps.map((step, i) => {
                const sx = px2;
                const sy = py2 + i * (nodeH2 + gap2);
                const tc = typeColors[step.type];
                const cxN = sx + nodeW2 / 2;
                return (
                  <g key={step.id}>
                    {/* Step number circle */}
                    <circle cx={sx - 16} cy={sy + nodeH2 / 2} r={12} fill={flow.color} />
                    <text x={sx - 16} y={sy + nodeH2 / 2 + 4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>
                      {i + 1}
                    </text>
                    {/* Node box */}
                    <rect x={sx} y={sy} width={nodeW2} height={nodeH2} rx={10}
                      fill={tc.bg} stroke={tc.bd} strokeWidth={2} />
                    {/* Type badge */}
                    <rect x={sx + nodeW2 - 58} y={sy + 4} width={52} height={16} rx={8}
                      fill={tc.bd} opacity={0.85} />
                    <text x={sx + nodeW2 - 32} y={sy + 15} textAnchor="middle"
                      fill="#fff" fontSize={7.5} fontWeight={600} style={{ textTransform: "uppercase" as const }}>
                      {step.type}
                    </text>
                    {/* Label */}
                    <text x={cxN - 10} y={sy + 26} textAnchor="middle" fill="#1e293b" fontSize={12} fontWeight={700}>
                      {step.label}
                    </text>
                    {/* Sub */}
                    <text x={cxN} y={sy + 44} textAnchor="middle" fill="#64748b" fontSize={9.5}>
                      {step.sub.length > 50 ? step.sub.slice(0, 48) + "\u2026" : step.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// =====================================================================
// MAIN COMPONENT
// =====================================================================
export function ConceptStageChart() {
  const { pos, H, W } = computeLayout();
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  // ESC key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCalc(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleCalcClick = useCallback((id: string) => {
    setActiveCalc(id);
  }, []);

  return (
    <div className="overflow-auto relative">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }} className="concept-chart-svg">
        <defs>
          <marker id="ma" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.arrow} />
          </marker>
          <marker id="mr" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.reject} />
          </marker>
          <marker id="mm" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CL.merge} />
          </marker>
          {/* Animated dashed glow for clickable calc nodes */}
          <style>{`
            .calc-glow {
              animation: calcPulse 2s ease-in-out infinite;
            }
            @keyframes calcPulse {
              0%, 100% { opacity: 0.2; stroke-dashoffset: 0; }
              50% { opacity: 0.6; stroke-dashoffset: 12; }
            }
          `}</style>
        </defs>

        {/* Layer 0: Phase background bands */}
        {BAND_DEFS.map((b, i) => {
          const fp = pos[b.firstNode], lp = pos[b.lastNode];
          if (!fp || !lp) return null;
          const ln = NM[b.lastNode];
          const lh = ln ? nodeH(ln) : NH;
          const by = fp.y - 18;
          const bh = (lp.y + lh) - fp.y + 36;
          return (
            <g key={i}>
              <rect x={4} y={by} width={W - 8} height={bh} rx={12}
                fill={`${b.color}08`} stroke={`${b.color}20`} strokeWidth={1} strokeDasharray="6,4" />
              <text x={14} y={by + 14} fill={b.color} fontSize={8.5} fontWeight={700} opacity={0.45} letterSpacing={0.8}>
                {b.label}
              </text>
            </g>
          );
        })}

        {/* Layer 1: Connections (below nodes) */}
        {CN.map((c, i) => <DrawConn key={`${c.from}-${c.to}-${i}`} c={c} pos={pos} W={W} />)}

        {/* Layer 1.5: Tree diagram for A1 ↔ segments ↔ A2M */}
        <DrawTreeDiagram pos={pos} />

        {/* Layer 1.6: Service tree diagram for P3 ↔ service cards ↔ SVCM */}
        <DrawServiceTree pos={pos} />

        {/* Layer 2: Nodes ON TOP */}
        {NODES.filter((n) => n.type !== "note" && pos[n.id]).map((n) => (
          <DrawNode
            key={n.id}
            n={n}
            x={pos[n.id].x}
            y={pos[n.id].y}
            onClick={CALC_NODE_IDS.has(n.id) ? () => handleCalcClick(n.id) : undefined}
            onCalcItemClick={SVC_NODE_IDS.has(n.id) ? handleCalcClick : undefined}
          />
        ))}

        {/* Layer 3: Note Annotations */}
        {ANNS.map((a) => {
          const pp = pos[a.pid];
          const nn = NM[a.nid];
          if (!pp || !nn) return null;
          return <DrawNode key={a.nid} n={nn} x={pp.x + a.dx} y={pp.y + a.dy} />;
        })}
      </svg>

      {/* Calculation Detail Overlay */}
      <AnimatePresence>
        {activeCalc && (
          <CalcDetailOverlay
            key={activeCalc}
            calcId={activeCalc}
            onClose={() => setActiveCalc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}