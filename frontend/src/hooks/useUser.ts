import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/service/apiAuth";

export function useUser() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data && !isError,
    isError,
  };
}
