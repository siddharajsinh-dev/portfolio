import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async function handler(_req: Request) {
  const store = getStore("portfolio-uploads");
  const result = await store.getWithMetadata("resume", { type: "arrayBuffer" });

  if (!result) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/assets-static/doc/Sid-Resume.pdf" },
    });
  }

  return new Response(result.data as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="resume.pdf"',
      "Cache-Control": "no-cache",
    },
  });
}

export const config: Config = {
  path: "/resume",
};
