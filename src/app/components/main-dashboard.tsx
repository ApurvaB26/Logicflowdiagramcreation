import { useState } from "react";
import { ServicesDashboard } from "./services-dashboard";
import { ConceptStageChart } from "./concept-stage";
import { DetailedDesignStageChart } from "./detailed-design-stage";
import { TenderStageChart } from "./tender-stage";
import { VFCStageChart } from "./vfc-stage";
import { ExportButtons } from "./export-buttons";
import { ShareModal } from "./share-modal";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Workflow,
  LayoutGrid,
  GitBranch,
  PenTool,
  ShoppingCart,
  HardHat,
  Share2,
} from "lucide-react";

type View = "services" | "concept" | "detailed" | "tender" | "vfc";

const VIEW_TABS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "services", label: "Services", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: "concept", label: "Concept", icon: <GitBranch className="w-3.5 h-3.5" /> },
  { id: "detailed", label: "Detailed", icon: <PenTool className="w-3.5 h-3.5" /> },
  { id: "tender", label: "Tender", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  { id: "vfc", label: "VFC", icon: <HardHat className="w-3.5 h-3.5" /> },
];

const STAGE_GRADIENTS: Record<string, string> = {
  concept:  "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #f97316, #a78bfa)",
  detailed: "linear-gradient(90deg, #f97316, #f59e0b, #8b5cf6, #06b6d4, #10b981)",
  tender:   "linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6, #f59e0b, #f97316)",
  vfc:      "linear-gradient(90deg, #a78bfa, #8b5cf6, #06b6d4, #10b981, #059669)",
};

const STAGE_LABELS: Record<string, string> = {
  services: "Concept Stage Calculations",
  concept:  "Concept Stage Complete Workflow",
  detailed: "Detailed Design Stage Complete Workflow",
  tender:   "Tender Stage Complete Workflow",
  vfc:      "VFC Stage Complete Workflow",
};

export function MainDashboard() {
  const [view, setView] = useState<View>("services");
  const [zoom, setZoom] = useState(0.48);
  const [showShare, setShowShare] = useState(false);

  const isFlowView = view !== "services";

  return (
    <div className="size-full flex flex-col bg-[#f8fafc]">
      {/* ========== HEADER ========== */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-white shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[#0f172a] text-[15px] leading-tight">
              MEP Digital Ecosystem
            </h1>
            <p className="text-[#94a3b8] text-[11px]">
              Service-wise Calculations &middot; Click any calculation to view detailed flowchart
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-0.5 bg-[#f1f5f9] rounded-lg p-1 border border-[#e2e8f0]">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-all"
              style={{
                backgroundColor: view === tab.id ? "#fff" : "transparent",
                color: view === tab.id ? "#1e293b" : "#94a3b8",
                boxShadow: view === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                fontWeight: view === tab.id ? 600 : 400,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          {/* Share Button */}
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700 transition-all shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {isFlowView && (
            <>
              <div className="w-px h-5 bg-[#e2e8f0] mx-1" />
              <ExportButtons />
              <div className="w-px h-5 bg-[#e2e8f0] mx-1" />
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.06, 1.2))}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.06, 0.12))}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(0.48)}
                className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-[#94a3b8] bg-[#f1f5f9] rounded-md px-2 py-1 border border-[#e2e8f0] ml-0.5">
                {Math.round(zoom * 100)}%
              </span>
            </>
          )}
        </div>
      </header>

      {/* ========== CONTENT ========== */}
      <div className="flex-1 overflow-auto bg-[#f1f5f9]">
        {view === "services" ? (
          <div className="p-6">
            <ServicesDashboard />
            <div className="mt-6 text-center">
              <p className="text-[11px] text-[#cbd5e1]">
                MEP Digital Ecosystem &middot; {STAGE_LABELS[view]} &middot;{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div
                className="h-1 w-full"
                style={{ background: STAGE_GRADIENTS[view] }}
              />
              <div className="flex justify-center">
                <div className="p-4 w-full" style={{ zoom }}>
                  {view === "concept" && <ConceptStageChart />}
                  {view === "detailed" && <DetailedDesignStageChart />}
                  {view === "tender" && <TenderStageChart />}
                  {view === "vfc" && <VFCStageChart />}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-[11px] text-[#cbd5e1]">
                MEP Digital Ecosystem &middot; {STAGE_LABELS[view]} &middot;{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  );
}