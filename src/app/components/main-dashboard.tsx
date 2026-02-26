import { useState } from "react";
import { ServicesDashboard } from "./services-dashboard";
import { ConceptStageChart } from "./concept-stage";
import { ExportButtons } from "./export-buttons";
import { ShareModal } from "./share-modal";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Workflow,
  LayoutGrid,
  GitBranch,
  Share2,
} from "lucide-react";

type View = "services" | "concept";

export function MainDashboard() {
  const [view, setView] = useState<View>("services");
  const [zoom, setZoom] = useState(0.48);
  const [showShare, setShowShare] = useState(false);

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
              MEP Digital Ecosystem &mdash; Concept Stage
            </h1>
            <p className="text-[#94a3b8] text-[11px]">
              Service-wise Calculations &middot; Click any calculation to view detailed flowchart
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] rounded-lg p-1 border border-[#e2e8f0]">
          <button
            onClick={() => setView("services")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] transition-all"
            style={{
              backgroundColor: view === "services" ? "#fff" : "transparent",
              color: view === "services" ? "#1e293b" : "#94a3b8",
              boxShadow: view === "services" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              fontWeight: view === "services" ? 600 : 400,
            }}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Services
          </button>
          <button
            onClick={() => setView("concept")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] transition-all"
            style={{
              backgroundColor: view === "concept" ? "#fff" : "transparent",
              color: view === "concept" ? "#1e293b" : "#94a3b8",
              boxShadow: view === "concept" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              fontWeight: view === "concept" ? 600 : 400,
            }}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Concept Flow
          </button>
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

          {view === "concept" && (
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
                MEP Digital Ecosystem &middot; Concept Stage Calculations &middot;{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div
                className="h-1 w-full"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #f97316, #a78bfa)",
                }}
              />
              <div className="p-4" style={{ zoom }}>
                <ConceptStageChart />
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-[11px] text-[#cbd5e1]">
                MEP Digital Ecosystem &middot; Concept Stage Complete Workflow &middot;{" "}
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
