import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { Download, ArrowRight, Github, Linkedin, Mail, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroPhoto from "../../assets/images/ImportedPhoto.760428188.70688.jpeg";
import { deriveCareer, resolveCareerTokens, resolveStat } from "@/lib/career";

const DEFAULT_ROLES = [
  "React & Next.js Expert",
  "Full-Stack Web Developer",
  "Node.js Engineer",
  "TypeScript Enthusiast",
];

const DEFAULT_STATS = [
  { value: "{{years}}+",    label: "Years Exp"  },
  { value: "10+",           label: "Projects"  },
  { value: "{{companies}}", label: "Companies" },
];

const BADGE_POSITIONS = [
  { top: "4%",    right: "-8%",  delay: 0   },
  { top: "36%",   right: "-12%", delay: 0.6 },
  { bottom: "26%",right: "-10%", delay: 1.1 },
  { bottom: "8%", left: "-4%",   delay: 0.9 },
];

/* ══════════════════════════════════════════════════════════════
   CANVAS PARTICLE NETWORK — Interactive, glowing, impressive
   ══════════════════════════════════════════════════════════════ */
const ParticleNetwork = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Particle count scales with screen area */
    const count = Math.max(60, Math.min(130, Math.floor((canvas.width * canvas.height) / 9000)));

    const COLORS = ["#7c3aed", "#2563eb", "#06b6d4", "#a78bfa", "#ec4899", "#38bdf8"];

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      r: number; color: string; alpha: number;
    };

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.5,
      vy:    (Math.random() - 0.5) * 0.5,
      r:     Math.random() * 1.8 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.3,
    }));

    /* Track mouse globally so content elements don't block canvas interaction */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const MAX_DIST   = 150;
    const MOUSE_DIST = 120;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      /* Update + draw each particle */
      particles.forEach((p) => {
        /* Mouse repulsion */
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST) {
          const d  = Math.sqrt(d2);
          const f  = (MOUSE_DIST - d) / MOUSE_DIST;
          p.vx += (dx / d) * f * 0.8;
          p.vy += (dy / d) * f * 0.8;
        }

        /* Speed cap + gentle drag */
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2) { p.vx *= 0.92; p.vy *= 0.92; }

        p.x += p.vx;
        p.y += p.vy;

        /* Wrap */
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        /* Outer soft glow */
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, p.color + "55");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* Core dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* Draw connections */
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b   = particles[j];
          const dx  = a.x - b.x;
          const dy  = a.y - b.y;
          const d   = Math.sqrt(dx * dx + dy * dy);
          if (d > MAX_DIST) continue;

          const alpha = (1 - d / MAX_DIST) * 0.35;

          /* Gradient line between two particle colors */
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));
          grad.addColorStop(1, b.color + Math.round(alpha * 255).toString(16).padStart(2, "0"));

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }

        /* Extra bright connection to mouse */
        const mdx = a.x - mx;
        const mdy = a.y - my;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST * 1.4) {
          const alpha = (1 - md / (MOUSE_DIST * 1.4)) * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          ctx.lineWidth   = 0.9;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto", zIndex: 1 }}
    />
  );
};

/* ══════════════════════════════════════════════════════════════
   SHOOTING STARS — CSS-based streaks
   ══════════════════════════════════════════════════════════════ */
const STARS = [
  { top: "8%",  left: "15%", angle: 35, len: 180, dur: 1.1, delay: 2   },
  { top: "22%", left: "55%", angle: 40, len: 140, dur: 0.9, delay: 7   },
  { top: "5%",  left: "70%", angle: 32, len: 200, dur: 1.3, delay: 13  },
  { top: "45%", left: "5%",  angle: 28, len: 160, dur: 1.0, delay: 4.5 },
  { top: "15%", left: "40%", angle: 38, len: 120, dur: 0.8, delay: 9   },
];

