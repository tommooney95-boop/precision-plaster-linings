import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { RefreshCw } from "lucide-react";

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description: "Secure admin dashboard for Precision Plaster Linings enquiries.",
  path: "/admin",
  noIndex: true,
});

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <RefreshCw className="h-6 w-6 animate-spin text-white/30" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminDashboard />
    </Suspense>
  );
}
