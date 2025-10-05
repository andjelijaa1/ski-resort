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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEquipment, deleteEquipment } from "@/service/apiAdmin";
import type { Equipment } from "@/types/types";

interface EditEquipmentModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditEquipmentModal({
  equipment,
  isOpen,
  onClose,
}: EditEquipmentModalProps) {
  const [formData, setFormData] = useState({
    equipment_type: "skis",
    size: "",
    brand: "",
    model: "",
    price_per_day: "",
    available_quantity: 0,
    total_quantity: 0,
    is_active: true,
  });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (equipment) {
      setFormData({
        equipment_type: equipment.equipment_type,
        size: equipment.size,
        brand: equipment.brand,
        model: equipment.model,
        price_per_day: equipment.price_per_day,
        available_quantity: equipment.available_quantity,
        total_quantity: equipment.total_quantity,
        is_active: equipment.is_active,
      });
    }
  }, [equipment]);

  const { mutate: updateEquipmentMutation, isPending } = useMutation({
    mutationFn: (data: { equipmentId: string; equipmentData: any }) =>
      updateEquipment(data.equipmentId, data.equipmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast.success("Equipment updated successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update equipment";
      toast.error("Update Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment) return;

    updateEquipmentMutation({
      equipmentId: equipment.equipment_id,
      equipmentData: formData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update the details for {equipment?.brand} {equipment?.model}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equipment_type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.equipment_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, equipment_type: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skis">Skis</SelectItem>
                  <SelectItem value="snowboard">Snowboard</SelectItem>
                  <SelectItem value="boots">Boots</SelectItem>
                  <SelectItem value="helmet">Helmet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Brand
              </Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model
              </Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size
              </Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price_per_day" className="text-right">
                Price/Day
              </Label>
              <Input
                id="price_per_day"
                name="price_per_day"
                type="number"
                step="0.01"
                value={formData.price_per_day}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available_quantity" className="text-right">
                Available
              </Label>
              <Input
                id="available_quantity"
                name="available_quantity"
                type="number"
                min="0"
                value={formData.available_quantity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_quantity" className="text-right">
                Total
              </Label>
              <Input
                id="total_quantity"
                name="total_quantity"
                type="number"
                min="0"
                value={formData.total_quantity}
                onChange={handleChange}
                className="col-span-3"
                required
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
              {isPending ? "Updating..." : "Update Equipment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteEquipmentModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteEquipmentModal({
  equipment,
  isOpen,
  onClose,
}: DeleteEquipmentModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteEquipmentMutation, isPending } = useMutation({
    mutationFn: (equipmentId: string) => deleteEquipment(equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast.success("Equipment deleted successfully");
      onClose();
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete equipment";
      toast.error("Delete Failed", {
        description: message,
        duration: 4000,
      });
    },
  });

  const handleDelete = async () => {
    if (!equipment) return;
    deleteEquipmentMutation(equipment.equipment_id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>
              {equipment?.brand} {equipment?.model}
            </strong>{" "}
            and remove all its data from the system.
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
