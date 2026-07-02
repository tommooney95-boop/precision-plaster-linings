import { buildLeadFromQuoteAssistant } from "@/lib/leads/normalize";

import { saveLeadPhotos } from "@/lib/leads/photos";

import { saveLead } from "@/lib/leads/store";

import { sendQuoteAssistantEmail } from "@/lib/quote-assistant/email";

import { buildQuoteSummary } from "@/lib/quote-assistant/summary";

import type { QuoteAssistantAnswers } from "@/lib/quote-assistant/types";

import { getClientIp, rateLimit } from "@/lib/security/rate-limit";

import { fileToValidated } from "@/lib/security/upload-validation";

import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {

    const ip = getClientIp(request);

    const limit = rateLimit(`quote-assistant:${ip}`, 5, 60 * 60 * 1000);

    if (!limit.allowed) {

      return NextResponse.json(

        { error: "Too many requests. Please try again later." },

        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }

      );

    }



    const formData = await request.formData();

    const answersRaw = formData.get("answers");



    if (!answersRaw || typeof answersRaw !== "string") {

      return NextResponse.json({ error: "Missing quote data" }, { status: 400 });

    }



    let answers: QuoteAssistantAnswers;

    try {

      answers = JSON.parse(answersRaw);

    } catch {

      return NextResponse.json({ error: "Invalid quote data" }, { status: 400 });

    }



    if (!answers.fullName || !answers.phone || !answers.email || !answers.workType) {

      return NextResponse.json(

        { error: "Missing required contact or project details" },

        { status: 400 }

      );

    }



    const leadDraft = buildLeadFromQuoteAssistant(answers);

    const photoEntries = formData.getAll("photos");

    const photoBuffers: { filename: string; content: Buffer }[] = [];

    const filesToSave: { buffer: Buffer; originalName: string; mimeType: string }[] = [];



    for (const entry of photoEntries) {

      if (entry instanceof File && entry.size > 0) {

        const validated = await fileToValidated(entry);

        if (!validated) {

          return NextResponse.json({ error: "Invalid photo upload" }, { status: 400 });

        }

        photoBuffers.push({ filename: validated.originalName, content: validated.buffer });

        filesToSave.push(validated);

      }

    }



    answers.photos = undefined;



    const savedPhotos = await saveLeadPhotos(leadDraft.id, filesToSave);

    const lead = await saveLead({ ...leadDraft, photos: savedPhotos });

    const summary = buildQuoteSummary(answers);



    await sendQuoteAssistantEmail({

      answers,

      photoBuffers,

      leadScore: lead.score,

    });



    return NextResponse.json({

      success: true,

      summary,

      leadId: lead.id,

      score: lead.score.total,

      priority: lead.score.priority,

    });

  } catch (err) {

    console.error("Quote assistant submission error:", err);

    return NextResponse.json(

      { error: "Failed to process quote request" },

      { status: 500 }

    );

  }

}


