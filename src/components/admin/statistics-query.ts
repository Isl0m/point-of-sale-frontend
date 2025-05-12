import { fetcher } from "@/lib/axios";
import { Order } from "@/types";

export type Statistics = {
  revenue: {
    totalRevenue: string;
    revenueGrowth: string;
    indicator: "up" | "down" | "same";
  };
  orders: {
    totalOrders: string;
    ordersGrowth: string;
    indicator: "up" | "down" | "same";
  };
  sales: {
    salesToday: string;
    salesGrowth: string;
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

export async function getStatistics() {
  const urls = [
    "/api/dashboard/revenue",
    "/api/dashboard/total-orders",
    "/api/dashboard/sales-today",
    "/api/dashboard/top-products",
    "/api/dashboard/sales-overview",
    "/api/dashboard/sales-by-category",
    "/api/order/get-all",
  ];
  try {
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
  } catch (e) {
    return;
  }
}
