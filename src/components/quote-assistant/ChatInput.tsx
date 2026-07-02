"use client";

import { Button } from "@/components/ui/Button";
import type { FlowStep } from "@/lib/quote-assistant/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";

interface ChatInputProps {
  step: FlowStep;
  onSubmit: (value: unknown) => void;
  disabled?: boolean;
}

function validateValue(step: FlowStep, value: string): string | null {
  if (step.required && !value.trim()) {
    return "This field is required.";
  }

  if (step.inputType === "email" && value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address.";
    }
  }

  if (step.inputType === "tel" && value) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      return "Please enter a valid phone number.";
    }
  }

  if (step.inputType === "number" && value) {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return "Please enter a valid area in square metres.";
    }
  }

  return null;
}

export function ChatInput({ step, onSubmit, disabled }: ChatInputProps) {
  const [textValue, setTextValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  if (step.inputType === "none") return null;

  if (step.inputType === "select" && step.options) {
    return (
      <div className="space-y-2" role="group" aria-label={step.question}>
        {step.options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit(option.value)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-left text-sm text-white transition-all",
              "hover:border-accent/50 hover:bg-accent-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              "disabled:opacity-50"
            )}
          >
            {option.label}
            <ArrowRight className="h-4 w-4 text-white/30" aria-hidden="true" />
          </button>
        ))}
      </div>
    );
  }

  if (step.inputType === "file") {
    return (
      <div className="space-y-3">
        <label className="relative block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple={step.multiple}
            disabled={disabled}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const selected = Array.from(e.target.files ?? []);
              setFiles(selected);
            }}
            aria-describedby="photo-upload-help"
          />
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-surface-border bg-surface-elevated px-4 py-4 transition-colors hover:border-accent/50">
            <Upload className="h-5 w-5 shrink-0 text-white/40" aria-hidden="true" />
            <div>
              <p className="text-sm text-white/70">
                {files.length > 0
                  ? `${files.length} photo${files.length > 1 ? "s" : ""} selected`
                  : "Tap to upload photos"}
              </p>
              <p id="photo-upload-help" className="text-xs text-white/30">
                JPG or PNG, optional
              </p>
            </div>
          </div>
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={disabled}
            onClick={() => onSubmit(files)}
          >
            {files.length > 0 ? "Continue" : "Continue without photos"}
          </Button>
        </div>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationError = validateValue(step, textValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(textValue.trim());
    setTextValue("");
  }

  const isTextarea = step.inputType === "textarea";

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {isTextarea ? (
        <textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={step.placeholder}
          disabled={disabled}
          rows={3}
          className="w-full resize-none rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          aria-label={step.question}
          aria-invalid={!!error}
        />
      ) : (
        <input
          type={step.inputType === "number" ? "number" : step.inputType}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder={step.placeholder}
          disabled={disabled}
          min={step.inputType === "number" ? "1" : undefined}
          step={step.inputType === "number" ? "any" : undefined}
          className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
          aria-label={step.question}
          aria-invalid={!!error}
          autoComplete={
            step.inputType === "tel"
              ? "tel"
              : step.inputType === "email"
                ? "email"
                : step.answerKey === "fullName"
                  ? "name"
                  : undefined
          }
        />
      )}
      {error && (
        <p className="text-xs text-accent" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="sm" className="w-full" disabled={disabled}>
        Continue
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}
