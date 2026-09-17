import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { createHash, randomBytes } from "crypto";
import { mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { content } from "./content";

const __dirname_r = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname_r, "public/uploads");
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = (file.originalname.split(".").pop() ?? "png").toLowerCase();
    cb(null, `${randomBytes(8).toString("hex")}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, _file, cb) => cb(null, "resume.pdf"),
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

const RESUME_PATH = join(UPLOADS_DIR, "resume.pdf");
const STATIC_RESUME = resolve(__dirname_r, "../client/assets/doc/Sid-Resume.pdf");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD env var is required");

// In-memory session store: token → expiry timestamp
const sessions = new Map<string, number>();
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function hashPassword(pw: string): string {
  return createHash("sha256").update(pw + "sc_portfolio_salt").digest("hex");
}

function createSession(): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) { sessions.delete(token); return false; }
  return true;
}

function getTokenFromRequest(req: Request): string | undefined {
  const raw = req.headers.cookie ?? "";
  const match = raw.match(/admin_token=([^;]+)/);
  return match?.[1];
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (isValidSession(getTokenFromRequest(req))) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  /* ─── Public content API ─────────────────────────────────────── */

  app.get("/api/content", (_req, res) => {
    try { res.json(content.getAll()); }
    catch (e) { res.status(500).json({ message: "Failed to load content." }); }
  });

  /* ─── Contact form ───────────────────────────────────────────── */

  // ── WhatsApp notification via CallMeBot (server-side only; keys never reach the browser)
  const CALLMEBOT_PHONE   = process.env.CALLMEBOT_PHONE;
  const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;

  type SenderMeta = Partial<Record<
    "sent_at" | "timezone" | "language" | "user_agent" | "device" | "screen" | "page_url" | "referrer",
    string
  >>;

  async function sendWhatsApp(
    name: string, senderEmail: string, subject: string, message: string,
    meta: SenderMeta, ip: string, country: string,
  ) {
    if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) return;
    const text = encodeURIComponent(
      [
        `📬 Portfolio Contact`,
        `👤 ${name}`,
        `📧 ${senderEmail}`,
        `📌 ${subject}`,
        `💬 ${message}`,
        ``,
        `🌍 ${country || "?"} · IP ${ip || "?"}`,
        `🕒 ${meta.sent_at ?? ""} (${meta.timezone ?? ""})`,
        `📱 ${meta.device ?? ""} ${meta.screen ?? ""} · ${meta.language ?? ""}`,
        `🧭 ${meta.user_agent ?? ""}`,
        `🔗 ${meta.page_url ?? ""} ← ${meta.referrer ?? ""}`,
      ].join("\n")
    );
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(CALLMEBOT_PHONE)}&text=${text}&apikey=${encodeURIComponent(CALLMEBOT_API_KEY)}`;
    await fetch(url);
  }

  app.post("/api/contact", (req: Request, res: Response) => {
    const { name, email, subject, message, meta = {} } = req.body ?? {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ?? req.ip ?? "";
    const country = (req.headers["x-country"] as string | undefined) ?? "";
    console.log("[Contact]", { name, email, subject, ip, country, ...meta });
    sendWhatsApp(name, email, subject, message, meta, ip, country)
      .catch((err) => console.error("[Contact] WhatsApp failed", err));
    res.json({ message: "Message received." });
  });

  /* ─── Admin auth ─────────────────────────────────────────────── */

  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body ?? {};
    if (!password) return res.status(400).json({ message: "Password required." });
    if (hashPassword(password) !== hashPassword(ADMIN_PASSWORD)) {
      return res.status(401).json({ message: "Invalid password." });
    }
    const token = createSession();
    res.setHeader(
      "Set-Cookie",
      `admin_token=${token}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_MS / 1000}; SameSite=Strict`
    );
    res.json({ message: "Logged in." });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    const token = getTokenFromRequest(req);
    if (token) sessions.delete(token);
    res.setHeader("Set-Cookie", "admin_token=; HttpOnly; Path=/; Max-Age=0");
    res.json({ message: "Logged out." });
  });

  app.get("/api/admin/me", (req: Request, res: Response) => {
    res.json({ isAdmin: isValidSession(getTokenFromRequest(req)) });
  });

  /* ─── Forgot password ────────────────────────────────────────── */

  let lastForgotAt = 0;
  const FORGOT_COOLDOWN_MS = 60_000;

  app.post("/api/admin/forgot-password", async (_req: Request, res: Response) => {
    const now = Date.now();
    if (now - lastForgotAt < FORGOT_COOLDOWN_MS) {
      return res.status(429).json({ message: "Please wait a minute before requesting again." });
    }

    const serviceId  = process.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey  = process.env.VITE_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.VITE_EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      return res.status(500).json({ message: "Email service not configured. Add EMAILJS_PRIVATE_KEY to .env" });
    }

    try {
      const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            from_name: "Portfolio Admin",
            from_email: "noreply@portfolio",
            subject: "Admin Password Recovery",
            message: `Your admin panel password is:\n\n${ADMIN_PASSWORD}\n\nKeep this safe.`,
            to_name: "Admin",
          },
        }),
      });

      const body = await emailRes.text();
      console.log("[ForgotPassword] EmailJS status:", emailRes.status, "body:", body);

      if (!emailRes.ok) {
        return res.status(500).json({ message: `EmailJS error: ${body}` });
      }

      lastForgotAt = now;
      res.json({ message: "Password sent to your email!" });
    } catch (e: any) {
      console.error("[ForgotPassword] fetch error:", e);
      res.status(500).json({ message: `Failed: ${e.message}` });
    }
  });

  /* ─── Image upload ──────────────────────────────────────────── */

  app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });
    res.json({ url: `/uploads/${req.file.filename}`, name: req.file.filename });
  });

  app.get("/api/admin/uploads", requireAdmin, (_req: Request, res: Response) => {
    const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg|avif)$/i;
    const ASSETS_DIR = join(__dirname_r, "../client/assets/images");

    const uploaded = existsSync(UPLOADS_DIR)
      ? readdirSync(UPLOADS_DIR)
          .filter((f) => IMAGE_EXT.test(f))
          .map((name) => ({ name, url: `/uploads/${name}`, source: "uploads" as const }))
          .reverse()
      : [];

    const assets = existsSync(ASSETS_DIR)
      ? readdirSync(ASSETS_DIR)
          .filter((f) => IMAGE_EXT.test(f))
          .map((name) => ({ name, url: `/assets-static/images/${name}`, source: "assets" as const }))
      : [];

    res.json([...uploaded, ...assets]);
  });

  /* ─── Resume upload + serve ────────────────────────────────────── */

  app.post("/api/admin/upload-resume", requireAdmin, resumeUpload.single("resume"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });
    res.json({ url: "/resume", message: "Resume uploaded." });
  });

  app.get("/resume", (_req: Request, res: Response) => {
    const path = existsSync(RESUME_PATH) ? RESUME_PATH : existsSync(STATIC_RESUME) ? STATIC_RESUME : null;
    if (!path) return res.status(404).json({ message: "No resume available." });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="resume.pdf"');
    res.sendFile(path);
  });

  /* ─── Admin content updates ──────────────────────────────────── */

  app.put("/api/admin/site", requireAdmin, (req, res) => {
    try { content.updateSite(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/experience-meta", requireAdmin, (req, res) => {
    try { content.updateExperienceMeta(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/hero", requireAdmin, (req, res) => {
    try { content.updateHero(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/about", requireAdmin, (req, res) => {
    try { content.updateAbout(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/contact", requireAdmin, (req, res) => {
    try { content.updateContact(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/skills", requireAdmin, (req, res) => {
    try { content.updateSkills(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/experience", requireAdmin, (req, res) => {
    try { content.updateExperience(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/education", requireAdmin, (req, res) => {
    try { content.updateEducation(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/awards", requireAdmin, (req, res) => {
    try { content.updateAwards(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/sections", requireAdmin, (req, res) => {
    try { content.updateSections(req.body); res.json({ message: "Updated." }); }
    catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.post("/api/admin/testimonials", requireAdmin, (req, res) => {
    try {
      const t = content.addTestimonial(req.body);
      res.status(201).json(t);
    } catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id." });
    content.updateTestimonial(id, req.body)
      ? res.json({ message: "Updated." })
      : res.status(404).json({ message: "Not found." });
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id." });
    content.deleteTestimonial(id)
      ? res.json({ message: "Deleted." })
      : res.status(404).json({ message: "Not found." });
  });

  app.post("/api/admin/projects", requireAdmin, (req, res) => {
    try {
      const project = content.addProject(req.body);
      res.status(201).json(project);
    } catch { res.status(400).json({ message: "Invalid data." }); }
  });

  app.put("/api/admin/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id." });
    content.updateProject(id, req.body)
      ? res.json({ message: "Updated." })
      : res.status(404).json({ message: "Not found." });
  });

  app.delete("/api/admin/projects/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id." });
    content.deleteProject(id)
      ? res.json({ message: "Deleted." })
      : res.status(404).json({ message: "Not found." });
  });

  return createServer(app);
}
