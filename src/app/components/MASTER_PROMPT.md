# MASTER PROMPT — MEP Digital Ecosystem Visualization

> Paste this entire prompt into a new Figma Make (or similar React builder) chat to recreate the complete MEP Construction Industry Digital Ecosystem flowchart visualization app.

---

## PROJECT OVERVIEW

Build a comprehensive **MEP (Mechanical, Electrical, Plumbing) Construction Industry Digital Ecosystem** visualization as a React/SVG flow diagram viewer. This is a full-featured web application with:

- **5 tabbed views**: Services Dashboard, Concept Stage, Detailed Design Stage, Tender Stage, VFC Stage
- **4 multi-part SVG stage flowcharts** with serpentine grid layout, color-coded nodes, decision diamonds, reject loops, service tree fan-out/fan-in
- **10 fully-built calculation SVG flowcharts** (Water Demand, Electrical Load, OWC, STP, Fire Pump Head, Fire Tank, Jockey & Drencher, Terrace Booster, RWH, SWD)
- **2 Detailed Design custom calculation SVGs** (Cable Sizing DD_CB, Transfer Pipe Sizing DD_PIP)
- **40+ coming-soon calculations** with generic placeholder flows
- **Share system** with per-stage share links, PNG gallery, Mermaid code export
- **Team feedback system** with floating QR code panel and Supabase-backed feedback page
- PNG download via "Open in New Tab" approach (for iframe-sandboxed environments)
- Mermaid.js code browsing and copying for FigJam integration

**Tech Stack**: React 18, Tailwind CSS v4, React Router (data mode), Lucide React icons, Motion (for animations), Supabase KV backend, qrcode.react for QR codes.

---

## ARCHITECTURE & ROUTING

```
/ → MainDashboard (5-tab view: Services | Concept | Detailed | Tender | VFC)
/feedback → FeedbackPage (Supabase-backed feedback form + recent list)
/share/view/:type → SharePage (read-only stage view + PNG gallery)
/share/view/:type/:id → SharePage (individual calculation view)
/share/data/:type → SharePage (data mode, deprecated links)
/share/data/:type/:id → SharePage
/share/:type → SharePage (legacy route)
/share/:type/:id → SharePage (legacy route)
```

App.tsx uses `<RouterProvider router={router} />`.

---

## DESIGN SYSTEM & COLOR PALETTE

### Global Color Palette (used across all flowcharts)
```
blue:   { bg: "#dbeafe", bd: "#3b82f6", tx: "#1e40af", hd: "#3b82f6" }
green:  { bg: "#d1fae5", bd: "#10b981", tx: "#065f46", hd: "#10b981" }
purple: { bg: "#ede9fe", bd: "#8b5cf6", tx: "#5b21b6", hd: "#8b5cf6" }
cyan:   { bg: "#cffafe", bd: "#06b6d4", tx: "#155e75", hd: "#06b6d4" }
orange: { bg: "#fed7aa", bd: "#f97316", tx: "#9a3412", hd: "#f97316" }
teal:   { bg: "#ccfbf1", bd: "#14b8a6", tx: "#134e4a", hd: "#14b8a6" }
violet: { bg: "#e8d5ff", bd: "#a78bfa", tx: "#4c1d95", hd: "#a78bfa" }
rose:   { bg: "#ffe4e6", bd: "#f43f5e", tx: "#9f1239", hd: "#f43f5e" }
amber:  { bg: "#fef3c7", bd: "#f59e0b", tx: "#92400e", hd: "#f59e0b" }
term:   { bg: "#059669", bd: "#34d399", tx: "#ffffff" }
arrow:  "#94a3b8"
reject: "#ef4444"
merge:  "#3b82f6"
```

### Calculation SVGs use Bold Blue/Orange/Bright Green coding:
```
blue:   { bg: "#dbeafe", bd: "#2563eb", tx: "#1e40af" }  ← System steps
orange: { bg: "#fff7ed", bd: "#ea580c", tx: "#9a3412" }  ← User decisions
green:  { bg: "#d1fae5", bd: "#059669", tx: "#065f46" }  ← Final outputs
purple: { bg: "#ede9fe", bd: "#7c3aed", tx: "#5b21b6" }  ← Formulas
cyan:   { bg: "#cffafe", bd: "#0891b2", tx: "#155e75" }  ← DB Fetches
rose:   { bg: "#ffe4e6", bd: "#e11d48", tx: "#9f1239" }  ← Warnings
```

