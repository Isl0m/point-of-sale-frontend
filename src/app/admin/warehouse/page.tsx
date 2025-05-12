import AdminLayout from "@/components/admin/admin-layout";
import { WarehouseManager } from "@/components/admin/warehouse-manager";
import { WarehouseQuickAdd } from "@/components/admin/warehouse-quick-add";

export default function WarehousePage() {
  return (
    <AdminLayout title="Warehouse">
      <div className="mb-6">
        <WarehouseQuickAdd />
      </div>
      <WarehouseManager />
    </AdminLayout>
  );
}
