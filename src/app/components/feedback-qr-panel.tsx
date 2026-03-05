import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MessageSquarePlus,
  X,
  QrCode,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { copyToClipboard } from "./clipboard-utils";

interface Props {
  currentStage?: string;
}

/* Lazy-load QRCodeSVG to avoid any import-time crash */
function SimpleQR({ value, size = 160 }: { value: string; size?: number }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { QRCodeSVG } = require("qrcode.react");
    return (
      <QRCodeSVG
        value={value}
        size={size}
        level="M"
        bgColor="#ffffff"
        fgColor="#0f172a"
      />
    );
  } catch {
    // Fallback if qrcode.react fails
    return (
      <div
        style={{
          width: size,
          height: size,
          background: "#f1f5f9",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: "#94a3b8",
          textAlign: "center",
          padding: 12,
        }}
      >
        QR code unavailable — use the link below
      </div>
    );
  }
}

export function FeedbackQRPanel({ currentStage }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const stageParam =
    currentStage && currentStage !== "services"
      ? `?stage=${encodeURIComponent(currentStage)}`
      : "";

  const feedbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/feedback${stageParam}`
      : `/feedback${stageParam}`;

  // Ensure we only portal after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleCopy() {
    copyToClipboard(feedbackUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!mounted) return null;

  const panel = (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2147483647, // max int z-index
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Popover panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 0,
            width: 288,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Gradient header */}
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <QrCode
                style={{
                  width: 16,
                  height: 16,
                  color: "rgba(255,255,255,0.85)",
                }}
              />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                Team Feedback
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: 14, height: 14, color: "#fff" }} />
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#64748b",
                textAlign: "center",
                marginBottom: 12,
                lineHeight: 1.5,
              }}
            >
              Scan this QR code to submit feedback
              <br />
              on the MEP flowcharts
            </p>

            {/* QR Code */}
            <div
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #f1f5f9",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                marginBottom: 12,
              }}
            >
              <SimpleQR value={feedbackUrl} size={160} />
            </div>

            {/* Stage indicator */}
            {currentStage && currentStage !== "services" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>
                  Pre-filled for{" "}
                  <strong style={{ color: "#475569" }}>
                    {currentStage === "detailed"
                      ? "Detailed Design"
                      : currentStage.charAt(0).toUpperCase() +
                        currentStage.slice(1)}
                  </strong>{" "}
                  stage
                </span>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {copied ? (
                  <Check
                    style={{ width: 14, height: 14, color: "#10b981" }}
                  />
                ) : (
                  <Copy style={{ width: 14, height: 14 }} />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <ExternalLink style={{ width: 14, height: 14 }} />
                Open Form
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open feedback QR panel"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.9)",
          cursor: "pointer",
          background: open
            ? "linear-gradient(135deg, #475569, #334155)"
            : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          boxShadow:
            "0 4px 24px rgba(59,130,246,0.5), 0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {open ? (
          <X style={{ width: 24, height: 24, color: "#fff" }} />
        ) : (
          <MessageSquarePlus style={{ width: 24, height: 24, color: "#fff" }} />
        )}
      </button>
    </div>
  );

  // Use portal to render directly into document.body — bypasses all parent clipping/stacking
  return createPortal(panel, document.body);
}