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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/axios";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { queryClient } from "../query-provider";
import { queryOpts } from "./queries";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  category: z.string(),
  price: z
    .string()
    .min(1, "Price is required")
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, "Price must be a positive number"),
  description: z.string(),
  serial: z.string(),
});

export function ProductQuickAdd() {
  const form = useForm({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      description: "",
      serial: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        name: value.name,
        description: value.description,
        categoryId: Number(value.category),
        price: Number(value.price),
        serial: value.serial,
      });
    },
    validators: {
      onChange: productSchema,
    },
  });

  const categoriesQuery = useQuery(queryOpts.categories);

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      categoryId: number;
      price: number;
      description: string;
      serial: string;
    }) => {
      await fetcher.post(`/api/product`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        `Product "${form.getFieldValue("name")}" has been added successfully`,
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Product</CardTitle>
        <CardDescription>
          Quickly add a new product to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid gap-4 grid-cols-1 md:grid-cols-3"
        >
          <div className="space-y-2">
            <form.Field
              name="name"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Product Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Coffee"
                  />
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="category"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Category</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesQuery.data?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
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
              name="price"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Price ($)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    step="1"
                    min="1"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="0.00"
                  />
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="serial"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Serial Number</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Serial Number"
                  />
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Description</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Brief description of the product"
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
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
