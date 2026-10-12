import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public", { extensions: ["html"] }));

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please wait and try again." }
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

function cleanString(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, databaseConfigured: Boolean(supabase) });
});

app.post("/api/applications", submitLimiter, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: "Application service is not configured yet." });
    }

    const full_name = cleanString(req.body.full_name, 100);
    const email = cleanString(req.body.email, 254).toLowerCase();
    const phone = cleanString(req.body.phone, 30);
    const destination = cleanString(req.body.destination, 40);
    const job_title = cleanString(req.body.job_title, 120);
    const experience = cleanString(req.body.experience, 2000);

    const allowedDestinations = ["UAE (Dubai)", "Canada", "Qatar", "Australia"];
    if (full_name.length < 2 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        phone.length < 7 ||
        !allowedDestinations.includes(destination) ||
        job_title.length < 2 ||
        experience.length < 20) {
      return res.status(400).json({ error: "Please check your details and try again." });
    }

    const reference = "GPC-" + randomUUID().slice(0, 8).toUpperCase();
    const { error } = await supabase.from("applications").insert([{
      reference, full_name, email, phone, destination, job_title, experience,
      status: "received"
    }]);

    if (error) {
      console.error("Application database insert failed:", error.code || "database_error");
      return res.status(500).json({ error: "We could not save your application. Please try again later." });
    }

    return res.status(201).json({ ok: true, reference });
  } catch {
    return res.status(500).json({ error: "Unexpected server error. Please try again later." });
  }
});

// No payment endpoint is provided intentionally. Only add Daraja after legal,
 // licensing, business-account and fee-policy checks have been completed.
app.use((err, _req, res, _next) => {
  if (err instanceof SyntaxError) return res.status(400).json({ error: "Invalid JSON." });
  console.error("Unhandled server error.");
  return res.status(500).json({ error: "Server error." });
});

app.listen(PORT, () => console.log(`GlobalPath Careers server listening on port ${PORT}`));
