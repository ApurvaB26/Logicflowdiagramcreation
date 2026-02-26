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
}

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
    subtitle: "Power distribution, load analysis & equipment sizing",
    icon: <Zap className="w-7 h-7" />,
    color: "#f59e0b",
    colorLight: "#fef3c7",
    colorDark: "#92400e",
    calculations: [
      {
        id: "P3B",
        title: "Electrical Load Calculations",
        description: "Supply norms, apartment/common/MLCP loads, transformer & DG sizing",
        status: "ready",
      },
    ],
  },
  {
    id: "plumbing",
    title: "Plumbing Calculations",
    subtitle: "Water supply, drainage & pipe sizing",
    icon: <Droplets className="w-7 h-7" />,
    color: "#3b82f6",
    colorLight: "#dbeafe",
    colorDark: "#1e40af",
    calculations: [
      {
        id: "P3A",
        title: "Water Demand Calculations",
        description: "Population estimate, per capita demand, tank sizing & peak hour factor",
        status: "ready",
      },
      {
        id: "OWC",
        title: "OWC Calculations",
        description: "Waste generation, bin sizing, garbage room & OWC capacity (CPHEEO/NBC)",
        status: "ready",
      },
      {
        id: "STP",
        title: "STP Calculations",
        description: "Sewage generation (80/100 rule), STP sizing, area & treated water reuse",
        status: "ready",
      },
      {
        id: "DFP",
        title: "Domestic & Flushing Pump Calculations",
        description: "Pump head, flow rate & pump selection for domestic and flushing systems",
        status: "coming-soon",
      },
      {
        id: "P3E",
        title: "External Sewer & Storm Calculations",
        description: "Storm water flow, sewer pipe sizing, STP capacity & rainwater harvesting",
        status: "coming-soon",
      },
      {
        id: "RWH",
        title: "Rainwater Harvesting & Tank Sizing",
        description: "Catchment runoff, downcomer sizing, velocity guard & NBC 2016 tank sizing",
        status: "ready",
      },
      {
        id: "SWD",
        title: "Storm Water Drainage Calculator",
        description: "Rational method runoff, Manning's equation, velocity monitoring & pipe sizing",
        status: "ready",
      },
      {
        id: "P3T_PLUMB",
        title: "Transfer Pipe Sizing",
        description: "Pipe diameter, friction loss & material specification for plumbing transfers",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "hvac",
    title: "HVAC Calculations",
    subtitle: "Heating, ventilation & air conditioning design",
    icon: <Wind className="w-7 h-7" />,
    color: "#8b5cf6",
    colorLight: "#ede9fe",
    colorDark: "#5b21b6",
    calculations: [
      {
        id: "P3D",
        title: "Heat Load Calculations",
        description: "Sensible & latent heat, cooling load, TR calculation & equipment sizing",
        status: "coming-soon",
      },
      {
        id: "VENT",
        title: "Ventilation Calculations",
        description: "Air change rate, duct sizing & fresh air requirements",
        status: "coming-soon",
      },
      {
        id: "PRESS",
        title: "Pressurisation Calculations",
        description: "Stairwell & lobby pressurisation system design",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "firefighting",
    title: "Firefighting Calculations",
    subtitle: "Fire protection system design & pump sizing",
    icon: <Flame className="w-7 h-7" />,
    color: "#ef4444",
    colorLight: "#fee2e2",
    colorDark: "#991b1b",
    calculations: [
      {
        id: "FFP",
        title: "Fire Pump Head Calculations",
        description: "Static head, Hazen-Williams friction, system pressure & multi-zone pump output",
        status: "ready",
      },
      {
        id: "FTK",
        title: "Fire Tank Size Estimation",
        description: "IS-15105/NFPA-13 standards, sprinkler/hydrant/drencher volume & 300m\u00B3 safety gate",
        status: "ready",
      },
      {
        id: "FJD",
        title: "Jockey & Drencher Pump Calculations",
        description: "Jockey/drencher head loss, 20% safety factor & system pressure summation",
        status: "ready",
      },
      {
        id: "FTB",
        title: "Terrace Fire Booster Pump Head",
        description: "Hazen-Williams friction, pipe fittings, static head & residual pressure calc",
        status: "ready",
      },
      {
        id: "P3T_FF",
        title: "Transfer Pipe Sizing",
        description: "Pipe diameter, friction loss & material specification for fire transfers",
        status: "coming-soon",
      },
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
  DFP: {
    title: "Domestic & Flushing Pump Calculations",
    icon: "\uD83D\uDD27",
    color: "#06b6d4",
    accentBg: "#cffafe",
    steps: [
      { id: "DF1", label: "Input: Building Height & Demand", sub: "Floor count, water demand per floor", type: "input" },
      { id: "DF2", label: "Static Head Calculation", sub: "Height difference: sump to highest outlet", type: "formula" },
      { id: "DF3", label: "Friction & Minor Losses", sub: "Pipe routing, fittings, valves", type: "formula" },
      { id: "DF4", label: "Total Dynamic Head (TDH)", sub: "Static + Friction + Minor + Residual", type: "formula" },
      { id: "DF5", label: "Flow Rate Calculation", sub: "Peak demand per system (domestic / flushing)", type: "process" },
      { id: "DF6", label: "Pump Selection", sub: "TDH + Flow \u2192 Pump model from DB", type: "process" },
      { id: "DF7", label: "Output: Pump Schedule", sub: "Pump size, motor rating, no. of pumps \u2192 Space Matrix", type: "output" },
    ],
    connections: [
      { from: "DF1", to: "DF2" }, { from: "DF2", to: "DF3" }, { from: "DF3", to: "DF4" },
      { from: "DF4", to: "DF5" }, { from: "DF5", to: "DF6" }, { from: "DF6", to: "DF7" },
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
  P3T_PLUMB: {
    title: "Transfer Pipe Sizing (Plumbing)",
    icon: "\uD83D\uDD27",
    color: "#7c3aed",
    accentBg: "#ede9fe",
    steps: [
      { id: "TP1", label: "Input: Pump Selection Data", sub: "Selected Pump + Flow Rate + Head", type: "input" },
      { id: "TP2", label: "Flow Rate per Transfer Line", sub: "GPM / LPS from Pump Duty Point", type: "process" },
      { id: "TP3", label: "Velocity Constraint Check", sub: "Target: 1.5\u20133.0 m/s (Pressure) / 0.6\u20131.2 m/s (Gravity)", type: "formula" },
      { id: "TP4", label: "Pipe Diameter Calculation", sub: "D = \u221A(4Q / \u03C0V) \u2192 Round to Standard Size", type: "formula" },
      { id: "TP5", label: "Friction Loss Calculation", sub: "Hazen-Williams / Darcy-Weisbach Method", type: "formula" },
      { id: "TP6", label: "Total Head Loss Verification", sub: "Static + Friction + Minor \u2264 Pump Head", type: "decision" },
      { id: "TP7", label: "Output: Pipe Schedule", sub: "Pipe Sizes + Material + Route \u2192 BOQ", type: "output" },
    ],
    connections: [
      { from: "TP1", to: "TP2" }, { from: "TP2", to: "TP3" }, { from: "TP3", to: "TP4" },
      { from: "TP4", to: "TP5" }, { from: "TP5", to: "TP6" }, { from: "TP6", to: "TP7" },
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
  P3T_FF: {
    title: "Transfer Pipe Sizing (Firefighting)",
    icon: "\uD83D\uDD27",
    color: "#dc2626",
    accentBg: "#fee2e2",
    steps: [
      { id: "TF1", label: "Input: Fire Pump Data", sub: "Selected pump + flow rate + head", type: "input" },
      { id: "TF2", label: "Flow Rate per Transfer Line", sub: "Hydrant / Sprinkler line duty", type: "process" },
      { id: "TF3", label: "Velocity Constraint", sub: "Max 3.0 m/s for fire mains", type: "formula" },
      { id: "TF4", label: "Pipe Diameter Calculation", sub: "D = \u221A(4Q / \u03C0V) \u2192 Standard size", type: "formula" },
      { id: "TF5", label: "Friction & Minor Losses", sub: "C=120 for fire pipes (Hazen-Williams)", type: "formula" },
      { id: "TF6", label: "Head Loss Verification", sub: "Total loss \u2264 Pump available head", type: "decision" },
      { id: "TF7", label: "Output: Fire Pipe Schedule", sub: "Pipe sizes + material \u2192 BOQ & Drawings", type: "output" },
    ],
    connections: [
      { from: "TF1", to: "TF2" }, { from: "TF2", to: "TF3" }, { from: "TF3", to: "TF4" },
      { from: "TF4", to: "TF5" }, { from: "TF5", to: "TF6" }, { from: "TF6", to: "TF7" },
    ],
  },
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
  const CUSTOM_IDS = new Set(["P3A","P3B","OWC","STP","FFP","FTK","FJD","FTB","RWH","SWD"]);
  const isCustomP3A = calcId === "P3A";
  const isCustomP3B = calcId === "P3B";
  const isCustomOWC = calcId === "OWC";
  const isCustomSTP = calcId === "STP";
  const isCustomFFP = calcId === "FFP";
  const isCustomFTK = calcId === "FTK";
  const isCustomFJD = calcId === "FJD";
  const isCustomFTB = calcId === "FTB";
  const isCustomRWH = calcId === "RWH";
  const isCustomSWD = calcId === "SWD";
  const isCustom = CUSTOM_IDS.has(calcId);

  // For generic flows
  const flow = !isCustom ? GENERIC_FLOWS[calcId] : null;

  const CUSTOM_META: Record<string, { title: string; icon: string; color: string }> = {
    P3A: { title: "Water Demand Calculation", icon: "\uD83D\uDCA7", color: "#3b82f6" },
    P3B: { title: "Electrical Load Calculation", icon: "\u26A1", color: "#f59e0b" },
    OWC: { title: "OWC Calculations", icon: "\u267B\uFE0F", color: "#10b981" },
    STP: { title: "STP Calculations", icon: "\uD83C\uDFED", color: "#06b6d4" },
    FFP: { title: "Fire Pump Head Calculation", icon: "\uD83D\uDE92", color: "#dc2626" },
    FTK: { title: "Fire Tank Size Estimation", icon: "\uD83D\uDEA8", color: "#dc2626" },
    FJD: { title: "Jockey & Drencher Pump", icon: "\uD83D\uDD27", color: "#dc2626" },
    FTB: { title: "Terrace Fire Booster Pump", icon: "\uD83C\uDFD7\uFE0F", color: "#dc2626" },
    RWH: { title: "Rainwater Harvesting & Tank Sizing", icon: "\uD83C\uDF27\uFE0F", color: "#3b82f6" },
    SWD: { title: "Storm Water Drainage Calculator", icon: "\u{1F30A}", color: "#3b82f6" },
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
      : isCustomOWC || isCustomSTP || isCustomFFP || isCustomFTK || isCustomFJD || isCustomFTB || isCustomRWH || isCustomSWD
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
                {service.calculations.map((calc, i) => (
                  <motion.button
                    key={calc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onCalcClick(calc.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all group"
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
                      {i + 1}
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
                        <span
                          className="rounded-full px-2.5 py-0.5"
                          style={{
                            backgroundColor: "#d1fae5",
                            color: "#065f46",
                            fontSize: "10px",
                            fontWeight: 600,
                          }}
                        >
                          READY
                        </span>
                      ) : (
                        <span
                          className="rounded-full px-2.5 py-0.5"
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                            fontSize: "10px",
                            fontWeight: 600,
                          }}
                        >
                          PREVIEW
                        </span>
                      )}
                      <ChevronRight
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: service.color }}
                      />
                    </div>
                  </motion.button>
                ))}
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
  const totalCalcs = SERVICES.reduce((sum, s) => sum + s.calculations.length, 0);
  const readyCalcs = SERVICES.reduce(
    (sum, s) => sum + s.calculations.filter((c) => c.status === "ready").length,
    0
  );

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            <strong style={{ color: "#1e293b" }}>{SERVICES.length}</strong> Services
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0]">
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            <strong style={{ color: "#1e293b" }}>{totalCalcs}</strong> Calculations
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d1fae5] border border-[#10b981]/20">
          <div className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span style={{ color: "#065f46", fontSize: "13px" }}>
            <strong>{readyCalcs}</strong> Fully Built
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fef3c7] border border-[#f59e0b]/20">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span style={{ color: "#92400e", fontSize: "13px" }}>
            <strong>{totalCalcs - readyCalcs}</strong> Preview
          </span>
        </div>
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
