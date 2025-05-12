"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { queryClient } from "../query-provider";
import { inventorySchema } from "./inventory-quick-add";
import { queryOpts } from "./queries";

export function InventoryManager() {
  const inventory = useQuery(queryOpts.inventory);
  const product = useQuery(queryOpts.products);
  const warehouse = useQuery(queryOpts.warehouse);

  const isNoInventory = !inventory.data || inventory.data?.length === 0;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInventory, setCurrentInventory] = useState<any>(null);

  const handleEditInventory = async () => {
    currentInventory.quantity = Number(currentInventory.quantity);
    const result = inventorySchema.safeParse(currentInventory);
    if (!result.success) {
      toast.error("Invalid inventory data");
      return;
    }
    await fetcher.put(
      `/api/productInventory/${currentInventory.id}`,
      result.data,
    );
    setIsEditDialogOpen(false);
    toast.success(`Inventory has been updated successfully`);
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const handleDeleteInventory = async () => {
    await fetcher.delete(`/api/productInventory/${currentInventory.id}`);
    setIsDeleteDialogOpen(false);

    toast.success(`Inventory has been deleted successfully`);
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>Manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isNoInventory ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No inventory found.
                  </TableCell>
                </TableRow>
              ) : (
                inventory.data?.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell>
                      {
                        product.data?.find((p) => p.id === inventory.productId)
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      {
                        warehouse.data?.find(
                          (w) => w.id === inventory.warehouseId,
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{inventory.quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentInventory(inventory);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentInventory(inventory);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Inventory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Quantity</DialogTitle>
            <DialogDescription>Ajust inventory quantity</DialogDescription>
          </DialogHeader>
          {currentInventory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  value={currentInventory.quantity}
                  type="number"
                  onChange={(e) =>
                    setCurrentInventory({
                      ...currentInventory,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditInventory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Inventory Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Inventory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {currentInventory && (
            <p className="py-4">
              You are about to delete <strong>{currentInventory.name}</strong>{" "}
              which contains {currentInventory.products} products.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInventory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
