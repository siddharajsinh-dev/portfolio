import React from "react";
import { deriveCareer, resolveCareerTokens } from "@/lib/career";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

/* ── Palette ── */
const NAVY      = "#1a3a5c";   // headers, accent
const TEAL      = "#0f7490";   // links, company names
const DARK      = "#1c1c2e";   // body text
const MID       = "#4a5568";   // secondary text
const MUTED     = "#718096";   // meta / dates
const SIDEBAR   = "#f0f4f8";   // left column bg
const WHITE     = "#ffffff";
const RULE      = "#c8d8e8";   // horizontal rules
const PILL_BG   = "#e8f0f8";
const PILL_TEXT = "#1a3a5c";
const TAG_BG    = "#eef2f7";
const TAG_TEXT  = "#334155";

const SIDEBAR_WIDTH = "28%";
/** A4 height in points. With wrap off, react-pdf sizes the page to its
 *  content, so this keeps a short page at exactly A4 while a page that runs
 *  over still grows rather than paginating. */
const A4_HEIGHT = 841.89;

const s = StyleSheet.create({
  /* Page */
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    backgroundColor: WHITE,
    flexDirection: "column",
    minHeight: A4_HEIGHT,
  },

  /* ── Header band ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 13,
    paddingHorizontal: 24,
    borderBottomWidth: 1.5,
    borderBottomColor: NAVY,
    gap: 14,
  },
  photoRing: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: NAVY,
    overflow: "hidden",
    width: 58,
    height: 58,
  },
  photo: {
    width: 58,
    height: 58,
    borderRadius: 999,
    objectFit: "cover",
    objectPosition: "center",
  },
  identity: {
    flex: 1,
  },
  name: {
    color: NAVY,
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  headline: {
    color: TEAL,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  subheadline: {
    color: MUTED,
    fontSize: 7.5,
    letterSpacing: 0.3,
  },
  contactBlock: {
    alignItems: "flex-end",
    gap: 2.5,
  },
  ctRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ctLabel: {
    color: MUTED,
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  ctVal: {
    color: MID,
    fontSize: 7.5,
  },
  ctLink: {
    color: TEAL,
    fontSize: 7.5,
    textDecoration: "none",
  },

  /* ── Body: two columns ── */
  body: {
    flex: 1,
    flexDirection: "row",
  },

  /* ── Sidebar ── */
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: RULE,
  },
  sbSection: {
    marginBottom: 13,
  },
  sbSectionTitle: {
    color: NAVY,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 7,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: RULE,
  },

  /* Skill pills */
  skillGroup: {
    marginBottom: 6,
  },
  skillLabel: {
    color: MUTED,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3.5,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  pill: {
    backgroundColor: PILL_BG,
    color: PILL_TEXT,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  alsoWith: {
    color: MID,
    fontSize: 6.8,
    lineHeight: 1.5,
  },

  /* Education */
  eduItem: {
    marginBottom: 7,
  },
  eduDeg: {
    color: DARK,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.3,
    marginBottom: 1.5,
  },
  eduInst: {
    color: MID,
    fontSize: 7,
    marginBottom: 1,
  },
  eduMeta: {
    color: MUTED,
    fontSize: 6.8,
  },

  /* Awards */
  awardItem: {
    marginBottom: 6,
  },
  awardTitle: {
    color: DARK,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1.5,
  },
  awardIssuer: {
    color: MID,
    fontSize: 7,
    marginBottom: 1,
  },
  awardMeta: {
    color: MUTED,
    fontSize: 6.8,
  },

  /* ── Main column ── */
  main: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 10,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    gap: 6,
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.3,
  },
  sectionLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    marginBottom: 1,
  },

  /* Summary */
  summary: {
    color: MID,
    fontSize: 8.2,
    lineHeight: 1.5,
  },

  /* Experience */
  expItem: {
    marginBottom: 7,
  },
  expTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  expPos: {
    color: DARK,
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
  },
  expPeriod: {
    color: WHITE,
    fontSize: 6.8,
    fontFamily: "Helvetica-Bold",
    backgroundColor: NAVY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  expCoRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 4,
  },
  expCo: {
    color: TEAL,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  expLoc: {
    color: MUTED,
    fontSize: 7.2,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2.2,
  },
  bulletDot: {
    color: TEAL,
    fontSize: 8,
    marginRight: 5,
    lineHeight: 1.4,
  },
  bulletTxt: {
    color: MID,
    fontSize: 7.9,
    flex: 1,
    lineHeight: 1.4,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 3.5,
  },
  tag: {
    backgroundColor: TAG_BG,
    color: TAG_TEXT,
    fontSize: 6.3,
    paddingHorizontal: 4.5,
    paddingVertical: 1.5,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: RULE,
  },

  /* Projects */
  projItem: {
    marginBottom: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: TEAL,
  },
  projTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  projTitle: {
    color: DARK,
    fontSize: 8.8,
    fontFamily: "Helvetica-Bold",
  },
  projLink: {
    color: TEAL,
    fontSize: 6.8,
    textDecoration: "none",
  },
  projDesc: {
    color: MID,
    fontSize: 7.9,
    lineHeight: 1.4,
  },
});

