"use client";

import { Button } from "@/components/ui/Button";
import {
  budgetRanges,
  contactMethods,
  jobTypes,
  projectSizes,
} from "@/data/quote-form";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white placeholder:text-white/30 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const labelClass = "mb-2 block text-sm font-medium text-white/80";

interface QuoteFormProps {
  className?: string;
  compact?: boolean;
}

export function QuoteForm({ className, compact = false }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Submission failed");

      setSubmitted(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please call us directly or try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-surface-border bg-surface p-8 text-center md:p-12",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <CheckCircle
          className="mb-4 h-16 w-16 text-accent"
          aria-hidden="true"
        />
        <h3 className="text-2xl font-bold text-white">Thank You!</h3>
        <p className="mt-3 max-w-md text-lg text-white/60">
          We&apos;ll contact you within 24 hours to discuss your project.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Submit Another Enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-surface-border bg-surface p-6 md:p-8",
        className
      )}
      aria-label="Quote request form"
    >
      {!compact && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white">Request a Free Quote</h3>
          <p className="mt-2 text-white/50">
            Fill in the details below and we&apos;ll get back to you within 24
            hours.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClass}
            placeholder="0400 000 000"
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="contactMethod" className={labelClass}>
            Preferred Contact Method
          </label>
          <select
            id="contactMethod"
            name="contactMethod"
            className={inputClass}
            defaultValue="Either"
          >
            {contactMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            className={inputClass}
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label htmlFor="suburb" className={labelClass}>
            Suburb <span className="text-accent">*</span>
          </label>
          <input
            id="suburb"
            name="suburb"
            type="text"
            required
            className={inputClass}
            placeholder="Parramatta"
          />
        </div>

        <div>
          <label htmlFor="jobType" className={labelClass}>
            Job Type <span className="text-accent">*</span>
          </label>
          <select id="jobType" name="jobType" required className={inputClass}>
            <option value="">Select job type</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="projectSize" className={labelClass}>
            Project Size
          </label>
          <select id="projectSize" name="projectSize" className={inputClass}>
            {projectSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className={labelClass}>
            Approximate Budget
          </label>
          <select id="budget" name="budget" className={inputClass}>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className={labelClass}>
            Preferred Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="photos" className={labelClass}>
            Upload Photos
          </label>
          <div className="relative">
            <input
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-describedby="photos-help"
            />
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-surface-border bg-surface-elevated px-4 py-6 transition-colors hover:border-accent/50">
              <Upload className="h-5 w-5 text-white/40" aria-hidden="true" />
              <div>
                <p className="text-sm text-white/60">
                  Click or drag photos here
                </p>
                <p id="photos-help" className="text-xs text-white/30">
                  JPG, PNG up to 10MB each
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Job Description <span className="text-accent">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className={cn(inputClass, "resize-y")}
            placeholder="Please describe your project, including any specific requirements..."
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          "Submit Quote Request"
        )}
      </Button>
    </form>
  );
}
