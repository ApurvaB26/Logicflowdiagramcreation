// =====================================================================
// MERMAID CODES — All Stages + All Calculations
// =====================================================================

// ── STAGE MERMAID CODES ──

export const CONCEPT_STAGE_MERMAID = `flowchart TD
    %% ══════════════════════════════════════
    %% CONCEPT STAGE — COMPLETE FLOW CHART
    %% ══════════════════════════════════════

    %% ── INITIATION ──
    INIT([🟢 CONCEPT STAGE<br/>Architect Initiates New Project])
    DATA[Architect Shares Data<br/>Area Statement + Project Plan]
    INIT --> DATA

    %% ── PARALLEL TRACKS SPLIT ──
    DATA --> TA
    DATA --> TB

    %% ══════════════════════════════════════
    %% TRACK A: INPUT MATRIX (Left)
    %% ══════════════════════════════════════
    TA[/TRACK A: Input Matrix<br/>Project Data Collection/]
    A1[1. Project Category<br/>📋 Dropdown: Residential / Commercial / Office / Retail]
    TA --> A1

    A2R[Residential Segments<br/>📋 DD: Hi-end / Luxury / Aspirational / Casa / Crown]
    A2C[Commercial Segments<br/>📋 DD: per Commercial policy]
    A2O[Office Segments<br/>📋 DD: Excelus / I-think / Supremus]
    A2T[Retail Segments<br/>📋 DD: Boulevard / Experia]

    A1 -->|Residential| A2R
    A1 -->|Commercial| A2C
    A1 -->|Office| A2O
    A1 -->|Retail| A2T

    A2M([Segment Selected<br/>Category + Segment Confirmed → Continue])
    A2R --> A2M
    A2C --> A2M
    A2O --> A2M
    A2T --> A2M

    A3[3. No. of Buildings<br/>✍ Manual Typing → Calcs & Planning]
    A4[4. Plot Area<br/>✍ Manual Typing]
    A5[5. Built Up Area<br/>✍ Manual Typing]
    A6[6. FSI<br/>✍ Manual Typing]
    A7[7. Flat Matrix<br/>📋 DD 1BHK/2BHK + ✍ Qty Manual]
    A8[8. Carpet Area<br/>✍ Manual Typing]
    A9[9. Area Statement<br/>✍ Manual Typing: Hardscape + Softscape]
    A10[10. Building Height<br/>✍ Manual Typing]
    A11[11. Floor-to-Floor Height<br/>✍ Manual Typing]
    A12[12. Car Parks<br/>✍ Manual Typing]
    A13[13. Location<br/>✍ Manual Typing: Coords → Google Auto]
    A14[14. Society Formation<br/>🔘 Button + ☑ Checkboxes → Submit]

    A2M --> A3 --> A4 --> A5 --> A6 --> A7 --> A8
    A8 --> A9 --> A10 --> A11 --> A12 --> A13 --> A14

    %% ══════════════════════════════════════
    %% TRACK B: DESIGN DELIVERABLES (Right)
    %% ══════════════════════════════════════
    TB[/TRACK B: Design Deliverables<br/>Timeline & Drawing Control/]
    B1[Select Building<br/>📋 Dropdown: Auto-display Building List]
    B2[Stage-wise Service List<br/>🤖 Auto-generated per Stage]
    B3[Service-wise Dates<br/>🤖 Auto-generated per Service per Stage]
    B4[Policy DB Lookup<br/>🤖 System auto-generates dates from DB]
    B5[Drawing Checklist<br/>☑ Checkboxes: Separate list per stage]
    BD1{All Drawings Done?<br/>Stage Unlock Gate}
    B6[Stage On Hold<br/>Next stage locked until complete]

    TB --> B1 --> B2 --> B3 --> B4 --> B5 --> BD1
    BD1 -->|Yes| MRG
    BD1 -->|No| B6
    B6 -.->|Recheck| B5

    %% ══════════════════════════════════════
    %% TRACKS MERGE
    %% ══════════════════════════════════════
    A14 --> MRG
    MRG([TRACKS MERGE<br/>Both Tracks Complete → Continue])

    %% ══════════════════════════════════════
    %% PART 2: MEP POLICY STUDY
    %% ══════════════════════════════════════
    MRG --> P2
    P2[/PART 2: MEP Policy Study<br/>Database Studies Required Policies/]
    P2A[Electrical Policy<br/>Electrical Design Standards]
    P2B[Plumbing Policy<br/>Plumbing Design Standards]
    P2C[Firefighting Policy<br/>Fire Protection Standards]
    P2D[Plantroom Policy<br/>Plant Room Requirements]
    P2E[Backup Policy<br/>Backup Systems Standards]

    P2 --> P2A & P2B & P2C & P2D & P2E

    %% ══════════════════════════════════════
    %% PART 3: CALCULATIONS
    %% ══════════════════════════════════════
    P2A & P2B & P2C & P2D & P2E --> P3
    P3[/PART 3: Calculations<br/>Generated from Policies + Input Data/]
    P3A[Water Demand Calc<br/>Refer to Calculations Page]
    P3B[Electrical Load Calc<br/>Refer to Calculations Page]
    P3C[Pump Head Calculation<br/>Refer to Calculations Page]
    P3D[Heat Load Calculation<br/>Refer to Calculations Page]

    P3 --> P3A & P3B & P3C & P3D

    P3L[Location-Based Formatting<br/>GPS → Region → MSEDCL/KSEDCL etc.]
    P3F[Download Format Options<br/>Lodha / MOEF / MSEDCL / NBC / CAM Est.]
    P3P[Pump Selection<br/>DB Lookup → Best Options + Pump Size]

    P3A --> P3L
    P3B --> P3L
    P3L --> P3F
    P3D --> P3F
    P3C --> P3P

    %% ══════════════════════════════════════
    %% PART 4: SPACE MATRIX
    %% ══════════════════════════════════════
    P3F & P3P --> P4
    P4[/PART 4: Space Matrix<br/>MEP Design Shares Space Matrix/]
    P4A[Space Matrix Table<br/>Table format fed to DB — Data from Calcs]
    P4B[Display Input Data<br/>Shows inputs used to fill the matrix]
    P4C[User Editable Inputs<br/>User can edit some of the input values]

    P4 --> P4A --> P4B --> P4C

    %% ══════════════════════════════════════
    %% PART 5: DETAILED SPACE PLANNING
    %% ══════════════════════════════════════
    P4C --> P5
    P5[/PART 5: Detailed Space Planning<br/>MEP Shares Layout with Space Matrix/]
    S1[UGT Layout Detailed<br/>Pump Room + Tanks + Pump Blocks]
    S2[STP Layout Blocks<br/>Total Area Shown in Block Only]
    S3[OWC Layout Detailed<br/>Machine Room + Wet Storage Area]
    S4[Substation & DG Detail<br/>Detailed Substation + DG Layout]
    S5[Lifts Space Planning<br/>No. of Lifts + Size + Space from DB]

    P5 --> S1 & S2 & S3 & S4 & S5

    SD1{Commercial Project?<br/>Check Project Type}
    S6[Chiller Space Planning<br/>Only for Commercial Projects]

    S5 --> SD1
    SD1 -->|Yes| S6
    SD1 -->|No| S7
    S6 --> S7

    S7[Toilet Vent & Pressurize<br/>Ventilation + Pressurization from DB]
    S1 & S2 & S3 & S4 --> S7

    SD2{Height > 90m?<br/>Fire Break Floor Check}
    S7 --> SD2

    SD3{User Wants Plan?<br/>Optional: UGT + Fire Break}
    SSK[Skip Fire Plan<br/>Height ≤90m or User Declined]

    SD2 -->|"Yes (>90m)"| SD3
    SD2 -->|"No (≤90m)"| SSK

    SD4{As Per CFO or NBC?<br/>Standard Selection}
    SD3 -->|Yes| SD4
    SD3 -->|No| SSK

    S8[Fire Break Floor + UGT<br/>As per selected standard CFO/NBC]
    SD4 --> S8

    %% ══════════════════════════════════════
    %% PART 6: ARCHITECT CONVERGENCE
    %% ══════════════════════════════════════
    S8 & SSK --> P6
    P6[/PART 6: Architect Convergence<br/>Master Plan Integration/]
    P6A[Architect Receives<br/>Space Matrix + Space Planning Layout]
    P6B[Architect Shares Master<br/>Includes MEP: UGT/STP locations etc.]
    P6C[MEP Reviews Master Plan<br/>Review Architect Incorporation]
    P6D{Plan Finalized?<br/>MEP + Architect Agreement}
    P6E[MEP Detailed Space Plan<br/>UGT internals, OWC detail, Sub/DG etc.]
    P6F[Architect Concept Plan<br/>All Floor Plans Included]

    P6 --> P6A --> P6B --> P6C --> P6D
    P6D -->|Yes| P6E
    P6D -.->|"No – Revise"| P6C
    P6E --> P6F

    DONE([🏁 CONCEPT STAGE COMPLETE<br/>Proceed to Schematic Design Stage])
    P6F --> DONE

    classDef initiation fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    classDef trackA fill:#dbeafe,stroke:#3b82f6,stroke-width:1.5px,color:#1e40af
    classDef trackB fill:#ccfbf1,stroke:#14b8a6,stroke-width:1.5px,color:#134e4a
    classDef merge fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46
    classDef policy fill:#d1fae5,stroke:#10b981,stroke-width:1.5px,color:#065f46
    classDef calc fill:#ede9fe,stroke:#8b5cf6,stroke-width:1.5px,color:#5b21b6
    classDef space fill:#cffafe,stroke:#06b6d4,stroke-width:1.5px,color:#155e75
    classDef plan fill:#fed7aa,stroke:#f97316,stroke-width:1.5px,color:#9a3412
    classDef converge fill:#e8d5ff,stroke:#a78bfa,stroke-width:1.5px,color:#4c1d95
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef header fill:#3b82f6,stroke:#3b82f6,stroke-width:2px,color:#ffffff

    class INIT,DONE terminal
    class DATA,TA,A1,A2R,A2C,A2O,A2T,A2M,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14 trackA
    class TB,B1,B2,B3,B4,B5 trackB
    class B6 reject
    class BD1,SD1,SD2,SD3,SD4,P6D decision
    class MRG merge
    class P2,P2A,P2B,P2C,P2D,P2E policy
    class P3,P3A,P3B,P3C,P3D,P3L,P3F,P3P calc
    class P4,P4A,P4B,P4C space
    class P5,S1,S2,S3,S4,S5,S6,S7,SSK plan
    class S8 reject
    class P6,P6A,P6B,P6C,P6E,P6F converge`;