/* ── Types ── */
export interface ResumeData {
  site: { fullName: string };
  hero: {
    name: string;
    roles: string[];
    bio: string;
    resumeHeadline?: string;
    resumeSubheadline?: string;
    resumeSummary?: string;
    email: string;
    heroImage: string;
    heroImagePosition?: string;
    heroImageZoom?: number;
    linkedinUrl: string;
    githubUrl: string;
  };
  contact: { location: string; phone: string; email: string };
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    alsoComfortableWith?: string;
    languages?: Array<{ name: string; level: string }>;
  };
  experience: Array<{
    position: string;
    company: string;
    location?: string;
    period: string;
    description: string[];
    skills: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    cgpa: string;
  }>;
  awards?: Array<{
    title: string;
    issuer?: string;
    date?: string;
    note?: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    resumeDescription?: string;
    technologies: string[];
    demoLink: string;
  }>;
}

/** Blank or the "#" placeholder from a freshly added project: nothing to print. */
function isRealUrl(url: string | undefined): url is string {
  const u = url?.trim() ?? "";
  return u !== "" && u !== "#";
}

const RESUME_DESC_MAX = 220;

/** Short project blurb for the PDF: the hand-written one if set, otherwise the
 *  full description cut at the last full sentence that fits, never mid-word. */
function projectSummary(p: { description: string; resumeDescription?: string }): string {
  const short = p.resumeDescription?.trim();
  if (short) return short;
  const full = p.description.trim();
  if (full.length <= RESUME_DESC_MAX) return full;
  const window = full.slice(0, RESUME_DESC_MAX);
  const lastStop = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (lastStop > RESUME_DESC_MAX * 0.4) return window.slice(0, lastStop + 1);
  const lastSpace = window.lastIndexOf(" ");
  return window.slice(0, lastSpace > 0 ? lastSpace : RESUME_DESC_MAX).replace(/[,;:]$/, "") + "…";
}

/** "https://www.linkedin.com/in/x" → "linkedin.com/in/x"; keeps the page one line and scannable. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

/** One page means a hard cap on bullets: the most recent roles get the room. */
const MAX_BULLETS = 6;
const MAX_PROJECTS = 3;

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionLine} />
    </View>
  );
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <View style={s.skillGroup}>
      <Text style={s.skillLabel}>{label}</Text>
      <View style={s.pillRow}>
        {items.map((sk) => (
          <Text key={sk} style={s.pill}>{sk}</Text>
        ))}
      </View>
    </View>
  );
}

