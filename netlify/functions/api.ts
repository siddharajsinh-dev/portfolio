import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHmac, randomBytes } from "crypto";

// ── Default content (seeds Blobs on first deploy) ─────────────────────────────
const DEFAULT_CONTENT = {
  site: {
    logoText: "SID.",
    logoSubtext: "Full-Stack Dev",
    fullName: "Siddharajsinh Chauhan",
    tagline: "Crafting scalable, beautiful web experiences with modern technologies.",
    pageTitle: "Siddharajsinh Chauhan - Web Developer",
    hireMeText: "Open to full-time roles and freelance projects.",
  },
  hero: {
    greeting: "Available for opportunities",
    name: "Siddharajsinh Chauhan",
    shortName: "Siddharajsinh",
    roles: [
      "React & Next.js Expert",
      "Full-Stack Web Developer",
      "Node.js Engineer",
      "TypeScript Enthusiast",
    ],
    bio: "4+ years crafting scalable, high-performance web applications with React, TypeScript, and Node.js. I turn complex problems into clean, elegant solutions.",
    stats: [
      { value: "4+", label: "Years Exp" },
      { value: "10+", label: "Projects" },
      { value: "2", label: "Companies" },
    ],
    linkedinUrl: "https://www.linkedin.com/in/siddharajsinh-chauhan-410741199",
    githubUrl: "https://github.com/",
    email: "siddharajkc294000@gmail.com",
    heroImage: "/assets-static/images/ImportedPhoto.760428188.70688.jpeg",
    logoImage: "",
  },
  about: {
    paragraphs: [
      "I'm a Full-Stack Web Developer with 4+ years of experience building and scaling production web applications. My passion lies in crafting intuitive, performant, and beautiful solutions — from pixel-perfect React UIs to resilient Node.js backends.",
      "React and TypeScript are my primary tools of choice. I've spent the last few years building complex SPAs, optimizing performance, integrating payment gateways like Stripe, and shipping features that real users rely on every day.",
      "Outside of coding, I enjoy hiking, playing cricket, reading tech blogs, and contributing to open-source. I thrive in collaborative Agile environments and I'm always excited to take on new challenges.",
    ],
  },
  contact: {
    location: "Ahmedabad, India",
    email: "siddharajkc294000@gmail.com",
    phone: "+91 8320032657",
    linkedinUrl: "https://www.linkedin.com/in/siddharajsinh-chauhan-410741199",
    githubUrl: "https://github.com/",
  },
  skills: {
    frontend: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Redux", "Tailwind CSS", "Bootstrap", "Framer Motion"],
    backend: ["Node.js", "Express.js", "REST APIs", "Python (FastAPI)", "ASP.NET Core", "Entity Framework", "C#"],
    database: ["PostgreSQL", "MSSQL", "MongoDB", "Entity Framework", "SQL Server"],
    devops: ["Git & GitHub", "Docker", "AWS", "CI/CD", "Linux", "Vite", "Webpack", "Jest", "Mocha"],
    additional: ["ReactJS", "NextJS", "TypeScript", "JavaScript", "NodeJS", "Python - FastAPI", "PostgreSQL", "MongoDB", "Bootstrap CSS", "HTML", "CSS", "ASP.NET Core", "ASP.NET MVC", "MSSQL"],
    alsoComfortableWith: "Bootstrap, jQuery, C#, Entity Framework, ASP.NET MVC, Razor Pages, REST / GraphQL, Stripe / Authorize.net, Google Maps API, Jest, Mocha",
    languages: [
      { name: "English",  level: "Professional Working" },
      { name: "Gujarati", level: "Native" },
      { name: "Hindi",    level: "Conversational" },
    ],
    coreStack: [
      { name: "TypeScript / JavaScript", note: "Primary language on every project since 2021" },
      { name: "React.js / Next.js", note: "Frontend for MightyMeals, By Best and daily client work since 2022" },
      { name: "Node.js / Express", note: "API and backend services alongside Python / FastAPI" },
      { name: "Git & DevOps", note: "Git, GitHub, Docker and CI/CD on every project" },
      { name: "ASP.NET Core", note: "Fields In Trust and client work, on an ASP.NET MVC / Razor background" },
    ],
  },
  experience: [
    {
      id: 1,
      position: "Web Developer",
      company: "ZealousWeb Technologies PVT LTD.",
      period: "Apr 2022 - Present",
      description: [
        "Developed and maintained full-stack web applications using React, TypeScript, and Node.js",
        "Led the integration of third-party services including Stripe, Authorize.net, and ID.me for secure payments and user verification",
        "Built dynamic address forms using Google Maps Places Autocomplete and optimized autofill logic for better UX and accuracy",
        "Improved frontend architecture by modularizing form components and leveraging Redux for predictable state management",
        "Enhanced performance by optimizing bundle size and implementing lazy loading, resulting in 30% faster load times",
        "Collaborated closely with designers and backend teams in Agile sprints to deliver responsive, accessible, and scalable applications",
      ],
      skills: ["ReactJS", "TypeScript", "Next.js", "NodeJS", "Redux", "Python - FastAPI", "ASP.NET Core", "JavaScript"],
    },
    {
      id: 2,
      position: "Trainee",
      company: "Aark Inosoft",
      period: "Nov 2021 - Mar 2022",
      description: [
        "Developed responsive websites for various clients using HTML5, CSS3, and JavaScript",
        "Implemented interactive features with JavaScript and jQuery to enhance user engagement",
        "Supported senior developers with backend tasks in ASP.NET Web Forms and MVC, gaining hands-on experience with C# and SQL Server",
        "Participated in QA testing and bug fixing to ensure cross-browser compatibility and mobile responsiveness",
      ],
      skills: ["HTML5", "CSS3", "JavaScript", "jQuery", "ASP.NET Web Forms", "ASP.NET MVC"],
    },
  ],
  education: [
    { id: 1, degree: "Bachelor of Engineering in Computer Engineering", institution: "D.A. Degree Engineering & Technology", period: "2020 - 2023", cgpa: "8.3/10.0" },
    { id: 2, degree: "Diploma in Computer Engineering", institution: "D.A. Diploma Engineering & Technology", period: "2016 - 2019", cgpa: "7.3/10.0" },
  ],
  sections: {
    hero: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    testimonials: false,
    contact: true,
  },
  testimonials: [
    { id: 1, name: "Ravi Patel", role: "Product Manager", company: "ZealousWeb Technologies", quote: "Sid turned around a complex Stripe + Authorize.net integration in record time. His TypeScript is clean, his PRs are well-structured, and he always asks the right clarifying questions before diving in.", rating: 5, color: "#7c3aed" },
    { id: 2, name: "Anita Sharma", role: "Lead Designer", company: "ZealousWeb Technologies", quote: "Working with Sid on the React UI was a pleasure. He translates Figma comps pixel-perfectly and proactively suggests micro-animations that genuinely improve the UX rather than just adding noise.", rating: 5, color: "#2563eb" },
    { id: 3, name: "Mihir Desai", role: "Backend Engineer", company: "Aark Digital", quote: "Sid's Node/Express APIs are consistently well-thought-out — proper error handling, sensible status codes, and he writes integration tests without being asked. A developer you can actually depend on.", rating: 5, color: "#06b6d4" },
    { id: 4, name: "Priya Mehta", role: "Engineering Manager", company: "ZealousWeb Technologies", quote: "He shipped a Google Maps autocomplete feature end-to-end in 3 days with zero reported bugs. Strong self-starter who doesn't need his hand held through ambiguous requirements.", rating: 5, color: "#ec4899" },
    { id: 5, name: "Jatin Vora", role: "Full-Stack Developer", company: "Freelance Collaborator", quote: "We built a multi-tenant SaaS dashboard together. Sid's performance optimisations — bundle splitting, lazy routes, memo boundaries — cut initial load from 4.2 s to under 1.3 s. Impressive stuff.", rating: 5, color: "#a78bfa" },
    { id: 6, name: "Sneha Kapoor", role: "QA Engineer", company: "ZealousWeb Technologies", quote: "His code quality means our QA cycles are shorter. Fewer regressions, self-documenting components, and he actually writes unit tests alongside features. A rare find in the frontend world.", rating: 5, color: "#34d399" },
  ],
  projects: [
    {
      id: 1,
      title: "MightyMeals",
      category: "Web App",
      description: "MightyMeals is a meal delivery platform offering fresh, chef-prepared meals with a seamless user experience. I worked on the React.js frontend, implementing a responsive and intuitive UI. My contributions included integrating secure payment gateways, optimizing the checkout flow, and developing the order creation functionality.",
      resumeDescription: "Built the React.js frontend with a responsive UI, integrated secure payment gateways, optimized the checkout flow, and developed the order creation functionality.",
      image: "https://eatmightymeals.com/wp-content/uploads/2019/08/DSC6681.jpg",
      technologies: ["ReactJS", "WordPress", "Python - FastAPI"],
      demoLink: "https://mightymeals.com/",
      demoLinkText: "Live Demo",
      displayOrder: 1,
    },
    {
      id: 2,
      title: "By Best",
      category: "Web App",
      description: "By Best is an eCommerce platform for fashion and accessories, offering clothing for men, women, and kids, along with jewelry, sunglasses, and more. I worked on the React.js frontend, building responsive product pages, optimizing filtering and search functionality, and integrating dynamic cart and checkout experiences.",
      resumeDescription: "Built responsive React.js product pages, optimized filtering and search functionality, and integrated the dynamic cart and checkout experience.",
      image: "https://bybest.shop/assets/img/bybest-logo.png",
      technologies: ["ReactJS", "Laravel"],
      demoLink: "https://bybest.shop/",
      demoLinkText: "Live Demo",
      displayOrder: 2,
    },
    {
      id: 3,
      title: "Fields In Trust",
      category: "Web App",
      description: "Fields In Trust is a UK-based charity dedicated to protecting parks, playgrounds, and green spaces for future generations. I contributed to the development of their ASP.NET MVC website, focusing on implementing dynamic content management, building secure and maintainable web forms, and integrating location-based features to help users find protected fields and sites across the UK.",
      resumeDescription: "Developed the ASP.NET MVC website: dynamic content management, secure and maintainable web forms, and location-based features to help users find protected fields across the UK.",
      image: "/assets-static/images/fit.jpg",
      technologies: ["ASP.NET MVC", "C#", "Razor Pages", "Entity Framework"],
      demoLink: "https://fieldsintrust.org/",
      demoLinkText: "Live Demo",
      displayOrder: 3,
    },
  ],
};

