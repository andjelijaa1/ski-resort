// RoomDataTable.tsx
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
import type { Room } from "@/types/types";
import { EditRoomModal, DeleteRoomModal } from "./RoomModals";
import { useNavigate } from "react-router-dom";

interface RoomDataTableProps {
  data?: Room[];
}

export function RoomDataTable({ data = [] }: RoomDataTableProps) {
  const navigate = useNavigate();
  const [editModal, setEditModal] = React.useState<{
    isOpen: boolean;
    room: Room | null;
  }>({ isOpen: false, room: null });

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    room: Room | null;
  }>({ isOpen: false, room: null });

  const handleEditRoom = (room: Room) => {
    setEditModal({ isOpen: true, room });
  };

  const handleDeleteRoom = (room: Room) => {
    setDeleteModal({ isOpen: true, room });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, room: null });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, room: null });
  };

  const columns: ColumnDef<Room>[] = [
    { accessorKey: " ", header: () => <p> </p> },
    {
      accessorKey: "room_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Room Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("room_number")}</div>
      ),
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Capacity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          {row.getValue("capacity")}{" "}
          {row.getValue("capacity") === 1 ? "person" : "people"}
        </div>
      ),
    },
    {
      accessorKey: "price_per_night",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price per Night
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price_per_night"));
        const formatted = new Intl.NumberFormat("sr-RS", {
          style: "currency",
          currency: "RSD",
        }).format(price);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.getValue("description")}</div>
      ),
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
        const room = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cursor-pointer">
              <DropdownMenuItem onClick={() => handleEditRoom(room)}>
                Edit room
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/rooms/${room.room_number}`)}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteRoom(room)}
              >
                Delete room
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
        filterColumn="room_number"
        filterPlaceholder="Filter by room number..."
        emptyMessage="No rooms found."
      />

      <EditRoomModal
        room={editModal.room}
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
      />

      <DeleteRoomModal
        room={deleteModal.room}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
