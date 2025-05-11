import AdminLayout from "@/components/admin/admin-layout";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { fetcher } from "@/lib/axios";
import { Order } from "@/types";

export type Statistics = {
  revenue: {
    total_revenue: string;
    revenue_growth: string;
    indicator: "up" | "down" | "same";
  };
  orders: {
    total_orders: string;
    orders_growth: string;
    indicator: "up" | "down" | "same";
  };
  sales: {
    sales_today: string;
    sales_growth: string;
    indicator: "up" | "down" | "same";
  };
  topSelling: {
    name: string;
    sales: string;
  }[];
  salesOverview: {
    month: string;
    revenue: string;
  }[];
  salesByCategory: {
    category: string;
    percentage: string;
  }[];
  recentOrders: Order[];
};

async function getStatistics() {
  const urls = [
    "/api/dashboard/revenue",
    "/api/dashboard/total-orders",
    "/api/dashboard/sales-today",
    "/api/dashboard/top-products",
    "/api/dashboard/sales-overview",
    "/api/dashboard/sales-by-category",
    "/api/order/get-all",
  ];
  const data = await Promise.all(urls.map((u) => fetcher.get(u)));
  const [
    revenue,
    orders,
    sales,
    topSelling,
    salesOverview,
    salesByCategory,
    recentOrders,
  ] = data.map((i) => i.data.data);

  return {
    revenue,
    orders,
    sales,
    topSelling,
    salesOverview,
    salesByCategory,
    recentOrders: recentOrders.slice(0, 4),
  } as Statistics;
}

export default async function DashboardPage() {
  const statistics = await getStatistics();
  return (
    <AdminLayout title="Dashboard">
      <DashboardStats statistics={statistics} />
    </AdminLayout>
  );
}
