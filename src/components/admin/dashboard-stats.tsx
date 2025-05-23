"use client";

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
import { useQuery } from "@tanstack/react-query";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
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
import { Skeleton } from "../ui/skeleton";
import { queryOpts } from "./queries";

const GrowthIndicator = (indicator: "up" | "down" | "same" = "same") => {
  if (indicator === "up") return <TrendingUp className="mr-1 h-4 w-4" />;
  if (indicator === "down") return <TrendingDown className="mr-1 h-4 w-4" />;
  if (indicator === "same") return <Minus className="mr-1 h-4 w-4" />;
};
// Get status badge color

export function DashboardStats() {
  const query = useQuery(queryOpts.statistics);

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

  if (!query.data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[25dvh] w-full">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60dvh] w-full">
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(query.data?.revenue.totalRevenue))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(query.data?.revenue.indicator)}
                {Number(query.data?.revenue.revenueGrowth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {query.data?.revenue.indicator} this month{" "}
              {GrowthIndicator(query.data?.revenue.indicator)}
            </div>
            <div className="text-muted-foreground">Compared to last month</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Sales Today</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(query.data?.sales.salesToday))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(query.data?.sales.indicator)}
                {Number(query.data?.sales.salesGrowth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {query.data?.sales.indicator} this month{" "}
              {GrowthIndicator(query.data?.sales.indicator)}
            </div>
            <div className="text-muted-foreground">Compared to yesterday</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${prettyNumbers(Number(query.data?.orders.totalOrders))}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {GrowthIndicator(query.data?.orders.indicator)}
                {Number(query.data?.orders.ordersGrowth)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending {query.data?.orders.indicator} this month{" "}
              {GrowthIndicator(query.data?.orders.indicator)}
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
                data={query.data?.salesOverview.map(({ month, revenue }) => ({
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
                data={query.data?.salesByCategory.map(
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
                  data={query.data?.topSelling.map(({ name, sales }) => ({
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
              {query.data?.recentOrders.map((order) => (
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
