"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/lib/axios";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { queryClient } from "../query-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { queryOpts } from "./queries";

export const inventorySchema = z.object({
  productId: z.number(),
  warehouseId: z.number(),
  quantity: z
    .number()
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val > 0),
});

export const inventoryFormSchema = z.object({
  product: z.string(),
  warehouse: z.string(),
  quantity: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && Number.isInteger(val) && val > 0),
});

export function InventoryQuickAdd() {
  const product = useQuery(queryOpts.products);
  const warehouse = useQuery(queryOpts.warehouse);

  const form = useForm({
    defaultValues: {
      product: "",
      warehouse: "",
      quantity: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        productId: Number(value.product),
        warehouseId: Number(value.warehouse),
        quantity: Number(value.quantity),
      });
    },
    validators: {
      onChange: inventoryFormSchema,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      productId: number;
      warehouseId: number;
      quantity: number;
    }) => {
      await fetcher.post("/api/productInventory", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`Inventory has been added successfully`);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add inventory: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Inventory</CardTitle>
        <CardDescription>
          Quickly add a new inventory to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <form.Field
              name="product"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Product</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.data?.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="warehouse"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Warehouse</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouse.data?.map((w) => (
                        <SelectItem key={w.id} value={w.id.toString()}>
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="quantity"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Quantity</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type="number"
                    placeholder="Enter quantity"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
          </div>
          <div className="flex items-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button disabled={!canSubmit} className="w-full" type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Adding..." : "Add Inventory"}
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
