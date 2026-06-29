const COLORS = ["#4A3728", "#B5552E", "#4F6F52", "#2C6E63", "#7C3AED", "#1E3A5F", "#9C6B70", "#6B5443", "#3A6EA5", "#8A6B2E"];

/**
 * Deterministic, fully-local SVG initials avatar as a data URI — no network,
 * no rate limits, looks consistent. Works with next/image (data: passthrough).
 */
export function avatarUri(seed: string): string {
  const clean = (seed || "?").trim();
  const initials =
    clean
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  let h = 0;
  for (let i = 0; i < clean.length; i++) h = (h * 31 + clean.charCodeAt(i)) >>> 0;
  const color = COLORS[h % COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}"/><text x="40" y="40" dy="0.35em" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="600" fill="#FFFFFF" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
