"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/axios";
import { Order, OrderStatus, Product, User } from "@/types";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type OrderDetailsProps = {
  order: Order;
  user: User;
  products: Product[];
};

export function OrderDetails({ order, user, products }: OrderDetailsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get status badge color
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "STAFF":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get product name by ID
  const getProductName = (productId: number | null) => {
    if (productId === null) return "Unknown Product";
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order || order.status === newStatus) return;

    setIsUpdating(true);
    try {
      await fetcher.put(`/api/order/${order.id}`, {
        status: newStatus,
      });
      toast.success(`Order status has been updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update order status`);
    }
    setIsUpdating(false);
  };

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">Status:</span>
            <Select
              value={order.status}
              onValueChange={(value: OrderStatus) => handleStatusUpdate(value)}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>Order {order.id}</CardTitle>
              <CardDescription>
                {formatDate(order.createdAt)} ·
                <Badge
                  className={`ml-2 ${getStatusBadge(order.status)}`}
                  variant="outline"
                >
                  {order.status}
                </Badge>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">
                ${order.total.toFixed(2)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="bg-muted/30 p-3 rounded-md flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{user.fullName}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>@{user.username}</span>
                <Badge
                  className={getRoleBadgeColor(user.role)}
                  variant="outline"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItemDtoList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {getProductName(item.productId)}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${item.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
