import Spinner from "@/components/Spinner";
import { DataTableDemo } from "@/features/admin/UserDataTable";
import { getAllUsers } from "@/service/apiUsers";
import type { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const Users = () => {
  const { data, isPending } = useQuery<{ users: User[] }>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
  console.log("Users data from query:", data);
  return isPending ? <Spinner /> : <DataTableDemo data={data?.users} />;
};

export default Users;
