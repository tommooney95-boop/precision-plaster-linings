import { isValidLeadId } from "@/lib/security/upload-validation";

import { promises as fs } from "fs";

import path from "path";



const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");



const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);



export interface SavedPhoto {

  filename: string;

  originalName: string;

}



export async function saveLeadPhotos(

  leadId: string,

  files: { buffer: Buffer; originalName: string; mimeType: string }[]

): Promise<SavedPhoto[]> {

  if (!isValidLeadId(leadId)) {

    throw new Error("Invalid lead ID");

  }



  if (files.length === 0) return [];



  const leadDir = path.join(UPLOADS_DIR, leadId);

  await fs.mkdir(leadDir, { recursive: true });



  const saved: SavedPhoto[] = [];



  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    const ext = path.extname(file.originalName).toLowerCase();

    const safeExt = ALLOWED_EXT.has(ext) ? ext : mimeToExt(file.mimeType);

    const filename = `${Date.now()}-${i}${safeExt}`;

    await fs.writeFile(path.join(leadDir, filename), file.buffer);

    saved.push({ filename, originalName: file.originalName });

  }



  return saved;

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



export function getPhotoPath(leadId: string, filename: string): string {

  if (!isValidLeadId(leadId)) {

    throw new Error("Invalid lead ID");

  }

  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {

    throw new Error("Invalid filename");

  }

  const resolved = path.resolve(UPLOADS_DIR, leadId, filename);

  if (!resolved.startsWith(path.resolve(UPLOADS_DIR))) {

    throw new Error("Invalid path");

  }

  return resolved;

}



export async function photoExists(

  leadId: string,

  filename: string

): Promise<boolean> {

  try {

    await fs.access(getPhotoPath(leadId, filename));

    return true;

  } catch {

    return false;

  }

}


