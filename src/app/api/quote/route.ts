import { buildLeadFromQuoteForm } from "@/lib/leads/normalize";

import { sendQuoteFormEmail } from "@/lib/leads/email";

import { saveLeadPhotos } from "@/lib/leads/photos";

import { saveLead } from "@/lib/leads/store";

import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

import { fileToValidated } from "@/lib/security/upload-validation";

import type { QuoteFormData } from "@/data/quote-form";

import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {

    const ip = getClientIp(request);

    const limit = rateLimit(`quote:${ip}`, 5, 60 * 60 * 1000);

    if (!limit.allowed) {

      return NextResponse.json(

        { error: "Too many requests. Please try again later." },

        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }

      );

    }



    const contentType = request.headers.get("content-type") ?? "";



    let data: QuoteFormData;

    let photoFiles: File[] = [];



    if (contentType.includes("multipart/form-data")) {

      const formData = await request.formData();

      data = {

        fullName: formData.get("fullName") as string,

        phone: formData.get("phone") as string,

        email: formData.get("email") as string,

        address: (formData.get("address") as string) ?? "",

        suburb: formData.get("suburb") as string,

        contactMethod: formData.get("contactMethod") as QuoteFormData["contactMethod"],

        jobType: formData.get("jobType") as QuoteFormData["jobType"],

        projectSize: formData.get("projectSize") as QuoteFormData["projectSize"],

        budget: formData.get("budget") as QuoteFormData["budget"],

        startDate: (formData.get("startDate") as string) ?? "",

        description: formData.get("description") as string,

      };

      photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

    } else {

      data = await request.json();

    }



    if (!data.fullName || !data.phone || !data.email || !data.suburb || !data.jobType || !data.description) {

      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    }



    const validatedPhotos = await Promise.all(photoFiles.map((f) => fileToValidated(f)));

    if (validatedPhotos.some((p) => p === null) && photoFiles.length > 0) {

      return NextResponse.json({ error: "Invalid photo upload" }, { status: 400 });

    }



    const filesToSave = validatedPhotos.filter((p): p is NonNullable<typeof p> => p !== null);



    const leadDraft = buildLeadFromQuoteForm(data);



    const savedPhotos = await saveLeadPhotos(leadDraft.id, filesToSave);

    const lead = await saveLead({ ...leadDraft, photos: savedPhotos });



    await sendQuoteFormEmail(

      data,

      lead.score,

      filesToSave.map((f) => ({ filename: f.originalName, content: f.buffer }))

    );



    return NextResponse.json({

      success: true,

      leadId: lead.id,

      score: lead.score.total,

      priority: lead.score.priority,

    });

  } catch (err) {
    console.error("Quote submission error:", err);
    return NextResponse.json(
      { error: "Failed to process quote request" },
      { status: 500 }
    );
  }
}


