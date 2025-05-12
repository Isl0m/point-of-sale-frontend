import AdminLayout from "@/components/admin/admin-layout";
import { DashboardStats } from "@/components/admin/dashboard-stats";

export default async function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <DashboardStats />
    </AdminLayout>
  );
}