// ── Auth helpers (stateless HMAC-signed token, no extra library needed) ────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  return (ADMIN_PASSWORD ?? "") + "_portfolio_netlify_jwt";
}

function signToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + TTL_MS });
  const data = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verifyToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", getSecret()).update(data).digest("base64url");
  // Constant-time comparison to prevent timing attacks
  const eBuf = Buffer.from(expected);
  const sBuf = Buffer.from(sig);
  if (eBuf.length !== sBuf.length) return false;
  let diff = 0;
  for (let i = 0; i < eBuf.length; i++) diff |= eBuf[i] ^ sBuf[i];
  if (diff !== 0) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(data, "base64url").toString()) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

function getToken(req: Request): string | undefined {
  return req.headers.get("cookie")?.match(/admin_token=([^;]+)/)?.[1];
}

function isAdmin(req: Request): boolean {
  const token = getToken(req);
  return !!token && verifyToken(token);
}

// ── Response helpers ───────────────────────────────────────────────────────────
function json(data: unknown, status = 200, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

// ── Netlify Blobs: content store ───────────────────────────────────────────────
async function getContent(): Promise<Record<string, unknown>> {
  const store = getStore({ name: "portfolio-content", consistency: "strong" });
  const data = await store.get("content", { type: "json" }) as Record<string, unknown> | null;
  return data ?? (DEFAULT_CONTENT as unknown as Record<string, unknown>);
}

async function saveContent(data: unknown): Promise<void> {
  const store = getStore({ name: "portfolio-content", consistency: "strong" });
  await store.set("content", JSON.stringify(data));
}

// ── Main handler ───────────────────────────────────────────────────────────────
export default async function handler(req: Request) {
  if (!ADMIN_PASSWORD) {
    return json({ message: "ADMIN_PASSWORD env var is not configured on Netlify." }, 500);
  }

  const { pathname } = new URL(req.url);
  const method = req.method;

  try {
    // ── Public endpoints ───────────────────────────────────────────────────────

    if (pathname === "/api/content" && method === "GET") {
      return json(await getContent());
    }

    if (pathname === "/api/contact" && method === "POST") {
      const body = await req.json() as Record<string, string>;
      const { name, email, subject, message } = body;
      if (!name || !email || !subject || !message) {
        return json({ message: "All fields are required." }, 400);
      }
      console.log("[Contact]", { name, email, subject, message });
      return json({ message: "Message received." });
    }

    // ── Admin auth ─────────────────────────────────────────────────────────────

    if (pathname === "/api/admin/me" && method === "GET") {
      return json({ isAdmin: isAdmin(req) });
    }

    if (pathname === "/api/admin/login" && method === "POST") {
      const body = await req.json() as { password?: string };
      if (!body.password) return json({ message: "Password required." }, 400);
      if (body.password !== ADMIN_PASSWORD) return json({ message: "Invalid password." }, 401);
      const token = signToken();
      return json(
        { message: "Logged in." },
        200,
        { "Set-Cookie": `admin_token=${token}; HttpOnly; Path=/; Max-Age=${TTL_MS / 1000}; SameSite=Strict` },
      );
    }

    if (pathname === "/api/admin/logout" && method === "POST") {
      return json(
        { message: "Logged out." },
        200,
        { "Set-Cookie": "admin_token=; HttpOnly; Path=/; Max-Age=0" },
      );
    }

    // ── All routes below require admin auth ────────────────────────────────────

    if (!isAdmin(req)) return json({ message: "Unauthorized" }, 401);

    // ── Section updates (site / hero / about / contact / skills / experience / education)

    const sectionMatch = pathname.match(/^\/api\/admin\/(site|hero|about|contact|skills|experience-meta|experience|education|sections)$/);
    if (sectionMatch && method === "PUT") {
      // The URL segment is kebab-case; the stored key is camelCase.
      const section = sectionMatch[1] === "experience-meta" ? "experienceMeta" : sectionMatch[1];
      const body = await req.json();
      const data = await getContent();
      data[section] = body;
      await saveContent(data);
      return json({ message: "Updated." });
    }

    // ── Projects ───────────────────────────────────────────────────────────────

    if (pathname === "/api/admin/projects" && method === "POST") {
      const body = await req.json() as Record<string, unknown>;
      const data = await getContent();
      const projects = (data.projects as Record<string, unknown>[]) ?? [];
      const newId = Math.max(0, ...projects.map((p) => p.id as number)) + 1;
      const newProject = { ...body, id: newId };
      projects.push(newProject);
      projects.sort((a, b) => (a.displayOrder as number) - (b.displayOrder as number));
      data.projects = projects;
      await saveContent(data);
      return json(newProject, 201);
    }

    const projectMatch = pathname.match(/^\/api\/admin\/projects\/(\d+)$/);
    if (projectMatch) {
      const id = parseInt(projectMatch[1], 10);
      const data = await getContent();
      const projects = (data.projects as Record<string, unknown>[]) ?? [];

      if (method === "PUT") {
        const body = await req.json() as Record<string, unknown>;
        const idx = projects.findIndex((p) => p.id === id);
        if (idx === -1) return json({ message: "Not found." }, 404);
        projects[idx] = { ...projects[idx], ...body, id };
        data.projects = projects;
        await saveContent(data);
        return json({ message: "Updated." });
      }

      if (method === "DELETE") {
        const before = projects.length;
        data.projects = projects.filter((p) => p.id !== id);
        if ((data.projects as unknown[]).length === before) return json({ message: "Not found." }, 404);
        await saveContent(data);
        return json({ message: "Deleted." });
      }
    }

    // ── Testimonials ───────────────────────────────────────────────────────────

    if (pathname === "/api/admin/testimonials" && method === "POST") {
      const body = await req.json() as Record<string, unknown>;
      const data = await getContent();
      const testimonials = (data.testimonials as Record<string, unknown>[]) ?? [];
      const newId = Math.max(0, ...testimonials.map((t) => t.id as number)) + 1;
      const newT = { ...body, id: newId };
      testimonials.push(newT);
      data.testimonials = testimonials;
      await saveContent(data);
      return json(newT, 201);
    }

    const testimonialMatch = pathname.match(/^\/api\/admin\/testimonials\/(\d+)$/);
    if (testimonialMatch) {
      const id = parseInt(testimonialMatch[1], 10);
      const data = await getContent();
      const testimonials = (data.testimonials as Record<string, unknown>[]) ?? [];

      if (method === "PUT") {
        const body = await req.json() as Record<string, unknown>;
        const idx = testimonials.findIndex((t) => t.id === id);
        if (idx === -1) return json({ message: "Not found." }, 404);
        testimonials[idx] = { ...testimonials[idx], ...body, id };
        data.testimonials = testimonials;
        await saveContent(data);
        return json({ message: "Updated." });
      }

      if (method === "DELETE") {
        const before = testimonials.length;
        data.testimonials = testimonials.filter((t) => t.id !== id);
        if ((data.testimonials as unknown[]).length === before) return json({ message: "Not found." }, 404);
        await saveContent(data);
        return json({ message: "Deleted." });
      }
    }

    // ── Image upload (stored in Netlify Blobs) ─────────────────────────────────

    if (pathname === "/api/admin/upload" && method === "POST") {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (!file) return json({ message: "No file uploaded." }, 400);
      if (!file.type.startsWith("image/")) return json({ message: "Only image files are allowed." }, 400);
      if (file.size > 8 * 1024 * 1024) return json({ message: "File too large (max 8 MB)." }, 400);

      const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
      const filename = `${randomBytes(8).toString("hex")}-${Date.now()}.${ext}`;
      const buffer = await file.arrayBuffer();

      const imageStore = getStore("portfolio-uploads");
      await imageStore.set(filename, buffer, { metadata: { contentType: file.type } });

      return json({ url: `/uploads/${filename}`, name: filename });
    }

    if (pathname === "/api/admin/uploads" && method === "GET") {
      const imageStore = getStore("portfolio-uploads");
      const { blobs } = await imageStore.list();
      const uploaded = blobs
        .map(({ key }) => ({ name: key, url: `/uploads/${key}`, source: "uploads" as const }))
        .reverse();
      return json(uploaded);
    }

    // ── Resume upload (stored in Netlify Blobs under fixed key "resume") ──────

    if (pathname === "/api/admin/upload-resume" && method === "POST") {
      const formData = await req.formData();
      const file = formData.get("resume") as File | null;
      if (!file) return json({ message: "No file uploaded." }, 400);
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return json({ message: "Only PDF files are allowed." }, 400);
      }
      if (file.size > 10 * 1024 * 1024) return json({ message: "File too large (max 10 MB)." }, 400);

      const buffer = await file.arrayBuffer();
      const store = getStore("portfolio-uploads");
      await store.set("resume", buffer, { metadata: { contentType: "application/pdf" } });

      return json({ url: "/resume", message: "Resume uploaded." });
    }

    return json({ message: "Not found." }, 404);
  } catch (e: unknown) {
    console.error("[API Error]", e);
    return json({ message: "Internal server error." }, 500);
  }
}

export const config: Config = {
  path: "/api/*",
};
