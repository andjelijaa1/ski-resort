import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import Spinner from "./Spinner";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isAuthenticated) return <>{children}</>;
  return null;
}

export default ProtectedRoute;
