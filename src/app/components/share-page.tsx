import React, { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Eye,
  FileImage,
  ChevronDown,
} from "lucide-react";
import { ConceptStageChart } from "./concept-stage";
import { ServicesDashboard } from "./services-dashboard";
import { WaterDemandCalcSVG } from "./water-demand-calc";
import { ElectricalLoadCalcSVG } from "./electrical-load-calc";
import { OWCCalcSVG } from "./owc-calc";
import { STPCalcSVG } from "./stp-calc";
import { FirePumpHeadCalcSVG } from "./fire-pump-head-calc";
import { FireTankCalcSVG } from "./fire-tank-calc";
import { FireJockeyDrencherCalcSVG } from "./fire-jockey-drencher-calc";
import { TerraceBoosterCalcSVG } from "./terrace-booster-calc";
import { RWHCalcSVG } from "./rwh-calc";
import { SWDCalcSVG } from "./swd-calc";

// =====================================================================
// CALC METADATA
// =====================================================================
const CALC_META: Record<string, { title: string; icon: string; color: string; service: string }> = {
  P3A: { title: "Water Demand Calculation", icon: "\uD83D\uDCA7", color: "#3b82f6", service: "Plumbing" },
  P3B: { title: "Electrical Load Calculation", icon: "\u26A1", color: "#f59e0b", service: "Electrical" },
  OWC: { title: "OWC Calculations", icon: "\u267B\uFE0F", color: "#10b981", service: "Plumbing" },
  STP: { title: "STP Calculations", icon: "\uD83C\uDFED", color: "#06b6d4", service: "Plumbing" },
  FFP: { title: "Fire Pump Head Calculation", icon: "\uD83D\uDE92", color: "#dc2626", service: "Firefighting" },
  FTK: { title: "Fire Tank Size Estimation", icon: "\uD83D\uDEA8", color: "#dc2626", service: "Firefighting" },
  FJD: { title: "Jockey & Drencher Pump", icon: "\uD83D\uDD27", color: "#dc2626", service: "Firefighting" },
  FTB: { title: "Terrace Fire Booster Pump", icon: "\uD83C\uDFD7\uFE0F", color: "#dc2626", service: "Firefighting" },
  RWH: { title: "Rainwater Harvesting & Tank Sizing", icon: "\uD83C\uDF27\uFE0F", color: "#3b82f6", service: "Plumbing" },
  SWD: { title: "Storm Water Drainage Calculator", icon: "\u{1F30A}", color: "#3b82f6", service: "Plumbing" },
};

const CALC_COMPONENTS: Record<string, React.FC> = {
  P3A: WaterDemandCalcSVG,
  P3B: ElectricalLoadCalcSVG,
  OWC: OWCCalcSVG,
  STP: STPCalcSVG,
  FFP: FirePumpHeadCalcSVG,
  FTK: FireTankCalcSVG,
  FJD: FireJockeyDrencherCalcSVG,
  FTB: TerraceBoosterCalcSVG,
  RWH: RWHCalcSVG,
  SWD: SWDCalcSVG,
};

// =====================================================================
// PNG DOWNLOAD UTILITY
// =====================================================================
function downloadSvgAsPng(container: HTMLElement, filename: string) {
  const svgEl = container.querySelector("svg") as SVGSVGElement | null;
  if (!svgEl) {
    alert("SVG not found for download.");
    return;
  }
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  const vb = svgEl.viewBox?.baseVal;
  const w = vb && vb.width > 0 ? vb.width : svgEl.getBoundingClientRect().width;
  const h = vb && vb.height > 0 ? vb.height : svgEl.getBoundingClientRect().height;
  const scale = 3;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.style.width = "";
  clone.style.display = "block";
  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, "image/png");
    URL.revokeObjectURL(url);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert("Failed to render PNG.");
  };
  img.src = url;
}

