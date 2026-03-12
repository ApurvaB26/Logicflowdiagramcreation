import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { CableSizingCalcSVG } from "./cable-sizing-calc";
import { PipeSizingCalcSVG } from "./pipe-sizing-calc";
import { DomesticFlushingPumpCalcSVG } from "./domestic-flushing-pump-calc";
import { PRVCalcSVG } from "./prv-calc";
import {
  Zap,
  Droplets,
  Wind,
  Flame,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
} from "lucide-react";

// =====================================================================
// SERVICE DEFINITIONS
// =====================================================================
interface Calculation {
  id: string;
  title: string;
  description: string;
  status: "ready" | "coming-soon";
  stage: "concept" | "detailed";
}

const STAGE_META: Record<string, { label: string; color: string; bg: string }> = {
  concept:  { label: "Concept Stage",         color: "#3b82f6", bg: "#dbeafe" },
  detailed: { label: "Detailed Design Stage", color: "#8b5cf6", bg: "#ede9fe" },
};

interface Service {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  colorLight: string;
  colorDark: string;
  calculations: Calculation[];
}

const SERVICES: Service[] = [
  {
    id: "electrical",
    title: "Electrical Calculations",
    subtitle: "Power distribution, load analysis & equipment sizing \u2014 All Stages",
    icon: <Zap className="w-7 h-7" />,
    color: "#f59e0b",
    colorLight: "#fef3c7",
    colorDark: "#92400e",
    calculations: [
      // ── Concept Stage ──
      { id: "P3B", title: "Electrical Load Calculations", description: "Supply norms, apartment/common/MLCP loads, transformer & DG sizing", status: "ready", stage: "concept" },
      // ── Detailed Design Stage ──
      { id: "DD_CB", title: "Cable Sizing Calculation", description: "IS 3961/IEC 60502 current rating, voltage drop & short circuit withstand", status: "ready", stage: "detailed" },
      { id: "DD_PNL", title: "Panel Schedule Design", description: "R-Y-B phase balancing, MCB/MCCB selection per circuit", status: "coming-soon", stage: "detailed" },
      { id: "DD_SLD", title: "SLD (Single Line Diagram)", description: "Transformer to outgoing feeders, protection coordination", status: "coming-soon", stage: "detailed" },
      { id: "DD_ERT", title: "Earthing Design", description: "IS 3043 electrode sizing, soil resistivity, earth pit layout", status: "coming-soon", stage: "detailed" },
      { id: "DD_LTN", title: "Lightning Protection", description: "IS/IEC 62305 risk assessment, rolling sphere & mesh method", status: "coming-soon", stage: "detailed" },
      { id: "DD_BUS", title: "Bus Bar Sizing", description: "Max demand current rating, Cu/Al selection from tables", status: "coming-soon", stage: "detailed" },
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing Calculations",
    subtitle: "Water supply, drainage & pipe sizing \u2014 All Stages",
    icon: <Droplets className="w-7 h-7" />,
    color: "#3b82f6",
    colorLight: "#dbeafe",
    colorDark: "#1e40af",
    calculations: [
      // ── Concept Stage ──
      { id: "P3A", title: "Water Demand Calculations", description: "Population estimate, per capita demand, tank sizing & peak hour factor", status: "ready", stage: "concept" },
      { id: "OWC", title: "OWC Calculations", description: "Waste generation, bin sizing, garbage room & OWC capacity (CPHEEO/NBC)", status: "ready", stage: "concept" },
      { id: "STP", title: "STP Calculations", description: "Sewage generation (80/100 rule), STP sizing, area & treated water reuse", status: "ready", stage: "concept" },
      { id: "DFP", title: "Pump Head & Flow Rate Calculation", description: "Input gathering, flow rate Q by system type, head & pressure loss analysis, pump sizing & procurement schedule", status: "ready", stage: "concept" },
      { id: "P3E", title: "External Sewer & Storm Calculations", description: "Storm water flow, sewer pipe sizing, STP capacity & rainwater harvesting", status: "coming-soon", stage: "concept" },
      { id: "RWH", title: "Rainwater Harvesting & Tank Sizing", description: "Catchment runoff, downcomer sizing, velocity guard & NBC 2016 tank sizing", status: "ready", stage: "concept" },
      { id: "SWD", title: "Storm Water Drainage Calculator", description: "Rational method runoff, Manning's equation, velocity monitoring & pipe sizing", status: "ready", stage: "concept" },
      // ── Detailed Design Stage ──
      { id: "DD_PIP", title: "Transfer Pipe Sizing", description: "Hunter's method, velocity check, IS 2065 standard pipe diameter calc", status: "ready", stage: "detailed" },
      { id: "DD_PRV", title: "PRV Calculations", description: "Pressure gradient, zone logic, PRV reset mapping, riser sizing & WSFU diversity", status: "ready", stage: "detailed" },
    ],
  },
  {
    id: "hvac",
    title: "HVAC Calculations",
    subtitle: "Heating, ventilation & air conditioning design \u2014 All Stages",
    icon: <Wind className="w-7 h-7" />,
    color: "#8b5cf6",
    colorLight: "#ede9fe",
    colorDark: "#5b21b6",
    calculations: [
      // ── Concept Stage ──
      { id: "P3D", title: "Heat Load Calculations", description: "Sensible & latent heat, cooling load, TR calculation & equipment sizing", status: "coming-soon", stage: "concept" },
      { id: "VENT", title: "Ventilation Calculations", description: "Air change rate, duct sizing & fresh air requirements", status: "coming-soon", stage: "concept" },
      { id: "PRESS", title: "Pressurisation Calculations", description: "Stairwell & lobby pressurisation system design", status: "coming-soon", stage: "concept" },
      // ── Detailed Design Stage ──
      { id: "DD_DCT", title: "Duct Sizing", description: "Equal friction / velocity method, duct schedule per floor", status: "coming-soon", stage: "detailed" },
      { id: "DD_EQP", title: "Equipment Selection", description: "Chiller/AHU/FCU selection from manufacturer data", status: "coming-soon", stage: "detailed" },
      { id: "DD_VAV", title: "VAV/FCU Selection", description: "Variable air volume & fan coil unit sizing per zone", status: "coming-soon", stage: "detailed" },
      { id: "DD_BMS", title: "BMS Integration", description: "Building management system points list & architecture", status: "coming-soon", stage: "detailed" },
      { id: "DD_SMK", title: "Smoke Management", description: "Smoke extraction fan sizing & pressurisation calc", status: "coming-soon", stage: "detailed" },
    ],
  },
  {
    id: "firefighting",
    title: "Firefighting Calculations",
    subtitle: "Fire protection system design & pump sizing \u2014 All Stages",
    icon: <Flame className="w-7 h-7" />,
    color: "#ef4444",
    colorLight: "#fee2e2",
    colorDark: "#991b1b",
    calculations: [
      // ── Concept Stage ──
      { id: "FFP", title: "Fire Pump Head Calculations", description: "Static head, Hazen-Williams friction, system pressure & multi-zone pump output", status: "ready", stage: "concept" },
      { id: "FTK", title: "Fire Tank Size Estimation", description: "IS-15105/NFPA-13 standards, sprinkler/hydrant/drencher volume & 300m\u00B3 safety gate", status: "ready", stage: "concept" },
      { id: "FJD", title: "Jockey & Drencher Pump Calculations", description: "Jockey/drencher head loss, 20% safety factor & system pressure summation", status: "ready", stage: "concept" },
      { id: "FTB", title: "Terrace Fire Booster Pump Head", description: "Hazen-Williams friction, pipe fittings, static head & residual pressure calc", status: "ready", stage: "concept" },

      // ── Detailed Design Stage ──
      { id: "DD_SPR", title: "Sprinkler Hydraulic Calc", description: "K-factor, design density, hydraulic calc & pipe network sizing", status: "coming-soon", stage: "detailed" },
      { id: "DD_HYD", title: "Hydrant Layout", description: "Hydrant spacing, hose reel coverage & pipe sizing", status: "coming-soon", stage: "detailed" },
      { id: "DD_DET", title: "Detection System", description: "Smoke/heat detector spacing, zone layout & panel sizing", status: "coming-soon", stage: "detailed" },
      { id: "DD_PAV", title: "PA/VA System", description: "Public address & voice alarm speaker layout & wiring", status: "coming-soon", stage: "detailed" },
      { id: "DD_SMX", title: "Smoke Exhaust", description: "Smoke extraction fan sizing & exhaust duct layout", status: "coming-soon", stage: "detailed" },
    ],
  },
];

// =====================================================================
// GENERIC PLACEHOLDER CALC FLOWS (for coming-soon calculations)
// =====================================================================
interface CalcFlow {
  title: string;
  icon: string;
  color: string;
  accentBg: string;
  steps: { id: string; label: string; sub: string; type: string }[];
  connections: { from: string; to: string; label?: string }[];
}

const GENERIC_FLOWS: Record<string, CalcFlow> = {
  OWC: {
    title: "OWC Calculations",
    icon: "\u267B\uFE0F",
    color: "#10b981",
    accentBg: "#d1fae5",
    steps: [
      { id: "O1", label: "Input: Population & Waste Data", sub: "No. of flats x Occupancy x Waste/person/day", type: "input" },
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
      { id: "ST6", label: "STP Capacity & Area", sub: "Area = Capacity \u00D7 1.0 Sq.M/KLD", type: "formula" },
      { id: "ST7", label: "Treated Water Reuse", sub: "Flushing + Irrigation + Sludge + Cooling", type: "process" },
      { id: "ST8", label: "Output: STP Summary", sub: "Sewage, STP Size, Area, Reuse %", type: "output" },
    ],
    connections: [
      { from: "ST1", to: "ST2" }, { from: "ST2", to: "ST3" }, { from: "ST3", to: "ST4" },
      { from: "ST4", to: "ST5" }, { from: "ST5", to: "ST6" }, { from: "ST6", to: "ST7" },
      { from: "ST7", to: "ST8" },
    ],
  },
  P3E: {
    title: "External Sewer & Storm Calculations",
    icon: "\uD83C\uDF27\uFE0F",
    color: "#0891b2",
    accentBg: "#cffafe",
    steps: [
      { id: "SW1", label: "Input: Site Data", sub: "Plot Area + Impervious Area + Soil Type", type: "input" },
      { id: "SW2", label: "Rainfall Intensity Lookup", sub: "DB: IDF Curves + Return Period (yrs)", type: "process" },
      { id: "SW3", label: "Runoff Coefficient (C)", sub: "Based on Surface Type + Land Use", type: "formula" },
      { id: "SW4", label: "Storm Water Flow (Q)", sub: "Rational Method: Q = C \u00d7 I \u00d7 A / 360", type: "formula" },
      { id: "SW5", label: "Drain Sizing", sub: "Manning's Equation \u2192 Pipe / Channel Size", type: "formula" },
      { id: "SW6", label: "Sewer Load Estimation", sub: "Population \u00d7 Per Capita Sewage + Infiltration", type: "process" },
      { id: "SW7", label: "Sewer Pipe Sizing", sub: "Flow Velocity Check + Min Gradient", type: "formula" },
      { id: "SW8", label: "STP Capacity", sub: "Peak Sewage Flow \u2192 STP Plant Sizing", type: "process" },
      { id: "SW9", label: "Rainwater Harvesting Check", sub: "NBC / Local Body Mandate \u2192 RWH Tank Size", type: "decision" },
      { id: "SW10", label: "Output: Storm & Sewer Summary", sub: "Drain Sizes + STP + RWH \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "SW1", to: "SW2" }, { from: "SW2", to: "SW3" }, { from: "SW3", to: "SW4" },
      { from: "SW4", to: "SW5" }, { from: "SW5", to: "SW6" }, { from: "SW6", to: "SW7" },
      { from: "SW7", to: "SW8" }, { from: "SW8", to: "SW9" }, { from: "SW9", to: "SW10" },
    ],
  },

  P3D: {
    title: "Heat Load Calculations",
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
  VENT: {
    title: "Ventilation Calculations",
    icon: "\uD83C\uDF2C\uFE0F",
    color: "#8b5cf6",
    accentBg: "#ede9fe",
    steps: [
      { id: "V1", label: "Input: Room Data", sub: "Room volume, occupancy, activity type", type: "input" },
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
      { id: "PR3", label: "Leakage Air Calculation", sub: "Q = C\u00d7A\u00d7\u0394P^n (door + envelope leakage)", type: "formula" },
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
      { id: "FF1", label: "Input: Building Data", sub: "Height, area, occupancy type, NBC classification", type: "input" },
      { id: "FF2", label: "Hydrant System Demand", sub: "Flow rate + residual pressure as per NBC/CFO", type: "process" },
      { id: "FF3", label: "Sprinkler System Demand", sub: "Design density \u00d7 Area of operation", type: "formula" },
      { id: "FF4", label: "Static Head Calculation", sub: "Sump to highest sprinkler/hydrant", type: "formula" },
      { id: "FF5", label: "Friction & Minor Losses", sub: "Hazen-Williams for fire pipe network", type: "formula" },
      { id: "FF6", label: "Pump Duty Point", sub: "Total head + flow for each pump type", type: "formula" },
      { id: "FF7", label: "Jockey Pump Sizing", sub: "Pressure maintenance pump selection", type: "process" },
      { id: "FF8", label: "Output: Fire Pump Schedule", sub: "Hydrant + Sprinkler + Jockey pumps \u2192 Space Matrix", type: "output" },
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
      { id: "FT1", label: "Fetch Building Data", sub: "Occupancy, basement area, hazard class", type: "input" },
      { id: "FT2", label: "Standards Lookup (IS-15105/NFPA-13)", sub: "Sprinkler/hydrant flow rates & duration", type: "process" },
      { id: "FT3", label: "Sprinkler Volume", sub: "Area \u00D7 Flow Rate \u00D7 Duration", type: "formula" },
      { id: "FT4", label: "Hydrant Volume", sub: "1800 LPM \u00D7 Duration", type: "formula" },
      { id: "FT5", label: "Drencher Volume", sub: "Linear length \u00D7 35 L/min/m", type: "formula" },
      { id: "FT6", label: "300 m\u00B3 Safety Gate", sub: "Compare vs minimum, apply max()", type: "decision" },
      { id: "FT7", label: "Output: Tank Capacity", sub: "Total fire water tank (m\u00B3)", type: "output" },
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
      { id: "JD1", label: "Fetch Static Head & Run Lengths", sub: "From main pump module + building DB", type: "input" },
      { id: "JD2", label: "Hydraulic Parameters", sub: "Pipe schedule, friction factors", type: "process" },
      { id: "JD3", label: "Jockey Head Loss", sub: "50/80mm small-bore friction", type: "formula" },
      { id: "JD4", label: "Drencher Head Loss", sub: "High-volume water curtain supply", type: "formula" },
      { id: "JD5", label: "+20% Safety Factor", sub: "Applied to all frictional results", type: "formula" },
      { id: "JD6", label: "System Pressure", sub: "Jockey +0.5 Bar, Drencher +3.5 Bar", type: "process" },
      { id: "JD7", label: "Output: Pump Schedule", sub: "Jockey & drencher say values", type: "output" },
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
      { id: "TB1", label: "Building & Tank Data", sub: "Outlet elevation, terrace tank LWL", type: "input" },
      { id: "TB2", label: "Pipe & Friction Data", sub: "GI Class C @ 100mm, C=120, 900 LPM", type: "process" },
      { id: "TB3", label: "Hazen-Williams Friction", sub: "Straight run + fittings equivalent lengths", type: "formula" },
      { id: "TB4", label: "+20% Safety Factor", sub: "On sum of pipe + fitting losses", type: "formula" },
      { id: "TB5", label: "Total Head Summation", sub: "Friction + Static + 3.5 Bar residual", type: "formula" },
      { id: "TB6", label: "Output: Booster Head", sub: "Bar & meters, rounded say value", type: "output" },
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
      { id: "RW1", label: "Catchment Input", sub: "Area, sqm, surface type (C=0.95/0.30)", type: "input" },
      { id: "RW2", label: "Hydrology Input", sub: "Peak rainfall intensity (mm/hr)", type: "input" },
      { id: "RW3", label: "Yield Engine", sub: "Peak runoff + harvestable volume", type: "formula" },
      { id: "RW4", label: "RWDP Downcomer Sizing", sub: "NBC 2016 table check", type: "process" },
      { id: "RW5", label: "Velocity Guard", sub: "Manning's eqn, siltation alarm", type: "formula" },
      { id: "RW6", label: "Tank Sizing (NBC 2016)", sub: "Standard capacities, retention", type: "process" },
      { id: "RW7", label: "Output: RWH Dashboard", sub: "Peak flow, volume, pipe, tank dims", type: "output" },
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
      { id: "SW1", label: "Input: Catchment & Coefficients", sub: "Area, C, intensity (I)", type: "input" },
      { id: "SW2", label: "Rational Method Runoff", sub: "Q = (C\u00D7I\u00D7A) / 3600", type: "formula" },
      { id: "SW3", label: "Design Parameters", sub: "Slope (S), Manning's n", type: "input" },
      { id: "SW4", label: "Pipe/Channel Sizing", sub: "Diameter + velocity calc", type: "formula" },
      { id: "SW5", label: "Velocity Monitor", sub: "V\u22650.5? Safe vs Siltation Alarm", type: "decision" },
      { id: "SW6", label: "Capacity Check", sub: "Q_cap > Q_peak", type: "process" },
      { id: "SW7", label: "Output: SWD Schedule", sub: "Pipe dia, velocity, capacity", type: "output" },
    ],
    connections: [
      { from: "SW1", to: "SW2" }, { from: "SW2", to: "SW3" }, { from: "SW3", to: "SW4" },
      { from: "SW4", to: "SW5" }, { from: "SW5", to: "SW6" }, { from: "SW6", to: "SW7" },
    ],
  },
  // ── Detailed Design Stage Calcs ──
  DD_CB: { title: "Cable Sizing Calculation", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "CB1", label: "Input: Circuit Data", sub: "Load current, cable route length, installation method", type: "input" }, { id: "CB2", label: "Current Rating Lookup", sub: "IS 3961/IEC 60502 derating factors", type: "process" }, { id: "CB3", label: "Voltage Drop Check", sub: "Max 3% for sub-main, 5% total", type: "formula" }, { id: "CB4", label: "Short Circuit Withstand", sub: "I\u00B2t check for fault duration", type: "formula" }, { id: "CB5", label: "Output: Cable Schedule", sub: "Cable size + type + route \u2192 BOQ", type: "output" }],
    connections: [{ from: "CB1", to: "CB2" }, { from: "CB2", to: "CB3" }, { from: "CB3", to: "CB4" }, { from: "CB4", to: "CB5" }] },
  DD_PNL: { title: "Panel Schedule Design", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "PN1", label: "Input: Circuit List", sub: "All outgoing circuits per panel", type: "input" }, { id: "PN2", label: "Phase Balancing", sub: "R-Y-B load distribution", type: "process" }, { id: "PN3", label: "MCB/MCCB Selection", sub: "Rating per circuit from load data", type: "process" }, { id: "PN4", label: "Output: Panel Schedule", sub: "Complete panel schedule drawing", type: "output" }],
    connections: [{ from: "PN1", to: "PN2" }, { from: "PN2", to: "PN3" }, { from: "PN3", to: "PN4" }] },
  DD_SLD: { title: "SLD (Single Line Diagram)", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "SL1", label: "Input: Transformer & Load Data", sub: "Incomer + all outgoing feeders", type: "input" }, { id: "SL2", label: "Protection Coordination", sub: "Relay/breaker settings per tier", type: "process" }, { id: "SL3", label: "SLD Layout", sub: "Transformer to outgoing feeders diagram", type: "process" }, { id: "SL4", label: "Output: SLD Drawing", sub: "Complete single line diagram", type: "output" }],
    connections: [{ from: "SL1", to: "SL2" }, { from: "SL2", to: "SL3" }, { from: "SL3", to: "SL4" }] },
  DD_ERT: { title: "Earthing Design", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "ER1", label: "Input: Soil & Building Data", sub: "Soil resistivity, building footprint", type: "input" }, { id: "ER2", label: "Electrode Sizing", sub: "IS 3043 calculation for earth pits", type: "formula" }, { id: "ER3", label: "Earth Pit Layout", sub: "Spacing + ring earth conductor", type: "process" }, { id: "ER4", label: "Output: Earthing Layout", sub: "Earth pit locations + conductor sizes", type: "output" }],
    connections: [{ from: "ER1", to: "ER2" }, { from: "ER2", to: "ER3" }, { from: "ER3", to: "ER4" }] },
  DD_LTN: { title: "Lightning Protection", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "LT1", label: "Input: Building Geometry", sub: "Height, footprint, roof type", type: "input" }, { id: "LT2", label: "Risk Assessment", sub: "IS/IEC 62305 risk calculation", type: "formula" }, { id: "LT3", label: "Protection Method", sub: "Rolling sphere / mesh / rod", type: "process" }, { id: "LT4", label: "Output: LP Layout", sub: "Air terminal + down conductor layout", type: "output" }],
    connections: [{ from: "LT1", to: "LT2" }, { from: "LT2", to: "LT3" }, { from: "LT3", to: "LT4" }] },
  DD_BUS: { title: "Bus Bar Sizing", icon: "\u26A1", color: "#d97706", accentBg: "#fef3c7",
    steps: [{ id: "BB1", label: "Input: Max Demand Current", sub: "From electrical load calc output", type: "input" }, { id: "BB2", label: "Material Selection", sub: "Cu/Al from standard tables", type: "process" }, { id: "BB3", label: "Temperature Rise Check", sub: "Current density \u2264 limit", type: "formula" }, { id: "BB4", label: "Output: Bus Bar Schedule", sub: "Size + material + mounting", type: "output" }],
    connections: [{ from: "BB1", to: "BB2" }, { from: "BB2", to: "BB3" }, { from: "BB3", to: "BB4" }] },
  DD_PIP: { title: "Transfer Pipe Sizing", icon: "\uD83D\uDCA7", color: "#2563eb", accentBg: "#dbeafe",
    steps: [{ id: "PI1", label: "Input: Fixture Unit Count", sub: "Hunter's method FU per floor", type: "input" }, { id: "PI2", label: "Flow Rate Conversion", sub: "FU \u2192 LPS from IS/NBC tables", type: "formula" }, { id: "PI3", label: "Velocity Check", sub: "1.5\u20133.0 m/s target range", type: "formula" }, { id: "PI4", label: "Pipe Diameter Calc", sub: "D = \u221A(4Q/\u03C0V) \u2192 standard size", type: "formula" }, { id: "PI5", label: "Output: Pipe Schedule", sub: "Pipe sizes per floor \u2192 BOQ", type: "output" }],
    connections: [{ from: "PI1", to: "PI2" }, { from: "PI2", to: "PI3" }, { from: "PI3", to: "PI4" }, { from: "PI4", to: "PI5" }] },
  DD_SPR: { title: "Sprinkler Hydraulic Calc", icon: "\uD83D\uDD25", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [{ id: "SP1", label: "Input: Hazard Class & Area", sub: "Occupancy type, design area", type: "input" }, { id: "SP2", label: "Design Density", sub: "NFPA/IS density selection (mm/min)", type: "process" }, { id: "SP3", label: "K-Factor Selection", sub: "Sprinkler head K-factor from DB", type: "process" }, { id: "SP4", label: "Hydraulic Calculation", sub: "Pipe network pressure/flow calc", type: "formula" }, { id: "SP5", label: "Output: Sprinkler Schedule", sub: "Head layout + pipe sizes \u2192 drawings", type: "output" }],
    connections: [{ from: "SP1", to: "SP2" }, { from: "SP2", to: "SP3" }, { from: "SP3", to: "SP4" }, { from: "SP4", to: "SP5" }] },
  DD_DCT: { title: "Duct Sizing", icon: "\u2744\uFE0F", color: "#7c3aed", accentBg: "#ede9fe",
    steps: [{ id: "DC1", label: "Input: CFM per Zone", sub: "Cooling load \u2192 air volume per zone", type: "input" }, { id: "DC2", label: "Equal Friction Method", sub: "Target friction rate (Pa/m)", type: "formula" }, { id: "DC3", label: "Duct Size Selection", sub: "Rectangular/round from duct tables", type: "process" }, { id: "DC4", label: "Velocity Check", sub: "Main 6\u20138 m/s, branch 3\u20135 m/s", type: "formula" }, { id: "DC5", label: "Output: Duct Schedule", sub: "Size + insulation per section \u2192 BOQ", type: "output" }],
    connections: [{ from: "DC1", to: "DC2" }, { from: "DC2", to: "DC3" }, { from: "DC3", to: "DC4" }, { from: "DC4", to: "DC5" }] },
  DD_EQP: { title: "Equipment Selection", icon: "\u2744\uFE0F", color: "#7c3aed", accentBg: "#ede9fe",
    steps: [{ id: "EQ1", label: "Input: Cooling/Heating Load", sub: "TR per zone from heat load calc", type: "input" }, { id: "EQ2", label: "Equipment Type", sub: "Chiller / VRF / Split / AHU selection", type: "process" }, { id: "EQ3", label: "Catalogue Matching", sub: "Manufacturer model from capacity tables", type: "process" }, { id: "EQ4", label: "Output: Equipment Schedule", sub: "Model + capacity + power \u2192 BOQ", type: "output" }],
    connections: [{ from: "EQ1", to: "EQ2" }, { from: "EQ2", to: "EQ3" }, { from: "EQ3", to: "EQ4" }] },
  DD_VAV: { title: "VAV/FCU Selection", icon: "\u2744\uFE0F", color: "#7c3aed", accentBg: "#ede9fe",
    steps: [{ id: "VA1", label: "Input: Zone Data", sub: "CFM + sensible load per zone", type: "input" }, { id: "VA2", label: "Unit Selection", sub: "VAV box / FCU from manufacturer data", type: "process" }, { id: "VA3", label: "Controls Integration", sub: "Thermostat + actuator + DDC points", type: "process" }, { id: "VA4", label: "Output: Terminal Unit Schedule", sub: "Model + capacity + controls \u2192 BOQ", type: "output" }],
    connections: [{ from: "VA1", to: "VA2" }, { from: "VA2", to: "VA3" }, { from: "VA3", to: "VA4" }] },
  DD_BMS: { title: "BMS Integration", icon: "\uD83D\uDDA5", color: "#7c3aed", accentBg: "#ede9fe",
    steps: [{ id: "BM1", label: "Input: Equipment List", sub: "All HVAC equipment + sensors", type: "input" }, { id: "BM2", label: "Points List", sub: "AI/AO/DI/DO count per equipment", type: "process" }, { id: "BM3", label: "Architecture Design", sub: "Controller layout + network topology", type: "process" }, { id: "BM4", label: "Output: BMS Schedule", sub: "Points list + controllers \u2192 BOQ", type: "output" }],
    connections: [{ from: "BM1", to: "BM2" }, { from: "BM2", to: "BM3" }, { from: "BM3", to: "BM4" }] },
  DD_SMK: { title: "Smoke Management", icon: "\uD83D\uDD25", color: "#7c3aed", accentBg: "#ede9fe",
    steps: [{ id: "SM1", label: "Input: Floor Area & Height", sub: "Smoke zone dimensions", type: "input" }, { id: "SM2", label: "Extraction Rate", sub: "6 ACH or CFD-based calc", type: "formula" }, { id: "SM3", label: "Fan Sizing", sub: "CFM + static pressure \u2192 fan model", type: "process" }, { id: "SM4", label: "Output: Smoke System Schedule", sub: "Fan + duct + damper \u2192 BOQ", type: "output" }],
    connections: [{ from: "SM1", to: "SM2" }, { from: "SM2", to: "SM3" }, { from: "SM3", to: "SM4" }] },
  DD_HYD: { title: "Hydrant Layout", icon: "\uD83D\uDD25", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [{ id: "HY1", label: "Input: Floor Plans", sub: "Coverage area + travel distance", type: "input" }, { id: "HY2", label: "Hydrant Spacing", sub: "30m hose reach + 6m throw = 36m", type: "formula" }, { id: "HY3", label: "Hose Reel Coverage", sub: "30m hose reel radius check", type: "process" }, { id: "HY4", label: "Pipe Sizing", sub: "Flow rate + friction \u2192 pipe dia", type: "formula" }, { id: "HY5", label: "Output: Hydrant Layout", sub: "Locations + pipe sizes \u2192 drawings", type: "output" }],
    connections: [{ from: "HY1", to: "HY2" }, { from: "HY2", to: "HY3" }, { from: "HY3", to: "HY4" }, { from: "HY4", to: "HY5" }] },
  DD_DET: { title: "Detection System", icon: "\uD83D\uDD25", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [{ id: "DT1", label: "Input: Room Data", sub: "Room type, area, ceiling height", type: "input" }, { id: "DT2", label: "Detector Type", sub: "Smoke / heat / beam per NBC", type: "process" }, { id: "DT3", label: "Spacing Calculation", sub: "IS 2189 detector spacing tables", type: "formula" }, { id: "DT4", label: "Zone Layout", sub: "Max 20 detectors per zone", type: "process" }, { id: "DT5", label: "Output: Detection Layout", sub: "Detector locations + panel sizing", type: "output" }],
    connections: [{ from: "DT1", to: "DT2" }, { from: "DT2", to: "DT3" }, { from: "DT3", to: "DT4" }, { from: "DT4", to: "DT5" }] },
  DD_PAV: { title: "PA/VA System", icon: "\uD83D\uDD0A", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [{ id: "PA1", label: "Input: Coverage Zones", sub: "Floor areas + ambient noise levels", type: "input" }, { id: "PA2", label: "Speaker Selection", sub: "Ceiling / wall / horn type + wattage", type: "process" }, { id: "PA3", label: "Wiring Calculation", sub: "100V line, cable sizing per zone", type: "formula" }, { id: "PA4", label: "Output: PA/VA Schedule", sub: "Speaker layout + amplifier sizing", type: "output" }],
    connections: [{ from: "PA1", to: "PA2" }, { from: "PA2", to: "PA3" }, { from: "PA3", to: "PA4" }] },
  DD_SMX: { title: "Smoke Exhaust", icon: "\uD83D\uDD25", color: "#e11d48", accentBg: "#ffe4e6",
    steps: [{ id: "SX1", label: "Input: Basement/Atrium Data", sub: "Area, height, ventilation openings", type: "input" }, { id: "SX2", label: "Extraction Rate Calc", sub: "6 ACH (basement) or CFD-based", type: "formula" }, { id: "SX3", label: "Fan & Duct Sizing", sub: "CFM + static pressure \u2192 equipment", type: "process" }, { id: "SX4", label: "Output: Smoke Exhaust Layout", sub: "Fan + duct + damper locations", type: "output" }],
    connections: [{ from: "SX1", to: "SX2" }, { from: "SX2", to: "SX3" }, { from: "SX3", to: "SX4" }] },
};

