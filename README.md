# Siddharajsinh Chauhan — Portfolio

Personal portfolio site for a full-stack software engineer. Built with React and TypeScript, deployed on Netlify, with a password-protected admin panel that edits the live content without a redeploy.

**Live site:** https://siddharajsinh-chauhan.netlify.app
**Resume:** [Siddharajsinh_Chauhan_Resume.pdf](resume/Siddharajsinh_Chauhan_Resume.pdf)

![Portfolio home page](docs/screenshot.jpg)

## Features

- Single-page portfolio with hero, about, skills, experience, projects, testimonials and contact sections
- Light and dark theme, animated section transitions with Framer Motion
- Contact form that sends an email and pushes a WhatsApp notification to my phone, with the API keys kept server-side
- `/admin` panel to edit every section of the site, upload images and replace the resume PDF, secured with a password and a signed HttpOnly cookie
- Site content and uploads stored in Netlify Blobs, so edits go live instantly and survive deploys
- `/resume` route that serves the latest uploaded PDF
- Resume PDF generated from HTML with headless Chrome so the file stays text-based and ATS-friendly

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Framer Motion, wouter, TanStack Query |
| Backend | Netlify Functions (TypeScript), Netlify Blobs for content and file storage |
| Local dev server | Express 4 with the same API surface, served through Vite middleware |
| Forms and validation | React Hook Form, Zod |
| Notifications | EmailJS, CallMeBot WhatsApp API |
| Resume | HTML template rendered to PDF with headless Chrome, metadata stamped with pdf-lib |

## Project structure

```
client/            React app (Vite)
  src/components/  Page sections and shared UI
  src/pages/       Home, Admin, Login
netlify/functions/ Serverless API: content, contact, admin, uploads, resume
server/            Express dev server with matching routes and seed content
shared/            Types and Zod schemas shared by client and server
resume/            Resume HTML source, build script and generated PDF
```

## Running locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

The site is served at `http://localhost:5000`. The Express dev server reads its content from `server/content-data.json`, so you can browse and edit the admin panel without any Netlify setup.

### Environment variables

Only the admin panel and contact form need these. The site itself renders without them.

| Variable | Used for |
| --- | --- |
| `ADMIN_PASSWORD` | Login for `/admin` |
| `CALLMEBOT_PHONE`, `CALLMEBOT_API_KEY` | WhatsApp notification on contact form submit |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | Email delivery for the contact form |

Put them in a `.env` file locally, or in the Netlify site settings for production.

## Deploying

The site is deployed by Netlify from this repository. `netlify.toml` runs `npm run build:netlify`, publishes `dist/public`, and routes `/api/*`, `/uploads/*` and `/resume` to the functions in `netlify/functions`.

## Rebuilding the resume PDF

```bash
npm run build:resume
```

This renders `resume/resume.html` to `resume/Siddharajsinh_Chauhan_Resume.pdf` on a single Letter page using the local Chrome install. Set `CHROME_PATH` if Chrome is not in the default location.

## Contact

- Email: siddharajkc294000@gmail.com
- LinkedIn: https://www.linkedin.com/in/siddharajsinh-chauhan-410741199
- GitHub: https://github.com/siddharajsinh-dev
