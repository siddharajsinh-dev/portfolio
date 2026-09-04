import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { Menu, X, Loader2, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import sidAvatarFallback from "../../assets/images/sid-avatar.png";

/* ── Theme toggle hook ────────────────────────────────────────── */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
};

const ALL_NAV_LINKS = [
  { href: "#home",         label: "Home",       sectionKey: "hero"         },
  { href: "#about",        label: "About",      sectionKey: "about"        },
  { href: "#skills",       label: "Skills",     sectionKey: "skills"       },
  { href: "#experience",   label: "Experience", sectionKey: "experience"   },
  { href: "#projects",     label: "Projects",   sectionKey: "projects"     },
  { href: "#testimonials", label: "Reviews",    sectionKey: "testimonials" },
  { href: "#contact",      label: "Contact",    sectionKey: "contact"      },
];

type Props = { content?: any };

const Header = ({ content }: Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [activeSection, setActiveSection]   = useState("home");
  const isMobile        = useMobile();

  const c = content as any;
  const isLoaded = !!c;
  const sections = c?.sections ?? null;

  function sectionHasContent(key: string): boolean {
    if (!isLoaded) return true;
    switch (key) {
      case "hero":         return !!(c?.hero?.name);
      case "about":        return !!(c?.about?.paragraphs?.length);
      case "skills":       return !!(c?.skills?.items?.length || c?.skills?.coreStack?.length || c?.skills?.frontend?.length);
      case "experience":   return !!(c?.experience?.length);
      case "projects":     return !!(c?.projects?.length);
      case "testimonials": return !!(c?.testimonials?.length);
      case "contact":      return !!(c?.contact?.email);
      default:             return true;
    }
  }

  const navLinks = ALL_NAV_LINKS.filter(({ sectionKey }) =>
    (sections === null || sections[sectionKey] !== false) && sectionHasContent(sectionKey)
  );
  const scrollToSection = useScrollToSection();
  const { downloadResume, loading: resumeLoading, ready: resumeReady } = useResumeDownload();
  const { isDark, toggle: toggleTheme } = useTheme();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const heroImage = content?.hero?.logoImage || sidAvatarFallback;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navLinks.map((l) => l.href.slice(1));
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9996]"
        style={{
          scaleX,
          background: "linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)",
        }}
      />

      <motion.header
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/[0.06] shadow-2xl shadow-black/40" : "bg-transparent"
        }`}
        style={{
          background:          scrolled ? "var(--header-scrolled-bg)" : "transparent",
          borderBottomColor:   scrolled ? "var(--header-scrolled-border)" : "transparent",
          backdropFilter:      scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter:scrolled ? "blur(20px) saturate(180%)" : "none",
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">

          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
          >
            <div className="relative w-9 h-9 flex-shrink-0">
              <div
                className="absolute -inset-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", padding: "1.5px" }}
              >
                <div className="w-full h-full rounded-full" style={{ background: "#07071a" }} />
              </div>
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ background: "#000" }}>
                <img
                  src={heroImage}
                  alt="SID"
                  className="w-full h-full object-contain scale-125 group-hover:scale-[1.35] transition-transform duration-300"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-black text-base font-mono gradient-text-animated tracking-wide">{content?.site?.logoText ?? "SID."}</span>
              <span className="text-[9px] text-muted-foreground/55 font-mono tracking-widest uppercase">
                {content?.site?.logoSubtext ?? "Full-Stack Dev"}
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive ? "text-white" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(37,99,235,0.22))",
                        border: "1px solid rgba(124,58,237,0.35)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full text-muted-foreground"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}
            whileHover={{ scale: 1.12, color: "#fff", borderColor: "rgba(167,139,250,0.5)" }}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.span key="sun"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun  className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Resume CTA */}
          <motion.button
            onClick={downloadResume}
            disabled={resumeLoading}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
            }}
            whileHover={{ scale: resumeLoading ? 1 : 1.05, boxShadow: "0 6px 24px rgba(124,58,237,0.55)" }}
            whileTap={{ scale: resumeLoading ? 1 : 0.97 }}
          >
            {!resumeReady
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing…</>
              : resumeLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading…</>
              : "Resume"
            }
          </motion.button>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/80 hover:text-white transition p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-white/[0.06]"
              style={{
                background: "rgba(5,7,18,0.96)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="py-2.5 px-4 rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.04] transition"
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  onClick={() => { setMobileMenuOpen(false); downloadResume(); }}
                  disabled={resumeLoading}
                  className="mt-3 py-2.5 px-4 rounded-full text-white text-center font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                >
                  {!resumeReady
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing…</>
                    : resumeLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading…</>
                    : "Resume"
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
