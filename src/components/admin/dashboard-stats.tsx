"use client";

import { Statistics } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CircleDollarSign,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Sample data for charts
const salesData = [
  { name: "Jan", total: 1800 },
  { name: "Feb", total: 2200 },
  { name: "Mar", total: 2800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 2900 },
  { name: "Jun", total: 3500 },
  { name: "Jul", total: 3200 },
  { name: "Aug", total: 3800 },
  { name: "Sep", total: 4200 },
  { name: "Oct", total: 4500 },
  { name: "Nov", total: 4800 },
  { name: "Dec", total: 5200 },
];

const categorySales = [
  { name: "Beverages", value: 35, color: "#4F46E5" },
  { name: "Bakery", value: 25, color: "#10B981" },
  { name: "Dairy", value: 15, color: "#F59E0B" },
  { name: "Produce", value: 15, color: "#EF4444" },
  { name: "Meat", value: 10, color: "#8B5CF6" },
];

const recentOrders = [
  {
    id: "ORD-006",
    customer: "David Lee",
    date: "2025-03-15",
    total: 42.99,
    status: "COMPLETED",
  },
  {
    id: "ORD-007",
    customer: "Sarah Johnson",
    date: "2025-03-15",
    total: 67.5,
    status: "PENDING",
  },
  {
    id: "ORD-008",
    customer: "Michael Brown",
    date: "2025-03-14",
    total: 24.75,
    status: "COMPLETED",
  },
  {
    id: "ORD-009",
    customer: "Emily Davis",
    date: "2025-03-14",
    total: 89.99,
    status: "PENDING",
  },
  {
    id: "ORD-010",
    customer: "James Wilson",
    date: "2025-03-13",
    total: 35.25,
    status: "CANCELLED",
  },
];

const GrowthIndicator = (indicator: "up" | "down" | "same") => {
  if (indicator === "up") return <ArrowUp className="mr-1 h-4 w-4" />;
  if (indicator === "down") return <ArrowDown className="mr-1 h-4 w-4" />;
  if (indicator === "same") return <Minus className="mr-1 h-4 w-4" />;
};

const indicatorColor = (indicator: "up" | "down" | "same") => {
  if (indicator === "up") return "text-green-600";
  if (indicator === "down") return "text-red-600";
  if (indicator === "same") return "text-grey-600";
};

export function DashboardStats({ statistics }: { statistics: Statistics }) {
  const [timeRange, setTimeRange] = useState("year");

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PENDING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">
                ${Number(statistics.revenue.total_revenue)}
              </h3>
              <div
                className={cn(
                  "flex items-center text-sm",
                  indicatorColor(statistics.revenue.indicator),
                )}
              >
                {GrowthIndicator(statistics.revenue.indicator)}
                <span>{Number(statistics.revenue.revenue_growth)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">
                Sales Today
              </p>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">
                ${Number(statistics.sales.sales_today)}
              </h3>
              <div
                className={cn(
                  "flex items-center text-sm",
                  indicatorColor(statistics.sales.indicator),
                )}
              >
                {GrowthIndicator(statistics.sales.indicator)}
                <span>{Number(statistics.sales.sales_growth)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">
                {Number(statistics.orders.total_orders)}
              </h3>
              <div
                className={cn(
                  "flex items-center text-sm",
                  indicatorColor(statistics.orders.indicator),
                )}
              >
                {GrowthIndicator(statistics.orders.indicator)}
                <span>{Number(statistics.orders.orders_growth)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              View your sales performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <LineChart
                accessibilityLayer
                data={statistics.salesOverview.map(({ month, revenue }) => ({
                  month,
                  revenue: Number(revenue),
                }))}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="revenue"
                  type="natural"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-revenue)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                percentage: {
                  label: "Percentage",
                  color: "hsl(var(--chart-2))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                data={statistics.salesByCategory.map(
                  ({ category, percentage }) => ({
                    category,
                    percentage: Number(percentage),
                  }),
                )}
                layout="vertical"
              >
                <XAxis type="number" dataKey="percentage" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent className="rounded" />}
                />
                <Bar
                  dataKey="percentage"
                  fill="var(--color-percentage)"
                  radius={5}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Products with the highest sales volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {statistics.topSelling.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.sales} units
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(Number(product.sales) / 120) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <Badge
                      className={getStatusColor(order.status)}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
