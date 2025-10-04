import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/service/apiAuth";

type Role = "user" | "admin" | "instructor";

type CurrentUserResponse = {
  user: {
    user_id: string;
    user_name: string;
    user_email: string;
    role: Role;
    avatarUrl?: string;
  };
};

export function useUser() {
  const { data, isLoading, isError, refetch } = useQuery<CurrentUserResponse>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const isAuthenticated = !!data?.user && !isError;
  const role: Role | undefined = data?.user?.role;

  return {
    user: data,
    role,
    isLoading,
    isAuthenticated,
    isError,
    refetch,
  };
}
