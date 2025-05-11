"use client";

import { Statistics } from "@/app/dashboard/page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prettyNumbers } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
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
  if (indicator === "up") return <TrendingUp className="mr-1 h-4 w-4" />;
  if (indicator === "down") return <TrendingDown className="mr-1 h-4 w-4" />;
  if (indicator === "same") return <Minus className="mr-1 h-4 w-4" />;
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
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(statistics.revenue.total_revenue))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(statistics.revenue.indicator)}
                {Number(statistics.revenue.revenue_growth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {statistics.revenue.indicator} this month{" "}
              {GrowthIndicator(statistics.revenue.indicator)}
            </div>
            <div className="text-muted-foreground">Compared to last month</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Sales Today</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(statistics.sales.sales_today))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(statistics.sales.indicator)}
                {Number(statistics.sales.sales_growth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {statistics.sales.indicator} this month{" "}
              {GrowthIndicator(statistics.sales.indicator)}
            </div>
            <div className="text-muted-foreground">Compared to yesterday</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(statistics.orders.total_orders))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(statistics.orders.indicator)}
                {Number(statistics.orders.orders_growth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {statistics.orders.indicator} this month{" "}
              {GrowthIndicator(statistics.orders.indicator)}
            </div>
            <div className="text-muted-foreground">Compared to last month</div>
          </CardFooter>
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
                  color: "var(--chart-1)",
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
          <CardHeader>
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
                  color: "var(--chart-1)",
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
                  content={<ChartTooltipContent />}
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
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "var(--chart-1)",
                  },
                }}
              >
                <BarChart
                  accessibilityLayer
                  data={statistics.topSelling.map(({ name, sales }) => ({
                    name,
                    sales: Number(sales),
                  }))}
                  layout="vertical"
                >
                  <XAxis type="number" dataKey="sales" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={5} />
                </BarChart>
              </ChartContainer>
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
              {statistics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${prettyNumbers(order.total)}</p>
                    <Badge
                      className={getStatusColor(order.status)}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link
                href={"/admin/orders"}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mt-2",
                })}
              >
                View All Orders
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