export const DETAILED_DESIGN_MERMAID = `flowchart TD
    %% ══════════════════════════════════════
    %% DETAILED DESIGN STAGE — COMPLETE FLOW
    %% ══════════════════════════════════════

    %% ── PART 1: INITIATION ──
    INIT([🟢 DETAILED DESIGN STAGE<br/>Triggered After Concept Completion])
    CS[Concept Stage Data Loaded<br/>Input Matrix + Space Matrix + Calcs from DB]
    INIT --> CS

    %% ── 3 PARALLEL TRACKS ──
    CS --> P2 & TB & DWC

    %% ── TRACK A: ARCHITECT DRAWING LIST ──
    P2[/TRACK A: Architect Drawing List<br/>Auto-list & Auto-mail System/]
    P2A[Auto-List Drawing Requirements<br/>🤖 System generates list from DB per service]
    P2B[Auto-Mail to Architect<br/>🤖 System sends mail with required drawings list]
    P2C[Architect Uploads Drawings<br/>📂 Upload portal per drawing type]
    P2D{All Drawings Received?<br/>Critical/Beneficial Gate}
    P2E[Critical Missing → Stage Blocked<br/>Cannot proceed without critical drawings]
    P2F[Beneficial Missing → Warning<br/>Proceed with advisory note]

    P2 --> P2A --> P2B --> P2C --> P2D
    P2D -->|All Critical Received| MRG
    P2D -->|Critical Missing| P2E
    P2D -->|Only Beneficial Missing| P2F
    P2E -.->|Re-request| P2B
    P2F --> MRG

    %% ── TRACK B: MEP DESIGN DELIVERABLES LIST ──
    TB[/TRACK B: MEP Deliverables<br/>Timeline & Drawing Control/]
    TB1[Select Building<br/>📋 Dropdown: Auto-display Building List]
    TB2[Stage-wise Service List<br/>🤖 Auto-generated per Stage]
    TB3[Service-wise Dates<br/>🤖 Auto-generated per Service per Stage]
    TB4[Policy DB Lookup<br/>🤖 System auto-generates dates from DB]
    TB5[Drawing Checklist<br/>☑ Checkboxes: Separate list per stage]

    TB --> TB1 --> TB2 --> TB3 --> TB4 --> TB5 --> MRG

    %% ── TRACK C: DRAWING CHECK ──
    DWC[/TRACK C: Drawing Check<br/>Verify Received Drawings/]
    DWC1[Architect Plans Checklist<br/>☑ Verify all floor plans received]
    DWCD{All Plans Received?<br/>Completeness Check}
    DWCR[Request Missing Plans<br/>📨 Notify Architect → loop back]

    DWC --> DWC1 --> DWCD
    DWCD -->|Yes| MRG
    DWCD -->|No| DWCR
    DWCR -.->|Re-verify| DWC1

    %% ── TRACKS MERGE ──
    MRG([TRACKS MERGE<br/>All Tracks Complete → Continue])
    MRG --> P3H

    %% ── PART 3: DETAILED INPUT DATA ──
    P3H[/PART 3: Detailed Input Data<br/>Enhanced from Concept Stage/]
    P3A[Detailed Floor Plans Received<br/>Per Building, Per Floor]
    P3B[Fixture Schedule<br/>Bathroom/Kitchen/Utility fixtures per unit]
    P3C[Riser Shaft Locations<br/>Architect confirmed shaft positions]
    P3D[Equipment Room Finalization<br/>Confirmed UGT/STP/Substation rooms]

    P3H --> P3A & P3B & P3C & P3D

    %% ── PART 4: DETAILED CALCULATIONS ──
    P3A & P3B & P3C & P3D --> P4
    P4[/PART 4: Detailed Calculations<br/>Service-wise Detailed Design Calcs/]

    %% Service tree fan-out
    P4EL[⚡ Electrical<br/>Cable Sizing · Panel Schedule · SLD · Earthing · Lightning · Bus Bar]
    P4PL[💧 Plumbing<br/>Pipe Sizing · Riser Diagrams · Drainage · Pump Selection · Vent · Meter]
    P4HV[🌀 HVAC<br/>Duct Sizing · Equipment Selection · VAV/FCU · BMS · Smoke Mgmt]
    P4FF[🔥 Firefighting<br/>Sprinkler Hydraulic · Hydrant Layout · Detection · PA/VA · Smoke Exhaust]

    P4 --> P4EL & P4PL & P4HV & P4FF

    P4MRG([All Calculations Complete<br/>Merge & Proceed to Drawings])
    P4EL & P4PL & P4HV & P4FF --> P4MRG

    %% ── PART 5: DRAWING PRODUCTION ──
    P4MRG --> P5
    P5[/PART 5: Drawing Production<br/>Floor-wise MEP Drawings/]
    P5A[Floor Layout Drawings<br/>Per service per floor — auto-generated base]
    P5B[Riser Diagrams<br/>Plumbing + Fire + Electrical risers]
    P5C[Schematic Layouts<br/>SLD, Pump Room, UGT, STP layouts]
    P5D[External Services<br/>Site drainage, fire hydrant yard, transformer yard]

    P5 --> P5A & P5B & P5C & P5D

    %% ── PART 6: DRAWING VERIFICATION ──
    P5A & P5B & P5C & P5D --> P6
    P6[/PART 6: Drawing Verification Checklist<br/>Stage Gate Before Review/]
    P6A[Checklist Auto-Generated<br/>☑ Per service, per drawing type]
    P6D{All Checks Passed?<br/>Verification Gate}
    P6R[Reject → Rework<br/>Return to Drawing Production]

    P6 --> P6A --> P6D
    P6D -->|Yes| P7
    P6D -->|No| P6R
    P6R -.->|Fix & Resubmit| P5

    %% ── PART 7: MEP REVIEW ──
    P7[/PART 7: MEP Review & Detailed Review<br/>Cross-Service Clash Detection/]
    P7A[Inter-Service Review<br/>Electrical vs Plumbing vs HVAC vs Fire]
    P7B[Clash Detection<br/>Spatial conflicts & routing issues]
    P7C{Review Approved?<br/>Senior MEP Sign-off}
    P7R[Review Rejected<br/>Return to corrections]

    P7 --> P7A --> P7B --> P7C
    P7C -->|Approved| P8
    P7C -->|Rejected| P7R
    P7R -.->|Correct & Resubmit| P5

    %% ── PART 8: ARCHITECT AGREEMENT ──
    P8[/PART 8: MEP Layout → Architect<br/>Share for Integration/]
    P8A[Share Final MEP Layouts<br/>All floor plans + schematics]
    P8B[Architect Integrates<br/>MEP into Architectural drawings]
    P8C{Architect Agrees?<br/>Integration Approval}
    P8R[Revise Coordination<br/>MEP + Architect iterate]

    P8 --> P8A --> P8B --> P8C
    P8C -->|Yes| P9
    P8C -.->|No| P8R
    P8R -.->|Re-coordinate| P8A

    %% ── PART 9: FINAL VERIFICATION ──
    P9[/PART 9: Final Verification & Completion<br/>Stage Sign-off/]
    P9A[Final Document Package<br/>All drawings + calcs + checklists]
    P9B[Management Sign-off<br/>Senior approval stamp]

    P9 --> P9A --> P9B
    DONE([🏁 DETAILED DESIGN COMPLETE<br/>Proceed to Tender Stage])
    P9B --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef process fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#1e40af
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef header fill:#f97316,stroke:#f97316,stroke-width:2px,color:#ffffff
    classDef service fill:#ede9fe,stroke:#8b5cf6,stroke-width:1.5px,color:#5b21b6

    class INIT,DONE,MRG terminal
    class P2D,P6D,P7C,P8C,DWCD decision
    class P2E,P6R,P7R,P8R,DWCR reject
    class P4EL,P4PL,P4HV,P4FF service`;

