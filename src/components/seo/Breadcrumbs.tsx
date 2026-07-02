import Link from "next/link";
import { createBreadcrumbSchema } from "@/lib/seo";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = [{ name: "Home", url: "/" }, ...items.map((i) => ({ name: i.name, url: i.href }))];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBreadcrumbSchema(schemaItems)),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-white/40">
          <li>
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-white/70">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-accent">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
