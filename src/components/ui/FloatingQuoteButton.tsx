"use client";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { Logo } from "@/components/ui/Logo";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsMobile, useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { FileText, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function FloatingQuoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const scrollVisible = useScrollDirection({
    alwaysVisible: isMobile,
    threshold: 10,
    topOffset: 80,
  });

  const isButtonVisible = scrollVisible && !isOpen;

  useFocusTrap(dialogRef, isOpen);

  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Floating CTA */}
      <button
        type="button"
        onClick={open}
        aria-label="Request a free quote"
        aria-hidden={!isButtonVisible}
        tabIndex={isButtonVisible ? 0 : -1}
        className={cn(
          "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30",
          "animate-quote-pulse hover:bg-accent-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "transition-all duration-500 ease-out",
          "sm:px-5",
          isButtonVisible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-6 opacity-0 pointer-events-none"
        )}
      >
        <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Request a Free Quote</span>
      </button>

      {/* Quote form modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={close}
            aria-label="Close quote form"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Request a free quote"
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col bg-background shadow-2xl transition-all duration-300 ease-out",
              "rounded-t-2xl sm:max-w-lg sm:rounded-2xl sm:border sm:border-surface-border",
              "animate-slide-up-modal"
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-5 py-4">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <h2 className="text-lg font-bold text-white">
                  Request a Free Quote
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-white/50 transition-colors hover:bg-surface-elevated hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              <QuoteForm compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
