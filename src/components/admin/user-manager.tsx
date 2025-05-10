"use client";

import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/axios";
import { User, UserRole } from "@/types";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { queryClient } from "../query-provider";
import { queryOpts } from "./queries";

const userSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(50, "Username must be between 2 and 50 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

const updateUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters long")
    .max(50, "Username must be between 2 and 50 characters long"),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

export function UserManager() {
  const usersQuery = useQuery(queryOpts.users);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const form = useForm({
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      role: "STAFF",
    },
    onSubmit: ({ value }) => {
      mutation.mutate({
        ...value,
        role: value.role as UserRole,
      });
    },
    validators: {
      onChange: userSchema,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: Omit<User, "id">) => {
      await fetcher.post("/api/user/register", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `User "${form.getFieldValue("username")}" has been added successfully`,
      );
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add user: ${error.message}`);
    },
  });

  // Filter users based on search term
  const filteredUsers = usersQuery.data?.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "STAFF":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Handle editing a user
  const handleEditUser = async () => {
    if (!currentUser) return;
    const result = updateUserSchema.safeParse(currentUser);
    if (!result.success) {
      toast.error("Invalid user data");
      return;
    }

    await fetcher.put(`/api/user/${currentUser.id}`, currentUser);

    setIsEditDialogOpen(false);

    toast.success(
      `User "${currentUser.username}" has been updated successfully`,
    );
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    await fetcher.delete(`/api/user/${currentUser.id}`);
    setIsDeleteDialogOpen(false);

    toast.success(
      `User "${currentUser.username}" has been deleted successfully`,
    );
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, username or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage system users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge
                      className={getRoleBadgeColor(user.role)}
                      variant="outline"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentUser(user);
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
                          setCurrentUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with appropriate role.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="grid gap-4 py-4"
          >
            <div className="space-y-2">
              <form.Field
                name="fullName"
                children={(field) => (
                  <>
                    <Label htmlFor={field.name}>Full Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
                    />
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <form.Field
                name="username"
                children={(field) => (
                  <>
                    <Label htmlFor={field.name}>Username</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="john.doe"
                    />
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <form.Field
                name="password"
                children={(field) => (
                  <>
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="********"
                    />
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <form.Field
                name="role"
                children={(field) => (
                  <>
                    <Label htmlFor={field.name}>Role</Label>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value: UserRole) =>
                        field.handleChange(value)
                      }
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="MANAGER">MANAGER</SelectItem>
                        <SelectItem value="STAFF">STAFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button disabled={!canSubmit} type="submit">
                    Add User
                  </Button>
                )}
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user details and role.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  value={currentUser.fullName}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={currentUser.username}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: UserRole) =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                    <SelectItem value="STAFF">STAFF</SelectItem>
                  </SelectContent>
                </Select>
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
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <p className="py-4">
              You are about to delete <strong>{currentUser.fullName}</strong> (
              {currentUser.username}) with role{" "}
              <strong>{currentUser.role}</strong>.
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
