import React from "react";
import { deriveCareer, resolveCareerTokens } from "@/lib/career";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from "@react-pdf/renderer";

/* ══════════════════════════════════════════════════════════════
   ATS-SAFE RESUME
   Single column, reading order top to bottom, one font, one accent
   colour, real text everywhere, standard "•" bullets, no photo.
   Mirrors resume/resume.html so the site download and the static
   file look the same; this one is driven by the live admin content.
   ══════════════════════════════════════════════════════════════ */

/** Carlito (SIL OFL, metric-compatible with Calibri) ships in client/assets/fonts
 *  and is served at /assets-static in dev and on Netlify. A render check running
 *  in Node can point RESUME_FONT_DIR at the folder on disk instead. */
const FONT_DIR =
  typeof window === "undefined" && typeof process !== "undefined" && process.env.RESUME_FONT_DIR
    ? process.env.RESUME_FONT_DIR
    : "/assets-static/fonts";

Font.register({
  family: "Carlito",
  fonts: [
    { src: `${FONT_DIR}/Carlito-Regular.ttf` },
    { src: `${FONT_DIR}/Carlito-Bold.ttf`, fontWeight: 700 },
    { src: `${FONT_DIR}/Carlito-Italic.ttf`, fontStyle: "italic" },
    { src: `${FONT_DIR}/Carlito-BoldItalic.ttf`, fontWeight: 700, fontStyle: "italic" },
  ],
});

// ATS rule: never hyphenate a word at a line end.
Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#1F3A5F";
const INK  = "#000000";
const GREY = "#555555";

/** US Letter is 612 x 792 pt. Margins: 0.35 in top, 0.47 in sides, 0.5 in bottom. */
const LETTER_HEIGHT = 792;
const MARGIN_X = 34;
const MARGIN_TOP = 25;
const MARGIN_BOTTOM = 36;

const s = StyleSheet.create({
  page: {
    fontFamily: "Carlito",
    fontSize: 9.5,
    lineHeight: 1.2,
    color: INK,
    backgroundColor: "#ffffff",
    paddingTop: MARGIN_TOP,
    paddingBottom: MARGIN_BOTTOM,
    paddingHorizontal: MARGIN_X,
    minHeight: LETTER_HEIGHT,
  },

  /* Header block (centred) */
  header:       { alignItems: "center" },
  name:         { fontSize: 17, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1.15, textAlign: "center" },
  title:        { fontSize: 11, fontWeight: 700, marginTop: 3, textAlign: "center" },
  contact:      { fontSize: 9.5, color: GREY, marginTop: 2, textAlign: "center" },
  availability: { fontSize: 9.5, color: GREY, fontStyle: "italic", marginTop: 1, textAlign: "center" },
  link:         { color: GREY, textDecoration: "none" },

  /* Section headings */
  h2: {
    fontSize: 10.5,
    fontWeight: 700,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 0.75,
    lineHeight: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    paddingBottom: 1.5,
    marginTop: 7,
    marginBottom: 3,
  },

  /* Technical skills: label + list, no bullets */
  skillLine: { marginBottom: 1.5 },

  /* Entries */
  entry:    { marginBottom: 4 },
  eduEntry: { marginBottom: 3 },
  row:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  roleWrap: { flex: 1, paddingRight: 12 },
  role:     { fontSize: 10.5, fontWeight: 700 },
  eduRole:  { fontSize: 10, fontWeight: 700 },
  dates:    { fontSize: 9.5, color: GREY },
  org:      { fontStyle: "italic" },
  grey:     { color: GREY },

  /* Bullets */
  list:   { marginTop: 1.5 },
  li:     { flexDirection: "row", marginBottom: 1 },
  dot:    { width: 10 },
  liText: { flex: 1 },
  bold:   { fontWeight: 700 },
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
    heroImage?: string;
    heroImagePosition?: string;
    heroImageZoom?: number;
    linkedinUrl: string;
    githubUrl: string;
  };
  contact: {
    location: string;
    phone: string;
    email: string;
    linkedinUrl?: string;
    availabilityText?: string;
  };
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
    resumeSubtitle?: string;
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

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x": visible, scannable, still clickable. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

const RESUME_DESC_MAX = 220;

/** Short project blurb: the hand-written one if set, otherwise the full
 *  description cut at the last full sentence that fits, never mid-word. */
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

/** Bullets must be one or two lines on the page: the most recent roles get the room. */
const MAX_BULLETS = 6;
const MAX_PROJECTS = 3;

function SectionHeading({ title }: { title: string }) {
  return <Text style={s.h2}>{title}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.li}>
      <Text style={s.dot}>•</Text>
      <Text style={s.liText}>{children}</Text>
    </View>
  );
}

