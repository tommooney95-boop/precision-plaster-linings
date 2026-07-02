import { isValidLeadId } from "@/lib/security/upload-validation";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  PHOTOS_BUCKET,
} from "@/lib/supabase/server";
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export interface SavedPhoto {
  filename: string;
  originalName: string;
}

function safeExtension(originalName: string, mimeType: string): string {
  const ext = path.extname(originalName).toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : mimeToExt(mimeType);
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mime] ?? ".jpg";
}

export function extToMime(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

function validateFilename(filename: string) {
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    throw new Error("Invalid filename");
  }
}

export async function saveLeadPhotos(
  leadId: string,
  files: { buffer: Buffer; originalName: string; mimeType: string }[]
): Promise<SavedPhoto[]> {
  if (!isValidLeadId(leadId)) {
    throw new Error("Invalid lead ID");
  }
  if (files.length === 0) return [];

  const saved: SavedPhoto[] = [];

  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = safeExtension(file.originalName, file.mimeType);
      const filename = `${Date.now()}-${i}${ext}`;
      const { error } = await sb.storage
        .from(PHOTOS_BUCKET)
        .upload(`${leadId}/${filename}`, file.buffer, {
          contentType: file.mimeType || extToMime(ext),
          upsert: false,
        });
      if (error) throw error;
      saved.push({ filename, originalName: file.originalName });
    }
    return saved;
  }

  const leadDir = path.join(UPLOADS_DIR, leadId);
  await fs.mkdir(leadDir, { recursive: true });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = safeExtension(file.originalName, file.mimeType);
    const filename = `${Date.now()}-${i}${ext}`;
    await fs.writeFile(path.join(leadDir, filename), file.buffer);
    saved.push({ filename, originalName: file.originalName });
  }

  return saved;
}

function getPhotoPath(leadId: string, filename: string): string {
  if (!isValidLeadId(leadId)) {
    throw new Error("Invalid lead ID");
  }
  validateFilename(filename);
  const resolved = path.resolve(UPLOADS_DIR, leadId, filename);
  if (!resolved.startsWith(path.resolve(UPLOADS_DIR))) {
    throw new Error("Invalid path");
  }
  return resolved;
}

/** Read a stored photo from whichever backend is active. */
export async function readLeadPhoto(
  leadId: string,
  filename: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!isValidLeadId(leadId)) {
    throw new Error("Invalid lead ID");
  }
  validateFilename(filename);

  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  const contentType = extToMime(ext);

  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data, error } = await sb.storage
      .from(PHOTOS_BUCKET)
      .download(`${leadId}/${filename}`);
    if (error || !data) return null;
    const buffer = Buffer.from(await data.arrayBuffer());
    return { buffer, contentType };
  }

  try {
    const buffer = await fs.readFile(getPhotoPath(leadId, filename));
    return { buffer, contentType };
  } catch {
    return null;
  }
}