// =====================================================================
// SHARE PAGE — Read-only view for team members
// =====================================================================
export function SharePage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.48);
  const [copied, setCopied] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  // Determine what we're showing
  const isConceptChart = type === "concept";
  const isServices = type === "services";
  const isCalc = type === "calc" && id;
  const calcMeta = isCalc ? CALC_META[id] : null;
  const CalcComponent = isCalc ? CALC_COMPONENTS[id] : null;

  const shareUrl = window.location.href;
  const title = isConceptChart
    ? "MEP Concept Stage — Complete Workflow"
    : isServices
    ? "MEP Services Dashboard"
    : calcMeta
    ? `${calcMeta.title} — ${calcMeta.service}`
    : "MEP Digital Ecosystem";

  const handleCopyLink = useCallback(() => {
    const ta = document.createElement("textarea");
    ta.value = shareUrl;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const handleDownloadPNG = useCallback(() => {
    if (!contentRef.current) return;
    const safeName = title.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
    downloadSvgAsPng(contentRef.current, safeName);
    setShowDownloadMenu(false);
  }, [title]);

  // Close download menu on click outside
  useEffect(() => {
    const handler = () => setShowDownloadMenu(false);
    if (showDownloadMenu) {
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, [showDownloadMenu]);

  // Invalid route
  if (!isConceptChart && !isServices && !isCalc) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
        <div className="text-6xl">🔗</div>
        <h1 className="text-[#1e293b] text-[22px]" style={{ fontWeight: 700 }}>
          Invalid Share Link
        </h1>
        <p className="text-[#64748b] text-[14px] max-w-md text-center">
          This link doesn't point to a valid MEP resource. Please check the URL or ask the sender for a new link.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] hover:bg-blue-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Main Dashboard
        </button>
      </div>
    );
  }

  // Calc not found
  if (isCalc && !CalcComponent) {
    return (
      <div className="size-full flex flex-col items-center justify-center bg-[#f8fafc] gap-4">
        <div className="text-6xl">📊</div>
        <h1 className="text-[#1e293b] text-[22px]" style={{ fontWeight: 700 }}>
          Calculation Not Found
        </h1>
        <p className="text-[#64748b] text-[14px] max-w-md text-center">
          The calculation "{id}" doesn't exist or hasn't been built yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-[13px] hover:bg-blue-700 transition-colors"
          style={{ fontWeight: 600 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Main Dashboard
        </button>
      </div>
    );
  }

  const accentColor = calcMeta?.color ?? "#3b82f6";

  return (
    <div className="size-full flex flex-col bg-[#f8fafc]">
      {/* ========== SHARED VIEW HEADER ========== */}
      <header className="shrink-0 border-b border-[#e2e8f0] bg-white shadow-sm">
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: isCalc
              ? accentColor
              : "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #f97316, #a78bfa)",
          }}
        />
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left: Info */}
          <div className="flex items-center gap-3">
            {/* Shared badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
                fontWeight: 600,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              Shared View
            </div>
            <div className="w-px h-6 bg-[#e2e8f0]" />
            <div>
              <div className="flex items-center gap-2">
                {calcMeta && <span style={{ fontSize: "18px" }}>{calcMeta.icon}</span>}
                <h1 className="text-[#0f172a] text-[15px] leading-tight">{title}</h1>
              </div>
              <p className="text-[#94a3b8] text-[11px] mt-0.5">
                MEP Digital Ecosystem &middot; Read-only view &middot; Download available
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Zoom controls for chart views */}
            {(isConceptChart || isCalc) && (
              <>
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
                <span className="text-[11px] text-[#94a3b8] bg-[#f1f5f9] rounded-md px-2 py-1 border border-[#e2e8f0]">
                  {Math.round(zoom * 100)}%
                </span>
                <div className="w-px h-5 bg-[#e2e8f0] mx-1" />
              </>
            )}

            {/* Download button */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDownloadMenu((v) => !v);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Download className="w-4 h-4" />
                Download
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>
              {showDownloadMenu && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-[#e2e8f0] overflow-hidden z-50"
                  style={{ minWidth: 200 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleDownloadPNG}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#1e293b] hover:bg-[#f1f5f9] transition-colors text-left"
                  >
                    <FileImage className="w-4 h-4 text-blue-500" />
                    <div>
                      <div style={{ fontWeight: 600 }}>Download as PNG</div>
                      <div className="text-[11px] text-[#94a3b8]">High-res 3× image</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] transition-colors"
              style={{ fontWeight: 600 }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>

            {/* Back to main */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] transition-colors"
              style={{ fontWeight: 500 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* ========== CONTENT ========== */}
      <div className="flex-1 overflow-auto" ref={contentRef}>
        {isConceptChart && (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div
                className="h-1 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #f97316, #a78bfa)",
                }}
              />
              <div className="p-4" style={{ zoom }}>
                <ConceptStageChart />
              </div>
            </div>
          </div>
        )}

        {isServices && (
          <div className="p-6">
            <ServicesDashboard />
          </div>
        )}

        {isCalc && CalcComponent && (
          <div className="p-6">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              {/* Calc header */}
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ backgroundColor: accentColor }}
              >
                <span style={{ fontSize: "28px" }}>{calcMeta!.icon}</span>
                <div>
                  <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 700 }}>
                    {calcMeta!.title}
                  </h2>
                  <p className="text-white" style={{ fontSize: "12px", opacity: 0.8 }}>
                    {calcMeta!.service} Service &middot; Detailed Algorithm Flow
                  </p>
                </div>
              </div>
              {/* Calc legend */}
              <div
                className="flex items-center gap-4 px-6 py-3 border-b flex-wrap"
                style={{ borderColor: "#e5e7eb" }}
              >
                {[
                  { label: "System Step", bg: "#dbeafe", bd: "#2563eb" },
                  { label: "User Decision", bg: "#fff7ed", bd: "#ea580c" },
                  { label: "Final Output", bg: "#d1fae5", bd: "#059669" },
                  { label: "Formula / Calc", bg: "#ede9fe", bd: "#7c3aed" },
                  { label: "DB Fetch", bg: "#cffafe", bd: "#0891b2" },
                  { label: "Warning", bg: "#ffe4e6", bd: "#e11d48" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div
                      className="rounded"
                      style={{
                        width: 14,
                        height: 14,
                        backgroundColor: item.bg,
                        border: `1.5px solid ${item.bd}`,
                      }}
                    />
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Calc SVG */}
              <div className="overflow-auto" style={{ zoom }}>
                <div style={{ minWidth: "1600px", padding: "10px 0" }}>
                  <CalcComponent />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pb-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] text-[#94a3b8]"
            style={{ backgroundColor: "#f1f5f9" }}
          >
            <Share2 className="w-3 h-3" />
            Shared via MEP Digital Ecosystem &middot; {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}