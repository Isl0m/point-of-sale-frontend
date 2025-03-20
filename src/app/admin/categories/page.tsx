import AdminLayout from "@/components/admin/admin-layout";
import { CategoryManager } from "@/components/admin/category-manager";
import { CategoryQuickAdd } from "@/components/admin/category-quick-add";

export default function CategoriesPage() {
  return (
    <AdminLayout currentPage="categories">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      <div className="mb-6">
        <CategoryQuickAdd />
      </div>

      <CategoryManager />
    </AdminLayout>
  );
}
