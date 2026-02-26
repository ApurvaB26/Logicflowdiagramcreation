import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { MERMAID_DEFINITION } from "./mermaid-diagram";

export function CodePanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = MERMAID_DEFINITION;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = MERMAID_DEFINITION;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#0a0f1a" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "#1e293b" }}
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-[13px] text-white/70">Mermaid.js Source</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] transition-all"
          style={{
            background: copied ? "#059669" : "#1e293b",
            color: copied ? "#fff" : "#94a3b8",
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy Code
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-[12px] text-emerald-300/70 whitespace-pre leading-relaxed">
          {MERMAID_DEFINITION}
        </pre>
      </div>
    </div>
  );
}