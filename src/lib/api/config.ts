export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000/api/v1";

/** Whether the app should attempt real API calls. When false, pages use mock data. */
export const API_ENABLED = process.env.NEXT_PUBLIC_API_ENABLED !== "false";
