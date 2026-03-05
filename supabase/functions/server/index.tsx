import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6fb5a00e/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== FEEDBACK ENDPOINTS ==========

// GET /feedback — list recent feedback
app.get("/make-server-6fb5a00e/feedback", async (c) => {
  try {
    const raw = await kv.getByPrefix("feedback:");
    const items = raw
      .map((r: any) => {
        try { return typeof r.value === "string" ? JSON.parse(r.value) : r.value; } catch { return null; }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
    return c.json({ items });
  } catch (err) {
    console.log("Error fetching feedback:", err);
    return c.json({ items: [] });
  }
});

// POST /feedback — submit new feedback
app.post("/make-server-6fb5a00e/feedback", async (c) => {
  try {
    const body = await c.req.json();
    const { type, stage, name, message, rating } = body;
    if (!message || !message.trim()) {
      return c.json({ error: "Message is required" }, 400);
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry = {
      id,
      type: type || "general",
      stage: stage || "General / Overall",
      name: name || "Anonymous",
      message: message.trim(),
      rating: rating || 0,
      ts: Date.now(),
    };
    await kv.set(`feedback:${id}`, JSON.stringify(entry));
    return c.json({ success: true, id });
  } catch (err) {
    console.log("Error saving feedback:", err);
    return c.json({ error: `Failed to save feedback: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);