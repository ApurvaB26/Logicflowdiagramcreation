import React, { useState, useCallback } from "react";
import { Download, Code, X, Copy, Check } from "lucide-react";

// =====================================================================
// MERMAID CODE — Full Concept Stage Diagram
// =====================================================================
const MERMAID_CODE = `flowchart TD
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

    %% ── 4-WAY CATEGORY → SEGMENT BRANCH ──
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

    %% ── REMAINING INPUT FIELDS ──
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

    %% ══════════════════════════════════════
    %% COMPLETE
    %% ══════════════════════════════════════
    DONE([🏁 CONCEPT STAGE COMPLETE<br/>Proceed to Schematic Design Stage])
    P6F --> DONE

    %% ══════════════════════════════════════
    %% STYLES
    %% ══════════════════════════════════════
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
    class P6,P6A,P6B,P6C,P6E,P6F converge
`;

// =====================================================================
// PNG EXPORT — Convert SVG to Canvas to PNG
// =====================================================================
function downloadPNG() {
  const svgEl = document.querySelector(".concept-chart-svg") as SVGSVGElement | null;
  if (!svgEl) {
    alert("Chart SVG not found. Please ensure the diagram is visible.");
    return;
  }

  // Clone the SVG and set explicit dimensions
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const w = svgEl.viewBox.baseVal.width || svgEl.getBoundingClientRect().width;
  const h = svgEl.viewBox.baseVal.height || svgEl.getBoundingClientRect().height;

  // Scale for high-res export
  const scale = 3;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

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

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `MEP-Concept-Stage-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, "image/png");

    URL.revokeObjectURL(url);
  };
  img.src = url;
}

// =====================================================================
// MERMAID CODE MODAL
// =====================================================================
function MermaidModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const ta = document.createElement("textarea");
    ta.value = MERMAID_CODE;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[900px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[14px] text-[#0f172a]">Mermaid.js Code</h2>
              <p className="text-[11px] text-[#94a3b8]">
                Paste into FigJam Mermaid Plugin or mermaid.live
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors"
              style={{
                background: copied ? "#d1fae5" : "#f8fafc",
                borderColor: copied ? "#10b981" : "#e2e8f0",
                color: copied ? "#065f46" : "#475569",
              }}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy All"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-5 py-2.5 bg-[#eff6ff] border-b border-[#bfdbfe]">
          <p className="text-[11px] text-[#1e40af]">
            <strong>How to use:</strong> ① Copy the code below → ② Open FigJam → ③ Install "Mermaid to FigJam" plugin →
            ④ Paste code in plugin → ⑤ Click Generate. Or paste at{" "}
            <a
              href="https://mermaid.live"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mermaid.live
            </a>{" "}
            to preview first.
          </p>
        </div>

        {/* Code Block */}
        <div className="flex-1 overflow-auto p-4 bg-[#1e293b]">
          <pre className="text-[12px] text-[#e2e8f0] whitespace-pre" style={{ fontFamily: "monospace", lineHeight: 1.6 }}>
            {MERMAID_CODE}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-[10px] text-[#94a3b8]">
            ~55 nodes · Full Concept Stage · Color-coded by section
          </p>
          <p className="text-[10px] text-[#94a3b8]">
            MEP Digital Ecosystem · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// EXPORT BUTTONS COMPONENT
// =====================================================================
export function ExportButtons() {
  const [showMermaid, setShowMermaid] = useState(false);

  return (
    <>
      <button
        onClick={downloadPNG}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        title="Download chart as PNG"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PNG</span>
      </button>
      <button
        onClick={() => setShowMermaid(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
        title="View Mermaid.js code for FigJam"
      >
        <Code className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Mermaid</span>
      </button>

      {showMermaid && <MermaidModal onClose={() => setShowMermaid(false)} />}
    </>
  );
}