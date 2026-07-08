export const MAX_PHOTO_FILES = 5;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export function validatePhotoFiles(
  files: File[],
  existingCount = 0
): { valid: File[]; error?: string } {
  const nonEmpty = files.filter((f) => f.size > 0);
  if (nonEmpty.length === 0) {
    return { valid: [], error: "Please choose a valid image file." };
  }

  if (existingCount + nonEmpty.length > MAX_PHOTO_FILES) {
    return {
      valid: [],
      error: `Maximum ${MAX_PHOTO_FILES} photos allowed.`,
    };
  }

  for (const file of nonEmpty) {
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return { valid: [], error: "Each photo must be under 10 MB." };
    }

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return {
        valid: [],
        error: "Only JPG, PNG, WebP and GIF images are allowed.",
      };
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return { valid: [], error: "Invalid image file type." };
    }
  }

  return { valid: nonEmpty };
}

export function photoSuccessMessage(added: number, total: number): string {
  if (added === 1 && total === 1) {
    return "Photo added successfully!";
  }
  if (added === 1) {
    return `Photo added successfully! (${total} total)`;
  }
  return `${added} photos added successfully! (${total} total)`;
}
