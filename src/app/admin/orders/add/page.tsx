import { AddOrderForm } from "@/components/admin/add-order-form";
import AdminLayout from "@/components/admin/admin-layout";

export default function AddOrderPage() {
  return (
    <AdminLayout title="Add Order">
      <AddOrderForm />
    </AdminLayout>
  );
}
