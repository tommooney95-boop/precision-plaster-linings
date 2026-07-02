import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description: "Secure admin dashboard for Precision Plaster Linings enquiries.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <AdminDashboard />;
}
