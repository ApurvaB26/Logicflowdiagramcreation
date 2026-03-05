import React, { useState, useCallback } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  GitBranch,
  LayoutGrid,
  PenTool,
  ShoppingCart,
  ClipboardCheck,
  Download,
  FileImage,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  STAGE_MERMAID_MAP,
  CALC_MERMAID_CODES,
  STAGE_CALC_IDS,
  STAGE_LABELS,
} from "./mermaid-codes";
import { copyToClipboard } from "./clipboard-utils";

// =====================================================================
// STAGE ITEMS
// =====================================================================
interface StageItem {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  calcCount: number;
}

const STAGE_ITEMS: StageItem[] = [
  {
    id: "concept",
    label: "Concept Stage",
    sub: "Complete workflow + 10 calculation flowcharts + Mermaid codes",
    icon: <GitBranch className="w-5 h-5" />,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    calcCount: STAGE_CALC_IDS.concept?.length || 0,
  },
  {
    id: "detailed",
    label: "Detailed Design Stage",
    sub: "Complete workflow + Mermaid code",
    icon: <PenTool className="w-5 h-5" />,
    color: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #f59e0b)",
    calcCount: STAGE_CALC_IDS.detailed?.length || 0,
  },
  {
    id: "tender",
    label: "Tender Stage",
    sub: "Complete workflow + Mermaid code",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
    calcCount: STAGE_CALC_IDS.tender?.length || 0,
  },
  {
    id: "vfc",
    label: "VFC Stage",
    sub: "Validated for Construction + Mermaid code",
    icon: <ClipboardCheck className="w-5 h-5" />,
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
    calcCount: STAGE_CALC_IDS.vfc?.length || 0,
  },
  {
    id: "services",
    label: "Services Dashboard",
    sub: "All service cards with expandable calculation flows",
    icon: <LayoutGrid className="w-5 h-5" />,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    calcCount: 0,
  },
];

// =====================================================================
// HELPERS
// =====================================================================
function getShareUrl(mode: "view" | "data", basePath: string) {
  return `${window.location.origin}/share/${mode}/${basePath}`;
}

function buildMermaidBundle(stageId: string): string {
  const parts: string[] = [];

  // Stage mermaid
  const stageCode = STAGE_MERMAID_MAP[stageId];
  if (stageCode) {
    parts.push(
      `%% ════════════════════════════════════════════════════\n%% ${(STAGE_LABELS[stageId] || stageId).toUpperCase()} — MAIN FLOWCHART\n%% ════════════════════════════════════════════════════\n\n${stageCode}`
    );
  }

  // Calc mermaid codes
  const calcIds = STAGE_CALC_IDS[stageId] || [];
  for (const id of calcIds) {
    const calc = CALC_MERMAID_CODES[id];
    if (calc) {
      parts.push(
        `%% ════════════════════════════════════════════════════\n%% ${calc.title.toUpperCase()}\n%% ════════════════════════════════════════════════════\n\n${calc.code}`
      );
    }
  }

  return parts.join("\n\n\n");
}

