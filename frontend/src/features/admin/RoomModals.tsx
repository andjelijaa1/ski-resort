// RoomModals.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom, deleteRoom } from "@/service/apiAdmin";
import type { Room } from "@/types/types";

interface EditRoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditRoomModal({ room, isOpen, onClose }: EditRoomModalProps) {
  const [formData, setFormData] = useState({
    room_number: "",
    capacity: 1,
    price_per_night: "",
    description: "",
    is_active: true,
  });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number,
        capacity: room.capacity,
        price_per_night: room.price_per_night,
        description: room.description,
        is_active: room.is_active,
      });
    }
  }, [room]);

  const { mutate: updateRoomMutation, isPending } = useMutation({
    mutationFn: (data: { roomId: string; roomData: any }) =>
      updateRoom(data.roomId, data.roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room updated successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update room";
      toast.error("Update Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;

    updateRoomMutation({
      roomId: room.room_id,
      roomData: formData,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Update the details for room <strong>{room?.room_number}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room_number" className="text-right">
                Room Number
              </Label>
              <Input
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price_per_night" className="text-right">
                Price/Night
              </Label>
              <Input
                id="price_per_night"
                name="price_per_night"
                type="number"
                step="0.01"
                value={formData.price_per_night}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteRoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteRoomModal({
  room,
  isOpen,
  onClose,
}: DeleteRoomModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteRoomMutation, isPending } = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to delete room";
      toast.error("Delete Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleDelete = async () => {
    if (!room) return;
    deleteRoomMutation(room.room_id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete room{" "}
            <strong>{room?.room_number}</strong> and remove all its data from
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
