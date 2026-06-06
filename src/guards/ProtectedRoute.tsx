import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { PATHS } from "@/routes";

export default function ProtectedRoute() {
  const userAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!userAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <Outlet />;
}