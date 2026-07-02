"use client";

import { buildSummarySections } from "@/lib/quote-assistant/summary";
import type { QuoteAssistantAnswers } from "@/lib/quote-assistant/types";
import { Button } from "@/components/ui/Button";
import { Loader2 } from "lucide-react";

interface ChatSummaryProps {
  answers: QuoteAssistantAnswers;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function ChatSummary({
  answers,
  onSubmit,
  isSubmitting,
  error,
}: ChatSummaryProps) {
  const sections = buildSummarySections(answers);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-surface-border bg-surface-elevated p-4"
        >
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            {section.title}
          </h4>
          <dl className="space-y-2">
            {section.items.map((item) => (
              <div key={item.label} className="flex justify-between gap-4 text-sm">
                <dt className="shrink-0 text-white/50">{item.label}</dt>
                <dd className="text-right font-medium text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {error && (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="md"
        className="w-full"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </Button>
    </div>
  );
}
