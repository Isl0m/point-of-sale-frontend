import AdminLayout from "@/components/admin/admin-layout";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { fetcher } from "@/lib/axios";
import { ApiResponseSingle } from "@/types";

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
  salesByCategory: {
    category: string;
    percentage: string;
  }[];
  salesOverview: {
    month: string;
    revenue: string;
  }[];
};

export default async function DashboardPage() {
  const statistics = (await fetcher.get("statistics"))
    .data as ApiResponseSingle<Statistics>;
  return (
    <AdminLayout currentPage="dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <DashboardStats statistics={statistics} />
    </AdminLayout>
  );
}