// =====================================================================
// PNG DOWNLOAD UTILITY FOR CALC SVGs
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
  const vb = svgEl.viewBox?.baseVal;
  const w = (vb && vb.width > 0) ? vb.width : svgEl.getBoundingClientRect().width;
  const h = (vb && vb.height > 0) ? vb.height : svgEl.getBoundingClientRect().height;
  const scale = 3;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
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

// =====================================================================
// CALCULATION DETAIL OVERLAY
// =====================================================================
function CalcDetailOverlay({
  calcId,
  serviceColor,
  onClose,
}: {
  calcId: string;
  serviceColor: string;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(0.48);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  // Check if it's a fully built custom SVG
  const CUSTOM_IDS = new Set(["P3A","P3B","OWC","STP","DFP","FFP","FTK","FJD","FTB","RWH","SWD","DD_CB","DD_PIP","DD_PRV"]);
  const isCustomP3A = calcId === "P3A";
  const isCustomP3B = calcId === "P3B";
  const isCustomOWC = calcId === "OWC";
  const isCustomSTP = calcId === "STP";
  const isCustomDFP = calcId === "DFP";
  const isCustomFFP = calcId === "FFP";
  const isCustomFTK = calcId === "FTK";
  const isCustomFJD = calcId === "FJD";
  const isCustomFTB = calcId === "FTB";
  const isCustomRWH = calcId === "RWH";
  const isCustomSWD = calcId === "SWD";
  const isCustomDDCB = calcId === "DD_CB";
  const isCustomDDPIP = calcId === "DD_PIP";
  const isCustomDDPRV = calcId === "DD_PRV";
  const isCustom = CUSTOM_IDS.has(calcId);

  // For generic flows
  const flow = !isCustom ? GENERIC_FLOWS[calcId] : null;

  const CUSTOM_META: Record<string, { title: string; icon: string; color: string }> = {
    P3A: { title: "Water Demand Calculation", icon: "\uD83D\uDCA7", color: "#3b82f6" },
    P3B: { title: "Electrical Load Calculation", icon: "\u26A1", color: "#f59e0b" },
    OWC: { title: "OWC Calculations", icon: "\u267B\uFE0F", color: "#10b981" },
    STP: { title: "STP Calculations", icon: "\uD83C\uDFED", color: "#06b6d4" },
    DFP: { title: "Pump Head & Flow Rate Calculation", icon: "\uD83D\uDD27", color: "#06b6d4" },
    FFP: { title: "Fire Pump Head Calculation", icon: "\uD83D\uDE92", color: "#dc2626" },
    FTK: { title: "Fire Tank Size Estimation", icon: "\uD83D\uDEA8", color: "#dc2626" },
    FJD: { title: "Jockey & Drencher Pump", icon: "\uD83D\uDD27", color: "#dc2626" },
    FTB: { title: "Terrace Fire Booster Pump", icon: "\uD83C\uDFD7\uFE0F", color: "#dc2626" },
    RWH: { title: "Rainwater Harvesting & Tank Sizing", icon: "\uD83C\uDF27\uFE0F", color: "#3b82f6" },
    SWD: { title: "Storm Water Drainage Calculator", icon: "\u{1F30A}", color: "#3b82f6" },
    DD_CB: { title: "Cable Sizing & Voltage Drop Calculation", icon: "\u26A1", color: "#d97706" },
    DD_PIP: { title: "Transfer Pipe Sizing", icon: "\uD83D\uDCA7", color: "#2563eb" },
    DD_PRV: { title: "PRV Calculations", icon: "\uD83D\uDD27", color: "#7c3aed" },
  };
  const meta = CUSTOM_META[calcId];
  const flowTitle = meta?.title ?? flow?.title ?? "Calculation";
  const flowIcon = meta?.icon ?? flow?.icon ?? "\uD83D\uDCC4";
  const flowColor = meta?.color ?? flow?.color ?? serviceColor;

  // Generic flow renderer
  const nodeW2 = 300;
  const nodeH2 = 64;
  const gap2 = 36;
  const px2 = 60;
  const py2 = 30;
  const totalH = flow ? py2 + flow.steps.length * (nodeH2 + gap2) + 20 : 0;
  const totalW = nodeW2 + px2 * 2;

  const typeColors: Record<string, { bg: string; bd: string; icon: string }> = {
    input: { bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDCE5" },
    process: { bg: "#d1fae5", bd: "#10b981", icon: "\u2699\uFE0F" },
    formula: { bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83E\uddEE" },
    output: { bg: "#fef3c7", bd: "#f59e0b", icon: "\uD83D\uDCE4" },
    decision: { bg: "#ffe4e6", bd: "#f43f5e", icon: "\u2753" },
  };

  // P3A/P3B custom legends
  const customLegend =
    calcId === "P3A"
      ? [
          { label: "Input", bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDCE5" },
          { label: "Decision", bg: "#fef3c7", bd: "#f59e0b", icon: "\u25C7" },
          { label: "Sub-Category", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83D\uDCC2" },
          { label: "Policy Toggle", bg: "#ffe4e6", bd: "#f43f5e", icon: "\u21C4" },
          { label: "Table Matrix", bg: "#f8fafc", bd: "#8b5cf6", icon: "\uD83D\uDCC4" },
          { label: "Formula", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83E\uddEE" },
          { label: "Side Process", bg: "#cffafe", bd: "#06b6d4", icon: "\u2699\uFE0F" },
          { label: "Dashboard", bg: "#d1fae5", bd: "#10b981", icon: "\uD83D\uDCCA" },
        ]
      : calcId === "P3B"
      ? [
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
        ]
      : isCustomOWC || isCustomSTP || isCustomDFP || isCustomFFP || isCustomFTK || isCustomFJD || isCustomFTB || isCustomRWH || isCustomSWD || isCustomDDCB || isCustomDDPIP
      ? [
          { label: "Entry", bg: "#dbeafe", bd: "#3b82f6", icon: "\uD83D\uDCE5" },
          { label: "Database", bg: "#ede9fe", bd: "#8b5cf6", icon: "\uD83D\uDDC3" },
          { label: "Process", bg: "#cffafe", bd: "#06b6d4", icon: "\u2699\uFE0F" },
          { label: "Formula", bg: "#fef3c7", bd: "#f59e0b", icon: "\uD83E\uddEE" },
          { label: "Table", bg: "#f1f5f9", bd: "#64748b", icon: "\uD83D\uDCC4" },
          { label: "Output", bg: "#d1fae5", bd: "#10b981", icon: "\uD83D\uDCCA" },
          { label: "Logic Note", bg: "#ffe4e6", bd: "#f43f5e", icon: "\uD83D\uDCA1" },
        ]
      : null;

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
          border: `3px solid ${flowColor}`,
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ backgroundColor: flowColor }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "24px" }}>{flowIcon}</span>
            <div>
              <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                {flowTitle}
              </h2>
              <p className="text-white" style={{ fontSize: "12px", opacity: 0.75, margin: 0 }}>
                Detailed Algorithm Flow — Click outside or press ESC to close
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCustom && (
              <>
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.06, 1.2))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.06, 0.12))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(0.48)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span
                  className="text-[11px] rounded-md px-2 py-1 ml-0.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <div className="w-px h-5 mx-1" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
              </>
            )}
            <button
              onClick={() => downloadCalcPNG(svgContainerRef, flowTitle)}
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
              <Download className="w-4 h-4" /> PNG
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
              style={{
                width: 36,
                height: 36,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend Bar */}
        <div
          className="flex items-center gap-4 px-6 py-3 border-b flex-wrap shrink-0"
          style={{ borderColor: "#e5e7eb" }}
        >
          {customLegend
            ? customLegend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div
                    className="rounded"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: item.bg,
                      border: `1.5px solid ${item.bd}`,
                    }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {item.icon} {item.label}
                  </span>
                </div>
              ))
            : Object.entries(typeColors).map(([type, c]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div
                    className="rounded"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: c.bg,
                      border: `1.5px solid ${c.bd}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      textTransform: "capitalize" as const,
                    }}
                  >
                    {c.icon} {type}
                  </span>
                </div>
              ))}
        </div>

        {/* Scrollable SVG Flow */}
        <div className="overflow-auto flex-1" ref={svgContainerRef}>
          {isCustomP3A ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <WaterDemandCalcSVG />
            </div>
          ) : isCustomP3B ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <ElectricalLoadCalcSVG />
            </div>
          ) : isCustomOWC ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <OWCCalcSVG />
            </div>
          ) : isCustomSTP ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <STPCalcSVG />
            </div>
          ) : isCustomDFP ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <DomesticFlushingPumpCalcSVG />
            </div>
          ) : isCustomFFP ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <FirePumpHeadCalcSVG />
            </div>
          ) : isCustomFTK ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <FireTankCalcSVG />
            </div>
          ) : isCustomFJD ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <FireJockeyDrencherCalcSVG />
            </div>
          ) : isCustomFTB ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <TerraceBoosterCalcSVG />
            </div>
          ) : isCustomRWH ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <RWHCalcSVG />
            </div>
          ) : isCustomSWD ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <SWDCalcSVG />
            </div>
          ) : isCustomDDCB ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <CableSizingCalcSVG />
            </div>
          ) : isCustomDDPIP ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <PipeSizingCalcSVG />
            </div>
          ) : isCustomDDPRV ? (
            <div style={{ minWidth: "1600px", padding: "10px 0", zoom }}>
              <PRVCalcSVG />
            </div>
          ) : flow ? (
            <svg
              width={totalW}
              height={totalH}
              viewBox={`0 0 ${totalW} ${totalH}`}
              style={{ display: "block", margin: "0 auto" }}
            >
              <defs>
                <marker
                  id="calc-arrow-svc"
                  viewBox="0 0 10 10"
                  refX={10}
                  refY={5}
                  markerWidth={7}
                  markerHeight={7}
                  orient="auto-start-reverse"
                >
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
                  <line
                    key={i}
                    x1={ccx}
                    y1={cy1}
                    x2={ccx}
                    y2={cy2}
                    stroke={flow.color}
                    strokeWidth={2}
                    markerEnd="url(#calc-arrow-svc)"
                    opacity={0.6}
                  />
                );
              })}

              {/* Nodes */}
              {flow.steps.map((step, i) => {
                const sx = px2;
                const sy = py2 + i * (nodeH2 + gap2);
                const tc = typeColors[step.type] ?? typeColors.process;
                const cxN = sx + nodeW2 / 2;
                return (
                  <g key={step.id}>
                    <circle cx={sx - 18} cy={sy + nodeH2 / 2} r={13} fill={flow.color} />
                    <text
                      x={sx - 18}
                      y={sy + nodeH2 / 2 + 4}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={10}
                      fontWeight={700}
                    >
                      {i + 1}
                    </text>
                    <rect
                      x={sx}
                      y={sy}
                      width={nodeW2}
                      height={nodeH2}
                      rx={10}
                      fill={tc.bg}
                      stroke={tc.bd}
                      strokeWidth={2}
                    />
                    <rect
                      x={sx + nodeW2 - 62}
                      y={sy + 4}
                      width={56}
                      height={16}
                      rx={8}
                      fill={tc.bd}
                      opacity={0.85}
                    />
                    <text
                      x={sx + nodeW2 - 34}
                      y={sy + 15}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={7.5}
                      fontWeight={600}
                      style={{ textTransform: "uppercase" as const }}
                    >
                      {step.type}
                    </text>
                    <text
                      x={cxN - 10}
                      y={sy + 26}
                      textAnchor="middle"
                      fill="#1e293b"
                      fontSize={12}
                      fontWeight={700}
                    >
                      {step.label}
                    </text>
                    <text x={cxN} y={sy + 46} textAnchor="middle" fill="#64748b" fontSize={9.5}>
                      {step.sub.length > 55 ? step.sub.slice(0, 53) + "\u2026" : step.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p style={{ color: "#94a3b8" }}>Flow diagram not available yet.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// =====================================================================
// SERVICE CARD COMPONENT
// =====================================================================
function ServiceCard({
  service,
  isExpanded,
  onToggle,
  onCalcClick,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
  onCalcClick: (calcId: string) => void;
}) {
  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden shadow-sm border"
      style={{ borderColor: `${service.color}30`, backgroundColor: "#fff" }}
    >
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-opacity-80 transition-all"
        style={{ backgroundColor: isExpanded ? service.colorLight : "#fff" }}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${service.color}, ${service.color}cc)`,
            color: "#fff",
          }}
        >
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 style={{ color: service.colorDark, fontSize: "17px", margin: 0 }}>{service.title}</h3>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "2px 0 0" }}>{service.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: service.colorLight,
              color: service.color,
              fontSize: "12px",
              fontWeight: 600,
              border: `1px solid ${service.color}30`,
            }}
          >
            {service.calculations.length} Calculation{service.calculations.length !== 1 ? "s" : ""}
          </span>
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-5 h-5" style={{ color: service.color }} />
          </motion.div>
        </div>
      </button>

      {/* Calculation List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1">
              <div className="h-px w-full mb-3" style={{ backgroundColor: `${service.color}20` }} />
              <div className="space-y-2">
                {(() => {
                  const stages = ["concept", "detailed"] as const;
                  let globalIdx = 0;
                  return stages.map((stage) => {
                    const calcs = service.calculations.filter((c) => c.stage === stage);
                    if (calcs.length === 0) return null;
                    const sm = STAGE_META[stage];
                    const stageStart = globalIdx;
                    globalIdx += calcs.length;
                    return (
                      <div key={stage}>
                        {/* Stage Section Header */}
                        <div className="flex items-center gap-2 mt-2 mb-1.5 px-1">
                          <div className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: sm.bg, border: `1px solid ${sm.color}40` }}>
                            <span style={{ fontSize: "10px", fontWeight: 700, color: sm.color, letterSpacing: 0.5 }}>{sm.label.toUpperCase()}</span>
                          </div>
                          <div className="flex-1 h-px" style={{ backgroundColor: `${sm.color}20` }} />
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{calcs.length} calc{calcs.length > 1 ? "s" : ""}</span>
                        </div>
                        {calcs.map((calc, i) => (
                          <motion.button
                            key={calc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (stageStart + i) * 0.03 }}
                            onClick={() => onCalcClick(calc.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group mb-1.5"
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = service.colorLight;
                              (e.currentTarget as HTMLElement).style.borderColor = `${service.color}50`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc";
                              (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                            }}
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: service.colorLight, color: service.color, fontSize: "13px", fontWeight: 700 }}
                            >
                              {stageStart + i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ color: "#1e293b", fontSize: "14px", fontWeight: 600, margin: 0 }}>
                                {calc.title}
                              </p>
                              <p style={{ color: "#94a3b8", fontSize: "11px", margin: "2px 0 0" }}>
                                {calc.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {calc.status === "ready" ? (
                                <span className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: "#d1fae5", color: "#065f46", fontSize: "10px", fontWeight: 600 }}>READY</span>
                              ) : (
                                <span className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: "#fef3c7", color: "#92400e", fontSize: "10px", fontWeight: 600 }}>PREVIEW</span>
                              )}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: service.color }} />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =====================================================================
