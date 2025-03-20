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

export const categorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string(),
});

export function CategoryQuickAdd() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        name: value.name,
        description: value.description,
      });
    },
    validators: {
      onChange: categorySchema,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      await fetcher.post("/api/category", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(
        `Category "${form.getFieldValue("name")}" has been added successfully`,
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add category: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Category</CardTitle>
        <CardDescription>
          Quickly add a new category to your inventory
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
                  <Label htmlFor={field.name}>Category Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Electronics"
                  />
                </>
              )}
            />
          </div>
          <div className="md:col-span-1 space-y-2">
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
                    placeholder="Brief description of the category"
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
                  {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
              )}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