export function ResumePDF({
  data,
  photoUrl,
  wrap = false,
}: {
  data: ResumeData;
  photoUrl: string;
  /** Pagination is off by design; a render check may turn it on to count pages. */
  wrap?: boolean;
}) {
  const { site, hero, contact, skills, experience, education, projects } = data;
  const awards = data.awards ?? [];
  // Content may carry {{years}} and friends, same as the site.
  const career = deriveCareer(data);
  // The printed headline and summary are their own fields: the typewriter
  // roles and the hero bio on the site are written to be punchy, which is
  // not what belongs on a resume.
  const headline    = hero.resumeHeadline?.trim() || hero.roles?.[0] || "";
  const subheadline = hero.resumeSubheadline?.trim() ?? "";
  const summary     = hero.resumeSummary?.trim() || hero.bio;
  const fullName = site?.fullName ?? hero?.name ?? "Resume";
  // A blank value in admin means "leave it off the resume": the row is
  // dropped entirely rather than printed with an empty label.
  const email       = contact.email?.trim() ?? "";
  const phone       = contact.phone?.trim() ?? "";
  const city        = contact.location?.trim() ?? "";
  const linkedinUrl = hero.linkedinUrl?.trim() ?? "";
  const githubUrl   = hero.githubUrl?.trim() ?? "";
  const contactRows: Array<{ label: string; value: string; href?: string }> = [
    { label: "Email",    value: email, href: email ? `mailto:${email}` : undefined },
    { label: "Phone",    value: phone },
    { label: "Location", value: city },
    { label: "LinkedIn", value: displayUrl(linkedinUrl), href: linkedinUrl },
    { label: "GitHub",   value: displayUrl(githubUrl),   href: githubUrl },
  ].filter((row) => row.value);

  return (
    <Document title={`${fullName} — Resume`} author={fullName} subject={headline}>
      {/* One-page resume by design. wrap={false} stops react-pdf from
          paginating when the columns run a few points past A4, which used
          to yield a second page containing only the sidebar background. */}
      <Page size="A4" style={s.page} wrap={wrap}>

        {/* ════════════ HEADER ════════════ */}
        <View style={s.header}>
          {photoUrl ? (
            <View style={s.photoRing}>
              <Image src={photoUrl} style={s.photo} />
            </View>
          ) : null}

          <View style={s.identity}>
            <Text style={s.name}>{fullName}</Text>
            <Text style={s.headline}>{resolveCareerTokens(headline, career)}</Text>
            {subheadline ? <Text style={s.subheadline}>{subheadline}</Text> : null}
          </View>

          {contactRows.length > 0 && (
            <View style={s.contactBlock}>
              {contactRows.map(({ label, value, href }) => (
                <View key={label} style={s.ctRow}>
                  <Text style={s.ctLabel}>{label}</Text>
                  {href
                    ? <Link src={href} style={s.ctLink}>{value}</Link>
                    : <Text style={s.ctVal}>{value}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={s.body}>

          {/* ════════════ SIDEBAR ════════════ */}
          <View style={s.sidebar}>

            {/* Skills */}
            <View style={s.sbSection}>
              <Text style={s.sbSectionTitle}>Technical Skills</Text>
              <SkillGroup label="Frontend"       items={skills.frontend} />
              <SkillGroup label="Backend"        items={skills.backend} />
              <SkillGroup label="Database"       items={skills.database} />
              <SkillGroup label="DevOps & Tools" items={skills.devops} />
              {skills.alsoComfortableWith ? (
                <View style={s.skillGroup}>
                  <Text style={s.skillLabel}>Additional Technologies</Text>
                  <Text style={s.alsoWith}>{skills.alsoComfortableWith}</Text>
                </View>
              ) : null}
            </View>

            {/* Education */}
            <View style={s.sbSection}>
              <Text style={s.sbSectionTitle}>Education</Text>
              {education.map((edu) => (
                <View key={`${edu.degree}-${edu.institution}`} style={s.eduItem}>
                  <Text style={s.eduDeg}>{edu.degree}</Text>
                  <Text style={s.eduInst}>{edu.institution}</Text>
                  <Text style={s.eduMeta}>{edu.period}{edu.cgpa ? ` · CGPA ${edu.cgpa}` : ""}</Text>
                </View>
              ))}
            </View>

            {/* Awards */}
            {awards.length > 0 && (
              <View style={[s.sbSection, s.lastSection]}>
                <Text style={s.sbSectionTitle}>Awards & Recognition</Text>
                {awards.map((a) => (
                  <View key={`${a.title}-${a.date}`} style={s.awardItem}>
                    <Text style={s.awardTitle}>{a.title}{a.date ? ` — ${a.date}` : ""}</Text>
                    {a.issuer ? <Text style={s.awardIssuer}>{a.issuer}</Text> : null}
                    {a.note ? <Text style={s.awardMeta}>{a.note}</Text> : null}
                  </View>
                ))}
              </View>
            )}

          </View>

          {/* ════════════ MAIN ════════════ */}
          <View style={s.main}>

            {/* Summary */}
            <View style={s.section}>
              <SectionHeader title="Professional Summary" />
              <Text style={s.summary}>{resolveCareerTokens(summary, career)}</Text>
            </View>

            {/* Experience */}
            <View style={s.section}>
              <SectionHeader title="Professional Experience" />
              {experience.map((exp) => (
                <View key={`${exp.company}-${exp.period}`} style={s.expItem}>
                  <View style={s.expTopRow}>
                    <Text style={s.expPos}>{exp.position}</Text>
                    <Text style={s.expPeriod}>{exp.period}</Text>
                  </View>
                  <View style={s.expCoRow}>
                    <Text style={s.expCo}>{exp.company}</Text>
                    {exp.location ? <Text style={s.expLoc}>· {exp.location}</Text> : null}
                  </View>
                  {exp.description.slice(0, MAX_BULLETS).map((line, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletTxt}>{line}</Text>
                    </View>
                  ))}
                  {exp.skills?.length ? (
                    <View style={s.tagRow}>
                      {exp.skills.map((sk) => (
                        <Text key={sk} style={s.tag}>{sk}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            {/* Projects */}
            <View style={[s.section, s.lastSection]}>
              <SectionHeader title="Key Projects" />
              {projects.slice(0, MAX_PROJECTS).map((proj, i, arr) => (
                <View key={proj.title} style={[s.projItem, i === arr.length - 1 ? s.lastSection : {}]}>
                  <View style={s.projTopRow}>
                    <Text style={s.projTitle}>{proj.title}</Text>
                    {isRealUrl(proj.demoLink) && (
                      <Link src={proj.demoLink} style={s.projLink}>{displayUrl(proj.demoLink)}</Link>
                    )}
                  </View>
                  <Text style={s.projDesc}>{projectSummary(proj)}</Text>
                  {proj.technologies?.length ? (
                    <View style={s.tagRow}>
                      {proj.technologies.map((t) => (
                        <Text key={t} style={s.tag}>{t}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
}
