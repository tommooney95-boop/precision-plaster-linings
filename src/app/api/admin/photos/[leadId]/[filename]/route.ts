import { isDashboardAuthenticated } from "@/lib/dashboard/auth";
import { isValidLeadId } from "@/lib/security/upload-validation";
import { readLeadPhoto } from "@/lib/leads/photos";
import { getLeadById } from "@/lib/leads/store";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ leadId: string; filename: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leadId, filename } = await params;

    if (!isValidLeadId(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const lead = await getLeadById(leadId);
    if (!lead?.photos.some((p) => p.filename === filename)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const photo = await readLeadPhoto(leadId, filename);
    if (!photo) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(photo.buffer), {
      headers: {
        "Content-Type": photo.contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load photo" }, { status: 500 });
  }
}
