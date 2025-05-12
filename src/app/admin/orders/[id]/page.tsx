import { signOut } from "@/auth";
import AdminLayout from "@/components/admin/admin-layout";
import { OrderDetails } from "@/components/admin/order-details";
import { serverFetcher } from "@/lib/axios.server";
import { ApiResponse, ApiResponseSingle, Order, Product, User } from "@/types";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function fetchOrderDetails(orderId: string) {
  try {
    const order = (await serverFetcher.get(`/api/order/${orderId}`))
      .data as ApiResponseSingle<Order>;
    const user = (
      await serverFetcher.get(`/api/user/by-id/${order.data.userId}`)
    ).data as ApiResponseSingle<User>;
    const products = (await serverFetcher.get(`/api/product/get-all`))
      .data as ApiResponse<Product>;

    return { order, user, products };
  } catch (e) {
    return signOut();
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id: orderId } = await params;
  const { order, user, products } = await fetchOrderDetails(orderId);

  return (
    <AdminLayout title={`Order #${orderId}`}>
      <OrderDetails
        order={order.data}
        user={user.data}
        products={products.data}
      />
    </AdminLayout>
  );
}
