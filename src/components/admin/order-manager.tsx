"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OrderTable } from "./order-table";
import { queryOpts } from "./queries";

export function OrderManager() {
  const ordersQuery = useQuery(queryOpts.orders);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = ordersQuery.data?.filter((order) =>
    order.id.toString().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: OrderStatus) => {
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
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders by ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/admin/orders/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Order
          </Link>
        </Button>
      </div>

      {ordersQuery.data && <OrderTable data={ordersQuery.data} />}
    </>
  );
}
