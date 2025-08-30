import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../service/apiAuth";

export function useUser() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false, //
  });

  console.log("useUser debug:", { data, isLoading, isError, error });

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data && !isError,
    isError,
  };
}
