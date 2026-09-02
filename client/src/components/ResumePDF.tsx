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

const s = StyleSheet.create({
  /* Page */
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    backgroundColor: WHITE,
    flexDirection: "row",
  },

  /* ── Sidebar ── */
  sidebar: {
    width: "32%",
    backgroundColor: SIDEBAR,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: RULE,
  },
  photoRing: {
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: NAVY,
    marginBottom: 10,
    overflow: "hidden",
    width: 84,
    height: 84,
  },
  photo: {
    width: 84,
    height: 84,
    borderRadius: 999,
    objectFit: "cover",
    objectPosition: "center",
  },
  sbName: {
    color: NAVY,
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 2,
  },
  sbTitle: {
    color: TEAL,
    fontSize: 7.5,
    textAlign: "center",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  sbRule: {
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    marginBottom: 14,
  },

  /* Sidebar sections */
  sbSection: {
    marginBottom: 14,
  },
  sbSectionTitle: {
    color: NAVY,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 7,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: RULE,
  },

  /* Contact rows */
  ctRow: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 4,
  },
  ctLabel: {
    color: MUTED,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    width: 36,
    paddingTop: 1,
  },
  ctVal: {
    color: MID,
    fontSize: 7.5,
    flex: 1,
  },
  ctLink: {
    color: TEAL,
    fontSize: 7.5,
    textDecoration: "none",
    flex: 1,
  },

  /* Skill pills */
  skillGroup: {
    marginBottom: 7,
  },
  skillLabel: {
    color: MUTED,
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
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

  /* Also comfortable with */
  alsoWith: {
    color: MID,
    fontSize: 6.5,
    lineHeight: 1.6,
    marginTop: 3,
  },

  /* Languages */
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  langName: {
    color: DARK,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  langLevel: {
    color: MUTED,
    fontSize: 7,
  },

  /* Education */
  eduItem: {
    marginBottom: 9,
  },
  eduDeg: {
    color: DARK,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  eduInst: {
    color: MID,
    fontSize: 7,
    marginBottom: 1,
  },
  eduMeta: {
    color: MUTED,
    fontSize: 7,
  },

  /* ── Main column ── */
  main: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },

  /* Section */
  section: {
    marginBottom: 14,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    color: NAVY,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
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
    fontSize: 8.5,
    lineHeight: 1.65,
  },

  /* Experience */
  expItem: {
    marginBottom: 11,
  },
  expTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 1,
  },
  expPos: {
    color: DARK,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  expPeriod: {
    color: WHITE,
    fontSize: 7,
    backgroundColor: NAVY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  expCo: {
    color: TEAL,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletDot: {
    color: TEAL,
    fontSize: 8,
    marginRight: 5,
    lineHeight: 1.5,
  },
  bulletTxt: {
    color: MID,
    fontSize: 8,
    flex: 1,
    lineHeight: 1.55,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 5,
  },
  tag: {
    backgroundColor: TAG_BG,
    color: TAG_TEXT,
    fontSize: 6.5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: RULE,
  },

  /* Projects */
  projItem: {
    marginBottom: 9,
    paddingLeft: 9,
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
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  projLink: {
    color: TEAL,
    fontSize: 7,
    textDecoration: "none",
  },
  projDesc: {
    color: MID,
    fontSize: 8,
    lineHeight: 1.55,
    marginBottom: 4,
  },
});

/* ── Types ── */
export interface ResumeData {
  site: { fullName: string };
  hero: {
    name: string;
    roles: string[];
    bio: string;
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
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    demoLink: string;
  }>;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionLine} />
    </View>
  );
}

export function ResumePDF({ data, photoUrl }: { data: ResumeData; photoUrl: string }) {
  const { site, hero, contact, skills, experience, education, projects } = data;
  // Content may carry {{years}} and friends, same as the site.
  const career = deriveCareer(data);
  const fullName = site?.fullName ?? hero?.name ?? "Resume";
  const linkedinShort = hero.linkedinUrl?.replace("https://www.linkedin.com/in/", "linkedin.com/in/") ?? hero.linkedinUrl ?? "";
  const githubShort   = hero.githubUrl?.replace("https://github.com/", "github.com/") ?? hero.githubUrl ?? "";

  return (
    <Document title={`${fullName} — Resume`} author={fullName}>
      <Page size="A4" style={s.page}>

        {/* ════════════ SIDEBAR ════════════ */}
        <View style={s.sidebar}>

          {/* Photo */}
          {photoUrl ? (
            <View style={s.photoRing}>
              <Image src={photoUrl} style={s.photo} />
            </View>
          ) : null}

          <Text style={s.sbName}>{fullName}</Text>
          <Text style={s.sbTitle}>{hero.roles[0]}</Text>
          <View style={s.sbRule} />

          {/* Contact */}
          <View style={s.sbSection}>
            <Text style={s.sbSectionTitle}>Contact</Text>
            <View style={s.ctRow}>
              <Text style={s.ctLabel}>Email</Text>
              <Link src={`mailto:${contact.email}`} style={s.ctLink}>{contact.email}</Link>
            </View>
            <View style={s.ctRow}>
              <Text style={s.ctLabel}>Phone</Text>
              <Text style={s.ctVal}>{contact.phone}</Text>
            </View>
            <View style={s.ctRow}>
              <Text style={s.ctLabel}>City</Text>
              <Text style={s.ctVal}>{contact.location}</Text>
            </View>
            <View style={s.ctRow}>
              <Text style={s.ctLabel}>LinkedIn</Text>
              <Link src={hero.linkedinUrl} style={s.ctLink}>{linkedinShort}</Link>
            </View>
            <View style={s.ctRow}>
              <Text style={s.ctLabel}>GitHub</Text>
              <Link src={hero.githubUrl} style={s.ctLink}>{githubShort}</Link>
            </View>
          </View>

          {/* Skills */}
          <View style={s.sbSection}>
            <Text style={s.sbSectionTitle}>Technical Skills</Text>
            <View style={s.skillGroup}>
              <Text style={s.skillLabel}>Frontend</Text>
              <View style={s.pillRow}>
                {skills.frontend.slice(0, 8).map((sk) => (
                  <Text key={sk} style={s.pill}>{sk}</Text>
                ))}
              </View>
            </View>
            <View style={s.skillGroup}>
              <Text style={s.skillLabel}>Backend</Text>
              <View style={s.pillRow}>
                {skills.backend.slice(0, 5).map((sk) => (
                  <Text key={sk} style={s.pill}>{sk}</Text>
                ))}
              </View>
            </View>
            <View style={s.skillGroup}>
              <Text style={s.skillLabel}>Database</Text>
              <View style={s.pillRow}>
                {skills.database.slice(0, 4).map((sk) => (
                  <Text key={sk} style={s.pill}>{sk}</Text>
                ))}
              </View>
            </View>
            <View style={s.skillGroup}>
              <Text style={s.skillLabel}>DevOps & Tools</Text>
              <View style={s.pillRow}>
                {skills.devops.slice(0, 5).map((sk) => (
                  <Text key={sk} style={s.pill}>{sk}</Text>
                ))}
              </View>
            </View>
            {skills.alsoComfortableWith ? (
              <View style={s.skillGroup}>
                <Text style={s.skillLabel}>Also comfortable with</Text>
                <Text style={s.alsoWith}>{skills.alsoComfortableWith}</Text>
              </View>
            ) : null}
          </View>

          {/* Education */}
          <View style={s.sbSection}>
            <Text style={s.sbSectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.institution} style={s.eduItem}>
                <Text style={s.eduDeg}>{edu.degree}</Text>
                <Text style={s.eduInst}>{edu.institution}</Text>
                <Text style={s.eduMeta}>{edu.period} · CGPA {edu.cgpa}</Text>
              </View>
            ))}
          </View>

          {/* Languages */}
          {skills.languages?.length ? (
            <View style={s.sbSection}>
              <Text style={s.sbSectionTitle}>Languages</Text>
              {skills.languages.map((lang) => (
                <View key={lang.name} style={s.langRow}>
                  <Text style={s.langName}>{lang.name}</Text>
                  <Text style={s.langLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          ) : null}

        </View>

        {/* ════════════ MAIN ════════════ */}
        <View style={s.main}>

          {/* Summary */}
          <View style={s.section}>
            <SectionHeader title="Professional Summary" />
            <Text style={s.summary}>{resolveCareerTokens(hero.bio, career)}</Text>
          </View>

          {/* Experience */}
          <View style={s.section}>
            <SectionHeader title="Experience" />
            {experience.map((exp) => (
              <View key={exp.company} style={s.expItem}>
                <View style={s.expTopRow}>
                  <Text style={s.expPos}>{exp.position}</Text>
                  <Text style={s.expPeriod}>{exp.period}</Text>
                </View>
                <Text style={s.expCo}>{exp.company}</Text>
                {exp.description.slice(0, 4).map((line, i) => (
                  <View key={i} style={s.bullet}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletTxt}>{line}</Text>
                  </View>
                ))}
                <View style={s.tagRow}>
                  {exp.skills.map((sk) => (
                    <Text key={sk} style={s.tag}>{sk}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Projects */}
          <View style={s.section}>
            <SectionHeader title="Key Projects" />
            {projects.slice(0, 3).map((proj) => (
              <View key={proj.title} style={s.projItem}>
                <View style={s.projTopRow}>
                  <Text style={s.projTitle}>{proj.title}</Text>
                  <Link src={proj.demoLink} style={s.projLink}>{proj.demoLink}</Link>
                </View>
                <Text style={s.projDesc}>
                  {proj.description.length > 190
                    ? proj.description.slice(0, 190) + "…"
                    : proj.description}
                </Text>
                <View style={s.tagRow}>
                  {proj.technologies.map((t) => (
                    <Text key={t} style={s.tag}>{t}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

        </View>
      </Page>
    </Document>
  );
}