// MAIN SERVICES DASHBOARD
// =====================================================================
export function ServicesDashboard() {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set(["electrical", "plumbing"]));
  const [activeCalc, setActiveCalc] = useState<string | null>(null);
  const [activeServiceColor, setActiveServiceColor] = useState("#3b82f6");

  // ESC handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCalc(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleService = useCallback((id: string) => {
    setExpandedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCalcClick = useCallback((calcId: string, serviceColor: string) => {
    setActiveCalc(calcId);
    setActiveServiceColor(serviceColor);
  }, []);

  // Stats
  const allCalcs = SERVICES.flatMap((s) => s.calculations);
  const totalCalcs = allCalcs.length;
  const readyCalcs = allCalcs.filter((c) => c.status === "ready").length;
  const stageCounts = {
    concept: allCalcs.filter((c) => c.stage === "concept").length,
    detailed: allCalcs.filter((c) => c.stage === "detailed").length,
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {/* Stats Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span style={{ color: "#64748b", fontSize: "12px" }}>
            <strong style={{ color: "#1e293b" }}>{SERVICES.length}</strong> Services
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          <span style={{ color: "#64748b", fontSize: "12px" }}>
            <strong style={{ color: "#1e293b" }}>{totalCalcs}</strong> Calculations
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#d1fae5] border border-[#10b981]/20">
          <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span style={{ color: "#065f46", fontSize: "12px" }}>
            <strong>{readyCalcs}</strong> Fully Built
          </span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/20">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span style={{ color: "#92400e", fontSize: "12px" }}>
            <strong>{totalCalcs - readyCalcs}</strong> Preview
          </span>
        </div>
        <div className="w-px h-5 bg-[#e2e8f0]" />
        {(["concept", "detailed"] as const).map((stage) => {
          const sm = STAGE_META[stage];
          return (
            <div key={stage} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: sm.bg, border: `1px solid ${sm.color}30` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sm.color }} />
              <span style={{ color: sm.color, fontSize: "11px", fontWeight: 600 }}>{sm.label.split(" ")[0]}: {stageCounts[stage]}</span>
            </div>
          );
        })}
      </div>

      {/* Service Cards */}
      <div className="space-y-4">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isExpanded={expandedServices.has(service.id)}
            onToggle={() => toggleService(service.id)}
            onCalcClick={(calcId) => handleCalcClick(calcId, service.color)}
          />
        ))}
      </div>

      {/* Calc Detail Overlay */}
      <AnimatePresence>
        {activeCalc && (
          <CalcDetailOverlay
            key={activeCalc}
            calcId={activeCalc}
            serviceColor={activeServiceColor}
            onClose={() => setActiveCalc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
