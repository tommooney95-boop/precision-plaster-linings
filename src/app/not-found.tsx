import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center section-padding pt-32">
      <div className="container-custom text-center">
        <p className="text-6xl font-bold text-accent">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white">Page Not Found</h1>
        <p className="mt-4 text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/quote" variant="outline">
            Request a Free Quote
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
