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
import { queryOpts } from "./queries";
import { warehouseSchema } from "./warehouse-quick-add";

export function WarehouseManager() {
  const query = useQuery(queryOpts.warehouse);
  const isNoWarehouse = !query.data || query.data?.length === 0;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<any>(null);

  const handleEditWarehouse = async () => {
    const result = warehouseSchema.safeParse(currentWarehouse);
    if (!result.success) {
      toast.error("Invalid warehouse data");
      return;
    }
    await fetcher.put(
      `/api/wareHouse/${currentWarehouse.id}`,
      currentWarehouse,
    );
    setIsEditDialogOpen(false);
    toast.success(
      `Warehouse "${currentWarehouse.name}" has been updated successfully`,
    );
    queryClient.invalidateQueries({ queryKey: ["warehouse"] });
  };

  const handleDeleteWarehouse = async () => {
    await fetcher.delete(`/api/wareHouse/${currentWarehouse.id}`);
    setIsDeleteDialogOpen(false);

    toast.success(
      `Warehouse "${currentWarehouse.name}" has been deleted successfully`,
    );
    queryClient.invalidateQueries({ queryKey: ["warehouse"] });
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Warehouse List</CardTitle>
          <CardDescription>Manage your warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isNoWarehouse ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No categories found. Add your first warehouse above.
                  </TableCell>
                </TableRow>
              ) : (
                query.data?.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">
                      {warehouse.name}
                    </TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentWarehouse(warehouse);
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
                            setCurrentWarehouse(warehouse);
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

      {/* Edit Warehouse Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Warehouse</DialogTitle>
            <DialogDescription>Make changes to the warehouse</DialogDescription>
          </DialogHeader>
          {currentWarehouse && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Warehouse Name</Label>
                <Input
                  id="edit-name"
                  value={currentWarehouse.name}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={currentWarehouse.location}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      location: e.target.value,
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
            <Button onClick={handleEditWarehouse}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Warehouse Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Warehouse</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this warehouse? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {currentWarehouse && (
            <p className="py-4">
              You are about to delete <strong>{currentWarehouse.name}</strong>{" "}
              which contains {currentWarehouse.products} products.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWarehouse}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
