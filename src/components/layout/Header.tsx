"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogoLink } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-surface-border bg-background/95 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between md:h-20">
        <LogoLink display="full" size="md" priority className="sm:hidden" />
        <LogoLink display="full" size="lg" priority className="hidden sm:inline-flex" />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:text-accent",
                pathname === link.href
                  ? "text-accent"
                  : "text-white/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.contact.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-accent"
            aria-label={`Call us at ${siteConfig.contact.phone}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.contact.phone}
          </a>
          <ButtonLink href="/quote" size="sm">
            Request a Free Quote
          </ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-40 bg-background/98 backdrop-blur-lg lg:hidden"
        >
          <nav
            className="container-custom flex flex-col gap-1 py-6"
            aria-label="Mobile navigation"
          >
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3 text-lg font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent-muted text-accent"
                    : "text-white/80 hover:bg-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-surface-border" />
            <a
              href={siteConfig.contact.phoneHref}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-medium text-white/80"
            >
              <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
            <ButtonLink href="/quote" size="lg" className="mt-4 w-full">
              Request a Free Quote
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
