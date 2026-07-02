"use client";

import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { Loader2, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";

interface DashboardLoginProps {
  onSuccess: () => void;
}

export function DashboardLogin({ onSuccess }: DashboardLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Incorrect password");
        return;
      }

      onSuccess();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted">
          <Lock className="h-6 w-6 text-accent" aria-hidden="true" />
        </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-white/50">
          {siteConfig.name} — owner access only
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Enter dashboard password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
