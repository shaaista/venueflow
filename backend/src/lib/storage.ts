import { createClient } from "@supabase/supabase-js";
import { env, integrations } from "../config/env.js";
import { logger } from "./logger.js";

const client = integrations.supabase
  ? createClient(env.SUPABASE_URL as string, env.SUPABASE_SERVICE_KEY as string)
  : null;

type Upload = { buffer: Buffer; filename: string; mimeType: string; orgId: string };

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * Falls back to a placeholder URL in dev when storage isn't configured.
 */
export async function uploadFile({ buffer, filename, mimeType, orgId }: Upload): Promise<string> {
  const key = `${orgId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  if (!client) {
    logger.info({ key }, "📦 [dev] file upload (Supabase not configured)");
    return `https://files.local/${key}`;
  }
  const { error } = await client.storage.from(env.SUPABASE_BUCKET).upload(key, buffer, { contentType: mimeType, upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = client.storage.from(env.SUPABASE_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}
