import AdminLayout from "@/components/admin/admin-layout";
import { ProductManager } from "@/components/admin/product-manager";
import { ProductQuickAdd } from "@/components/admin/product-quick-add";

export default function ProductsPage() {
  return (
    <AdminLayout title="Products">
      <div className="mb-6">
        <ProductQuickAdd />
      </div>

      <ProductManager />
    </AdminLayout>
  );
}
