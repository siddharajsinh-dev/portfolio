import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "content-data.json");

export type ContentData = {
  site: {
    logoText: string;
    logoSubtext: string;
    fullName: string;
    tagline: string;
    pageTitle: string;
    hireMeText: string;
  };
  hero: {
    greeting: string;
    name: string;
    shortName: string;
    roles: string[];
    bio: string;
    stats: { value: string; label: string }[];
    linkedinUrl: string;
    githubUrl: string;
    email: string;
    heroImage?: string;
    logoImage?: string;
    techBadges: string[];
    techPills: string[];
  };
  about: {
    paragraphs: string[];
    subheading: string;
    stats: { value: string; label: string; sub: string }[];
    whatIDo: { title: string; desc: string }[];
  };
  contact: {
    location: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    githubUrl: string;
    availabilityTitle: string;
    availabilityText: string;
  };
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    devops: string[];
    additional: string[];
    coreStack: { name: string; note?: string }[];
    items: { name: string; category: string }[];
    alsoComfortableWith: string;
  };
  experience: {
    id: number;
    position: string;
    company: string;
    period: string;
    description: string[];
    skills: string[];
  }[];
  experienceMeta: {
    highlight: string;
    location: string;
  };
  education: {
    id: number;
    degree: string;
    institution: string;
    period: string;
    cgpa: string;
  }[];
  projects: {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    technologies: string[];
    demoLink: string;
    demoLinkText: string;
    displayOrder: number;
  }[];
  testimonials: {
    id: number;
    name: string;
    role: string;
    company: string;
    quote: string;
    rating: number;
    color: string;
  }[];
  sections: Record<string, boolean>;
};

function readData(): ContentData {
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as ContentData;
}

function writeData(data: ContentData): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export const content = {
  getAll(): ContentData {
    return readData();
  },

  updateSite(site: ContentData["site"]): void {
    const data = readData();
    data.site = site;
    writeData(data);
  },

  updateHero(hero: ContentData["hero"]): void {
    const data = readData();
    data.hero = hero;
    writeData(data);
  },

  updateAbout(about: ContentData["about"]): void {
    const data = readData();
    data.about = about;
    writeData(data);
  },

  updateContact(contact: ContentData["contact"]): void {
    const data = readData();
    data.contact = contact;
    writeData(data);
  },

  updateSkills(skills: ContentData["skills"]): void {
    const data = readData();
    data.skills = skills;
    writeData(data);
  },

  updateExperience(experience: ContentData["experience"]): void {
    const data = readData();
    data.experience = experience;
    writeData(data);
  },

  updateExperienceMeta(meta: ContentData["experienceMeta"]): void {
    const data = readData();
    data.experienceMeta = meta;
    writeData(data);
  },

  updateEducation(education: ContentData["education"]): void {
    const data = readData();
    data.education = education;
    writeData(data);
  },

  addProject(project: Omit<ContentData["projects"][0], "id">): ContentData["projects"][0] {
    const data = readData();
    const newId = Math.max(0, ...data.projects.map((p) => p.id)) + 1;
    const newProject = { ...project, id: newId };
    data.projects.push(newProject);
    data.projects.sort((a, b) => a.displayOrder - b.displayOrder);
    writeData(data);
    return newProject;
  },

  updateProject(id: number, updates: Partial<ContentData["projects"][0]>): boolean {
    const data = readData();
    const idx = data.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    data.projects[idx] = { ...data.projects[idx], ...updates, id };
    writeData(data);
    return true;
  },

  deleteProject(id: number): boolean {
    const data = readData();
    const before = data.projects.length;
    data.projects = data.projects.filter((p) => p.id !== id);
    if (data.projects.length === before) return false;
    writeData(data);
    return true;
  },

  updateSections(sections: Record<string, boolean>): void {
    const data = readData();
    data.sections = sections;
    writeData(data);
  },

  addTestimonial(t: Omit<ContentData["testimonials"][0], "id">): ContentData["testimonials"][0] {
    const data = readData();
    if (!data.testimonials) data.testimonials = [];
    const newId = Math.max(0, ...data.testimonials.map((x) => x.id)) + 1;
    const newT = { ...t, id: newId };
    data.testimonials.push(newT);
    writeData(data);
    return newT;
  },

  updateTestimonial(id: number, updates: Partial<ContentData["testimonials"][0]>): boolean {
    const data = readData();
    if (!data.testimonials) data.testimonials = [];
    const idx = data.testimonials.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    data.testimonials[idx] = { ...data.testimonials[idx], ...updates, id };
    writeData(data);
    return true;
  },

  deleteTestimonial(id: number): boolean {
    const data = readData();
    if (!data.testimonials) return false;
    const before = data.testimonials.length;
    data.testimonials = data.testimonials.filter((x) => x.id !== id);
    if (data.testimonials.length === before) return false;
    writeData(data);
    return true;
  },
};
