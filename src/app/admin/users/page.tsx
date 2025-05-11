import AdminLayout from "@/components/admin/admin-layout";
import { UserManager } from "@/components/admin/user-manager";

export default function UsersPage() {
  return (
    <AdminLayout title="Users">
      <UserManager />
    </AdminLayout>
  );
}
