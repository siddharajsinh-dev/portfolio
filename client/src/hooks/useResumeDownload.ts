import { useEffect, useRef, useState } from "react";
import { pdf, type DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { ResumePDF, type ResumeData } from "@/components/ResumePDF";

let cachedBlobUrl: string | null = null;
let generationPromise: Promise<string> | null = null;

export function clearResumeCache() {
  if (cachedBlobUrl) URL.revokeObjectURL(cachedBlobUrl);
  cachedBlobUrl = null;
  generationPromise = null;
}

/**
 * Builds the PDF in the browser from the live content, so the download
 * always matches what the admin has published. The ATS layout prints no
 * photo, so there is nothing to fetch beyond the content itself.
 */
async function generateResumeBlobUrl(): Promise<string> {
  if (cachedBlobUrl) return cachedBlobUrl;
  if (generationPromise) return generationPromise;

  generationPromise = (async () => {
    const res = await fetch("/api/content");
    if (!res.ok) throw new Error("Failed to fetch portfolio data");
    const data: ResumeData = await res.json();

    const element = React.createElement(ResumePDF, { data }) as React.ReactElement<DocumentProps>;

    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    cachedBlobUrl = url;
    return url;
  })();

  try {
    return await generationPromise;
  } finally {
    generationPromise = null;
  }
}

const FALLBACK_RESUME_URL = "/resume";
const FILENAME = "Siddharajsinh_Chauhan_Resume.pdf";

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function useResumeDownload() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const blobUrlRef = useRef<string | null>(cachedBlobUrl);

  // Pre-generate in background as soon as this hook mounts
  useEffect(() => {
    if (cachedBlobUrl) { setReady(true); return; }
    generateResumeBlobUrl()
      .then((url) => { blobUrlRef.current = url; setReady(true); })
      .catch((err) => {
        console.error("Resume pre-generation failed:", err);
        setUseFallback(true);
        setReady(true); // unblock the button so user can still download
      });
  }, []);

  async function downloadResume() {
    if (loading) return;

    // If pre-generation failed, fall back to the server-side /resume endpoint
    if (useFallback) {
      triggerDownload(FALLBACK_RESUME_URL, FILENAME);
      return;
    }

    setLoading(true);
    try {
      const url = blobUrlRef.current ?? await generateResumeBlobUrl();
      blobUrlRef.current = url;
      triggerDownload(url, FILENAME);
    } catch (err) {
      console.error("Resume download failed:", err);
      // Fall back to server-side PDF rather than showing an error
      setUseFallback(true);
      triggerDownload(FALLBACK_RESUME_URL, FILENAME);
    } finally {
      setLoading(false);
    }
  }

  return { downloadResume, loading: loading || !ready, ready };
}
