import AdminLayout from "@/components/admin/admin-layout";
import { ProductManager } from "@/components/admin/product-manager";
import { ProductQuickAdd } from "@/components/admin/product-quick-add";

export default function ProductsPage() {
  return (
    <AdminLayout currentPage="products">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <div className="mb-6">
        <ProductQuickAdd />
      </div>

      <ProductManager />
    </AdminLayout>
  );
}
