// EquipmentDataTable.tsx
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReusableDataTable } from "@/components/ReusableDataTable";
import type { Equipment } from "@/types/types";
import { DeleteEquipmentModal, EditEquipmentModal } from "./EquipmentModals";

interface EquipmentDataTableProps {
  data?: Equipment[];
}

export function EquipmentDataTable({ data = [] }: EquipmentDataTableProps) {
  const [editModal, setEditModal] = React.useState<{
    isOpen: boolean;
    equipment: Equipment | null;
  }>({ isOpen: false, equipment: null });

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    equipment: Equipment | null;
  }>({ isOpen: false, equipment: null });

  const handleEditEquipment = (equipment: Equipment) => {
    setEditModal({ isOpen: true, equipment });
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    setDeleteModal({ isOpen: true, equipment });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, equipment: null });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, equipment: null });
  };

  const columns: ColumnDef<Equipment>[] = [
    { accessorKey: " ", header: () => <p> </p> },
    {
      accessorKey: "equipment_type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const type = row.getValue("equipment_type") as string;
        const typeColors = {
          skis: "bg-blue-100 text-blue-800",
          snowboard: "bg-purple-100 text-purple-800",
          boots: "bg-green-100 text-green-800",
          helmet: "bg-yellow-100 text-yellow-800",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              typeColors[type as keyof typeof typeColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Brand
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("brand")}</div>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => <div>{row.getValue("model")}</div>,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => <div>{row.getValue("size")}</div>,
    },
    {
      accessorKey: "price_per_day",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price/Day
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price_per_day"));
        const formatted = new Intl.NumberFormat("sr-RS", {
          style: "currency",
          currency: "RSD",
        }).format(price);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "available_quantity",
      header: "Available",
      cell: ({ row }) => {
        const available = row.getValue("available_quantity") as number;
        const total = row.original.total_quantity;
        return (
          <div>
            {available}/{total}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const equipment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cursor-pointer">
              <DropdownMenuItem onClick={() => handleEditEquipment(equipment)}>
                Edit equipment
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteEquipment(equipment)}
              >
                Delete equipment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <ReusableDataTable
        data={data}
        columns={columns}
        filterColumn="brand"
        filterPlaceholder="Filter by brand..."
        emptyMessage="No equipment found."
      />

      <EditEquipmentModal
        isOpen={editModal.isOpen}
        equipment={editModal.equipment}
        onClose={handleCloseEditModal}
      />

      <DeleteEquipmentModal
        isOpen={deleteModal.isOpen}
        equipment={deleteModal.equipment}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
