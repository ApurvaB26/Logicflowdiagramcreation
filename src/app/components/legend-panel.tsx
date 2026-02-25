import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Cpu,
  Calculator,
  Brain,
  Package,
  UserCheck,
  ShoppingCart,
  HardHat,
  Handshake,
  Diamond,
  Square,
} from "lucide-react";

interface StepInfo {
  id: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  painPoints: string[];
  inputs: string[];
  outputs: string[];
  stakeholders: string[];
}

const STEPS: StepInfo[] = [
  {
    id: 1,
    title: "Project Initiation",
    icon: <FolderOpen className="w-4 h-4" />,
    color: "#1e3a5f",
    borderColor: "#4a90d9",
    painPoints: ["Data Silos — IFC/Revit files trapped in local drives"],
    inputs: ["Architectural IFC/Revit Files", "Local Building Codes"],
    outputs: ["Validated Project Model", "Code Compliance Map"],
    stakeholders: ["MEP Department", "Architect"],
  },
  {
    id: 2,
    title: "Automated Space Planning",
    icon: <Cpu className="w-4 h-4" />,
    color: "#1b4332",
    borderColor: "#52b788",
    painPoints: ["Manual Errors — Human mistakes in zone allocation"],
    inputs: ["Validated Model", "Space Requirements"],
    outputs: ["Zone Allocation Map", "Plant Room & Shaft Layouts"],
    stakeholders: ["MEP Department"],
  },
  {
    id: 3,
    title: "Calculation Engine",
    icon: <Calculator className="w-4 h-4" />,
    color: "#4a1942",
    borderColor: "#c77dff",
    painPoints: ["Manual Errors — Incorrect sizing from manual calculations"],
    inputs: ["Heat Load Data", "Lux Levels", "Flow Rates"],
    outputs: ["Duct & Pipe Sizing", "Equipment Capacities"],
    stakeholders: ["MEP Engineers"],
  },
  {
    id: 4,
    title: "Generative Design",
    icon: <Brain className="w-4 h-4" />,
    color: "#5c2d0e",
    borderColor: "#f4a261",
    painPoints: ["Data Silos — Clash info not reaching site teams"],
    inputs: ["Calculation Results", "3D Model"],
    outputs: ["Routed MEP Services", "Clash-Free Model"],
    stakeholders: ["MEP Engineers", "AI Engine"],
  },
  {
    id: 5,
    title: "BOQ & Equipment Selection",
    icon: <Package className="w-4 h-4" />,
    color: "#0d3b66",
    borderColor: "#61dafb",
    painPoints: ["Manual Errors — Wrong equipment specs & outdated pricing"],
    inputs: ["3D Model", "Live Vendor Database"],
    outputs: ["Priced BOQ", "Equipment Schedule"],
    stakeholders: ["MEP Department", "Vendors"],
  },
  {
    id: 6,
    title: "Consultant Review Portal",
    icon: <UserCheck className="w-4 h-4" />,
    color: "#6b2737",
    borderColor: "#e76f51",
    painPoints: ["Approval Bottlenecks — Slow consultant review cycles"],
    inputs: ["Complete Design Package", "Compliance Rules"],
    outputs: ["Digital Stamp Approval", "Compliance Report"],
    stakeholders: ["Consultants", "MEP Department"],
  },
  {
    id: 7,
    title: "Vendor Procurement",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#1a3c34",
    borderColor: "#2ec4b6",
    painPoints: ["Data Silos — BOQ changes not reaching vendors in time"],
    inputs: ["Approved BOQ", "Vendor Contacts"],
    outputs: ["RFQ Documents", "Lead-Time Schedule"],
    stakeholders: ["Vendors", "Procurement Team"],
  },
  {
    id: 8,
    title: "Site Execution & Queries",
    icon: <HardHat className="w-4 h-4" />,
    color: "#3d2c5e",
    borderColor: "#a78bfa",
    painPoints: ["Data Silos — Site RFIs lost or delayed"],
    inputs: ["Site RFI", "AR Overlay Data"],
    outputs: ["As-Built Updates", "Designer Feedback"],
    stakeholders: ["Site Engineers", "MEP Department"],
  },
];

const HANDSHAKES = [
  { from: "Office", to: "Design Team", color: "#4a90d9" },
  { from: "Design", to: "Engineering", color: "#c77dff" },
  { from: "Engineering", to: "Consultant", color: "#e76f51" },
  { from: "Consultant", to: "Procurement", color: "#2ec4b6" },
  { from: "Procurement", to: "Site", color: "#a78bfa" },
  { from: "Site", to: "Designer (Feedback)", color: "#f4a261" },
];

function StepCard({ step }: { step: StepInfo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg border overflow-hidden transition-all duration-200"
      style={{
        borderColor: step.borderColor,
        background: `${step.color}33`,
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-3 text-left hover:opacity-90 transition-opacity"
      >
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: step.color, color: "#fff" }}
        >
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[13px] text-white/60">Step {step.id}</span>
          <p className="text-[13px] text-white truncate">{step.title}</p>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <div className="rounded-md p-2" style={{ background: "#ef444422" }}>
            <p className="text-[11px] text-red-300/80 mb-1">Pain Point Solved</p>
            {step.painPoints.map((p, i) => (
              <p key={i} className="text-[12px] text-red-200">
                {p}
              </p>
            ))}
          </div>
          <div>
            <p className="text-[11px] text-white/50 mb-1">Inputs</p>
            <div className="flex flex-wrap gap-1">
              {step.inputs.map((inp, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: `${step.borderColor}22`,
                    color: step.borderColor,
                    border: `1px solid ${step.borderColor}44`,
                  }}
                >
                  {inp}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-white/50 mb-1">Outputs</p>
            <div className="flex flex-wrap gap-1">
              {step.outputs.map((out, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10"
                >
                  {out}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-white/50 mb-1">Stakeholders</p>
            <div className="flex flex-wrap gap-1">
              {step.stakeholders.map((s, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LegendPanel() {
  return (
    <div
      className="w-[340px] shrink-0 h-full flex flex-col border-r overflow-hidden"
      style={{
        background: "#0c1527",
        borderColor: "#1e293b",
      }}
    >
      {/* Empty panel - content removed */}
    </div>
  );
}