import AdminLayout from "@/components/admin/admin-layout";
import { OrderDetails } from "@/components/admin/order-details";
import { fetcher } from "@/lib/axios";
import { ApiResponse, ApiResponseSingle, Order, Product, User } from "@/types";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id: orderId } = await params;
  const order = (await fetcher.get(`/api/order/${orderId}`))
    .data as ApiResponseSingle<Order>;
  const user = (await fetcher.get(`/api/user/by-id/${order.data.userId}`))
    .data as ApiResponseSingle<User>;
  const products = (await fetcher.get(`/api/product/get-all`))
    .data as ApiResponse<Product>;

  return (
    <AdminLayout currentPage="orders">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{orderId}</h1>
      </div>

      <OrderDetails
        order={order.data}
        user={user.data}
        products={products.data}
      />
    </AdminLayout>
  );
}
