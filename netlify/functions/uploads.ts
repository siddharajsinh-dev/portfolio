import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async function handler(req: Request, context: Context) {
  const filename = context.params["name"];
  if (!filename) return new Response("Not found", { status: 404 });

  const imageStore = getStore("portfolio-uploads");
  const result = await imageStore.getWithMetadata(filename, { type: "arrayBuffer" });
  if (!result) return new Response("Not found", { status: 404 });

  return new Response(result.data as BodyInit, {
    headers: {
      "Content-Type": (result.metadata["contentType"] as string) ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export const config: Config = {
  path: "/uploads/:name",
};
