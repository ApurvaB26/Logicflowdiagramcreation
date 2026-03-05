import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquarePlus,
  Send,
  CheckCircle2,
  ArrowLeft,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Star,
  Workflow,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-6fb5a00e`;

type FeedbackType = "suggestion" | "issue" | "praise" | "general";

const TYPES: { id: FeedbackType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "suggestion", label: "Suggestion", icon: <Lightbulb className="w-4 h-4" />, color: "#f59e0b" },
  { id: "issue", label: "Issue", icon: <AlertTriangle className="w-4 h-4" />, color: "#ef4444" },
  { id: "praise", label: "Praise", icon: <ThumbsUp className="w-4 h-4" />, color: "#10b981" },
  { id: "general", label: "General", icon: <MessageSquarePlus className="w-4 h-4" />, color: "#3b82f6" },
];

const STAGES = ["Services", "Concept", "Detailed Design", "Tender", "VFC", "General / Overall"];

interface FeedbackEntry {
  id: string;
  type: FeedbackType;
  stage: string;
  name: string;
  message: string;
  rating: number;
  ts: number;
}

export function FeedbackPage() {
  const [searchParams] = useSearchParams();
  const stageHint = searchParams.get("stage") || "";

  const [type, setType] = useState<FeedbackType>("suggestion");
  const [stage, setStage] = useState(stageHint || "General / Overall");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentFeedback, setRecentFeedback] = useState<FeedbackEntry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    try {
      const res = await fetch(`${API}/feedback`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecentFeedback(data.items || []);
      }
    } catch {
      /* silent */
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ type, stage, name: name.trim() || "Anonymous", message: message.trim(), rating }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setSubmitted(true);
      setMessage("");
      setName("");
      setRating(0);
      fetchRecent();
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      setError(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </a>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">MEP Flowchart Feedback</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Thank you for your feedback!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your input helps us improve the MEP Digital Ecosystem flowcharts.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-md"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Intro */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h1 className="text-lg font-bold text-slate-800 mb-1">Share Your Feedback</h1>
                <p className="text-sm text-slate-500">
                  Help improve the MEP construction flowcharts. Your suggestions, bug reports, and praise are all welcome.
                </p>
              </div>

              {/* Feedback type */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                  Feedback Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                      style={{
                        borderColor: type === t.id ? t.color : "#e2e8f0",
                        backgroundColor: type === t.id ? `${t.color}12` : "transparent",
                        color: type === t.id ? t.color : "#64748b",
                      }}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stage & Name */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Which Stage / Section?
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Your Name <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                  Overall Rating <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(s === rating ? 0 : s)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-7 h-7 transition-colors"
                        fill={(hoveredStar || rating) >= s ? "#f59e0b" : "transparent"}
                        stroke={(hoveredStar || rating) >= s ? "#f59e0b" : "#cbd5e1"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Your Feedback *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  placeholder="Describe your suggestion, issue, or feedback in detail..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Recent Feedback */}
        {recentFeedback.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Recent Team Feedback
            </h3>
            <div className="space-y-3">
              {recentFeedback.slice(0, 8).map((fb) => {
                const typeInfo = TYPES.find((t) => t.id === fb.type) || TYPES[3];
                return (
                  <div
                    key={fb.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${typeInfo.color}18`, color: typeInfo.color }}
                        >
                          {typeInfo.icon}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-700">{fb.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400">{fb.stage}</span>
                            {fb.rating > 0 && (
                              <>
                                <span className="text-[10px] text-slate-300">&middot;</span>
                                <span className="text-[10px] text-amber-500">{"★".repeat(fb.rating)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(fb.ts).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{fb.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-400">
            MEP Digital Ecosystem &middot; Feedback Portal &middot; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
