import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, deleteUser } from "@/service/apiUsers";
import type { User } from "@/types/types";

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserModal({ user, isOpen, onClose }: EditUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<
    "user" | "instructor" | "admin"
  >("user");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (user) {
      setSelectedRole(
        (user.user_role as "user" | "instructor" | "admin") || "user"
      );
    }
  }, [user]);

  const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: (data: { userId: string; role: string }) =>
      updateUser(data.userId, {
        user_role: data.role as "user" | "instructor" | "admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update user role";
      toast.error("Update Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUserMutation({
      userId: user.user_id,
      role: selectedRole,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Change the role for user: <strong>{user?.user_name}</strong> (
            {user?.user_email})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value: "user" | "instructor" | "admin") =>
                  setSelectedRole(value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
}: DeleteUserModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation, isPending } = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete user";
      toast.error("Delete Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleDelete = async () => {
    if (!user) return;
    deleteUserMutation(user.user_id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user{" "}
            <strong>{user?.user_name}</strong> and remove all their data from
            the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
