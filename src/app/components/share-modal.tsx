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
  path: string;
}

const SHARE_ITEMS: ShareItem[] = [
  {
    id: "concept",
    label: "Concept Stage Flowchart",
    sub: "Complete workflow diagram with all 10 parts",
    icon: <GitBranch className="w-5 h-5" />,
    color: "#3b82f6",
    path: "/share/concept",
  },
  {
    id: "services",
    label: "Services Dashboard",
    sub: "All service cards with expandable calculation flows",
    icon: <LayoutGrid className="w-5 h-5" />,
    color: "#8b5cf6",
    path: "/share/services",
  },
  // Individual calculations
  {
    id: "P3A",
    label: "Water Demand Calculation",
    sub: "Plumbing \u00b7 5-phase detailed SVG flow",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    path: "/share/calc/P3A",
  },
  {
    id: "P3B",
    label: "Electrical Load Calculation",
    sub: "Electrical \u00b7 5-phase detailed SVG flow",
    icon: <Zap className="w-5 h-5" />,
    color: "#f59e0b",
    path: "/share/calc/P3B",
  },
  {
    id: "OWC",
    label: "OWC Calculations",
    sub: "Plumbing \u00b7 Organic Waste Converter",
    icon: <Droplets className="w-5 h-5" />,
    color: "#10b981",
    path: "/share/calc/OWC",
  },
  {
    id: "STP",
    label: "STP Calculations",
    sub: "Plumbing \u00b7 Sewage Treatment Plant",
    icon: <Droplets className="w-5 h-5" />,
    color: "#06b6d4",
    path: "/share/calc/STP",
  },
  {
    id: "FFP",
    label: "Fire Pump Head Calculation",
    sub: "Firefighting \u00b7 Pump head & flow analysis",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    path: "/share/calc/FFP",
  },
  {
    id: "FTK",
    label: "Fire Tank Size Estimation",
    sub: "Firefighting \u00b7 Tank capacity sizing",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    path: "/share/calc/FTK",
  },
  {
    id: "FJD",
    label: "Jockey & Drencher Pump",
    sub: "Firefighting \u00b7 Jockey + drencher calcs",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    path: "/share/calc/FJD",
  },
  {
    id: "FTB",
    label: "Terrace Fire Booster Pump",
    sub: "Firefighting \u00b7 Terrace booster head",
    icon: <Flame className="w-5 h-5" />,
    color: "#dc2626",
    path: "/share/calc/FTB",
  },
  {
    id: "RWH",
    label: "Rainwater Harvesting & Tank Sizing",
    sub: "Plumbing \u00b7 RWH calculator",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    path: "/share/calc/RWH",
  },
  {
    id: "SWD",
    label: "Storm Water Drainage Calculator",
    sub: "Plumbing \u00b7 SWD hydraulic calc",
    icon: <Droplets className="w-5 h-5" />,
    color: "#3b82f6",
    path: "/share/calc/SWD",
  },
];

// =====================================================================
// SHARE MODAL
// =====================================================================
export function ShareModal({ onClose }: { onClose: () => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const getShareUrl = useCallback((path: string) => {
    return `${window.location.origin}${path}`;
  }, []);

  const handleCopy = useCallback(
    (item: ShareItem) => {
      const url = getShareUrl(item.path);
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [getShareUrl]
  );

  const handleOpen = useCallback(
    (item: ShareItem) => {
      window.open(getShareUrl(item.path), "_blank");
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
          style={{ width: 560, maxHeight: "85vh" }}
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
                  Generate read-only links with download access
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

          {/* Info banner */}
          <div className="mx-6 mt-4 mb-2 px-4 py-3 rounded-lg" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <p className="text-[12px] text-[#1e40af]" style={{ fontWeight: 500 }}>
              <Link2 className="w-3.5 h-3.5 inline mr-1.5" style={{ verticalAlign: "-2px" }} />
              Team members can <strong>view</strong> and <strong>download as PNG</strong> using these links.
              No login required.
            </p>
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
                const isCopied = copiedId === item.id;
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

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopy(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] border transition-all"
                        style={{
                          fontWeight: 600,
                          backgroundColor: isCopied ? "#dcfce7" : "#fff",
                          borderColor: isCopied ? "#86efac" : "#e2e8f0",
                          color: isCopied ? "#16a34a" : "#475569",
                        }}
                        title="Copy shareable link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleOpen(item)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                        style={{ fontWeight: 500 }}
                        title="Open in new tab"
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
              {SHARE_ITEMS.length} items available to share
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