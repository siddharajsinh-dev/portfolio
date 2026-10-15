import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createHmac, randomBytes } from "crypto";

// ── Default content (seeds Blobs on first deploy) ─────────────────────────────
const DEFAULT_CONTENT = {
  "site": {
    "logoText": "SID.",
    "logoSubtext": "Full-Stack Engineer",
    "fullName": "Siddharajsinh Chauhan",
    "tagline": "Crafting scalable, beautiful web experiences with modern technologies.",
    "pageTitle": "Siddharajsinh Chauhan — Full-Stack Software Engineer",
    "hireMeText": "Open to full-time (direct or via EOR) and contract roles."
  },
  "hero": {
    "greeting": "Available for opportunities",
    "name": "Siddharajsinh Chauhan",
    "shortName": "Siddharajsinh",
    "roles": [
      "Full-Stack Software Engineer",
      "React & Next.js Expert",
      "Node.js Engineer",
      "TypeScript Enthusiast"
    ],
    "bio": "{{years}}+ years crafting scalable, high-performance web applications with React, TypeScript, and Node.js. I turn complex problems into clean, elegant solutions.",
    "stats": [
      {
        "value": "{{years}}+",
        "label": "Years Exp"
      },
      {
        "value": "10+",
        "label": "Projects"
      },
      {
        "value": "{{companies}}",
        "label": "Companies"
      }
    ],
    "linkedinUrl": "https://linkedin.com/in/siddharajsinh-chauhan-410741199",
    "githubUrl": "https://github.com/siddharajsinh-dev",
    "email": "siddharajkc294000@gmail.com",
    "heroImage": "/assets-static/images/sid-headshot.jpg",
    "logoImage": "/assets-static/images/sid-avatar.png",
    "techBadges": [
      "TypeScript",
      "React.js",
      "Next.js",
      "Node.js"
    ],
    "techPills": [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL"
    ],
    "heroImagePosition": "50% 18%",
    "heroImageZoom": 1,
    "resumeHeadline": "Full-Stack Software Engineer",
    "resumeSubheadline": "Ecommerce · React.js · TypeScript · Next.js · Node.js",
    "resumeSummary": "Full-stack software engineer with {{years}}+ years building ecommerce web applications for USA, UK and European clients, mainly meal delivery and online retail. Primary developer on 5+ production sites, building about 90% of each: storefront, cart, checkout, payments, subscriptions and order processing. React.js, TypeScript and Next.js on the frontend; Node.js/Express.js, Python/FastAPI and ASP.NET Core on the backend. Ship production code daily with AI coding tools (Claude Code), reviewing every change against real requirements."
  },
  "about": {
    "paragraphs": [
      "I'm a Full-Stack Software Engineer with {{years}}+ years of experience building and scaling production web applications. My passion lies in crafting intuitive, performant, and beautiful solutions — from pixel-perfect React UIs to resilient Node.js backends.",
      "React and TypeScript are my primary tools of choice. I've spent the last few years building complex SPAs, optimizing performance, integrating payment gateways like Stripe, and shipping features that real users rely on every day.",
      "Outside of coding, I enjoy hiking, playing cricket, reading tech blogs, and contributing to open-source. I thrive in collaborative Agile environments and I'm always excited to take on new challenges."
    ],
    "subheading": "Full-Stack Software Engineer based in Ahmedabad, India — building production-grade web apps since {{since}}.",
    "stats": [
      {
        "value": "{{years}}+",
        "label": "Years of Experience",
        "sub": "Since {{since}}"
      },
      {
        "value": "10+",
        "label": "Projects Delivered",
        "sub": "Live in production"
      },
      {
        "value": "{{companies}}",
        "label": "Companies",
        "sub": "{{companyList}}"
      },
      {
        "value": "8.3",
        "label": "CGPA",
        "sub": "B.E. Computer Engg."
      }
    ],
    "whatIDo": [
      {
        "title": "React / Next.js",
        "desc": "Pixel-perfect, accessible UIs with TypeScript, Redux, and Framer Motion"
      },
      {
        "title": "Node.js / APIs",
        "desc": "Express, REST APIs, PostgreSQL — scalable backends built for production"
      },
      {
        "title": "Cloud & DevOps",
        "desc": "AWS, Docker, CI/CD pipelines, Vite, and deployment automation"
      },
      {
        "title": "Performance",
        "desc": "Bundle splitting, lazy loading, and caching strategies for fast UX"
      }
    ],
    "careerStart": "2021-11"
  },
  "contact": {
    "location": "Ahmedabad, India",
    "email": "siddharajkc294000@gmail.com",
    "phone": "+91 8320032657",
    "linkedinUrl": "https://linkedin.com/in/siddharajsinh-chauhan-410741199",
    "githubUrl": "https://github.com/siddharajsinh-dev",
    "websiteUrl": "https://siddharajsinh-chauhan.netlify.app",
    "availabilityTitle": "Currently Available",
    "availabilityText": "Remote · available during US Eastern and UK working hours · open to full-time (direct or via EOR) and contract roles"
  },
  "skills": {
    "frontend": [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Redux",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "jQuery",
      "Bootstrap"
    ],
    "backend": [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Python",
      "FastAPI",
      "C#",
      "ASP.NET Core",
      "ASP.NET MVC"
    ],
    "database": [
      "PostgreSQL",
      "Microsoft SQL Server",
      "MongoDB",
      "Entity Framework"
    ],
    "devops": [
      "Jest",
      "Claude Code",
      "AI-assisted development and testing",
      "Git",
      "GitHub",
      "Docker",
      "AWS",
      "CI/CD"
    ],
    "additional": [
      "ReactJS",
      "NextJS",
      "TypeScript",
      "JavaScript",
      "NodeJS",
      "Python - FastAPI",
      "PostgreSQL",
      "MongoDB",
      "Bootstrap CSS",
      "HTML",
      "CSS",
      "ASP.NET Core",
      "ASP.NET MVC",
      "MSSQL"
    ],
    "coreStack": [
      {
        "name": "TypeScript / JavaScript",
        "note": "Primary language on every project since 2021"
      },
      {
        "name": "React.js / Next.js",
        "note": "Frontend for MightyMeals, By Best and daily client work since 2022"
      },
      {
        "name": "Node.js / Express",
        "note": "API and backend services alongside Python / FastAPI"
      },
      {
        "name": "Git & DevOps",
        "note": "Git, GitHub, Docker and CI/CD on every project"
      },
      {
        "name": "ASP.NET Core",
        "note": "Fields in Trust and client work, on an ASP.NET MVC / Razor background"
      }
    ],
    "items": [
      {
        "name": "React.js",
        "category": "frontend"
      },
      {
        "name": "Next.js",
        "category": "frontend"
      },
      {
        "name": "TypeScript",
        "category": "frontend"
      },
      {
        "name": "JavaScript",
        "category": "frontend"
      },
      {
        "name": "Tailwind CSS",
        "category": "frontend"
      },
      {
        "name": "Redux",
        "category": "frontend"
      },
      {
        "name": "HTML5",
        "category": "frontend"
      },
      {
        "name": "CSS3",
        "category": "frontend"
      },
      {
        "name": "Node.js",
        "category": "backend"
      },
      {
        "name": "Express.js",
        "category": "backend"
      },
      {
        "name": "Python",
        "category": "backend"
      },
      {
        "name": "FastAPI",
        "category": "backend"
      },
      {
        "name": "ASP.NET",
        "category": "backend"
      },
      {
        "name": "PostgreSQL",
        "category": "database"
      },
      {
        "name": "MongoDB",
        "category": "database"
      },
      {
        "name": "MySQL",
        "category": "database"
      },
      {
        "name": "Git",
        "category": "devops"
      },
      {
        "name": "GitHub",
        "category": "devops"
      },
      {
        "name": "Docker",
        "category": "devops"
      },
      {
        "name": "Vite",
        "category": "devops"
      },
      {
        "name": "Webpack",
        "category": "devops"
      }
    ],
    "alsoComfortableWith": "Stripe, Authorize.net, WooCommerce REST API, ID.me, Google Maps Places API",
    "languages": [
      {
        "name": "English",
        "level": "Professional Working"
      },
      {
        "name": "Gujarati",
        "level": "Native"
      },
      {
        "name": "Hindi",
        "level": "Conversational"
      }
    ]
  },
  "experienceMeta": {
    "highlight": "Led Stripe and Authorize.net payment processing and ID.me identity verification integrations at ZealousWeb, delivering secure checkout and user-verification flows.",
    "location": "Based in Ahmedabad, India · Open to remote"
  },
  "experience": [
    {
      "id": 1,
      "position": "Lead Software Engineer (Contract)",
      "company": "FlatFour Ventures",
      "location": "USA (Remote)",
      "period": "Jul 2026 – Present",
      "description": [
        "Contract lead engineer for full-stack ecommerce work in React.js, TypeScript, Next.js and Node.js, owning architecture and releases.",
        "Work directly with clients and stakeholders to define requirements, scope the work and keep releases on schedule."
      ],
      "skills": [
        "React.js",
        "TypeScript",
        "Next.js",
        "Node.js",
        "REST APIs",
        "Payment Integration",
        "Authentication"
      ]
    },
    {
      "id": 2,
      "position": "Web Developer",
      "company": "ZealousWeb Technologies Pvt. Ltd.",
      "location": "Ahmedabad, India",
      "period": "Apr 2022 – Jun 2026",
      "description": [
        "Lead developer on MightyMeals for 4+ years (React.js, FastAPI, WooCommerce): architecture, releases, payments, subscriptions and auth.",
        "Primary developer on 5+ production ecommerce sites for USA, UK and European clients, building about 90% of each (storefront, cart, checkout, order processing) in React.js, TypeScript, Next.js and Node.js with Python/FastAPI or ASP.NET Core backends.",
        "Cut wrong delivery addresses at checkout by rebuilding address forms on the Google Maps Places API with reworked autofill logic.",
        "Accelerated page loads by 10X and shrank bundle size by 45% through code splitting and lazy loading, and re-architected complex forms into reusable components with centralized Redux state."
      ],
      "skills": [
        "React.js",
        "TypeScript",
        "Next.js",
        "Node.js",
        "Redux",
        "Stripe",
        "Authorize.net",
        "ID.me",
        "Google Maps API"
      ]
    },
    {
      "id": 3,
      "position": "Trainee",
      "company": "Aark Inosoft",
      "location": "Ahmedabad, India",
      "period": "Nov 2021 – Mar 2022",
      "description": [
        "Built responsive client websites with HTML5, CSS3, JavaScript and jQuery, and supported ASP.NET MVC backends in C# and SQL Server."
      ],
      "skills": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "jQuery",
        "ASP.NET Web Forms",
        "ASP.NET MVC",
        "C#",
        "SQL Server"
      ]
    }
  ],
  "education": [
    {
      "id": 1,
      "degree": "B.E. Computer Engineering",
      "institution": "Gujarat Technological University",
      "period": "2020 – 2023",
      "cgpa": "8.3/10"
    },
    {
      "id": 2,
      "degree": "Diploma in Computer Engineering",
      "institution": "Gujarat Technological University",
      "period": "2016 – 2019",
      "cgpa": "7.3/10"
    }
  ],
  "sections": {
    "hero": true,
    "about": true,
    "skills": true,
    "experience": true,
    "projects": true,
    "testimonials": false,
    "contact": true
  },
  "testimonials": [
    {
      "id": 1,
      "name": "Ravi Patel",
      "role": "Product Manager",
      "company": "ZealousWeb Technologies",
      "quote": "Sid turned around a complex Stripe + Authorize.net integration in record time. His TypeScript is clean, his PRs are well-structured, and he always asks the right clarifying questions before diving in.",
      "rating": 5,
      "color": "#7c3aed"
    },
    {
      "id": 2,
      "name": "Anita Sharma",
      "role": "Lead Designer",
      "company": "ZealousWeb Technologies",
      "quote": "Working with Sid on the React UI was a pleasure. He translates Figma comps pixel-perfectly and proactively suggests micro-animations that genuinely improve the UX rather than just adding noise.",
      "rating": 5,
      "color": "#2563eb"
    },
    {
      "id": 3,
      "name": "Mihir Desai",
      "role": "Backend Engineer",
      "company": "Aark Digital",
      "quote": "Sid's Node/Express APIs are consistently well-thought-out — proper error handling, sensible status codes, and he writes integration tests without being asked. A developer you can actually depend on.",
      "rating": 5,
      "color": "#06b6d4"
    },
    {
      "id": 4,
      "name": "Priya Mehta",
      "role": "Engineering Manager",
      "company": "ZealousWeb Technologies",
      "quote": "He shipped a Google Maps autocomplete feature end-to-end in 3 days with zero reported bugs. Strong self-starter who doesn't need his hand held through ambiguous requirements.",
      "rating": 5,
      "color": "#ec4899"
    },
    {
      "id": 5,
      "name": "Jatin Vora",
      "role": "Full-Stack Developer",
      "company": "Freelance Collaborator",
      "quote": "We built a multi-tenant SaaS dashboard together. Sid's performance optimisations — bundle splitting, lazy routes, memo boundaries — cut initial load from 4.2 s to under 1.3 s. Impressive stuff.",
      "rating": 5,
      "color": "#a78bfa"
    },
    {
      "id": 6,
      "name": "Sneha Kapoor",
      "role": "QA Engineer",
      "company": "ZealousWeb Technologies",
      "quote": "His code quality means our QA cycles are shorter. Fewer regressions, self-documenting components, and he actually writes unit tests alongside features. A rare find in the frontend world.",
      "rating": 5,
      "color": "#34d399"
    }
  ],
  "projects": [
    {
      "id": 1,
      "title": "MightyMeals",
      "category": "Web App",
      "description": "$18M USD annual revenue meal delivery business serving 27 states and DC with a 150+ meal menu, rated 4.8/5 on Google from 800+ reviews. Thousands of transactions a week on a headless React.js storefront over WooCommerce via REST APIs.",
      "image": "https://eatmightymeals.com/wp-content/uploads/2019/08/DSC6681.jpg",
      "technologies": [
        "React.js",
        "TypeScript",
        "Redux",
        "REST APIs",
        "WooCommerce",
        "Python/FastAPI",
        "PostgreSQL",
        "Stripe",
        "Authorize.net",
        "Claude Code"
      ],
      "demoLink": "https://mightymeals.com",
      "demoLinkText": "Live Demo",
      "displayOrder": 1,
      "resumeSubtitle": "Custom Ecommerce & Meal Delivery Platform",
      "resumeBullets": [
        "$18M USD annual revenue meal delivery business serving 27 states and DC with a 150+ meal menu, rated 4.8/5 on Google from 800+ reviews. Thousands of transactions a week on a headless React.js storefront over WooCommerce via REST APIs.",
        "Ownership: wrote 82% of the storefront's 2,900+ commits over 4.5 years, including 96% of Autoship and 89% of checkout code.",
        "Autoship (Order Planner): built the subscription system for weekly repeat orders charged to saved cards at Monday and Thursday noon ET deadlines, with change, skip, pause and cancel from My Account.",
        "Payments: Authorize.net and Stripe with saved cards, Apple Pay, Google Pay, gift cards and combined coupon and gift card redemption.",
        "Growth: Mighty Points (1 point per $1), $120/$50 referrals, affiliate tracking, Google sign-in and a 15% ID.me-verified military discount.",
        "AI-assisted delivery: rebuilt 20+ Elementor pages as static React in three days with Claude Code (17 commits, ~18k lines).",
        "AI prototype: GPT function-calling nutrition assistant (Next.js 16) with a tool loop over the live menu API and USDA FoodData Central."
      ]
    },
    {
      "id": 2,
      "title": "By Best",
      "category": "Web App",
      "description": "Storefront for a Tirana, Albania retailer of Swarovski, Swatch and Villeroy & Boch with five physical stores. React.js catalogue with brand, collection, size and price filters, load-more pagination, wishlist, My Club loyalty points and order tracking on a Laravel REST API.",
      "image": "https://bybest.shop/assets/img/bybest-logo.png",
      "technologies": [
        "React.js",
        "REST APIs",
        "Laravel"
      ],
      "demoLink": "https://bybest.shop",
      "demoLinkText": "Live Demo",
      "displayOrder": 2,
      "resumeSubtitle": "Fashion & Accessories Ecommerce Store",
      "resumeBullets": [
        "Storefront for a Tirana, Albania retailer of Swarovski, Swatch and Villeroy & Boch with five physical stores; primary frontend developer.",
        "Built the React.js catalogue with brand, collection, size and price filters, load-more pagination, wishlist, loyalty points and order tracking."
      ]
    },
    {
      "id": 3,
      "title": "Fields In Trust",
      "category": "Web App",
      "description": "Website for a 100-year-old UK charity that legally protects 3,007 parks and green spaces (13,300 hectares; 9.2M people within a ten-minute walk). Built in ASP.NET MVC, C# and Entity Framework: 'parks near me' location search, Field Change Request applications for landowners, donations, membership and content management.",
      "image": "/assets-static/images/fit.jpg",
      "technologies": [
        "ASP.NET MVC",
        "C#",
        "Entity Framework",
        "Razor Pages"
      ],
      "demoLink": "https://fieldsintrust.org",
      "demoLinkText": "Live Demo",
      "displayOrder": 3,
      "resumeSubtitle": "UK Charity Website",
      "resumeBullets": [
        "UK charity, 100 years old, that legally protects 3,007 parks and green spaces: 13,300 hectares and 9.2M people within a 10-minute walk.",
        "Built in ASP.NET MVC, C# and Entity Framework: 'parks near me' location search, Field Change Request applications for landowners, donations, membership and CMS. Lighthouse desktop: 89 performance, 100 SEO."
      ]
    }
  ],
  "awards": [
    {
      "id": 1,
      "title": "WOW Award",
      "issuer": "ZealousWeb Technologies Pvt. Ltd.",
      "date": "May 2023",
      "note": ""
    },
    {
      "id": 2,
      "title": "Employee of the Year Nominee",
      "issuer": "ZealousWeb Technologies Pvt. Ltd.",
      "date": "2025",
      "note": ""
    }
  ]
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