export const TENDER_STAGE_MERMAID = `flowchart TD
    %% ══════════════════════════════════════
    %% TENDER STAGE — COMPLETE FLOW CHART
    %% ══════════════════════════════════════

    %% ── PART 1: INITIATION ──
    INIT([🟢 TENDER STAGE<br/>Triggered After Detailed Design Approval])
    DD[Detailed Design Data Loaded<br/>All drawings, calcs & checklists from DB]
    INIT --> DD

    %% ── PART 2: BOQ GENERATION ──
    DD --> P2
    P2[/PART 2: BOQ Generation<br/>Bill of Quantities per Service/]
    P2EL[⚡ Electrical BOQ<br/>Cable, panel, switchgear, earthing, lighting]
    P2PL[💧 Plumbing BOQ<br/>Pipe, fittings, pumps, fixtures, tanks, valves]
    P2HV[🌀 HVAC BOQ<br/>Duct, insulation, equipment, diffusers, controls]
    P2FF[🔥 Firefighting BOQ<br/>Sprinkler, hydrant, detection, suppression, pumps]

    P2 --> P2EL & P2PL & P2HV & P2FF

    P2MRG([All BOQs Generated<br/>Merge → Pricing])
    P2EL & P2PL & P2HV & P2FF --> P2MRG

    %% ── PART 3: PRICING & ESTIMATION ──
    P2MRG --> P3
    P3[/PART 3: Pricing & Estimation<br/>Rate Analysis & Cost Build-up/]
    P3A[Material Rate DB<br/>🤖 Auto-fetch latest rates from DB]
    P3B[Labour Rate DB<br/>🤖 Auto-fetch region-wise labour rates]
    P3C[Rate Analysis<br/>Material + Labour + OH → Unit Rate]
    P3D[Cost Estimation<br/>BOQ × Unit Rates = Total Cost]
    P3E[Comparative Statement<br/>Budget vs Estimated vs Market]

    P3 --> P3A & P3B
    P3A & P3B --> P3C --> P3D --> P3E

    %% ── PART 4: TENDER DOCUMENT ──
    P3E --> P4
    P4[/PART 4: Tender Document Preparation<br/>Scope, Specs & Conditions/]
    P4A[Technical Specifications<br/>Service-wise technical requirements]
    P4B[Scope of Work<br/>Inclusion/Exclusion per service]
    P4C[General Conditions<br/>Payment terms, milestones, penalties]
    P4D[Special Conditions<br/>Project-specific requirements]
    P4E[Tender Package Assembly<br/>BOQ + Specs + Scope + Conditions]

    P4 --> P4A & P4B & P4C & P4D
    P4A & P4B & P4C & P4D --> P4E

    %% ── PART 5: CONTRACTOR SELECTION ──
    P4E --> P5
    P5[/PART 5: Contractor Selection<br/>Vendor Evaluation & Award/]
    P5A[Vendor Shortlist<br/>📋 From approved vendor DB]
    P5B[RFQ Issue<br/>🤖 Auto-generate & send RFQ]
    P5C[Bid Collection<br/>Sealed/Open bid submission]
    P5D{Bids Received?<br/>Minimum 3 bids gate}
    P5E[Re-issue RFQ<br/>Insufficient bids]
    P5F[Technical Evaluation<br/>Compliance check per spec]
    P5G[Commercial Evaluation<br/>Price comparison & negotiation]
    P5H{Technically Qualified?<br/>Tech Gate}
    P5I[Reject → Non-compliant<br/>Vendor informed]

    P5 --> P5A --> P5B --> P5C --> P5D
    P5D -->|Yes ≥3| P5F
    P5D -->|No| P5E
    P5E -.->|Re-send| P5B
    P5F --> P5H
    P5H -->|Yes| P5G
    P5H -->|No| P5I
    P5I -.->|Next vendor| P5F

    %% ── PART 6: AWARD & NEGOTIATION ──
    P5G --> P6
    P6[/PART 6: Award & Negotiation<br/>Final Selection/]
    P6A[Negotiation Rounds<br/>Price, timeline, warranty terms]
    P6B[Management Approval<br/>Budget sign-off]
    P6C{Approved?<br/>Final Award Gate}
    P6R[Re-negotiate<br/>Terms not acceptable]
    P6D[Letter of Intent (LOI)<br/>Formal award document]
    P6E[Work Order<br/>Detailed contractor WO issued]

    P6 --> P6A --> P6B --> P6C
    P6C -->|Approved| P6D
    P6C -.->|Re-negotiate| P6R
    P6R -.->|Revise terms| P6A
    P6D --> P6E

    DONE([🏁 TENDER STAGE COMPLETE<br/>Proceed to VFC Stage])
    P6E --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef process fill:#ccfbf1,stroke:#14b8a6,stroke-width:1.5px,color:#134e4a
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef service fill:#ede9fe,stroke:#8b5cf6,stroke-width:1.5px,color:#5b21b6

    class INIT,DONE terminal
    class P5D,P5H,P6C decision
    class P5E,P5I,P6R reject
    class P2EL,P2PL,P2HV,P2FF service`;

