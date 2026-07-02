import { siteConfig } from "@/lib/site-config";

/** Dashboard layout — no public header/footer */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-dashboard aria-label={`${siteConfig.name} dashboard`}>
      {children}
    </div>
  );
}