// =====================================================================
// SHARE MODAL
// =====================================================================
export function ShareModal({ onClose }: { onClose: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const handleCopy = useCallback(
    (url: string, id: string) => {
      copyToClipboard(url).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      });
    },
    []
  );

  const handleCopyMermaidBundle = useCallback(
    (stageId: string) => {
      const bundle = buildMermaidBundle(stageId);
      copyToClipboard(bundle).then(() => {
        setCopiedId(`mermaid:${stageId}`);
        setTimeout(() => setCopiedId(null), 2000);
      });
    },
    []
  );

  const handleDownloadMermaidBundle = useCallback((stageId: string) => {
    const bundle = buildMermaidBundle(stageId);
    const blob = new Blob([bundle], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `MEP-${STAGE_LABELS[stageId]?.replace(/\s/g, "-") || stageId}-Mermaid-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: 700, maxHeight: "90vh" }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                }}
              >
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className="text-[#0f172a] text-[16px]"
                  style={{ fontWeight: 700 }}
                >
                  Share with Team
                </h2>
                <p className="text-[#94a3b8] text-[12px]">
                  Per-stage links — each includes all flowcharts, calcs &amp;
                  Mermaid codes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Link Type Legend */}
          <div className="mx-6 mt-4 mb-2 grid grid-cols-2 gap-3">
            <div
              className="px-3 py-2.5 rounded-xl"
              style={{
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <FileImage className="w-3.5 h-3.5 text-blue-600" />
                <span
                  className="text-[12px] text-[#1e40af]"
                  style={{ fontWeight: 700 }}
                >
                  View + PNG
                </span>
              </div>
              <p className="text-[10px] text-[#3b82f6] leading-relaxed">
                View &amp; download stage + all calc flowcharts as PNG
              </p>
            </div>
            <div
              className="px-3 py-2.5 rounded-xl"
              style={{
                backgroundColor: "#ede9fe",
                border: "1px solid #c4b5fd",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Code className="w-3.5 h-3.5 text-violet-600" />
                <span
                  className="text-[12px] text-[#5b21b6]"
                  style={{ fontWeight: 700 }}
                >
                  Mermaid Code
                </span>
              </div>
              <p className="text-[10px] text-[#7c3aed] leading-relaxed">
                Copy or download all Mermaid codes
              </p>
            </div>
          </div>

          {/* Stage List */}
          <div
            className="flex-1 overflow-auto px-6 py-3"
            style={{ maxHeight: "55vh" }}
          >
            <div className="space-y-3">
              {STAGE_ITEMS.map((stage) => {
                const isExpanded = expandedStage === stage.id;
                const isServices = stage.id === "services";
                const calcIds = STAGE_CALC_IDS[stage.id] || [];
                const readyCalcs = calcIds.filter(
                  (id) => CALC_MERMAID_CODES[id]
                );

                return (
                  <div
                    key={stage.id}
                    className="rounded-xl border border-[#e2e8f0] overflow-hidden transition-all"
                    style={{
                      boxShadow: isExpanded
                        ? "0 4px 12px rgba(0,0,0,0.06)"
                        : "none",
                    }}
                  >
                    {/* Stage header */}
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#f8fafc] transition-colors"
                      onClick={() =>
                        setExpandedStage(isExpanded ? null : stage.id)
                      }
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: stage.gradient,
                          color: "#fff",
                        }}
                      >
                        {stage.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-[13px] text-[#1e293b]"
                          style={{ fontWeight: 600 }}
                        >
                          {stage.label}
                        </div>
                        <div className="text-[11px] text-[#94a3b8]">
                          {stage.sub}
                        </div>
                      </div>

                      {/* Quick action badges */}
                      {!isServices && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {readyCalcs.length > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px]"
                              style={{
                                background: `${stage.color}15`,
                                color: stage.color,
                                fontWeight: 600,
                              }}
                            >
                              {readyCalcs.length} calcs
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#94a3b8]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                          )}
                        </div>
                      )}

                      {isServices && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#94a3b8]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#94a3b8]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded actions */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-[#f8fafc] border-t border-[#e2e8f0]">
                        {isServices ? (
                          /* Services — simple links */
                          <div className="flex gap-2 mt-2">
                            <CopyLinkButton
                              label="View + PNG Link"
                              url={getShareUrl("view", "services")}
                              id="view:services"
                              copiedId={copiedId}
                              onCopy={handleCopy}
                              bg="#eff6ff"
                              border="#bfdbfe"
                              color="#2563eb"
                              icon={
                                <FileImage className="w-3.5 h-3.5" />
                              }
                            />
                          </div>
                        ) : (
                          /* Stage — full bundle */
                          <>
                            {/* Single links for stage */}
                            <p
                              className="text-[10px] text-[#94a3b8] mb-2 mt-1 uppercase tracking-wider"
                              style={{ fontWeight: 700 }}
                            >
                              Share Links (Stage Flowchart)
                            </p>
                            <div className="flex gap-2 mb-3">
                              <CopyLinkButton
                                label="View + PNG"
                                url={getShareUrl("view", stage.id)}
                                id={`view:${stage.id}`}
                                copiedId={copiedId}
                                onCopy={handleCopy}
                                bg="#eff6ff"
                                border="#bfdbfe"
                                color="#2563eb"
                                icon={
                                  <FileImage className="w-3.5 h-3.5" />
                                }
                              />
                            </div>

                            {/* Mermaid bundle */}
                            <p
                              className="text-[10px] text-[#94a3b8] mb-2 uppercase tracking-wider"
                              style={{ fontWeight: 700 }}
                            >
                              Mermaid Code Bundle (Stage +{" "}
                              {readyCalcs.length} Calcs)
                            </p>
                            <div className="flex gap-2 mb-3">
                              <button
                                onClick={() =>
                                  handleCopyMermaidBundle(stage.id)
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] border transition-all"
                                style={{
                                  fontWeight: 600,
                                  backgroundColor:
                                    copiedId === `mermaid:${stage.id}`
                                      ? "#d1fae5"
                                      : "#ede9fe",
                                  borderColor:
                                    copiedId === `mermaid:${stage.id}`
                                      ? "#10b981"
                                      : "#c4b5fd",
                                  color:
                                    copiedId === `mermaid:${stage.id}`
                                      ? "#065f46"
                                      : "#5b21b6",
                                }}
                              >
                                {copiedId === `mermaid:${stage.id}` ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                {copiedId === `mermaid:${stage.id}`
                                  ? "Copied!"
                                  : "Copy All Mermaid"}
                              </button>
                              <button
                                onClick={() =>
                                  handleDownloadMermaidBundle(stage.id)
                                }
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] border transition-all"
                                style={{
                                  fontWeight: 600,
                                  backgroundColor: "#f0fdf4",
                                  borderColor: "#86efac",
                                  color: "#166534",
                                }}
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download .txt
                              </button>
                            </div>

                            {/* Individual calc links */}
                            {readyCalcs.length > 0 && (
                              <>
                                <p
                                  className="text-[10px] text-[#94a3b8] mb-2 uppercase tracking-wider"
                                  style={{ fontWeight: 700 }}
                                >
                                  Individual Calculation Links
                                </p>
                                <div className="space-y-1.5">
                                  {readyCalcs.map((calcId) => {
                                    const calc =
                                      CALC_MERMAID_CODES[calcId];
                                    if (!calc) return null;
                                    return (
                                      <div
                                        key={calcId}
                                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#e2e8f0]"
                                      >
                                        <span className="text-[11px] text-[#475569] truncate flex-1">
                                          {calc.title}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                          <CopyLinkButton
                                            label="PNG"
                                            url={getShareUrl(
                                              "view",
                                              `calc/${calcId}`
                                            )}
                                            id={`view:${calcId}`}
                                            copiedId={copiedId}
                                            onCopy={handleCopy}
                                            bg="#eff6ff"
                                            border="#bfdbfe"
                                            color="#2563eb"
                                            icon={
                                              <FileImage className="w-3 h-3" />
                                            }
                                            small
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <p className="text-[11px] text-[#94a3b8]">
              {STAGE_ITEMS.length} stages &middot; Stage-level bundled sharing
            </p>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-[12px] bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =====================================================================
// COPY LINK BUTTON
// =====================================================================
function CopyLinkButton({
  label,
  url,
  id,
  copiedId,
  onCopy,
  bg,
  border,
  color,
  icon,
  small,
}: {
  label: string;
  url: string;
  id: string;
  copiedId: string | null;
  onCopy: (url: string, id: string) => void;
  bg: string;
  border: string;
  color: string;
  icon: React.ReactNode;
  small?: boolean;
}) {
  const isCopied = copiedId === id;
  return (
    <button
      onClick={() => onCopy(url, id)}
      className="flex items-center gap-1 rounded-lg border transition-all"
      style={{
        fontWeight: 600,
        fontSize: small ? 10 : 11,
        padding: small ? "4px 8px" : "8px 12px",
        backgroundColor: isCopied ? "#dcfce7" : bg,
        borderColor: isCopied ? "#86efac" : border,
        color: isCopied ? "#16a34a" : color,
      }}
      title={`Copy ${label} link`}
    >
      {isCopied ? <Check className="w-3 h-3" /> : icon}
      {isCopied ? "Copied" : label}
    </button>
  );
}