export const VFC_STAGE_MERMAID = `flowchart TD
    %% ══════════════════════════════════════
    %% VFC STAGE — VALIDATED FOR CONSTRUCTION
    %% ══════════════════════════════════════

    %% ── PART 1: INITIATION ──
    INIT([🟢 VFC STAGE<br/>Contractor Awarded — Construction Readiness])
    TD[Tender Data + LOI Loaded<br/>BOQ, WO, contractor details from DB]
    INIT --> TD

    %% ── PART 2: CONTRACTOR KICKOFF ──
    TD --> P2
    P2[/PART 2: Contractor Kickoff<br/>Pre-construction Coordination/]
    P2A[Contractor Submits Shop Drawings<br/>📂 Upload per service per floor]
    P2B[Material Submittals<br/>📂 Datasheets, certifications, samples]
    P2C[MEP Reviews Submittals<br/>Compliance check against specs]
    P2D{Submittals Approved?<br/>Material Gate}
    P2E[Reject → Resubmit<br/>Non-compliant materials]

    P2 --> P2A & P2B
    P2A & P2B --> P2C --> P2D
    P2D -->|Approved| P3
    P2D -->|Rejected| P2E
    P2E -.->|Resubmit| P2C

    %% ── PART 3: VFC DRAWING UPDATES ──
    P3[/PART 3: VFC Drawing Updates<br/>Drawings Updated per Contractor Input/]
    P3EL[⚡ Electrical VFC<br/>Cable schedule, panel revision, SLD & earthing updates]
    P3PL[💧 Plumbing VFC<br/>Pipe schedule, pump reselection, drainage & valve updates]
    P3HV[🌀 HVAC VFC<br/>Duct revision, equipment confirmation, controls & diffuser updates]
    P3FF[🔥 Firefighting VFC<br/>Sprinkler revision, hydrant update, detection & pump reselection]

    P3 --> P3EL & P3PL & P3HV & P3FF

    P3MRG([All VFC Drawings Updated<br/>Merge → Verification])
    P3EL & P3PL & P3HV & P3FF --> P3MRG

    %% ── PART 4: COORDINATION & CLASH CHECK ──
    P3MRG --> P4
    P4[/PART 4: Coordination & Clash Check<br/>3D Coordination Review/]
    P4A[Service Routing Overlay<br/>All MEP services on one drawing]
    P4B[Clash Detection<br/>Spatial conflicts between services]
    P4C[Ceiling Coordination<br/>MLCP/corridor ceiling space allocation]
    P4D{All Clashes Resolved?<br/>Coordination Gate}
    P4R[Revise Routing<br/>Fix clashes & re-overlay]

    P4 --> P4A --> P4B --> P4C --> P4D
    P4D -->|Resolved| P5
    P4D -->|Not Resolved| P4R
    P4R -.->|Fix & Recheck| P4A

    %% ── PART 5: SITE READINESS ──
    P5[/PART 5: Site Readiness Check<br/>Pre-construction Verification/]
    P5A[Site Dimensions Verified<br/>Actual site vs drawing measurements]
    P5B[Embedded Conduit/Sleeve Check<br/>Civil readiness for MEP]
    P5C[Equipment Delivery Schedule<br/>Align with construction milestones]
    P5D{Site Ready?<br/>Construction Start Gate}
    P5R[Site Deficiency Report<br/>List corrections needed]

    P5 --> P5A --> P5B --> P5C --> P5D
    P5D -->|Ready| P6
    P5D -->|Not Ready| P5R
    P5R -.->|Correct & Recheck| P5A

    %% ── PART 6: CONSTRUCTION MONITORING ──
    P6[/PART 6: Construction Monitoring<br/>Quality & Progress Tracking/]
    P6A[Daily Progress Reports<br/>Per contractor per service]
    P6B[Quality Inspection<br/>Stage-wise inspection per service]
    P6C[Material Testing<br/>Random sampling & lab reports]
    P6D[Progress vs Schedule<br/>% complete tracking]

    P6 --> P6A & P6B & P6C & P6D

    %% ── PART 7: TESTING & COMMISSIONING ──
    P6A & P6B & P6C & P6D --> P7
    P7[/PART 7: Testing & Commissioning<br/>System Verification/]
    P7A[Pre-commissioning Checks<br/>Visual inspection, continuity, insulation]
    P7B[System Testing<br/>Hydraulic test, megger test, air balance]
    P7C[Commissioning<br/>Full system run, performance verification]
    P7D{Tests Passed?<br/>Commissioning Gate}
    P7R[Snag List<br/>Defects to be rectified]

    P7 --> P7A --> P7B --> P7C --> P7D
    P7D -->|Passed| P8
    P7D -->|Failed| P7R
    P7R -.->|Fix & Re-test| P7B

    %% ── PART 8: HANDOVER ──
    P8[/PART 8: Handover & As-Built<br/>Final Documentation/]
    P8A[As-Built Drawings<br/>Actual installed vs designed]
    P8B[O&M Manuals<br/>Operation & maintenance documentation]
    P8C[Warranty Certificates<br/>Equipment warranty documents]
    P8D[Final Sign-off<br/>Client + Consultant + Contractor]

    P8 --> P8A & P8B & P8C
    P8A & P8B & P8C --> P8D

    DONE([🏁 VFC STAGE COMPLETE<br/>Project Handover to Facility Management])
    P8D --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef process fill:#ede9fe,stroke:#8b5cf6,stroke-width:1.5px,color:#5b21b6
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef service fill:#cffafe,stroke:#06b6d4,stroke-width:1.5px,color:#155e75

    class INIT,DONE terminal
    class P2D,P4D,P5D,P7D decision
    class P2E,P4R,P5R,P7R reject
    class P3EL,P3PL,P3HV,P3FF service`;


