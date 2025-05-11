import AdminLayout from "@/components/admin/admin-layout";
import { OrderManager } from "@/components/admin/order-manager";

export default function OrdersPage() {
  return (
    <AdminLayout title="Orders">
      <OrderManager />
    </AdminLayout>
  );
}
