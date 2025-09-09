import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "@/service/apiAuth";
import { setAccessToken } from "@/service/api";
import { toast } from "sonner";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/login");
      toast.success("Successfully logged out");
    },
    onError: (err: any) => {
      setAccessToken(null);
      queryClient.clear();
      navigate("/login");
      console.error("Logout error:", err);
    },
  });
}
