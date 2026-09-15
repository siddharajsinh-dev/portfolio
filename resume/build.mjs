/*
  Renders resume/resume.html to a single-page, text-based PDF with headless
  Chrome, then stamps the PDF metadata (Title / Author) with pdf-lib.

    node resume/build.mjs

  Output: resume/Siddharajsinh_Chauhan_Resume.pdf
*/
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PDFDocument } from "pdf-lib";

const here = dirname(fileURLToPath(import.meta.url));
const HTML = join(here, "resume.html");
const OUT = join(here, "Siddharajsinh_Chauhan_Resume.pdf");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("No Chrome/Chromium found. Set CHROME_PATH to the browser binary.");
  process.exit(1);
}

// 1. HTML -> PDF. @page in the CSS sets Letter size and 0.6in margins;
//    --no-pdf-header-footer keeps Chrome from printing the URL/date bands.
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--no-pdf-header-footer",
  `--print-to-pdf=${OUT}`,
  pathToFileURL(HTML).href,
], { stdio: ["ignore", "ignore", "inherit"] });

// 2. Metadata. Chrome sets Title from <title>; Author has to be added here.
const doc = await PDFDocument.load(readFileSync(OUT));
doc.setTitle("Siddharajsinh Chauhan – Resume");
doc.setAuthor("Siddharajsinh Chauhan");
doc.setSubject("Full-Stack Software Engineer");
doc.setCreator("resume/build.mjs");
doc.setProducer("Chrome + pdf-lib");
writeFileSync(OUT, await doc.save());

const pages = doc.getPageCount();
const kb = (statSync(OUT).size / 1024).toFixed(1);
console.log(`${OUT}\n${pages} page(s), ${kb} KB`);
if (pages !== 1) {
  console.error("Resume must be exactly one page.");
  process.exit(2);
}