// ── WhatsApp notification via CallMeBot (server-side only; keys never reach the browser)
const CALLMEBOT_PHONE   = process.env.CALLMEBOT_PHONE;
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;

type SenderMeta = Partial<Record<
  "sent_at" | "timezone" | "language" | "user_agent" | "device" | "screen" | "page_url" | "referrer",
  string
>>;

async function sendWhatsApp(
  name: string, senderEmail: string, subject: string, message: string,
  meta: SenderMeta, ip: string, country: string,
) {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_API_KEY) return;
  const text = encodeURIComponent(
    [
      `📬 Portfolio Contact`,
      `👤 ${name}`,
      `📧 ${senderEmail}`,
      `📌 ${subject}`,
      `💬 ${message}`,
      ``,
      `🌍 ${country || "?"} · IP ${ip || "?"}`,
      `🕒 ${meta.sent_at ?? ""} (${meta.timezone ?? ""})`,
      `📱 ${meta.device ?? ""} ${meta.screen ?? ""} · ${meta.language ?? ""}`,
      `🧭 ${meta.user_agent ?? ""}`,
      `🔗 ${meta.page_url ?? ""} ← ${meta.referrer ?? ""}`,
    ].join("\n")
  );
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(CALLMEBOT_PHONE)}&text=${text}&apikey=${encodeURIComponent(CALLMEBOT_API_KEY)}`;
  await fetch(url);
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
      const body = await req.json() as Record<string, string> & { meta?: SenderMeta };
      const { name, email, subject, message } = body;
      if (!name || !email || !subject || !message) {
        return json({ message: "All fields are required." }, 400);
      }
      const meta: SenderMeta = body.meta ?? {};
      const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for") ?? "";
      const country = req.headers.get("x-country") ?? "";
      console.log("[Contact]", { name, email, subject, ip, country, ...meta });
      await sendWhatsApp(name, email, subject, message, meta, ip, country)
        .catch((err) => console.error("[Contact] WhatsApp failed", err));
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

    const sectionMatch = pathname.match(/^\/api\/admin\/(site|hero|about|contact|skills|experience-meta|experience|education|awards|sections)$/);
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
