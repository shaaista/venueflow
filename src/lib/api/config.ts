export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000/api/v1";

/**
 * Demo mode is the safe default for frontend-only deployments (for example Vercel).
 * The real API is only enabled when the flag is explicitly set to "true".
 */
export const API_ENABLED = process.env.NEXT_PUBLIC_API_ENABLED === "true";
