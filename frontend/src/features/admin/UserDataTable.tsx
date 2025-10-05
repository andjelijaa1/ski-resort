// UserDataTable.tsx
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
import { EditUserModal, DeleteUserModal } from "./UsersModals";
import type { User } from "@/types/types";

interface UserDataTableProps {
  data?: User[];
}

export function UserDataTable({ data = [] }: UserDataTableProps) {
  const [editModal, setEditModal] = React.useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  const handleEditUser = (user: User) => {
    setEditModal({ isOpen: true, user });
  };

  const handleDeleteUser = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, user: null });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: " ", header: () => <p> </p> },
    {
      accessorKey: "user_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("user_name")}</div>,
    },
    {
      accessorKey: "user_email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("user_email")}</div>
      ),
    },
    {
      accessorKey: "user_role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("user_role") as string;
        const roleColors = {
          admin: "bg-red-100 text-red-800",
          instructor: "bg-blue-100 text-blue-800",
          user: "bg-green-100 text-green-800",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              roleColors[role as keyof typeof roleColors]
            }`}
          >
            {role}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="cursor-pointer">
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                Change role
              </DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => handleDeleteUser(user)}
              >
                Delete user
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
        filterColumn="user_email"
        filterPlaceholder="Filter emails..."
        emptyMessage="No users found."
      />

      <EditUserModal
        user={editModal.user}
        isOpen={editModal.isOpen}
        onClose={handleCloseEditModal}
      />

      <DeleteUserModal
        user={deleteModal.user}
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
      />
    </>
  );
}
