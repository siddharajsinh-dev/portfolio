import { motion } from "framer-motion";
import { SectionBg } from "./SectionBg";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { experience as defaultExperience, education as defaultEducation } from "@/lib/constants";

type Props = { content?: any };

const ExperienceCard = ({
  position,
  company,
  period,
  description,
  skills,
  index,
}: {
  position: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
  index: number;
}) => {
  const isFirst = index === 0;

  return (
    <motion.div
      className="relative pl-10 pb-12 last:pb-0"
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Timeline line */}
      <div
        className="absolute left-[1.1rem] top-0 bottom-0 w-px"
        style={{
          background: "linear-gradient(to bottom, rgba(124,58,237,0.7) 0%, rgba(37,99,235,0.3) 60%, transparent 100%)",
        }}
      />

      {/* Timeline node */}
      <div className="absolute left-[1.1rem] top-1.5 -translate-x-1/2">
        <motion.div
          className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-background"
          style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
          whileInView={{ scale: [0.5, 1.2, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </motion.div>
        {isFirst && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid rgba(124,58,237,0.5)" }}
            animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-6 ml-2 group">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">{position}</h3>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#7c3aed" }} />
              <span className="font-semibold" style={{ color: "#a78bfa" }}>{company}</span>
              {isFirst && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    color: "#4ade80",
                  }}
                >
                  Current
                </span>
              )}
            </div>
          </div>
          <span
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono px-3 py-1.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(124,58,237,0.06)",
              border: "1px solid rgba(124,58,237,0.15)",
            }}
          >
            <Calendar className="w-3 h-3" /> {period}
          </span>
        </div>

        <ul className="space-y-2 mb-4">
          {description.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
              <span
                className="mt-2 flex-shrink-0 w-1 h-1 rounded-full"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span key={skill} className="badge-tech text-xs">{skill}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const EducationCard = ({
  degree,
  institution,
  period,
  cgpa,
  index,
}: {
  degree: string;
  institution: string;
  period: string;
  cgpa: string;
  index: number;
}) => (
  <motion.div
    className="glass-card rounded-2xl p-6 group"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <div className="flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
      >
        <GraduationCap className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm leading-snug mb-1">{degree}</h4>
        <p className="text-sm font-medium mb-2" style={{ color: "#a78bfa" }}>{institution}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Calendar className="w-3 h-3" /> {period}
          </span>
          {cgpa && <span className="badge-tech text-xs">CGPA: {cgpa}</span>}
        </div>
      </div>
    </div>
  </motion.div>
);

const ExperienceSection = ({ content }: Props) => {
  const experienceData = content?.experience    ?? defaultExperience;
  const educationData  = content?.education     ?? defaultEducation;
  const highlight      = content?.experienceMeta?.highlight ?? "Led Stripe and Authorize.net payment processing and ID.me identity verification integrations at ZealousWeb, delivering secure checkout and user-verification flows.";
  const expLocation    = content?.experienceMeta?.location  ?? content?.contact?.location ?? "";

  return (
    <section
      id="experience"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "var(--section-bg)" }}
    >
      <SectionBg variant="experience" />
      <div className="absolute top-0 left-0 w-full h-px section-accent-line" />

      {/* Aurora accents */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.16) 0%, transparent 70%)",
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
          <p className="font-mono text-sm mb-3" style={{ color: "#a78bfa" }}>// my journey</p>
          <h2 className="section-heading gradient-text-animated inline-block">
            Experience &amp; Education
          </h2>
          <p className="section-subheading mt-4">
            My professional journey and academic background.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">

          {/* Work Experience */}
          <div className="lg:col-span-3">
            <motion.h3
              className="text-sm font-mono text-muted-foreground mb-8 flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Briefcase className="w-4 h-4" style={{ color: "#7c3aed" }} /> Work Experience
            </motion.h3>
            {experienceData.map((exp: any, i: number) => (
              <ExperienceCard key={exp.id ?? i} {...exp} index={i} />
            ))}
          </div>

          {/* Education + Fact */}
          <div className="lg:col-span-2">
            <motion.h3
              className="text-sm font-mono text-muted-foreground mb-8 flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <GraduationCap className="w-4 h-4" style={{ color: "#a78bfa" }} /> Education
            </motion.h3>

            <div className="space-y-4">
              {educationData.map((edu: any, i: number) => (
                <EducationCard key={edu.id ?? i} {...edu} index={i} />
              ))}
            </div>

            {/* Highlight fact box */}
            <motion.div
              className="mt-6 rounded-2xl p-5"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.18)",
                borderLeft: "3px solid #7c3aed",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              <p className="text-xs font-mono mb-1.5" style={{ color: "#a78bfa" }}>// highlight</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {highlight}
              </p>
            </motion.div>

            <motion.div
              className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <MapPin className="w-3 h-3" style={{ color: "#7c3aed" }} />
              {expLocation}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
