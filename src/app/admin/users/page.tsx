import AdminLayout from "@/components/admin/admin-layout";
import { UserManager } from "@/components/admin/user-manager";

export default function UsersPage() {
  return (
    <AdminLayout currentPage="users">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <UserManager />
    </AdminLayout>
  );
}