// ── CALCULATION MERMAID CODES ──

export const CALC_MERMAID_CODES: Record<string, { title: string; code: string }> = {
  P3A: {
    title: "Water Demand Calculation",
    code: `flowchart TD
    %% WATER DEMAND CALCULATION — 5-Phase Flow
    INIT([🟢 Water Demand Calculation<br/>Start])

    %% Phase 1: Project Selection
    P1[/PHASE 1: Project Selection & Auto-Fetch/]
    P1A[Select Project<br/>📋 Dropdown from DB]
    P1B[Auto-Fetch Input Matrix<br/>🤖 Population, area, building count]
    P1C[Auto-Fetch Flat Matrix<br/>🤖 BHK types, quantities per building]
    INIT --> P1 --> P1A --> P1B --> P1C

    %% Phase 2: User Validation
    P1C --> P2
    P2[/PHASE 2: User Validation & External Override/]
    P2A[Display Auto-Fetched Data<br/>Table with editable fields]
    P2B{User Accepts Data?<br/>Validation Gate}
    P2C[User Overrides Values<br/>✍ Manual correction fields]
    P2 --> P2A --> P2B
    P2B -->|Accept| P3
    P2B -->|Override| P2C --> P3

    %% Phase 3: Policy Engine
    P3[/PHASE 3: Policy Engine<br/>Lodha vs NBC 2016/]
    P3A[Detect Policy Source<br/>🤖 Lodha Policy DB / NBC 2016]
    P3B[Per Capita Demand Lookup<br/>Based on category + segment]
    P3C[Peak Hour Factor<br/>1.5x for residential, 2.0x commercial]
    P3D[Fire Reserve<br/>As per IS-15105 / NFPA-13]
    P3E[Flushing Reuse %<br/>STP treated water allocation]
    P3 --> P3A --> P3B --> P3C --> P3D --> P3E

    %% Phase 4: Calculation
    P3E --> P4
    P4[/PHASE 4: Calculation & Results/]
    P4A[Daily Demand<br/>Population × Per Capita = Total L/day]
    P4B[Peak Hour Demand<br/>Daily × Peak Factor / 24]
    P4C[Tank Sizing<br/>UGT + OHT based on demand + fire reserve]
    P4D[Pump Flow Rate<br/>Peak demand → pump selection]
    P4E[STP Input<br/>80% of domestic → sewage generation]
    P4 --> P4A --> P4B --> P4C --> P4D --> P4E

    %% Phase 5: Export
    P4E --> P5
    P5[/PHASE 5: Export & Format Selection/]
    P5A{Export Format?<br/>Format Selection}
    P5B[Lodha Format<br/>Internal reporting template]
    P5C[MOEF Format<br/>Environmental clearance format]
    P5D[MSEDCL Format<br/>Electricity board submission]
    P5E[NBC Format<br/>National Building Code format]
    P5F([📥 Download Report<br/>PDF/Excel export])
    P5 --> P5A
    P5A -->|Lodha| P5B --> P5F
    P5A -->|MOEF| P5C --> P5F
    P5A -->|MSEDCL| P5D --> P5F
    P5A -->|NBC| P5E --> P5F

    DONE([🏁 Water Demand Calculation Complete])
    P5F --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef calc fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px,color:#5b21b6
    class INIT,DONE terminal
    class P2B,P5A decision`,
  },
  P3B: {
    title: "Electrical Load Calculation",
    code: `flowchart TD
    %% ELECTRICAL LOAD CALCULATION — 5-Phase Flow
    INIT([🟢 Electrical Load Calculation<br/>Start])

    %% Phase 1: Input Fetch
    P1[/PHASE 1: Project Data Fetch/]
    P1A[Select Project<br/>📋 From DB]
    P1B[Auto-Fetch Building Data<br/>🤖 Floors, units, built-up area]
    P1C[Auto-Fetch Category<br/>🤖 Residential/Commercial/Mixed]
    INIT --> P1 --> P1A --> P1B --> P1C

    %% Phase 2: Load Norms
    P1C --> P2
    P2[/PHASE 2: Supply Norms & Load Norms/]
    P2A[MSEDCL/KSEDCL Norms<br/>🤖 Location-based auto-select]
    P2B[Per Unit Load<br/>kW per apartment/shop/office from policy]
    P2C[Common Area Load<br/>Lifts, pumps, lighting, CCTV, fire panel]
    P2D[MLCP Load<br/>Ventilation, lighting per level]
    P2 --> P2A --> P2B --> P2C --> P2D

    %% Phase 3: Calculation
    P2D --> P3
    P3[/PHASE 3: Load Calculation/]
    P3A[Apartment Total Load<br/>Units × Per Unit Load × Diversity]
    P3B[Common Area Total<br/>Sum all common loads]
    P3C[Total Connected Load<br/>Apartment + Common + MLCP + Amenity]
    P3D[Demand Load<br/>Connected × Diversity Factor]
    P3E[Transformer Sizing<br/>Demand / 0.9 PF → kVA → select TX]
    P3F[DG Sizing<br/>Essential load → DG capacity]
    P3 --> P3A --> P3B --> P3C --> P3D --> P3E --> P3F

    %% Phase 4: Equipment Selection
    P3F --> P4
    P4[/PHASE 4: Equipment Selection/]
    P4A[Transformer Selection<br/>DB lookup → standard ratings]
    P4B[DG Set Selection<br/>DB lookup → standard ratings]
    P4C[HT/LT Panel Sizing<br/>Based on TX + DG output]
    P4D[Bus Bar Rating<br/>Max demand current → Cu/Al]
    P4 --> P4A & P4B
    P4A & P4B --> P4C --> P4D

    %% Phase 5: Export
    P4D --> P5
    P5[/PHASE 5: Export/]
    P5A{Export Format?}
    P5B[MSEDCL Format<br/>Grid application format]
    P5C[Internal Format<br/>Lodha standard template]
    P5D([📥 Download Report])
    P5 --> P5A
    P5A -->|MSEDCL| P5B --> P5D
    P5A -->|Internal| P5C --> P5D

    DONE([🏁 Electrical Load Complete])
    P5D --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P5A decision`,
  },
  OWC: {
    title: "OWC Calculations",
    code: `flowchart TD
    INIT([🟢 OWC Calculation<br/>Organic Waste Converter])

    P1[/PHASE 1: Input Data/]
    P1A[Population from Water Demand<br/>🤖 Auto-fetch]
    P1B[Category & Segment<br/>📋 Residential/Commercial]
    INIT --> P1 --> P1A --> P1B

    P2[/PHASE 2: Waste Generation/]
    P2A[Per Capita Waste<br/>CPHEEO/NBC norms: 0.3-0.5 kg/day]
    P2B[Total Wet Waste<br/>Population × Per Capita × Organic %]
    P2C[Total Dry Waste<br/>Population × Per Capita × Dry %]
    P1B --> P2 --> P2A --> P2B --> P2C

    P3[/PHASE 3: OWC Sizing/]
    P3A[OWC Machine Capacity<br/>Wet waste → machine size from DB]
    P3B[Garbage Room Area<br/>Bin count × bin area + aisle]
    P3C[Wet Storage Area<br/>3-day buffer storage calculation]
    P2C --> P3 --> P3A --> P3B --> P3C

    P4[/PHASE 4: Bin Sizing/]
    P4A[Wet Waste Bins<br/>240L/660L/1100L selection]
    P4B[Dry Waste Bins<br/>Size & count calculation]
    P4C[Total Bin Count<br/>Per building allocation]
    P3C --> P4 --> P4A --> P4B --> P4C

    P5([📥 OWC Report<br/>Capacity + Area + Bin Schedule])
    P4C --> P5
    DONE([🏁 OWC Complete])
    P5 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    class INIT,DONE terminal`,
  },
  STP: {
    title: "STP Calculations",
    code: `flowchart TD
    INIT([🟢 STP Calculation<br/>Sewage Treatment Plant])

    P1[/PHASE 1: Input Data/]
    P1A[Water Demand Data<br/>🤖 Auto-fetch from Water Demand calc]
    P1B[Population & Category<br/>📋 From project data]
    INIT --> P1 --> P1A --> P1B

    P2[/PHASE 2: Sewage Generation/]
    P2A[Domestic Sewage<br/>80% of domestic water demand]
    P2B[Flushing Sewage<br/>100% of flushing water]
    P2C[Total Sewage<br/>Domestic + Flushing generation]
    P1B --> P2 --> P2A --> P2B --> P2C

    P3[/PHASE 3: STP Sizing/]
    P3A{STP Technology?<br/>Selection}
    P3B[MBBR<br/>Moving Bed Biofilm Reactor]
    P3C[MBR<br/>Membrane Bioreactor]
    P3D[SBR<br/>Sequential Batch Reactor]
    P3E[STP Capacity<br/>Total sewage + 10% safety]
    P2C --> P3 --> P3A
    P3A -->|MBBR| P3B --> P3E
    P3A -->|MBR| P3C --> P3E
    P3A -->|SBR| P3D --> P3E

    P4[/PHASE 4: Area & Reuse/]
    P4A[STP Area Required<br/>Based on capacity × area factor]
    P4B[Treated Water Reuse<br/>Flushing + Gardening allocation]
    P4C[Excess Disposal<br/>Municipal drain / recharge]
    P3E --> P4 --> P4A --> P4B --> P4C

    P5([📥 STP Report<br/>Capacity + Area + Reuse Plan])
    P4C --> P5
    DONE([🏁 STP Complete])
    P5 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P3A decision`,
  },
  FFP: {
    title: "Fire Pump Head Calculation",
    code: `flowchart TD
    INIT([🟢 Fire Pump Head Calculation<br/>Start])

    P1[/PHASE 1: System Parameters/]
    P1A[Building Height<br/>🤖 Auto-fetch from project]
    P1B[Pipe Material & Size<br/>📋 GI/SS/HDPE selection]
    P1C[System Type<br/>📋 Sprinkler/Hydrant/Combined]
    INIT --> P1 --> P1A --> P1B --> P1C

    P2[/PHASE 2: Static Head/]
    P2A[Pump Room Level<br/>Basement/Ground level]
    P2B[Highest Outlet Level<br/>Terrace / top floor]
    P2C[Static Head<br/>H = Outlet Level − Pump Level]
    P1C --> P2 --> P2A --> P2B --> P2C

    P3[/PHASE 3: Friction Loss/]
    P3A[Hazen-Williams C Factor<br/>Pipe material → C value from DB]
    P3B[Pipe Length Calc<br/>Vertical + horizontal runs]
    P3C[Equivalent Length<br/>Fittings → equivalent pipe length]
    P3D[Friction Loss<br/>Hf = (6.05 × Q^1.85) / (C^1.85 × D^4.87)]
    P2C --> P3 --> P3A --> P3B --> P3C --> P3D

    P4[/PHASE 4: System Pressure/]
    P4A[Residual Pressure<br/>Nozzle pressure requirement]
    P4B[Total Head<br/>Static + Friction + Residual + Safety]
    P4C[Safety Factor<br/>+20% margin per IS-15105]
    P4D{Head > 120m?<br/>Multi-zone Check}
    P4E[Single Zone Pump<br/>One pump serves all floors]
    P4F[Multi-Zone System<br/>Break tank + booster per zone]
    P3D --> P4 --> P4A --> P4B --> P4C --> P4D
    P4D -->|No| P4E
    P4D -->|Yes| P4F

    P5[/PHASE 5: Pump Selection/]
    P5A[Flow Rate<br/>As per IS-15105 / NFPA-13]
    P5B[Pump Selection<br/>DB lookup → head vs flow curve match]
    P5C([📥 Pump Schedule Report])
    P4E & P4F --> P5 --> P5A --> P5B --> P5C
    DONE([🏁 Fire Pump Head Complete])
    P5C --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P4D decision`,
  },
  FTK: {
    title: "Fire Tank Size Estimation",
    code: `flowchart TD
    INIT([🟢 Fire Tank Size Estimation<br/>Start])

    P1[/PHASE 1: Standards Selection/]
    P1A{Standard?<br/>IS-15105 / NFPA-13}
    P1B[IS-15105 Parameters<br/>Indian standard durations & flows]
    P1C[NFPA-13 Parameters<br/>NFPA durations & flows]
    INIT --> P1 --> P1A
    P1A -->|IS-15105| P1B
    P1A -->|NFPA-13| P1C

    P2[/PHASE 2: Volume Components/]
    P2A[Sprinkler Volume<br/>Flow × Duration (30-60 min)]
    P2B[Hydrant Volume<br/>Flow × Duration (30-60 min)]
    P2C[Drencher Volume<br/>Flow × Duration (if applicable)]
    P2D[Standpipe Volume<br/>Hose reel flow × duration]
    P1B & P1C --> P2 --> P2A & P2B & P2C & P2D

    P3[/PHASE 3: Total Volume/]
    P3A[Sum All Volumes<br/>Sprinkler + Hydrant + Drencher + Standpipe]
    P3B{Volume > 300m³?<br/>Safety Gate}
    P3C[Use 300m³ Minimum<br/>Per regulation]
    P3D[Use Calculated Volume<br/>Exceeds minimum]
    P2A & P2B & P2C & P2D --> P3 --> P3A --> P3B
    P3B -->|≤300m³| P3C
    P3B -->|>300m³| P3D

    P4[/PHASE 4: Tank Design/]
    P4A[Tank Dimensions<br/>L × W × H based on volume]
    P4B[Underground vs Overhead<br/>Split allocation]
    P3C & P3D --> P4 --> P4A --> P4B

    P5([📥 Tank Size Report])
    P4B --> P5
    DONE([🏁 Fire Tank Complete])
    P5 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P1A,P3B decision`,
  },
  FJD: {
    title: "Jockey & Drencher Pump Calculation",
    code: `flowchart TD
    INIT([🟢 Jockey & Drencher Pump<br/>Calculation Start])

    %% Jockey Pump
    P1[/PHASE 1: Jockey Pump/]
    P1A[System Pressure<br/>🤖 From fire pump head calc]
    P1B[Jockey Flow Rate<br/>1-2% of main pump flow]
    P1C[Jockey Head<br/>Main pump head + 10%]
    P1D[Jockey Pump Selection<br/>DB lookup]
    INIT --> P1 --> P1A --> P1B --> P1C --> P1D

    %% Drencher Pump
    P2[/PHASE 2: Drencher Pump/]
    P2A[Facade Area<br/>🤖 Auto-fetch building envelope]
    P2B[Drencher Flow Rate<br/>Area × application rate]
    P2C[Drencher Head Loss<br/>Hazen-Williams pipe friction]
    P2D[Static Head<br/>Pump level to highest drencher]
    P2E[Total Drencher Head<br/>Static + Friction + Residual + 20% Safety]
    P2F[Drencher Pump Selection<br/>DB lookup]
    P1D --> P2 --> P2A --> P2B --> P2C --> P2D --> P2E --> P2F

    P3([📥 Jockey & Drencher Report])
    P2F --> P3
    DONE([🏁 Jockey & Drencher Complete])
    P3 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    class INIT,DONE terminal`,
  },
  FTB: {
    title: "Terrace Fire Booster Pump",
    code: `flowchart TD
    INIT([🟢 Terrace Booster Pump<br/>Head Calculation])

    P1[/PHASE 1: Parameters/]
    P1A[Terrace Tank Level<br/>🤖 Auto-fetch elevation]
    P1B[Highest Sprinkler Level<br/>Topmost floor served]
    P1C[Pipe Configuration<br/>Material, diameter, length]
    INIT --> P1 --> P1A --> P1B --> P1C

    P2[/PHASE 2: Head Components/]
    P2A[Static Head<br/>Highest point − Tank level]
    P2B[Pipe Friction<br/>Hazen-Williams calculation]
    P2C[Fitting Losses<br/>Equivalent length method]
    P2D[Residual Pressure<br/>Nozzle requirement]
    P1C --> P2 --> P2A --> P2B --> P2C --> P2D

    P3[/PHASE 3: Total Head & Selection/]
    P3A[Total Booster Head<br/>Static + Friction + Fittings + Residual]
    P3B[Safety Factor<br/>+20% per IS-15105]
    P3C[Pump Selection<br/>DB lookup → performance curve match]
    P2D --> P3 --> P3A --> P3B --> P3C

    P4([📥 Booster Pump Report])
    P3C --> P4
    DONE([🏁 Terrace Booster Complete])
    P4 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    class INIT,DONE terminal`,
  },
  RWH: {
    title: "Rainwater Harvesting & Tank Sizing",
    code: `flowchart TD
    INIT([🟢 Rainwater Harvesting<br/>& Tank Sizing])

    P1[/PHASE 1: Catchment Data/]
    P1A[Plot Area<br/>🤖 Auto-fetch from project]
    P1B[Roof Area<br/>Building footprint calculation]
    P1C[Paved Area<br/>Roads, parking, pathways]
    P1D[Green Area<br/>Garden, softscape]
    P1E[Runoff Coefficients<br/>Roof=0.85, Paved=0.75, Green=0.15]
    INIT --> P1 --> P1A --> P1B --> P1C --> P1D --> P1E

    P2[/PHASE 2: Rainfall Data/]
    P2A[Location<br/>🤖 Auto-fetch GPS coordinates]
    P2B[Annual Rainfall<br/>IMD data lookup by location]
    P2C[Design Rainfall<br/>Monthly max or monsoon period]
    P1E --> P2 --> P2A --> P2B --> P2C

    P3[/PHASE 3: Runoff Calculation/]
    P3A[Roof Runoff<br/>Roof Area × Coeff × Rainfall]
    P3B[Paved Runoff<br/>Paved Area × Coeff × Rainfall]
    P3C[Total Harvestable<br/>Sum of all runoff volumes]
    P2C --> P3 --> P3A --> P3B --> P3C

    P4[/PHASE 4: Tank Sizing/]
    P4A[Daily Demand Offset<br/>Flushing + gardening needs]
    P4B{NBC 2016 Compliance?<br/>Minimum storage check}
    P4C[Tank Volume<br/>Max of (demand-based, NBC minimum)]
    P4D[Downcomer Sizing<br/>Pipe diameter for roof drainage]
    P4E[Velocity Guard<br/>First-flush diverter sizing]
    P3C --> P4 --> P4A --> P4B
    P4B -->|Compliant| P4C
    P4B -->|Below Min| P4C
    P4C --> P4D --> P4E

    P5([📥 RWH Report<br/>Tank Size + Downcomer Schedule])
    P4E --> P5
    DONE([🏁 RWH Complete])
    P5 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P4B decision`,
  },
  SWD: {
    title: "Storm Water Drainage Calculator",
    code: `flowchart TD
    INIT([🟢 Storm Water Drainage<br/>Calculator])

    P1[/PHASE 1: Site Data/]
    P1A[Catchment Areas<br/>🤖 Auto-fetch from project]
    P1B[Slope & Gradient<br/>Site survey data]
    P1C[Soil Type<br/>Infiltration characteristics]
    INIT --> P1 --> P1A --> P1B --> P1C

    P2[/PHASE 2: Rainfall Intensity/]
    P2A[Location IDF Curve<br/>🤖 Intensity-Duration-Frequency data]
    P2B[Return Period<br/>📋 5yr / 10yr / 25yr selection]
    P2C[Time of Concentration<br/>Kirpich formula calculation]
    P2D[Design Intensity<br/>i = from IDF curve at Tc]
    P1C --> P2 --> P2A --> P2B --> P2C --> P2D

    P3[/PHASE 3: Rational Method/]
    P3A[Runoff Coefficient<br/>Weighted C for mixed surfaces]
    P3B[Peak Discharge<br/>Q = C × i × A / 360]
    P3C{Q > Capacity?<br/>System Check}
    P3D[Single Pipe System<br/>Gravity flow sufficient]
    P3E[Retention/Detention<br/>On-site storage required]
    P2D --> P3 --> P3A --> P3B --> P3C
    P3C -->|Within Capacity| P3D
    P3C -->|Exceeds| P3E

    P4[/PHASE 4: Pipe Sizing/]
    P4A[Manning's Equation<br/>V = (1/n) × R^(2/3) × S^(1/2)]
    P4B[Pipe Diameter<br/>Select from standard sizes]
    P4C[Velocity Check<br/>0.6m/s ≤ V ≤ 3.0m/s]
    P4D{Velocity OK?<br/>Design Check}
    P4E[Resize Pipe<br/>Adjust diameter]
    P3D & P3E --> P4 --> P4A --> P4B --> P4C --> P4D
    P4D -->|OK| P5
    P4D -->|Out of Range| P4E
    P4E -.->|Recalc| P4B

    P5([📥 SWD Report<br/>Pipe Schedule + Manhole Layout])
    DONE([🏁 SWD Complete])
    P5 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P3C,P4D decision`,
  },
};

// ── STAGE → MERMAID CODE MAP ──
export const STAGE_MERMAID_MAP: Record<string, string> = {
  concept: CONCEPT_STAGE_MERMAID,
  detailed: DETAILED_DESIGN_MERMAID,
  tender: TENDER_STAGE_MERMAID,
  vfc: VFC_STAGE_MERMAID,
};

// ── STAGE → CALCULATION IDS ──
export const STAGE_CALC_IDS: Record<string, string[]> = {
  concept: ["P3A", "P3B", "OWC", "STP", "FFP", "FTK", "FJD", "FTB", "RWH", "SWD"],
  detailed: [], // coming-soon calcs only
  tender: [],
  vfc: [],
};

// ── STAGE LABELS ──
export const STAGE_LABELS: Record<string, string> = {
  concept: "Concept Stage",
  detailed: "Detailed Design Stage",
  tender: "Tender Stage",
  vfc: "VFC Stage",
};
