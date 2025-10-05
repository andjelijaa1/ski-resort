import Spinner from "@/components/Spinner";
import { RoomDataTable } from "@/features/admin/RoomDataTable";
import { getAllRooms } from "@/service/apiAdmin";
import type { Room } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const Rooms = () => {
  const { data, isPending } = useQuery<{ rooms: Room[] }>({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });
  console.log("ROOMS----", data?.rooms);
  return isPending ? <Spinner /> : <RoomDataTable data={data?.rooms} />;
};

export default Rooms;
