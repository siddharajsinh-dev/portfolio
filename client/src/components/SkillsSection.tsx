import { useState } from "react";
import { SectionBg } from "./SectionBg";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiTailwindcss, SiRedux, SiHtml5, SiCss3,
  SiNodedotjs, SiExpress, SiPython, SiFastapi, SiDotnet,
  SiPostgresql, SiMongodb, SiMysql,
  SiDocker, SiGit, SiGithub, SiLinux, SiWebpack, SiVite,
} from "react-icons/si";
import { IconType } from "react-icons";

type Skill = { name: string; icon: IconType; color: string; cat: string };

const ICON_MAP: Record<string, { icon: IconType; color: string }> = {
  "React.js":     { icon: SiReact,       color: "#61DAFB" },
  "Next.js":      { icon: SiNextdotjs,   color: "#e2e8f0" },
  "TypeScript":   { icon: SiTypescript,  color: "#3178C6" },
  "JavaScript":   { icon: SiJavascript,  color: "#F7DF1E" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  "Redux":        { icon: SiRedux,       color: "#764ABC" },
  "HTML5":        { icon: SiHtml5,       color: "#E34F26" },
  "CSS3":         { icon: SiCss3,        color: "#1572B6" },
  "Node.js":      { icon: SiNodedotjs,   color: "#339933" },
  "Express.js":   { icon: SiExpress,     color: "#aaaaaa" },
  "Python":       { icon: SiPython,      color: "#3776AB" },
  "FastAPI":      { icon: SiFastapi,     color: "#009688" },
  "ASP.NET":      { icon: SiDotnet,      color: "#512BD4" },
  "PostgreSQL":   { icon: SiPostgresql,  color: "#4169E1" },
  "MongoDB":      { icon: SiMongodb,     color: "#47A248" },
  "MySQL":        { icon: SiMysql,       color: "#4479A1" },
  "Git":          { icon: SiGit,         color: "#F05032" },
  "GitHub":       { icon: SiGithub,      color: "#e2e8f0" },
  "Docker":       { icon: SiDocker,      color: "#2496ED" },
  "Linux":        { icon: SiLinux,       color: "#FCC624" },
  "Vite":         { icon: SiVite,        color: "#646CFF" },
  "Webpack":      { icon: SiWebpack,     color: "#8DD6F9" },
};

const DEFAULT_SKILL_ITEMS: { name: string; category: string }[] = [
  { name: "React.js",     category: "frontend" },
  { name: "Next.js",      category: "frontend" },
  { name: "TypeScript",   category: "frontend" },
  { name: "JavaScript",   category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Redux",        category: "frontend" },
  { name: "HTML5",        category: "frontend" },
  { name: "CSS3",         category: "frontend" },
  { name: "Node.js",      category: "backend"  },
  { name: "Express.js",   category: "backend"  },
  { name: "Python",       category: "backend"  },
  { name: "FastAPI",      category: "backend"  },
  { name: "ASP.NET",      category: "backend"  },
  { name: "PostgreSQL",   category: "database" },
  { name: "MongoDB",      category: "database" },
  { name: "MySQL",        category: "database" },
  { name: "Git",          category: "devops"   },
  { name: "GitHub",       category: "devops"   },
  { name: "Docker",       category: "devops"   },
  { name: "Linux",        category: "devops"   },
  { name: "Vite",         category: "devops"   },
  { name: "Webpack",      category: "devops"   },
];

const DEFAULT_CORE_STACK = [
  { name: "TypeScript / JavaScript", note: "Primary language on every project since 2021" },
  { name: "React.js / Next.js",      note: "Frontend for MightyMeals, By Best and daily client work since 2022" },
  { name: "Node.js / Express",       note: "API and backend services alongside Python / FastAPI" },
  { name: "Git & DevOps",            note: "Git, GitHub, Docker and CI/CD on every project" },
  { name: "ASP.NET Core",            note: "Fields In Trust and client work, on an ASP.NET MVC / Razor background" },
];

const DEFAULT_ALSO_COMFORTABLE = "Stripe, Authorize.net, ID.me, Google Maps Places API, authentication";

const hexToRgba = (hex: string, alpha: number) => {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r
    ? `rgba(${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)},${alpha})`
    : `rgba(124,58,237,${alpha})`;
};

const SkillCard = ({ name, icon: Icon, color, index }: { name: string; icon: IconType; color: string; index: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ delay: index * 0.032, duration: 0.32, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default group"
      style={{
        background: hovered ? hexToRgba(color, 0.1) : "rgba(255,255,255,0.028)",
        border: `1px solid ${hovered ? hexToRgba(color, 0.35) : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered ? `0 12px 40px ${hexToRgba(color, 0.2)}, 0 0 0 1px ${hexToRgba(color, 0.08)}` : "none",
        transition: "all 0.25s ease",
      }}
    >
      <Icon
        style={{
          width: "38px", height: "38px",
          color: hovered ? color : `${color}88`,
          transition: "color 0.22s ease, transform 0.22s ease",
          transform: hovered ? "scale(1.12)" : "scale(1)",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.3,
          color: hovered ? "#f1f5f9" : "#64748b",
          transition: "color 0.22s ease",
        }}
      >
        {name}
      </span>
    </motion.div>
  );
};

type Props = { content?: any };

const SkillsSection = ({ content }: Props) => {
  const [activeTab, setActiveTab] = useState("all");
  const skills = content?.skills;

  const coreStack: { name: string; note?: string }[] = skills?.coreStack ?? DEFAULT_CORE_STACK;
  const alsoComfortableWith: string = skills?.alsoComfortableWith ?? DEFAULT_ALSO_COMFORTABLE;

  const skillItems: { name: string; category: string }[] = skills?.items ?? DEFAULT_SKILL_ITEMS;
  const allSkills: Skill[] = skillItems.map((s) => {
    const mapped = ICON_MAP[s.name];
    return {
      name:  s.name,
      icon:  mapped?.icon  ?? SiReact,
      color: mapped?.color ?? "#a78bfa",
      cat:   s.category,
    };
  });

  const categories = [
    { id: "all", label: "All" },
    ...Array.from(new Set(skillItems.map((s) => s.category))).map((c) => ({
      id: c,
      label: c === "devops" ? "DevOps & Tools" : c.charAt(0).toUpperCase() + c.slice(1),
    })),
  ];

  const filtered = activeTab === "all" ? allSkills : allSkills.filter((s) => s.cat === activeTab);

  return (
    <section
      id="skills"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      <SectionBg variant="projects" />
      <div className="absolute top-0 left-0 w-full h-px section-accent-line" />

      {/* Aurora accent */}
      <div
        className="absolute -top-32 right-0 w-[600px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-mono text-sm mb-3" style={{ color: "#a78bfa" }}>// what I work with</p>
          <h2 className="section-heading gradient-text-animated inline-block">Skills &amp; Technologies</h2>
          <p className="section-subheading mt-4">
            Real tools used to ship real products.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                color: activeTab === cat.id ? "#fff" : "#64748b",
                background: activeTab === cat.id ? undefined : "rgba(255,255,255,0.025)",
                border: activeTab === cat.id ? undefined : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {activeTab === cat.id && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Icon grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {filtered.map((skill: Skill, i: number) => (
                  <SkillCard key={skill.name} name={skill.name} icon={skill.icon} color={skill.color} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Core stack */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
              />
              Core Stack
            </p>
            {coreStack.map(({ name, note }, i) => (
              <motion.div key={name}
                className="flex gap-3"
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}>
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }}
                />
                <div>
                  <p className="text-sm text-foreground font-medium">{name}</p>
                  {note && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{note}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              className="mt-8 p-5 rounded-2xl"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs font-mono mb-2" style={{ color: "#7c3aed" }}>// also comfortable with</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {alsoComfortableWith}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
