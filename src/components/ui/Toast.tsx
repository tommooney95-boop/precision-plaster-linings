"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  visible: boolean;
  variant?: ToastVariant;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  visible,
  variant = "success",
  onDismiss,
  duration = 3500,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const isSuccess = variant === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border px-4 py-3 shadow-card animate-slide-up",
        isSuccess
          ? "border-accent/30 bg-surface-elevated"
          : "border-accent/50 bg-surface-elevated"
      )}
    >
      {isSuccess ? (
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      )}
      <p className="flex-1 text-sm font-medium text-white">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
