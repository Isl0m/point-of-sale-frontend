import AdminLayout from "@/components/admin/admin-layout";
import { InventoryManager } from "@/components/admin/inventory-manager";
import { InventoryQuickAdd } from "@/components/admin/inventory-quick-add";

export default function WarehousePage() {
  return (
    <AdminLayout title="Warehouse">
      <div className="mb-6">
        <InventoryQuickAdd />
      </div>
      <InventoryManager />
    </AdminLayout>
  );
}
