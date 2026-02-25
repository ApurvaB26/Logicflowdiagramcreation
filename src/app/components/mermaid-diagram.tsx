import React from "react";

// ==========================================
// TYPES
// ==========================================
interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  type: "process" | "decision" | "terminal";
  step?: number;
  borderColor: string;
  bgColor: string;
  textColor: string;
  isHeader?: boolean;
}

interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  type: "normal" | "handshake" | "reject";
  handshakeColor?: string;
  handshakeLabel?: string;
}

interface StageData {
  nodes: FlowNode[];
  layout: string[][];
  connections: FlowConnection[];
  title: string;
  titleColor: string;
  description: string;
  icon: string;
}

// ==========================================
// COLOR PALETTE
// ==========================================
const C = {
  blue:     { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af", header: "#3b82f6" },
  green:    { bg: "#d1fae5", border: "#10b981", text: "#065f46", header: "#10b981" },
  purple:   { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6", header: "#8b5cf6" },
  cyan:     { bg: "#cffafe", border: "#06b6d4", text: "#155e75", header: "#06b6d4" },
  orange:   { bg: "#fed7aa", border: "#f97316", text: "#9a3412", header: "#f97316" },
  teal:     { bg: "#ccfbf1", border: "#14b8a6", text: "#134e4a", header: "#14b8a6" },
  violet:   { bg: "#e8d5ff", border: "#a78bfa", text: "#4c1d95", header: "#a78bfa" },
  decision: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" },
  terminal: { bg: "#059669", border: "#34d399", text: "#ffffff" },
  arrow:    "#94a3b8",
  reject:   "#ef4444",
  handshake:"#3b82f6",
};

// Node builders
const bp = (id: string, label: string, sublabel: string, color: typeof C.blue, step: number, isHeader = false): FlowNode => ({
  id, label, sublabel, type: "process", step,
  bgColor: isHeader ? color.header : color.bg,
  borderColor: color.border,
  textColor: isHeader ? "#ffffff" : color.text,
  isHeader,
});
const dd = (id: string, label: string, sublabel: string, step: number): FlowNode => ({
  id, label, sublabel, type: "decision", step,
  bgColor: C.decision.bg, borderColor: C.decision.border, textColor: C.decision.text,
});
const tt = (id: string, label: string, sublabel: string, step: number): FlowNode => ({
  id, label, sublabel, type: "terminal", step,
  bgColor: C.terminal.bg, borderColor: C.terminal.border, textColor: C.terminal.text,
});

// ==========================================
// STAGE 0: OVERVIEW
// ==========================================
const overviewNodes: FlowNode[] = [
  bp("OV_START", "MEP Digital Ecosystem", "8-Step Pipeline Overview", C.green, 0, true),
  bp("OV_A1", "Architectural Input", "IFC/Revit Files", C.blue, 0),
  bp("OV_A2", "Building Codes", "Regulations Database", C.blue, 0),
  dd("OV_D1", "Files Valid?", "Code Compliance", 0),
  bp("OV_B1", "Space Planning", "Zone Allocation", C.green, 0),
  bp("OV_B2", "Calculation Engine", "ASHRAE Standards", C.green, 0),
  dd("OV_D2", "Constraints OK?", "Tolerance Check", 0),
  bp("OV_C1", "Generative Design", "AI MEP Routing", C.purple, 0),
  bp("OV_C2", "BOQ & Equipment", "3D Model Cross-Ref", C.purple, 0),
  dd("OV_D3", "Approved?", "Budget & Specs", 0),
  bp("OV_E1", "Consultant Review", "Compliance Check", C.blue, 0),
  bp("OV_E2", "Vendor Procurement", "RFQ Generation", C.blue, 0),
  dd("OV_D4", "Complete?", "Final Gate", 0),
  tt("OV_END", "PROJECT DELIVERED", "Site Execution Complete", 0),
];
const overviewLayout: string[][] = [
  ["OV_START"], ["OV_A1", "OV_A2"], ["OV_D1"], ["OV_B1", "OV_B2"], ["OV_D2"],
  ["OV_C1", "OV_C2"], ["OV_D3"], ["OV_E1", "OV_E2"], ["OV_D4"], ["OV_END"],
];
const overviewConnections: FlowConnection[] = [
  { from: "OV_START", to: "OV_A1", type: "normal" }, { from: "OV_START", to: "OV_A2", type: "normal" },
  { from: "OV_A1", to: "OV_D1", type: "normal" }, { from: "OV_A2", to: "OV_D1", type: "normal" },
  { from: "OV_D1", to: "OV_B1", label: "Yes", type: "normal" }, { from: "OV_D1", to: "OV_A1", label: "No", type: "reject" },
  { from: "OV_B1", to: "OV_D2", type: "normal" }, { from: "OV_B2", to: "OV_D2", type: "normal" },
  { from: "OV_D1", to: "OV_B2", type: "normal" },
  { from: "OV_D2", to: "OV_C1", label: "Yes", type: "normal" }, { from: "OV_D2", to: "OV_B1", label: "No", type: "reject" },
  { from: "OV_C1", to: "OV_D3", type: "normal" }, { from: "OV_C2", to: "OV_D3", type: "normal" },
  { from: "OV_D2", to: "OV_C2", type: "normal" },
  { from: "OV_D3", to: "OV_E1", label: "Yes", type: "normal" }, { from: "OV_D3", to: "OV_C1", label: "No", type: "reject" },
  { from: "OV_E1", to: "OV_D4", type: "normal" }, { from: "OV_E2", to: "OV_D4", type: "normal" },
  { from: "OV_D3", to: "OV_E2", type: "normal" },
  { from: "OV_D4", to: "OV_END", label: "Yes", type: "normal" }, { from: "OV_D4", to: "OV_E1", label: "No", type: "reject" },
];

// ==========================================
// STAGE 1: CONCEPT STAGE
// ==========================================
const conceptNodes: FlowNode[] = [
  bp("CS_START", "CONCEPT STAGE", "Dual-Track Initiation", C.blue, 1, true),
  bp("CS_A1", "TRACK A: Input Matrix", "Architectural Data", C.blue, 1, true),
  bp("CS_A2", "Project Core", "Type/Category/Plot/FSI/BUA", C.blue, 1),
  bp("CS_A3", "Building Specs", "Height/Floor-to-Floor/Buildings", C.blue, 1),
  bp("CS_A4", "Flat Matrix", "Editable DB Typology + Qty", C.blue, 1),
  bp("CS_A5", "Site Data", "Landscape/Parks/GPS Coords", C.blue, 1),
  bp("CS_A6", "Society Formation", "Create & Group Towers", C.blue, 1),
  bp("CS_B1", "TRACK B: Deliverables", "Design Timeline", C.blue, 1, true),
  bp("CS_B2", "Stage Selector", "Concept > Schematic > Detailed", C.blue, 1),
  bp("CS_B3", "Policy DB Lookup", "Auto-generate Dates", C.blue, 1),
  bp("CS_B4", "Drawing Checklist", "Stage Gatekeeping", C.blue, 1),
  dd("CS_B5", "All Complete?", "Lock Next Stage", 1),
  bp("CS_P2", "PHASE 2: Policy Integration", "Calculations Engine", C.green, 1, true),
  bp("CS_P2_1", "MEP Policy Fetch", "Electrical/Plumbing/Fire", C.green, 1),
  bp("CS_P2_2", "Dynamic Calculations", "Water/Electrical/Pump/Heat", C.green, 1),
  bp("CS_P2_3", "Location Logic", "GPS > MSEDCL/KSEDCL Format", C.green, 1),
  bp("CS_P2_4", "Output Generation", "Lodha/MOEF/NBC Formats", C.green, 1),
  bp("CS_P2_5", "Equipment Automation", "Pump DB Lookup & Suggestion", C.green, 1),
  bp("CS_P3", "PHASE 3: Space Matrix", "MEP Planning Loop", C.purple, 1, true),
  bp("CS_P3_1", "Space Matrix Table", "Auto-filled + User Editable", C.purple, 1),
  bp("CS_P3_2", "Detailed Space Planning", "UGT/STP/OWC/Sub/DG/Lifts", C.purple, 1),
  dd("CS_P3_3", "Height > 90m?", "Fire Break Floor Check", 1),
  bp("CS_P3_4", "Fire Break/UGT", "CFO or NBC Standards", C.purple, 1),
  bp("CS_P3_5", "Ventilation Planning", "Toilet Vent/Pressurization", C.purple, 1),
  bp("CS_P4", "PHASE 4: Arch Convergence", "Master Plan Integration", C.cyan, 1, true),
  bp("CS_P4_1", "Master Plan Intake", "Architect Incorporates MEP", C.cyan, 1),
  bp("CS_P4_2", "MEP Final Review", "Equipment Layout Finalization", C.cyan, 1),
  tt("CS_P4_3", "Concept Plan Complete", "Final Floor Plans", 1),
];
const conceptLayout: string[][] = [
  ["CS_START"], ["CS_A1", "CS_B1"], ["CS_A2", "CS_B2"], ["CS_A3", "CS_B3"],
  ["CS_A4", "CS_B4"], ["CS_A5", "CS_B5"], ["CS_A6"],
  ["CS_P2"], ["CS_P2_1", "CS_P2_2", "CS_P2_3", "CS_P2_4", "CS_P2_5"],
  ["CS_P3"], ["CS_P3_1"], ["CS_P3_2"], ["CS_P3_3"], ["CS_P3_4"], ["CS_P3_5"],
  ["CS_P4"], ["CS_P4_1", "CS_P4_2"], ["CS_P4_3"],
];
const conceptConnections: FlowConnection[] = [
  { from: "CS_START", to: "CS_A1", type: "normal" }, { from: "CS_START", to: "CS_B1", type: "normal" },
  { from: "CS_A1", to: "CS_A2", type: "normal" }, { from: "CS_A2", to: "CS_A3", type: "normal" },
  { from: "CS_A3", to: "CS_A4", type: "normal" }, { from: "CS_A4", to: "CS_A5", type: "normal" },
  { from: "CS_A5", to: "CS_A6", type: "normal" },
  { from: "CS_B1", to: "CS_B2", type: "normal" }, { from: "CS_B2", to: "CS_B3", type: "normal" },
  { from: "CS_B3", to: "CS_B4", type: "normal" }, { from: "CS_B4", to: "CS_B5", type: "normal" },
  { from: "CS_A6", to: "CS_P2", type: "normal" },
  { from: "CS_B5", to: "CS_P2", type: "handshake", handshakeColor: "#3b82f6", handshakeLabel: "Tracks Merge" },
  { from: "CS_P2", to: "CS_P2_1", type: "normal" }, { from: "CS_P2", to: "CS_P2_2", type: "normal" },
  { from: "CS_P2", to: "CS_P2_3", type: "normal" }, { from: "CS_P2", to: "CS_P2_4", type: "normal" },
  { from: "CS_P2", to: "CS_P2_5", type: "normal" },
  { from: "CS_P2_1", to: "CS_P3", type: "normal" }, { from: "CS_P2_2", to: "CS_P3", type: "normal" },
  { from: "CS_P2_3", to: "CS_P3", type: "normal" }, { from: "CS_P2_4", to: "CS_P3", type: "normal" },
  { from: "CS_P2_5", to: "CS_P3", type: "normal" },
  { from: "CS_P3", to: "CS_P3_1", type: "normal" }, { from: "CS_P3_1", to: "CS_P3_2", type: "normal" },
  { from: "CS_P3_2", to: "CS_P3_3", type: "normal" },
  { from: "CS_P3_3", to: "CS_P3_4", label: "Yes", type: "normal" },
  { from: "CS_P3_3", to: "CS_P3_5", label: "No", type: "reject" },
  { from: "CS_P3_4", to: "CS_P4", type: "normal" },
  { from: "CS_P3_5", to: "CS_P4", type: "handshake", handshakeColor: "#8b5cf6", handshakeLabel: "Paths Merge" },
  { from: "CS_P4", to: "CS_P4_1", type: "normal" }, { from: "CS_P4", to: "CS_P4_2", type: "normal" },
  { from: "CS_P4_1", to: "CS_P4_3", type: "normal" }, { from: "CS_P4_2", to: "CS_P4_3", type: "normal" },
];

// ==========================================
// STAGE 2: SCHEMATIC STAGE
// ==========================================
const schematicNodes: FlowNode[] = [
  bp("SCH_START", "SCHEMATIC STAGE", "Design Development", C.purple, 2, true),
  bp("SCH_A1", "Concept Handoff Review", "Validate Concept Outputs", C.purple, 2),
  bp("SCH_A2", "MEP Load Schedules", "Electrical/Plumbing/HVAC", C.blue, 2),
  bp("SCH_A3", "Architectural Updates", "Floor Plan Revisions", C.blue, 2),
  bp("SCH_A4", "Structural Coordination", "Beam/Column Clearance", C.blue, 2),
  bp("SCH_B1", "PHASE 2: System Design", "Schematic Development", C.green, 2, true),
  bp("SCH_B2", "HVAC System Layout", "AHU/FCU/Chiller Routing", C.green, 2),
  bp("SCH_B3", "Electrical SLD Design", "Panel Schedules & Circuits", C.green, 2),
  bp("SCH_B4", "Plumbing Riser Design", "Stack & Riser Diagrams", C.green, 2),
  bp("SCH_B5", "Fire Protection Layout", "Sprinkler & Hydrant Zones", C.green, 2),
  bp("SCH_C1", "PHASE 3: Integration", "Cross-Discipline Check", C.purple, 2, true),
  bp("SCH_C2", "Clash Detection", "Preliminary BIM Check", C.purple, 2),
  dd("SCH_C3", "Clashes Resolved?", "Inter-Service Conflicts", 2),
  bp("SCH_C4", "Revision Cycle", "Re-route & Adjust", C.purple, 2),
  bp("SCH_D1", "PHASE 4: Consultant Review", "External Validation", C.cyan, 2, true),
  bp("SCH_D2", "Design Submission", "Package for Review", C.cyan, 2),
  dd("SCH_D3", "Approved?", "Consultant Sign-off", 2),
  tt("SCH_D4", "Schematic Complete", "Approved Design Package", 2),
];
const schematicLayout: string[][] = [
  ["SCH_START"], ["SCH_A1"], ["SCH_A2", "SCH_A3", "SCH_A4"],
  ["SCH_B1"], ["SCH_B2", "SCH_B3", "SCH_B4", "SCH_B5"],
  ["SCH_C1"], ["SCH_C2"], ["SCH_C3"], ["SCH_C4"],
  ["SCH_D1"], ["SCH_D2"], ["SCH_D3"], ["SCH_D4"],
];
const schematicConnections: FlowConnection[] = [
  { from: "SCH_START", to: "SCH_A1", type: "normal" },
  { from: "SCH_A1", to: "SCH_A2", type: "normal" }, { from: "SCH_A1", to: "SCH_A3", type: "normal" },
  { from: "SCH_A1", to: "SCH_A4", type: "normal" },
  { from: "SCH_A2", to: "SCH_B1", type: "normal" }, { from: "SCH_A3", to: "SCH_B1", type: "normal" },
  { from: "SCH_A4", to: "SCH_B1", type: "normal" },
  { from: "SCH_B1", to: "SCH_B2", type: "normal" }, { from: "SCH_B1", to: "SCH_B3", type: "normal" },
  { from: "SCH_B1", to: "SCH_B4", type: "normal" }, { from: "SCH_B1", to: "SCH_B5", type: "normal" },
  { from: "SCH_B2", to: "SCH_C1", type: "normal" }, { from: "SCH_B3", to: "SCH_C1", type: "normal" },
  { from: "SCH_B4", to: "SCH_C1", type: "normal" }, { from: "SCH_B5", to: "SCH_C1", type: "normal" },
  { from: "SCH_C1", to: "SCH_C2", type: "normal" }, { from: "SCH_C2", to: "SCH_C3", type: "normal" },
  { from: "SCH_C3", to: "SCH_C4", label: "No", type: "reject" },
  { from: "SCH_C3", to: "SCH_D1", label: "Yes", type: "normal" },
  { from: "SCH_C4", to: "SCH_B1", type: "handshake", handshakeColor: "#8b5cf6", handshakeLabel: "Revise Design" },
  { from: "SCH_D1", to: "SCH_D2", type: "normal" }, { from: "SCH_D2", to: "SCH_D3", type: "normal" },
  { from: "SCH_D3", to: "SCH_D4", label: "Yes", type: "normal" },
  { from: "SCH_D3", to: "SCH_C1", label: "No", type: "reject" },
];

// ==========================================
// STAGE 3: DETAILED DESIGN
// ==========================================
const detailedNodes: FlowNode[] = [
  bp("DET_START", "DETAILED DESIGN STAGE", "Technical Documentation", C.orange, 3, true),
  bp("DET_A1", "Schematic Handoff", "Approved Package Import", C.orange, 3),
  dd("DET_A2", "Scope Validation", "Check Completeness", 3),
  bp("DET_B1", "PHASE 2: Discipline Design", "Parallel Track Processing", C.orange, 3, true),
  bp("DET_B2", "HVAC Detailed Design", "Duct Sizing/Equipment", C.blue, 3),
  bp("DET_B3", "Electrical Detailed", "Cable Tray/Conduit/Panel", C.blue, 3),
  bp("DET_B4", "Plumbing Detailed", "Pipe Routing/Fixtures", C.blue, 3),
  bp("DET_B5", "Fire Services Detailed", "Sprinkler/Alarm/Hydrant", C.blue, 3),
  bp("DET_B6", "LV Systems Design", "BMS/CCTV/Access Control", C.blue, 3),
  bp("DET_C1", "PHASE 3: BIM Coordination", "3D Model Integration", C.green, 3, true),
  bp("DET_C2", "Combined Model Build", "Federated MEP Model", C.green, 3),
  bp("DET_C3", "Clash Detection Run", "Navisworks/Solibri Check", C.green, 3),
  dd("DET_C4", "Zero Clashes?", "All Conflicts Resolved", 3),
  bp("DET_C5", "Clash Resolution", "Prioritize & Re-route", C.green, 3),
  bp("DET_D1", "PHASE 4: Documentation", "Drawing Production", C.purple, 3, true),
  bp("DET_D2", "Floor-wise Drawings", "Plan/Section/Detail Sheets", C.purple, 3),
  bp("DET_D3", "Equipment Schedules", "Specs & Data Sheets", C.purple, 3),
  bp("DET_D4", "BOQ Generation", "Quantity Take-off", C.purple, 3),
  bp("DET_E1", "PHASE 5: Final Review", "Quality Assurance", C.cyan, 3, true),
  bp("DET_E2", "Internal QA Check", "Standards Compliance", C.cyan, 3),
  dd("DET_E3", "QA Passed?", "Review Gate", 3),
  bp("DET_E4", "Consultant Approval", "External Sign-off", C.cyan, 3),
  tt("DET_E5", "Detailed Design Complete", "IFC Ready Package", 3),
];
const detailedLayout: string[][] = [
  ["DET_START"], ["DET_A1"], ["DET_A2"], ["DET_B1"],
  ["DET_B2", "DET_B3", "DET_B4", "DET_B5", "DET_B6"],
  ["DET_C1"], ["DET_C2"], ["DET_C3"], ["DET_C4"], ["DET_C5"],
  ["DET_D1"], ["DET_D2", "DET_D3", "DET_D4"],
  ["DET_E1"], ["DET_E2"], ["DET_E3"], ["DET_E4"], ["DET_E5"],
];
const detailedConnections: FlowConnection[] = [
  { from: "DET_START", to: "DET_A1", type: "normal" }, { from: "DET_A1", to: "DET_A2", type: "normal" },
  { from: "DET_A2", to: "DET_B1", label: "Yes", type: "normal" },
  { from: "DET_A2", to: "DET_A1", label: "No", type: "reject" },
  { from: "DET_B1", to: "DET_B2", type: "normal" }, { from: "DET_B1", to: "DET_B3", type: "normal" },
  { from: "DET_B1", to: "DET_B4", type: "normal" }, { from: "DET_B1", to: "DET_B5", type: "normal" },
  { from: "DET_B1", to: "DET_B6", type: "normal" },
  { from: "DET_B2", to: "DET_C1", type: "normal" }, { from: "DET_B3", to: "DET_C1", type: "normal" },
  { from: "DET_B4", to: "DET_C1", type: "normal" }, { from: "DET_B5", to: "DET_C1", type: "normal" },
  { from: "DET_B6", to: "DET_C1", type: "normal" },
  { from: "DET_C1", to: "DET_C2", type: "normal" }, { from: "DET_C2", to: "DET_C3", type: "normal" },
  { from: "DET_C3", to: "DET_C4", type: "normal" },
  { from: "DET_C4", to: "DET_D1", label: "Yes", type: "normal" },
  { from: "DET_C4", to: "DET_C5", label: "No", type: "normal" },
  { from: "DET_C5", to: "DET_B1", type: "handshake", handshakeColor: "#10b981", handshakeLabel: "Re-design Loop" },
  { from: "DET_D1", to: "DET_D2", type: "normal" }, { from: "DET_D1", to: "DET_D3", type: "normal" },
  { from: "DET_D1", to: "DET_D4", type: "normal" },
  { from: "DET_D2", to: "DET_E1", type: "normal" }, { from: "DET_D3", to: "DET_E1", type: "normal" },
  { from: "DET_D4", to: "DET_E1", type: "normal" },
  { from: "DET_E1", to: "DET_E2", type: "normal" }, { from: "DET_E2", to: "DET_E3", type: "normal" },
  { from: "DET_E3", to: "DET_E4", label: "Yes", type: "normal" },
  { from: "DET_E3", to: "DET_D1", label: "No", type: "reject" },
  { from: "DET_E4", to: "DET_E5", type: "normal" },
];

// ==========================================
// STAGE 4: TENDER
// ==========================================
const tenderNodes: FlowNode[] = [
  bp("TEN_START", "TENDER STAGE", "Procurement & Bidding", C.teal, 4, true),
  bp("TEN_A1", "Design Package Review", "IFC Drawing Validation", C.teal, 4),
  bp("TEN_A2", "BOQ Finalization", "Quantity Verification", C.teal, 4),
  dd("TEN_A3", "Spec Sheets Ready?", "Equipment Specifications", 4),
  bp("TEN_B1", "PHASE 2: RFQ Generation", "Vendor Outreach", C.blue, 4, true),
  bp("TEN_B2", "HVAC RFQ Package", "AHU/Chiller/Ductwork", C.blue, 4),
  bp("TEN_B3", "Electrical RFQ Package", "Panels/Cables/Fixtures", C.blue, 4),
  bp("TEN_B4", "Plumbing RFQ Package", "Pipes/Pumps/Fixtures", C.blue, 4),
  bp("TEN_B5", "Fire Services RFQ", "Sprinklers/Alarms/Pumps", C.blue, 4),
  bp("TEN_C1", "PHASE 3: Bid Collection", "Vendor Response Portal", C.green, 4, true),
  bp("TEN_C2", "Technical Evaluation", "Spec Compliance Check", C.green, 4),
  bp("TEN_C3", "Commercial Evaluation", "Price Comparison Matrix", C.green, 4),
  dd("TEN_C4", "Bids Acceptable?", "Budget & Quality Gate", 4),
  bp("TEN_C5", "Re-tender / Negotiate", "Revised Terms", C.green, 4),
  bp("TEN_D1", "PHASE 4: Contract Award", "Vendor Selection", C.purple, 4, true),
  bp("TEN_D2", "LOI / Work Order", "Letter of Intent", C.purple, 4),
  bp("TEN_D3", "Lead-Time Tracking", "Delivery Schedule Setup", C.purple, 4),
  tt("TEN_D4", "Tender Stage Complete", "Procurement Finalized", 4),
];
const tenderLayout: string[][] = [
  ["TEN_START"], ["TEN_A1", "TEN_A2"], ["TEN_A3"], ["TEN_B1"],
  ["TEN_B2", "TEN_B3", "TEN_B4", "TEN_B5"],
  ["TEN_C1"], ["TEN_C2", "TEN_C3"], ["TEN_C4"], ["TEN_C5"],
  ["TEN_D1"], ["TEN_D2", "TEN_D3"], ["TEN_D4"],
];
const tenderConnections: FlowConnection[] = [
  { from: "TEN_START", to: "TEN_A1", type: "normal" }, { from: "TEN_START", to: "TEN_A2", type: "normal" },
  { from: "TEN_A1", to: "TEN_A3", type: "normal" }, { from: "TEN_A2", to: "TEN_A3", type: "normal" },
  { from: "TEN_A3", to: "TEN_B1", label: "Yes", type: "normal" },
  { from: "TEN_A3", to: "TEN_A1", label: "No", type: "reject" },
  { from: "TEN_B1", to: "TEN_B2", type: "normal" }, { from: "TEN_B1", to: "TEN_B3", type: "normal" },
  { from: "TEN_B1", to: "TEN_B4", type: "normal" }, { from: "TEN_B1", to: "TEN_B5", type: "normal" },
  { from: "TEN_B2", to: "TEN_C1", type: "normal" }, { from: "TEN_B3", to: "TEN_C1", type: "normal" },
  { from: "TEN_B4", to: "TEN_C1", type: "normal" }, { from: "TEN_B5", to: "TEN_C1", type: "normal" },
  { from: "TEN_C1", to: "TEN_C2", type: "normal" }, { from: "TEN_C1", to: "TEN_C3", type: "normal" },
  { from: "TEN_C2", to: "TEN_C4", type: "normal" }, { from: "TEN_C3", to: "TEN_C4", type: "normal" },
  { from: "TEN_C4", to: "TEN_D1", label: "Yes", type: "normal" },
  { from: "TEN_C4", to: "TEN_C5", label: "No", type: "reject" },
  { from: "TEN_C5", to: "TEN_B1", type: "handshake", handshakeColor: "#14b8a6", handshakeLabel: "Re-tender Loop" },
  { from: "TEN_D1", to: "TEN_D2", type: "normal" }, { from: "TEN_D1", to: "TEN_D3", type: "normal" },
  { from: "TEN_D2", to: "TEN_D4", type: "normal" }, { from: "TEN_D3", to: "TEN_D4", type: "normal" },
];

// ==========================================
// STAGE 5: VFC
// ==========================================
const vfcNodes: FlowNode[] = [
  bp("VFC_START", "VFC STAGE", "Value for Construction", C.violet, 5, true),
  bp("VFC_A1", "Tender Package Handoff", "Approved Drawings & BOQ", C.violet, 5),
  bp("VFC_A2", "Shop Drawing Review", "Vendor Submissions", C.blue, 5),
  bp("VFC_A3", "Material Approval", "Sample & Spec Verification", C.blue, 5),
  dd("VFC_A4", "Submissions OK?", "Technical Compliance", 5),
  bp("VFC_B1", "PHASE 2: Site Execution", "Installation & Monitoring", C.green, 5, true),
  bp("VFC_B2", "Installation Progress", "Floor-wise Tracking", C.green, 5),
  bp("VFC_B3", "Site Inspection", "Quality Checkpoints", C.green, 5),
  bp("VFC_B4", "RFI Processing", "Site Query Resolution", C.green, 5),
  dd("VFC_B5", "Quality Approved?", "Inspection Gate", 5),
  bp("VFC_B6", "Rework Required", "Deficiency Resolution", C.green, 5),
  bp("VFC_C1", "PHASE 3: T&C", "Testing & Commissioning", C.purple, 5, true),
  bp("VFC_C2", "System Testing", "Pressure/Flow/Load Tests", C.purple, 5),
  bp("VFC_C3", "Commissioning Report", "Performance Validation", C.purple, 5),
  dd("VFC_C4", "Systems Pass?", "Commissioning Gate", 5),
  bp("VFC_D1", "PHASE 4: Handover", "As-Built Documentation", C.cyan, 5, true),
  bp("VFC_D2", "As-Built Drawings", "Final Record Documents", C.cyan, 5),
  bp("VFC_D3", "O&M Manuals", "Operation & Maintenance", C.cyan, 5),
  tt("VFC_D4", "Project Delivered", "Final Handover Complete", 5),
];
const vfcLayout: string[][] = [
  ["VFC_START"], ["VFC_A1"], ["VFC_A2", "VFC_A3"], ["VFC_A4"],
  ["VFC_B1"], ["VFC_B2", "VFC_B3", "VFC_B4"], ["VFC_B5"], ["VFC_B6"],
  ["VFC_C1"], ["VFC_C2", "VFC_C3"], ["VFC_C4"],
  ["VFC_D1"], ["VFC_D2", "VFC_D3"], ["VFC_D4"],
];
const vfcConnections: FlowConnection[] = [
  { from: "VFC_START", to: "VFC_A1", type: "normal" },
  { from: "VFC_A1", to: "VFC_A2", type: "normal" }, { from: "VFC_A1", to: "VFC_A3", type: "normal" },
  { from: "VFC_A2", to: "VFC_A4", type: "normal" }, { from: "VFC_A3", to: "VFC_A4", type: "normal" },
  { from: "VFC_A4", to: "VFC_B1", label: "Yes", type: "normal" },
  { from: "VFC_A4", to: "VFC_A2", label: "No", type: "reject" },
  { from: "VFC_B1", to: "VFC_B2", type: "normal" }, { from: "VFC_B1", to: "VFC_B3", type: "normal" },
  { from: "VFC_B1", to: "VFC_B4", type: "normal" },
  { from: "VFC_B2", to: "VFC_B5", type: "normal" }, { from: "VFC_B3", to: "VFC_B5", type: "normal" },
  { from: "VFC_B4", to: "VFC_B5", type: "normal" },
  { from: "VFC_B5", to: "VFC_C1", label: "Yes", type: "normal" },
  { from: "VFC_B5", to: "VFC_B6", label: "No", type: "reject" },
  { from: "VFC_B6", to: "VFC_B1", type: "handshake", handshakeColor: "#a78bfa", handshakeLabel: "Rework Loop" },
  { from: "VFC_C1", to: "VFC_C2", type: "normal" }, { from: "VFC_C1", to: "VFC_C3", type: "normal" },
  { from: "VFC_C2", to: "VFC_C4", type: "normal" }, { from: "VFC_C3", to: "VFC_C4", type: "normal" },
  { from: "VFC_C4", to: "VFC_D1", label: "Yes", type: "normal" },
  { from: "VFC_C4", to: "VFC_C1", label: "No", type: "reject" },
  { from: "VFC_D1", to: "VFC_D2", type: "normal" }, { from: "VFC_D1", to: "VFC_D3", type: "normal" },
  { from: "VFC_D2", to: "VFC_D4", type: "normal" }, { from: "VFC_D3", to: "VFC_D4", type: "normal" },
];

// ==========================================
// STAGE MAP
// ==========================================
const stageDataMap: Record<number, StageData> = {
  0: { nodes: overviewNodes, layout: overviewLayout, connections: overviewConnections, title: "Pipeline Overview", titleColor: C.green.header, description: "High-level 8-step MEP pipeline from input to delivery", icon: "🔍" },
  1: { nodes: conceptNodes, layout: conceptLayout, connections: conceptConnections, title: "Concept Stage", titleColor: C.blue.header, description: "Dual-track initiation with input matrix and deliverables timeline", icon: "📋" },
  2: { nodes: schematicNodes, layout: schematicLayout, connections: schematicConnections, title: "Schematic Stage", titleColor: C.purple.header, description: "System design development with cross-discipline integration", icon: "⚙️" },
  3: { nodes: detailedNodes, layout: detailedLayout, connections: detailedConnections, title: "Detailed Design", titleColor: C.orange.header, description: "Complete technical documentation with BIM coordination", icon: "📦" },
  4: { nodes: tenderNodes, layout: tenderLayout, connections: tenderConnections, title: "Tender Stage", titleColor: C.teal.header, description: "Procurement bidding, evaluation and contract award", icon: "🛒" },
  5: { nodes: vfcNodes, layout: vfcLayout, connections: vfcConnections, title: "VFC Stage", titleColor: C.violet.header, description: "Value for construction: execution, T&C and handover", icon: "🏗️" },
};

// ==========================================
// LAYOUT ENGINE
// ==========================================
const NODE_W = 200;
const NODE_H = 64;
const ROW_GAP = 120;
const COL_GAP = 60;
const PADDING_X = 100;
const PADDING_TOP = 40;

function computeLayout(layout: string[][]) {
  const positions: Record<string, { x: number; y: number }> = {};
  let y = PADDING_TOP;
  const maxRowWidth = Math.max(...layout.map(row => row.length * NODE_W + (row.length - 1) * COL_GAP));
  for (const row of layout) {
    const totalWidth = row.length * NODE_W + (row.length - 1) * COL_GAP;
    const startX = PADDING_X + (maxRowWidth - totalWidth) / 2;
    for (let i = 0; i < row.length; i++) {
      positions[row[i]] = { x: startX + i * (NODE_W + COL_GAP), y };
    }
    y += ROW_GAP;
  }
  const totalHeight = layout.length * ROW_GAP + PADDING_TOP + 60;
  const totalWidth = maxRowWidth + PADDING_X * 2;
  return { positions, totalHeight, totalWidth };
}

// ==========================================
// SVG RENDERING
// ==========================================
function NodeShape({ node, positions }: { node: FlowNode; positions: Record<string, { x: number; y: number }> }) {
  const pos = positions[node.id];
  if (!pos) return null;

  if (node.type === "decision") {
    const cx = pos.x + NODE_W / 2;
    const cy = pos.y + NODE_H / 2;
    const rx = NODE_W / 2 + 10;
    const ry = NODE_H / 2 + 8;
    return (
      <g>
        <polygon
          points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`}
          fill={node.bgColor} stroke={node.borderColor} strokeWidth={2}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={node.textColor} fontSize={11} fontWeight={600}>{node.label}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={node.textColor} fontSize={10} opacity={0.8}>{node.sublabel}</text>
      </g>
    );
  }

  if (node.type === "terminal") {
    return (
      <g>
        <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx={NODE_H / 2} fill={node.bgColor} stroke={node.borderColor} strokeWidth={2.5} />
        <text x={pos.x + NODE_W / 2} y={pos.y + NODE_H / 2 - 6} textAnchor="middle" fill={node.textColor} fontSize={12} fontWeight={700}>{node.label}</text>
        <text x={pos.x + NODE_W / 2} y={pos.y + NODE_H / 2 + 10} textAnchor="middle" fill={node.textColor} fontSize={11} opacity={0.9}>{node.sublabel}</text>
      </g>
    );
  }

  return (
    <g>
      <rect x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx={8} fill={node.bgColor} stroke={node.borderColor} strokeWidth={node.isHeader ? 2.5 : 1.5} />
      <text x={pos.x + NODE_W / 2} y={pos.y + NODE_H / 2 - 6} textAnchor="middle" fill={node.textColor} fontSize={11} fontWeight={node.isHeader ? 700 : 500}>{node.label}</text>
      <text x={pos.x + NODE_W / 2} y={pos.y + NODE_H / 2 + 10} textAnchor="middle" fill={node.textColor} fontSize={10} opacity={0.7}>{node.sublabel}</text>
    </g>
  );
}

function ConnectionLine({ conn, positions, nodes, markerIds }: {
  conn: FlowConnection;
  positions: Record<string, { x: number; y: number }>;
  nodes: FlowNode[];
  markerIds: { arrow: string; red: string; hs: string };
}) {
  const fromPos = positions[conn.from];
  const toPos = positions[conn.to];
  if (!fromPos || !toPos) return null;
  const fromNode = nodes.find(n => n.id === conn.from);
  const toNode = nodes.find(n => n.id === conn.to);
  if (!fromNode || !toNode) return null;

  const fromCx = fromPos.x + NODE_W / 2;
  const fromCy = fromPos.y + NODE_H / 2;
  const toCx = toPos.x + NODE_W / 2;
  const toCy = toPos.y + NODE_H / 2;

  let x1 = fromCx, y1 = fromPos.y + NODE_H;
  let x2 = toCx, y2 = toPos.y;

  if (fromNode.type === "decision") y1 = fromCy + (NODE_H / 2 + 8);
  if (toNode.type === "decision") y2 = toCy - (NODE_H / 2 + 8);

  if (conn.type === "reject") {
    const goingUp = toCy < fromCy;
    const goingSide = Math.abs(toCx - fromCx) > 10;
    if (goingUp || goingSide) {
      x1 = fromPos.x + NODE_W + (fromNode.type === "decision" ? 10 : 0);
      y1 = fromCy;
      x2 = toPos.x + NODE_W;
      y2 = toCy;
      const offsetX = 60;
      const path = `M${x1},${y1} C${x1 + offsetX},${y1} ${x2 + offsetX},${y2} ${x2},${y2}`;
      return (
        <g>
          <path d={path} fill="none" stroke={C.reject} strokeWidth={1.5} strokeDasharray="6,4" markerEnd={`url(#${markerIds.red})`} opacity={0.8} />
          {conn.label && <text x={(x1 + x2) / 2 + offsetX} y={(y1 + y2) / 2} fill={C.reject} fontSize={10} fontWeight={600} textAnchor="middle" opacity={0.9}>{conn.label}</text>}
        </g>
      );
    }
  }

  if (conn.type === "handshake") {
    const offsetX = toCx < fromCx ? -80 : 80;
    x1 = toCx < fromCx ? fromPos.x : fromPos.x + NODE_W;
    y1 = fromCy;
    x2 = toCx < fromCx ? toPos.x + NODE_W : toPos.x;
    y2 = toCy;
    const path = `M${x1},${y1} C${x1 + offsetX},${y1} ${x2 + offsetX},${y2} ${x2},${y2}`;
    return (
      <g>
        <path d={path} fill="none" stroke={conn.handshakeColor || C.handshake} strokeWidth={1.5} strokeDasharray="8,4" markerEnd={`url(#${markerIds.hs})`} opacity={0.8} />
        {conn.handshakeLabel && <text x={(x1 + x2) / 2 + (offsetX / 2)} y={(y1 + y2) / 2 - 8} fill={conn.handshakeColor || C.handshake} fontSize={10} fontWeight={600} textAnchor="middle" opacity={0.9}>{conn.handshakeLabel}</text>}
      </g>
    );
  }

  const horizontalOffset = Math.abs(toCx - fromCx);
  if (horizontalOffset < 5) {
    return (
      <g>
        <path d={`M${x1},${y1} L${x2},${y2}`} fill="none" stroke={C.arrow} strokeWidth={1.5} markerEnd={`url(#${markerIds.arrow})`} />
        {conn.label && <text x={x1 + 15} y={(y1 + y2) / 2} fill="#475569" fontSize={10} fontWeight={500} textAnchor="start">{conn.label}</text>}
      </g>
    );
  } else {
    const midY = (y1 + y2) / 2;
    const path = `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
    return (
      <g>
        <path d={path} fill="none" stroke={C.arrow} strokeWidth={1.5} markerEnd={`url(#${markerIds.arrow})`} />
        {conn.label && <text x={(x1 + x2) / 2} y={midY - 6} fill="#475569" fontSize={10} fontWeight={500} textAnchor="middle">{conn.label}</text>}
      </g>
    );
  }
}

// ==========================================
// STAGE CARD
// ==========================================
function StageCard({ stageData, stageKey }: { stageData: StageData; stageKey: string }) {
  const lr = computeLayout(stageData.layout);
  const aid = `a-${stageKey}`;
  const rid = `r-${stageKey}`;
  const hid = `h-${stageKey}`;
  return (
    <div className="overflow-hidden" style={{ display: "inline-block" }}>
      <svg
        width={lr.totalWidth}
        height={lr.totalHeight}
        viewBox={`0 0 ${lr.totalWidth} ${lr.totalHeight}`}
        style={{ display: "block" }}
      >
        <defs>
          <marker id={aid} viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
          </marker>
          <marker id={rid} viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reject} />
          </marker>
          <marker id={hid} viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.handshake} />
          </marker>
        </defs>
        {stageData.connections.map((conn, i) => (
          <ConnectionLine key={`${conn.from}-${conn.to}-${i}`} conn={conn} positions={lr.positions} nodes={stageData.nodes} markerIds={{ arrow: aid, red: rid, hs: hid }} />
        ))}
        {stageData.nodes.map(node => (
          <NodeShape key={node.id} node={node} positions={lr.positions} />
        ))}
      </svg>
    </div>
  );
}

