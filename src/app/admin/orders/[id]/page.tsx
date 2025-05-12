import AdminLayout from "@/components/admin/admin-layout";
import { OrderDetails } from "@/components/admin/order-details";
import { serverFetcher } from "@/lib/axios.server";
import { ApiResponse, ApiResponseSingle, Order, Product, User } from "@/types";
import { redirect } from "next/navigation";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id: orderId } = await params;
  try {
    const order = (await serverFetcher.get(`/api/order/${orderId}`))
      .data as ApiResponseSingle<Order>;
    const user = (
      await serverFetcher.get(`/api/user/by-id/${order.data.userId}`)
    ).data as ApiResponseSingle<User>;
    const products = (await serverFetcher.get(`/api/product/get-all`))
      .data as ApiResponse<Product>;

    return (
      <AdminLayout title={`Order #${orderId}`}>
        <OrderDetails
          order={order.data}
          user={user.data}
          products={products.data}
        />
      </AdminLayout>
    );
  } catch (e) {
    return redirect("/access-denied");
  }
}
