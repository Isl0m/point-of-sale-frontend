import AdminLayout from "@/components/admin/admin-layout";
import { CategoryManager } from "@/components/admin/category-manager";
import { CategoryQuickAdd } from "@/components/admin/category-quick-add";

export default function CategoriesPage() {
  return (
    <AdminLayout title="Categories">
      <div className="mb-6">
        <CategoryQuickAdd />
      </div>

      <CategoryManager />
    </AdminLayout>
  );
}
