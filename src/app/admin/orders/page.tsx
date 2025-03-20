import AdminLayout from "@/components/admin/admin-layout";
import { OrderManager } from "@/components/admin/order-manager";

export default function OrdersPage() {
  return (
    <AdminLayout currentPage="orders">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <OrderManager />
    </AdminLayout>
  );
}
