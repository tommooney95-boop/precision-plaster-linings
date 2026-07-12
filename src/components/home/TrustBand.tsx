import { siteConfig } from "@/lib/site-config";
import { CheckCircle2, ClipboardList, ShieldCheck, Sparkles } from "lucide-react";

const pillars = [
  {
    icon: ClipboardList,
    title: "Clear, no-obligation quotes",
    description:
      "Tell us about the job, upload photos if you have them, and we’ll send a straightforward estimate.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured trades",
    description:
      "Work completed with care and professionalism — so homeowners and builders can book with confidence.",
  },
  {
    icon: Sparkles,
    title: "Clean finish, every time",
    description:
      "Smooth walls and ceilings, tidy sites, and finishes ready for paint — done properly the first time.",
  },
] as const;

export function TrustBand() {
  return (
    <section
      className="border-y border-surface-border bg-surface"
      aria-labelledby="trust-band-heading"
    >
      <div className="container-custom section-padding !py-14 md:!py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Why choose {siteConfig.name}
          </p>
          <h2
            id="trust-band-heading"
            className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            You&apos;re in good hands.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/60">
            No stress. No mess. Just reliable plastering from a local{" "}
            {siteConfig.location.regionName} team you can trust.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-2xl border border-surface-border bg-background/50 p-6 md:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-muted">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex items-center justify-center gap-2 text-sm text-white/40">
          <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
          Free quotes · {siteConfig.contact.hours} · Call{" "}
          <a
            href={siteConfig.contact.phoneHref}
            className="font-medium text-white/70 transition-colors hover:text-accent"
          >
            {siteConfig.contact.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