// ==========================================
// SECTION WRAPPER for each stage
// ==========================================
function StageSection({
  stageData,
  stageKey,
  stageIndex,
  refCallback,
}: {
  stageData: StageData;
  stageKey: string;
  stageIndex: number;
  refCallback: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={refCallback} className="scroll-mt-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shadow-sm border"
          style={{
            background: `${stageData.titleColor}15`,
            borderColor: `${stageData.titleColor}30`,
          }}
        >
          {stageData.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2
              className="text-[15px]"
              style={{ color: stageData.titleColor }}
            >
              {stageIndex === 0 ? "Overview" : `Stage ${stageIndex}`}: {stageData.title}
            </h2>
            <div
              className="px-2 py-0.5 rounded-full text-[10px]"
              style={{
                background: `${stageData.titleColor}15`,
                color: stageData.titleColor,
                border: `1px solid ${stageData.titleColor}30`,
              }}
            >
              {stageData.nodes.length} nodes
            </div>
          </div>
          <p className="text-[12px] text-[#94a3b8]">{stageData.description}</p>
        </div>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-xl border shadow-sm overflow-auto"
        style={{ borderColor: `${stageData.titleColor}25` }}
      >
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${stageData.titleColor}, ${stageData.titleColor}40)` }}
        />
        <div className="p-4 flex justify-center">
          <StageCard stageData={stageData} stageKey={stageKey} />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN EXPORT: All stages on one page
// ==========================================
interface AllStagesDiagramProps {
  stageRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

export function AllStagesDiagram({ stageRefs }: AllStagesDiagramProps) {
  const stageIds = [0, 1, 2, 3, 4, 5];

  return (
    <div style={{ padding: "32px 40px", minWidth: 800 }}>
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-[22px] text-[#0f172a] mb-1">
          MEP Digital Ecosystem — Complete Workflow
        </h1>
        <p className="text-[13px] text-[#94a3b8]">
          All stages rendered on a single view &middot; Overview + 5 project stages + final delivery
        </p>
      </div>

      {/* Stage Pills */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {stageIds.map((id) => {
          const sd = stageDataMap[id];
          return (
            <div
              key={id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
              style={{
                background: `${sd.titleColor}10`,
                borderColor: `${sd.titleColor}30`,
              }}
            >
              <span className="text-[14px]">{sd.icon}</span>
              <span className="text-[11px]" style={{ color: sd.titleColor }}>
                {sd.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* All Stage Sections */}
      <div className="space-y-10">
        {stageIds.map((id) => (
          <StageSection
            key={id}
            stageData={stageDataMap[id]}
            stageKey={`stage-${id}`}
            stageIndex={id}
            refCallback={(el) => { stageRefs.current[id] = el; }}
          />
        ))}

        {/* Final Delivery Card */}
        <div
          ref={(el) => { stageRefs.current[99] = el; }}
          className="scroll-mt-4"
        >
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[20px] shadow-sm border bg-emerald-50 border-emerald-200">
              ✅
            </div>
            <div>
              <h2 className="text-[15px] text-emerald-600">Final Delivery Gate</h2>
              <p className="text-[12px] text-[#94a3b8]">Project completion checkpoint and handover</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #059669, #34d39966)" }} />
            <div className="p-6 flex justify-center">
              <svg width={500} height={220} viewBox="0 0 500 220">
                <defs>
                  <marker id="arrowFinal" viewBox="0 0 10 10" refX={10} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.arrow} />
                  </marker>
                </defs>
                <polygon points="250,10 340,55 250,100 160,55" fill={C.decision.bg} stroke={C.decision.border} strokeWidth={2} />
                <text x={250} y={50} textAnchor="middle" fill={C.decision.text} fontSize={12} fontWeight={600}>Stage Complete?</text>
                <text x={250} y={66} textAnchor="middle" fill={C.decision.text} fontSize={10} opacity={0.7}>Final Review</text>
                <path d="M210,80 L140,140" fill="none" stroke={C.arrow} strokeWidth={1.5} markerEnd="url(#arrowFinal)" />
                <path d="M290,80 L360,140" fill="none" stroke={C.arrow} strokeWidth={1.5} markerEnd="url(#arrowFinal)" />
                <rect x={50} y={145} width={180} height={55} rx={8} fill={C.blue.bg} stroke={C.blue.border} strokeWidth={1.5} />
                <text x={140} y={168} textAnchor="middle" fill={C.blue.text} fontSize={12} fontWeight={500}>Archive Documents</text>
                <text x={140} y={184} textAnchor="middle" fill={C.blue.text} fontSize={10} opacity={0.7}>Record Management</text>
                <rect x={270} y={145} width={180} height={55} rx={8} fill={C.green.bg} stroke={C.green.border} strokeWidth={1.5} />
                <text x={360} y={168} textAnchor="middle" fill={C.green.text} fontSize={12} fontWeight={500}>Handover Package</text>
                <text x={360} y={184} textAnchor="middle" fill={C.green.text} fontSize={10} opacity={0.7}>Client Delivery</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center pb-8">
        <p className="text-[11px] text-[#cbd5e1]">
          MEP Digital Ecosystem &middot; 8-Step Workflow Architecture &middot; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

// Export for code panel
export const MERMAID_DEFINITION = `graph TB
    %% ===== CONCEPT STAGE =====
    CS_START["CONCEPT STAGE - Dual-Track Initiation"]
    CS_A1["TRACK A: Input Matrix"] --> CS_A2["Project Core"]
    CS_B1["TRACK B: Deliverables"] --> CS_B2["Stage Selector"]
    CS_P2["PHASE 2: Policy Integration"]
    CS_P3["PHASE 3: Space Matrix"]
    CS_P3_3{"Height > 90m?"}
    CS_P4["PHASE 4: Arch Convergence"]
    CS_P4_3(["Concept Plan Complete"])

    %% ===== SCHEMATIC STAGE =====
    SCH_START["SCHEMATIC STAGE"]
    SCH_B2["HVAC Layout"] & SCH_B3["Electrical SLD"] & SCH_B4["Plumbing Riser"] & SCH_B5["Fire Protection"]
    SCH_C3{"Clashes Resolved?"}
    SCH_D4(["Schematic Complete"])

    %% ===== DETAILED DESIGN STAGE =====
    DET_START["DETAILED DESIGN"]
    DET_B2["HVAC"] & DET_B3["Electrical"] & DET_B4["Plumbing"] & DET_B5["Fire"] & DET_B6["LV Systems"]
    DET_C4{"Zero Clashes?"}
    DET_E5(["Detailed Design Complete"])

    %% ===== TENDER STAGE =====
    TEN_START["TENDER STAGE"]
    TEN_B2["HVAC RFQ"] & TEN_B3["Electrical RFQ"] & TEN_B4["Plumbing RFQ"] & TEN_B5["Fire RFQ"]
    TEN_C4{"Bids Acceptable?"}
    TEN_D4(["Tender Complete"])

    %% ===== VFC STAGE =====
    VFC_START["VFC STAGE"]
    VFC_A4{"Submissions OK?"}
    VFC_B5{"Quality Approved?"}
    VFC_C4{"Systems Pass?"}
    VFC_D4(["Project Delivered"])

    classDef blue fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    classDef green fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46
    classDef purple fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6
    classDef orange fill:#fed7aa,stroke:#f97316,stroke-width:2px,color:#9a3412
    classDef teal fill:#ccfbf1,stroke:#14b8a6,stroke-width:2px,color:#134e4a
    classDef violet fill:#e8d5ff,stroke:#a78bfa,stroke-width:2px,color:#4c1d95
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef complete fill:#059669,stroke:#34d399,stroke-width:3px,color:#fff
`;
