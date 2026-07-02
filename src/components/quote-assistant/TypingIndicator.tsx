"use client";

import { cn } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="Assistant is typing" role="status">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface-elevated px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full bg-white/40",
              "animate-bounce"
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
