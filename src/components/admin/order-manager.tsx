"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderTable } from "./order-table";
import { queryOpts } from "./queries";

export function OrderManager() {
  const ordersQuery = useQuery(queryOpts.orders);

  return ordersQuery.data && <OrderTable data={ordersQuery.data} />;
}
