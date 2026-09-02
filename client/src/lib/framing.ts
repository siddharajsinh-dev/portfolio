/* ══════════════════════════════════════════════════════════════
   PHOTO FRAMING
   One rule for how the profile photo is cropped into a circle,
   shared by the hero (CSS object-fit) and the résumé PDF (a canvas
   crop). Both read the same stored values, so the face sits in the
   same place in both places.
   ══════════════════════════════════════════════════════════════ */

/** Portrait headshots put the head near the top, so centring cuts it off. */
export const DEFAULT_FRAMING_POSITION = "50% 25%";
export const DEFAULT_FRAMING_ZOOM = 1;

export type Framing = { x: number; y: number; zoom: number };

/** "50% 18%" → { x: 0.5, y: 0.18 }. Falls back to the default on anything unparseable. */
export const parseFraming = (position?: string, zoom?: unknown): Framing => {
  const parts = String(position ?? DEFAULT_FRAMING_POSITION).trim().split(/\s+/);
  const pct = (raw: string | undefined, fallback: number) => {
    const value = parseFloat(String(raw ?? ""));
    return Number.isFinite(value) ? Math.min(Math.max(value / 100, 0), 1) : fallback;
  };
  const x = pct(parts[0], 0.5);
  return {
    x,
    y: pct(parts[1] ?? parts[0], 0.25),
    zoom: Math.min(Math.max(Number(zoom) || DEFAULT_FRAMING_ZOOM, 1), 4),
  };
};

/**
 * The source-pixel square that CSS `object-fit: cover` with this
 * `object-position` would show, for a square target box.
 *
 * Cover into a square scales the shorter side to fit, so the visible
 * window is `min(w, h)` on a side and the longer axis is offset by
 * `(length - window) * position` — the same arithmetic the browser and
 * @react-pdf/renderer both apply.
 */
export const coverCropRect = (
  imageWidth: number,
  imageHeight: number,
  framing: Framing,
): { sx: number; sy: number; size: number } => {
  const size = Math.min(imageWidth, imageHeight) / framing.zoom;
  const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
  return {
    size: Math.round(size),
    sx: Math.round(clamp((imageWidth - size) * framing.x, imageWidth - size)),
    sy: Math.round(clamp((imageHeight - size) * framing.y, imageHeight - size)),
  };
};
