import { useState, useRef } from "react";
import { AllStagesDiagram } from "./components/mermaid-diagram";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Workflow,
} from "lucide-react";

const STAGE_META = [
  { id: 0, label: "Overview", color: "#10b981", icon: "🔍" },
  { id: 1, label: "Concept", color: "#3b82f6", icon: "📋" },
  { id: 2, label: "Schematic", color: "#8b5cf6", icon: "⚙️" },
  { id: 3, label: "Detailed Design", color: "#f97316", icon: "📦" },
  { id: 4, label: "Tender", color: "#14b8a6", icon: "🛒" },
  { id: 5, label: "VFC", color: "#a78bfa", icon: "🏗️" },
];

export default function App() {
  const [zoom, setZoom] = useState(0.48);
  const stageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToStage = (id: number) => {
    stageRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="size-full flex flex-col bg-[#f8fafc]">
      {/* ========== TOP HEADER ========== */}
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
              8-Step Workflow Architecture &middot; All Stages
            </p>
          </div>
        </div>

        {/* Stage Quick-Nav Pills */}
        <div className="hidden md:flex items-center gap-1.5">
          {STAGE_META.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToStage(s.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] transition-all hover:shadow-md border"
              style={{
                background: `${s.color}12`,
                borderColor: `${s.color}30`,
                color: s.color,
              }}
            >
              <span className="text-[13px]">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.08, 1.2))}
            className="w-8 h-8 rounded-lg border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.08, 0.15))}
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
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 overflow-auto bg-[#f1f5f9]">
        <div style={{ zoom }}>
          <AllStagesDiagram stageRefs={stageRefs} />
        </div>
      </div>
    </div>
  );
}
