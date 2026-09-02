/* ══════════════════════════════════════════════════════════════
   CAREER FACTS
   Year counts and company tallies go stale the moment they are
   typed by hand, so derive them from content that is already true:
   the career start date and the experience entries.

   Any content string may use these tokens — they are substituted
   wherever the string is rendered:

     {{years}}        whole years since the start date  → "4"
     {{since}}        the start date, spelled out       → "Nov 2021"
     {{companies}}    number of distinct employers      → "3"
     {{companyList}}  those employers, short names      → "ZealousWeb, Aark & FlatFour"

   A string without tokens passes through untouched.
   ══════════════════════════════════════════════════════════════ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Used when content carries no careerStart — the first month of the first job. */
const FALLBACK_START = "2021-11";

export type Career = {
  years: number;
  since: string;
  companies: number;
  companyList: string;
};

/** Accepts "2021-11" (preferred) or anything Date can parse, e.g. "Nov 2021". */
const parseStart = (value?: string): Date | null => {
  if (!value) return null;
  const ym = String(value).trim().match(/^(\d{4})-(\d{1,2})$/);
  if (ym) return new Date(Number(ym[1]), Number(ym[2]) - 1, 1);
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? null : new Date(parsed);
};

/** Whole years elapsed, so "4+" only becomes "5+" once the year is actually complete. */
const wholeYearsSince = (start: Date, now: Date): number => {
  let years = now.getFullYear() - start.getFullYear();
  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());
  if (beforeAnniversary) years--;
  return Math.max(0, years);
};

/** "ZealousWeb Technologies PVT LTD." → "ZealousWeb" */
const shortName = (company: string): string =>
  company.trim().split(/\s+/)[0].replace(/[.,]+$/, "");

const joinNames = (names: string[]): string =>
  names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;

export const deriveCareer = (content?: any, now: Date = new Date()): Career => {
  const start = parseStart(content?.about?.careerStart) ?? parseStart(FALLBACK_START)!;

  const experience = Array.isArray(content?.experience) ? content.experience : [];
  const companies: string[] = [];
  for (const entry of experience) {
    const company = typeof entry?.company === "string" ? entry.company.trim() : "";
    if (company && !companies.includes(company)) companies.push(company);
  }

  return {
    years: wholeYearsSince(start, now),
    since: `${MONTHS[start.getMonth()]} ${start.getFullYear()}`,
    companies: companies.length,
    companyList: joinNames(companies.map(shortName)),
  };
};

export const resolveCareerTokens = (text: string, career: Career): string =>
  typeof text !== "string"
    ? text
    : text
        .replace(/\{\{\s*years\s*\}\}/g, String(career.years))
        .replace(/\{\{\s*since\s*\}\}/g, career.since)
        .replace(/\{\{\s*companies\s*\}\}/g, String(career.companies))
        .replace(/\{\{\s*companyList\s*\}\}/g, career.companyList);

/* ── Stat cards ────────────────────────────────────────────────
   The years and companies cards state facts that are already
   recorded elsewhere, so they are derived rather than typed. An
   explicit token in the stored value still wins, which leaves a
   way to override the derivation from the admin.
   ────────────────────────────────────────────────────────────── */

type Stat = { value: string; label: string; sub?: string };

const hasToken = (text?: string) => typeof text === "string" && /\{\{\s*\w+\s*\}\}/.test(text);

export const resolveStat = <T extends Stat>(stat: T, career: Career): T => {
  const label = stat.label ?? "";
  const resolved = {
    ...stat,
    value: resolveCareerTokens(stat.value, career),
    ...(stat.sub === undefined ? {} : { sub: resolveCareerTokens(stat.sub, career) }),
  };

  // An explicit token means the content already says what it wants.
  if (hasToken(stat.value) || hasToken(stat.sub)) return resolved;

  if (/\byears?\b/i.test(label)) {
    return {
      ...resolved,
      value: `${career.years}+`,
      // Only rewrite a sub that is making the same "since" claim.
      ...(stat.sub && /^\s*since\b/i.test(stat.sub) ? { sub: `Since ${career.since}` } : {}),
    };
  }

  if (/\bcompan(y|ies)\b|\bemployers\b/i.test(label) && career.companies > 0) {
    return {
      ...resolved,
      value: String(career.companies),
      ...(stat.sub === undefined ? {} : { sub: career.companyList }),
    };
  }

  return resolved;
};
