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
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { queryClient } from "../query-provider";

export const warehouseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  location: z.string().min(3, "Name must be at least 3 characters long"),
});

export function WarehouseQuickAdd() {
  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
    validators: {
      onChange: warehouseSchema,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; location: string }) => {
      await fetcher.post("/api/wareHouse", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      toast.success(
        `Warehouse "${form.getFieldValue("name")}" has been added successfully`,
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add warehouse: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Warehouse</CardTitle>
        <CardDescription>
          Quickly add a new warehouse to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="md:col-span-1 space-y-2">
            <form.Field
              name="name"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Warehouse Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Warehouse"
                  />
                </>
              )}
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <form.Field
              name="location"
              children={(field) => (
                <>
                  <Label htmlFor={field.name}>Location</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Location of the warehouse"
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
                  {isSubmitting ? "Adding..." : "Add Warehouse"}
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
