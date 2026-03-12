import React, { useState, useCallback } from "react";
import { Download, Code, X, Copy, Check, ChevronDown, ChevronRight, FileCode2, ExternalLink } from "lucide-react";
import {
  STAGE_MERMAID_MAP,
  CALC_MERMAID_CODES,
  STAGE_CALC_IDS,
  STAGE_LABELS,
} from "./mermaid-codes";
import { copyToClipboard } from "./clipboard-utils";

// =====================================================================
// PROPS
// =====================================================================
interface ExportButtonsProps {
  currentStage?: string; // "concept" | "detailed" | "tender" | "vfc"
}

// =====================================================================
// PNG EXPORT — Convert SVG to Canvas to PNG, open in new tab for saving
// =====================================================================
function downloadAllSvgsAsPng(stage: string) {
  const svgEls = document.querySelectorAll(".stage-chart-svg") as NodeListOf<SVGSVGElement>;
  if (svgEls.length === 0) {
    alert("Chart SVG not found. Please ensure the diagram is visible.");
    return;
  }

  const svgEl = svgEls[0];
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const w = svgEl.viewBox.baseVal.width || svgEl.getBoundingClientRect().width;
  const h = svgEl.viewBox.baseVal.height || svgEl.getBoundingClientRect().height;
  const scale = 3;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.removeAttribute("class");
  clone.style.cssText = "display:block";

  const svgString = new XMLSerializer().serializeToString(clone);
  const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

  const stageLabel = STAGE_LABELS[stage] || stage;
  const safeName = `MEP-${stageLabel.replace(/\s/g, "-")}`;

  const img = new window.Image();
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);

      const pngDataUrl = canvas.toDataURL("image/png");
      // Open in new tab so user can right-click → Save Image As
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${safeName} — MEP PNG</title>
            <style>
              body { margin: 0; background: #f1f5f9; display: flex; flex-direction: column; align-items: center; padding: 24px; font-family: system-ui, sans-serif; }
              h2 { color: #1e293b; font-size: 16px; margin-bottom: 8px; }
              p { color: #64748b; font-size: 12px; margin-bottom: 16px; }
              img { max-width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
            </style>
          </head>
          <body>
            <h2>${safeName}</h2>
            <p>Right-click the image below and select <strong>"Save image as..."</strong> to download.</p>
            <img src="${pngDataUrl}" alt="${safeName}" />
          </body>
          </html>
        `);
        win.document.close();
      }
    } catch (e) {
      console.error("downloadAllSvgsAsPng: canvas error", e);
    }
  };
  img.onerror = (e) => {
    console.error("downloadAllSvgsAsPng: image load error", e);
  };
  img.src = dataUrl;
}

// =====================================================================
// MERMAID CODE MODAL — Stage + Calculations
// =====================================================================
function MermaidModal({
  onClose,
  currentStage,
}: {
  onClose: () => void;
  currentStage: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stage" | string>("stage");

  const stageCode = STAGE_MERMAID_MAP[currentStage] || "";
  const stageLabel = STAGE_LABELS[currentStage] || currentStage;
  const calcIds = STAGE_CALC_IDS[currentStage] || [];

  // Build tabs: stage + each calc
  const tabs: { id: string; label: string; code: string }[] = [
    { id: "stage", label: `${stageLabel} Flowchart`, code: stageCode },
    ...calcIds
      .filter((id) => CALC_MERMAID_CODES[id])
      .map((id) => ({
        id,
        label: CALC_MERMAID_CODES[id].title,
        code: CALC_MERMAID_CODES[id].code,
      })),
  ];

  const activeCode = tabs.find((t) => t.id === activeTab)?.code || stageCode;
  const activeLabel = tabs.find((t) => t.id === activeTab)?.label || stageLabel;

  const handleCopy = useCallback(
    (code: string, id: string) => {
      copyToClipboard(code).then(() => {
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
      });
    },
    []
  );

  const handleCopyAll = useCallback(() => {
    const allCode = tabs
      .map((t) => `%% ════════════════════════════════════\n%% ${t.label.toUpperCase()}\n%% ════════════════════════════════════\n\n${t.code}`)
      .join("\n\n\n");
    copyToClipboard(allCode).then(() => {
      setCopied("all");
      setTimeout(() => setCopied(null), 2000);
    });
  }, [tabs]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[95vw] max-w-[1100px] max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-[14px] text-[#0f172a]">
                Mermaid.js Code — {stageLabel}
              </h2>
              <p className="text-[11px] text-[#94a3b8]">
                Stage flowchart + {calcIds.length} calculation flowcharts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors"
              style={{
                background: copied === "all" ? "#d1fae5" : "#eff6ff",
                borderColor: copied === "all" ? "#10b981" : "#bfdbfe",
                color: copied === "all" ? "#065f46" : "#2563eb",
                fontWeight: 600,
              }}
            >
              {copied === "all" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied === "all" ? "Copied All!" : "Copy All Codes"}
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
            <strong>How to use:</strong> ① Select a chart below → ② Copy code →
            ③ Open FigJam → ④ Install "Mermaid to FigJam" plugin → ⑤ Paste &
            Generate. Or preview at{" "}
            <a
              href="https://mermaid.live"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mermaid.live
            </a>
          </p>
        </div>

        {/* Body: Sidebar tabs + Code */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar tabs */}
          <div
            className="w-[240px] shrink-0 border-r border-[#e2e8f0] bg-[#f8fafc] overflow-y-auto"
            style={{ maxHeight: "65vh" }}
          >
            <div className="p-2">
              <p className="px-2 py-1.5 text-[10px] text-[#94a3b8] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                Stage Flowchart
              </p>
              <button
                onClick={() => setActiveTab("stage")}
                className="w-full text-left px-3 py-2 rounded-lg text-[12px] flex items-center gap-2 transition-colors mb-1"
                style={{
                  backgroundColor: activeTab === "stage" ? "#dbeafe" : "transparent",
                  color: activeTab === "stage" ? "#1e40af" : "#475569",
                  fontWeight: activeTab === "stage" ? 600 : 400,
                }}
              >
                <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stageLabel}</span>
              </button>

              {calcIds.length > 0 && (
                <>
                  <p className="px-2 py-1.5 mt-2 text-[10px] text-[#94a3b8] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    Calculations ({calcIds.filter((id) => CALC_MERMAID_CODES[id]).length})
                  </p>
                  {calcIds
                    .filter((id) => CALC_MERMAID_CODES[id])
                    .map((id) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className="w-full text-left px-3 py-2 rounded-lg text-[12px] flex items-center gap-2 transition-colors mb-0.5"
                        style={{
                          backgroundColor: activeTab === id ? "#dbeafe" : "transparent",
                          color: activeTab === id ? "#1e40af" : "#475569",
                          fontWeight: activeTab === id ? 600 : 400,
                        }}
                      >
                        <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {CALC_MERMAID_CODES[id].title}
                        </span>
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>

          {/* Right: code block */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-[#334155]">
              <span className="text-[12px] text-[#94a3b8]">{activeLabel}</span>
              <button
                onClick={() => handleCopy(activeCode, activeTab)}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] transition-colors"
                style={{
                  background: copied === activeTab ? "#059669" : "#334155",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {copied === activeTab ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied === activeTab ? "Copied!" : "Copy"}
              </button>
            </div>
            {/* Code */}
            <div className="flex-1 overflow-auto p-4 bg-[#1e293b]">
              <pre
                className="text-[12px] text-[#e2e8f0] whitespace-pre"
                style={{ fontFamily: "monospace", lineHeight: 1.6 }}
              >
                {activeCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
          <p className="text-[10px] text-[#94a3b8]">
            {tabs.length} flowcharts · {stageLabel} · Color-coded Mermaid syntax
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
export function ExportButtons({ currentStage = "concept" }: ExportButtonsProps) {
  const [showMermaid, setShowMermaid] = useState(false);

  return (
    <>
      <button
        onClick={() => downloadAllSvgsAsPng(currentStage)}
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

      {showMermaid && (
        <MermaidModal
          onClose={() => setShowMermaid(false)}
          currentStage={currentStage}
        />
      )}
    </>
  );
}