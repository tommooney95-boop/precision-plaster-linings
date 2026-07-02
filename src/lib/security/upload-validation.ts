const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export interface ValidatedFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export function validateUploadFiles(files: File[]): {
  valid: ValidatedFile[];
  error?: string;
} {
  if (files.length > MAX_FILES) {
    return { valid: [], error: `Maximum ${MAX_FILES} photos allowed.` };
  }

  const valid: ValidatedFile[] = [];

  for (const file of files) {
    if (file.size === 0) continue;

    if (file.size > MAX_FILE_SIZE) {
      return { valid: [], error: "Each photo must be under 10 MB." };
    }

    const ext = getSafeExtension(file.name);
    if (!ext || !ALLOWED_EXT.has(ext)) {
      return { valid: [], error: "Only JPG, PNG, WebP and GIF images are allowed." };
    }

    if (file.type && !ALLOWED_MIME.has(file.type)) {
      return { valid: [], error: "Invalid image file type." };
    }

    valid.push({
      buffer: Buffer.alloc(0), // filled by caller after validation
      originalName: sanitizeFilename(file.name),
      mimeType: file.type || mimeFromExt(ext),
    });
  }

  return { valid };
}

export async function fileToValidated(
  file: File
): Promise<{ buffer: Buffer; originalName: string; mimeType: string } | null> {
  const check = validateUploadFiles([file]);
  if (check.error || check.valid.length === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_FILE_SIZE) return null;

  return {
    buffer,
    originalName: check.valid[0].originalName,
    mimeType: check.valid[0].mimeType,
  };
}

function getSafeExtension(name: string): string | null {
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  return ext.length > 1 ? ext : null;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

function mimeFromExt(ext: string): string {
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext] ?? "application/octet-stream";
}

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidLeadId(id: string): boolean {
  return UUID_REGEX.test(id);
}
