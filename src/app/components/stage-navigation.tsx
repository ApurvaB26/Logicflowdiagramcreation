import { Layers, CheckCircle2 } from "lucide-react";

export interface Stage {
  id: number;
  name: string;
  description: string;
  steps: number[];
  color: string;
  icon: string;
}

export const STAGES: Stage[] = [
  {
    id: 1,
    name: "Concept Stage",
    description: "Dual-track initiation & space planning",
    steps: [1],
    color: "#3b82f6",
    icon: "📋",
  },
  {
    id: 2,
    name: "Schematic Stage",
    description: "Design development",
    steps: [2],
    color: "#8b5cf6",
    icon: "⚙️",
  },
  {
    id: 3,
    name: "Detailed Design Stage",
    description: "Complete technical documentation",
    steps: [3],
    color: "#f97316",
    icon: "📦",
  },
  {
    id: 4,
    name: "Tender Stage",
    description: "Procurement & bidding process",
    steps: [4],
    color: "#14b8a6",
    icon: "🛒",
  },
  {
    id: 5,
    name: "VFC Stage",
    description: "Value for construction execution",
    steps: [5],
    color: "#a78bfa",
    icon: "🏗️",
  },
];

interface StageNavigationProps {
  selectedStage: number | null;
  onStageSelect: (stageId: number | null) => void;
}

export function StageNavigation({
  selectedStage,
  onStageSelect,
}: StageNavigationProps) {
  return (
    <div
      className="w-[280px] shrink-0 h-full flex flex-col border-r overflow-hidden"
      style={{
        background: "#0c1527",
        borderColor: "#1e293b",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: "#1e293b" }}>
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="text-white text-[15px]">Project Stages</h2>
        </div>
        <p className="text-white/40 text-[12px]">
          Click a stage to view its workflow
        </p>
      </div>

      {/* Stages List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {/* View All Option */}
          <button
            onClick={() => onStageSelect(null)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              selectedStage === null
                ? "bg-gradient-to-br from-blue-500/20 to-cyan-400/20"
                : "hover:bg-white/5"
            }`}
            style={{
              borderColor:
                selectedStage === null ? "#4a90d9" : "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStage === null ? "bg-blue-500/30" : "bg-white/5"
                }`}
              >
                <span className="text-[16px]">🔍</span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[14px] ${selectedStage === null ? "text-white" : "text-white/70"}`}
                >
                  View All Stages
                </p>
                <p className="text-[11px] text-white/40">Complete workflow</p>
              </div>
              {selectedStage === null && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              )}
            </div>
          </button>

          {/* Individual Stages */}
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => onStageSelect(stage.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedStage === stage.id
                  ? "shadow-lg"
                  : "hover:bg-white/5"
              }`}
              style={{
                borderColor:
                  selectedStage === stage.id
                    ? stage.color
                    : "rgba(255,255,255,0.1)",
                background:
                  selectedStage === stage.id
                    ? `${stage.color}22`
                    : "transparent",
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background:
                      selectedStage === stage.id
                        ? `${stage.color}44`
                        : "#ffffff11",
                  }}
                >
                  <span className="text-[16px]">{stage.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p
                      className={`text-[13px] ${selectedStage === stage.id ? "text-white" : "text-white/70"}`}
                    >
                      {stage.name}
                    </p>
                    {selectedStage === stage.id && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: stage.color }}
                      />
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 mb-2">
                    {stage.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {stage.steps.map((step) => (
                      <span
                        key={step}
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{
                          background:
                            selectedStage === stage.id
                              ? `${stage.color}33`
                              : "#ffffff11",
                          color:
                            selectedStage === stage.id
                              ? stage.color
                              : "#ffffff66",
                          border: `1px solid ${selectedStage === stage.id ? `${stage.color}55` : "transparent"}`,
                        }}
                      >
                        Step {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div
        className="p-3 border-t"
        style={{
          borderColor: "#1e293b",
          background: "#0a0f1e",
        }}
      >
        <div className="flex items-start gap-2 p-2 rounded-md bg-blue-500/10 border border-blue-500/20">
          <span className="text-[12px]">💡</span>
          <p className="text-[11px] text-blue-300/80">
            Each stage groups related workflow steps. Select a stage to focus on
            specific processes.
          </p>
        </div>
      </div>
    </div>
  );
}