import { motion, useInView } from "framer-motion";
import { SectionBg } from "./SectionBg";
import { MapPin, Mail, Phone, Code2, Layers, Cloud, Cpu, Calendar, Briefcase, Globe, GraduationCap } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { deriveCareer, resolveCareerTokens, resolveStat } from "@/lib/career";

const DEFAULT_PARAGRAPHS = [
  "I'm a Full-Stack Web Developer with 4+ years of experience building and scaling production web applications. My passion lies in crafting intuitive, performant, and beautiful solutions — from pixel-perfect React UIs to resilient Node.js backends.",
  "React and TypeScript are my primary tools of choice. I've spent the last few years building complex SPAs, optimizing performance, integrating payment gateways like Stripe, and shipping features that real users rely on every day.",
  "Outside of coding, I enjoy hiking, playing cricket, reading tech blogs, and contributing to open-source. I thrive in collaborative Agile environments and I'm always excited to take on new challenges.",
];

const DEFAULT_WHAT_I_DO = [
  { title: "React / Next.js",  desc: "Pixel-perfect, accessible UIs with TypeScript, Redux, and Framer Motion" },
  { title: "Node.js / APIs",   desc: "Express, REST APIs, PostgreSQL — scalable backends built for production"  },
  { title: "Cloud & DevOps",   desc: "AWS, Docker, CI/CD pipelines, Vite, and deployment automation"            },
  { title: "Performance",       desc: "Bundle splitting, lazy loading, and caching strategies for fast UX"       },
];

const WHAT_I_DO_ICONS = [Code2, Layers, Cloud, Cpu];
const WHAT_I_DO_COLORS = ["#22d3ee", "#7c3aed", "#a78bfa", "#ec4899"];

const DEFAULT_STATS = [
  { value: "{{years}}+",     label: "Years of Experience", sub: "Since {{since}}"    },
  { value: "10+",            label: "Projects Delivered",  sub: "Live in production" },
  { value: "{{companies}}",  label: "Companies",           sub: "{{companyList}}"    },
  { value: "8.3",            label: "CGPA",                sub: "B.E. Computer Engg." },
];

const STAT_ICONS = [Calendar, Briefcase, Globe, GraduationCap];

const useCountUp = (target: number, inView: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || target === 0) return;
    const steps = 45;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round((target * step) / steps), target));
      if (step >= steps) clearInterval(timer);
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
};

const StatCard = ({
  icon: Icon, value, label, sub, index, color,
}: {
  icon: any; value: string; label: string; sub: string; index: number; color: string;
}) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const numStr = value.replace(/[^0-9.]/g, "");
  const suffix = value.replace(/[0-9.]/g, "");
  const parsed = parseFloat(numStr);
  const isFloat = numStr.includes(".");
  const count  = useCountUp(isFloat ? Math.round(parsed * 10) : (parsed || 0), inView);
  const display = isFloat ? (count / 10).toFixed(1) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-5 flex items-center gap-4 group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${color}28, ${color}14)`, border: `1px solid ${color}35` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-black font-space leading-none" style={{ color }}>
          {display}{suffix}
        </div>
        <div className="text-sm font-semibold text-foreground mt-0.5">{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">{sub}</div>
      </div>
    </motion.div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

type Props = { content?: any };

const AboutSection = ({ content }: Props) => {
  const about       = content?.about;
  const contactData = content?.contact;

  const career = deriveCareer(content);
  const resolve = (text: string) => resolveCareerTokens(text, career);

  const paragraphs: string[] = (about?.paragraphs ?? DEFAULT_PARAGRAPHS).map(resolve);
  const subheading: string   = resolve(about?.subheading ?? "Full-Stack Developer — building production-grade web apps.");
  const stats = ((about?.stats ?? DEFAULT_STATS) as { value: string; label: string; sub: string }[])
    .map((s) => resolveStat(s, career));
  const whatIDo = (about?.whatIDo ?? DEFAULT_WHAT_I_DO) as { title: string; desc: string }[];

  const location    = contactData?.location    ?? "";
  const email       = contactData?.email       ?? "";
  const phone       = contactData?.phone       ?? "";
  const linkedinUrl = contactData?.linkedinUrl ?? "#";
  const githubUrl   = contactData?.githubUrl   ?? "#";

  const infoItems = [
    { icon: MapPin, label: "Location", value: location },
    { icon: Mail,   label: "Email",    value: email    },
  ];

  return (
    <section
      id="about"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      <SectionBg variant="about" />
      <div className="absolute top-0 left-0 w-full h-px section-accent-line" />

      {/* Aurora accents */}
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="font-mono text-sm mb-3" style={{ color: "#a78bfa" }}>// who I am</p>
          <h2 className="section-heading gradient-text-animated inline-block">About Me</h2>
          <p className="section-subheading mt-4">{subheading}</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <StatCard
              key={s.label} {...s} index={i}
              icon={STAT_ICONS[i % STAT_ICONS.length]}
              color={["#22d3ee","#7c3aed","#a78bfa","#ec4899"][i % 4]}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Story */}
          <div className="space-y-6">
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-muted-foreground text-base leading-relaxed"
              >
                {text}
              </motion.p>
            ))}

            {/* Contact info */}
            <motion.div
              className="space-y-3 pt-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(124,58,237,0.1)",
                      border: "1px solid rgba(124,58,237,0.22)",
                      color: "#a78bfa",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex gap-3 pt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {[
                { href: linkedinUrl, icon: FaLinkedinIn, label: "LinkedIn" },
                { href: githubUrl,   icon: FaGithub,     label: "GitHub"   },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-muted-foreground"
                  style={{
                    background: "rgba(124,58,237,0.07)",
                    border: "1px solid rgba(124,58,237,0.18)",
                  }}
                  whileHover={{
                    color: "#fff",
                    borderColor: "rgba(167,139,250,0.45)",
                    background: "rgba(124,58,237,0.15)",
                    y: -2,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right — What I Do cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whatIDo.map(({ title, desc }, i) => {
              const Icon  = WHAT_I_DO_ICONS[i % WHAT_I_DO_ICONS.length];
              const color = WHAT_I_DO_COLORS[i % WHAT_I_DO_COLORS.length];
              return (
                <motion.div
                  key={title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="glass-card rounded-2xl p-5 group cursor-default"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                      border: `1px solid ${color}35`,
                      boxShadow: `0 4px 18px ${color}18`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1.5 font-space">{title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
