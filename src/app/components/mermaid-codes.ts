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
    A14 --> SD2{Height > 90m?<br/>Fire Break Floor Check}
    SD2 -->|"Yes (>90m)"| SD3{User Wants Plan?<br/>Optional: UGT + Fire Break}
    SD2 -->|"No (≤90m)"| SSK[Skip Fire Plan<br/>Height ≤90m or User Declined]
    SD3 -->|Yes| SD4{As Per CFO or NBC?<br/>Standard Selection}
    SD3 -->|No| SSK
    SD4 --> S8[Fire Break Floor + UGT<br/>As per selected standard CFO/NBC]
    S8 --> MRG
    SSK --> MRG

    MRG([TRACKS MERGE<br/>Both Tracks Complete → Continue])

    %% ══════════════════════════════════════
    %% PART 2: MEP POLICY STUDY
    %% ══════════════════════════════════════
    MRG --> P2
    P2[/PART 2: MEP Policy Study<br/>Database Studies Required Policies/]
    P2S[MEP Policies All Services<br/>Electrical | Plumbing | Firefighting | Plantroom | Backup]

    P2 --> P2S

    %% ══════════════════════════════════════
    %% PART 3: CALCULATIONS
    %% ══════════════════════════════════════
    P2S --> P3
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
    S3[OWC Layout Block<br/>Machine Room + Wet Storage Area]
    S4[Substation & DG Layout<br/>Generator Room + Transformer + Panel]
    S5[Lifts Space Planning<br/>No. of Lifts + Size + Space from DB]
    S7[Toilet Vent & Pressurize<br/>Ventilation + Pressurization from DB]

    P5 --> S1 & S3 & S4 & S5 & S7

    SD1{Commercial Project?<br/>Check Project Type}
    S6[Chiller Space Planning<br/>Only for Commercial Projects]

    S1 & S3 & S4 & S5 & S7 --> SD1
    SD1 -->|Yes| S6 --> P6
    SD1 -->|No| P6

    %% ══════════════════════════════════════
    %% PART 6: MASTER PLAN INTEGRATION
    %% ══════════════════════════════════════
    P6[/PART 6: Master Plan Integration<br/>Architect + MEP Convergence/]
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
    class P2,P2S policy
    class P3,P3A,P3B,P3C,P3D,P3L,P3F,P3P calc
    class P4,P4A,P4B,P4C space
    class P5,S1,S3,S4,S5,S6,S7,SSK plan
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
  DFP: {
    title: "Pump Head & Flow Rate Calculation Logic",
    code: `flowchart TD
    INIT([🟢 Pump Head & Flow Rate Calculation<br/>Start])

    %% ═══ PHASE 1: INPUT & DATA GATHERING ═══
    P1[/PHASE 1: Input & Data Gathering/]
    INIT --> P1
    P1 --> START[📥 Project Architectural & Plumbing Data]
    START --> INA[Building Height & Number of Floors<br/>Floor-to-Floor Height Reference]
    INA --> INB[Tank Locations<br/>UGT Level vs OHT/Terrace Level]
    INB --> INC[System Type Selection<br/>Domestic / Fire / Irrigation / STP]

    %% ═══ PHASE 2: FLOW RATE (Q) CALCULATION ═══
    P2[/PHASE 2: Flow Rate Q Calculation/]
    INC --> P2
    P2 --> DEC{Calculate Demand<br/>Based on System Type}

    DEC -->|Domestic| PATH1[💧 Domestic/Grey Water<br/>Tank Vol ÷ 120 min = m³/hr]
    DEC -->|Fire| PATH2[🔥 Fire System<br/>2850 LPM Main + 180 LPM Jockey]
    DEC -->|Irrigation| PATH3[🌿 Irrigation<br/>Area × 5 L/m² ÷ 1-2 hrs]
    DEC -->|Sump| PATH4[🔧 Sump/Drainage<br/>Inflow Rate vs Holding Volume]

    PATH1 --> QM[Flow Rate Q Determined]
    PATH2 --> QM
    PATH3 --> QM
    PATH4 --> QM
    QM --> QOUT[📊 Phase 2 Output: Q in m³/hr or LPM]

    %% ═══ PHASE 3: HEAD & PRESSURE LOSS ═══
    P3[/PHASE 3: Head H & Pressure Loss Analysis/]
    QOUT --> P3
    P3 --> HS[Static Head Hs<br/>Pump Centerline → Highest Discharge Point]
    HS --> HSF[Hs = Height m ÷ 10.2 bar]
    HSF --> HF[Friction Loss Hf<br/>4 ft per 100 ft pipe run]
    HF --> HM[Fitting Losses Hm<br/>Hm = 0.30 × Hf — 30% safety factor]
    HM --> HR[Residual Pressure Hr<br/>1.0 Bar Domestic / 3.5 Bar Fire]

    %% ═══ PHASE 4: FINAL OUTPUT & PUMP SIZING ═══
    P4[/PHASE 4: Final Output & Pump Sizing/]
    HR --> P4
    P4 --> TDH[✅ TDH = Hs + Hf + Hm + Hr]
    TDH --> OUT1[🎯 Main Pump Duty Point<br/>Q in LPM @ H in Meters]
    OUT1 --> OUT2[🔄 Standby Pump<br/>1 Working + 1 Standby Config]
    OUT2 --> OUT3[⚡ Jockey Pump<br/>System pressure maintenance]
    OUT3 --> SCHED[📋 Final Pump Schedule for Procurement]
    SCHED --> DONE([🏁 Pump Calculation — COMPLETE])

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class DEC decision`,
  },
  RWH: {
    title: "Rainwater Harvesting & Tank Sizing",
    code: `flowchart TD
    INIT([🟢 Rainwater Harvesting<br/>& Tank Sizing])

    %% Phase 1: Catchment Analysis
    P1[/PHASE 1: Catchment Analysis/]
    P1A[Catchment Input Module<br/>Identify all roof/terrace areas]
    P1B[Multi-Area Input Table<br/>Name, Area, Surface Type, C-Factor]
    P1C[Total Area Breakdown<br/>Aggregate all zones]
    P1D[Surface Classification<br/>Hardscape vs Softscape]
    P1E[Coefficient Database<br/>Concrete=0.95, Metal=0.90, Green=0.30]
    INIT --> P1 --> P1A --> P1B --> P1C --> P1D --> P1E

    %% Phase 2: Hydrology Data
    P2[/PHASE 2: Hydrology Data/]
    P2A[Rainfall Intensity Input<br/>Peak I in mm/hr from IMD data]
    P2B[Regional Intensity Table<br/>Mumbai=113, Bangalore=90, etc.]
    P2C[Annual vs Design Intensity<br/>Peak for pipes, avg for tank]
    P1E --> P2 --> P2A --> P2B --> P2C

    %% Phase 3: Yield Calculation
    P3[/PHASE 3: Yield Calculation/]
    P3A[Yield Engine Activation<br/>Rational Method application]
    P3B[Peak Flow Formula<br/>Qpeak = C×I×A / 3600]
    P3C[Harvest Volume Formula<br/>Vharvest = Area×Annual Rain×C / 1000]
    P3D[Total Yield Output<br/>Q in L/sec + V in KL]
    P2C --> P3 --> P3A --> P3B --> P3C --> P3D

    %% Phase 4: RWDP Sizing
    P4[/PHASE 4: RWDP Sizing/]
    P4A[User Selects Diameter<br/>75mm / 100mm / 150mm / 200mm]
    P4B[NBC 2016 Table Lookup<br/>Cross-reference capacity]
    P4C[Downcomer Count<br/>Number of pipes required]
    P3D --> P4 --> P4A --> P4B --> P4C

    %% Phase 5: Collector Hydraulics
    P5[/PHASE 5: Collector Routing/]
    P5A[Pipe Slope Input<br/>1 in 100 or 1 in 200]
    P5B[Manning's Equation<br/>V = 1/n × R^2/3 × S^1/2]
    P5C[Velocity Calculation<br/>Horizontal collector flow]
    P4C --> P5 --> P5A --> P5B --> P5C

    %% Phase 6: Velocity Guard
    P6[/PHASE 6: Velocity Guard/]
    P6A{V ≥ 0.5 m/s?<br/>Siltation Check}
    P6B[✅ Safe Design<br/>Proceed to tank sizing]
    P6C[⚠️ Siltation Alarm<br/>Adjust slope/diameter]
    P5C --> P6A
    P6A -->|Yes| P6B
    P6A -->|No| P6C
    P6B --> P7
    P6C --> P7

    %% Phase 7: Tank Sizing
    P7[/PHASE 7: Tank Sizing/]
    P7A[NBC 2016 Standards<br/>Standard tank capacities]
    P7B[Capacity Table<br/>10KL, 25KL, 50KL, 100KL]
    P7C[Min Retention vs User Size<br/>Round up to NBC standard]
    P7D[Final Tank Selection<br/>Suggest dimensions]
    P7 --> P7A --> P7B --> P7C --> P7D

    %% Phase 8: Final Output
    P8([📥 RWH Dashboard<br/>RWDP + Tank + Collector + NBC Report])
    P7D --> P8

    DONE([🏁 RWH Complete])
    P8 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P6A decision`,
  },
  SWD: {
    title: "Storm Water Drainage & Pipe Sizing",
    code: `flowchart TD
    INIT([🟢 Storm Water Drainage<br/>& Pipe Sizing])

    %% Phase 1: Hydrological Input
    P1[/PHASE 1: Hydrological Input/]
    P1A[Define Catchment Area<br/>Input area in Hectares]
    P1B[Rainfall Intensity<br/>Peak I in mm/hr from meteo data]
    P1C[Run-off Coefficient<br/>Surface type based C-factor]
    P1D[Coefficient Table<br/>Concrete=0.90, Asphalt=0.85, etc.]
    P1E[Rational Method Formula<br/>Qg = C × I × A]
    INIT --> P1 --> P1A --> P1B --> P1C --> P1D --> P1E

    %% Phase 2: Channel & Node Geometry
    P2[/PHASE 2: Channel Geometry/]
    P2A[Node Path Definition<br/>From Node X to Node Y]
    P2B{Conveyance Type?<br/>Open or Closed}
    P2C[Open Channel<br/>Width, Depth, Free Board]
    P2D[Closed Pipe<br/>Diameter D₁ in mm]
    P2E[Geometry Calculation<br/>R = A / P hydraulic radius]
    P1E --> P2 --> P2A --> P2B
    P2B -->|Open| P2C --> P2E
    P2B -->|Closed| P2D --> P2E

    %% Phase 3: Hydraulic Analysis
    P3[/PHASE 3: Hydraulic Analysis/]
    P3A[Slope Input<br/>S as 1 in 100, 1 in 200, etc.]
    P3B[Manning's n Coefficient<br/>Material-based roughness]
    P3C[Manning's n Table<br/>PVC=0.010, Concrete=0.013, etc.]
    P3D[Velocity Formula<br/>V = 1/n × R^2/3 × S^1/2]
    P3E[Carrying Capacity<br/>Rcc = A × V]
    P2E --> P3 --> P3A --> P3B --> P3C --> P3D --> P3E

    %% Phase 4: Validation & Compliance
    P4[/PHASE 4: Validation/]
    P4A{Capacity Check:<br/>Rcc > Qg?}
    P4B[✅ Capacity OK<br/>Design meets requirement]
    P4C[❌ REDESIGN<br/>Increase slope or size]
    P4D{Velocity Check:<br/>0.6 ≤ V ≤ 3.0?}
    P4E[✅ Velocity OK<br/>No siltation/scouring]
    P4F[⚠️ ADJUST<br/>Modify parameters]
    P4G[Continuity Equation<br/>Verify D using Q = A×V]
    P3E --> P4A
    P4A -->|Yes| P4B
    P4A -->|No| P4C
    P4B --> P4D
    P4C --> P4D
    P4D -->|Yes| P4E
    P4D -->|No| P4F
    P4E --> P4G
    P4F --> P4G

    %% Phase 5: Final Output
    P5[/PHASE 5: Final Output/]
    P5A[Status Result<br/>OKAY or REDESIGN REQUIRED]
    P5B[Final Specification<br/>Channel Size or Pipe Diameter]
    P5C[Layout Data<br/>IL and FGL levels]
    P5D([📥 SWD Schedule<br/>Site Execution Ready])
    P4G --> P5 --> P5A --> P5B --> P5C --> P5D

    DONE([🏁 SWD Complete])
    P5D --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class P2B,P4A,P4D decision`,
  },
  FFP: {
    title: "Fire Pump Head Calculation — Comprehensive",
    code: `flowchart TD
    %% ══════════════════════════════════════
    %% FFP — FIRE PUMP HEAD CALCULATION
    %% IS-15105 / NFPA-13 / IS-5290 / NBC Part 4
    %% ══════════════════════════════════════

    INIT([🟢 Fire Pump Head Calculation])

    %% Section 1: Project & Hazard
    S1H[/SECTION 1: Project Data & Hazard Classification/]
    FF1[Step 1: Fetch Project Profile<br/>Lodha Crown Tower-B | 32F+2B | 112.2m]
    FF2[Step 2: Occupancy & Hazard<br/>NBC Part 4 → Ordinary Hazard Group II]
    INIT --> S1H --> FF1 --> FF2

    HZ{Hazard Class?}
    FF2 --> HZ
    HZL[Light Hazard<br/>2.25 L/min/m² | 30 min]
    HZH[High Hazard<br/>12.2 L/min/m² | 90 min]
    HZO[Ordinary-II Selected<br/>5.0 L/min/m² | 216 m² | 60 min]
    HZ -->|Light| HZL
    HZ -->|High| HZH
    HZ -->|Ordinary-II| HZO

    %% Section 2: Water Storage
    S2H[/SECTION 2: Water Storage Demand/]
    FF3[Sprinkler Volume<br/>5.0 × 216 × 60 = 64,800 L = 64.8 m³]
    FF4[Hydrant Volume<br/>1800 LPM × 60 = 108,000 L = 108.0 m³]
    FF5[Drencher Volume<br/>42m × 35 × 60 = 88,200 L = 88.2 m³]
    FF6[Total = 261.0 m³ → max 261,300 = 300 m³]
    HZO --> S2H --> FF3 --> FF4 --> FF5 --> FF6

    %% Section 3-4: System Demand
    S3H[/SECTION 3-4: Hydrant & Sprinkler Demand/]
    FF7[Hydrant: 1800 LPM @ DN150<br/>Static: 115.7m]
    FF8[Sprinkler: 1080 LPM @ DN100<br/>Static: 116.0m]
    FF6 --> S3H --> FF7 --> FF8

    %% Section 5: Hazen-Williams
    S5H[/SECTION 5: Hazen-Williams Friction Engine/]
    FF9[Constants: C=120, g=9.81, Cd=0.62]
    FF10[P = 6.05×10⁴ × Q/C^1.85 / D^4.8657]
    FF11[Fitting Equiv Lengths Table<br/>Elbows + Tees + NRVs + BFVs]
    FF8 --> S5H --> FF9 --> FF10 --> FF11

    %% Section 6-7: TDH
    S6H[/SECTION 6-7: Friction Loss & TDH/]
    FF12[Hydrant Friction: 3.77 mWC<br/>Equiv Length: 254.8m]
    FF13[Hydrant TDH: 3.77+115.7+35.7+0.75 = 156m]
    FF14[Sprinkler Friction: 6.81 mWC<br/>Equiv Length: 236.9m]
    FF15[Sprinkler TDH: 6.81+116.0+5.1+1.36 = 130m]
    FF11 --> S6H --> FF12 --> FF13 --> FF14 --> FF15

    %% Section 9: Pressure Profile
    S9H[/SECTION 9: Pressure Profile & Orifice/]
    FF16[Floor-by-Floor Pressure Analysis]
    PD{Floor P > 7.0 Bar?}
    FF17[Orifice Required<br/>Cd=0.62 | 25-40mm plates]
    FF18[No Orifice Needed]
    FF15 --> S9H --> FF16 --> PD
    PD -->|YES| FF17
    PD -->|NO| FF18

    %% Section 10: Zone Compare
    S10H[/SECTION 10: High/Low Zone Comparison/]
    FF19[High Zone Hydrant: 1800 LPM @ 156m | 75 HP]
    FF20[High Zone Sprinkler: 1080 LPM @ 130m | 50 HP]
    FF21[Low Zone Booster: 900 LPM @ 90m | 30 HP]
    FF17 --> S10H
    FF18 --> S10H
    S10H --> FF19 --> FF20 --> FF21

    %% Dashboard
    BOM[📦 Pump BOM<br/>Main + Sprinkler + Jockey + Booster + Tank + Orifice]
    FF21 --> BOM
    DONE([🏁 FFP Calculation Complete])
    BOM --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef section fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    class INIT,DONE terminal
    class HZ,PD decision
    class S1H,S2H,S3H,S5H,S6H,S9H,S10H section`,
  },
  FTK: {
    title: "Fire Tank Size Estimation — Comprehensive",
    code: `flowchart TD
    %% ══════════════════════════════════════
    %% FTK — FIRE TANK SIZE ESTIMATION
    %% IS-15105 / NFPA-13 / IS-5290
    %% ══════════════════════════════════════

    INIT([🟢 Fire Tank Size Estimation])

    %% Section 1: Building Data
    S1H[/SECTION 1: Building & Occupancy Data/]
    FT1[Step 1: Building Profile<br/>32F+2B | 320 units | 112.2m | 45,000 m²]
    FT2[Step 2: Occupancy & Basement<br/>High-Rise | Basement: 8,400 m² | Ordinary-II]
    INIT --> S1H --> FT1 --> FT2

    %% Section 2: Standards
    S2H[/SECTION 2: Fire Water Standards Lookup/]
    FT3[IS-15105 Sprinkler: 1080 LPM × 60 min]
    FT4[IS-5290 Hydrant: 1800 LPM × 60 min]
    FT5[IS-15105 Drencher: 42m × 35 L/min/m × 60 min]
    FT2 --> S2H --> FT3 --> FT4 --> FT5

    %% Section 3: Sprinkler Volume
    S3H[/SECTION 3: Sprinkler Water Volume/]
    FT6[Q = 5.0 × 216 = 1,080 LPM]
    FT7[V_spr = 1,080 × 60 = 64,800 L = 64.8 m³]
    FT5 --> S3H --> FT6 --> FT7

    %% Section 4: Hydrant Volume
    S4H[/SECTION 4: Hydrant Water Volume/]
    FT8[V_hyd = 1,800 × 60 = 108,000 L = 108.0 m³]
    FT7 --> S4H --> FT8

    %% Section 5: Drencher Volume
    S5H[/SECTION 5: Drencher Water Volume/]
    FT9[Q = 42.0 × 35 = 1,470 LPM]
    FT10[V_drench = 1,470 × 60 = 88,200 L = 88.2 m³]
    FT8 --> S5H --> FT9 --> FT10

    %% Section 6: Safety Gate
    S6H[/SECTION 6: 300 m³ Safety Gate/]
    FT11[Raw Total = 64.8 + 108.0 + 88.2 = 261.0 m³]
    SG{V ≥ 300 m³?}
    FT12[Apply Safety Gate → 300 m³]
    FT13[Use Calculated Volume]
    FT14[Design Vol = 300 × 1.10 = 330 m³ with freeboard]
    FT10 --> S6H --> FT11 --> SG
    SG -->|NO: 261 < 300| FT12 --> FT14
    SG -->|YES| FT13 --> FT14

    %% Section 7: Tank Dimensioning
    S7H[/SECTION 7: Tank Dimensioning/]
    FT15[Option B Selected: 11.0m × 10.0m × 3.0m]
    FT16[Type: UG RCC M30 | Waterproof concrete]
    FT17[Specs: DN200 outlet | DN150 inlet/overflow | Manholes]
    FT14 --> S7H --> FT15 --> FT16 --> FT17

    %% Section 8: Dashboard
    S8H[/SECTION 8: Output Dashboard/]
    FT18[📊 Sprinkler: 64.8 | Hydrant: 108.0 | Drencher: 88.2]
    FT19[📦 Tank BOM: RCC Tank + Header + Pipes + Level]
    FT17 --> S8H --> FT18 --> FT19

    DONE([🏁 FTK Calculation Complete])
    FT19 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef section fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    class INIT,DONE terminal
    class SG decision
    class S1H,S2H,S3H,S4H,S5H,S6H,S7H,S8H section`,
  },
  FJD: {
    title: "Jockey & Drencher Pump — Comprehensive",
    code: `flowchart TD
    %% ══════════════════════════════════════
    %% FJD — JOCKEY & DRENCHER PUMP CALCULATION
    %% IS-15105 / NBC Part 4
    %% ══════════════════════════════════════

    INIT([🟢 Jockey & Drencher Pump Calculation])

    %% Section 1: Input Data
    S1H[/SECTION 1: Input from Main Fire Pump/]
    JD1[Fetch Main Pump Data<br/>Hydrant TDH=156m | Sprinkler TDH=130m]
    JD2[Building Data: 112.2m | 32F+2B<br/>Jockey DN50/80 | Drencher DN100]
    INIT --> S1H --> JD1 --> JD2

    %% Section 2: Jockey Purpose
    S2H[/SECTION 2: Jockey Pump Design/]
    JD3[Purpose: Pressure maintenance<br/>Compensates leakages | Prevents main cycling]
    JD4[Hydrant Jockey: 120 LPM @ 165m | 7.5 HP]
    JD5[Sprinkler Jockey: 60 LPM @ 140m | 5.0 HP]
    JD2 --> S2H --> JD3 --> JD4 --> JD5

    %% Section 3: Small-bore Friction
    S3H[/SECTION 3: Jockey Small-bore Friction/]
    JD6[DN50: P=0.892 kPa/m × 8.5m = 7.58 kPa]
    JD7[DN80: P=0.128 kPa/m × 7.0m = 0.90 kPa]
    JD8[Total Jockey Friction = 8.48 kPa = 0.86 mWC]
    JD5 --> S3H --> JD6 --> JD7 --> JD8

    %% Section 4-5: Drencher
    S4H[/SECTION 4-5: Drencher Pump Design & Friction/]
    JD9[Drencher: 42m × 35 L/min/m = 1,470 LPM]
    JD10[DN100 Friction: 19.74 kPa]
    JD11[DN80 Friction: 31.98 kPa]
    JD12[DN50 Friction: 89.28 kPa]
    JD13[Total Drencher Friction = 141.0 kPa = 14.38 mWC]
    JD8 --> S4H --> JD9 --> JD10 --> JD11 --> JD12 --> JD13

    %% Section 6: Safety Factor
    S6H[/SECTION 6: +20% Safety Factor/]
    JD14[Jockey: 0.86 × 1.20 = 1.03 mWC]
    JD15[Drencher: 14.38 × 1.20 = 17.26 mWC]
    JD13 --> S6H --> JD14 --> JD15

    %% Section 7: System Pressure
    S7H[/SECTION 7: Total Head & Pressure/]
    JD16[Jockey Hyd TDH: 1.03+115.7+5.1 = 122m]
    JD17[Jockey Spr TDH: 0.78+116.0+5.1 = 122m]
    JD18[Drencher TDH: 17.26+48.0+35.7 = 101m]
    PV{Jockey < Shutoff?}
    JD19[✅ 122 < 185 Hydrant OK]
    JD20[✅ 122 < 150 Sprinkler OK]
    JD15 --> S7H --> JD16 --> JD17 --> JD18 --> PV
    PV -->|YES| JD19
    PV -->|YES| JD20

    %% Section 8-9: Controls & Equipment
    S8H[/SECTION 8-9: Controls & Equipment/]
    JD21[Pressure Switches<br/>Start -0.3 Bar | Stop at set | Main -1.0 Bar]
    JD22[Equipment: Jockey 7.5+5 HP<br/>Drencher 2×60 HP | Pressure Vessels]
    JD19 --> S8H
    JD20 --> S8H
    S8H --> JD21 --> JD22

    %% Dashboard
    BOM[📦 BOM: Jockeys + Drencher + Vessels + Switches + Controller]
    JD22 --> BOM
    DONE([🏁 FJD Calculation Complete])
    BOM --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef section fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    class INIT,DONE terminal
    class PV decision
    class S1H,S2H,S3H,S4H,S6H,S7H,S8H section`,
  },
  FTB: {
    title: "Terrace Fire Booster Pump — Comprehensive",
    code: `flowchart TD
    %% ══════════════════════════════════════
    %% FTB — TERRACE FIRE BOOSTER PUMP HEAD
    %% GI Class C | C=120 | 900 LPM
    %% ══════════════════════════════════════

    INIT([🟢 Terrace Fire Booster Pump Head])

    %% Section 1: Building & Tank
    S1H[/SECTION 1: Building & Terrace Tank Data/]
    TB1[Building: 32F+2B | 112.2m<br/>Terrace Tank LWL: 109.5m | HWL: 112.0m]
    TB2[Tank Cap: 30 m³ fire reserve<br/>Lowest outlet 1F: 3.35m | Highest 32F: 108.85m]
    INIT --> S1H --> TB1 --> TB2

    %% Section 2: Pipe Material
    S2H[/SECTION 2: Pipe Material & Constants/]
    TB3[GI Class C IS-1239 | DN100 | ID: 100.3mm]
    TB4[C=120 | Q=900 LPM | V=1.90 m/s ✅ < 3.0]
    TB2 --> S2H --> TB3 --> TB4

    %% Section 3: Straight Run
    S3H[/SECTION 3: Straight Pipe Run/]
    TB5[Tank to Pump: 8.0m | Pump Discharge: 3.0m]
    TB6[Down Riser 32F→15F: 56.95m | Branch: 12.0m]
    TB7[Total Straight: 79.95m]
    TB4 --> S3H --> TB5 --> TB6 --> TB7

    %% Section 4: Fitting Equiv
    S4H[/SECTION 4: Fitting Equivalent Lengths/]
    TB8[6× 90° Elbow: 18.0m | 2× 45° Elbow: 3.0m]
    TB9[3× Tee: 18.0m | 4× Gate: 2.8m | 1× NRV: 7.5m]
    TB10[2× BFV: 5.0m | 1× Strainer: 5.0m]
    TB11[Total Fittings: 59.3m]
    TB7 --> S4H --> TB8 --> TB9 --> TB10 --> TB11

    %% Section 5: Hazen-Williams
    S5H[/SECTION 5: Hazen-Williams Friction/]
    TB12[L_eq = 79.95 + 59.3 = 139.25m]
    TB13[P = 6.05e4 × 900/120^1.85 / 100.3^4.8657]
    TB14[P = 0.0856 kPa/m × 139.25 = 11.92 kPa = 1.22 mWC]
    TB11 --> S5H --> TB12 --> TB13 --> TB14

    %% Section 6: Safety Factor
    S6H[/SECTION 6: +20% Safety Factor/]
    TB15[Safety = 1.22 × 0.20 = 0.24 mWC]
    TB16[Final Friction = 1.22 + 0.24 = 1.46 mWC]
    TB14 --> S6H --> TB15 --> TB16

    %% Section 7: Static Head
    S7H[/SECTION 7: Static Head Analysis/]
    TB17[Gravity Available: 109.5 - 3.35 = 106.15m]
    GD{Gravity ≥ 3.5 Bar?}
    TB18[Above 15F: Gravity OK ✅]
    TB19[Below 15F: Booster Required 🔴]
    TB16 --> S7H --> TB17 --> GD
    GD -->|Above 15F| TB18
    GD -->|Below 15F| TB19

    %% Section 8: Total Head
    S8H[/SECTION 8: Total Head Summation/]
    TB20[Booster TDH = Friction + Residual]
    TB21[= 1.46 + 35.7 = 37.16m ≈ 38m = 3.7 Bar]
    TB19 --> S8H --> TB20 --> TB21

    %% Section 9: Floor Profile
    S9H[/SECTION 9: Floor Pressure Profile/]
    TB22[20F-32F: Gravity OK | 15F-19F: Marginal]
    TB23[1F-14F: Booster zone | 1F-4F: Orifice needed]
    TB21 --> S9H --> TB22 --> TB23

    %% Section 10: Dashboard
    S10H[/SECTION 10: Output Dashboard/]
    TB24[Booster: 900 LPM @ 38m | 15 HP]
    TB25[📦 BOM: 2× Pump + Header + Valves + Orifice]
    TB23 --> S10H --> TB24 --> TB25

    DONE([🏁 FTB Calculation Complete])
    TB25 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef section fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#991b1b
    class INIT,DONE terminal
    class GD decision
    class S1H,S2H,S3H,S4H,S5H,S6H,S7H,S8H,S9H,S10H section`,
  },
  EBR: {
    title: "Electrical Bus Riser System",
    code: `flowchart TD
    INIT([🟢 Electrical Bus Riser<br/>System Design])
    A[/PHASE A: Flat Unit Load/]
    A1[Fixtures: Lights, Fans, Sockets, ACs<br/>CL = 10.3 kW]
    A2[Diversity Factor DF = 0.60<br/>MD = 6.18 kW per flat]
    B[/PHASE B: Bus Riser Loading/]
    B1[33 Floors × 4 Flats × 6.18 kW]
    B2[Riser DF = 0.40<br/>Total Load = 326.3 kW]
    B3[Current Calc<br/>I = kW/(√3×V×pf) = 534A]
    B4[90% Loading Safety<br/>Selected: 630A Bus Bar]
    C[/PHASE C: Voltage Drop/]
    C1[mV/mtr/A = 0.029<br/>Length = 125.55m]
    C2[Vd = 1.95V = 0.47%]
    C3{Validation}
    C4[✓ I: 534A < 630A<br/>✓ VD: 0.47% < 3%<br/>✓ Loading: 84.8%]
    D[/PHASE D: Derating/]
    D1[Ambient 45°C<br/>Factor = 0.91 → 573A]
    E[/PHASE E: Hardware BOM/]
    E1[126m Bus Duct<br/>33 Tap-offs 125A<br/>45 Support Brackets]
    OUT([📥 Complete BOM])
    INIT --> A --> A1 --> A2 --> B --> B1 --> B2 --> B3 --> B4 --> C --> C1 --> C2 --> C3
    C3 -->|Pass| C4 --> D --> D1 --> E --> E1 --> OUT
    DONE([🏁 Design Complete])
    OUT --> DONE
    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    class INIT,DONE terminal
    class C3 decision`,
  },
  DD_CB: {
    title: "Cable Sizing & Voltage Drop Calculation",
    code: `flowchart TD
    %% CABLE SIZING & VOLTAGE DROP — 19-Step Workflow
    INIT([🟢 Cable Sizing Calculation<br/>Start])

    %% Phase 1: User Inputs
    P1[/Col 1 — Load Description<br/>Col 2 — Total Load (kW)<br/>📝 Manual Entry/]
    INIT --> P1

    P2[/Col 3 — Supply Voltage<br/>📋 Dropdown: 415 V | 230 V/]
    P1 --> P2

    P3[/Col 4 — Power Factor (PF)<br/>Col 5 — Length of Cable (m)<br/>📝 Manual Entry/]
    P2 --> P3

    %% Phase 2: Full Load Current
    P3 --> D1
    D1{Col 6 — Full Load Current<br/>Decision: Supply Voltage?}
    D1 -->|415 V| F1[I = TotalLoad / 1.732×415×PF × 1000<br/>Three Phase Formula]
    D1 -->|230 V| F2[I = TotalLoad / 230×PF × 1000<br/>Single Phase Formula]
    F1 --> MRG1([Col 6: FLC Calculated])
    F2 --> MRG1

    %% Phase 3: Demand
    MRG1 --> P6
    P6[/Col 7 — Demand Factor<br/>Col 8 — Diversity Factor<br/>📝 Manual Entry/]
    P7[Col 9 — Demand Load<br/>= Col 7 × Col 8]
    P6 --> P7

    %% Phase 4: Cable Selection & DB Fetch
    P7 --> P8
    P8[/Col 10 — Cable Type<br/>Col 11 — Cable Material<br/>Col 12 — Cable Core Type<br/>Col 13 — Installation Method<br/>📋 Dropdown Selections/]
    DB1[(Fetch from Cable Database<br/>Col 14: Cable Size<br/>Col 15: Current Capacity<br/>Col 16: Resistance R)]
    P8 --> DB1

    %% Phase 5: Derating
    DB1 --> P10
    P10[/Col 17 — No. of Cable / Run<br/>📝 Manual Entry/]
    DB2[(Fetch Derating from Cable DB<br/>Col 18: k1 Ambient Temp<br/>Col 19: k2 Grouping<br/>Col 20: k3 Soil Thermal<br/>Col 21: k4 Depth<br/>Col 22: k5 Other<br/>Col 23: Reactance X)]
    P10 --> DB2

    P12[Col 27 — Total Derating Factor<br/>Kt = k1×k2×k3×k4×k5]
    DB2 --> P12

    %% Phase 6: Capacity
    P13[Col 28 — Derated Capacity<br/>= Col 15 × Col 27]
    P12 --> P13
    P14[Col 29 — Effective Capacity<br/>= Col 28 × Col 17]
    P13 --> P14

    %% Phase 7: Voltage Drop
    P14 --> D2
    D2{Col 30 — Voltage Drop<br/>Decision: Supply Voltage?}
    D2 -->|230 V| VD1[VD = FLC×L×N×(R×0.8+X×0.6) / 1000]
    D2 -->|415 V| VD2[VD = 1.732×FLC×L×N×(R×0.8+X×0.6) / 1000]
    VD1 --> MRG2([Col 30: VD Calculated])
    VD2 --> MRG2

    P16[Col 31 — % Voltage Drop<br/>= VD / Voltage × 100]
    MRG2 --> P16

    %% Phase 8: Validation
    P16 --> D3
    D3{Is % VD < 6%?<br/>Validation Gate}
    D3 -->|YES| P18[Col 32 — Total Cable<br/>= 2 × Col 17]
    D3 -->|NO| ALERT[⚠️ VD Exceeds Limit!<br/>Re-select Cable Size]
    ALERT -.->|Re-select| P8

    DONE([🏁 Cable Sizing Complete])
    P18 --> DONE

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef db fill:#cffafe,stroke:#06b6d4,stroke-width:2px,color:#155e75
    class INIT,DONE,MRG1,MRG2 terminal
    class D1,D2,D3 decision
    class ALERT reject
    class DB1,DB2 db`,
  },

  DD_PIP: {
    title: "Transfer Pipe Sizing Calculation",
    code: `flowchart TD
    %% ═══ STAGE 1: INPUT & DEFINITION ═══
    INIT([🏗️ Transfer Pipe Sizing — START])
    INIT --> P1

    P1[/Input 1: Building Profile<br/>Number of Floors, Floor Height, Building Type/]
    P1 --> P2

    P2[/Input 2: Fixture Count per Toilet Type<br/>e.g., Type-1: 1 WB + 1 WC + 1 Shower/]
    P2 --> DB1

    DB1[(Assign Fixture Units — WSFU & DFU<br/>📋 From Toilet Types Sheet)]
    DB1 --> FU1

    FU1[WB: 1.5 WSFU / 1 DFU<br/>WC Flush Tank: 3 WSFU / 3 DFU<br/>Shower: 2 WSFU / 2 DFU]
    FU1 --> LOOP

    %% ═══ STAGE 2: THE RISER LOGIC ═══
    LOOP[🔄 Loop Init: Floor N — Top to Bottom]
    LOOP --> SUM

    SUM[Sum WSFU for Floor N<br/>Sub Riser FU = Fixtures × Count]
    SUM --> CUM

    CUM[Cumulative Main Riser FU<br/>Main Riser FU = Sub Riser FU + FU above]
    CUM --> D1

    D1{Combined Hot/Cold Line?}
    D1 -->|YES| ADJ[Adjusted FU = Main Riser FU × 1.4]
    D1 -->|NO| DIR[Use Direct WSFU]

    ADJ --> MRG1[Final FU for Floor N]
    DIR --> MRG1

    MRG1 --> D2{More Floors Below?}
    D2 -->|YES| LOOP
    D2 -->|NO| HUNT

    %% ═══ STAGE 3: FLOW CONVERSION ═══
    HUNT[(Hunter's Curve Lookup<br/>📋 FU → GPM Database — Flush Tank type)]
    HUNT --> GPM

    GPM[GPM Value for Each Floor Segment<br/>Interpolated from FU–GPM table]
    GPM --> THR

    %% ═══ STAGE 4: FINAL SIZING DECISION ═══
    THR{GPM Threshold Check}
    THR -->|≤ 45| S50[→ 50 mm Pipe]
    THR -->|45–70| S65[→ 65 mm Pipe]
    THR -->|70–130| S80[→ 80 mm Pipe]
    THR -->|130–250| S100[→ 100 mm Pipe]
    THR -->|> 250| S125[→ 125 mm Pipe]

    S50 --> VEL
    S65 --> VEL
    S80 --> VEL
    S100 --> VEL
    S125 --> VEL

    VEL{V ≤ 3.0 m/s?}
    VEL -->|YES| PASS[✅ Pipe Size Confirmed]
    VEL -->|NO| ALERT[⬆️ Upsize Pipe — Re-select]
    ALERT --> THR

    %% ═══ STAGE 5: OUTPUT DETAILS ═══
    PASS --> SCHED[Final Pipe Schedule — All Floor Segments]
    SCHED --> PCHK[Velocity & Pressure Drop Verification<br/>Hazen-Williams: ΔP check]
    PCHK --> VENT[Vent Pipe Diameters<br/>Soil Stack: 100 mm | Waste Stack: 80 mm]
    VENT --> DONE

    DONE([🏁 Transfer Pipe Sizing — COMPLETE])

    classDef terminal fill:#059669,stroke:#34d399,stroke-width:2.5px,color:#ffffff
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef db fill:#cffafe,stroke:#06b6d4,stroke-width:2px,color:#155e75
    class INIT,DONE,MRG1 terminal
    class D1,D2,THR,VEL decision
    class ALERT reject
    class DB1,HUNT db`,
  },

  DD_PRV: {
    title: "PRV Calculations",
    code: `flowchart TD
    %% ═══ PHASE 1: PROJECT & STRUCTURAL INITIALIZATION ═══
    INIT["🏗️ Project & Structural Initialization"]
    S11["1.1 Building Geometry<br/>Fetch Floors, Podiums, Building Name"]
    S12["1.2 Vertical Height Mapping<br/>Typ 3.35m, Ground 4.2m, Service 2m"]
    S12M["⌨️ Manual Override<br/>User can type specific floor heights"]
    S13["1.3 Reference Levels<br/>OHT Bottom Level & UGT Depth"]
    S14["1.4 Design Constraints<br/>P_min=1.5 Bar | P_max=3.5 Bar"]

    INIT --> S11 --> S12 --> S12M --> S13 --> S14

    %% ═══ PHASE 2: PRESSURE GRADIENT ENGINE ═══
    S21["2.1 Raw Static Head Calculation<br/>P = (Elev_Tank − Elev_Floor) / 10.2"]
    S22["2.2 Correction Factor<br/>IF Floor>4m: −0.3 Bar ELSE −0.2 Bar"]
    S23{"2.3 Zone Logic Gate"}
    Z1["🚀 Booster Pump Line<br/>P < 1.5 Bar"]
    Z2["✅ Direct Gravity<br/>1.5 ≤ P ≤ 3.5 Bar"]
    Z3["⚠️ TRIGGER PRV<br/>P > 3.5 Bar"]
    ZMERGE["Zone Classification Complete"]

    S14 --> S21 --> S22 --> S23
    S23 -->|P < 1.5| Z1
    S23 -->|1.5-3.5| Z2
    S23 -->|P > 3.5| Z3
    Z1 --> ZMERGE
    Z2 --> ZMERGE
    Z3 --> ZMERGE

    %% ═══ PHASE 3: PRV RESET & MAPPING ═══
    S31["3.1 PRV Station Placement<br/>Identify floors where P > 3.5 Bar"]
    S32["3.2 Pressure Reset Logic<br/>Reset to 1.5 Bar at PRV floor"]
    S32F["P_next = 1.5 + (Floor Drop / 10.2)"]
    S33["3.3 PRV Schedule Output<br/>Floor# | Inlet P | Outlet P | PRV Model"]

    ZMERGE --> S31 --> S32 --> S32F --> S33

    %% ═══ PHASE 4: RISER SIZING & WSFU ═══
    S41["4.1 Flat Type Unit Mapping<br/>Type-1 through Type-19 per floor"]
    S42["4.2 WSFU Accumulation<br/>Top-Down Cumulative Sum"]
    S43["4.3 Hunter's Curve Conversion<br/>Σ WSFU → GPM"]

    S33 --> S41 --> S42 --> S43

    %% ═══ PHASE 5: PIPE VALIDATION & BOM ═══
    S51["5.1 Pipe Diameter Selection<br/>25, 32, 40, 50, 65, 80, 100mm"]
    S52["5.2 Velocity Check<br/>V = Q / A"]
    VCHK{"V > 2.4 m/s ?"}
    VFLAG["🔴 FLAG: Upsize Pipe"]
    S53["5.3 Output: Riser Schedule + BOM<br/>PRVs, Pipe lengths, Pump Duty"]
    DONE["🏁 PRV Calculation Complete"]

    S43 --> S51 --> S52 --> VCHK
    VCHK -->|Yes| VFLAG --> S52
    VCHK -->|No| S53 --> DONE

    classDef terminal fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#065f46
    classDef decision fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e
    classDef reject fill:#ffe4e6,stroke:#f43f5e,stroke-width:1.5px,color:#9f1239
    classDef zone fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#5b21b6
    class INIT,DONE terminal
    class S23,VCHK decision
    class VFLAG reject
    class Z1,Z2,Z3 zone`,
  },

  P3D: {
    title: "Building Thermal Cooling Load Calculation",
    code: `flowchart TD
    %% ══════════════════════════════════════════════════
    %% BUILDING THERMAL COOLING LOAD — ASHRAE CLTD METHOD
    %% ══════════════════════════════════════════════════

    START([🌡️ HEAT LOAD CALCULATION START])

    %% ── SECTION 1: PROJECT & CLIMATE ──
    S1[/"📍 Project Location & Climate Zone"/]
    S1A["Outdoor DB: 38.5°C, WB: 28.2°C<br/>Indoor: 24°C, RH: 50%<br/>ΔT = 14.5°C"]
    START --> S1 --> S1A

    %% ── SECTION 2: BUILDING ENVELOPE ──
    S2[/"🏗️ Building Envelope Data"/]
    S2A["Wall U-values: 1.82 W/m²K<br/>Roof U-value: 1.46 W/m²K<br/>Glass U-value: 5.80 W/m²K"]
    S1A --> S2 --> S2A

    %% ── SECTION 3: OPAQUE GAIN ──
    S3[/"🧱 Opaque Surface Heat Gain"/]
    S3F["Q = U × A × CLTD<br/>Walls + Roof + Floor"]
    S3R["Total Q_opaque = 50,083 W"]
    S2A --> S3 --> S3F --> S3R

    %% ── SECTION 4: FENESTRATION ──
    S4[/"🪟 Fenestration Heat Gain"/]
    S4F["Q_solar = A × SC × SHGF<br/>Q_cond = U × A × ΔT"]
    S4R["Total Q_fen = 90,105 W"]
    S3R --> S4 --> S4F --> S4R

    %% ── SECTION 5: OCCUPANCY ──
    S5[/"🧑‍💼 Internal Gain: People"/]
    S5F["Sensible: 75 W/person (seated)<br/>Latent: 55 W/person<br/>260 people"]
    S5R["Q_people = 38,075 W<br/>(20,325 S + 17,750 L)"]
    S4R --> S5 --> S5F --> S5R

    %% ── SECTION 6: LIGHTING ──
    S6[/"💡 Internal Gain: Lighting"/]
    S6F["Q = W × BF × CLF<br/>LPD: 10 W/m², BF: 1.0 (LED)"]
    S6R["Q_lighting = 10,260 W"]
    S5R --> S6 --> S6F --> S6R

    %% ── SECTION 7: EQUIPMENT ──
    S7[/"🖥️ Internal Gain: Equipment"/]
    S7F["Q = kW × UF × 1000<br/>Computers + Servers + Kitchen"]
    S7R["Q_equipment = 32,140 W"]
    S6R --> S7 --> S7F --> S7R

    %% ── SECTION 8: VENTILATION ──
    S8[/"🌬️ Ventilation & Infiltration"/]
    S8S["Q_sensible = 1.08 × CFM × ΔT<br/>= 1.08 × 6500 × 14.5 = 29,825 W"]
    S8L["Q_latent = 0.68 × CFM × ΔW × 7000<br/>= 89,761 W"]
    S8R["Total Vent = 135,235 W<br/>(33,726 S + 101,509 L)"]
    S7R --> S8 --> S8S & S8L --> S8R

    %% ── SECTION 9: ROOM TOTALS ──
    S9[/"📊 Room Heat Summation"/]
    S9RSH["RSH = 236,639 W"]
    S9RLH["RLH = 119,259 W"]
    S9RTH["RTH = RSH + RLH = 355,898 W<br/>SHR = 0.665"]
    S8R --> S9 --> S9RSH & S9RLH --> S9RTH

    %% ── SECTION 10: SHR CHECK ──
    S10{SHR < 0.75?}
    S10Y["Deep Cooling Coil Required<br/>6-row coil, CHW @ 6°C"]
    S10N["Standard DX Coil OK"]
    S9RTH --> S10
    S10 -->|YES 0.665| S10Y
    S10 -->|NO| S10N

    %% ── SECTION 11: GTH ──
    S11[/"🔥 Grand Total Heat"/]
    S11F["GTH = RTH × (1 + 2% + 3% + 1% + 5%)<br/>= 355,898 × 1.11 = 395,047 W"]
    S10Y --> S11 --> S11F

    %% ── SECTION 12: TR & CFM ──
    S12[/"❄️ TR & CFM Calculation"/]
    S12TR["TR = GTH / 3517 = 112.3 TR"]
    S12CFM["CFM = RSH × 3.41 / (1.08 × ΔT_supply)<br/>= 74,520 CFM"]
    S11F --> S12 --> S12TR & S12CFM

    %% ── SECTION 13: EQUIPMENT ──
    S13[/"🏭 Equipment Selection"/]
    S13SEL["Selected: 120 TR Screw Chiller<br/>COP: 5.2, R-134a, Water-Cooled"]
    S12TR --> S13 --> S13SEL

    %% ── SECTION 14: VALIDATION ──
    S14{All Checks Pass?}
    S14P["✅ Load < Capacity<br/>✅ COP > ECBC Min<br/>✅ Comfort: 24°C/50%RH<br/>✅ Fresh Air: ASHRAE 62.1"]
    S13SEL --> S14 -->|PASS| S14P

    DONE([🏁 HEAT LOAD CALC COMPLETE<br/>112.3 TR | 74,520 CFM])
    S14P --> DONE

    %% ── STYLES ──
    classDef input fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af
    classDef calc fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e
    classDef formula fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6
    classDef result fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46
    classDef alert fill:#ffe4e6,stroke:#f43f5e,stroke-width:2px,color:#9f1239
    classDef decision fill:#fef3c7,stroke:#f59e0b,stroke-width:3px,color:#92400e

    class S1,S2,S1A,S2A input
    class S3,S4,S5,S6,S7,S8,S9,S11,S12,S13 calc
    class S3F,S4F,S5F,S6F,S7F,S8S,S8L,S11F,S12TR,S12CFM formula
    class S3R,S4R,S5R,S6R,S7R,S8R,S9RSH,S9RLH,S9RTH,S13SEL,S14P result
    class S10Y,S10N alert
    class S10,S14 decision`,
  },

  DD_ERT: {
    title: "Short Circuit & Earthing Design Calculation",
    code: `flowchart TD
    %% ══════════════════════════════════════════════════════
    %% SHORT CIRCUIT & EARTHING DESIGN — IS 3043 / IEC 60909
    %% ══════════════════════════════════════════════════════

    START([⚡ Short Circuit & Earthing Design]) --> S1

    %% ── PHASE 1: SOURCE FAULT LEVEL ──
    subgraph PH1[Phase 1 — Source Fault Level]
      S1[§1 Transformer Input Data<br/>1000kVA, 433V, Z%=5.0, Tol=-10%]
      S1 --> S2[§2 Ohmic Impedance Conversion<br/>Z = %Z×10×kV² / Base kVA]
      S2 --> S2R[Z_tr = 0.00844 Ω]
      S2R --> S3[§3 Fault Current Calc<br/>If = V×c / √3×Z]
      S3 --> S3R[I_f TR = 32,578 A ≈ 32.6 kA]
      S3R --> S3D{Round to Std Rating?}
      S3D -->|Yes| S3STD[36 kA Standard]
      S1 --> S4[§4 DG Fault Level<br/>500kVA, X''d=15%]
      S4 --> S4R[I_f DG = 4,941 A ≈ 5.0 kA]
      S4R --> S4STD[10 kA Standard]
      S3STD --> S5[§5 Combined Source Fault<br/>I_total = I_TR + I_DG + I_motor]
      S4STD --> S5
      S5 --> S5R[42.5 kA → Design: 50 kA]
      S5R --> S5D{TR & DG Parallel?}
      S5D -->|Yes| S5Y[Use 50 kA]
      S5D -->|No| S5N[Use 36 kA TR only]
    end

    %% ── PHASE 2: DISTRIBUTION FAULT ──
    subgraph PH2[Phase 2 — Distribution Panel Fault Level]
      S5Y --> S6[§6 Cable Impedance Data<br/>Al/Cu XLPE — R & X from IS 694]
      S5N --> S6
      S6 --> S7[§7 Cable Z Calculation<br/>Zc = √R²+X² × L/1000 / Runs]
      S7 --> S7R[Z_cable per feeder computed]
      S7R --> S8[§8 Downstream Panel Fault<br/>Z_total = Z_source + Z_cable]
      S8 --> S8T[Panel Fault Table:<br/>MDB=32.6kA, SMDB=25kA<br/>CDB=16kA, LDB=10kA]
      S8T --> S9{§9 Panel Rating ≥ Fault?}
      S9 -->|Yes| S9Y[✅ All Panels Pass]
      S9 -->|No| S9N[❌ Upgrade Breaker/Cable]
      S9N --> S8
    end

    %% ── PHASE 3: EARTHING CONDUCTOR SIZING ──
    subgraph PH3[Phase 3 — Earthing Conductor Sizing]
      S9Y --> S10[§10 Adiabatic Equation<br/>A = I×√t / k]
      S10 --> S10K[Material Constants:<br/>Cu k=205, GI k=80, Al k=126]
      S10K --> S11[§11 Equipment-wise Sizing<br/>TR: 2×50×6 GI = 600mm²<br/>DG: 1×40×6 GI = 240mm²]
      S11 --> S11D{A_provided ≥ A_required?}
      S11D -->|Yes| S11Y[✅ Pass]
      S11D -->|No| S11N[Upgrade Strip → Recalculate]
      S11N --> S11
      S11Y --> S12[Earth Pit Resistance<br/>R = ρ/2πL × ln 8L/d − 1]
      S12 --> S12R[8 pits → R_net = 1.79 Ω < 2 Ω ✓]
    end

    %% ── DASHBOARD ──
    S12R --> DASH[📊 Dashboard<br/>TR: 36kA, DG: 10kA, Combined: 50kA<br/>Earth: 1.79Ω, 8 pits, 14 BOQ items]

    %% Styles
    classDef input fill:#dbeafe,stroke:#3b82f6,color:#1e40af
    classDef formula fill:#fef3c7,stroke:#f59e0b,color:#92400e
    classDef result fill:#d1fae5,stroke:#10b981,color:#065f46
    classDef decision fill:#ede9fe,stroke:#8b5cf6,color:#5b21b6
    classDef alert fill:#ffe4e6,stroke:#f43f5e,color:#9f1239
    classDef dashboard fill:#ccfbf1,stroke:#14b8a6,color:#134e4a

    class S1,S4,S6 input
    class S2,S3,S7,S10,S12 formula
    class S2R,S3R,S4R,S5R,S7R,S8T,S10K,S11,S12R result
    class S3STD,S4STD,S5Y,S5N,S9Y,S11Y dashboard
    class S9N,S11N alert
    class S3D,S5D,S9,S11D decision
    class DASH dashboard`,
  },

  VENT: {
    title: "Building Cooling Load, Ventilation & Pressurization",
    code: `flowchart TD
    %% ═══ PHASE 1: COOLING LOAD ═══
    H["❄️ Building Cooling Load, Ventilation & Pressurization<br/>ASHRAE / NBC 2016 / NFPA 92"]

    subgraph P1["PHASE 1 — COOLING LOAD"]
      S1["§1 Input & Ambient Conditions<br/>Outdoor: 42°C DBT / 27°C WBT<br/>Indoor: 24°C / 50% RH"]

      S2["§2 Conduction: Q = U × A × CLTD × LM × K<br/>Walls + Roof + Floor<br/>Total = 182,494 BTU/hr"]

      S3["§3 Solar: Q = A × SC × SHGF × CLF<br/>Fenestration by orientation<br/>Total = 94,311 BTU/hr"]

      S4["§4 Occupancy: Q_s = N × SHG × CLF<br/>Q_l = N × LHG<br/>Sensible = 93,053 | Latent = 122,750"]

      S5["§5 Lighting: Q = W × BF × CLF × 3.412<br/>Office + Lab + Common<br/>Total = 259,251 BTU/hr"]

      S6["§6 Equipment: Q = W × DF × UF × 3.412<br/>Diversity Factors applied<br/>Total = 323,099 BTU/hr"]

      S7["§7 Ventilation & Infiltration<br/>Q_s = 1.08 × CFM × ΔT<br/>Q_l = 0.68 × CFM × ΔW<br/>BF = 0.15 (coil bypass)"]

      S8["§8 ERSH = 1,023,838 BTU/hr<br/>GTH = 1,990,790 BTU/hr<br/>TR = GTH / 12,000 = 170 TR<br/>Supply CFM = 47,400"]
    end

    subgraph P2["PHASE 2 — PRESSURIZATION"]
      S9{"§9 Select Type:<br/>Staircase | Lift Well | Lift Lobby"}

      S10A["§10 Staircase: Leakage + Door Open<br/>Q = 0.827 × A_e × √ΔP<br/>v = 0.75 m/s through open door<br/>Fan: 25,000 CMH @ 60mm WG"]

      S10B["§11 Lift Well: Q = L×T×√(2ΔP/ρ)×1000<br/>Doors + Cutouts + Ropes + Walls<br/>Fan: 24,000 CMH @ 40mm WG"]

      S10C["§12 Lift Lobby: Pressure Sandwich<br/>50% safety on closed door leakage<br/>Fan: 41,000 CMH @ 50mm WG"]

      S11["§13 Common Output<br/>Total: 115,000 CMH installed<br/>Diversified: 97,750 CMH (0.85)"]
    end

    H --> S1
    S1 --> S2 --> S3 --> S4
    S4 --> S5 --> S6 --> S7 --> S8
    S8 --> S9
    S9 -->|Staircase| S10A
    S9 -->|Lift Well| S10B
    S9 -->|Lift Lobby| S10C
    S10A --> S11
    S10B --> S11
    S10C --> S11

    %% Styles
    classDef input fill:#dbeafe,stroke:#3b82f6,color:#1e40af
    classDef formula fill:#ede9fe,stroke:#8b5cf6,color:#5b21b6
    classDef result fill:#d1fae5,stroke:#10b981,color:#065f46
    classDef decision fill:#fef3c7,stroke:#f59e0b,color:#92400e
    classDef alert fill:#fee2e2,stroke:#dc2626,color:#991b1b
    classDef dashboard fill:#ccfbf1,stroke:#14b8a6,color:#134e4a

    class H,S1 input
    class S2,S3,S4,S5,S6,S7 formula
    class S8,S11 result
    class S9 decision
    class S10A alert
    class S10B,S10C dashboard`,
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
  concept: ["P3A", "P3B", "OWC", "STP", "DFP", "FFP", "FTK", "FJD", "FTB", "RWH", "SWD", "P3D", "VENT"],
  detailed: ["DD_CB", "DD_PIP", "DD_PRV", "DD_ERT"], // Cable Sizing + Pipe Sizing + PRV + Earthing ready; others coming soon
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
