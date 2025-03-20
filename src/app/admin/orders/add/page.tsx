import { AddOrderForm } from "@/components/admin/add-order-form";
import AdminLayout from "@/components/admin/admin-layout";

export default function AddOrderPage() {
  return (
    <AdminLayout currentPage="orders">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Order</h1>
      </div>

      <AddOrderForm />
    </AdminLayout>
  );
}
