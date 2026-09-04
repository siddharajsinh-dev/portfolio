import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_FRAMING_POSITION, DEFAULT_FRAMING_ZOOM } from "@/lib/framing";
import {
  LayoutDashboard, User, Briefcase, Code2, FolderOpen,
  Mail, LogOut, Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp,
  Upload, ImageIcon, FileText, Globe, Layers, MessageSquare,
} from "lucide-react";

type ContentData = {
  site: any;
  hero: any;
  about: any;
  contact: any;
  skills: any;
  experience: any[];
  experienceMeta: any;
  education: any[];
  projects: any[];
  testimonials: any[];
  sections: Record<string, boolean>;
};

const tabs = [
  { id: "site",       label: "Site",       icon: Globe         },
  { id: "sections",   label: "Sections",   icon: Layers        },
  { id: "hero",       label: "Hero",       icon: User          },
  { id: "about",      label: "About",      icon: LayoutDashboard },
  { id: "skills",     label: "Skills",     icon: Code2         },
  { id: "experience", label: "Experience", icon: Briefcase     },
  { id: "projects",      label: "Projects",      icon: FolderOpen    },
  { id: "testimonials",  label: "Testimonials",  icon: MessageSquare },
  { id: "contact",       label: "Contact",       icon: Mail          },
];

async function apiFetch(url: string, method = "GET", body?: any) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Request failed");
  return res.json();
}

