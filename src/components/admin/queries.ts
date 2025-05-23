import { fetcher } from "@/lib/axios";
import {
  ApiResponse,
  Category,
  Order,
  Product,
  ProductInventory,
  User,
  Warehouse,
} from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { getStatistics } from "./statistics-query";

export const queryOpts = {
  users: queryOptions({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetcher.get("/api/user/get-all");
      const data = response.data as ApiResponse<User>;
      return data.data;
    },
  }),
  categories: queryOptions({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetcher.get("/api/category/get-all");
      const data = response.data as ApiResponse<Category>;
      return data.data;
    },
  }),
  warehouse: queryOptions({
    queryKey: ["warehouse"],
    queryFn: async () => {
      const response = await fetcher.get("/api/wareHouse/get-all");
      const data = response.data as ApiResponse<Warehouse>;
      return data.data;
    },
  }),
  inventory: queryOptions({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetcher.get("/api/productInventory/get-all");
      const data = response.data as ApiResponse<ProductInventory>;
      return data.data;
    },
  }),
  products: queryOptions({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetcher.get("/api/product/get-all");
      const data = response.data as ApiResponse<Product>;
      return data.data;
    },
  }),
  orders: queryOptions({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetcher.get("/api/order/get-all");
      const data = response.data as ApiResponse<Order>;
      return data.data;
    },
  }),
  statistics: queryOptions({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  }),
};
