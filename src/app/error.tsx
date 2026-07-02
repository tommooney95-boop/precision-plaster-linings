"use client";

import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center section-padding pt-32">
      <div className="container-custom text-center">
        <p className="text-6xl font-bold text-accent">Error</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Something went wrong</h1>
        <p className="mt-4 text-white/50">
          We couldn&apos;t load this page. Please try again or contact us directly.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
