"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/axios";
import { ApiResponse, Product, User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { queryOpts } from "./queries";

type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type Order = {
  userId: number;
  status: string;
  items: { productId: number; quantity: number }[];
};

export function AddOrderForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const productsQuery = useQuery(queryOpts.products);

  // Order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Product search
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // Filter products based on search term
  const filteredProducts = productsQuery.data?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate order total
  const total = orderItems.reduce((sum, item) => sum + item.total, 0);

  const mutation = useMutation({
    mutationFn: async ({ items, ...data }: Order) => {
      const order = (await fetcher.post("/api/order", data)).data;
      const orderItems = await fetcher.post(
        `/api/orderItems`,
        items.map((i) => ({ ...i, orderId: order.data.id })),
      );
      return { order, orderItems };
    },
    onSuccess: () => {
      toast.success(`Order has been added successfully`);
      router.push("/admin/orders");
    },
    onError: (error) => {
      toast.error(`Failed to add order: ${error.message}`);
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  // Add product to order
  const addProductToOrder = (product: Product) => {
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === product.id,
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total =
        updatedItems[existingItemIndex].quantity *
        updatedItems[existingItemIndex].price;
      setOrderItems(updatedItems);
    } else {
      // Add new product to order
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price,
        },
      ]);
    }

    setShowProductSearch(false);
    setSearchTerm("");
  };

  // Update item quantity
  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = [...orderItems];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].total = newQuantity * updatedItems[index].price;
    setOrderItems(updatedItems);
  };

  // Remove item from order
  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = session?.user?.username;

    const users = (await fetcher.get(`/api/user/by-username/${username}`))
      .data as ApiResponse<User>;
    const [user] = users.data;
    if (!user) {
      toast.error("User not found");
      return;
    }

    // Validate form
    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }

    setIsProcessing(true);
    mutation.mutate({
      userId: user.id,
      status: "PENDING",
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Add products to this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Product Search */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product to Order
                </Button>
              </div>

              {showProductSearch && (
                <Card>
                  <CardHeader className="py-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products by name, category or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        autoFocus
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts?.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addProductToOrder(product)}
                              >
                                Add
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredProducts?.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-4 text-muted-foreground"
                            >
                              No products found matching your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Order Items Table */}
              {orderItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateItemQuantity(index, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateItemQuantity(index, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${item.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No products added to this order yet.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Add Product to Order" to start.
                  </p>
                </div>
              )}

              {/* Order Total */}
              {orderItems.length > 0 && (
                <div className="flex justify-end pt-4">
                  <div className="bg-muted/30 px-4 py-2 rounded-md">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/orders")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || orderItems.length === 0}
            >
              {isProcessing ? "Processing..." : "Create Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
