export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T[];
};

export type ApiResponseSingle<T> = {
  status: string;
  message: string;
  data: T;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  products: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type Warehouse = {
  id: number;
  name: string;
  location: string;
};

export type ProductInventory = {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
};

export type Product = {
  id: number;
  name: string;
  serial: string;
  categoryId: number;
  price: number;
  description: string;
};

interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  quantity: number;
  price: number;
  createdAt: string;
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export type Order = {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  orderItemDtoList: OrderItem[];
};

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";

export type User = {
  id: number;
  fullName: string;
  username: string;
  role: UserRole;
};
