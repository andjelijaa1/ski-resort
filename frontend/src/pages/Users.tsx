import Spinner from "@/components/Spinner";
import { UserDataTable } from "@/features/admin/UserDataTable";
import { getAllUsers } from "@/service/apiAdmin";
import type { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const Users = () => {
  const { data, isPending } = useQuery<{ users: User[] }>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  return isPending ? <Spinner /> : <UserDataTable data={data?.users} />;
};

export default Users;