### Stage gradient bars (top of cards):
```
concept:  "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #f97316, #a78bfa)"
detailed: "linear-gradient(90deg, #f97316, #f59e0b, #8b5cf6, #06b6d4, #10b981)"
tender:   "linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6, #f59e0b, #f97316)"
vfc:      "linear-gradient(90deg, #a78bfa, #8b5cf6, #06b6d4, #10b981, #059669)"
```

---

## MAIN DASHBOARD (`/`)

Header with:
- Logo (blue-cyan gradient icon with Workflow lucide icon)
- Title "MEP Digital Ecosystem" + subtitle
- 5-tab toggle: Services | Concept | Detailed | Tender | VFC (pill buttons in #f1f5f9 bar)
- Right controls: Share button (gradient blue-violet), Export buttons (PNG + Mermaid), Zoom controls (ZoomIn/ZoomOut/Reset + percentage badge)

Content area:
- Services tab → ServicesDashboard component
- Other tabs → Stage flowchart SVG wrapped in white card with gradient top bar, zoom applied via CSS `zoom` property

Floating: ShareModal overlay + FeedbackQRPanel (React portal)

---

## SERVICES DASHBOARD

4 expandable service cards, each with color-coded header and list of calculations organized by stage:

### Service 1: Electrical (color: #f59e0b, icon: Zap)
**Concept Stage:**
- P3B: Electrical Load Calculations — Supply norms, apartment/common/MLCP loads, transformer & DG sizing [READY]

**Detailed Design Stage:**
- DD_CB: Cable Sizing Calculation — IS 3961/IEC 60502 current rating, voltage drop & short circuit withstand
- DD_ERT: Short Circuit & Earthing Design — Fault level analysis, adiabatic conductor sizing, earth pit resistance per IS 3043 / IEC 60909

**Tender Stage:**
- T_BOQ_EL: Electrical BOQ — Cable schedule, panel/DB, earthing/LP, switchgear & lighting quantities

**VFC Stage:**
- V_VFC_EL: Electrical VFC Update — Cable schedule, panel revision, SLD & earthing updates per contractor

### Service 2: Plumbing (color: #3b82f6, icon: Droplets)
**Concept Stage:**
- P3A: Water Demand Calculations — Population estimate, per capita demand, tank sizing & peak hour factor [READY]
- OWC: OWC Calculations — Waste generation, bin sizing, garbage room & OWC capacity (CPHEEO/NBC) [READY]
- STP: STP Calculations — Sewage generation (80/100 rule), STP sizing, area & treated water reuse [READY]
- DFP: Domestic & Flushing Pump Calculations — Pump head, flow rate & pump selection
- P3E: External Sewer Calculations — Sewer pipe sizing, STP capacity & RWH
- RWH: Rainwater Harvesting & Tank Sizing — Catchment runoff, downcomer sizing, velocity guard & NBC 2016 tank sizing [READY]
- SWD: Storm Water Drainage Calculator — Rational method runoff, Manning's equation, velocity monitoring & pipe sizing [READY]

**Detailed Design Stage:**
- DD_PIP: Transfer Pipe Sizing — Hunter's method, velocity check, IS 2065 standard pipe diameter [READY]
- DD_RSR: Riser Diagrams — Floor-wise riser layout, connection points & isolation valves
- DD_DRN: Drainage Calculations — Fixture unit count, drainage pipe sizing per floor
- DD_PMP: Pump Selection — Detailed pump curve matching, duty/standby selection
- DD_VNT: Vent Pipe Sizing — Vent stack sizing per drainage fixture load
- DD_WMT: Water Meter Sizing — Flow-based meter selection per zone/riser

**Tender Stage:**
- T_BOQ_PL: Plumbing BOQ

**VFC Stage:**
- V_VFC_PL: Plumbing VFC Update

### Service 3: HVAC (color: #8b5cf6, icon: Wind)
**Concept Stage:**
- P3D: Heat Load Calculations — Sensible & latent heat, cooling load, TR calculation & equipment sizing
- VENT: Ventilation Calculations — Air change rate, duct sizing & fresh air requirements
- PRESS: Pressurisation Calculations — Stairwell & lobby pressurisation system design

**Detailed Design Stage:**
- DD_DCT: Duct Sizing — Equal friction / velocity method, duct schedule per floor
- DD_EQP: Equipment Selection — Chiller/AHU/FCU selection from manufacturer data
- DD_VAV: VAV/FCU Selection — Variable air volume & fan coil unit sizing per zone
- DD_BMS: BMS Integration — Building management system points list & architecture
- DD_SMK: Smoke Management — Smoke extraction fan sizing & pressurisation calc

**Tender Stage:**
- T_BOQ_HV: HVAC BOQ

**VFC Stage:**
- V_VFC_HV: HVAC VFC Update

### Service 4: Firefighting (color: #ef4444, icon: Flame)
**Concept Stage:**
- FFP: Fire Pump Head Calculations — Static head, Hazen-Williams friction, system pressure & multi-zone pump output [READY]
- FTK: Fire Tank Size Estimation — IS-15105/NFPA-13 standards, sprinkler/hydrant/drencher volume & 300m3 safety gate [READY]
- FJD: Jockey & Drencher Pump Calculations — Jockey/drencher head loss, 20% safety factor & system pressure summation [READY]
- FTB: Terrace Fire Booster Pump Head — Hazen-Williams friction, pipe fittings, static head & residual pressure calc [READY]

**Detailed Design Stage:**
- DD_SPR: Sprinkler Hydraulic Calc — K-factor, design density, hydraulic calc & pipe network sizing
- DD_HYD: Hydrant Layout — Hydrant spacing, hose reel coverage & pipe sizing
- DD_DET: Detection System — Smoke/heat detector spacing, zone layout & panel sizing
- DD_PAV: PA/VA System — Public address & voice alarm speaker layout & wiring
- DD_SMX: Smoke Exhaust — Smoke extraction fan sizing & exhaust duct layout

**Tender Stage:**
- T_BOQ_FF: Firefighting BOQ

**VFC Stage:**
- V_VFC_FF: Firefighting VFC Update

Each calculation card in the services dashboard is clickable. [READY] ones open a full-screen overlay with:
- Color-coded header bar with title, icon, zoom controls, PNG download button, close button
- Legend bar showing node type color coding
- Scrollable SVG content with CSS zoom

Coming-soon ones show a generic vertical flow diagram rendered as inline SVG with step nodes connected by arrows. Each generic flow has steps with types: input, process, formula, output, decision — each with its own color.

### Stage grouping within each service card:
Calculations are grouped by stage with colored stage badges:
```
concept:  { label: "Concept Stage",         color: "#3b82f6", bg: "#dbeafe" }
detailed: { label: "Detailed Design Stage", color: "#8b5cf6", bg: "#ede9fe" }
tender:   { label: "Tender Stage",          color: "#14b8a6", bg: "#ccfbf1" }
vfc:      { label: "VFC Stage",             color: "#f97316", bg: "#fed7aa" }
```

---

## STAGE FLOWCHART LAYOUT ENGINE

All 4 stage flowcharts share the same layout engine pattern:

### Node Types:
- `header` — colored solid background, white text, rounded rect (rx=8), used for section headers
- `process` — light colored bg, dark border, dark text, rounded rect (rx=8)
- `decision` — diamond shape (rotated square), amber/yellow colors
- `terminal` — pill-shaped rect (rx=NH/2), green bg, white text (start/end nodes)
- `note` — dashed border, lower opacity, smaller text, positioned adjacent to parent nodes
- `checklist` — dashed border rect, used for verification steps
- `segment` — cards with pills showing options (e.g., "Hi-end", "Luxury")
- `service` — tall cards with header + pill list of sub-calculations, clickable pills

### Layout:
- Grid-based row system: `GRID: string[][]` where each row is an array of node IDs
- Node width (NW) = 210, Node height (NH) = 58
- Row gap (RGAP) = 96, Column gap (CGAP) = 40
- Padding: PX=120 (horizontal), PY=36 (vertical)
- Service card rows get extra gap (SVC_ROW_GAP = ~210-290)
- Segment rows get extra gap (SEG_ROW_GAP = 140)
- Nodes are centered horizontally within the SVG
- SVG uses class `stage-chart-svg` for PNG export targeting

### Connection Rendering:
- `normal` — gray (#94a3b8) downward arrows with arrowhead markers
- `reject` — red (#ef4444) arrows, typically right-side loops back to earlier nodes
- `merge` — blue (#3b82f6) arrows for merge points
- Arrow routing: straight vertical for same-column nodes, L-shaped (vertical→horizontal→vertical) for cross-column
- Labels shown on connection lines with white background pill

### Service Tree Fan-out/Fan-in:
When service cards (SVC_E, SVC_P, SVC_H, SVC_F) appear in a row:
- Parent header fans out downward to each service card
- Each service card fans in downward to a merge header
- Tree lines drawn from parent bottom-center to each child top-center, then from each child bottom-center to merge top-center

---

## CONCEPT STAGE FLOWCHART (Complete Node Data)

**Structure:**
- INITIATION: INIT → DATA → parallel split to Track A + Track B
- TRACK A (Input Matrix): A1 (Project Category) → 4-way segment branch (Residential/Commercial/Office/Retail) → A2M merge → A3-A14 (14 input fields) → Height check
- TRACK B (Design Deliverables): B1-B5 (Building selection, service list, dates, policy DB, drawing checklist)
- Height >90m decision → Fire Break Floor
- TRACKS MERGE (MRG)
- PART 2: MEP Policy Study — Single consolidated policy block (Electrical | Plumbing | Firefighting | Plantroom | Backup)
- PART 3: Calculations — 4 service cards (Electrical[P3B], Plumbing[P3A,OWC,STP,DFP,P3E,RWH,SWD], HVAC[P3D,VENT,PRESS], Firefighting[FFP,FTK,FJD,FTB]) → merge → Location-Based Formatting → Download Format Options
- PART 4: Space Matrix — Table + Display + Editable inputs
- PART 5: Detailed Space Planning — 5 parallel layouts (UGT, OWC Block, Substation & DG, Lifts, Toilet Vent & Pressurize) → Commercial check → Chiller → Master Plan Integration
- PART 6: Master Plan Integration — Architect receives → shares master → MEP reviews → Plan Finalized? decision (reject loop) → Detailed Space Plan → Concept Plans
- PART 7: Plans Verification — Checklist → All Plans Received? (reject loop)
- PART 8: MEP Review & Calcs — parallel: Reviews + Policy DB → Calculations → Download → Floor Layouts
- PART 9: Layout Sharing — Checklist → Share → Architect Reviews → Agreement? (reject loop)
- PART 10: Final Verification — Checklist → All Complete? (reject loop) → CONCEPT STAGE COMPLETE

**Segment nodes (row 4):**
- A2R: Residential → [Hi-end, Luxury, Aspirational, Casa, Crown]
- A2C: Commercial → [(per Commercial, policy)]
- A2O: Office → [Excelus, I-think, Supremus]
- A2T: Retail → [Boulevard, Experia]

**Input fields (A3-A14):**
3. No. of Buildings (Manual), 4. Plot Area, 5. Built Up Area, 6. FSI, 7. Flat Matrix (Dropdown+Manual), 8. Carpet Area, 9. Area Statement (Hardscape+Softscape), 10. Building Height, 11. Floor-to-Floor Height, 12. Car Parks, 13. Location (Coords → Google Auto), 14. Society Formation (Button+Checkboxes)

**Notes attached:**
- A7N: "Editable in DB" — flat typology editable
- A13N: "Region → Format" — MSEDCL/KSEDCL etc.
- A14N: "Society Flow" — Auto-show Society 2 after 1st Submit
- SN1: "Data Source" — Ventilation, Pressurization & Lifts from DB

---

## DETAILED DESIGN STAGE FLOWCHART

**Structure (9 parts):**
1. **Initiation**: DD_INIT
2. **Architect Drawing Coordination**: Auto-generate drawing list → Auto-mail → Architect shares plans → MEP checks → Critical/Beneficial checklist (parallel) → Critical complete? (reject) → Full list complete? → User proceed anyway? (reject)
3. **Detailed Input Data**: Floor-wise area → Equipment schedules → Load data → Fire safety → Shaft locations
4. **Detailed Calculations**: 4 service cards: Electrical[DD_CB,DD_ERT], Plumbing[DD_PIP,DD_RSR,DD_DRN,DD_PMP,DD_VNT,DD_WMT], HVAC[DD_DCT,DD_EQP,DD_VAV,DD_BMS,DD_SMK], Firefighting[DD_SPR,DD_HYD,DD_DET,DD_PAV,DD_SMX] → merge → Format
5. **Drawing Production**: 5 parallel drawings (Electrical, Plumbing, HVAC, Firefighting, Plantroom) → All Floor Layouts → Compiled
6. **Drawing Verification**: Checklist → Complete? (reject loop)
7. **MEP Review**: parallel: Reviews + Policy DB → Service Review → QC Checklist → QC Passed? (reject loop)
8. **Layout Sharing**: Checklist → Share → Architect Reviews → Agreement? (reject loop)
9. **Final Verification**: Checklist → Register → Complete? (reject loop) → DETAILED DESIGN COMPLETE

---

## TENDER STAGE FLOWCHART

**Structure (5 parts):**
1. **Initiation**: T_INIT → Project Handover → Tender Kickoff → Tender Strategy
2. **BOQ Preparation**: 4 service cards: Electrical BOQ, Plumbing BOQ, HVAC BOQ, Firefighting BOQ → merge
3. **Tender Package**: parallel: DB-fetched (Tech Specs → Approved Makes) + User-selected (Schematics → Layouts) → Assemble Package
4. **Tender Checklist**: Verify → Approved? (reject loop)
5. **Float to DCO**: Float package → DCO Attachment → TENDER STAGE COMPLETE

---

## VFC (VALIDATED FOR CONSTRUCTION) STAGE FLOWCHART

**Structure (10 parts):**
1. **Deliverables**: V_INIT → Create Deliverables List → Create Drawing List
2. **Architect Coordination**: Create Architect Drawing List → Float → Receive Layouts
3. **MEP Design & Approval**: Design on Layouts → Share for Approval → Approved? (reject loop)
4. **VFC Calculations**: 4 service cards: Electrical VFC, Plumbing VFC, HVAC VFC, Firefighting VFC → merge
5. **Drawing Production**: 5 parallel drawings + Coordination Sections → Compiled
6. **Drawing Verification**: Checklist → Complete? (reject loop)
7. **Drawing Checklist & Distribution**: Share for Approval → Approved? (reject) → Drawing Checklist → Share to Stakeholders → Share to Site Team
8. **Contractor Submission**: Release Checklist → Issue to Contractor → Contractor Reviews → Accepted? (reject loop)
9. **Site Coordination**: Installation Support → Change Orders → Inspection → Snag List → All Snags Resolved? (reject loop)
10. **Final Verification**: Final Checklist → As-Built Drawings → O&M Manuals → Document Register → Complete? (reject loop) → VFC STAGE COMPLETE

---

## 10 READY CALCULATION SVG FLOWCHARTS

Each is a standalone React component exporting an SVG with:
- Phase bands (dashed rounded rects with semi-transparent fills)
- Step badges (numbered circles)
- Reusable SVG primitives: SysBox (system step), DecisionDiamond, OutputBox, Arrow, DbIcon
- Color coding: Bold Blue=system, Orange=decisions, Bright Green=outputs, Purple=formulas, Cyan=DB, Rose=warnings

### 1. Water Demand Calculation (P3A) — W:1560, H:3700
**5 Phases:**
1. **Project Selection & Auto-Fetch**: Select Project → Auto-Fetch Input Matrix → Auto-Fetch Flat Matrix → Master Matrix Data Dashboard (7-column card: Floors, Units, Typology, Occupancy, Landscape Area, Car Parks, HVAC Makeup)
2. **User Validation & External Override**: Data Review Panel (6 checkboxes) → Decision: Accept or Override → External Demand Panel (Swimming Pool, Irrigation, Car Washing, HVAC Makeup, Club House — each with KLD unit)
3. **Policy Engine (Lodha vs NBC 2016)**: Detect Policy → Per Capita Demand Lookup → Peak Hour Factor (1.5x residential / 2.0x commercial) → Fire Reserve (IS-15105/NFPA-13) → Flushing Reuse %
4. **Calculation & Results**: Multi-branch fan-out to Sub-Categories (Domestic, Flushing, Fire Reserve, Swimming Pool, Irrigation, Car Wash, HVAC Makeup, Club/Amenities) → each with Table Matrix (per-building breakdown) → Formula aggregation → Summary Dashboard (Total Water Demand KLD, Peak Hour Factor, Tank Sizes, Fire Reserve, Treated Water Reuse %)
5. **Export & Format Selection**: MOEF vs Lodha toggle → Download in selected format

### 2. Electrical Load Calculation (P3B) — W:1600, H:7800
**Sections:**
1. **Entry**: Select Project → Auto-fetch building config
2. **Supply Authority Norms**: Decision: City Type → Industrial vs Metro → kVA/unit lookup from DB
3. **Apartment Load**: Per-flat load × quantity → Total apartment load per building
4. **Building Common Area**: Lifts, corridor lighting, pumps → Per-floor common load → Aggregate
5. **Society Common Area**: Club house, gym, STP, OWC, landscape lighting → Aggregate
6. **MLCP Load**: Multi-level car park: lighting + ventilation + EV charging → Per-level → Total
7. **Other Loads**: Signage, CCTV, intercom, DG auxiliary → Sum
8. **Final Load Summary**: All categories aggregate → Total Connected Load → Demand Factor → Maximum Demand
9. **Transformer Sizing**: Max Demand → Select nearest standard transformer (500/1000/1600/2000 kVA) → Number of transformers → Oil/Dry type decision
10. **DG Sizing**: Essential load % → DG capacity → Number of DG sets → Fuel tank sizing

### 3. OWC Calculations — W:1400, H:2200
**Phases:**
1. **DB Fetch**: Project data → Population → Waste norms from DB
2. **Waste Generation**: Total population × waste/person/day → Total wet + dry waste
3. **Bin Sizing**: Segregation bins (wet/dry) → collection frequency → bin count + sizes
4. **Infrastructure**: Garbage room area → Collection area → Transfer route
5. **OWC Processing**: Daily organic waste → Machine rating from DB → Capacity selection
6. **Summary Dashboard**: Machine capacity, space requirement, bin schedule

### 4. STP Calculations — W:1400, H:2600
**Modules:**
1. **Data Integration**: Fetch Domestic Water (DW) + Flushing Water (FW) from Water Demand calc
2. **Sewer Generation**: S_dom = DW × 0.80 (80% Rule), S_flush = FW × 1.00 (100% Rule) → Total
3. **Infrastructure Sizing**: STP Capacity → Area = Capacity × 1.0 Sq.M/KLD
4. **Treated Water Reuse**: Flushing + Irrigation + Sludge + Cooling allocation
5. **Output Dashboard**: Total sewage CMD, STP size, Area, Reuse %

### 5. Fire Pump Head Calculation (FFP) — W:1560, H:5600
**5 Phases:**
1. **Project Selection & Data Source Toggle**: CFO NOC vs NBC selection → Building data auto-fetch
2. **User Validation & Automated Extraction**: Display data → Accept/Override
3. **Policy Engine**: NBC 2016 / UDCPR tank standards → Zone classification
4. **Calculation Engine**: Hazen-Williams friction calculation (C=120 for fire pipes) → Static head + friction + fittings + 20% safety factor → Multi-zone pump sets → Motor power calc
5. **Floor-Wise Pump Set Output**: MSMO vs End Suction pump type → Floor-wise distribution table → Export

### 6. Fire Tank Size Estimation (FTK) — W:1400, H:2400
**Phases:**
1. **Data Fetch**: Building data → Occupancy, basement area, hazard class
2. **Standards Lookup**: IS-15105/NFPA-13 → Sprinkler/hydrant flow rates & duration
3. **Volume Calculations**: Sprinkler Volume (Area × Flow × Duration) + Hydrant Volume (1800 LPM × Duration) + Drencher Volume (Linear length × 35 L/min/m)
4. **Safety Gate**: 300 m3 minimum → max(calculated, 300)
5. **Output**: Total fire water tank capacity (m3)

### 7. Jockey & Drencher Pump (FJD) — W:1400, H:2300
**Phases:**
1. **Data Fetch**: Static head & run lengths from main pump module
2. **Hydraulic Parameters**: Pipe schedule, friction factors
3. **Jockey Head Loss**: 50/80mm small-bore friction calculation
4. **Drencher Head Loss**: High-volume water curtain supply friction
5. **+20% Safety Factor**: Applied to all frictional results
6. **System Pressure**: Jockey +0.5 Bar, Drencher +3.5 Bar
7. **Output**: Pump schedule with jockey & drencher say values

### 8. Terrace Fire Booster Pump (FTB) — W:1400, H:2200
**Phases:**
1. **Building & Tank Data**: Outlet elevation, terrace tank LWL
2. **Pipe & Friction Data**: GI Class C @ 100mm, C=120, 900 LPM
3. **Hazen-Williams Friction**: Straight run + fittings equivalent lengths
4. **+20% Safety Factor**: On sum of pipe + fitting losses
5. **Total Head Summation**: Friction + Static + 3.5 Bar residual
6. **Output**: Booster head in Bar & meters, rounded say value

### 9. Rainwater Harvesting (RWH) — W:1400, H:2800
**Phases:**
1. **Catchment Input**: Area (sqm), surface type (C=0.95 roof / 0.30 paved)
2. **Hydrology Input**: Peak rainfall intensity (mm/hr)
3. **Yield Engine**: Peak runoff + harvestable volume calculation
4. **RWDP Downcomer Sizing**: NBC 2016 table lookup
5. **Velocity Guard**: Manning's equation, siltation alarm check
6. **Tank Sizing (NBC 2016)**: Standard capacities, retention period
7. **Output Dashboard**: Peak flow, volume, pipe sizes, tank dimensions

### 10. Storm Water Drainage (SWD) — W:1400, H:2500
**Phases:**
1. **Input Module**: Catchment area, runoff coefficient (C), rainfall intensity (I)
2. **Rational Method**: Q = (C×I×A) / 3600
3. **Design Parameters**: Slope (S), Manning's n
4. **Manning's Equation**: Pipe/channel diameter + velocity calculation
5. **Velocity Decision**: V≥0.5? Safe vs Siltation Alarm
6. **Capacity Check**: Q_cap > Q_peak verification
7. **Output**: Pipe dia, velocity, capacity schedule

---

## GENERIC FLOW DEFINITIONS (Coming-Soon Calculations)

Each coming-soon calculation has a `CalcFlow` definition with steps and connections rendered as a simple vertical flow SVG. Steps have types: input (blue), process (green), formula (purple), output (amber), decision (rose). Here are ALL of them:

### DFP — Domestic & Flushing Pump
Steps: Input (Building Height & Demand) → Static Head → Friction & Minor Losses → TDH → Flow Rate → Pump Selection → Output: Pump Schedule

### P3E — External Sewer
Steps: Site Data → Sewer Load → Sewer Pipe Sizing → STP Capacity → RWH Check → Output

### P3D — Heat Load
Steps: Area + Location → Climate Data → Sensible Heat → Latent Heat → Total Cooling Load → TR Calculation (÷3024) → Equipment Sizing → Output

### VENT — Ventilation
Steps: Room Data → ACH (NBC/ASHRAE) → Fresh Air (CFM=Volume×ACH/60) → Duct Sizing → Fan Selection → Output

### PRESS — Pressurisation
Steps: Stairwell Data → Pressure Differential (25-50 Pa) → Leakage Air (Q=C×A×ΔP^n) → Door Open Velocity (0.75 m/s) → Total Air Flow → Fan Selection → Output

### DD_CB through DD_SMX — All Detailed Design calculations (compact 3-5 step flows)
### T_BOQ_EL through T_BOQ_FF — All Tender BOQ calculations (5-step flows: Drawings → BOQ categories → Rate Analysis → Output)
### V_VFC_EL through V_VFC_FF — All VFC calculations (4-step flows: Submittals → Revision → Confirmation → Output)

---

## SHARE MODAL

Stage-centric modal with:
- 5 stage cards (Concept, Detailed, Tender, VFC, Services) each expandable
- Per-stage: "View + PNG" share link, "Copy Mermaid Code" button, "Copy All Mermaid" button
- Individual calculation links for stages with ready calcs
- Copy link uses `copyToClipboard()` utility
- Base URL: `${window.location.origin}/share/view/${stageId}`
- Calc URLs: `${window.location.origin}/share/view/calc/${calcId}`

---

## SHARE PAGE (`/share/view/:type`)

Read-only page with:
- Header: Back arrow, title, zoom controls, "Download All PNGs" button, "Copy Mermaid" button, "Copy Link" button
- For stage views: main stage flowchart card + all mapped calculation flowcharts below (each in own card with `data-chart-id` and `data-chart-label` attributes)
- For calc views: individual calculation SVG with colored header, legend bar
- PNG Gallery Modal: renders all SVGs → canvas → PNG data URLs, shows thumbnail gallery, each with "Open in New Tab" button that opens PNG in new browser tab with right-click save instructions (workaround for iframe download restrictions)
- `STAGE_CALC_IDS`: concept has [P3A, P3B, OWC, STP, FFP, FTK, FJD, FTB, RWH, SWD], others are empty arrays

---

## EXPORT BUTTONS (Main Dashboard)

Two buttons: PNG + Mermaid
- PNG: Renders `.stage-chart-svg` SVG → canvas → data URL → opens in new tab for saving
- Mermaid: Opens modal with sidebar tabs (stage + each calc) showing Mermaid.js code, copy individual or copy all

---

## MERMAID CODES

Centralized `mermaid-codes.ts` file containing:
- `CONCEPT_STAGE_MERMAID` — full Mermaid flowchart TD code for concept stage
- `DETAILED_DESIGN_MERMAID` — full Mermaid flowchart TD code for detailed design
- `TENDER_STAGE_MERMAID` — full Mermaid flowchart TD code for tender stage
- `VFC_STAGE_MERMAID` — full Mermaid flowchart TD code for VFC stage
- `CALC_MERMAID_CODES` — Record<string, {title, code}> for each calculation (P3A, P3B, OWC, STP, FFP, FTK, FJD, FTB, RWH, SWD)
- `STAGE_MERMAID_MAP` — maps stage ID to Mermaid code
- `STAGE_CALC_IDS` — maps stage ID to array of calc IDs
- `STAGE_LABELS` — maps stage ID to display label

Each Mermaid code uses classDef for styling:
```
classDef terminal fill:#059669,stroke:#34d399,color:#ffffff
classDef process fill:#ede9fe,stroke:#8b5cf6,color:#5b21b6
classDef decision fill:#fef3c7,stroke:#f59e0b,color:#92400e
classDef reject fill:#ffe4e6,stroke:#f43f5e,color:#9f1239
classDef service fill:#cffafe,stroke:#06b6d4,color:#155e75
```

---

## FEEDBACK SYSTEM

### Floating QR Panel (`feedback-qr-panel.tsx`)
- Rendered via React portal to document.body
- Small floating button (bottom-right corner) with MessageSquarePlus icon
- Expands to show QR code (using qrcode.react) linking to `/feedback?stage={currentStage}`
- Includes "Copy Link" and "Open" buttons
- Auto-minimizes after 10 seconds

### Feedback Page (`/feedback`)
- Form with: Feedback type (Suggestion/Issue/Praise/General), Stage selector, Name, Message, Star rating (1-5)
- Submits via POST to Supabase backend
- Shows recent feedback entries below form
- Animated with Motion (motion/react)

### Backend (Supabase Edge Function)
```
GET  /make-server-6fb5a00e/feedback → list recent feedback from KV
POST /make-server-6fb5a00e/feedback → save new feedback to KV (key: feedback:{id})
```

---

## CLIPBOARD UTILITY

`clipboard-utils.ts` exports `copyToClipboard(text)`:
1. Try `navigator.clipboard.writeText(text)`
2. On failure (permissions-policy block), fall back to `document.execCommand('copy')` with hidden textarea

---

## PNG DOWNLOAD APPROACH

Since programmatic `<a download>.click()` is blocked in sandboxed iframe environments:

1. **Share Page**: "Download All PNGs" button renders all `[data-chart-id]` SVGs to canvas → PNG data URLs at 3x scale, then opens a **PNG Gallery Modal** with thumbnails. Each has "Open in New Tab" button that opens a clean HTML page with the PNG for right-click saving.

2. **Main Dashboard PNG button**: Same approach — renders SVG → canvas → data URL → opens in new tab with save instructions.

3. **Services Dashboard calc overlay**: Has a PNG button that opens the rendered calc in a new tab.

Key function: `svgToDataUrl(svgEl)` — clones SVG, sets explicit width/height from viewBox, serializes to `data:image/svg+xml;charset=utf-8,...` URL, loads into Image, draws on canvas at 3x scale, exports as `canvas.toDataURL('image/png')`.

---

## PACKAGES REQUIRED

```json
{
  "lucide-react": "latest",
  "motion": "latest",
  "react-router": "latest",
  "qrcode.react": "latest"
}
```

The app also has @mui/material, recharts, and many radix-ui packages installed but they are NOT used by this MEP ecosystem — they were pre-installed in the environment.

---

## IMPLEMENTATION NOTES

1. **All flowcharts are pure React/SVG** — no Mermaid rendering library is used for display. Mermaid codes are stored as text strings for copy-to-clipboard export only.

2. **SVG reusable components** are defined per-file (PhaseBand, StepBadge, SysBox/Box, Diamond/DecisionDiamond, OutputBox, Arrow, DbIcon) — they follow the same pattern but with slight variations per file.

3. **Layout computations** use a simple grid system: iterate GRID rows, compute cumulative Y position adding RGAP or SVC_ROW_GAP, center each row horizontally.

4. **Service card tree rendering**: When a row contains service IDs, the renderer draws fan-out lines from the parent header node to each service card, and fan-in lines from each service card to the merge header below.

5. **Note annotations**: Notes are positioned relative to their parent node using dx/dy offsets defined in an ANNS array.

6. **All calculations share common structural patterns**: Phase bands → Step badges → Node boxes → Arrow connections → Dashboard output panels.

7. **The app runs entirely client-side** except for the feedback system which uses Supabase KV storage.

---

## BUILD ORDER SUGGESTION

1. Start with routing + App.tsx + MainDashboard shell
2. Build the Concept Stage flowchart first (most complex, establishes all patterns)
3. Build ServicesDashboard with all 4 service cards + all calculation definitions
4. Build the 10 ready calculation SVGs one by one
5. Build Detailed Design, Tender, VFC stage flowcharts (follow concept pattern)
6. Build Share Modal + Share Page + PNG Gallery
7. Build Export Buttons + Mermaid codes data file
8. Build Feedback QR Panel + Feedback Page + backend endpoints
9. Add clipboard utility

---

*This prompt captures the complete MEP Digital Ecosystem as of March 2026. Every node ID, connection, color, layout rule, and feature is documented above.*