import React, { useState, useCallback } from "react";
import {
  X,
  Copy,
  Check,
  Link2,
  Share2,
  GitBranch,
  LayoutGrid,
  Droplets,
  Zap,
  Flame,
  ChevronRight,
  Eye,
  Download,
  FileImage,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// =====================================================================
// SHAREABLE ITEMS
// =====================================================================
interface ShareItem {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  basePath: string; // e.g. "concept", "services", "calc/P3A"
}

const SHARE_ITEMS: ShareItem[] = [
  {
    id: "concept",
    label: "Concept Stage Flowchart",
    sub: "Complete workflow diagram with all 10 parts",
    icon: <GitBranch className="w-5 h-5" />,
    color: "#3b82f6",
    basePath: "concept",
  },
  {
    id: "services",
    label: "Services Dashboard",
    sub: "All service cards with expandable calculation flows",
    icon: <LayoutGrid className="w-5 h-5" />,
    color: "#8b5cf6",
    basePath: "services",
  },
  {
    id: "P3A",
    label: "Water Demand Calculation",
    sub: "Plumbing \u00b7 5-phase detailed SVG flow",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    basePath: "calc/P3A",
  },
  {
    id: "P3B",
    label: "Electrical Load Calculation",
    sub: "Electrical \u00b7 5-phase detailed SVG flow",
    icon: <Zap className="w-5 h-5" />,
    color: "#f59e0b",
    basePath: "calc/P3B",
  },
  {
    id: "OWC",
    label: "OWC Calculations",
    sub: "Plumbing \u00b7 Organic Waste Converter",
    icon: <Droplets className="w-5 h-5" />,
    color: "#10b981",
    basePath: "calc/OWC",
  },
  {
    id: "STP",
    label: "STP Calculations",
    sub: "Plumbing \u00b7 Sewage Treatment Plant",
    icon: <Droplets className="w-5 h-5" />,
    color: "#06b6d4",
    basePath: "calc/STP",
  },
  {
    id: "FFP",
    label: "Fire Pump Head Calculation",
    sub: "Firefighting \u00b7 Pump head & flow analysis",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    basePath: "calc/FFP",
  },
  {
    id: "FTK",
    label: "Fire Tank Size Estimation",
    sub: "Firefighting \u00b7 Tank capacity sizing",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    basePath: "calc/FTK",
  },
  {
    id: "FJD",
    label: "Jockey & Drencher Pump",
    sub: "Firefighting \u00b7 Jockey + drencher calcs",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    basePath: "calc/FJD",
  },
  {
    id: "FTB",
    label: "Terrace Fire Booster Pump",
    sub: "Firefighting \u00b7 Terrace booster head",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    basePath: "calc/FTB",
  },
  {
    id: "RWH",
    label: "Rainwater Harvesting & Tank Sizing",
    sub: "Plumbing \u00b7 RWH calculator",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    basePath: "calc/RWH",
  },
  {
    id: "SWD",
    label: "Storm Water Drainage Calculator",
    sub: "Plumbing \u00b7 SWD hydraulic calc",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    basePath: "calc/SWD",
  },
];

// =====================================================================
// SHARE MODAL — Two link types
// =====================================================================
export function ShareModal({ onClose }: { onClose: () => void }) {
  // copiedId stores "view:id" or "data:id" to differentiate
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const getShareUrl = useCallback((mode: "view" | "data", basePath: string) => {
    return `${window.location.origin}/share/${mode}/${basePath}`;
  }, []);

  const handleCopy = useCallback(
    (item: ShareItem, mode: "view" | "data") => {
      const url = getShareUrl(mode, item.basePath);
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(`${mode}:${item.id}`);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [getShareUrl]
  );

  const handleOpen = useCallback(
    (item: ShareItem, mode: "view" | "data") => {
      window.open(getShareUrl(mode, item.basePath), "_blank");
    },
    [getShareUrl]
  );

  const filtered = SHARE_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.sub.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: 640, maxHeight: "85vh" }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-[#0f172a] text-[16px]" style={{ fontWeight: 700 }}>
                  Share with Team
                </h2>
                <p className="text-[#94a3b8] text-[12px]">
                  Two separate link types &mdash; choose what your team can access
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

          {/* Two Link Type Info Cards */}
          <div className="mx-6 mt-4 mb-2 grid grid-cols-2 gap-3">
            {/* Link Type 1 */}
            <div
              className="px-3.5 py-3 rounded-xl"
              style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                  <FileImage className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[13px] text-[#1e40af]" style={{ fontWeight: 700 }}>
                  View + PNG
                </span>
              </div>
              <p className="text-[11px] text-[#3b82f6] leading-relaxed">
                Team can <strong>view</strong> the flowchart and <strong>download it as PNG</strong> image.
                No clickable data nodes.
              </p>
            </div>
            {/* Link Type 2 */}
            <div
              className="px-3.5 py-3 rounded-xl"
              style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d" }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center">
                  <Database className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[13px] text-[#92400e]" style={{ fontWeight: 700 }}>
                  View + Data
                </span>
              </div>
              <p className="text-[11px] text-[#b45309] leading-relaxed">
                Team can <strong>view</strong> the flowchart and <strong>click nodes</strong> to download
                fed policy data &amp; documents.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-3">
            <input
              type="text"
              placeholder="Search charts & calculations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors"
            />
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-auto px-6 pb-4" style={{ maxHeight: "50vh" }}>
            <div className="space-y-2">
              {filtered.map((item) => {
                const isViewCopied = copiedId === `view:${item.id}`;
                const isDataCopied = copiedId === `data:${item.id}`;
                return (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0] hover:border-[#93c5fd] hover:bg-[#f8fafc] transition-all"
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      {item.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#1e293b] truncate" style={{ fontWeight: 600 }}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{item.sub}</div>
                    </div>

                    {/* Actions — Two separate link buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* View + PNG Link */}
                      <button
                        onClick={() => handleCopy(item, "view")}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] border transition-all"
                        style={{
                          fontWeight: 600,
                          backgroundColor: isViewCopied ? "#dcfce7" : "#eff6ff",
                          borderColor: isViewCopied ? "#86efac" : "#bfdbfe",
                          color: isViewCopied ? "#16a34a" : "#2563eb",
                        }}
                        title="Copy View + PNG link"
                      >
                        {isViewCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <FileImage className="w-3 h-3" />
                            PNG
                          </>
                        )}
                      </button>

                      {/* View + Data Link */}
                      <button
                        onClick={() => handleCopy(item, "data")}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] border transition-all"
                        style={{
                          fontWeight: 600,
                          backgroundColor: isDataCopied ? "#dcfce7" : "#fef3c7",
                          borderColor: isDataCopied ? "#86efac" : "#fcd34d",
                          color: isDataCopied ? "#16a34a" : "#92400e",
                        }}
                        title="Copy View + Data Download link"
                      >
                        {isDataCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Database className="w-3 h-3" />
                            Data
                          </>
                        )}
                      </button>

                      {/* Open preview (view mode) */}
                      <button
                        onClick={() => handleOpen(item, "view")}
                        className="flex items-center gap-1 px-1.5 py-1.5 rounded-lg text-[11px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                        style={{ fontWeight: 500 }}
                        title="Open in new tab (view)"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-[#94a3b8] text-[13px]">
                  No matching charts or calculations found.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
            <p className="text-[11px] text-[#94a3b8]">
              {SHARE_ITEMS.length} items &middot; 2 link types per item
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