export function ResumePDF({
  data,
  wrap = false,
}: {
  data: ResumeData;
  /** Kept for callers that still pass it; the ATS layout prints no photo. */
  photoUrl?: string;
  /** Pagination is off by design; a render check may turn it on to count pages. */
  wrap?: boolean;
}) {
  const { site, hero, contact, skills, experience, education, projects } = data;
  const career = deriveCareer(data);

  const fullName    = site?.fullName ?? hero?.name ?? "Resume";
  const headline    = resolveCareerTokens(hero.resumeHeadline?.trim() || hero.roles?.[0] || "", career);
  const subheadline = hero.resumeSubheadline?.trim() ?? "";
  const titleLine   = [headline, subheadline].filter(Boolean).join(" · ");
  const summary     = resolveCareerTokens(hero.resumeSummary?.trim() || hero.bio, career);

  const email        = contact.email?.trim() ?? "";
  const phone        = contact.phone?.trim() ?? "";
  const city         = contact.location?.trim() ?? "";
  const linkedinUrl  = (contact.linkedinUrl ?? hero.linkedinUrl)?.trim() ?? "";
  const availability = contact.availabilityText?.trim() ?? "";

  // Contact line order per ATS convention: City, Country · phone · email · LinkedIn URL.
  const contactParts: React.ReactNode[] = [];
  if (city)  contactParts.push(city);
  if (phone) contactParts.push(phone);
  if (email) contactParts.push(<Link key="email" src={`mailto:${email}`} style={s.link}>{email}</Link>);
  if (linkedinUrl) contactParts.push(<Link key="li" src={linkedinUrl} style={s.link}>{displayUrl(linkedinUrl)}</Link>);

  const skillGroups: Array<[string, string]> = [
    ["Frontend",     (skills.frontend ?? []).join(", ")],
    ["Backend",      (skills.backend ?? []).join(", ")],
    ["Databases",    (skills.database ?? []).join(", ")],
    ["Integrations", skills.alsoComfortableWith?.trim() ?? ""],
    ["Tools",        (skills.devops ?? []).join(", ")],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <Document title={`${fullName} – Resume`} author={fullName} subject={headline}>
      {/* One page by design. wrap={false} stops react-pdf from paginating
          when the content runs a few points past Letter; the page grows
          instead, which the render check catches. */}
      <Page size="LETTER" style={s.page} wrap={wrap}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{fullName}</Text>
          {titleLine ? <Text style={s.title}>{titleLine}</Text> : null}
          {contactParts.length > 0 && (
            <Text style={s.contact}>
              {contactParts.map((part, i) => (
                <React.Fragment key={i}>{i > 0 ? " · " : ""}{part}</React.Fragment>
              ))}
            </Text>
          )}
          {availability ? <Text style={s.availability}>{availability}</Text> : null}
        </View>

        {/* ── Summary ── */}
        {summary ? (
          <View>
            <SectionHeading title="Summary" />
            <Text>{summary}</Text>
          </View>
        ) : null}

        {/* ── Technical Skills ── */}
        {skillGroups.length > 0 && (
          <View>
            <SectionHeading title="Technical Skills" />
            {skillGroups.map(([label, value], i, arr) => (
              <Text key={label} style={i === arr.length - 1 ? undefined : s.skillLine}>
                <Text style={s.bold}>{label}: </Text>{value}
              </Text>
            ))}
          </View>
        )}

        {/* ── Experience ── */}
        <View>
          <SectionHeading title="Experience" />
          {experience.map((exp, i, arr) => (
            <View key={`${exp.company}-${exp.period}`} style={i === arr.length - 1 ? undefined : s.entry}>
              <View style={s.row}>
                <View style={s.roleWrap}><Text style={s.role}>{exp.position}</Text></View>
                <Text style={s.dates}>{exp.period}</Text>
              </View>
              <Text style={s.org}>
                {exp.company}
                {exp.location ? <Text style={s.grey}>{` · ${exp.location}`}</Text> : null}
              </Text>
              <View style={s.list}>
                {exp.description.slice(0, MAX_BULLETS).map((line, j) => (
                  <Bullet key={j}>{line}</Bullet>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <View>
            <SectionHeading title="Projects" />
            {projects.slice(0, MAX_PROJECTS).map((proj, i, arr) => {
              const subtitle = proj.resumeSubtitle?.trim();
              return (
                <View key={proj.title} style={i === arr.length - 1 ? undefined : s.entry}>
                  <View style={s.row}>
                    <View style={s.roleWrap}>
                      <Text style={s.role}>{subtitle ? `${proj.title} — ${subtitle}` : proj.title}</Text>
                    </View>
                    {isRealUrl(proj.demoLink) ? (
                      <Link src={proj.demoLink} style={[s.dates, s.link]}>{displayUrl(proj.demoLink)}</Link>
                    ) : null}
                  </View>
                  <View style={s.list}>
                    <Bullet>{projectSummary(proj)}</Bullet>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View>
            <SectionHeading title="Education" />
            {education.map((edu, i, arr) => (
              <View key={`${edu.degree}-${edu.institution}`} style={i === arr.length - 1 ? undefined : s.eduEntry}>
                <View style={s.row}>
                  <View style={s.roleWrap}>
                    <Text style={s.eduRole}>
                      {edu.degree}{edu.institution ? ` — ${edu.institution}` : ""}{edu.cgpa ? ` (CGPA ${edu.cgpa})` : ""}
                    </Text>
                  </View>
                  <Text style={s.dates}>{edu.period}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