const ShootingStars = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
    {STARS.map((s, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          top: s.top, left: s.left,
          width: `${s.len}px`, height: "1.5px",
          transform: `rotate(${s.angle}deg)`,
          transformOrigin: "left center",
          background: "linear-gradient(90deg, transparent, #a78bfa, #67e8f9, transparent)",
          borderRadius: "99px",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0], x: [0, s.len] }}
        transition={{
          duration: s.dur,
          delay: s.delay,
          repeat: Infinity,
          repeatDelay: 11 + i * 3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   STAT COUNTER
   ══════════════════════════════════════════════════════════════ */
const StatItem = ({ value, label }: { value: string; label: string }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const num    = parseInt(value.replace(/\D/g, "")) || 0;
  const suf    = value.replace(/\d/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || num === 0) return;
    const steps = 50;
    let step = 0;
    const t = setInterval(() => {
      step++;
      setCount(Math.min(Math.round((num * step) / steps), num));
      if (step >= steps) clearInterval(t);
    }, 1500 / steps);
    return () => clearInterval(t);
  }, [inView, num]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl font-black gradient-text-animated font-space leading-none">
        {count}{suf}
      </div>
      <div className="text-[11px] text-muted-foreground mt-1 font-mono tracking-wide whitespace-nowrap">{label}</div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   3-D TILT PHOTO
   ══════════════════════════════════════════════════════════════ */
const TiltPhoto = ({ src, alt, position = "50% 25%", zoom = 1 }:
  { src: string; alt: string; position?: string; zoom?: number }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 280, damping: 22 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 280, damping: 22 });

  return (
    <motion.div
      className="relative"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width  - 0.5);
        my.set((e.clientY - r.top)  / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      {/* Spinning conic ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-10%",
          background: "conic-gradient(from 0deg, rgba(124,58,237,0.65), rgba(37,99,235,0.6), rgba(6,182,212,0.5), rgba(219,39,119,0.4), rgba(124,58,237,0.65))",
          filter: "blur(18px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Photo */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(37,99,235,0.8), rgba(6,182,212,0.7))",
          padding: "3px", borderRadius: "50%",
          boxShadow: "0 0 80px rgba(124,58,237,0.55), 0 0 40px rgba(37,99,235,0.3), 0 30px 80px rgba(0,0,0,0.6)",
          position: "relative", zIndex: 10,
        }}
      >
        <div style={{ borderRadius: "50%", overflow: "hidden", background: "#07071a" }}>
          <img
            src={src} alt={alt}
            className="block select-none"
            style={{
              width:  "clamp(220px, 28vw, 380px)",
              height: "clamp(220px, 28vw, 380px)",
              objectFit: "cover", objectPosition: position,
              transform: `scale(${zoom})`, transformOrigin: position,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════════ */
type Props = { content?: any };

const HeroSection = ({ content }: Props) => {
  const scrollToSection = useScrollToSection();
  const { downloadResume, loading: resumeLoading, ready: resumeReady } = useResumeDownload();
  const hero = content?.hero;

  const name        = hero?.shortName ?? "Siddharajsinh";
  const career      = deriveCareer(content);
  const bio         = resolveCareerTokens(hero?.bio ?? "{{years}}+ years crafting scalable, high-performance web applications with React, TypeScript, and Node.js. I turn complex problems into clean, elegant solutions.", career);
  const roles       = (hero?.roles    ?? DEFAULT_ROLES) as string[];
  const stats       = ((hero?.stats   ?? DEFAULT_STATS) as { value: string; label: string }[])
    .map((s) => resolveStat(s, career));
  const linkedinUrl = hero?.linkedinUrl ?? "#";
  const githubUrl   = hero?.githubUrl   ?? "#";
  const email       = hero?.email       ?? "";
  const heroImage   = hero?.heroImage   || heroPhoto;
  const techBadgeLabels: string[] = hero?.techBadges ?? ["TypeScript", "React.js", "Next.js", "Node.js"];
  const techPills: string[]       = hero?.techPills  ?? ["React.js", "Next.js", "TypeScript", "Node.js", "PostgreSQL"];

  /* Typewriter */
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping]       = useState(true);

  useEffect(() => {
    const cur = roles[roleIndex] ?? "";
    let t: ReturnType<typeof setTimeout>;
    if (typing) {
      if (displayed.length < cur.length) {
        t = setTimeout(() => setDisplayed(cur.slice(0, displayed.length + 1)), 60);
      } else {
        t = setTimeout(() => setTyping(false), 2400);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 34);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, roleIndex, roles]);

  const stagger = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
  };
  const fadeUp = {
    hidden:  { y: 30, opacity: 0 },
    visible: { y: 0,  opacity: 1, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* ── Canvas particle network (z-index 1) ─────────────────── */}
      <ParticleNetwork />

      {/* ── Aurora blobs (z-index 0, under canvas) ──────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full"
          style={{ width: "70%", height: "80%", top: "-20%", left: "-5%",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.38) 0%, transparent 70%)",
            filter: "blur(80px)", animation: "aurora-drift-1 22s ease-in-out infinite" }} />
        <div className="absolute rounded-full"
          style={{ width: "55%", height: "65%", top: "5%", right: "-8%",
            background: "radial-gradient(ellipse, rgba(37,99,235,0.32) 0%, transparent 68%)",
            filter: "blur(90px)", animation: "aurora-drift-2 28s ease-in-out infinite 4s" }} />
        <div className="absolute rounded-full"
          style={{ width: "45%", height: "55%", bottom: "-10%", left: "10%",
            background: "radial-gradient(ellipse, rgba(6,182,212,0.28) 0%, transparent 68%)",
            filter: "blur(80px)", animation: "aurora-drift-3 32s ease-in-out infinite 8s" }} />
        <div className="absolute rounded-full"
          style={{ width: "38%", height: "45%", bottom: "5%", right: "5%",
            background: "radial-gradient(ellipse, rgba(219,39,119,0.2) 0%, transparent 68%)",
            filter: "blur(90px)", animation: "aurora-drift-1 26s ease-in-out infinite 12s reverse" }} />
      </div>

      {/* ── Shooting stars (z-index 2) ───────────────────────────── */}
      <ShootingStars />

      {/* ── Content (z-index 10) ─────────────────────────────────── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24 sm:py-28" style={{ zIndex: 10 }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* ── LEFT — Text ───────────────────────────────────────── */}
          <motion.div
            className="w-full lg:w-[50%] text-center lg:text-left"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Status pill */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs sm:text-sm mb-6 px-4 py-2 rounded-full"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#67e8f9", backdropFilter: "blur(8px)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{hero?.greeting ?? "Available for opportunities"}</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              className="font-black leading-[1.05] tracking-tight font-space mb-4"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
            >
              <span className="text-white/90 block">Hi, I&apos;m</span>
              <span className="gradient-text-animated block">{name}</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div variants={fadeUp}
              className="flex items-center gap-0 justify-center lg:justify-start mb-5 h-8"
              style={{ fontSize: "clamp(1rem, 2.2vw, 1.4rem)" }}>
              <span className="font-mono font-semibold" style={{ color: "#c4b5fd" }}>{displayed}</span>
              <span className="w-0.5 h-5 ml-0.5 rounded-full animate-pulse inline-block" style={{ background: "#c4b5fd" }} />
            </motion.div>

            {/* Bio */}
            <motion.p variants={fadeUp}
              className="text-muted-foreground leading-relaxed mb-7 max-w-lg mx-auto lg:mx-0"
              style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.05rem)" }}>
              {bio}
            </motion.p>

            {/* Tech pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center lg:justify-start mb-7">
              {techPills.map((t) => (
                <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.28)", color: "#c4b5fd" }}>
                  {t}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center lg:justify-start mb-7">
              <motion.button
                onClick={() => scrollToSection("#projects")}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #0891b2 100%)", boxShadow: "0 6px 28px rgba(124,58,237,0.5)" }}
                whileHover={{ scale: 1.06, boxShadow: "0 10px 40px rgba(124,58,237,0.65)" }}
                whileTap={{ scale: 0.97 }}
              >
                View My Work <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={downloadResume}
                disabled={resumeLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.35)", backdropFilter: "blur(10px)" }}
                whileHover={{ scale: resumeLoading ? 1 : 1.06, borderColor: "rgba(167,139,250,0.6)", background: "rgba(124,58,237,0.12)" }}
                whileTap={{ scale: resumeLoading ? 1 : 0.97 }}
              >
                {!resumeReady
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing…</>
                  : resumeLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Downloading…</>
                    : <><Download className="w-4 h-4" /> Download CV</>
                }
              </motion.button>
            </motion.div>

            {/* Socials */}
            <motion.div variants={fadeUp} className="flex gap-3 justify-center lg:justify-start mb-10">
              {[
                { href: linkedinUrl,       icon: Linkedin, label: "LinkedIn", color: "#0a66c2" },
                { href: githubUrl,         icon: Github,   label: "GitHub",   color: "#e2e8f0" },
                { href: `mailto:${email}`, icon: Mail,     label: "Email",    color: "#ec4899" },
              ].map(({ href, icon: Icon, label, color }) => (
                <motion.a key={label} href={href}
                  target={label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}
                  whileHover={{ scale: 1.2, y: -3, color: "#fff", background: `${color}22`, borderColor: `${color}66`, boxShadow: `0 8px 28px ${color}35` }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </motion.a>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp}
              className="flex gap-8 sm:gap-12 justify-center lg:justify-start pt-7"
              style={{ borderTop: "1px solid rgba(124,58,237,0.18)" }}>
              {stats.map((s) => <StatItem key={s.label} value={s.value} label={s.label} />)}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Photo ─────────────────────────────────────── */}
          <motion.div
            className="w-full lg:w-[48%] flex justify-center items-center"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative flex items-center justify-center" style={{ isolation: "isolate" }}>
              {/* Floating tech badges */}
              {BADGE_POSITIONS.slice(0, techBadgeLabels.length).map(({ delay, ...pos }, i) => (
                <motion.span key={techBadgeLabels[i]}
                  className="absolute z-20 text-xs font-mono font-semibold px-3 py-1.5 rounded-full hidden sm:block"
                  style={{
                    ...pos,
                    background: "rgba(7,7,26,0.92)",
                    border: "1px solid rgba(124,58,237,0.5)",
                    backdropFilter: "blur(14px)",
                    color: "#c4b5fd",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.25)",
                    animation: `badge-float ${2.6 + delay * 0.4}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {techBadgeLabels[i]}
                </motion.span>
              ))}

              {/* Open to Work */}
              <motion.div
                className="absolute bottom-2 right-0 sm:-right-10 z-20 flex items-center gap-2 px-3 py-2 rounded-2xl"
                style={{ background: "rgba(7,7,26,0.94)", border: "1px solid rgba(6,182,212,0.4)", backdropFilter: "blur(16px)", animation: "badge-float 3.2s ease-in-out infinite" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="gradient-text-animated text-xs sm:text-sm font-bold font-space">Open to Work</span>
              </motion.div>

              {/* Terminal snippet */}
              <motion.div
                className="absolute -bottom-4 -left-8 z-20 hidden xl:block"
                style={{ background: "rgba(7,7,26,0.96)", border: "1px solid rgba(124,58,237,0.22)", borderRadius: "14px", padding: "12px 15px", backdropFilter: "blur(18px)", minWidth: "170px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.7 }}
              >
                <div className="flex gap-1.5 mb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="font-mono text-[10px] space-y-0.5 leading-relaxed">
                  <div style={{ color: "rgba(100,116,139,0.5)" }}>const dev = {"{"}</div>
                  <div className="pl-3"><span style={{ color: "#a78bfa" }}>stack</span>: <span style={{ color: "#67e8f9" }}>&quot;full-stack&quot;</span>,</div>
                  <div className="pl-3"><span style={{ color: "#a78bfa" }}>passion</span>: <span style={{ color: "#34d399" }}>true</span></div>
                  <div style={{ color: "rgba(100,116,139,0.5)" }}>{"}"}</div>
                </div>
              </motion.div>

              <TiltPhoto src={heroImage} alt={content?.site?.fullName ?? hero?.name ?? "Profile Photo"}
                position={hero?.heroImagePosition || "50% 25%"} zoom={Number(hero?.heroImageZoom) || 1} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ zIndex: 10 }}
        animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(124,58,237,0.5)" }}>
          <motion.div className="w-1 h-2 rounded-full"
            style={{ background: "linear-gradient(180deg, #7c3aed, #2563eb)" }}
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
