import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import { isValidLeadId } from "@/lib/security/upload-validation";
import { photoExists, getPhotoPath } from "@/lib/leads/photos";
import { getLeadById } from "@/lib/leads/store";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ leadId: string; filename: string }>;
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leadId, filename } = await params;

    if (!isValidLeadId(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    // Prevent path traversal
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const lead = await getLeadById(leadId);
    if (!lead?.photos.some((p) => p.filename === filename)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!(await photoExists(leadId, filename))) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = getPhotoPath(leadId, filename);
    const buffer = await fs.readFile(filePath);
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load photo" }, { status: 500 });
  }
}
