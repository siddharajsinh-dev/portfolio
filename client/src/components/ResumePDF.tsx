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

/** ResumeSans (Carlito with ligatures removed; SIL OFL, metric-compatible with Calibri) ships in client/assets/fonts
 *  and is served at /assets-static in dev and on Netlify. A render check running
 *  in Node can point RESUME_FONT_DIR at the folder on disk instead. */
const FONT_DIR =
  typeof window === "undefined" && typeof process !== "undefined" && process.env.RESUME_FONT_DIR
    ? process.env.RESUME_FONT_DIR
    : "/assets-static/fonts";

Font.register({
  family: "ResumeSans",
  fonts: [
    { src: `${FONT_DIR}/ResumeSans-Regular.ttf` },
    { src: `${FONT_DIR}/ResumeSans-Bold.ttf`, fontWeight: 700 },
    { src: `${FONT_DIR}/ResumeSans-Italic.ttf`, fontStyle: "italic" },
    { src: `${FONT_DIR}/ResumeSans-BoldItalic.ttf`, fontWeight: 700, fontStyle: "italic" },
  ],
});

// ATS rule: never hyphenate a word at a line end.
Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#1F3A5F";
const INK  = "#000000";
const GREY = "#555555";

/** US Letter is 612 x 792 pt. Margins: 0.35 in top, 0.47 in sides, 0.5 in bottom. */
const MARGIN_X = 34;
const MARGIN_TOP = 25;
const MARGIN_BOTTOM = 36;

const s = StyleSheet.create({
  page: {
    fontFamily: "ResumeSans",
    fontSize: 9.5,
    lineHeight: 1.15,
    color: INK,
    backgroundColor: "#ffffff",
    paddingTop: MARGIN_TOP,
    paddingBottom: MARGIN_BOTTOM,
    paddingHorizontal: MARGIN_X,
  },

  /* Header block (centred) */
  header:       { alignItems: "center" },
  name:         { fontSize: 17, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1.15, textAlign: "center" },
  title:        { fontSize: 11, fontWeight: 700, marginTop: 3, textAlign: "center" },
  contact:      { fontSize: 9.5, color: GREY, marginTop: 2, textAlign: "center" },
  contactUrls:  { fontSize: 9.5, color: GREY, marginTop: 1, textAlign: "center" },
  availability: { fontSize: 9.5, color: GREY, fontStyle: "italic", marginTop: 1, textAlign: "center" },
  link:         { color: GREY, textDecoration: "none" },

  /* Section headings */
  h2: {
    fontSize: 10.5,
    fontWeight: 700,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 0.75,
    lineHeight: 1.15,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
    paddingBottom: 1.5,
    marginTop: 6,
    marginBottom: 2.5,
  },

  /* Technical skills: label + list, no bullets */
  skillLine: { marginBottom: 1 },

  /* Entries */
  entry:    { marginBottom: 3 },
  eduEntry: { marginBottom: 3 },
  row:      { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  roleWrap: { flex: 1, paddingRight: 12 },
  role:     { fontSize: 10.5, fontWeight: 700 },
  eduRole:  { fontSize: 10, fontWeight: 700 },
  dates:    { fontSize: 9.5, color: GREY },
  org:      { fontStyle: "italic" },
  tech:     { fontStyle: "italic", color: GREY },
  grey:     { color: GREY },

  /* Bullets */
  list:   { marginTop: 1 },
  li:     { flexDirection: "row", marginBottom: 0.5 },
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
    githubUrl?: string;
    websiteUrl?: string;
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
    /** Several bullets for the PDF; when set they replace the single description bullet. */
    resumeBullets?: string[];
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

/** Bullets for the PDF: the hand-written list if set, otherwise the one-line summary. */
function projectBullets(p: { description: string; resumeDescription?: string; resumeBullets?: string[] }): string[] {
  const list = (p.resumeBullets ?? []).map((b) => b.trim()).filter(Boolean);
  return list.length > 0 ? list : [projectSummary(p)];
}

/** "Checkout and payments: integrated ..." → bold label, plain rest. Only short
 *  labels count, so a sentence that merely contains a colon is left alone. */
function splitLabel(line: string): [string, string] | null {
  const m = /^([^:]{3,40}):\s+([\s\S]+)$/.exec(line);
  return m ? [m[1], m[2]] : null;
}

/** Bullets must be one or two lines on the page: the most recent roles get the room. */
const MAX_BULLETS = 7;
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
  wrap = true,
}: {
  data: ResumeData;
  /** Kept for callers that still pass it; the ATS layout prints no photo. */
  photoUrl?: string;
  /** Pagination stays on so the page is always standard Letter; with it off,
   *  react-pdf stretches the page to a custom height when content overflows. */
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
  const githubUrl    = (contact.githubUrl ?? hero.githubUrl)?.trim() ?? "";
  const websiteUrl   = contact.websiteUrl?.trim() ?? "";
  const availability = contact.availabilityText?.trim() ?? "";

  // Two centred contact lines: City, Country · phone · email, then the URLs.
  const contactParts: React.ReactNode[] = [];
  if (city)  contactParts.push(city);
  if (phone) contactParts.push(<Link key="phone" src={`tel:${phone.replace(/[^\d+]/g, "")}`} style={s.link}>{phone}</Link>);
  if (email) contactParts.push(<Link key="email" src={`mailto:${email}`} style={s.link}>{email}</Link>);

  const urlParts = [linkedinUrl, githubUrl, websiteUrl].filter(isRealUrl).map((url) => (
    <Link key={url} src={url} style={s.link}>{displayUrl(url)}</Link>
  ));

  const skillGroups: Array<[string, string]> = [
    ["Frontend",                (skills.frontend ?? []).join(", ")],
    ["Backend",                 (skills.backend ?? []).join(", ")],
    ["Databases",               (skills.database ?? []).join(", ")],
    ["Payments & Integrations", skills.alsoComfortableWith?.trim() ?? ""],
    ["Testing & Tools",         (skills.devops ?? []).join(", ")],
  ].filter(([, v]) => v) as Array<[string, string]>;

  return (
    <Document title={`${fullName} – Resume`} author={fullName} subject={headline}>
      {/* One standard Letter page by design. If the content ever runs past it,
          it spills onto a second page, which the render check catches. */}
      <Page size="LETTER" style={s.page} wrap={wrap}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{fullName}</Text>
          {titleLine ? <Text style={s.title}>{titleLine}</Text> : null}
          {[contactParts, urlParts].map((parts, line) => parts.length > 0 && (
            <Text key={line} style={line === 0 ? s.contact : s.contactUrls}>
              {parts.map((part, i) => (
                <React.Fragment key={i}>{i > 0 ? " · " : ""}{part}</React.Fragment>
              ))}
            </Text>
          ))}
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
                  {proj.technologies?.length ? (
                    <Text style={s.tech}>{proj.technologies.join(" · ")}</Text>
                  ) : null}
                  <View style={s.list}>
                    {projectBullets(proj).map((line, j) => {
                      const parts = splitLabel(line);
                      return (
                        <Bullet key={j}>
                          {parts ? <><Text style={s.bold}>{parts[0]}: </Text>{parts[1]}</> : line}
                        </Bullet>
                      );
                    })}
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
