// RoomDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "@/service/apiAdmin";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditRoomModal, DeleteRoomModal } from "@/features/admin/RoomModals";
import type { Room } from "@/types/types";

const RoomDetails = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { data: room, isPending } = useQuery<Room>({
    queryKey: ["room", number],
    queryFn: () => getRoomById(number!),
    enabled: !!number,
  });

  if (isPending) return <Spinner />;

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Room not found</h2>
        <Button onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
      </div>
    );
  }

  const price = parseFloat(room.price_per_night);
  const formattedPrice = new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
  }).format(price);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditModal(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Room
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModal(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Room
          </Button>
        </div>
      </div>

      <div className="bg-accent rounded-lg shadow-md overflow-hidden">
        {room.room_image_url && (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={room.room_image_url}
              alt={`Room ${room.room_number}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Room {room.room_number}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                room.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {room.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
                <p className="text-lg font-semibold">
                  {room.capacity} {room.capacity === 1 ? "person" : "people"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Price per Night
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {formattedPrice}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Room ID</h3>
                <p className="text-sm font-mono text-gray-600">
                  {room.room_id}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {room.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditRoomModal
        room={room}
        isOpen={editModal}
        onClose={() => setEditModal(false)}
      />

      <DeleteRoomModal
        room={room}
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
      />
    </div>
  );
};

export default RoomDetails;
