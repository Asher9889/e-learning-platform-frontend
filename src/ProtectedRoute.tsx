import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { AUTH_STATUS } from "@/constants/auth/auth.constant";

export default function ProtectedRoute() {
  const status = useAppSelector((state) => state.auth.status);

  if (status === AUTH_STATUS.CHECKING) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}