/* ── Image Upload + Library Picker ──────────────────────────────── */
const ImageUpload = ({ currentUrl, onUploaded, label = "Image" }: {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<{ name: string; url: string; source: "uploads" | "assets" }[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const { toast } = useToast();

  const loadLibrary = async () => {
    setLoadingLib(true);
    try {
      const res = await fetch("/api/admin/uploads", { credentials: "include" });
      const data = await res.json();
      setLibrary(data);
    } catch {
      setLibrary([]);
    } finally {
      setLoadingLib(false);
    }
  };

  const openLibrary = () => { setShowLibrary(true); loadLibrary(); };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error((await res.json()).message ?? "Upload failed");
      const { url } = await res.json();
      setPreview(url);
      onUploaded(url);
      toast({ title: `${label} uploaded!` });
      if (showLibrary) loadLibrary();
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const selectFromLibrary = (url: string) => { setPreview(url); onUploaded(url); setShowLibrary(false); };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-muted-foreground">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: "#000", border: "1px solid rgba(34,211,238,0.2)" }}>
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-contain" style={{ mixBlendMode: "screen" }} />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
          )}
        </div>
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-primary/50 font-mono"
          value={preview}
          onChange={(e) => { setPreview(e.target.value); onUploaded(e.target.value); }}
          placeholder="/uploads/image.png or paste URL"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium gradient-bg text-white hover:opacity-90 transition disabled:opacity-50">
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? "Uploading..." : "Upload New"}
        </button>
        <button type="button" onClick={openLibrary}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-muted-foreground hover:text-white hover:border-primary/30 transition">
          <ImageIcon className="w-3 h-3" /> Choose from Library
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {showLibrary && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            style={{ border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Image Library</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{library.length} image{library.length !== 1 ? "s" : ""} uploaded</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs gradient-bg text-white hover:opacity-90 transition disabled:opacity-50">
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  Upload New
                </button>
                <button type="button" onClick={() => setShowLibrary(false)}
                  className="w-8 h-8 rounded-full glass border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition text-lg leading-none">
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingLib ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : library.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No images found.</p>
                  <p className="text-xs mt-1">Click "Upload New" to add your first image.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {(["uploads", "assets"] as const).map((source) => {
                    const group = library.filter((f) => f.source === source);
                    if (group.length === 0) return null;
                    return (
                      <div key={source}>
                        <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${source === "uploads" ? "bg-cyan-400" : "bg-sky-400"}`} />
                          {source === "uploads" ? "Uploaded Images" : "Asset Images (client/assets/images)"}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {group.map(({ name, url }) => (
                            <button key={name} type="button" onClick={() => selectFromLibrary(url)}
                              className={`relative rounded-xl overflow-hidden aspect-square group transition-all ${
                                preview === url ? "ring-2 ring-cyan-400" : "ring-1 ring-white/10 hover:ring-cyan-400/50"
                              }`} style={{ background: "#000" }}>
                              <img src={url} alt={name} className="w-full h-full object-contain p-1" style={{ mixBlendMode: "screen" }} />
                              <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {preview === url && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                                  <span className="text-[8px] text-black font-bold">✓</span>
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[9px] font-mono text-white/60 truncate opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                                {name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Resume Upload ──────────────────────────────────────────────── */
const ResumeUpload = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    setUploading(true);
    setReplaced(false);
    try {
      const form = new FormData();
      form.append("resume", file);
      const res = await fetch("/api/admin/upload-resume", { method: "POST", credentials: "include", body: form });
      if (!res.ok) throw new Error((await res.json()).message ?? "Upload failed");
      setReplaced(true);
      toast({ title: "Resume replaced!", description: "The new PDF is now live at /resume." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-muted-foreground">Resume (PDF)</label>
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium gradient-bg text-white hover:opacity-90 transition disabled:opacity-50">
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? "Uploading..." : "Upload New Resume"}
        </button>
        <a href="/resume" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium glass border border-white/10 text-muted-foreground hover:text-white hover:border-primary/30 transition">
          <FileText className="w-3 h-3" /> View Current
        </a>
        {replaced && <span className="text-xs text-emerald-400 font-mono">✓ Replaced successfully</span>}
      </div>
      <p className="text-xs text-muted-foreground/60">PDF only · max 10 MB · replaces existing resume immediately</p>
      <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  );
};

/* ── Shared Save Button ──────────────────────────────────────────── */
const SaveBtn = ({ saving, onClick }: { saving: boolean; onClick: () => void }) => (
  <button onClick={onClick} disabled={saving}
    className="flex items-center gap-2 px-6 py-2.5 rounded-full gradient-bg text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
    {saving ? "Saving..." : "Save Changes"}
  </button>
);

/* ── Shared Text Field ───────────────────────────────────────────── */
const Field = ({ label, value, onChange, multiline = false, rows = 2, mono = false }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; rows?: number; mono?: boolean;
}) => (
  <div>
    <label className="block text-sm text-muted-foreground mb-1.5">{label}</label>
    {multiline ? (
      <textarea rows={rows}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none ${mono ? "font-mono" : ""}`}
        value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition ${mono ? "font-mono" : ""}`}
        value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

/* ── Sub-panel: Sections Visibility ─────────────────────────────── */
const SECTION_LABELS: { key: string; label: string; description: string }[] = [
  { key: "hero",         label: "Hero",         description: "Main intro section with name, bio & photo" },
  { key: "about",        label: "About",        description: "About me paragraphs, stats & what I do cards" },
  { key: "skills",       label: "Skills",       description: "Tech skills grid & core stack" },
  { key: "experience",   label: "Experience",   description: "Work history & education timeline" },
  { key: "projects",     label: "Projects",     description: "Featured project cards" },
  { key: "testimonials", label: "Testimonials", description: "Client / colleague testimonials carousel" },
  { key: "contact",      label: "Contact",      description: "Contact form & info card" },
];

const SectionsPanel = ({ data, onSave }: { data: Record<string, boolean>; onSave: (d: Record<string, boolean>) => void }) => {
  const DEFAULT_SECTIONS: Record<string, boolean> = {
    hero: true, about: true, skills: true, experience: true,
    projects: true, testimonials: false, contact: true,
  };
  const [form, setForm] = useState<Record<string, boolean>>({ ...DEFAULT_SECTIONS, ...data });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const toggle = (key: string) => setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/admin/sections", "PUT", form);
      onSave(form);
      toast({ title: "Section visibility saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground/60">Toggle sections on or off. Hidden sections are removed from the public portfolio page.</p>
      <div className="space-y-3">
        {SECTION_LABELS.map(({ key, label, description }) => {
          const enabled = form[key] !== false;
          return (
            <div key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                enabled ? "border-primary/30 bg-white/5" : "border-white/8 bg-white/2 opacity-60"
              }`}>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  enabled ? "bg-cyan-500" : "bg-white/15"
                }`}
                role="switch"
                aria-checked={enabled}>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Site ─────────────────────────────────────────────── */
const SitePanel = ({ data, onSave }: { data: any; onSave: (d: any) => void }) => {
  const [form, setForm] = useState({ ...data });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const f = (key: string) => ({
    value: form[key] ?? "",
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  });

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/admin/site", "PUT", form);
      onSave(form);
      toast({ title: "Site settings saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground/60">These settings apply globally — logo, copyright name, footer tagline, page title.</p>
      <Field label="Logo Text (e.g. SID.)" {...f("logoText")} />
      <Field label="Logo Subtext (e.g. Full-Stack Dev)" {...f("logoSubtext")} />
      <Field label="Full Name (used in copyright & alt text)" {...f("fullName")} />
      <Field label="Page Title (browser tab)" {...f("pageTitle")} />
      <Field label="Footer Tagline" {...f("tagline")} multiline rows={2} />
      <Field label="Hire Me Text (footer)" {...f("hireMeText")} multiline rows={2} />
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Hero ─────────────────────────────────────────────── */
/* ── Hero image framing (crop focus + zoom, live circular preview) ── */
const HeroImageFraming = ({ url, position, zoom, onChange }: {
  url: string; position: string; zoom: number;
  onChange: (position: string, zoom: number) => void;
}) => {
  const [x, y] = (() => {
    const parts = position.trim().split(/\s+/);
    return [parseFloat(parts[0]) || 50, parseFloat(parts[1] ?? parts[0]) || 50];
  })();
  const set = (nx: number, ny: number, nz: number) => onChange(`${nx}% ${ny}%`, nz);

  if (!url) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-muted-foreground mb-3">
        Framing — drag the sliders until your face sits nicely inside the circle
      </p>
      <div className="flex items-center gap-5 flex-wrap">
        <div style={{
          width: 120, height: 120, borderRadius: "50%", overflow: "hidden",
          background: "#07071a", flexShrink: 0,
          border: "2px solid rgba(124,58,237,0.6)",
        }}>
          <img src={url} alt="Hero framing preview"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              objectPosition: `${x}% ${y}%`,
              transform: `scale(${zoom})`, transformOrigin: `${x}% ${y}%`,
            }} />
        </div>
        <div className="flex-1 min-w-[220px] space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Horizontal — {x}%</label>
            <input type="range" min={0} max={100} step={1} value={x} className="w-full"
              onChange={(e) => set(Number(e.target.value), y, zoom)} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Vertical — {y}% (lower this if your head is cut off)</label>
            <input type="range" min={0} max={100} step={1} value={y} className="w-full"
              onChange={(e) => set(x, Number(e.target.value), zoom)} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Zoom — {zoom.toFixed(2)}x</label>
            <input type="range" min={1} max={2} step={0.05} value={zoom} className="w-full"
              onChange={(e) => set(x, y, Number(e.target.value))} />
          </div>
          <button type="button" onClick={() => set(50, 25, DEFAULT_FRAMING_ZOOM)}
            className="text-xs text-muted-foreground hover:text-foreground underline transition">
            Reset to default
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroPanel = ({ data, onSave }: { data: any; onSave: (d: any) => void }) => {
  const [form, setForm] = useState({ ...data });
  const [rolesText, setRolesText]   = useState((data.roles   ?? []).join("\n"));
  const [badgesText, setBadgesText] = useState((data.techBadges ?? []).join("\n"));
  const [pillsText, setPillsText]   = useState((data.techPills  ?? []).join("\n"));
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const f = (key: string) => ({
    value: form[key] ?? "",
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  });

  const save = async () => {
    setSaving(true);
    try {
      const toLines = (t: string) => t.split("\n").map((s: string) => s.trim()).filter(Boolean);
      const payload = {
        ...form,
        roles:      toLines(rolesText),
        techBadges: toLines(badgesText),
        techPills:  toLines(pillsText),
      };
      await apiFetch("/api/admin/hero", "PUT", payload);
      onSave(payload);
      toast({ title: "Hero section saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field label="Greeting / Status pill" {...f("greeting")} />
      <Field label="Full Name" {...f("name")} />
      <Field label="Short Name (shown in hero heading)" {...f("shortName")} />
      <Field label="Bio / Tagline" {...f("bio")} multiline rows={3} />
      <Field label="Résumé Headline — printed under your name in the PDF" {...f("resumeHeadline")} />
      <Field label="LinkedIn URL" {...f("linkedinUrl")} />
      <Field label="GitHub URL" {...f("githubUrl")} />
      <Field label="Email" {...f("email")} />
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Roles — typewriter (one per line)</label>
        <textarea rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
          value={rolesText} onChange={(e) => setRolesText(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Stats (JSON — e.g. [{"{"}\"value\":\"3+\",\"label\":\"Years Exp\"{"}"}])</label>
        <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={JSON.stringify(form.stats ?? [], null, 2)}
          onChange={(e) => { try { setForm({ ...form, stats: JSON.parse(e.target.value) }); } catch {} }} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Floating Tech Badges — around photo (one per line, max 4)</label>
        <textarea rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
          value={badgesText} onChange={(e) => setBadgesText(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Tech Pills — below bio (one per line)</label>
        <textarea rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
          value={pillsText} onChange={(e) => setPillsText(e.target.value)} />
      </div>
      <div className="pt-2 border-t border-white/5 space-y-4">
        <p className="text-xs font-mono text-muted-foreground">// images</p>
        <ImageUpload label="Profile / Hero Image (large photo in hero section)"
          currentUrl={form.heroImage ?? ""} onUploaded={(url) => setForm({ ...form, heroImage: url })} />
        <HeroImageFraming
          url={form.heroImage ?? ""}
          position={form.heroImagePosition ?? DEFAULT_FRAMING_POSITION}
          zoom={Number(form.heroImageZoom) || DEFAULT_FRAMING_ZOOM}
          onChange={(position, zoom) => setForm({ ...form, heroImagePosition: position, heroImageZoom: zoom })} />
        <ImageUpload label="Logo Image (small icon in header navbar)"
          currentUrl={form.logoImage ?? ""} onUploaded={(url) => setForm({ ...form, logoImage: url })} />
      </div>
      <div className="pt-2 border-t border-white/5 space-y-4">
        <p className="text-xs font-mono text-muted-foreground">// resume</p>
        <ResumeUpload />
      </div>
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: About ────────────────────────────────────────────── */
const AboutPanel = ({ data, onSave }: { data: any; onSave: (d: any) => void }) => {
  const [paragraphs, setParagraphs] = useState<string[]>(data.paragraphs ?? []);
  const [subheading, setSubheading] = useState<string>(data.subheading ?? "");
  const [statsText, setStatsText]   = useState(JSON.stringify(data.stats ?? [], null, 2));
  const [whatText, setWhatText]     = useState(JSON.stringify(data.whatIDo ?? [], null, 2));
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        paragraphs,
        subheading,
        stats:   JSON.parse(statsText),
        whatIDo: JSON.parse(whatText),
      };
      await apiFetch("/api/admin/about", "PUT", payload);
      onSave(payload);
      toast({ title: "About section saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Section Subheading</label>
        <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition"
          value={subheading} onChange={(e) => setSubheading(e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Bio Paragraphs</span>
          <button onClick={() => setParagraphs([...paragraphs, ""])}
            className="text-xs badge-tech cursor-pointer flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Paragraph
          </button>
        </div>
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea rows={3}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
              value={p} onChange={(e) => { const a = [...paragraphs]; a[i] = e.target.value; setParagraphs(a); }} />
            <button onClick={() => setParagraphs(paragraphs.filter((_, j) => j !== i))}
              className="text-destructive/60 hover:text-destructive transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Stats (JSON — [{"{"}\"value\",\"label\",\"sub\"{"}"}])
        </label>
        <textarea rows={12} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={statsText} onChange={(e) => setStatsText(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          What I Do Cards (JSON — [{"{"}\"title\",\"desc\"{"}"}], max 4)
        </label>
        <textarea rows={12} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={whatText} onChange={(e) => setWhatText(e.target.value)} />
      </div>

      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Contact ──────────────────────────────────────────── */
const ContactPanel = ({ data, onSave }: { data: any; onSave: (d: any) => void }) => {
  const [form, setForm] = useState({ ...data });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const f = (key: string) => ({
    label: key === "linkedinUrl" ? "LinkedIn URL" : key === "githubUrl" ? "GitHub URL" : key.charAt(0).toUpperCase() + key.slice(1),
    value: form[key] ?? "",
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  });

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/admin/contact", "PUT", form);
      onSave(form);
      toast({ title: "Contact section saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Field {...f("location")} />
      <Field {...f("email")} />
      <Field {...f("phone")} />
      <Field {...f("linkedinUrl")} />
      <Field {...f("githubUrl")} />
      <div className="pt-2 border-t border-white/5">
        <p className="text-xs font-mono text-muted-foreground mb-3">// availability badge</p>
        <div className="space-y-3">
          <Field label="Availability Title" value={form.availabilityTitle ?? ""} onChange={(v) => setForm({ ...form, availabilityTitle: v })} />
          <Field label="Availability Text" value={form.availabilityText ?? ""} onChange={(v) => setForm({ ...form, availabilityText: v })} multiline rows={3} />
        </div>
      </div>
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Skills ───────────────────────────────────────────── */
const SkillsPanel = ({ data, onSave }: { data: any; onSave: (d: any) => void }) => {
  const [itemsText, setItemsText]     = useState(JSON.stringify(data.items ?? [], null, 2));
  const [stackText, setStackText]     = useState(JSON.stringify(data.coreStack ?? [
    { name: "TypeScript / JavaScript", note: "Primary language on every project since 2021" },
    { name: "React.js / Next.js",      note: "Frontend for MightyMeals, By Best and daily client work since 2022" },
    { name: "Node.js / Express",       note: "API and backend services alongside Python / FastAPI" },
    { name: "Git & DevOps",            note: "Git, GitHub, Docker and CI/CD on every project" },
    { name: "ASP.NET Core",            note: "Fields In Trust and client work, on an ASP.NET MVC / Razor background" },
  ], null, 2));
  const [alsoText, setAlsoText]       = useState(data.alsoComfortableWith ?? "");
  const [langText, setLangText]       = useState(JSON.stringify(data.languages ?? [
    { name: "English",  level: "Professional Working" },
    { name: "Gujarati", level: "Native" },
    { name: "Hindi",    level: "Conversational" },
  ], null, 2));
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        items:               JSON.parse(itemsText),
        coreStack:           JSON.parse(stackText),
        alsoComfortableWith: alsoText,
        languages:           JSON.parse(langText),
      };
      await apiFetch("/api/admin/skills", "PUT", payload);
      onSave(payload);
      toast({ title: "Skills saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Skill Items (JSON — [{"{"}\"name\",\"category\"{"}"}] — categories: frontend / backend / database / devops)
        </label>
        <p className="text-xs text-muted-foreground/60 mb-2">
          Known icon names: React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux, HTML5, CSS3, Node.js, Express.js, Python, FastAPI, ASP.NET, PostgreSQL, MongoDB, MySQL, Git, GitHub, Docker, Linux, Vite, Webpack
        </p>
        <textarea rows={20} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={itemsText} onChange={(e) => setItemsText(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Core Stack (JSON — [{"{"}\"name\",\"note\"{"}"}] — a short fact per item, e.g. where or since when you used it)
        </label>
        <textarea rows={12} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={stackText} onChange={(e) => setStackText(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Also Comfortable With</label>
        <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
          value={alsoText} onChange={(e) => setAlsoText(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Languages — shown on Resume PDF (JSON — [{"{"}\"name\", \"level\"{"}"}])
        </label>
        <textarea rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={langText} onChange={(e) => setLangText(e.target.value)} />
        <p className="text-xs text-muted-foreground/60 mt-1">
          e.g. [{"{"}\"name\": \"English\", \"level\": \"Professional Working\"{"}"}]
        </p>
      </div>
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Experience ───────────────────────────────────────── */
const ExperiencePanel = ({ data, meta, onSaveData, onSaveMeta }: {
  data: any; meta: any;
  onSaveData: (d: any) => void; onSaveMeta: (d: any) => void;
}) => {
  const [expText,  setExpText]  = useState(JSON.stringify(data, null, 2));
  const [highlight, setHighlight] = useState(meta?.highlight ?? "");
  const [location,  setLocation]  = useState(meta?.location  ?? "");
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const parsedExp = JSON.parse(expText);
      await apiFetch("/api/admin/experience", "PUT", parsedExp);
      onSaveData(parsedExp);
      await apiFetch("/api/admin/experience-meta", "PUT", { highlight, location });
      onSaveMeta({ highlight, location });
      toast({ title: "Experience saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Highlight Fact (shown in sidebar box)</label>
        <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition resize-none"
          value={highlight} onChange={(e) => setHighlight(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Location Text (shown below education)</label>
        <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-primary/50 transition"
          value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Experience Entries (JSON)</label>
        <textarea rows={22} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground text-xs font-mono focus:outline-none focus:border-primary/50 transition resize-none"
          value={expText} onChange={(e) => setExpText(e.target.value)} />
      </div>
      <SaveBtn saving={saving} onClick={save} />
    </div>
  );
};

/* ── Sub-panel: Testimonials ─────────────────────────────────────── */
const COLORS = ["#7c3aed","#2563eb","#06b6d4","#ec4899","#a78bfa","#34d399","#f59e0b","#ef4444","#10b981","#f97316"];

const TestimonialsPanel = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const saveTestimonial = async (t: any) => {
    setSavingId(t.id);
    try {
      await apiFetch(`/api/admin/testimonials/${t.id}`, "PUT", t);
      toast({ title: "Testimonial saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSavingId(null); }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await apiFetch(`/api/admin/testimonials/${id}`, "DELETE");
      onChange(data.filter((t) => t.id !== id));
      toast({ title: "Testimonial deleted." });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  const addTestimonial = async () => {
    try {
      const newT = await apiFetch("/api/admin/testimonials", "POST", {
        name: "New Person", role: "Role", company: "Company",
        quote: "Their feedback here.", rating: 5,
        color: COLORS[data.length % COLORS.length],
      });
      onChange([...data, newT]);
      setExpanded(newT.id);
    } catch (e: any) { toast({ title: "Failed to add", description: e.message, variant: "destructive" }); }
  };

  const updateLocal = (id: number, updates: any) =>
    onChange(data.map((t) => t.id === id ? { ...t, ...updates } : t));

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-4">
        <button onClick={addTestimonial}
          className="flex items-center gap-2 px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No testimonials yet. Click "Add Testimonial" to get started.</p>
      )}
      {data.map((t) => (
        <div key={t.id} className="glass-card rounded-xl overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition"
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.color ?? "#7c3aed" }} />
              <div className="min-w-0">
                <span className="font-medium text-sm">{t.name}</span>
                <span className="text-xs text-muted-foreground ml-2 font-mono">{t.role} · {t.company}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="badge-tech text-xs">★ {t.rating}</span>
              {expanded === t.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </button>
          {expanded === t.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              {([
                ["name", "Name"],
                ["role", "Role / Title"],
                ["company", "Company"],
              ] as [string, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                    value={t[key] ?? ""}
                    onChange={(e) => updateLocal(t.id, { [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Quote / Feedback</label>
                <textarea rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none"
                  value={t.quote ?? ""}
                  onChange={(e) => updateLocal(t.id, { quote: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Rating (1–5)</label>
                  <select
                    className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                    style={{ background: "#0d0f1a", color: "white" }}
                    value={t.rating ?? 5}
                    onChange={(e) => updateLocal(t.id, { rating: parseInt(e.target.value) })}>
                    {[1,2,3,4,5].map((n) => (
                      <option key={n} value={n} style={{ background: "#0d0f1a", color: "white" }}>
                        {n} star{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Accent Color (hex)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent p-0.5"
                      value={t.color ?? "#7c3aed"}
                      onChange={(e) => updateLocal(t.id, { color: e.target.value })} />
                    <input className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 font-mono"
                      value={t.color ?? ""}
                      onChange={(e) => updateLocal(t.id, { color: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => deleteTestimonial(t.id)}
                  className="flex items-center gap-1.5 text-sm text-destructive/70 hover:text-destructive transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button onClick={() => saveTestimonial(t)} disabled={savingId === t.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                  {savingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Sub-panel: Projects ─────────────────────────────────────────── */
const ProjectsPanel = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const saveProject = async (project: any) => {
    setSavingId(project.id);
    try {
      await apiFetch(`/api/admin/projects/${project.id}`, "PUT", project);
      toast({ title: "Project saved!" });
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSavingId(null); }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await apiFetch(`/api/admin/projects/${id}`, "DELETE");
      onChange(data.filter((p) => p.id !== id));
      toast({ title: "Project deleted." });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  const addProject = async () => {
    try {
      const newProject = await apiFetch("/api/admin/projects", "POST", {
        title: "New Project", category: "Web App",
        description: "Project description here.",
        image: "", technologies: [],
        demoLink: "#", demoLinkText: "Live Demo",
        displayOrder: data.length + 1,
      });
      onChange([...data, newProject]);
      setExpanded(newProject.id);
    } catch (e: any) { toast({ title: "Failed to add", description: e.message, variant: "destructive" }); }
  };

  const updateLocal = (id: number, updates: any) =>
    onChange(data.map((p) => p.id === id ? { ...p, ...updates } : p));

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-4">
        <button onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      {data.map((project) => (
        <div key={project.id} className="glass-card rounded-xl overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition"
            onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
            <span className="font-medium text-sm">{project.title}</span>
            <div className="flex items-center gap-2">
              <span className="badge-tech text-xs">{project.category}</span>
              {expanded === project.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </button>
          {expanded === project.id && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <div className="pt-3">
                <ImageUpload label="Project Image" currentUrl={project.image ?? ""}
                  onUploaded={(url) => updateLocal(project.id, { image: url })} />
              </div>
              {([
                ["title", "Title"],
                ["category", "Category (Web App / Mobile / API / UI/UX)"],
                ["description", "Description", true],
                ["demoLink", "Demo Link URL"],
                ["demoLinkText", "Demo Link Text"],
              ] as [string, string, boolean?][]).map(([key, label, multiline]) => (
                <div key={key}>
                  <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                  {multiline ? (
                    <textarea rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none"
                      value={project[key] ?? ""}
                      onChange={(e) => updateLocal(project.id, { [key]: e.target.value })} />
                  ) : (
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                      value={project[key] ?? ""}
                      onChange={(e) => updateLocal(project.id, { [key]: e.target.value })} />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Technologies (comma separated)</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                  value={(project.technologies ?? []).join(", ")}
                  onChange={(e) => updateLocal(project.id, { technologies: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => deleteProject(project.id)}
                  className="flex items-center gap-1.5 text-sm text-destructive/70 hover:text-destructive transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button onClick={() => saveProject(project)} disabled={savingId === project.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
                  {savingId === project.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ── Main Admin Page ─────────────────────────────────────────────── */
const Admin = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("site");
  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await apiFetch("/api/admin/me");
        if (!me.isAdmin) { setLocation("/admin/login"); return; }
        const content = await apiFetch("/api/content");
        setData(content);
      } catch {
        setLocation("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const logout = async () => {
    await apiFetch("/api/admin/logout", "POST");
    setLocation("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen grid-bg">
      <div className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold gradient-text">Portfolio Admin</h1>
            <p className="text-xs text-muted-foreground">Content Management</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-muted-foreground hover:text-white transition">
              View Site ↗
            </a>
            <button onClick={logout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition px-4 py-2 glass border border-white/8 rounded-full">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="glass-card rounded-2xl p-2 space-y-1 sticky top-24">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === id ? "gradient-bg text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <motion.div key={activeTab} className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h2 className="font-semibold text-foreground mb-6 capitalize">
                {activeTab === "sections" ? "Section Visibility"
                  : activeTab === "testimonials" ? "Testimonials"
                  : `${activeTab} Section`}
              </h2>

              {activeTab === "sections" && (
                <SectionsPanel data={data.sections ?? {}} onSave={(d) => setData({ ...data, sections: d })} />
              )}
              {activeTab === "site" && (
                <SitePanel data={data.site} onSave={(d) => setData({ ...data, site: d })} />
              )}
              {activeTab === "hero" && (
                <HeroPanel data={data.hero} onSave={(d) => setData({ ...data, hero: d })} />
              )}
              {activeTab === "about" && (
                <AboutPanel data={data.about} onSave={(d) => setData({ ...data, about: d })} />
              )}
              {activeTab === "contact" && (
                <ContactPanel data={data.contact} onSave={(d) => setData({ ...data, contact: d })} />
              )}
              {activeTab === "skills" && (
                <SkillsPanel data={data.skills} onSave={(d) => setData({ ...data, skills: d })} />
              )}
              {activeTab === "experience" && (
                <ExperiencePanel
                  data={data.experience}
                  meta={data.experienceMeta}
                  onSaveData={(d) => setData({ ...data, experience: d })}
                  onSaveMeta={(d) => setData({ ...data, experienceMeta: d })}
                />
              )}
              {activeTab === "projects" && (
                <ProjectsPanel data={data.projects} onChange={(d) => setData({ ...data, projects: d })} />
              )}
              {activeTab === "testimonials" && (
                <TestimonialsPanel data={data.testimonials ?? []} onChange={(d) => setData({ ...data, testimonials: d })} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
